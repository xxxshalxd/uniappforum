<template>
  <view class="post-detail">
    <u-navbar title="帖子详情" :is-back="true"></u-navbar>

    <!-- 帖子信息 -->
    <uni-card class="post-item" v-if="post">
      <!-- 用户信息 -->
      <view class="post-author">
        <u-image src="../../static/avatar/1_user4.png" shape="circle" width="50rpx" height="50rpx"></u-image>
        <view class="post-username">
          {{ post.user.username }}
        </view>
      </view>
      <!-- 帖子标题 -->
      <view class="post-title">
        {{ post.title }}
      </view>
      <!-- 帖子内容 -->
      <view class="post-content">
        {{ post.content }}
        <view class="post-image" v-if="post.imagePath">
          <image :src="post.imagePath" mode="scaleToFill" style="width: 450rpx; height: 350rpx;"></image>
        </view>
      </view>

      <!-- 帖子操作 -->
      <view class="post-actions">
        <view class="action-item" @click="toggleLike(post.id)">
          <u-icon name="thumb-up" :color="post.isLiked ? '#5677fc' : '#9a9a9a'"></u-icon>
          {{ post.likesCount }}
        </view>
        <view class="action-item" @click="showComments(post.id)">
          <u-icon name="chat"></u-icon>
          {{ post.commentsCount }}
        </view>
      </view>
    </uni-card>

    <!-- 评论列表 -->
    <view class="post-comments" v-if="post.showComments">
      <view class="comment-item" v-for="comment in post.comments" :key="comment.id">
        <view class="comment-author">
          <u-image src="../../static/avatar/user.png" shape="circle" width="40rpx" height="40rpx"></u-image>
          <view class="comment-username">
            {{ comment.user.username }}
            <text v-if="comment.replyToUsername"> 回复 {{ comment.replyToUsername }}</text>
          </view>
        </view>
        <view class="comment-content">
          {{ comment.content }}
        </view>
        <!-- 二级评论按钮 -->
        <view class="subButton"> <u-button size="mini" shape="circle" type="success" plain
            @click="showSubCommentInput(comment.id,post.id)">回复</u-button>
        </view>
        <view class="sub-comment-list" v-if="comment.showSubComments">
          <view class="sub-comment-item" v-for="subComment in comment.subComments" :key="subComment.id">
            <view class="sub-comment-author">
              <u-image src="../../static/avatar/user.png" shape="circle" width="30rpx" height="30rpx"></u-image>
              <view class="sub-comment-username">
                {{ subComment.user.username }}
              </view>
            </view>
            <view class="sub-comment-content">
              {{ subComment.content }}
            </view>
          </view>
        </view>
      </view>
      <u-button @click="showCommentInput(post.id)" type="primary" shape="circle" :plain="true"
        custom-style="width:350rpx;" style="margin: 40rpx; ">发评论</u-button>
    </view>





    <!-- 评论输入框 -->
    <u-popup v-model="showCommentInputPopup" position="center" mode="center" width="400px" border-radius="25">
      <view class="popup-content">
        <u-form class="comment-form">
          <view class="popup-form-title">发表评论</view>
          <u-form-item label="内容">
            <textarea v-model="newComment.content" placeholder="评论内容" style="margin-top: 50rpx;" />
          </u-form-item>
          <u-button @click="submitComment">
            <u-icon name="checkbox-mark"></u-icon>
            &nbsp;发表评论
          </u-button>
        </u-form>
      </view>
    </u-popup>

    <!-- 子评论输入框弹出层 -->
    <u-popup v-model="showSubCommentInputPopup" position="bottom" mode="center" width="400px" border-radius="25">
      <view class="sub-popup-content">
        <u-form class="sub-comment-form">
          <view class="popup-form-title">回复评论</view>
          <u-form-item label="内容">
            <textarea v-model="newSubComment.content" placeholder="回复内容" style="margin-top: 50rpx;" />
          </u-form-item>
          <u-button @click="submitSubComment">
            <u-icon name="checkbox-mark"></u-icon>
            &nbsp;发表回复
          </u-button>
        </u-form>
      </view>
    </u-popup>
  </view>
