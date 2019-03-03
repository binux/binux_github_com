---
title: Zerotier Nat 网关出口 和 iptables 调试
date: 2019-03-01 22:48:44
tags: [zerotier, nat gateway, full tunnel mode, iptables]
---

每当看到各类教程中的 iptables 指令，在格式参数组合之下可以实现从防火墙，封禁 IP 端口到 NAT 的各种操作，就如同魔法一般，看不明白，却又感到无比强大。想学，但又好像不得要领，稍微不慎可能就再也连不上了。最近配置 Zerotier 的 Nat 网关的时候，看着 [教程](https://zerotier.atlassian.net/wiki/spaces/SD/pages/7110693/Overriding+Default+Route+Full+Tunnel+Mode) 中的各种指令，抄过之后完全不通，花了3个晚上之后，逼着搞清楚了怎么 debug ( 打 log ) 后，终于配置成功 (虽然最终失败的原因和 iptables 无关)。

## Zerotier

首先介绍下 [Zerotier](https://www.zerotier.com/) 和为什么要配置 Nat 网关。

[Zerotier](https://www.zerotier.com/) 是一个虚拟局域网软件，可以很简单地将无限量（社区服务器版100台）设备放入同一个虚拟局域网中。这样就能在任何网络环境中，访问家中的 NAS 或其他设备。反过来，如果将一台服务器加入这个局域网中，将它配置为一个 [NAT](https://en.wikipedia.org/wiki/Network_address_translation) 网关，只要你加入这个虚拟局域网，就可以通过它连接世界。

选择 Zerotier 的原因是，它足够简单，只要一个 16 位的 network ID 就能实现组网了，相比我之前用过的 [tinc](https://www.tinc-vpn.org/)，不需要节点 IP，不需要挨个配置节点，并且支持的操作系统广泛。

当然，第一步是[安装 Zerotier](http://www.zerotier.com/download.shtml)，然后[注册一个帐号](https://my.zerotier.com/)，[创建一个私人网络](https://my.zerotier.com/network)。复制 network ID 在本地加入，然后回到网站中通过许可 (`Auth?`) 就好了。

当你将本地计算机和一台服务器加入网络后，然后就是根据 [这个教程](https://zerotier.atlassian.net/wiki/spaces/SD/pages/7110693/Overriding+Default+Route+Full+Tunnel+Mode) 。运行下面4个命令就行了：

```
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -o eth0 -s 10.6.4.0/22 -j SNAT --to-source 45.32.69.220
sudo iptables -A FORWARD -i zt+ -s 10.6.4.0/22 -d 0.0.0.0/0 -j ACCEPT
sudo iptables -A FORWARD -i eth0 -s 0.0.0.0/0 -d 10.6.4.0/0 -j ACCEPT
```

当然了，很明显，这里的 `eth0`, `10.6.4.0/22`, `45.32.69.220` 是需要根据实际环境替换的，`zt+` 是指的任何以 `zt` 开头的网络，zerotier 都是以这样的名字创建的，所以不用修改。这都可以通过 `ip addr` 或者 `ifconfig` 进行确认。比如在我的环境中，环境是这样的：

* 网关外网 IP：123.45.67.89
* zertier 网络: 192.168.11.0/24
* 网关 zerotier 网络 IP: 192.168.11.1
* 本机 IP：192.168.11.20

命令是这样的：

```
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -o venet0 -s 192.168.111.0/24 -j SNAT --to-source 123.45.67.89
sudo iptables -A FORWARD -i zt+ -s 192.168.111.0/24 -d 0.0.0.0/0 -j ACCEPT
sudo iptables -A FORWARD -i venet0 -s 0.0.0.0/0 -d 192.168.111.0/24 -j ACCEPT
```

当我设置完了这些，然后把这个服务器设置为默认 0.0.0.0/0 的网关之后，我断网了  
<del>如果这样有用的话，我岂不是就没机会学习 iptables 了。</del>  


## iptables

首先当然是把默认路由改回来。然后，如果只是为了调试，是不需要设置默认路由的，或者说最好不要设置默认路由到这台机器上的，你可以通过

```
# macos
sudo route add -net 98.76.54.32 192.168.111.1
# linux
# sudo route add -net 98.76.64.32 gw 192.168.111.1
```

设置一条单独的路由，到另一台主机上，然后就可以单独监控调试这条链路的情况了。

### LOG 和 TRACE

好了，既然现在网络不通，我最想知道的当然是哪断了。

#### 本机 -> 网关

```
iptables -t raw -A PREROUTING -p TCP -s 192.168.111.20 -j LOG
```

这里就给所有从 本机 发往 网关 的 TCP 数据包打了 LOG，然后 `tail -f /var/log/messages` （或者 `tail -f /var/log/kern.log`) 追踪日志。  
现在你可以从本地往测试服务器发个请求： `curl 98.76.54.32`，如果在日志中看到

```
Mar  2 15:53:14 myserver kernel: [5377966.960574] IN=zthnhi321 OUT= MAC=88:55:bb:99:88:88:88:66:11:dd:ff:bb:00:00 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=45807 DF PROTO=TCP SPT=64408 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
```

那么就可以确认网关确实收到这个包了

#### 网关 -> 网站

然后可以用 TRACE 追踪这个包是否触发了 NAT。
> 在一些环境中，你可能需要开启 TRACE 内核支持，参考 [How to Enable IPtables TRACE Target on Debian Squeeze (6)](https://serverfault.com/questions/385937/how-to-enable-iptables-trace-target-on-debian-squeeze-6)

```
iptables -t raw -A PREROUTING -p TCP -s 192.168.111.20 -j TRACE 
```

你会看到

```
Mar  2 15:58:11 myserver kernel: [5378263.921579] IN=zthnhi321 OUT= MAC=88:55:bb:99:88:88:88:66:11:dd:ff:bb:00:00 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0
Mar  2 15:58:11 myserver kernel: [5378263.921611] TRACE: raw:PREROUTING:policy:3 IN=zthnhi321 OUT= MAC=88:55:bb:99:88:88:88:66:11:dd:ff:bb:00:00 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
Mar  2 15:58:11 myserver kernel: [5378263.921645] TRACE: mangle:PREROUTING:policy:1 IN=zthnhi321 OUT= MAC=88:55:bb:99:88:88:88:66:11:dd:ff:bb:00:00 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
Mar  2 15:58:11 myserver kernel: [5378263.921672] TRACE: nat:PREROUTING:policy:1 IN=zthnhi321 OUT= MAC=88:55:bb:99:88:88:88:66:11:dd:ff:bb:00:00 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
Mar  2 15:58:11 myserver kernel: [5378263.921698] TRACE: mangle:FORWARD:policy:1 IN=zthnhi321 OUT=venet0 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=63 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
Mar  2 15:58:11 myserver kernel: [5378263.921719] TRACE: filter:FORWARD:rule:1 IN=zthnhi321 OUT=venet0 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=63 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
Mar  2 15:58:11 myserver kernel: [5378263.921741] TRACE: mangle:POSTROUTING:policy:1 IN= OUT=venet0 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=63 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
Mar  2 15:58:11 myserver kernel: [5378263.921763] TRACE: nat:POSTROUTING:rule:1 IN= OUT=venet0 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=63 ID=32766 DF PROTO=TCP SPT=65087 DPT=80 SEQ=3874826404 ACK=0 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0 OPT (02040ACA2C84454E80103030501000004010800000020000)
```

表明这个包分别经过了

* raw:PREROUTING:policy:3
* mangle:PREROUTING:policy:1
* nat:PREROUTING:policy:1
* mangle:FORWARD:policy:1
* filter:FORWARD:rule:1
* mangle:POSTROUTING:policy:1
* nat:POSTROUTING:rule:1

你可以通过

```
iptables -t nat -nvL --line-numbers
```

查看对应的规则编号。在这里，可以看到 `filter:FORWARD:rule:1` 和 `nat:POSTROUTING:rule:1` 被触发了。即

```
sudo iptables -A FORWARD -i zt+ -s 192.168.111.0/24 -d 0.0.0.0/0 -j ACCEPT
sudo iptables -t nat -A POSTROUTING -o venet0 -s 192.168.111.0/24 -j SNAT --to-source 123.45.67.89
```

> 另外如果你尝试过执行 `iptables -t nat -A POSTROUTING -i zt+ -o venet0` ，会收到 `Can't use -i with POSTROUTING` 报错。从 TRACE 中可以看出 `nat:POSTROUTING:rule:1` 中 `IN=` 是空的。所以在 `POSTROUTING` 表中是不能使用 `-i` 指定入包接口的。

#### 网站 -> 网关 -> 本机

这次我们一步到位

```
iptables -t raw -A PREROUTING -p TCP -s 98.76.54.32 -j LOG
iptables -t raw -A PREROUTING -p TCP -s 98.76.54.32 -j TRACE
```

另外为了防止日志太多，这里可以把刚才添加的那条 TRACE 删掉：

```
iptables -t raw -D PREROUTING -p TCP -s 192.168.111.20 -j TRACE 
```

再次 `curl 98.76.54.32` 就能看到包返回了

```
Mar  3 14:04:55 myserver kernel: [5457820.771146] IN=zthnhi321 OUT= MAC=88:55:bb:99:88:88:88:66:11:dd:ff:bb:00:00 SRC=192.168.111.20 DST=98.76.54.32 LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=64965 DF PROTO=TCP SPT=57286 DPT=80 WINDOW=65535 RES=0x00 CWR ECE SYN URGP=0
Mar  3 14:04:55 myserver kernel: [5457820.771696] IN=venet0 OUT= MAC= SRC=98.76.54.32 DST=123.45.67.89 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=0 DF PROTO=TCP SPT=80 DPT=57286 WINDOW=14480 RES=0x00 ECE ACK SYN URGP=0
Mar  3 14:04:55 myserver kernel: [5457820.771713] TRACE: raw:PREROUTING:policy:4 IN=venet0 OUT= MAC= SRC=98.76.54.32 DST=123.45.67.89 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=0 DF PROTO=TCP SPT=80 DPT=57286 SEQ=1319922288 ACK=3993987234 WINDOW=14480 RES=0x00 ECE ACK SYN URGP=0 OPT (020401AA7250238401080A2F75F14B4048030307)
Mar  3 14:04:55 myserver kernel: [5457820.771729] TRACE: mangle:PREROUTING:policy:1 IN=venet0 OUT= MAC= SRC=98.76.54.32 DST=123.45.67.89 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=0 DF PROTO=TCP SPT=80 DPT=57286 SEQ=1319922288 ACK=3993987234 WINDOW=14480 RES=0x00 ECE ACK SYN URGP=0 OPT (020401AA7250238401080A2F75F14B4048030307)
Mar  3 14:04:55 myserver kernel: [5457820.771743] TRACE: mangle:FORWARD:policy:1 IN=venet0 OUT=zthnhi321 SRC=98.76.54.32 DST=192.168.111.20 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=0 DF PROTO=TCP SPT=80 DPT=57286 SEQ=1319922288 ACK=3993987234 WINDOW=14480 RES=0x00 ECE ACK SYN URGP=0 OPT (020401AA7250238401080A2F75F14B4048030307)
Mar  3 14:04:55 myserver kernel: [5457820.771755] TRACE: filter:FORWARD:rule:2 IN=venet0 OUT=zthnhi321 SRC=98.76.54.32 DST=192.168.111.20 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=0 DF PROTO=TCP SPT=80 DPT=57286 SEQ=1319922288 ACK=3993987234 WINDOW=14480 RES=0x00 ECE ACK SYN URGP=0 OPT (020401AA7250238401080A2F75F14B4048030307)
Mar  3 14:04:55 myserver kernel: [5457820.771767] TRACE: mangle:POSTROUTING:policy:1 IN= OUT=zthnhi321 SRC=98.76.54.32 DST=192.168.111.20 LEN=60 TOS=0x00 PREC=0x00 TTL=55 ID=0 DF PROTO=TCP SPT=80 DPT=57286 SEQ=1319922288 ACK=3993987234 WINDOW=14480 RES=0x00 ECE ACK SYN URGP=0 OPT (020401AA7250238401080A2F75F14B4048030307)
```

同理，可以看到数据包在经过 `mangle:PREROUTING:policy:1` 之后，DST 被改写回了 `192.168.111.20`。于是一次成功的 NAT 就完成了。

最后，这里有一张图，显示了数据包都会经过什么表:

<a title="Jan Engelhardt [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Netfilter-packet-flow.svg"><img width="512" alt="Netfilter-packet-flow" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Netfilter-packet-flow.svg/512px-Netfilter-packet-flow.svg.png"></a>


> 之前配置 NAT 网关不成功的原因是：zerotier 防火墙错误设置了如下规则，导致包没法发回本机。
>
```
drop
	not chr ipauth
;
```


## 网关+

既然有网关了，我就想能不能再搞个智能回国网关。，只要我连上这个局域网，就能听网易云音乐了。我用的 vnet.one 用的是 anyconnect 连接，它有一个开源实现 openconnect，于是我[这样](https://stackoverflow.com/questions/38369950/openconnect-not-able-to-connect-to-gateway/42342253)：

```
sudo apt-get install curl vpnc-scripts build-essential libssl-dev libxml2-dev liblz4-dev
wget ftp://ftp.infradead.org/pub/openconnect/openconnect-8.02.tar.gz
tar xzf openconnect-8.02.tar.gz
cd openconnect-8.02
./configure --without-gnutls --with-vpnc-script=/usr/share/vpnc-scripts/vpnc-script
make
sudo make install
sudo ldconfig /usr/local/lib
```

然后用 [bestroutetb](https://github.com/ashi009/bestroutetb) 生成个路由：

```
bestroutetb --route.net=US,GB  --route.vpn=CN -p json -o routes.json -f
jq '.[] | select(.gateway == "vpn") | .prefix + "/" + (.length | tostring)'  routes.json  -c -r > routes.cn
```

整个设置路由的脚本

```
#!/bin/bash
source /root/.bashrc

DIR=$(dirname $0)

# Routes that we want to be used by the VPN link
ROUTES=`cat $DIR/routes.cn`

# Helpers to create dotted-quad netmask strings.
MASKS[1]="128.0.0.0"
MASKS[2]="192.0.0.0"
MASKS[3]="224.0.0.0"
MASKS[4]="240.0.0.0"
MASKS[5]="248.0.0.0"
MASKS[6]="252.0.0.0"
MASKS[7]="254.0.0.0"
MASKS[8]="255.0.0.0"
MASKS[9]="255.128.0.0"
MASKS[10]="255.192.0.0"
MASKS[11]="255.224.0.0"
MASKS[12]="255.240.0.0"
MASKS[13]="255.248.0.0"
MASKS[14]="255.252.0.0"
MASKS[15]="255.254.0.0"
MASKS[16]="255.255.0.0"
MASKS[17]="255.255.128.0"
MASKS[18]="255.255.192.0"
MASKS[19]="255.255.224.0"
MASKS[20]="255.255.240.0"
MASKS[21]="255.255.248.0"
MASKS[22]="255.255.252.0"
MASKS[23]="255.255.254.0"
MASKS[24]="255.255.255.0"
MASKS[25]="255.255.255.128"
MASKS[26]="255.255.255.192"
MASKS[27]="255.255.255.224"
MASKS[28]="255.255.255.240"
MASKS[29]="255.255.255.248"
MASKS[30]="255.255.255.252"
MASKS[31]="255.255.255.254"

export CISCO_SPLIT_INC=0

# Create environment variables that vpnc-script uses to configure network
function addroute()
{
    local ROUTE="$1"
    export CISCO_SPLIT_INC_${CISCO_SPLIT_INC}_ADDR=${ROUTE%%/*}
    export CISCO_SPLIT_INC_${CISCO_SPLIT_INC}_MASKLEN=${ROUTE##*/}
    export CISCO_SPLIT_INC_${CISCO_SPLIT_INC}_MASK=${MASKS[${ROUTE##*/}]}
    export CISCO_SPLIT_INC=$((${CISCO_SPLIT_INC}+1))
}

for r in $ROUTES; do
    addroute $r
done

for l in $INTERNAL_IP4_DNS; do
    if [ $reason = "connect" ]; then
        iptables -t nat -A PREROUTING -i zt+ -p udp --dport 53 -j DNAT --to $l
    elif [ $reason = "disconnect" ]; then
        iptables -t nat -D PREROUTING -i zt+ -p udp --dport 53 -j DNAT --to $l
    fi
    break
done

exec /usr/share/vpnc-scripts/vpnc-script
```

整合一下

```
echo "password" | openconnect address.example.org -u username --passwd-on-stdin --non-inter --script /root/openconnect/script.sh
```

完成。只不过，如果要看 bilibili 还需要设置 DNS 到国内，或者设置到网关上（上面的脚本配置了 DNS 转发）。而且 zerotier 只是为了虚拟局域网设计的，不如 anyconnect 能自动设置网关，路由，DNS方便。不过挺好玩的，还学了不少东西，over。