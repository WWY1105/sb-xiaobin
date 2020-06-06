// pages/menberUpgrade/menberUpgrade.js
const app = getApp();
let QRCode = require("../../utils/qrCode.js").default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasQrCode: '',
    qrCodeUrl: '',
    upgradeData:{},
    // 升级列表
    upgradeMenberList:[
    ],
    swipercurrent:0,//swiper当前
   
    storeId:'',
    gradeData:{},
    type: {
      // "6001": "升级",
      '6000': '享会员价',
      "6002": "充值好礼",
      "6003": "积分兑换",
      "6004": "免费领券",
      "6005": "满额打折",
      "6006": "特价菜品",
      "6007": "消费返券",
      "6008": "消费积分",
      "6009": "积分抵现",
      "6012": "以少抵多",
      "6014": "满额立减",
      "6015": "优惠套餐",
      "6017": "充值免单",
      '6013': '评价立减'
    },
  },
  swiperchange(e){
    this.setData({
      swipercurrent: e.detail.current,
    })
    this.getUpgrade(this.data.upgradeMenberList[e.detail.current])
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
    let that=this;
    if (options.id) {
      this.getGrade(options.id).then((res)=>{
        // res是所有的等级
        if(res.length>0){
          that.getUpgrade(res[that.data.swipercurrent]);
        }
        
      });
     
      this.setData({
        storeId: options.id
      })
    }
    let sysinfo = wx.getSystemInfoSync();
    console.log(sysinfo)
    let qrcode = new QRCode('myCanvas', {
      text: '',
      //获取手机屏幕的宽和长  进行比例换算
      width:75,
      height:75,
      //二维码底色尽量为白色， 图案为深色
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.correctLevel.H
    });
    //将一个局部变量共享
    this.QR = qrcode;
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
    this.setData({ swipercurrent :0 })
    wx.hideShareMenu();
    wx.stopPullDownRefresh()
  },
  // 查询等级
  getGrade(id) {
    let that = this;
    let url = '/promotes/shop/' + id+'/grade';
    return new Promise((resolve,reject)=>{
      app.util.request(that, {
        url: app.util.getUrl(url),
        method: 'GET',
        header: app.globalData.token
      }).then((res) => {
        if (res.code == 200) {
          wx.hideLoading();
          resolve(res.result)
          that.setData({ upgradeMenberList:res.result })
        } else {
           wx.showToast({
              title: res.message,
              icon: 'none'
           })
        }
      })
    })
    
  },
  // 查询等级
  getUpgrade(res) {
    let that = this;
    console.log(res);
    let url = "/promotes/shop/" + this.data.storeId +"/upgrade" ;
    let data={};
    if(res){
      data.gradeId =res.id;
    }
    return new Promise((resolve, reject) => {
      app.util.request(that, {
        url: app.util.getUrl(url, data),
        method: 'GET',
        header: app.globalData.token
      }).then((res) => {
        if (res.code == 200) {
          wx.hideLoading();
          resolve(res.result)
          that.setData({upgradeData:res.result });
          // 画码
          let codeurl = res.result.wxQrCode;
          if (codeurl) {
            that.QR.clear();
            that.QR.makeCode(codeurl);
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                complete: function (res) {
                  var tempFilePath = res.tempFilePath;
                  that.setData({
                    canvasQrCode: tempFilePath
                  }, () => { that.QR.clear() })
                  
                },
                fail: function (res) {
                  console.log(res);
                  console.log('小程序码----qrCodeUrl_fake-----失败')
                }
              });
            }, 1000)
          } 
        } else {
          that.setData({ upgradeData: null})
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})