// pages/onlineOrder/index.js
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = date.getFullYear(); i <= date.getFullYear(); i++) {
   years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
   if (i < 10) {
      i = "0" + i;
   }
   months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
   if (i < 10) {
      i = "0" + i;
   }
   days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
   if (i < 10) {
      i = "0" + i;
   }
   hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
   if (i < 10) {
      i = "0" + i;
   }
   minutes.push("" + i);
}
Page({

   /**
    * 页面的初始数据
    */
   data: {
      // ----配送下单时间
      time: '',
      multiArray: [years, months, days, hours, minutes],
      multiIndex: [0, 9, 16, 10, 17],
      choose_year: '',
      // ------
      orderTime: '',
      shopId: '',
      timeText: '配送时间',
      // 1000 自提，1001：配送
      type: 1001,
      bgL: 'https://saler.ishangbin.com/img/sb-xiaozhan-img/onlineOrder/indexBgleft.png',
      bgR: 'https://saler.ishangbin.com/img/sb-xiaozhan-img/onlineOrder/indexBgRight.png'
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
           icon:'none',
           duration:3000
         })
         return ;
      }
      if (!this.data.time) {
         wx.showToast({
           title: this.data.timeText,
           icon:'none',
           duration:3000
         })
         return ;
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
         choose_year: this.data.multiArray[0][0]
      })

      if (options.shopId) {
         this.setData({
            shopId: options.shopId
         })
      }
   },
   //获取时间日期
   bindMultiPickerChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
         multiIndex: e.detail.value
      })
      const index = this.data.multiIndex;
      const year = this.data.multiArray[0][index[0]];
      const month = this.data.multiArray[1][index[1]];
      const day = this.data.multiArray[2][index[2]];
      const hour = this.data.multiArray[3][index[3]];
      const minute = this.data.multiArray[4][index[4]];
      // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
      this.setData({
         time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":00"
      })
      // console.log(this.data.time);
   },
   //监听picker的滚动事件
   bindMultiPickerColumnChange: function (e) {
      //获取年份
      if (e.detail.column == 0) {
         let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
         console.log(choose_year);
         this.setData({
            choose_year
         })
      }
      //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      if (e.detail.column == 1) {
         let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
         let temp = [];
         if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
            for (let i = 1; i <= 31; i++) {
               if (i < 10) {
                  i = "0" + i;
               }
               temp.push("" + i);
            }
            this.setData({
               ['multiArray[2]']: temp
            });
         } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
            for (let i = 1; i <= 30; i++) {
               if (i < 10) {
                  i = "0" + i;
               }
               temp.push("" + i);
            }
            this.setData({
               ['multiArray[2]']: temp
            });
         } else if (num == 2) { //判断2月份天数
            let year = parseInt(this.data.choose_year);
            console.log(year);
            if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
               for (let i = 1; i <= 29; i++) {
                  if (i < 10) {
                     i = "0" + i;
                  }
                  temp.push("" + i);
               }
               this.setData({
                  ['multiArray[2]']: temp
               });
            } else {
               for (let i = 1; i <= 28; i++) {
                  if (i < 10) {
                     i = "0" + i;
                  }
                  temp.push("" + i);
               }
               this.setData({
                  ['multiArray[2]']: temp
               });
            }
         }
         console.log(this.data.multiArray[2]);
      }
      var data = {
         multiArray: this.data.multiArray,
         multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      this.setData(data);
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
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      let multiIndex = [];
      // 选择器月
      multiIndex[1] = month;
      month = month - 0 + 1;
      month = month < 10 ? '0' + month : month;
      console.log('月' + month)
      let day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      // 选择器日
      multiIndex[2] = new Date().getDate() - 1;
      let hour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      // 选择器时
      multiIndex[3] = new Date().getHours();
      let minu = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      // 选择器分
      multiIndex[4] = new Date().getMinutes();
      console.log(multiIndex)
      // 获取当前时间
      let orderTime = hour + ':' + minu;
      let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minu + ":00"
      this.setData({
         orderTime,
         // time,
         multiIndex
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

   }
})