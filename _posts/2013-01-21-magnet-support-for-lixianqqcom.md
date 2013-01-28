---
layout: post
title: QQ旋风离线页面 磁力链支持
description: ""
category: 
tags: [qqxf, javascript, 离线]
---
{% include JB/setup %}

我QQ不是会员，也没法挂旋风等级，所以一直以来我都没有用过QQ旋风，虽然它有免费的离线空间。直到后来外包的一个项目要求一些QQ旋风的功能，才不得不开通了90天试用。  
比起迅雷来说，QQ旋风离线页面还真是够干净啊，同样干净的还有它的资源库。。东西实在太少了。  


功能上，BT没分文件夹就不吐槽了。磁力链都不支持，G+有人向疼讯提意见，结果是直接被删除？！[https://plus.google.com/u/1/117337204302188511498/posts/PMrLviy1inx](https://plus.google.com/u/1/117337204302188511498/posts/PMrLviy1inx)


好吧，自己动手丰衣足食


使用了以下一些东西:

* [http://pyproxy.duapp.com/](/2012/09/python-web-proxy-on-ba/) 用于承载cookie
* [http://httpbin.duapp.com/cookies/set?name=value](http://httpbin.duapp.com) 用于设置cookie
* 然后还有迅雷的一些接口。。。


地址：[https://gist.github.com/4585941](https://gist.github.com/4585941) 使用LGPL许可证发布  
书签：<a href="javascript:void((function(){var d=document;var s=d.createElement('script');s.src='http://blog.binux.me/assets/image/xf_magnet.js';s.id='binux_script';d.body.appendChild(s)})())">xf_magnet</a>
