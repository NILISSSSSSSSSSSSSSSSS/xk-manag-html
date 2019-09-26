<template>
    <div class="xj">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="laodingSearch" @click="search()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearConditon()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form class="xk-search" label-width="120px" :model="searchData">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="消费/充值单号：">
                                <el-input v-model="searchData.billId" placeholder="请输入消费/充值单号" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="用户ID：">
                                <el-input v-model="searchData.merchantId" :size="$size" placeholder="请输入用户ID"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item label="类型：">
                                <el-select :size="$size" v-model="searchData.incomeType">
                                    <el-option label="全部" value="0"></el-option>
                                    <el-option v-for="item in EnumIncomeType" :key="item.key" :value="item.key" :label="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="消费/充值日期：">
                                <el-date-picker :size="$size" v-model="searchData.timeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    列表
                </div>
                <!-- <div class="vus-btn">
                    <el-button type="danger" :size="$size" @click="deleteItem()">删除</el-button>
                </div> -->
                <div class="vus-bottom"></div>
                <el-table :data="tableData" v-loading="tableLoading">
                    <!-- <el-table-column type="selection" width="35"></el-table-column> -->
                    <el-table-column label="消费/充值单号" prop="billId"></el-table-column>
                    <el-table-column label="消费/充值时间">
                        <template slot-scope="scope">
                            {{ scope.row.createdTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用户ID" prop="merchantId"></el-table-column>
                    <el-table-column label="数额">
                        <template slot-scope="scope">
                            {{ scope.row.newAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类型">
                        <template slot-scope="scope">
                            {{ scope.row.billType === 'fi'? '账户入款': scope.row.billType === 'fo'? '账户出款':'其它' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="去向/来源" :formatter="formatSource"></el-table-column>
                    <el-table-column label="操作" width="130px">
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                            <!-- <el-button :size="$size" class="danger" type="text" @click="deleteItem(scope.row.merchantId)">删除</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>

        <!-- 提现详情 -->
        <el-dialog title="提现记录详情" :visible.sync="visible" width="600px" class="verify">
            <el-row>
                <el-col :span="12">提现单号：{{ detail.orderNo }}</el-col>
                <el-col :span="12">申请时间：{{ detail.createdAt | formatTime }}</el-col>
                <el-col :span="12">用户名称：{{ detail.merchantName }}</el-col>
                <el-col :span="12">用户ID：{{ detail.merchantId }}</el-col>
                <el-col :span="12">提现金额：{{ $math.divide(detail.actualAmount, 100) }}</el-col>
                <el-col :span="12">账户余额：{{ detail.usable }}</el-col>
                <el-col :span="12">提现银行：{{ detail.bankName }}</el-col>
                <el-col :span="12">银行卡号：{{ detail.bankCard }}</el-col>
                <el-col :span="12">预留手机号：{{ detail.phone }}</el-col>
                <el-col :span="12">持卡人姓名：{{ detail.cardName }}</el-col>
                <el-col :span="12">审核状态：{{ detail.audit | formatAudit }}</el-col>
                <el-col :span="12" v-if="detail.audit!='UNAUDITED'">审核日期：{{ detail.auditTime | formatTime }}</el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="visible = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment';
    const EnumIncomeType = [{key: '4', value: '销售收益分成'},
                            {key: '3', value: '推荐商品收益'},
                            {key: '2', value: '平台收益分成'},
                            {key: '1', value: '小视频收益 '}];
    const EnumSource = [{key: 'ottery_earning', value: '商户彩票收益'},
                        {key: 'order_divide_recommend', value: '订单分成-推荐分成'},
                        {key: 'order_divide_sales', value: '订单分成-销售分成'},
                        {key: 'order_divide_source', value: '订单分成-货源分成'},
                        {key: 'xkbCharge', value: '晓可币充值'},
                        {key: 'order_divide_live', value: '订单分成-直播收益'}]

    const EnumResource = [{key: 'od_swq', value: '订单分成-实物券'},
                        {key: 'od_recommend', value: '订单分成-推荐分成'},
                        {key: 'od_sales', value: '订单分成-销售分成'},
                        {key: 'od_source', value: '订单分成-货源分成'},
                        {key: 'bcircle_order_income', value: '商户-商圈订单收入所得'},
                        {key: 'anchor_advance', value: '主播提现'},
                        {key: 'shops_advance', value: '商户提现'},
                        {key: 'xkbCharge', value: '晓可币充值'},
                        {key: 'od_live', value: '订单分成-直播收益'}]
    const EnumAuditStatus = [{key: 'UNAUDITED', value: '未审核'},
                            {key: 'UNAPPROVED', value: '未审核通过'},
                            {key: 'VERIFIED', value: '提现中'},
                            {key: 'FINISH', value: '提现成功'},
                            {key: 'UN_FINISH', value: '提现失败'}]
    export default {
        props: {
            show: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                visible: false,
                EnumIncomeType,
                searchData: {
                    incomeType: '0'
                },
                tableData: [],
                tableLoading: false,
                laodingSearch: false,
                selectData: '',
                detail: {},
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            changePage(page, limit) {
                [this.page.page, this.page.limit] = [page, limit];
                this.getList();
            },
            handleSelectionChange(val) {
                this.selectData = val;
            },
            getDetail(row) {
                switch(row.tradeProduct.toLocaleUpperCase()) {
                    case 'GAMES':
                        this.$router.push({
                            path: '/userGameDetail',
                            query: {
                                id: row.orderNo
                            }
                        });
                    break;
                    case 'GIFT':
                        this.$router.push({
                            path: '/userGiftDetail',
                            query: {
                                orderNo: row.orderNo,
                                tradeProduct: row.tradeProduct.toLowerCase()  //默认传这个字段   修改之前为（gift）
                            }
                        });
                    break;
                    case 'REDPACKETS':
                        this.$router.push({
                            path: '/userGiftDetail',
                            query: {
                                orderNo: row.orderNo,
                                tradeProduct: row.tradeProduct  //默认传这个字段   修改之前为（gift）
                            }
                        });
                    break;
                    case 'WHOLESALEMALL':
                        this.$router.push({
                            path: '/orderSelfMallDetail',
                            query: {
                                id: row.orderNo
                            }
                        });
                    break;
                    case 'SELECTMALL':
                        this.$router.push({
                            path: '/orderSelfMallDetail',
                            query: {
                                id: row.orderNo
                            }
                        });
                    break;
                    case 'BCIRCLE':
                        this.$router.push({
                            path: '/buinessMallDetail',
                            query: {
                                orderId: row.orderNo
                            }
                        });
                    break;
                    case 'LOTTERY':
                        this.$router.push({
                            path: '/platformLotteryDetailInfo',
                            query: {
                                lotteryId: row.orderNo
                            }
                        });
                    break;
                    case 'ADVANCE':
                        this.$http.get(this.$api.merchantAdvanceDetail, {id: row.orderNo}, true).then(res=>{
                            this.detail = res;
                            this.visible = true;
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    break;
                }
            },
            deleteItem(id) {
                if(!this.selectData && !id) {
                    this.$message.warning('请至少勾选一项');
                    return false;
                }else{
                    this.$confirm('是否删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type:'warning'
                    }).then(()=>{
                        if(id) {
                            this.deleteItemPost([id])
                        }else{
                            this.deleteItemPost(
                                this.selectData.map(item=>{
                                    return item.id;
                                })
                            )
                        }
                    }).catch(()=>{})
                    
                }
            },
            deleteItemPost(ids) {
                return false;
                this.$http.get(this.$api, ids, true).then(res=>{
                    this.getList();
                })
                .catch(err=>{
                    this.$message.error(err.message)
                });
            },
            getList() {
                let params ={
                    page: this.page.page,
                    limit: this.page.limit,
                    beginTime: this.searchData.timeRange? moment(this.searchData.timeRange[0]).format('X'): '',
                    endTime: this.searchData.timeRange? moment(this.searchData.timeRange[1]).format('X'): '',
                    billId: this.searchData.billId,
                    incomeType: this.searchData.incomeType,
                    merchantId: this.$route.query.merchantId
                }
                this.tableLoading = true;
                this.$http.get(this.$api.merchantCashBillQPage, params, true).then(res=>{
                    this.tableLoading = false;
                    this.laodingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error('查询失败');
                    [this.laodingSearch, this.tableLoading, this.tableData, this.page.total] = [false, false, [], 0];
                })
            },
            search() {
                this.laodingSearch = true;
                this.page.page = 1;
                this.getList();
            },
            clearConditon() {
                [this.page.page, this.page.limit] = [1, 10];
                this.searchData = {
                    incomeType: '0'
                }
                this.getList();
            },
            formatSource(row) {
                return enumFormatter(row.source, EnumResource)
            }
        },
        watch: {
            show(val) {
                val? this.getList() : null;
            }
        },
        filters: {
            formatAudit(val) {
                return enumFormatter(val, EnumAuditStatus)
            }
        }
    }
</script>

<style scoped lang="scss">
    .xj {
        .verify {
            /deep/ .el-row .el-col {
                margin-bottom: 15px;
            }
            
        }
    }
</style>
