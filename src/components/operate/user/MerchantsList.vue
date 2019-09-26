<template>
<div>
    <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>联盟商搜索
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="联盟商ID：" >
                        <el-input :size="$size" v-model="searchForm.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联盟商名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联盟商类型：" >
                      <el-select v-model="searchForm.merchantType" :size="$size" style="width: 100%">
                        <el-option v-for="(item, index) in merchantType" :key="index" :label="item.label" :value="item.key"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号码：" >
                        <el-input :size="$size" v-model="searchForm.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联盟商主推城市：" label-width="150px">
                       <province-cascader v-model="searchForm.districtCode"></province-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
      </div>
      <!--table-->
      <div class="xk-radius margintop20">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>联盟商列表
          </div>
          <div class="vus-btn">
          <el-button type="primary" size="small" @click="openBranch">分号查询</el-button>
        </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
            <el-table-column type="index" label="序号" width="55px"></el-table-column>
            <el-table-column  label="联盟商ID" prop="code"></el-table-column>
            <el-table-column  label="联盟商名称" prop="merchantName"></el-table-column>
            <el-table-column  label="联盟商类型">
              <template slot-scope="scope">
                <span>{{getMerchantTypes(scope.row.merchantTypes)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="负责人" prop="name"></el-table-column>
            <el-table-column  label="手机号码" prop="phone"></el-table-column>
            <el-table-column  label="推荐用户" prop="recommendUser"></el-table-column>
            <el-table-column  label="推荐联盟商" prop="recommendMerchant"></el-table-column>
            <el-table-column  label="店铺详情" prop="order">
              <template slot-scope="scope">
                  <el-button type="text" :size="$size" @click="merchantsDetails(scope.row.merchantId)" 
                  :disabled="isMerchant(scope.row.merchantTypes)" v-permission="'merchantsShopSearch'">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column  label="状态" prop="order">
              <template slot-scope="scope">
                  <span :class="scope.row.bizStatus ==='enable' ? 'success': 'danger'">{{scope.row.bizStatus ==='enable' ? '激活': '冻结'}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="merchantDetails(scope.row.merchantId)" v-permission="'merchantsShopSearch'">查看商户详情</el-button>
                    <el-button v-if="scope.row.bizStatus === 'enable'" type="text" :size="$size" @click="handleDisable(scope.row.merchantId)" v-permission="'merchantsShopSearch'">冻结商户</el-button>
                    <el-button v-if="scope.row.bizStatus === 'disable'" type="text" :size="$size" @click="handleActive(scope.row.merchantId)" v-permission="'merchantsShopSearch'">激活商户</el-button>
                    <el-button type="text" :size="$size" @click="goReconmmend(scope.row.securityCode)">推荐详情</el-button>
                    <!--<el-button type="text" :size="$size" @click="merchantDetails(scope.row.merchantId)">查看详情</el-button>
                    <el-button v-if="scope.row.bizStatus === 'enable'" type="text" :size="$size" @click="handleDisable(scope.row.merchantId)">冻结联盟商</el-button>
                    <el-button v-if="scope.row.bizStatus === 'disable'" type="text" :size="$size" @click="handleActive(scope.row.merchantId)">激活联盟商</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>
      <el-dialog :visible.sync='branchDialog' width="800px" title="分号查询">
        <el-form :model="searchBranch">
          <el-form-item>
            <el-input :size="$size" placeholder="请输入安全码/账号/联系人" style="width: 220px;margin-right: 10px" v-model="searchBranch.inputValue"></el-input>
            <el-button :size='$size' type="primary" @click="getBranchData">搜索</el-button>
          </el-form-item>
          <el-table :data="branchData" v-loading="branchLoading" :beforClose="closeBranch">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="安全码" prop="securityCode"></el-table-column>
            <el-table-column label="联系人账号" prop="phone"></el-table-column>
            <el-table-column label="联系人姓名" prop="name"></el-table-column>
            <el-table-column label="分号创建时间">
              <template slot-scope="scope">
                {{scope.row.createdAt | formatTime}}
              </template>
            </el-table-column>
            <el-table-column label="是否主号">
              <template slot-scope="scope">
                {{scope.row.isAdmin == 1 ? '主号': '分号'}}
              </template>
            </el-table-column>
            <el-table-column label="归属身份" width="100px">
              <template slot-scope="scope">
                {{getMerchantTypesOnly(scope.row.merchantType)}}
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div style="text-align: center; margin-top:20px">
            <el-button :size="$size" type='plain' @click="closeBranch">取消</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
// import { mapMutations, mapState } from 'vuex'
import { MerchantTypes } from '@/util/publicParams'
import ProvinceCascader from "@/components/ProvinceCascader"
export default {
    name: "MerchantsList",
    data() {
      return {
        labelPosition: "right",
        searchForm: {
          merchantType: ""
        },
        merchantType: MerchantTypes,
        tableData: [],
        loading: false,
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        branchDialog: false,
        searchBranch: {},
        branchData: [],
        branchLoading: false
      }
    },
    created() {
    //   this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getMerchantList();
    },
    computed: {
    //   // 获取vuex中state.mercahntCommit的值
    //   ...mapState({
    //     searchData: state => state.operateUser.merchantCommit
    //   })
    },
    methods: {
      // getVuexData() {
      //   let vuexData = this.searchData || JSON.stringify(this.searchData)==="{}"
      //         ? this.searchData: {}
      // this.searchForm = vuexData.searchForm
      // // this.pageData = vuexData.page ? vuexData.page : this.pageData
      // },
       // 引用setMerchantCommit方法
    //   ...mapMutations({
    //             setMerchantCommit: "operateUser/setMerchantCommit"
    //         }),
      search() {
        this.pageData.currentPage = 1;
        this.getMerchantList();
      },
      resetForm() {
        this.searchForm = {merchantType: ""};
        this.pageData.currentPage = 1
        this.getMerchantList();
      },
     getMerchantTypes(val) { // 商户类型数组
       let name = ''
       for(let type of val) {
         for(let item of MerchantTypes) {
            if(type === item.key){
              name = item.label + ' ' + name
              break;
            }
          }
       }
       return name;
     },
     getMerchantTypesOnly(val) { // 获取商户的类型(单一)
            let name = '';
            for(let item of MerchantTypes) {
              if(val === item.key) {
                name = item.label
              }
            }
            return name;
          },
     isMerchant(val) {
       let isOK = true
       for(let item of val) {
         if(item === 'shops') {
           isOK = false
           break;
         }
       }
       return isOK;
     },
      getMerchantList() { //商户列表
        let paramList = {
          limit: this.pageData.pageSize, 
          page: this.pageData.currentPage,
          code: this.searchForm.code,
          merchantName: this.searchForm.name,
          merchantType: this.searchForm.merchantType,
          phone: this.searchForm.phone,
          districtCode: this.searchForm.districtCode ? this.searchForm.districtCode[2] : this.searchForm.districtCode,
          securityCode: this.$route.query.code
        }
        console.log(paramList)
        this.loading = true
        // let obj ={searchForm: this.searchForm, page: this.pageData}
        this.$http.get(this.$api.merchantQPage, paramList, true)
        .then(res => {
        //   this.setMerchantCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData})); // 传参，执行变化
          this.loading = false;
          this.tableData = res? res.data: [];
          console.log(res.data)
          // 处理total只是第一次返回的情况
          this.pageData.total = res ? res.total : 0
        })
        .catch(err => {
            this.loading = false;
            this.$message.error(err.message);
        })
      },
      changePage(page,size) {
        // [this.currentPage, this.pageSize] = [page, pageSize];
        this.pageData.pageSize = size;
        this.pageData.currentPage = page;
        this.getMerchantList();
      },
      handleDisable(id) { // 商户冻结
        this.$confirm("确认冻结该商户？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.get(this.$api.merchantDisable, {id: id}, true)
            .then(res => {
              this.$message.success("冻结成功")
              this.getMerchantList();
            })
            .catch(err => {
              this.$message.error(err.message)
              this.getMerchantList();
            })
        })
        .catch(() => {
          this.$message.info("已取消")
        })
      },
      handleActive(id) { // 商户激活
        this.$confirm("确认激活该商户？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.get(this.$api.merchantEnable, {id: id}, true)
            .then(res => {
              this.$message.success("激活成功")
              this.getMerchantList();
            })
            .catch(err => {
              this.$message.error(err.message)
              this.getMerchantList();
            })
        })
        .catch(() => {
          this.$message.info("已取消")
        })
      },
      merchantsDetails(id) { // 到店铺详情,传商户id
        this.$router.push({path: "/memMerchantsDetails", query:{id: id}})
      },
      merchantDetails(id) {  //到商户详情,传商户id
        this.$router.push({path: "/businessDetail", query: {id: id}})
      },
      openBranch() {
          this.searchBranch = {}
          this.branchData = []
          this.branchDialog = true
      },
      closeBranch() {
        this.branchDialog = false;
      },
      getBranchData() { // 搜索分号数据
          let paramList = {
            keyword: this.searchBranch.inputValue
          }
          console.log(paramList)
          this.branchLoading = true
          this.$http.get(this.$api.merchantSemicolonSearch, paramList, true)
          .then(res => {
              this.branchLoading = false
              if(res) {
                if(this.branchData == 0) { // 防止相同值重复push
                  this.branchData.push(res)
                }
              } else {
                  this.branchData = []
              }
          })
          .catch(err => {
            this.branchLoading = false
            this.$message.error(err.message)
          })
      },
      goReconmmend(code) { // 推荐详情
         this.$emit("getCode", code)
         let paramList = {
          limit: this.pageData.pageSize, 
          page: this.pageData.currentPage,
          code: this.searchForm.code,
          merchantName: this.searchForm.name,
          merchantType: this.searchForm.merchantType,
          phone: this.searchForm.phone,
          districtCode: this.searchForm.districtCode ? this.searchForm.districtCode[2] : this.searchForm.districtCode,
          securityCode: code
        }
        console.log(paramList)
        this.loading = true
        this.$http.get(this.$api.merchantQPage, paramList, true)
        .then(res => {
          this.loading = false;
          this.tableData = res? res.data: [];
          console.log(res.data)
          // 处理total只是第一次返回的情况
          this.pageData.total = res ? res.total : 0
        })
        .catch(err => {
            this.loading = false;
            this.$message.error(err.message);
        })
      }
    },
    components: {
        ProvinceCascader
    }
}

</script>

<style lang="scss" scoped>
.success {
  color: #67C23A;
}
.danger {
  color: #F56C6C;
}
</style>

