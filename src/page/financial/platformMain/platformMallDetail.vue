<template>
    <div class="platform-mall-detail xk-container">
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
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="普通商品" name="GOODS"></el-tab-pane>
                <el-tab-pane label="大宗商品" name="BIG_GOODS"></el-tab-pane>
            </el-tabs>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.orderId" :size="$size" placeholder="请输入流水号"></el-input>
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
                    <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="orderId"></el-table-column>
                <el-table-column label="用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.userType ==='user'? '普通用户': '商户' }}
                    </template>
                </el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.orderTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户ID" prop="userId" width="220px"></el-table-column>
                <el-table-column label="用户账号" prop="phone"></el-table-column>
                <template v-if="activeName==='BIG_GOODS'">
                    <el-table-column label="预约金">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.price, 100) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="交易价格">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.tradePrice, 100) }}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column :label="activeName==='BIG_GOODS'?'商品收益': '实付金额'">
                    <template slot-scope="scope">
                        {{ activeName==='BIG_GOODS'?  $math.divide(scope.row.orderIncome, 100) : $math.divide(scope.row.payMoney, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" :formatter="formatStatus"></el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button v-permission="activeName === 'GOODS' ? 'platformMallDetailInfo': 'platformMallBigGoodsDetail'" :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="交易详情" width="600px" :visible.sync="transactionDialog">
            <el-row style="margin-top: -20px;margin-bottom: 10px">
                <el-col class="info">流水号：</el-col>
                <el-col class="info">订单ID：</el-col>
                <el-col class="info">交易时间：</el-col>
                <el-col class="info">付款用户ID：</el-col>
                <el-col class="info">交易金额：</el-col>
                <el-col class="info">付款方式：</el-col>
                <el-col class="info">交易状态：</el-col>
                <el-col class="info">交易类型：</el-col>
            </el-row>
            <el-row style="text-align: center">
                <el-button :size="$size" type="primary" @click="closeDialog">确定</el-button>
                <el-button :size="$size" type="plain" @click="closeDialog">取消</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import { EnumOrderStatus } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    export default {
        data() {
            return {
                labelWidth: '150px',
                tableData: [],
                loadingSearch: false,
                loadingTable: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                orderChannel: [
                    {label: '全部', value: ''},
                    {label: '消费券', value: 'xfq'},
                    {label: '实物券', value: 'swq'},
                    {label: '微信支付', value: 'wxpay'},
                    {label: '支付宝支付', value: 'alipay'}
                ], // 支付方式
                userType: [
                    {label: '全部', value: ''},
                    {label: '联盟商', value: 'merchant'},
                    {label: '广场用户', value: 'user'}
                ],
                orderType: [
                    {label: '全部', value: ''},
                    {label: '常规订单', value: 0},
                    {label: '售后订单', value: 1}
                ],
                transactionDialog: false,
                activeName: 'GOODS'
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialMain.selfMall
            })
        },
        created() {
            this.searchData
                ? (this.searchForm = this.searchData.searchForm, this.page = this.searchData.page, this.activeName = this.searchData.activeName)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setSelfMall: "financialMain/setSelfMall"
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
                    limit: this.page.limit,
                    page: this.page.page,
                    condition: {
                        goodsDivide: this.activeName,
                        orderId: this.searchForm.orderId,
                        timeStart: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                        timeEnd: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): ''
                    }
                }
                this.loadingTable = true;
                this.$http.get(this.$api.mallOBMOrderQPage, params, true).then(res=>{
                    console.log(res)
                    this.setSelfMall(Object.assign({searchForm: this.searchForm}, {page: this.page}, {activeName: this.activeName}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            getDetail(row) { // 订单详情
                this.$router.push({
                    path: '/orderSelfMallDetail',
                    query: {
                        id: row.orderId,
                        activeName: this.activeName
                    }
                })
            },
            transactionDetail(row) { // 交易详情
                this.transactionDialog = true
            },
            closeDialog() {
                this.transactionDialog = false
            },
            formatStatus(row) {
                return enumFormatter(row.orderStatus, EnumOrderStatus);
            },
            tabClick() {
                this.page.page = 1;
                this.searchForm = this.searchData.searchForm;
                this.getList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-mall-detail {
        
    }
    .info {
        margin-left: 30px;
        height: 40px;
        line-height: 40px;
    }
</style>
