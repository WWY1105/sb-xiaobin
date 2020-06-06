// pages/bind/bind.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    staff: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      });
      this.getUser(options.id)
    }
  },
  // 绑定
  login(e) {
    let _self = this;
    if (wx.getStorageSync('userInfo')) {
      app.util.request(_self, {
        url: app.util.getUrl('/profits/staff'),
        method: 'POST',
        header: app.globalData.token,
        data: {
          id: _self.data.id
        }
      }).then((res) => {
        // let data = res.data;
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '绑定成功',
          })
          setTimeout(function() {
            _self.skip()
          }, 800)
        } else if (data.code == 404014) {
          wx.showToast({
            title: '待绑定信息已过期，请重新从捷帐宝获取二维码后扫描',
          })
        }

      })

    } else {
      // 没有用户信息
      wx.login({
        success: res => {
          console.log('res')
          console.log(res)
          wx.request({
            url: app.util.getUrl('/auth/sign'),
            method: 'POST',
            header: {
              'apiKey': '6b774cc5eb7d45818a9c7cc0a4b6920f' // 默认值
            },
            data: {
              'code': res.code,
              "iv": e.detail.iv,
              "encryptedData": e.detail.encryptedData,
            },
            success: function(res) {
              wx.hideLoading();
              let data = res.data;
              if (data.code == 200) {
                if (data.result.token) {
                  wx.setStorageSync('token', data.result.token);
                  app.globalData.token.token = data.result.token;
                }
                // ----------------
                app.util.request(_self, {
                  url: app.util.getUrl('/user'),
                  method: 'GET',
                  header: app.globalData.token
                }).then((res) => {
                  console.log(res)
                  if (res.code == 200) {
                    wx.hideLoading()
                    app.globalData.userInfo = res.result
                    wx.setStorageSync('userInfo', res.result)
                    _self.setData({
                      user: res.result,
                      modalShow: true
                    })
                    wx.hideLoading();
                    _self.login()
                  }
                })
                //刷新当前页面的数据
                //   if (getCurrentPages().length != 0) {

                //     _self.data.parentThis.againRequest()
                //   }
                // } else {

              }
            },
            fail: function(res) {
              wx.hideLoading();

              let data = res.data;
              wx.showToast({
                title: data.message,
                duration: 2000
              });

            }
          })
        }
      })

    }
  },

  // 跳过
  skip() {
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },
  //获取我的信息
  getUser(id) {
    let that = this;
    let url = '/profits/staff/' + id
    // app.util.request(that, {
    //   url: app.util.getUrl(url),
    //   method: 'GET',
    //   header: app.globalData.token,
    // }).then((res) => {
    wx.request({
      url: app.util.getUrl(url),
      method: 'GET',
      header: app.globalData.token,
      success: function(res) {
        console.log(res)
        let data = res.data;
        if (data.code == 200) {
          wx.hideLoading()
          that.setData({
            staff: data.result
          })
        } else {
          that.setData({
            staff: {}
          })
        }
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

    this.setData({
      user: wx.getStorageSync('userInfo')
    })
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