---
title: 少女前线拖尸脚本 和 生成它的可视化工具
date: 2018-10-14 15:22:15
tags: [少女前线,ankulua,ankulua-vision,安卓,自动化,open-source,github]
---

最近在玩少女前线，这是一个手机游戏，over。不是，就真的没有什么好讲的嘛，了解的人早有耳闻，不了解的就只要知道这是个手机游戏就好了，嗯。

然后，我会好好地，正常地，氪金地去玩这个游戏吗？不可能的，玩游戏哪有破解它有意思呢。当年破解 Ingress 是因为它用的 HTTPS 通信的，算是本行。百万亚瑟王是因为别人已经逆向好了，我只是写了一些 bot。现在这么办，玩不了了吗？作为一个不会安卓，不会逆向，不会汇编的菜鸡，那我只好上按键精灵了啊。于是乎，我找到了这个： [AnkuLua](http://ankulua-tw.boards.net/thread/2/ankulua)

> AnkuLua 是一個專注在自動化的Android App
> 基本自動化動作有:
> * 抓取螢幕並找尋指定圖案 
> * 對找圖結果採取使用者要的動作(例如點擊、抓放(drag and drop)、打字...等等)

最重要的是，它能运行 lua 脚本！虽然我是一个不会安卓，不会逆向，不会汇编的菜鸡，但是我会 lua 啊。


### ankulua-vision

不过，在使用过程中发现，找寻指定图案，需要不断截图/裁剪，这样太麻烦了。于是我又用 electron 做了一个可视化的截图资源管理器 [ankulua-vision](https://github.com/binux/ankulua-vision)，像这样的：

![screenshot](https://raw.githack.com/binux/ankulua-vision/master/static/Screenshot.png)

基本思路就是，一般游戏是由众多 UI 界面组成的，点击某个按钮能跳转到某个界面上去。那么通过截图，标注**识别区域**，那么程序就能知道游戏现在所处的界面。通过标注**按钮区域**，那么只需要 `goto('battle')`，程序就能自动规划从当前界面到 battle 的可行路径，然后点啊点啊就完成需要的操作了。这样一方面不需要自己去裁剪图片了，另一方面通过框架代码，在运行过程中能够有更多的错误检查，自动应对可能出现的各种异常。

理论上，对于点啊点的游戏，是能实现无代码的。即使不能，对于复杂的动作，也可以通过 lua 拓展。

源码在这里：https://github.com/binux/ankulua-vision  

你依旧需要在安卓手机或者模拟器中安装 ankulua，然后加载生成的 start.lua 脚本。默认自带了一个简单的循环逻辑，运行后可以直接图形化界面配置运行。当然你也可以通过 lua 脚本拓展，除了 ankulua 本身的 API 可用之外，你也可以使用 `stateMachine` 这套界面跳转逻辑 API，重用简化步骤。`stateMachine` 的 API 在 README 中有简略的文档说明。

![setting screenshot](/assets/image/MuMu20181014200018.png)

源码使用 GPLv3 或 MIT 许可证，取决于第一个有效 PR（例如 fix typo 不算），如果第一个 PR 之前有商业化需求或者 PR 作者要求，则 MIT。


### 少女前线拖尸脚本

**WARNING: 任何使用脚本的行为都是官方禁止的，我不对下文所述任何内容以及其后果负责**

于是，这里就是 少女前线的拖尸脚本：

https://github.com/binux/binux_github_com/releases/download/gf/shojo.zip

同时它也是一个 ankulua-vision 的项目，你可以通过 ankulua-vision 打开这个项目目录，调整截屏或者按钮位置。

#### 脚本实现的功能

* 43e, 02, 52n 拖尸
* 自动重启后勤
* 自动强化或者分解人形
* 自动修理

#### 使用方法

1. 根据 [[填坑结束？][失了智]萌新向拖尸教学帖[更新8-1N相关]](http://bbs.nga.cn/read.php?tid=13670657) 一文准备好打手和阵型，一队练级队，二队补给队，52n 还需要 3 队狗粮队。
2. 解压拷贝脚本到手机中，在 ankulua 中加载 start.lua。
3. 在启动界面中选择你的两个打手（每轮结束后，两个打手会交换），选择拖尸任务，如果仅自动后勤，选择 null 就好了。

其中 52n 会在战斗中撤退 5, 8 号位 （见 NGA 文 "43e的说明" 展开部分），02 在选择 m4a1 时会撤退 1, 7 号位。

![setting screenshot](/assets/image/MuMu20181014200007.png)

然后开始吧！

**WARNING: 任何使用脚本的行为都是官方禁止的，我不对上文所述任何内容以及其后果负责**

over