<template>
  <div class="xk-radius">
      <div class='xk-title'>
        <div class="vus-title">
            <span></span>文字监管
        </div>
          <div class="vus-btn">
              <el-button type="primary" :size="$size" @click="getUserList">搜索</el-button>
              <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
          </div>
          <div class="vus-bottom"></div>
      </div>
      <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
          <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="敏感词：" >
                    <el-input :size="$size" v-model="personal.withdrawalId" placeholder="请输入用户ID"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="用户ID：" >
                    <el-input :size="$size" v-model="personal.hostId" placeholder="请输入用户名称"></el-input>
                </el-form-item>
            </el-col>
              <el-col :span="8">
                <el-form-item label="发布日期：">
                    <el-date-picker v-model="personal.date" type="daterange" start-placeholder="开始日期"
                                    end-placeholder="结束日期" :size="$size" style="width: 100%">
                    </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="发布时间：">
                  <el-date-picker v-model="personal.date" type="daterange" start-placeholder="开始日期"
                                  end-placeholder="结束日期" :size="$size" style="width: 100%">
                  </el-date-picker>
              </el-form-item>
            </el-col>
              <el-col :span="8">
                  <el-form-item label="类型：">
                    <el-select v-model="personal.timeRange" :size="$size" style="width: 100%">
                      <el-option v-for="item in timeRange" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
      </el-form>
  </div>
  <div class="xk-radius margintop20">
      <div class="xk-title">
          <div class="vus-title">
              <span></span>列表
          </div>
          <div class="vus-bottom"></div>
      </div>
      <el-table :data="tableData" width="100%" stripe class="margintop20">
          <el-table-column type="selection" width="55px"></el-table-column>
          <el-table-column  label="用户ID" prop="order"></el-table-column>
          <el-table-column  label="用户名称" prop="name"></el-table-column>
          <el-table-column  label="发布时间" prop="userId"></el-table-column>
          <el-table-column  label="敏感词" prop="userName"></el-table-column>
          <el-table-column  label="评论发布内容" prop="type"></el-table-column>
          <el-table-column  label="类型" prop="origin"></el-table-column>
          <el-table-column  label="查看详情"  fixed="right">
              <template slot-scope="scope">
                  <el-button type="text" :size="$size" @click="handleDetail">查看详情</el-button>
              </template>
          </el-table-column>
          <el-table-column  label="涉敏感"  fixed="right">
              <template slot-scope="scope">
                  <el-button type="text" :size="$size" @click="handleDetail">是</el-button>
                  <el-button type="text" :size="$size" @click="handleDelete">否</el-button>
              </template>
          </el-table-column>
      </el-table>
      <pagination :currentPage="CurrentPage" :pageSize="PageSize" :total="total" @change=changePage></pagination>
  </div>
</template>
<script>
    export default {
        name: "textRegulation",
        data() {
          return {
            labelPosition: "right",
            searchForm: {
                withdrawalId: '',
                hostId: '',
                hostName: '',
                date: '',
                timeRange: '',
                year: '',
            },
            year: [2018,2017,2016,2015],
            timeRange: ["最近3天", "最近一周", "最近一月"],
            shape: ["全部", "消费", "充值"],
            tableData:[{
              order: "xxx",
              name: "小可"
            }, {
              order: "xxx",
              name: "小可"
            }],
        },
        methods: {
          resetForm() {
            this.searchForm = [];
          }
          changePage0(page,pageSize) {
            [this.currentPage, this.pageSize] = [page, pageSize];
            // this.getMerchantList();
          }
        }
    }
</script>

<style scoped>

</style>
