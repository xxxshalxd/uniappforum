"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  _easycom_u_navbar2();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
if (!Math) {
  _easycom_u_navbar();
}
const appId = "7f67a64f";
const apiKey = "e840b9a0c7e3774f3615d34766180a39";
const apiSecret = "N2I0YTgzMWY4Mzg2MzQ5NjMxN2JkNWJm";
const _sfc_main = {
  __name: "spark",
  setup(__props) {
    const keyboardHeight = common_vendor.ref(0);
    const bottomHeight = common_vendor.ref(0);
    const scrollTop = common_vendor.ref(0);
    const userInput = common_vendor.ref("");
    const finalChat = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const socketTask = common_vendor.ref(null);
    const chatHistory = common_vendor.ref([]);
    const totalRes = common_vendor.ref("");
    const aiContentRequest = common_vendor.ref("");
    const windowHeight = common_vendor.computed(() => rpxTopx(common_vendor.wx$1.getWindowInfo().windowHeight));
    const inputHeight = common_vendor.computed(() => bottomHeight.value + keyboardHeight.value);
    common_vendor.onMounted(() => {
      common_vendor.index.onKeyboardHeightChange((res) => {
        keyboardHeight.value = rpxTopx(res.height);
        if (keyboardHeight.value < 0)
          keyboardHeight.value = 0;
      });
    });
    common_vendor.onUnmounted(() => {
    });
    const focus = () => {
      scrollToBottom();
    };
    const blur = () => {
      scrollToBottom();
    };
    const rpxTopx = (px) => {
      let deviceWidth = common_vendor.wx$1.getWindowInfo().windowWidth;
      let rpx = 750 / deviceWidth * Number(px);
      return Math.floor(rpx);
    };
    const sendHeight = () => {
      setTimeout(() => {
        const instance = common_vendor.getCurrentInstance();
        let query = common_vendor.index.createSelectorQuery().in(instance);
        query.select(".send-msg").boundingClientRect();
        query.exec((res) => {
          bottomHeight.value = rpxTopx(res[0].height);
        });
      }, 10);
    };
    const scrollToBottom = () => {
      setTimeout(() => {
        const instance = common_vendor.getCurrentInstance();
        let query = common_vendor.index.createSelectorQuery().in(instance);
        query.select("#scrollview").boundingClientRect();
        query.select("#msglistview").boundingClientRect();
        query.exec((res) => {
          if (res[1].height > res[0].height) {
            scrollTop.value = rpxTopx(res[1].height - res[0].height);
          }
        });
      }, 15);
    };
    const start = () => {
      loading.value = true;
      totalRes.value = "";
      aiContentRequest.value = "";
      connectWebSocket();
    };
    const connectWebSocket = () => {
      const url = "wss://spark-api.xf-yun.com/v1.1/chat";
      const host = "spark-api.xf-yun.com";
      const date = (/* @__PURE__ */ new Date()).toGMTString();
      const algorithm = "hmac-sha256";
      const headers = "host date request-line";
      const signatureOrigin = `host: ${host}
date: ${date}
GET /v1.1/chat HTTP/1.1`;
      const signatureSha = common_vendor.CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
      const signature = common_vendor.CryptoJS.enc.Base64.stringify(signatureSha);
      const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
      const authorization = common_vendor.base64Exports.encode(authorizationOrigin);
      const finalUrl = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
      console.log(finalUrl);
      socketTask.value = common_vendor.wx$1.connectSocket({
        url: finalUrl
      });
      socketTask.value.onOpen(() => {
        console.log("WebSocket连接已打开");
        webSocketSend();
      });
      socketTask.value.onMessage((e) => {
        result(e.data);
      });
      socketTask.value.onError((e) => {
        loading.value = false;
        alert("WebSocket报错，请f12查看详情");
        console.error(`详情查看：${encodeURI(url.replace("wss:", "https:"))}`);
      });
      socketTask.value.onClose((e) => {
        console.log(e);
      });
    };
    const webSocketSend = () => {
      if (!socketTask.value) {
        console.error("WebSocket任务对象未定义");
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
          uid: "shado"
        },
        parameter: {
          chat: {
            domain: "lite",
            temperature: 0.5,
            max_tokens: 1024
          }
        },
        payload: {
          message: {
            text: messageContent
          }
        }
      };
      console.log(JSON.stringify(params));
      socketTask.value.send({
        data: JSON.stringify(params),
        success() {
          console.log("消息发送成功");
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
          role: "user",
          content: contentSomething.user
        });
        chatHistory.value.push({
          role: "assistant",
          content: contentSomething.ai
        });
        userInput.value = "";
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "星火大模型",
          ["is-back"]: true
        }),
        b: common_vendor.f(finalChat.value, (chatConten, index, i0) => {
          return common_vendor.e({
            a: chatConten.user
          }, chatConten.user ? {
            b: common_vendor.t(chatConten.user),
            c: common_assets._imports_0
          } : {}, {
            d: chatConten.ai
          }, chatConten.ai ? {
            e: common_assets._imports_1$1,
            f: common_vendor.t(chatConten.ai)
          } : {}, {
            g: chatConten.id
          });
        }),
        c: `${windowHeight.value - inputHeight.value - 180}rpx`,
        d: scrollTop.value,
        e: common_vendor.o(start),
        f: common_vendor.o(sendHeight),
        g: common_vendor.o(focus),
        h: common_vendor.o(blur),
        i: userInput.value,
        j: common_vendor.o(($event) => userInput.value = $event.detail.value),
        k: common_vendor.t(loading.value ? "AI正在思考" : "发送"),
        l: common_vendor.o(start),
        m: loading.value,
        n: `${keyboardHeight.value - 60}rpx`,
        o: `${inputHeight.value}rpx`
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-17a6842a"]]);
wx.createPage(MiniProgramPage);
