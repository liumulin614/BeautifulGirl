//index.js
//获取应用实例
var app = getApp()
var dialog = require("../../utils/dialog")

Page({
  //加载第一个类型的列表
  onLoad:function(){
    if(!this.data.currentType){
      let that = this
      this.data.types.every(function(item){
        if(item.is_show){
                     wx.setStorageSync('currentType', item.value)
                     that.setData({currentType:item.value})
                     return false
          }else{
            return true
          }
      })
    }
    this.getList(this.data.currentType)
  },
  onShow:function(){
    //每次出现的时候都判断一下是否需要刷新内容
    if(app.globalData.needFreshTypes){
      app.globalData.needFreshTypes = false
      this.setData({
        types:wx.getStorageSync('types'),
        currentType:wx.getStorageSync('currentType')
      })
      this.getList(wx.getStorageSync('currentType')) 
    }
  },
  getList:function(type){
    dialog.loading()
        var that = this
        //请求数据
        wx.request({
          url:app.globalData.api.listBaseUrl+type,
          success:function(ret){
            ret = ret['data']
            if(ret['showapi_res_code'] == 0 && ret['showapi_res_body'] &&  ret['showapi_res_body'] ['ret_code']==0){
              that.setData({
              contentList:ret['showapi_res_body']['pagebean']['contentlist']
              })
            }else{
              setTimeout(function(){
                dialog.toast("网络出错啦~")
              },1)
            }
          },
          complete:function(){
            dialog.hide()
          }
        })
  },
  onPullDownRefresh:function(){
    this.getList(this.data.currentType)
  },
  //点击某一个title条
  changeType:function(e){
    var type = e.currentTarget.dataset.value
    if(type == this.data.currentType){
      return;
    }
    this.setData({currentType:type})
    app.globalData.currentType = type
    this.getList(type)
  },
  gotoTypeEdit:function(e){
    wx.navigateTo({
      url: '../types/types',
    })
  },
  gotoAlbum:function(e){
    let param = e.currentTarget.dataset, title = param.title, id=param.id
    wx.navigateTo({url:"../album/album?title="+title+"&id="+id})
  },
  data: {
    contentList:[],
    currentType:wx.getStorageSync('currentType'), 
    types:wx.getStorageSync('types') ? wx.getStorageSync('types') : app.globalData.types
  }
})
