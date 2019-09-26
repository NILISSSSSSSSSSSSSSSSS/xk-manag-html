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
                                <el-input v-model="searchData.orderNo" placeholder="请输入消费/充值单号" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="用户ID：">
                                <el-input v-model="searchData.userId" :size="$size" placeholder="请输入用户ID"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item label="类型：">
                                <el-select :size="$size" v-model="searchData.billType">
                                    <el-option value="" label="全部"></el-option>
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
                <div class="vus-btn">
                    <!-- <el-button type="danger" :size="$size" @click="deleteItem()">删除</el-button> -->
                </div>
                <div class="vus-bottom"></div>
                <el-table :data="tableData" v-loading="tableLoading" >
                    <!-- <el-table-column type="selection" width="35"></el-table-column> -->
                    <el-table-column label="消费/充值单号" prop="orderNo"></el-table-column>
                    <el-table-column label="消费/充值时间">
                        <template slot-scope="scope">
                            {{ scope.row.updatedAt | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用户ID" prop="id"></el-table-column>
                    <el-table-column label="数额">
                        <template slot-scope="scope">
                            {{ scope.row.newAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类型">
                        <template slot-scope="scope">
                            {{ scope.row.billType === 'fi'? '充值': scope.row.billType === 'fo'? '消费':'其它' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="去向/来源" :formatter="formatSource"></el-table-column>
                    <el-table-column label="操作" width="130px">
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text" @click="getDetail(scope.row)">查看订单详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>

            <el-dialog title="选择订单" :visible.sync="selectDialog" v-if="orderDetail.orderNoList" width="500px">
                <el-row v-for="item of orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
                    <el-col :span="18">订单号：{{item}}</el-col>
                    <el-col :span="6" style="text-align: center">
                        <el-button :size="$size" type="text" @click="selfOrBusinessDetail(item)">查看详情</el-button>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment';
    import { XfqSources, XkbSources } from "@/util/publicParams.js"
    const EnumIncomeType = [{key: 'fo', value: '消费'},{key: 'fi', value: '充值'}];
    const EnumSource = [{key: 'ottery_earning', value: '商户彩票收益'},
                        {key: 'order_divide_recommend', value: '订单分成-推荐分成'},
                        {key: 'order_divide_sales', value: '订单分成-销售分成'},
                        {key: 'order_divide_source', value: '订单分成-货源分成'},
                        {key: 'xkbCharge', value: '晓可币充值'},
                        {key: 'order_divide_live', value: '订单分成-直播收益'}]
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            currency: {
                default: 'xkb',
                type: String
            }
        },
        data() {
            return {
                EnumIncomeType,
                searchData: {
                    billType: 'fo'
                },
                tableData: [],
                tableLoading: false,
                laodingSearch: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                selectDialog: false,
                orderDetail: {
                    orderNoList: []
                }, // 当前订单的详情
            }
        },
        methods: {
            changePage(page, limit) {
                [this.page.page, this.page.limit] = [page, limit];
                this.getList();
            },
            getDetail(row) {
                if(this.currency === 'xkb') {
                    switch(row.source) {
                        case 'platform_charge': // 平台充值
                            this.$router.push({path: '/orderShopDetail', query: {type: this.currency, id: row.id, source: row.source}});
                            break;
                        case 'shop_charge': // 店铺充值
                            this.$router.push({path: '/orderShopDetail', query: {type: this.currency, id: row.id, source: row.source}});
                            break;
                        case 'winning_red_packets': // 红包
                            this.$router.push({path: '/orderRedDetail', query: {type: 'xkb', id: row.id, source: row.source}});
                            break;
                        case 'giving_red_packets': // 红包
                            this.$router.push({path: '/orderRedDetail', query: {type: 'xkb', id: row.id, source: row.source}});
                            break;
                        case 'giving_gifts': // 礼物
                            this.$router.push({path: '/userGiftDetail', query: {type: 'xkb', id: row.id, source: row.source}});
                            break;
                        case 'game_charge': // 游戏
                            this.$router.push({path: '/userGameDetail', query: {type: 'xkb', id: row.id, source: row.source}})
                        default: 
                            this.$message.warning("来源不存在")
                    }
                } else {
                    switch(row.source) {
                        case 'platform_back': // 平台返还   8月15号自查bug，福利兑奖需从orderList中选
                            this.orderDetail = row;
                            this.selectDialog = true;
                            break;
                        case 'share_award': // 晒单奖励
                            this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: row.orderNo, source: row.source}});
                            break;
                        case 'receiving_gifts': // 收到礼物
                            this.$router.push({path: '/userGiftDetail', query: {type: 'xfq', id: row.id, source: row.source}});
                            break;
                        case 'shopping_deduction': // 购物抵扣, 由多条订单构成，订单要区分商圈和自营
                            // this.$router.push({path: '/orderSelfMallDetail', query: {type: 'xfq', id: val.id, source: val.source}});
                            // break;
                            this.orderDetail = row;
                            this.selectDialog = true
                            break;
                        case 'jamll_exchange': // 福利兑奖  8月15号自查bug，福利兑奖需从orderList中选
                            this.orderDetail = row;
                            this.selectDialog = true;
                            break;
                        case 'draw_hansel': // 抽奖赠送
                            this.$router.push({path: '/orderLotteryDetail', query: {type: 'xfq', id: row.id, source: row.source}})
                            break;
                        case 'platform_charge': // 晓可币充值
                            this.$router.push({path: '/orderShopDetail', query: {type: 'xfq', id: row.id, source: 'xkb_charge'}});
                            break;
                        default:
                            this.$message.warning("来源不存在")
                    }
                }
            },
            selfOrBusinessDetail(orderId) { // 购物抵扣订单跳转
                if(this.orderDetail.source==='jamll_exchange') {
                    this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: orderId, source: "jamll_exchange"}});
                    return false;
                }
                if(this.orderDetail.source==='platform_back') {
                    this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: orderId, source: "platform_back"}});
                    return false;
                }
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
            getList() {
                let params ={
                    currency: this.currency,
                    page: this.page.page,
                    limit: this.page.limit,
                    beginTime: this.searchData.timeRange? moment(this.searchData.timeRange[0]).format('X'): '',
                    endTime: this.searchData.timeRange? moment(this.searchData.timeRange[1]).format('X'): '',
                    orderNo: this.searchData.orderNo,
                    billType: this.searchData.billType,
                    merchantId: this.$route.query.merchantId, 
                    id: this.searchData.userId
                }
                // return false;
                this.tableLoading = true;
                this.$http.get(this.$api.userAccBillQPage, params, true).then(res=>{
                    console.log(res);
                    this.tableLoading = false;
                    this.laodingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.$message.error('查询失败');
                    [this.laodingSearch, this.tableData, this.tableData, this.page.total] = [false, false, [], 0];
                })
            },
            search() {
                this.laodingSearch = true;
                this.page.page=1;
                this.getList();
            },
            clearConditon() {
                [this.page.page, this.page.limit] = [1, 10];
                this.searchData = {
                    billType: 'fo'
                }
                this.getList();
            },
            formatSource(row) {
                return enumFormatter(row.source, this.currency==='xkb'? XkbSources: XfqSources, {key: 'key', value: 'label'});
            }
        },
        watch: {
            show(val) {
                val? this.getList(): null;
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
