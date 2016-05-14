---
layout: post
title: "demo.pyspider.org 部署经验"
description: ""
category: 
tags: [pyspider,deployment]
---
{% include JB/setup %}

经常有人会问 [pyspider] 怎么进行分布式部署，这里以 [demo.pyspider.org] 的实际部署经验做一个例子。

因为 [pyspider] 支持分布式部署，为了验证也好，为了省钱多蹭 CPU 也好, [demo.pyspider.org] 通过 docker 部署在同一机房的 3 台 VPS 上，VPS 间有内网传输（实际通过 [tinc]）。

使用 docker 的原因是实际上 pyspider 能够运行任何 python 脚本，至少需要 docker 环境逃逸。

数据库 & 消息队列
===============

demo.pyspider.org 的**数据库为 [PostgreSQL]**，理由是测试目的，磁盘占用和性能的折中。**消息队列为 [Redis]**，因为部署简单。

它们也是跑在 docker 中的：

```
docker run --name postgres -v /data/postgres/:/var/lib/postgresql/data -d -p $LOCAL_IP:5432:5432 -e POSTGRES_PASSWORD="" postgres
docker run --name redis -d -p  $LOCAL_IP:6379:6379 redis
```

由于前面说过，机器间有内网，通过绑定内网 IP，没有做鉴权（反正 demo 会泄露）。

scheduler
=========

由于 scheduler 只能运行一个，并且需要进行大量的数据库操作，它与上面的数据库和消息队列部署在一台单独的机器上。

```
docker run --name scheduler -d -p $LOCAL_IP:23333:23333 --restart=always binux/pyspider \
 --taskdb "sqlalchemy+postgresql+taskdb://binux@10.21.0.7/taskdb" \
 --resultdb "sqlalchemy+postgresql+resultdb://binux@10.21.0.7/resultdb" \
 --projectdb "sqlalchemy+postgresql+projectdb://binux@10.21.0.7/projectdb" \
 --message-queue "redis://10.21.0.7:6379/1" \
 scheduler --inqueue-limit 5000 --delete-time 43200
```

其他组件
=======

所有其他的组件（fetcher, processor, result_worker）在剩余的两台 VPS 上以相同的配置启动。他们都是通过 docker-compose 管理的

```
phantomjs:
  image: 'binux/pyspider:latest'
  command: phantomjs
  cpu_shares: 512
  environment:
    - 'EXCLUDE_PORTS=5000,23333,24444'
  expose:
    - '25555'
  mem_limit: 512m
  restart: always
phantomjs-lb:
  image: 'dockercloud/haproxy:latest'
  links:
    - phantomjs
  restart: always
  
fetcher:
  image: 'binux/pyspider:latest'
  command: '--message-queue "redis://10.21.0.7:6379/1" --phantomjs-proxy "phantomjs:80" fetcher --xmlrpc'
  cpu_shares: 512
  environment:
    - 'EXCLUDE_PORTS=5000,25555,23333'
  links:
    - 'phantomjs-lb:phantomjs'
  mem_limit: 128m
  restart: always
fetcher-lb:
  image: 'dockercloud/haproxy:latest'
  links:
    - fetcher
  restart: always
  
processor:
  image: 'binux/pyspider:latest'
  command: '--projectdb "sqlalchemy+postgresql+projectdb://binux@10.21.0.7/projectdb" --message-queue "redis://10.21.0.7:6379/1" processor'
  cpu_shares: 512
  mem_limit: 256m
  restart: always
  
result-worker:
  image: 'binux/pyspider:latest'
  command: '--taskdb "sqlalchemy+postgresql+taskdb://binux@10.21.0.7/taskdb"  --projectdb "sqlalchemy+postgresql+projectdb://binux@10.21.0.7/projectdb" --resultdb "sqlalchemy+postgresql+resultdb://binux@10.21.0.7/resultdb" --message-queue "redis://10.21.0.7:6379/1" result_worker'
  cpu_shares: 512
  mem_limit: 256m
  restart: always
  
webui:
  image: 'binux/pyspider:latest'
  command: '--taskdb "sqlalchemy+postgresql+taskdb://binux@10.21.0.7/taskdb"  --projectdb "sqlalchemy+postgresql+projectdb://binux@10.21.0.7/projectdb" --resultdb "sqlalchemy+postgresql+resultdb://binux@10.21.0.7/resultdb" --message-queue "redis://10.21.0.7:6379/1" webui --max-rate 0.2 --max-burst 3 --scheduler-rpc "http://o4.i.binux.me:23333/" --fetcher-rpc "http://fetcher/"'

  cpu_shares: 512
  environment:
    - 'EXCLUDE_PORTS=24444,25555,23333'
  links:
    - 'fetcher-lb:fetcher'
  mem_limit: 256m
  restart: always
webui-lb:
  image: 'dockercloud/haproxy:latest'
  links:
    - webui
  restart: always
  
nginx:
  image: 'nginx'
  links:
    - 'webui-lb:HAPROXY'
  ports:
    - '0.0.0.0:80:80'
  volumes:
    - /home/binux/nfs/profile/nginx/nginx.conf:/etc/nginx/nginx.conf
    - /home/binux/nfs/profile/nginx/conf.d/:/etc/nginx/conf.d/
  restart: always
```

然后通过 `docker-compose scale phantomjs=2 processor=2 webui=4` 指定启动两个 phantomjs 进程，两个 processor 进程，4个 webui 进程。

#### phantomjs

由于 phantomjs 有内存泄露问题，限制下内存就好了。`EXCLUDE_PORTS` 是为了下面的 haproxy 能够正确的均衡负载正确端口。

#### phantomjs-lb

通过 [haproxy](https://hub.docker.com/r/dockercloud/haproxy/) 自动负载均衡，只要将服务链接上去，就会将请求分发到不定多个 phantomjs 实例上，同时只暴露一个对外服务端口。

#### fetcher

链接 `phantomjs-lb:phantomjs`，注意这里的 `--phantomjs-proxy "phantomjs:80"`

由于 fetcher 是异步 http 请求，如果没有发生堵塞，单个 fetcher 一般就足够了。

#### fetcher-lb

同 phantomjs-lb

#### processor

processor 为最消耗 CPU 的组件，建议根据 CPU 的数量部署 +1/2 个。

#### result-worker

默认的 result-worker 只是在写数据库，除非发生堵塞，或者你重载了 result_worker，一个就够。

#### webui

首先，webui 为了安全性，限制了最大抓取速率 `--max-rate 0.2 --max-burst 3`。

然后通过实际的 fetcher 进行抓取 `--fetcher-rpc "http://fetcher/"` 而不是 webui 自己发起请求，最大程度模拟环境（IP，库版本），因为以前遇到过调试的时候没问题，跑起来失败，然后在调试器复现又没法复现的问题。fetcher-rpc 可以不用，这样的会 webui 会自己直接发起请求。

因为 demo.pyspider.org 主要就是提供通过页面来尝试 pyspider, 这里的负载较大，而且实现上是同步的，任何脚本执行，抓取都是堵塞了，多一些 webui 会比较好。

#### webui-lb

同 phantpmjs-lb

#### nginx

这里做了一些前端缓存


#### 其他

因为懒得管，每小时我会重启除了 scheduler 以外的其他组件（反正会重试）。




[pyspider]:             https://github.com/binux/pyspider
[demo.pyspider.org]:    http://demo.pyspider.org/
[tinc]:                 http://www.tinc-vpn.org/
[PostgreSQL]:           http://www.postgresql.org/
[Redis]:                http://redis.io/