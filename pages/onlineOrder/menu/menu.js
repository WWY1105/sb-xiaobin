// pages/onlineOrder/menu/menu.js
const app = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      shopId: '',
      type: '',
      time: '',
      menu: {},
      activeKind: 0
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
      if (options.shopId) {
         this.setData({ shopId: options.shopId })
      }
      if (options.type) {
         this.setData({ type: options.type })
      }
      if (options.time) {
         this.setData({ time: options.time }, () => {
            this.getMenu()
         })
      }

   },
   // 切换品类
   changeKind(e) {
      let activeKind = e.target.dataset.index;
      this.setData({ activeKind })
   },
   // 获取菜单
   getMenu() {
      let that = this;
      let url = '/menus/shop/' + this.data.shopId + '/supply';
      let time = encodeURIComponent(this.data.time);
      console.log(time)
      app.util.request(that, {
         url: app.util.getUrl(url, { time }),
         method: 'GET',
         header: app.globalData.token,
         data: { time: that.data.time }
      }).then((res) => {
         console.log(res)
         if (res.code == 200) {
            wx.hideLoading();
            // 循环菜品,设置默认数量0
            res.result.map((item) => {
               item.dishes.map((i) => {
                  i.num = 0
               })
            })
            that.setData({
               menu: res.result
            })
         }
      })
   },
   //加数量
   jia(e) {
      let dishIndex = e.target.dataset.index;
      let activeKind = this.data.activeKind;
      let menu = this.data.menu;
      menu[activeKind].dishes[dishIndex].num += 1;
      this.setData({ menu })
   },
   jian(e) {
      let dishIndex = e.target.dataset.index;
      let activeKind = this.data.activeKind;
      let menu = this.data.menu;
      if (menu[activeKind].dishes[dishIndex].num <= 0) {
         menu[activeKind].dishes[dishIndex].num = 0;
      } else {
         menu[activeKind].dishes[dishIndex].num -= 1;
      }

      this.setData({ menu })
   },
   // 提交订单
   toSubmit() {
      let time = this.data.time;
      let type = this.data.type;
      let menu = this.data.menu;
      let shopId = this.data.shopId;
      let obj = {}
      // 循环菜品,获取id和数量
      menu.map((item) => {
         item.dishes.map((i) => {
            console.log(i)
            if (i.num > 0) {
               obj[i.id] = i.num
            }
         })
      })
      console.log(obj)
      wx.setStorageSync('time', time)
      wx.setStorageSync('menus', obj)
      wx.setStorageSync('type', type)
      let url = '/pages/onlineOrder/submitOrder/submitOrder?shopId=' + this.data.shopId
      wx.navigateTo({
         url
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