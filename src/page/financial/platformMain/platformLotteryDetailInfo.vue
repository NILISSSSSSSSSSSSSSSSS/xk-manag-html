<template>
    <div class="platform-lottery-detail-info xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <h3>基本信息</h3>
                <el-row>
                    <el-col :span="8">领取时间：{{ detail.aalotteryBase.receiveTime | formatTime }}</el-col>
                    <el-col :span="8">彩票来源：{{ detail.aalotteryBase.aaLotterySource | formatEnumOrderSource }}</el-col>
                    <el-col :span="8">平台分成：{{ $math.divide(detail.aalotteryBase.divide, 100) }} %</el-col>
                </el-row>

                <h3 class="margintop20">选号信息</h3>
                <el-row>
                    <el-col :span="8">选择号码：{{ detail.aalotterySelectNum.selectNum }}</el-col>
                    <el-col :span="8">注数：{{ detail.aalotterySelectNum.lotteryNumber }}</el-col>
                    <el-col :span="8" v-if="detail.aalotterySelectNum.invoiceNo">参与期数：{{ detail.aalotterySelectNum.invoiceNo }}</el-col>
                    <el-col :span="8" v-if="detail.aalotterySelectNum.invoiceTime">出票时间：{{ detail.aalotterySelectNum.invoiceTime | formatTime }}</el-col>
                    <template v-if="detail.aalotterySelectNum.invoicePic">
                        <el-col :span="24">实际出票：</el-col>
                        <el-col :span="24" class="goods-num">
                            <div class="img-box">
                                <div class="img-list">
                                    <img :src="detail.aalotterySelectNum.invoicePic" @click="$viewImage(detail.aalotterySelectNum.invoicePic)" alt="">
                                </div>
                            </div>
                        </el-col>
                    </template>
                </el-row>

                <template v-if="detail.shopBase.name">
                    <h3 class="margintop20">
                        店铺信息
                        <el-button :size="$size" type="text" class="link-detail">查看详情</el-button>
                    </h3>
                    <el-row>
                        <el-col :span="8">店铺名称：{{ detail.shopBase.name }}</el-col>
                        <el-col :span="8">店铺地址：{{ detail.shopBase.address }}</el-col>
                        <el-col :span="8">联系方式：{{ detail.shopBase.phone }}</el-col>
                        <el-col :span="8">所属联盟商ID：{{ detail.shopBase.merchantId }}</el-col>
                        <el-col :span="8">所属联盟商账号：{{ detail.shopBase.merchantPhone }}</el-col>
                    </el-row>
                </template>

                <h3 class="margintop20">
                    用户信息
                    <el-button :size="$size" type="text" class="link-detail" @click="goToUserInfo(detail.userInfo.userId)">查看详情</el-button>
                </h3>
                <el-row>
                    <el-col :span="8">是否实名认证：{{ detail.userInfo.auth==0? '否': '是' }}</el-col>
                    <el-col :span="8">用户名：{{ detail.userInfo.name }}</el-col>
                    <el-col :span="8">用户账号：{{ detail.userInfo.phone }}</el-col>
                    <el-col :span="8">所属城市：{{ detail.userInfo.cityCode? getPorvinceInfo(detail.userInfo.cityCode): '未知' }}</el-col>
                </el-row>
                <template v-if="detail.orderInfo&& detail.orderInfo.orderId">
                    <h3 class="margintop20">
                        订单基础信息
                        <template v-if="detail.orderInfo.orderType === 'xkbCharge'">
                            <el-button v-if="detail.orderInfo.billId" :size="$size" type="text" class="link-detail" @click="goToOrder(detail.orderInfo.orderType, detail.orderInfo.billId)">查看详情</el-button>
                        </template>
                        <template v-else>
                            <el-button :size="$size" type="text" class="link-detail" @click="goToOrder(detail.orderInfo.orderType, detail.orderInfo.orderId)">查看详情</el-button>
                        </template>
                    </h3>
                    <el-row>
                        <el-col :span="8">订单ID：{{ detail.orderInfo.orderId }}</el-col>
                        <el-col :span="8">订单类型：{{ detail.orderInfo.orderType | formatOrderType }}</el-col>
                        <el-col :span="8">支付方式： 
                            <span v-for="(item, index) in detail.orderInfo.payChannel" :key="index">
                                {{ item | formatPayChannel }}<template v-if="detail.orderInfo.payChannel.length-1 > index">/</template>
                            </span>
                        </el-col>
                        <el-col :span="8">下单时间：{{ detail.orderInfo.createdAt | formatTime }}</el-col>
                        <el-col :span="8">支付时间： {{ detail.orderInfo.payTime | formatTime }}</el-col>
                        <el-col :span="8">订单支付金额：{{ $math.divide(detail.orderInfo.payAmount, 100) }} 元</el-col>
                    </el-row>
                </template>

                <template v-if="detail.lotteryInfo">
                    <h3 class="margintop20">中奖信息</h3>
                    <div class="xk-table">
                        <div class="xk-table-content xk-table-title">
                            <div>参与期数</div>
                            <div>中奖号码（抽出的号码）</div>
                            <div>中奖金额</div>
                            <div>彩票状态</div>
                        </div>
                        <div class="xk-table-content">
                            <div>{{ detail.lotteryInfo.lotteryNo }}</div>
                            <div>{{ detail.lotteryInfo.lotteryNum }}</div>
                            <div>{{ $math.divide(detail.lotteryInfo.amount,100) }} 元</div>
                            <div>{{ detail.lotteryInfo.aaLotteryStatus | formatLotteryStatus }}</div>
                        </div>
                    </div>
                </template>

                <template v-if="detail.jackpotAllocation">
                    <h3 class="margintop20">奖池抽成</h3>
                    <el-row>
                        <el-col :span="8">当前订单归属城市：{{ getPorvinceInfo(detail.orderInfo.areaCode) }}</el-col>
                        <el-col :span="8">当前城市归属模板：{{ detail.jackpotAllocation.templateName }}</el-col>
                        <el-col :span="8">当前模板该业务抽成比例：{{ $math.divide(detail.jackpotAllocation.earningsRatio, 100) }}%</el-col>
                        <el-col :span="8">抽成金额：{{ detail.jackpotAllocation.practicalEarningsPricTemp }}元</el-col>
                    </el-row>
                </template>
                <template v-if="detail.lotteryInfo">
                    <h3 class="margintop20">用户兑奖</h3>
                    <el-row>
                        <el-col :span="8">{{ $math.divide(detail.lotteryInfo.userAmount, 100) }}元</el-col>
                    </el-row>
                </template>

                <template v-if="detail.lotteryAllocation">
                    <h3 class="margintop20">活动联盟商所得  注：（店铺发出彩票中奖时展示此条）</h3>
                    <el-row>
                        <el-col :span="8">{{ detail.lotteryAllocation }}元</el-col>
                    </el-row>
                </template>

                <h3 class="margintop20">平台收益分成</h3>
                <el-row>
                    <el-table class="margintop20" :data="detail.recommend">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="收益分成（%）">
                            <template slot-scope="scope">
                                {{ scope.row.earningsRatio }}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否考核">
                            <template slot-scope="scope">
                                {{ scope.row.isCheck===0? '否': '是' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="预收收益">
                            <template slot-scope="scope">
                                {{ scope.row.advanceEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="考核状态" width="120px">
                            <template slot-scope="scope">
                                {{ scope.row.assessStatus | formatStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column label="实收收益">
                            <template slot-scope="scope">
                                {{ scope.row.practicalEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>

                <h3 class="margintop20">平台毛利润</h3>
                <el-row>
                    <el-col :span="24">{{ detail.platformSumAllocation }} 元</el-col>
                </el-row>

                <h3 class="margintop20">平台实际利润</h3>
                <el-row>
                    <el-col :span="24">{{ detail.platformAllocation }} 元</el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    const EnumOrderType = [{key: 'xkbCharge', value: '晓可币充值'},{key: 'game', value: '游戏充值'},{key: 'o2o', value: '商圈订单'},{key: 'b2b', value: '批发商城订单'},{key: 'b2c', value: '自营商城订单'},{key: 'jb2c', value: '夺奖派对订单'}];
    const EnumOrderSource = [{key: 'platform_activity', value: '平台'},{key: 'merchant_activity', value: '商户'},
    {key: 'jorder_comment', value: '福利晒单'}, {key: 'competition', value: '游戏比赛'}];
    import { EnumPayWay, EnumLotteryStatus,EnumCheckStatus } from '@/util/publicParams.js';
    import { getPorvinceInfo, enumFormatter } from '@/util/publicMehotds.js';
    export default {
        data() {
            return {
                getPorvinceInfo,
                detail: {
                    aalotteryBase: {},
                    aalotterySelectNum: {},
                    userInfo: {},
                    lotteryInfo: {},
                    shopBase: {},
                    orderInfo: {},
                    recommend: [],
                    jackpotAllocation : {}
                },
                aaLotteryId: ''
            }
        },
        created() {
            this.aaLotteryId = this.$route.query.lotteryId;
            this.getDetail()
        },
        methods: {
            getDetail() {
                this.$http.get(this.$api.aaLotteryTicketDetail, {aaLotteryId: this.aaLotteryId}, true).then(res=>{
                    console.log(res)
                    this.detail = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            goToUserInfo(userId) {
                this.$router.push({
                    path:'/userDetail',
                    query: {
                        id: userId
                    }
                })
            },
            goToOrder(orderType,orderId) {
                /**
                 * 
                 */
                console.log(this.orderInfo)
                switch(orderType) {
                        case 'game':
                            this.$router.push({
                                path: '/userGameDetail',
                                query: {
                                    id: orderId
                                }
                            });
                            break;
                        case 'o2o':
                            this.$router.push({
                                path: '/buinessMallDetail',
                                query: {
                                    orderId: orderId
                                }
                            });
                            break;
                        case 'b2b':
                            this.$router.push({
                                path: '/orderSelfMallDetail',
                                query: {
                                    id: orderId
                                }
                            });
                            break;
                        case 'b2c':
                            this.$router.push({
                                path: '/orderSelfMallDetail',
                                query: {
                                    id: orderId
                                }
                            });
                            break;
                        case 'jb2c':
                            this.$router.push({
                                path: '/orderPlatformDetail',
                                query: {
                                    id: orderId
                                }
                            });
                            break;
                        case 'xkbCharge':
                            this.$router.push({
                                path: '/orderShopDetail',
                                query: {
                                    type: 'xkb',
                                    id: orderId,
                                    source: 'platform_charge'
                                }
                            })
                    }
            }
        },
        filters: {
            formatOrderType(val) {
                return enumFormatter(val, EnumOrderType)
            },
            formatPayChannel(val) {
                return enumFormatter(val, EnumPayWay)
            },
            formatLotteryStatus(val) {
                return enumFormatter(val, EnumLotteryStatus)
            },
            formatEnumOrderSource(val) {
                return enumFormatter(val, EnumOrderSource)
            },
            formatStatus(val) {
                return enumFormatter(val, EnumCheckStatus)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './platformLotteryDetailInfo.scss';
</style>
