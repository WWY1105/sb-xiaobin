// pages/myStores/myStores.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      parentThis:'',
      storeList: [],
      page: 1,
      count: 10,
      pageSize: 1,
      modalShow: false,
      clickObj: null,
      tabShow: false
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {

   },
   shopTap(e) {
      let index = e.currentTarget.dataset.index;
      let storeList = this.data.storeList;
      storeList.map((i, ind) => {
         i.tabShow = false;
      })
      storeList[index].tabShow = true;
      this.setData({
         storeList
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
      this.setData({
         parentThis:this,
         storeList: []
      }, () => {
         this.getMyStore()
      })

   },
   againRequest() {
      this.getMyStore()
   },

   // 设置常用店铺
   setUsed(e) {
      let clickObj = e.currentTarget.dataset.item
      this.setData({
         tabShow: false,
         // modalShow: true,
         clickObj
      },()=>{
         this.changeWorkingShop()
      })
   },
   changeWorkingShop() {
      this.setData({
         storeList: []
      }, () => {
         this.cancelChange();
        wx.reLaunch({
          url: '/pages/my/my?shopId='+this.data.clickObj.id,
        })
         
      })

   },
   cancelChange() {
      this.setData({
         modalShow: false
      })
   },
   //退出门店
   logout(e) {
      this.setData({
         tabShow: false
      })
      let clickObj = e.currentTarget.dataset.item;
      let that = this;
      wx.showModal({
         title: '提示',
         content: '是否确认退出门店:' + clickObj.name,
         showCancel: true,
         confirmText: '确定',
         success(res) {
            if (res.confirm) {
               app.util.request(that, {
                  url: app.util.getUrl('/shops/shop/' + clickObj.id),
                  method: 'POST',
                  header: app.globalData.token
               }).then((res) => {
                  if (res.code == 200) {
                     wx.hideLoading();
                   
                     that.setData({
                        storeList: []
                     }, () => {
                        that.getMyStore()
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
                  hasDataFlag = false;
                  console.log('哈哈哈哈')
                  

               }
               that.setData({
                  storeList,
                  pageSize: res.result.pageSize,
                  hasDataFlag
               })
            } else {
               // code!=200
               if (that.data.page == 1 && that.data.storeList<=0) {
                  wx.navigateBack({
                     delta: 2
                  })
               }
               that.setData({
                  storeList: [],
                  hasDataFlag: false
               })
            }
         })
      })

   },
   // 去添加门店
   toAddStore: app.util.throttle(function (e) {
      wx.navigateTo({
         url: '/pages/addStore/addStore',
      })
   }),
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