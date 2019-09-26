<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>订单详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div class="pubpadd">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>订单信息：</span>
                    </div>
                    <div class="paddBoth">
                        <order-info :detail="orderInfo"></order-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>奖品信息：</span>
                    </div>
                    <div class="paddBoth">
                        <prize-info :detail="prizeInfo"></prize-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>开奖信息：</span>
                    </div>
                    <div class="paddBoth">
                        <draw-prize-info :detail="drawPrizeInfo"></draw-prize-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>用户信息：</span>
                    </div>
                    <div class="paddBoth">
                        <user-info :detail="userDetail"></user-info>
                    </div>
                </el-card>
                <div class="textCenter" v-if='!fromChat'>
                    <router-link v-if="!origin" to="/orderList" ><el-button :size="$size" type="primary" class="marintop20">确定</el-button></router-link>
                    <el-button  v-else :size="$size" type="primary" class="marintop20" @click="$router.go(-1)">返回</el-button>
                </div>
                <div class="textCenter" v-else>
                    <el-button :size="$size" type="primary" class="marintop20" @click="$router.go(-1)">返回</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import OrderInfo from '@/components/welfare/OrderInfo.vue';
    import PrizeInfo from '@/components/welfare/PrizeInfo.vue';
    import UserInfo from '@/components/welfare/UserInfo.vue';
    import DrawPrizeInfo from '@/components/welfare/DrawPrizeInfo.vue';

    export default {
        components: {
            OrderInfo,
            PrizeInfo,
            UserInfo,
            DrawPrizeInfo
        },
        name: "orderDetails",
        data() {
            return {
                orderInfo: {},
                prizeInfo: {},
                userDetail: {},
                address: {},
                drawPrizeInfo: {},
                fromChat:false
            }
        },
        created() {
            this.orderId = this.$route.query.id;
            //判断来源
            this.origin = this.$route.query.origin
            this.fromChat = this.$route.query.from=='chat'
            this.getDetail();
        },
        methods: {
            getDetail() {
                this.$http.get(this.$api.jMallOBMOrderDetail, {orderId: this.orderId}, true).then(res=>{
                    this.orderInfo = res.order;     //订单信息
                    this.prizeInfo = Object.assign(res.goods, res.js);      //奖品信息
                    this.address = res.address;         ///地址详情
                    this.userDetail = Object.assign(res.address?res.address: {}, res.user);      //用户信息
                    res.lotteryInformation? this.drawPrizeInfo = res.lotteryInformation: null;      //彩票信息
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .paddBoth {
        padding-left: 20px;
        padding-right: 20px;
    }
    .imgInfo {
        width: 80px;
        height: 80px;
        margin-left: 20px;
        border: 1px dotted #999;
    }
    .box-card {
        /deep/ .el-row {
            font-size: 15px;
            color: #666;
            .el-col {
                margin-top: 10px;
            }
        }
    }
    
</style>
