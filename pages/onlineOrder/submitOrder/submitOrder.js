// pages/onlineOrder/submitOrder/submitOrder.js
const app = getApp()
Page({
   /**
    * 页面的初始数据
    */
   data: {
      shopId: '',
      menus: [],
      total: 0,
      totalPrice: 0,
      order:null,
      orderId: '',
      editFlag:false
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
   getOrderDetail() {
      let that = this;
      let url = '/takeouts/order/' + this.data.orderId;
      app.util.request(that, {
        url: app.util.getUrl(url, {
        }),
        method: 'GET',
        header: app.globalData.token,
      }).then((res) => {
        console.log(res)
        if (res.code == 200) {
          that.setData({
            order: res.result
          })
        } else {
         
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
      this.getOrderDetail();
     

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
      wx.redirectTo({
      //   url: '/pages/onlineOrder/editOrder/editOrder?orderId='+this.data.order.id,
         url:'/pages/onlineOrder/index'
      })
   },
   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})