import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {  //开发服务器配置
    host: '0.0.0.0', // IP地址
    port: 9090,
    open: false,
  }
})
