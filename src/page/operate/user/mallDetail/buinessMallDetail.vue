<template>
    <div class="buiness-mall-detail xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <h3>订单信息</h3>
                <el-row>
                    <el-col :span="12">订单ID：{{ orderDetail.orderDetail.orderId }}</el-col>
                    <el-col :span="12">下单时间：{{ orderDetail.orderDetail.createdAt | formatTime }}</el-col>
                    <el-col :span="12">所属店铺：{{ orderDetail.orderDetail.shopName }}</el-col>
                    <el-col :span="12">订单状态：{{ orderDetail.orderDetail.newStatus | formatOrderStatus }}</el-col>
                    <el-col :span="12">订单总金额：{{ $math.divide(orderDetail.orderDetail.pirce, 100).toFixed(2) }}元</el-col>
                    <el-col :span="12">现金支付： {{  $math.divide(orderDetail.orderDetail.totalCash, 100).toFixed(2) }}元</el-col>
                    <el-col :span="12">消费券支付：{{ $math.divide(orderDetail.orderDetail.totalVoucher, 100).toFixed(2) }}元</el-col>
                    <el-col :span="12">商家券支付：{{ $math.divide(orderDetail.orderDetail.totalShopVoucher, 100).toFixed(2) }}元</el-col>
                    <el-col :span="12">优惠金额：{{ $math.divide(orderDetail.orderDetail.discountMoney, 100).toFixed(2) }}元</el-col>
                    <el-col :span="12">使用卡券：{{ orderDetail.orderDetail.discountName || '无' }}</el-col>
                    <el-col :span="12">订单备注：{{ orderDetail.orderDetail.remark || '无' }}</el-col>
                    <el-col :span="12" v-if="orderDetail.orderDetail.orderStatus=='COMPLETELY'">完成时间：{{ orderDetail.orderDetail.updatedAt | formatTime }}</el-col>
                </el-row>

                <h3 class="margintop20">商品信息</h3>
                <!-- 特殊  服务+加购类型 -->
                <template v-for="(item, index) in orderDetail.orderDetail.goods">
                    <template v-if="orderDetail.orderDetail.sceneStatus==='SERVICE_AND_LOCALE_BUY'">
                        <h4 :key="index"><span>服务</span></h4>
                    </template>

                    <div class="goods-num" :key="index" v-if="orderDetail.orderDetail.sceneStatus!=='LOCALE_BUY'">
                        <span v-if="index==0">商品{{ index+1 }}</span>
                        <el-row>
                            <el-col :span="6">商品分类：
                                <template v-if="orderDetail.orderDetail.sceneStatus==='SERVICE_OR_STAY'">
                                    <template v-if="orderDetail.orderDetail.bcleGoodsType=='1003'">住宿类</template>
                                    <template v-else>服务类</template>
                                </template>
                                <template v-else>
                                    {{ orderDetail.orderDetail.sceneStatus | formatGoodsType }}
                                </template>
                            </el-col>
                                
                            <el-col :span="6">数量：1</el-col>
                            <el-col :span="6">商品规格：{{ item.skuName }}</el-col>
                            <el-col :span="6">商品ID：{{ item.goodsId }}</el-col>
                            <el-col :span="6">商品价格：{{ $math.divide(item.platformShopPrice, 100).toFixed(2) }}元</el-col>
                            <el-col :span="18">商品名称：{{ item.goodsName }}</el-col>
                            <el-col :span="24">商品图片： </el-col>
                            <el-col :span="24" class="img-box" v-if="item.skuUrl">
                                <div class="img-list">
                                    <img :src="item.skuUrl" @click="$viewImage(item.skuUrl)" alt="">
                                </div>
                            </el-col>
                        </el-row>
                    </div>

                    <template v-if="orderDetail.orderDetail.sceneStatus==='SERVICE_AND_LOCALE_BUY' || orderDetail.orderDetail.sceneStatus==='LOCALE_BUY'">
                        <h4 v-if="orderDetail.orderDetail.sceneStatus==='SERVICE_AND_LOCALE_BUY'" :key="index" class="h4-item"><span>加购商品 {{ index+1 }}</span></h4>
                        <template v-for="(subItem, subIndex) in item.goods">
                            <div class="goods-num" :key="subIndex">
                                <span v-if="index==0">商品{{ subIndex+1 }}</span>
                                <el-row>
                                    <el-col :span="6">商品分类：商品类</el-col>
                                    <el-col :span="6">数量：1</el-col>
                                    <el-col :span="6">商品规格：{{ subItem.goodsSkuName }}</el-col>
                                    <el-col :span="6">商品ID：{{ subItem.goodsId }}</el-col>
                                    <el-col :span="6">商品价格：{{ $math.divide(subItem.platformShopPrice, 100).toFixed(2) }}元</el-col>
                                    <el-col :span="18">商品名称：{{ subItem.name }}</el-col>
                                    <el-col :span="24">商品图片： </el-col>
                                    <el-col :span="24" class="img-box" v-if="subItem.goodsSkuUrl">
                                        <div class="img-list">
                                            <img :src="subItem.goodsSkuUrl" @click="$viewImage(subItem.goodsSkuUrl)" alt="">
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                    </template>
                </template>

                <h3 class="margintop20">
                    消费抽奖信息
                    <el-button style="margin-left: 20px" v-if="orderDetail.shopActivity.joinAble===1 && orderDetail.shopActivity.isUsed!=0" type="text" :size="$size" class="link-detail" @click="goToDrawInfo('shop', orderDetail.shopActivity.id)">查看店铺消费抽奖详情</el-button>
                    <el-button v-if="orderDetail.platActivity.joinAble===1 && orderDetail.platActivity.isUsed!=0" type="text" :size="$size" class="link-detail" @click="goToDrawInfo('plat', orderDetail.platActivity.id)">查看平台消费抽奖详情</el-button>
                </h3>
                <el-row>
                    <el-col :span="12">是否能参与平台消费抽奖：{{ orderDetail.platActivity.joinAble===0? '否': '是' }}</el-col>
                    <template v-if="orderDetail.platActivity.joinAble===1">
                        <el-col :span="12">所属城市：{{ getPorvinceInfo(orderDetail.orderDetail.areaCode) }}</el-col>
                        <el-col :span="12">对应运营模板：{{ orderDetail.platActivity.templateName }}</el-col>
                        <el-col :span="12">奖券类型：平台</el-col>
                        <el-col :span="12">是否使用：{{ orderDetail.platActivity.isUsed === 0?'否': '是' }}</el-col>
                        <el-col :span="12">奖券ID：{{ orderDetail.platActivity.ticketId }}</el-col>
                    </template>
                </el-row>
                <br>
                <el-row>
                    <el-col :span="12">是否能参与店铺消费抽奖：{{ orderDetail.shopActivity.joinAble===0? '否': '是' }}</el-col>
                    <template v-if="orderDetail.shopActivity.joinAble===1">
                        <el-col :span="12">所属城市：{{ getPorvinceInfo(orderDetail.orderDetail.areaCode) }}</el-col>
                        <el-col :span="12">对应运营模板：{{ orderDetail.shopActivity.activityName }}</el-col>
                        <el-col :span="12">奖券类型：店铺</el-col>
                        <el-col :span="12">是否使用：{{ orderDetail.shopActivity.isUsed === 0?'否': '是' }}</el-col>
                        <el-col :span="12">奖券ID：{{ orderDetail.shopActivity.ticketId }}</el-col>
                        <!-- 当奖券类型为店铺/平台时候显示 -->
                        <el-col :span="12">店铺ID：{{ orderDetail.orderDetail.shopId }}</el-col>
                    </template>
                </el-row>

                <template v-if="orderDetail.userDetail">
                    <h3 class="margintop20">
                        用户信息
                        <el-button type="text" :size="$size" class="link-detail" @click="goToUserInfo()">查看详情</el-button>
                    </h3>
                    <el-row>
                        <el-col :span="6">是否实名认证：{{ orderDetail.userDetail.auth==0? '否': '是' }}</el-col>
                        <el-col :span="6">用户名：{{ orderDetail.userDetail.name }}</el-col>
                        <el-col :span="6">用户账号：{{ orderDetail.userDetail.phone }}</el-col>
                        <el-col :span="6">所属城市：{{ getPorvinceInfo(orderDetail.userDetail.cityCode) }}</el-col>
                    </el-row>
                </template>

                <h3 class="margintop20">预约信息</h3>
                <el-row>
                    <el-col :span="6">预约时间：
                        <template v-if="
                                        orderDetail.orderDetail.sceneStatus==='SERVICE_OR_STAY' 
                                        && orderDetail.orderDetail.bcleGoodsType=='1003' 
                                        || orderDetail.orderDetail.sceneStatus==='TAKE_OUT'
                                        || orderDetail.orderDetail.sceneStatus==='ON_LINE_TAKE_OUT'">
                            {{ orderDetail.orderDetail.appointRange.split("-")[0] | formatTime }}&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;{{ orderDetail.orderDetail.appointRange.split("-")[1] | formatTime }}
                        </template>
                        <template v-else>
                            <span v-if="orderDetail.orderDetail.appointRange">{{ orderDetail.orderDetail.appointRange | formatTime }}</span>
                            <span v-else>空</span>
                            <!-- {{ orderDetail.orderDetail.appointRange.split("-")[0] | formatTime }}&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;{{ orderDetail.orderDetail.appointRange.split("-")[1] | formatTime }} -->
                        </template>
                    </el-col>
                    <el-col :span="6">手机号码：{{ orderDetail.orderDetail.phone }}</el-col>
                </el-row>

                <h3 class="margintop20">手续费</h3>
                <el-row>
                    <el-col :span="6">手续费金额：{{ $math.divide(orderDetail.formalitiesDetail.formalities, 100) }}元</el-col>
                    <template v-if="orderDetail.formalitiesDetail.formalities!=0">
                        <el-col :span="6">当前订单使用支付通道：{{ orderDetail.formalitiesDetail.payChannel | formatChannel }}</el-col>
                        <el-col :span="24" style="margin-top:0">
                            <el-row style="padding: 0">
                                <el-col :span="3" style="text-align: left">当前通道费率详情：</el-col>
                                <el-col :span="21">
                                    <p v-for="(item,index) in orderDetail.formalitiesDetail.ratio" :key="index">
                                        <span style="display:inline-block;width: 180px">费率：{{ item.rate }}</span>
                                        <span style="display:inline-block;width: 180px">金额：{{ $math.divide(item.poundage, 100).toFixed(2) }}</span>
                                    </p>
                                </el-col>
                            </el-row>
                        </el-col>
                    </template>
                </el-row>

                <h3 class="margintop20" v-if="orderDetail.platformRake">平台抽成</h3>
                <el-row>
                    <template v-if="orderDetail.platformRake">
                        <el-col :span="6">平台抽成比例：{{ orderDetail.platformRake.ratio }}%</el-col>
                        <el-col :span="6">平台抽成金额：{{ orderDetail.platformRake.amount }}元</el-col>
                    </template>
                </el-row>

                <h3 class="margintop20">奖池抽成</h3>
                <el-row>
                    <el-col :span="6">当前订单归属城市：{{ getPorvinceInfo(orderDetail.orderDetail.areaCode) }}</el-col>
                    <template v-if="orderDetail.jackpotAllocation">
                        <el-col :span="6">当前城市归属模板：{{ orderDetail.jackpotAllocation.templateName }}</el-col>
                        <el-col :span="6">当前模板该业务抽成比例：{{ orderDetail.jackpotAllocation.earningsRatio }}%</el-col>
                        <el-col :span="6">抽成金额：{{ orderDetail.jackpotAllocation.practicalEarningsPriceTemp }}元</el-col>
                    </template>
                </el-row>

                <h3 class="margintop20">平台收益分成</h3>
                <el-row>
                    <el-table class="margintop20" :data="orderDetail.recommend">
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
                    </el-table>
                </el-row>

                <h3 class="margintop20">平台利润</h3>
                <el-row>
                    <el-col :span="24">{{ orderDetail.platformAllocation }} 元</el-col>
                </el-row>
            </div>
        </div>
        <el-dialog title="选择" width="500px" :visible.sync="selectDialog">
            <template v-if="orderDetail.platActivity && orderDetail.platActivity.id">
                <el-row v-if="orderDetail.platActivity.id.length == 0">无</el-row>
                <el-row v-for="item in orderDetail.platActivity.id" :key="item" v-else>
                    <el-col :span="16">中奖记录：{{item}}</el-col>
                    <el-col :span="8">
                        <el-button :size="$size" type="text" @click="goToDrawInfoPlat(item)">查看详情</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    /**
    * 特殊情况说明：
    * 服务+加购，goods展示外层和内层；
    * 现场，只展示最里层
    */
    const EnumGoodsType = [{ key: 'SERVICE_OR_STAY', value: '服务类或住宿类' },{ key: 'TAKE_OUT', value: '外卖类' },{ key: 'LOCALE_BUY', value: '现场购物类' },{ key: 'SERVICE_AND_LOCALE_BUY', value: '服务+现场购物' },{ key: 'SHOP_HAND_ORDER', value: '商家手动下单' },{ key: 'ON_LINE_TAKE_OUT', value: '在线购物' }]
    import { EnumBusinessOrderStatus,EnumCheckStatus,EnumPayWay } from '@/util/publicParams.js';

     //加购订单主状态  STAY_EVALUATE(已结算)   STAY_CLEARING(待结算)
    // let _EnumShopOrderStatus = EnumShopOrderStatus.concat([
    //     {key: 'STAY_CLEARING', value: '待结算'},
    //     {key: 'STAY_EVALUATE', value: '已结算'}
    // ])
    
    import { getPorvinceInfo,enumFormatter } from '@/util/publicMehotds.js';
    export default {
        data() {
            return {
                getPorvinceInfo,
                orderId: '',
                orderDetail: {
                    orderDetail: {
                       goods: [] 
                    },
                    userDetail: {},
                    platActivity: {
                        id: []
                    },
                    shopActivity: {},
                    formalitiesDetail: {},
                    jackpotAllocation: {}
                },
                selectDialog: false
            }
        },
        created() {
            this.orderId = this.$route.query.orderId;
            this.getOrderDetail();
        },
        methods: {
            getOrderDetail() {
                this.$http.get(this.$api.shopOrderDetail, {orderId: this.orderId}, true).then(res=>{
                    this.orderDetail = res
                    console.log('detail', res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //查看用户详情
            goToUserInfo() {
                this.$router.push({
                    path: '/orderLotteryDetail',
                    query: {
                        id: this.orderDetail.userDetail.id
                    }
                })
            },
            //查看消费抽奖详情
            goToDrawInfo(source, id) {
                if(source === 'shop') {
                    this.$router.push({
                        path: '/orderLotteryDetail',
                        query: {
                            source: source,
                            orderId: id
                        }
                    })
                } else {
                    this.orderDetail.platActivity.id = this.orderDetail.platActivity.id ? this.orderDetail.platActivity.id : []
                    this.selectDialog = true
                }
            },
            goToDrawInfoPlat(id) { // 选择的抽奖编号跳转消费抽奖详情
                this.$router.push({path: '/orderLotteryDetail', query: {source: 'plat', orderId: id}})
            }
        },
        filters: {
            formatOrderStatus(val) {
                return enumFormatter(val, EnumBusinessOrderStatus, {value: 'label'})
            },
            formatStatus(val) {
                return enumFormatter(val, EnumCheckStatus)
            },
            formatGoodsType(val) {
                return enumFormatter(val, EnumGoodsType)
            },
            formatChannel(val) {
                return enumFormatter(val, EnumPayWay)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './buinessMallDetail';
</style>
