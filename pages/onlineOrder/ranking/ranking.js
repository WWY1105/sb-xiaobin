// pages/onlineOrder/ranking/ranking.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 1,
        page: 1,
        count: 100,
        pageSize: 1,
        shopId: '',
        date: '',
        workingShop: null,
        hasDataFlag: false,
        rankList: [],
        time: '',
        range:'',//统计时间

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let date=this.getYestoday();
        let shopId="";
        let type=1;
        let workingShop =wx.getStorageSync('workingShop')
        if(options.date){
            date=options.date
        }
        if(options.shopId){
            shopId=options.shopId
        }
        if(options.type){
            type=options.type
        }
       wx.hideShareMenu();
   
            this.setData({
                workingShop,
                date,shopId,type
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
        this.getCurrentRank()
        this.getRank()
        this.getRange()

    },
    isWeekEnd(date){
        if( "天一二三四五六".charAt(new   Date(date).getDay())=="天" ){
            return true
        }else{
            return false;
        }
    },
    // 获取昨天
    getYestoday(){
        var day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
        var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
        return s1;
    },
    // 获取今天
    getToday(){
        var day2 = new Date();
        day2.setTime(day2.getTime());
        var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
        return s2;
    },
    getDateStr (date,AddDayCount) {
        var dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount);   //获取AddDayCount天后的日期
        var year = dd.getFullYear();
        var mon = dd.getMonth()+1;                             //获取当前月份的日期
        var day = dd.getDate();
        return year + '-' + ( mon < 10 ? ( '0' + mon ) : mon ) + '-' + ( day < 10 ? ( '0' + day ) : day) ;
    },
    // 计算统计时间段
    getRange(){
        // let today=this.getToday()+'';
        // console.log(this.getToday())
         console.log(this.getDateStr(this.data.date,-7))
        
        let range='';
        if(this.isWeekEnd(this.data.date)){
            // 选择的日期是周日
            range=this.getDateStr(this.data.date,-6)+'至'+this.data.date
        }else{
            range=this.data.date;
        }
        this.setData({range})
    },
    // 日期选择
    bindMultiPickerChange(e) {
        let date = e.detail.value;
        this.setData({
            date,
            rankList: []
        }, () => {
            this.getRank();
            this.getCurrentRank();
            this.getRange()
        })

    },
    // 切换日榜
    changeTab(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            type,
            rankList: []
        }, () => {
            this.getRank();
            this.getCurrentRank();
            this.getRange()
        })
    },
    // 当前排名
    getCurrentRank(){
        let that = this;
        let url = '/profits/shop/' + this.data.shopId + '/place';
        let json = {
            type: that.data.type,
        }
        if (that.data.date) {
            json.date = this.data.date
        }
        app.util.request(that, {
            url: app.util.getUrl(url, json),
            method: 'GET',
            header: app.globalData.token,
        }).then((res) => {
            if (res.code == 200) {
                that.setData({
                    currentRank: res.result
                })
            } else {
               
            }
        })
    },
    // 获取排行榜
    getRank() {
        let that = this;
        let url = '/profits/shop/' + this.data.shopId + '/rank';
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