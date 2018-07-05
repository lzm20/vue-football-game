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
            <div class="pop-successful lockTouchmove" v-if="isSuccess">
                <div class="inner">
                    <div class="suc-desc">
                        <div style="font-weight: bold;">恭喜您</div>
                        <div>您获得直面门将的机会！</div>
                    </div>
                    <div class="go-lottery" @click='goLottery'>起脚射门</div>
                </div>
                <div class="inner-wai-img"></div>
            </div>
            <div class="pop-fail lockTouchmove" v-if='isFail'>
                <div class="inner">
                    <div class="fail-desc">
                        你坚持了<span></span>S<br>表现不错，继续努力！
                    </div>
                    <div class="again" @click="again">再次挑战</div>
                    <div class="s-game-times">剩余挑战机会：<span>{{gameTimes}}</span></div>
                </div>
            </div>
            <div class="pop-no-opportunity lockTouchmove" v-if='isNoPoop'>
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
import {setUserLotteryCountDecrOne, getGameFrequency} from '../base/base'
import AppWeixinShareUtil from '../share/share'
import {requestNextAnimationFrame, cancelNextRequestAnimationFrame} from './js/requestNextAnimationFrame'
// import game from './js/game'
export default {
  name: 'game',
  props: ['goLot'],
  data () {
    return {
      gameTimes: 0,
      isShowLock: true,
      isSuccess: false,
      isFail: false,
      isNoPoop: false,
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
      defaultSize: window.innerWidth / 750,
      bgSprite: null,
      randomLeft: [30, 70, 140, 210, 280, 350, 420, 490, 560, 630, 680]
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
            thir.behaviors[i].prototype.execute(thir, context, time, planeObj)
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
            context.drawImage(that.img, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h)
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
          context.drawImage(them.img, 0, 0, them.width, them.height, them.left, them.top, them.width, them.height)
          // 绘制第二张背景图
          context.drawImage(them.img, 0, 0, them.width, them.height, them.left, them.top - them.height, them.width, them.height)
        }
      }
    },
    EnemyFly () {
      let lastEnemyFlyTime = 0
      this.prototype = {
        execute: function (sprite, context, time, planeObj) {
          let planeLeft = planeObj.left
          let planeTop = planeObj.top
          if (lastEnemyFlyTime !== 0) {
          // 更新飞机的位置 top坐标
            // console.log(sprite.top)
            // sprite.top = sprite.top + sprite.moveY / 1000 * (time - lastEnemyFlyTime)
            if (planeTop > sprite.top) {
              if ((planeTop - sprite.top) < 440 && (planeTop - sprite.top) > sprite.height) {
                sprite.flat = false
                sprite.__top = Math.abs(planeTop - sprite.top) / sprite.moveX
                if (planeLeft > sprite.left && sprite.gluy) {
                  sprite.__left = (planeLeft - sprite.left) / sprite.moveX
                } else {
                  sprite.__left = -(sprite.left - planeLeft) / sprite.moveX
                  sprite.gluy = false
                }
              }
            }
            if (sprite.flat) {
              sprite.top = sprite.top + sprite.moveY / 1000 * (time - lastEnemyFlyTime)
              sprite.left = sprite.left
            } else {
              sprite.top = sprite.top + sprite.__top
              sprite.left = sprite.left + sprite.__left
            }
            // 判断当前飞机的位置是否飞出屏幕，如果已经离开屏幕  隐藏
            // sprite.top>context.canvas.height&&sprite.left>context.canvas.width-10&&sprite.left<10
            if (sprite.top > context.canvas.height || sprite.left < 0 || sprite.left > context.canvas.width) {
              sprite.visible = false
            }
          }
          // 记录每次动画的最后一次时间
          lastEnemyFlyTime = time
        }
      }
    },
    EnemyBomb () {
      this.lastEnemyBombTime = 0
      this.cycle = 100
      this.prototype = {
        execute: function (sprite, context, time) {
          // 轮播每一个图片
          if (time - this.lastEnemyBombTime > this.cycle && sprite.hp === 0) {
            // 更新当前绘图使用的图片
            // sprite.painter.advance();
            // 判断 如果当前飞机死亡hp=0 且爆炸效果播放完毕 删除该飞机
            if (sprite.painter.cellIndex === sprite.painter.cells.length - 1) {
              sprite.visible = false
            }
            // 重新记录最后一次执行时间
            this.lastEnemyBombTime = time
          }
        }
      }
    },
    createEnemy (name, op) {
      let smallCells = [
        {x: 0, y: 1469, w: 84, h: 166},
        {x: 84, y: 1469, w: 84, h: 166} ]
      let suduX = 120
      let suduXX = 20
      if (this.score <= 5) {
        suduX = suduX + Math.floor(Math.random() * 50) + 50
        suduXX = 20
      } else if (this.score > 5 && this.score <= 10) {
        suduX = suduX + Math.floor(Math.random() * 50) + 100
        suduXX = 18
      } else if (this.score > 10 && this.score <= 15) {
        suduX = suduX + Math.floor(Math.random() * 50) + 150
        suduXX = 16
      } else if (this.score > 15 && this.score <= 20) {
        suduX = suduX + Math.floor(Math.random() * 50) + 200
        suduXX = 14
      } else if (this.score > 20 && this.score <= 25) {
        suduX = suduX + Math.floor(Math.random() * 50) + 250
        suduXX = 10
      } else {
        suduX = suduX + Math.floor(Math.random() * 50) + 300
        suduXX = 8
      }
      let smallOption = {w: 110, hh: 219, moveY: suduX, hp: 1, score: 1, moveX: suduXX}
      let cells = smallCells
      // 实例化精灵对象
      let Enemy = new this.Sprite(name, new this.SpritePainter('http://haierclub.huandengpai.com/static/haier/haier-world-cup/game/images/gameArts.png', cells), [new this.EnemyFly(), new this.EnemyBomb()])
      setInterval(function () {
        Enemy.painter.prototype.advance()
      }, this.generateMixed(1, 190, 210))
      // 属性初始化
      Enemy.top = -smallOption.hh - (this.generateMixed(1, 5, 50))
      Enemy.height = smallOption.hh
      Enemy.width = smallOption.w
      Enemy.left = this.EnemyLeft(op)
      Enemy.moveY = smallOption.moveY
      Enemy.moveX = smallOption.moveX
      Enemy.hp = smallOption.hp
      Enemy.score = smallOption.score
      return Enemy
    },
    EnemyLeft (ind) {
      let newNumber = this.randomLeft[ind]
      return newNumber
    },
    animate (time) {
      if (this.pause === 0) {
      // 添加飞机操作
      // 小飞机添加
        let smallObj = this.random(3, 10)
        if (time - this.smallEnemyTime > 3000) {
        // 一次性添加三个小飞机
          for (var i = 0; i < 3; i++) {
            this.sprites.push(this.createEnemy('smallEnemy', smallObj[i]))
          }
          // 更新最后一次记录时间
          this.smallEnemyTime = time
        }
        // 更新当前背景的位置
        this.bgSprite.prototype.update(this.context, time)
      }
      this.bgSprite.prototype.paint(this.context)
      if (this.pause === 0) {
        // 循环遍历所有精灵对象 更新行为
        for (let i = 0; i < this.sprites.length; i++) {
          this.sprites[i].prototype.update(this.context, time, this.sprites[0])
          // 判断是否有不可见的精灵对象-
          if (this.sprites[i].visible === false) {
            // 在飞机对象删除之前把分数累加起来
            if (this.sprites[i].name !== 'plane') { // 判断是否是飞机
              this.score = this.score + this.sprites[i].score
            }
            // 删除不可见的对象
            this.sprites.splice(i, 1)
          }
        }
      } else if (this.pause === 1) {
        for (let i = 0; i < this.sprites.length; i++) {
          this.sprites[i].prototype.update(this.context, time, this.sprites[0])
        }
      }
      for (let i = 0; i < this.sprites.length; i++) {
        if (this.pause === 0) {
          // 判断是否是本方飞机
          if (this.sprites[i].name === 'plane') {
            for (var j = 0; j < this.sprites.length; j++) {
              if (this.sprites[j].name !== 'plane') {
                if (((this.sprites[j].left > this.sprites[i].left && this.sprites[j].left < this.sprites[i].left + this.sprites[i].width - 30) ||
                      (this.sprites[j].left < this.sprites[i].left && this.sprites[j].left + this.sprites[j].width - 30 > this.sprites[i].left)) &&
                    (this.sprites[j].top < this.sprites[i].top && (this.sprites[j].top + this.sprites[j].height - 20 > this.sprites[i].top))) {
                  clearInterval(this.timer)
                  cancelNextRequestAnimationFrame(this.id)
                  this.isCanStart = false
                  if (this.times === 30 || this.times > 30) {
                    this.isSuccess = true
                  } else {
                    this.isFail = true
                    /* 获取游戏次数 */
                    this.getGameTimes()
                  }
                  this.setWxShare()
                  // 只有飞机气血>=1的情况下才减血
                  if (this.sprites[i].hp >= 1) {
                    // 讲当前飞机的气血-1
                    this.sprites[i].hp -= 1
                  }
                } else if (this.sprites[j].top > (this.sprites[i].top + this.sprites[i].height)) {
                  // sprites[j].visible=false;
                }
              }
            }
          }
          this.sprites[i].prototype.paint(this.context)
        } else if (this.pause === 1) {
          if (this.sprites[i].name === 'plane') {
            this.sprites[i].prototype.paint(this.context)
          }
        }
      }
      if (this.isCanStart) {
        this.id = requestNextAnimationFrame(this.animate)
      }
    },
    retuceGameTimes () {
      this.isShowLock = false
      if (this.gameTimes > 0) {
        /* 倒计时 */
        this.countDown()
        // 减少游戏次数
        setUserLotteryCountDecrOne().then(res => {
          // console.log(res)
        })
        requestNextAnimationFrame(this.animate)
        setTimeout(function () {
          cancelNextRequestAnimationFrame(this.id)
        }, 2000)
      } else {
        this.isNoPoop = true
      }
    },
    countDown () {
      /* 倒计时 */
      let that = this
      this.timer = setInterval(function () {
        that.times++
      }, 1000)
    },
    generateMixed (n, m, k) {
      let arr = []
      for (var i = 0; i < n; i++) {
        let id = this.numRandom(k, m)
        arr.push(id)
      }
      return arr
    },
    getGameTimes () {
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
    },
    numRandom (min, max) {
      return min + Math.floor(Math.random() * (max - min + 1))
    },
    setWxShare () {
      let shareData = {}
      AppWeixinShareUtil.setupWeixinShareOnly(shareData)
    },
    again () {
      window.location.reload()
    },
    goLottery () {
      this.$emit('goLot')
    }
  },
  created () {
    this.getGameTimes()
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
    this.bgSprite = new this.BgSprite({w: 750, h: 1442, My: 30, url: 'http://haierclub.huandengpai.com/static/haier/haier-world-cup/game/images/gameArts.png'})
    this.bgSprite.prototype.paint(this.context)
    this.sprites[0].prototype.paint(this.context)
  }
}
</script>
<style>
  @import url(../../assets/css/game.css);
</style>
