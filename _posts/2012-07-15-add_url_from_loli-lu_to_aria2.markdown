---
comments: true
date: 2012-07-15 21:57:17
layout: post
slug: add_url_from_loli-lu_to_aria2
title: 从LOLI.LU直接添加资源到ARIA2
wordpress_id: 26161
categories:
- 未分类
tags:
- arai2
- Linux
- loli.lu
---

> loli.lu已关闭！  
> 如需使用迅雷会员功能，请[购买迅雷会员服务](http://vip.xunlei.com/)  
> 如需在OSX，Linux环境下下载迅雷离线，请参阅[ThunderLixianExporter](/2012/07/thunderlixianexporter/)

首先参照YAAW以RPC模式启动ARIA2，保证YAAW能正常工作。

在LOLI.LU中随便点开一个一个资源 > 批量下载。**右键点击** 自定义，填入以下脚本（注意需要替换JSONRPC_PATH，和YAAW中的一样）：

 
    
{% highlight javascript %}
function to_aria2(taskname, links, cookie) {
  $.getScript("https://raw.github.com/gist/3116833/aria2jsonrpc.js", function() {
    var aria2 = new ARIA2("<your rpc path>");
    $.each(links, function(i, n) {
      aria2.addUri(n.url, {out: n.title, header: 'Cookie: '+cookie});
    });
  });

  var str = "";
  str += "taskname = "+taskname+"\n";
  str += "cookie = "+cookie+"\n";
  str += "==========================\n";
  $.each(links, function(i, n) {
    str += "links["+i+"].title = "+n.title+"\n";
  });
  return str;
}
{% endhighlight %}




点击保存，点自定义，到YAAW中看是否添加成功了吧。
