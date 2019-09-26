<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>用户组管理
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
              <span></span>列表
          </div>
          <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="setupUserGroup" v-permission="'userGroupListAdd'">新增用户组</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
            <el-table-column  label="用户组ID" prop="id"></el-table-column>
            <el-table-column  label="用户组名称" prop="name"></el-table-column>
            <el-table-column  label="用户组描述" prop="description"></el-table-column>
            <el-table-column  label="最后修改时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatTime}}
                </template>
            </el-table-column>
            <el-table-column  label="最后修改人" prop="userName"></el-table-column>
            <el-table-column  label="修改描述" prop="operateDes"></el-table-column>
            <el-table-column  label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="userList(scope.row.id)" v-permission="'userGroupListChild'">查看用户列表</el-button>
                    <el-button type="text" :size="$size" @click="editUserGroup(scope.row.id)" v-permission="'userGroupListEdit'">编辑</el-button>
                     <el-button type="text" :size="$size" @click="deleteUserGroup(scope.row.id,scope.row.name)" v-permission="'userGroupListDelete'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
      </div>

  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        searchForm: [],
        tableData: [{
            code: '1'
        }],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading:false
      }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getUserGroupList();
    },
    computed: {
        ...mapState({
            searchData: state => state.operateUser.userGroupCommit
        })
    },
    methods: {
        ...mapMutations({
            setUserGroupCommit: "operateUser/setUserGroupCommit"
        }),
      resetForm() {
        this.searchForm = [];
        this.setUserGroupCommit(null);
        this.pageData.currentPage = 1;
        this.getUserGroupList();
      },
      userList(id) {
        this.$router.push({path: "/userList", query: {groupId: id}})
      },
      getAuthStatus(val) {
          switch(val) {
            case "SUCCESS":
              return '认证成功';
            case "SUBMIT":
              return '提交认证';
            case "FAILED":
              return '认证失败';
          }
      },
      setupUserGroup() { // 到添加用户组
          this.$router.push({path:"/setupUserGroup"});
      },
      editUserGroup(id) { // 到编辑用户组
          this.$router.push({path: "/editUserGroup", query: {groupId: id}})
      },
      search() {
          this.pageData.currentPage = 1
          this.getUserGroupList();
      },
      getUserGroupList() { // 用户组列表
        let paramList = {
            limit: this.pageData.pageSize,
            page: this.pageData.currentPage,
            id: this.searchForm.id,
            name: this.searchForm.name
        }
        this.loading = true
        this.setUserGroupCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
        this.$http.get(this.$api.xkUserGroupPage, paramList, {}, true)
        .then(res => {
            this.tableData = res.data;
            console.log(res.data)
            this.pageData.total = res.total ? res.total : 0;
            this.loading =false;
        })
        .catch(err => {
            this.$message.error("获取列表失败");
            this.loading = false;
        })
      },
        deleteUserGroup(id,name) { // 删除用户组
        console.log(name)
            this.$confirm(`要删除${name}用户组吗？`,"提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
            .then(()=> {
                this.$http.get(this.$api.xkUserGroupDelete ,{id: id}, true)
                    .then(res => {
                        this.$message.success("删除成功")
                        this.getUserGroupList();
                    })
                    .catch(err => {
                        this.$message.error("删除失败");
                        this.getUserGroupList();
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
        changePage(page,pageSize) {
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getUserGroupList();
      },
    }
}

</script>

<style lang="scss" scoped>

</style>
