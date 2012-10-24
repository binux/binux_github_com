---
comments: true
date: 2012-04-28 17:03:21
layout: post
slug: dropbox-uploader-script
title: Dropbox Uploader Script
wordpress_id: 26133
categories:
- 未分类
tags:
- bash
- dropbox
- Linux
- shell
---

Dropbox全平台并且各种工具齐全，在各个主机上都在用。用Dropbox备份VPS上的数据也很方便，但是之前看到的脚本都需要填写用户名密码，迟迟不敢用。。

这里推荐这个使用API的Dropbox上传脚本，通过设置沙盒，把备份目录限制在应用中，保证其他文件的安全。
而且这个脚本是用curl驱动的，只有一个文件，在linux平台下毫无压力。

Home page: [http://www.andreafabrizi.it/?dropbox_uploader](http://www.andreafabrizi.it/?dropbox_uploader)
github: [https://github.com/andreafabrizi/Dropbox-Uploader](https://github.com/andreafabrizi/Dropbox-Uploader)
原始版本是需要完全权限的，我fork了一个带沙盒限制的版本： github: [https://github.com/binux/Dropbox-Uploader](https://github.com/binux/Dropbox-Uploader)


使用方法：
第一次启动的时候会指引你去Dropbox创建一个应用，按照指引操作即可。

上传： ./dropbox_uploader.sh upload [LOCAL_FILE] 
下载： ./dropbox_uploader.sh download [REMOTE_FILE] 
删除： ./dropbox_uploader.sh delete [REMOTE_FILE]
