<template>
  <view class="chat">
    <!-- 顶部标题 -->
    <u-navbar class="topTabbar" title="星火大模型" :is-back="true" style="height: 103rpx;"></u-navbar>

    <scroll-view :style="{height: `${windowHeight-inputHeight - 180}rpx`}" id="scrollview" scroll-y="true"
      :scroll-top="scrollTop" class="scroll-view">
      <!-- 聊天主体 -->
      <view id="msglistview" class="chat-body">
        <!-- 聊天记录 -->
        <view v-for="(chatConten, index) in finalChat" :key="chatConten.id">
          <view class="item self" v-if="chatConten.user">
            <view class="content right">{{ chatConten.user }}</view>
            <image class="avatar" src="/static/avatar/1_user4.png"></image>
          </view>
          <view class="item Ai" v-if="chatConten.ai">
            <image class="avatar" src="/static/avatar/AI.png"></image>
            <view class="content left">{{ chatConten.ai }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 底部消息发送栏 -->
    <view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
      <view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
        <view class="uni-textarea">
          <textarea v-model="userInput" maxlength="300" @confirm="start" placeholder="快来聊天吧~" :show-confirm-bar="false"
            confirm-type="send" :adjust-position="false" @linechange="sendHeight" @focus="focus" @blur="blur"
            auto-height></textarea>
        </view>
        <button @click="start" class="send-btn" :loading="loading">{{ loading ? 'AI正在思考' : '发送' }}</button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    onMounted,
    onUnmounted,
    reactive,
    computed
  } from 'vue';
  import {
    getCurrentInstance
  } from 'vue'
  import * as base64 from "base-64"
  // import CryptoJS from '../../node_modules/crypto-js';
  import CryptoJS from 'crypto-js';

  // 响应式数据
  const keyboardHeight = ref(0);
  const bottomHeight = ref(0);
  const scrollTop = ref(0);
  const userInput = ref('');
  const finalChat = ref([]);
  const loading = ref(false);
  const socketTask = ref(null);
  const appId = '7f67a64f';
  const apiKey = 'e840b9a0c7e3774f3615d34766180a39';
  const apiSecret = 'N2I0YTgzMWY4Mzg2MzQ5NjMxN2JkNWJm';
  const chatHistory = ref([]);
  const totalRes = ref('');
  const aiContentRequest = ref('');

  // 计算属性
  const windowHeight = computed(() => rpxTopx(wx.getWindowInfo().windowHeight));
  const inputHeight = computed(() => bottomHeight.value + keyboardHeight.value);

  onMounted(() => {
    uni.onKeyboardHeightChange(res => {
      keyboardHeight.value = rpxTopx(res.height);
      if (keyboardHeight.value < 0) keyboardHeight.value = 0;
    });
  });

  onUnmounted(() => {
    // uni.offKeyboardHeightChange()
  });

  // 方法
  // const goback = () => {
  //   // wx.navigateBack()
  //   uni.switchTab({
  //     url: "/pages/user/user"
  //   });
  // };

  const focus = () => {
    scrollToBottom();
  };

  const blur = () => {
    scrollToBottom();
  };

  const rpxTopx = (px) => {
    let deviceWidth = wx.getWindowInfo().windowWidth;
    let rpx = (750 / deviceWidth) * Number(px);
    return Math.floor(rpx);
  };

  const sendHeight = () => {
    setTimeout(() => {
      const instance = getCurrentInstance(); // 获取组件实例
      let query = uni.createSelectorQuery().in(instance);
      query.select('.send-msg').boundingClientRect();
      query.exec(res => {
        bottomHeight.value = rpxTopx(res[0].height);
      });
    }, 10);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const instance = getCurrentInstance(); // 获取组件实例
      let query = uni.createSelectorQuery().in(instance);
      query.select('#scrollview').boundingClientRect();
      query.select('#msglistview').boundingClientRect();
      query.exec((res) => {
        if (res[1].height > res[0].height) {
          scrollTop.value = rpxTopx(res[1].height - res[0].height);
        }
      });
    }, 15);
  };

  const start = () => {
    loading.value = true;
    totalRes.value = '';
    aiContentRequest.value = '';
    connectWebSocket();
  };


  const connectWebSocket = () => {
    const url = 'wss://spark-api.xf-yun.com/v1.1/chat';
    const host = "spark-api.xf-yun.com";
    const date = new Date().toGMTString();
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin =
      `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = base64.encode(authorizationOrigin);
    const finalUrl = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    console.log(finalUrl);
    socketTask.value = wx.connectSocket({
      url: finalUrl
    });
    socketTask.value.onOpen(() => {
      console.log('WebSocket连接已打开');
      webSocketSend();
    });
    socketTask.value.onMessage((e) => {
      result(e.data);
    });
    socketTask.value.onError((e) => {
      loading.value = false;
      alert('WebSocket报错，请f12查看详情');
      console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`);
    });
    socketTask.value.onClose((e) => {
      console.log(e);
    });
  };

  const webSocketSend = () => {
    if (!socketTask.value) {
      console.error('WebSocket任务对象未定义');
      return;
    }
    let messageContent = [];
    chatHistory.value.forEach((chat) => {
      messageContent.push({
        "role": chat.role,
        "content": chat.content
      });
    });
    messageContent.push({
      "role": "user",
      "content": userInput.value
    });
    const params = {
      header: {
        app_id: appId,
        uid: 'shado',
      },
      parameter: {
        chat: {
          domain: 'lite',
          temperature: 0.5,
          max_tokens: 1024,
        },
      },
      payload: {
        message: {
          text: messageContent
        },
      },
    };
    console.log(JSON.stringify(params));
    socketTask.value.send({
      data: JSON.stringify(params),
      success() {
        console.log('消息发送成功');
      }
    });
  };

  const result = (resultData) => {
    let jsonData = JSON.parse(resultData);
    totalRes.value += resultData;
    if (jsonData.header.status !== 2) {
      requestHandle(jsonData);
    } else {
      let contentSomething = {
        ai: aiContentRequest.value,
        user: userInput.value
      };
      finalChat.value.push(contentSomething);
      chatHistory.value.push({
        role: 'user',
        content: contentSomething.user
      }); // Add user's input to chat history
      chatHistory.value.push({
        role: 'assistant',
        content: contentSomething.ai
      }); // Add assistant's response to chat history
      userInput.value = '';
      loading.value = false;
    }
    if (jsonData.header.code !== 0) {
      alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`);
      console.error(`${jsonData.header.code}:${jsonData.header.message}`);
      return;
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      socketTask.value.close();
      loading.value = false;
    }
  };

  const requestHandle = (requestData) => {
    aiContentRequest.value += requestData.payload.choices.text[0].content;
  };
</script>

<style lang="scss" scoped>
  $chatContentbgc: #C2DCFF;
  $sendBtnbgc: #4F7DF5;

  view,
  button,
  text,
  input,
  textarea {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 聊天消息 */
  .chat {
    margin-top: 80rpx;

    .topTabbar {
      width: 100%;
      // height: 90rpx;
      line-height: 90rpx;
      display: flex;
      // margin-top: 80rpx;
      justify-content: space-between;

      .icon {
        margin-left: 20rpx;
      }



      .text {
        margin: auto;
        font-size: 16px;
        font-weight: 700;
      }
    }

    .scroll-view {
      ::-webkit-scrollbar {
        display: none;
        width: 0 !important;
        height: 0 !important;
        -webkit-appearance: none;
        background: transparent;
        color: transparent;
      }

      background-color: #F6F6F6;

      .chat-body {
        display: flex;
        flex-direction: column;
        padding-top: 23rpx;

        .self {
          justify-content: flex-end;
        }

        .item {
          display: flex;
          padding: 23rpx 30rpx;

          .right {
            background-color: $chatContentbgc;
          }

          .left {
            background-color: #FFFFFF;
          }

          .right::after {
            position: absolute;
            display: inline-block;
            content: '';
            width: 0;
            height: 0;
            left: 100%;
            top: 10px;
            border: 12rpx solid transparent;
            border-left: 12rpx solid $chatContentbgc;
          }

          .left::after {
            position: absolute;
            display: inline-block;
            content: '';
            width: 0;
            height: 0;
            top: 10px;
            right: 100%;
            border: 12rpx solid transparent;
            border-right: 12rpx solid #FFFFFF;
          }

          .content {
            position: relative;
            max-width: 486rpx;
            border-radius: 8rpx;
            word-wrap: break-word;
            padding: 24rpx 24rpx;
            margin: 0 24rpx;
            border-radius: 5px;
            font-size: 32rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 42rpx;
          }

          .avatar {
            display: flex;
            justify-content: center;
            width: 78rpx;
            height: 78rpx;
            background: $sendBtnbgc;
            border-radius: 50rpx;
            overflow: hidden;

            image {
              align-self: center;
            }
          }
        }
      }
    }

    /* 底部聊天发送栏 */
    .chat-bottom {
      width: 100%;
      height: 100rpx;
      background: #F4F5F7;
      transition: all 0.1s ease;

      .send-msg {
        display: flex;
        align-items: flex-end;
        padding: 16rpx 30rpx;
        width: 100%;
        min-height: 177rpx;
        position: fixed;
        bottom: 0;
        background: #fff;
        transition: all 0.1s ease;
      }

      .uni-textarea {
        padding-bottom: 70rpx;

        textarea {
          width: 537rpx;
          min-height: 75rpx;
          max-height: 500rpx;
          background: #f1f1f1;
          border-radius: 40rpx;
          font-size: 32rpx;
          font-family: PingFang SC;
          color: #333333;
          line-height: 74rpx;
          padding: 5rpx 8rpx;
          text-indent: 30rpx;
        }
      }

      .send-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 76rpx;
        margin-left: 25rpx;
        width: 120rpx;
        height: 75rpx;
        background: #ed5a65;
        border-radius: 50rpx;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 28rpx;
      }
    }
  }
</style>