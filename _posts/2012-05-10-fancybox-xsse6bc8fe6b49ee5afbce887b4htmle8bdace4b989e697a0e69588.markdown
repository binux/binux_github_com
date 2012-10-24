---
comments: true
date: 2012-05-10 00:37:53
layout: post
slug: fancybox-xss%e6%bc%8f%e6%b4%9e%e5%af%bc%e8%87%b4html%e8%bd%ac%e4%b9%89%e6%97%a0%e6%95%88
title: fancybox xss漏洞导致html转义无效
wordpress_id: 26143
categories:
- 未分类
---

从老的1.3.4到新的2.0.7都有影响

验证：
如果对以下地址使用fancybox，当fancybox打开时会触发脚本。
xss

原理：
fancybox在取title的时候取的是$(obj).attr('title')，没有进行转义就拼接进结果中。导致**即使原代码进行了转义，在使用了fancybox时依旧会产生xss**

解决方法：
1、停止使用title特性
2、修改_format_title函数，将title进行转义
