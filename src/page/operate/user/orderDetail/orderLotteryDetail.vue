<template>
    <div class="xk-container">
        <div class="xk-radius">
           <div class='xk-title'>
            <div class="vus-title">
                <span></span>订单详情
            </div>
            <div class="vus-bottom"></div>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">基本信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8" v-if="detailData.base.drawFrom === 'platform'">抽奖类型: {{detailData.base.drawType === 'generalize_ticket' ? '平台抽奖' : '消费抽奖'}}</el-col>
                    <el-col :span="8" v-if="detailData.base.drawFrom === 'merchant'">
                        抽奖类型: {{getMerchantDrawType(detailData.base.drawType)}}
                    </el-col>
                    <!-- <el-col :span="8">发送抽奖券类型: {{detailData.base.drawType}}</el-col> 没有-->
                    <el-col :span="8">奖券来源:{{detailData.base.drawFrom === 'merchant' ? '商户': '平台'}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">对应抽奖模板: {{detailData.base.drawFrom === 'merchant' ? '无' : detailData.base.templateName}}</el-col>
                    <!-- <el-col :span="8">所属城市:</el-col> 没有-->
                    <el-col :span="8">是否使用: {{detailData.base.isUsed == 1 ? '是': '否'}}</el-col>
                    <el-col :span="8">使用时间：<template v-if="detailData.base.usedTime">{{detailData.base.usedTime | formatTime}}</template><template v-else>-</template></el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">中奖信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8" v-if="detailData.base.drawFrom === 'platform'">中奖类型: {{getPlatformPrizeType(detailData.winningRecord.prizeType)}}</el-col>
                    <el-col :span="8" v-if="detailData.base.drawFrom === 'merchant'">中奖类型: {{getShopPrizeType(detailData.winningRecord.prizeType)}}</el-col>
                    <el-col :span="8">中奖金额: {{$math.divide(detailData.winningRecord.amount, 100)}}元</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col>中奖来源: {{detailData.base.drawFrom === 'merchant' ? '商户': '平台'}}</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content" style="margin-bottom: 10px">
                    <el-col :span="6">奖品ID: {{detailData.winningRecord.prizeId}}</el-col>
                    <el-col :span="6">奖品类型: {{detailData.winningRecord.isVirtual == 1 ?'虚拟' : '实物'}}</el-col>
                    <el-col :span="6">奖品名称: {{detailData.winningRecord.prizeName}}</el-col>
                    <!-- <el-col :span="6" style="text-align: right">
                        <el-button :size="$size" type="primary">查看奖品详情</el-button>
                    </el-col> -->
                </el-row>
                <el-row class="info-content" v-if="detailData.winningRecord.sequences">
                    <el-row v-for="item of  detailData.winningRecord.sequences" :key="item" style="margin-bottom: 10px">
                        <el-col :span="6">参加期ID: {{item.sequenceNo}}</el-col>
                        <el-col :span="6">参加期数: {{item.currentNper}}</el-col>
                        <el-col :span="6">期状态: {{getSequencesStatus(item.status)}}</el-col>
                        <el-col :span="6" style="text-align: center">
                            <!-- 只有平台才有查看期详情，店铺没有查看期详情-->
                            <el-button :size="$size" type="primary" @click="goSequenceDetail(item.sequenceNo)"
                            v-if="detailData.base.drawFrom === 'platform'">查看期详情</el-button>
                        </el-col>
                    </el-row>
                </el-row>
            </el-card>
            <!--platfrom有店铺和用户， merchant只有用户-->
            <el-card style="margin-bottom: 10px" v-if="detailData.base.drawFrom === 'platform' && detailData.user.userDetail">
                <el-row>
                    <el-col :span="12" class="title">用户信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goUserDetail(detailData.user.userId)">用户详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">用户UID: {{detailData.user.userDetail.uid}}</el-col>
                    <el-col :span="8">用户ID: {{detailData.user.userDetail.id}}</el-col>
                    <el-col :span="8">姓名: {{detailData.user.userDetail.name}}</el-col>
                    <el-col :span="8">用户账号: {{detailData.user.userDetail.phone}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.user.userDetail.cityCode)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.base.drawFrom === 'platform' && detailData.user.merchantDetail">
                <el-row>
                    <el-col :span="12" class="title">用户信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goMerchantDetail(detailData.user.merchantId)">用户详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">联盟商ID: {{detailData.user.merchantDetail.id}}</el-col>
                    <el-col :span="8">姓名: {{detailData.user.merchantDetail.name}}</el-col>
                    <el-col :span="8">用户账号: {{detailData.user.merchantDetail.phone}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.user.merchantDetail.cityCode)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.base.drawFrom === 'merchant' && detailData.shop">
                <el-row>
                    <el-col :span="12" class="title">店铺信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goShopDetail(detailData.shop.shopId)">店铺详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">店铺名称: {{detailData.shop.name}}</el-col>
                    <el-col :span="8">店铺地址: {{detailData.shop.address}}</el-col>
                    <el-col :span="8">联系方式:
                        <span v-for="phone of detailData.shop.phone" :key="phone">
                            {{phone}},
                        </span>
                    </el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属联盟商ID: {{detailData.shop.merchantId}}</el-col>
                </el-row>
            </el-card>
            <!--消费抽奖类型才有订单详情，转发抽奖没有，店铺和平台都有消费抽奖类型-->
            <el-card style="margin-bottom: 10px" 
            v-if="(detailData.base.drawFrom === 'merchant' && detailData.base.drawType === 'consumption_ticket')
             || (detailData.base.drawFrom === 'platform' && (detailData.base.drawType ==='CGift') || detailData.base.drawType === 'CLottery')">
                    <el-row>
                        <el-col :span="12" class="title">订单基础信息</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" type="primary" @click="goOrderDetail(detailData.order)">订单详情</el-button>
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">订单ID: {{detailData.order.orderId}}</el-col>
                        <el-col :span="8">订单类型: {{getEnumTradeProduct(detailData.order.tradeProduct)}}</el-col>
                        <el-col :span="8">支付方式: {{getPayChannel(detailData.order.payChannel)}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">下单时间: {{detailData.order.createdAt | formatTime}}</el-col>
                        <el-col :span="8">支付时间: {{detailData.order.paidAt | formatTime}}</el-col>
                        <el-col :span="8">订单支付金额: {{$math.divide(detailData.order.realAmount, 100)}}元</el-col>
                    </el-row>
                </el-card>
        </div>
        </div>
    </div>
    
</template>

<script>
import { getPorvinceInfo } from '@/util/publicMehotds'
import { EnumSequencesStatus, EnumPayWay, EnumTradeProduct, MerchantDrawType, ShopPrizeType, PlatformPrizeType } from '@/util/publicParams'
export default {
    name: 'orderLotteryDetail',
    data() {
        return {
            detailData: {
                order: {},
                base: {},
                user: {
                    userDetail: {},
                    merchantDetail: {},
                },
                winningRecord: {
                    sequences: {}
                },
                shop: {}
            },
            getPorvinceInfo: getPorvinceInfo
        }
    },
    created() {
        this.getLotteryDetail();
    },
    methods: {
        goUserDetail(userId) { // 会员详情
            console.log(userId)
            this.$router.push({path:'/userDetail', query: {id: userId}})
        },
        goShopDetail(shopId) { // 店铺详情
            this.$router.push({path: '/storeSecAuditInfo', query: {id: shopId}})
        },
        goMerchantDetail(merchantId) { // 联盟商详情
            this.$router.push({path:'/businessDetail', query: {id: merchantId}})
        },
        goSequenceDetail(sequencesId) { // 奖品期详情
            this.$router.push({path:'/stageDetails', query: {id: sequencesId, goodsId: this.detailData.winningRecord.goodsId}})
        },
        goOrderDetail(order) { // 订单类型不同跳转不同（自营，商圈，游戏，晓可币）
            switch(order.tradeProduct) {
                 case 'b2b':
                    this.$router.push({path: '/orderSelfMallDetail', query: {id: order.orderId}})
                    break;
                case 'b2c':
                    this.$router.push({path: '/orderSelfMallDetail', query: {id: order.orderId}})
                    break;
                case 'o2o':
                    this.$router.push({path: '/buinessMallDetail', query: {orderId: order.orderId}});
                    break;
                case 'game':
                    this.$router.push({path: '/userGameDetail', query: {id: order.orderId}});
                    break;
                case 'xkbCharge':
                    this.$router.push({path: '/orderShopDetail', query: {type: 'xkb', id: order.orderId, source: 'platform_charge'}});
                    break;
            }
        },
        getLotteryDetail() {
            if(this.$route.query.type === 'xfq') { // 消费券列表跳转详情
                this.getLotteryForXfq();
            } else {
                this.getLotteryDetailForList();
            }
        },
        getLotteryDetailForList() { // 消费抽奖记录列表抽奖详情
            let paramList = { // source: plat(平台抽奖), shop(店铺抽奖)
                source: this.$route.query.source
            }
            if(this.$route.query.from==='platform') { // 平台消费抽奖,传中奖记录编号
                // paramList.serialNum = this.$route.query.orderId;
                 paramList = {
                    source: this.$route.query.source,
                    serialNum: this.$route.query.orderId
                }
            }else{
                // paramList.id = this.$route.query.orderId
                if(this.$route.query.serialNum) {
                    paramList = {
                        source: this.$route.query.source,
                        serialNum: this.$route.query.serialNum
                    }
                } else {
                    paramList = {
                        source: this.$route.query.source,
                        id: this.$route.query.orderId
                    }
                }
            }
            console.log(paramList)
            this.$http.get(this.$api.userDrawHandSelDetail, paramList, true)
            .then(res => {
                res? this.detailData = res: null;
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getLotteryForXfq() { // 消费券抽奖类型订单
            let paramList = {
                action: this.$route.query.source,
                currency: this.$route.query.type,
                id: this.$route.query.id
            }
            console.log(paramList)
            this.$http.get(this.$api.userAccBillDetail, paramList, true)
            .then(res => {
                this.detailData = res
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getSequencesStatus(val) { // 期状态
            let name = ''
            for(let item of EnumSequencesStatus) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name;
        },
        getPayChannel(val) { // 支付方式
            let name = ''
            for(let channel of val) {
                for(let item of EnumPayWay) {
                    if(channel === item.key) {
                        name = item.value + '  ' + name
                        break;
                    }
                }
            }
            return name;
        },
        getMerchantDrawType(val) { // 商户抽奖类型
            let name = ''
            for(let item of MerchantDrawType) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name;
        },
        getShopPrizeType(val) { // 店铺奖品类型
            let name = ''
            for(let item of ShopPrizeType) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name;
        },
        getPlatformPrizeType(val) { // 平台奖品类型
            let name = ''
            for(let item of PlatformPrizeType) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name;
        },
        getEnumTradeProduct(val) { // 订单类型
            let name = ''
            for(let item of EnumTradeProduct) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name;
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
