/**
 * 提示与加载工具类
 * author: 郭建利
 */

 export default class Tips {
   constructor() {
     this.isLoading = false
   }

  /**
   * 弹出加载提示
   */
   static loading(title = '加载中') {
     if (Tips.isLoading) {
       return
     }
     Tips.isLoading = true
     wx.showLoading({
       title: title,
       mask: true
     })
   }

  /**
   * 加载完毕
   */
   static loaded() {
     if (Tips.isLoading) {
       Tips.isLoading = false
       wx.hideLoading()
     }
   }

  /**
   * 错误框
   */
   static error(title, onHide) {
     wx.showToast({
       title: title,
       image: '../static/images/icon_error.png',
       mask: true,
       duration: 500
     })
    // 隐藏结束回调
     if (onHide) {
       setTimeout(() => {
         onHide()
       }, 500)
     }
   }

  /**
   * 弹出确认窗口
   */
   static showModal(content, payload = {}, title = '提示') {
     return new Promise((resolve, reject) => {
       wx.showModal({
         title: title,
         content: content,
         showCancel: true,
         success: res => {
           if (res.confirm) {
             resolve(payload)
           } else if (res.cancel) {
             reject(payload)
           }
         },
         fail: res => {
           reject(payload)
         }
       })
     })
   }
 }

 // 静态变量，是否加载中
 Tips.isLoading = false
