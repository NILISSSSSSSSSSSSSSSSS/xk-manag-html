<template>
    <div class="platform-take-tax-detail xk-container">
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
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderId" :size="$size" placeholder="请输入订单号">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.settleNo" :size="$size" placeholder="请输入流水号">
                            </el-input>
                        </el-form-item>
                    </el-col>
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
                    <el-button v-permission="'platformTakeTaxDetailDown'" type="success" :size="$size" @click="visibleOrder=true">导出到Excel</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="settleNo"></el-table-column>
                <el-table-column label="收益类型">
                    <template slot-scope="scope">
                        {{ scope.row.revenueType | formatProfit }}
                    </template>
                </el-table-column>
                <el-table-column label="订单时间">
                    <template slot-scope="scope">
                        {{ scope.row.createAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商ID" prop="merchantId"></el-table-column>
                <el-table-column label="联盟商类型">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.merchantTypes" :key="item">
                            {{ item | formatTypes }}<template v-if="scope.row.merchantTypes.length-1!=index">，</template>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="联盟商应得收益">
                    <template slot-scope="scope">
                        {{ scope.row.advanceEarningsPrice }}
                    </template>
                </el-table-column>
                <el-table-column label="实得收益">
                    <template slot-scope="scope">
                        {{ scope.row.practicalEarningsPrice }}
                    </template>
                </el-table-column>
                <el-table-column label="代扣金额">
                    <template slot-scope="scope">
                        {{ scope.row.taxAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformTakeTaxDetailInfo'" :size='$size' type="text" @click="gotoDetail(scope.row.settleNo)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <!-- 订单导出 -->
        <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import { EnumMerchantType } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import OrderOut from '@/components/common/OrderOut.vue';
    const EnumProfit = [{label: '平台收益', value: 'PLATFORM'},{label: '销售收益', value: 'SALES'}, {label: '货源推荐收益', value: 'SOURCE_AWARD'}, {label: '直播收益', value: 'LIVE_EARNINGS'}]
    export default {
        data() {
            return {
                labelWidth: '150px',
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                loadingSearch: false,
                loadingTable: false,
                searchForm: {
                    rangeTime: [moment().week(moment().week()).startOf('month'), moment()]
                },
                tableData: [],
                loadingDown: false,
                visibleOrder: false
            }
        },
        components: {
            OrderOut
        },
        computed: {
            ...mapState({
                searchData: state => state.financialMerchant.tax
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
                setTax: "financialMerchant/setTax"
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
                [this.page.page, this.page.limit, this.searchForm] = [1,10,{rangeTime: [moment().week(moment().week()).startOf('month'), moment()]}];
                this.getList();
            },
            getList() {
                let params = {
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): moment(new Date(new Date().setHours(0, 0, 0, 0))).format('X'),
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): moment().format('X'),
                    limit: this.page.limit,
                    page: this.page.page,
                    orderId: this.searchForm.orderId,
                    settleNo: this.searchForm.settleNo
                }
                this.loadingTable = true;
                this.$http.get(this.$api.dividedDeductTaxPage, params, true).then(res=>{
                    this.setTax(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            gotoDetail(settleNo) {
                this.$router.push({
                    path: '/platformTakeTaxDetailInfo',
                    query: {
                        settleNo: settleNo
                    }
                })
            },
            downExcel(limit) {
                let params = {
                    page: this.page.page,
                    limit: limit,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): moment(new Date(new Date().setHours(0, 0, 0, 0))).format('X'),
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): moment().format('X'),
                    orderId: this.searchForm.orderId,
                    settleNo: this.searchForm.settleNo
                }
                this.loadingDown = true;

                this.$http
                .downGet(this.$api.dividedDeductTaxPageDown, params, true)
                .then(res=>{
                    this.loadingDown = false;
                    this.$message.success(res.message);
                })
                .catch(err=>{
                    this.loadingDown = false;
                    this.$message.error(err.message)
                })
            }
        },
        filters: {
            formatTypes(val) {
                return enumFormatter(val, EnumMerchantType);
            },
            formatProfit(val) {
                return enumFormatter(val, EnumProfit, {key: 'value', value: 'label'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .platform-take-tax-detail{
        
    }
</style>
