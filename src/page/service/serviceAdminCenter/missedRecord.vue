<template>
    <div class = 'xk-container'>
        <div class='xk-body xk-radius'>
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    业务错过中心
                </div>
                <div class="vus-btn">
                    <el-button v-permission="'missedRecordSetTime'" type="primary" @click="fntime" :size="$size">设置过期时间</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div class='missed-record'>
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    v-loading='vloading'
                    border>
                    <el-table-column
                        prop="nickname"
                        label="用户姓名">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="用户账号">
                    </el-table-column>
                    <el-table-column
                        prop="msgCount"
                        label="用户发送信息条数">
                        <template slot-scope="scope">
                            {{scope.row.msgCount}}
                            <el-button @click="handleClick(scope.row)" type="primary" :size="$size">查看详情</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="text"
                        label="用户最后发送信息">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发起时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt*1000 | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="reason"
                        label="错过原因">
                    </el-table-column>
                </el-table>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
        <el-dialog
            title="设置任务无人应答过期时间"
            :visible.sync="dialogVisible"
            width="503px">
        <div class="vus-div">
            <input class="vus-input" :class="{'vus-error':iserror}" type="text" v-model="min" @keyup="fnreg"><span>min</span>
            <div class="vus-tips" v-show="iserror">输入的时间错误</div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" :size="$size">取 消</el-button>
            <el-button type="primary" @click="fnhandletime" :size="$size" :loading="setLoading">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
            title="记录"
            :visible.sync="showjilu"
            width="30%">
            <el-form>
                <el-form-item v-for="(item,index) in jilu" :key="index">
                    用户发送内容{{index+1}}：
                    <span v-if="item.body.type===1001">{{item.body.data.msgContent}}</span>
                    <img v-if="item.body.type===1002" :src='item.body.data.imgUrl' style="max-width:100%">
                    <audio v-if="item.body.type===1003" controls :src='item.body.data.voiceUrl'>其他消息</audio>
                    <span v-if="item.body.type===4001">订单消息</span>
                    <span v-if="item.body.type===4002">知识点消息</span>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showjilu = false" :size="$size">关闭</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name:'missedRecord',
  data () {
    return {
        tableData: [
        //     {
        //     nickname: '王小虎',
        //     phone: '19561919',
        //     msgCount:5,
        //     text: 'helloworld',
        //     createdAt:"2018-02:00",
        //     reason:"无人接单"
        //   }
          ],
        dialogVisible:false,
        min:30,
        iserror:false,
        showjilu:false,
        jilu:[],
        currentPage:1,
        pageSize:10,
        total:0,
        vloading:true,
        setLoading:false
    };
  },
  components: {},
  computed: {},
  mounted() {
      
      this.expireTimeDetail()
  },
  methods: {
      fnpagechange(val,page){
          this.currentPage = val;
          this.pageSize = page ;
          this.vloading = true ;
          this.getThisPage()
      },
      fntime(){
        this.dialogVisible = true;
      },
      fnhandletime(){
          if(this.iserror){
              return ;
          }
          this.setLoading = true ;
          this.$http.get(this.$api.expireTimeSetting,{expireTime:this.min*60},true)
          .then(res => {
              console.log(res);
              this.setLoading = false ;
              this.dialogVisible = false;
              this.getThisPage();
          })
          .catch(err => {
              this.setLoading = false ;
              this.dialogVisible = false;
              this.$message.error(err.message);
          })
          
      },
      fnreg(){
          let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ ;
          this.iserror = !reg.test(this.min);
      },
      handleClick(val){
          console.log(val.all.msgs)
          this.jilu = val.all.msgs ;
          this.showjilu = true ;
      },
      getThisPage(){
          this.$http.get(this.$api.expireLog,{expireTime:this.min*60,page:this.currentPage,limit:this.pageSize},true)
            .then(res => {
                console.log(res);
                console.log({expireTime:this.min*60,page:this.currentPage,limit:this.pageSize})
                this.vloading = false ;
                this.tableData = [];
                if(res.data){
                    res.data.forEach((item,index) => {
                        this.tableData.push({
                            nickname: item.nickname,
                            phone: item.phone,
                            msgCount:item.msgs.length,
                            text: item.msgs[item.msgs.length-1].body.type===1001?item.msgs[item.msgs.length-1].body.data.msgContent:item.msgs[item.msgs.length-1].body.type===1002?'图片消息':'其他消息',
                            createdAt:item.createdAt,
                            reason:"无人接单",
                            all:item
                        })
                    });
                }
                if(res.total){
                    this.total = res.total
                }
            })
            .catch(err => {
                this.vloading = false ;
                this.$message.error(err.message);
            })
      },
      expireTimeDetail(){
          this.$http.get(this.$api.expireTimeDetail, {}, true).then((res) => {
             console.log(res)
             if(res){
                 this.min = res.expireTime ;
                 this.getThisPage();
             }
          }).catch((err) => {
             console.log(err)
             this.$message.error(err.message);
          });
      }
  }
}
</script>
<style lang='scss' scoped>
    @import "./scss/missedRecord"
</style>