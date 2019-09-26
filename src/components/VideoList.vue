<template>
    <el-dialog
            title="小视频列表"
            :visible.sync="dialogVisible"
            append-to-body
            width="1000px"
            :before-close="handleClose">
        <!-- <div class="xk-body commodity-sales">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="search" :loading="searchLoading">搜索
                        </el-button>
                        <el-button type="primary" size="small" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form :model="searchForm" label-width="100px" ref="searchForm"
                         class="demo-ruleForm pubBackground xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="用户Id">
                                <el-input :size="$size" v-model="searchForm.keywords" placeholder="请输入用户ID"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div> -->
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        stripe
                        style="width: 100%"
                        v-loading="tableLoading">
                    <el-table-column
                            label="ID"
                            prop="video_id"
                    >
                    </el-table-column>
                    <el-table-column
                            label="封面">
                        <template slot-scope="scope">
                            <div class="pic-list">
                                <img style="width: 100px" :src="scope.row.first_cover">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="话题名"
                            prop="topic_name">
                    </el-table-column>
                    <el-table-column
                            label="视频描述"
                            prop="topic_name">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="selectedVideo(scope.row)" size="mini" type="primary">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total"
                            @change="changePage"></pagination>
            </div>
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
                searchLoading: false,
                tableLoading: false,
                searchForm: {
                    keywords: ""
                },
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
            }
        },
        created() {
            this.getVideoList();
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false);
            },
            getVideoList() {
                let param = {
                    page: this.page.page - 1,
                    limit: this.page.limit
                }
                this.tableLoading = true;
                this.$http.PhpPost(this.$api.videoList, param)
                    .then(res => {
                        this.tableData = res.video_list;
                        this.page.total = res.total;
                        this.searchLoading = false;
                        this.tableLoading = false;
                    })
                    .catch(err => {
                        this.searchLoading = false;
                        this.tableLoading = false;
                        this.$message.error("获取小视频列表失败！！！")
                    })
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getVideoList();
            },
            selectedVideo(row) {
                this.$emit("changeVideo", row);
                this.handleClose();
            }
        }
    }
</script>

<style scoped>

</style>