---
layout: post
title: "动画新番订阅-从ktxp到迅雷离线"
description: ""
category: 
tags: [动画, GAS]
---
{% include JB/setup %}

<span style="font-size: 2em">需要解决方案请直接跳到 **解决方案** 一节</span>


曾经折腾过[flexget+迅雷离线](http://blog.binux.me/2011/12/from_xunlei_lixian_for_flexget/)的新番订阅方案，但是因为越来越忙+越来越懒，这种挨个写配置文件的方式太麻烦了，之后就再也没用过。  
于是我在想，用RSS追番的痛点在哪？

* 需要挨个构造过滤条件？
* flexget配置文件太难写，不方便下载到本地？
* 下载的文件看不懂罗马拼音？
* 不方便记录进度？

### 过滤调教
首先是需要构造过滤条件，这个好说，每一集动画，每一个字幕组发布的名字只会有集数不同，那么只需要配上关键字（字幕组/作品名/格式/语言）就可以了。  
即便如此，痛点依旧存在。当季连续播放的内容还好说，OVA怎么办？OAD怎么办？TV未放送怎么办？这些很可能命名方式不一样，甚至是原来追番的字幕组压根没做！  
像bilibili合集或者专有tag这样人工收集固然完美，但是作为程序员，使用人工是可耻的！

于是，设想中的方案：

* 抓取所有资源，对抓取到的信息，通过分词等手段对资源打tag，这些第一批产生的tag称为raw tag
* 对所有raw tag，通过推导规则生成衍生tag。（例如作品名归一化，作品名生成x月番，作品名+第x季关键词进行消歧义）
* 对不确定信息，产生不确定tag，多个不确定tag依旧可以产生衍生tag
* 选取主要的tag（包括raw tag，衍生tag，不确定tag）保存，以供筛选
* 对tag进行分类

方案的核心在于tag推导，而这样的推导公式可以人工配置，也可以通过机器学习/规则聚类获得。  
最后给用户展现的是一堆tag（但是同一部作品只会有一个tag，即使不同字幕组译法不一样），用户首先选择作品，之后是字幕组/格式/语言等等tag组合。而OVA等资源只要能衍生出和作品一致的tag，资源就不会漏。

### 下载到本地
下载管理，本地资源库管理，这些其实都是大问题。不过我们不如换个思路。以现在的用户带宽，200M的一部新番在线播放根本不成问题，但是问题在于资源从哪来：bt? ftp? http? 目前可能的资源来源无外乎这三种，直接播放不就好了嘛！对于任何主流视频播放器，http，ftp自不用说，基本没有不支持的。即使http需要cookie验证，本地做一个代理就好了。bt直接播放也不是什么困难的问题，缓冲之后流式输出，甚至可以把bt/http/ftp统统封装成http/FTP协议，内容想怎么播就怎么播。

### 海报查看/播放进度管理
既然上面说到，在线播放实际上可以来源于任何媒介——只要有一个本地代理，将这些内容转换成播放器支持的格式即可。那么，web化的内容展示+本地播放也就顺理成章地得以实现。  
将本地代理API开放出来，任何网站只要通过这个API即可让用户通过本地的协议转换/播放来源于任何地方的任何内容，而网站不需要花费流量。

# 临时解决方案
好吧。。既然我连配个flexget都没时间，怎么有时间搞爬虫, tag system, 机器学习, 分词, 流式bt, http代理, 协议转换, 动画内容站呢？
既然这样，先来个简单的解决方案吧，从ktxp订阅到迅雷离线：

***第一步：***将 <a href="javascript:(function%20()%7Bfunction%20add_search(e)%7B%20var%20a=$(%22#top-search-wd%22);%20if(a.hasClass('empty'))a.removeClass('empty').val('');a.val(a.val()+%22%20%22+$(e).text());ktxp.search.submit()%7Dwindow.add_search=add_search;$(%22.ttitle%22).each(function(e,t)%7Bvar%20n=$(t).find(%22a:nth-child(2)%22).text();var%20r=%22%22;var%20i=%22%22,s=%22%22;$.each(n,function(e,t)%7Bif(t.match(/%5B%20%5C%5B%5C%5D%EF%BC%8F%E3%80%8E%E3%80%8F%E3%80%8C%E3%80%8D%E3%80%90&%E3%80%91%EF%BC%86%E2%98%85%5C%5C%5C/%5C+%5C(%5C)%5C-_%5D/))%7Bif(i)%7Br+='%3Ca%20href=%22#%22%20onclick=%22add_search(this);return%20false;%22%3E'+i+%22%3C/a%3E%22;i=%22%22%7Ds+=t%7Delse%7Bif(s)%7Br+=s;s=%22%22%7Di+=t%7D%7D);if(i)%7Br+='%3Ca%20href=%22#%22%20onclick=%22add_search(this);return%20false;%22%3E'+i+%22%3C/a%3E%22;i=%22%22%7Dif(s)%7Br+=s;s=%22%22%7D$(t).find(%22a:nth-child(2)%22).replaceWith(r)%7D)%7D)()">ktxp筛选器</a> 保存为书签

***第二步：*** 访问 bt.ktxp.com ，点击书签，你会发现标题都被分割成tag了，根据节目单+字幕组+格式+语言等筛选tag。选好之后，列表右上角有个黄色的小小的rss，复制它的url，比如http://bt.ktxp.com/rss-search-%E9%AD%94%E7%AC%9B.xml 这样的。保存下载。

***第三步：*** 访问 <a href="https://script.google.com/macros/s/AKfycbxqWzZ6CSVaXtUBO313S8bFhleYXzv5CbfeLpEs4_WVfnTYeco/exec">aria2/迅雷离线订阅器</a>，根据提示保存书签，访问迅雷离线，点击书签。你会看到一个aria2 path的框（如果你不用aria2，那就留空吧），和一个RSS订阅的框。将上面提取的RSS地址填到RSS订阅的框中（每行一个），点保存即可。现在，最近更新的新番会自动添加到你的迅雷离线里面了！
