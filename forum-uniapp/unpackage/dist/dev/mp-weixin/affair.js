"use strict";
const common_vendor = require("./common/vendor.js");
const utils_http = require("./utils/http.js");
const _sfc_main = {
  __name: "affair",
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const leftDataList = common_vendor.ref([]);
    const rightDataList = common_vendor.ref([]);
    const fetchList = async () => {
      try {
        const response = await utils_http.http.get("/api/affair");
        console.log("response:" + response.data);
        dataList.value = response.data;
        console.log("response2:" + dataList.value);
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };
    const distributeData = () => {
      leftDataList.value = [];
      rightDataList.value = [];
      dataList.value.forEach((item) => {
        if (item.id % 2 === 0) {
          rightDataList.value.push(item);
        } else {
          leftDataList.value.push(item);
        }
      });
    };
    const goToDetail = (id) => {
      console.log("title id===>" + id);
      common_vendor.index.navigateTo({
        url: `/pages/newsDetail/newsDetail?id=${id}`
      });
    };
    common_vendor.onMounted(async () => {
      await fetchList();
      await distributeData();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(leftDataList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.newsTitle),
            b: common_vendor.o(($event) => goToDetail(item.id), item.id),
            c: common_vendor.t(item.newsDate),
            d: item.id
          };
        }),
        b: common_vendor.f(rightDataList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.newsTitle),
            b: common_vendor.o(($event) => goToDetail(item.id), item.id),
            c: common_vendor.t(item.newsDate),
            d: item.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-473306e0"]]);
exports.MiniProgramPage = MiniProgramPage;
