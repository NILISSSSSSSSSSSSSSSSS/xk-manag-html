<template>
  <div class="xk-container">
    <!--搜索头-->
    <div class="xk-radius">
        <div class="xk-title">
             <div class="vus-title">
                 <span></span>人工审核 <div class="info">提示：关闭则无需人工审核，五分钟后自动通过认证</div>
             </div>
             <div class="vus-bottom"></div>
        </div>
        <el-form :label-position="labelPosition" label-width="55px" class="xk-search">
            <el-form-item>
                <el-radio v-model="isAutoAuditXkUserAuth" :label="false" @change="openAuth" v-permission="'realAuthSet'">开启人工审核</el-radio>
                <el-radio v-model="isAutoAuditXkUserAuth" :label="true" @change="closeAuth" v-permission="'realAuthSet'">关闭人工审核</el-radio>
            </el-form-item>
        </el-form>
    </div>
      <div class="xk-radius margintop20">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>会员列表
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="用户Id：" >
                        <el-input :size="$size" v-model="searchForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户手机号：" >
                        <el-input :size="$size" v-model="searchForm.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UID：" >
                        <el-input :size="$size" v-model="searchForm.uid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审核状态：" >
                        <el-select :size="$size" v-model="searchForm.status">
                            <el-option v-for="(item, index) in this.statusType" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
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
          <div class="vus-btn">
                <el-button type="danger" :size="$size" @click="batchDelete" :loading="batchLoading" v-permission="'realAuthDelete'">批量删除</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="handleSelection">
            <el-table-column type="selection" width="55px"></el-table-column>
            <el-table-column  label="UID" prop="uid"></el-table-column>
            <el-table-column  label="用户ID" prop="userId"></el-table-column>
            <el-table-column  label="手机号" prop="phone"></el-table-column>
            <el-table-column  label="用户等级" prop="level"></el-table-column>
            <el-table-column  label="用户实名" prop="realName"></el-table-column>
            <el-table-column  label="身份证号码" prop="idCardNum"></el-table-column>
            <el-table-column  label="基本信息" prop="basic">
              <template slot-scope="scope">
                <el-button type="text" :size="$size" @click="handleDetail(scope.row.id)" v-permission="'realAuthBasicDetail'">查看</el-button>
              </template>
            </el-table-column>
             <el-table-column  label="审核" prop="authStatus">
              <template slot-scope="scope">
                  <el-button  v-if="scope.row.authStatus === 'SUBMIT'" type="text" :size="$size"
                   @click="authOpen(scope.row.id)" v-permission="realAuthAudit">审核</el-button>
                  <div v-else :class="getStatusClass(scope.row.authStatus)">{{getAuthStatus(scope.row.authStatus)}}</div>
              </template>
            </el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="authInfoOpen(scope.row.id)" v-permission="'realAuthDetail'">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
       <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        <!--详情弹框-->
        <el-dialog :visible.sync="detailDialog" width="500px" title="用户基本信息" class="xk-dialog" :before-close="detailClose">
          <el-form labelPosition="labelPosition" label-width="110px" :model="detailData">
            <el-form-item label="用户ID：">{{detailData.userId}}</el-form-item>
            <el-form-item label="用户UID：">{{detailData.uid}}</el-form-item>
            <el-form-item label="用户昵称：">{{detailData.nickname}}</el-form-item>
            <el-form-item label="用户头像：">
              <img :src="detailData.avatar" class="imgSize"/>
              </el-form-item>
            <el-form-item label="手机号码：">{{detailData.phone}}</el-form-item>
            <el-form-item label="性别：">{{getSex(detailData.sex)}}</el-form-item>
            <el-form-item label="生日：">{{detailData.birthday | formatTime("YYYY-MM-DD")}}</el-form-item>
            <div style="text-align: center">
              <el-button type="plain" :size="$size" @click="detailClose">取消</el-button>
            </div>
          </el-form>
        </el-dialog>
        <!--审核的审核/查看弹框-->
        <el-dialog :visible.sync="authDialog" width="600px" title="实名认证" class="xk-dialog" :before-close="authClose">
          <el-form labelPosition="labelPosition" label-width="110px" :model="detailData">
             <div class='xk-title location'>
            <div class="vus-title">
                <span></span>用户信息
            </div>
            <div class="vus-bottom"></div>
          </div>
            <el-form-item label="用户ID：">{{detailData.userId}}</el-form-item>
            <el-form-item label="用户UID：">{{detailData.uid}}</el-form-item>
            <el-form-item label="用户昵称：">{{detailData.nickname}}</el-form-item>
            <el-form-item label="用户头像：">
              <img :src="detailData.avatar" class="imgSize"/>
              </el-form-item>
            <el-form-item label="手机号码：">{{detailData.phone}}</el-form-item>
            <el-form-item label="性别：">{{getSex(detailData.sex)}}</el-form-item>
            <el-form-item label="生日：">{{detailData.birthday | formatTime("YYYY-MM-DD")}}</el-form-item>
            <el-form-item label="真实姓名：">{{detailData.realName}}</el-form-item>
            <el-form-item label="身份证号码：">{{detailData.idCardNum}}</el-form-item>
             <el-form-item label="身份证正面照：">
               <span v-if="!detailData.idCardImageFront">无</span>
               <img v-else :src="detailData.idCardImageFront" class="imgSize" @click="largeImg(detailData.idCardImageFront)"/>
             </el-form-item>
              <el-form-item label="身份证反面照：">
               <span v-if="!detailData.idCardImageBack">无</span>
               <img v-else :src="detailData.idCardImageBack" class="imgSize" @click="largeImg(detailData.idCardImageBack)"/>
             </el-form-item>
            <div class='xk-title location'>
              <div class="vus-title">
                  <span></span>审核
              </div>
              <div class="vus-bottom"></div>
          </div>
          <div v-if="type==='auth'">
            <el-form-item label="审核结果：">
               <el-radio v-model="auth.status" label="SUCCESS">通过</el-radio>
                <el-radio v-model="auth.status" label="FAILED">不通过</el-radio>
             </el-form-item>
             <el-form-item label="审核不通过原因：" label-width="130px" v-show="auth.status==='FAILED'">
               <el-input type="textarea" v-model.trim="auth.message" :autosize="{minRows: 2, maxRows: 4}"></el-input>
             </el-form-item>
          </div>
          <div v-if="type==='info'">
            <el-form-item label="审核结果：">
               <div :class="getStatusClass(detailData.authStatus)">{{getAuthStatus(detailData.authStatus)}}</div>
             </el-form-item>
             <el-form-item label="审核不通过原因：" label-width="130px" v-show="detailData.authStatus==='FAILED'">
               <el-input type="textarea" v-model="detailData.authMessage" :autosize="{minRows: 2, maxRows: 4}" disabled></el-input>
             </el-form-item>
          </div>
            <div style="text-align: center">
              <el-button type="plain" :size="$size" @click="authClose">取消</el-button>
              <el-button v-show="type==='auth'" type="primary" :size="$size" @click="handleAuth(detailData.id)" :loading="btnLoading">保存</el-button>
            </div>
          </el-form>
        </el-dialog>
        <el-dialog width="600px" :visible.sync="imgDialog" :before-close="imgClose" title="图片预览" center>
          <img :src="imgUrl" style="width:100%"/>
        </el-dialog>
      </div>
  </div>
