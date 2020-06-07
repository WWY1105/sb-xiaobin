// pages/onlineOrder/index.js
Page({

   /**
    * 页面的初始数据
    */
   data: {
      time: '12:01',
      shopId:'',
      type:1000
   },
   // 时间
   bindTimeChange(e){
      let time = e.detail.value;
      this.setData({time})
   },
   //跳转订单详情
   toOrderRecord() {
      let url = "/pages/onlineOrder/orderRecord/orderRecord"
      wx.navigateTo({
         url
      })
   },
   //跳转开始下单
   toOrder() {
      let url = "/pages/onlineOrder/menu/menu?shopId=" + this.data.shopId + '&time=' + this.data.time + "&type="+this.data.type
      wx.navigateTo({
         url
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading();
      if (options.shopId){
         this.setData({shopId: options.shopId})
      }
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
      wx.hideLoading();
      // 获取当前时间
      let time = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()  + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes());
      this.setData({time})
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