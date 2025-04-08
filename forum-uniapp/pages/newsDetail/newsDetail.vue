<template>
  <u-navbar title="要闻详情" :is-back="true"></u-navbar>
  <view class="news-detail">
    <view class="news-header" style="text-align: center; border-bottom: 2rpx solid black; padding-bottom: 13rpx; ">
      <view class="news-title">{{ newsItem.newsTitle }}
      </view>


    </view>

    <view class="news-content" v-html="newsItem.newsContent"></view>
    <view class="news-date">{{ newsItem.newsDate }}</view>
  </view>

</template>

<script setup>
  import {
    ref,
    onMounted,

  } from 'vue';
  import {
    onLoad
  } from "@dcloudio/uni-app"
  import http from '@/utils/http.js';
  const newsItem = ref({});

  const fetchNewsDetail = async (id) => {
    try {
      const response = await http.get(`/api/affair/${id}`);
      newsItem.value = response.data;
    } catch (error) {
      console.error('Error fetching news detail:', error);
    }
  };

  // uni.navigateTo 传进来传参，option为object类型，会序列化上个页面传递的参数
  onLoad((option) => {

    console.log("传参id" + option.id)
    fetchNewsDetail(option.id);
  });
</script>

<style scoped>
  .news-detail {
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    /*    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  }

  .news-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .news-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .news-date {
    font-size: 14px;
    color: #666;
  }

  .news-content {
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    white-space: pre-wrap;
  }
</style>