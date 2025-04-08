import { defineStore } from "pinia"

// 定义一个全局的store
export const userStore = defineStore("userStore", {
    state: () => {  //定义
        return {
            userId: '',
            username: '',
            token: '',
            isAdmin: true,

        }
    },
    getters: {  //获取
        getUserId(state) {
            return state.userId
        },
        getUsername(state) {
            return state.username
        },
        getToken(state) {
            return state.token
        },
        getIsAdmin(state) {
            return state.isAdmin;
        }
    },

    actions: {  //操作
        setUserId(userId) {
            this.userId = userId
        },
        setUserName(username) {
            this.username = username
        },
        setToken(token) {
            this.token = token
        }
    }

}
)