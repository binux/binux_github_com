---
layout: post
title: "基于WEBRTC的免插件点到点视频分享"
description: ""
category: 
tags: [javascript, webrtc]
---
{% include JB/setup %}

## WebRTC
[WebRTC](http://www.webrtc.org/) 是基于浏览器的实时通信协议（Real-Time Communications），通过WebRTC，可以在浏览器中直接进行**点到点**视频聊天和数据通信。WebRTC目前尚在协议开发中，但是已经在Chrome stable版和Firefox's Nightly中实现，并且 [能够互相通信了](http://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html)。通过WebRTC，浏览器将不仅限于和服务器通行，它将能够直接在浏览器间传输数据。通过 [STUN](http://en.wikipedia.org/wiki/STUN) 协议，即使有防火墙也没问题。

DEMO: [https://webrtc-experiment.appspot.com/](https://webrtc-experiment.appspot.com/) (需翻墙)

但是，WebRTC作为发布不到一年的协议，还存在非常多的问题：

* 文档少
* 协议繁琐，实现与[W3C标准](http://dev.w3.org/2011/webrtc/editor/webrtc.html)有出入
* 实现不完全，Chrome下的DateChannel不支持可靠传输，只能传text，还有长度限制
* 浏览器依赖

但是相信随着标准慢慢完善，支持的实现变多，这样点到点的通信方式一定能给Web带来更多的可能。

入门建议：参照 [W3C标准](http://dev.w3.org/2011/webrtc/editor/webrtc.html) 文档，对比 [https://apprtc.appspot.com/](https://apprtc.appspot.com/) 实现自行尝试（apprtc是封装最浅的实现版本）。另外需要指出的是，[HTML5 Rocks](http://www.html5rocks.com/en/tutorials/webrtc/basics/) 的文档是错误的。

## WebRTC-video

GitHub： [https://github.com/binux/webrtc_video](https://github.com/binux/webrtc_video)  
DEMO： [http://webrtc.binux.me/](http://webrtc.binux.me/)

这是一个用WebRTC的DataChannel特性实现的，免插件，基于浏览器P2P文件/视频分享DEMO。  
只要打开浏览器就能使用，每个访问者都是分享节点：

* 免插件，仅依赖浏览器随时随地地文件分享
* HTML5视频边下边播
* Peer-to-Peer通信，像BitTorrent一样在多用户间加速分享，传输
* 支持额外的HTTP，WebSocket节点，保证内容随时可用，并能保持P2P加速的特性
* 通信数据量统计，等等。。。

注：

* 视频边下边播需要MP4、webm、ogg格式
* HTTP节点需要CORS来源允许
* WebSocket节点，文件置于 `project_path/data/` 下，文件名只能包含英文和数字，通过 `ws://host:port/file/filename` 添加


因为WebRTC协议还非常不完善，这个项目更多的是demo性质的，但是这个demo展现了WEB+P2P的更多可能。