<template>
    <div class="page-game" @touchmove.prevent>
        <div class="page-game">
                <div class="text-time">时间：<span class='game-times'>{{times}}</span>S</div>
                <div id="switch" class="open"></div>
                <canvas id='canvas' width="750" height="1450"></canvas>
                <div class="game-fraction"></div>
            </div>
            <div class="pop-lock" v-if='isShowLock'>
                <div class="lock-text">
                    <div>长按并拉动角色</div><div>进行移动</div>
                </div>
                <div class="start" @click="retuceGameTimes()">我知道了</div>
            </div>
            <div class="pop-successful lockTouchmove">
                <div class="inner">
                    <div class="suc-desc">
                        <div style="font-weight: bold;">恭喜您</div>
                        <div>您获得直面门将的机会！</div>
                    </div>
                    <div class="go-lottery">起脚射门</div>
                </div>
                <div class="inner-wai-img"></div>
            </div>
            <div class="pop-fail lockTouchmove">
                <div class="inner">
                    <div class="fail-desc">
                        你坚持了<span></span>S<br>表现不错，继续努力！
                    </div>
                    <div class="again">再次挑战</div>
                    <div class="s-game-times">剩余挑战机会：<span>6</span></div>
                </div>
            </div>
            <div class="pop-no-opportunity lockTouchmove">
                <div class="inner">
                    <div class="opportunity-desc">
                       您的机会已经用完<br>
                       您分享给朋友还可以继续玩喔
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import {setUserLotteryCountDecrOne} from '../base/base'
import AppWeixinShareUtil from '../share/share'
// import game from './js/game'
export default {
  name: 'game',
  data () {
    return {
      isShowLock: true,
      times: 0,
      timer: null,
      id: null,
      score: 0,
      canvas: null,
      context: null,
      pause: 0,
      sprites: [],
      plane: null,
      smallEnemyTime: 0,
      middleEnemyTime: 0,
      bigEnemyTime: 0,
      bulletTime: 0,
      isCanStart: true,
      touchstart: true,
      defaultSize: window.innerWidth / 750
    }
  },
  methods: {
    random (m, n) {
      let a = [0]
      for (let i = 0; i < m; i++) {
        a[i] = parseInt(Math.random() * n)
        for (var j = 0; j < i; j++) {
          if (a[j] === a[i]) {
            while (1) {
              a[i] = parseInt(Math.random() * n)
              if (a[i] !== a[j]) {
                j = j - 1
                break
              }
            }
          }
        }
      }
      return a
    },
    PlaneBomb () {
      this.lastPlaneBombTime = 0
      this.cycle = 300
      this.prototype = {
        execute: function (sprite, context, time) {
          // 轮播每一个图片
          if (time - this.lastPlaneBombTime > this.cycle && sprite.hp === 0) {
            // 更新当前绘图使用的图片
            this.pause = 1
            // sprite.painter.advance();
            if (this.sprite.painter.cellIndex === sprite.painter.cells.length - 1) {
              // 暂停游戏
              this.pause = 1
            }
            // 重新记录最后一次执行时间
            this.lastPlaneBombTime = time
          }
        }
      }
    },
    createPlane () {
      //  我方飞机的图像信息
      let cells = [
        {x: 0, y: 0, w: 105, h: 198},
        {x: 105, y: 0, w: 105, h: 198}
      ]
      //  我方飞机的配置
      let option = {hp: 1, w: 105, h: 198}
      // 创建我方飞机
      let plane = new this.Sprite('plane', new this.SpritePainter('http://haierclub.huandengpai.com/static/haier/haier-world-cup/game/images/player-one.png', cells), [new this.PlaneBomb()])
      setInterval(function () {
        plane.painter.prototype.advance()
      }, 200)
      // 初始化设置
      plane.hp = option.hp
      plane.left = 330
      plane.top = 820
      plane.width = option.w
      plane.height = option.h
      return plane
    },
    Sprite (name, painter, behaviors) {
      if (name !== undefined) {
        this.name = name // 当前对象的名称 (可以不设置)
      }
      if (painter !== undefined) {
        this.painter = painter // 外部传入的绘制器对象(该对象提供了对象的绘制功能)
      }
      this.left = 0 // 当前对象的横坐标
      this.top = 0 // 当前对象的纵坐标
      this.width = 10 // 当前对象的纵坐标
      this.height = 10 // 当前对象的纵坐标
      this.moveX = 0 // 当前对象的横向移动速度 正数 向右  负数 向左
      this.moveY = 0 // 当前对象的纵向移动速度 正数 向下  负数 向上
      this.visible = true // 当前对象的可见状态
      this.animating = false // 当前对象是否处于动画状态
      this.behaviors = behaviors || [] // 当前对象的行为数组 （对象数组） [飞,爆炸,起落...]
      this.flat = true
      this.__top = 0
      this.__left = 0
      this.gluy = true
      let thir = this
      this.prototype = {
      // 对象的绘制方法
      // @param context :绘图环境
        paint: function (context) {
          // 判断是否存在绘制器   判断当前元素是否可以显示
          if (thir.painter !== undefined && thir.visible) {
            // 调用绘制器对象中的paint绘图方法  传入  this->当前对象(飞机)  context(绘图环境)
            thir.painter.prototype.paint(thir, context)
          }
        },
        // 更新动画行为的方法 需要使用behaviors 成员
        update: function (context, time, planeObj) {
          for (let i = 0; i < thir.behaviors.length; i++) {
            thir.behaviors[i].execute(thir, context, time, planeObj)
          }
        }

      }
    },
    SpritePainter (url, cells) {
      this.img = new Image()
      this.img.src = url
      this.cells = cells || []
      this.cellIndex = 0
      let that = this
      this.prototype = {
      // 更新使用的图片（下标）
        advance: function () {
          if (that.cellIndex === that.cells.length - 1) {
            // 还原图片设置 从第一张图开始使用
            that.cellIndex = 0
          } else {
            // 更新图片索引，没有到达最后一张图 索引+1
            that.cellIndex++
          }
        },
        // 图像绘制方法
        paint: function (sprite, context) {
          // 保证在图片加载完毕的情况下绘制图片
          if (that.img.complete) {
            // 获取当前绘制使用的图片信息
            let cell = that.cells[that.cellIndex]
            // 使用图像信息数组中的某个图片绘制到canvas中
            that.img.onload = function () {
              context.drawImage(that.img, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h)
            }
          }
        }
      }
    },
    BgSprite (option) {
      this.left = option.x || 0 // 背景的横向坐标
      this.top = option.y || 0 // 背景的纵向坐标
      this.width = option.w || 0 // 背景图片的宽度
      this.height = option.h || 0 // 背景图片的高度
      this.moveX = option.Mx || 0 // 背景图片的水平移动速度  像素/秒
      this.moveY = option.My || 0 // 背景图片的垂直移动的速度  像素/秒
      this.img = new Image() // 声明image对象
      this.img.src = option.url // 为当前对象制定图片资源
      // 记录上一帧的执行结束时间点
      this.lastBgTime = 0
      let them = this
      this.prototype = {
        update: function (context, time) { // time由 动画播放方法 requestNextAnimationFrame提供
          // 判断当前时间是否==0
          if (them.lastBgTime !== 0) {
            // 如果lastBgTime!=0 不是第一帧
            let frameTime = time - them.lastBgTime

            // 更新纵坐标 this.top    当前高度=当前的高度+每秒移动的速度/1000*每一帧的时间(毫秒)
            them.top = them.top + (them.moveY / 1000) * frameTime
            // 判断当前第一张背景图片是否已经到达canvas最下端不显示
            if (them.top >= context.canvas.height) {
              them.top = 0
            }
          }
          // 将时间记录到最后执行时间属性中
          them.lastBgTime = time
        },
        // 将图片绘制到canvas中
        paint: function (context) {
          // 绘制第一张背景图
          // context.drawImage(图片对象,来源图x,来源图y,宽度,高度,画布x,画布,y,宽度,高度);
          them.img.onload = function () {
            context.drawImage(them.img, 0, 0, them.width, them.height, them.left, them.top, them.width, them.height)
            // 绘制第二张背景图
            context.drawImage(them.img, 0, 0, them.width, them.height, them.left, them.top - them.height, them.width, them.height)
          }
        }
      }
    },
    retuceGameTimes () {
      this.isShowLock = false
      /* 倒计时 */
      this.countDown()
      // 减少游戏次数
      setUserLotteryCountDecrOne().then(res => {
        // console.log(res)
      })
    },
    countDown () {
      /* 倒计时 */
      let that = this
      this.timer = setInterval(function () {
        that.times++
      }, 1000)
    },
    setWxShare () {
      let shareData = {}
      AppWeixinShareUtil.setupWeixinShareOnly(shareData)
    }
  },
  created () {
  },
  mounted () {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.plane = this.createPlane()
    this.sprites.push(this.plane)
    let thes = this
    this.canvas.addEventListener('touchmove', function (e) {
      if (thes.touchstart === true) {
        e.preventDefault()
        let oevent = window.event || arguments[0]
        let chufa = oevent.srcElement || oevent.target
        let selfplanX = oevent.changedTouches[0].clientX / thes.defaultSize
        let selfplanY = oevent.changedTouches[0].clientY / thes.defaultSize
        thes.plane.left = selfplanX - thes.plane.width / 2
        thes.plane.top = selfplanY
      }
    }, true)
    this.canvas.addEventListener('touchend', function (e) {
      this.touchstart = false
    }, true)
    let bgSprite = new this.BgSprite({w: 750, h: 1442, My: 30, url: 'http://haierclub.huandengpai.com/static/haier/haier-world-cup/game/images/gameArts.png'})
    // bgSprite.prototype.paint(this.context)
    this.sprites[0].prototype.paint(this.context)
  }
}
</script>
<style>
   @import url(../../assets/css/game.css);
</style>