</template>
<script>
// import ImageUpload from "../../../components/ImageUpload"
import { mapMutations, mapState } from 'vuex'
export default {
    name: "realAuth",
    data() {
      return {
        labelPosition: "right",
        humanAuth: "1",
        searchForm: [],
        pageData: {
            pageSize: 10,
            currentPage: 1,
            total: 0
          },
        tableData: [],
        isAutoAuditXkUserAuth: '', // 是否开启人工审核
        isAutoAudit: '',
        authStatus:"",
        message: '',
        selectionData: [],
        ids:[],
        detailData: [],
        authMembers: [],
        btnLoading: false,
        batchLoading: false,
        loading: false,
        detailDialog: false,
        authDialog: false,
        radio: 0,
        auth: {},
        type:"",
        imgUrl: '',
        imgDialog: false,
        statusType: [
          {label: '全部', value: ''},
          {label: '未审核', value: 'SUBMIT'},
          {label: '认证成功', value: 'SUCCESS'},
          {label: '认证失败', value: 'FAILED'}
        ],
        count: 0
      }
    },
    created(){
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getNotAuthCount();
      this.getAuthList();
    },
    computed: {
      ...mapState({
        searchData: state => state.operateUser.realAuthCommit,
        // realCount: state => state.redTree.countCommit
      }),
    },
    methods: {
      ...mapMutations({
        setRealAuthCommit: "operateUser/setRealAuthCommit",
        setCountCommit: "redTree/setCountCommit",
        addCountCommit: "redTree/addCountCommit",
        reduceCountCommit: "redTree/reduceCountCommit"
      }),
      resetForm() {
        this.setRealAuthCommit(null);
        this.searchForm = {};
        this.pageData.currentPage = 1;
        this.getAuthList();
      },
       orderRecord() {
        this.$router.push({path: "/orderRecord"});
      },
      detailClose() {
          this.detailDialog = false;
      },
      getSex(val) {
          console.log(val)
          switch(val) {
            case "male":
              return "男";
            case "female":
              return "女";
            case "unknown":
              return "保密";
          }
        },
        getAuthStatus(val) { // 实名认证状态
          switch(val) {
            case "SUCCESS":
              return '认证成功';
            case "SUBMIT":
              return '未审核';
            case "FAILED":
              return '认证失败';
            default :
              return "/";
          }
      },
      getStatusClass(val) { // 状态颜色区分
          switch(val) {
            case "SUCCESS":
              return 'success';
            case "SUBMIT":
              return 'warning';
            case "FAILED":
              return 'danger';
          }
      },
        getTimeStamp(data) { // 时间转时间戳
          let date = new Date(data);
          return date.getTime()
        },
        largeImg(url) { // 放大图片
          this.imgDialog = true;
          this.imgUrl = url;
        },
        imgClose() { // 关闭图片弹框
          this.imgDialog = false;
        },
        openAuth() {
          this.$confirm("确认开启人工审核？" ,'提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
            this.$http.get(this.$api.closeAutoAuditXkUserAuth, {}, true)
            .then(res => {
              this.$message.success("开启成功")
            })
            .catch(err => {
              this.$message.error(err.message)
            })
          })
          .catch(() => {
            this.$message.info("已取消")
          })
        },
        closeAuth() {
          this.$confirm("确认关闭人工审核？" ,'提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
            this.$http.get(this.$api.openAutoAuditXkUserAuth, {}, true)
            .then(res => {
              this.$message.success("关闭成功")
            })
            .catch(err => {
              this.$message.error(err.message)
            })
          })
          .catch(() => {
            this.$message.info("已取消")
          })
        },
        search() {
          this.pageData.currentPage = 1;
          this.getNotAuthCount();
          this.getAuthList();
        },
        getNotAuthCount() { // 未审核数
            let paramList = {
              limit: 0,
              page: 0,
              authStatus: 'SUBMIT'
          }
          this.$http.get(this.$api.xkUserAuthPage, paramList, true)
          .then(res => {
              console.log('res', res)
              if(res) {
                  this.$store.state.redTree.countCommit = res.data ? res.data.length : 0
              } else {
                  this.$store.state.redTree.countCommit = 0
              }
              console.log("未审核数：", this.$store.state.redTree.countCommit)
          })
          .catch(err => {
              this.$message.error(err.message)
          })
        },
        getAuthList() { // 获取认证列表
          let paramList = {
            limit: this.pageData.pageSize,
            page: this.pageData.currentPage,
            searchUserId: this.searchForm.id,
            phone: this.searchForm.phone,
            uid: this.searchForm.uid,
            authStatus: this.searchForm.status
          }
          console.log(paramList)
          // this.setRealAuthCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
          this.loading = true
          this.$http.get(this.$api.xkUserAuthPage, paramList, true)
          .then(res => {
            console.log("当前需要审核数为：", this.$store.state.redTree.countCommit)
            this.setRealAuthCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
            console.log(res)
            this.loading = false;
            if(res) {
                this.tableData = res.data ? res.data: []
                this.isAutoAuditXkUserAuth = res.isAutoAuditXkUserAuth
                this.isAutoAudit = res.isAutoAuditXkUserAuth
                this.pageData.total = res.total ? res.total : 0
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err.message)
          })
        },
      handleDetail(id) { // 某个认证详情
        this.detailDialog = true
        this.$http.get(this.$api.xkUserAuthDetail, {id: id}, true)
        .then(res => {
          this.detailData = res
          console.log(res)
        })
        .catch(err => {
          this.$message.error("查看详情失败")
        })
      },
      authOpen(id) { // 审核审核详情
        this.authDialog = true;
        this.type = "auth"
        this.$http.get(this.$api.xkUserAuthDetail, {id: id}, true)
        .then(res => {
          this.detailData = res
          console.log(res)
        })
        .catch(err => {
          this.$message.error("获取详情失败")
        })
      },
      authInfoOpen(id) { // 审核查看详情
        this.authDialog = true;
        this.type = "info"
        this.$http.get(this.$api.xkUserAuthDetail, {id: id}, true)
        .then(res => {
          this.detailData = res
          console.log(res)
        })
        .catch(err => {
          this.$message.error("获取详情失败")
        })
      },
      authClose() { // 关闭审核框
        this.authDialog = false;
      },
      handleAuth(id) { // 认证审核
        let paramList = {
          id: id,
          authMessage: this.auth.message
        }
        if(this.auth.status === 'SUCCESS') { // 认证成功
          this.$http.post(this.$api.xkUserAuthSuccess, paramList, true)
          .then(res => {
            this.reduceCountCommit(); // 未认证数减一
            this.authDialog = false;
            this.$message.success("审核完成")
            this.getNotAuthCount();
            this.getAuthList();
          })
          .catch(err => {
            this.$message.error(err.message)
          })
        } else { // 认证失败
             if(this.auth.message) {
                  this.$http.post(this.$api.xkUserAuthFailed, paramList, true)
                  .then(res => {
                    this.reduceCountCommit(); // 未认证数减一
                    this.authDialog = false;
                    this.$message.success("审核完成")
                    this.getNotAuthCount();
                    this.getAuthList();
                  })
                  .catch(err => {
                    this.$message.error(err.message)
                  })
             } else {
                  this.$message.warning("请输入不通过原因！")
             }
        }
      },
      handleDelete(id) { // 删除单个会员
      console.log(id)
        this.$confirm('此操作将删除该会员信息，是否继续', "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=> {
          this.$http.get(this.$api.xkUserAuthBatchDelete, {ids: [id]}, true)
          .then(res => {
           this.getAuthList();
          })
          .catch(err => {
            this.getAuthList();
            this.$message.error("删除失败")
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(()=> {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });   
        })
      },
     changePage(page,pageSize) { // 分页
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getAuthList();
      },
      handleSelection(selection) { // 获取选择项
        this.selectionData = selection
      },
      batchDelete() { // 批量删除
        let num = this.selectionData.length;
          if(this.selectionData.length == 0) {
              this.$confirm("请先选择要删除的会员", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              })
              .then(()=> {})
              .catch(()=>{})
          } else {
            this.$confirm(`此操作会删除所选会员,数量为${num},是否继续`, "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              })
              .then(()=> {
                for(let item of this.selectionData) {
                    this.ids.push(item.id)
                }
                this.batchLoading = true;
                console.log("ids:"+this.ids + typeof this.ids);
                this.$http.get(this.$api.xkUserAuthBatchDelete, {ids: this.ids}, true)
                .then(res => {
                  this.batchLoading = false;
                  this.$message.success("批量删除成功")
                  this.getAuthList();
                })
                .catch(err => {
                  this.batchLoading = false;
                  this.$message.error("批量删除失败")
                  this.getAuthList();
                })
              })
          }
      }
    }
}
</script>

<style lang="scss" scoped>
.info {
    display: inline-block;
    margin-left: 30px;
    color: #E6A23C;
    font-size: 14px;
}
.danger {
  color: #F56C6C;
}
.warning {
  color:#E6A23C;
}
.success {
 color: #67C23A;
}
.location {
  margin-top: -30px;
}
.imgSize {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  vertical-align: middle;
}
</style>
