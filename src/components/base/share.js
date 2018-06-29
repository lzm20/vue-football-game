import localStorageOpenid from './base'
console.log(localStorageOpenid)
let shareTitle = '缔造天才，绿茵传奇！'
let shareDesc = '全民世界杯，挑战赢好礼！'
let shareUrl = window.location.origin + window.location.pathname + '?_otheropenid=' + localStorageOpenid
let shareImg = window.location.origin + '../../assets/share.jpg'
let shareredayobj = {
  'title': shareTitle,
  'desc': shareDesc,
  'url': shareUrl,
  'img': shareImg
}
console.log(shareredayobj)
