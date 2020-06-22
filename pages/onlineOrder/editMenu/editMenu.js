// pages/onlineOrder/menu/menu.js
const app = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      shopId: '',
      // 1000 自提，1001：配送
      type: '',
      time: '',
      // orderTime: '',
      menu: {},
      activeKind: 0,
      totalPrice: 0,
      totalNum: 0,
      hideModal: true, //模态框的状态  true-隐藏  false-显示
      animationData: {}, //
      editOrder: null
   },


   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
      let editOrder = wx.getStorageSync('editOrder');
      let shopId = wx.getStorageSync('shopId');
      this.setData({
         editOrder
      })
      console.log('====options====')
      console.log(options)
      if (options.id) {
         this.setData({
            orderId:options.id
         })
      }
      if (shopId) {
         this.setData({
            shopId
         })
      }
      if (editOrder.deliver.type) {
         this.setData({
            type: editOrder.deliver.type
         })
      }
      // if (editOrder.deliver.orderTime) {
      //    this.setData({
      //       orderTime: editOrder.deliver.orderTime
      //    })
      // }
      if (editOrder.deliver.time) {
         let time = editOrder.deliver.time.split('/').join('-')
         this.setData({
            time
         }, () => {
            this.getMenu()
         })
      }

   },
   // 切换品类
   changeKind(e) {
      let activeKind = e.target.dataset.index;
      this.setData({
         activeKind
      })
   },
   // 
   getMenu() {
      let that = this;
      let url = '/menus/shop/' + this.data.shopId + '/supply';
      let time = encodeURIComponent(this.data.time);
      // let orderTime = encodeURIComponent(this.data.orderTime);
      app.util.request(that, {
         url: app.util.getUrl(url, {
            time: that.data.time,
         }),
         method: 'GET',
         header: app.globalData.token,
         data: {
            time: that.data.time
         }
      }).then((res) => {
         console.log(res)
         if (res.code == 200) {
            wx.hideLoading();
            // 循环菜品,设置默认数量0
            let editOrder = wx.getStorageSync('editOrder')
            let totalNum = 0
            res.result.map((item) => {
               item.title=item.kindName;
               item.dishes.map((i) => {
                  i.num = 0
                  editOrder.menus.map((select) => {
                     if (select.id == i.id) {
                        i.num = Number(select.count)||Number(select.num);
                        totalNum += Number(select.count)||Number(select.num);
                        console.log(i.num)
                     }
                  })
               })
            })
            console.log(res.result)
            that.setData({
               menu: res.result,
               totalNum
            },()=>{
               that.getTotal()
            })
         }
      })
   },
   // 计算总数量和总价
 // 计算总数量和总价
 getTotal() {
   let menu = this.data.menu;
   let totalPrice = 0;
   let totalNum = 0;
   menu.map((item) => {
      item.dishes.map((i) => {
         if (i.num > 0) {
            totalNum += i.num;
            if(i.specPrice){
               totalPrice += i.num * i.specPrice;
            }else{
               totalPrice += i.num * i.price;
            }
        
         }
      })
   })
   totalPrice=totalPrice.toFixed(2);
   if (totalPrice <= 0) {
      this.hideModal()
   }
   this.setData({
      totalPrice,
      totalNum
   })
},

   //加数量
   jia(e) {
      let id = e.target.dataset.id;
      console.log(id)
      // let activeKind = this.data.activeKind;
      let menu = this.data.menu;
      // menu[activeKind].dishes[dishIndex].num += 1;
      menu.map((item) => {
         item.dishes.map((i) => {
            if (i.id == id) {
               i.num += 1
            }
         })
      })
      this.setData({
         menu,
      }, () => {
         this.getTotal()
      })
   },
   jian(e) {
      if (this.data.totalNum <= 0) {
         this.hideModal()
      }
      let id = e.target.dataset.id;
      let num = e.target.dataset.num;
      console.log(num)
      // let activeKind = this.data.activeKind;
      let menu = this.data.menu;
      if (num <= 0) {
         menu.map((item) => {
            item.dishes.map((i) => {
               if (i.id == id) {
                  i.num = 0
               }
            })
         })
      } else {
         menu.map((item) => {
            item.dishes.map((i) => {
               if (i.id == id) {
                  i.num -= 1
               }
            })
         })
      }

      this.setData({
         menu,
      }, () => {
         this.getTotal()
      })
   },
   // 提交订单
   // 提交订单
   toSubmit() {
      let that=this;
      if (this.data.totalNum <= 0||this.data.totalPrice <= 0) {
         wx.showModal({
            title: '提示',
            content: '您还未选择菜品'
         })
         return;
      }
      let time = this.data.time;
      // let orderTime = this.data.orderTime;
      let type = this.data.type;
      let totalPrice = this.data.totalPrice;
      let menus = [];
      // 循环菜品,获取id和数量
      this.data.menu.map((item) => {
         item.dishes.map((i) => {
            if (i.num > 0) {
               menus.push(i)
            }
         })
      })
      wx.setStorageSync('time', time);
      // wx.setStorageSync('orderTime', orderTime)
      wx.setStorageSync('menus', menus)
      wx.setStorageSync('type', type)
      wx.setStorageSync('totalPrice', totalPrice)


    
      let obj = {};
      let editMenus=[]
      // 循环菜品,获取id和数量
      menus.map((i) => {
         if (i.num > 0) {
            obj[i.id] = i.num;
            i.count=i.num;
            editMenus.push(i)
         }
      })

      // if (this.data.orderId) {
         let url = '/takeouts/shop/' + that.data.shopId + '/order/' + this.data.orderId;
         app.util.request(that, {
            url: app.util.getUrl(url),
            method: 'PUT',
            header: app.globalData.token,
            data: {
               menus: obj,
               type,
               // orderTime,
               time,
            }
         }).then((res) => {
            if (res.code == 200) {
                  let editOrder = {
                     deliver:{
                        type,
                        time
                     },
                     menus:editMenus,
                     orderId: that.data.orderId,
                     amount:this.data.totalPrice
                  };
                  wx.setStorageSync('editOrder',editOrder)
                  let url = "/pages/onlineOrder/submitOrder/submitOrder?shopId=" + this.data.shopId+"&orderId="+that.data.orderId
                  wx.redirectTo({
                     url
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
         duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
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
         duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
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


   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})