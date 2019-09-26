<template>
  <div class = 'bad-word'>
        <el-table
            :data="tableData"
            stripe
            border
            :size="$size"
            v-loading = 'vloading'
            style="width: 100%">
            <el-table-column
                prop="order"
                label="序号">
            </el-table-column>
            <el-table-column
                prop="id"
                label="敏感词ID">
            </el-table-column>
            <el-table-column
                prop="word"
                label="敏感词名称">
            </el-table-column>
            <el-table-column
                prop="createdName"
                label="提交用户">
            </el-table-column>
            <el-table-column
                label="提交时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt*1000 | formatTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="count"
                label="检测统计（人/次）">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-permission="infoSuperSetMStop" v-if="scope.row.status === 'active'" @click="handleClick(scope.row)" type="primary" :size="$size">冻结</el-button>
                    <el-button v-permission="infoSuperSetMStart" v-else @click="handleClick(scope.row)" type="primary" :size="$size">激活</el-button>
                </template>
            </el-table-column>
        </el-table>
      <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
  </div>
</template>
<script>
export default {
  name:'badWord',
  data () {
    return {
        tableData: [],
        currentPage:1,
        pageSize:10,
        total:0,
        vloading:true
    };
  },
  props: {
      xkrefresh:{}
  },
  components: {},
  computed: {},
  created() {
      this.getThisList();
  },
  mounted() {},
  methods: {
      fnpagechange(currentPage,pageSize){
          console.log(currentPage,pageSize);
          this.currentPage = currentPage ;
          this.pageSize = pageSize ;
          this.getThisList();
          this.vloading = true ;
      },
      getThisList(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.get(this.$api.sensitiveWordQPage,data,true)
            .then(res => {
                console.log(res);
                this.vloading = false ;
                this.tableData = [];
                if(res.total){
                    this.total = res.total;
                }
                if(res.data){
                    res.data.forEach((item,index) => {
                        this.tableData.push({
                            order:index + 1 + (this.currentPage - 1)*this.pageSize,
                            ...item
                        })
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.vloading = false ;
            })
      },
      sensitiveWordDisable(id){//冻结
          this.$http.get(this.$api.sensitiveWordDisable,{id:id},true).then(res => {
              console.log(res);
                this.$message({
                    message: '冻结成功',
                    type: 'success'
                });
              this.getThisList()
          }).catch(err => {
              console.log(err);
              
          })
      },
      sensitiveWordEnable(id){//激活
          this.$http.get(this.$api.sensitiveWordEnable,{id:id},true).then(res => {
              console.log(res);
              this.$message({
                    message: '激活成功',
                    type: 'success'
                });
              this.getThisList()
          }).catch(err => {
              console.log(err);
              
          })
      },
      handleClick(target){
          console.log(target);
          if(target.status === 'active'){
              this.sensitiveWordDisable(target.id)
          }else{
              this.sensitiveWordEnable(target.id);
          }
      }
  },
  watch: {
      xkrefresh(){
          this.getThisList();
      }
  }
}
</script>
<style scoped>
</style>