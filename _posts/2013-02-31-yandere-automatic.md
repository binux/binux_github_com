---
layout: post
title: "收图自动化"
description: ""
category: 
tags: [yande.re, python]
---
{% include JB/setup %}

从小开始，我对“自动”特别着迷。小时候，去妈妈的工厂帮忙折包装盒，每个动作都是一样的，很无聊。我就想，如果我发明一个机器，重复折纸盒的动作，那我不就可以什么都不干，在家领工资了吗？于是，你也知道了，**这份工作叫程序员**。。。

虽然机器在不断地自动运行，我也没能在家什么都不干就领到工资。互联网的大潮下，自动变得如此简单，甚至有人说，互联网就是印钞机，只要程序还在执行，编写程序的人都放半年假都能赚钱。所以说，程序员这个职业是自我毁灭的，他们从来不自己干活，他们编写自动的程序不断填充着这个世界，直到他们自己都不再被需要。这不，互联网已被竞相涌入的程序员和他们的程序占满，“用户需求”已经不能满足程序员的饥渴，他们又开始创造需求，这个世界上只要有互联网公司和快递公司就好了，他们想。

但是，那些后来者发现，所有现实世界都几乎都被搬上网了，那我们干什么？很快，他们将目光看向了现实世界，他们开始将互联网搬到现实中，智能手机，pad，glass。终于，他们开始在自己的现实世界中自我毁灭了，自动驾驶，智能家居——他们开始将带电的，不带电的，能动的，不能动的物体自动化。嗯，对了，这有个很热的名字——物联网。

主人早上好，北京的雾霾天气已被weather block plus拦截，室内健康指数98分，已打败73.5%的北京用户，赶快购买空气清新插件提升您的健康指数。室内壁纸5D（试用版）已根据您的喜好为您挑选了壁纸，10分钟广告后显示。冰箱余菜已更新，您是要先洗澡，先吃早餐还是打一炮？【选择】使用左手还是右手？（67.8%的用户推荐使用左手）【选择】今日热榜 / Kimer猜 。。。。。。


##正文
咳咳，扯远了，虽然G+福利满地，但是有收不全、怕收重、格式命名不统一，还是喜欢自己收图。最常用的方案是用支持内容离线的RSS阅读器订阅图站的RSS。我订阅的有

* [yande.re](https://yande.re/post/atom?tags=) 建议用atom的，输出带分辨率
* [konachan.com](konachan.com/post/atom?tags=) 壁纸向
* [danbooru](http://pyproxy.duapp.com/s;ssd%2Fdata%2Fpreview;data/re;\(\(<img%20src%3D"http%3A%2F%2Fdanbooru.donmai.us%2Fdata%2F%5Cw%2B.\)jpg"%2F>\);%5C1%5C2png"%20%2F>/http://danbooru.donmai.us/posts.atom) 很杂，转烧输出大图

使用google reader订阅，看到好图就标星，月底统一收。但是每个月几百张收到手软。现在使用的方案是：

1. google reader订阅，标星
2. [ifttt](https://ifttt.com/)将url追加到dropbox的文件里
3. 脚本收图
![ifttt](/assets/image/ifttt.png)


###脚本收图

虽然我用google reader进行筛选，但是直接全收也是可以的，方法也类似。  
首先，创建一个ifttt账号，现在应该已经开放注册了吧。

1. 登陆 > `Create a Recipe`
2. this选择 `Google Reader` Trigger选择 `New starred item`（如果全收，this选择 `Feed` Trigger选 `New feed item`）
3. then选择`Dropbox` Trigger选`Append to a text file`
4. file name： \{\{FeedTitle\}\} （每个网站一个文件） content： \{\{ItemUrl\}\}
5. 保存即可

现在在reader中标星，过一会就会收到Dropbox的文件更新提示。

第二步就是脚本**（需要linux shell环境支持）**，脚本支持yande.re，konachan.com，danbooru三个站的原图地址解析（当原图大于5M时下载jpg格式）

1. 下载 [imgurl.py](https://gist.github.com/binux/5071536/raw/imgurl.py)
2. 在下载目录执行`python imgurl.py [刚才ifttt创建的文件] | xargs -n 1 wget`


###自动分享到pinterest

**您需要一台VPS**
本来是打算自动分享到pinterest和G+的，但是G+没有publish的API，唯一的write API——moments还没上线。等有了再弄吧。  

1. VPS环境需要python2.6+，`easy_install requests tornado`
2. VPS下载 [img_share.py](https://gist.github.com/binux/5075775/raw/img_share.py)
3. 登陆[http://pinterest.com/](http://pinterest.com/)，提取cookie
4. 访问[http://pinterest.com/me/](view-source:http://pinterest.com/me/) > 查看源码，查找`<ul class="BoardListUl">`，提取要发布到board的id，在对应的<li data属性中，比如`215258125878507279`这样的串
5. 用`python img_share.py  --pinterest_cookie='[第3步]' --pinterest_board=[第4步]` 命令启动
6. 登陆[ifttt](https://ifttt.com/) > `Create a Recipe`
7. this选择 `Google Reader` Trigger选择 `New starred item`
8. then选择 `WordPress` Blog URL： `ifttt.captnemo.in`, Username,password任意填。Trigger选`Create a post`
9. Title: \{\{ItemTitle\}\}, Body: \{\{ItemUrl\}\}, Tags: `http://[VPS的hostname/ip]:8888/`

保存即可，比如[我的pinterest](http://pinterest.com/binux/auto/)。img_share.py可以设置`--username --password`验证（与第8步对应，不设置不验证），可以`--port`修改端口。具体`python img_share.py --help` 即可。

**本文写于2013年02月31日**
