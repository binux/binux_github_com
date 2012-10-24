---
comments: true
date: 2011-12-24 11:33:03
layout: post
slug: vps-setup-log-1
title: VPS配置记录（一）
wordpress_id: 26074
categories:
- 未分类
tags:
- arch
- archlinux
- Linux
- nginx
- pptpd
---

一直想弄个VPS来玩，但都没有下定决心，随着<del>人民币升值</del>VPS变得更廉价，加上最近看到[yardvps](http://www.yardvps.com/billing/aff.php?aff=1108)的圣诞节20%续费优惠码，算下来一个512M XEN的VPS也不过40RMB/月了。去除省去的VPN的钱，还算不错，于是决定入手一个玩玩。

稍微介绍一下吧，[yardvps](http://www.yardvps.com/billing/aff.php?aff=1108) (推介链接)，是无管理型的VPS提供商，机房位于洛杉矶，**支持支付宝支付**。
我选的这个VPS配置如下：



	
  * 内存：512 MB

	
  * SWAP：1 GB

	
  * CPU: 1 个 Intel(R) Xeon(R) CPU E5620 @ 2.40GHz

	
  * 硬盘： 20GB

	
  * 流量： 1500GB

	
  * 原生IPV6、PPTP VPN



由于有中文页面和新浪微博+支付宝，简直就是为中国人打造的。速度方面各地都不一样，到国内骨干网能有200-300KB/S的速度。但是在我这（北京联通）还是挺悲剧的，也就30KB/S的样子，而且丢包严重。。虽然也有其他地区朋友说速度不错。。不过最好还是亲自测试以下为好
[官方测速100M](http://208.87.242.2/download100.zip)，[位于我服务器上的文件](http://ipv4.binux.me/CSDN-%e4%b8%ad%e6%96%87IT%e7%a4%be%e5%8c%ba-600%e4%b8%87.rar)

好，推介到此结束，下面正式开始，服务器系统用的是ArchLinux 64位版本，因为用得比较习惯了。。而且默认配置文件的分布还是比较舒服的。。



### 添加用户


用adduser的交互式用户添加，比起useradd各种命令参数省心很多：


    
    
    [root@localhost http]# adduser
    Login name for new user []: binux
    User ID ('UID') [ defaults to next available ]: 
    Initial group [ users ]: 
    Additional groups (comma separated) []: bin,daemon,sys,adm,disk,wheel,log,audio
    Home directory [ /home/binux ] 
    Shell [ /bin/bash ] 
    Expiry date (YYYY-MM-DD) []: 
    
    New account will be created as follows:
    ---------------------------------------
    Login name.......:  binux
    UID..............:  [ Next available ]
    Initial group....:  users
    Additional groups:  bin,daemon,sys,adm,disk,wheel,log,audio
    Home directory...:  /home/binux
    Shell............:  /bin/bash
    Expiry date......:  [ Never ]
    
    This is it... if you want to bail out, hit Control-C.  Otherwise, press
    ENTER to go ahead and make the account.
    





### /etc/sudoers


由于我都是用sshkey验证登录的，总是不记得密码，于是给wheel组加上了免密码sudo，至于为什么不直接用root是因为这样可以防止手抖。。


    
    [root@localhost binux]# sudoedit /etc/sudoers
    
    ## Same thing without a password
    -# %wheel ALL=(ALL) NOPASSWD: ALL
    +%wheel ALL=(ALL) NOPASSWD: ALL
    
    ## Uncomment to allow members of group sudo to execute any command
    -# %sudo   ALL=(ALL) ALL
    +%sudo   ALL=(ALL) ALL
    



然后就是改掉密码什么的



### pacman && python && vim


随手打开一些源


    
    [root@localhost ~]# vi /etc/pacman.d/mirrorlist
    Server = http://mirrors.kernel.org/archlinux/$repo/os/$arch




    
    [root@localhost ~]# pacman -Sy
    [root@localhost ~]# pacman -S python
    [root@localhost ~]# pacman -S python2
    [root@localhost ~]# pacman -S vim





### nginx




    
    pacman -S nginx




    
    [root@localhost ~]# vim /etc/nginx/conf/nginx.conf
    
    -#user http;
    +user http;
    
    -    #keepalive_timeout  65;
    +    keepalive_timeout  20;
    
    -    #gzip  on;
    +    gzip  on;
    
        server {
            listen       80;
            server_name  localhost;
    
            #charset koi8-r;
    
            #access_log  logs/host.access.log  main;
    
            location / {
    -            root   http;
    +            root   /srv/http;
                index  index.html index.htm;
                autoindex on;
            }
    
         }
    
    +    include vhost/*.conf;
    



这里我们已经把nginx的目录统一放到/srv/http下了。为了让nginx所在的http组也能访问修改这个路径，把这个目录的所有人改成http，然后将binux也加入这个组来修改里面的文件。
然后建立vhost目录，然后include到主配置中来，为了以后方便添加虚拟主机。


    
    [root@localhost conf]# cd /etc/nginx/conf/
    [root@localhost conf]# mkdir vhost
    
    [root@localhost conf]# cd /srv/
    [root@localhost srv]# chown http:http http
    [root@localhost srv]# chmod 775 http
    [root@localhost srv]# usermod -a -G http binux
    
    [root@localhost srv]# rc.d start nginx
    





### PPTP Server


参考：[https://wiki.archlinux.org/index.php/PPTP_Server_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)](https://wiki.archlinux.org/index.php/PPTP_Server_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

    
    [root@localhost ~]# pacman -S pptpd
    [root@localhost ~]# vim /etc/pptpd.conf
    
    +3行
    option /etc/ppp/pptpd-options
    localip 172.16.36.1
    remoteip 172.16.36.2-254
    
    [root@localhost ~]# vim /etc/ppp/pptpd-options
    
    +14行
    name pptpd
    refuse-pap
    refuse-chap
    refuse-mschap
    require-mschap-v2
    require-mppe-128
    proxyarp
    lock
    nobsdcomp
    novj
    novjccomp
    nologfd
    ms-dns 8.8.8.8
    ms-dns 8.8.4.4
    
    [root@localhost ~]# vim /etc/ppp/chap-secrets
    
    +binux   pptpd   passwd  *
    
    [root@localhost ~]# vim /etc/sysctl.conf
    
    # Disable packet forwarding
    -net.ipv4.ip_forward=0
    +net.ipv4.ip_forward=1
    
    [root@localhost ~]# iptables -A INPUT -i ppp+ -j ACCEPT
    [root@localhost ~]# iptables -A OUTPUT -o ppp+ -j ACCEPT
    
    [root@localhost ~]# iptables -A INPUT -p tcp --dport 1723 -j ACCEPT
    [root@localhost ~]# iptables -A INPUT -p 47 -j ACCEPT
    [root@localhost ~]# iptables -A OUTPUT -p 47 -j ACCEPT
    
    [root@localhost ~]# iptables -F FORWARD
    [root@localhost ~]# iptables -A FORWARD -j ACCEPT
    [root@localhost ~]# iptables -A POSTROUTING -t nat -o eth0 -j MASQUERADE
    [root@localhost ~]# iptables -A POSTROUTING -t nat -o ppp+ -j MASQUERADE
    
    [root@localhost ~]# rc.d save iptables
    


然后在线启用端口转发，然后可以启用pptpd了。

    
    
    echo 1 >/proc/sys/net/ipv4/ip_forward
    rc.d start pptpd
    
