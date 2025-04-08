"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_vkUviewUi_index = require("./uni_modules/vk-uview-ui/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/square/square.js";
  "./pages/user/user.js";
  "./pages/spark/spark.js";
  "./pages/affair/affair.js";
  "./pages/recommend/recommend.js";
  "./pages/newsDetail/newsDetail.js";
  "./pages/postsDetail/postsDetail.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onBeforeMount(() => {
      console.log("App Launch");
    });
    common_vendor.onMounted(() => {
      console.log("App Show");
    });
    common_vendor.onBeforeUnmount(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  pinia.use(common_vendor.index$1);
  app.use(pinia);
  app.use(uni_modules_vkUviewUi_index.uView);
  return {
    app,
    pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
