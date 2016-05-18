---
layout: post
title: "迁移 Python 3"
description: "porting pyspider project to Python 3 with Python 2 compatible"
category: 
tags: [python,porting]
---

使用 Python 3 的呼声一直很高，Python 3 解决了很多 2 中的坑，比如 unicode，在向他们解释为什么 `print str` 乱码，`fp.write(str)` 时报错，在什么时候需要 `encode`，更容易了。

但是由于一开始接触的就是 Python 2，熟悉的包都是 Python 2（我也不确定他们是否支持 Python 3）。公司机器上的 Python 2.7 就算是“最新”版本。于是一直没有升级。不过有一种说法，切换到 Python 3 的最好时机就是现在。-为了庆祝 star 过 3000-，由于见到两次要求支持 Python 3，用一个周末为 pyspider 加入了 Python 3 支持（怎么样，不难吧）。

主要参考：

* [Porting Python 2 Code to Python 3](https://docs.python.org/3/howto/pyporting.html)
* [Cheat Sheet: Writing Python 2-3 compatible code](http://python-future.org/compatible_idioms.html)
* [Six: Python 2 and 3 Compatibility Library](https://pythonhosted.org/six/)

开始之前
--------

其实 [Porting Python 2 Code to Python 3](https://docs.python.org/3/howto/pyporting.html) 这篇文章是一个非常好的索引，能让你对将要进行的工作有一个整体的把握，同时能提供细节的链接，能让你立即开始工作。而且这一节内容就来自此文的 [The Short Explanation](https://docs.python.org/3/howto/pyporting.html#the-short-explanation) 一节。因为总结得很好，所以就不重复造轮子了。

首先，低版本的 Python 2 与 Python 3 之间的鸿沟太大了，特别是 Python 2.5(含) 以前的版本。要同时兼容他们的代价太大。而 Python 2.6 和 Python 2.7 已经带有部分 Python 3 的特性，这让迁移的代价大大降低了。同时，不建议支持 Python 3.3 以下的 3 字头版本，由于 Python 3 实际上已经 release 6 年了，这些 Python 3.x 版本也比较老了，很多特性还没有，或者包不支持。所以建议跳过他们。

其次，一定要有测试，保证测试足够的代码覆盖。Python 2 到 Python 3 从包改名到语法都有变化，几乎所有的代码都需要有修改。足够的代码覆盖，才能在这样大规模修改中，保证所有功能可用。而 pyspider 正是因为有 86% 的代码覆盖，我能这么快地完成代码迁移。

读一读 Python 2 和 Python 3 有什么不同。这个可以看看 [What’s New in Python](https://docs.python.org/3/whatsnew/index.html)，特别是 [What’s New In Python 3.0](https://docs.python.org/3/whatsnew/3.0.html)。当然也可以找一些中文的文章，这个方面应该还蛮多的。反正最主要的就是大量的包改名，以及 `bytes`, `str`, `unicode` 三者的变化。或者你可以先读一读 [Cheat Sheet](http://python-future.org/compatible_idioms.html)，虽然等下我们还需要它。

好，现在可以来看看你的包依赖是否支持 Python 3 了。并不是 pip 能安装的包就是支持 Python 3 的，可能装上了依旧不能工作。你可以用 [Can I Use Python 3](https://caniusepython3.com/) 检测包是否支持。不过我更推荐 [PYTHON 3 WALL OF SUPERPOWERS](https://python3wos.appspot.com/) （需要翻墙）。不过也不用担心，大部分包都是支持 Python 3 的，如果不支持，一般都会有替代，例如 pika 就可以被 ampq 替换，而 MySQL-python 能被 mysql-connector-python 替代。

第一步——查找替换
--------------

首先我们从大的方向入手，把一些改名了的包和函数处理一下。请打开 [Cheat Sheet: Writing Python 2-3 compatible code](http://python-future.org/compatible_idioms.html) 参照它们一条条进行。在能搜索的地方，使用搜索统一修改，不然挨个文件太慢，而且会忘记的。因为我用的是 six 作为多环境间的桥梁。所以需要同时参考 [six的文档](https://pythonhosted.org/six/)。你可能需要打开两个窗口，同时运行 Python 2 和 Python 3，确认语句在两个环境下都能执行。

在这一步，我做了以下处理：

* 相对导入 - [Imports relative to a package](http://python-future.org/compatible_idioms.html#imports-relative-to-a-package)
* urlparse / urllib 库改名 - [six](https://pythonhosted.org/six/#module-six.moves.urllib.parse)
* thread 包改名，而且 `get_ident` 函数不再存在了。将 `thread.get_ident()` 改为 `threading.current_thread().ident` [six](https://pythonhosted.org/six/#module-six.moves)
* `basestring` 类型不再存在，用 `six.string_types` 代替 [sheet](http://python-future.org/compatible_idioms.html#basestring)
* `__metaclass__` 不再存在，用 `six.add_metaclass` 代替 [sheet](http://python-future.org/compatible_idioms.html#metaclasses)
* `UserDict.DictMixin` 不再存在，用 `collections.Mapping` 或者 `collections.MutableMapping` 代替
* `/` 现在是真的除法了，也就是说 int / int 会得到一个 float，使用 `//` 获得地板除效果（由于在 python 中，地板除用得少，实际上不改关系不大） [sheet](http://python-future.org/compatible_idioms.html#division)
* `StringIO` 现在分为 `io.BytesIO` 和 `io.StringIO` 视情况使用
* print 现在是一个 function 了 [sheet](http://python-future.org/compatible_idioms.html#stringio)
* `unicode` 关键字不再存在 使用 `six.text_type` 代替
* `__builtins__` 不存在了，[`six.moves.builtins`](https://pythonhosted.org/six/#module-six.moves) [sheet](http://python-future.org/compatible_idioms.html#unicode-text-string-literals)
* `reload` 改为 [`six.reload_module`](https://pythonhosted.org/six/#module-six.moves)
* dict 的 `keys`， `items`， `values` 现在都是迭代器了，不返回列表，原来的 `iteritems`, `itervalues` 不再存在，使用 [six.iterkeys](https://pythonhosted.org/six/#six.iterkeys) 等函数代替。
* `raise exc_type, exc_value, tb` 的形式不再支持，使用 `six.reraise(exc_type, exc_value, tb)` 代替。

其他的例如 try...catch，如果你在 Python 2 中就比较标准地使用 `as`，那么这时就不用修改了。

另外，如果你和我一样有 str(object) 来获得 object 的文字结果的习惯话，每次写 `six.text_type(object)` 太长了。可以写一些兼容性函数，然后在整个项目中使用。

注意到这里，我们并没有处理 `bytes`, `string`, `unicode`，请放下他们，我们在下一节处理这些问题。

第二步——处理 unicode
------------------

由于在 Python 3 中，所有的 `'text'` 都变成 unicode 了，所以你会觉得它会是一个大问题，是否需要给所有的 `'text'` 加上 `u` ，或者干脆所有文件都加上 `from __future__ import unicode_literals`？

实际上，大部分时候不需要。

在 Python 2 中，我们很少有意识地区分 `str` 和 `unicode`，对于大部分函数调用来说，给它 `str` 或者 `unicode` 都是一样的，因为他们共享大部分行为。但是在 Python 3 中，`bytes` 和 `str`(`unicode`) 却大不一样。例如当你 `for c in bytes` 时，得到的是一个 `int` 而不是一个 `str`。

虽然不做任何修改，`'text'` 在 Python 2 中，是 `str`(`bytes`)，而在 Python 3 中是 `str`(`unicode`)。但是提交给函数时，既然 Python 2 的函数同时支持 `str` 和 `unicode`，所以没有任何问题。而且，在 Python 2 中，`'text'+u'中文'` 会自动升级为 `unicode`，所以，只需要注意在出现中文的地方使用 `u'中文'` 就好了（即使在 Python 2 中，这也是一个好的习惯）。而 `b'bytes'` 的场合非常少，更多的是使用 `text.encode` 进行转换。所以，对于习惯良好的 Python 2 代码来说，是几乎不需要修改的。

除了源代码之中的 unicode 问题，其他主要问题出现在输入输出上。但是，只要遵循：程序中流通的数据，只能是 unicode。数据进来之后必须转换成 unicode 即可。

最后
---

运行测试，哪报错改哪就好了。