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
                        <el-col :span="12" class="title">订单信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">订单ID: {{detailData.orderDetail.orderId}}</el-col>
                        <el-col :span="8">订单状态: {{getOrderStatus(detailData.orderDetail.orderStatus)}}</el-col>
                        <el-col :span="8">下单时间: {{detailData.orderDetail.createTime | formatTime}}</el-col>
                        <el-col :span="8">支付时间: {{detailData.orderDetail.paidAt | formatTime}}</el-col>
                        <el-col :span="8">实际支付金额：
                            {{ 
                                activeName==='BIG_GOODS'|| detailData.orderDetail.orderType==1
                                    ? $math.divide(detailData.orderDetail.realPayMoney, 100)
                                    : $math.divide(detailData.orderDetail.realAmount, 100)
                            }}
                        </el-col>

                        <template v-if="activeName!=='BIG_GOODS' && detailData.orderDetail.orderType==1">
                            <el-col :span="8">商品总价格: {{ $math.divide(detailData.orderDetail.goodsAmount, 100) }}元</el-col>
                            <el-col :span="8">订单总金额: {{$math.divide(detailData.orderDetail.orderAmount, 100)}}</el-col>
                            <el-col :span="8">运费: {{$math.divide(detailData.orderDetail.postFee, 100)}}元</el-col>
                            <el-col :span="8">发货时间: {{detailData.orderDetail.shippingAt | formatTime}}</el-col>
                            <el-col :span="8">完成时间: {{detailData.orderDetail.completelyAt | formatTime}}</el-col>
                            <el-col :span="8">支付方式: {{getPayChannel(detailData.orderDetail.payChannel)}}</el-col>
                        </template>
                        <template v-else>
                            <el-col :span="8">商品收益：{{ $math.divide(detailData.orderDetail.orderIncome, 100) }}</el-col>
                            <el-col :span="8">交易价格：{{ $math.divide(detailData.orderDetail.tradePrice, 100) }}</el-col>
                            <el-col :span="8">应支付金额：{{ $math.divide(detailData.orderDetail.shouldPayMoney, 100) }}</el-col>
                            <el-col :span="8">完成发货交易时间：{{ detailData.orderDetail.shippingAt | formatTime }}</el-col>
                        </template>
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px" v-if="detailData.consumeDrawDetail">
                    <el-row>
                        <el-col :span="12" class="title">优惠信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">优惠金额: {{ $math.divide(detailData.discountDetail.discountAmount, 100)}}元</el-col>
                        <el-col :span="8">卡劵名称: {{detailData.discountDetail.discountName}}</el-col>
                        <!-- <el-col :span="8">参与活动: {{detailData.discountDetail}}</el-col> -->
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">优惠方式: {{detailData.discountDetail.discountType === 'MEMBER_CARD' ? '会员卡':
                            '优惠券'}}
                        </el-col>
                        <el-col :span="8">卡劵ID: {{detailData.discountDetail.discountId}}</el-col>
                        <!-- <el-col :span="8">参与活动ID: {{detailData.discountDetail}}</el-col> -->
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">消费抽奖信息</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" type="primary" 
                            v-if="detailData.consumeDrawDetail.serialNum"
                            @click="openLotteryDetail">消费抽奖详情</el-button>
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">是否能参与消费抽奖:{{detailData.consumeDrawDetail.isFrozen == 1 ? '能':'否'}}
                        </el-col>
                        <!-- <el-col :span="8">所属城市:</el-col> -->
                        <el-col :span="8">对应运营模板:{{detailData.consumeDrawDetail.templateName}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-card>
                            <el-row class="info-content">
                                <el-col :span="6">
                                    奖劵类型:{{detailData.consumeDrawDetail.platform==='merchant'?'商户':'平台'}}
                                </el-col>
                                <el-col :span="6">是否使用:{{detailData.consumeDrawDetail.isUsed?'是':'否'}}
                                </el-col>
                                <el-col :span="6">奖劵ID:{{detailData.consumeDrawDetail.ticketId}}</el-col>
                                <!-- <el-col :span="6">店铺ID:</el-col> -->
                            </el-row>
                        </el-card>
                    </el-row>
                </el-card>
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">商品信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <div class="margin-top: 20px" v-for="(item, index) of detailData.goodsDetail" :key="index">
                        <el-row>
                        <el-col :span="12" style="color: blue;font-size: 14px;">商品{{index+1}}</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" type="primary" @click="goGoodsDetail(item.goodsId)">商品详情</el-button>
                        </el-col>
                    </el-row>
                        <el-row class="info-content">
                            <!-- <el-col :span="8">运费设置: {{item}}</el-col> -->
                            <el-col :span="8">数量: {{item.buyCount}}</el-col>
                            <el-col :span="8">商品重量: {{$math.divide(item.goodsWeight, 1000)}}kg</el-col>
                        </el-row>
                        <el-row class="info-content">
                            <el-col :span="8">商品品牌: {{item.goodsBrand}}</el-col>
                            <el-col :span="8">商品ID: {{item.goodsId}}</el-col>
                            <el-col :span="8">商品名称: {{item.goodsName}}</el-col>
                        </el-row>
                        <el-row class="info-content">
                            <!-- <el-col :span="8">商品类型: {{item}}</el-col> -->
                            <el-col :span="8">商品分类: {{item.goodsCategory}}</el-col>
                            <el-col :span="8">商品图片:
                                <img :src="item.goodsPic" style="width: 100px; height: 100px; vertical-align: top"/>
                            </el-col>
                        </el-row>
                        <el-row class="info-content">
                            <el-col :span="8">商品规格: {{item.goodsAttr}}</el-col>
                            <el-col :span="8">商品价格: {{$math.divide(item.goodsPrice, 100)}}元</el-col>
                        </el-row>
                        <div class="line"></div>
                    </div>
                </el-card>

                <el-card style="margin-bottom: 10px" v-if="detailData.buyerDetail.buyerType ==='user'">
                    <el-row>
                        <el-col :span="12" class="title">用户信息</el-col>
                        <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" type="primary" @click="goUserDetail(detailData.buyerDetail.userDetail.id)">用户详情</el-button>
                        </el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">是否实名认证: {{detailData.buyerDetail.userDetail.auth == 1? '是' :'否'}}</el-col>
                        <el-col :span="8">用户名: {{detailData.buyerDetail.userDetail.name}}</el-col>
                        <el-col :span="8">用户账号: {{detailData.buyerDetail.userDetail.phone}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.buyerDetail.userDetail.cityCode)}}</el-col>
                    </el-row>
                </el-card>
                 <el-card style="margin-bottom: 10px" v-if="detailData.buyerDetail.buyerType ==='muser'">
                    <el-row>
                        <el-col :span="12" class="title">用户信息</el-col>
                        <!-- <el-col :span="12" style="text-align: right">
                            <el-button :size="$size" type="primary" @click="goUserDetail(detailData.buyerDetail.merchantDetail.id)">用户详情</el-button>
                        </el-col> -->
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">是否实名认证: {{detailData.buyerDetail.merchantDetail.auth == 1 ? '是' :'否'}}</el-col>
                        <el-col :span="8">用户名: {{detailData.buyerDetail.merchantDetail.name}}</el-col>
                        <el-col :span="8">用户账号: {{detailData.buyerDetail.merchantDetail.phone}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">所属城市: {{ getPorvinceInfo(detailData.buyerDetail.merchantDetail.cityCode) }}</el-col>
                    </el-row>
                </el-card>

                <el-card style="margin-bottom: 10px" v-if="detailData.receiverDetail">
                    <el-row>
                        <el-col :span="12" class="title">收货人信息</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">姓名: {{detailData.receiverDetail.receiver}}</el-col>
                        <el-col :span="8">手机号码: {{detailData.receiverDetail.phone}}</el-col>
                        <!-- <el-col :span="8">邮编: {{detailData.receiverDetail}}</el-col> -->
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">收货地址: {{detailData.receiverDetail.address}}</el-col>
                        <el-col :span="8">买家留言: {{detailData.receiverDetail.remark}}</el-col>
                    </el-row>
                </el-card>

                <el-card style="margin-bottom: 10px" v-if="detailData.formalitiesDetail">
                    <el-row>
                        <el-col :span="12" class="title">手续费</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <el-col :span="8">支付通道:{{getPayChannel(detailData.formalitiesDetail.payChannel)}}</el-col>
                        <el-col :span="8">当前通道费率:{{$math.multip(detailData.formalitiesDetail.ratio, 100)}}%</el-col>
                        <el-col :span="8">手续费金额:{{ $math.divide(detailData.formalitiesDetail.formalities, 100) }}元</el-col>
                    </el-row>
                </el-card>

                <el-card style="margin-bottom: 10px" v-if="detailData.taxDetail">
                    <el-row>
                        <el-col :span="12" class="title">税金</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <!-- <el-col :span="8">当前订单税率:</el-col> -->
                        <el-col :span="8">税金金额: {{ detailData.taxDetail.taxAmount }} 元</el-col>
                    </el-row>
                </el-card>

                <el-card style="margin-bottom: 10px" v-if="detailData.jackpotAllocation">
                    <el-row>
                        <el-col :span="12" class="title">奖池抽成</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row class="info-content">
                        <!-- <el-col :span="8">当前订单归属城市:</el-col> -->
                        <el-col :span="8">当前城市归属模板: {{detailData.jackpotAllocation.templateName}}</el-col>
                        <el-col :span="8">当前模板业务抽成比例: {{ detailData.jackpotAllocation.earningsRatio }}%</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">抽成金额: {{ detailData.jackpotAllocation.practicalEarningsPriceTemp }} 元</el-col>
                    </el-row>
                </el-card>

                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">平台收益分成</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-table :data="detailData.recommend">
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
                </el-card>
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">销售收益分成</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-table :data="detailData.sales">
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
                        <el-table-column label="区域">
                            <template slot-scope="scope">
                                {{ getPorvinceInfo(scope.row.areaCode) }}
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
                </el-card>
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">推荐商品收益(货源奖励)</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-table :data="detailData.sourceAward">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="收益分成（%）">
                            <template slot-scope="scope">
                                {{ scope.row.earningsRatio }}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="补贴比例">
                            <template slot-scope="scope">
                                {{ scope.row.standbyRatio }}
                            </template>
                        </el-table-column> -->
                        <el-table-column label="正常收益">
                            <template slot-scope="scope">
                                {{ scope.row.standbyPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="（正常+补贴）收益">
                            <template slot-scope="scope">
                                {{ scope.row.advanceEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否考核">
                            <template slot-scope="scope">
                                {{ scope.row.isCheck===0? '否': '是' }}
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
                </el-card>
                <!-- <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">平台赊账</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row>
                        <el-table>
                            <el-table-column label="联盟商ID"></el-table-column>
                            <el-table-column label="联系人姓名"></el-table-column>
                            <el-table-column label="联系方式"></el-table-column>
                            <el-table-column label="收益类型"></el-table-column>
                            <el-table-column label="计算收益"></el-table-column>
                            <el-table-column label="实际收益"></el-table-column>
                            <el-table-column label="舍去金额(平台收入)"></el-table-column>
                        </el-table>
                    </el-row>
                </el-card> -->
                <el-card style="margin-bottom: 10px">
                    <el-row>
                        <el-col :span="12" class="title">平台利润</el-col>
                    </el-row>
                    <div class="line"></div>
                    <el-row>
                        利润： {{ detailData.platformAllocation || 0 }}元
                    </el-row>
                </el-card>
            </div>
        </div>
        <el-dialog title='选择中奖订单编号' :visible.sync="lotteryDialog" width="600px">
            <el-row v-for="item of this.orderDetail" :key="item" style="margin-bottom: 10px">
                <el-col :span="18">编号：{{item}}</el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button :size="$size" type="text" @click="goLotteryDetail(item)">查看详情</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>

</template>

<script>
    import {getPorvinceInfo} from '@/util/publicMehotds'
    import {
        EnumSequencesStatus,
        EnumPayWay,
        EnumTradeProduct,
        MerchantDrawType,
        ShopPrizeType,
        PlatformPrizeType,
        EnumCheckStatus,
        EnumOrderStatus
    } from '@/util/publicParams'
    import { enumFormatter } from '../../../../util/publicMehotds';

    export default {
        name: 'OrderSelfMallDetail',
        data() {
            return {
                detailData: {
                    orderDetail: {}, // 订单信息
                    discountDetail: {}, // 优惠信息
                    consumeDrawDetail: {}, // 消费抽奖信息
                    buyerDetail: {},// 购物人信息
                    goodsDetail: {}, // 商品信息
                    receiverDetail: {}, // 收货人信息
                    formalitiesDetail: {}
                },
                getPorvinceInfo: getPorvinceInfo,
                lotteryDialog: false,
                orderDetail: [],

                /**
                 * 大宗商品
                 */
                activeName: ""
            }
        },
        created() {
            this.activeName = this.$route.query.activeName;
            this.getOrderDetail();
        },
        methods: {
            getOrderDetail() {
                const parameter = {
                    orderNo: this.$route.query.id
                };
                this.$http.get(this.$api.mallOrderDetailAndDivided, parameter, true)
                    .then(res => {
                        this.detailData = Object.assign(this.detailData, res);
                        console.log(JSON.stringify(res))
                        console.log(res)
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
            },
            getPayChannel(val) { // 支付方式
                let name = '';
                if(val) {
                    for(let channel of val) {
                        for (let item of EnumPayWay) {
                            if (channel === item.key) {
                                name = item.value;
                                break;
                            }
                        }
                    }
                }
                return name;
            },
            getOrderStatus(val) { // 订单状态，该页面只有自营相关的顶单
                let name = ''
                for(let item of EnumOrderStatus) {
                    if(val === item.key) {
                        name = item.value
                        break;
                    }
                }
                return name;
            },  
            goUserDetail(userId) { // 会员详情
                this.$router.push({path: '/userDetail', query: {id: userId}})
            },
            goLotteryDetail(id) { // 自营订单抽奖类型只有平台，没有店铺
                this.$router.push({path: '/orderLotteryDetail', query: {serialNum: id, source: 'plat'}})
            },
            goGoodsDetail(goodsId) { // 商品详情(商品全部来自自营)
                this.$router.push({path: '/goodsDetailInfo', query: {id: goodsId, origin:'orderSelfMallDetail'}})
            },
            openLotteryDetail() { // 选择奖品编号的弹框
                this.lotteryDialog = true
                this.orderDetail = this.detailData.consumeDrawDetail.serialNum ? this.detailData.consumeDrawDetail.serialNum : []
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
        background-color: #E3E3E3;
        margin: 10px 0;
    }

    .info-content {
        margin-left: 20px;
        font-size: 14px;
        min-height: 30px;
        line-height: 30px;
        /deep/ .el-col {
            font-size: 14px;
        }
    }
    /deep/ .el-table--border th {
        border: none;
    }
    /deep/ .el-col {
        color: #666;
    }

</style>
