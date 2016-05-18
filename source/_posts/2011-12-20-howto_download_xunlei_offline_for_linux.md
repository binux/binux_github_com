---
comments: true
date: 2011-12-20 22:28:09
layout: post
slug: howto_download_xunlei_offline_for_linux
title: '[教程] Linux下使用aria2+loli.lu免费下载迅雷离线资源'
wordpress_id: 26041
categories:
- 未分类
---

> loli.lu已关闭！  
> 如需使用迅雷会员功能，请[购买迅雷会员服务](http://vip.xunlei.com/)  
> 如需在OSX，Linux环境下下载迅雷离线，请参阅[ThunderLixianExporter](/2012/07/thunderlixianexporter/)


对于Linux用户，无论你用不用Windows，都不会不知道迅雷和迅雷离线。
面对国内这苦B的网络环境，用http,ftp太慢，bt,ed2k过期，想用迅雷，额。。没客户端。。渣一样的客户端，用浏览器下吧，下一半断了还不能多线程，用命令行又有cookie验证。。。

这篇教程旨在帮助大家打造一个方便的高速下载平台，下载工具采用多线程的aria2c，中转网站采用[loli.lu](https://loli.lu)（迅雷离线分享）的导出功能，方便地解决这个问题。




### 工具介绍




#### aria2


[aria2c](http://aria2.sourceforge.net)是一个跨平台开源，**多线程**，多协议支持的下载器。
支持包括HTTP/HTTPS, FTP, BitTorrent多种内容的下载，并且支持多来源，多线程，有[丰富的前端](http://sourceforge.net/apps/trac/aria2/wiki#GUIFrontends)可供选用。



#### loli.lu


是我在[Martian](http://4321.la/)支持下共同创建的一个迅雷离线下载分享的[开源](https://github.com/binux/lixian.xunlei)项目。旨在帮助Linux和MAC用户更好的适用迅雷离线的丰富资源。
通过这个项目的中转，你可以**免费获得**可供下载的迅雷离线地址，并且可以将地址分享给好友进行下载。



### 安装aria2


如果您的发行版带有包管理器，aria2很有可能已经包含在源中，直接安装即可。例如来自[http://sourceforge.net/apps/trac/aria2/wiki/Download](http://sourceforge.net/apps/trac/aria2/wiki/Download)的安装说明：


>   **Debian and Ubuntu**<br>
>   apt-get install aria2

>   **Fedora**<br>
>   yum install aria2

>   **Mandriva**<br>
>   urpmi aria2

>   **Arch**<br>
>   pacman -S aria2

>   **Gentoo**<br>
>   emerge aria2

>   **OpenSUSE**<br>
>   Build Service http://download.opensuse.org/repositories/network:/utilities/

>   **Lunar Linux**<br>
>   lin aria2

>   **AgiliaLinux**<br>
>   mpkg-install aria2

>   **FreeBSD**<br>
>   [http://www.freebsd.org/cgi/cvsweb.cgi/ports/www/aria2/](http://www.freebsd.org/cgi/cvsweb.cgi/ports/www/aria2/)

>   **Mac OS X**<br>
>   [http://www.macports.org/](http://www.macports.org/)

>   **Fink**<br>
>   [http://pdb.finkproject.org/pdb/package.php/aria2](http://pdb.finkproject.org/pdb/package.php/aria2)

>   **Cygwin**<br>
>   [http://sourceware.org/cygwin/packages/aria2/](http://sourceware.org/cygwin/packages/aria2/)



如果您的发行版很不幸的不在上述发行版中，请前往[http://sourceforge.net/projects/aria2/files/stable/](http://sourceforge.net/projects/aria2/files/stable/)尝试适用源码安装。

当您安装完成之后输入

    
    
    aria2c -v
    


出现

    
    
    aria2 version 1.13.0
    Copyright (C) 2006, 2011 Tatsuhiro Tsujikawa
    
    ......
    


表明安装成功，注意，由于aria2在1.10后参数变化，而我们的Loli.lu导出的是新的参数设定，**需要aria2的版本高于1.10**。




### 获取下载链接


访问：[https://loli.lu/](https://loli.lu/)，点击右上角的登录，使用Google账户授权：
[![login](http://s0.binux.me/201112/2890/14223_z.png)](http://s0.binux.me/201112/2890/14223_o.png)

然后点击想要下载的资源，在弹出的浮动框中的批量下载中，点击aria2的链接：
[![get link](http://s1.binux.me/201112/2890/14224_o.png)](http://s1.binux.me/201112/2890/14224_o.png)

之后，浮动框中会输出这个资源的所有aria2的链接：

    
    
    aria2c -c -x5 --out \[SumiSora\]\[C3\]\[01\]\[GB\]\[x264\_aac\]\[720p\]\(5393D704\)\.ass --header 'Cookie:gdriveid=4B281B37A54B63BF6F47BBF2A8A22675;' 'http://gdl.lixian.vip.xunlei.com/download?fid=umOXSXI/nn0XdbUzcpjfYhEs+g2K7wAAAAAAAFEZlKH8Vp3sMEiGuAwWb4ynfSaB&mid;=666&threshold;=150&tid;=F0991DB1D9D3D750F20EB62624DE99D4&srcid;=4&verno;=1&g;=511994A1FC569DEC304886B80C166F8CA77D2681&scn;=c8&i;=59B01E2CB9D2E7B1B5A83016DF97D4D445BAE247&t;=6&ui;=191942368&ti;=50569010689&s;=61322&m;=0&n;=01145C8D0C6F72615D3A72D7025B30315D3A76A6025B783236556E853E635D5B3753019402283533395275D36F34292E611242E45F00000000'
    aria2c -c -x5 --out \[SumiSora\]\[C3\]\[01\]\[GB\]\[x264\_aac\]\[720p\]\(5393D704\)\.mkv --header 'Cookie:gdriveid=4B281B37A54B63BF6F47BBF2A8A22675;' 'http://gdl.lixian.vip.xunlei.com/download?fid=2QPCJq1fI2pyx9Nbr9XkGGw/NgK7SEMVAAAAAIc3sATS9kleYgkLISA6zY0DXbEj&mid;=666&threshold;=150&tid;=7568C4810EDDE63A3C2982ADE0BF4234&srcid;=4&verno;=1&g;=8737B004D2F6495E62090B21203ACD8D035DB123&scn;=c10&i;=59B01E2CB9D2E7B1B5A83016DF97D4D445BAE247&t;=6&ui;=191942368&ti;=50569010689&s;=356731067&m;=0&n;=01145C8D0C6F72615D3A72D7025B30315D3A76A6025B783236556E853E635D5B3753019402283533395275D36F34292E6D0A47E45F00000000'
    ......
    



**现在开始下载吧**，先新建一个目录，比如

    
    
    mkdir -p '[澄空学园][C3-魔幻三次方-][01-12][GB][720p MKV][全]'
    cd '[澄空学园][C3-魔幻三次方-][01-12][GB][720p MKV][全]'
    


然后粘贴入这些命令

    
    
     *** Download Progress Summary as of Tue Dec 20 22:10:06 2011 ***               
    ================================================================================
    [#1 SIZE:8.7MiB/340.2MiB(2%) CN:5 SPD:170.6KiBs ETA:33m08s]
    FILE: /home/binux/work/lixian.xunlei/[SumiSora][C3][01][GB][x264_aac][720p](5393D704).mkv
    --------------------------------------------------------------------------------
    
    [#1 SIZE:11.9MiB/340.2MiB(3%) CN:5 SPD:142.4KiBs ETA:39m20s]
        SIZE:文件大小，进度      CN:线程数 SPD:速度      ETA:剩余时间
    



对了，如果如果中间打断一个任务，只要在原来的目录下，再次执行下载命令就可以继续下载了。
如果一个任务的连接过多，也可以考虑建一个文件先保存起来，然后sh down.sh这样下载就好了。




### 添加资源


在登录后就可以在右上角找到添加资源的链接啦
[![bar](http://s0.binux.me/201112/2890/14223_z.png)](http://s0.binux.me/201112/2890/14223_o.png)
![add task](http://s1.binux.me/201112/2890/14225_o.png)
当然了，如果觉得麻烦，也可以直接填写链接获得高速下载链接：
![add task 2](http://s0.binux.me/201112/2890/14227_o.png)

对了，及时不是发布资源，获得的下载链接依旧可以分享给好友，只需要点击分享按钮，将链接复制给好友就可以了。
当然你也可以适用我们的一键分享功能：
[![share](http://s3.binux.me/201112/2890/14228_o.png)](http://s3.binux.me/201112/2890/14228_o.png)




### ===


如果有任何问题，欢迎留言，或[+足兆叉虫](http://gplus.to/binux)
或者直接提交BUG：[https://github.com/binux/lixian.xunlei/issues](https://github.com/binux/lixian.xunlei/issues)
