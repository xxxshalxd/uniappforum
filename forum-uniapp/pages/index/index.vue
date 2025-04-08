<template>

  <view class="u-wrap">

    <u-navbar title="首页" :is-back="false"></u-navbar>
    <swiper class=" swiper-container" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
      :duration="duration" :indicatorColor="indicatorColor">
      <swiper-item v-for="(item,index) in swipperList">
        <image class="imgs" :src="item.image"></image>
      </swiper-item>
    </swiper>



    <view class="">
      <view class="text">

        <!--   <text>资讯</text> -->
      </view>
      <u-tabs :list="list" :is-scroll="false" v-model="current" @change="Tabschange" item-width="200rpx" bar-w
        bar-width="80" active-color="navy" bg-color="#5ac0cf" :style="{
          width: '750rpx',
        
        }"></u-tabs>
      <view v-if="current==1">
        <Affair>
        </Affair>
      </view>
      <view>
        <Recommend v-if="current==2"></Recommend>

      </view>
      <!-- popup -->
      <u-popup v-model="popupShow" mode="center" :closeable="true" close-icon-pos="top-right" class="popOut"
        @close="popupShow = false" z-index="19" border-radius="25" width="400px">
        <view v-if="popupShow">
          <view class="popup-content">
            <image class="popup-image" :src="currentItem.image" mode="scaleToFill"></image>
            <view class="demo-title">
              {{ currentItem.title }}
            </view>
            <view class="demo-detail">
              <view class="">
                {{currentItem.details}}
              </view>
              <view class="" style="display: flex; justify-content: flex-end; margin: 20rpx;">
                更新时间：{{ currentItem.updateDate }}
              </view>

            </view>
          </view>
        </view>
      </u-popup>


      <u-waterfall v-model="flowList" ref="uWaterfall1" v-if="current==0">
        <template v-slot:left="{leftList}">
          <view class="demo-warter-left" v-for="(item, index) in leftList" :key="index" @click="onItemClick(item)">
            <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
            <view class="demo-title">
              {{ item.title }}
            </view>

          </view>
        </template>
        <template v-slot:right="{rightList}">
          <view class="demo-warter-right" v-for="(item, index) in rightList" :key="index" @click="onItemClick(item)">
            <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
            <view class="demo-title">
              {{ item.title }}
            </view>


          </view>
        </template>
      </u-waterfall>

    </view>


  </view>
</template>

<script setup>
  import http from '@/utils/http.js';
  import {
    ref
  } from 'vue';
  import {
    useRouter
  } from 'vue-router'
  import Affair from "../affair/affair.vue"
  import Recommend from "../recommend/recommend.vue"
  const indicatorDots = ref(true)
  const indicatorColor = ref("#FFF")
  const autoplay = ref(true)
  const interval = ref(2000)
  const duration = ref(500)
  const swipperList = ref([{
      image: '/static/img/1.jpg'
    },
    {
      image: "/static/img/2.jpg"
    },
    {
      image: "/static/img/3.jpg"
    }
  ])
  const list = ref([{
      name: '校园活动'
    },
    {
      name: '时讯要闻'
    },
    // {
    //   name: '地图'
    // }
  ])
  const current = ref(0)
  const Tabschange = (index) => {
    current.value = index
  }
  const flowList = ref([]);
  const popupShow = ref(false); // 控制弹出层显示的变量
  const currentItem = ref(null); // 存储当前点击的项目，用于在弹出层中显示


  // 获取瀑布流数据
  const fetchFlowList = async () => {
    try {
      const response = await http.get('/api/news');
      flowList.value = response.data;
    } catch (error) {
      console.error('Error fetching flow list:', error);
    }
  };

  // 点击事件处理函数
  const onItemClick = async (item) => {
    try {
      const response = await http.get(`/api/news/${item.id}`);
      currentItem.value = response.data;
      // if (currentItem.details) {
      //   currentItem.details = JSON.parse(currentItem.details);
      // }
      popupShow.value = true;
      console.log("shuju", currentItem.details)
    } catch (error) {
      console.error('Error fetching news details:', error);
    }
  };

  // 初始化数据
  fetchFlowList();
</script>



<style lang="scss">
  .u-tabs {
    background-color: navajowhite;
  }

  // 弹出层整体样式
  uni-popup.popOut {
    background-color: #ffffff; // 使用纯白色背景
    border-radius: 15px; // 增加圆角
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // 添加阴影
    overflow: hidden; // 防止内容溢出
    width: 90%; // 或者固定宽度，根据实际情况调整
    max-width: 500px; // 最大宽度限制
    margin: 20px auto; // 居中显示
  }

  // 弹出层内容区域样式
  .popup-content {
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; // 元素之间的间距
    overflow: hidden; // 防止内容溢出

  }

  :deep(.popup-image) {
    max-width: 100% !important; // 最大宽度不超过容器宽度
    max-height: 300px !important; // 最大高度，根据需要调整
    border-radius: 8px !important; // 圆角
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 阴影
    object-fit: cover !important; // 保持图片宽高比，裁剪超出部分
  }

  // 弹出层标题样式
  .demo-title {
    font-size: 18px;
    font-weight: bold;
    color: #333333; // 使用深灰色
    text-align: center; // 居中显示
  }

  // 弹出层详情样式
  .demo-detail {
    font-size: 14px;
    color: #666666; // 使用中等灰色
    line-height: 1.5;
    text-align: center; // 居中显示
  }

  .swiper-container {
    height: 180px;

    .item {
      height: 180px;
    }

    .imgs {
      // height: 180px;
      height: 100%;
      width: 100%;
    }
  }



  .demo-warter-left {
    border-radius: 8px;
    margin: 5px 0px 5px 5px;
    background-color: #ffffff;
    padding: 8px;
    position: relative;
  }

  .demo-warter-right {
    border-radius: 8px;
    margin: 5px 5px 5px 0px;
    background-color: #ffffff;
    padding: 8px;
    position: relative;
  }



  .u-close {
    position: absolute;
    top: 32rpx;
    right: 32rpx;
  }

  .demo-image {
    width: 100%;
    border-radius: 4px;
  }

  .demo-title {
    font-size: 30rpx;
    margin-top: 5px;
    color: $u-main-color;
  }

  .demo-tag {
    display: flex;
    margin-top: 5px;
  }

  .demo-tag-owner {
    background-color: $u-type-error;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 4rpx 14rpx;
    border-radius: 50rpx;
    font-size: 20rpx;
    line-height: 1;
  }

  .demo-tag-text {
    border: 1px solid $u-type-primary;
    color: $u-type-primary;
    margin-left: 10px;
    border-radius: 50rpx;
    line-height: 1;
    padding: 4rpx 14rpx;
    display: flex;
    align-items: center;
    border-radius: 50rpx;
    font-size: 20rpx;
  }

  .demo-price {
    font-size: 30rpx;
    color: $u-type-error;
    margin-top: 5px;
  }





  .u-navbar {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    //   background-color: navajowhite;
    color: purple;
    border-radius: 10px;
    width: 100%;
  }

  uni-view.popup-content {
    width: 350px;
    height: 400px;
  }
</style>