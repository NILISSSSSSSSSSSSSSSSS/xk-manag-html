<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>供应商管理
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="供应商ID：">
                                <el-input :size="$size" v-model="searchForm.supplierId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="供应商名称：">
                                <el-input :size="$size" v-model="searchForm.supplierName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="xk-radius margintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>列表
                </div>
                 <div class="vus-btn">
                    <el-button type="success" :size="$size" @click="handleAdd" v-permission="'supplierAdd'">新增供应商</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" stripe v-loading="loading">
                <el-table-column label="供应商ID" prop="id"></el-table-column>
                <el-table-column label="供应商名称" prop="supplierName"></el-table-column>
                <el-table-column label="供应商图片">
                    <template slot-scope="scope">
                        <img style="width: 50px;height: 50px" :src="scope.row.supplierUrl"/>
                    </template>
                </el-table-column>
                <el-table-column label="供应商描述" prop="intro"></el-table-column>
                <el-table-column label="是否生效">
                    <template slot-scope="scope">
                        {{scope.row.effective == 1 ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button :size="$size" type="text" @click="handleDelete(scope.row)">删除</el-button> -->
                        <el-button :size="$size" type="text" @click="handleEdit(scope.row)" v-permission="'supplierEdit'">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <add-supplier :dialogVisible.sync="dialogVisible" :addOrEdit="type" @success="getSupplierData" :detail="detailData"></add-supplier>
    </div>
</template>

<script>
import AddSupplier from '@/components/operate/AddSupplier'
export default {
    name: 'supplierManage',
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            type: '',
            searchForm: {},
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading:false,
            detailData: {}
        }
    },
    created() {
        this.getSupplierData();
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getSupplierData();
        },
        resetForm() {
            this.searchForm = {}
            this.pageData.currentPage = 1;
            this.getSupplierData();
        },
        getSupplierData() {
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                supplierId: this.searchForm.supplierId,
                supplierName: this.searchForm.supplierName
            }
            this.loading = true
            this.$http.get(this.$api.supplierQpage, paramList, true)
            .then(res => {
                console.log(res)
                this.tableData = res.data
                this.pageData.total = res.total ? res.total : 0
                this.loading = false
            })
            .catch(err => {
                this.$message.error(err.message)
                this.loading = false
            })
        },
        changePage(page, limit) {
            this.pageData.currentPage = page
            this.pageData.pageSize = limit
            this.getSupplierData();
        },
        handleAdd() { // 新增供应商
            this.dialogVisible = true
            this.type = 'add'
        },
        handleEdit(row) { //编辑供应商        
            this.type = 'edit'
            this.$http.get(this.$api.supplierDetail, {supplierId: row.id}, true)
            .then(res => {
                this.dialogVisible = true
                this.detailData = res 
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        handleDelete(row) { // 删除供应商
            this.$confirm('确认删除该供应商？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let paramList = {
                    supplierId: row.id
                }
                this.$http.post(this.$api.supplierDelete, paramList, true)
                .then(res => {
                    this.$message.success("已删除成功")
                    this.getSupplierData();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消")
            })
        }
    },
    components: {
        AddSupplier
    }
}
</script>

<style>

</style>
