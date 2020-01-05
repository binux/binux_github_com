---
title: 家居自动化
date: 2020-01-04 17:54:54
tags: [home-assistant, google-assistant, alexa, 米家]
---

从 Google Assistant, Amazon Alexa, Apple Homekit 到米家，智能家居自动化已经不是什么新鲜的概念了。对于我来说，入坑的契机也非常简单：我不想下床关灯。然后随着想要自动化的场景增加，智能设备（可编程设备）就越来越多。这篇文章就根据自动场景介绍一下我现在的一些方案（本文无任何 affiliate ）。


Hub
---

首先，在配置场景之前，需要选择一个 Hub —— 作为自动化中心，连接传感器和操作控制器（例如灯，插座，IR 遥控器等）。你可以选择 Google Home，Alexa，Homekit 这样大厂的方案，不过这里我还是推荐 [Home Assistant](https://www.home-assistant.io/) 这样的开源方案：

* 更多的[接入设备支持](https://www.home-assistant.io/integrations/)（你甚至可以同时接入 Alexa 和 Google Assistant 的设备）
* 更自由的自动化配置（例如 Google Assistant 不支持延迟触发；你甚至可以写 shell 脚本）
* 更好的隐私保护（Home Assistant 的设备支持大多来源于逆向设备 API，能不联网就不联网）

我在 Synology DS218+ 上以 docker 运行 Home Assistant。

不过无论你选择什么方案，在这之后购买传感器和控制器的时候都需要注意你的 Hub 是否支持设备接入。考虑到价格，我的设备主要是 TP-Link 的插座加上米家的传感器，我会在具体场景中详细列出。

自动化场景
---------

### Hey Google, Good Night

首先就是我入坑的第一个场景，在床上关上家中所有的灯。我用到的设备有：

* [Google Home Mini](https://store.google.com/us/product/google_home_mini)
* [TP-Link Smart Plug HS110](https://www.kasasmart.com/us/products/smart-plugs/kasa-smart-plug-energy-monitoring-hs110)
* [TP-Link Smart Switch HS200](https://www.kasasmart.com/us/products/smart-switches/kasa-smart-wi-fi-light-switch-hs200)

由于美国的房子没有灯，对的，没·有·灯。默认的开关控制的插座不一定在我想要的位置。这时候就可以用一个 Smart Plug 接一个落地灯。而对于其他自带的例如浴室厨房灯，就通过替换 Smart Switch 控制。

设置方面也很简单，直接在 Google Home 的 Routines 中关掉所有的开关就好了。

### 自动开关厕所灯

这也是很常见的使用场景，红外感应人进入就开灯，然后延迟关灯，用到的设备有：

* [米家多功能网关](https://www.mi.com/wangguan)
* [米家人体传感器](https://item.mi.com/product/5005.html)
* [TP-Link Smart Switch HS200](https://www.kasasmart.com/us/products/smart-switches/kasa-smart-wi-fi-light-switch-hs200)

首先跟着[文档](https://www.home-assistant.io/integrations/xiaomi_aqara/)将米家多功能网关接入 Home Assistant，然后就可以添加 Automation 了：

```
- id: '1561354113814'
  alias: Turn On Bathroom
  trigger:
  - entity_id: binary_sensor.xiaomi_motion_sensor
    platform: state
    to: 'on'
  condition: []
  action:
  - data:
      entity_id: switch.bathroom_light
    service: switch.turn_on
- id: '1560102516271'
  alias: Turn Off Bathroom
  trigger:
  - entity_id: switch.bathroom_light
    for: 00:10:00
    platform: state
    to: 'on'
  - entity_id: binary_sensor.xiaomi_motion_sensor
    for: 00:10:00
    platform: state
    to: 'off'
  condition:
  - condition: template
    value_template: '{{ is_state("switch.bathroom_light", "on") and as_timestamp(now())
      - as_timestamp(states.switch.bathroom_light.last_changed) > 600 }}'
  - condition: template
    value_template: '{{ is_state("binary_sensor.xiaomi_motion_sensor", "off") and
      as_timestamp(now()) - as_timestamp(states.binary_sensor.xiaomi_motion_sensor.last_changed)
      > 600 }}'
  action:
  - alias: ''
    data:
      entity_id: switch.bathroom_light
    service: switch.turn_off
```

### 进门自动开灯

这可以有两个方案，一个是用摄像头检测到人就开灯，或者用 Smart Lock 的开锁事件。

* [Wyze Cam](https://wyze.com/wyze-cam.html)
* [August Smart Lock Pro](https://august.com/products/august-smart-lock-pro-connect)
* [TP-Link Smart Switch HS200](https://www.kasasmart.com/us/products/smart-switches/kasa-smart-wi-fi-light-switch-hs200)

Wyze Cam 就是[小方智能摄像机](https://www.mi.com/xiaofang) 的国外版本，你可以用[开源的固件](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks)。如果直接用它自带的。接入 Home Assistant 需要通过 ifttt。August Lock 就能直接支持了。

设置自动化和上面类似，condition 里面可以设置只在下班时间或者太阳落山后时才开灯。这里就贴配置了。总的来说 Smart Lock 比摄像头的方案要稳定得多，误触也少。

### Hey Google, True on Projector

由于经常搬家，我都是用投影代替电视的。毕竟同样的尺寸，投影机容易搬多了。然后我现在的投影机是内置音响的，所以我还有一个 soundbar。这个场景就是，当我打开投影的时候，同时打开音响，关闭客厅灯，然后 PC 的输出切换到投影上，再打开 Plex。这里面用到的是：

* [Google Home Mini](https://store.google.com/us/product/google_home_mini)
* [米家万能遥控器](https://item.mi.com/product/9465.html)
* [Win10As](https://github.com/KjetilSv/Win10As)

首先是将这几个设备接入 Home Assistant，参考 [Xiaomi IR Remote](https://www.home-assistant.io/integrations/remote.xiaomi_miio/) 和 [mqtt](https://www.home-assistant.io/integrations/mqtt/) 的文档就好了。

然后是控制投影的开关，当米家万能遥控器接入 Home Assistant 后，可以通过 `xiaomi_miio.remote_learn_command` 指令学习投影遥控的开关机代码，然后在 Home Assistant 中建立一个虚拟开关：

```
remote:
  - platform: xiaomi_miio
    host: 192.168.1.104
    token: dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb
    commands:
      project_on:
        command:
        - raw:nMwmkwlk0mkxmEsms4mEsmM2m0wlk2AMKYzYBYgCDmoDLTUA85gAOUyAXkB+wOfAhkBDwEPAQYGSAXOCE8IQwQVCNsAcghfAI8AjwPImM2mYDPg7tMIA
      project_off:
        command:
        - raw:nMwmMwlk0mk1mEsms3mEsmM2AEIAjJqAywA/gD+Bz4DPgIeAh4CHgy+BB4EHgMeAh4BHgReAz4A6TCAA

switch:
  - platform: template
    switches:
      projector:
        value_template: "{{ states('input_boolean.projector') }}"
        turn_on:
          - service: remote.send_command
            data:
              command:
              - project_on
              entity_id: remote.xiaomi_miio_192_168_1_104
          - service: input_boolean.turn_on
            entity_id: input_boolean.projector
        turn_off:
          - service: remote.send_command
            data:
              command:
              - project_off
              entity_id: remote.xiaomi_miio_192_168_1_104
          - service: input_boolean.turn_off
            entity_id: input_boolean.projector

input_boolean:
  projector: {}
```

音响也是一样，依葫芦画瓢就好了。

然后是 PC 这边，这里用了一个一个开源程序 [Win10As](https://github.com/KjetilSv/Win10As) 然后通过 [mqtt](https://www.home-assistant.io/integrations/mqtt/) 协议和 Home Assistant 连接。

设置三个指令：

|name|cmdtext|cmdparameters|
|----|-------|-------------|
|exec/plex|D:\plex.bat|1|
|display/pc|D:\DisplaySwitch.exe|/internal|
|display/projector|D:\DisplaySwitch.exe|/external|

其中 plex.bat：`start "" /B "C:\Program Files\Plex\Plex Media Player\PlexMediaPlayer.exe" --tv --fullscreen`
DisplaySwitch.exe 位于 `C:\Windows\System32\DisplaySwitch.exe` 不知道为什么从 Win10As 中无法访问这个程序，不过把它拷贝出来也是一样用的。

然后可以在 Home Assistant 中加一个 pc_screen 的 switch：

```
switch:
  - platform: template
      pc_screen:
        value_template: "{{ states('input_boolean.pc_screen') }}"
        turn_on:
          - service: mqtt.publish
            data:
              topic: GAMEBOX/display/pc
          - service: input_boolean.turn_on
            entity_id: input_boolean.pc_screen
        turn_off:
          - service: mqtt.publish
            data:
              topic: GAMEBOX/display/projector
          - service: input_boolean.turn_on
            entity_id: input_boolean.pc_screen

input_boolean:
  pc_screen: {}
```

然后就可以通过 Automation 把它们串起来了。由于是 WebUI 就能配置的，我就不贴出来了。注意一点是在打开投影机到切换 PC 输出之间加一个延迟，等到投影 ready 再切换，切换后再加个延迟再启动 Plex 就能保证 Plex 在投影的窗口前台全屏显示了。

## 总结

其他的例如

* Hey Google, Turn on XXX 等单独的开关
* Good Night 的时候同时关电脑，关投影
* Google Assistant 控制 Alexa 设备
* 监控本月流量有没有超过 1T，在 80% 关掉 PT 上传
* 通过路由器监控接入设备，判断人在家的时候关闭摄像头监控
* 当阳台摄像头检测到移动，Google Home Mini 的喇叭鸣警笛。
* 当按照某种特定的顺序打开灯的时候，自动打开门，以防止出门忘带手机（前提是你能让 Google Home Mini 听到在门外的你）

由于都是重用现有设备这里就不介绍了，这些都能通过 Home Assistant 接入后用 Automation 完成。

总之「智能家居」中的「智能」其实就是一个语音识别加上一个个预定的场景，很蠢，但是，**真香**。当习惯了叫一句 Hey Google 就能躺着沙发上开关各种设备之后，就再也回不去找各种遥控器了。比起一个「懂你」然后随时监听上传的设备，一个[离线语音识别](https://github.com/synesthesiam/rhasspy)，加自定义的场景可能能更快地满足你对自动化的需要。

如果你有家居自动化的点子或者方案也可以留言交流，(´▽`ʃ♡ƪ)