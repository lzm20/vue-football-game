<template>
    <div class="page-home" @touchmove.prevent>
      <div class="text-game-times">您目前还有<span class='gameTextTimes'>{{gameTimes}}</span>次挑战机会</div>
      <div class="open-game" @click="startGame"></div>
    </div>
</template>
<script>
import {localStorageOpenid, getGameFrequency} from '../base/base'
import {sessionStorageKey, sessionStorageFormKey} from '../base/key'
export default {
  name: 'home',
  props: ['goGame'],
  data () {
    return {
      gameTimes: '0'
    }
  },
  methods: {
    startGame () {
      this.$emit('goGame')
    }
  },
  created () {
    // 获取游戏次数
    getGameFrequency().then(res => {
      if (res.status === 200) {
        if (res.data.status === 200) {
          if (res.data.data) {
            this.gameTimes = res.data.data
          } else {
            this.gameTimes = 0
          }
        } else if (res.data.status === 400) {
          alert('参数错误')
        }
      } else {
        alert('网络错误')
      }
    })
    sessionStorage.removeItem(sessionStorageKey)
    sessionStorage.removeItem(sessionStorageFormKey)
  }
}
</script>
<style>
  @import url(../../assets/css/home.css);
</style>
