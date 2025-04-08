"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    userInfo: {
      id: null,
      username: ""
    },
    token: "",
    isLoggedIn: false
  }),
  actions: {
    login(data) {
      this.token = `fake-token-${data.username}`;
      this.userInfo = data;
      this.isLoggedIn = true;
    },
    logout() {
      this.token = "";
      this.userInfo = {
        id: null,
        username: ""
      };
      this.isLoggedIn = false;
    }
  },
  persist: {
    enabled: true
  }
});
exports.useUserStore = useUserStore;
