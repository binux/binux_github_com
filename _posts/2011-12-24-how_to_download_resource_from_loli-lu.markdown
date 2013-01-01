---
comments: true
date: 2011-12-24 00:27:20
layout: post
slug: how_to_download_resource_from_loli-lu
title: '[教程] 如何下载loli.lu的资源 For Windows'
wordpress_id: 26056
categories:
- 未分类
tags:
- IDM
- loli.lu
---

> loli.lu已关闭！  
> 如需使用迅雷会员功能，请[购买迅雷会员服务](http://vip.xunlei.com/)  
> 如需在OSX，Linux环境下下载迅雷离线，请参阅[ThunderLixianExporter](/2012/07/thunderlixianexporter/)

迅雷从早期的多线程下载，到P2SP多服务器下载，然后各种P2P吸血，到最后的迅雷离线服务，确确实实地建立起了一个互联网资源数据库。
无论是热门新番，还是上古时代的里番，几乎都能在迅雷的硬盘上找到，即使种子无人做种，即使ed2k没有资源，只要你付费，迅雷离线几乎都能满足你的欲望。

但是要让迅雷的吸血流氓客户端 钻进计算姬的身体里，总是觉得不舒服。于是我们有用回了干净清爽“少功能”的多线程下载软件。
ACG圈内听说的比较多的就是IDM（[Internet Download Manager](http://www.internetdownloadmanager.com)）了。

于是这篇windows教程就说说怎么用IDM下载[loli.lu](http://loli.lu/)的资源。。不过首先让我们扔掉那[恼人的IE](http://blog.binux.me/2011/12/fuck-ie/)吧。。



### 工具介绍





#### IDM



IDM是一个多线程下载软件。没了。。对真的没了。
没了就是这个东西的优势所在，没有乱七八糟的广告，没有没有必要的功能，一次付费<del>破解</del>终身适用。
IDM将多线程发挥到极致，自动的续传判断，自动的最大可开启线程数判断，资源嗅探，多浏览器支持等特性，是迅雷很好的替换。

![](http://s3.binux.me/201112/2890/14352_o.jpg)

您可以很容易的从互联网上寻找到付费<del>破解</del>方式。。（我也不知道现在用的版本是哪里来的了）



#### loli.lu



是我所编写的开源项目，旨在帮助Linux和MAC用户更好的适用迅雷离线的丰富资源。在Martian支持下提供的ACG离线内容分享服务。
通过这个项目的中转，你可以免费获得可供下载的迅雷离线地址，并且可以将地址分享给好友进行下载。



### 获取下载链接


访问：[https://loli.lu/](https://loli.lu/)，点击右上角的登录，使用Google账户授权：
[![login](http://s0.binux.me/201112/2890/14223_z.png)](http://s0.binux.me/201112/2890/14223_o.png)

点击想要下载的资源，然后在批量下载对话框中选择“IDM导出”

![](http://s2.binux.me/201112/2890/14351_o.png)

将导出文件保存到本地，然后打开“IDM > 任务 > 导入 > 从IDM导出文件”

![](http://s1.binux.me/201112/2890/14353_o.jpg)

选择刚才下载到的文件，确认下链接确认就可以了。
**注意，这个时候任务并不会立即开始，请到任务列表的最下端手动恢复任务。**

![](http://s1.binux.me/201112/2890/14354_o.jpg)

好了，现在试试能不能满速下载吧：）

如果您每次都是使用“IDM导出”功能进行下载，是没有必要安装插件的，这时候您可以点击左边栏的“我无须使用浏览器下载功能”链接来关闭红色的文字提示，并且可以显示tag列表。

[![](http://blog.binux.me/wp-content/uploads/2011/12/LOLI.LU-迅雷离线下载分享-112x300.png)](http://blog.binux.me/wp-content/uploads/2011/12/LOLI.LU-迅雷离线下载分享.png)



### 添加资源


在登录后就可以在右上角找到添加资源的链接啦
[![bar](http://s0.binux.me/201112/2890/14223_z.png)](http://s0.binux.me/201112/2890/14223_o.png)
![add task](http://s1.binux.me/201112/2890/14225_o.png)
当然了，如果觉得麻烦，也可以直接填写链接获得高速下载链接：
![add task 2](http://s0.binux.me/201112/2890/14227_o.png)

对了，及时不是发布资源，获得的下载链接依旧可以分享给好友，只需要点击分享按钮，将链接复制给好友就可以了。
当然你也可以适用我们的一键分享功能：
[![share](http://s3.binux.me/201112/2890/14228_o.png)](http://s3.binux.me/201112/2890/14228_o.png)
