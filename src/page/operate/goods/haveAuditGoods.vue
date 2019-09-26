<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>已审核商品
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
                <el-col :span="8">
                    <el-form-item label="商品ID：" >
                        <el-input :size="$size" v-model="searchForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="类型：" >
                      <el-select v-model="searchForm.type" :size="$size" style="width: 100%">
                        <el-option v-for="item in type" :key="item" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                  <el-form-item label="申核日期：">
                      <el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期"
                                      end-placeholder="结束日期" :size="$size" style="width: 100%" :default-time="['00:00:00', '23:59:59']">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                    <el-form-item label="店铺ID：" >
                        <el-input :size="$size" v-model="searchForm.shopId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="店铺名称：" >
                        <el-input :size="$size" v-model="searchForm.shopName"></el-input>
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
            <el-table-column  label="类型" prop="category">
              <template slot-scope="scope">
                {{getCategory(scope.row.category)}}
              </template>
            </el-table-column>
            <el-table-column  label="商品ID" prop="id"></el-table-column>
            <el-table-column  label="商品名称" prop="name"></el-table-column>
            <el-table-column  label="店铺ID" prop="shopId"></el-table-column>
            <el-table-column  label="店铺名称" prop="shopName"></el-table-column>
            <el-table-column  label="价格（元）">
              <template slot-scope="scope">
                {{ $math.divide(scope.row.price, 100) }}
              </template>
            </el-table-column>
            <el-table-column  label="商品上架状态" prop="onStatus">
              <template slot-scope='scope'>
                 <span :class="getGoodsClass(scope.row.onStatus)">{{getGoodsStatus(scope.row.onStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审核状态" prop="status">
               <template slot-scope="scope">
                <span :class="getStatusClass(scope.row.auditStatus)">{{getAuthStatus(scope.row.auditStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审核时间" prop="applyAuditTime">
              <template slot-scope="scope">
                {{scope.row.applyAuditTime | formatTime}}
              </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" v-permission="'haveAuditGoodsSet'" :disabled="scope.row.onStatus=== 'SYS_DOWN' || scope.row.onStatus=== 'DOWN'? true: false" :size="$size" @click="handleDelete(scope.row.id, scope.row.shopId)">下架</el-button>
                    <el-button type="text" v-permission="'haveAuditGoodsDetail'" :size="$size" @click="handleDetail(scope.row.id, scope.row.shopId)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
       <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>
     <el-dialog :visible.sync="delDialog" title="商品下架" width="600px" top="35vh" class="xk-dialog"
                 :before-close="delCancle">
                 <el-row class="rowClass">
                   <el-col :span="8">商品名称：</el-col>
                   <el-col :span="14">{{detailData.base.goodsName}}</el-col>
                 </el-row>
                 <el-row class="rowClass">
                   <el-col :span="8">规格设置：</el-col>
                   <el-col :span="14">
                     <el-row v-for="attr of detailData.bcleGoodsSkuAttrs.attrList" :key="attr">
                        <div v-for="attrSon of attr.attrValues" :key="attrSon" style="margin-bottom:10px">
                            <span style="margin-right: 10px">{{attr.name}}</span>
                            <span style="margin-right: 10px">{{attrSon.code}}</span>
                            <span style="margin-right: 10px">{{attrSon.name}}</span>
                        </div>
                      </el-row>
                   </el-col>
                 </el-row>
                 <el-row class="rowClass">
                   <el-col :span="8">价格设置：</el-col>
                   <el-col :span="14">
                     <div v-for="goods of detailData.goodsSkuVOS" :key="goods" style="margin-bottom: 10px">
                                 <span style="margin-right: 10px">{{goods.skuCode}}</span>
                                 <span style="margin-right: 10px">{{goods.skuName}}</span>
                                 <span style="margin-right: 10px">{{goods.originalPrice}}元</span>
                          </div>
                   </el-col>
                 </el-row>
                 <el-row class="rowClass">
                   <el-col :span="8">是否审核：</el-col>
                    <el-col :span="14">
                      <span :class="getStatusClass(detailData.base.auditStatus)">{{getAuthStatus(detailData.base.auditStatus)}}</span>
                    </el-col>
                 </el-row>
                 <el-row class="rowClass">
                   <el-col class="content">是否对该商品下架？</el-col>
                 </el-row>
                 <div class="content">
                    <el-button type="plain" @click="delCancle" :size="$size">取消</el-button>
                  <el-button type="primary" @click="goodsDelete(detailData.base.id, detailData.base.shopId)" :size="$size" :loading="delLoading">确定</el-button>
                 </div>
      </el-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        type: ["全部", "服务类", "商品类", "外卖类","住宿类"],
        type: [
          {label: "全部", value: ""},
          {label: "服务类", value: "1001"},
          {label: "商品类", value: "1002"},
          {label: "住宿类", value: "1003"},
          {label: "外卖类", value: "1004"},
          {label: '在线购物类', value: '1005'}
        ],
        searchForm: {
          date: ['', ''],
          type: ''
        },
        tableData: [],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading: false,
        delDialog: false,
         detailData: { // 初始化默认信息
            base: {
                category: {
                    goodsTypeId: '',
                    goodsName: '',
                    reservation: '',
                    mainPic: '',
                    showPics: [],
                    details: '',
                    auditStatus: ''
                }
            },
            bcleGoodsSkuAttrs: {
               attrList: []
            },
            goodsSkuVOS: []
        },
      }
    },
    created() {
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getHaveAuditGoods();
    },
    computed: {
        ...mapState({
            searchData: state => state.operateGoods.haveAuditGoodsCommit
        })
    },
    methods: {
      ...mapMutations({
            setHaveAuditGoodsCommit: "operateGoods/setHaveAuditGoodsCommit"
        }),
      resetForm() {
        this.setHaveAuditGoodsCommit(null);
        this.searchForm = {
          date: ["", ""],
          type: ''
        },
        this.pageData.currentPage = 1;
        this.getHaveAuditGoods();
      },
      delCancle() {
        this.delDialog = false
      },
      handleDelete() {
        this.delDialog = true
      },
      handleDetail(id, shopId) {
        this.$router.push({path: '/goodsDetails', query:{goodsId: id, shopId: shopId, type: 'detail'}})
      },
      getCategory(val) {
          switch(val) {
            case "1001":
              return "服务类";
            case "1002":
              return "商品类";
            case "1003":
              return "住宿类";
            case "1004":
              return "外卖类"
            case "1005":
              return "在线购物类"
          }
        },
       getAuthStatus(val) {
          switch(val) {
            case "VERIFIED":
              return '已审核';
            case "UNAUDITED":
              return '待审核';
            case "UNAPPROVED":
              return '未通过';
          }
      },
      getGoodsStatus(val) { // 商品上下架状态
        switch(val) {
            case "UP":
              return '上架';
            case "DOWN":
              return '下架';
            case "SYS_DOWN":
              return '系统下架';
          }
      },
      getGoodsClass(val) {
        switch(val) {
            case "UP":
              return 'success';
            case "DOWN":
              return 'warning';
            case "SYS_DOWN":
              return 'danger';
          }
      },
      getStatusClass(val) {
          switch(val) {
            case "VERIFIED":
              return 'success';
            case "UNAUDITED":
              return 'warning';
            case "UNAPPROVED":
              return 'danger';
          }
      },
      search() {
        this.pageData.currentPage = 1;
        this.getHaveAuditGoods();
      },
      getHaveAuditGoods() { //已审核商品列表
        console.log(this.searchForm.date)
        let date0 = new Date(this.searchForm.date[0]);
        let date1 = new Date(this.searchForm.date[1]);
        let startTime = date0.getTime()/1000;
        let endTime = date1.getTime()/1000;
        let paramList = {
          limit: this.pageData.pageSize,
          page: this.pageData.currentPage,
          condition: {
            id: this.searchForm.id,
            name: this.searchForm.name,
            category: this.searchForm.type,
            start: startTime,
            end: endTime,
            shopId: this.searchForm.shopId,
            shopName: this.searchForm.shopName
          }
        }
        console.log(paramList)
        this.loading = true
        // this.setHaveAuditGoodsCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
          this.$http.get(this.$api.shopGoodsDBOVerifiedQPage, paramList, true)
          .then(res => {
              this.loading = false
              this.tableData = res.data;
              this.pageData.total = res.total ? res.total : 0
              console.log("res")
              console.log(res);
              console.log(this.tableData)
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err.message)
          })
        },
        handleDelete(id, shopid) { // 下架的详情
          this.$http.get(this.$api.shopDBOGoodsDetail, {id: id, shopId: shopid}, true)
          .then(res => {
            console.log(1222)
            console.log(res)
            this.detailData = res
            this.delDialog = true
          })
          .catch(err => {
            this.$message.error(err.message)
          })
        },
        goodsDelete(id, shopId) { // 确认下架
          this.delLoading = true
         this.$http.get(this.$api.shopDBOGoodsUnshelve, {id: id, shopId: shopId}, true)
         .then(res => {
           this.$message.success("商品下架成功");
           this.delLoading  =false;
           this.delDialog = false;
           this.getHaveAuditGoods();
         })
         .catch(err => {
           this.$message.error(err.message);
           this.delLoading = false;
           this.delDialog = false;
           this.getHaveAuditGoods();
         })
        },
        changePage(page, pageSize) { // 分页
          [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
          this.getHaveAuditGoods();
        }
      } 
    }

</script>

<style lang="scss" scoped>
.rowClass {
  margin-bottom: 20px;
}
.content {
  margin: 0 auto;
  text-align: center;
}
.city {
  margin-left:70px;
  margin-bottom: 14px;
}
.danger {
  color: #F58C8C;
}
.warning {
  color:#E8A23C;
}
.success {
 color: #87C23A;
}
</style>
