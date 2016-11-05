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
            setTimeout(function(){
              dialog.hide()
            },1000)
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
      wx.showActionSheet({
        itemList:['保存图片'],
        success:function(res){
          if(res.tapIndex == 0){
            var imageSrc = e.currentTarget.dataset.src
            console.log(imageSrc)
            wx.downloadFile({
              url: imageSrc, 
                    success: function(res) {
                      console.log(res)
                        wx.saveFile({
                          tempFilePath: res.tempFilePath,
                          success: function(res){
                            console.log(res.savedFilePath)
                            dialog.toast("保存成功")
                          },
                          fail: function(e) {
                            dialog.toast("保存出错")
                          }
                        })
                    },
                    fail:function(e){
                      dialog.toast("图片下载失败")
                    }
            })
          }
        }
      })
    },
    hideCount:function(){
      this.setData({countShow:false})
    }
})