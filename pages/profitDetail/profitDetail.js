// pages/profitDetail/profitDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    profitDetail: {},
    name:'',
    brand:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
  },
  getProfitDetail() {
    let that = this;
    let url = '/profits/' + that.data.id
    app.util.request(that, {
      url: app.util.getUrl(url, {
        count: that.data.count,
        page: that.data.page
      }),
      method: 'GET',
      header: app.globalData.token,
    }).then((res) => {
      if (res.code == 200) {
        let index = res.result.name.indexOf('(');
        let name = res.result.name.substring(0, index);
        let brand = res.result.name.substring(index);
        that.setData({
          profitDetail: res.result,
          name: name,
          brand: brand
        })
       
        // console.log(name)
        // console.log(brand)
        // console.log(res.result.name.indexOf('('))
      } else {
        that.setData({
          profitDetail: {}
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideLoading();
    wx.hideShareMenu();
    wx.stopPullDownRefresh()
    this.getProfitDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})