<template>
    <div class="login">
        <el-form :inline="false" ref="form" :rules="rules" :model="loginModel" class="loginForm" size="large">
            <el-form-item>
                <div class="loginTitle">
                    系统登录
                </div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="loginModel.username" placeholder="请输入用户名称" clearable />
            </el-form-item>

            <el-form-item prop="password">
                <el-input v-model="loginModel.password" placeholder="请输入用户密码" show-password clearable />
            </el-form-item>

            <!-- 验证码 -->
            <el-form-item prop="code">
                <el-row :gutter="10">
                    <el-col :span="16" :offset="0">
                        <el-input v-model="loginModel.code" placeholder="请输入验证码" clearable />
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <img class="images" :src="imageSrc" @click="getImage" />
                    </el-col>
                </el-row>

            </el-form-item>

            <el-form-item>
                <el-row :gutter="20" class="formBtn">
                    <el-col :span="12" :offset="0">
                        <el-button class="myBtn" type="primary" @click="commit">登 录</el-button>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-button type="danger" class="myBtn" @click="resetBtn">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import http from '../utils/http'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { userStore } from '../store/userStore';
// 路由对象 ，用来跳转
const router = useRouter()

const store = userStore()

// 表单的ref属性对象，可以用来清空表单
const form = ref()

// 表单绑定对象
const loginModel = reactive({
    username: '',
    password: '',
    code: '',

})

const imageSrc = ref('')
// 获取验证码
const getImage = async () => {
    let res = await http.post("/api/admin/users/getImage")
    console.log("验证码" + res.data.data); // 打印Base64编码
    imageSrc.value = res.data.data
    console.log(imageSrc.value)

}

// 重置
const resetBtn = () => {
    form.value?.resetFields()
}

// 登录
const commit = async () => {
    //验证表单
    await form.value?.validate(async (valid) => {
        if (valid) {
            console.log('验证通过')
            let res = await http.post("/api/admin/users/login", loginModel)
            if (res.data.code === 200) {
                // 只有消息为登录成功时才跳转
                ElMessage.success(res.data.message);


                console.log(res.data);
                store.setUserId(res.data.data.id);
                store.setUserName(res.data.data.username);

                console.log(store.getUsername)
                // 跳转到首页
                router.push({ path: '/' });

            } else {
                // 登录失败，弹出错误消息，不进行跳转
                ElMessage.error(res.data.message);
            }
        } else {
            console.log('验证不通过');
        }
    })

}

// 表单验证
const rules = reactive({
    username: [
        {
            required: true,
            message: "请输入用户名称",
            trigger: ['blur', 'change'],
        },
    ],
    password: [
        {
            required: true,
            message: "请输入用户密码",
            trigger: ['blur', 'change'],
        },
    ],
    code: [
        {
            required: true,
            message: "请输入验证码",
            trigger: ['blur', 'change'],
        },
    ],

})
onMounted(() => {
    getImage()
})
</script>

<style lang="scss" scoped>
.login {
    height: 100%;
    background-image: url("../assets/1.jpg");
    background-size: cover; //平铺
    display: flex;
    justify-content: center;
    align-items: center;

    .loginForm {
        height: 320px;
        width: 450px;
        background-color: rgb(83 34 44 / 17%);
        border-radius: 10px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
        padding: 20px 35px;

        .loginTitle {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            width: 100%;
            // width: 100% 确保了.loginTitle元素有足够的空间来应用弹性盒子布局 
            font-size: 32px;
            font-weight: 600;
            letter-spacing: 6px;
        }

        .images {
            height: 41px;
            width: 100%;
            cursor: pointer;
        }

        .formBtn {
            width: 100%;

            .myBtn {
                width: 222px;
            }
        }

    }

}
</style>