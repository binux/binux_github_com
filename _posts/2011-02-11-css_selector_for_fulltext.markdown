---
comments: true
date: 2011-02-11 13:19:06
layout: post
slug: css_selector_for_fulltext
title: CssFullText - CSS选择器 说明
wordpress_id: 10001
categories:
- 未分类
tags:
- css
- css selector
---

## CSS Selector 简介：




CSS 选择器( css selector) 是CSS的灵魂。对于一个HTML页面来说，CSS选择器是方便的元素(element)选取工具。




## 支持的选择器类型：






* 派生选择器 ( E F)
* id 选择器 ( E#id )
* 类选择器 ( E.class )
* 属性选择器 ( E[attr=val] )




暂时不支持伪类选择器( E:last )。




## 选择器语法简介：




### 派生选择器




派生选择器用于根据元素的上下文关系定位元素。  
HTML 代码:



    
    <form>
      <label>Name:</label>
      <input name="name" />
      <fieldset>
          <label>Newsletter:</label>
          <input name="newsletter" />
     </fieldset>
    </form>
    <input name="none" />




**选择器：**form input  
**选择元素：**`<input name="name" />`, `<input name="newsletter" />`




也可以使用子类选择器( E > F )，仅选择元素的子元素，而不会选取其孙子元素  
对于以上代码， **选择器：**form > input  
**选择元素：**`<input name="name" />`




### id 选择器




id 选择器用于选取特定id的元素。  
HTML 代码:



    
    <div id="notMe"><p>id="notMe"</p></div>
    <div id="myDiv">id="myDiv"</div>




**选择器：**#myDiv  
**选择元素：**`<div id="myDiv">id="myDiv"</div>`




### 类选择器




类选择器用于选取拥有特性class的元素。  
HTML 代码:



    
    <div class="notMe">div class="notMe"</div>
    <div class="Me myClass">div class="Me myClass"</div>
    <span class="myClass">span class="myClass"</span>




**选择器：**.Me  
**选择元素：**`<div class="Me myClass">div class="Me myClass"</div>`




### 属性选择器




选择包含特定属性的元素，不支持在同一个选择器中使用多个属性选择器（ span[hello="Cleveland"][goodbye="Columbus"] ）  
\[attribute\]         包含属性  
\[attribute=value\]         属性等于特定值的元素  
\[attribute~value\]         匹配给定的属性包含特定值的元素  
\[attribute!value\]         匹配给定的属性不包含特定值的元素（not~ ）  
\[attribute|value\]         匹配如"lang"属性中的en, en-US, en-cockney  
\[attribute^value\]         匹配给定的属性以特定值开头的元素  
\[attribute$value\]         匹配给定的属性以特定值结尾的元素  
\[attribute\*value\]         匹配给定的属性的值中包含给定的字符串  
**例子**  
参见：[http://www.w3.org/TR/CSS2/selector.html#attribute-selectors](http://www.w3.org/TR/CSS2/selector.html#attribute-selectors)
