<template>
    <el-dialog
            title="夺奖派对奖品列表"
            :visible.sync="dialogVisible"
            append-to-body
            width="1000px"
            :before-close="handleClose">
        <div class="xk-body commodity-sales">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="submitForm" :loading="isLoading">搜索
                        </el-button>
                        <el-button type="primary" size="small" @click="resetForm">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form :model="ruleForm" label-width="100px" ref="searchForm"
                         class="demo-ruleForm pubBackground xk-search">
                    <!--第一排-->
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="奖品名称：">
                                <el-input :size="$size" v-model.trim="ruleForm.name" placeholder="输入奖品名称"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="奖品ID：">
                                <el-input :size="$size" v-model.trim="ruleForm.id" style="width: 100%;"
                                          placeholder="请输入商品ID"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table stripe :data="tableData" tooltip-effect="dark" v-loading="loadingTable">
                    <el-table-column label="奖品名称" width="300">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="奖品用途">
                        <template slot-scope="scope">
                            <span>{{ scope.row.usage=='expense'?"运营专用奖品": "福利抽奖" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="奖品类型">
                        <template slot-scope="scope">
                            <span>{{ scope.row.type==='substance'?'实物':'虚拟' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="适用对象">
                        <template slot-scope="scope">
                            <span>{{ scope.row.adaptObject==='user'? '普通用户': '商户' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="welfSelected(scope.row)" size="mini" type="primary">选择</el-button>
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
                ruleForm: {},
                tableData: [],
                isLoading: false,
                loadingTable: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
            }
        },
        created() {
            this.getWelfList();
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false)
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getWelfList();
            },
            submitForm() {
                this.isLoading = true;
                this.getWelfList();
            },
            resetForm() {
                this.ruleForm = {};
                this.page.page = 1;
                this.getWelfList();
            },
            getWelfList() {
                let data = {
                    condition: {
                        name: this.ruleForm.name || "",
                        id: this.ruleForm.id || "",
                        usage: "welfare",
                        adaptObject: this.ruleForm.adaptObject || ""
                    },
                    page: this.page.page,
                    limit: this.page.limit
                };
                this.loadingTable = true;
                this.$http.get(this.$api.jfmallGoodsQPage4Manager, data, true
                ).then((res) => {
                    [this.page.total, this.tableData] = [res.total, res.data];
                    [this.isLoading, this.loadingTable] = [false, false];
                }).catch(err => {
                    [this.isLoading, this.loadingTable] = [false, false];
                    this.$message.error(err.message)
                });
            },
            welfSelected(row) {
                this.$emit("welfChange", row);
                this.handleClose();
            }
        }
    }
</script>

<style scoped>

</style>