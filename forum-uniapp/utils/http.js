import axios from 'axios';
import axiosAdapterUniapp from 'axios-adapter-uniapp'
import mpadapter from 'axios-miniprogram-adapter'

axios.defaults.adapter = mpadapter;
const http = axios.create({
  baseURL: 'http://localhost:10086', // 后端服务的基础URL
  timeout: 10000, // 请求超时时间
  withCredentials: true,
});

// 添加请求拦截器
http.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如设置Token

    config.headers = {
      ...config.headers, // 保留原有的headers
      'Content-Type': 'application/json'
    };
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;