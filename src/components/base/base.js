import {
  localStorageKey,
  sessionStorageKey,
  sessionStorageFormKey,
  getGameExpiresUrl,
  getGameFrequencyUrl,
  setUserLotteryCountIncrOneUrl,
  setUserLotteryCountDecrOneUrl,
  getLotterySecretStrUrl,
  getPrizeUrl
} from './key'
import {_get, _post} from './ajax'
/* 获取openid */
// eslint-disable-next-line
export let localStorageOpenid = (function () {
  let localStorageOpenid = localStorage.getItem(localStorageKey)
  if (!localStorageOpenid) {
    let localhref = window.location.href
    let pregMatchResult = new RegExp('__source_user_id' + '=([^&#]*)', 'i').exec(localhref)
    if (pregMatchResult !== null) {
      localStorage.setItem(localStorageKey, pregMatchResult[1])
      localStorageOpenid = pregMatchResult[1]
    } else {
      // 绑定手机号服务
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7d3377afc607dcae&redirect_uri=http://hicweixin.haier.net/hs/h/bind/nobindRRS.html?returnUrl=' + encodeURIComponent(localhref) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
    }
  }
  return localStorageOpenid
})()
/* 获取url地址上的参数 */
export let QueryString = function (key) {
  let reg = new RegExp(key + '=([^&#]*)', 'i')
  let value = reg.exec(window.location.href)
  if (value === null) return null
  return decodeURI(value[1])
}
/* 播放音乐 */
export const audioAutoPlay = function (id) {
  let audio = document.getElementById(id)
  audio.play()
  document.addEventListener('WeixinJSBridgeReady', function () {
    audio.play()
  }, false)
}
/* 获取游戏期限 */
export const getGameExpires = function () {
  let data = {
    url: getGameExpiresUrl,
    data: {'lotteryid': 'haierfootballcup2018'}
  }
  return _post(data)
}
/* 获取游戏次数 */
export const getGameFrequency = function () {
  let data = {
    url: getGameFrequencyUrl,
    data: {'lotteryid': 'haierfootballcup2018', 'userid': localStorageOpenid}
  }
  return _post(data)
}
/* 增加游戏次数 */
export const setUserLotteryCountIncrOne = function () {
  let data = {
    url: setUserLotteryCountIncrOneUrl,
    data: {
      'lotteryid': 'haierfootballcup2018',
      'userid': localStorageOpenid
    }
  }
  return _post(data)
}
/* 减少游戏次数 */
export const setUserLotteryCountDecrOne = function () {
  let data = {
    url: setUserLotteryCountDecrOneUrl,
    data: {
      'lotteryid': 'haierfootballcup2018',
      'userid': localStorageOpenid
    }
  }
  return _post(data)
}
/* 获取页面secretkey */
export const getLotterySecretStr = function () {
  let data = {
    url: getLotterySecretStrUrl,
    data: {
      'lotteryid': 'haierfootballcup2018',
      'userid': localStorageOpenid
    }
  }
  return _post(data)
}
/* 抽奖 */
export const getPrize = function (secretkey) {
  let data = {
    url: getPrizeUrl,
    data: {
      'lotteryid': 'haierfootballcup2018',
      'userid': localStorageOpenid,
      'secretkey': secretkey
    }
  }
  return _post(data)
}
