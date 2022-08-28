---
title: 猫之城物理钓鱼挂（一）：物理模拟触屏点击
date: 2022-08-27 17:22:58
tags: [arduino, 自动化, open-source, github]
---

真的有2年半没有写 blog 了。我是那种不愿意在事情尘埃落定之前，把它写下来的类型。在这两年半里，H1B 抽到了，也跳槽了。收入上去之后，也更愿意花钱解决问题，而不是自己做点什么，有好几次想要提笔，又感觉没什么好写的。以后会改善吗？我觉得不会，虽然我依旧会去尝试各种新的东西，但是觉得有必要写下来的变少了，现在我更多的是追求安稳的生活吧。

言归正传，这次带来的是一个手游《猫之城》的物理挂。4年以前，我做过一个[《少前》的脚本][1]，使用的是一个机器内的 App 来采集图像然后驱动控制的，然后就被封号了：P 。于是这一次就打算使用物理的方法，在机器外部实现所有的信息处理和控制。比如下面这一段视频，就是这个物理挂识别游戏内的钓鱼小游戏，然后通过电极模拟触控实现的：

<video controls src="/assets/image/cat-planet-bot-demo.mp4"></video>

在这一系列 blog 中，我会分为

* 模拟物理点击
* 图像采集以及画面分类
* 游戏图像细节信息提取
* 控制与 bot 状态机

等篇章讲解这个 bot 的实现，同时源代码已经上传到了 github: [cat-planet-bot][2]。**注意**：使用外挂是违反游戏用户协议的行为。由于代码中使用了大量 hard coded 图像坐标，我并不认为你能直接使用它。这份代码仅在 blog 中作为引用，讲解学习。

我也是第一次做硬件，电子电路以及图像处理开发（所以使用的最简单的 Arduino），我只会很简单地介绍这方面的知识，如果有什么错误，或者更好的方案，欢迎在评论中指出。

### 电容屏的物理触控

简单的说，现在的平板手机的触摸屏都是[电容屏][3]，它是通过**测量**手指靠近屏幕导致的电容**变化**来获取点击位置的，所以只要你能造成屏幕上某个区域的电容变化，就能模拟出点击。不过，不管怎么说，不同屏幕实现方式和灵敏度还是有区别的，最靠谱简单的方式还是实践。毕竟只要某个方案在你自己的机器上有效就可以了嘛。这里我直接使用了一个[网页][15]，在 iPad 上测试了一些可行和不可行的例子：

不可行的：
* 塑料的笔（和其他绝缘材料）
* 没有接地的硬币（比如你手拿着硬币就可以认为是有效接地）
* 没有接地的铝箔卷（在形状合适的情况下，不接地的铝箔卷可以形成点击，类似多芯导线形成的毛刷）
* 接地了的硬币边缘
* 单芯导线，回形针或者金属餐具（和屏幕接触面积只有一个点，无论是否接地）

可行的：
* 电容笔或者触控笔（无论是否接地）
* 接地并躺平的硬币
* 接地了的铝箔卷
* 不接地的多芯导线形成的毛刷
* 电池正负极（类似上一条）

总结起来这里有两个关键：

* 接触面积要足够大（面积要和手指类似）
* 是否接地不是关键，但接地可以改变触控状态（这一点很重要，它是我们能够通过电路控制的关键）

于是，我这里选择的是：[电击按摩贴][4]。首先，这东西导电，而且可以随意裁剪大小，并且自带粘性，可以粘在屏幕上。通过控制是否接地（初次粘贴时屏幕会感应为持续按住状态，需要关闭再打开屏幕reset，原因见下文）可以控制触摸状态。最最最重要的是，这东西在美国很容易买到，并且我家里有：D 。如果你在国内，可以买到成品连点器，或者直接买吸盘造型的导电橡胶，价格实惠，卖家甚至已经给你接好了导线。

![touch contact](/assets/image/touch-contact.jpg)

### 电脑控制触控

在上一步我们知道可以通过电极的接地与否，模拟触摸的按下和抬起，这时候就需要一个 PC 到这个接地电路的控制器，这里一般是一个与 PC 通信的 MUC 中导出的 GPIO 接口。我这里使用的是 Arduino，一个非常成熟的入门级开发板和配套程序。不过你也可以用例如 树莓派，STM32，ESP32 等等平台，它们的开发板可能更便宜，而且有的还能做到无线控制。

然后电路具体怎么实现呢？简单查询，网上有说使用[继电器，伺服电机的][5]，也有说可以使用 [N-channel MOSFET][6]（也有说用 [P-channel][7] 或者[不能用的][8]）。但是都有一个问题：没有实物，而且我也不知道需要买什么规格的啊。在美国，如果一次没有搞定，重复购买的话，光运费就会多花出很多钱了。于是，我把镜头看向了国内，刷到了 [【单片机】Arduino光遇自动弹琴机器人2.0来了][9] 这个视频，视频中 UP 主使用了光耦甚至给出了型号。那还说什么呢？照着来呗。

> 选择这个方案还有一些原因是，其他方案里的，伺服电机存在机械机构，安装麻烦；继电器往往是电磁继电器，开关时会发出噪音；而 MOSFET 的电路[不完全隔离][8]，可能会因为自身存在一些电容，而屏幕判断不准确。

在面包板上将一个 GPIO 端口，与一个发光二极管，光耦，限流电阻串联，然后接地就可以了；光耦的另一端分别接按摩贴做的电极和地：

![circle connection](/assets/image/circle-connection.png)

在 GPIO 高电平时，光耦开关闭合，会将电极和地连通，从而模拟出按下的状态。

