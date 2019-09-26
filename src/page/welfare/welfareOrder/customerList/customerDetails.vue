<template>
    <div class="xk-container customer-details">
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
                        <order-info :detail="OrderDetail.order"></order-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>奖品信息：</span>
                    </div>
                    <div class="paddBoth">
                        <prize-info :detail="OrderDetail.goods"></prize-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>中奖用户信息：</span>
                    </div>
                    <div class="paddBoth">
                        <user-info :isShow="false" :detail="OrderDetail.user"></user-info>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>配送信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row>
                            <el-col :span="12">收件人：{{ OrderDetail.address.receiver }}</el-col>
                            <el-col :span="12">手机号码：{{ OrderDetail.address.phone }}</el-col>
                            <el-col :span="24">配送地址：{{ OrderDetail.address.street || '未填写' }}</el-col>
                            <el-col :span="24">留言：{{ OrderDetail.address.remark || '无' }}</el-col>
                        </el-row>
                    </div>
                </el-card>
                <!--物流信息-->
                <el-card class="box-card marintop20" v-if="OrderDetail.refund.audit !=='UNAUDITED'">
                    <div slot="header" class="clearfix">
                        <span>物流信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class="paddbottom20">
                            <el-col :span="5">物流名称：{{ logisticsDetail.companyName | formatLogistic }}</el-col>
                            <el-col :span="5">快递单号：{{ logisticsDetail.number }}</el-col>
                        </el-row>
                        <logistics-way :detail="logisticsDetail"></logistics-way>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>用户退货详情：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class="paddtop20">
                            <el-col :span="24">申请退货奖品：{{ OrderDetail.goods.name }}</el-col>
                            <el-col :span="24">退货原因：{{ refundForm.reason }}</el-col>
                            <!-- <el-col :span="24">退货说明：{{ refundForm.message || '无' }}</el-col> -->
                            <el-col :span="24" v-if="refundForm.explainUrl">图片描述：</el-col>
                            <el-col :span="24" v-if="refundForm.explainUrl" style="padding: 0 20px;box-sizing: border-box;">
                                <image-list v-for="(item, index) in refundForm.explainUrl" 
                                            :key="index" 
                                            :url="JSON.parse(item).pic"
                                            :type="!JSON.parse(item).video? 'image': 'video'"
                                            :videoUrl="JSON.parse(item).video+'?video'"></image-list>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20" v-if="refundId">
                    <div slot="header" class="clearfix">
                        <span>买家退货物流详情：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class="paddbottom20">
                            <el-col :span="5">物流名称：{{ userLogisitcsDetail.companyName | formatLogistic }}</el-col>
                            <el-col :span="5">物流单号：{{ userLogisitcsDetail.number }}</el-col>
                        </el-row>
                        <logistics-way :detail="userLogisitcsDetail"></logistics-way>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>审核情况：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class=" paddtop20">
                            <el-col>审核结果： {{ OrderDetail.refund.audit | formatEnumAuditStatus }}</el-col>
                            <el-col >审核时间： {{ refundForm.auditTime | formatTime }}</el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20" v-if="OrderDetail.refund.audit === 'VERIFIED'&& refundId && isuser">
                    <div slot="header" class="clearfix">
                        <span>补发货物物流信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class="paddbottom20">
                            <el-col :span="5">物流名称：{{ supLogisitcsDetail.companyName | formatLogistic }}</el-col>
                            <el-col :span="8">物流单号：{{ supLogisitcsDetail.number }}</el-col>
                            <el-col :span="5">
                                <el-button v-permission="'winPrizeUpdateNo'" size="mini" type="primary" @click="updateNo()">修改</el-button>
                            </el-col>
                        </el-row>
                        <logistics-way :detail="supLogisitcsDetail"></logistics-way>
                    </div>
                </el-card>
                <div class="textCenter">
                    <router-link to="/customerList"><el-button :size="$size" type="primary" class="marintop20">确 定</el-button></router-link>
                </div>
            </div>
        </div>
        <!-- 修改物流 -->
        <update-logistic-no 
                orderType="refund" 
                :visible.sync="updateVisible" 
                type="j_mall" 
                :goodsWeight="goodsWeight"
                :orderId="refundId"></update-logistic-no>
    </div>
</template>

