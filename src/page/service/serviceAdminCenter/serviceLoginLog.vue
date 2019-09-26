<template>
    <div class = 'xk-container'>
        <div class='xk-body'>
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        客服登录日志搜索
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="onSubmit" :loading='load'>查询</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :size="$size" 
                            :inline="true" 
                            :model="formInline"
                            class="demo-form-inline xk-search">
                        <el-form-item label="姓名：">
                            <el-input v-model="formInline.realName" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="操作账号：">
                            <el-input v-model="formInline.phone" placeholder="请输入操作账号"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-select :size="$size" v-model="formInline.status" placeholder="状态">
                                <el-option label="激活" value="active"></el-option>
                                <el-option label="冻结" value="disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            
            <div class='service-login-log xk-radius marintop20'>
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        客服登录日志列表
                    </div>
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                :data="tableData"
                style="width: 100%"
                stripe
                v-loading='vloading'
                border>
                    <el-table-column
                        prop="realName"
                        label="客服姓名">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="操作账号">
                    </el-table-column>
                    <el-table-column
                        prop="ip"
                        label="IP地址">
                    </el-table-column>
                    <el-table-column
                        label="操作时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt*1000 | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作动作">
                        <template slot-scope="scope">
                            {{scope.row.operation==='login'?"登陆":"登出"}}
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
export default {
  name:'serviceLoginLog',
  data () {
    return {
        formInline: {
          realName: '',
          phone:"",
          status:"active"
        },
        tableData: [
        //     {
        //     accountStatus: "active",
        //     createdAt: 1536812029,
        //     id: "5b99e3fd77f47a2d0c121afe",
        //     ip: "192.168.2.240",
        //     operation: "logout",
        //     phone: "13333333334",
        //     realName: "张三",
        //     status: "active",
        //     updatedAt: 1536812029
        //   }
          ],
          currentPage:1,
          pageSize:10,
          total:0,
          load:false,
          vloading:true
    };
  },
  components: {},
  computed: {
      ...mapState({
          loginLog:state => state.service.loginLog
      })
  },
  created(){
      this.fnLoginList();
      this.formInline = this.loginLog ? this.loginLog : {
          realName: '',
          phone:"",
          status:"active"
        }
  },
  mounted() {},
  methods: {
      ...mapMutations({
          setloginLog:'service/setloginLog'
      }),
      onSubmit() {
        let data = {
            limit:this.pageSize,
            page:this.currentPage
        }
        for (const key in this.formInline) {
              if(this.formInline[key]){
                  if(key==='realName'){
                      data.realName = this.formInline[key]
                  }
                  if(key==='phone'){
                      data.phone = this.formInline[key]
                  }
                  if(key==='status'){
                      data.status = this.formInline[key]
                  }
              }
          }
          this.setloginLog(this.formInline)
          this.fnLoginList(data,true)
      },
      fnpagechange(val,page){
          console.log(val,page)
          this.currentPage = val ;
          this.pageSize = page ;
          this.vloading = true ;
          this.fnLoginList()
      },
      fnLoginList(data={limit:this.pageSize,page:this.currentPage,status:"active"},search){
          if(search){
              this.load = true
          }
          this.vloading = true ;
          this.$http.post(this.$api.csLoginLogQPage,data,true)
                .then(res => {
                    console.log(res);
                    this.tableData = []
                    this.vloading = false ;
                    if(res.total){
                        this.total = res.total
                    }
                    if(res.data){
                        this.tableData = res.data
                    }
                    this.load = false
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