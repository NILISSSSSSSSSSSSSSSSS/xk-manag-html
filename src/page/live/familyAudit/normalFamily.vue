<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>家族管理
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form  label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="家族名称：" >
                        <el-input :size="$size" v-model="searchForm.familyName" placeholder="请输入家族名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主播数量：" >
                      <el-col :span="11">
                          <el-form-item>
                              <el-input :size="$size" v-model="searchForm.num1"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="2" style="text-align: center">至</el-col>
                      <el-col :span="11">
                          <el-form-item>
                              <el-input :size="$size" v-model="searchForm.num2"></el-input>
                          </el-form-item>
                      </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="家族安全码：" >
                        <el-input :size="$size" v-model="searchForm.securityCode" placeholder="请输入家族安全码"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="家族长姓名：" >
                        <el-input :size="$size" v-model="searchForm.shaikhRealName" placeholder="请输入家族长姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="入驻时间：" >
                      <el-col :span="11">
                          <el-form-item>
                              <el-date-picker :size="$size" v-model="searchForm.enterDate1" value-format="timestamp"></el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :span="2" style="text-align: center">至</el-col>
                      <el-col :span="11">
                          <el-form-item>
                              <el-date-picker :size="$size" v-model="searchForm.enterDate2" value-format="timestamp"></el-date-picker>
                          </el-form-item>
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
                 <el-table-column  type="selection"></el-table-column>
                 <el-table-column  label="家族名称" prop="familyName"></el-table-column>
                 <el-table-column  label="家族安全码" prop="securityCode"></el-table-column>
                 <el-table-column  label="家族长姓名" prop="shaikhNikName"></el-table-column>
                 <el-table-column  label="家族长账号" prop="xkAccount"></el-table-column>
                 <el-table-column  label="旗下主播">
                     <template slot-scope="scope">
                         <el-button :size="$size" type="text" @click="goHost(scope.row.merchantId)">{{scope.row.anchorNum}}</el-button>
                     </template>
                 </el-table-column>
                 <el-table-column  label="入驻时间" width="180">
                     <template slot-scope="scope">
                         {{scope.row.createdAt | formatTime}}
                     </template>
                 </el-table-column>
                 <!-- <el-table-column  label="总收入" prop="totalIncome"></el-table-column>
                 <el-table-column  label="当月收入" prop="monthIncome"></el-table-column> -->
                 <!-- <el-table-column  label="考核结果" prop="evaluationResult"></el-table-column> -->
                 <el-table-column  label="是否开放控制权限" prop="controlAnchor"></el-table-column>
                 <el-table-column  label="状态">
                     <template slot-scope="scope">
                         <span :class="getStatusClass(scope.row.bizStatus)">{{scope.row.bizStatus === 'enable' ? '激活': '冻结'}}</span>
                     </template>
                 </el-table-column>
                 <el-table-column  label="操作">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" v-if="scope.row.bizStatus=== 'enable'" @click="handleDisabled(scope.row)"
                         v-permission="'normalFamilyHandle'">冻结</el-button>
                         <el-button type="text" :size="$size" v-if="scope.row.bizStatus === 'disable'" @click="handleActive(scope.row)"
                         v-permission="'normalFamilyHandle'">激活</el-button>
                         <el-button type="text" :size="$size" @click="handleDetail(scope.row.merchantId)"
                         v-permission="'normalFamilyDetail'">查看详情</el-button>
                     </template>
                 </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    name: "normalFamily",
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
            searchForm: {}
        }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getNormalFamilyList();
    },
    computed: {
        ...mapState({
          searchData: state => state.liveFamily.normalFamilyCommit
        })
    },
    methods: {
        ...mapMutations({
            setNormalFamilyCommit: "liveFamily/setNormalFamilyCommit"
        }),
        resetForm() { // 重置搜索
            this.searchForm = {
            }
            this.search();
        },
        search() {
            this.pageData.currentPage = 1;
            this.getNormalFamilyList();
        },
        handleDetail(id) {
            this.$router.push({path: '/familyDetail', query: {id: id, type: 'normal'}})
        },
        goHost(id) {
            console.log(id)
            this.$router.push({path: '/hostList', query: {id: id, source: 'family'}})
        },
        getStatusClass(val) {
            switch(val) {
                case "enable":
                    return 'success';
                case "disable":
                    return 'danger';
            }
      },
        getNormalFamilyList() { // 普通家族审核列表
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                familyName: this.searchForm.familyName,
                anchorNum1: this.searchForm.num1 * 1,
                anchorNum2: this.searchForm.num2 * 1,
                securityCode: this.searchForm.securityCode,
                enterDate1: this.searchForm.enterDate1 / 1000,
                enterDate2: this.searchForm.enterDate2 / 1000,
                shaikhRealName: this.searchForm.shaikhRealName,
                shaikhAccount: this.searchForm.shaikhAccount,
                familyL2Id: this.$route.query.familyL2Id
            }
            console.log(paramList);
            this.loading = true
            this.$http.get(this.$api.familyL1ManageQPage, paramList, true)
            .then(res => {
                this.setNormalFamilyCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}))
                this.loading = false;
                console.log(res.data)
                this.tableData = res.data;
                // if(!res.data) {
                //     return;
                // } else {
                //     for(let data of res.data) { // 获取家族名
                //         if(!data.params) {
                //             return;
                //         } else {
                //             for(let item of data.params) {
                //                 if(item.key === 'familyName') {
                //                     data.familyName = item.value
                //                 }
                //             }
                //         }
                //     }
                // }
                this.pageData.total = res.total ? res.total : this.pageData.total
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page,pageSize) { //分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getNormalFamilyList();
        },
        handleActive(val) {
            this.$confirm("确认激活该家族？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let paramList = {
                    merchantId: val.merchantId,
                }
                this.$http.get(this.$api.familyL1ManageActivation, paramList, true)
                .then(res => {
                    this.$message.success("激活成功");
                    this.getNormalFamilyList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消激活")
            })
        },
        handleDisabled(val) {
            this.$confirm("确认冻结该家族？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let paramList = {
                    merchantId: val.merchantId,
                }
                this.$http.get(this.$api.familyL1ManageFreeze, paramList, true)
                .then(res => {
                    this.$message.warning("冻结成功")
                    this.getNormalFamilyList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消冻结")
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
