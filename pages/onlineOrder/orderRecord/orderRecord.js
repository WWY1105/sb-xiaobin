// pages/onlineOrder/orderRecord/orderRecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    shopId: '',
    orderList: null,
    count: 5,
    page: 1
  },
  // 去修改
  toEdit(e) {
    wx.setStorageSync('editOrder', e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/onlineOrder/editOrder/editOrder',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
    console.log(options)
    let shopId=wx.getStorageSync('shopId')
    if (options.type && shopId) {
      this.setData({
        type: options.type,
        shopId: shopId
      }, () => {
        this.getOrderList()
      })
    }
  },
  getOrderList() {
    let url = '';
    let that = this;
    if (this.data.type == 'pay') {
      url = '/takeouts/shop/' + this.data.shopId + '/finish'
    } else {
      url = '/takeouts/shop/' + this.data.shopId
    }
    app.util.request(that, {
      url: app.util.getUrl(url, {}),
      method: 'GET',
      header: app.globalData.token,
    }).then((res) => {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading();
        that.setData({
          orderList: res.result
        })
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