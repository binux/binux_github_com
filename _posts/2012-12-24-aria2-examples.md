---
layout: post
title: "aria2配置示例"
description: ""
category: 
tags: [aria2, yaaw]
---
{% include JB/setup %}

其实面对man的存在，写什么总结完全没有必要，一切宝藏都在[manual](http://aria2.sourceforge.net/manual/en/html/aria2c.html)。不过反正不会有人会读就是了。那我就写一下吧

##基础
首先，aria2或者叫做aria2c，它是一个下载器，嗯。  
常用的两种模式是直接下载，比如 `aria2c "http://host/file.zip"` 这样，当它完成后就退出了，就像wget（估计你们也不知道吧）那样。  
另一种就是rpc server模式，特点就是，它启动之后什么都不干，然后等着从rpc接口添加任务，下载完也不退出，而是一直等着。对，就像迅雷干的那样，当然，它不会上传你硬盘上的数据。

因为第一种方式要每次都敲命令，除非像我是原生*nix，没有命令行就没法用电脑，估计也没什么用，于是常用的就是第二种。一般启动命令是 `aria2c --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all -c -D` 。但是，其实**这个命令是不好的！不要使用这种启动方式。**  
首先，用命令方式导致配置不方便修改保存，`-D`导致无法看到出错信息。

**推荐启动方式是使用配置文件** `$HOME/.aria2/aria2.conf` 。嗯，我知道路由上这个地址是无法修改或者重启后会丢失的，那么你可以放到别的地方，然后 `aria2c --conf-path=<PATH>` 注意 `<PATH>` 填完整路径，因为鬼知道这个程序是从那个路径启动的。`-D` (用于后台执行, 这样ssh断开连接后程序不会退出） 只有在确认OK之后在启动脚本中使用。

**以下方案都基于配置文件方式**

##图形界面
aria2是没有图形界面的，已知相对好用的图形界面有：

* 我的[YAAW](http://blog.binux.me/yaaw/)
* 另一个web前端[webui-aria2](http://ziahamza.github.com/webui-aria2/)

**请使用chrome，firefox等现代浏览器访问。**这两个东西都可以直接使用，除了看英文不爽以外，有什么必要下载回来使用？（吐槽：难道你们就不觉得webui-aria2的title总是被压成好几行，诡异的配色（对，说的就是那个蓝色背景，深蓝颜色的 `Use custom IP and port settings` 按钮）不难看吗？）  
**这两个东西上的配置在重启后都会失效!** 使用配置文件保存您的设置

* windows下有[Aria2c Remote Control](http://sourceforge.net/projects/aria2cremote/)
* iphone有[Aria2 Download Manager](https://itunes.apple.com/us/app/aria2-download-manager-remote/id525944692)

图形界面基本都基于RPC模式，所以一定**确定开启了RPC，IP端口可访问，并且在管理器中填写了正确的地址**。

##配置

**请将所有配置置于配置文件中**  
**只有在确认配置无误后再加上 `-D` 选项**  
**请阅读出错信息!**


###RPC
**需要1.14及以上版本**  
[http://aria2.sourceforge.net/manual/en/html/aria2c.html#rpc-options](http://aria2.sourceforge.net/manual/en/html/aria2c.html#rpc-options)

{% highlight bash %}
#允许rpc
enable-rpc=true
#允许所有来源, web界面跨域权限需要
rpc-allow-origin-all=true
#允许非外部访问
rpc-listen-all=true
#RPC端口, 仅当默认端口被占用时修改
#rpc-listen-port=6800
{% endhighlight %}

如果启动时出现 `Initializing EpollEventPoll failed.` 或相似错误, 在配置中加上 `event-poll=select`


如果需要使用密码验证（需要1.15.2以上版本）

{% highlight bash %}
#用户名
rpc-user=username
#密码
rpc-passwd=passwd
{% endhighlight %}
在YAAW中使用 `http://username:passwd@hostname:port/jsonrpc` 的地址格式设置密码.  
对于RPC模式来说, 界面和后端是分离的, 只要给后端设置密码即可. 前端认证什么的是毫无意义的.  
如果你比较新潮, 在YAAW中也可以用 `ws://` 为前缀,只用websocket连接aria2c, 如果你不知道websocket是什么. 那就算了.

###速度相关
{% highlight bash %}
#最大同时下载数(任务数), 路由建议值: 3
max-concurrent-downloads=5
#断点续传
continue=true
#同服务器连接数
max-connection-per-server=5
#最小文件分片大小, 下载线程数上限取决于能分出多少片, 对于小文件重要
min-split-size=10M
#单文件最大线程数, 路由建议值: 5
split=10
#下载速度限制
max-overall-download-limit=0
#单文件速度限制
max-download-limit=0
#上传速度限制
max-overall-upload-limit=0
#单文件速度限制
max-upload-limit=0
#断开速度过慢的连接
#lowest-speed-limit=0
#验证用，需要1.16.1之后的release版本
#referer=*
{% endhighlight %}

###进度保存相关
aria2c只有在正常退出时(ctrl-c), 突然断电是无法保存进度的. 在第一次使用的时候会出现会话文件不存在的错误, 手动创建一个空文件即可. 如果您编写的是自动启动脚本, 在启动aria2前加上 `touch aria2.session` 这句命令.

{% highlight bash %}
input-file=/some/where/aria2.session
save-session=/some/where/aria2.session
#定时保存会话，需要1.16.1之后的release版
#save-session-interval=60
{% endhighlight %}

###磁盘相关

{% highlight bash %}
#文件保存路径, 默认为当前启动位置
dir=/some/where
#文件缓存, 使用内置的文件缓存, 如果你不相信Linux内核文件缓存和磁盘内置缓存时使用, 需要1.16及以上版本
#disk-cache=0
#另一种Linux文件缓存方式, 使用前确保您使用的内核支持此选项, 需要1.15及以上版本(?)
#enable-mmap=true
#文件预分配, 能有效降低文件碎片, 提高磁盘性能. 缺点是预分配时间较长
#所需时间 none < falloc ? trunc << prealloc, falloc和trunc需要文件系统和内核支持
file-allocation=prealloc
{% endhighlight %}

###BT相关
[http://aria2.sourceforge.net/manual/en/html/aria2c.html#bittorrent-specific-options](http://aria2.sourceforge.net/manual/en/html/aria2c.html#bittorrent-specific-options)

{% highlight bash %}
#启用本地节点查找
bt-enable-lpd=true
#添加额外的tracker
#bt-tracker=<URI>,…
#单种子最大连接数
#bt-max-peers=55
#强制加密, 防迅雷必备
#bt-require-crypto=true
#当下载的文件是一个种子(以.torrent结尾)时, 自动下载BT
follow-torrent=true
#BT监听端口, 当端口屏蔽时使用
#listen-port=6881-6999
{% endhighlight %}

aria2亦可以用于PT下载, 下载的关键在于伪装

{% highlight bash %}
#不确定是否需要，为保险起见，need more test
enable-dht=false
bt-enable-lpd=false
enable-peer-exchange=false
#修改特征
user-agent=uTorrent/2210(25130)
peer-id-prefix=-UT2210-
#修改做种设置, 允许做种
seed-ratio=0
#保存会话
force-save=true
bt-hash-check-seed=true
bt-seed-unverified=true
bt-save-metadata=true
#定时保存会话，需要1.16.1之后的某个release版本（比如1.16.2）
#save-session-interval=60
{% endhighlight %}

##常见问题
###Internal server error
手动访问你的JSON-RPC地址 `http://hostname:port/jsonrpc?jsoncallback=1` 如果没有返回, 请确认aria2是否启动以及连通性. 如果aria2在路由器后或没有公网IP, 请做好端口映射.

###如何使用迅雷离线

[http://binux.github.com/ThunderLixianExporter/](http://binux.github.com/ThunderLixianExporter/)
安装后, 在迅雷离线的右上角的设置中设置RPC地址.  
提供chrome插件: [https://chrome.google.com/webstore/detail/thunderlixianassistant/eehlmkfpnagoieibahhcghphdbjcdmen](https://chrome.google.com/webstore/detail/thunderlixianassistant/eehlmkfpnagoieibahhcghphdbjcdmen)

###如何使用旋风离线(QQ离线)
[http://userscripts.org/scripts/show/142624](http://userscripts.org/scripts/show/142624)安装脚本后, 在旋风离线页面使用.

###如何安装aria2
我也不知道, 看你的box上有什么开源包管理器之类的东西, 有什么用什么. 如果没有, google之, 如果没有, 放弃吧.
