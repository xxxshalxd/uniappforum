<template>
    <el-card>
        <div class="tools"> <el-input placeholder="请输入新闻标题" v-model="searchQuery" @input="fetchNews" clearable
                style="margin-bottom: 20px;" />
            <el-button type="primary" @click="addNewsDialogVisible = true">添加新闻</el-button>
        </div>

        <el-table :data="news" stripe border>
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column label="图片" align="center">
                <template #default="scope">
                    <img :src="`http://localhost:10086` + scope.row.image" alt="新闻图片"
                        style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column prop="updateDate" label="更新日期" align="center"></el-table-column>
            <el-table-column prop="details" label="详情" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" @click="editNews(row)">编辑</el-button>
                    <el-button type="danger" @click="deleteNews(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.currentPage" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize"
            :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" background />
    </el-card>

    <el-dialog title="编辑新闻" :model-value="dialogVisible" :show-close="false">
        <el-form :model="newsItem" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="newsItem.title"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-input v-model="newsItem.image"></el-input>
            </el-form-item>

            <el-form-item label="详情" prop="details">
                <el-input type="textarea" v-model="newsItem.details"></el-input>
            </el-form-item>

            <el-form-item label="更新日期" prop="updateDate">
                <el-input v-model="newsItem.updateDate"></el-input>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button @click="dialogVisible = false; resetNewsItem()">取消</el-button>
            <el-button type="primary" @click="updateNews">确认</el-button>
        </template>
    </el-dialog>
    <el-dialog title="添加新闻" v-model="addNewsDialogVisible" :show-close="false">
        <el-form :model="newsItem" ref="addNews" :rules="rules">
            <el-form-item label=" 标题" prop="title">
                <el-input v-model="newsItem.title"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-input v-model="newsItem.image"></el-input>
            </el-form-item>

            <el-form-item label="详情" prop="details">
                <el-input type="textarea" v-model="newsItem.details"></el-input>
            </el-form-item>
            <el-form-item label="更新日期" prop="updateDate">
                <el-date-picker v-model="newsItem.updateDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="createNews">确认添加</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '../utils/http.js';

const news = ref([]);
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const dialogVisible = ref(false);
const newsItem = reactive({});
const searchQuery = ref(''); // 绑定搜索框的变量
const addNews = ref()

onMounted(async () => {
    await fetchNews();
});

watch(searchQuery, async (newVal) => {
    if (newVal) {
        await fetchNews();
    }
}, { immediate: true });

const fetchNews = async () => {
    try {
        const response = await http.get('/api/admin/news', {
            params: {
                page: pagination.currentPage, size: pagination.pageSize,
                title: searchQuery.value, // 假设搜索字段为标题
            }
        });
        news.value = response.data.records;
        pagination.total = response.data.total;
        pagination.pageSize = response.data.size;
    } catch (error) {
        console.error('Error fetching news:', error);
    }
};

const handleSizeChange = async (newSize) => {
    pagination.pageSize = newSize;
    await fetchNews();
};

const handleCurrentChange = async (newPage) => {
    pagination.currentPage = newPage;
    await fetchNews();
};

const editNews = (selectedNews) => {
    Object.assign(newsItem, selectedNews);
    dialogVisible.value = true;
};

const deleteNews = async (id) => {

    ElMessageBox.confirm('确定删除该新闻？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {  //点击确定
        await http.delete(`/api/admin/news/${id}`);
        await fetchNews();
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

const updateNews = async () => {
    try {
        await http.put(`/api/admin/news/${newsItem.id}`, newsItem);
        dialogVisible.value = false;
        ElMessage({
            message: '更新成功',
            type: 'success'
        })
        await fetchNews();

    } catch (error) {
        console.error('Error updating news:', error);
    }
};

const addNewsDialogVisible = ref(false);

const createNews = async () => {
    addNews.value.validate(async (valid) => {
        if (valid) {
            try {
                const response = await http.post('/api/admin/news', newsItem);
                addNewsDialogVisible.value = false;
                ElMessage({
                    message: '添加成功',
                    type: 'success'
                });
                addNews.value?.resetFields();
                await fetchNews();
            } catch (error) {
                console.error('Error creating news:', error);
            }
        } else {
            console.log('表单验证失败');
            return false;
        }
    });



};

const handleCancel = () => {
    addNewsDialogVisible.value = false;
    addNews.value?.resetFields();
    newsItem.title = '';
    newsItem.details = '';
    newsItem.updateDate = '';
    newsItem.image = '';
}
const resetNewsItem = () => {
    newsItem.title = '';
    newsItem.details = '';
    newsItem.updateDate = '';
    newsItem.image = '';
}
const rules = reactive({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    image: [
        { required: true, message: '请输入图片地址', trigger: 'blur' }
    ],
    updateDate: [
        { required: true, message: '请选择日期', trigger: 'blur' }
    ],
    details: [
        { required: true, message: '请输入详情', trigger: 'blur' }
    ]
})
</script>
<style scoped>
.tools {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.el-input {
    margin-right: 10px;
}
</style>