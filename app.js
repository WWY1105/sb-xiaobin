//app.js
const util = require('./utils/util.js');
App({
   onShow: function (options) {
      var _this = this;
      wx.hideShareMenu();
      this.globalData.scene = options.scene;
     
   },
  onLaunch: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
 
    
    var that = this
   
    this.globalData.scene = options.scene;
    
    // 获取本地token
    if (wx.getStorageSync('token')) {
      this.globalData.token.token = wx.getStorageSync('token');
    } 
    
    //console.log("检查版本更新是否支持")
    if (!wx.canIUse("getUpdateManager")) return;
    //console.log("支持")
    let updateManager = wx.getUpdateManager();
    // 获取全局唯一的版本更新管理器，用于管理小程序更新
    //console.log("调用api")
    updateManager.onCheckForUpdate(function(res) {
      // 监听向微信后台请求检查更新结果事件 
      //console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {
        //如果有新版本                
        // 小程序有新版本，会主动触发下载操作        
        updateManager.onUpdateReady(function() {
          //当新版本下载完成，会进行回调          
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启小程序',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序               
                updateManager.applyUpdate();
              }
            }
          })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）        
        updateManager.onUpdateFailed(function() {
          //当新版本下载失败，会进行回调          
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请稍后尝试',
            showCancel: false,
          })
        })
      }
    });
  },

 //   登录是否过期
  checksession: function() {
    wx.checkSession({
      success: function(res) {
        wx.showToast({
          title: '登录未过期了',
        })
      },
      fail: function(res) {
        //再次调用wx.login()
        wx.login({
          success: function(res) {
          }
        })
      }
    })
  },
  onHide: () => {
  },

  /**
   * 设置监听器
   */
  setWatcher(page) {
    let data = page.data;
    let watch = page.watch;
    Object.keys(watch).forEach(v => {
      console.log(v)
      let key = v.split('.'); // 将watch中的属性以'.'切分成数组
      let nowData = data; // 将data赋值给nowData
      for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
        nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
      }
      let lastKey = key[key.length - 1];
      // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
      let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
      let deep = watch[v].deep; // 若未设置deep,则为undefine
      this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
    })
  },
  /**
   * 监听属性 并执行监听函数
   */
  observe(obj, key, watchFun, deep, page) {
    var val = obj[key];
    // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
    if (deep && val != null && typeof val === 'object') {
      Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
        this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
      })
    }
    var that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          that.observe(obj, key, watchFun, deep, page);
        }
      },
      get: function() {
        return val;
      }
    })
  },
  globalData: {
    refreshFlag:false,
    userInfo: null,
    userPhone: null,
    token: {
      'apiKey': '6b774cc5eb7d45818a9c7cc0a4b6920f'
    },
    scene: '',
    location: {},
   //  //  测试
    ajaxOrigin: "https://inn.sharejoy.cn",
    urlOrigin: "https://inn.sharejoy.cn"


    //  正式
   //  ajaxOrigin: "https://inn.ishangbin.com",
   //  urlOrigin: "https://inn.ishangbin.com"
  },
  util: util
}) 