---
comments: true
date: 2011-12-14 13:30:03
layout: post
slug: xunlei_lixian_for_flexget
title: 让资源灌满你的离线空间吧 -- 迅雷离线插件 for flexget
wordpress_id: 25001
categories:
- 未分类
tags:
- flexget
- Linux
- lixian
- python
- xunlei
---

**<font color=red>OUT OF DATA</font>**

迅雷离线空间已经开放到1PB了，总是用不完，手头上那个100M的种子压缩包里面东西好多啊，把它塞满离线空间如何？

这个是一篇教程，适用于所有python环境，包括Linux, Windows, OSX, routers, NAS boxes，只要有python环境就可以。（不过搭建python环境并不是本文的内容，本文默认您已经有python了）


### 1、工具介绍


我们这次使用的主要是两个东西



	
  * [flexget](http://flexget.com/)

	
  * [lixian.xunlei](https://github.com/binux/lixian.xunlei)


**flexget**是一个能够从RSS，HTML页面，CSV文件，本地目录等等地方抓取资源，经过过滤，然后下载的一套框架。
flexget会自动监控追踪下载过的资源，保证不会被重复下载，后端可以调用各种BT，命令来处理这些资源。

flexget对于操作分为三种基本类型：

Inputs
Filters
Outputs

**lixian.xunlei**是我写得一个lixian.xunlei.com的python API封装，本身是为了挖迅雷墙角的，不过本着一物多用的原则，提供了一个flexget的插件，支持作为资源的output向迅雷推送资源，也可以作为input从迅雷取出资源。


### 2、环境准备


介绍完插件，那么就开始动手吧，既然需要工具，那么首先安装他们。这里以linux环境为例，不过都是python的工具，你应该能很容易在其他的环境找到对应的命令。

1. 安装flexget
直接从pypi中安装即可，依赖会自动解决


> easy_install flexget


2. 安装xunlei.lixian
由于暂时还没有自动安装脚本，只能手动了。。。首先是依赖


> easy_install requests
easy_install pyparsing
easy_install beautifulsoup


然后安装插件：


> 下载[https://gist.github.com/gists/1476520/download](https://gist.github.com/gists/1476520/download)，将文件解压到 ~/.flexget/plugins 文件文件夹中（若文件夹不存在，创建一个）
注意：解压出来带了一层gist********的目录，请将文件从那个目录中拷贝出来




### 3、配置


flexget的配置使用的是yaml，虽然没有听说过，不过其实还是很简单的。。

flexget的配置文件位于  ~/.flexget/config.yml （若不存在，创建一个即可）。
一个基本的配置是这样的：

    
    feeds:
      Fate/Zero:
        rss: http://bt.ktxp.com/rss-search-Fate%2FZero+%E6%BE%84%E7%A9%BA%E5%AD%A6%E5%9B%AD+720p.xml
        accept_all: true
        xunlei_lixian:
          username: "<your username>"
          password: "<your password>"


flexget将多个不同的来源视为不同的feed，放在feeds下，Fate/Zero是它的名字

在前面我们说过，flexget有input, filter, output三种类型，在这个feed下面的配置中rss就是input, accept_all是filter, output是xunlei_lixian。

对于一个feed来说，input, filter, output这三个角色是必不可少的，但是使用的插件是可以变化的，通过不同的插件组合来达到各种各样的功能。
更多的input, filter, output和他们的参数可以去[http://flexget.com/wiki/Plugins](http://flexget.com/wiki/Plugins)这里参看。

虽然这三者总是需要的，但是每次都写一次完全相同的accept_all和xunlei_lixian也是一件麻烦的事情，于是你可以这么写

    
    presets:
      global:
        accept_all: true
        xunlei_lixian:
          username: "<your username>"
          password: "<your password>"
    
    feeds:
      Fate/Zero:
        rss: http://bt.ktxp.com/rss-search-Fate%2FZero+%E6%BE%84%E7%A9%BA%E5%AD%A6%E5%9B%AD+720p.xml
      C3:
        rss: http://bt.ktxp.com/rss-search-%E9%9B%AA%E9%85%B7%E5%AD%97%E5%B9%95%E7%BB%84+C3+%E7%B9%81%E4%BD%93+RMVB.xml
      local_file:
        find:
          path: /home/me/incoming
          mask: '*.torrent'


用presets就可以把一些公共的配置放到一起了

需要注意的地方是，**如果参数中带中文，或者有其他特殊支付，比如'*.torrent'，请用引号包起来。**

你可能注意到了，本地文件也是可以作为input的，写法就是用find插件，像例子中那样。
不过，由于xunlei只接受种子，所有一定要记得过滤 '*.torrent' 啊，不然我也不知道会怎么样。。



好了，就是这样了，该做的都完成了，现在我们**运行flexget**看看吧：


> 输入命令flexget看看吧
如果不放心，可以先使用命令： flexget --test 来试试结果是否正确。


如果没出什么问题的话，资源已经通通导入到你的离线空间了，慢慢下载回来吧，或者也可以参考我的下一篇教程：[自动将离线空间的内容通通下回本地](http://blog.binux.me/2011/12/from_xunlei_lixian_for_flexget/)



除了这种用法，flexget也可以订阅资源到transmission中等其他软件中，配合RSS可以达到自动订阅新番的效果，具体参阅[http://flexget.com/wiki/Plugins](http://flexget.com/wiki/Plugins)中对应的插件就可以了。




