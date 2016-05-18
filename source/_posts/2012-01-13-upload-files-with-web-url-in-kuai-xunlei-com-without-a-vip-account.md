---
comments: true
date: 2012-01-13 02:26:26
layout: post
slug: upload-files-with-web-url-in-kuai-xunlei-com-without-a-vip-account
title: 让非会员也能使用kuai.xunlei.com的添加网络文件功能
wordpress_id: 26101
categories:
- 未分类
tags:
- xunlei
---

没什么用的功能一则：
让非会员也能使用kuai.xunlei.com的添加网络文件功能。

访问kuai.xunlei.com，登录，然后将下面的脚本粘贴到地址栏中执行即可：


    
    
    javascript:$('#add_internet_file_btn').unbind().click(function(){$('#add_internet_file_layer').fadeIn();$('#add_internet_file_layer .addingtips').hide();$('#add_internet_file_layer .apply_submit_btn').show();});
    



似乎这样就可以用xunlei来免费加速了，不支持BT是一大遗憾。
