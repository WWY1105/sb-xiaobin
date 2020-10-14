// pages/onlineOrder/ranking/ranking.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 1,
        page: 1,
        count: 10,
        pageSize: 1,
        shopId: '',
        date: '',
        workingShop: null,
        hasDataFlag: false,
        rankList: [],
        time: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // shopId;date;type;
       wx.hideShareMenu();
        let workingShop = wx.getStorageSync('workingShop')
        if (workingShop) {
            this.setData({
                workingShop: workingShop
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
        ;
        this.getRank()
    },
    // 日期选择
    bindMultiPickerChange(e) {
        let date = e.detail.value;
        this.setData({
            date,
            rankList: []
        }, () => {
            this.getRank()
        })

    },
    // 切换日榜
    changeTab(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            type,
            rankList: []
        }, () => {
            this.getRank()
        })
    },
    // 获取排行榜
    getRank() {
        let that = this;
        let url = '/profits/shop/' + this.data.workingShop.id + '/rank';
        return new Promise((resolve, reject) => {
            let json = {
                type: that.data.type,
                count: that.data.count,
                page: that.data.page
            }
            if (that.data.date) {
                json.date = this.data.date
            }
            app.util.request(that, {
                // type:1日榜；type:2月榜
                url: app.util.getUrl(url, json),
                method: 'GET',
                header: app.globalData.token,
            }).then((res) => {
                resolve();
                if (res.code == 200) {
                    
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