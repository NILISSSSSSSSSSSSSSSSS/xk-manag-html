<template>
    <div class="mechantWhiteList">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>白名单列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="addWhiteMerchant" v-permission="whiteListAdd">新增</el-button>
                </div>
            <div class="vus-bottom"></div>
            </div>
        <el-table :data="tableData" width="100%" stripe v-loading="loading">
            <el-table-column type="index" label="序号"></el-table-column>
            <!-- <el-table-column  label="商户ID" prop="merchantCode"></el-table-column> -->
            <el-table-column  label="商户ID" prop="merchantId"></el-table-column>
            <el-table-column  label="商户联系人" prop="phone"></el-table-column>
            <el-table-column  label="联系人姓名" prop="realName"></el-table-column>
            <el-table-column  label="加入白名单时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatTime}}
                </template>
            </el-table-column>
            <el-table-column  label="操作管理员" prop="userName"></el-table-column>
            <el-table-column  label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleDelete(scope.row.id)" v-permission="whiteListDelete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <add-white-merchant :dialogVisible.sync="addDialog" @success="getWhiteList"></add-white-merchant>
    </div>
</template>

<script>
import addWhiteMerchant from "./AddWhiteMerchant"
export default {
    name: "merchantWhiteList",
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    data() {
       return {
           tableData: [],
           loading: false,
           pageData: {
               currentPage: 1,
               pageSize: 10,
               total: 0
           },
           addDialog: false
       }
    },
    watch:{
        name(val) {
            console.log(val)
            if(val === 'first') {
                this.getWhiteList();
            }
        }
    },
    created() {
        this.getWhiteList();
    },
    methods: {
        getWhiteList() { // 白名单列表
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize
            }
            this.loading = true
            this.$http.get(this.$api.merchantWhiteListQPage, paramList, true)
            .then(res => {
                console.log('white',res)
                this.loading = false;
                this.tableData = res.data;
                this.pageData.total = res.total ? res.total : this.pageData.total;
            })
            .catch(err => {
                this.loading = 
                this.$message.error(err.message);
            })
        },
        changePage(page, pageSize) {
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getWhiteList();
        },
        addWhiteMerchant() {
            this.addDialog = true;
        },
        handleDelete(id) { // 从白名单中移除
            this.$confirm(`确定将该商户移出白名单吗？`, "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            })
            .then(() => {
                this.$http.get(this.$api.merchantWhiteListDelete, {whiteListId: id}, true)
                .then(res => {
                    this.$message.success("删除成功");
                    this.getWhiteList();
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.getWhiteList();
                })
            })
            .catch(()=> {
                this.$message("已取消删除")
            })
        }
    },
    components: {
        addWhiteMerchant
    }

}
</script>

<style>

</style>
