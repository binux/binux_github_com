---
layout: post
title: "pyspider 爬虫教程（三）：使用 PhantomJS 渲染带 JS 的页面"
description: ""
category: 
tags: [python,pyspider]
---
{% include JB/setup %}

英文原文：[http://docs.pyspider.org/en/latest/tutorial/Render-with-PhantomJS/](http://docs.pyspider.org/en/latest/tutorial/Render-with-PhantomJS/)

在上两篇教程中，我们学习了怎么从 HTML 中提取信息，也学习了怎么处理一些请求复杂的页面。但是有一些页面，它实在太复杂了，无论是分析 API 请求的地址，还是渲染时进行了加密，让直接抓取请求非常麻烦。这时候就是 [PhantomJS] 大显身手的时候了。

在使用 [PhantomJS] 之前，你需要安装它（[安装文档](http://phantomjs.org/download.html)）。当你安装了之后，在运行 `all` 模式的 pyspider 时就会自动启用了。当然，你也可以在 [demo.pyspider.org](http://demo.pyspider.org/) 上尝试。

使用 PhantomJS
--------------

当 pyspider 连上 PhantomJS 代理后，你就能通过在 `self.crawl` 中添加 `fetch_type='js'` 的参数，开启使用 PhantomJS 抓取。例如，在教程二中，我们尝试抓取的 [http://movie.douban.com/explore](http://movie.douban.com/explore) 就可以通过 PhantomJS 直接抓取：

{% highlight python %}
class Handler(BaseHandler):
    def on_start(self):
        self.crawl('http://movie.douban.com/explore',
                   fetch_type='js', callback=self.phantomjs_parser)
    
    def phantomjs_parser(self, response):
        return [{
            "title": "".join(
                s for s in x('p').contents() if isinstance(s, basestring)
            ).strip(),
            "rate": x('p strong').text(),
            "url": x.attr.href,
        } for x in response.doc('a.item').items()]
{% endhighlight %}

> * 我在这里使用了一些 PyQuery 的 API，你可以在 [PyQuery complete API](https://pythonhosted.org/pyquery/api.html) 获得完整的 API 手册。

在页面上执行自定义脚本
------------------

你会发现，在上面我们使用 [PhantomJS] 抓取的豆瓣热门电影只有 20 条。当你点击『加载更多』时，能获得更多的热门电影。为了获得更多的电影，我们可以使用 `self.crawl` 的 `js_script` 参数，在页面上执行一段脚本，点击加载更多：

{% highlight python %}
    def on_start(self):
        self.crawl('http://movie.douban.com/explore#more',
                   fetch_type='js', js_script="""
                   function() {
                     setTimeout("$('.more').click()", 1000);
                   }""", callback=self.phantomjs_parser)
{% endhighlight %}

> * 这个脚本默认在页面加载结束后执行，你可以通过 `js_run_at` [参数](http://docs.pyspider.org/en/latest//apis/self.crawl/#enable-javascript-fetcher-need-support-by-fetcher) 修改这个行为
> * 由于是 AJAX 异步加载的，在页面加载完成时，第一页的电影可能还没有加载完，所以我们用 `setTimeout` 延迟 1 秒执行。
> * 你可以间隔一定时间，多次点击，这样可以加载更多页。
> * 由于相同 URL （实际是相同 taskid） 的任务会被去重，所以这里为 URL 加了一个 `#more`

上面两个例子，都可以在 [http://demo.pyspider.org/debug/tutorial_douban_explore](http://demo.pyspider.org/debug/tutorial_douban_explore) 中找到。

[PhantomJS]:             http://phantomjs.org/
