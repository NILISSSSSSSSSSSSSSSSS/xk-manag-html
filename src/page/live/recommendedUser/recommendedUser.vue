<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>推荐用户
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form  label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="用户昵称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户UID：" >
                        <el-input :size="$size" v-model="searchForm.uid"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="handleAdd" v-permission="'recommendedUserAdd'">新增</el-button>
                    <!-- <el-button type="primary" :size="$size" @click="batchDelete">导出表格</el-button> -->
                </div>
            <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe  v-loading="loading" @selection-change="handleSelection">
                 <el-table-column  type="selection"></el-table-column>
                 <el-table-column  label="序号" type="index"></el-table-column>
                 <el-table-column  label="UID" prop="uid"></el-table-column>
                 <el-table-column  label="昵称" prop="nickname"></el-table-column>
                 <el-table-column  label="粉丝数（个）" prop="fansCount"></el-table-column>
                 <el-table-column  label="性别">
                     <template slot-scope="scope">
                        {{getSex(scope.row.sex)}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="操作" width="200">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" @click="handleDelete(scope.row.id, scope.row.nickname)" v-permission="'recommendedUserDelete'">删除</el-button>
                     </template>
                 </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
            <add-user :dialogVisible.sync="addDialog"  @success="getUserList"></add-user>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import AddUser from "@/components/live/AddUser"
export default {
    name: 'recommendedUser',
    data() {
        return {
            searchForm: {},
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading: false,
            tableData: [],
            addDialog: false,
            selectionData: [],
            ids: []
        }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getUserList();
    },
    computed: {
        ...mapState({
          searchData: state => state.liveAttention.reUserCommit
      })
    },
    methods: {
        ...mapMutations({
            setReUserCommit: "liveAttention/setReUserCommit"
        }),
        searchList() {
            this.pageData.currentPage = 1;
            this.getUserList();
        },
        resetForm() {
            this.setReUserCommit(null);
            this.searchForm = {}
            this.pageData.currentPage = 1;
            this.getUserList();
        },
        getSex(val) {
            switch(val) {
                case "male":
                    return "男";
                case "female":
                    return "女";
                case "unknown":
                    return "保密";
                default:
                    return val;
            }
        },
        handleSelection(selection) { // 获取选择项
            this.selectionData = selection
            console.log(this.selectionData)
      },
        handleDelete(id, name) { // 删除推荐用户
            this.$confirm(`确认删除昵称为-${name}-的用户吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$http.get(this.$api.xkUserRecommendDelete, {id: id}, true)
                .then(res => {
                    this.$message.success("推荐成功")
                    this.getUserList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(()=> {
                this.$message("已取消删除")
            })
        },
        handleAdd() {
            this.addDialog = true;
        },
        getUserList() { // 推荐用户列表
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                uid: this.searchForm.uid,
                nickname: this.searchForm.name,
            }
            this.setReUserCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
            this.loading = true;
            this.$http.get(this.$api.xkUserRecommendPage, paramList, true)
            .then(res => {
                this.tableData = res.data
                console.log(this.tableData)
                this.pageData.total = res.total ? res.total : this.pageData.total;
                this.loading = false;
            })
            .catch(err => {
                this.$message.error(err.message);
                this.loading = false;
            })
        },
        changePage(page, pageSize) {
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getUserList();
        }
    },
    components: {
        AddUser
    }
}
</script>

<style lang='scss' scpoed>
.imgSize {
    height: 50px;
}
</style>
