<template>
    <div class="xk-container active-rigion-list">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" size="small" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" label-width="120px" class="xk-search">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="订单ID：">
                                    <el-input v-model="searchForm.orderId" :size="$size" placeholder="请输入订单ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="用户手机号：">
                                    <el-input v-model="searchForm.phone" :size="$size" placeholder="请输入用户手机号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="开票状态：">
                                    <el-select v-model="searchForm.isNeedInvoice" :size="$size">
                                        <el-option v-for="(item,index) in EnumInvoice" :key="index" :label="item.value" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="下单日期：">
                                    <el-date-picker
                                        :size="$size"
                                        v-model="searchForm.rangeTime"
                                        type="daterange"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <!-- 表格 -->
                <el-table :data="tableData" v-loading="tableLoading" border>
                    <el-table-column label="订单ID" prop="orderId"></el-table-column>
                    <el-table-column label="下单时间">
                        <template slot-scope="scope">
                            {{ scope.row.orderTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="抬头类型">
                        <template slot-scope="scope">
                            {{ scope.row.type | formatType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用户手机号" prop="phone"></el-table-column>
                    <el-table-column label="发票类型">
                        <template slot-scope="scope">
                            {{ scope.row.invoiceType!=='NONE'? scope.row.invoiceType : '无' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发票金额">
                        <template slot-scope="scope">
                            {{ scope.row.payMoney? $math.divide(scope.row.payMoney, 100).toFixed(2): '0.00' }}  ¥
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.isNeedInvoice == 0? '未开发票': '已开发票' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button v-permission="'invoiceManagerDetail'" :disabled="scope.row.isNeedInvoice==0? true: false" :loading="scope.row.loading" :type="scope.row.isNeedInvoice==0? '': 'primary'" :size="$size" @click="viewDetail(scope.row)">发票详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>

        <!-- 发票详情页 -->
        <el-dialog title="发票详情" :visible.sync="dialogVisible" class="invoice-dialog">
            <el-row>
                <el-col :span="24" class="title">订单信息</el-col>
                <el-col :span="8" class="con">订单ID：{{ detailForm.orderId }}</el-col>
                <el-col :span="8" class="con">下单时间：{{ detailForm.orderTime | formatTime }}</el-col>
                <el-col :span="8" class="con" v-if="detailForm.payChannel">订单金额：
                    <span v-for="(item,index) in JSON.parse(detailForm.payChannel)" :key="index">
                        {{ $math.divide(item.amount, 100) + ' ' }}{{ item.payChannel | formatTicket }}
                    </span>
                </el-col>
                <el-col :span="8" class="con" v-if="detailForm.payChannel">支付方式：
                    <span v-for="(item, index) in JSON.parse(detailForm.payChannel)" :key="index">
                        {{ item.payChannel | formatTicket }}{{ '  ' }}
                    </span>
                </el-col>
                <el-table show-summary :data="detailForm.goods" :summary-method="getSummaries">
                    <el-table-column label="商品名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.goodsName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="规格型号">
                        <template slot-scope="scope">
                            {{ scope.row.goodsAttr }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位">
                        <template slot-scope="scope">
                            件
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            {{ scope.row.buyCount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单价">
                        <template slot-scope="scope">
                            {{ scope.row.realPrice? $math.divide(scope.row.realPrice, 100).toFixed(2): '0.00' }}  ¥
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" prop="totalPrice">
                        <template slot-scope="scope">
                            {{ scope.row.totalPrice?$math.divide(scope.row.totalPrice, 100).toFixed(2): '0.00' }}  ¥
                        </template>
                    </el-table-column>
                    <el-table-column label="税率">
                        <template slot-scope="scope">
                            {{ $math.multip(scope.row.taxRate, 100) }}%
                        </template>
                    </el-table-column>
                    <el-table-column label="税额" prop="taxAmount">
                        <template slot-scope="scope">
                            {{ scope.row.taxAmount?$math.divide(scope.row.taxAmount, 100): '0.00' }}  ¥
                        </template>
                    </el-table-column>
                </el-table>
                <!-- </div> -->
                <el-col :span="24" class="title marintop20">发票信息</el-col>
                <el-col :span="8" class="con">发票类型：{{ detailForm.invoiceType }}</el-col>
                <el-col :span="8" class="con">发票抬头：{{ detailForm.type | formatType }}</el-col>
                <el-col :span="24" class="con">发票代码：{{ detailForm.invoiceCode }}</el-col>
                <el-col :span="24" class="con">发票号码：{{ detailForm.invoiceNum }}</el-col>
                <el-col :span="24" class="con">发票内容：{{ detailForm.invoiceContent }}</el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="dialogVisible=false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    //枚举发票类型
    const EnumInvoice = [{key: "", value: '全部'},{key: 1, value: '已开发票'},{key: 0, value: '未开发票'}];
    //枚举发票抬头
    const EnumType = [{key: "PERSONAL", value: '个人'},{key: 'ENTERPRISE', value: '企业'},{key: 'NONE', value: '无'}]
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import  { EnumTicketType } from '@/util/publicParams.js';
    import  { enumFormatter } from '@/util/publicMehotds.js';
    export default {
        data() {
            return {
                EnumInvoice: EnumInvoice,
                EnumType: EnumType,
                searchLoading: false,
                tableLoading: false,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近三天',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                dialogVisible: false,
                tableData: [],

                detailForm: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallSet.searchCondition
            })
        },
        created() {
            this.searchData? (this.page=this.searchData.page,this.searchForm = this.searchData.searchForm): null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setSearchCondition: "selfMallSet/setSearchCondition"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearInput() {
                this.searchForm = {};
                this.page.page=1;
                this.getList();
            },
            getList() {
                let params = {
                    orderId: this.searchForm.orderId || '',
                    phone: this.searchForm.phone || '',
                    orderStartTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    orderEndTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X') : '',
                    isNeedInvoice: this.searchForm.isNeedInvoice&this.searchForm.isNeedInvoice!=0?  this.searchForm.isNeedInvoice: '',
                    page: this.page.page,
                    limit: this.page.limit
                };
                this.tableLoading = true;
                this.$http.get(this.$api.invoiceQPage, params, true)
                    .then(res=>{
                        console.log(res)
                        this.setSearchCondition(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                        this.tableData = res.data;
                        this.page.total = res.total;
                        this.tableLoading = false;
                        this.searchLoading = false;
                    })
                    .catch(err=>{
                        err.code===409? this.tableData = []: null;
                        this.$message.error(err.message);
                        this.tableLoading = false;
                        this.searchLoading = false;
                    })
            },
            //发票详情
            viewDetail(row) {
                this.$set(row, 'loading', true);
                this.$http.get(this.$api.invoiceDetail, {orderId: row.orderId}, true).then(res=>{
                    console.log(res);
                    this.dialogVisible = true;
                    this.detailForm = res;
                    this.$set(row, 'loading', false);
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'loading', false);
                })
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return (prev + curr);
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] = this.$math.divide(sums[index], 100) + ' ¥';
                } else {
                    sums[index] = '';
                }
                });
                return sums;
            }
        },
        watch: {
            searchForm: {
                handler(val, old) {
                    this.page.page = 1;
                },
                deep: true
            }
        },
        filters: {
            formatType(val) {
                return enumFormatter(val, EnumType)
            },
            formatTicket(val) {
                return enumFormatter(val, EnumTicketType)
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "./invoiceManager.scss";
</style>
