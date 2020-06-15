// pages/onlineOrder/submitOrder/submitOrder.js
const app = getApp()
Page({
   /**
    * 页面的初始数据
    */
   data: {

      wayArr: ['外卖配送', '到店自取'],
      editOrder: null,
      way: '',
      editFlag: false
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
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
      let editOrder = wx.getStorageSync('editOrder')
      if (editOrder) {
         let way = editOrder.deliver.type == '1001' ? '外卖配送' : "到店自取"
         this.setData({
            editOrder,
            way
         })
      }
   },
   // 去修改
   toEditDish(){
      wx.navigateTo({
        url: '/pages/onlineOrder/editMenu/editMenu',
      })
   },
   // 修改配送方式
   bindPickerChange(e) {
      console.log(e.detail.value)
   },
   // 修改菜单
   editMenus() {
      this.setData({
         editFlag: true
      })
   },
   cancelEdit(){
      this.setData({
         editFlag: false
      })
   },
   // 确定修改
   toEditDis(){},
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