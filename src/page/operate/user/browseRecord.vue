<template>
  <div class="xk-container">
    <!--搜索头-->
      <!--table-->
      <div class="xk-radius margintop20">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>浏览记录
          </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20">
            <el-table-column  label="商品ID" prop=""></el-table-column>
            <el-table-column  label="商品图片" prop=""></el-table-column>
            <el-table-column  label="商品名称" prop=""></el-table-column>
            <el-table-column  label="商品类别" prop=""></el-table-column>
            <el-table-column  label="商品金额" prop=""></el-table-column>
            <el-table-column  label="浏览时间" prop=""></el-table-column>
        </el-table>
        <pagination></pagination>
      </div>

  </div>
</template>
<script>
export default {
    name: "browseRecord",
    data() {
      return {
        tableData: []
      }
    },
    methods: {
    }
}

</script>

<style lang="scss" scoped>

</style>
