import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 整体导入elementplus组件库
import ElementPlus from "element-plus";//导入elementplus组件库的所有模块和功能
import "element-plus/dist/index.css";// 导入elementplus组件库所需的全局css样式
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";
import { router } from "./router/index";
const app = createApp(App);
//注册ElementPlus组件库中的所有图标到全局Vue应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 分页国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
app.use(ElementPlus, {
    locale: zhCn,
});
const pinia = createPinia();
app.use(pinia);
app.use(router);
import { userStore } from './store/userStore';
const user = userStore();
router.beforeEach((to, from, next) => {
    const isLogin = user.getUserId > 0;
    // 如果访问的是登录页面，则直接放行
    if (to.path === '/login') {
        next();
    } else if (isLogin) {
        // 如果用户已登录，则放行
        next();
    } else {
        // 如果用户未登录，则重定向到登录页面
        next('/login');
    }

});


app.mount("#app");

