<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>店铺列表
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="店铺编号：" >
                        <el-input :size="$size" v-model="searchForm.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="店铺名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码：" >
                        <el-input :size="$size" v-model="searchForm.phone"></el-input>
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
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column  label="店铺编号" prop="code"></el-table-column>
            <el-table-column  label="店铺名称" prop="name"></el-table-column>
            <el-table-column  label="联系电话" width="110px">
                <template slot-scope="scope">
                {{getPhone(scope.row.contactPhones)}}
              </template>
            </el-table-column>
            <el-table-column  label="与本店关系" prop="shopType">
              <template slot-scope="scope">
                {{getShopType(scope.row.shopType)}}
              </template>
            </el-table-column>
            <el-table-column  label="财务是否独立" prop="isSelf">
              <template slot-scope="scope">
                  {{scope.row.isSelf === 1 ? "不独立": "独立"}}
              </template>
            </el-table-column>
            <el-table-column  label="地址" prop="address"></el-table-column>
            <el-table-column  label="店铺状态" prop="authStatus">
              <template slot-scope="scope">
                  <span :class="scope.row.onLine == 0 ? 'warning' : scope.row.onLine == 1 ? 'success' : 'danger'">{{scope.row.onLine == 0 ? '下线' : scope.row.onLine == 1 ? '上线' : '强制下线'}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="查看商品">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="checkGoods(scope.row.shopId)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="goShopDetail(scope.row.shopId)">查看详情</el-button>
                    <el-button type="text" :size="$size" @click="storeOnline(scope.row.shopId)" v-if="scope.row.onLine == -1 || scope.row.onLine==0">上架店铺</el-button>
                    <el-button type="text" :size="$size" @click="storeUnline(scope.row.shopId)" v-else>下架店铺</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>

  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ShopType} from '@/util/publicParams'
export default {
    name: "merchantsDetails",
    data() {
      return {
        dialog: false,
        labelPosition: "right",
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        loading: false,
        searchForm: [],
        tableData: [],
        storeId: ''
      }
    },
    created() {
      this.searchData ? (this.searchForm = this.searchData.searchForm) : null;
      this.getStoreList();
    },
    computed: {
      ...mapState({
        searchData: state => state.operateUser.shopCommit
      })
    },
    methods: {
      ...mapMutations({
        setShopCommit: "operateUser/setShopCommit"
      }),
      search() {
        this.pageData.currentPage = 1;
        this.getStoreList();
      },
      resetForm() {
        this.searchForm = {};
        this.pageData.currentPage = 1;
        this.getStoreList();
      },
      getPhone(val) {
        let phones = ''
        for(let item of val) {
            phones = phones + '  ' + item
        }
        return phones
      },
      getShopType(val) {
          let name = ''
          for(let item of ShopType) {
            if(val === item.key) {
              name = item.label;
              break;
            }
          }
          return name;
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
      getStoreList() {
        let paramList = {
          merchantId: this.$route.query.id,
          name: this.searchForm.name,
          code: this.searchForm.code,
          phone: this.searchForm.phone,
          limit: this.pageData.pageSize,
          page: this.pageData.currentPage
        }
        console.log(paramList)
        this.loading = true
        this.$http.get(this.$api.merchantShopQPage, paramList, true)
        .then(res => {
          this.setShopCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
          this.tableData = res? res.data: [];
          this.pageData.total = res ? res.total : 0
          console.log(res)
          this.loading = false;
        })
        .catch(err => {
            this.loading = false;
            this.$message.error("获取店铺列表失败");
        })
      },
      changePage(page,pageSize) {
        [this.currentPage, this.pageSize] = [page, pageSize];
        this.getStoreList();
      },
      checkGoods(id) {
        this.$router.push({path: '/merCheckGoods', query: {id: id}})
      },
      goShopDetail(id) { // 店铺详情
            this.$router.push({path: '/storeSecAuditInfo', query:{id: id}})
        },
      storeUnline(id) { // 下架店铺
          this.$confirm("确认下架店铺？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
              this.$http.get(this.$api.mShopUnLine, {id: id}, true)
              .then(res => {
                  this.$message.success("下架成功")
                  this.getStoreList();
              })
              .catch(err => {
                  this.$message.error(err.message)
              })
          })
          .catch(() => {
              this.$message.info("已取消")
          })
      },
      storeOnline(id) { // 上架店铺
          this.$confirm("确认上架店铺？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
              this.$http.get(this.$api.mShopOnLine, {id: id}, true)
              .then(res => {
                  this.$message.success("上架成功")
                  this.getStoreList();
              })
              .catch(err => {
                  this.$message.error(err.message)
              })
          })
          .catch(() => {
              this.$message.info("已取消")
          })
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
.content {
  text-align: center;
  font-size: 16px;
}
</style>