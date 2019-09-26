<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>查看商品
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
                    <el-form-item label="品类：" >
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
                                      end-placeholder="结束日期" :size="$size" style="width: 100%">
                      </el-date-picker>
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
            <el-table-column  label="零售价格（元）" prop="price"></el-table-column>
            <el-table-column  label="商品状态" prop="onStatus">
              <template slot-scope='scope'>
                 <span :class="getGoodsClass(scope.row.onStatus)">{{getGoodsStatus(scope.row.onStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审核状态" prop="auditStatus">
              <template slot-scope="scope">
                <span :class="getStatusClass(scope.row.auditStatus)">{{getAuthStatus(scope.row.auditStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="提审时间">
              <template slot-scope="scope">
                {{scope.row.applyAuditTime | formatTime}}
              </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="goodsUnline(scope.row.id, scope.row.shopId)">下架</el-button>
                    <el-button type="text" :size="$size" @click="goodsDetail(scope.row.id, scope.row.shopId)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>

  </div>
</template>
<script>
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
          {label: '在线购物类', value: '1005'}
        ],
        searchForm: {
          date: ['', '']
        },
        tableData: [],
        loading: false,
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        }
      }
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      resetForm() {
        this.searchForm = {date: ['', '']};
        this.getGoodsList();
      },
      search() {
        this.pageData.currentPage = 1;
        this.getGoodsList();
      },
      getGoodsList() {
        this.loading = true
        let date0 = new Date(this.searchForm.date[0]);
        let date1 = new Date(this.searchForm.date[1]);
        let startTime = date0.getTime()/1000;
        let endTime = date1.getTime()/1000;
        let paramList = {
            condition: {
              shopId: this.$route.query.id,
              name: this.searchForm.name,
              id: this.searchForm.id,
              category: this.searchForm.type,
              start: startTime,
              end: endTime
            },
            page: this.pageData.currentPage,
            limit: this.pageData.pageSize
        }
        console.log(paramList)
        this.$http.get(this.$api.merchantGoodsQPage, paramList, true)
        .then(res => {
            this.loading = false;
            this.tableData = res.data
            console.log(res)
            this.pageData.total = res.total
        })
        .catch(err => {
            this.loading = false
            this.$message.error(err.message)
        })
      },
       changePage(page, pageSize) { // 分页
          [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
          this.getGoodsList();
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
      goodsUnline(id, shopId) {
        let paramList = {
          id: id,
          shopId: shopId
        }
        this.$confirm("确认下架商品？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.post(this.$api.shopDBOGoodsUnshelve, paramList, true)
            .then(res => {
                this.$message.success("下架成功")
                this.getGoodsList();
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        })
        .catch(() => {
            this.$message.info("已取消")
        })
      },
      goodsDetail(goodsId, shopId) {
          this.$router.push({path: '/goodsDetails', query: {goodsId: goodsId, shopId: shopId}})
      }
    }
}

</script>

<style lang="scss" scoped>
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
