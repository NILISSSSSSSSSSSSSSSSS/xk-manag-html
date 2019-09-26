<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>编辑用户组
          </div>
            <div class="vus-bottom"></div>
        </div>
        <!--搜索栏-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                    <span>基本信息：</span>
            </div>
            <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="名称：" >
                            <el-input :size="$size" v-model="groupData.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户组描述：" >
                            <el-input :size="$size" v-model="groupData.description" type="textarea" :autosize="{minRows: 3, maxRows: 5}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作描述：" >
                            <el-input :size="$size" v-model="groupData.operateDes" type="textarea" :autosize="{minRows: 3, maxRows: 5}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="box-card margintop20">
            <div slot="header" class="clearfix">
                    <span>用户组成员：</span>
                    <span>已有<span class="num">{{pageData.total}}</span>个用户</span>
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
                <el-table-column  label="推荐人安全码" prop="erCode"></el-table-column>
                <el-table-column  label="操作"  fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" :size="$size" @click="handleDetail(scope.row.id)">基本信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change=changePage></pagination>
        </el-card>
        <div class="content">
              <el-button type="primary" @click="updateUserGroup">确定</el-button>
              <el-button type="plain" @click="goUserGroupsList">返回</el-button>
            </div>
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
            <el-form-item label="生日：">{{detailData.birthday | formatTime("YYYY-MM-DD")}}</el-form-item>
            <el-form-item label="真实姓名：">{{detailData.realName}}</el-form-item>
            <el-form-item label="身份证号码：">{{detailData.idCardNum}}</el-form-item>
            <div style="text-align: center">
              <el-button type="plain" :size="$size" @click="detailClose">取消</el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>
  </div>
</template>
<script>
import { getPorvinceInfo } from "@/util/publicMehotds"
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        detailDialog: false,
        tableData: [],
        detailData: [],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading:false,
        num: 0,
        userIds: [],
        groupData: [],
        groupId: '',
        getPorvinceInfo: getPorvinceInfo
      }
    },
    created() {
        this.getGroupId();
        this.getGroupDetails();
        this.getMembersList();
    },
    methods: {
        goUserGroupsList() {
            this.$router.push({path: "/userGroupsList"});
        },
        resetForm() {
            this.searchForm = [];
        },
        detailClose() {
            this.detailDialog = false;
        },
        getGroupId() {
            this.groupId = this.$route.query.groupId
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
        getGroupDetails() {
            this.$http.get(this.$api.xkUserGroupDetail, {id: this.groupId}, true)
            .then(res => {
                this.groupData = res
                console.log(this.groupData)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getMembersList() { // 会员组所属会员列表
            let paramList = {
            limit: this.pageData.pageSize,
            page: this.pageData.currentPage,
            groupId: this.groupId
            }
            console.log(paramList)
            this.loading = true;
            this.$http.get(this.$api.xkUserGroupMemberQPage, paramList, true)
            .then(res => {
                this.tableData = res? res.data: []
                this.loading = false;
                this.pageData.total = res ? res.total : 0;
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message);
            })
        },
        changePage(page,pageSize) {
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getMembersList();
      },
    //   selectionChange(val) { // 选择会员
    //      this.num = val.length;
    //      this.userIds = [];
    //      for(let item of val) {
    //          this.userIds.push(item.id)
    //      }
    //   },
      updateUserGroup() { // 编辑用户组
          let paramList = {
              id: this.groupId,
              name: this.groupData.name,
              description: this.groupData.description,
              operateDes: this.groupData.operateDes
          }
          this.$http.get(this.$api.xkUserGroupUpdate, paramList, true)
          .then(res => {
              this.$message.success("编辑成功")
              this.$router.push({path: "/userGroupsList"})
          })
          .catch(err => {
                  this.$message.error(err.message)
          })
      },
      handleDetail(userId) {
          this.$router.push({path: '/userDetail', query: {id: userId}})
    } 
    }
}

</script>

<style lang="scss" scoped>
.num {
    display: inline-block;
    margin: 0 10px 0 10px;
    color: #9795E3;
    font-weight: 700;
}
.imgSize {
  display: inline-block;
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
.content {
  margin: 20px auto;
  text-align: center;
}
</style>
