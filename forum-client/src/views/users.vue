<template>
    <el-card>
        <el-input placeholder="请输入用户名" v-model="searchUsername" @input="fetchUsers" clearable
            style="margin-bottom: 20px;" />
        <el-table :data="users" stripe border>
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column prop="isAdmin" label="身份" align="center">
                <template #default="scope">
                    <el-tag size="default" v-if="scope.row.isAdmin == '0'" effect="light">用户</el-tag>
                    <el-tag type="warning" size="default" v-if="scope.row.isAdmin == '1'" effect="light">管理员 </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" @click="editUser(row)">编辑</el-button>
                    <el-button type="danger" @click="deleteUser(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.currentPage" :page-sizes="[3, 4, 5]" :page-size="pagination.pageSize"
            :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" background />
    </el-card>

    <el-dialog title="编辑用户" :model-value="dialogVisible" :show-close="false">
        <el-form :model="user" :rules="rules" label-width="auto" label-position="left">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item label="身份权限">
                <el-radio-group v-model="user.isAdmin">
                    <el-radio value="0" size="large">用户</el-radio>
                    <el-radio value="1" size="large">管理员</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateUser">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import http from '../utils/http.js';
import { ElMessage, ElMessageBox } from 'element-plus';
const users = ref([]);
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 });
const dialogVisible = ref(false);
const user = reactive({});

const searchUsername = ref(''); // 绑定搜索框的变量


onMounted(async () => {
    await fetchUsers();
});
// 监听搜索关键词变化并重新获取用户列表
watch(searchUsername, async (newVal) => {
    if (newVal) {
        await fetchUsers();
    }
}, { immediate: true });


const fetchUsers = async () => {
    try {
        const response = await http.get('/api/admin/users', {
            params: {
                page: pagination.currentPage, size: pagination.pageSize,
                username: searchUsername.value, // 将搜索关键词作为参数传递
            }
        });
        users.value = response.data.records;
        pagination.total = response.data.total;
        pagination.pageSize = response.data.size;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const handleSizeChange = async (newSize) => {
    pagination.pageSize = newSize;
    await fetchUsers();
};

const handleCurrentChange = async (newPage) => {
    pagination.currentPage = newPage;
    await fetchUsers();
};

const editUser = (selectedUser) => {
    Object.assign(user, selectedUser);
    dialogVisible.value = true;
};

const deleteUser = async (id) => {
    ElMessageBox.confirm('确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {  //点击确定
        await http.delete(`/api/admin/users/${id}`);
        await fetchUsers();
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

const updateUser = async () => {
    try {
        await http.put(`/api/admin/users/${user.id}`, user);
        dialogVisible.value = false;
        await fetchUsers();
        ElMessage({ message: '更新成功', type: 'success' });
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

</script>
<style lang="scss" scoped>
:deep(td.el-table_1_column_4.el-table__cell) {
    display: flex;
    justify-content: space-around;
}
</style>