---
layout: post
title: "再也不会听不完电台了——萌否电台播放列表"
description: ""
category: 
tags: [moefm, javascript]
---
{% include JB/setup %}

一直不爽萌否电台的播放器，跳歌一首首跳太慢，mp3加载不了直接挂掉。想听个[一百多首歌的电台](http://moe.fm/radio/enjoy)不是时间不够，就是听到一半挂掉了。

于是，我有一个愿望，**听完一次这个电台！**。于是就有了这货

![screenshot](/assets/image/Screenshot+2012-11-17+at+00.15.43.png)

代码依旧在[github](https://gist.github.com/4087765)上，这里有一个书签，在播放页点一下即可使用：

`javascript:void((function(){var d=document;var s=d.createElement('script');s.src='https://raw.github.com/gist/4087765/playlist.js';s.id='binux_js';d.body.appendChild(s)})())`