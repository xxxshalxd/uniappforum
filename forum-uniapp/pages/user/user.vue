<template>
  <view class="auth-pages">
    <u-navbar title="登录/注册" :is-back="false"></u-navbar>
    <view class="auth-form">
      <!-- 登录表单 -->
      <view v-if="!isRegister && !isLoggedIn">
        <u-input v-model="loginForm.username" placeholder="用户名" :border="true" style="margin-bottom: 10rpx;" />
        <u-input type="password" v-model="loginForm.password" placeholder="密码" :border="true" />
        <view class="register">
          <text @click="switchToRegister" class="toRegister">没有账号，点击注册</text>
        </view>
        <u-button @click="handleLogin" type="success" plain>登录</u-button>
        <!--      <u-button @click="switchToRegister">注册</u-button> -->
      </view>

      <!-- 注册表单 -->
      <view v-if="isRegister">
        <u-input v-model="registerForm.username" placeholder="用户名" mode="border" :border="true" />
        <u-input type="password" v-model="registerForm.password" placeholder="密码" mode="border" :border="true" />
        <u-input type="password" v-model="registerForm.confirmPassword" placeholder="确认密码" mode="border"
          :border="true" />
        <view class="registerBtn">
          <u-button @click="handleRegister" type="primary" style="margin-bottom: 20rpx;">注册</u-button>
          <u-button @click="switchToLogin" type="success">返回登录</u-button>
        </view>

      </view>

      <!-- 个人中心内容 -->
      <view v-if="isLoggedIn">
        <view class="user-info" style="display: flex; justify-content: center;">
          <!--  <u-tag text="用户名" type="success" /> -->
          <u-image src="../../static/avatar/1_user4.png" shape="circle" width="40rpx" height="40rpx"></u-image>
          <text style="margin-top: 12rpx; margin-left: 10rpx;">{{ userStore.userInfo.username }}, 欢迎登录~</text>
        </view>
        <view class="buttonGroup">
          <u-button @click="logout" type="warning" shape="circle" style="margin-right: 90rpx;">退出登录</u-button>
          <u-button @click="switchToAi" type="error" shape="circle" style="margin-left: 80rpx;">ai对话</u-button>
        </view>

        <!-- 个人发帖记录等 -->
        <view class="user-posts">
          <u-cell-group>
            <u-cell-item title="个人发帖记录" @click="togglePosts" arrow="true" :arrow-direction="arrowChange" icon="list"
              :value="userPosts.length">
            </u-cell-item>
            <view v-show="showPosts">
              <view v-for="post in userPosts" :key="post.id" class="post-item">
                <view class="post-title">
                  <u-tag text="标题"></u-tag>
                  {{ post.title }}
                </view>
                <view class="post-content">
                  <u-tag text="内容" type="success"></u-tag>

                  {{ post.content }}
                  <image :src="post.imagePath" mode="aspectFit" style="width: 450rpx; height: 350rpx;"></image>
                </view>


              </view>
            </view>
            <u-cell-item title="点赞过的帖子" @click="toggleLikedPosts" arrow="true" icon="thumb-up"
              :value="likedPosts.length" :arrow-direction="likearrowChange">
            </u-cell-item>
            <view v-show="showLikedPosts">
              <view v-for="post in likedPosts" :key="post.id" class="post-item">
                <view class="post-title">
                  <u-tag text="标题"></u-tag>
                  {{ post.title }}
                </view>
                <view class="post-content">
                  <u-tag text="内容" type="success"></u-tag>
                  {{ post.content }}
                  <image :src="post.imagePath" mode="aspectFit" style="width: 450rpx; height: 350rpx;"></image>
                </view>
              </view>
            </view>
          </u-cell-group>


        </view>
      </view>
    </view>
    <view v-if="loginError" class="error-message">
      {{ loginError }}
    </view>

    <!-- 模态框 -->
    <u-modal v-model="showModal" :title="modalTitle" :content="modalContent" @confirm="handleModalConfirm" />
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
  } from 'vue';
  import {
    onShow
  } from "@dcloudio/uni-app"
  import http from '@/utils/http.js';
  import {
    useUserStore
  } from '@/stores/user.js'; // 确保路径正确

  const userStore = useUserStore();
  const isRegister = ref(false);
  const isLoggedIn = ref(false);
  const switchToAi = () => {
    uni.navigateTo({
      url: '../spark/spark'
    });

  }

  const loginForm = ref({
    username: '',
    password: ''
  });
  const registerForm = ref({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const userPosts = ref([]);
  const loginError = ref('');
  const showModal = ref(false);
  const modalTitle = ref('');
  const modalContent = ref('');

  // 切换到登录表单
  const switchToLogin = () => {
    isRegister.value = false;
    isLoggedIn.value = false;
    loginError.value = '';
  };

  // 切换到注册表单
  const switchToRegister = () => {
    isRegister.value = true;
  };

  // 处理登录
  const handleLogin = async () => {
    try {
      const response = await http.post('/api/users/login', loginForm.value);
      userStore.login(response.data);
      isLoggedIn.value = true;
      fetchUserPosts();
      fetchLikedPosts();
      showModal.value = true;
      modalTitle.value = '登录成功';
      modalContent.value = '欢迎回来！';
    } catch (error) {
      console.error('Login failed:', error);
      showModal.value = true;
      modalTitle.value = '登录失败';
      modalContent.value = error.response.data || '登录失败，请重试';
    }
  };

  // 处理注册
  const handleRegister = async () => {
    // 检查用户名和密码是否为空
    if (!registerForm.value.username || !registerForm.value.password) {
      showModal.value = true;
      modalTitle.value = '注册失败';
      modalContent.value = '用户名和密码不能为空';
      return;
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      showModal.value = true;
      modalTitle.value = '注册失败';
      modalContent.value = '密码和确认密码不匹配';
      return;
    }
    try {
      const response = await http.post('/api/users/register', registerForm.value);
      // 注册后自动登录
      userStore.login(response.data);
      switchToLogin();
      showModal.value = true;
      modalTitle.value = '注册成功';
      modalContent.value = '注册成功，请登录';
    } catch (error) {
      console.error('Register failed:', error);
      showModal.value = true;
      modalTitle.value = '注册失败';
      modalContent.value = error.response.data || '注册失败，请重试';
    }
  };

  // 获取用户帖子
  const fetchUserPosts = async () => {
    const userId = userStore.userInfo.id;
    if (userId) {
      try {
        const response = await http.get(`/api/posts/user/${userId}`);
        userPosts.value = response.data;
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    } else {
      console.log('No user is currently logged in.');
    }
  };

  // 模态框确认按钮处理
  const handleModalConfirm = () => {
    showModal.value = false;
  };

  // 退出登录
  const logout = async () => {
    userStore.logout();
    isLoggedIn.value = false;
  };
  const arrowChange = ref("right")
  const likearrowChange = ref("right")

  // 获取用户点赞过的帖子
  const fetchLikedPosts = async () => {
    const userId = userStore.userInfo.id;
    if (userId) {
      try {
        const response = await http.get(`/api/likes/posts`, {
          params: {
            userId: userId
          }
        });
        likedPosts.value = response.data.data;
        console.log('Liked posts:', response.data);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    } else {
      console.log('No user is currently logged in.');
    }
  };
  // 点赞过的帖子列表
  const likedPosts = ref([]);
  // 在组件加载时获取帖子列表
  const showLikedPosts = ref(false);
  const showPosts = ref(false);
  const togglePosts = () => {
    showPosts.value = !showPosts.value;
    if (arrowChange.value == "down") {
      arrowChange.value = "right"
    } else {
      arrowChange.value = "down";
    }

  };

  const toggleLikedPosts = () => {
    showLikedPosts.value = !showLikedPosts.value;
    if (showLikedPosts.value) {
      likearrowChange.value = "down";
    } else {
      likearrowChange.value = "right";
    }
  };

  onShow(() => {
    // 每次页面显示时重新获取数据
    fetchUserPosts();
    fetchLikedPosts();
  });
</script>


<style lang="scss" scoped>
  .buttonGroup {
    display: flex;
    margin: 50rpx;


  }

  .register {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    text-align: right;
    margin-left: auto;
    margin: 20rpx;
  }

  .user-posts {
    margin-top: 20px;
  }

  .registerBtn {
    display: flex;
    justify-content: space-around;
    margin: 30rpx;
  }


  .auth-pages {
    padding: 20px;
  }

  .auth-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .user-posts {
    margin-top: 20px;
  }

  .post-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 20px;
  }

  .post-title {
    font-size: 18px;
    font-weight: bold;

  }

  .post-content {
    font-size: 18px;
    margin-top: 10px;
  }

  .comment-item {
    border: 1px solid #eee;
    padding: 5px;
    margin-top: 10px;
  }

  .error-message {
    color: red;
    margin-top: 20px;
  }

  .toRegister:hover {
    color: blue;
    cursor: pointer;
  }
</style>