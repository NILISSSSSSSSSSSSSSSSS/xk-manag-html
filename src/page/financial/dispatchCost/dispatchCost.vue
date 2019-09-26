<template>
    <div class="dispatch-cost xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.tradeNo" :size="$size" placeholder="请输入流水账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNo" :size="$size" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="快递单号：">
                            <el-input v-model="searchForm.logisticsNo" :size="$size" placeholder="请输入快递单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="快递公司：">
                            <el-select v-model="searchForm.logisticsName" :size="$size" placeholder="请选择快递公司">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in EnumLogisticsName" :key="item.key" :value="item.key" :label="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="交易状态：">
                            <el-select v-model="searchForm.status" :size="$size" placeholder="请输入流水账号">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in EnumTradeStatus" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label="交易时间：">
                            <el-date-picker v-model="searchForm.rangeTime" :size="$size" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="tradeNo"></el-table-column>
                <el-table-column label="订单号" prop="orderNo"></el-table-column>
                <el-table-column label="快递单号" prop="logisticsNo"></el-table-column>
                <el-table-column label="快递公司" :formatter="formatLogistics"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{ scope.row.tradeProduct === 'b2c'? '自营商城': scope.row.tradeProduct === 'b2b'? '批发商城': scope.row.tradeProduct === 'o2o'? '商圈': '其它' }}
                    </template>
                </el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="支出运费">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.foPostFee, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="收入运费">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.fiPostFee, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.payStatus ==='paying'? '支付中': scope.row.payStatus ==='success'? '成功': '失败' }}
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import { EnumTradeStatus, EnumLogisticsName } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    export default {
        data() {
            return {
                EnumTradeStatus,
                EnumLogisticsName,
                loadingSearch: false,
                loadingTable: false,
                labelWidth: '150px',
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialDispatch.dispatch
            })
        },
        created() {
            this.searchData
                ? (this.searchForm = this.searchData.searchForm, this.page = this.searchData.page)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setDispatch: "financialDispatch/setDispatch"
            }),
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            searchList() {
                this.page.page = 1;
                this.loadingSearch = true;
                this.getList();
            },
            clearCondition() {
                [this.page.page, this.page.limit, this.searchForm] = [1,10,{}];
                this.getList();
            },
            getList() {
                let params = {
                    tradeNo: this.searchForm.tradeNo,
                    orderNo: this.searchForm.orderNo,
                    logisticsNo: this.searchForm.logisticsNo,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                    logisticsName: this.searchForm.logisticsName,
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.loadingTable = true;
                this.$http.get(this.$api.wlPostFeeQPage, params, true).then(res=>{
                    this.setDispatch(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.loadingTable = false;
                    this.loadingSearch = false;
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            formatLogistics(row) {
                return enumFormatter(row.logisticsName, EnumLogisticsName);
            }
        }
    }
</script>

<style scoped lang="scss">
    .dispatch-cost {

    }
</style>
