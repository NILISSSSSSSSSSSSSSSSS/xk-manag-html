<template>
    <div class="currency xk-container">
        <!--内容-->
        <div class="xk-body commodity-sales">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>
                        充值设置
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="xkcurrencyAdd" type="primary" :size="$size" @click="addCurrency">新增</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <div class="banner-table">
                        <el-table
                                :data="tableData"
                                :size="$size"
                                stripe
                                border
                                v-loading="vloading"
                                style="width: 100%"
                        >
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="os" label="OS"></el-table-column>
                            <el-table-column prop="platform" label="平台"></el-table-column>
                            <el-table-column label="面额">
                                <template slot-scope="scope">
                                    {{ $math.divide(scope.row.amount, 100) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="充值面额">
                                <template slot-scope="scope">
                                    {{ $math.divide(scope.row.denomination, 100) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="iosId" label="产品ID"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button v-permission="xkcurrencyInfo" type="primary" :loading="scope.row.loading" :size="$size"
                                               @click="fnchakan(scope.row)">
                                        查看详情
                                    </el-button>
                                    <el-button v-permission="xkcurrencyDel" type="danger" :size="$size" @click="fndel(scope.row)" :loading="load">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination
                                :currentPage="page.page"
                                :pageSize="page.limit"
                                :total="page.total"
                                @change="fnpagechange"
                        ></pagination>
                    </div>
                </div>
            </div>
        </div>

        <add-currency :detail="currencyDetail" :dialogVisible.sync="dialogVisible"
                      @successCallback="callback"></add-currency>
    </div>
</template>

<script>
    import AddCurrency from '../../../components/AddCurrency'

    export default {
        components: {
            AddCurrency
        },
        data() {
            return {
                tableData: [],
                currencyDetail: {},
                vloading: false,
                dialogVisible: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }

            }
        },
        created() {
            this.getCurrencyList();
        },
        methods: {
            addCurrency() {
                this.currencyDetail = {};
                this.dialogVisible = true
            },
            getCurrencyList() {
                let param = {
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.vloading = true;
                this.$http.get(this.$api.pagesXkbDenomination, param, true)
                    .then(res => {
                        this.vloading = false;
                        [this.tableData, this.page.total] = [res.data, res.total]
                    })
                    .catch(err => {
                        this.vloading = false;
                        this.$message.error(err.message)
                    })
            },
            callback() {
                this.page.page = 1;
                this.getCurrencyList();
            },
            fnpagechange(page, limit) {
                this.page.page = page;
                this.page.limit = limit;
                this.getCurrencyList();
            },
            fndel(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$api.deleteXkbDenomination, {id: row.id}, true)
                        .then(res => {
                            this.$message.success("删除成功");
                            this.getCurrencyList();
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
            },
            fnchakan(row) {
                this.currencyDetail = row;
                this.dialogVisible = true
            }
        }
    }
</script>

<style scoped>
    .currency {
        width: 100%;
    }
</style>