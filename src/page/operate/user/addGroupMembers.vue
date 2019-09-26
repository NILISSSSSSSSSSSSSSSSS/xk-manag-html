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
        <el-form :model="searchData" inline>
            <el-form-item label="ID：">
                <el-input :size="$size" placeholder="请输入用户ID" v-model.trim="searchData.id"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
                <el-input :size="$size" placeholder="请输入手机号码" v-model.trim="searchData.phone"></el-input>
            </el-form-item>
            <el-form-item label="年龄：">
                <el-row>
                    <el-col :span="10">
                        <el-form-item>
                            <el-input :size="$size" placeholder="18" v-model.trim="searchData.age1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="center">~</el-col>
                    <el-col :span="10">
                        <el-form-item>
                            <el-input :size="$size" placeholder="20" v-model.trim="searchData.age2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="性别：">
                <el-select :size="$size" v-model="searchData.sex">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="男" value="male"></el-option>
                    <el-option label="女" value="female"></el-option>
                    <el-option label="保密" value="unknown"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-width="50px" style="margin-left: 0">
                <el-button :size="$size" type="primary"  @click="searchTable()" :loading="searchLoading">搜索</el-button>
                <el-button :size="$size" type="success"  @click="clearCondition()">清空</el-button>
            </el-form-item>
        </el-form>
        <el-card class="box-card margintop20">
            <div slot="header" class="clearfix">
                    <span>选择用户组成员：</span>
                    <span>已选择<span class="num">{{localUseGroup.length}}</span>个用户</span>
            </div>
           <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="selectionChange" ref="multipleTable">
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
        </el-table>
             <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </el-card>
        <div class="content">
              <el-button type="primary" @click="addMembersToGroup">确定</el-button>
              <el-button type="plain" @click="goUserList">返回</el-button>
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
        searchData: {},
        searchLoading: false,
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
        userIds: [],
        getPorvinceInfo,
        localUseGroup: [],
        currentIndex: false
      }
    },
    created() {
        this.getMembersList();
    },
    methods: {
        searchTable() {
            this.searchLoading = true;
            this.pageData.currentPage = 1;
            this.getMembersList(true);
        },
        clearCondition() {
            this.searchData = {};
            this.pageData.currentPage = 1;
            this.pageData.pageSize = 10;
            this.getMembersList();
        },
        goUserList() {
            this.$router.push({path: "/userList", query: {groupId: this.$route.query.groupId}});
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
        getMembersList(bool) { // 会员列表
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                id: this.searchData.id,
                age1: this.searchData.age1,
                age2: this.searchData.age2,
                sex: this.searchData.sex,
                phone: this.searchData.phone
            }
            this.currentIndex = false;
        this.sortLocalData(this.userIds);

            let url = bool? this.$api.userQPage: this.$api.xkUserPage;
            if(this.searchData.age1 && !/^\d*$/.test(this.searchData.age1)) {
                this.$message.error('年龄必须为数字')
                this.searchLoading = false;
                return false;
            }
            if(this.searchData.age2 && !/^\d*$/.test(this.searchData.age2)) {
                this.$message.error('年龄必须为数字')
                this.searchLoading = false;
                return false;
            }
            
            this.loading = true;
            this.$http.get(url, paramList, true)
            .then(res => {
                this.currentIndex = true;
                this.searchLoading = false;
                this.tableData = res?res.data: [];
                this.isSelectData();
                this.loading = false;
                this.pageData.total = res ? res.total : 0;
            })
            .catch(err => {
                this.searchLoading = false;
                this.loading = false;
                this.$message.error(err.message);
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
         this.sortCurrSelect(this.userIds)
      },
      //处理当前页选中内容
    sortCurrSelect(Ids) {
        let isDelete = false;
        let tableData = this.tableData;
        let _Ids = tableData.map(_item=>{
            return _item.id;
        })

        //找出需要删除的
        let deleteItem = []
        tableData.forEach(item=>{
            if(Ids.indexOf(item.id) === -1 && !this.currentIndex) {
                deleteItem.push(item.id);
            }
        })
        Ids.forEach(item=>{
            let index = this.localUseGroup.indexOf(item);
            if(index === -1) {
                this.localUseGroup.push(item);
            }
        })
        deleteItem.forEach(item=>{
            if(this.localUseGroup.indexOf(item)>-1) {
                this.localUseGroup.splice(this.localUseGroup.indexOf(item), 1)
            }
        })
        this.currentIndex = false;
    },
    //处理上一页选中的内容
    sortLocalData(Ids) {
        let isDelete = false;
        let tableData = this.tableData;
        Ids.forEach(item=>{
            let index = this.localUseGroup.indexOf(item);
            if(index === -1) {
                this.localUseGroup.push(item);
            }
        })
    },
    //判断哪些是被选中的
    isSelectData() {
        this.$nextTick(()=>{
            this.currentIndex = true;
            let datas = [];
            this.tableData.forEach(item=>{
                for(let i=0, len = this.localUseGroup.length; i< len; i++) {
                    if(item.id === this.localUseGroup[i]) {
                        datas.push(item);
                    }
                }
            })
            datas.forEach(row=>{
                this.$refs.multipleTable.toggleRowSelection(row);
            })
        })
    },
      addMembersToGroup() { // 添加新成员到用户组
          let paramList = {
              groupId: this.$route.query.groupId,
              userIds: this.localUseGroup
          }
          this.$http.get(this.$api.xkUserGroupPushMember, paramList, true)
          .then(res => {
              this.$message.success("添加成功")
              // 返回到成员组成员页面
              this.$router.push({path: "/userList", query: {groupId: this.$route.query.groupId}})
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
