<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>商户审核
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="getMerchantAuditList">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="商户ID：" >
                        <el-input :size="$size" v-model="searchForm.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商户名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码：" >
                        <el-input :size="$size" v-model="searchForm.phone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="审核状态：">
                      <el-select v-model="searchForm.status" :size="$size" style="width: 100%">
                        <el-option v-for="item in status" :key="item" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商户类型：" >
                      <el-select v-model="searchForm.merchantType" :size="$size" style="width: 100%">
                        <el-option v-for="item in type" :key="item" :label="item.label" :value="item.value"></el-option>
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
            <el-table-column  label="商户ID" prop="merchantCode"></el-table-column>
            <el-table-column  label="商户名称" prop="name"></el-table-column>
            <el-table-column  label="商户类型" prop="merchantType">
              <template slot-scope="scope">
                <span>{{getmerchantTypes(scope.row.merchantType)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="负责人" prop="realName"></el-table-column>
            <el-table-column  label="手机号码" prop="phone"></el-table-column>
            <el-table-column  label="审核状态" prop="firstAuthStatus">
              <template slot-scope="scope">
                <span :class="getStatusClass(scope.row.firstAuthStatus)">{{getAuthStatus(scope.row.firstAuthStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="handleAudit(scope.row.id, scope.row.merchantType)" 
                    v-show="scope.row.firstAuthStatus ==='SUBMIT'">审核</el-button>
                    <el-button type="text" :size="$size" @click="handleDetails(scope.row.id, scope.row.merchantType)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
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
        status:[{
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
        type: [{
          label: '全部',
          value: ''
        }, {
          label: '推广人员',
          value: 'EXTENSION_WORKER'
        }, {
          label: '主播',
          value: 'ZHUBO'
        }, {
          label: '商户',
          value: 'MERCHANT'
        }, {
          label: '合伙人',
          value: 'PARTNER'
        }, {
          label: '经济公司',
          value: 'BROKERAGE_FIRM'
        }],
        searchForm: {
          status: "",
          merchantType: ""
        },
        tableData: [],
        // firstAuthStatus: '',
        pageData: {
          currentPage: 1,
          pageSize: 10,
          total: '',
        },
        // currentPage: 1,
        // pageSize: 10,
        // total: '',
        statusClass: ''
      }
    },
    created() {
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getMerchantAuditList();
    },
    computed: {
      ...mapState({
        searchData: state => state.operateUser.merchantAuditCommit
      })
    },
    methods: {
      ...mapMutations({
        setMerchantAuditCommit: "operateUser/setMerchantAuditCommit"
      }),
      resetForm() {
        this.setMerchantAuditCommit(null);
        this.searchForm = {status: "", merchantType: ""};
        this.pageData.currentPage = 1;
        this.getMerchantAuditList();
      },
      getmerchantTypes(val) {
        switch(val) {
          case 'EXTENSION_WORKER':
              return '推广人员';
              break;
          case 'ZHUBO':
              return '主播';
              break;
          case 'MERCHANT':
              return '商户';
              break;
          case 'PARTNER':
              return '合伙人';
          case 'BROKERAGE_FIRM':
              return '经济公司';
              break;
        }
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
      getMerchantAuditList() { // 商户审核列表
        let paramList = {
          limit: this.pageData.pageSize,
          page: this.pageData.currentPage,
          merchantCode: this.searchForm.code,
          merchantName: this.searchForm.name,
          merchantType: this.searchForm.merchantType,
          phone: this.searchForm.phone,
          firstAuthStatus: this.searchForm.status
        }
        this.loading = true
        this.setMerchantAuditCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
        this.$http.get(this.$api.merchantQPage, paramList, true)
        .then(res => {
          this.loading = false;
          console.log(res.data)
          this.tableData = res? res.data: [];
          this.pageData.total = res ? res.total : 0
        })
        .catch(err => {
            this.loading = false;
            this.$message.error("获取商户列表失败");
        })
      },
       changePage(page,pageSize) { //分页
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getMerchantAuditList();
      },
      handleAudit(id, type) {  // 审核跳转
        // switch(type) {
        //   case "EXTENSION_WORKER":
        //     this.$router.push({path: "/promoteAuditDetails", query:{mAuthResultId: id, merchantType: 'EXTENSION_WORKER'}});
        //     break;
        //   case "ZHUBO":
        //     this.$router.push({path: "/hostAuditDetails", query:{mAuthResultId: id, merchantType: 'ZHUBO'}});
        //     break;
        //   case "MERCHANT":
        //     this.$router.push({path: "/merchantAuditAudit", query:{mAuthResultId: id, merchantType: 'MERCHANT'}});
        //     break;
        //   case "PARTNER":
        //     this.$router.push({path: "/partnerAuditDetails", query:{mAuthResultId: id, merchantType: 'PARTNER'}});
        //     break;
        //   case "BROKERAGE_FIRM":
        //     this.$router.push({path: "/partnerAuditDetails", query:{mAuthResultId: id, merchantType: 'BROKERAGE_FIRM'}});
        //     break;
        // }
        this.$router.push({path: "/merchantAuditAudit", query: {mAuthResultId: id, merchantType: type}})
      },
      handleDetails(id, type) { // 商户详情页跳转
          this.$router.push({path: "/merchantAuditDetails", query: {mAuthResultId: id, merchantType: type}})
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

</style>
