// pages/myProfit/myProfit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profitList: [],
    yesterday: 0,
    total: 0,
    profits:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (options.total) {
      that.setData({
        total: options.total
      })
    }
    if (options.yesterday) {
      that.setData({
        yesterda: options.yesterday
      })
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
    this.getMyProfit();
    this.getProfits()
    wx.hideShareMenu();
    wx.stopPullDownRefresh()
  },
  gotoProfitDetail(e) {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/profitDetail/profitDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 查询我的收益
  getProfits() {
    let that = this;
    let url = '/profits'
    app.util.request(that, {
      url: app.util.getUrl(url),
      method: 'GET',
      header: app.globalData.token,

    }).then((res) => {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading()
        that.setData({
          profits: res.result
        })
  
      } else {

      }
    })
  },

  getMyProfit() {
    let that = this;
    let url = '/profits/detail'
    app.util.request(that, {
      url: app.util.getUrl(url, {
        count: that.data.count,
        page: that.data.page
      }),
      method: 'GET',
      header: app.globalData.token,
    }).then((res) => {
      if (res.code == 200) {
        that.setData({
          profitList: res.result
        })
       
      } else {
        that.setData({
          profitList: []
        })
      }
    })
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