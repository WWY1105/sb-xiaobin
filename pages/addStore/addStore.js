// pages/addStore/addStore.js
const app = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      notFound:false,// 没找到门店的tips
      keyword:'',
      activeBtn:false,
      shopInfo:null
   },
   // 获取门店信息
   getStoreInfo(keyword){
      let that = this;
      app.util.request(that, {
         url: app.util.getUrl('/shops/shop',{
            code:keyword
         }),
         method: 'GET',
         header: app.globalData.token,
         data: {
            code: keyword
         }
      }).then((res) => {
         if (res.code == 200) {
            wx.hideLoading()
            that.setData({activeBtn:true,storeInfo:res.result })
            
         } else {
            that.setData({ notFound: true })
         }
      })
   },
   // 提交商户编号
   submitCode:app.util.throttle(function (e) {
      let that=this;
      wx.showModal({
         title: '提示',
         content: '是否确认加入门店:'+that.data.storeInfo.name,
         showCancel: true,
         confirmText: '确定',
         success(res) {
            if (res.confirm) {
               app.util.request(that, {
                  url: app.util.getUrl('/shops'),
                  method: 'POST',
                  header: app.globalData.token,
                  data: {
                     code: that.data.keyword || keyword
                  }
               }).then((res) => {
                  if (res.code == 200) {
                     wx.hideLoading()
                     that.setData({ activeBtn: true })
                     // wx.redirectTo({
                     //    url: '/pages/my/my',
                     // })
                    app.globalData.refreshFlag=true;
                     wx.navigateBack({
                        delta: 2
                     })
                  } else{
                     that.setData({ notFound: false })
                     wx.showToast({
                        title: '添加失败',
                        icon: 'none',
                        duration: 2000
                     });
                  }
               })
            }
         }
      })
    
   }),
   // 获取商户code
   shopInput(e){
      let keyword=e.detail.value;
      console.log(keyword)
      if (keyword.length==8){
         this.getStoreInfo(keyword)
      }else{
         this.setData({
            storeInfo:null,
            notFound:false
         })
      }
      this.setData({
         keyword
      })
   },
   // 根据商户号,查询商户信息

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading();
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      wx.hideShareMenu();
      wx.stopPullDownRefresh()
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function () {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})