<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>店铺审核
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="getStoreAuditList">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="店铺编码：" >
                        <el-input :size="$size" v-model="searchForm.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="店铺名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="审核状态：">
                      <el-select v-model="searchForm.status" :size="$size" style="width: 100%">
                        <el-option v-for="item in status" :key="item" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
      </div>
      <!--table-->
      <div class="xk-radius margintop20">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>列表
          </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
            <el-table-column type="index" width="55px" label="序号"></el-table-column>
            <el-table-column  label="店铺编码" prop="code"></el-table-column>
            <el-table-column  label="店铺名称" prop="name"></el-table-column>
            <el-table-column  label="店铺分类">
              <template slot-scope="scope">
                {{scope.row.industry[0].levelOneCode ? getOnelevel(scope.row.industry[0].levelOneCode) + '/': "无"}}
                {{scope.row.industry[0].levelTwoCode ? getTwolevel(scope.row.industry[0].levelTwoCode) : "无"}}
              </template>
            </el-table-column>
            <el-table-column  label="所属商户名称" prop="merchantName"></el-table-column>
            <el-table-column  label="所属商户ID" prop="mrCode"></el-table-column>
            <el-table-column  label="创建时间" prop="createdAt">
              <template slot-scope="scope">
                   {{scope.row.createdAt | formatTime}}
                </template>
            </el-table-column>
            <el-table-column  label="审核状态" prop="firstAuthStatus ">
                <template slot-scope="scope">
                    <span :class="getStatusClass(scope.row.firstAuthStatus)">{{getAuthStatus(scope.row.firstAuthStatus)}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="storeAuditDetails(scope.row.id)" v-if="scope.row.firstAuthStatus === 'SUBMIT'">审核</el-button>
                    <el-button type="text" :size="$size" @click="storeDetails(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change=changePage></pagination>
      </div>

  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        // status: ["全部", "待审核", "已审核","未通过"],
        status: [{
          label: "全部",
          value: ''
        }, {
          label: '提交认证',
          value: "SUBMIT"
        }, {
          label: '认证成功',
          value: "SUCCESS"
        }, {
          label: '认证失败',
          value: "FAILED"
        }],
        // type: ["全部","推广人员","主播","商户","合伙人"],
        searchForm: {
          status: ""
        },
        tableData: [],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading:false
      }
    },
    created() {
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getIndustryList();
      this.getStoreAuditList();
    },
    computed: {
      ...mapState({
        searchData: state => state.operateUser.shopAuditCommit
      })
    },
    methods: {
      ...mapMutations({
        setShopAuditCommit: "operateUser/setShopAuditCommit"
      }),
      resetForm() {
        this.setShopAuditCommit(null);
        this.searchForm = {status: ""};
        this.getStoreAuditList();
      },
      storeAuditDetails(id) { // 跳转到店铺审核审核
        this.$router.push({path: "/storeAuditDetails", query: {id: id}})
      },
      storeDetails(id) { //跳转到店铺审核详情
        this.$router.push({path: "/storeDetails", query : {id: id}})
      },
      getAuthStatus(val) {
          switch(val) {
            case "SUCCESS":
              return '认证成功';
            case "SUBMIT":
              return '提交认证';
            case "FAILED":
              return '认证失败';
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
      getIndustryList() { // 店铺行业分类
            let industrys = JSON.parse(window.localStorage.getItem("industryAllQList"));
            this.oneLevels = industrys.oneLevel;
            this.twoLevels = industrys.twoLevel;
            console.log(this.oneLevels);
            console.log(this.twoLevels);
        },
        getOnelevel(code) {
            let name = ''
            for(let one of this.oneLevels) {
                if(code == one.code) {
                    name = one.name;
                    break;
                }
            }
            return name;
        },
        getTwolevel(code) {
            let name = "";
            for(let two of this.twoLevels) {
                if(code == two.code) {
                    name = two.name;
                    break;
                }
            }
            return name;
        },
      getStoreAuditList() { // 店铺审核列表
        let paramList = {
          limit: this.pageData.pageSize,
          page: this.pageData.currentPage,
          code: this.searchForm.code,
          name: this.searchForm.name,
          authStatus: this.searchForm.status
        }
        this.loading = true
        this.setShopAuditCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
        this.$http.get(this.$api.mShopAuthQPage, paramList, true)
        .then(res => {
          this.tableData = res.data
          this.pageData.total = res.total ?res.total : this.pageData.total;
          this.loading = false;
          console.log(this.tableData)
        })
        .catch(err => {
          if(err.code === 409) {
              this.tableData = [];
              this.pageData.total = 0;
              this.loading = false
              this.$message("数据为空")
          } else {
            this.loading = false;
            this.$message.error("获取商铺列表失败");
          }
        })
      },
        changePage(page,pageSize) { // 分页请求
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getStoreAuditList();
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
