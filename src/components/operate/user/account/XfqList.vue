<template>
    <div>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>消费券列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="120px" :model="searchForm" class="xk-search" ref="searchForm">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="消费/充值单号：" >
                            <el-input :size="$size" v-model="searchForm.orderNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="消费充值日期：" >
                            <el-col :span="11">
                                <el-date-picker type="date" value-format="timestamp" :size="$size" v-model="searchForm.beginTime"></el-date-picker>
                            </el-col>
                            <el-col :span="2" style="text-align: center">-</el-col>
                            <el-col :span="11">
                                <el-date-picker type="date" value-format="timestamp" :size="$size" v-model="searchForm.endTime"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型：">
                            <el-select v-model="searchForm.billType" :size="$size">
                                <el-option v-for="item in type" :label="item.label" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <el-table style="margin-top: 20px" width="100%" stripe v-loading="loading" :data="tableData">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="消费/充值单号" prop="orderNo"></el-table-column>
                <el-table-column label="消费/充值时间">
                    <tempalte slot-scope="scope">
                        {{scope.row.updatedAt | formatTime}}
                    </tempalte>
                </el-table-column>
                <el-table-column label="数额(元)">
                    <template slot-scope="scope">
                        {{scope.row.newAmount}}
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.billType === 'fi' ? '收入' : '支出'}}
                    </template>
                </el-table-column>
                <el-table-column label="去向/来源">
                <template slot-scope="scope">
                        {{getSource(scope.row.source)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <tempalte slot-scope="scope">
                        <el-button :size="$size" @click="handleDetail(scope.row)" type="text">订单详情</el-button>
                    </tempalte>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="选择订单" :visible.sync="selectDialog" width="500px">
            <template v-if="orderDetail.orderNoList">
                <el-row v-for="item of this.orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
                    <el-col :span="18">订单号：{{item}}</el-col>
                    <el-col :span="6" style="text-align: center">
                        <!-- <el-button :size="$size" type="text" @click="selfOrBusinessDetail(item)">查看详情</el-button> -->
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
import { XfqSources } from "@/util/publicParams"
export default {
    name: 'XfqList',
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            searchForm: {},
            type: [
                {key: '', label: '全部'},
                {key: 'fo', label: '支出'},
                {key: 'fi', label: '收入'}
            ],
            tableData: [],
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            selectDialog: false,
            orderDetail: {
                orderNoList: []
            }, // 当前订单的详情
        }
    },
    watch: {
        name(val) {
            if(val === 'xfq') {
                this.getXfqList();
            }
        }
    },
    created() {
        this.getXfqList();
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getXfqList();
        },
        resetForm() {
             this.searchForm = {}
             this.pageData.currentPage = 1
             this.getXfqList();
        },
        getXfqList() {
            this.loading = true
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                currency: 'xfq',
                id: this.$route.query.id,
                orderNo: this.searchForm.orderNo,
                beginTime: this.searchForm.beginTime / 1000,
                endTime: this.searchForm.endTime / 1000,
                billType: this.searchForm.billType
            }
            console.log(paramList)
            this.loading = true
            this.$http.get(this.$api.userAccBillQPage, paramList, true)
            .then(res => {
                this.loading = false;
                this.tableData = res.data
                console.log(res.data)
                this.pageData.total = res.total
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getXfqList();
        },
        getSource(val) {
            let name = ''
            for(let item of XfqSources) {
                if(val === item.key) {
                    name = item.label
                    break
                }
            }
            return name;
        },
       handleDetail(val) {
           console.log(val.source)
            switch(val.source) {
                case 'platform_back': // 平台返还
                    // this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: val.id, source: val.source}});
                    this.orderDetail = val;
                    this.selectDialog = true
                    break;
                case 'mall_pay_back':
                    this.orderDetail = val;
                    this.selectDialog = true
                    break;
                case 'share_award': // 晒单奖励
                    this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: val.orderNo, source: val.source}});
                    break;
                case 'receiving_gifts': // 收到礼物
                    this.$router.push({path: '/userGiftDetail', query: {type: 'xfq', id: val.id, source: val.source}});
                    break;
                case 'shopping_deduction': // 购物抵扣, 由多条订单构成，订单要区分商圈和自营
                    // this.$router.push({path: '/orderSelfMallDetail', query: {type: 'xfq', id: val.id, source: val.source}});
                    // break;
                    this.orderDetail = val;
                    this.selectDialog = true
                    break;
                case 'jamll_exchange': // 福利兑奖
                    // this.$router.push({path: '/orderPlatformDetail', query: {type: 'xfq', id: val.orderNo, source: val.source}});
                    this.orderDetail = val;
                    this.selectDialog = true
                    break;
                case 'draw_hansel': // 抽奖赠送
                    this.$router.push({path: '/orderLotteryDetail', query: {type: 'xfq', id: val.id, source: val.source}})
                    break;
                case 'platform_charge': // 晓可币充值
                    this.$router.push({path: '/orderShopDetail', query: {type: 'xfq', id: val.id, source: 'xkb_charge'}});
                    break;
                default:
                    this.$message.warning("来源不存在")
            }
        },
        selfOrBusinessDetail(orderId) { // 购物抵扣订单跳转
            console.log(this.orderDetail.tradeProduct)
            console.log(orderId)
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
    }
}
</script>

<style>

</style>
