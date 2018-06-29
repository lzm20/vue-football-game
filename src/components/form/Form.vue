<template>
    <div style="width:100%;height:100%;">
        <div class="page-form">
            <img src="@/assets/images/form/form-bg.jpg" alt="" class="bg-img2">
            <div class="form-desc">填写信息 领取奖品</div>
            <div class="form-box">
                <div class="information">*请将以下信息填写完整</div>
                <div class="form-item">
                    <input type="text" name="name" id="name" placeholder="姓名">
                </div>
                <div class="form-item">
                    <input type="number" name="phone" id="phone" placeholder="手机号">
                </div>
                <div class="form-item">
                    <div class='address-section'>
                        <input type="text" name="province" id="province" placeholder="省">
                    </div>
                    <div class='address-section'>
                        <input type="text" name="city" id="city" placeholder="市">
                    </div>
                    <div class='address-section'>
                        <input type="text" name="area" id="area" placeholder="区">
                    </div>
                </div>
                <div class="form-item form-item-address">
                    <textarea name="address" id="address" placeholder="详细地址" cols="30" rows="10"></textarea>
                </div>
                <div id='submit' class="button-submit">提交</div>
            </div>
        </div>
        <div class="pop-hasalready_form lockTouchmove">
          <div class="inner">
            <div class="nowin-desc">您已填写信息，<br>请勿重复填写</div>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'page-form'
}
</script>

<style>
  @import url(../../assets/css/form.css);
</style>
