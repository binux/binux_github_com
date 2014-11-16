---
layout: post
title: "签到 —— qiandao.today 介绍"
description: ""
category: 
tags: [qiandao.today]
---
{% include JB/setup %}

[qiandao.today](https://qiandao.today/) 已经上线了一个半月，这篇blog一个半月以前就应该写了。直到我刷了14遍水晶塔没有ROLL到任何装备（不对，我最后通过贪婪ROLL到了！），打了两晚麻将，把把最小胡牌距离大于5（任意更换手牌达到胡牌的最小张数），房子里刷JJ怪之后。我觉得我必须做点什么。。。

好了，不扯蛋了。自动签到是我对于 “如何请求到数据” ，进行请求自动分析的一个尝试（实际是我 [U2](http://u2.dmhy.org/) 因为45天没登录被封了）。通过**浏览器捕获页面请求瀑布流，进行内容/请求分析，找出关键请求**。所以，签到这个项目，我就是先从 [HAR编辑器](https://qiandao.today/har/edit) 开始做的。做的时候还玩了一下 [angularjs](http://angularjs.org/)。<del>然后其他部分都是随便写的</del>

但是，对于签到来说，哪些请求是必要的，这个请求是怎么组装的（例如 token 参数怎么来），特征不明显。自动分析出来就能直接用的概率太低了，即使是人还得单步测试呢。于是 HAR编辑器 成为编辑和单步调试的辅助。自动分析变成了 “推荐相关请求”。

* 用户部分系统尝试了一下 [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2) 进行密码加密。PBKDF2 的优势在于通过随机盐 加 可配置的多轮加密，加大了单个key的运算代价。
* 模板执行部分通过提取页面信息，和 jinja2 引擎渲染，可以动态地改变请求的 url、header、data 各个部分。
* 执行断言加上邮件系统，可以检测签到是否成功，在失败的时候给用户发送邮件提醒。

本来还想要做互助打码的验证码系统的，但是通过 [雪月秋水](https://plus.google.com/u/0/+%E9%9B%AA%E6%9C%88%E7%A7%8B%E6%B0%B4%E9%85%B1) 的 [cookie插件](https://github.com/acgotaku/GetCookies)，其实大部分只有登录需要验证码，签到并不需要。<del>关键是做这个东西不好玩</del>，于是就算了。

运行了一个半月，目前有11个公开签到模板，400+个签到任务，每天进行300次签到。不过由于担心单IP登录帐号过多被封，只在v2ex做了一次广告，不敢大范围推广。。。

<hr>

以下是面向普通用户的简介：

* 云代签
* 支持多个网站
* 失败邮件提醒
* 自制模板并分享（[文档](https://github.com/binux/qiandao/blob/master/docs/har-howto.md)）
* https 传输安全保证
* 一号一密用户数据加密
* 开放源码，支持本地执行（提供本地lite版）

github: [binux/qiandao](https://github.com/binux/qiandao)  
网站: [https://qiandao.today](https://qiandao.today/)