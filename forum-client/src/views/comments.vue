<template>
    <el-card>
        <el-input placeholder="请输入评论内容" v-model="searchQuery" @input="fetchComments" clearable
            style="margin-bottom: 20px;" />
        <el-table :data="comments" stripe border>
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="content" label="内容" align="center"></el-table-column>
            <el-table-column prop="postTitle" label="所属帖子" align="center"></el-table-column>

            <el-table-column prop="parentId" label="父评论ID" align="center">
                <template #default="scope">
                    <el-tag size="default" v-if="scope.row.parentId == null" effect="light">1级评论</el-tag>
                    <el-tag type="warning" v-if="scope.row.parentId != null" size="default" effect="light"> {{
                        scope.row.parentId }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="postTitle" label="所属帖子" align="center"></el-table-column>
            <el-table-column prop="username" label="作者" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" @click="editComment(row)">编辑</el-button>
                    <el-button type="danger" @click="deleteComment(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.currentPage" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize"
            :total="pagination.total" layout="total, sizes, prev, pager, next,jumper" background />
    </el-card>
    <el-dialog title="编辑评论" :model-value="dialogVisible" :show-close="false">
        <el-form :model="comment" :rules="rules">
            <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="comment.content"></el-input>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateComment">确认</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import http from '../utils/http.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const comments = ref([]);
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const dialogVisible = ref(false);
const comment = reactive({});
const searchQuery = ref(''); // 绑定搜索框的变量
onMounted(async () => {
    await fetchComments();
});
// 监听搜索关键词变化并重新获取评论列表
watch(searchQuery, async (newVal) => {
    if (newVal) {
        await fetchComments();
    }
}, { immediate: true });
const fetchComments = async () => {
    try {
        const response = await http.get('/api/admin/comments',
            {
                params: {
                    page: pagination.currentPage,
                    size: pagination.pageSize,
                    content: searchQuery.value, // 假设搜索字段为内容
                }
            });
        comments.value = response.data.records;
        for (let ares in comments.value) {
            console.log(comments.value[ares])
        }
        pagination.total = response.data.total; pagination.pageSize = response.data.size;
    }
    catch (error) {
        console.error('Error fetching comments:', error);
    }
};


const handleSizeChange = async (newSize) => { pagination.pageSize = newSize; await fetchComments(); };
const handleCurrentChange = async (newPage) => { pagination.currentPage = newPage; await fetchComments(); };
const editComment = (selectedComment) => { Object.assign(comment, selectedComment); dialogVisible.value = true; };
const deleteComment = async (id) => {
    ElMessageBox.confirm('确定删除该评论？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {  //点击确定
        await http.delete(`/api/admin/comments/${id}`);
        await fetchComments();
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
const updateComment = async () => {
    try {
        await http.put(`/api/admin/comments/${comment.id}`, comment);
        dialogVisible.value = false;
        await fetchComments();
        ElMessage({ message: '更新成功', type: 'success' });
    } catch (error) {
        console.error('Error updating comment:', error);
    }
};

const rules = reactive({
    content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
})
</script>
