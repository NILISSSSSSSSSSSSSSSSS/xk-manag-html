<template>
    <div class="xk-container">
        <div class="selfmall-manager-closelist">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button :loading="loadingSearch" type="primary" :size="$size"
                                   @click="submitForm('ruleForm')">搜索
                        </el-button>
                        <el-button type="primary" :size="$size" @click="resetForm('ruleForm')">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form :model="ruleForm" :label-width="labelWidth" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="资讯ID：">
                                <el-input v-model="ruleForm.id" placeholder="请输入资讯ID" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="资讯标题：">
                                <el-input v-model="ruleForm.title" placeholder="请输入资讯标题" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="资讯类型：">
                                <el-select :size="$size" v-model="ruleForm.activityTypeId">
                                    <el-option v-for="(item,index) in activityType" :label="item.name" :value="item.id"
                                               :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发布日期：">
                                <el-date-picker
                                        v-model="ruleForm.searchTime"
                                        :size="$size"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="marintop20 xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="'informationPublish'" @click="addModel" :size="$size" type="primary">发布内容</el-button>

                    </div>
                </div>
                <el-table v-loading="loadingTab" :data="tableData">
                    <el-table-column label="资讯ID" prop="id"></el-table-column>
                    <el-table-column label="资讯标题" prop="title"></el-table-column>
                    <el-table-column label="资讯内容">
                        <template slot-scope="scope">
                            <div class="information-detail">
                                {{scope.row.content}}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="H5外链" prop="url"></el-table-column> -->
                    <el-table-column label="发布时间">
                        <template slot-scope="scope">
                            {{scope.row.pushTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="类型">
                        <template slot-scope="scope">
                            {{scope.row.activityName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button :loading="scope.row.loading" @click="getInformationDetail(scope.row)" v-permission="'informationEdit'"
                                       type="primary" :size="$size">编辑
                            </el-button>
                            <el-button @click="delInformation(scope.row.id)" type="danger" :size="$size" v-permission="'informationDel'">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total"
                            @change="changePage"></pagination>
            </div>
        </div>

        <add-information :dialogVisible.sync="dialogVisible" :information="information" :activityTypes="activityType"
                         :userGroup="userGroup" @successCallback="successCallback"></add-information>

    </div>

</template>

<script>
    import AddInformation from '../../../components/operate/AddInformation.vue'
    import moment from 'moment'

    export default {
        components: {
            AddInformation
        },
        data() {
            return {
                ruleForm: {
                    searchTime: []
                },
                tableData: [],
                loadingTab: false,
                loadingSearch: false,
                dialogVisible: false,
                labelWidth: "120px",
                activityType: [],
                userGroup: [],
                information: {
                    consultType: 'text'
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
            }
        },
        methods: {
            submitForm() {
                this.loadingSearch = true;
                this.getInformation();
            },
            resetForm() {
                this.ruleForm = {searchTime: []};
                this.getInformation();
            },
            getUserGroup() {
                let param = {
                    limit: 100,
                    page: 1
                };
                this.$http.get(this.$api.xkUserGroupPage, param, true)
                    .then(res => {
                        this.userGroup = res.data;
                    })
                    .catch(err => {

                    })
            },
            getActivityTypePage() {
                let param = {
                    limit: 100,
                    page: 1
                };
                this.$http.get(this.$api.activityTypePage, param, true)
                    .then(res => {
                        this.activityType = res.data;
                        this.setTabActivityName();
                    })
                    .catch(err => {

                    })
            },
            setTabActivityName(){
                for (let item of this.tableData) {
                    for (let val of this.activityType) {
                        if (item.activityTypeId === val.id) {
                            this.$set(item, "activityName", val.name);
                            break;
                        }
                    }
                }
            },
            successCallback() {
                this.page.limit = 10;
                this.page.page = 1;
                this.getInformation();
            },
            getInformation() {
                let param = {
                    id: this.ruleForm.id,
                    title: this.ruleForm.title,
                    activityTypeId: this.ruleForm.activityTypeId,
                    limit: this.page.limit,
                    page: this.page.page
                };
                if (this.ruleForm.searchTime && this.ruleForm.searchTime.length > 0) {
                    param.from = (Number(moment(this.ruleForm.searchTime[0], "YYYY-MM-DD 00:00:00").valueOf())) / 1000;
                    param.to = (Number(moment(this.ruleForm.searchTime[1], "YYYY-MM-DD 23:59:59").valueOf())) / 1000;
                }
                this.loadingTab = true;
                this.$http.get(this.$api.consultContentPage, param, true)
                    .then(res => {
                        [this.loadingTab, this.loadingSearch, this.tableData, this.page.total] = [false, false, res.data, res.total];
                        this.setTabActivityName();
                    })
                    .catch(err => {
                        [this.loadingTab, this.loadingSearch] = [false, false];
                        this.$message.error(err.message);
                    })

            },
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getInformation();
            },
            addModel() {
                this.information = {
                    consultType: 'text'
                };
                this.dialogVisible = true;
            },
            getInformationDetail(row) {
                this.$set(row, "loading", true);
                this.$http.get(this.$api.consultContentDetail, {id: row.id}, true)
                    .then(res => {
                        console.log(res)
                        this.$set(row, "loading", false);
                        [this.information, this.dialogVisible] = [res, true];
                    })
                    .catch(err => {
                        this.$set(row, "loading", false);
                        this.$message.error(err.message);
                    })
            },
            delInformation(id) {
                this.$confirm('此操作将删除该资讯, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$api.consultContentDelete, {id}, true)
                        .then(res => {
                            this.$message.success("删除成功");
                            this.getInformation();
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
        created() {
            (async () => {
                await this.getInformation();
                this.getActivityTypePage();
            })();
            this.getUserGroup();
        }
    }
</script>

<style scoped>
    .information-detail {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
</style>