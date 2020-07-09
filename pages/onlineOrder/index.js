// pages/onlineOrder/index.js
const app = getApp();
// console.log(app.util.getDates(5))

const date = new Date();
const choose_year = date.getFullYear();;

Page({

   /**
    * 页面的初始数据
    */
   data: {
      // ----配送下单时间
      time: '',
      choose_year: '',
      // ------
      // orderTime: '',
      shopId: '',
      timeText: '配送时间',
      // 1000 自提，1001：配送
      type: 1001,
      bgL: 'https://saler.ishangbin.com/img/sb-xiaozhan-img/onlineOrder/indexBgleft.png',
      bgR: 'https://saler.ishangbin.com/img/sb-xiaozhan-img/onlineOrder/indexBgRight.png',
      hideModal: true,
      selfData: [],
      animationData: {}, //
      nowDay: 0,
      nowHour: '',
      nowMinu: ''
   },
   getnowDay(e) {
      this.setData({
         nowDay: e.currentTarget.dataset.index
      }, () => {
         this.getDliveryTime()
      })
   },
   chooseTime(e) {
      let selfData = this.data.selfData[this.data.nowDay]
      let index = e.currentTarget.dataset.index
      let selectTime = this.data.deliveryTimeList[index];
      // let deliveryTime = selfData.year + '-' + selfData.month + '-' + selfData.day + ' ' + selectTime
      // let nowDay = this.data.nowDay;
      // console.log('selfData=')
      // console.log(selfData)
      // console.log('selectTime=')
      // console.log(selectTime)
      // console.log('deliveryTime=')
      // console.log(deliveryTime)
      // console.log('nowDay=')
      // console.log(nowDay)

     let month=selfData.month<10?'0'+selfData.month:selfData.month;
      let day=selfData.day<10?'0'+selfData.day:selfData.day;
      let time = selfData.year + '-' + month + '-' + day + " " + selectTime.end + ':00'
      console.log('time=====' + time)
      this.setData({
         time
      },()=>{
         this.hideModal()
      })

   },
   // 显示遮罩层
   showModal: function () {
      var that = this;
      if (this.data.totalNum <= 0) {
         return;
      }
      that.setData({
         hideModal: false
      })
      var animation = wx.createAnimation({
         duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
         timingFunction: 'ease', //动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(function () {
         that.fadeIn(); //调用显示动画
      }, 200)
   },

   // 隐藏遮罩层
   hideModal: function () {
      var that = this;
      var animation = wx.createAnimation({
         duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
         timingFunction: 'ease', //动画的效果 默认值是linear
      })
      this.animation = animation
      that.fadeDown(); //调用隐藏动画   
      setTimeout(function () {
         that.setData({
            hideModal: true
         })
      }, 320) //先执行下滑动画，再隐藏模块

   },

   //动画集
   fadeIn: function () {
      this.animation.translateY(0).step()
      this.setData({
         animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
      })
   },
   fadeDown: function () {
      this.animation.translateY(600).step()
      this.setData({
         animationData: this.animation.export(),
      })
   },

   // 切换方式
   changeType(e) {
      let type = e.currentTarget.dataset.type;
      let timeText = ''
      if (type == 1000) {
         timeText = '自提时间'
      } else {
         timeText = '配送时间'
      }
      this.setData({
         type,
         timeText
      })
   },
   // 时间
   // bindTimeChange(e) {
   //    let orderTime = e.detail.value;
   //    this.setData({
   //       orderTime
   //    })
   // },
   //跳转订单详情
   toOrderRecord(e) {
      let type = e.currentTarget.dataset.type;
      let shopId = this.data.shopId;
      let url = "/pages/onlineOrder/orderRecord/orderRecord?type=" + type + '&shopId=' + shopId
      wx.navigateTo({
         url
      })
   },
   toFinishOrder() {
      let shopId = this.data.shopId;
      let url = "/pages/onlineOrder/orderRecord/finishOrder/finishOrder?shopId=" + shopId;
      wx.navigateTo({
         url
      })
   },
   //跳转开始下单
   toOrder() {
     
      if (!this.data.time) {
         wx.showToast({
            title:  '请选择'+this.data.timeText,
            icon: 'none',
            duration: 3000
         })
         return;
      }
      let url = "/pages/onlineOrder/menu/menu?shopId=" + this.data.shopId + '&time=' + this.data.time + "&type=" + this.data.type
      wx.navigateTo({
         url
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading();
      //设置默认的年份
      this.setData({
         choose_year
      })

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
      wx.hideShareMenu();
      wx.hideLoading();
      this.getDliveryTime(1)
      // let hour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      // // // 选择器时
      // let minu = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()

      // // // 获取当前时间
      // let orderTime = hour + ':' + minu;
      this.setData({
         // orderTime,
         nowHour: new Date().getHours(),
         nowMinu: new Date().getMinutes()
      });
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {
      this.hideModal()
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


   //计算配送时间
   getDliveryTime(tody) {
      let that = this;
      let date = new Date();
      // 今天往后的七天
      let selfData = app.util.getDates(7);
      this.setData({
         selfData
      })
      let timeListTemp = [];
      let hourArr = [];
      let timeList = [];
      let minArr = ['00', '15', '30', '45'];
      let nowHour = 0;
      if (!this.data.nowDay) {
         nowHour = new Date().getHours();
      } else {
         nowHour = 0;
      }
      // 当前分钟
      let minuNow = new Date().getMinutes();
      if(minuNow > 45 && !this.data.nowDay){
         nowHour+=1;
      }
      for (let i = nowHour; i < 24; i++) {
         i = i < 10 ? '0' + i : i;
         // 遍历时间段数组;
         // 如果时间是当前小时,时间段数组的开始分钟不能小于当前分钟 
         if (nowHour == i && !this.data.nowDay) {
            console.log('minuNow========='+minuNow)
            if (minuNow > 0 && minuNow <= 15) {
               minArr = ['15', '30', '45'];
            }
            if (minuNow > 15 && minuNow <= 30) {
               minArr = ['30', '45'];
            }
            if (minuNow > 30 && minuNow <= 45) {
               minArr = ['45'];
            }
           
         } else {
            minArr = ['00', '15', '30', '45'];
         }
         for (var j = 0; j < minArr.length; j++) {
            timeListTemp.push(i + ":" + minArr[j])
         }
      }
      for (let k = 0; k < timeListTemp.length; k++) {
         let obj = {};
         if (k == timeListTemp.length - 1) {
            obj.start = timeListTemp[k]
            obj.end = '00:00';
         } else {
            obj.start = timeListTemp[k]
            obj.end = timeListTemp[k + 1];
         }
         timeList.push(obj)
      }
      // console.log('timeList');
      // console.log(timeList);
      that.setData({
         deliveryTimeList: timeList
      });
   }

})