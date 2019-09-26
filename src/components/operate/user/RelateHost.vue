<template>
   <div class="xk-container">
       <div class="xk-radius">
           <div class="xk-title">
               <div class="vus-title">
                    <span></span>关联主播
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="addHost">新增</el-button>
                    <el-button type="plain" :size="$size" @click="goBack">返回</el-button>
                </div>
           </div>
          <div class="vus-bottom"></div>
       <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
            <el-table-column type="index" width="55px" label="序号"></el-table-column>
            <el-table-column  label="主播ID" prop="id"></el-table-column>
            <el-table-column  label="主播账号" prop="id"></el-table-column>
            <el-table-column  label="主播姓名" prop="id"></el-table-column>
            <el-table-column  label="所属家族" prop="id"></el-table-column>
            <el-table-column  label="关联时间时间" prop="id"></el-table-column>
            <el-table-column  label="账号状态">
                <template slot-scope="scope">
                    {{1213}}
                </template>
            </el-table-column>
            <el-table-column  label="激活" >
                <template slot-scope="scope">
                    <el-button type="text" :size="$size">从关联列表删除</el-button>
                </template>
            </el-table-column>
       </el-table>
       <add-host :dialogVisible.sync="addDialog"></add-host>
       </div>
   </div>
</template>

<script>
import AddHost from "./AddHost"
export default {
  name: "",
  data() {
      return {
          tableData: [],
          addDialog: false
      }
  },
  methods: {
      goBack() {
          this.$router.go(-1);
      },
      addHost() {
          this.addDialog = true
      }
  },
  components: {
      AddHost
  }
}
</script>

<style>
</style>
