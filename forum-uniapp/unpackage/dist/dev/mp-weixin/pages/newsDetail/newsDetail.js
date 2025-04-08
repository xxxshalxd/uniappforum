"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  _easycom_u_navbar2();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
if (!Math) {
  _easycom_u_navbar();
}
const _sfc_main = {
  __name: "newsDetail",
  setup(__props) {
    const newsItem = common_vendor.ref({});
    const fetchNewsDetail = async (id) => {
      try {
        const response = await utils_http.http.get(`/api/affair/${id}`);
        newsItem.value = response.data;
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };
    common_vendor.onLoad((option) => {
      console.log("传参id" + option.id);
      fetchNewsDetail(option.id);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "要闻详情",
          ["is-back"]: true
        }),
        b: common_vendor.t(newsItem.value.newsTitle),
        c: newsItem.value.newsContent,
        d: common_vendor.t(newsItem.value.newsDate)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca9fe72"]]);
wx.createPage(MiniProgramPage);
