"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_http = require("../../utils/http.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_cell_item2 = common_vendor.resolveComponent("u-cell-item");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_modal2 = common_vendor.resolveComponent("u-modal");
  (_easycom_u_navbar2 + _easycom_u_input2 + _easycom_u_button2 + _easycom_u_image2 + _easycom_u_cell_item2 + _easycom_u_tag2 + _easycom_u_cell_group2 + _easycom_u_modal2)();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_u_input = () => "../../uni_modules/vk-uview-ui/components/u-input/u-input.js";
const _easycom_u_button = () => "../../uni_modules/vk-uview-ui/components/u-button/u-button.js";
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_cell_item = () => "../../uni_modules/vk-uview-ui/components/u-cell-item/u-cell-item.js";
const _easycom_u_tag = () => "../../uni_modules/vk-uview-ui/components/u-tag/u-tag.js";
const _easycom_u_cell_group = () => "../../uni_modules/vk-uview-ui/components/u-cell-group/u-cell-group.js";
const _easycom_u_modal = () => "../../uni_modules/vk-uview-ui/components/u-modal/u-modal.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_input + _easycom_u_button + _easycom_u_image + _easycom_u_cell_item + _easycom_u_tag + _easycom_u_cell_group + _easycom_u_modal)();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const isRegister = common_vendor.ref(false);
    const isLoggedIn = common_vendor.ref(false);
    const switchToAi = () => {
      common_vendor.index.navigateTo({
        url: "../spark/spark"
      });
    };
    const loginForm = common_vendor.ref({
      username: "",
      password: ""
    });
    const registerForm = common_vendor.ref({
      username: "",
      password: "",
      confirmPassword: ""
    });
    const userPosts = common_vendor.ref([]);
    const loginError = common_vendor.ref("");
    const showModal = common_vendor.ref(false);
    const modalTitle = common_vendor.ref("");
    const modalContent = common_vendor.ref("");
    const switchToLogin = () => {
      isRegister.value = false;
      isLoggedIn.value = false;
      loginError.value = "";
    };
    const switchToRegister = () => {
      isRegister.value = true;
    };
    const handleLogin = async () => {
      try {
        const response = await utils_http.http.post("/api/users/login", loginForm.value);
        userStore.login(response.data);
        isLoggedIn.value = true;
        fetchUserPosts();
        fetchLikedPosts();
        showModal.value = true;
        modalTitle.value = "登录成功";
        modalContent.value = "欢迎回来！";
      } catch (error) {
        console.error("Login failed:", error);
        showModal.value = true;
        modalTitle.value = "登录失败";
        modalContent.value = error.response.data || "登录失败，请重试";
      }
    };
    const handleRegister = async () => {
      if (!registerForm.value.username || !registerForm.value.password) {
        showModal.value = true;
        modalTitle.value = "注册失败";
        modalContent.value = "用户名和密码不能为空";
        return;
      }
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        showModal.value = true;
        modalTitle.value = "注册失败";
        modalContent.value = "密码和确认密码不匹配";
        return;
      }
      try {
        const response = await utils_http.http.post("/api/users/register", registerForm.value);
        userStore.login(response.data);
        switchToLogin();
        showModal.value = true;
        modalTitle.value = "注册成功";
        modalContent.value = "注册成功，请登录";
      } catch (error) {
        console.error("Register failed:", error);
        showModal.value = true;
        modalTitle.value = "注册失败";
        modalContent.value = error.response.data || "注册失败，请重试";
      }
    };
    const fetchUserPosts = async () => {
      const userId = userStore.userInfo.id;
      if (userId) {
        try {
          const response = await utils_http.http.get(`/api/posts/user/${userId}`);
          userPosts.value = response.data;
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      } else {
        console.log("No user is currently logged in.");
      }
    };
    const handleModalConfirm = () => {
      showModal.value = false;
    };
    const logout = async () => {
      userStore.logout();
      isLoggedIn.value = false;
    };
    const arrowChange = common_vendor.ref("right");
    const likearrowChange = common_vendor.ref("right");
    const fetchLikedPosts = async () => {
      const userId = userStore.userInfo.id;
      if (userId) {
        try {
          const response = await utils_http.http.get(`/api/likes/posts`, {
            params: {
              userId
            }
          });
          likedPosts.value = response.data.data;
          console.log("Liked posts:", response.data);
        } catch (error) {
          console.error("Error fetching liked posts:", error);
        }
      } else {
        console.log("No user is currently logged in.");
      }
    };
    const likedPosts = common_vendor.ref([]);
    const showLikedPosts = common_vendor.ref(false);
    const showPosts = common_vendor.ref(false);
    const togglePosts = () => {
      showPosts.value = !showPosts.value;
      if (arrowChange.value == "down") {
        arrowChange.value = "right";
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
    common_vendor.onShow(() => {
      fetchUserPosts();
      fetchLikedPosts();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "登录/注册",
          ["is-back"]: false
        }),
        b: !isRegister.value && !isLoggedIn.value
      }, !isRegister.value && !isLoggedIn.value ? {
        c: common_vendor.o(($event) => loginForm.value.username = $event),
        d: common_vendor.p({
          placeholder: "用户名",
          border: true,
          modelValue: loginForm.value.username
        }),
        e: common_vendor.o(($event) => loginForm.value.password = $event),
        f: common_vendor.p({
          type: "password",
          placeholder: "密码",
          border: true,
          modelValue: loginForm.value.password
        }),
        g: common_vendor.o(switchToRegister),
        h: common_vendor.o(handleLogin),
        i: common_vendor.p({
          type: "success",
          plain: true
        })
      } : {}, {
        j: isRegister.value
      }, isRegister.value ? {
        k: common_vendor.o(($event) => registerForm.value.username = $event),
        l: common_vendor.p({
          placeholder: "用户名",
          mode: "border",
          border: true,
          modelValue: registerForm.value.username
        }),
        m: common_vendor.o(($event) => registerForm.value.password = $event),
        n: common_vendor.p({
          type: "password",
          placeholder: "密码",
          mode: "border",
          border: true,
          modelValue: registerForm.value.password
        }),
        o: common_vendor.o(($event) => registerForm.value.confirmPassword = $event),
        p: common_vendor.p({
          type: "password",
          placeholder: "确认密码",
          mode: "border",
          border: true,
          modelValue: registerForm.value.confirmPassword
        }),
        q: common_vendor.o(handleRegister),
        r: common_vendor.p({
          type: "primary"
        }),
        s: common_vendor.o(switchToLogin),
        t: common_vendor.p({
          type: "success"
        })
      } : {}, {
        v: isLoggedIn.value
      }, isLoggedIn.value ? {
        w: common_vendor.p({
          src: common_assets._imports_0,
          shape: "circle",
          width: "40rpx",
          height: "40rpx"
        }),
        x: common_vendor.t(common_vendor.unref(userStore).userInfo.username),
        y: common_vendor.o(logout),
        z: common_vendor.p({
          type: "warning",
          shape: "circle"
        }),
        A: common_vendor.o(switchToAi),
        B: common_vendor.p({
          type: "error",
          shape: "circle"
        }),
        C: common_vendor.o(togglePosts),
        D: common_vendor.p({
          title: "个人发帖记录",
          arrow: "true",
          ["arrow-direction"]: arrowChange.value,
          icon: "list",
          value: userPosts.value.length
        }),
        E: common_vendor.f(userPosts.value, (post, k0, i0) => {
          return {
            a: "0f7520f0-14-" + i0 + ",0f7520f0-12",
            b: common_vendor.t(post.title),
            c: "0f7520f0-15-" + i0 + ",0f7520f0-12",
            d: common_vendor.t(post.content),
            e: post.imagePath,
            f: post.id
          };
        }),
        F: common_vendor.p({
          text: "标题"
        }),
        G: common_vendor.p({
          text: "内容",
          type: "success"
        }),
        H: showPosts.value,
        I: common_vendor.o(toggleLikedPosts),
        J: common_vendor.p({
          title: "点赞过的帖子",
          arrow: "true",
          icon: "thumb-up",
          value: likedPosts.value.length,
          ["arrow-direction"]: likearrowChange.value
        }),
        K: common_vendor.f(likedPosts.value, (post, k0, i0) => {
          return {
            a: "0f7520f0-17-" + i0 + ",0f7520f0-12",
            b: common_vendor.t(post.title),
            c: "0f7520f0-18-" + i0 + ",0f7520f0-12",
            d: common_vendor.t(post.content),
            e: post.imagePath,
            f: post.id
          };
        }),
        L: common_vendor.p({
          text: "标题"
        }),
        M: common_vendor.p({
          text: "内容",
          type: "success"
        }),
        N: showLikedPosts.value
      } : {}, {
        O: loginError.value
      }, loginError.value ? {
        P: common_vendor.t(loginError.value)
      } : {}, {
        Q: common_vendor.o(handleModalConfirm),
        R: common_vendor.o(($event) => showModal.value = $event),
        S: common_vendor.p({
          title: modalTitle.value,
          content: modalContent.value,
          modelValue: showModal.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
