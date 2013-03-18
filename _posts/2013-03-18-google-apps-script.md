---
layout: post
title: "Google Apps Script"
description: ""
category: 
tags: [GAS, google_apps_script, javascript]
---
{% include JB/setup %}

[#google你个sb](/2012/11/google-sb/) 把Google Reader关闭了，就像 [#google你个sb](/2012/11/google-sb/) 里说的，**永远不要相信有什么免费的东西，即使他是google提供的**。比如今天介绍的这个 [Google Apps Script](https://developers.google.com/apps-script/)，请不要相信它能长久运行下去，请准备好迁移的方案。

## Google Apps Script

简称GAS，是一个JavaScript脚本驱动的云平台，通过GAS可以方便的连接Google和其他各种服务，执行各种自动化的任务。

平台API提供了：  

* Google服务访问（mail, docs, charts, maps, calendar甚至还有翻译）
* 界面
* 数据库
* [**urlfetch**](https://developers.google.com/apps-script/service_urlfetch)！（可以post、可以修改header、可以修改body、甚至有一个帮助使用OAuth的类）
* [定时任务](https://developers.google.com/apps-script/execution_time_triggers)、[触发器](https://developers.google.com/apps-script/execution_container_triggers)
* 可以发布为[web apps](https://developers.google.com/apps-script/execution_web_apps)，可以获得get、post参数等

甚至还有cache、lock，俨然要什么有什么啊！虽然有[配额](http://docs.google.com/macros/dashboard)限制，虽然HTML会被 [重新渲染](https://developers.google.com/apps-script/html_service#Caja)，无法在页面中完整使用JavaScript，但是，冲着免费的 [urlfetch](https://developers.google.com/apps-script/service_urlfetch) 和 [定时任务](https://developers.google.com/apps-script/execution_time_triggers) 就大有可为啊！我能想到的各种应用可以有：

* RSS转烧
* 各种HTTP代理，转换，绕过
* 数据统计、采集
* 各种WebHook的定时触发、检测HTTP服务是不是挂了
* 各种ifttt功能（特别是google自己的服务之间的）
* 建一个简单的动态网站，或者给自己的静态网站提供直接API

只要你想，大有可为。  
API请参考 [Default Services](https://developers.google.com/apps-script/defaultservices)，上方的 [Execution Methods for Scripts](https://developers.google.com/apps-script/execution_methods) 等文章对环境以及常见的需求有一些介绍，建议阅读。

## 应用示例

### RSS转烧

虽然HTML输出有限制，但 [XML、JSON、JSONP](https://developers.google.com/apps-script/content_service) 却没有限制的，配合 [urlfetch](https://developers.google.com/apps-script/service_urlfetch)，非常适合用来做RSS转烧，全文输出（这里建议用上缓存或者数据存储）等功能。

**示例：**
[yande.re高画质转烧](https://script.google.com/macros/s/AKfycbys9aUHz-WVB2j6qIKOE4-ZVtEjRrLz8VeSph26WrivKFIlH0U/exec) / [源码](https://script.google.com/d/1A-j39cTR8lnmJMaAodHHcjpyRyEoeTtZB4AE8RR4klKYxdZtbEklGHYb/edit?usp=sharing)  
**发布指南：**

1. 阅读[Deploying Your Script as a Web App](https://developers.google.com/apps-script/execution_web_apps#deploying)
2. 以自己的身份执行、访问权限为允许匿名

**说明：**这里展示的是图站 [yande.re](https://yande.re/) 的sample画质输出以及title修改，这是我的第一个脚本，这里稍微尝试了一下环境以及urlfetch的功能，应该还是蛮简单的。更多转烧：

[danbooru](https://script.google.com/macros/s/AKfycbw4yYvSaKebIaHrlzM0BRJcb8DraGST_3EFHlIBX7ZRZ4JKlGk/exec) [源码](https://script.google.com/d/1HT85VFrLj_5kHH2ek3ONGgnHGhSSnYooZT_6ywCe-EOHIbvDvVrv1CX_/edit?usp=sharing)  
[konachan](https://script.google.com/macros/s/AKfycby56iyEAOfVKpjspuV7e_vzfSLBOel4x02AXzFW1UoEfMJSwGnj/exec) [源码](https://script.google.com/d/1PZBEnh63gfP9N6RpkgFlyoim_IpSrke5KxMjGUC_ApgGNoNnodfil3v1/edit?usp=sharing)

### reader2gplus
自动将Google Reader中加星的条目同步到Google+上（反正Google Reader也快死了。。这个也用不了多久了吧。。）

**示例：**[reader2gplus](https://script.google.com/macros/s/AKfycbxWjsB7_8CHlgnyKo_AVFlgf8VPm5ZQ4OuNG1xL_7NKXG6prVw/exec) / [源码](https://script.google.com/d/1FZad9bf60QJPRs-CcX9q8Q3qFS6-oMBYi5n3DNVoqZC2Wac0YFLXrJkW/edit?usp=sharing)  
**发布指南：**

1. 阅读[Deploying Your Script as a Web App](https://developers.google.com/apps-script/execution_web_apps#deploying)
2. 首先前往 [Google API Console](https://code.google.com/apis/console/) 生成一个API，启用Google+ API，并为其生成一个Web Apps的key
3. 在script脚本编辑页面中，Project Properties新建两个key：client_id, client_secret，填写上一步生成的key和secret
4. 发布为以访问者身份执行，分享您fork的脚本与访问权限相一致

**说明：**这里使用了 [urlfetch](https://developers.google.com/apps-script/service_urlfetch) 更多的参数，实现了OAuth2.0认证，尝试了一下 [Google+的新API](https://developers.google.com/+/api/latest/moments)，使用了 [定时任务](https://developers.google.com/apps-script/execution_time_triggers) 、GET参数、[界面](https://developers.google.com/apps-script/html_service) 以及 [用户数据存储](https://developers.google.com/apps-script/script_user_properties#userProperties) 。

### 迅雷离线预约下载
自动将迅雷离线中完成的任务添加到Aria2上

**示例：**[xunlei2aria2](https://script.google.com/macros/s/AKfycbxqWzZ6CSVaXtUBO313S8bFhleYXzv5CbfeLpEs4_WVfnTYeco/exec) / [源码](https://script.google.com/d/18pQAmp0THrjN148xoBFCgsUWJ__Xgi1nsih8WrOEM6eWVDziDPVDXc42/edit?usp=sharing)  

**使用说明：**

1. 访问示例页面，将【】中的脚本拖拽到书签栏中保存
2. 访问迅雷离线页面（建议先新建一个文件夹），登陆，点击书签
3. 选择要预约的文件夹，填写[JSON-RPC地址](http://binux.github.com/yaaw/)（**需要能被外网访问**）
4. 将需要下载到aria2中的任务添加或移动到预约的文件夹中，当文件从文件夹消失，文件已经被添加到aria2中了

**发布指南：**

1. 阅读[Deploying Your Script as a Web App](https://developers.google.com/apps-script/execution_web_apps#deploying)
2. 发布为以访问者身份执行，分享您fork的脚本与访问权限相一致

**说明：**终于到了一个比较实用的脚本了，这里演示的是urlfetch真正有用的地方——跨API操作。所有的东西在reader2gplus中都已经用过了，但是结构要比reader2gplus好不少。


## 总结
GAS比起 [GAE](http://appengine.google.com) 更加简单，但是功能足够强大，通过在线的调试器，写一两行代码比GAE要轻松不少。我JavaScript是在 [w3school](http://www.w3school.com.cn/index.html) 学的，完全野生程序猿，在这里只是为了抛砖引玉，希望您能通过 GAS 能玩出更多有意思的东西。


