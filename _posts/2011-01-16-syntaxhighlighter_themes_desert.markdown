---
comments: true
date: 2011-01-16 08:35:40
layout: post
slug: syntaxhighlighter_themes_desert
title: SyntaxHighlighter/HighSyntax themes - VIM desert
wordpress_id: 5001
categories:
- 未分类
tags:
- css
- Linux
- themes
- vim
---

[![HighSyntaxThemesDesertDemo](http://binuximage.appspot.com/img/5001-HighSyntaxThemesDesert.png)](http://binuximage.appspot.com/img/5001-HighSyntaxThemesDesert.png)




### 前言




一直很喜欢vim的desert的配色，特别是它的comments天蓝色的配色，用了下[SyntaxHighlighter](http://alexgorbatchev.com/wiki/SyntaxHighlighter)的RDark也不是很满意。于是拿它改了一下。  
顺便修改了以下边框，原来的第一行和边框上沿太接近了，于是给加了一行。。。
    
    /**
     * Desert SyntaxHighlighter theme based on color scheme by Hans Fugal
     * http://www.vim.org/scripts/script.php?script_id=105
     * Modified by Binux (http://binux.appspot.com/) 2011.1.16
     */

根据vim color scheme desert修改而成。




### 使用方法




#### SyntaxHighlighter




1、下载css文件，更名为shThemeDesert.css  
2、将css拷贝至styles目录，在页面中引用即可。




#### HighSyntax plugin for Micolog




1、下载css文件，更名为shThemeDesert.css  
2、将css添加至micolog/plugins/highsyntax/syntaxhighlighter.zip压缩文件的styles目录中。  
3、修改micolog/plugins/highsyntax/highsyntax.py，在54行添加高亮部分：
    
{% highlight html %}
<select name="theme" id="theme">
    <option value="Default">Default</option>
    <option value="Django">Django</option>
    <option value="Eclipse">Eclipse</option>
    <option value="Emacs">Emacs</option>
    <option value="FadeToGrey">FadeToGrey</option>
    <option value="Midnight">Midnight</option>
    <option value="RDark">RDark</option>
    <option value="Desert">Desert</option>
</select>
{% endhighlight %}




3、在设置中启用即可




### 下载链接




> [http://binuximage.appspot.com/data/3001-shThemeDesert.css](http://binuximage.appspot.com/data/3001-shThemeDesert.css)

