<template>
    <div class="zs">
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
                                <el-input :size="$size" v-model="searchData.merchantId" placeholder="请输入路用户ID"></el-input>
                            </el-form-item>
                        </el-col> -->
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
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
                <el-table :data="tableData" v-loading="tableLoading">
                    <!-- <el-table-column type="selection" width="35"></el-table-column> -->
                    <el-table-column label="消费/充值单号" prop="id"></el-table-column>
                    <el-table-column label="消费/充值时间">
                        <template slot-scope="scope">
                            {{ scope.row.updatedAt | formatTime }}
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
                            <el-button :size="$size" type="text" :loading="scope.row.loading" @click="getDetail(scope.row)">查看订单详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>

        <el-dialog title="选择订单" :visible.sync="selectDialog" v-if="orderDetail.orderNoList" width="500px">
            <el-row v-for="item of orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
                <el-col :span="18">订单号：{{item}}</el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button :size="$size" type="text" @click="openDiaDetail(item)">查看详情</el-button>
                </el-col>
            </el-row>
        </el-dialog>

        <!-- 消费明细详情 -->
        <!-- <el-dialog title="消费明细详情" :visible.sync="visible" class="dialog-visible">
            <el-row>
                <el-col :span="12">充值单号：{{ detail.order.orderId }}</el-col>
                <el-col :span="12">充值时间：{{ detail.order.createdAt | formatTime }}</el-col>
                <el-col :span="12">用户ID：{{ detail.givingUser.phone }}</el-col>
                <el-col :span="12">用户名称：{{ detail.givingUser.userName }}</el-col>
                <el-col :span="12">消费：{{ detail.punishSource | formatResource }}</el-col>
                <el-col :span="12">账户余额：{{ detail.punishSource | formatResource }}</el-col>
                <el-col :span="12">来源：{{ detail.punishSource | formatResource }}</el-col>
                <el-col :span="12">订单号：{{ $math.divide(detail.punishAmount, 100) }}</el-col>
                <el-col :span="3">购买商品：</el-col>
                <el-col :span="21">
                    <div class="xk-table">
                        <div class="table-box table-title">
                            <div>商品ID</div>
                            <div>商品名</div>
                            <div>商品单价</div>
                            <div>商品数量</div>
                        </div>
                        <div class="table-box">
                            <div>粉丝活跃量</div>
                            <div>2018-18-18至少</div>
                            <div>200</div>
                            <div>200</div>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="visible=false">确定</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
    import { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment';
    const EnumSource = [{key: 'giving_gifts', value: '礼物所得'},
                        {key: 'winning_red_packets', value: '红包所得-推荐分成'}]
    export default {
        props: {
            show: {
                default: false,
                type: Boolean
            },
            userId: String
        },
        data() {
            return {
                searchData: {},
                tableData: [],
                tableLoading: false,
                laodingSearch: false,
                selectData: '',
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                detail: {
                    order: {},
                    givingUser: {}
                },
                orderDetail: {},
                selectDialog: false,
                visible: false
            }
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
                this.orderDetail = row;
                this.selectDialog = true;
            },
            openDiaDetail(orderNo) {
                if(this.orderDetail.source==='giving_gifts') {
                    this.$router.push({
                        path: '/userGiftDetail',
                        query: {
                            orderNo: orderNo,
                            tradeProduct: this.orderDetail.tradeProduct //默认传这个字段
                        }
                    })
                }else{
                    this.$router.push({
                        path: '/orderRedDetail',
                        query: {
                            id: orderNo
                        }
                    })
                }
            },
            getList() {
                let params ={
                    currency: 'zs',
                    page: this.page.page,
                    limit: this.page.limit,
                    beginTime: this.searchData.timeRange? moment(this.searchData.timeRange[0]).format('X'): '',
                    endTime: this.searchData.timeRange? moment(this.searchData.timeRange[1]).format('X'): '',
                    billId: this.searchData.billId,
                    merchantId: this.$route.query.userId,
                }
                this.tableLoading = true;
                this.$http.get(this.$api.merchantBillQPage, params, true).then(res=>{
                    console.log(res)
                    this.tableLoading = false;
                    this.laodingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
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
                [this.page.page, this.page.limit, this.searchData] = [1, 10, {}];
                this.searchData = {};
                this.getList();
            },
            formatSource(row) {
                return enumFormatter(row.source, EnumSource)
            }
        },
        watch: {
            show(val) {
                if(val) {
                    this.getList();
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .zs {
        .dialog-visible {
            h4 {
                font-size: 15px;
                margin-bottom: 10px;
                font-weight: bolder;
                &::after{
                    content: "";
                    display: block;
                    height: 1px;
                    background: #ccc;
                    margin-top: 10px;
                }
                .fr {
                    float: right
                }
            }
            /deep/ .el-row .el-col {
                margin-bottom: 15px;
            }
            .xk-table {
                border: 1px solid #ccc;
                .table-box {
                    display: flex;
                    div {
                        text-align: center;
                        flex: 1;
                        padding: 10px 0;
                    }
                }
                .table-title {
                    border-bottom: 1px solid #ccc;
                }
            }
        }
    }
</style>
