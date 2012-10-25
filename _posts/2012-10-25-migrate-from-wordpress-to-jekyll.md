---
layout: post
title: "从wordpress迁移到jekyll"
description: ""
category: 
tags: [migrate, wordpress, jekyll]
---
{% include JB/setup %}

又到月末了，这一个月还没写blog呢。。虽然这段时间发生了很多事

+ 做了一个外包
+ 回了一趟家
+ 公司要搬家了

不过因为沉迷了半个月的D3，一个月的WOW，人变懒了。再加上wordpress的html写作方式搞得我非常没有写blog的欲望，一直想迁移到jekyll用markdown来写。为了每个月写一篇blog的目标，于是下决心迁移。。


由于jekyll太简单了，工具又少，不能立即使用，于是用[jekyllbootstrap](http://jekyllbootstrap.com/)作为基础。另一个热门的选择是[Octopress](http://octopress.org/)。

不过这两都太jekyll了，于是把原来wordpress的主题以前迁移了过来。


## 迁移准备

首先，**迁移评论**，在使用wordpress时就开始准备，把评论导入disqus，然后用disqus替换wordpress的评论系统，工作了一周没有问题之后开始迁移。

## 安装
**安装jekyll本地环境**，参照[https://github.com/mojombo/jekyll/wiki/install](https://github.com/mojombo/jekyll/wiki/install)即可。**为了语法高亮，把Pygments也装上**


**安装JB**，跟着jekyllbootstrap首页上的[Zero to Hosted Jekyll Blog in 3 Minutes](http://jekyllbootstrap.com/)做就好了

## 迁移
**将wordpress内容导出成xml文件**

**将xml变成markdown**:[https://github.com/thomasf/exitwp](https://github.com/thomasf/exitwp)

## 开始使用
`jekyll --server` 然后访问本地 `http://localhost:4000/` 看看效果。
因为用了jekyllbootstrap，可以去 [http://themes.jekyllbootstrap.com/](http://themes.jekyllbootstrap.com/) 选择主题安装


`rake post title="asdfasdf"` 新建文章<br>
`rake page name="adsfasdf/asdf"` 新建页面<br>
然后就是用任何编辑器开始编写了

对了，发现maruku对于解析有中文的list，比如开头的那个，有bug，而且github的效果和本地是不完全一样的。。即使是markdown也问题多多啊。。

## 上传github
把整个git项目push上去就好，不过后来发现_site文件夹是不需要的，github会自己重新生成一遍。这样就不需要每次都几千行改动了。