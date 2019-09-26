<template>
    <div class = 'xk-container'>
        <div class='xk-body xk-radius'>
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    坐席在线状态
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class='online-status'>
                <el-table
                :data="tableData"
                style="width: 100%"
                stripe
                v-loading='vloading'
                border>
                    <el-table-column
                        prop="realName"
                        label="客服真名">
                    </el-table-column>
                    <el-table-column
                        prop="nickName"
                        label="客服昵称">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="操作账号">
                    </el-table-column>
                    <el-table-column
                        prop="receiptCount"
                        label="同时接待人数">
                    </el-table-column>
                    <el-table-column
                        prop="ip"
                        label="IP地址">
                    </el-table-column>
                    <el-table-column
                        prop="online"
                        label="在线状态">
                        <template slot-scope="scope">
                            {{scope.row.online?"在线":"离线"}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
    </div>
</template>
<script>
export default {
  name:'onlineStatus',
  data () {
    return {
        tableData: [
        //     {
        //     id:"",
        //     realName: '王小虎',
        //     phone: '19561919',
        //     receiptCount:5,
        //     ip: '192.168.1.1',
        //     online:1
        //   }
          ],
        currentPage:1,
        pageSize:10,
        total:0,
        vloading:true
    };
  },
  components: {},
  computed: {},
  created(){
      this.fnOnlineStatus()
  },
  mounted() {},
  methods: {
      fnpagechange(val,page){
          console.log(val,page)
          this.currentPage = val;
          this.pageSize = page ;
          this.vloading = true ;
          this.fnOnlineStatus()
      },
      fnOnlineStatus(data={page:this.currentPage,limit:this.pageSize}){
          this.$http.post(this.$api.csWorkStatusQPage,data,true)
                .then(res => {
                    console.log(res)
                    this.vloading = false ;
                    if(res.total){
                        this.total = res.total
                    }
                    if(res.data){
                        this.tableData = res.data
                    }
                })
                .catch(err => {
                    this.vloading = false ;
                    this.$message.error(err.message);
                })
      }
  }
}
</script>
<style lang='scss' scoped>
</style>