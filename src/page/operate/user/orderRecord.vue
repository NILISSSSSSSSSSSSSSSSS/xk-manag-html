<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>订单记录
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="getUserList">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="充值单号：" >
                        <el-input :size="$size" v-model="searchForm.withdrawalId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户ID：" >
                        <el-input :size="$size" v-model="searchForm.hostId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品类别：" >
                        <el-input :size="$size" v-model="searchForm.hostId"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="申请日期：">
                      <el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期"
                                      end-placeholder="结束日期" :size="$size" style="width: 100%">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="选择时间：">
                      <el-select v-model="searchForm.timeRange" :size="$size" style="width: 100%">
                        <el-option v-for="item in timeRange" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="选择订单类型：">
                      <el-select v-model="searchForm.type" :size="$size" style="width: 100%">
                        <el-option v-for="item in type" :key="item" :label="item" :value="item"></el-option>
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
        <el-table :data="tableData" width="100%" stripe class="margintop20">
            <el-table-column  label="订单ID" prop="order"></el-table-column>
            <el-table-column  label="子单ID" prop="order"></el-table-column>
            <el-table-column  label="商品ID" prop="order"></el-table-column>
            <el-table-column  label="商品名称" prop="order"></el-table-column>
            <el-table-column  label="商品类别" prop="order"></el-table-column>
            <el-table-column  label="商品金额" prop="order"></el-table-column>
            <el-table-column  label="数量" prop="order"></el-table-column>
            <el-table-column  label="交易总金额" prop="order"></el-table-column>
            <el-table-column  label="订单状态" prop="order"></el-table-column>
            <el-table-column  label="支付方式" prop="order"></el-table-column>
            <el-table-column  label="交易时间" prop="order"></el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="orderDetails">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination></pagination>
      </div>

  </div>
</template>
<script>
export default {
    name: "orderRecord",
    data() {
      return {
        labelPosition: "right",
        timeRange: ["最近3天", "最近一周", "最近一月"],
        type: ["夺奖派对订单","自营商城订单","商圈订单"],
        searchForm: [],
        tableData: [{
          order: "xxx"
        }]
      }
    },
    methods: {
      resetForm() {
        this.searchForm = [];
      },
      orderDetails() {
        this.$router.push({path: "/memOrderDetails"});
      }
    }
}

</script>

<style lang="scss" scoped>

</style>
