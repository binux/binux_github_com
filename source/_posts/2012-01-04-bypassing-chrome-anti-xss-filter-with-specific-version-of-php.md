---
comments: true
date: 2012-01-04 22:19:06
layout: post
slug: bypassing-chrome-anti-xss-filter-with-specific-version-of-php
title: 利用特定版本PHP对query处理不一致，实现Chrome’s Anti-XSS绕过
wordpress_id: 26095
categories:
- 未分类
---

完全是为了需要发现的，以至于bypass这个词也是第一次见到。。这个漏洞利用了Chrome和PHP对于请求URL处理上的不一致，对于Chrome不认为是query请求的连接，被PHP当作query部分正常处理了，以此来绕过Chrome的XSS过滤。

受影响的浏览器和版本：
Google Chrome - 16.0.912.63 beta
Firefox - 9.0.1
Safari - 未亲自测试
Opera - 未亲自测试

不受影响的浏览器：
IE10 - 未亲自测试，有截图


漏洞尚在使用中...
绝对不是什么不好的用途啦..


826b1112bf8521831b04b2e2985f81ab
