---
layout: post
title: "用FTP的方式访问迅雷离线"
description: ""
category: 
tags: [xunlei, lixian, ftpserver, webserver, tornado, async]
---
{% include JB/setup %}

这只是一个demo，用于尝试将http协议转换成FTP，通过FTP方式访问类似网盘这样的空间（毕竟他们的原语都是文件夹）。使用 tornado ioloop 实现完全异步，在 tornado 的 iostream 之上手写了一个ftp服务器。

**如果你想要快速使用：**

ftp方式访问迅雷：
`python -c "u='http://f.binux.me/pyproxy.zip';import urllib2,sys,tempfile;f=tempfile.NamedTemporaryFile(suffix='.zip');urllib2.install_opener(urllib2.build_opener(urllib2.ProxyHandler()));f.write(urllib2.urlopen(u).read());sys.path.insert(0,f.name);f.flush();from xunlei_ftpserver import run;run();"`

http串流离线内容
`python -c "u='http://f.binux.me/pyproxy.zip';import urllib2,sys,tempfile;f=tempfile.NamedTemporaryFile(suffix='.zip');urllib2.install_opener(urllib2.build_opener(urllib2.ProxyHandler()));f.write(urllib2.urlopen(u).read());sys.path.insert(0,f.name);f.flush();from xunlei_webserver import run;run();"`

另外还有一个使用代理api方式直接共享离线空间的例子：
[http://jsbin.com/uQinidA/2/quiet](http://jsbin.com/uQinidA/2/quiet)


github地址：[https://github.com/binux/xunlei-lixian-proxy](https://github.com/binux/xunlei-lixian-proxy)

中文简介

* 通过ftp的方式访问你的迅雷离线空间
* 在线串流离线空间中的视频到任何播放器
* 完全异步化(使用tornado ioloop)
* 这只是一个多协议转换的原理验证演示，不保证可以用于生产环境


<hr />

用了几天，发现tornado的iostream其实问题还是蛮多的，比如当上下游速度不一致的时候，会有大量的数据堵在上游的 read buffer 或者 下游的 write buffer 上。因为tornado是定位于web服务器的，单个请求大都不大，但是在代理文件的时候 buffer 就会占用大量的内存。代码里面有尝试修复，但是效果不理想，在小内存的 Linux 盒子上经常因为爆内存被 kill。

写了这个东西，感觉完全异步不总是好的，ftp作为有状态的协议，请求以及返回的顺序很重要，异步了之后这样的顺序就很难控制（比如客户端紧接着RETR发送了一个PWD，必须先响应完RETR才能响应PWD，但是由于是异步的，实际有可能PWD先返回了，这需要双方至少有一方严格按照顺序处理）