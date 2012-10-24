---
comments: true
date: 2011-03-06 14:38:33
layout: post
slug: python-tools-chinese-digit
title: python工具脚本： chinese_digit.py - 中文数字 转换为 阿拉伯数字
wordpress_id: 15001
categories:
- 未分类
tags:
- chinese_digit
- python
- tools
---

## 简介：




经常会有这种需要将中文数字如 "五千三百零一"，全角数字"１２３４５"等等各种中文数字，转换成阿拉伯数字的场合。嘛，毕竟中文比较复杂，这种东西还是很发杂的。




下面这段代码来源于[http://bbs.chinaunix.net/redirect.php?tid=1755895](http://bbs.chinaunix.net/redirect.php?tid=1755895)。





**但是这段代码有如下的BUG：**




1、只能正确转换亿亿以下的数




2、"十万"等十之前没有个位数字的字符串转换错误




**而且有如下不足：**




1、不能转换大写中文（壹贰叁）和全角数字




2、不能转换电话号码（如 一零零五）




下面是一个修改过的python脚本，支持如上的所有特性，并修正了BUG





{% highlight python %}
#!/usr/bin/env python
# coding: utf-8
# author: binux(17175297.hk@gmail.com)

dict ={u'零':0, u'一':1, u'二':2, u'三':3, u'四':4, u'五':5, u'六':6, u'七':7, u'八':8, u'九':9, u'十':10, u'百':100, u'千':1000, u'万':10000,
       u'０':0, u'１':1, u'２':2, u'３':3, u'４':4, u'５':5, u'６':6, u'７':7, u'８':8, u'９':9,
                u'壹':1, u'贰':2, u'叁':3, u'肆':4, u'伍':5, u'陆':6, u'柒':7, u'捌':8, u'玖':9, u'拾':10, u'佰':100, u'仟':1000, u'萬':10000,
       u'亿':100000000}
def getResultForDigit(a, encoding="utf-8"):
    if isinstance(a, str):
        a = a.decode(encoding)

    count = 0
    result = 0
    tmp = 0
    Billion = 0
    while count < len(a):
        tmpChr = a[count]
        #print tmpChr
        tmpNum = dict.get(tmpChr, None)
        #如果等于1亿
        if tmpNum == 100000000:
            result = result + tmp
            result = result * tmpNum
            #获得亿以上的数量，将其保存在中间变量Billion中并清空result
            Billion = Billion * 100000000 + result
            result = 0
            tmp = 0
        #如果等于1万
        elif tmpNum == 10000:
            result = result + tmp
            result = result * tmpNum
            tmp = 0
        #如果等于十或者百，千
        elif tmpNum >= 10:
            if tmp == 0:
                tmp = 1
            result = result + tmpNum * tmp
            tmp = 0
        #如果是个位数
        elif tmpNum is not None:
            tmp = tmp * 10 + tmpNum
        count += 1
    result = result + tmp
    result = result + Billion
    return result
{% endhighlight %}


**完整版带测试用例的版本可以从这里获得：




** [https://github.com/binux/binux-tools/blob/master/python/chinese_digit.py](https://github.com/binux/binux-tools/blob/master/python/chinese_digit.py)




测试用例来源于：[http://fayaa.com/code/view/37/](http://fayaa.com/code/view/37/)（不记得一开始在哪看到的了=。=）



