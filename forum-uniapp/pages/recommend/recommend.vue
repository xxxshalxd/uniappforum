<template>
  <view style="display: flex; flex-direction: column; align-items: center;justify-content: center;  height: 100%;">
    <!-- 地图 -->
    <text style="font-size: 60rpx;">韩山师范校园地图</text>
    <image src="../../static/map.jpg" alt="" mode="aspectFit" style="height:600rpx" />
  </view>
</template>

<script setup>
  const statechange = () => {
    console.log('live-player code:', e.detail.code)
  }
  const error = () => {
    console.error('live-player error:', e.detail.errMsg)
  }
</script>

<style lang="scss" scoped>

</style>