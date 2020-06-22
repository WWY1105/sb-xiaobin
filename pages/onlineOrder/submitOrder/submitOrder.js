// pages/onlineOrder/submitOrder/submitOrder.js
const app = getApp()
Page({
   /**
    * 页面的初始数据
    */
   data: {
      time: "",
      type: '',
      shopId: '',
      menus: [],
      total: 0,
      totalPrice: 0,

      jumpFlag: false,
      orderId: '',
      editFlag: false
   },
   // 修改菜单
   editMenus() {
      this.setData({
         editFlag: true
      })
   },
   // 去修改
   toEditDish() {
      this.setData({
         editFlag: false
      },()=>{
         wx.redirectTo({
            url: '/pages/onlineOrder/editMenu/editMenu?id='+this.data.orderId
         })
      })
   },
   cancelEdit() {
      this.setData({
         editFlag: false
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
      if (options.orderId) {
         this.setData({
            orderId: options.orderId
         })
      }
      if (options.shopId) {
         this.setData({
            shopId: options.shopId
         })
      }
      if (options.type) {
         this.setData({
            type: options.type
         })
      }
   },
   // 取消跳转
   cancelJump() {
      this.setData({
         jumpFlag: false
      })
   },
   // 提交订单
   submit() {
      let that = this;

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
      if (wx.getStorageSync('type')) {
         this.setData({
            type: wx.getStorageSync('type')
         })
      }
      if (wx.getStorageSync('totalPrice')) {
         this.setData({
            totalPrice: wx.getStorageSync('totalPrice')
         })
      }
      if (wx.getStorageSync('menus')) {
         this.setData({
            menus: wx.getStorageSync('menus')
         })
      }
      if (wx.getStorageSync('time')) {
         this.setData({
            time: wx.getStorageSync('time')
         })
      }

   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {
this.setData({editFlag:false})
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

   bindcomplete(){
      let editOrder = {
         deliver:{
            type:this.data.type,
            time:this.data.time,
         },
         menus:this.data.menus,
         orderId: this.data.orderId,
         amount:this.data.totalPrice
      };
      wx.setStorageSync('editOrder',editOrder)
      wx.navigateTo({
        url: '/pages/onlineOrder/editOrder/editOrder',
      })
   },
   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})