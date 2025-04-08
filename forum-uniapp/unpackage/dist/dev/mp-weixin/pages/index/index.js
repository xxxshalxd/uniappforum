"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  const _easycom_u_lazy_load2 = common_vendor.resolveComponent("u-lazy-load");
  const _easycom_u_waterfall2 = common_vendor.resolveComponent("u-waterfall");
  (_easycom_u_navbar2 + _easycom_u_tabs2 + _easycom_u_popup2 + _easycom_u_lazy_load2 + _easycom_u_waterfall2)();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_u_tabs = () => "../../uni_modules/vk-uview-ui/components/u-tabs/u-tabs.js";
const _easycom_u_popup = () => "../../uni_modules/vk-uview-ui/components/u-popup/u-popup.js";
const _easycom_u_lazy_load = () => "../../uni_modules/vk-uview-ui/components/u-lazy-load/u-lazy-load.js";
const _easycom_u_waterfall = () => "../../uni_modules/vk-uview-ui/components/u-waterfall/u-waterfall.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_tabs + Affair + Recommend + _easycom_u_popup + _easycom_u_lazy_load + _easycom_u_waterfall)();
}
const Affair = () => "../affair/affair2.js";
const Recommend = () => "../recommend/recommend2.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const indicatorDots = common_vendor.ref(true);
    const indicatorColor = common_vendor.ref("#FFF");
    const autoplay = common_vendor.ref(true);
    const interval = common_vendor.ref(2e3);
    const duration = common_vendor.ref(500);
    const swipperList = common_vendor.ref([
      {
        image: "/static/img/1.jpg"
      },
      {
        image: "/static/img/2.jpg"
      },
      {
        image: "/static/img/3.jpg"
      }
    ]);
    const list = common_vendor.ref([
      {
        name: "校园活动"
      },
      {
        name: "时讯要闻"
      }
      // {
      //   name: '地图'
      // }
    ]);
    const current = common_vendor.ref(0);
    const Tabschange = (index) => {
      current.value = index;
    };
    const flowList = common_vendor.ref([]);
    const popupShow = common_vendor.ref(false);
    const currentItem = common_vendor.ref(null);
    const fetchFlowList = async () => {
      try {
        const response = await utils_http.http.get("/api/news");
        flowList.value = response.data;
      } catch (error) {
        console.error("Error fetching flow list:", error);
      }
    };
    const onItemClick = async (item) => {
      try {
        const response = await utils_http.http.get(`/api/news/${item.id}`);
        currentItem.value = response.data;
        popupShow.value = true;
        console.log("shuju", currentItem.details);
      } catch (error) {
        console.error("Error fetching news details:", error);
      }
    };
    fetchFlowList();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "首页",
          ["is-back"]: false
        }),
        b: common_vendor.f(swipperList.value, (item, index, i0) => {
          return {
            a: item.image
          };
        }),
        c: indicatorDots.value,
        d: autoplay.value,
        e: interval.value,
        f: duration.value,
        g: indicatorColor.value,
        h: common_vendor.o(Tabschange),
        i: common_vendor.o(($event) => current.value = $event),
        j: common_vendor.p({
          list: list.value,
          ["is-scroll"]: false,
          ["item-width"]: "200rpx",
          ["bar-w"]: true,
          ["bar-width"]: "80",
          ["active-color"]: "navy",
          ["bg-color"]: "#5ac0cf",
          modelValue: current.value
        }),
        k: current.value == 1
      }, current.value == 1 ? {} : {}, {
        l: current.value == 2
      }, current.value == 2 ? {} : {}, {
        m: popupShow.value
      }, popupShow.value ? {
        n: currentItem.value.image,
        o: common_vendor.t(currentItem.value.title),
        p: common_vendor.t(currentItem.value.details),
        q: common_vendor.t(currentItem.value.updateDate)
      } : {}, {
        r: common_vendor.o(($event) => popupShow.value = false),
        s: common_vendor.o(($event) => popupShow.value = $event),
        t: common_vendor.p({
          mode: "center",
          closeable: true,
          ["close-icon-pos"]: "top-right",
          ["z-index"]: "19",
          ["border-radius"]: "25",
          width: "400px",
          modelValue: popupShow.value
        }),
        v: current.value == 0
      }, current.value == 0 ? {
        w: common_vendor.w(({
          leftList
        }, s0, i0) => {
          return {
            a: common_vendor.f(leftList, (item, index, i1) => {
              return {
                a: "065a64c5-6-" + i0 + "-" + i1 + ",065a64c5-5",
                b: common_vendor.p({
                  threshold: "-450",
                  ["border-radius"]: "10",
                  image: item.image,
                  index
                }),
                c: common_vendor.t(item.title),
                d: index,
                e: common_vendor.o(($event) => onItemClick(item), index)
              };
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "left",
          path: "w",
          vueId: "065a64c5-5"
        }),
        x: common_vendor.w(({
          rightList
        }, s0, i0) => {
          return {
            a: common_vendor.f(rightList, (item, index, i1) => {
              return {
                a: "065a64c5-7-" + i0 + "-" + i1 + ",065a64c5-5",
                b: common_vendor.p({
                  threshold: "-450",
                  ["border-radius"]: "10",
                  image: item.image,
                  index
                }),
                c: common_vendor.t(item.title),
                d: index,
                e: common_vendor.o(($event) => onItemClick(item), index)
              };
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "right",
          path: "x",
          vueId: "065a64c5-5"
        }),
        y: common_vendor.sr("uWaterfall1", "065a64c5-5"),
        z: common_vendor.o(($event) => flowList.value = $event),
        A: common_vendor.p({
          modelValue: flowList.value
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
