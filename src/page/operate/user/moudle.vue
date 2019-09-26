<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>用户充值记录
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
            <el-table-column type="selection" width="55px"></el-table-column>
            <el-table-column  label="充值单号" prop="order"></el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="handleDetail">查看详情</el-button>
                    <el-button type="text" :size="$size" @click="handleDelete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination></pagination>
      </div>

  </div>
</template>
<script>
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        searchForm: [],
        tableData: [{
          order: "xxx"
        }, {
          order: "xxx"
        }, {
          order: "xxx"
        }]
      }
    },
    methods: {
      resetForm() {
        this.searchForm = [];
      }
    }
}

</script>

<style lang="scss" scoped>

</style>
