// pages/myStores/myStores.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeList: [],
        page: 1,
        count: 10,
        pageSize: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.getMyStore()
    },
// 查询我的门店
getMyStore() {
    let that = this;
    let url = '/shops'
    return new Promise((resolve, reject) => {
      app.util.request(that, {
        url: app.util.getUrl(url, {
          count: that.data.count,
          page: that.data.page
        }),
        method: 'GET',
        header: app.globalData.token,
      }).then((res) => {
        resolve();
        if (res.code == 200) {
          wx.hideLoading()
          let storeList = that.data.storeList;
          let hasDataFlag = that.data.hasDataFlag;
          storeList = storeList.concat(res.result.items);
          if (storeList.length > 0) {
            hasDataFlag = true;
          } else {
            hasDataFlag = false
          }
          that.setData({
            storeList,
            pageSize: res.result.pageSize,
            hasDataFlag
          })
        } else {
          that.setData({
            storeList: [],
            hasDataFlag: false
          })
        }
      })
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
        console.log('到底');
        let that = this;
        if (that.data.page < that.data.pageSize) {
          let page = that.data.page;
          page += 1;
          that.setData({
            page
          })
          that.getMyStore()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})