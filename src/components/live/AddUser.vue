<template>
    <el-dialog title="新增推荐用户" :visible.sync="dialog" :before-close="handleClose">
            <div class="xk-radius">
                  <div class='xk-title'>
                      <div class="vus-title">
                            <span></span>搜索
                      </div>
                      <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="getSearchList">搜索</el-button>
                        <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                     </div>
                    <div class="vus-bottom"></div>
                  </div>
                  <el-form :model="searchForm" label-position="right" label-width="100px">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="昵称：">
                                <el-input :size="$size" v-model="searchForm.nickName" placeholder="请输入用户昵称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="UID：">
                                <el-input :size="$size" v-model="searchForm.uid" placeholder="请输入用户UID"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询结果
                </div>
            <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe  v-loading="loading">
                 <el-table-column  label="昵称" prop="nickname"></el-table-column>
                 <el-table-column  label="UID" prop="uid"></el-table-column>
                 <el-table-column  label="粉丝数" prop="fansCount"></el-table-column>
                 <el-table-column  label="操作">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" @click="addUser(scope.row.id)">推荐</el-button>
                     </template>
                 </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
            <div class="content">
                <el-button :size="$size" type="plain" @click="handleClose">返回</el-button>
            </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialog: false,
            searchForm: {},
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            tableData: [],
            loading: false
        }
    },
    watch: {
        dialogVisible(val) {
            this.dialog = val
        }
    },
    methods: {
        handleClose() {
            this.$emit("update:dialogVisible", false);
        },
        resetForm() {
            this.searchForm = [];
        },
        getSearchList() { // 搜索列表
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                nickname: this.searchForm.nickName,
                uid: this.searchForm.uid
            }
            console.log('123')
            console.log(paramList)
            this.loading = true;
            this.$http.get(this.$api.xkUserPageSearch, paramList, true)
            .then(res => {
                console.log(res)
                this.tableData = res.data
                this.pageData.total = res.total ? res.total : this.pageData.total
                if(res.total == 0) {
                    this.pageData = 0
                }
                this.loading = false
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getSearchList();
        },
        addUser(id) {
            this.$http.get(this.$api.xkUserRecommendCreate, {id: id}, true)
            .then(res => {
                this.$message.success("推荐成功")
                this.$emit("update:dialogVisible", false);
                this.$emit("success")
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        }
    }

}
</script>

<style lang="scss" scoped>
    .content {
        text-align: center;
        margin-top: 20px;
    }
</style>
