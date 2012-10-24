---
comments: true
date: 2011-03-17 14:57:26
layout: post
slug: python-tools-getpy
title: python工具脚本： 获取中文汉字拼音声母 getPY.py
wordpress_id: 17001
categories:
- 未分类
tags:
- getpy
- python
- tools
- 汉语拼音
---

一般来说要获取中文汉字全拼是需要查表的，不过只需要声母的话还是很简单就能实现的。




方法是利用GBK编码是按照拼音的顺序编排汉字的，所以，只需要将文字转化成GBK编码，通过匹配范围即可获得声母了（当然理论上也应该能获取全拼，我猜的-。-）。




这样的代码网上有很多，这里也是抄袭而来，抄自何处也忘记了。。



{% highlight python %}
#!/usr/bin/env python
# coding : utf-8
# author : binux(17175297.hk@gmail.com)

def getFirstPY(word, encoding='utf-8'):
    if isinstance(word, unicode):
        try:
            word = word[0].encode('gbk')
        except:
            return '?'
    elif isinstance(word, str):
        try:
            word = word.decode(encoding)[0].encode('gbk')
        except:
            return '?'

    if len(word) == 1:
        return word
    else:
        asc = ord(word[0])*256 + ord(word[1]) - 65536
        if asc >= -20319 and asc <= -20284:
            return 'a'
        if asc >= -20283 and asc <= -19776:
            return 'b'
        if asc >= -19775 and asc <= -19219:
            return 'c'
        if asc >= -19218 and asc <= -18711:
            return 'd'
        if asc >= -18710 and asc <= -18527:
            return 'e'
        if asc >= -18526 and asc <= -18240:
            return 'f'
        if asc >= -18239 and asc <= -17923:
            return 'g'
        if asc >= -17922 and asc <= -17418:
            return 'h'
        if asc >= -17417 and asc <= -16475:
            return 'j'
        if asc >= -16474 and asc <= -16213:
            return 'k'
        if asc >= -16212 and asc <= -15641:
            return 'l'
        if asc >= -15640 and asc <= -15166:
            return 'm'
        if asc >= -15165 and asc <= -14923:
            return 'n'
        if asc >= -14922 and asc <= -14915:
            return 'o'
        if asc >= -14914 and asc <= -14631:
            return 'p'
        if asc >= -14630 and asc <= -14150:
            return 'q'
        if asc >= -14149 and asc <= -14091:
            return 'r'
        if asc >= -14090 and asc <= -13119:
            return 's'
        if asc >= -13118 and asc <= -12839:
            return 't'
        if asc >= -12838 and asc <= -12557:
            return 'w'
        if asc >= -12556 and asc <= -11848:
            return 'x'
        if asc >= -11847 and asc <= -11056:
            return 'y'
        if asc >= -11055 and asc <= -10247:
            return 'z'
        return '?'

def getPY(string, encoding="utf-8"):
    if isinstance(string, str):
        string = string.decode(encoding)

    result = []
    for each in string:
        result.append(getFirstPY(each))
    return "".join(result)
{% endhighlight %}

最新的代码可以在[https://github.com/binux/binux-tools/blob/master/python/getPY.py](https://github.com/binux/binux-tools/blob/master/python/getPY.py)这里找到。



