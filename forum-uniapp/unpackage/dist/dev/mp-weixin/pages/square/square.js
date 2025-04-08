"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_http = require("../../utils/http.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_upload2 = common_vendor.resolveComponent("u-upload");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_navbar2 + _easycom_u_search2 + _easycom_u_image2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_uni_card2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_upload2 + _easycom_u_form2 + _easycom_u_popup2)();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../uni_modules/vk-uview-ui/components/u-button/u-button.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_u_input = () => "../../uni_modules/vk-uview-ui/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../uni_modules/vk-uview-ui/components/u-form-item/u-form-item.js";
const _easycom_u_upload = () => "../../uni_modules/vk-uview-ui/components/u-upload/u-upload.js";
const _easycom_u_form = () => "../../uni_modules/vk-uview-ui/components/u-form/u-form.js";
const _easycom_u_popup = () => "../../uni_modules/vk-uview-ui/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_search + _easycom_u_image + _easycom_u_icon + _easycom_u_button + _easycom_uni_card + _easycom_u_input + _easycom_u_form_item + _easycom_u_upload + _easycom_u_form + _easycom_u_popup)();
}
const uploadUrl = "http://localhost:10086/api/posts/upload";
const _sfc_main = {
  __name: "square",
  setup(__props) {
    const handleImageSuccess = (response) => {
      console.log("Response:", response);
      newPost.value.imagePath = response.filePath;
      console.log("newPost.value.image================" + newPost.value.imagePath);
    };
    const handleImageError = () => {
      common_vendor.index.showToast({
        title: "图片上传失败",
        icon: "none"
      });
    };
    common_vendor.ref("");
    const getSubCommentName = async (parentCommentId) => {
      const response = await utils_http.http.get(`/api/comments/withSubComments`, {
        params: {
          Id: parentCommentId
        }
      });
      console.log("username is ===>" + response.data.username);
      return response.data.username;
    };
    const posts = common_vendor.ref([]);
    const userStore = stores_user.useUserStore();
    const showPostFormPopup = common_vendor.ref(false);
    const newPost = common_vendor.ref({
      title: "",
      content: "",
      imagePath: ""
    });
    const showCommentInputPopup = common_vendor.ref(false);
    const newComment = common_vendor.ref({
      content: ""
    });
    const activePostId = common_vendor.ref(null);
    const fetchPosts = async () => {
      try {
        const response = await utils_http.http.get("/api/posts");
        console.log("原始帖子数据:", response.data);
        const postsData = response.data.map((post) => ({
          ...post,
          user: null,
          // 初始化为 null
          comments: [],
          showComments: false,
          imagePath: post.imagePath || ""
          // 如果没有 imagePath，设置为空字符串
        }));
        console.log("映射后的帖子数据:", postsData);
        const userPromises = postsData.map((post) => getUserById(post.userId));
        const userResults = await Promise.all(userPromises);
        const commentsPromises = postsData.map((post) => fetchComments(post.id));
        const commentsResults = await Promise.all(commentsPromises);
        posts.value = postsData.map((post, index) => ({
          ...post,
          user: userResults[index],
          comments: commentsResults[index],
          imagePath: post.imagePath || ""
          // 确保 imagePath 存在
        }));
        console.log("更新后的帖子数据:", posts.value);
      } catch (error) {
        console.error("Error fetching posts:", error);
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
    const showPostForm = () => {
      if (!userStore.isLoggedIn) {
        common_vendor.index.showToast({
          title: "发帖请先登录",
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
      showPostFormPopup.value = true;
    };
    const submitPost = async () => {
      console.log("submit post path===>" + newPost.value.imagePath);
      try {
        const response = await utils_http.http.post("/api/posts", {
          ...newPost.value,
          // ImagePath: newPost.value.image,
          userId: userStore.userInfo.id
          // 使用 Pinia 中的用户 ID
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        const newPostData = response.data;
        posts.value.unshift(newPostData);
        showPostFormPopup.value = false;
        common_vendor.index.showToast({
          title: "发帖成功",
          icon: "success"
        });
        posts.value = [...posts.value];
        await fetchPosts();
      } catch (error) {
        console.error("Error submitting post:", error);
        common_vendor.index.showToast({
          title: "发帖失败",
          icon: "error"
        });
      }
    };
    const showComments = (postId) => {
      const index = posts.value.findIndex((post) => post.id === postId);
      if (index !== -1) {
        posts.value[index].showComments = !posts.value[index].showComments;
      }
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
        const comments = await fetchComments(activePostId.value);
        const index = posts.value.findIndex((post) => post.id === activePostId.value);
        if (index !== -1) {
          posts.value[index].comments = comments;
        }
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
        const index = posts.value.findIndex((post) => post.id === postId);
        if (index !== -1) {
          posts.value[index].isLiked = isLiked;
          posts.value[index].likesCount = await getLikeCount(postId);
        }
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
        const response = await utils_http.http.get(`/api/likes/count`, {
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
    common_vendor.onMounted(async () => {
      await fetchPosts();
      posts.value.forEach(async (post) => {
        const likesCount = await getLikeCount(post.id);
        post.likesCount = likesCount;
        post.comments = await fetchComments(post.id);
      });
    });
    const keyword = common_vendor.ref("");
    const onSearch = async (val) => {
      try {
        const response = await utils_http.http.get("/api/posts/Search", {
          params: {
            query: val
          }
        });
        posts.value = response.data;
        console.log("data is " + response.data);
        const postsData = response.data.map((post) => ({
          ...post
        }));
        const userPromises = postsData.map((post) => getUserById(post.userId));
        const userResults = await Promise.all(userPromises);
        const commentsPromises = postsData.map((post) => fetchComments(post.id));
        const commentsResults = await Promise.all(commentsPromises);
        posts.value = postsData.map((post, index) => ({
          ...post,
          user: userResults[index],
          comments: commentsResults[index]
        }));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    const activeParentCommentId = common_vendor.ref(null);
    const showSubCommentInputPopup = common_vendor.ref(false);
    const newSubComment = common_vendor.ref({
      content: ""
    });
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
      activePostIdForSubComment.value = postId;
      showSubCommentInputPopup.value = true;
    };
    const submitsubcomment = async () => {
      try {
        await utils_http.http.post("/api/comments", {
          content: newSubComment.value.content,
          postId: activePostIdForSubComment.value,
          userId: userStore.userInfo.id,
          parentId: activeParentCommentId.value
        });
        const comments = await fetchComments(activePostIdForSubComment.value);
        const index = posts.value.findIndex((post) => post.id === activePostIdForSubComment.value);
        if (index !== -1) {
          const parentCommentIndex = comments.findIndex((comment) => comment.id === activeParentCommentId.value);
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
    const goToPosts = (id) => {
      console.log("Posts id===>" + id);
      common_vendor.index.navigateTo({
        url: `/pages/postsDetail/postsDetail?id=${id}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "广场",
          ["is-back"]: false,
          hideBack: true,
          ["hide-back-button"]: true
        }),
        b: common_vendor.o(onSearch),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "请输入关键字来搜索帖子",
          clearabled: true,
          ["show-action"]: true,
          animation: false,
          modelValue: keyword.value
        }),
        e: common_vendor.f(posts.value, (post, index, i0) => {
          return common_vendor.e({
            a: "6bc6c6b7-3-" + i0 + "," + ("6bc6c6b7-2-" + i0),
            b: common_vendor.t(post.user.username),
            c: common_vendor.t(post.title),
            d: common_vendor.t(post.content),
            e: post.imagePath
          }, post.imagePath ? {
            f: post.imagePath
          } : {}, {
            g: common_vendor.o(($event) => goToPosts(post.id), post.id),
            h: "6bc6c6b7-4-" + i0 + "," + ("6bc6c6b7-2-" + i0),
            i: common_vendor.p({
              name: "thumb-up",
              color: post.isLiked ? "#5677fc" : "#9a9a9a"
            }),
            j: common_vendor.t(post.likesCount ? post.likesCount : 0),
            k: common_vendor.o(($event) => toggleLike(post.id), post.id),
            l: "6bc6c6b7-5-" + i0 + "," + ("6bc6c6b7-2-" + i0),
            m: common_vendor.t(post.commentsCount),
            n: common_vendor.o(($event) => showComments(post.id), post.id),
            o: post.showComments
          }, post.showComments ? {
            p: common_vendor.f(post.comments, (comment, k1, i1) => {
              return common_vendor.e({
                a: "6bc6c6b7-6-" + i0 + "-" + i1 + "," + ("6bc6c6b7-2-" + i0),
                b: common_vendor.t(comment.user.username),
                c: comment.replyToUsername
              }, comment.replyToUsername ? {
                d: common_vendor.t(comment.replyToUsername)
              } : {}, {
                e: common_vendor.t(comment.content),
                f: common_vendor.o(($event) => showSubCommentInput(comment.id, post.id), comment.id),
                g: "6bc6c6b7-7-" + i0 + "-" + i1 + "," + ("6bc6c6b7-2-" + i0),
                h: comment.showSubComments
              }, comment.showSubComments ? {
                i: common_vendor.f(comment.subComments, (subComment, k2, i2) => {
                  return {
                    a: "6bc6c6b7-8-" + i0 + "-" + i1 + "-" + i2 + "," + ("6bc6c6b7-2-" + i0),
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
            s: common_vendor.o(($event) => showCommentInput(post.id), post.id),
            t: "6bc6c6b7-9-" + i0 + "," + ("6bc6c6b7-2-" + i0),
            v: common_vendor.p({
              type: "primary",
              shape: "circle"
            })
          } : {}, {
            w: post.id,
            x: "6bc6c6b7-2-" + i0
          });
        }),
        f: common_vendor.p({
          src: common_assets._imports_0,
          shape: "circle",
          width: "50rpx",
          height: "50rpx"
        }),
        g: common_vendor.p({
          name: "chat"
        }),
        h: common_vendor.p({
          name: "plus"
        }),
        i: common_vendor.o(showPostForm),
        j: common_vendor.o(($event) => newPost.value.title = $event),
        k: common_vendor.p({
          border: true,
          placeholder: "帖子标题",
          modelValue: newPost.value.title
        }),
        l: common_vendor.p({
          label: "标题"
        }),
        m: newPost.value.content,
        n: common_vendor.o(($event) => newPost.value.content = $event.detail.value),
        o: common_vendor.p({
          label: "内容"
        }),
        p: common_vendor.o(handleImageSuccess),
        q: common_vendor.o(handleImageError),
        r: common_vendor.p({
          action: uploadUrl,
          name: "file",
          multiple: true
        }),
        s: common_vendor.p({
          label: "图片"
        }),
        t: common_vendor.p({
          name: "checkbox-mark"
        }),
        v: common_vendor.o(submitPost),
        w: common_vendor.o(($event) => showPostFormPopup.value = $event),
        x: common_vendor.p({
          position: "center",
          mode: "center",
          width: "400px",
          ["border-radius"]: "25",
          modelValue: showPostFormPopup.value
        }),
        y: newComment.value.content,
        z: common_vendor.o(($event) => newComment.value.content = $event.detail.value),
        A: common_vendor.p({
          label: "内容"
        }),
        B: common_vendor.p({
          name: "checkbox-mark"
        }),
        C: common_vendor.o(submitComment),
        D: common_vendor.o(($event) => showCommentInputPopup.value = $event),
        E: common_vendor.p({
          position: "center",
          mode: "center",
          width: "400px",
          ["border-radius"]: "25",
          modelValue: showCommentInputPopup.value
        }),
        F: newSubComment.value.content,
        G: common_vendor.o(($event) => newSubComment.value.content = $event.detail.value),
        H: common_vendor.p({
          label: "内容"
        }),
        I: common_vendor.p({
          name: "checkbox-mark"
        }),
        J: common_vendor.o(submitsubcomment),
        K: common_vendor.o(($event) => showSubCommentInputPopup.value = $event),
        L: common_vendor.p({
          position: "bottom",
          mode: "center",
          width: "400px",
          ["border-radius"]: "25",
          modelValue: showSubCommentInputPopup.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bc6c6b7"]]);
wx.createPage(MiniProgramPage);
