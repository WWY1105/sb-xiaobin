// pages/onlineOrder/orderRecord/orderRecord.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopId: '',
        orderList: [],
        type: 1001,
        // 分页
        count: 5,
        page: 1,
        hasDataFlag: false,
    },
    // 删除订单
    deleteOrder(e) {
        let that = this;
        let url = '/takeouts/order/' + e.currentTarget.dataset.id;
        app.util.request(that, {
            url: app.util.getUrl(url, {}),
            method: 'DELETE',
            header: app.globalData.token,
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading();
                that.getOrderList()
            }
        })
    },
    // 去修改
    toEdit(e) {
        wx.setStorageSync('editOrder', e.currentTarget.dataset.item);
        wx.navigateTo({
            url: '/pages/onlineOrder/editOrder/editOrder',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideLoading()
        console.log(options)
        let shopId = wx.getStorageSync('shopId')
        if (shopId) {
            this.setData({
                shopId: shopId
            })
        }
    },
    // 切换类型
    changeType(e) {
        let type = e.currentTarget.dataset.type;
        let that=this;
        this.setData({
            count: 5,
            page: 1,
            hasDataFlag: false,
            type
        }, () => {
            that.getOrderList()
        })
       
    },
    //   获取订单列表
    getOrderList() {
        let url = '/takeouts/shop/' + this.data.shopId + '/finish';
        let that = this;
      
        app.util.request(that, {
            url: app.util.getUrl(url, {
                count: that.data.count,
                page: that.data.page,
                type: that.data.type
            }),
            method: 'GET',
            header: app.globalData.token,
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                let orderList = that.data.orderList;
                let hasDataFlag = that.data.hasDataFlag;
                orderList = orderList.concat(res.result.items);
                if (res.result.items.length > 0) {
                  hasDataFlag = true;
                } else {
                  hasDataFlag = false
                }
                that.setData({
                  orderList,
                  pageSize: res.result.pageSize,
                  hasDataFlag
                })
              } else {
                that.setData({
                  hasDataFlag: false
                })
              }
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
        let that = this;
        this.setData({
            count: 5,
            page: 1,
            hasDataFlag: false
        }, () => {
            that.getOrderList()
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
        let that = this;
        if (that.data.hasDataFlag) {
          let page = that.data.page;
          page += 1;
          that.setData({
            page
          },()=>{
            that.getOrderList()
          })
        }
      },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})