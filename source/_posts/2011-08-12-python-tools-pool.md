---
comments: true
date: 2011-08-12 11:37:18
layout: post
slug: python-tools-pool
title: python 工具脚本： 线程池pool.py
wordpress_id: 19001
categories:
- 未分类
tags:
- multiprocessing
- pool
- python
- tools
---

这个脚本是仿照multiprocessing中的pool编写的（[http://docs.python.org/library/multiprocessing.html#module-multiprocessing.pool](http://docs.python.org/library/multiprocessing.html#module-multiprocessing.pool)）。




但是，python自带的multiprocessing的Pool是基于函数的，无法在线程内部保存各个线程的独立资源。例如在操作数据库时，数据库操作大都不是线程安全的，这时就需要每个线程有自己的连接。  
其次，python自带的线程池在join之后会陷入内核态，无法接受CTRL+C，从而无法中断自行，这一点让我很是不爽。于是实现了这个线程池。




**特性：**  
1、仿照multiprocessing的Pool，提供apply,apply_async,map,map_async这几个类似的接口，和wait函数进行等待执行结束




2、worker线程为一个类：


[crayon lang="python]
class Work(threading.Thread):
  def init(self):
    pass
  def do(self, args):
    pass
[/crayon]


  
可以通过重载init来初始化一些线程自己的资源。重载do来自行需要的操作，参数会通过args传入。




3、wait时可以使用KeyboardInterrupt（CTRL+C）中断进程执行。




**缺陷：**线程没有返回值。。。




另：发现对于这种小东西gist真是方便。




源码：[https://gist.github.com/992657](https://gist.github.com/992657)



