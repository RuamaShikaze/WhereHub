// app.js
App({
  onLaunch: function () {
    // 小程序启动时执行的代码
    console.log('小程序启动了');
  },
  onShow: function () {
    // 小程序显示时执行的代码
    console.log('小程序显示了');
  },
  onHide: function () {
    // 小程序隐藏时执行的代码
    console.log('小程序隐藏了');
  },
  globalData: {
    userInfo: null
  }
});
