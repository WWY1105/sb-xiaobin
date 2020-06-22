// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentThis: '',
    code: '',
    user: '',
    info: '',
    phonePop: false,
    showPhonePop: false,
    codepop: false,
    storeList: [],
    profits: {},
    page: 1,
    count: 10,
    pageSize: 1,
    modalShow: false,
    hasDataFlag: false

  },
  againRequest() {
    this.onShow();
  },

  // 点击去登陆
  toLogin(e) {
    console.log(e)
    let _self = this;
    wx.login({
      success: res => {
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
              _self.getMyStore().then(() => {
                _self.getProfits()
              })

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

                }
              })
              // ----------------
              if (getCurrentPages().length != 0) {
                //刷新当前页面的数据
                _self.data.parentThis.againRequest()
              }
            } else {

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

  },

  // 获取电话号
  getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    //console.log(e)
    var _self = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {

        }
      })
      wx.hideLoading();
    } else {

      wx.request({
        url: app.util.getUrl('/phone/bind'),
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
        },
        header: app.globalData.token,
        success: function(res) {
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            _self.setData({
              showPhonePop: false,
              codepop: true,
              phonePop: true
            })
            wx.showToast({
              title: "授权成功",
              duration: 2000
            });
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }
  },

  showToast() {
    wx.showToast({
      title: '更多功能, 敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  hiddenPop() {
    this.setData({
      codepop: false,
      code: ''
    })
  },
  showPop() {
    if (this.data.phonePop) {
      this.setData({
        showPhonePop: true
      })
    } else {
      this.setData({
        codepop: true
      })
    }

  },
  getValue(e) {
    this.setData({
      code: e.detail.value
    })
  },

  closePhonePop() {
    this.setData({
      showPhonePop: false
    })
  },

  reflesh: function() {
    let that = this;
    that.setData({
      storeList: []
    })
    that.getMyStore()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      parentThis: this
    })

    wx.hideLoading()



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

  //  获取用户详情
  getUserInfo() {
    let that = this;
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('userInfo')) {
        wx.hideLoading()
        that.setData({
          user: wx.getStorageSync('userInfo'),
          phonePop: false
        })
        resolve(wx.getStorageSync('userInfo'))
      } else {
        console.log('执行')
        app.util.request(that, {
          url: app.util.getUrl('/user'),
          method: 'GET',
          header: app.globalData.token
        }).then((res) => {
          console.log(res)
          if (res.code == 200) {
            wx.hideLoading()
            that.setData({
              user: res.result
            })
          
            wx.setStorageSync('userInfo', res.result);
            resolve(wx.getStorageSync('userInfo'))
            if (res.result.phone) {
              wx.setStorageSync('phoneNum', res.result.phone)
              that.setData({
                phonePop: false
              })

            } else {
              wx.setStorageSync('phoneNum', false)
              that.setData({
                phonePop: true
              })
            }
          }
          that.getMyStore()
          that.getProfits()
        })
      }
    })

  },

  // 去我的门店
  toStoreDetail: function(e) {
    wx.setStorageSync('shopId', e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/storeDetail/storeDetail?id=' + e.currentTarget.dataset.id + "&storeName=" + e.currentTarget.dataset.storeName
      })
    }
  },
  // 去我的收益
  toMyProfit: function() {
    wx.navigateTo({
      url: '/pages/myProfit/myProfit?total=' + this.data.profits.total + '&yesterday=' + this.data.profits.yesterday,
    })
  },
  // 去添加门店
  toAddStore: app.util.throttle(function(e) {
    if (!wx.getStorageSync('userInfo')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/addStore/addStore',
      })
    }

  }),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.hideLoading()
    this.setData({parentThis:this})
    if (!wx.getStorageSync('token')) {
      app.util.login().then(() => {
        if (!wx.getStorageSync('userInfo')) {
          that.getUserInfo()
        } else {
          that.getMyStore().then(() => {
            that.getProfits()
          })
          that.setData({
            storeList: [],
            user: wx.getStorageSync('userInfo')
          })
        }
      });
    } else {
      if (!wx.getStorageSync('userInfo')) {
        that.getUserInfo()
      } else {
        that.setData({
          storeList: [],
          user: wx.getStorageSync('userInfo')
        })
        that.getMyStore().then(() => {
          that.getProfits()
        })
      
      }
    }
    that.setData({
      user: wx.getStorageSync('userInfo')
    }, () => {
      if (this.data.user) {
        that.setData({
          modalShow: false
        })
      }
     })

    // if (app.globalData.refreshFlag) {
    //   that.setData({
    //     storeList: []
    //   }, () => {
    //     app.globalData.refreshFlag = false;
    //     that.getMyStore();
    //   })
    // }
    // that.getMyStore().then(() => {
    //   that.getProfits()
    // })
    wx.hideShareMenu();
    wx.stopPullDownRefresh()





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
    var that = this
    this.onShow()


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  onShareAppMessage: function() {

  }
})