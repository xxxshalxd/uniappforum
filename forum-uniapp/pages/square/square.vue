<template>
  <view class="forum-square">
    <u-navbar title="广场" :is-back="false" :hideBack="true" hide-back-button></u-navbar>

    <u-search v-model="keyword" placeholder="请输入关键字来搜索帖子" :clearabled="true" :show-action="true" :animation="false"
      @custom="onSearch"></u-search>

    <!-- 帖子列表 -->
    <uni-card v-for="(post, index) in posts" :key="post.id" class="post-item">
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
      <view class="post-content" @click="goToPosts(post.id)">
        {{ post.content }}
        <view class="post-image" v-if="post.imagePath" style="padding-bottom: 20rpx; margin-top: 20rpx;">

          <!--        <text> {{post.imagePath}}</text> -->

          <image :src="post.imagePath" mode="scaleToFill" style="width: 450rpx; height: 350rpx;">
          </image>

        </view>
      </view>




      <!-- 帖子操作 -->
      <view class="post-actions">
        <view class="action-item" @click="toggleLike(post.id)">
          <u-icon name="thumb-up" :color="post.isLiked ? '#5677fc' : '#9a9a9a'"></u-icon>
          {{ post.likesCount ? post.likesCount : 0  }}
        </view>
        <view class="action-item" @click="showComments(post.id)">
          <u-icon name="chat"></u-icon>
          {{ post.commentsCount }}
        </view>
      </view>
      <!-- 评论列表 -->
      <view class="post-comments" v-if="post.showComments">
        <view class="comment-item" v-for="comment in post.comments" :key="comment.id">
          <view class="comment-author">
            <u-image src="../../static/avatar/user.png" shape="circle" width="40rpx" height="40rpx"></u-image>
            <view class="comment-username">
              <!-- 如果是多级评论，text文本则显示用户回复谁（评论的发出者） -->
              <text> {{ comment.user.username  }}</text>

              <text v-if="comment.replyToUsername"> 回复 {{ comment.replyToUsername }}
              </text>
            </view>
          </view>
          <view class="comment-content">
            {{ comment.content }}
          </view>
          <!-- 二级评论按钮 -->
          <view class="subButton"> <u-button size="mini" shape="circle" type="success" plain
              @click="showSubCommentInput(comment.id,post.id)">回复</u-button>
          </view>

          <!-- 显示子评论 -->
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


        <u-button @click="showCommentInput(post.id)" type="primary" shape="circle" style="margin: 20rpx;">发评论</u-button>
      </view>
    </uni-card>
    <!-- 发帖按钮 -->
    <view @click="showPostForm" class="fixed-post-button">
      <u-icon name="plus"></u-icon>发帖
    </view>
  </view>
  <!-- 发帖表单 -->
  <u-popup v-model="showPostFormPopup" position="center" mode="center" width="400px" border-radius="25">
    <view class="popup-content">
      <u-form class="post-form">
        <view class="popup-form-title">发帖</view>
        <u-form-item label="标题"> <u-input v-model="newPost.title" :border="true" placeholder="帖子标题" /></u-form-item>
        <u-form-item label="内容"> <textarea v-model="newPost.content" placeholder="帖子内容"
            class="postTextArea" /></u-form-item>
        <u-form-item label="图片">
          <u-upload :action="uploadUrl" @on-success="handleImageSuccess" @on-error="handleImageError" name="file"
            multiple></u-upload>
        </u-form-item>

        <u-button @click="submitPost"><u-icon name="checkbox-mark"></u-icon>
          &nbsp;发布帖子</u-button>

      </u-form>
    </view>
  </u-popup>
  <!-- 评论输入框 -->
  <u-popup v-model="showCommentInputPopup" position="center" mode="center" width="400px" border-radius="25">
    <view class="popup-content">
      <u-form class="comment-form">
        <view class="popup-form-title">发表评论</view>

        <u-form-item label="内容">
          <textarea v-model="newComment.content" placeholder="评论内容" style="margin-top: 50rpx;" /></u-form-item>


        <u-button @click="submitComment">
          <u-icon name="checkbox-mark"></u-icon>
          &nbsp; 发表评论</u-button>
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
        <u-button @click="submitsubcomment">
          <u-icon name="checkbox-mark"></u-icon>
          &nbsp;发表回复
        </u-button>
      </u-form>
    </view>
  </u-popup>


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
  } from '@/stores/user.js'; // 确保路径正确

  const uploadUrl = 'http://localhost:10086/api/posts/upload';
  // 图片上传成功后的处理
  const handleImageSuccess = (response) => {
    console.log("Response:", response); // 打印完整的响应对象
    newPost.value.imagePath = response.filePath;
    console.log("newPost.value.image================" + newPost.value.imagePath)
  }

  // 图片上传失败后的处理
  const handleImageError = () => {
    uni.showToast({
      title: '图片上传失败',
      icon: 'none',
    });
  };


  // 存储多级评论的用户名
  const subCommentName = ref('')
  // 获取多级评论的用户名
  const getSubCommentName = async (parentCommentId) => {
    const response = await http.get(`/api/comments/withSubComments`, {
      params: {
        Id: parentCommentId
      },
    });
    // console.log("id ssssss" + parentCommentId)
    console.log("username is ===>" + response.data.username)
    return response.data.username

  }

  // 帖子列表
  const posts = ref([]);

  // 用户信息存储
  const userStore = useUserStore();

  // 发帖表单显示
  const showPostFormPopup = ref(false);

  // 新帖子数据
  const newPost = ref({
    title: '',
    content: '',
    imagePath: '',
  });

  // 评论输入框显示
  const showCommentInputPopup = ref(false);

  // 新评论数据
  const newComment = ref({
    content: ''
  });

  // 当前激活的帖子ID
  const activePostId = ref(null);

  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      const response = await http.get('/api/posts');
      console.log("原始帖子数据:", response.data); // 打印原始数据
      const postsData = response.data.map(post => ({
        ...post,
        user: null, // 初始化为 null
        comments: [],
        showComments: false,
        imagePath: post.imagePath || '' // 如果没有 imagePath，设置为空字符串
      }));
      console.log("映射后的帖子数据:", postsData); // 应该包含 imagePath

      // 获取用户信息
      const userPromises = postsData.map(post => getUserById(post.userId));
      const userResults = await Promise.all(userPromises);

      // 获取评论
      const commentsPromises = postsData.map(post => fetchComments(post.id));
      const commentsResults = await Promise.all(commentsPromises);

      // 更新帖子数据
      posts.value = postsData.map((post, index) => ({
        ...post,
        user: userResults[index],
        comments: commentsResults[index],
        imagePath: post.imagePath || '', // 确保 imagePath 存在

      }));
      // 打印更新后的帖子数据
      console.log("更新后的帖子数据:", posts.value); // 应该包含 imagePath

    } catch (error) {
      console.error('Error fetching posts:', error);
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

  // 显示发帖表单
  const showPostForm = () => {
    if (!userStore.isLoggedIn) {
      uni.showToast({
        title: '发帖请先登录',
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

    showPostFormPopup.value = true;
  };

  // 提交帖子
  const submitPost = async () => {
    console.log("submit post path===>" + newPost.value.imagePath)
    try {
      const response = await http.post('/api/posts', {
        ...newPost.value,
        // ImagePath: newPost.value.image,
        userId: userStore.userInfo.id // 使用 Pinia 中的用户 ID

      }, {
        headers: {
          'Content-Type': 'application/json'
        }

      });
      const newPostData = response.data;

      // 立即更新帖子列表状态
      posts.value.unshift(newPostData);

      // 更新新帖子的点赞数和评论列表
      // const likesCount = await getLikeCount(newPostData.id);
      // newPostData.likesCount = likesCount;
      // newPostData.comments = await fetchComments(newPostData.id);

      showPostFormPopup.value = false;
      uni.showToast({
        title: '发帖成功',
        icon: 'success'
      });
      // 更新帖子状态
      posts.value = [...posts.value];
      //  //posts.value = [...posts.value];这行代码的作用是创建posts.value数组的一个浅拷贝，并将其赋值回posts.value。这通常用于确保数组是响应式的，特别是在Vue 3中，如果你直接修改数组的索引，Vue可能无法检测到变化。通过这种方式，你可以确保Vue能够追踪到数组的变化。
      await fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
      uni.showToast({
        title: '发帖失败',
        icon: 'error'
      });
    }
  };

  // 显示评论
  const showComments = (postId) => {
    const index = posts.value.findIndex(post => post.id === postId);
    if (index !== -1) {
      posts.value[index].showComments = !posts.value[index].showComments;

    }
  };

  // 显示评论输入框
  const showCommentInput = (postId) => {
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
      const comments = await fetchComments(activePostId.value);
      const index = posts.value.findIndex(post => post.id === activePostId.value);
      if (index !== -1) {
        posts.value[index].comments = comments;
      }
      newComment.value = {
        content: ''
      };
      showCommentInputPopup.value = false;

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
      const index = posts.value.findIndex(post => post.id === postId);
      if (index !== -1) {
        posts.value[index].isLiked = isLiked;
        posts.value[index].likesCount = await getLikeCount(postId);
      }
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
      const response = await http.get(`/api/likes/count`, {
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

  // 在组件加载时获取帖子列表
  onMounted(async () => {
    await fetchPosts();
    posts.value.forEach(async post => {
      const likesCount = await getLikeCount(post.id);
      post.likesCount = likesCount;
      post.comments = await fetchComments(post.id); // 确保这里调用 fetchComments 获取评论数据
    });

  });
  const keyword = ref('')
  const onSearch = async (val) => {
    try {
      const response = await http.get('/api/posts/Search', {
        params: {
          query: val
        }
      });
      posts.value = response.data
      console.log("data is " + response.data)
      const postsData = response.data.map(post => ({
        ...post,


      }));


      // 获取用户信息
      const userPromises = postsData.map(post => getUserById(post.userId));
      const userResults = await Promise.all(userPromises);

      // 获取评论
      const commentsPromises = postsData.map(post => fetchComments(post.id));
      const commentsResults = await Promise.all(commentsPromises);

      // 更新帖子数据
      posts.value = postsData.map((post, index) => ({
        ...post,
        user: userResults[index],
        comments: commentsResults[index]
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }


  const activeParentCommentId = ref(null);
  const showSubCommentInputPopup = ref(false);
  const newSubComment = ref({
    content: ''
  });
  const activePostIdForSubComment = ref(null);
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
    activePostIdForSubComment.value = postId; // 保存当前帖子的postId
    showSubCommentInputPopup.value = true;


  };
  const submitsubcomment = async () => {

    try {
      await http.post('/api/comments', {
        content: newSubComment.value.content,
        postId: activePostIdForSubComment.value,
        userId: userStore.userInfo.id,
        parentId: activeParentCommentId.value
      });
      const comments = await fetchComments(activePostIdForSubComment.value);
      const index = posts.value.findIndex(post => post.id === activePostIdForSubComment.value);
      if (index !== -1) {
        // 更新父评论的子评论列表
        const parentCommentIndex = comments.findIndex(comment => comment.id === activeParentCommentId
          .value);
        if (parentCommentIndex !== -1) {
          comments[parentCommentIndex].subComments.push({
            ...newSubComment,
            user: {
              username: userStore.userInfo.username
            }
          });
        }
        posts.value[index].comments = comments;
      }
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

  const goToPosts = (id) => {
    console.log("Posts id===>" + id)
    uni.navigateTo({
      url: `/pages/postsDetail/postsDetail?id=${id}`
    });
  };
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

  .forum-square {
    padding: 20px;
  }

  .post-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 20px;
    is-shadow: true;
    shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08)
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
      padding: 10px; // 增加内边距
      display: flex;

      margin-bottom: 10px;




      .comment-author {
        display: flex;
        align-items: center;
        margin-right: 10px; // 为作者和用户名之间添加间距

        .comment-username {
          margin-left: 10px;

          width: 120px;

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

  .fixed-post-button {
    position: fixed;
    bottom: 100px;
    right: 20px;
    padding: 10px 10px;
    background-color: #007bff;
    color: white;
    border-radius: 50%;

    font-size: 16px;
    cursor: pointer;
    z-index: 9999;
    height: 10%;
    padding-top: 30px;
  }

  .fixed-post-button:hover {
    background-color: #0056b3;
  }
</style>