<template>
    <div class="page-con">
        <div class="page-lottery">
            <div class="game-tips">
                <div class="hand"></div>
            </div>
            <!-- 球门 -->
            <div id="goal"></div>
            <!-- 守门员 -->
            <div id="goalkeeper"></div>
            <!-- 足球 -->
            <div id="football"></div>
            <div class="ball_projection"></div>
            <div class="information">拨动足球绕过门将</div>
        </div>
        <!-- 成功 去抽奖 -->
            <div class="pop-suc lockTouchmove">
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
            <div class="pop-nowin lockTouchmove">
              <div class="inner">
                <div class="nowin-desc">很遗憾，没有中奖</div>
                <div class="restart">重新开始</div>
              </div>
            </div>
            <div class="pop-fail lockTouchmove">
              <div class="inner">
                <div class="fail-desc">门将发挥神勇，<br>球被扑出</div>
                <div class="restart">重新开始</div>
              </div>
            </div>
            <div class="pop-hasalready lockTouchmove">
              <div class="inner">
                <div class="nowin-desc">您已抽奖，请勿重复抽奖</div>
                <div class="restart">重新开始</div>
              </div>
            </div>
    </div>
</template>
<script>
export default {
  name: 'lottery'
}
</script>
<style>
   @import url(../../assets/css/lottery.css);
</style>
