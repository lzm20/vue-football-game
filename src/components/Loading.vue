<template>
    <div class="page-loading">
      <div class="lp">
         <img style="position: absolute;width: 30%;height: auto;left: 35%;top: 4rem;" src="@/assets/images/_loadingC.png" alt="">
         <img class="_loadingZ" style="position: absolute;width: 30%;height: auto;left: 35%;top: 4rem;" src="@/assets/images/_loadingZ.png" alt="">
      </div>
    </div>
</template>
<script>
export default {
  name: 'loading'
}
</script>
<style>
  .page-loading{
    position: fixed;
    top: 0rem;
    left: 0rem;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,1);
    z-index: 99;
    overflow: hidden;
  }

._loadingZ{
  -webkit-animation: _loading 2s linear infinite;
  animation: _loading 2s linear infinite}
@-webkit-keyframes _loading
{
    0%   {-webkit-transform:rotate(0deg);}
    100% {-webkit-transform:rotate(360deg);}
}
@keyframes _loading
{
    0%   {transform:rotate(0deg);}
    100% {transform:rotate(360deg);}
}
</style>
