<template>
    <div class="xk-container">
        <div class="xk-radius">
           <div class='xk-title'>
            <div class="vus-title">
                <span></span>礼物详情
            </div>
            <div class="vus-bottom"></div>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">订单信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">订单ID: {{detailData.orderDetail.orderNo}}</el-col>
                    <el-col :span="8">订单总金额: {{ $math.divide(detailData.orderDetail.amount, 100) }}</el-col>
                    <el-col :span="8">订单状态: 已完成</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">下单时间:{{detailData.orderDetail.createTime | formatTime}}</el-col>
                    <el-col :span="8">支付时间: {{detailData.orderDetail.payTime | formatTime}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">礼物信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">礼物名称: {{detailData.giftDetail.giftName}}</el-col>
                    <el-col :span="8">礼物ID: {{detailData.giftDetail.giftId}}</el-col>
                    <el-col :span="8">价格: {{ $math.divide(detailData.giftDetail.giftPrice, 100) }}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">礼物排序: {{detailData.giftDetail.index}}</el-col>
                    <el-col :span="8">小图: <img :src="detailData.giftDetail.pic" style="width: 100px;vertical-align: top"></el-col>
                    <el-col :span="8">赠送数量: {{detailData.giftDetail.num}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">送礼用户信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goUserDetail(detailData.userDetail.id)">用户详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">是否实名认证:{{detailData.userDetail.auth == 1 ? '是' : '否'}}</el-col>
                    <el-col :span="8">用户名: {{detailData.userDetail.name}}</el-col>
                    <el-col :span="8">用户账号: {{detailData.userDetail.phone}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.userDetail.cityCode)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.receivingUserDetail">
                <el-row>
                    <el-col :span="12" class="title">收礼用户信息</el-col>
                    <el-col :span="12" style="text-align: right" v-if="detailData.receivingUserDetail.userDetail">
                        <el-button :size="$size" type="primary" @click="goUserDetail(detailData.receivingUserDetail.userDetail.id)">用户详情</el-button>
                    </el-col>
                    <el-col :span="12" style="text-align: right" v-if="detailData.receivingUserDetail.merchantDetail">
                        <el-button :size="$size" type="primary" @click="goMerchantDetail(detailData.receivingUserDetail.merchantDetail.id)">联盟商详情</el-button>
                    </el-col>
                </el-row>
                    <div class="line"></div>
                    <el-row v-if="detailData.receivingUserDetail.userDetail">
                        <el-row class="info-content">
                            <el-col :span="8">是否实名认证: {{detailData.receivingUserDetail.userDetail.auth == 1 ? '是' : '否'}}</el-col>
                            <el-col :span="8">用户名: {{detailData.receivingUserDetail.userDetail.name}}</el-col>
                            <el-col :span="8">用户账号: {{detailData.receivingUserDetail.userDetail.phone}}</el-col>
                        </el-row>
                        <el-row class="info-content">
                            <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.receivingUserDetail.userDetail.cityCode)}}</el-col>
                        </el-row>
                    </el-row>
                    <el-row v-if="detailData.receivingUserDetail.merchantDetail">
                        <el-row class="info-content">
                            <el-col :span="8">用户名: {{detailData.receivingUserDetail.merchantDetail.name}}</el-col>
                            <el-col :span="8">用户账号: {{detailData.receivingUserDetail.merchantDetail.phone}}</el-col>
                        </el-row>
                        <el-row class="info-content">
                            <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.receivingUserDetail.merchantDetail.cityCode)}}</el-col>
                        </el-row>
                    </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.jackpotAllocation">
                <el-row>
                    <el-col :span="12" class="title">奖池抽成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">当前订单归属城市: {{getPorvinceInfo(detailData.jackpotAllocation.areaCode)}}</el-col>
                    <el-col :span="8">当前城市归属模板: {{detailData.jackpotAllocation.templateName}}</el-col>
                    <el-col :span="8">当前模板业务抽成比例: {{detailData.jackpotAllocation.earningsRatio}} %</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">抽成金额: {{ detailData.jackpotAllocation.practicalEarningsPriceTemp }}元</el-col>
                </el-row>
            </el-card>
             <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">收礼用户所得</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">
                        <template v-if="isAnchor==0">
                            用户所得：{{ detailData.giftAllocation }}
                        </template>
                        <template v-else>
                            主播所得：{{ detailData.liveAnchorAllocation }}
                        </template>元
                    </el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">家族相关收益分成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row>
                    <el-col :span="12" class="title">直播收益</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-table style="margin-bottom: 20px" :data="detailData.liveEarnings">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="收益分成%" prop="earningsRatio"></el-table-column>
                        <el-table-column label="是否考核">
                            <template slot-scope="scope">
                                {{scope.row.isCheck == 1 ? '是' : '否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="(正常+补贴)收益">
                            <template slot-scope="scope">
                                {{ scope.row.advanceEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="考核状态">
                            <template slot-scope="scope">
                                {{ scope.row.assessStatus | formatStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column label="实收收益">
                            <template slot-scope="scope">
                                {{ scope.row.practicalEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="税务扣除">
                            <template slot-scope="scope">
                                {{ scope.row.serviceTaxAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="违规惩罚">
                            <template slot-scope="scope">
                                {{ scope.row.punishAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益代扣加盟费">
                            <template slot-scope="scope">
                                {{ scope.row.deductLeagueAmountTemp }}
                            </template>
                        </el-table-column>
                        </el-table>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">平台收益分成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row>
                    <el-col :span="12" class="title">推荐分成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-table style="margin-bottom: 20px" :data="detailData.recommend">
                            <el-table-column label="名称" prop="name"></el-table-column>
                            <el-table-column label="收益分成%" prop="earningsRatio"></el-table-column>
                            <el-table-column label="是否考核">
                                <template slot-scope="scope">
                                    {{scope.row.isCheck == 1 ? '是' : '否'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="预收收益">
                                <template slot-scope="scope">
                                    {{ scope.row.advanceEarningsPriceTemp }}
                                </template>
                            </el-table-column>
                            <el-table-column label="考核状态" prop="formatStatus">
                                <template slot-scope="scope">
                                    {{ scope.row.assessStatus | formatStatus }}
                                </template>
                            </el-table-column>
                            <el-table-column label="实收收益">
                                <template slot-scope="scope">
                                    {{ scope.row.practicalEarningsPriceTemp }}
                                </template>
                            </el-table-column>
                            <el-table-column label="税务扣除">
                            <template slot-scope="scope">
                                {{ scope.row.serviceTaxAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="违规惩罚">
                            <template slot-scope="scope">
                                {{ scope.row.punishAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益代扣加盟费">
                            <template slot-scope="scope">
                                {{ scope.row.deductLeagueAmountTemp }}
                            </template>
                        </el-table-column>
                        </el-table>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">平台利润</el-col>
                </el-row>
                <div class="line"></div>
                <el-row>
                    利润： {{ detailData.platformAllocation }}元
                </el-row>
            </el-card>
        </div>
        </div>
    </div>
    
</template>

<script>
import { getPorvinceInfo, enumFormatter } from "@/util/publicMehotds";
import { EnumCheckStatus } from '@/util/publicParams.js';
export default {
    name: 'userGameDetail',
    data() {
        return {
            detailData: {
                giftDetail: {},
                givingUserDetail: {
                    userDetail : {}
                },
                orderDetail: {},
                receivingUserDetail: {
                    userDetail: {}
                },
                formalitiesDetail: {},
                jackpotAllocation: {
                    earningsRatio: {}
                },
                userDetail: {}
            },
            getPorvinceInfo,
            isAnchor: 0  //判断是否为主播身份
        }
    },
    created() {
        this.isAnchor= this.$route.query.isAnchor? this.$route.query.isAnchor: 0;
        this.getDetailData();
    },
    methods: {
        getDetailData() {
            if(this.$route.query.source === 'giftList' || this.$route.query.tradeProduct ==='gift' || this.$route.query.tradeProduct === 'redPackets') {
                this.getGiftDetail();
            } else {
                this.getXkbGiftDetail();
            }
        },
        getXkbGiftDetail() {
            let paramList = {
                action: this.$route.query.source,
                currency: this.$route.query.type,
                id: this.$route.query.id
            }
            this.$http.get(this.$api.userAccBillDetail, paramList, true)
            .then(res => {
                this.recommendData = res.recommend ? res.recommend : []
                this.detailData = res;
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getGiftDetail() {
            let paramList = {
                orderNo: this.$route.query.orderNo,
                tradeProduct: this.$route.query.tradeProduct
            }
            this.$http.get(this.$api.userSendGiftsDetail, paramList, true)
            .then(res => {
                this.detailData = res;
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        goUserDetail(userId) { // 用户详情
            this.$router.push({path:'/userDetail', query: {id: userId}})
        },
        goMerchantDetail(merchantId) { // 联盟商详情
            this.$router.push({path: '/businessDetail', query: {id: merchantId}})
        }
    },
    filters: {
        formatStatus(val) {
            return enumFormatter(val, EnumCheckStatus)
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    font-weight: 600;
}
.line {
    height: 1px;
    width: 100%;
    background-color: #e3e3e3;
    margin: 10px 0;
}
.info-content {
    margin-left: 20px;
    font-size: 14px;
    min-height: 30px;
    line-height: 30px;
}
.income-title {
    color: #0000FF;
}
.blue-line {
    height: 1px;
    width: 100px;
    background-color: #0000FF;
}
/deep/ .el-table th {
    padding: 0 0 ;
}
/deep/ .el-table--border th {
    border: none;
}

</style>
