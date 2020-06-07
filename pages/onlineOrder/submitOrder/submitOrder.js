// pages/onlineOrder/submitOrder/submitOrder.js
const app=getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {

   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading({
         complete: (res) => { },
      })
      console.log(options)
      if (options.shopId) {
         this.setData({ shopId: options.shopId }, () => {
            this.submit()
         })
      }
     
   },

   // 提交订单
   submit() {
      let that=this;
      let time =wx.getStorageSync('time')
      let type = wx.getStorageSync('type');
      let menus = wx.getStorageSync('menus');

      app.util.request(that, {
         url: app.util.getUrl('/takeouts/shop/' + that.data.shopId ),
         method: 'POST',
         header: app.globalData.token,
         data:{
            menus,
            time,
            type
         }
      }).then((res) => {
         if (res.code == 200) {
            wx.hideLoading()
         } else {
            that.setData({
               notFound: false
            })
            wx.showToast({
               title: res.message,
               icon: 'none',
               duration: 2000
            });
         }
      })
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