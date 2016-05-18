---
comments: true
date: 2011-12-14 14:19:07
layout: post
slug: from_xunlei_lixian_for_flexget
title: 迅雷离线脚本+flexget 将离线资源自动下载回本地
wordpress_id: 26001
categories:
- 未分类
tags:
- flexget
- Linux
- lixian
- python
- xunlei
---

**<font color=red>OUT OF DATA</font>**

这个也是一篇教程，上接 "[让资源灌满你的离线空间吧 — 迅雷离线插件 for flexget](http://blog.binux.me/2011/12/xunlei_lixian_for_flexget/)"。需要的工具依旧是flexget和lixian.xunlei插件。

本文是应+[平芜泫](https://plus.google.com/u/0/111086731636961623060)的需求，自动将迅雷离线里面的文件下载回vps，然后再从教育网用IPV6下回本地。前两步不再复述，参考前文的步骤即可，直接步骤3。先上配置文件：

    
    feeds:
      some_name:
        from_xunlei_lixian:
          username: "<your username>"
          password: "<your password>"
          limit: 30
          fields:
            base_path: /home/me/downloads
        accept_all: true
        exec:
          auto_escape: yes
          on_output:
            for_accepted: mkdir -p {{ fields.base_path }}/{{ taskname }} && aria2c -c -x5 --out '{{ fields.base_path }}/{{ taskname }}/{{ title }}' --header '{{ cookie }}' '{{ url }}'


这又是一个yaml的配置文件，其中from_xunlei_lixian是input，accept_all是过滤器，而exec作为输出来进行下载。

from_xunlei_lixian中，limit限制一次取出多少条结果，fields可以将里面的参数传递到output中。
output中可以使用的字段包括



	
  * title         文件名

	
  * url           离线地址

	
  * cookie     下载所需要的cookie

	
  * taskname 所属的任务名（比如BT）

	
  * size         文件大小

	
  * format     文件格式（不准确）

	
  * fields       在上文中设置的那些东西


exec的文档在[http://flexget.com/wiki/Plugins/exec](http://flexget.com/wiki/Plugins/exec)，auto_escape可以escape掉文件名中的奇怪字符，on_output和for_accepted对每一个文件进行下载任务。



指令中：


>  mkdir -p {{ fields.base_path }}/{{ taskname }}


用于在base_path下创建一个以taskname命名的文件夹，这样BT这样多文件的时候就会下载到同一个目录下了。


> aria2c -c -x5 --out '{{ fields.base_path }}/{{ taskname }}/{{ title }}' --header '{{ cookie }}' '{{ url }}'


使用aria2c使用5个线程，将文件下载到本地。当然，也可以使用wget，这么写就可以了：


> wget -c -O ' {{ fields.base_path }}/{{ taskname }}/{{ title }}' --header '{{ cookie }}' '{{ url }}'




好了，现在运行flexget --test试试吧，flexget会输出将要执行的命令，但是并不会真正的执行，可以作为测试。

可能你的离线空间里面已经积累了大量已经下载回本地的文件，重新下一遍是没有意义的，对吧，来试试这个命令：


> flexget --learn


这样可以跳过下载步骤，但是这些文件依旧会记录下来，再执行flexget的时候就只会下载之后添加的文件了。
