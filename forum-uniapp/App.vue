<script setup>
  import {
    onBeforeMount,
    onMounted,
    onBeforeUnmount
  } from 'vue';

  onBeforeMount(() => {
    console.log('App Launch');
  });

  onMounted(() => {
    console.log('App Show');
  });

  onBeforeUnmount(() => {
    console.log('App Hide');
  });
</script>
<style lang="scss">
  @import "./uni_modules/vk-uview-ui/index.scss";
  @import "static/css/iconfont.css"
</style>