> 光耦和 LED 类似，需要串联一个限流电阻。例如我使用的 PC817 的 Forward Voltage 是 1.2V，电流 20mA。而 Arduino 的 GPIO 输出是 5V 的，通过 [计算][10] 我们需要串联一个大约 190Ω 的电阻。（什么，你说我还串联了一个 LED ？管它呢，又不是不能用）

#### Arduino 控制程序

Arduino 非常简单地提供了一个 IDE，插上开发板的 USB 就可以开始编程了，你首先可以照着 Arduino 的标准教程 [Blink][11] 熟悉下环境，当程序上传到开发板之后就不需要 IDE 了。PC 将通过 USB 连接 Arduino UART 串口进行通信。Arduino 部分的代码如下：

```arduino
void setup() {
  Serial.begin(9600);
  for (int i = 8; i <= 13; i++) {
    pinMode(i, OUTPUT);
  }
  for (int i = A0; i <= A5; i++) {
    pinMode(i, OUTPUT);
  }
  Serial.println("OK");
}

void loop() {
  while (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    String op = command.substring(0, 3);
    String rest = command.substring(3);
    if (op == "LOW") {
      digitalWrite(rest.toInt(), LOW);
    } else if (op == "HIG") {
      digitalWrite(rest.toInt(), HIGH);
    }
  }
}
```

是不是很简单呢？这里首先初始化了开发板的串口，和一些 GPIO 作为输出。然后我们定义了一个通信协议：HIG00 和 LOW00 来控制 GPIO 的高低电平。注意，这里开发板在初始化后会立即发送一个 OK 信息，这是因为 Arduino UNO 会在串口连接上时[重启][13]，这个 OK 信息可以让 PC 端知道开发板已经准备好了。

#### PC 端

PC 这边可以用 [pySerial][14] 这个包，当开发板连接上 PC 或者 Mac 之后，会显示为 COM* 或者 /dev/tty* 设备。pySerial 也有 `serial.tools.list_ports.comports()` API 可以列出所有的串口设备，我们可以通过一些条件找到 Arduino：

https://github.com/binux/cat-planet-bot/blob/main/arduino.py

代码中我还实现了一些 helper function 例如 `throttle_press` 和 `autorelease` 并且记录了每个 pin 的按下状态。这些都只是为了方便，并不是必须的，串口的速率是完全足够直接发送每个指令的，并且我测试中也没有感觉到任何延迟。

#### 更多？

只要在面包板上插上更多的光耦和 Arduino GPIO 连接，然后制作更多的电极，就能支持多点触控了。但是，很明显的，这个数量是有限制的。而且无法改变点击位置，也无法实现滑动。那么有解决方案吗？我这里有一些想法：

首先，可以增加电极的数量，以至于覆盖到整个屏幕，然后在屏幕上分区分块控制每个点的电容变化。这个想法在 [这篇论文][16] 中有描述，但是我并没有找到成品。

而另一个更可行的方案是通过机械控制触控笔，实现全屏覆盖。例如改装一个 3D 打印机，将喷头换成一只触控笔，通过 3D 打印机的精确 3 轴移动来模拟点击。这个方案的好处在于 3D 打印机是一个非常便宜的成品，省去了零散零件采购的成本，而且很多 3D 打印机的固件是开源的，可以很容易地通过 [G-code][17] 操作。

### 总结

到这里，我们就打通了 PC 到平板的物理触控了。使用这些东西，就可以开发一些固定的自动化脚本了，例如下面这个脚本每次执行，自动按了 99 次 +10 然后购买：

<video controls src="/assets/image/cat-planet-bot-demo-2.mp4"></video>

在使用中，有一些影响触控成功率的经验：

1. 在安装电极后，需要关闭屏幕再打开。（刚安装上的贴片，无论是否接地都会被检测为按下，重启屏幕可以将这个状态重置为抬起，这样接地时改变的电容就会检测为按下了。）
2. 将平板接上电源效果会更好。（这样可以给平板接地，类似你手持平板的状态。但是并不需要和 Arduino 接在一起。）
3. 我在电极和地之间接了一个电阻，可见导线的长度并没有关系。不需要担心导线太长产生的电容。



[1]: /2018/10/girls-frontline-ankulua-vision/
[2]: https://github.com/binux/cat-planet-bot
[3]: https://zh.m.wikipedia.org/zh-hans/%E7%94%B5%E5%AE%B9%E5%BC%8F%E6%84%9F%E5%BA%94
[4]: https://www.google.com/search?q=%E7%94%B5%E5%87%BB+%E6%8C%89%E6%91%A9%E8%B4%B4
[5]: https://electronics.stackexchange.com/questions/423740/simulate-capacitive-touch
[6]: https://electronics.stackexchange.com/questions/60070/how-do-i-make-a-micro-controller-act-as-a-finger-on-a-touch-screen
[7]: https://electronics.stackexchange.com/questions/328031/how-to-physically-stimulate-a-touch-screen-with-an-external-device
[8]: https://electronics.stackexchange.com/a/60424
[9]: https://www.bilibili.com/video/BV1wB4y1A76k
[10]: http://www.chinaaet.com/tools/led_current_limiting_resistance.html
[11]: https://www.arduino.cc/en/Tutorial/BuiltInExamples/Blink
[12]: https://pyserial.readthedocs.io/en/latest/
[13]: https://playground.arduino.cc/Main/DisablingAutoResetOnSerialConnection/
[14]: https://pyserial.readthedocs.io/en/latest/index.html
[15]: https://patrickhlauke.github.io/touch/tracker/multi-touch-tracker-pointer-hud.html
[16]: http://www.fpl2012.org/Presentations/PHD7.pdf
[17]: https://en.wikipedia.org/wiki/G-code