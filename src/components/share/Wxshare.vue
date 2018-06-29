<template>
  <div class="wx-share" id="share" style="height:0rem;overflow:hidden;">
    <img class='share-img' src="@/assets/images/share.jpg" alt="" style="visibility: hidden;">
  </div>
</template>
<script>
import AppWeixinShareUtil from './share'
export default {
  name: 'wx-share',
  data () {
    return {
      shareData: {}
    }
  },
  methods: {
    async getWXShare (sharedata) {
      const url = 'http://api.huandengpai.com/api/weixin/js/config'
      const param = {
        title: sharedata.title,
        desc: sharedata.desc,
        link: sharedata.link,
        imgUrl: sharedata.imgUrl,
        visiting_url: window.location.href,
        weixin: 1
      }
      const response = await this.axios.post(url, param)
      let config = response.data.data
      config.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
      config.debug = false
      let shareP = param
      AppWeixinShareUtil.setupWeixinShare(config, shareP)
    },
    setWxShare (sharedata) {
      AppWeixinShareUtil.setupWeixinShareOnly(sharedata)
    }
  },
  mounted () {
    this.shareData.title = '全掌柜平台问卷调研'
    this.shareData.desc = '让每个家庭拥有自己的保险规划师'
    this.shareData.link = window.location.href
    this.shareData.imgUrl = document.getElementsByClassName('share-img')[0].src
    this.getWXShare(this.shareData)
  }
}
</script>
