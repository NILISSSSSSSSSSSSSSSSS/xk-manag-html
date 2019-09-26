<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>未审核商品
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
                    <el-form-item label="商户类型：" >
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
            <el-table-column  label="审核状态" prop="auditStatus">
              <template slot-scope="scope">
                <span :class="getStatusClass(scope.row.auditStatus)">{{getAuthStatus(scope.row.auditStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审核时间">
              <template slot-scope="scope">
                {{scope.row.applyAuditTime | formatTime}}
              </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" :disabled="scope.row.auditStatus === 'UNAPPROVED'"
                    @click="handleAudit(scope.row.id, scope.row.shopId)" v-permission="'notAuditGoodsAudit'">审核</el-button>
                    <el-button type="text" :disabled="scope.row.onStatus=== 'SYS_DOWN' || scope.row.onStatus=== 'DOWN'? true: false" :loading="scope.row.delLoading" :size="$size" @click="handleDelete(scope.row.id, scope.row.shopId, scope.row)" v-permission="'notAuditGoodsSet'">下架</el-button>
                    <el-button type="text" :size="$size" @click="handleDetail(scope.row.id, scope.row.shopId)" v-permission="'notAuditGoodsDetail'">查看详情</el-button>
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
                  <el-button type="primary" @click="goodsDelete(detailData.base.id,detailData.base.shopId)" :size="$size" :loading="delLoading">确定</el-button>
                 </div>
      </el-dialog>
  </div>
</template>

<script>
import {EnumAuditStatus} from '@/util/publicParams'
import { mapMutations, mapState } from 'vuex'
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        type: [
          {label: "全部", value: ""},
          {label: "服务类", value: "1001"},
          {label: "商品类", value: "1002"},
          {label: "住宿类", value: "1003"},
          {label: "外卖类", value: "1004"},
          {label: "在线购物类", value: "1005"},
        ],
        searchForm: {
          date: ['', '']
        },
        tableData: [],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        detailData: {
          base: {
            goodsName: '',
            auditStatus: ''
          },
          bcleGoodsSkuAttrs: {
              attrList: []
          },
          goodsSkuVOS: []
        },
        loading: false,
        delDialog: false,
        delLoading: false,
        selectionOptions: [],
        options: [],
        num: 1,
        total: 1
      }
    },
    created() {
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getNotAuditList();
    },
    computed: {
      ...mapState({
            searchData: state => state.operateGoods.notAuditGoodsCommit
        })
    },
    methods: {
      ...mapMutations({
            setNotAuditGoodsCommit: "operateGoods/setNotAuditGoodsCommit"
        }),
      resetForm() {
        this.setNotAuditGoodsCommit(null);
        this.searchForm = {date: ["", ""], type: ''};
        this.getNotAuditList();
      },
      delCancle() {
        this.delDialog = false
      },
      // handleDelete() {
      //   this.delDialog = true
      // },
      handleDetail(id, shopId) {
        this.$router.push({path: "/goodsDetails", query:{goodsId: id, shopId: shopId, type: 'detail'}})
      },
      handleAudit(id, shopId) {
        this.$router.push({path: "/goodsDetails", query:{goodsId: id, shopId: shopId, type: 'auth'}})
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
              return "外卖类";
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
        this.getNotAuditList();
      },
        getNotAuditList() { // 待审核列表
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
        this.loading = true;
         this.setNotAuditGoodsCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
        this.$http.get(this.$api.shopGoodsDBOUnauditedQPage, paramList, true)
        .then(res => {
          this.loading = false;
          console.log(res)
          this.tableData = res.data;
          this.pageData.total = res.total ? res.total : 0;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.message);
        })
      },
      changePage(page, pageSize) {
          [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
          this.getNotAuditList();
        },
        handleDelete(id, shopid, row) {
            this.$set(row, 'delLoading', true);
          this.$http.get(this.$api.shopDBOGoodsDetail, {id: id, shopId: shopid}, true)
          .then(res => {
              this.$set(row, 'delLoading', false);
            this.detailData = res;
            this.delDialog = true
          })
          .catch(err => {
              this.$set(row, 'delLoading', false);
            this.$message.error(err.message)
          })
        },
        goodsDelete(id, shopId) {
          this.delLoading = true
         this.$http.get(this.$api.shopDBOGoodsUnshelve, {id: id, shopId: shopId}, true)
         .then(res => {
           this.$message.success("商品下架成功");
           this.delLoading  =false;
           this.delDialog = false;
           this.getNotAuditList();
         })
         .catch(err => {
           this.$message.error(err.message);
           this.delLoading = false;
           this.delDialog = false;
           this.getNotAuditList();
         })
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
