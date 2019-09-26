<template>
    <div class="platform-take-tax-detail-info xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <h3>缴税详情</h3>
                <el-row>
                    <el-col :span="12">税款对应周期：{{ detail.cycle }}</el-col>
                    <el-col :span="12">税款对应款项：终身客户收益</el-col>
                    <el-col :span="12">扣税金额：{{ detail.serviceTaxAmount }}元</el-col>
                    <el-col :span="12">缴税状态：{{ detail.deductTaxStatus==0? '未扣缴': '已扣款' }}</el-col>
                </el-row>

                <h3 class="margintop20">
                    联盟商信息
                    <el-button type="text" :size="$size" class="link-detail" @click="goToUserInfo()">查看详情</el-button>
                </h3>
                <el-row>
                    <el-col :span="12">联盟商ID：{{ detail.merchantId }}</el-col>
                    <el-col :span="12">姓名：{{ detail.merchantName }}</el-col>
                    <el-col :span="12">用户账号：{{ detail.merchantPhone }}</el-col>
                    <el-col :span="12">所属城市：{{ detail.regionName }}</el-col>
                </el-row>

                <h3 class="margintop20">
                    订单基础信息
                    <el-button type="text" :size="$size" class="link-detail" @click="goToOrderInfo(detail.orderType)">查看详情</el-button>
                </h3>
                <el-row>
                    <el-col :span="12">订单ID：{{ detail.orderId }}</el-col>
                    <el-col :span="12">订单类型：{{ detail.orderType | formatOrder }}</el-col>
                    <el-col :span="12">下单时间：{{ detail.createAt | formatTime }}</el-col>
                    <el-col :span="12">支付时间：{{ detail.payTime | formatTime }} </el-col>
                    <el-col :span="12">订单支付金额：{{ detail.orderMoney }}元</el-col>
                </el-row>

                <h3 class="margintop20">扣税凭证</h3>
                <div class="tax-pic">
                    <img src="http://cpyx.xksquare.com/XKWEB/images/%E6%89%A3%E7%A8%8E%E8%AF%A6%E6%83%85/u48308.png" alt="">
                </div>
            </div>
        </div>
        <div class="btn-group">
            <el-button :size="$size" type="primary" @click="$router.push('/platformTakeTaxDetail')">返回</el-button>
        </div>
    </div>
</template>

<script>
    const EnumOrderType = [{label: '自营', value: 'DEALERS'},{label: '批发', value: 'WHOLESALE'},{label: '商圈', value: 'BCIRCLE'},{label: '礼物', value: 'GIFT'},{label: '游戏', value: 'GAME'},{label: '彩票', value: 'LOTTERY'}];
    export default {
        data() {
            return {
                settleNo: '',
                detail: {}
            }
        },
        created() {
            this.settleNo = this.$route.query.settleNo;
            this.getDetail();
        },
        methods: {
            //联盟商信息
            goToUserInfo() {
                if(!this.detail.mUserId) {
                    return false;
                }
                this.$router.push({
                    path: '/userDetail',
                    query: {
                        id: this.detail.mUserId
                    }
                })
            },
            /**
             *   @params  根据订单类型跳转到不同详情
             * 
             *   1. 自营商城订单
             *   2. 商圈订单
             *   3. 送礼订单
             *   4. 游戏充值订单
             */
            goToOrderInfo(type) {
                if(!type) {return false;};
                switch(type) {
                    case 'DEALERS':
                        this.$router.push({
                            path: '/orderSelfMallDetail',
                            query: {
                                id: this.detail.orderId
                            }
                        });
                        break;
                    case 'WHOLESALE':
                        this.$router.push({
                            path: '/orderSelfMallDetail',
                            id: {
                                orderId: this.detail.orderId
                            }
                        });
                        break;
                    case 'BCIRCLE':
                        this.$router.push({
                            path: '/buinessMallDetail',
                            query: {
                                orderId: this.detail.orderId
                            }
                        });
                        break;
                    case 'GIFT':
                        this.$router.push({
                            path: '/userGiftDetail',
                            query: {
                                orderNo: this.detail.orderId,
                                source: 'giftList',
                                tradeProduct: "gift"    //tradeProduct产品判断来源，  礼物：gift， 红包：redPackets
                            }
                        });
                        break;
                    case 'GAME':
                        this.$router.push({
                            path: '/userGameDetail',
                            query: {
                                id: this.detail.orderId
                            }
                        });
                        break;
                    case 'LOTTERY':
                        this.$router.push({
                            path: '/platformLotteryDetailInfo',
                            query: {
                                lotteryId: this.detail.orderId
                            }
                        });
                        break;
                }
            },
            getDetail() {
                this.$http.get(this.$api.dividedDeductTaxDetail, {settleNo: this.settleNo}, true).then(res=>{
                    this.detail = res;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        filters: {
            formatOrder(val) {
                for(let item of EnumOrderType) {
                    if(item.value === val) {
                        return item.label;
                    }
                }
                return val;
            }
        }
    }
</script>

<style scoped lang="scss">
    $color: #222;
    
    .platform-take-tax-detail-info{
        .el-row{
            color: $color;
            padding: 0 10px;
            .el-col {
                margin-top: 15px;
                font-size: 14px;
                color: #666;
            }
        }
        h3{
            font-size: 15px;
            font-weight: bolder;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
            .link-detail {
                float: right;
                color: #0000FF;
            }
        }
        .tax-pic {
            padding: 15px 10px;
            img{
                width: 300px;
            }
        }
    }
</style>
