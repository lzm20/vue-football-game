<template>
    <div class="page-con" @touchmove.prevent>
        <div class="page-lottery">
            <div class="game-tips" v-if='isShowLock' @click='start'>
                <div class="hand"></div>
            </div>
            <!-- 球门 -->
            <div id="goal"></div>
            <!-- 守门员 -->
            <div id="goalkeeper" v-bind:class='goalkeeperObj'></div>
            <!-- 足球 -->
            <div id="football" v-bind:style='footballObj' @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend'></div>
            <div class="ball_projection"></div>
            <div class="information">拨动足球绕过门将</div>
        </div>
        <!-- 成功 去抽奖 -->
          <div class="pop-suc lockTouchmove" v-if='isSuccess'>
            <div class="inner">
              <div class="prize-intruction">
                <div style="font-weight: bold;">恭喜您，进球啦！</div>
                <div style="margin-top:0.1rem;">送你一个礼物以兹鼓励！</div>
              </div>
              <div class="go-form">填写表单信息</div>
            </div>
            <div class="inner-wai-img"></div>
          </div>
          <!-- 失败  -->
          <div class="pop-nowin lockTouchmove" v-if='isNoWin'>
            <div class="inner">
              <div class="nowin-desc">很遗憾，没有中奖</div>
              <div class="restart" @click='restart'>重新开始</div>
            </div>
          </div>
          <div class="pop-fail lockTouchmove" v-if='isFail'>
            <div class="inner">
              <div class="fail-desc">门将发挥神勇，<br>球被扑出</div>
              <div class="restart" @click='restart'>重新开始</div>
            </div>
          </div>
          <div class="pop-hasalready lockTouchmove" v-if='isHasalready'>
            <div class="inner">
              <div class="nowin-desc">您已抽奖，请勿重复抽奖</div>
              <div class="restart" @click='restart'>重新开始</div>
            </div>
          </div>,
    </div>
</template>
<script>
import {sessionStorageKey} from '../base/key'
import {localStorageOpenid, getLotterySecretStr, getPrize} from '../base/base'
export default {
  name: 'lottery',
  data () {
    return {
      isShowLock: true,
      isSuccess: false,
      isNoWin: false,
      isFail: false,
      isHasalready: false,
      animate: {
        'left': {
          top: '2.6rem', left: '0.7rem', '-webkit-transform': 'scale(0.5)'
        },
        'center': {
          top: '2rem', left: '2.87rem', '-webkit-transform': 'scale(0.6)'
        },
        'right': {
          top: '2.6rem', left: '5rem', '-webkit-transform': 'scale(0.5)'
        }
      },
      goalkeeperObj: {},
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      num: 0,
      ballNumber: 0,
      cast: 0,
      noCast: 0,
      ballLocat: {top: '7.42rem', left: '2.75rem', '-webkit-transform': 'scale(1)'},
      setInter: null,
      footballObj: {},
      attend_seqid: null,
      secretkey: ''
    }
  },
  methods: {
    stopBehavior (event) {
      event.preventDefault()
      event.stopPropagation()
    },
    setLotteryCount () {
      sessionStorage.setItem(sessionStorageKey, 'haierfootballcup2018lottery')
    },
    start () {
      this.isShowLock = false
      let __sessionStorageKey = sessionStorage.getItem(sessionStorageKey)
      console.log(__sessionStorageKey)
      if (__sessionStorageKey && __sessionStorageKey === 'haierfootballcup2018lottery') {
        this.isHasalready = true
      } else {
        this.goalAnimate()
      }
    },
    numRandom (min, max) {
      return min + Math.floor(Math.random() * ((max - min) + 1))
    },
    goalAnimate () {
      let thei = this
      this.setInter = setInterval(function () {
        thei.num = thei.numRandom(1, 3)
        thei.goalkeeperObj = 'bg' + [thei.num]
      }, 160)
    },
    touchstart (e) {
      this.stopBehavior(e)
      this.startX = e.touches[0].pageX
      this.startY = e.touches[0].pageY
    },
    touchmove (e) {
      this.stopBehavior(e)
    },
    touchend (e) {
      this.stopBehavior(e)
      this.ballNumber++
      this.endX = e.changedTouches[0].pageX
      this.endY = e.changedTouches[0].pageY
      let direction = this.direction(this.startX, this.startY, this.endX, this.endY) // 获取当前滑动的方向
      switch (direction) {
        case 1:// 向上
          this.footballObj = this.animate['center']
          break
        case 2:// 向左上
          this.footballObj = this.animate['left']
          break
        case 3:// 向右上
          this.footballObj = this.animate['right']
          break
      }
      let them = this
      setTimeout(function () {
        clearInterval(them.setInter)
        them.setLotteryCount()
        /* eslint no-mixed-operators: ["error", {"allowSamePrecedence": false}] */
        if ((direction === 1 && this.num === 1) || (direction === 2 && this.num === 2) || (direction === 3 && this.num === 3)) {
          // 碰撞
          this.cast += 1
          them.isFail = true
        } else {
          // 未碰撞
          this.noCast += 1
          getPrize(them.secretkey).then(function (res) {
            console.log(res)
            // 1: 水杯  2：数据线 3：置物架  4:面板
            let prizeName = {1: 'prize1', 2: 'prize2', 3: 'prize3', 4: 'prize4'}
            // 活动是否结束
            if (!res.endactive) {
              // 是否中奖
              if (res.prize) {
                if (res.prize === 1 || res.prize === 2 || res.prize === 3 || res.prize === 4) {
                  this.attend_seqid = res.prize
                  // $(".pop-suc .inner").attr('id',prizeName[res.prize]);
                  them.isSuccess = true
                } else {
                  them.isNoWin = true
                }
              } else {
                them.isNoWin = true
              }
            } else {
              console.log('活动结束')
            }
          })
        }
      }, 300)
    },
    direction (startX, startY, endX, endY) {
      let result
      let cx = endX - startX
      let cy = endY - startY
      let angle = (Math.abs(Math.atan2(cy, cx)) * 180) / Math.PI
      if (angle >= -65 && angle < 65) {
        // 向右
        result = 3
      } else if (angle >= 25 && angle < 115) {
        // 向上
        result = 1
      } else if (angle >= -155 && angle < -65) {
        // 向下
        result = 4
      } else if ((angle >= 115 && angle <= 180) || (angle >= -180 && angle < -115)) {
        // 向左
        result = 2
      }
      return result
    },
    restart () {
      window.location.reload()
    }
  },
  created () {
    let that = this
    getLotterySecretStr().then(function (res) {
      if (res.status === 200) {
        if (res.data.status === 200) {
          that.secretkey = res.data.data
        }
      }
    })
  }
}
</script>
<style>
   @import url(../../assets/css/lottery.css);
</style>
