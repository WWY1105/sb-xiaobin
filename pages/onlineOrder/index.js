// pages/onlineOrder/index.js
const app = getApp();
console.log(app.util.getDates(5))

const date = new Date();
const choose_year = date.getFullYear();;
// const months = [];
// const days = [];
// const hours = [];
// const minutes = [];
// //获取年
// for (let i = date.getFullYear(); i <= date.getFullYear(); i++) {
//    years.push("" + i);
// }
// //获取月份
// for (let i = 1; i <= 12; i++) {
//    if (i < 10) {
//       i = "0" + i;
//    }
//    months.push("" + i);
// }
// //获取日期
// for (let i = 1; i <= 31; i++) {
//    if (i < 10) {
//       i = "0" + i;
//    }
//    days.push("" + i);
// }
// //获取小时
// for (let i = 0; i < 24; i++) {
//    if (i < 10) {
//       i = "0" + i;
//    }
//    hours.push("" + i);
// }
// //获取分钟
// for (let i = 0; i < 60; i++) {
//    if (i < 10) {
//       i = "0" + i;
//    }
//    minutes.push("" + i);
// }
Page({

   /**
    * 页面的初始数据
    */
   data: {
      // ----配送下单时间
      time: '',
      // multiArray: [years, months, days, hours, minutes],
      // multiIndex: [0, 9, 16, 10, 17],
      choose_year: '',
      // ------
      orderTime: '',
      shopId: '',
      timeText: '配送时间',
      // 1000 自提，1001：配送
      type: 1001,
      bgL: 'https://saler.ishangbin.com/img/sb-xiaozhan-img/onlineOrder/indexBgleft.png',
      bgR: 'https://saler.ishangbin.com/img/sb-xiaozhan-img/onlineOrder/indexBgRight.png',


      hideModal: true,
      selfData: [],
      animationData: {}, //
      nowDay: 0
   },
   getnowDay(e) {
      this.setData({
         nowDay: e.currentTarget.dataset.index
      })
   },
   clickTime(e) {
      let selfData = this.data.selfData[this.data.nowDay]
      let index = e.currentTarget.dataset.index
      let selectTime = this.data.deliveryTimeList[this.data.nowDay].timeList[index]
      let deliveryTime = selfData.year + '-' + selfData.month + '-' + selfData.day + ' ' + selectTime
      let nowDay = this.data.nowDay
      this.setData({
         selectTimeIndex: index,
         selectTime: selectTime,
         deliveryTime: deliveryTime,
         selectDay: nowDay
      })
      this.triggerEvent('selectTime', {
         deliveryTime: this.data.deliveryTime
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
      }, 720) //先执行下滑动画，再隐藏模块

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
   bindTimeChange(e) {
      let orderTime = e.detail.value;
      this.setData({
         orderTime
      })
   },
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
      if (!this.data.orderTime) {
         wx.showToast({
            title: '请选择下单时间',
            icon: 'none',
            duration: 3000
         })
         return;
      }
      if (!this.data.time) {
         wx.showToast({
            title: this.data.timeText,
            icon: 'none',
            duration: 3000
         })
         return;
      }
      let url = "/pages/onlineOrder/menu/menu?shopId=" + this.data.shopId + '&orderTime=' + this.data.orderTime + '&time=' + this.data.time + "&type=" + this.data.type
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
      wx.hideLoading();
      this.getDliveryTime()





      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      // let multiIndex = [];
      // // 选择器月
      // multiIndex[1] = month;
      // month = month - 0 + 1;
      // month = month < 10 ? '0' + month : month;
      // console.log('月' + month)
      // let day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      // // 选择器日
      // multiIndex[2] = new Date().getDate() - 1;
       let hour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      // // 选择器时
      // multiIndex[3] = new Date().getHours();
       let minu = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      // // 选择器分
      // multiIndex[4] = new Date().getMinutes();
      // console.log(multiIndex)
      // // 获取当前时间
      let orderTime = hour + ':' + minu;
      // let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minu + ":00"
      this.setData({
         orderTime
      });
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


   //计算配送时间
   getDliveryTime() {
      let deliveryTimeList = [];
      let date = new Date();
      // 今天往后的七天
      let selfData = app.util.getDates(7);
      this.setData({
         selfData
      })
      //获取时间段
      let timeDate = new Date(date.getTime());
      console.log(timeDate)
      let todayList = getTimeList(timeDate.getHours(), 1);
      console.log('todayList')
      console.log(todayList)
      deliveryTimeList.push({
         timeList: todayList
      });
       let nextDayList = getTimeList(9, 0);
      for (let i = 1; i < 5; i++) {
         deliveryTimeList.push({
            timeList: nextDayList
         });
      }
      this.triggerEvent('selectTime', {
         deliveryTime: this.data.deliveryTime
      })
      this.setData({
         deliveryTimeList: []
      })
      this.setData({
         deliveryTimeList: deliveryTimeList
      })
      // today 1 是今天 0 不是今天
      function getTimeList(start, today) {
         let timeListTemp = [];
         let hourArr=[];
         let timeList=[];
         let minArr = ['00', '15', '30', '45'];
         // 当前小时
         let hour = new Date().getHours();
         // 当前分钟
         let minuNow = new Date().getMinutes();

         for (let i = hour; i <=24; i++) {
             i=i < 10 ? '0' + i : i;
            // 遍历时间段数组;
            // 如果时间是当前小时,时间段数组的开始分钟不能小于当前分钟 
            if (i = hour) {
               let newMinArr =[];
               if (minuNow <= 15 ){
                  newMinArr = minArr.slice(1)
               }
              
            }else{
               for (var j = 0; j < minArr.length; j++) {
                  timeListTemp.push(i + ":" + minArr[j])
               }
            }
          
         }
         for (let k = 0; k < timeListTemp.length;k++){
            let str ='';
            if (k == timeListTemp.length-1){
               str = timeListTemp[k] + '-' +'00:00';
            }else{
               str =timeListTemp[k] + '-' + timeListTemp[k + 1]
            }

            timeList.push(str)
            
         }
         // let min = 0;
         // let minArr=['00','15','30','45']
         // for (let i = 0; i < hourArr.length; i++) {
         //    for (var j = 0; j < minArr.length;j++){ 
         //       console.log(i + ":" +minArr[j])
         //   }
         // }

         // for (let i = 0; i < 4; i++) {
         //    if (((hour <= 9) && (startTime + 2 * i > 15)) || ((hour > 9) && (startTime + 2 * i >= 15))) {
         //       break;
         //    } else {
         //       if (hour <= 9) {
         //          timeList.push(
         //             startTime + 2 * i + ":00" + "-" + (startTime + 2 * (i + 1)) + ":00"
         //          );
         //       } else {
         //          if (startTime % 2 === 0) {
         //             timeList.push(
         //                startTime + 2 * i + 1 + ":00" + "-" + (startTime + 2 * i + 3) + ":00"
         //             );
         //          } else {
         //             timeList.push(
         //                startTime + 2 * i + 2 + ":00" + "-" + (startTime + 2 * i + 4) + ":00"
         //             );
         //          }
         //       }
         //    }
         // }
         // console.log(timeList)
         return timeList;
      }
   }

})