</template>
<script setup>
  import {
    ref,
    onMounted,
    reactive,
    nextTick,
    watch,
    watchEffect
  } from 'vue';
  import http from '@/utils/http.js';
  import {
    useUserStore
  } from '@/stores/user.js';
  import {
    onLoad
  } from "@dcloudio/uni-app";

  const post = reactive({

  });


  const userStore = useUserStore();

  const newPost = ref({
    title: '',
    content: '',
    imagePath: '',
  });
  const showCommentInputPopup = ref(false);
  // 新评论数据
  const newComment = ref({
    content: ''
  });
  const showSubCommentInputPopup = ref(false);
  const newSubComment = ref({
    content: ''
  });
  // 当前激活的帖子ID
  const activePostId = ref(null);
  const activeParentCommentId = ref(null);





  // 获取帖子详情
  const fetchPostDetail = async (id) => {
    try {
      const response = await http.get(`/api/posts/${id}`);
      console.log("帖子详情响应数据:", response.data);

      // const postsData = response.data.map(); 原方法不可用了，因为现在单个帖子不是数组了

      // 使用 Object.assign() 来分配属性
      Object.assign(post, {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        imagePath: response.data.imagePath || '',
        likesCount: response.data.likesCount || 0,
        commentsCount: response.data.commentsCount || 0,
      });



      post.user = await getUserById(response.data.userId);

      // 获取评论信息
      post.comments = await fetchComments(id);
      post.likesCount = await getLikeCount(id);
    } catch (error) {
      console.error('Error fetching post detail:', error);
    }
  };

  // 获取用户信息
  const getUserById = async (id) => {
    try {
      const response = await http.get(`/api/users/getName?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {};
    }
  };

  // 获取帖子的评论
  const fetchComments = async (postId) => {
    try {
      const response = await http.get(`/api/comments`, {
        params: {
          postId: postId
        }
      });
      const comments = response.data.map(comment => ({
        ...comment,
        user: {
          username: comment.user.username
        },
        subComments: [],
        replyToUsername: null // 初始化回复者用户名为null
      }));
      // 异步获取每个评论的回复者用户名
      await Promise.all(comments.map(async (comment) => {
        if (comment.parentId) {
          comment.replyToUsername = await getSubCommentName(comment.parentId);
        }
      }));
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };





  // 显示评论
  const showComments = (postId) => {
    post.showComments = !post.showComments;
  };

  // 显示评论输入框
  const showCommentInput = (postId) => {
    if (!userStore.isLoggedIn) {
      uni.showToast({
        title: '评论请先登录',
        icon: 'error',
        duration: 1000,
      });
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/user/user'
        })
      }, 1000)
      return;
    }
    activePostId.value = postId;
    showCommentInputPopup.value = true;
  };

  // 提交评论
  const submitComment = async () => {
    try {
      await http.post('/api/comments', {
        content: newComment.value.content,
        postId: activePostId.value,
        userId: userStore.userInfo.id // 使用 Pinia 中的用户 ID
      });
      post.comments = await fetchComments(activePostId.value);
      newComment.value = {
        content: ''
      };
      showCommentInputPopup.value = false;
      // 重新获取当前帖子的评论列表

      uni.showToast({
        title: '评论成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  // 点赞状态
  const postLikes = reactive({});

  // 切换点赞状态
  const toggleLike = async (postId) => {
    if (!userStore.isLoggedIn) {
      uni.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1000
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/user'
        })
      }, 1000)
      return;
    }
    try {
      // 发送请求切换点赞状态
      const response = await http.post('/api/likes/toggle', {
        postId: postId,
        userId: userStore.userInfo.id
      });
      // 更新点赞状态
      const isLiked = response.data.data;
      post.isLiked = isLiked;
      post.likesCount = await getLikeCount(postId);
      const message = isLiked ? '点赞成功' : '取消点赞';
      uni.showToast({
        title: message,
        icon: isLiked ? 'success' : 'error'
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // 获取点赞数量
  const getLikeCount = async (postId) => {
    try {
      const response = await http.get('/api/likes/count', {
        params: {
          postId: postId
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching like count:', error);
      return 0;
    }
  };

  // 获取子评论的用户名
  const getSubCommentName = async (parentCommentId) => {
    try {
      const response = await http.get('/api/comments/withSubComments', {
        params: {
          Id: parentCommentId
        },
      });
      return response.data.username;
    } catch (error) {
      console.error('Error fetching sub-comment username:', error);
      return '';
    }
  };
  const activePostIdForSubComment = ref(null);
  // 显示子评论输入框
  const showSubCommentInput = (parentCommentId, postId) => {
    if (!userStore.isLoggedIn) {
      uni.showToast({
        title: '评论请先登录',
        icon: 'error',
        duration: 1000
      });
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/user/user'
        })
      }, 1000)
      return;
    }
    activeParentCommentId.value = parentCommentId;
    activePostId.value = postId;
    activePostIdForSubComment.value = postId; // 保存当前帖子的postId
    showSubCommentInputPopup.value = true;
  };

  // 提交子评论
  const submitSubComment = async () => {
    try {
      await http.post('/api/comments', {
        content: newSubComment.value.content,
        postId: activePostIdForSubComment.value,
        userId: userStore.userInfo.id,
        parentId: activeParentCommentId.value
      });
      // 重新获取当前帖子的评论列表，包括子评论
      post.comments = await fetchComments(activePostIdForSubComment.value);
      // 清空子评论输入框
      newSubComment.value = {
        content: ''
      };
      showSubCommentInputPopup.value = false;

      uni.showToast({
        title: '评论成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error submitting sub-comment:', error);
    }

  };

  // 在组件加载时获取帖子详情
  onLoad(async (option) => {
    const postId = option.id;
    await fetchPostDetail(postId);

  });
</script>
<style lang="scss" scoped>
  .popup-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow: hidden;
  }

  /* 表单 */
  .popup-form-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: black;
    margin-bottom: 20px;
  }

  /* 输入框样式 */
  :deep(.u-input),
  textarea {
    display: block;
    width: 100%;
    //  padding: 8px;
    border: 1px solid #eee;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
  }

  .postTextArea {
    line-height: 1.2 !important;
  }

  textarea {
    padding: 8px;
  }

  .u-input {
    padding: 8px;
  }

  .comment-form textarea {
    width: 300rpx;
  }





  .comment-item {
    border: 1px solid #eee;
    padding: 5px;
    margin-top: 10px;
  }





  .post-author {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .post-username {
      margin-left: 10px;
    }
  }

  .post-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .post-content {
    margin-bottom: 10px;
  }

  .post-actions {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .action-item {
      margin-right: 20px;
      cursor: pointer;
    }
  }

  .post-comments {
    margin-top: 10px;


    .comment-item {
      border: 2px solid #eef;
      padding: 5px; // 增加内边距
      display: flex;
      margin-left: 13px;
      margin-right: 13px;
      margin-bottom: 10px;




      .comment-author {
        display: flex;
        align-items: center;
        margin-right: 10px; // 为作者和用户名之间添加间距

        .comment-username {
          margin-left: 10px;

          width: 140px;

        }
      }

      .comment-content {
        flex-grow: 1; // 让评论内容占据剩余空间
        margin-left: 10px;
        max-width: 100%; // 限制最大宽度为100%
        width: 30%;
        flex-wrap: wrap; // 允许子元素换行
      }

      .subButton {
        align-self: center; // 在交叉轴上居中对齐
        text-align: center;
      }
    }
  }
</style>