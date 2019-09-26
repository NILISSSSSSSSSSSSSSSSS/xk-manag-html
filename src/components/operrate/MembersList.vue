 <template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>添加用户组成员
          </div>
            <div class="vus-bottom"></div>
        </div>
        <el-card class="box-card margintop20">
            <div slot="header" class="clearfix">
                    <span>选择用户组成员：</span>
                    <span>已选择<span class="num">{{num}}</span>个用户</span>
            </div>
            <!-- <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="selectionChange">
                <el-table-column type="selection" width="55px"></el-table-column>
                <el-table-column  label="用户ID" prop="code"></el-table-column>
                <el-table-column  label="手机号" prop="phone"></el-table-column>
                <el-table-column  label="会员等级" prop="level"></el-table-column>
                <el-table-column  label="用户实名" prop="realName"></el-table-column>
                <el-table-column  label="身份证号码" prop="idCardNum"></el-table-column>
                <el-table-column  label="基本信息" prop="basic">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="handleDetail(scope.row.id)">查看</el-button>
                </template>
                </el-table-column>
                <el-table-column  label="订单记录" prop="orderRecord">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="orderRecord">查看</el-button>
                </template>
                </el-table-column>
                <el-table-column  label="浏览记录" prop="browseRecord">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="browseRecord">查看</el-button>
                </template>
                </el-table-column>
            </el-table>
             <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change=changePage></pagination> -->
        </el-card>
        <div class="content">
              <el-button type="primary" @click="createUserGroup">确定</el-button>
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
export default {
    name: "",
    data() {
      return {
        labelPosition: "right",
        detailDialog: false,
        searchForm: [],
        tableData: [{
            code: '1'
        }],
        detailData: [],
        pageData: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        loading:false,
        num: 0,
        userIds: []
      }
    },
    created() {
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
        getMembersList() { // 会员列表
            let paramList = {
            limit: this.pageData.pageSize,
            page: this.pageData.currentPage,
            }
            this.loading = true;
            this.$http.get(this.$api.xkUserPage, paramList, true)
            .then(res => {
            this.tableData = res? res.data: []
            this.loading = false;
            this.pageData.total = res ? res.total : 0;
            console.log(this.tableData)
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        handleDetail(id) { // 某个会员详情
            this.detailDialog = true
            this.$http.get(this.$api.xkUserDetail, {id: id}, true)
            .then(res => {
            this.detailData = res
            })
            .catch(err => {
            this.$message.error("查看详情失败")
            })
        },
        changePage(page,pageSize) {
        [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
        this.getMembersList();
      },
      selectionChange(val) { // 选择会员
         this.num = val.length;
         this.userIds = [];
         for(let item of val) {
             this.userIds.push(item.id)
         }
      },
      createUserGroup() { // 添加用户组
          let paramList = {
              name: this.searchForm.name,
              description: this.searchForm.description,
              userIds: this.userIds
          }
          this.$http.get(this.$api.xkUserGroupCreate, paramList, true)
          .then(res => {
              this.$message.success("添加成功")
              this.$router.push({path: "/userGroupsList"})
          })
          .catch(err => {
                  this.$message.error(err.message)
          })
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