<script>
    import {enumFormatter} from '@/util/publicMehotds.js';
    import OrderInfo from '@/components/welfare/OrderInfo.vue';
    import PrizeInfo from '@/components/welfare/PrizeInfo.vue';
    import LogisticsWay from '@/components/welfare/LogisticsWay.vue';
    import UpdateLogisticNo from '@/components/common/UpdateLogisticNo.vue';
    import UserInfo from '@/components/welfare/UserInfo.vue';
    import { EnumAuditStatus, EnumLogisticsName } from '@/util/publicParams.js'
    import ImageList from '@/components/common/ImageList.vue';
    let EnumCategroy = [];
    export default {
        name: "customerDetails",
        components: {
            OrderInfo,
            PrizeInfo,
            LogisticsWay,
            ImageList,
            UserInfo,
            UpdateLogisticNo
        },
        data() {
             return {
                 updateVisible: false,
                 OrderDetail: {
                     goods: {},
                     address: {},
                     js:{},
                     lotteryNumber:[],
                     order:{},
                     user:{},
                     refund: {}
                 },   //订单信息
                 categroy: "",
                 detailPrize: {},   //奖品信息
                 logisticsDetail: {},   //物流详情
                 supLogisitcsDetail: {},   //补发物流
                 userLogisitcsDetail: {},   //买家物流
                 userDetail: {},      //用户信息
                 orderId: '',
                 refundId: '',
                 isuser: '',     //用户退货物流

                 refundForm: {}, //用户退货详情
                 goodsWeight: 0  //商品重量
             }
        },
        created() {
            this.orderId = this.$route.query.orderId;
            this.refundId = this.$route.query.refundId;
            this.isuser = this.$route.query.isuser;
            this.getCategroy();
            this.getLogisticDetail();    //第一次物流发货详情
        },
        methods: {
            getCategroy() {
                this.$http.get(this.$api.queryJFCategory, {}, true).then(res=>{
                    EnumCategroy = res;
                    console.log(res)
                    this.getDetail();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.getDetail();
                })
            },
            getDetail() {
                this.$http.get(this.$api.jMallOBMOrderDetail, {orderId: this.orderId}, true).then(res=>{
                    this.OrderDetail = res;
                    this.OrderDetail.goods = Object.assign(res.goods, res.js);
                    this.OrderDetail.user = res.user;
                    this.refundForm = res.refund;
                    if(this.refundId) {
                        // (params.isuser = 1,params.refundId=row.refundId);
                        this.getLogisticDetail(true, true);   //用户退货物流详情
                        this.isuser? this.getLogisticDetail(true): null;    //二次发货物流详情
                    }
                    this.goodsWeight = res.goods.weight;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //获取物流详情
            getLogisticDetail(type, isuser) {
                /**
                 * @param orderType          NORMAL：正常订单     REFUND：退款订单
                 * @param logisticsType      PLATFORM：平台       USER：用户
                 * @param XkModule           jf_mall：积分商城    mall：自营商城
                 * @param orderId            订单号ID（正常、退货）
                 */
                let params = {
                    xkModule: 'jf_mall', 
                    logisticsType: 'PLATFORM'
                }
                if(!type){ params.orderType='NORMAL',params.orderId=this.orderId;}
                else{
                    isuser? params.logisticsType = 'USER': null;
                    params.orderType= 'REFUND';
                    params.orderId=this.refundId
                }
                this.$http.get(this.$api.logisticsQuery, params, true).then(res=>{
                    if(!type){
                        res? this.logisticsDetail = res: null;
                    }else{
                        res? isuser ?this.userLogisitcsDetail = res : this.supLogisitcsDetail = res: null;
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            updateNo() {
                this.updateVisible = true;
            }
        },
        filters: {
            formatCategroy(val) {
                return enumFormatter(val, EnumCategroy, {key: 'code', value: 'name'})
            },
            formatEnumAuditStatus(val) {
                return enumFormatter(val, EnumAuditStatus)
            },
            formatLogistic(val) {
                return enumFormatter(val, EnumLogisticsName)
            }
        },
        watch: {
            updateVisible(val) {
                !val ? this.getLogisticDetail(true) : null
            }
        }
    }
</script>

<style lang="scss" scoped>  
    .customer-details {
        .paddBoth {
            padding-left: 20px;
            padding-right: 20px;
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
        .el-row {
            font-size: 14px;
            color: #555;
            .el-col {
                margin-bottom: 10px;
            }
        }
        .way-info{
            .el-col {
                border-left: 1px dashed #ccc;
                padding: 0 20px 10px;
                position: relative;
                span{
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #fff;
                    border: 2px solid #1890FF;
                    border-radius: 50%;
                    position: absolute;
                    left: -4px;
                    top: 5px;
                }
            }
        }
    }
    
</style>
