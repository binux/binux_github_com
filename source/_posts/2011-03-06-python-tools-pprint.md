---
comments: true
date: 2011-03-06 14:16:25
layout: post
slug: python-tools-pprint
title: python工具脚本：pprint.py 中文支持
wordpress_id: 14001
categories:
- 未分类
tags:
- pprint
- python
- tools
---

这是一个支持unicode的pprint修改版本，来自[http://groups.google.com/group/python-cn/browse_thread/thread/d881b328386ce396/e68057c8a7531326](http://groups.google.com/group/python-cn/browse_thread/thread/d881b328386ce396/e68057c8a7531326)




默认使用pprint的时候，list, tuple, dict中的中文都显示成这个样子：





> 
> \>\>\> from pprint import pprint  
> \>\>\> pprint(['中文字符串', u'中文统一码字符串', {'中文键名': '中文键值', u'中文 unicode 键名': u'中文unicode 键值'}])
> 
> 
> 
> ['xe4xb8xadxe6x96x87xe5xadx97xe7xacxa6xe4xb8xb2',  
> u'u4e2du6587u7edfu4e00u7801u5b57u7b26u4e32',  
> {u'u4e2du6587 unicode u952eu540d': u'u4e2du6587 unicode  
> u952eu503c',  
> 'xe4xb8xadxe6x96x87xe9x94xaexe5x90x8d':  
> 'xe4xb8xadxe6x96x87xe9x94xaexe5x80xbc'}]
> 
> 





修改之后会把字符串中文形式输出，而不是repr的形式：




> 
> \>\>\> from pprint import pprint  
> \>\>\> pprint(['中文字符串', u'中文统一码字符串', {'中文键名': '中文键值', u'中文 unicode 键名': u'中文unicode 键值'}])
> 
> 
> ['中文字符串',  
> u'中文统一码字符串',  
> {u'中文 unicode 键名': u'中文 unicode 键值',  
> '中文键名': '中文键值'}]
> 

