<template>
    <el-dialog
            title="商圈店铺商品列表"
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
                <el-form :model="searchForm" label-width="120px" ref="searchForm" :rules="rule"
                         class="demo-ruleForm pubBackground xk-search">
                    <!--第一排-->
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="店铺编码：" prop="code">
                                <el-input type="number" :size="$size" v-model="searchForm.code"
                                          placeholder="请输入店铺编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="店铺商品名称：">
                                <el-input :size="$size" v-model="searchForm.name"
                                          placeholder="输入店铺下的商品名称模糊匹配"></el-input>
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
                <el-tabs v-model="activeModel" @tab-click="search">
                    <el-tab-pane label="服务类" name="1001"></el-tab-pane>
                    <el-tab-pane label="商品类" name="1002"></el-tab-pane>
                    <el-tab-pane label="住宿类" name="1003"></el-tab-pane>
                    <el-tab-pane label="外卖类" name="1004"></el-tab-pane>
                    <el-tab-pane label="在线购物" name="1005"></el-tab-pane>
                </el-tabs>
                <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
                    <el-table-column type="index" width="55px" label="序号"></el-table-column>
                    <el-table-column label="商品图片" prop="code"></el-table-column>
                    <el-table-column label="商品名称" prop="name"></el-table-column>
                    <el-table-column label="商品描述" prop="address"></el-table-column>
                    <el-table-column label="创建时间" prop="createdAt">
                        <template slot-scope="scope">
                            {{scope.row.applyAuditTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" :size="$size" @click="selectedShopGoods(scope.row)">选择</el-button>
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
                activeModel: "1001",
                searchLoading: false,
                loading: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                rule: {
                    code: [
                        {required: true, message: '请输入店铺编码', trigger: 'blur'},
                    ]
                }
            }
        },
        created() {
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false)
            },
            getShopGoodsList() {
                if(!this.searchForm.code){
                    this.tableData = [];
                    this.page.total = 0;
                    return false;
                }
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    condition: {
                        name: this.searchForm.name,
                        shopCode: this.searchForm.code,
                        category: this.activeModel
                    }
                }
                this.loading = true
                this.$http.get(this.$api.shopGoodsQPage, params, true)
                    .then(res => {
                        console.log(res)
                        if(res){
                            this.tableData = res.data
                            this.page.total = res.total
                        }
                        this.loading = false;
                        this.searchLoading = false;
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
                this.getShopGoodsList();
            },
            //根据调价搜索
            search() {
                this.$refs['searchForm'].validate(v => {
                    if (v) {
                        this.page.page = 1;
                        this.searchLoading = true;
                        this.getShopGoodsList();
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
                this.getShopGoodsList();
            },
            selectedShopGoods(row) {
                this.$emit("changeShopGoods", row);
                this.handleClose();
            },
            handleClick() {

            }
        }
    }
</script>

<style lang="scss" scoped src="../page/selfMall/goods/commoditySales.scss"></style>