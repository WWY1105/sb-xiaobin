// pages/onlineOrder/menu/menu.js
const app = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      shopId: '',
      type: '',
      time: '',
      // orderTime: '',
      menu: {},
      activeKind: 0,
      totalPrice: 0,
      totalNum: 0,
      hideModal: true, //模态框的状态  true-隐藏  false-显示
      animationData: {}, //
      aboutArr: [],
      top: 0,

      vtabs: [],
      activeTab: 0,
      orderId: ''
   },
   // 清空
   clearDish() {
      let menu = this.data.menu;
      menu.map((item) => {
         item.dishes.map((i) => {
            i.num = 0
         })
      })
      this.setData({
         menu,
         totalNum:0,
         totalPrice:0
      }, () => {
         this.hideModal()
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideLoading()
      if (options.shopId || wx.getStorageSync('shopId')) {
         this.setData({
            shopId: options.shopId||wx.getStorageSync('shopId')
         })
      }
      if (options.orderId) {
         this.setData({
            orderId: options.orderId
         })
      }
      if (options.type) {
         this.setData({
            type: options.type
         })
      }
      // if (options.orderTime) {
      //    this.setData({
      //       orderTime: options.orderTime
      //    })
      // }
      if (options.time) {
         this.setData({
            time: options.time
         }, () => {
            this.getMenu()
         })
      }

   },
   // 切换品类
   changeKind(e) {
      let activeKind = e.target.dataset.index;
      let top = this.data.aboutArr[activeKind];
      console.log("点击" + top)
      let query = wx.createSelectorQuery().in(this)
      query.select('#theId').boundingClientRect((res) => {
         console.log('res: ', res)
         this.setData({
            scrollTop: top
         })
         // res.top // 这个组件内 #the-id 节点的上边界坐标
      }).exec()
      this.setData({
         activeKind,
         top
      })
   },
   queryMultipleNodes: function () {
      var that = this;
      var aboutArr = [];
      wx.createSelectorQuery().selectAll('.site-about-info').boundingClientRect(function (rects) {
         rects.forEach(function (rect) {
            console.log(rect); // 节点的下边界坐标
            aboutArr.push(rect.top);
         })
         console.log(aboutArr);
         that.setData({
            aboutArr: aboutArr
         })
      }).exec();
   },
   // 获取菜单
   getMenu() {
      let that = this;
      let url = '/menus/shop/' + this.data.shopId + '/supply';
      let time = encodeURIComponent(this.data.time);
      // let orderTime = encodeURIComponent(this.data.orderTime);
      app.util.request(that, {
         url: app.util.getUrl(url, {
            // time,orderTime
            time: that.data.time,
            // orderTime: that.data.orderTime
         }),
         method: 'GET',
         header: app.globalData.token,
         data: {
            time: that.data.time,
            // orderTime: that.data.orderTime
         }
      }).then((res) => {
         console.log(res)
         if (res.code == 200) {
            wx.hideLoading();
            // 循环菜品,设置默认数量0
            res.result.map((item) => {
               item.title=item.kindName;
               item.dishes.map((i) => {
                  i.num = 0
               })
            })
            that.setData({
               menu: res.result
            }, () => {
               that.queryMultipleNodes()
            })
         }else{
            that.setData({
               menu:[]
            })
         }
      })
   },
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
   //加数量
   jia(e) {
      let id = e.target.dataset.id;
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


         app.util.request(that, {
            url: app.util.getUrl('/takeouts/shop/' + that.data.shopId),
            method: 'POST',
            header: app.globalData.token,
            data: {
               menus:obj,
               type,
               // orderTime,
               time,
            }
         }).then((res) => {
            if (res.code == 200) {
               wx.hideLoading();
               that.setData({
                  orderId: res.result.orderId
               },()=>{
                  let editOrder = {
                     deliver:{
                        type,
                        time
                     },
                     menus:editMenus,
                     orderId: res.result.orderId,
                     amount:this.data.totalPrice
                  };
                  wx.setStorageSync('editOrder',editOrder)
                  let url = "/pages/onlineOrder/submitOrder/submitOrder?shopId=" + this.data.shopId+"&orderId="+res.result.orderId
                  wx.redirectTo({
                     url
                  })
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
      this.queryMultipleNodes()
    
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
this.setData({
   popThis:this
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
   bindfail(){
      console.log('quxiao')
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