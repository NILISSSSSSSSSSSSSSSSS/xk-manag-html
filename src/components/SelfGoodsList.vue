<template>
    <el-dialog
            title="自营商城商品列表"
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
                            <el-form-item label="商品名称">
                                <el-input size="small" v-model="searchForm.name" placeholder="请输入商品名称"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品ID">
                                <el-input size="small" v-model="searchForm.id" style="width: 100%;"
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
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        stripe
                        style="width: 100%"
                        v-loading="tableLoading">
                    <el-table-column
                            label="商品图片"
                            width="120">
                        <template slot-scope="scope">
                            <div class="pic-list">
                                <img :src="scope.row.pic" alt="" @click="$viewImage(scope.row.pic)">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="商品名称"
                            prop="name"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            label="零售价格(元)"
                            width="120">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.b2cPrice, 100) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="批发价格(元)"
                            width="120">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.b2bPrice, 100) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="发布时间"
                            prop="updatedAt"
                            width="170">
                        <template slot-scope="scope">
                            {{ scope.row.updatedAt | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="80" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       type="primary"
                                       @click="selectedGoods(scope.row)">选择
                            </el-button>
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
                tableLoading: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
            }
        },
        created() {
            this.getGoodsList();
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false)
            },
            getGoodsList() {
                this.tableLoading = true;
                let params = {
                    condition: {
                        id: this.searchForm.id || "",
                        name: this.searchForm.name || '',
                        category: this.searchForm.category && this.searchForm.category[this.searchForm.category.length - 1] !== '000000' ? this.searchForm.category[this.searchForm.category.length - 1] : '',
                        minPrice: this.searchForm.minPrice * 100 || '',
                        maxPrice: this.searchForm.maxPrice * 100 || '',
                        minSaleQ: this.searchForm.minSaleQ || '',
                        maxSaleQ: this.searchForm.maxSaleQ || ''
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.$http.get(this.$api.goodsOnSaleQPage, params, true).then(res => {
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.searchLoading = false;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableData = [];
                    this.searchLoading = false;
                    this.tableLoading = false
                    this.$message.error(err.message)
                })
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getGoodsList();
            },
            //根据调价搜索
            search() {
                this.$refs['searchForm'].validate(v => {
                    if (v) {
                        this.searchLoading = true;
                        this.getGoodsList();
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
                this.getGoodsList();
            },
            selectedGoods(row) {
                this.$emit("changeSelect", row);
                this.handleClose();
            }
        }
    }
</script>

<style lang="scss" scoped src="../page/selfMall/goods/commoditySales.scss"></style>