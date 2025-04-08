"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_http = require("../../utils/http.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_navbar2 + _easycom_u_image2 + _easycom_u_icon2 + _easycom_uni_card2 + _easycom_u_button2 + _easycom_u_form_item2 + _easycom_u_form2 + _easycom_u_popup2)();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_u_button = () => "../../uni_modules/vk-uview-ui/components/u-button/u-button.js";
const _easycom_u_form_item = () => "../../uni_modules/vk-uview-ui/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../uni_modules/vk-uview-ui/components/u-form/u-form.js";
const _easycom_u_popup = () => "../../uni_modules/vk-uview-ui/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_image + _easycom_u_icon + _easycom_uni_card + _easycom_u_button + _easycom_u_form_item + _easycom_u_form + _easycom_u_popup)();
}
const _sfc_main = {
  __name: "postsDetail",
  setup(__props) {
    const post = common_vendor.reactive({});
    const userStore = stores_user.useUserStore();
    common_vendor.ref({
      title: "",
      content: "",
      imagePath: ""
    });
    const showCommentInputPopup = common_vendor.ref(false);
    const newComment = common_vendor.ref({
      content: ""
    });
    const showSubCommentInputPopup = common_vendor.ref(false);
    const newSubComment = common_vendor.ref({
      content: ""
    });
    const activePostId = common_vendor.ref(null);
    const activeParentCommentId = common_vendor.ref(null);
    const fetchPostDetail = async (id) => {
      try {
        const response = await utils_http.http.get(`/api/posts/${id}`);
        console.log("帖子详情响应数据:", response.data);
        Object.assign(post, {
          id: response.data.id,
          title: response.data.title,
          content: response.data.content,
          imagePath: response.data.imagePath || "",
          likesCount: response.data.likesCount || 0,
          commentsCount: response.data.commentsCount || 0
        });
        post.user = await getUserById(response.data.userId);
        post.comments = await fetchComments(id);
        post.likesCount = await getLikeCount(id);
      } catch (error) {
        console.error("Error fetching post detail:", error);
      }
    };
    const getUserById = async (id) => {
      try {
        const response = await utils_http.http.get(`/api/users/getName?id=${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        return {};
      }
    };
    const fetchComments = async (postId) => {
      try {
        const response = await utils_http.http.get(`/api/comments`, {
          params: {
            postId
          }
        });
        const comments = response.data.map((comment) => ({
          ...comment,
          user: {
            username: comment.user.username
          },
          subComments: [],
          replyToUsername: null
          // 初始化回复者用户名为null
        }));
        await Promise.all(comments.map(async (comment) => {
          if (comment.parentId) {
            comment.replyToUsername = await getSubCommentName(comment.parentId);
          }
        }));
        return comments;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    };
    const showComments = (postId) => {
      post.showComments = !post.showComments;
    };
    const showCommentInput = (postId) => {
      if (!userStore.isLoggedIn) {
        common_vendor.index.showToast({
          title: "评论请先登录",
          icon: "error",
          duration: 1e3
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/user/user"
          });
        }, 1e3);
        return;
      }
      activePostId.value = postId;
      showCommentInputPopup.value = true;
    };
    const submitComment = async () => {
      try {
        await utils_http.http.post("/api/comments", {
          content: newComment.value.content,
          postId: activePostId.value,
          userId: userStore.userInfo.id
          // 使用 Pinia 中的用户 ID
        });
        post.comments = await fetchComments(activePostId.value);
        newComment.value = {
          content: ""
        };
        showCommentInputPopup.value = false;
        common_vendor.index.showToast({
          title: "评论成功",
          icon: "success"
        });
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };
    common_vendor.reactive({});
    const toggleLike = async (postId) => {
      if (!userStore.isLoggedIn) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "error",
          duration: 1e3
        });
        setTimeout(() => {
          common_vendor.wx$1.switchTab({
            url: "/pages/user/user"
          });
        }, 1e3);
        return;
      }
      try {
        const response = await utils_http.http.post("/api/likes/toggle", {
          postId,
          userId: userStore.userInfo.id
        });
        const isLiked = response.data.data;
        post.isLiked = isLiked;
        post.likesCount = await getLikeCount(postId);
        const message = isLiked ? "点赞成功" : "取消点赞";
        common_vendor.index.showToast({
          title: message,
          icon: isLiked ? "success" : "error"
        });
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };
    const getLikeCount = async (postId) => {
      try {
        const response = await utils_http.http.get("/api/likes/count", {
          params: {
            postId
          }
        });
        return response.data.data;
      } catch (error) {
        console.error("Error fetching like count:", error);
        return 0;
      }
    };
    const getSubCommentName = async (parentCommentId) => {
      try {
        const response = await utils_http.http.get("/api/comments/withSubComments", {
          params: {
            Id: parentCommentId
          }
        });
        return response.data.username;
      } catch (error) {
        console.error("Error fetching sub-comment username:", error);
        return "";
      }
    };
    const activePostIdForSubComment = common_vendor.ref(null);
    const showSubCommentInput = (parentCommentId, postId) => {
      if (!userStore.isLoggedIn) {
        common_vendor.index.showToast({
          title: "评论请先登录",
          icon: "error",
          duration: 1e3
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/user/user"
          });
        }, 1e3);
        return;
      }
      activeParentCommentId.value = parentCommentId;
      activePostId.value = postId;
      activePostIdForSubComment.value = postId;
      showSubCommentInputPopup.value = true;
    };
    const submitSubComment = async () => {
      try {
        await utils_http.http.post("/api/comments", {
          content: newSubComment.value.content,
          postId: activePostIdForSubComment.value,
          userId: userStore.userInfo.id,
          parentId: activeParentCommentId.value
        });
        post.comments = await fetchComments(activePostIdForSubComment.value);
        newSubComment.value = {
          content: ""
        };
        showSubCommentInputPopup.value = false;
        common_vendor.index.showToast({
          title: "评论成功",
          icon: "success"
        });
      } catch (error) {
        console.error("Error submitting sub-comment:", error);
      }
    };
    common_vendor.onLoad(async (option) => {
      const postId = option.id;
      await fetchPostDetail(postId);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "帖子详情",
          ["is-back"]: true
        }),
        b: post
      }, post ? common_vendor.e({
        c: common_vendor.p({
          src: common_assets._imports_0,
          shape: "circle",
          width: "50rpx",
          height: "50rpx"
        }),
        d: common_vendor.t(post.user.username),
        e: common_vendor.t(post.title),
        f: common_vendor.t(post.content),
        g: post.imagePath
      }, post.imagePath ? {
        h: post.imagePath
      } : {}, {
        i: common_vendor.p({
          name: "thumb-up",
          color: post.isLiked ? "#5677fc" : "#9a9a9a"
        }),
        j: common_vendor.t(post.likesCount),
        k: common_vendor.o(($event) => toggleLike(post.id)),
        l: common_vendor.p({
          name: "chat"
        }),
        m: common_vendor.t(post.commentsCount),
        n: common_vendor.o(($event) => showComments(post.id))
      }) : {}, {
        o: post.showComments
      }, post.showComments ? {
        p: common_vendor.f(post.comments, (comment, k0, i0) => {
          return common_vendor.e({
            a: "3f5faada-5-" + i0,
            b: common_vendor.t(comment.user.username),
            c: comment.replyToUsername
          }, comment.replyToUsername ? {
            d: common_vendor.t(comment.replyToUsername)
          } : {}, {
            e: common_vendor.t(comment.content),
            f: common_vendor.o(($event) => showSubCommentInput(comment.id, post.id), comment.id),
            g: "3f5faada-6-" + i0,
            h: comment.showSubComments
          }, comment.showSubComments ? {
            i: common_vendor.f(comment.subComments, (subComment, k1, i1) => {
              return {
                a: "3f5faada-7-" + i0 + "-" + i1,
                b: common_vendor.t(subComment.user.username),
                c: common_vendor.t(subComment.content),
                d: subComment.id
              };
            }),
            j: common_vendor.p({
              src: common_assets._imports_1,
              shape: "circle",
              width: "30rpx",
              height: "30rpx"
            })
          } : {}, {
            k: comment.id
          });
        }),
        q: common_vendor.p({
          src: common_assets._imports_1,
          shape: "circle",
          width: "40rpx",
          height: "40rpx"
        }),
        r: common_vendor.p({
          size: "mini",
          shape: "circle",
          type: "success",
          plain: true
        }),
        s: common_vendor.o(($event) => showCommentInput(post.id)),
        t: common_vendor.p({
          type: "primary",
          shape: "circle",
          plain: true,
          ["custom-style"]: "width:350rpx;"
        })
      } : {}, {
        v: newComment.value.content,
        w: common_vendor.o(($event) => newComment.value.content = $event.detail.value),
        x: common_vendor.p({
          label: "内容"
        }),
        y: common_vendor.p({
          name: "checkbox-mark"
        }),
        z: common_vendor.o(submitComment),
        A: common_vendor.o(($event) => showCommentInputPopup.value = $event),
        B: common_vendor.p({
          position: "center",
          mode: "center",
          width: "400px",
          ["border-radius"]: "25",
          modelValue: showCommentInputPopup.value
        }),
        C: newSubComment.value.content,
        D: common_vendor.o(($event) => newSubComment.value.content = $event.detail.value),
        E: common_vendor.p({
          label: "内容"
        }),
        F: common_vendor.p({
          name: "checkbox-mark"
        }),
        G: common_vendor.o(submitSubComment),
        H: common_vendor.o(($event) => showSubCommentInputPopup.value = $event),
        I: common_vendor.p({
          position: "bottom",
          mode: "center",
          width: "400px",
          ["border-radius"]: "25",
          modelValue: showSubCommentInputPopup.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3f5faada"]]);
wx.createPage(MiniProgramPage);
