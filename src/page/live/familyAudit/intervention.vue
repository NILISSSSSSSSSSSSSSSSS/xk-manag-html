<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>平台介入退出家族
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="主播安全码：" >
                        <el-input :size="$size" v-model="searchForm.securityCode" placeholder="请输入主播安全码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主播姓名：" >
                        <el-input :size="$size" v-model="searchForm.anchorName" placeholder="请输入主播姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主播账号：" >
                        <el-input :size="$size" v-model="searchForm.anchorAccount" placeholder="请输入主播账号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="申请时间：" >
                        <el-col :span="11">
                            <el-date-picker :size='$size' value-format="timestamp" v-model="searchForm.applyDate1"></el-date-picker>
                        </el-col>
                        <el-col :span="2" style="text-align: center">至</el-col>
                        <el-col :span="11">
                            <el-date-picker :size='$size' value-format="timestamp" v-model="searchForm.applyDate2"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="家族长账号：" >
                        <el-input :size="$size" v-model="searchForm.shaikhAccount" placeholder="请输入家族长账号"></el-input>
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
                 <el-table-column  label="主播安全码" prop="securityCode"></el-table-column>
                 <el-table-column  label="账号" prop="anchorAccount"></el-table-column>
                 <el-table-column  label="主播姓名" prop="anchorRealName"></el-table-column>
                 <el-table-column  label="主播昵称" prop="anchorNickName"></el-table-column>
                 <el-table-column  label="原家族安全码" prop="outSecurityCode"></el-table-column>
                 <el-table-column  label="原家族名称" prop="outFamilyName"></el-table-column>
                 <el-table-column  label="原家族长账号" prop="outFamilyShaikhAccount"></el-table-column>
                 <el-table-column  label="申请时间" width="180">
                      <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="申请转入状态">
                     <template slot-scope="scope">
                         <span :class="getStatusClass(scope.row.inStatus)">{{getInStatus(scope.row.inStatus)}}</span>
                     </template>
                 </el-table-column>
                  <el-table-column  label="申请转出状态">
                     <template slot-scope="scope">
                         <span :class="getStatusClass(scope.row.outStatus)">{{getOutStatus(scope.row.outStatus)}}</span>
                     </template>
                 </el-table-column>
                 <el-table-column  label="操作">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" @click="openPlat(scope.row.id)" 
                         :disabled="!(scope.row.outStatus === 'platform')" v-permission="'hostListHandle'">平台介入</el-button>
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
            tableData: [],
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
            setDialog: false,
            merchantCode: '',
            anchorId: '',
            confirmLoading: false,
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
          searchData: state => state.liveFamily.interventionCommit
        })
    },
    methods: {
        ...mapMutations({
            setInterventionCommit: "liveFamily/setInterventionCommit"
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
        getInStatus(val) {
          switch(val) {
            case 'apply':
                return '申请加入';
            case 'refuse':
                return '拒绝加入';
            case 'agree':
                return '同意加入'
          }
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
                securityCode: this.searchForm.securityCode,
                anchorNickName: this.searchForm.anchorName,
                anchorAccount: this.searchForm.anchorAccount,
                outFamilyShaikhAccount: this.searchForm.shaikhAccount,
                enterDate1: this.searchForm.applyDate1 / 1000,
                enterDate2: this.searchForm.applyDate2 / 1000
            }
            this.loading = true
            this.$http.get(this.$api.outFamilyAnchorQPage, paramList, true)
            .then(res => {
                this.setInterventionCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}))
                this.loading = false;
                this.tableData = res.data;
                console.log(this.tableData)
                this.pageData.total = res.total ? res.total : this.pageData.total
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
        closeDialog() {
            this.setDialog = false;
        },
        openPlat(id) {
            this.id = id
            this.platDialog = true
        },
        closePlat() {
            this.platDialog = false
        },
        handleSuccess() {
            this.successLoading = true
            this.$http.post(this.$api.outFamilyAnchorAgree, {id: this.id}, true)
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
            this.$http.post(this.$api.outFamilyAnchorRefuse, {id: this.id}, true)
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
        // handleIntervention(id) { // 平台介入
        //     this.$confirm('请确定是否通过', '平台介入操作', {
        //         distinguishCancelAndClose: true,
        //         confirmButtonText: '通过',
        //         cancelButtonText: '不通过',
        //         type: 'warning',
        //         center: true
        //     })
        //     .then(() => {
        //         this.$http.post(this.$api.outFamilyAnchorAgree, {id: id}, true)
        //         .then(res => {// 平台通过
        //             this.$message.success("操作成功")
        //             this.confirmLoading = false
        //             this.getInterventionList();
        //         })
        //         .catch(err => {
        //             this.$message.error(err.message)
        //             this.confirmLoading = false
        //         })
        //     })
        //     .catch( action => { //平台不通过
        //         console.log(action)
        //         if(action === 'cancel') {
        //             this.$http.post(this.$api.outFamilyAnchorRefuse, {id: id}, true)
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

