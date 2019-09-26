<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>平台介入退出钻石家族
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form label-width="150px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="普通家族安全码：" >
                        <el-input :size="$size" v-model="searchForm.familyL1SecurityCode" placeholder="普通家族ID"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="普通家族名称：" >
                        <el-input :size="$size" v-model="searchForm.familyL1Name" placeholder="请输入普通家族名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="家族长昵称：" >
                        <el-input :size="$size" v-model="searchForm.familyL1ShaikhName" placeholder="请输入家族长昵称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
            <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe  v-loading="loading">
                 <el-table-column  label="普通家族安全码" prop="familyL1SecurityCode"></el-table-column>
                 <el-table-column  label="普通家族名称" prop="familyL1Name"></el-table-column>
                 <el-table-column  label="家族长昵称" prop="familyL1ShaikhName"></el-table-column>
                 <el-table-column  label="主播数量" prop="anchorNum"></el-table-column>
                 <!-- <el-table-column  label="总收入" prop="totalIncome"></el-table-column>
                 <el-table-column  label="当日收入" prop="dayIncome"></el-table-column>
                 <el-table-column  label="当月收入" prop="monthIncome"></el-table-column> -->
                 <el-table-column  label="申请时间">
                     <template slot-scope="scope">
                         {{scope.row.createdAt | formatTime}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="申请类型">
                     <template slot-scope="scope">
                         <span :class="scope.row.applyType === 'out' ? 'danger' : 'success'">{{scope.row.applyType === 'out' ? '退出' : '加入'}}</span>
                     </template>
                 </el-table-column>
                 <el-table-column  label="申请状态">
                     <template slot-scope="scope">
                         <span :class="getStatusClass(scope.row.applyStatus)">{{getOutStatus(scope.row.applyStatus)}}</span>
                     </template>
                 </el-table-column>
                 <el-table-column  label="操作">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" @click="openPlat(scope.row.id)" 
                         :disabled="scope.row.applyStatus != 'platform'" v-permission="'interventionFamilyHandle'">平台介入</el-button>
                     </template>
                 </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="平台介入" width="400px" :visible.sync="platDialog" :before-close="closePlat" center top="35vh">
            <el-row style="text-align: center;font-size: 16px;margin-bottom: 20px;">
                是否通过？
            </el-row>
            <div style="text-align: center">
                <el-button :size="$size" type="primary" @click="handleSuccess" :loading="successLoading">通过</el-button>
                <el-button :size="$size" type="danger" @click="handleFailed" :loading="failedLoading">不通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    name: "intervention",
    data() {
        return {
            tableData: [{familyL1Code: 1}],
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading: false,
            statusType:[{
                    label: '全部',
                    value: ''
                }, {
                    label: "待审核",
                    value: 'SUBMIT'
                }, {
                    label:'已审核',
                    value: 'SUCCESS'
                }, {
                    label:'未通过',
                    value: 'FAILED'
            }],
            searchForm: {},
            platDialog: false,
            id: '',
            successLoading: false,
            failedLoading: false
        }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getInterventionList();
    },
    computed: {
        ...mapState({
          searchData: state => state.liveFamily.interventionFamilyCommit
        })
    },
    methods: {
        ...mapMutations({
            setInterventionFamilyCommit: "liveFamily/setInterventionFamilyCommit"
        }),
        search() {
             this.pageData.currentPage = 1;
             this.getInterventionList();
        },
        resetForm() { // 重置搜索
            this.searchForm = {
                status: ''
            }
            this.search();
        },
        search() {
            this.pageData.currentPage = 1;
            this.getInterventionList();
        },
        getOutStatus(val) {
            switch(val) {
                case 'apply':
                    return '申请退出';
                case 'refuse':
                    return '拒绝退出';
                case 'agree':
                    return '同意退出';
                case 'platform':
                    return '平台介入退出';
            }
        },
        getStatusClass(val) {
            switch(val) {
                case "agree":
                return 'success';
                case "apply":
                return 'warning';
                case "refuse":
                return 'danger';
            }
      },
        getInterventionList() { // 平台介入列表
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                familyL1SecurityCode: this.searchForm.familyL1SecurityCode,
                familyL1Name: this.searchForm.familyL1Name,
                familyL1ShaikhName: this.searchForm.familyL1ShaikhName
            }
            this.loading = true
            this.$http.get(this.$api.platformFamilyL1ApplyQPage, paramList, true)
            .then(res => {
                this.setInterventionFamilyCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}))
                this.loading = false;
                this.tableData = res.data;
                console.log(this.tableData)
                this.pageData.total = res.total
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page,pageSize) { //分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getInterventionList();
        },
        // handleIntervention() { // 介入修改家族
        //     let paramList = {
        //         anchorId: this.anchorId,
        //         merchantCode: this.formData.merchantCode
        //     }
        //     this.confirmLoading = true
        //     this.$refs['formData'].validate(valid => {
        //         if(valid) {
        //             let paramList = {
        //                     anchorId: this.anchorId,
        //                     merchantCode: this.formData.merchantCode
        //                 }
        //             this.confirmLoading = true
        //             this.$http.get(this.$api.platformIntervention, paramList, true)
        //             .then(res => {
        //                 this.confirmLoading = false
        //                 this.$message.success("操作成功")
        //                 this.getInterventionList();
        //             })
        //             .catch(err => {
        //                 this.$message.error(err.message)
        //                 this.confirmLoading = false
        //             })
        //         } else {
        //             return false;
        //         }
        //     })
        // },
        // familyIntervention(id) { // 家族介入
        //     this.$confirm('请确定是否通过？', '平台介入操作', {
        //         confirmButtonText: '通过',
        //         cancelButtonText: '不通过',
        //         distinguishCancelAndClose: true,
        //         type: 'warning',
        //         center: true
        //     })
        //     .then(() => {
        //         this.$http.get(this.$api.platformFamilyL1ApplyAgree, {id: id}, true)
        //         .then(res => {
        //             this.$message.success("操作成功")
        //             this.confirmLoading = false
        //             this.getInterventionList();
        //         })
        //         .catch(err => {
        //             this.$message.error(err.message)
        //             this.confirmLoading = false
        //         })
        //     })
        //     .catch(action => {
        //         if(action === 'cancel') {
        //             this.$http.get(this.$api.platformFamilyL1ApplyRefuse, {id: id}, true)
        //             .then(res => {
        //                 this.$message.success("操作成功")
        //                 this.confirmLoading = false
        //                 this.getInterventionList();
        //             })
        //             .catch(err => {
        //                 this.$message.error(err.message)
        //                 this.confirmLoading = false
        //             })
        //         } else {
        //             this.$message.info("已取消操作")
        //         }
               
        //     })
        // },
        openPlat(id) {
            console.log(123)
            this.id = id
            this.platDialog = true
        },
        closePlat() {
            this.platDialog = false
        },
        handleSuccess() {
            this.successLoading = true
            this.$http.post(this.$api.platformFamilyL1ApplyAgree, {id: this.id}, true)
                .then(res => {// 平台通过
                    this.$message.success("操作成功")
                    this.successLoading = false
                    this.platDialog = false;
                    this.getInterventionList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                    this.platDialog = false
                    this.successLoading = false
                })
        },
        handleFailed() {
            this.failedLoading = true
            this.$http.post(this.$api.platformFamilyL1ApplyRefuse, {id: this.id}, true)
                    .then(res => {
                        this.$message.success("操作成功")
                        this.failedLoading = false
                        this.platDialog = false
                        this.getInterventionList();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                        this.platDialog = false
                        this.failedLoading = false
                    })
        },
    }

}
</script>

<style lang="scss" scoped>
.danger {
  color: #F56C6C;
}
.warning {
  color:#E6A23C;
}
.success {
 color: #67C23A;
}
</style>

