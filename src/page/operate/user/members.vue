/*
 * @Author: dhy 
 * @Date: 2019-06-10 14:54:49 
 * @Last Modified by: dhy
 * @Last Modified time: 2019-07-10 17:31:33
 */

<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>会员列表
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="searchList">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search" ref="searchForm">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="用户Id：" >
                        <el-input :size="$size" v-model="searchForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="UID：" >
                        <el-input :size="$size" v-model="searchForm.uid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="用户手机号：" >
                        <el-input :size="$size" v-model="searchForm.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="用户所在城市：" prop="districtCode" :rules="searchForm.districtCode ? rules.city:rules.notValid">
                       <province-cascader v-model="searchForm.districtCode"></province-cascader>
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
                <el-button type="success" :size="$size" @click="batchActive" :loading="activeLoading" :disabled="ids.length==0" v-permission="'userHandle'">批量激活</el-button>
                <el-button type="danger" :size="$size" @click="batchDelete" :loading="batchLoading" :disabled="ids.length==0" v-permission="'userHandle'">批量冻结</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="handleSelection">
            <el-table-column type="selection" width="55px"></el-table-column>
            <el-table-column  label="用户ID" prop="id"></el-table-column>
            <el-table-column  label="UID" prop="uid"></el-table-column>
            <el-table-column  label="用户名称" prop="nickname"></el-table-column>
            <el-table-column  label="所在城市" prop="districtCode">
              <template slot-scope="scope">
                {{getPorvinceInfo(scope.row.districtCode)}}
              </template>
            </el-table-column>
            <el-table-column  label="手机号" prop="phone"></el-table-column>
            <el-table-column  label="用户等级" prop="level"></el-table-column>
            <el-table-column  label="开启橱窗" prop="isShoWindow">
              <template slot-scope="scope">
                <span :class="scope.row.isShopWindow == 1 ? 'success' : 'danger'">{{scope.row.isShopWindow == 1 ? '开启' : '关闭'}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="开启长视频" prop="islongVideo">
              <template slot-scope="scope">
                <span :class="scope.row.isLongVideo == 1 ? 'success' : 'danger'">{{scope.row.isLongVideo == 1 ? '开启' : '关闭'}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="平台内推" prop="">
                <template slot-scope="scope">
                  {{scope.row.isRecommend == 0 ? '否' : '是'}}
                </template>
            </el-table-column>
            <el-table-column  label="实名认证" prop="authStatus">
              <template slot-scope="scope">
                {{getAuthStatus(scope.row.authStatus)}}
              </template>
            </el-table-column>
            <el-table-column  label="推荐人安全码" prop="mrCode"></el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <!-- <el-button type="text" :size="$size" @click="editOpen(scope.row.id)">编辑</el-button> -->
                    <!-- <el-button type="text" :size="$size" @click="handleDelete(scope.row.id)">删除</el-button> -->
                    <el-button type="text" :size="$size" @click="handleActive(scope.row.id)" v-if="scope.row.isFrozen == 1" v-permission="'userHandle'">激活</el-button>
                    <el-button type="text" :size="$size" @click="handleDelete(scope.row.id)" v-if="scope.row.isFrozen == 0" v-permission="'userHandle'">冻结</el-button>
                    <el-button type="text" :size="$size" @click="handleDetail(scope.row.id)" v-permission="'userDetial'">基本信息</el-button>
                </template>
            </el-table-column>
        </el-table>
       <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        <!--详情弹框-->
        <el-dialog :visible.sync="detailDialog" width="500px" title="用户基本信息" class="xk-dialog" :before-close="detailClose">
          <el-form labelPosition="labelPosition" label-width="110px">
            <el-form-item label="用户ID：">{{detailData.id}}</el-form-item>
            <el-form-item label="用户昵称：">{{detailData.nickname}}</el-form-item>
            <el-form-item label="用户头像：">
              <img :src="detailData.avatar" class="imgSize"/>
              </el-form-item>
            <el-form-item label="手机号码：">{{detailData.phone}}</el-form-item>
            <el-form-item label="性别：">{{getSex(detailData.sex)}}</el-form-item>
            <el-form-item label="生日：">{{detailData.birthday | formatTime('YYYY-MM-DD')}}</el-form-item>
            <el-form-item label="真实姓名：">{{detailData.realName}}</el-form-item>
            <el-form-item label="身份证号码：">{{detailData.idCardNum}}</el-form-item>
            <div style="text-align: center">
              <el-button type="plain" :size="$size" @click="detailClose">取消</el-button>
            </div>
          </el-form>
        </el-dialog>
        <!--详情编辑弹框-->
        <el-dialog :visible.sync="editDialog" width="500px" title="编辑用户基本信息" class="xk-dialog"  :before-close="editClose">
          <el-form labelPosition="labelPosition" label-width="110px" :model="editMembers" :rules="rules" ref="editMembers">
            <el-form-item label="用户ID：">{{editMembers.id}}</el-form-item>
            <el-form-item label="用户昵称：">
              <el-input :size="$size" v-model="editMembers.nickname"></el-input>
            </el-form-item>
            <el-form-item label="用户头像：">
              <image-upload :more="false" :uploadType="1" v-model="editMembers.avatar">
                <img :src="editMembers.avatar" class="imgSize" />
              </image-upload>
            </el-form-item>
            <el-form-item label="手机号码：" prop="phone">
              <el-input :size="$size" v-model="editMembers.phone"></el-input>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio  label="male" v-model="editMembers.sex">男</el-radio>
              <el-radio  label="female" v-model="editMembers.sex">女</el-radio>
              <el-radio  label="unknown" v-model="editMembers.sex">保密</el-radio>
            </el-form-item>
            <el-form-item label="生日：">
              <el-date-picker :size="$size" v-model="editMembers.birthday"></el-date-picker>
            </el-form-item>
            <div style="text-align: center">
              <el-button type="plain" :size="$size" @click="editClose">取消</el-button>
              <el-button type="primary" :size="$size" @click="handleEdit" :loading="btnLoading">保存</el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>

  </div>
</template>
<script>
import ImageUpload from "../../../components/ImageUpload"
import ProvinceCascader from "@/components/ProvinceCascader"
import { getPorvinceInfo } from "@/util/publicMehotds"
import { mapMutations, mapState } from 'vuex'
export default {
    name: "members",
    data() {
      let validatePhone = (rule, value, callback) => {
        console.log(value)
        if(!value) {
          return callback(new Error('电话不能为空'))
        }else if(!/^((1[3][0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16([6]|[0]|[4]|[7]))|(18[0-9])|(17[0-8])|(19[8,9]))\d{8}$/g.test(value)){
          callback(new Error('格式不对'))
        }else{
          callback()
        }
      };
      let city = (rule, value, callback) => {
        if(value && value.length!=3) {
          return callback(new Error("所在城市需选择到区县一级"))
        } else {
          callback();
        }
      }
      let notValid = (rule, value, callback) => {
          callback();
      }
      return {
        getPorvinceInfo,
        labelPosition: "right",
        searchForm: {
          districtCode: ''
        },
        pageData: {
            pageSize: 10,
            currentPage: 1,
            total: 0
          },
        tableData: [],
        ids:[], // 勾选的Id集合
        detailData: [],
        editMembers: [],
        btnLoading: false,
        activeLoading: false,
        batchLoading: false,
        loading: false,
        detailDialog: false,
        editDialog: false,
        radio: 0,
        rules: {
          phone: [{validator: validatePhone, trigger: "blur"}],
          city: [{validator: city, trigger: 'blur'}]
        }
      }
    },
    created(){
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getMembersList();
    },
    computed: {
        ...mapState({
          searchData: state => state.operateUser.membersCommit
        })
    },
    methods: {
      ...mapMutations({
        setMembersCommit: "operateUser/setMembersCommit"
      }),
      searchList() {
        this.pageData.currentPage = 1;
        this.$refs["searchForm"].validate(valid => {
          if(valid) {
            this.getMembersList();
          } else {
            return;
          }
        })
      },
      resetForm() {
        this.setMembersCommit(null);
        this.searchForm = {};
        this.pageData.currentPage = 1;
        this.getMembersList();
      },
      detailClose() {
          this.detailDialog = false;
      },
      getSex(val) {
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
              return '提交认证';
            case "FAILED":
              return '认证失败';
            default :
              return "未实名";
          }
      },
        getTimeStamp(data) { // 时间转时间戳
          let date = new Date(data);
          return date.getTime()
        },
      handleDetail(id) { // 某个会员详情
          this.$router.push({path: '/userDetail', query: {id: id}})
        // this.detailDialog = true
        // this.$http.get(this.$api.xkUserDetail, {id: id}, true)
        // .then(res => {
        //   this.detailData = res
        //   console.log(res)
        // })
        // .catch(err => {
        //   this.$message.error("查看详情失败")
        // })
      },
      editOpen(id) { // 打开编辑框
        this.editDialog = true;
        this.$http.get(this.$api.xkUserDetail, {id: id}, true)
        .then(res => {
          this.editMembers = res
          console.log(res)
        })
        .catch(err => {
          this.$message.error("获取详情失败")
        })
      },
      handleEdit() { // 保存编辑
        this.$refs['editMembers'].validate((value)=>{
          if(value){
            this.btnLoading = true;
            let paramList = {
              id: this.editMembers.id,
              nickname: this.editMembers.nickname,
              avatar: this.editMembers.avatar,
              phone: this.editMembers.phone,
              sex: this.editMembers.sex,
              birthday: this.getTimeStamp(this.editMembers.birthday) // 转为时间戳
            }
            this.$http.get(this.$api.xkUserUpdate, paramList, true)
            .then(res => {
              this.btnLoading = false;
              this.editDialog = false;
              this.$message.success("保存成功")
              this.getMembersList();
            })
            .catch(err => {
              this.$message.error("保存失败")
              this.editDialog = false;
              this.btnLoading = false;
              this.getMembersList();
            })
          }else{
            return false;
          }
        })
        // this.$http.get(this.$api.xkUserUpdate, paramList, true)
        // .then(res => {
        //   this.btnLoading = false;
        //   this.$message.success("保存成功")
        // })
        // .catch(err => {
        //   this.$message.error("保存失败")
        //   this.btnLoading = false;
        // })
        // this.editDialog = false;
        // this.getMembersList();
      },
      editClose() { // 关闭编辑框
        this.editDialog = false;
      },
      handleDelete(id) { // 冻结会员
        this.$confirm('此操作将冻结该会员信息，是否继续', "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=> {
          this.$http.get(this.$api.xkUserBatchFrozen, {ids: [id]}, true)
          .then(res => {
            this.$message.success("冻结成功")
            this.getMembersList();
          })
          .catch(err => {
            this.getMembersList();
            this.$message.error(err.message)
          })
        })
        .catch(()=> {
          this.$message({
            type: 'info',
            message: '已取消冻结'
          });   
        })
      },
      handleActive(id) { // 激活会员
        this.$confirm('此操作将激活该会员信息，是否继续', "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=> {
          this.$http.get(this.$api.xkUserBatchActivate, {ids: [id]}, true)
          .then(res => {
            this.$message.success('激活成功')
           this.getMembersList();
          })
          .catch(err => {
            this.getMembersList();
            this.$message.error(err.message)
          })
        })
        .catch(()=> {
          this.$message({
            type: 'info',
            message: '已取消激活'
          });   
        })
      },
     changePage(page,pageSize) { // 分页
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getMembersList();
      },
      handleSelection(selection) { // 获取选择项
        // this.selectionData = selection
        // console.log(this.selectionData)
        this.ids = [];
        for(let item of selection) {
            this.ids.push(item.id);
        }
      },
      batchDelete() { // 批量冻结
          this.$confirm("此操作将冻结所选会员，是否继续？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
              this.batchLoading = true;
              console.log("ids:"+this.ids + typeof this.ids);
              this.$http.get(this.$api.xkUserBatchFrozen, {ids: this.ids}, true)
              .then(res => {
                this.batchLoading = false;
                this.$message.success("批量冻结成功")
                this.getMembersList();
              })
              .catch(err => {
                this.batchLoading = false;
                this.$message.error(err.message)
                this.getMembersList();
              })
           })
          .catch(()=> {
            this.$message("已取消冻结");
          })
      },
      batchActive() { // 批量激活
          this.$confirm("此操作将激活所选会员，是否继续？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          })
          .then(() => {
              this.batchLoading = true;
              console.log("ids:"+this.ids + typeof this.ids);
              this.$http.get(this.$api.xkUserBatchActivate, {ids: this.ids}, true)
              .then(res => {
                this.batchLoading = false;
                this.$message.success("批量激活成功")
                this.getMembersList();
              })
              .catch(err => {
                this.batchLoading = false;
                this.$message.error(err.message)
                this.getMembersList();
              })
          })
          .catch(()=> {
            this.$message("已取消激活");
          })
      },
      getMembersList() { // 会员列表
        let paramList = {
          limit: this.pageData.pageSize,
          page: this.pageData.currentPage,
          id: this.searchForm.id,
          uid: this.searchForm.uid,
          phone: this.searchForm.phone,
          districtCode: this.searchForm.districtCode ? this.searchForm.districtCode[2] : this.searchForm.districtCode
        }
        console.log(paramList)
        this.loading = true;
        this.$http.get(this.$api.xkUserPage, paramList, true)
        .then(res => {
          this.setMembersCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}))
          this.tableData = res? res.data: []
          this.loading = false;
          this.pageData.total = res ? res.total : 0;
          console.log(this.tableData)
        })
        .catch(err => {
            this.loading = false;
            this.$message.error(err.message)
        })
      }
    },
    components: {
      ImageUpload,
      ProvinceCascader
    }
}

</script>

<style lang="scss" scoped>
.imgSize {
  display: inline-block;
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
.success {
  color: #67C23A;
}
.danger {
  color: #F56C6C;
}
</style>
