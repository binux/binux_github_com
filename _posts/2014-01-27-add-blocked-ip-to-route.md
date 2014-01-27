---
layout: post
title: "基于封禁IP名单的自动路由"
description: ""
category: 
tags: [vpn, route]
---
{% include JB/setup %}

年末本来很闲的，一个月把标日初级上看完了；结果前天开始被拉去做一个要求年后第一周上线的的项目。。还是本来是一个部门做的那种。。于是本月的blog只好凑字数了。。

<i>翻<del>自动</i>墙</del>路由基本除去apnic的国内ipv4白名单走国内方案，就剩下autoddvpn的封禁ip列表了（透明代理不考虑）。国内ip白名单的问题是，如果要玩外服DOTA，还得手动加上各种游戏的服务器IP，而autoddvpn万年不更新，很多时候根本命中不了。

于是，有了下面这个根据DNS查询记录添加封禁IP记录的方法：

* Linux环境
* 有VPN
* 通过dnsmasq查询DNS，并打开日志
* 通过匹配gfwlist的域名判断对应ip是否被封禁，然后添加到路由表中

通过脚本

<script src="https://gist.github.com/binux/8456129.js"></script>

`logread -f` 可以替换为 `tail -f 日志文件`  
`dev pptp-vpn` 可以替换为建立VPN的链接的名字


不过，缺陷是。。第一次访问时需要过1分钟左右才能生效。。

另外，这个是福利： [lifandb.html](http://f.binux.me/lifandb.html) 来自 [github/youxiachai/lifandb](https://github.com/youxiachai/lifandb/) （请用chrome打开，如果安装了adblock-plus请先禁用）