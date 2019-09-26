<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>推荐主播列表
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form  label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="主播昵称：" >
                        <el-input :size="$size" v-model="searchForm.nickName" placeholder="请输入主播昵称"></el-input>
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
                <!-- <el-col :span="8">
                    <el-form-item label="家族长姓名：" >
                        <el-input :size="$size" v-model="searchForm.leaderName	" placeholder="请输入族长姓名"></el-input>
                    </el-form-item>
                </el-col> -->
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
                <!-- <el-col :span="8">
                    <el-form-item label="家族长账号：" >
                        <el-input :size="$size" v-model="searchForm.leaderAccount" placeholder="请输入家族账号"></el-input>
                    </el-form-item>
                </el-col> -->
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
                 <el-table-column  label="主播ID" prop="merchantCode"></el-table-column>
                 <el-table-column  label="主播账号" prop="xkAccount"></el-table-column>
                 <el-table-column  label="主播姓名" prop="realName"></el-table-column>
                 <el-table-column label="主播昵称" prop="nickName"></el-table-column>
                 <!-- <el-table-column  label="总贡献" prop="totalContribution">
                     <template slot-scope="scope">
                         {{scope.row.totalContribution ? scope.row.totalContribution : '--'}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="本月贡献" prop="monthContribution">
                     <template slot-scope="scope">
                         {{scope.row.monthContribution ? scope.row.monthContribution : '--'}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="直播总时长" prop="totalDuration">
                     <template slot-scope="scope">
                         {{scope.row.totalDuration ? scope.row.totalDuration : '--'}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="小视频个数" prop="totalVideoNum">
                     <template slot-scope="scope">
                         {{scope.row.totalVideoNum? scope.row.totalVideoNum : '--'}}
                     </template>
                 </el-table-column> -->
                 <el-table-column label="推荐等级" prop="recommendLevel">
                      <template slot-scope="scope">
                         {{getLevel(scope.row.recommendLevel)}}
                     </template>
                 </el-table-column>
                 <el-table-column label="推荐状态">
                     <template slot-scope="scope">
                         <span :class="getStatusClass(scope.row.recommendStatus)">{{getAuthStatus(scope.row.recommendStatus)}}</span>
                     </template>
                 </el-table-column>
                 <el-table-column  label="入驻时间" width="180">
                     <template slot-scope="scope">
                         {{scope.row.createdAt | formatTime}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="操作">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" @click="handleDisabled(scope.row.merchantId)" 
                         :disabled="scope.row.recommendStatus != 'SUBMIT'" v-permission="'recommendHostHandle'">不通过</el-button>
                         <el-button type="text" :size="$size" @click="handleSuccess(scope.row.merchantId)" 
                         :disabled="scope.row.recommendStatus != 'SUBMIT'" v-permission="'recommendHostHandle'">通过</el-button>
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
        this.getHostList();
    },
    computed: {
        ...mapState({
          searchData: state => state.liveFamily.hostCommit
        })
    },
    methods: {
        ...mapMutations({
            setHostCommit: "liveFamily/setHostCommit"
        }),
        searchList() {
            this.pageData.currentPage = 1;
            this.getHostList();
        },
        resetForm() { // 重置搜索
            this.searchForm = {
            }
            this.searchList();
        },
        getAuthStatus(val) {
          switch(val) {
            case "SUCCESS":
              return '已审核';
            case "SUBMIT":
              return '待审核';
            case "FAILED":
              return '未通过';
          }
      },
        getStatusClass(val) {
            switch(val) {
                case "SUCCESS":
                return 'success';
                case "SUBMIT":
                return 'warning';
                case "FAILED":
                return 'danger';
            }
      },
      getLevel(val) {
          switch(val) {
              case 'A':
                return 'A级推荐';
              case 'B':
                return 'B级推荐';
              case 'C':
                return 'C级推荐';
              case 'NO':
                return '不推荐';
          }
      },
        getHostList() { // 推荐主播列表
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                anchorNickName: this.searchForm.nickName,
                anchorRealName: this.searchForm.anchorName,
                anchorAccount: this.searchForm.anchorAccount,
                enterDate1: this.searchForm.enterDate1 / 1000,
                enterDate2: this.searchForm.enterDate2 / 1000,
                // shaikhRealName: this.searchForm.leaderName,
                // shaikhAccount: this.searchForm.leaderAccount,
                currentFamilyId: this.$route.query.id
            }
            console.log(paramList)
            this.loading = true
            this.$http.get(this.$api.anchorRecommendPage, paramList, true)
            .then(res => {
                this.setHostCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}))
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
            this.getHostList();
        },
        handleDisabled(id) {
            this.$confirm("确认不通过该申请？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let paramList = {
                        merchantId: id,
                    }
                this.$http.post(this.$api.platformRecommendRefuse, paramList, true)
                .then(res => {
                    this.$message.success("操作成功")
                    this.getHostList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消")
            })
        },
        handleSuccess(id) {
            this.$confirm("确认通过该申请？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let paramList = {
                        merchantId: id,
                    }
                this.$http.post(this.$api.platformRecommendAgree, paramList, true)
                .then(res => {
                    this.$message.success("操作成功")
                    this.getHostList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消")
            })
        },
        Arrtest(val) {
            
        }
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
.info {
    color: #909399;
}
</style>
