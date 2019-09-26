<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>推送内容管理
                </div>
                <div class="vus-btn">
                    <el-button type="success" @click="searchFun" :size="$size">查询</el-button>
                    <el-button type="warning" @click="clearFun" :size="$size">清空</el-button>
                    <el-button v-permission="'groomContentRegulationPublish'" type="primary" :size="$size" @click.stop='fnPublishContent'>发布内容</el-button>
                </div>
                <div class="vus-bottom"></div>
                <div class="content-search">
                    <el-form ref="form"
                             :model="form"
                             label-width="100px"
                             inline
                             :size="$size">
                        <el-form-item label="推送id：">
                            <el-input v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="推送标题：">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div v-loading="loadingTable" class="xk-body xk-radius marintop20" style="padding-top:20px !important">
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                    stripe
                    :size="$size">
                <el-table-column
                        type="index"
                        label="序号">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="推送id">
                </el-table-column>
                <el-table-column label="用户组Id">
                    <template slot-scope="scope">
                        <p v-for="(item,index) in scope.row.userGroupNames" :key="index">{{ item }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="标题">
                </el-table-column>
                <el-table-column
                        label="推送时间">
                    <template slot-scope="scope">{{scope.row.pushTime | formatTime}}</template>
                </el-table-column>
                <el-table-column
                        label="是否已推送">
                    <template slot-scope="scope">
                        <span :style="{color : scope.row.isPush === 0 ? '#F56C6C' : '#67C23A'}">{{scope.row.isPush === 0 ? '未推送' : '已推送'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="url"
                        label="活动链接">
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed='right'
                        width='200px'>
                    <template slot-scope="scope">
                        <el-button
                                style="color:#E6A23C"
                                v-permission="'groomContentRegulationEdit'"
                                v-if="scope.row.isPush === 0"
                                type="text"
                                :size="$size"
                                :loading="scope.row.loading"
                                @click="handleChaKan(scope.row)">修改
                        </el-button>
                        <el-button
                                style="color:#F56C6C"
                                v-permission="'groomContentRegulationDel'"
                                v-if="scope.row.isPush === 0"
                                type="text"
                                :size="$size"
                                :loading="scope.row.loading"
                                @click="delPush(scope.row)">删除
                        </el-button>
                        <el-button
                                v-else
                                v-permission="'groomContentRegulationSearch'"
                                type="text"
                                :size="$size"
                                :loading="scope.row.loading"
                                @click="handleChaKan(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total"
                        @change="changePage"></pagination>
        </div>
        <publish-content
                :activityDetail="activityDetail"
                :bPublishContent.sync='bPublishContent'
                :sPublishContentTitle='sPublishContentTitle'
                @successCallback="successCallback">
        </publish-content>
    </div>
</template>
<script>
    import PublishContent from '../../../components/operate/groomContentRegulation/PublishContent.vue';//发布内容（查看）
    export default {
        name: "groomContentRegulation",

        data() {
            return {
                form: {},
                tableData: [],
                page: {
                    limit: 10,
                    page: 1,
                    total: 0
                },
                activityDetail: {},
                bPublishContent: false,
                loadingTable: false,
                sPublishContentTitle: "发布内容",
            };
        },
        components: {
            PublishContent
        },
        created() {
            this.getActivityList();
        },
        methods: {
            searchFun() {
                this.getActivityList();
            },
            clearFun() {
                this.form = {};
                this.getActivityList();
            },
            getActivityList() {
                let param = {
                    limit: this.page.limit,
                    page: this.page.page,
                    title: this.form.title,
                    id: this.form.id
                }
                this.loadingTable = true;
                this.$http.get(this.$api.pushContentPage, param, true)
                    .then(res => {
                        this.tableData = res? res.data: [];
                        this.page.total = res? res.total: 0;
                        this.loadingTable = false;
                    })
                    .catch(err => {
                        this.loadingTable = false;
                        this.$message.error(err.message)
                    })
            },
            handleChaKan(row) {
                this.$set(row, "loading", true);
                this.$http.get(this.$api.pushContentDetail, {id: row.id}, true)
                    .then(res => {
                        console.log(res)
                        this.$set(row, "loading", false);
                        this.activityDetail = res;
                        this.bPublishContent = true;
                        this.sPublishContentTitle = '查看推送内容';
                    })
                    .catch(err => {
                        this.$set(row, "loading", false);
                        this.$message.error(err.message);
                    })
            },
            handleDelete(index, targetData) {
            },
            fnPublishContent() {
                [this.bPublishContent, this.sPublishContentTitle, this.activityDetail] = [true, "发布内容", {}]
            },
            successCallback() {
                this.getActivityList();
            },
            //分页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getActivityList();
            },
            delPush(row) {
                this.$confirm('你确定要删除这条推送吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$api.pushContentDelete, {id: row.id}, true)
                        .then(res => {
                            this.$message.success("删除成功");
                            this.getActivityList();
                        })
                        .catch(err => {
                            this.$message.error(err.message)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
    };
</script>
<style lang='scss'>
    .content-search {
        .el-range-separator {
            padding: 0
        }
    }
</style>