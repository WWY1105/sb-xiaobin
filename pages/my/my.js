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
    profits: {},
    rank:{},
    page: 1,
    count: 10,
    pageSize: 1,
    hasDataFlag: false,
    workingShop: null,
    shopId:''
  },

  againRequest() {
    this.onShow();
  },

  // 点击去登陆
  toLogin(e) {
    console.log(e)
    let that = this;
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
          success: function (res) {
            wx.hideLoading();
            let data = res.data;
            if (data.code == 200) {
              if (data.result.token) {
                wx.setStorageSync('token', data.result.token);
                app.globalData.token.token = data.result.token;
              }
              if (that.selectComponent("#authpop")) {
                let pop = that.selectComponent("#authpop");
                pop.hiddenpop();
              }
              that.getMyStore();

              // ----------------
              app.util.request(that, {
                url: app.util.getUrl('/user'),
                method: 'GET',
                header: app.globalData.token
              }).then((res) => {
                console.log(res)
                if (res.code == 200) {
                  wx.hideLoading()
                  app.globalData.userInfo = res.result
                  wx.setStorageSync('userInfo', res.result)
                  that.setData({
                    user: res.result
                  })
                  wx.hideLoading();

                }
              })
              // ----------------
              if (getCurrentPages().length != 0) {
                //刷新当前页面的数据
                that.data.parentThis.againRequest()
              }
            } else {

            }
          },
          fail: function (res) {
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
    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {

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
        success: function (res) {
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            that.setData({
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

  reflesh: function () {
    let that = this;
    that.getMyStore()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let shopId=''
    if(options.shopId){
      shopId=options.shopId
    }else{
      shopId=wx.getStorageSync('workingShop')?wx.getStorageSync('workingShop').id:''
    }
    this.setData({shopId})
  },

  
  // 切换店铺
  changeShop() {
    wx.navigateTo({
      url: '/pages/myStores/myStores',
    })
  },

  // 查询我的门店
  getMyStore() {
    let that = this;
    let id=this.data.shopId||this.data.user.lastShopId;
     let url = '/shops/shop/'+ id;
    let json={};
   
    return new Promise((resolve, reject) => {
      app.util.request(that, {
        url: app.util.getUrl(url, json),
        method: 'GET',
        header: app.globalData.token,
      }).then((res) => {
        resolve();
        if (res.code == 200) {
          wx.hideLoading()
          let data=res.result;
          let shopId="";
          // 如果没有设置过工作中的店铺
          if (data) {
            wx.setStorageSync('workingShop', data);
            shopId=data.id
          } else {
            wx.setStorageSync('workingShop', null)
          }
          that.setData({
            shopId,
            hasDataFlag:true,
            workingShop: wx.getStorageSync('workingShop')
          })
        } else {
          that.setData({
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
        app.util.request(that, {
          url: app.util.getUrl('/user'),
          method: 'GET',
          header: app.globalData.token
        }).then((res) => {
          console.log(res)
          if (res.code == 200) {
            wx.hideLoading();
           
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
        })
      }
    })

  },

  // 去我的门店
  toStoreDetail: function (e) {
    wx.setStorageSync('shopId', e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/storeDetail/storeDetail?id=' + e.currentTarget.dataset.id + "&storeName=" + e.currentTarget.dataset.storeName
      })
    }
  },
  goto(e) {
    let path = e.currentTarget.dataset.path + "?id=" + this.data.shopId;
    wx.setStorageSync('shopId', this.data.shopId);
    wx.navigateTo({
      url: path
    })
    // console.log(e.currentTarget.dataset)
  },
  todevMenber(e) {
    wx.navigateTo({
      url: '/pages/menberUpgrade/menberUpgrade?id=' + this.data.shopId
    })
  },
  // 去我的收益
  toMyProfit: function () {
    if (!this.data.hasDataFlag) {
      wx.showToast({
        icon: 'none',
        title: '请先加入门店',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/myProfit/myProfit?total=' + this.data.profits.total + '&yesterday=' + this.data.profits.yesterday,
    })
  },
  // 查看榜单
  toRank: function () {
    if (!this.data.hasDataFlag) {
      wx.showToast({
        icon: 'none',
        title: '请先加入门店',
        duration: 2000
      })
      return false;
    }
    console.log(this.data.workingShop)
    // 判断是否加入店铺
    wx.navigateTo({
      url: '/pages/onlineOrder/ranking/ranking?shopId=' + this.data.shopId
    })
  },
  // 去添加门店
  toAddStore: app.util.throttle(function (e) {
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!wx.getStorageSync('token')) {
      app.util.login().then(() => {
        if (!wx.getStorageSync('userInfo')) {
          that.getUserInfo()
        } else {
          that.getMyStore()
          that.setData({
            user: wx.getStorageSync('userInfo')
          })
        }
      });
    } else {
      if (!wx.getStorageSync('userInfo')) {
        that.getUserInfo()
      } else {
        that.setData({
          user: wx.getStorageSync('userInfo')
        })
        that.getMyStore()

      }
    }
    that.setData({
      parentThis: this,
      user: wx.getStorageSync('userInfo')
    })


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
    var that = this
    this.onShow()


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