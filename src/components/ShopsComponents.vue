<template>
    <el-dialog
            title="商圈店铺列表"
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
                        <el-button type="primary" size="small" @click="search" :loading="searchLoading">搜索
                        </el-button>
                        <el-button type="primary" size="small" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form :model="searchForm" label-width="100px" ref="searchForm"
                         class="demo-ruleForm pubBackground xk-search">
                    <!--第一排-->
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="店铺编码：">
                                <el-input type="number" :size="$size" v-model="searchForm.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="店铺名称：">
                                <el-input :size="$size" v-model="searchForm.name"></el-input>
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
                <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
                    <el-table-column type="index" width="55px" label="序号"></el-table-column>
                    <el-table-column label="店铺编码" prop="code"></el-table-column>
                    <el-table-column label="店铺名称" prop="name"></el-table-column>
                    <el-table-column label="店铺地址" prop="address"></el-table-column>
                    <el-table-column label="所属商户名称" prop="merchantName"></el-table-column>
                    <el-table-column label="创建时间" prop="createdAt">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" :size="$size" @click="selectedShops(scope.row)">选择</el-button>
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
                searchForm: {},
                tableData: [],
                searchLoading: false,
                loading: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
            }
        },
        created() {
            this.getShopList();
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false)
            },
            getShopList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    code: this.searchForm.code,
                    name: this.searchForm.name,
                }
                this.loading = true
                this.$http.get(this.$api.mShopOnlineQPage, params, true)
                    .then(res => {
                        if(res){
                            this.tableData = res.data
                            this.page.total = res.total
                            this.loading = false;
                            this.searchLoading = false;
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                        this.searchLoading = false;
                        this.$message.error(err.message);
                    })
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getShopList();
            },
            //根据调价搜索
            search() {
                this.$refs['searchForm'].validate(v => {
                    if (v) {
                        this.searchLoading = true;
                        this.getShopList();
                    } else {
                        return false;
                    }
                })

            },
            //清空搜索条件
            clearInput() {
                this.searchForm = {};
                this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : "";
                this.page.page = 1;
                this.getShopList();
            },
            selectedShops(row) {
                this.$emit("changeShops", row);
                this.handleClose();
            }
        }
    }
</script>

<style lang="scss" scoped src="../page/selfMall/goods/commoditySales.scss"></style>