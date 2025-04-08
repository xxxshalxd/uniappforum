<template>
    <div>
        <!-- 下拉选项 -->
        <el-dropdown placement="bottom-start">
            <span class="el-dropdown-link">
                <img src="../assets/icon.jpg" class="userImage" />
            </span>
            <template #dropdown>
                <el-dropdown-menu>

                    <el-dropdown-item @click="logOutBtn">退出系统</el-dropdown-item>

                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>


</template>
<script setup>
const logOutBtn = () => {
    // 清除用户的会话信息
    sessionStorage.clear();
    // 重定向到登录页面
    window.location.href = "/login";
}
</script>

<style scoped>
.el-dropdown-link {
    outline: none;
}

.userImage {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #fff;
}
</style>