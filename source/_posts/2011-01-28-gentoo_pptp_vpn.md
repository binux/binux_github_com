---
comments: true
date: 2011-01-28 02:31:24
layout: post
slug: gentoo_pptp_vpn
title: Gentoo PPTP VPN使用指南
wordpress_id: 9001
categories:
- 未分类
tags:
- gentoo
- he.net
- Linux
- pptp
- vpn
---

#### 安装




由于gentoo的"清凉化"解决方案没有提供图形化的pptp的配置方案的原因。。不得不手动配置pptp  
gentoo下安装配置请参考[http://en.gentoo-wiki.com/wiki/PPTP](http://en.gentoo-wiki.com/wiki/PPTP) 。并且其提供了一个半自动化的pptp配置工具，不用手写配置文件了。。




#### 使用




##### 默认通过VPN访问网络




为了通过vpn上网，请在**File:** /etc/ppp/peers/my_vpn文件中添加：  
defaultroute  
即可默认通过VPN连接网络




##### 自动修改路由




同时通过 [http://code.google.com/p/chnroutes/](http://code.google.com/p/chnroutes/) 这个项目生成vpnup和vpndown脚本，重命名成100-route.sh分别cp到/etc/ppp/ip-up.d/和/etc/ppp/ip-down.d/中，及可以使国内ip走国内线路，加快访问速度，又不影响翻墙。  
不过这里有一个地方需要修改。由于上面我们通过defaultroute使得默认网关有两个，原先的vpnup无法找到默认网关，请手动修改vpnup中的OLDGW为你的网关。




##### 能够Ping通网络，TCP连接无法访问




我在使用he.net的VPN时，pon连接上，改了路由之后能够ping通www.google.com，并且能够正常DNS。但是无法网页时一直超时(后来我才注意到状态一直是sending request)。。。。  
查看了各种文档（http://pptpclient.sourceforge.net/howto-diagnosis.phtml#connections_freeze）确认是mtu过大造成。在/etc/ppp/peer/my_vpn文件中添加  
mtu 1200  
或通过ifconfig ppp0 mtu 1200测试到可用值，修改即可
