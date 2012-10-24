---
comments: true
date: 2011-03-12 09:46:26
layout: post
slug: '%e5%9c%a8windows%e7%8e%af%e5%a2%83%e4%b8%ad%e7%bc%96%e8%af%91%e5%b8%a6python-dissector%e6%94%af%e6%8c%81%e7%9a%84wireshark%ef%bc%88msvc2010%e7%bc%96%e8%af%91%e5%99%a8%ef%bc%89%e3%80%90%e6%97%a0'
title: 在windows环境中编译带python-dissector支持的wireshark（MSVC2010编译器）【无法开启】
wordpress_id: 16001
categories:
- 未分类
tags:
- wireshark c++ python windows 编译
---

虽然Windows的编程非常不爽，无论是编译环境还是编辑环境什么的，搭起来累的一比。不过，既然毕设题目是QQ协议分析，我总不能去分析Linux下那个阉割的QQ吧。  
当然了，抓包之后扔到Linux下分析也是一个解决方案，不过实时的协议解析还是挺有吸引力的。




同时楼主一年来python上瘾，看着C++那几行开头include就头大，一直不想起手写C++，更何况Wireshark的API是C的。更可怕的是README.developer还没开始告诉你怎么写dissector呢，编程规范就一大堆，而且各种数据类型不建议使用，strlen不建议使用，strcp不建议使用。这不是从头又学一遍了嘛！  

如果是这样还不如直接Lua搞起了， 最后顶着windows恶劣的编程环境尝试编译带python-dissector支持的wireshark。





step 1:  
首先需要有一份源码。。建议直接到http://www.wireshark.org/下载最新稳定版的源码即可




step 2:  
参照[Win32: Step-by-Step Guide]  http://www.wireshark.org/docs/wsdg_html_chunked/ChSetupWin32.html  的过程编译即可。。完全没有压力



**python-dissector:**


在下不才，无法在windows平台下开启python-dissector支持。。




看了下代码，这部分代码还是相当的简单，基本上是处于测试，初步的阶段。  
编译后执行若出现xxx地址不能为read之类的报错，将epan/wspython/wspy_register.c +128行


`void register_all_py_protocols_func(register_cb cb _U_, gpointer client_data _U_)`


函数修改为：


{% highlight cpp %}
PyObject * py_reg;
// .....
/* load the python register module */
py_reg = PyFile_FromString(get_py_register_file(), "r");
  if (py_reg == NULL) {
    printf("no register file %sn", get_py_register_file());
    return;
  }
PyRun_SimpleFile(PyFile_AsFile(py_reg), get_py_register_file());
{% endhighlight %}


但是，一旦开启PYTHON_EMBED=1参数之后，会导致所有的plugin无法加载。。。




加上开发程度不高，文档几乎没有，暂时还是放弃了。。改用直接编写c plugin的方式吧




========================  
PS:1.4.4中有函数原型变化，文档并没有更新：  
如：  
dissector_add_uint已经变为dissector_add
