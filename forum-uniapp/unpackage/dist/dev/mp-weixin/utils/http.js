"use strict";
const common_vendor = require("../common/vendor.js");
common_vendor.axios.defaults.adapter = common_vendor.mpAdapter;
const http = common_vendor.axios.create({
  baseURL: "http://localhost:10086",
  // 后端服务的基础URL
  timeout: 1e4,
  // 请求超时时间
  withCredentials: true
});
http.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      // 保留原有的headers
      "Content-Type": "application/json"
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
exports.http = http;
