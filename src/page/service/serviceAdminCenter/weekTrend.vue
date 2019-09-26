<template>
    <div class = 'xk-container'>
        <div class='xk-body xk-radius'>
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    近一周工作趋势
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class='week-trend'>
                <el-table
                :data="tableData"
                style="width: 100%"
                v-loading='vloading'
                border>
                    <el-table-column
                        prop="order"
                        label="序号">
                    </el-table-column>
                    <el-table-column
                        label="客服真名">
                        <template slot-scope="scope">
                            {{scope.row.createdRealName?scope.row.createdRealName:"未知"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="客服昵称">
                        <template slot-scope="scope">
                            {{scope.row.createdNickName?scope.row.createdNickName:"未知"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="completeCount"
                        label="完成工单">
                    </el-table-column>
                    <el-table-column
                        prop="durationAverage"
                        label="平均完成时间">
                    </el-table-column>
                    <el-table-column
                        prop="lastWeekCompleteCount"
                        label="上周完成工单">
                    </el-table-column>
                    <el-table-column
                        prop="takeOverCount"
                        label="流转他人工单">
                    </el-table-column>
                    <el-table-column
                        prop="levelAverage"
                        label="客服星级">
                    </el-table-column>
                </el-table>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
    </div>
</template>
<script>
export default {
  name:'weekTrend',
  data () {
    return {
        tableData: [
        //     {
        //     order: 1,
        //     createdBy: '王小虎',
        //     completeCount: 25,
        //     durationAverage:"65min",
        //     lastWeekCompleteCount:25,
        //     takeOverCount:2,
        //     levelAverage:3.6
        //   }
          ],
          currentPage:1,
          pageSize:10,
          total:1,
          vloading:true
    };
  },
  components: {},
  computed: {},
  created(){
      this.fnWorkTrend()
  },
  mounted() {},
  methods: {
      fnpagechange(val,page){
            this.currentPage = val ;
            this.pageSize = page ;
            this.vloading = true ;
            this.fnWorkTrend();
      },
      fnWorkTrend(data={limit:this.pageSize,page:this.currentPage}){
          console.log(data);
          
          this.$http.get(this.$api.workOrderStatistics,data,true)
            .then(res => {
                console.log(res);
                this.vloading = false ;
                this.tableData = [] ;
                if(res.data){
                    let data = JSON.parse(JSON.stringify(res.data))
                    data.forEach((item,index) => {
                        item.durationAverage = this.timeLone(item.durationAverage);
                        this.tableData.push(item);
                        this.tableData[index].order = index + 1 + this.pageSize*(this.currentPage - 1)
                    });
                }
                
                if(res.total){
                    this.total = res.total;
                }
            })
            .catch(err => {
                this.vloading = false ;
                this.$message.error(err.message);
            })
      },
      timeLone(time=0){
          let h = parseInt(time/3600);
          let m = parseInt((time%3600)/60);
          let s = (time%3600)%60 ;
          let t = '';
          s = s.toFixed(0)
          if(h){
              t += h + '小时'
          }
          if(m){
              m = m <10 ? "0" + m : m;
              t += m + "分钟"
          }
          t+=s+"秒"
          return t;
      }
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/weekTrend"
</style>