---
comments: true
date: 2012-03-25 13:46:57
layout: post
slug: hash_algorithm_of_xunlei
title: 迅雷Hash算法分析
wordpress_id: 26123
categories:
- 未分类
tags:
- hash
- loli.lu
- xunlei
---

从迅雷离线获得的地址中，存在着大量的Hash值，这些hash看似都是base64,sha1,md5但却有所不同。
比如这是一个典型的离线地址


    
    
    http://gdl.lixian.vip.xunlei.com/download?
    fid=3KUoDlBy9IotAFn5vQAHc5VUIgKiwSgmAAAAAHYA3duVUUeWgaJI4JGu5syK9PLK&     // base64: 与cid,size,gcid相关(size为小字节序)
    mid=666&                                        // maybe: always 666
    threshold=150&                                  // maybe: always 150
    tid=A950BAE38A2E7398186D4127315DB76F            // unknow: 256bit relate with size
    srcid=4                                         // maybe: always 4
    verno=1                                         // maybe: always 1
    g=7600DDDB9551479681A248E091AEE6CC8AF4F2CA&     // gcid: for normal download gcid == cid
    scn=c7&                                         // section
    i=3547930B96AFA7B0A1CFCC80D516ADE97A34DAE0&     // cid == infoid == btih == ed2k hash, files share a same cid in a bt task, cid is the btih of the torrent
    t=6&                                            // type: 1=normal 4=ed2k 6=bt
    ui=18×××9640&                                  //userid
    ti=33742×××247&                                //tid from get free url
    s=640205218&                                    //totalByte
    m=0&                                            // mayby: always 0
    n=01324486025B4775690D459D7F43726F770F6CBF6F345D5B46347DA817445D5B422876D1025B783236556EA51C335D2E6D0A47E45F00000000     // filename
    


根据已有的数据分析/比对，大致各个字段的含义已经标识出来了。其中除了ui,ti是与用户相关的变元，cid是来源相关的变元，其他的字段对于某一个文件来说一般是相同的。





## cid


算法源码：

    
    
    def cid_hash_file(path):
        h = hashlib.sha1()
        size = os.path.getsize(path)
        with open(path, 'rb') as stream:
            if size < 0xF000:
                h.update(stream.read())
            else:
                h.update(stream.read(0x5000))
                stream.seek(size/3)
                h.update(stream.read(0x5000))
                stream.seek(size-0x5000)
                h.update(stream.read(0x5000))
        return h.hexdigest().upper()
    


