---
comments: true
date: 2011-11-17 11:37:18
layout: post
slug: '%e8%ae%b0%e4%b8%80%e6%ac%a1%e7%a5%9e%e5%a5%87%e7%9a%84bug-%e6%85%8e%e7%94%a8sqlalchemy%e7%9a%84autocommit'
title: 记一次神奇的BUG —— 慎用sqlalchemy的autocommit
wordpress_id: 21001
categories:
- 未分类
tags:
- python
- sqlalchemy
---

东西是是用[sqlalchemy](http://www.sqlalchemy.org/)写的数据处理的程序。就是从一个库里面取出数据，然后处理后写回去。

数据库用的是MySQL+MyISAM，因为考虑到MyISAM是不支持事务的，即使commit也没什么用，而且处理逻辑中对只是有一定可能对数据修改，还要commit太麻烦了。于是：

    
    Session(autoflush=True, autocommit=True, expire_on_commit=True)


由于是周末，匆匆提交了就回去了。到了周六，我惊悚的看到[pycounter](http://pycounters.readthedocs.org/)做的数据统计非常完美地呈现出1/t的曲线

![request rate](http://s3.binux.me/201112/2890/14043_o.png)

无论再次启动多次依旧如此。。。非常完美的1/t的曲线。。

=======================================================================

由于频率是成1/t，表示用时随着“处理过”的数据量以一次指数增长，想想最近添加的代码不太可能有这样增长的操作啊。

由于手头正好有pycounters在操作中打入几个计数器，观察到在sqlalchemy在做session.expire_all()的操作时符合O(x)的时间特性。

猜测是sqlalchemy的实例cache的机制导致每次处理完后，并没有释放掉获取到的对象，而expire_all对这些对象进行了一个大循环，以标记过期。
既然问题找到了，就好办了，**不要使用sqlalchemy的autocommit，在修改后正常进行add,commit**，故障消除。

随后查看了sqlalchemy的代码，expire_all的确是挨个expire操作的：

    
    for state in self.identity_map.all_states():
        state.expire(state.dict, self.identity_map._modified)


而commit会将transaction close掉，清理掉identity_map，autocommit？还真没看出来怎么auto了。。
