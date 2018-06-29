<template>
  <div id="app">
    <Loading v-if='Load'></Loading>
    <div id="switch" class='open'></div>
    <!-- <Home v-if='isShowHome&&openid' @goAame="goAame"></Home> -->
    <transition name="fade">
      <Game v-if='isShowGame&&openid'></Game>
    </transition>
    <!-- <Lottery></Lottery> -->
    <!-- <Form></Form> -->
    <!-- <Introduces></Introduces> -->
    <Wxshare></Wxshare>
    <div id='tips' v-if='isTips'></div>
    <div class="pop-active-end lockTouchmove" v-if='activeEned'>
        <div class="inner">
            <div class="end-desc">
                活动已结束，下次赶早哦
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import Home from '@/components/home/Home'
import Game from '@/components/game/Game'
import Loading from '@/components/Loading'
import Lottery from '@/components/lottery/Lottery'
import Form from '@/components/form/Form'
import Introduces from '@/components/Introduces'
import Wxshare from '@/components/share/Wxshare'
import {getGameExpires, localStorageOpenid} from '@/components/base/base'
export default {
  name: 'App',
  data () {
    return {
      Load: true,
      isShowHome: true,
      isShowGame: true,
      isTips: false,
      openid: false,
      activeEned: false
    }
  },
  components: {
    Home,
    Loading,
    Game,
    Lottery,
    Form,
    Introduces,
    Wxshare
  },
  created () {
    if (localStorageOpenid) {
      this.openid = true
      this.Load = false
      /* 获取游戏活动时间 */
      getGameExpires().then(res => {
        if (res.status === 200) {
          if (res.data.status === 200) {
            let endtime = res.data.data.endtime
            let dateDay = Date.parse(new Date()) / 1000
            console.log(endtime + '----' + dateDay)
            if (dateDay > endtime) {
              this.activeEned = true
            }
          } else if (res.data.status === 400) {
            alert('获取活动期限参数错误')
          }
        } else {
          alert('网络错误')
        }
      })
    }
  },
  methods: {
    goAame () {
      this.isShowGame = true
      this.isShowHome = false
    }
  }
}
</script>
<style>
  #app{
    width: 100%;
    height: 100%;
  }
  #switch{
      position: fixed;
      top:0.36rem;
      right: 0.43rem;
      width:0.75rem;
      height: 0.75rem;
      z-index: 5;
  }
  #switch.open{
      animation: open 1.5s linear infinite 0s both;
      background-image: url('assets/images/open.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
  }
  @keyframes open{
      0%{
          transform: rotate(0deg);
      }
      100%{
          transform: rotate(360deg);
      }
  }
  #switch.close{
      background-image: url('assets/images/close.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
  }
  #tips{
    position: fixed;
    top:0rem;
    left:0rem;
    right:0rem;
    bottom: 0rem;
    z-index: 999;
    background-color: #000;
    transition: all 1s;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .pop-active-end{
    position: fixed;
    z-index: 2;
    top: 0rem;
    left: 0rem;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
  }
  .pop-active-end .inner{
    position: absolute;
    top: 3.55rem;
    left: 1.2rem;
    width: 5.1rem;
    background-color:#30862e;
    border:7px solid #fdbf30;
    z-index: 2;
  }
  .pop-active-end .inner:after{
    content: "";
    position: absolute;
    top:-1.11rem;
    left:1.44rem;
    width: 2.22rem;
    height: 2.22rem;
    background-image: url('./assets/images/pi.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .end-desc{
    margin: 0 auto;
    margin-top: 1.3rem;
    margin-bottom: 0.3rem;
    width: 4.3rem;
    text-align: center;
    color: #fff;
    font-size: 0.36rem;
    font-weight: bold;
  }
</style>
<style>
  @import url(assets/css/reset.css);
</style>
