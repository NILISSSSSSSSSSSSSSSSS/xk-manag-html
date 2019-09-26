<template>
    <div class="swq">
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
                </div>
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
                    <el-table-column label="去向/来源">
                        <template slot-scope="scope">
                            {{ scope.row.tradeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="130px">
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text" @click="getDetail(scope.row)">查看订单详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
            <el-dialog title="选择订单" :visible.sync="selectDialog" v-if="this.orderDetail.orderNoList" width="500px">
                <el-row v-for="item of this.orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
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
    // const EnumSource = [{key: 'ottery_earning', value: '商户彩票收益'},
    //                     {key: 'order_divide_recommend', value: '订单分成-推荐分成'},
    //                     {key: 'order_divide_sales', value: '订单分成-销售分成'},
    //                     {key: 'xkbCharge', value: '晓可币充值'},
    //                     {key: 'order_divide_source', value: '订单分成-货源分成'},
    //                     {key: 'order_divide_live', value: '订单分成-直播收益'}]
    export default {
        props: {
            show: {
                default: false,
                type: Boolean
            }
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
                orderId: '',
                selectDialog: false,
                orderDetail: {
                    orderNoList: []
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
            getDetail(row) { // 选择是哪一条自营订单
                console.log(row)
                this.orderDetail = row;
                this.selectDialog = true
                // this.$router.push({
                //     path: '/orderSelfMallDetail',
                //     query: {
                //         id: row.id
                //     }
                // })
            },
            getList() {
                let params ={
                    currency: 'swq',
                    page: this.page.page,
                    limit: this.page.limit,
                    beginTime: this.searchData.timeRange? moment(this.searchData.timeRange[0]).format('X'): '',
                    endTime: this.searchData.timeRange? moment(this.searchData.timeRange[1]).format('X'): '',
                    billId: this.searchData.billId,
                    merchantId: this.$route.query.merchantId
                }
                this.tableLoading = true;
                this.$http.get(this.$api.merchantBillQPage, params, true).then(res=>{
                    console.log(res);
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
                [this.page.page, this.page.limit, this.searchData] = [1, 10,{}];
                this.searchData = {}
                this.getList();
            },
            // formatSource(row) {
            //     console.log(row)
            //     return enumFormatter(row.source, EnumSource)
            // },
            selfOrBusinessDetail(orderId) { // 购物抵扣订单跳转
                this.$router.push({path: '/orderSelfMallDetail', query: {id: orderId}})
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

</style>
