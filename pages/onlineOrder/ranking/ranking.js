// pages/onlineOrder/ranking/ranking.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        count: 10,
        pageSize: 1,
        shopId: '',
        hasDataFlag:false,
        rankList: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.shopId) {
            this.setData({
                shopId: options.shopId
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
        wx.hideLoading();
        this.getRank()
    },
    getRank() {
        let that = this;
        let url = '/profits/shop/' + this.data.shopId + '/rank';
        return new Promise((resolve, reject) => {
            app.util.request(that, {
                url: app.util.getUrl(url, {
                    type: 2,
                    date:'2020-06-06',
                    count: that.data.count,
                    page: that.data.page
                }),
                method: 'GET',
                header: app.globalData.token,
            }).then((res) => {
                resolve();
                if (res.code == 200) {
                    wx.hideLoading()
                    let rankList = that.data.rankList;
                    let hasDataFlag = that.data.hasDataFlag;
                    rankList = rankList.concat(res.result.items);
                    if (rankList.length > 0) {
                        hasDataFlag = true;
                    } else {
                        hasDataFlag = false
                    }
                    that.setData({
                        rankList,
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})