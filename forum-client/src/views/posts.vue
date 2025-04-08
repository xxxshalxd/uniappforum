<template>
    <el-card>
        <div class="topFunc"> <el-input placeholder="请输入帖子标题" v-model="searchQuery" @input="fetchPosts" clearable
                style="margin-bottom: 20px;" />
            <el-button type="primary" @click="showCreatePostDialog">新建帖子</el-button>
        </div>

        <el-table :data="posts" stripe border>
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column prop="content" label="内容" align="center"></el-table-column>
            <el-table-column prop="username" label="作者" align="center"></el-table-column>
            <el-table-column label="图片" align="center">
                <template #default="scope">
                    <img :src="`http://localhost:10086` + `/${scope.row.imagePath.split('../').pop()}`" alt="图片"
                        style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" @click="editPost(row)">编辑</el-button>
                    <el-button type="danger" @click="deletePost(row.id)">删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.currentPage" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize"
            :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" background />
    </el-card>

    <el-dialog title="编辑帖子" :model-value="editDialogVisible" :show-close="false">
        <el-form :model="post" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="post.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="post.content"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="imagePath">
                <el-input v-model="post.imagePath"></el-input>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button @click="editDialogVisible = false; resetData()">取消</el-button>
            <el-button type="primary" @click="updatePost">确认</el-button>
        </template>
    </el-dialog>


    <el-dialog title="新建帖子" :model-value="createDialogVisible" :show-close="false">
        <el-form :model="post" ref="createForm" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="post.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="post.content"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="imagePath">
                <el-input v-model="post.imagePath"></el-input>
            </el-form-item>

        </el-form>
        <template v-slot:footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="createPost">确认</el-button>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import http from '../utils/http.js';
import { userStore } from '../store/userStore.js';

import { ElMessage, ElMessageBox } from 'element-plus';
const createForm = ref();


const handleCancel = () => {
    // 关闭对话框
    createDialogVisible.value = false;
    createForm.value?.resetFields();
    post.title = '';
    post.content = '',
        post.imagePath = ''
};

const resetData = () => {
    post.title = '';
    post.content = '',
        post.imagePath = ''


}
const store = userStore();
const posts = ref([]);
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const editDialogVisible = ref(false);
const createDialogVisible = ref(false);
const post = reactive({});
const searchQuery = ref(''); // 绑定搜索框的变量

const userId = computed(() => {
    return store.getUserId
})

onMounted(async () => {
    await fetchPosts();
});
// 监听搜索关键词变化并重新获取帖子列表
watch(searchQuery, async (newVal) => {
    if (newVal) {
        await fetchPosts();
    }
}, { immediate: true });

const fetchPosts = async () => {
    try {
        const response = await http.get('/api/admin/posts', {
            params: {
                page: pagination.currentPage, size: pagination.pageSize,
                title: searchQuery.value, // 假设搜索字段为标题

            }
        });
        posts.value = response.data.records;
        pagination.total = response.data.total;
        pagination.pageSize = response.data.size;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

// 显示创建帖子的对话框
const showCreatePostDialog = () => {
    //post对象清空，且只设置了userId，也就是从pinia拿的登录的userId
    post.value = { userId: userId.value };
    createDialogVisible.value = true;
};
const createPost = async () => {
    createForm.value.validate(async (valid) => {
        if (valid) {
            try {
                post.userId = userId.value;
                await http.post('/api/admin/posts', post);
                createDialogVisible.value = false;
                createForm.value?.resetFields();
                await fetchPosts(); // 重新获取帖子列表
                ElMessage({
                    message: '创建成功',
                    type: 'success'
                }
                )
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else {
            console.log('表单验证失败');
            return false;
        }
    });

};

const handleSizeChange = async (newSize) => {
    pagination.pageSize = newSize;
    await fetchPosts();
};

const handleCurrentChange = async (newPage) => {
    pagination.currentPage = newPage;
    await fetchPosts();
};

const editPost = (selectedPost) => {
    // Object.assign 回显
    Object.assign(post, selectedPost);
    editDialogVisible.value = true;

};

const deletePost = async (id) => {
    ElMessageBox.confirm('确定删除该帖子？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {  //点击确定
        await http.delete(`/api/admin/posts/${id}`);
        await fetchPosts();
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
    }).catch(() => { //点击取消
        ElMessage({
            type: 'info',
            message: '已取消操作！！',
        })
    })


};

const updatePost = async () => {
    try {
        await http.put(`/api/admin/posts/${post.id}`, post);
        editDialogVisible.value = false;
        await fetchPosts();
        ElMessage({
            message: '更新成功',
            type: 'success'
        })
    } catch (error) {

        console.error('Error updating post:', error);
    }
};

const rules = reactive({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],

    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    imagePath: [{ required: true, message: '请上传图片', trigger: 'blur' }]
})



</script>
<style scoped>
.el-input {
    margin-right: 10px;
}

.topFunc {
    display: flex;
    justify-content: space-around;
}
</style>