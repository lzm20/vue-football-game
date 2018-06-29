// import toolUtil from '@/util/tools'
import wx from 'weixin-js-sdk'
const AppWeixinShareUtil = {
  /*
  SESSION_STORAGE: 'wxShareConfig',
  getLocalConfig() {
    let userAgentInfo = navigator.userAgent
    if (userAgentInfo.indexOf('ndroid') > 0) {
      return false
    }
    return toolUtil.getSessionStorage(this.SESSION_STORAGE)
  },
  setLocalConfig(cfg) {
    return toolUtil.setSessionStorage(this.SESSION_STORAGE, cfg)
  },
  */
  setupWeixinShare (wxShareConfigInfo, weixinShare) {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: wxShareConfigInfo.appid, // 必填，公众号的唯一标识
      timestamp: wxShareConfigInfo.timestamp, // 必填，生成签名的时间戳
      nonceStr: String(wxShareConfigInfo.noncestr), // 必填，生成签名的随机串
      signature: wxShareConfigInfo.signature, // 必填，签名，见附录1
      jsApiList: [
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'scanQRCode',
        'getLocation',
        'openLocation'
        /*
        'chooseWXPay',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'onVoicePlayEnd',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'addCard',
        'chooseCard',
        'openCard'
        */
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    this.setupWeixinShareOnly(weixinShare)
  },
  setupWeixinShareOnly (weixinShare) {
    wx.ready(() => {
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: weixinShare.title, // 分享标题
        desc: weixinShare.desc, // 分享描述
        link: weixinShare.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: weixinShare.imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
          // console.log('分享给朋友' + weixinShare.link)
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          // console.log('cancel')
        }
      })

      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: weixinShare.title, // 分享标题
        link: weixinShare.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: weixinShare.imgUrl, // 分享图标
        success: function () {
          // console.log('分享给朋友圈' + weixinShare.link)
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      })
    })
    wx.error(function (res) { console.log(res, 'error') })
  }
}

export default AppWeixinShareUtil
