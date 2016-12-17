---
title: Data Highlighter
date: 2016-12-04 13:19:10
tags: [html, infomation-extraction, wrapper-genaration]
---

又是好久没有写 blog 了。现在确实没有上学的时候愿意折腾了，能用钱解决的问题，就不自己动手了。但是，很久不写 blog 这事呢，其实就是因为懒 \_ (:3」∠) \_。

这里带来的是 [
如何从 WEB 页面中提取信息](/2014/07/how-to-extract-data-from-web/) 一文中提到的 data highlighter。但是由于开源需要重写代码，而我并不打算使用它，这里只给出 [demo](https://demo.binux.me/data_highlighter.html) 和算法思路。

## 简介

Data Highlighter 其实是一种生成提取规则的方式：

> Data Highlighter 的标注方式是：给一系列相似的页面，让用户标出（高亮）每个属性在页面中的位置。通过多个页面的标注信息，寻找每个属性的特征。当然了，这个特征可以是 xpath，也可以是上下文，也有可能是机器学习的特征向量。  
> Data Hightlighter 通过高亮 多个页面中相同属性 进行规则学习，省去了人为设置规则时的学习成本。实践表明，在单一页面模板下，标记2个页面就足以生成规则了。效率远大于手工设置规则。Google Data Highlighter 甚至对文字进行了切分，能在 英语 / 汉语普通话 / 粤语 xpath 相同的情况下，分别选出三种语言。是我目前见过的成熟度最高、通用性最好、最简便的数据抽取方式。

那我们通过例子介绍一下使用方式。首先打开 [demo](https://demo.binux.me/data_highlighter.html)。这里列出了5个豆瓣电影的 sample 页面，点击 go 加载页面。将鼠标放在页面中，就会发现文字被高亮了，点击拖拽鼠标选择需要提取的文字，在弹出的菜单中选择属性名。

<br>

<video controls autoplay loop src="/assets/image/screen-data-highlighter-select.mp4"></video>

然后分别点击 `gen_tpl` 和 `test_all` 就能看到生成的模板，以及提取效果了。

![extraction sample](/assets/image/Screenshot 2016-12-04 14.44.18.png)


## 算法解析

点击 `gen_tpl` 就可以看到生成的模板了，`tpl` 字段的 key 为抽取的变量的名字，value 描述了一个 [状态机](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)。

先看一个简单的例子，以下就是对 `name` 字段的模板，它描述了一个 `s0 -> e0` 的状态机。

```
{
  "need_more_sample": true,
  "tips": {},
  "tpl": {
    "name": {
      "states": {
        "s0": {
          "tag": "start",
          "transitions": [
            "e0"
          ],
          "condition": {
            "xpath": "/html/body/div/div/h1/span/textnode",
            "features": {
              "exclude": [],
              "include": [
                "ancestor::*[1][name()=\"span\" and @property='v:itemreviewed']"
              ]
            }
          }
        },
        "e0": {
          "tag": "end",
          "transitions": [],
          "condition": {
            "xpath": "/html/body/div/div/h1/span/textnode",
            "features": {
              "exclude": [
                "following::*[position()=1 and name()=\"textnode\"]"
              ],
              "include": [
                "ancestor::*[1]/*[last()-0] = ancestor-or-self::*[1]"
              ]
            }
          }
        }
      },
      "entrance_state": [
        "s0"
      ],
      "is_list": false,
      "data_type": "TEXT"
    }
  }
}
```

> 直接跳到 `tpl.name` 部分，它有4个字段，`is_list` 和 `data_type` 描述了字段的类型，它们在字段定义的时候就已经指定了，没什么好说的。`states` 和 `entrance_state` 为状态机的描述部分。

> `entrance_state` 表示状态机的入口为 `s0`。
> 
> `states` 中描述了两个状态 `s0` 和 `e0`。 `s0.tag == start` 表示这是一个开始状态，即标示字段提取的开头，`e0.tag == end` 为结束状态，即字段的结尾。`s0.transitions == [e0]` 表示从 `s0` 能够转移到 `e0`，而由于 `e0.tag == end` 已经结束了，所以就没有转移状态了。
> <br>
> 在执行时，[先序遍历](https://zh.wikipedia.org/wiki/%E6%A0%91%E7%9A%84%E9%81%8D%E5%8E%86#.E5.85.88.E5.BA.8F.E9.81.8D.E5.8E.86.28Pre-Order_Traversal.29) DOM 树，根据 `condition` 的条件进行状态转移。

> `s0.condition` 表示进入开始条件为：xpath `/html/body/div/div/h1/span/textnode` 并且满足 `ancestor::*[1][name()=\"span\" and @property='v:itemreviewed']`（父元素的 name 为 span，property 属性为 "v:itemreviewed") 这个特征。  

> 而进入结束条件为 `e0.condition`： xpath `/html/body/div/div/h1/span/textnode` 并且满足 `ancestor::*[1]/*[last()-0] = ancestor-or-self::*[1]`（最后一个元素），并排除满足 `following::*[position()=1 and name()=\"textnode\"]`（右兄弟为 textnode，实际与 include 互斥）的元素。

> **简单地说，这个状态机描述了 `属性 property='v:itemviewed' 的 span 的所有 textnode 孩子` 这样一条规则。**

> 而多状态的执行也是类似的，只不过它可能存在状态分支，或者在多个状态间循环。不过只要根据状态转移条件状态进行转移，再根据 `tag` 所标识的开始结束进行提取即可。

为什么要使用状态机在后面的小结讲解，我们暂且将整个状态机理解为「描述字段提取的开头和结尾」，每个状态就描述了开头结尾的特征。先来看看状态是如何描述「字段提取的开头和结尾」的。

### 状态条件的生成

算法的基本思路是**寻找多个样本间相同的特征，并使得特征排除其他相似元素**。

每一个元素可以根据 id, class 属性，文字内容，位置，前 n 个元素的特征，祖先元素特征生成一组特征集合。对多个样本的特征取交，对需要排除的元素取差。

例如如果每次都选择第二个「豆瓣成员常用的标签」，就会生成

```
            "features": {
              "exclude": [
                "preceding::*[position()=2 and name()=\"textnode\"]"
              ],
              "include": [
                "preceding::*[position()=2 and name()=\"a\"]"
              ]
            }
```

如果每次都选择 2016 的标签，就会生成

```
            "features": {
              "exclude": [],
              "include": [
                "ancestor::*[1][contains(., '2016')]",
                "contains(., '2016')"
              ]
```

通过特征集合的运算，算法能够通过样本，猜测出用户选择的意图。而这样的特征集合，可以不断地添加，以满足不同页面的需要。

需要特别说明的是，特征并不需要像 demo 中使用某种特定的选择器(xpath)，由于模板执行时，可以再次为候选元素生成特征集合，对特征集合进行比较。实际上，你可以在特征集合中放入任何字符串，例如「第5元素」，「前一个字符为 answer，且值为 42」都是可以的。

### 状态机

不同于往常的选取一个元素（例如 pyspider 中的选择器），data highlighter 提供了

1. 元素内文字选取
2. 跨元素选取

的功能，这使得正常的「元素选择器」不再好使，取而代之的是一种定位开始和结束的规则。描述为状态机即：`s0 -> e0`。

而 data highlighter 另一种需要支持的功能为列表选取：

<video controls autoplay loop src="/assets/image/screen-multi-select.mp4"></video>

就不能仅仅通过 `s0 -> e0` 这样开头结尾的模式进行描述了。它需要准确描述出整个列表的开头，结尾，分隔符等信息，需要通过一个类似

```
s0 -> e0 -> s1 -> e1 -> s2 -> e2
            |------|
```

的状态机，`s0` 为整个列表的开头，`s1 -> e1` 为中间循环的组，`e2` 为 整个列表的结束。

而实际中，由于某些状态可以被合并，你可能会看到类似

```
s0 -> e0 -> s2 -> e1
       |
       s1
```

> e0 和 e1 被合并了，即第一个元素的结束条件和中间元素的结束没有不同

的状态机

### 状态机的生成

虽然状态机看起来非常复杂，但是用程序处理起来却不难。首先为每一个样本（包括列表选取）生成一条 `s0 -> e0 -> s1 -> e1 -> s2 -> e2 -> s3 -> e3 ...` 的长链，然后尝试合并状态，然后将多个样本的链用同一规则合并。而不能合并的状态，就做个分支转移即可。

而状态能否合并，取决于它们有没有共同特征，就是这么简单。

## 总结

Data Highlighter 的算法设计，实际上是对元素特征选取的一种建模。通过设计合适的数据结构，使得多样本能够反映到模板中去。

这个算法是两年前设计的，现在看起来实际上问题蛮多的，例如：

* 无法使用组合特征，即要求元素同时满足满足多个条件
* 没有设计合理的泛化机制
* 模板不可读

等，所以，我并不打算使用这个算法。

只不过，最近些年，看到很多数据提取的公司，特别是国内的数据提取平台，还在停留在非常初级的 css selector 或者 xpath 点选生成。希望这篇文章能抛砖引玉，提供一些新的思路，为数据抽取提供更易用有效的工具。

完。