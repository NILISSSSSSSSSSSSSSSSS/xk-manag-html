<template>
    <div class="platform-xfq-detail xk-container">
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
                            <el-input v-model="searchForm.billId" :size="$size" placeholder="请输入流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地区：">
                            <province-cascader all v-model="searchForm.code"></province-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型：">
                            <el-select v-model="searchForm.billType" :size="$size" placeholder="请选择业务类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="收入" value="fi"></el-option>
                                <el-option label="支出" value="fo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNo" :size="$size" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户类型：">
                            <el-select v-model="searchForm.userType" :size="$size" placeholder="请选择交易类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="普通用户" value="user"></el-option>
                                <el-option label="联盟商" value="muser"></el-option>
                            </el-select>
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
                    <!-- <el-button type="success" :size="$size" :loading="loadingSearch">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="billId"></el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.userType=='user'? '普通用户': '商户' }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户ID">
                    <template slot-scope="scope">
                        {{ scope.row.userType==='user'? scope.row.userId: scope.row.merchantId }}
                    </template>
                </el-table-column>
                <el-table-column label="订单号" prop="orderNo"></el-table-column>
                <el-table-column label="交易类型">
                    <template slot-scope="scope">
                        {{ getSource(scope.row.source) }}
                    </template>
                </el-table-column>
                <el-table-column label="交易金额">
                    <template slot-scope="scope">
                        {{ scope.row.newAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="业务类型">
                    <template slot-scope="scope">
                        {{ scope.row.billType==='fi'? '收入': scope.row.billType==='fo'? '支出': scope.row.billType }}
                    </template>
                </el-table-column>
                <el-table-column label="地区">
                    <template slot-scope="scope">
                        {{ getPorvinceInfo(scope.row.code) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformXfqDetailInfo'" :size="$size" type="text" @click="handleDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="margintop20">平台总计：{{ balance? balance: 0 }}元</div>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="选择订单" :visible.sync="selectDialog" width="500px">
            <template v-if="orderDetail.orderNoList">
                <el-row v-for="item of orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
                    <el-col :span="18">订单号：{{item}}</el-col>
                    <el-col :span="6" style="text-align: center">
                        <el-button :size="$size" type="text" @click="selfOrBusinessDetail(item)" v-if="orderDetail.source === 'shopping_deduction'">查看详情</el-button>
                        <el-button :size="$size" type="text" @click="orderPlatformDetail(item)" v-if="orderDetail.source === 'platform_back'">查看详情</el-button>
                        <el-button :size="$size" type="text" @click="welfareDetail(item)" v-if="orderDetail.source === 'jamll_exchange'">查看详情</el-button>
                        <el-button :size="$size" type="text" @click="b2cPayBackDetail(item)" v-if="orderDetail.source === 'mall_pay_back'">查看详情</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { getPorvinceInfo,enumFormatter } from '@/util/publicMehotds.js';
    import { XfqSources } from "@/util/publicParams";
    import { mapMutations, mapState } from 'vuex';
    import moment from 'moment';
    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                getPorvinceInfo,
                labelWidth: '150px',
                loadingSearch: false,
                loadingTable: false,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                selectDialog: false,
                orderDetail: {}, // 当前订单的详情
                balance: 0
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialCurrency.xfq
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
                setXfq: "financialCurrency/setXfq"
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
                    currency: 'xfq',
                    page: this.page.page,
                    limit: this.page.limit,
                    code: this.searchForm.code? this.searchForm.code[this.searchForm.code.length-1]: '',
                    orderNo: this.searchForm.orderNo,
                    billId: this.searchForm.billId,
                    userType: this.searchForm.userType,
                    billType: this.searchForm.billType,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): ''
                }
                this.loadingTable = true;
                this.$http.get(this.$api.platformAccBillQPage, params, true).then(res=>{
                    this.setXfq(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res? res.pageable.data: [];
                    this.page.total = res? res.pageable.total: 0;
                    this.balance = res.newBalance
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            handleDetail(val) {
                switch(val.source) {
                    case 'platform_back': // 平台返还
                        // this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: val.billId, source: val.source}});
                        this.orderDetail = val;
                        this.selectDialog = true
                        break;
                    case 'mall_pay_back': // 自营销售分成所得
                        this.orderDetail = val;
                        this.selectDialog = true
                        break;
                    case 'share_award': // 晒单奖励
                        this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: val.orderNo, source: val.source}});
                        break;
                    case 'receiving_gifts': // 收到礼物
                        this.$router.push({path: '/userGiftDetail', query: {type: 'xfq', id: val.billId, source: val.source}});
                        break;
                    case 'shopping_deduction': // 购物抵扣, 由多条订单构成，订单要区分商圈和自营
                        // this.$router.push({path: '/orderSelfMallDetail', query: {type: 'xfq', id: val.id, source: val.source}});
                        // break;
                        this.orderDetail = val;
                        this.selectDialog = true
                        break;
                    case 'jamll_exchange': // 福利兑奖
                        // this.$router.push({path: '/orderLotteryDetail', query: {type: 'xfq', id: val.billId, source: val.source}})
                        this.orderDetail = val;
                        this.selectDialog = true
                        break;
                    case 'draw_hansel': // 抽奖赠送
                        this.$router.push({path: '/orderLotteryDetail', query: {type: 'xfq', id: val.billId, source: val.source}})
                        break;
                    case 'platform_charge': // 晓可币充值
                        this.$router.push({path: '/orderShopDetail', query: {type: 'xfq', id: val.billId, source: 'xkb_charge'}});
                        break;
                    case 'game_consume_back':
                        this.$router.push({path: '/userGameDetail', query: {id: val.orderNo}});
                        break;
                    default:
                        this.$message.warning("来源不存在")
                }
            },
            selfOrBusinessDetail(orderId) { // 购物抵扣订单跳转
                switch(this.orderDetail.tradeProduct) {
                    case 'b2b':
                        this.$router.push({path: '/orderSelfMallDetail', query: {id: orderId}})
                        break;
                    case 'b2c':
                        this.$router.push({path: '/orderSelfMallDetail', query: {id: orderId}})
                        break;
                    case 'o2o':
                        this.$router.push({path: '/buinessMallDetail', query: {orderId: orderId}})
                        break;
                }
            },
            orderPlatformDetail(orderId) { // 平台返还订单详情
                this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: orderId, source: 'platform_back'}});
            },
            welfareDetail(orderId) { // 福利兑奖订单详情
                this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: orderId, source: 'jamll_exchange'}})
            },
            b2cPayBackDetail(orderId) { // 自营销售分成所得
                this.$router.push({path: '/orderSelfMallDetail', query: {id: orderId}})
            },
            getSource(val) {
                return enumFormatter(val, XfqSources, {key: 'key', value: 'label'});
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-xfq-detail {
        
    }
</style>
