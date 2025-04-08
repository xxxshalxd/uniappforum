<template>
  <view class="main">
    <view class="news-list">
      <!-- 左边部分 -->
      <view class="column left">
        <view class="news-item" v-for="(item, index) in leftDataList" :key="item.id">
          <view class="news-title" @click="goToDetail(item.id)">{{ item.newsTitle }}</view>
          <view class="news-date">{{ item.newsDate }}</view>
        </view>
      </view>
      <!-- 右边部分 -->
      <view class="column right">
        <view class="news-item" v-for="(item, index) in rightDataList" :key="item.id">
          <view class="news-title" @click="goToDetail(item.id)">{{ item.newsTitle }}</view>
          <view class="news-date">{{ item.newsDate }}</view>
        </view>
      </view>
    </view>
  </view>
</template>


<script setup>
  import {
    ref,
    reactive,
    onMounted
  } from "vue"
  import http from '@/utils/http.js';


  const dataList = ref([])
  const leftDataList = ref([]);
  const rightDataList = ref([]);

  const fetchList = async () => {
    try {
      const response = await http.get('/api/affair');
      console.log("response:" + response.data)
      dataList.value = response.data;
      console.log("response2:" + dataList.value)
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };
  // 分配数据到左右列表
  const distributeData = () => {
    leftDataList.value = [];
    rightDataList.value = [];
    dataList.value.forEach(item => {
      if (item.id % 2 === 0) { // 偶数ID
        rightDataList.value.push(item);
      } else { // 奇数ID
        leftDataList.value.push(item);
      }
    });
  };
  const goToDetail = (id) => {
    console.log("title id===>" + id)
    uni.navigateTo({
      url: `/pages/newsDetail/newsDetail?id=${id}`
    });
  };
  onMounted(async () => {
    await fetchList();
    await distributeData();
  });
</script>

<style lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
    display: flex; // 使.main成为弹性容器
  }

  .news-list {
    display: flex;
    justify-content: space-between;
    /* 确保左右两栏平均分配空间 */
  }

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
  }

  .left {
    border-right: 1px solid #ccc;
    /* 给左右两栏之间添加分隔线 */
  }

  .news-item {
    display: flex;
    flex-direction: column;
    /* 确保.news-title和.news-date垂直排列 */
    margin-bottom: 10px;
  }

  .news-title {
    font-size: 16px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /* 限制文本为一行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .news-date {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    /* 防止日期文本换行 */
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>