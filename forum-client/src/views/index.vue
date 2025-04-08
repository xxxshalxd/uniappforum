<template>
    <el-container class="layout">

        <el-aside width="200px" class="aside">
            <div class="logo">
                <img src="../assets/权限管理系统.svg" class="img" alt="">
                <span class="title">
                    管理系统首页
                </span>
            </div>

            <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" unique-opened @select="handleSelect"
                router>
                <el-menu-item index="/posts">
                    <i class="el-icon-document"></i>
                    帖子管理
                </el-menu-item>
                <el-menu-item index="/users">
                    <i class="el-icon-user"></i>
                    用户管理
                </el-menu-item>
                <el-menu-item index="/comments">
                    <i class="el-icon-chat-line-round"></i>
                    评论管理
                </el-menu-item>
                <el-menu-item index="/news">
                    <i class="el-icon-news"></i>
                    新闻管理
                </el-menu-item>
                <el-menu-item index="/affairs">
                    <i class="el-icon-news"></i>
                    时讯管理
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header>
                <el-navbar>
                    <el-row type="flex" justify="center" align="middle" style="margin-top: 8px">
                        <el-col :span="12">

                            <span class="header-title">后台管理系统</span>

                        </el-col>
                        <el-col :span="3" class="text-right">
                            <LogOut class="header-logout"></LogOut>
                        </el-col>

                    </el-row>

                </el-navbar>

            </el-header>
            <el-main class="main">
                <h1 v-if="$route.path === '/'">sss</h1>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
import LogOut from "./logout.vue"
const activeMenu = ref('/posts'); //默认选中菜单项（会亮着）
const handleSelect = (index) => {
    activeMenu.value = index;   //点击其他菜单项之后，将当前菜单项的index赋值给activeMenu
    router.push(index); //路由跳转
};
</script>

<style lang="scss" scoped>
.text-right {
    text-align: right;

    /* 使内部元素靠右对齐 */
}

.header-logout {
    margin-right: -220px;


}

.logo {
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    justify-content: center;
    /* 水平居中对齐 */
    width: 100%;
    height: 60px;
    background: #5ee8db;
    cursor: pointer;
    position: relative;



    .img {

        width: 50px;
        height: 50px;
        margin-right: 5px;
        margin-left: 5px;
    }

    .title {
        color: black;
        font-size: 21px;
        font-family: '黑体';
        font-weight: bold;
        line-height: 60px;
        margin-right: 5px;
    }

}



.aside .sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.layout {
    height: 100%;



    .header {
        background-color: #009688;
        display: flex;
        align-items: center;
    }

    .main {
        background-color: rgb(240, 246, 240);
    }
}



.header-title {
    margin-left: 10px;
    vertical-align: middle;
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu-vertical-demo .el-menu-item {
    border-right: none !important; // 移除右侧边框
    border-left: none !important; // 移除左侧边框
    border-top: none !important; // 移除顶部边框
    border-bottom: none !important; // 移除底部边框
}

.el-menu {
    border-right: none !important;
}
</style>