算法来自于[https://github.com/iambus/xunlei-lixian](https://github.com/iambus/xunlei-lixian)。
在api中，cid主要用于文件的索引。观察代码可知，cid并没有hash整个文件，而是根据文件的头/中/尾部的0x5000字节的内容计算Hash。这样就可以在不下载完整个文件，就能够查询到其他服务器上可能的相同文件。于是在下载支持range的文件的时候，即使该地址没有被索引到，但是通过cid，依旧可以被p2sp加速。
当然了，由于没有hash整个文件，文件在事实上有可能是不同的，那么根据下面这个gcid就可以唯一确定一个文件了。



## gcid



    
    
    def gcid_hash_file(path):
        h = hashlib.sha1()
        size = os.path.getsize(path)
        psize = 0x40000
        while size / psize > 0x200:
            psize = psize << 1
        with open(path, 'rb') as stream:
            data = stream.read(psize)
            while data:
                h.update(hashlib.sha1(data).digest())
                data = stream.read(psize)
        return h.hexdigest().upper()
    


这个算法是我完全没有通过逆向黑盒分析而来，虽然没有做完整的测试，但是一般来说是正确的。。分析借助了loli.lu的18万个已有文件的数据，以及[迅雷咖啡吧](http://coffee.xunlei.com:8000/viewthread.php?tid=692&extra=page%3D1)上的一句话：“如果文件很大，则计算gcid非常耗时，因此可以在大文件传输过程中计算gcid，文件传输完毕，则gcid也计算好了“。。
gcid的作用是文件的唯一键，在迅雷服务器上唯一确定一个文件。可以说，只要有了gcid，实际上是可以任意下载到需要的文件的。算法采用了分片hash再二次sha1的算法。。猜测原因是因为分片被限制在512个一下，当hash较大文件的时候，可以边下载边hash，再在最后hash那个不到512*20字节的串即可，当文件下载完成的时候就能立即得出gcid。还有一个原因是bt文件也是用sha1分片Hash的，那么获得种子文件也就同时有可能获得gcid了。同时，如果迅雷服务器保存了每个分片的sha1 hash的话，那么在下载通过cid匹配的文件同时，就能同时比较各个分片是否正确，以此保证最终结果。



## fid


算法如下：

    
    
    def parse_fid(fid):
        cid, size, gcid = struct.unpack("<20sq20s", fid.decode("base64"))
        return cid.encode("hex").upper(), size, gcid.encode("hex").upper()
    
    def gen_fid(cid, size, gcid):
        return struct.pack("<20sq20s", cid.decode("hex"), size, gcid.decode("hex")).encode("base64").strip()
    



首先这很明显是一个base64，但是一开始我并没有发现她们和cid,size,gcid的关系，<del>直到我膝盖中了一箭</del>。。
fid就是cid,size,gcid的二进制然后再base64而已。但是有了fid，神马cid,size,gcid这三大要素都不是问题了。应该是用于api分析url的便利，所做的一个接口性参数。



## tid


未知算法。
根据18万的文件数据，唯一能够知道的是，这个tid和文件大小一一对应。。size相同的文件tid一定相同，但是又不是size的直接hash，目前来说完全不知道这个参数的意义何在。。
如果有兴趣，您可以在[https://github.com/binux/lixian.xunlei/blob/master/tid.dict](https://github.com/binux/lixian.xunlei/blob/master/tid.dict)文件里面找到目前已知的映射。。如果分析出算法了请务必告诉我。



## n


算法源码：

    
    
    thunder_filename_mask = "6131E45F00000000".decode("hex")
    def thunder_filename_encode(filename, encoding="gbk"):
        if isinstance(filename, unicode):
            filename = filename.encode(encoding)
        result = ["01", ]
        for i, word in enumerate(filename):
            mask = thunder_filename_mask[i%len(thunder_filename_mask)]
            result.append("%02X" % (ord(word)^ord(mask)))
        while len(result) % 8 != 1:
            mask = thunder_filename_mask[len(result)%len(thunder_filename_mask)-1]
            result.append("%02X" % ord(mask))
        return "".join(result)
    
    def thunder_filename_decode(code, encoding="gbk"):
        assert code.startswith("01")
        result = []
        for i, word in enumerate(code[2:].decode("hex")):
            mask = thunder_filename_mask[i%len(thunder_filename_mask)]
            result.append(chr(ord(word)^ord(mask)))
        result = "".join(result).rstrip("\0")
        return result.decode(encoding)
    


算法来源于[+Zhang Youfu](https://plus.google.com/109026361274947112731)。简单来说这个参数就是将文件名各位用掩码进行了简单转换而已，中文的编码与最终输出的header中的相同，既编码采用utf8，最终输出的也是utf8，值得指出的是默认的编码是gbk的。迅雷在输出文件名时会截断较长的文件名，但是实际上通过传递完整的n参数，可以无视这个限制。在[binux/ThunderLixianExporter](https://github.com/binux/ThunderLixianExporter/blob/master/ThunderLixianExporter.js#L300)还有一个js版本的实现。 



## 总结


由上面的分析可见，一个文件的离线地址完全就是根据文件的信息生成的，于是你发现了什么？对了，完全不需要通过迅雷服务器我们就可以生成自己的离线地址！如果这个文件在迅雷服务器上存在，我们可以直接下载回来！（等等，你说n。。那不就是文件名嘛。。我只关心内容。。文件名这种小问题。。）
说到做到，**您可以通过[https://github.com/binux/lixian.xunlei/blob/master/check_file.py](https://github.com/binux/lixian.xunlei/blob/master/check_file.py)这个文件直接计算出文件的cid,gcid,fid**，如果可能的话也能计算出tid。
然后，把fake_url添加到迅雷软件里面。然后。。就可以直接下载了！可以开启高速通道，可以在快盘秒传，运气好可以开启离线秒传。。。
over
