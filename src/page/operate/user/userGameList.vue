<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>游戏列表
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
                    <el-form-item label="游戏ID：" >
                        <el-input :size="$size" v-model="searchForm.gameId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="游戏名称：" >
                        <el-input :size="$size" v-model="searchForm.gameName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="用户ID：" >
                        <el-input :size="$size" v-model="searchForm.userId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="兑换状态：" >
                        <el-select v-model="searchForm.exchangeStatus" :size="$size">
                          <el-option v-for="item in paymentStatus" :key="item" :label="item.label" :value="item.key"></el-option>
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
            <el-table-column type="index" label="序号" width="55px"></el-table-column>
            <el-table-column  label="游戏ID" prop="gameId"></el-table-column>
            <el-table-column  label="游戏名称" prop="gameName"></el-table-column>
            <el-table-column  label="用户ID" prop="userId"></el-table-column>
            <el-table-column  label="兑换数量" prop="channelAmount"></el-table-column>
            <el-table-column  label="兑换方式" :formatter="formatPayChannel"></el-table-column>
            <el-table-column  label="实际支付" prop="payAmount"></el-table-column>
            <!-- <el-table-column  label="汇率" prop=""></el-table-column>
            <el-table-column  label="兑换时间" prop="createdAt"></el-table-column>
            <el-table-column  label="兑换状态" prop="exchangeStatus"></el-table-column> -->
            <el-table-column  label="汇率" prop="">
                <tempalte slot-scope="scope">
                    {{scope.row.channelAmount}} : {{scope.row.payAmount}}
                </tempalte>
            </el-table-column>
            <el-table-column  label="兑换时间" prop="createdAt">
                <template slot-scope="scope">
                  {{scope.row.createdAt | formatTime}}
                </template>
            </el-table-column>
            <el-table-column  label="兑换状态" prop="exchangeStatus">
                <template slot-scope="scope">
                  {{getExchangeStatus(scope.row.exchangeStatus)}}
                </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="goGameDetail(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>

  </div>
</template>
<script>
import { ExchangeStatus, EnumPayWay } from '@/util/publicParams';
import { enumFormatter } from '@/util/publicMehotds.js';
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        searchForm: {
        },
        tableData: [],
        loading: false,
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        paymentStatus: ExchangeStatus
      }
    },
    created() {
        this.getGameList();
    },
    methods: {
      search() {
        this.pageData.currentPage = 1;
        this.getGameList();
      },
      resetForm() {
        this.pageData.currentPage = 1
        this.searchForm = {}
        this.getGameList();
      },
       goGameDetail(val) {
        this.$router.push({path: '/userGameDetail', query: {id: val.orderNo}})
      },
      getGameList() {
          let paramList = {
               condition: {
                userId: this.$route.query.id,
                // userId: '5bcd498a03345562632457bd',
                gameId: this.searchForm.gameId,
                gameName: this.searchForm.gameName,
                exchangeStatus: this.searchForm.exchangeStatus	
            },
             page: this.pageData.currentPage,
             limit: this.pageData.pageSize
          }
          console.log(paramList)
          this.loading = true
          this.$http.get(this.$api.gameOrderQPage, paramList, true)
          .then(res => {
                this.loading = false;
                this.tableData = res.data
                console.log(res)
                this.pageData.total = res.total
          })
          .catch(err => {
              this.$message.error(err.message)
              this.loading = false;
          })
      },
      changePage(page,pageSize) { //分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getGameList();
      },
      getExchangeStatus(val) {
          let name = ''
          for(let item of ExchangeStatus) {
            if(val === item.key) {
              name = item.label
            }
          }
          return name;
      },
      formatPayChannel(row) {
          return enumFormatter(row.payChannel, EnumPayWay)
      }
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
