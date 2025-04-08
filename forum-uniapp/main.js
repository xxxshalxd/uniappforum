import App from './App'
// 引入 uView UI
import uView from './uni_modules/vk-uview-ui';
// #ifndef VUE3
import Vue from 'vue'
import store from './stores'
import config from './utils/config'
import request from './utils/request.js'
import {
  createSSRApp
} from 'vue'

// 将 store, config, request 挂载到全局属性上
app.config.globalProperties.$store = store;
app.config.globalProperties.$config = config;
app.config.globalProperties.$request = request;

import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

// import * as Pinia from 'pinia'

app.$mount()
// #endif

// #ifdef VUE3

import {
  createSSRApp
} from 'vue'
import * as Pinia from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni'
export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)
  app.use(uView)
  return {
    app,
    pinia
  }

}
// #endif