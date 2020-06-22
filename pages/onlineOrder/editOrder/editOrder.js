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
      editFlag: false,
      orderId:''
   },
   // 删除订单
   deleteOrder(e) {
      let that = this;
      let editOrder = wx.getStorageSync('editOrder');
      wx.showModal({
         title: '提示',
         content: '是否删除此订单',
         success(res) {
            if (res.confirm) {
               let shopId = wx.getStorageSync('shopId');
               let url = '/takeouts/shop/' + shopId + '/order/' + editOrder.id;
               app.util.request(that, {
                  url: app.util.getUrl(url, {}),
                  method: 'DELETE',
                  header: app.globalData.token,
               }).then((res) => {
                  console.log(res)
                  if (res.code == 200) {
                     wx.hideLoading();
                     wx.navigateBack({
                        delta: 2
                     })
                  }
               })
            } else if (res.cancel) {
            }
         }

      })
     
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
      
      let shopId = wx.getStorageSync('shopId');
      let editOrder = wx.getStorageSync('editOrder');
      console.log('orderId===='+editOrder.id)
      this.setData({orderId:editOrder.id,shopId})
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
   toEditDish() {
      let editOrder = wx.getStorageSync('editOrder');
      wx.navigateTo({
         url: '/pages/onlineOrder/editMenu/editMenu?id=' + editOrder.id,
      })
   },
   // 修改配送方式
   bindPickerChange(e) {
      let index=e.detail.value;
      let that = this;
      let type;
      if(index==0){
         type=1001
      }else{
         type=1000
      }
      if(type==this.data.editOrder.deliver.type){
         return;
      }
      let obj = {};
      let menus=this.data.editOrder.menus;
      let time=this.data.editOrder.deliver.time
      // 循环菜品,获取id和数量
      menus.map((i) => {
         if (i.count > 0) {
            obj[i.id] = i.count;
         }
      })
         let url = '/takeouts/shop/' + that.data.shopId + '/order/' + this.data.orderId;
         app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'PUT',
            header: app.globalData.token,
            data: {
               menus: obj,
               type,
               time,
            }
         }).then((res) => {
            if (res.code == 200) {
               let way = type == '1001'||type == 1001 ? '外卖配送' : "到店自取";
               that.setData({way});
               wx.showToast({
                  title: '配送方式修改成功',
                  icon: 'none',
                  duration: 2000
               });
               // wx.showModal({
               //   title:'提示',
               //   content:'配送方式修改成功，需要重新发送给顾客确认'
               // })
            } else {
               wx.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 2000
               });
            }
         })
   },
   // 修改菜单
   editMenus() {
      this.setData({
         editFlag: true
      })
   },
   cancelEdit() {
      this.setData({
         editFlag: false
      })
   },
   // 确定修改
   toEditDis() {},
   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {
this.setData({editFlag: false})
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