// pages/onlineOrder/orderRecord/orderRecord.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopId: '',
        orderList: null,
        count: 5,
        page: 1,
        type: 1001
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
            }, () => {
                this.getOrderList()
            })
        }
    },
    // 切换类型
    changeType(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            type
        }, () => {
            this.getOrderList()
        })
    },
    //   获取订单列表
    getOrderList() {
        let url = '/takeouts/shop/' + this.data.shopId + '/finish';
        let that = this;
        app.util.request(that, {
            url: app.util.getUrl(url, {
                type: this.data.type
            }),
            method: 'GET',
            header: app.globalData.token,
        }).then((res) => {
            console.log(res)
            if (res.code == 200) {
                wx.hideLoading();
                that.setData({
                    orderList: res.result
                })
            }else{
                that.setData({
                    orderList: []
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