---
layout: post
title: "pyspider架构设计"
description: "a spider system in python on web"
category: 
tags: [python, spider, opensource]
---
{% include JB/setup %}

前言
===

[pyspider](https://github.com/binux/pyspider)是我一年多之前做的一个爬虫架构的开源化实现。主要的功能需求是：

* 抓取、更新调度多站点的特定的页面
* 需要对页面进行结构化信息提取
* 灵活可扩展，稳定可监控

而这也是绝大多数python爬虫的需求 —— 定向抓取，结构化化解析。但是面对结构迥异的各种网站，单一的抓取模式并不一定能满足，灵活的抓取控制是必须的。为了达到这个目的，单纯的配置文件往往不够灵活，于是，通过脚本去控制抓取是我最后的选择。  
而去重调度，队列，抓取，异常处理，监控等功能作为框架，提供给抓取脚本，并保证灵活性。最后加上web的编辑调试环境，以及web任务监控，即成为了这套框架。

pyspider的设计基础是：**以python脚本驱动的抓取环模型爬虫**

* 通过python脚本进行结构化信息的提取，follow链接调度抓取控制，实现最大的灵活性
* 通过web化的脚本编写、调试环境。web展现调度状态
* 抓取环模型成熟稳定，模块间相互独立，通过消息队列连接，从单进程到多机分布式灵活拓展

<del>这与后来在某厂看到的spider系统整体架构上区别不大</del>

![pyspider](/assets/image/pyspider.png)


功能
===

**webui**

* web的可视化任务监控
* web脚本编写，单步调试
* 异常捕获、log捕获，print捕获等

scheduler

* 任务优先级
* 周期定时任务
* 流量控制
* 基于时间周期 或 前链标签（例如更新时间）的重抓取调度

fetcher

* dataurl支持，用于假抓取模拟传递
* method, header, cookie, proxy, etag, last_modified, timeout 等等抓取调度控制
* *可以通过适配类似 [phantomjs](http://phantomjs.org/) 的webkit引擎支持渲染*

processor

* 内置的pyquery，以jQuery解析页面
* 在脚本中完全控制调度抓取的各项参数
* 可以向后链传递信息
* 异常捕获


架构
===

pyspider的架构主要分为 scheduler（调度器）, fetcher（抓取器）, processor（脚本执行）：

![pyspider-arch](/assets/image/pyspider-arch.png)

* 各个组件间使用消息队列连接，除了scheduler是单点的，fetcher 和 processor 都是可以多实例分布式部署的。 scheduler 负责整体的调度控制

* 任务由 scheduler 发起调度，fetcher 抓取网页内容， processor 执行预先编写的python脚本，输出结果或产生新的提链任务（发往 scheduler），形成闭环。

* 每个脚本可以灵活使用各种python库对页面进行解析，使用框架API控制下一步抓取动作，通过设置回调控制解析动作。

***注：output部分设计尚未决定，因为希望输出也可以很灵活地进行。现在是在脚本中有一个`on_result`的回调，在里面可以自行实现结果输出。***

