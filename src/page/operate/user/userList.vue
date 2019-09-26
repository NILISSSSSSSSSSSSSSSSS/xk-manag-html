<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>用户组管理
          </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="getMembersList">搜索</el-button>
                <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="用户组ID：" >
                        <el-input :size="$size" v-model="searchForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户组名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
      </div>
      <!--table-->
      <div class="xk-radius margintop20">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>会员列表
          </div>
           <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="addGroupMembers">新增成员</el-button>
                <el-button type="danger" :size="$size" @click="batchDelete">批量删除</el-button>
                <el-button type="plain" :size="$size" @click="userGroupsList">返回用户组</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="selectionChange">
            <el-table-column type="selection" width="55px"></el-table-column>
            <el-table-column  label="用户ID" prop="id"></el-table-column>
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
            <el-table-column  label="推荐人员工安全码" prop="erCode"></el-table-column>
            <el-table-column  label="推荐人商户安全码" prop="mrCode"></el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="handleDelete(scope.row.id)">删除</el-button>
                    <el-button type="text" :size="$size" @click="handleDetail(scope.row.id)">基本信息</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>

  </div>
</template>
<script>
import { getPorvinceInfo } from "@/util/publicMehotds"
import { mapMutations, mapState } from 'vuex'
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        searchForm: [],
        tableData: [],
        detailData: [],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading:false,
        detailDialog: false,
        addDialog: false,
        selectionData: [],
        getPorvinceInfo: getPorvinceInfo
      }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getMembersList();
    },
    computed: {
        ...mapState({
            searchData: state => state.operateUser.userCommit
        })
    },
    methods: {
        ...mapMutations({
            setUserCommit: "operateUser/setUserCommit"
        }),
        userGroupsList() { // 返回用户组列表
            this.$router.push({path: "/userGroupsList"})
        },
        addGroupMembers() {
            this.$router.push({path: "/addGroupMembers", query: {groupId: this.$route.query.groupId}})
        },
        handleDetail(id) {
            this.$router.push({path: '/userDetail', query: {id: id}})
        },
      resetForm() {
        this.searchForm = [];
      },
      getAuthStatus(val) {
          switch(val) {
            case "SUCCESS":
              return '认证成功';
            case "SUBMIT":
              return '提交认证';
            case "FAILED":
              return '认证失败';
            default: 
              return '未实名';
          }
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
      getMembersList() { // 获取用户组下的会员列表
          let id = this.$route.query.groupId;
          let paramList = {
              limit: this.pageData.pageSize,
              page: this.pageData.currentPage,
              groupId: id,
              id: this.searchForm.id
          }
          this.loading = true;
          this.setUserCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
          this.$http.get(this.$api.xkUserGroupMemberQPage, paramList, true)
          .then(res => {
              this.tableData = res? res.data: []
              this.pageData.total = res.total ? res.total : 0;
              this.loading = false;
          })
          .catch(err => {
              this.loading = false;
              this.$message.error(err.message);
          })
      },
      membersDetail(id) { // 某个会员详情
        this.detailDialog = true
        this.$http.get(this.$api.xkUserDetail, {id: id}, true)
        .then(res => {
          this.detailData = res
        })
        .catch(err => {
          this.$message.error("查看详情失败")
        })
      },
       detailClose() { //关闭详情
          this.detailDialog = false;
      },
      selectionChange(val) {
        this.selectionData = [];
        for(let item of val) {
            this.selectionData.push(item.id)
        }
      },
      handleDelete(id) { // 删除会员
        this.$confirm('此操作将删除该会员信息，是否继续', "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=> {
            let paramList = {
                groupId: this.$route.query.groupId,
                userIds: [id] 
            }
            console.log(paramList.userIds)
          this.$http.get(this.$api.xkUserGroupPullMember, paramList, true)
          .then(res => {
           this.getMembersList();
          })
          .catch(err => {
            this.getMembersList();
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
      batchDelete() {
          let num = this.selectionData.length;
          if(this.selectionData.length == 0) {
              this.$confirm("请选择要删除的会员", "提示", {
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
                  let paramList = {
                      groupId: this.$route.query.groupId,
                      userIds: this.selectionData
                  }
                  console.log(paramList)
                  this.$http.get(this.$api.xkUserGroupPullMember, paramList, true)
                  .then(res => {
                      this.$message.success("删除成功")
                      this.getMembersList();
                  })
                  .catch(err => {
                      this.getMembersList();
                      this.$message.error(err.message)
                  })
              })
          }
      },
        changePage(page,pageSize) { // 分页
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getMembersList();
      }
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
</style>
