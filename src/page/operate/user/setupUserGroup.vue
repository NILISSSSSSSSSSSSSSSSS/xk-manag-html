<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>新增用户组
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
                            <el-input :size="$size" v-model="searchForm.name" placeholder="填写用户组名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户组描述：" >
                            <el-input :size="$size" v-model="searchForm.description" type="textarea" :autosize="{minRows: 3, maxRows: 5}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="box-card margintop20 xk-search">
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
            <div style="overflow:hidden" slot="header" class="clearfix">
                <div style="float:right">
                    <span>选择用户组成员：</span>
                    <span>已选择<span class="num">{{localUseGroup.length}}</span>个用户</span>
                </div>
            </div>
            <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="selectionChange" ref="multipleTable">
                <el-table-column type="selection" width="35px"></el-table-column>
                <el-table-column  label="用户ID" prop="id"></el-table-column>
                <el-table-column  label="用户名称" prop="nickname"></el-table-column>
                <el-table-column  label="所在城市" prop="districtCode"></el-table-column>
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
                <el-table-column  label="平台内推" prop="isRecommend"></el-table-column>
                <el-table-column  label="实名认证" prop="authStatus"></el-table-column>
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
              <el-button type="primary" @click="createUserGroup" :loading="saveLoading" :disabled="saveLoading">确定</el-button>
              <el-button type="plain" @click="goUserGroupsList">返回</el-button>
            </div>
        <!--详情弹框-->
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
      searchLoading: false,
      detailDialog: false,
      searchForm: [],
      searchData: {},
      tableData: [
        {
          code: "1"
        }
      ],
      detailData: [],
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      num: 0,
      userIds: [],
      getPorvinceInfo,
      localUseGroup: [],
      currentIndex: false,
      saveLoading: false
    };
  },
  created() {
    this.getMembersList();
  },
  methods: {
    goUserGroupsList() {
      this.$router.push({ path: "/userGroupsList" });
    },
    resetForm() {
      this.searchForm = [];
    },
    detailClose() {
      this.detailDialog = false;
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
      switch (val) {
        case "male":
          return "男";
        case "female":
          return "女";
        case "unknown":
          return "保密";
      }
    },
    searchTable() {
        this.searchLoading = true;
        this.pageData.currentPage = 1;
        this.getMembersList(true);
    },
    getMembersList(bool) {
        this.currentIndex = false;
        this.sortLocalData(this.userIds);
      // 会员列表
      let paramList = {
        limit: this.pageData.pageSize,
        page: this.pageData.currentPage,
        id: this.searchData.id,
        age1: this.searchData.age1,
        age2: this.searchData.age2,
        sex: this.searchData.sex,
        phone: this.searchData.phone
      };
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
      this.$http
        .get(url, paramList, true)
        .then(res => {
            this.currentIndex = true;
            this.searchLoading = false;
            this.tableData = res
                ? res.data.map(item=>{
                    return {
                        authStatus: this.getAuthStatus(item.authStatus),
                        districtCode: getPorvinceInfo(item.districtCode),
                        erCode: item.erCode,
                        id: item.id,
                        isFrozen: item.isFrozen,
                        isLongVideo: item.isLongVideo,
                        isRecommend: item.isRecommend =0? '否': '是',
                        isShopWindow: item.isShopWindow,
                        level: item.level,
                        mrCode: item.mrCode,
                        nickname: item.nickname,
                        phone: item.phone,
                        uid: item.uid,
                        userIdentities: item.userIdentities
                    }
                })
                : []
          this.isSelectData();
          this.loading = false;
          this.pageData.total = res.total ? res.total : 0;
        })
        .catch(err => {
            this.searchLoading = false;
            this.loading = false;
            this.$message.error("请求会员列表失败");
        });
    },
    clearCondition() {
        this.searchData = {};
        this.pageData.currentPage = 1;
        this.pageData.pageSize = 10;
        this.getMembersList();
    },
    changePage(page, pageSize) {
      [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
      this.getMembersList();
    },
    selectionChange(val) {
      // 选择会员
      this.num = val.length;
      this.userIds = [];
      for (let item of val) {
        this.userIds.push(item.id);
      }
      this.sortCurrSelect(this.userIds)
    },
    createUserGroup() {
      // 添加用户组
      let paramList = {
        name: this.searchForm.name,
        description: this.searchForm.description,
        userIds: this.localUseGroup
      };
      this.saveLoading = true;
      this.$http
        .get(this.$api.xkUserGroupCreate, paramList, true)
        .then(res => {
          this.$message.success("添加成功");
          this.saveLoading = false;
          this.$router.push({ path: "/userGroupsList" });
        })
        .catch(err => {
            this.saveLoading = false;
          this.$message.error(err.message);
        });
    },
    handleDetail(userId) {
        this.$router.push({path: '/userDetail', query: {id: userId}})
    },
    //处理当前页选中
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
    }
  }
};
</script>

<style lang="scss" scoped>
.num {
  display: inline-block;
  margin: 0 10px 0 10px;
  color: #9795e3;
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
