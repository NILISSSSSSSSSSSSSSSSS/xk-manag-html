<template>
    <div class="xk-container order-platform-detail">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>订单详情
                </div>
                <div class="vus-bottom"></div>
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">订单信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">订单类型: {{lotteryDetail.order.awardUsage === 'expense' ? '消费抽奖' : '福利抽奖'}}</el-col>
                        <el-col :span="8">兑奖编号: 
                            <span v-for="item of lotteryDetail.lotteryNumbers" :key="item">
                                {{item}} ,
                            </span>
                        </el-col>
                        <el-col :span="8">每注: {{$math.divide(lotteryDetail.order.eachPrice, 100)}}消费券</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">订单ID:{{ lotteryDetail.order.orderId }}</el-col>
                        <el-col :span="8">下单时间:{{ lotteryDetail.order.createdAt | formatTime }}</el-col>
                        <el-col :span="8">购买注数: {{lotteryDetail.order.orderNumber}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">订单总金额:{{($math.divide(lotteryDetail.order.price, 100))}}消费券</el-col>
                        <el-col :span="8">支付方式: 消费券</el-col><!--只有这种方式-->
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">奖品信息</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" type="primary" @click="goToGoodsDetail(lotteryDetail.goods)">查看详情</el-button>
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">奖品ID:{{lotteryDetail.goods.id}}</el-col>
                        <el-col :span="8">奖品类型:{{lotteryDetail.goods.type==='substance'?'实物奖品':'虚拟奖品'}}</el-col>
                        <el-col :span="8">奖品分类: {{lotteryDetail.goods.type==='substance' ? lotteryDetail.goods.categoryId : '无'}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <!-- <el-col :span="8">适用对象:{{lotteryDetail.goods.adaptObject==='user'?'用户':'商户'}}</el-col> -->
                        <el-col :span="8">奖品标题:{{lotteryDetail.goods.name}}</el-col>
                        <el-col :span="8">奖品用途:{{lotteryDetail.goods.usage==='expense'?'消费抽奖':'福利抽奖'}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">奖品价格:{{ $math.divide(lotteryDetail.goods.price, 100) }}</el-col>
                        <el-col :span="8">奖品图片:
                            <img :src="lotteryDetail.goods.showPics" alt="" style="height: 120px;vertical-align: top">
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">开奖方式:{{computedLotteryOpenType(lotteryDetail.js.drawType.jDrawType)}}</el-col>
                        <el-col :span="8">开奖注数:{{lotteryDetail.js.maxStake ? lotteryDetail.js.maxStake : 0}}</el-col>
                        <el-col :span="8">每注消费券金额:{{ $math.divide(lotteryDetail.js.drawType.eachNotePrice, 100) }}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">开奖期数:{{lotteryDetail.js.currentNper}}</el-col>
                        <el-col :span="8">期号:{{lotteryDetail.js.termNumber}}</el-col>
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px" v-if="lotteryDetail.user.userId">
                    <el-row>
                        <el-col :span="12" class="title">用户信息</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" @click="goToUserDetail" type="primary">用户详情</el-button>
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">是否实名认证:{{ lotteryDetail.user.auth == 0 ? '否': '是' }}</el-col>
                        <el-col :span="8">用户名:{{ lotteryDetail.user.username }}</el-col>
                        <el-col :span="8">用户账号:{{ lotteryDetail.user.tel }}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">地区归属:{{ getPorvinceInfo(lotteryDetail.user.areaCode)}}</el-col>
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px" v-if="lotteryDetail.user.merchantId">
                    <el-row>
                        <el-col :span="12" class="title">联盟商信息</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" @click="goToMerchantDetail(lotteryDetail.user.merchantId)" type="primary">联盟商详情</el-button>
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">联盟商ID:{{ lotteryDetail.user.merchantId }}</el-col>
                        <el-col :span="8">姓名:{{ lotteryDetail.user.username }}</el-col>
                        <el-col :span="8">用户账号:{{ lotteryDetail.user.tel }}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">地区归属:{{ getPorvinceInfo(lotteryDetail.user.areaCode)}}</el-col>
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px" v-if="lotteryDetail.address">
                    <el-row>
                        <el-col :span="12" class="title">收货信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">姓名:{{lotteryDetail.address.receiver}}</el-col>
                        <el-col :span="8">手机号码:{{lotteryDetail.address.phone}}</el-col>
                        <!-- <el-col :span="8">邮编:</el-col> -->
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="24">收货地址:{{lotteryDetail.address.street}}</el-col>
                        <el-col :span="12">买家留言: {{lotteryDetail.address.remark}}</el-col>
                    </el-row>
                </el-card>
                <!--只有晒单信息审核通过时才显示晒单信息-->
                <el-card style="margin-bottom: 10px" v-if="lotteryDetail.share && lotteryDetail.share.audit === 'verified'">
                    <el-row>
                        <el-col :span="12" class="title">晒单信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col>晒单内容:{{lotteryDetail.share.content}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col>晒单图片:
                            <img v-for="(item,$index) in lotteryDetail.share.pictures"
                                 :key="$index"
                                 :src="item" alt="评论图片" style="max-height: 100px;margin-right: 10px">
                            <video v-if="lotteryDetail.share.video" :src="lotteryDetail.share.video.url" 
                            controls height="100" width="200" :poster="lotteryDetail.share.video.mainPic"></video>
                        </el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col>晒单奖励:{{lotteryDetail.share.returnType==='voucher'?'消费券':'彩票'}}</el-col>
                    </el-row>
                </el-card>
            </div>
        </div>
    </div>

</template>

<script>
    import {EnumJDrawType, EnumPayWay} from '../../../../util/publicParams';
    import { enumFormatter, getPorvinceInfo } from "@/util/publicMehotds";


    export default {
        name: 'orderPlatformDetail',
        data() {
            return {
                detail: {
                    userDetail: {},
                    order: {},
                    goods: {},
                    js:{},
                    share: {
                        audit: 'verified'
                    },
                    user: {},
                    refund: {},
                    address: {}
                },
                lotteryDetail: {
                    userDetail: {},
                    order: {},
                    goods: {},
                    js:{
                        drawType: {}
                    },
                    share: {},
                    user: {},
                    refund: {},
                    address: {},
                    lotteryNumbers: []
                },
                source: '',
                getPorvinceInfo: getPorvinceInfo
            }
        },
        created() {
            this.source = this.$route.query.source;
            // this.getDetail();
            this.getLotteryDetail();
        },
        methods: {

            /**
             * 计算奖品的开奖方式
             * */
            computedLotteryOpenType(type) {
                let result = EnumJDrawType.find(item => item['key'] === type);
                if (result) {
                    return result.value;
                }
                return '未知开奖方式';
            },

            /**
             * 获取奖品信息/收货人信息/晒单信息
             * */
            getLotteryDetail() {
                let parameter = {
                    orderId: this.$route.query.id
                };
                console.log(parameter)
                this.$http.get(this.$api.jOrderDetailLevelSecond, parameter, true)
                    .then(res => {
                        this.lotteryDetail = res;
                        console.log(res)
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
            },


            /**
             * 跳转到奖品详情页面
             * */
            goToGoodsDetail(row) {
                // const query = {
                //     id: this.lotteryDetail.goods.id
                // };
                let path = "/prizesAddList";      //默认为夺奖派对自身创建的页面
                let query = {
                    id: row.id
                };      //默认为夺奖派对自身创建的页面
                if(row.from==='mall') {
                    path = "/goodsDetailInfo";
                    query = {
                        id: row.mallGoodsId
                    }
                }else if(row.from==='jf_mall' && row.mallGoodsId) {
                    path = "/prizesDetails";   //从自营商城来的福利商品
                    query = {
                        id: row.mallGoodsId,    //自营商城ID
                        prizeId: row.id,
                        from: 'financial'
                    }
                }
                query.from = 'financial'
                this.$router.push({
                    path,
                    query
                })
            },

            /**
             *跳转到用户详情
             * */
            goToUserDetail() {
                this.$router.push({
                    path: '/userDetail',
                    query: {id: this.lotteryDetail.user.userId}
                    // query: {id: '5c1780570334556b0e6e4278'}
                })
            },
            goToMerchantDetail(merchantId) { // 联盟商详情
                this.$router.push({path: '/businessDetail', query: {id: merchantId}})
            },
            getPayChannel(val) { // 支付方式
                return enumFormatter(val, EnumPayWay);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .order-platform-detail {
        .title {
            font-weight: 600;
            }
        .line {
            height: 1px;
            width: 100%;
            background-color: #E3E3E3;
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
            padding: 0 0;
            }
        /deep/ .el-table--border th {
            border: none;
            }
        }
</style>
