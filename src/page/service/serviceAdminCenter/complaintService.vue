<template>
    <div class = 'xk-container'>
        <div class='xk-body xk-radius'>
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    投诉客服记录
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class='complaint-service'>
                <el-table
                :data="tableData"
                style="width: 100%"
                v-loading='vloading'
                border>
                    <el-table-column
                        type="index"
                        width="50"
                        label="序号">
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="投诉事件ID">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="nick"
                        label="投诉用户">
                    </el-table-column> -->
                    <el-table-column
                        prop="customerName"
                        label="投诉用户姓名">
                    </el-table-column>
                    <el-table-column
                        prop="reason"
                        label="投诉原因">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="投诉时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="customerServiceRealName"
                        label="接待客服真名">
                    </el-table-column>
                    <el-table-column
                        prop="customerServiceNickname"
                        label="接待客服昵称">
                    </el-table-column>
                    <el-table-column
                        prop="attachments"
                        width="150px"
                        label="投诉附件">
                        <template slot-scope="scope">
                            <a style="margin-right:5px" target="_blank" v-for="(item,index) in scope.row.attachments" :href="item" :key="index">附件{{index+1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        width="150px"
                        label="接待客服">
                        <template slot-scope="scope">
                            <el-button v-permission="'complaintServiceLook'" @click="handleClick(scope.row)" type="primary" :size="$size">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            <listdetail isComplain :showdetail='showdetail' @closeshowdetail='closeshowdetail' :workId='workId'></listdetail>
        </div>
    </div>
</template>
<script>
import Listdetail from '@/components/service/ListDetail'
export default {
  name:'complaintService',
  data () {
    return {
        tableData: [
        //     {
        //     order: 1,
        //     id: 19161651,
        //     nick: "dsubf",
        //     customerName:"王小虎",
        //     reason:"客服长得丑",
        //     createdAt:"2018",
        //     customerServiceName:"禽兽",
        //     attachments:['asd',"sad",5]
        //   }
          ],
          showdetail:false,
          workId:null,
          currentPage:1,
          pageSize:10,
          total:0,
          vloading:true
    };
  },
  components: {
      Listdetail
  },
  computed: {},
  created(){
      this.fntousuList()
  },
  mounted() {},
  methods: {
      closeshowdetail(){
          this.showdetail = false ;
      },
      fnpagechange(val,page){
          this.currentPage = val ;
          this.pageSize = page ;
          this.vloading = true ;
          this.fntousuList()
      },
      handleClick(val){
          console.log(val)
          this.workId = val.workOrderId;
          this.showdetail = true ;
      },
      fntousuList(data={page:this.currentPage,limit:this.pageSize}){
          this.$http.post(this.$api.complaintPage,data,true)
                .then(res => {
                    this.vloading = false ;
                    this.tableData = [];
                    this.tableData = res.data;
                    if(res.total){
                        this.total = res.total
                    }
                    console.log(res)
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