// pages/shopDetail/shopDetail.js
const app = getApp()
Page({
  // 去发展会员
  todevMenber: function () {
    // wx.navigateTo({
    //    url: '/pages/devMenber/devMenber',
    // })
  },

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {},
    storeId: '',
    storeName: ''
  },
  goto(e) {
    let path = e.currentTarget.dataset.path + "?id=" + this.data.storeId;
    wx.setStorageSync('shopId', this.data.storeId);
    wx.navigateTo({
      url: path
    })
    // console.log(e.currentTarget.dataset)
  },
  todevMenber(e) {
    wx.navigateTo({
      url: '/pages/menberUpgrade/menberUpgrade?id=' + this.data.storeId
    })
  },
  // 查询我的门店
  getMyStore(id) {
    let that = this;
    let url = '/shops/shop/' + id
    wx.request({
      url: app.util.getUrl(url),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.hideLoading()
          that.setData({
            storeInfo: res.data.result
          })
          // 设置页面标题为店铺名称
          wx.setNavigationBarTitle({
            title: res.data.result.name,
          })
        } else {
          that.setData({
            storeInfo: {}
          })
        }
      }
    })
  },
  // 退出门店
  logout() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认退出门店:' + that.data.storeInfo.name,
      showCancel: true,
      confirmText: '确定',
      success(res) {
        if (res.confirm) {
          app.util.request(that, {
            url: app.util.getUrl('/shops/shop/' + that.data.storeInfo.id),
            method: 'POST',
            header: app.globalData.token
          }).then((res) => {
            if (res.code == 200) {
              wx.hideLoading()
              // wx.redirectTo({
              //    url: '/pages/my/my',
              // })
              app.globalData.refreshFlag=true;
              wx.navigateBack({
                delta: 2
              })

            } else {
              that.setData({
                notFound: false
              })
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              });
            }
          })
        }
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideLoading();
    if (options.id) {
      this.getMyStore(options.id);
      this.setData({
        storeId: options.id
      })
    }
    if (options.storeName) {
      this.setData({
        storeName: options.storeName
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
    wx.hideShareMenu();
    wx.stopPullDownRefresh()
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