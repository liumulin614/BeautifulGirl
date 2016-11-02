var app = getApp()
var dialog = require("../../utils/dialog")

Page({
    data:{
        album:[],
        title:'',
        id:'',
        countShow:true,
        currentIndex:1
    },
    onLoad:function(options){
        this.setData({
            title:options.title,
            id:options.id,
        })
        dialog.loading()
        //请求数据
        var that = this
        wx.request({
          url:app.globalData.api.albumBaseurl.replace("%id%",options.id),
          success:function(ret){
            ret = ret['data']
            if(ret['showapi_res_code'] == 0 && ret['showapi_res_body']){
              that.setData({
              album:ret['showapi_res_body']['imgList']
              })
            }else{
              dialog.toast("网络出错啦~")
            }
          },
          complete:function(){
            dialog.hide()
          }
        })
    },
    onReady:function(){
        wx.setNavigationBarTitle({title:this.data.title})
    },
    preiviewwImage(e){
      wx.previewImage({
        current:e.currentTarget.dataset.src,
        urls:this.data.album
      })
    },
    swiperChange:function(e){
      this.setData({currentIndex:parseInt(e.detail.current)+1});
    },
    imageLongTap:function(e){
    },
    hideCount:function(){
      this.setData({countShow:false})
    }
})