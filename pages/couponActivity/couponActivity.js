// pages/couponActivity/couponActivity.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      shopId:'',
      coupon:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.shopId)
       if(options.shopId){
           this.setData({shopId:options.shopId})
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
        this.getCouponList()
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

    },


    // 获取券列表
    getCouponList(){
        let that = this;
        let url = '/promotes/shop/'+this.data.shopId+'/coupons'
        app.util.request(that, {
          url: app.util.getUrl(url),
          method: 'GET',
          header: app.globalData.token,
        }).then((res) => {
          console.log(res)
          if (res.code == 200) {
            wx.hideLoading()
            that.setData({
              coupon: res.result
            })
          }
        })
    }
})