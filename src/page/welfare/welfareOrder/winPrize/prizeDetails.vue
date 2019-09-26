<template>
    <div class="xk-container prize-details-list">
        <!--标题-->
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
                        <order-info :detail="orderDetail.order"></order-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>奖品信息：</span>
                    </div>
                    <div class="paddBoth">
                        <prize-info :detail="orderDetail.goods"></prize-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>中奖用户信息：</span>
                    </div>
                    <div class="paddBoth">
                        <user-info :isShow="false" :detail="orderDetail.user"></user-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20" v-if="orderDetail.address">
                    <div slot="header" class="clearfix">
                        <span>配送信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row>
                            <el-col :span="12">收件人：{{ orderDetail.address.receiver }}</el-col>
                            <el-col :span="12">手机号码：{{ orderDetail.address.phone }}</el-col>
                            <el-col :span="24">配送地址：{{ orderDetail.address.street || '未填写' }}</el-col>
                            <el-col :span="24">留言：{{ orderDetail.order.remark || '无' }}</el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20" v-if="orderDetail.goods&&orderDetail.goods.type!=='virtual'">
                    <div slot="header" class="clearfix">
                        <span>物流信息：</span>
                    </div>
                    <logistics-detail 
                            :needLogistics="orderDetail.order.needLogistics" 
                            :orderId="orderId" 
                            orderType="NORMAL" 
                            xkModule="jf_mall" 
                            :goodsWeight="goodsWeight"
                            logisticsType="PLATFORM"></logistics-detail>
                </el-card>
            </div>
        </div>
        <div class="btn-group">
            <el-button :size="$size" type="primary" @click="back()">返回</el-button>
        </div>
    </div>
</template>

<script>
    import OrderInfo from '@/components/welfare/OrderInfo.vue';
    import PrizeInfo from '@/components/welfare/PrizeInfo.vue';
    import LogisticsDetail from "@/components/welfare/LogisticsDetail.vue";
    import UserInfo from '@/components/welfare/UserInfo.vue';
    import { EnumLogisticsName } from '@/util/publicParams.js'
    import { enumFormatter } from '@/util/publicMehotds.js';
    
    export default {
        name: "prizeDetails",
        components: {
            OrderInfo,
            PrizeInfo,
            UserInfo,
            LogisticsDetail
        },
        data(){
            return{
                orderDetail: {
                    user: {},
                    address:{},
                    order: {}
                },
                prizeDetail: {},
                goodsWeight: 0
            }
        },
        created() {
            this.orderId = this.$route.query.orderId;
            this.getDetail();
        },
        methods:{
            getDetail() {
                this.$http.get(this.$api.jMallOBMOrderDetail, {orderId: this.orderId}, true).then(res=>{
                    this.orderDetail = res;
                    this.orderDetail.user = res.user;
                    this.orderDetail.goods = Object.assign(res.goods, res.js);
                    this.goodsWeight = res.goods.weight;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            back() {
                this.$router.push('/winPrize');
            }
        },
        filters: {
            formatLogistic(val) {
                return enumFormatter(val, EnumLogisticsName)
            }
        }
    }
</script>

<style scoped lang="scss">
    .prize-details-list {
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
        .leftBorder{
            padding-left: 20px;
            border-left-width: 2px;
            border-left-style: dotted;
            border-left-color: #999;
            position: relative;
        }
        .borderDotted{
            width: 10px;
            height: 10px;
            background-color: #0000cc;
            border: 1px solid #0000ff;
            border-radius: 10px;
            position: absolute;
            top: 0;
            left: -6px;
        }
        .paddBoth {
            .el-col {
                color: #555;
                font-size: 14px;
                margin-bottom: 10px;
            }
        }
        .logistics {
            font-size: 15px;
            color: #555;
        }
    }
</style>
