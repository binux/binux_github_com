---
comments: true
date: 2012-09-07 12:28:37
layout: post
slug: python-web-proxy-on-ba
title: 运行于百度云平台的Python网页代理
wordpress_id: 26178
categories:
- 未分类
tags:
- BAE
- proxy
- python
- webproxy
---

最近看到好多求BAE邀请的帖子，至少现在免费，于是也去求了一个，然后顺带开了python权限。
随便看了下python环境，版本够新，该有的库和框架也比较齐全，fetchurl接口完全封装在内置库中，至少比起GAE来说，迁移成本低多了。沙盒也是恰到好处的感觉，初步感觉不错。
提供的服务也涉及各个方面，云存储，数据库，cache，队列该有的都有了。
fetch taskqueue能fetchurl和离线下载（支持最大4G，10小时下载）体现了百度的特色吧，感觉眼前一亮，虽然已经有百度网盘提供类似服务，但是作为开发平台，也能作出一些有意思的应用。
消息服务自带1000条短信1W封邮件每月。

不过，百度依然体现了没有设计师的特色，界面和各个服务的开发包各不相同。。

由于BAE政策和稳定性尚不明朗，不打算在上面做能够保存数据的应用。
于是，做一个网页代理吧

[http://pyproxy.duapp.com/https://github.com/binux](http://pyproxy.duapp.com/https://github.com/binux)

其他API：  

[http://pyproxy.duapp.com/rewrite/http://www.baidu.com/](http://pyproxy.duapp.com/rewrite/http://www.baidu.com/)  
使用这个地址访问会将页面上的url都加上代理的前缀

[http://pyproxy.duapp.com/allow_origin/http://httpbin.duapp.com/ip](http://pyproxy.duapp.com/allow_origin/http://httpbin.duapp.com/ip)  
用于ajax跨域读取，比如这样：  
您的IP是：<span id="origin_ip"></span> 请自行查看源码  
<script src="http://lib.sinaapp.com/js/jquery/1.8.3/jquery.min.js"></script>
<script>
 $.get("http://pyproxy.duapp.com/allow_origin/http://httpbin.duapp.com/ip",
  function(data) {
  $("#origin_ip").text(data.origin);
});
</script>

不得不说，百度网速也太不怎么样了吧。。
第一次写网页代理，地址改写还真麻烦，xmlhttprequest好歹是拦截了，js动态加载的元素就算了。。

附上rewrite代码：
 
{% highlight python %}

#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# vim: set et sw=4 ts=4 sts=4 ff=unix fenc=utf8:
# Author: Binux<17175297.hk@gmail.com>
#         http://binux.me
# Created on 2012-09-06 22:22:21

import urlparse
import re

xmlhttprequest = '''XMLHttpRequest.prototype._open=XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(m,u,a,us,p) {
  var proxyurl='%s', baseurl='%s', a=document.createElement('a');
  a.href=u;u=a.href.replace(proxyurl,'');u=proxyurl+(u.indexOf('http')==0?u:baseurl+u);
  if(console&&console.log){console.log("XMLHTTPRequest:",u);}
  return this._open(m,u,a,us,p);
}'''
http_re = re.compile("https?://", re.I)
href_re1 = re.compile("((href|src|action)\s*=\s*\"([^\"<>]+)\")", re.I)
href_re2 = re.compile("((href|src|action)\s*=\s*\'([^\'<>]+)\')", re.I)
href_re3 = re.compile("((href|src|action)\s*=\s*([^\'\"\s<>]+))", re.I)
xmlhttprequest_re = re.compile("<script", re.I)
def rewrite(proxyurl, baseurl, content):
    #content = http_re.sub(proxyurl+"\g<0>", content)
    for all, href, url in href_re1.findall(content):
        rewrited_url = urlparse.urljoin(baseurl, url)
        if not rewrited_url.startswith(proxyurl) and rewrited_url.startswith("http"):
            content = content.replace(all, '%s="%s%s"' % (href, proxyurl, rewrited_url))
    for all, href, url in href_re2.findall(content):
        rewrited_url = urlparse.urljoin(baseurl, url)
        if not rewrited_url.startswith(proxyurl) and rewrited_url.startswith("http"):
            content = content.replace(all, '%s=\'%s%s\'' % (href, proxyurl, rewrited_url))
    for all, href, url in href_re3.findall(content):
        rewrited_url = urlparse.urljoin(baseurl, url)
        if not rewrited_url.startswith(proxyurl) and rewrited_url.startswith("http"):
            content = content.replace(all, '%s="%s%s"' % (href, proxyurl, rewrited_url))
    content = content.replace("</title>", "</title><script>%s</script>" % xmlhttprequest % (proxyurl, urlparse.urljoin(baseurl, "/")), 1)
    return content
    
{% endhighlight %}


[https://gist.github.com/3663115](https://gist.github.com/3663115)
