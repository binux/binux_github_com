// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<i@binux.me>
//         http://binux.me
// Created on 2013-01-21 20:18:42

jQuery.ajax({
  url: 'http://pyproxy.duapp.com/http://httpbin.duapp.com/cookies/set?userid=21',
  cache: true,
  dataType: 'script',
  success: function() {
    XF.widget.msgbox.show('磁力链已启用!', 1, 1000, false);
    jQuery('#input_tips').text('请输入HTTP/eD2k/magnet链接');
    EventHandler._trigger_add_task = EventHandler.trigger_add_task;
    EventHandler.trigger_add_task = function(task_id) {
      var url = ($('dl_url_id').value).replace(/,/g, "_");
      var hash = url.match(/^magnet:\?xt=urn:btih:(\w+)/i);
      if (hash) {
        check_bt_task(hash[1]);
      } else {
        EventHandler._trigger_add_task(task_id);
      }
    };
  }
});

function check_bt_task(hash) {
  jQuery.ajax({
    url: 'http://pyproxy.duapp.com/http://dynamic.cloud.vip.xunlei.com/interface/url_query',
    dataType: 'script',
    data: {
      callback: 'queryUrl',
      u: 'magnet:?xt=urn:btih:'+hash
    }
  });
  jQuery('#pop_new_task .close_win').click();
  XF.widget.msgbox.show('解析种子中...', 0, 20000, true);
}

function queryUrl(flag,infohash,fsize,bt_title,is_full,subtitle,subformatsize,size_list,valid_list,file_icon,findex,random) {
  XF.widget.msgbox.hide();

  if (flag != 1) {
    onComplete();
    return;
  }

  var data = {
    ret: 0,
    name: bt_title,
    hash: infohash.toLowerCase(),
    files: []
  };
  for (var i in subtitle) {
    if (i >= 0) {
      data.files.push({
        file_index: findex[i],
        file_name: subtitle[i],
        file_size: subformatsize[i],
        file_size_ori: parseInt(size_list[i], 10)
      });
    }
  }

  console.log(data);
  onComplete(data);
}


//from lixian2012_cloudplayer.js
function onComplete(data) {
      if(data&&data.ret==0&&data.files.length>0) {
      XF.widget.msgbox.hide();
      var html='<div class="bt_task"><h1><span>任务名称:</span> <input type="text" id="main_bt_info" hash="'+data.hash+'" value="'+data.name+'"/></h1><div class="bt_task_table"><table><tr><th colspan="2" width="80%">文件名</th><th width="20%">文件大小</th></tr>';
      for(var i=0;i<data.files.length;i++){
        if(i%2==0){
          html+='<tr class="odd"><td><input type="checkbox" /></td><td><span class="choose_filename"  size="'+data.files[i].file_size_ori+'" index="'+data.files[i].file_index+'" title="'+data.files[i].file_name+'">'+QQXF.COMMON.getFileType(data.files[i].file_name,25)+'</span></td><td>'+data.files[i].file_size+'</td></tr>'
          }else{
          html+='<tr><td><input type="checkbox" /></td><td><span class="choose_filename"  size="'+data.files[i].file_size_ori+'" index="'+data.files[i].file_index+'" title="'+data.files[i].file_name+'">'+QQXF.COMMON.getFileType(data.files[i].file_name,25)+'</span></td><td>'+data.files[i].file_size+'</td></tr>'
          };
        }
      html=html+'</table></div><dl><dt>选择:</dt><dd><a id="check_all" href="###">全选</a></dd><dd><a  id="check_opposite" href="###">反选</a></dd><dd><a  id="check_auto"  href="###">智能</a></dd><dd class="choose_num_box">已选<b id="num_choosed">0</b>/<b id="num_allfiles">0</b>个</dd> <dd class="bt_size_opt"> 文件大小:<em id="bt_choose_space"></em></dd><dd class="bt_size_opt">剩余空间:<em id="bt_left_space"><em></dd></dl></div>';
      jQuery("#choose_files_table").html(html);
      
      //绑定事件
      //总任务数
      jQuery("#num_allfiles").html(data.files.length);
      
      //默认选择
      jQuery(".bt_task_table .choose_filename").each(function(){
          if(parseInt(jQuery(this).attr("size"))>1024)
          {jQuery(this).parent().prev().find("input").attr("checked",'checked')};
          });
      QQXF.COMMON.getBTFilesSize();
      
      //单击选择框
      jQuery(".bt_task_table input").click(function(){
        QQXF.COMMON.getBTFilesSize();
        })
      
      //全选	
      jQuery("#check_all").click(function(){
        jQuery(".bt_task_table input").attr("checked","checked");
        QQXF.COMMON.getBTFilesSize();
        });
      
      //反选	
      jQuery("#check_opposite").click(function(){
        jQuery(".bt_task_table input").each(function(){if(jQuery(this).attr("checked")){jQuery(this).removeAttr("checked");}else{jQuery(this).attr("checked",'checked');}});
        QQXF.COMMON.getBTFilesSize();
        });
      
      //智能	
      jQuery("#check_auto").click(function(){
        jQuery(".bt_task_table input").removeAttr("checked");
        jQuery(".bt_task_table .icon_movie,.bt_task_table .icon_rar,.bt_task_table .icon_exe").each(function(){jQuery(this).parent().parent().prev().find("input").attr("checked",'checked');});
        jQuery(".bt_task_table .icon_file").each(function(){
          if(parseInt(jQuery(this).parent().attr("size"))>10*1024*1024)
          {jQuery(this).parent().parent().prev().find("input").attr("checked",'checked')};
          });
        QQXF.COMMON.getBTFilesSize();
      });
      
      
      //格式化空间
      var format_engine = new CTaskParaFormat();
      var left_space = get_lef_space(g_task_op.last_task_info);
      jQuery("#bt_left_space").html(format_engine.formatFilesize(left_space));
      
      //显示文件选择框
      window.choose_download_files=new xfDialog("choose_download_files");
      choose_download_files.show();
      //alert(data.hash);
      }	else if(data&&data.ret==-10086){
        window.setTimeout(function(){XF.widget.msgbox.show("文件类型不支持!",1,3000,true);},500);
        }else{
        window.setTimeout(function(){XF.widget.msgbox.show("解析种子文件失败!",1,3000,true);},500);
        }	
    }
