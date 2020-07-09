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
      orderId: '',
      order:{}
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
   
      if (options.orderId) {
         this.setData({
            orderId: options.orderId,
            
         })
      }
   },


   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {

   },
// 获取订单详情
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
      let way = res.result.deliver.type == '1001' ? '外卖配送' : "到店自取"
       that.setData({
         order: res.result,
         way
       })
     } else {
      
     }
   })
 },
   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      wx.hideShareMenu();
      this.getOrderDetail()
      let editOrder = wx.getStorageSync('editOrder')
    
   },
   // 去修改
   toEditDish() {
      wx.redirectTo({
         url: '/pages/onlineOrder/editMenu/editMenu?id=' + this.data.order.id,
      })
   },
   bindcomplete() {
      wx.redirectTo({
         //   url: '/pages/onlineOrder/editOrder/editOrder?orderId='+this.data.order.id,
         url: '/pages/onlineOrder/index'
      })
   },
   // 修改配送方式
   bindPickerChange(e) {
      let index = e.detail.value;
      let that = this;
      let type;
      if (index == 0) {
         type = 1001
      } else {
         type = 1000
      }
      if (type == this.data.order.deliver.type) {
         return;
      }
      let obj = {};
      let menus = this.data.order.menus;
      let time = this.data.order.deliver.time
      // 循环菜品,获取id和数量
      menus.map((i) => {
         if (i.count > 0) {
            obj[i.id] = i.count;
         }
      })
      let url = '/takeouts/order/' + this.data.orderId;
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
            let way = type == '1001' || type == 1001 ? '外卖配送' : "到店自取";
            that.setData({
               way
            });
            wx.showToast({
               title: '配送方式修改成功',
               icon: 'none',
               duration: 2000
            });
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
      this.setData({
         editFlag: false
      })
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