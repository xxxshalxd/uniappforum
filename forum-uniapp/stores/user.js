// stores/user.js
import {
  defineStore
} from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: null,
      username: '',
    },
    token: '',
    isLoggedIn: false,
  }),
  actions: {
    login(data) {
      this.token = `fake-token-${data.username}`; // 模拟 Token
      this.userInfo = data;
      this.isLoggedIn = true;
    },
    logout() {
      this.token = '';
      this.userInfo = {
        id: null,
        username: '',
      };
      this.isLoggedIn = false;
    }

  },
  persist: {
    enabled: true,
  },
});