---
comments: true
date: 2011-01-23 12:25:43
layout: post
slug: gentoo_rtorrent_ipv6_support
title: Gentoo rtorrent IPV6 支持
wordpress_id: 8001
categories:
- 未分类
tags:
- gentoo rtorrent
---

问题：




> gentoo中rtorrent连接ipv6 tracker的时候显示"Track :Couldn't resolve host name"




解决：




既然是gentoo那么就用gentoo的emerge解决吧






  1. 去[http://libtorrent.rakshasa.no/ticket/1111](http://libtorrent.rakshasa.no/ticket/1111)找对应版本的补丁（注意，补丁修改了多次，尽量使用最新的。第一个版本甚至无法编译通过）


  2. 将补丁下载到portage的目录


    
    cd /usr/portage/net-libs/libtorrent/files
    # 请使用最新版本的补丁
    wget http://home.samfundet.no/~sesse/libtorrent-0.12.6-ipv6-07.patch
    mv libtorrent-0.12.6-ipv6-07.patch libtorrent-0.12.6-ipv6.patch
    
    cd ..



  3. 修改ebuild文件


    
    src_prepare() {
        epatch "${FILESDIR}"/${P}-gcc44.patch
        epatch "${FILESDIR}"/${P}-ipv6.patch
        elibtoolize
    }



  4. 重新生成签名, 重新emerge


    
    ebuild libtorrent-0.12.6.ebuild digest
    emerge libtorrent











同理修改rtorrent



    
    cd /usr/portage/net-p2p/rtorrent/files
    # 请使用最新版本的补丁
    wget http://home.samfundet.no/~sesse/rtorrent-0.8.6-ipv6-07.patch
    mv rtorrent-0.8.6-ipv6-07.patch rtorrent-0.8.6-ipv6.patch
    
    cd ..



    
    src_prepare() {
        epatch "${FILESDIR}"/${P}-canvas-fix.patch
        epatch "${FILESDIR}"/${P}-ipv6.patch
        elibtoolize
    }



    
    ebuild rtorrent-0.8.6.ebuild digest
    ebuild rtorrent-0.8.6.ebuild merge



