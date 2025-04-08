"use strict";
const common_vendor = require("../../../../common/vendor.js");
let systemInfo = common_vendor.index.getSystemInfoSync();
let menuButtonInfo = {};
menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
const _sfc_main = {
  name: "u-navbar",
  props: {
    // 导航栏高度，单位px，非rpx
    height: {
      type: [String, Number],
      default: ""
    },
    // 返回箭头的颜色
    backIconColor: {
      type: String,
      default: "#606266"
    },
    // 左边返回的图标
    backIconName: {
      type: String,
      default: "nav-back"
    },
    // 左边返回图标的大小，rpx
    backIconSize: {
      type: [String, Number],
      default: "44"
    },
    // 返回的文字提示
    backText: {
      type: String,
      default: ""
    },
    // 返回的文字的 样式
    backTextStyle: {
      type: Object,
      default() {
        return {
          color: "#606266"
        };
      }
    },
    // 导航栏标题
    title: {
      type: String,
      default: ""
    },
    // 标题的宽度，如果需要自定义右侧内容，且右侧内容很多时，可能需要减少这个宽度，单位rpx
    titleWidth: {
      type: [String, Number],
      default: "250"
    },
    // 标题的颜色
    titleColor: {
      type: String,
      default: "#606266"
    },
    // 标题字体是否加粗
    titleBold: {
      type: Boolean,
      default: false
    },
    // 标题的字体大小
    titleSize: {
      type: [String, Number],
      default: 32
    },
    isBack: {
      type: [Boolean, String],
      default: true
    },
    // 对象形式，因为用户可能定义一个纯色，或者线性渐变的颜色
    background: {
      type: Object,
      default() {
        return {
          background: "#ffffff"
        };
      }
    },
    // 导航栏是否固定在顶部
    isFixed: {
      type: Boolean,
      default: true
    },
    // 是否沉浸式，允许fixed定位后导航栏塌陷，仅fixed定位下生效
    immersive: {
      type: Boolean,
      default: false
    },
    // 是否显示导航栏的下边框
    borderBottom: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: [String, Number],
      default: ""
    },
    // 自定义返回逻辑
    customBack: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      menuButtonInfo,
      statusBarHeight: systemInfo.statusBarHeight
    };
  },
  computed: {
    // 导航栏内部盒子的样式
    navbarInnerStyle() {
      let style = {};
      style.height = this.navbarHeight + "px";
      let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
      style.marginRight = rightButtonWidth + "px";
      return style;
    },
    // 整个导航栏的样式
    navbarStyle() {
      let style = {};
      style.zIndex = this.zIndex ? this.zIndex : this.$u.zIndex.navbar;
      Object.assign(style, this.background);
      return style;
    },
    // 导航中间的标题的样式
    titleStyle() {
      let style = {};
      let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
      style.left = (systemInfo.windowWidth - common_vendor.index.upx2px(this.titleWidth)) / 2 + "px";
      style.right = rightButtonWidth - (systemInfo.windowWidth - common_vendor.index.upx2px(this.titleWidth)) / 2 + rightButtonWidth + "px";
      style.width = common_vendor.index.upx2px(this.titleWidth) + "px";
      return style;
    },
    // 转换字符数值为真正的数值
    navbarHeight() {
      let height = systemInfo.platform == "ios" ? 44 : 48;
      return this.height ? this.height : height;
    }
  },
  created() {
  },
  methods: {
    goBack() {
      if (typeof this.customBack === "function") {
        this.customBack.bind(this.$u.$parent.call(this))();
      } else {
        common_vendor.index.navigateBack();
      }
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: $props.isBack
  }, $props.isBack ? common_vendor.e({
    c: common_vendor.p({
      name: $props.backIconName,
      color: $props.backIconColor,
      size: $props.backIconSize
    }),
    d: $props.backText
  }, $props.backText ? {
    e: common_vendor.t($props.backText),
    f: common_vendor.s($props.backTextStyle)
  } : {}, {
    g: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  }) : {}, {
    h: $props.title
  }, $props.title ? {
    i: common_vendor.t($props.title),
    j: $props.titleColor,
    k: $props.titleSize + "rpx",
    l: $props.titleBold ? "bold" : "normal",
    m: common_vendor.s($options.titleStyle)
  } : {}, {
    n: common_vendor.s($options.navbarInnerStyle),
    o: common_vendor.s($options.navbarStyle),
    p: $props.isFixed ? 1 : "",
    q: $props.borderBottom ? 1 : "",
    r: $props.isFixed && !$props.immersive
  }, $props.isFixed && !$props.immersive ? {
    s: Number($options.navbarHeight) + $data.statusBarHeight + "px"
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-986be06f"]]);
wx.createComponent(Component);
