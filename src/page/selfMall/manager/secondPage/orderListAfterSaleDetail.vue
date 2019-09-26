<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="order-list">
                <h3>订单状态：
                    <template v-if="status">
                        已关闭
                    </template>
                    <template v-else-if="sale">
                        {{ detail.refundOrder.refundStatus | formatEnumRefundUserStatus }}
                    </template>
                    <template v-else>
                        {{ detail.order.orderStatus | formatOrderStatus }}
                    </template>
                </h3>
                <div class="list-content">
                    <el-card class="box-card">
                        <div class="title">订单信息</div>
                        <el-row>
                            <el-col :span="6">订单ID：{{ detail.order.orderId }}</el-col>
                            <el-col :span="6">下单时间：{{ detail.order.createdAt | formatTime }}</el-col>
                            <template v-if="activeName!=='BIG_GOODS'">
                                <el-col :span="6">购买数量：{{ detail.order.totalCount }}</el-col>
                                <el-col :span="6">订单总金额：
                                    {{ detail.order.totalMoney? $math.divide(detail.order.totalMoney, 100).toFixed(2): 0 }}元
                                </el-col>
                                <template v-if="detail.order.type">
                                    <el-col :span="12" v-if="detail.order.type">参与活动促销：{{ detail.order.couponName }}</el-col>
                                    <el-col :span="12">使用优惠券/折扣卡：{{ !detail.order.type? '无': "有" }}</el-col>
                                </template>
                                <el-col :span="6">商品总价格：{{ detail.order.totalMoney? $math.divide($math.sub(detail.order.totalMoney, detail.order.postFee), 100).toFixed(2): 0 }}</el-col>
                                <el-col :span="6" v-if="detail.order.type === 'coupon'">会员折扣价：{{ detail.order.discountMoney? $math.divide(detail.order.discountMoney, 100).toFixed(2):0 }}元</el-col>
                                <el-col :span="6">运费：{{ detail.order.postFee? $math.divide(detail.order.postFee, 100).toFixed(2):0 }}元<el-button v-if="detail.order.orderStatus == 'PRE_PAY' && !sale && !close" style="margin-left:30px" size="mini" type="primary" @click="modifyPriceDetail()">修改运费</el-button></el-col>
                                <el-col :span="6" v-if="detail.order.type === 'member'">折扣/满减总金额：{{ detail.order.discountMoney? $math.divide(detail.order.discountMoney, 100).toFixed(2):0 }}元</el-col>
                                <el-col :span="6" v-if="detail.order.orderPayInfos">支付方式：
                                    <span v-for="(item,index) in detail.order.orderPayInfos" :key="index">
                                        {{ item.payChannel |  formatTicket }}<template v-if="index!==detail.order.orderPayInfos.length-1">，</template>
                                    </span>
                                </el-col>
                                <el-col :span="6">订单状态：
                                    <template v-if="type===3">
                                        已关闭
                                    </template>
                                    <template v-else>
                                        {{ detail.order.orderStatus | formatOrderStatus }}
                                    </template>
                                    <el-button v-if="detail.order.orderStatus == 'PRE_SHIP' && !sale && !close && !fromChat" style="margin-left:30px" size="mini" type="primary" @click="deliveryGoods">发货</el-button></el-col>
                                <el-col :span="6" v-if="type==3">关闭订单时间：{{ detail.order.updatedAt | formatTime }}</el-col>
                            </template>
                            <template v-else>
                                <el-col :span="6">订单状态：
                                    <template v-if="type===3">
                                        已关闭
                                    </template>
                                    <template v-else>
                                        {{ detail.order.orderStatus | formatOrderStatus }}
                                    </template>
                                    <el-button 
                                            v-if="detail.order.orderStatus == 'PRE_SHIP' && !sale && !close && !fromChat" 
                                            style="margin-left:30px" 
                                            :size="$size" 
                                            type="primary" 
                                            @click="finishTrade()">完成交易</el-button></el-col>
                                <el-col :span="6" v-if="detail.order.payChannel">支付方式：
                                    <template v-for="(item,index) in JSON.parse(detail.order.payChannel)">
                                        <span :key="item.payChannel">{{ item.payChannel | formatTicket }}<template v-if="index!==JSON.parse(detail.order.payChannel).length-1">，</template></span>
                                    </template>
                                </el-col>
                                <el-col :span="6">使用消费券：{{ $math.divide(detail.order.xfq, 100) }}</el-col>
                                <el-col :span="6">应支付金额：{{ $math.divide(detail.order.shouldPayMoney,100) }}</el-col>
                                <el-col :span="6">实际支付金额：{{ $math.divide(detail.order.realPayMoney , 100) }}</el-col>
                                <el-col :span="6" v-if="detail.goods[0]">预约金：{{ $math.divide(detail.goods[0].price, 100) }}</el-col>
                                <el-col :span="6">交易价格：{{ $math.divide(detail.order.tradePrice, 100) }}</el-col>
                                <el-col :span="6">商品收益：{{ $math.divide(detail.order.orderIncome, 100) }}</el-col>
                                <el-col :span="6">支付时间：{{ detail.order.payTime | formatTime }}</el-col>
                                <el-col :span="6">完成发货交易时间：{{ detail.order.shippingTime | formatTime }}</el-col>
                            </template>
                            <el-col :span="6" v-if="type==1&&detail.order.orderStatus == 'COMPLETELY'&&detail.order.status==='active'">完成时间：{{ detail.order.updatedAt | formatTime }}</el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card">
                        <div class="title">商品信息</div>
                        <!-- 订单信息 -->
                        <div v-for="(item, index) in detail.goods" :key="index">
                            <el-row>
                                <el-col :span="24">商品名称：{{ item.goodsName }}</el-col>
                                <el-col :span="12">商品ID：{{ item.goodsId }}</el-col>
                                <el-col :span="12">子单ID：{{ item.id }}</el-col>
                                <el-col :span="6">数量：{{ item.num }}</el-col>
                                <el-col :span="6">商品类型：{{ item.goodsType==='NEW'? '全新': '二手' }}</el-col>
                                <el-col :span="6">商品分类：{{ item.goodsCategory | formatCategory }}</el-col>
                                <el-col :span="6">子单状态：
                                    <template v-if="type==3">
                                        已完成
                                    </template>
                                    <template v-if="type==2">
                                        {{ item.itemStatus | formatRefundOrderStatus }}
                                    </template>
                                    <template v-if="type==1">
                                        <template v-if="item.itemStatus === 'NONE'">
                                            {{ detail.order.orderStatus | formatOrderStatus }}
                                        </template>
                                        <template v-else>
                                            {{ item.itemStatus | formatNormal }}
                                        </template>
                                    </template>    
                                </el-col>
                                <el-col :span="6">商品规格： {{ item.goodsAttr }}</el-col>
                                <el-col :span="6">商品价格：{{ $math.divide(item.price, 100).toFixed(2) }}元</el-col>
                                <el-col :span="6">商品品牌： {{ item.goodsBrand }}</el-col>
                                <el-col :span="6">商品重量：{{ item.goodsWeight }}g</el-col>
                                <el-col :span="6" v-if="activeName!=='BIG_GOODS'">运费设置：{{ item.isFreeShipping==0? '不包邮': '包邮' }}</el-col>
                                <el-col :span="6">供应商：{{item.supplierName}}</el-col>
                                <el-col :span="24">商品图片：</el-col>
                                <el-col :span="24" class="img-box">
                                    <image-list v-for="itemImg in item.showPicUrl" 
                                                :url="itemImg"
                                                :key="itemImg"></image-list>
                                </el-col>
                            </el-row>
                            <el-row v-if="item.sPromotionTemplates!=0" >
                                推广模板：
                                <el-col :span="24" v-for="(tmp,subInd) in item.sPromotionTemplates" :key="subInd" style="padding: 0 20px;box-sizing:border-box">
                                    <el-button type="text">{{ tmp.name }}</el-button><el-button :size="$size" @click="viewTmp(tmp.h5Url, tmp)">预览模板</el-button>
                                </el-col>
                            </el-row>
                            <hr size="1" noshade="noshade" style="border:1px #cccccc dotted;"/>
                        </div>
                    </el-card>
                    <!-- 用户信息 -->
                    <el-card class="box-card">
                        <div class="title">用户信息</div>
                        <el-row>
                            <el-col :span="6">用户类型：{{ detail.user.userType==='user'? '普通用户': detail.user.userType==='muser'? '商户': '管理员' }}</el-col>
                            <el-col :span="6">用户名：{{ detail.user.nickName }}</el-col>
                            <el-col :span="6">用户账号：{{ detail.user.amount }}</el-col>
                        </el-row>
                    </el-card>
                    <!-- 收货人信息 -->
                    <el-card class="box-card">
                        <div class="title">收货人信息</div>
                        <el-row>
                            <el-col :span="6">姓名：{{ detail.address.receiver }}</el-col>
                            <el-col :span="18">手机号码：{{ detail.address.phone }}</el-col>
                            <el-col :span="24">收货地址：{{ detail.address.street }}</el-col>
                            <el-col :span="24">留言：{{ detail.address.remark || '无' }}</el-col>
                        </el-row>
                    </el-card>
                    <!-- 物流信息 -->
                    <template v-if="type==2 
                                && detail.refundOrder
                                && detail.refundOrder.refundStatus ==='PRE_PLAT_RECEIVE' 
                                || (detail.order.orderStatus == 'PRE_RECEVICE' || detail.order.orderStatus === 'PRE_EVALUATE' || detail.order.orderStatus==='COMPLETELY')">
                        <el-card class="box-card" v-if="logistic.number">
                            <div class="title">{{ type==2 && detail.refundOrder&&detail.refundOrder.refundStatus ==='PRE_PLAT_RECEIVE'? '买家退货物流信息': "物流信息" }}</div>
                            <el-form label-width="100px" :model="logisticUpdate" ref="logisticUpdate">
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item label="快递名称：">
                                            {{ logistic.companyName | formatLogisticsName }}
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="快递单号：">
                                            {{ logistic.number }}
                                        </el-form-item>
                                    </el-col>
                                    <template v-if="type==1">
                                        <el-col :span="6" v-permission="'orderListGoodsLogistic'" v-if="detail.order.orderStatus==='PRE_STOCK' || detail.order.orderStatus==='PRE_RECEVICE'&& !fromChat">
                                            <el-form-item label="" label-width="0">
                                                <el-button v-permission="'orderListGoodsLogistic'" :size="$size" type="primary" @click="updateNoFn()">修改</el-button>
                                            </el-form-item>
                                        </el-col>
                                    </template>
                                </el-row>
                            </el-form>
                            <el-row class="way-info" v-if="logistic.list && logistic.list.length>0">
                                <el-col class="logistic" :span="24" v-for="(item, index) in logistic.list" :key="index" :class="index==0? 'new-logistic': ''">
                                    <span></span>{{ item.time | formatTime }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.location }}
                                    <i v-if="index==0">最新</i>
                                </el-col>
                            </el-row>
                        </el-card>
                    </template>
                    <!-- 售后信息 -->
                    <el-card class="box-card" v-if="(type==2)|| (close && status=='2')">
                        <div class="title">售后信息</div>
                        <el-row>
                            <el-col :span="24">子单ID：{{ detail.refundOrder.goodsId }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">申请项：{{ detail.refundOrder.refundType | formatRefundType }}</el-col>
                            <el-col :span="18">退款申请时间：{{ detail.refundOrder.createdAt | formatTime }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">退货退款原因：{{ detail.refundOrder.refundReason }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">退货退款说明：{{ detail.refundOrder.refundMessage || '无' }}</el-col>
                        </el-row>
                        <el-row v-if="detail.refundOrder.refundPic">
                            <el-col :span="2">图片描述：</el-col>
                            <el-col :span="22">
                                <image-list v-for="(item, index) in JSON.parse(detail.refundOrder.refundPic)" 
                                            :url="item.refundPic"
                                            :type="item.refundVideo? 'video': 'image'"
                                            :videoUrl="item.refundPic? item.refundVideo+'?type=video': ''"
                                            :key="index"></image-list>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col v-if="type===2 || type===3">审核结果：{{ detail.refundOrder.refundStatus | formatRefundStatus }}</el-col>
                            <el-col v-else-if="type===4 || type === 5">售后状态：已完成</el-col>
                        </el-row>
                        <el-row v-if="detail.refundOrder.refundStatus==='REFUSED'">
                            <el-col>未通过原因：{{ detail.refundOrder.remark || '无' }}</el-col>
                        </el-row>
                    </el-card>
                </div>
                <div class="btn-group" v-if='!fromChat'>
                    <el-button :size="$size" @click="back">返回</el-button>
                    <el-button v-if="detail.order.orderStatus == 'PRE_PAY' && !close && activeName!=='BIG_GOODS'" :size="$size" type="primary" @click="modifyPriceDetail()">修改运费</el-button>
                    <el-button v-if="detail.order.orderStatus == 'PRE_SHIP' && type != 2 && !close && activeName!=='BIG_GOODS'" :size="$size" type="primary" @click="deliveryGoods">发货</el-button>
                    <el-button v-if="detail.order.orderStatus == 'PRE_SHIP' && type != 2 && !close && activeName==='BIG_GOODS'" :size="$size" type="primary" @click="finishTrade()">完成交易</el-button>
                    
                    <el-button v-if="detail.refundOrder&&detail.refundOrder.refundStatus=='APPLY' && !close && activeName!=='BIG_GOODS'" :size="$size" type="primary" @click="examineOrderList">审核</el-button>
                    <el-button v-if="detail.refundOrder&&detail.refundOrder.refundStatus=='PRE_REFUND' && !close && sale && activeName!=='BIG_GOODS'" :size="$size" type="primary" @click="backMoney(id)">确认退款</el-button>
                    <el-button v-if="detail.refundOrder&&detail.refundOrder.refundStatus=='PRE_PLAT_RECEIVE' && !close && activeName!=='BIG_GOODS'" :size="$size" type="primary" @click="getGoods()">确认收货</el-button>
                </div>
                <div class="btn-group" v-else>
                    <el-button :size="$size" @click="$router.go(-1)">返回</el-button>
                </div>

                <!-- 修改运费 -->
                <confirm-modify-logistics-price :visible.sync="modifyPriceVisible" :detail="detailPoee" ref="checkModifyPrice">
                    <div class="btn-group">
                        <el-button :size="$size" @click="modifyPriceVisible=false">取消</el-button>
                        <el-button :size="$size" type="primary" @click="modifyPrice()" :loading="loadingConfirm">确定</el-button>
                    </div>
                </confirm-modify-logistics-price>
                <examine-order :detail="detailExamine" :visible.sync="examineVisible" ref="checkFormOrder">
                    <template>
                        <div class="btn-group">
                            <el-button :size="$size" @click="examineVisible=false">取消</el-button>
                            <el-button :size="$size" type="primary" @click="examineConfirm()">确定</el-button>
                        </div>
                    </template> 
                </examine-order>
                <!-- 确认发货 -->
                <ConfirmSendLogisitics :detailsSend="detailsSend" :visible.sync="deliveryDialog" ref="checkForm">
                    <template>
                        <div class="btn-group">
                            <el-button :size="$size" @click="deliveryDialog=false">取消</el-button>
                            <el-button :size="$size" type="primary" @click="sendLogisitics()" :loading="loadingSendGoods">下一步</el-button>
                        </div>
                    </template>
                </ConfirmSendLogisitics>
            </div>
        </div>

        <!-- 确认收货 -->
        <confirm-get-goods :detail="getGoodsDetail" :visible.sync="getGoodsDetailVisible">
            <div class="btn-group">
                <el-button :size="$size" @click="getGoodsDetailVisible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="_ConfirmGetGoods">确定</el-button>
            </div>
        </confirm-get-goods>
        <!-- 预览推广模板 -->
        <el-dialog title="预览推广模板" :visible.sync="previewSpredTemplateVisible" width="415px" append-to-body>
            <div class="iframWebPage">
                <!-- <iframe :src="spredTemplateUrl" frameborder="0"></iframe> -->
                <iframe v-if="spredTemplateUrl.url" :src="spredTemplateUrl.url" frameborder="0"></iframe>
                <div class="h5-prview" v-else v-html="spredTemplateUrl.text"></div>
            </div>
        </el-dialog>
        <!-- 选择骑手 -->
        <rider :riderDialog.sync="riderDialog" :logisticsInfo="logisticsInfo" :orderId="orderId" :weight="goodsWeight" xkModule="mall"></rider>

        <!-- 大宗商品完成交易 -->
        <complete-trade :visible.sync="tradeVisible" :orderId="orderId"></complete-trade>

        <!-- 修改物流信息 -->
        <update-logistic-no :visible.sync="updateVisible" type="mall" :orderId="orderId" :goodsWeight="goodsWeight"></update-logistic-no>
    </div>
</template>

<script>
    import  { enumFormatter } from '@/util/publicMehotds.js';
    import Rider from "@/components/goods/Rider.vue"
    import ConfirmModifyLogisticsPrice from "@/components/goods/ConfirmModifyLogisticsPrice.vue"
    import ConfirmSendLogisitics from "@/components/goods/ConfirmSendLogisitics.vue";
    import ConfirmGetGoods from '@/components/goods/ConfirmGetGoods.vue';
    import ExamineOrder from "@/components/goods/ExamineOrder.vue";
    import ImageList from '@/components/common/ImageList.vue';
    import UpdateLogisticNo from '@/components/common/UpdateLogisticNo.vue';
    import { 
        EnumOrderStatus,
        EnumLogisticsName,
        EnumRefundType, 
        EnumRefundStatus,
        EnumRefundUserStatus, 
        EnumPayWay, 
        EnumRefundOrderStatus } from '@/util/publicParams.js';
    import CompleteTrade from '@/components/goods/CompleteTrade.vue';

    //正常订单退货订单
    const EnumNormalRefund = [
        { key: 'APPLY', value: '已申请' },
        { key: 'REFUSED', value: '未通过' },
        { key: 'PRE_USER_SHIP', value: '待用户发货' },
        { key: 'PRE_PLAT_RECEIVE', value: '待平台收货' },
        { key: 'PRE_REFUND', value: '待平台退款' },
        { key: 'REFUNDING', value: '退款中' },
        { key: 'COMPLETE', value: '退款完成' },
    ]
    let goodsCategroy = null;
    export default {
        components: {
            ConfirmModifyLogisticsPrice,
            ConfirmSendLogisitics,
            ExamineOrder,
            ConfirmGetGoods,
            Rider,
            ImageList,
            CompleteTrade,
            UpdateLogisticNo
        },
        data () {
            return {
                EnumOrderStatus,
                EnumNormalRefund,
                loadingSendGoods: false,
                examineVisible: false,
                dialogVisible: false,
                modifyPriceVisible: false,  //修改运费
                loadingConfirm: false,   //修改运费
                confirmGoods: false,  //确认发货
                logisticsForm: {},  //确认发货
                examine: '',
                previewSpredTemplateVisible: false,
                spredTemplateUrl: {},
                type: "",
                orderId: '',//订单ID
                id: '',   //售后订单ID
                userId: '',   //用户ID
                sale: false, //售后状态
                refundType: null,
                status: '',
                logisticsFormRules: {
                    name: [
                        { required: true, message: '不能为空', trigger: "blur"}
                    ],
                    orderId: [
                        { required: true, message: '不能为空', trigger: "blur"}
                    ]
                },
                detail:{
                    order: {},
                    refundOrder: {},
                    user: {},
                    goods: {},
                    address: {}
                },
                deliveryDialog: false,
                detailsSend: {
                    goods: {},
                    order: {},
                    user: {},
                    address: {}
                },
                detailPoee:{},
                verifyForm: {},  //审核
                detailExamine: {},
                logistic: {},

                getGoodsDetailVisible: false,    //确认收货
                getGoodsDetail: {},
                close: "",
                riderDialog: false,
                logisticsInfo: {}, // 骑手需要携带的物流信息
                goodsWeight: 0,
                tradeVisible: false,      //大宗商品
                activeName: "",      //GOODS普通商品  BIG_GOODS大宗商品
                updateNo: true,       //
                logisticUpdate: {},
                updateVisible: false,
                fromChat:false
            }
        },
        created() {
            this.getCategory();
            this.type = this.$route.query.type?parseInt(this.$route.query.type):1;
            this.orderId = this.$route.query.orderId;
            this.id = this.$route.query.id;
            this.userId = this.$route.query.userId;
            this.status = this.$route.query.status;
            this.sale= this.$route.query.sale? true: false;
            this.close = this.$route.query.close? true: false;
            this.refundType = this.$route.query.refundType;
            this.activeName = this.$route.query.activeName;
            this.fromChat = this.$route.query.from=='chat';
        },
        methods: {
            //获取商品分类
            getCategory() {
                this.$http.get(this.$api.queryList, {}, true).then(res=> {
                    goodsCategroy = this.flatten(res);
                    this.getDetail();
                }).catch(err=> {
                    this.$message.error(err.message);
                    this.getDetail();
                })
            },
             //扁平化数组
            flatten(arr){
                var res = [];
                for(var i=0;i<arr.length;i++){
                    if(Array.isArray(arr[i].children)){
                        res = res.concat(this.flatten(arr[i].children));
                    }else{
                        res.push(arr[i]);
                    }
                }
                return res;
            },
            //获取详情
            getDetail() {
                let params = {
                    orderId: this.orderId
                }
                this.id? params.refundId = this.id: "";
                this.$http.get(this.$api.mallOrderDetail, params, true).then(res=>{
                    console.log(res)
                    if(Array.isArray(res.refundOrder)) {
                        res.refundOrder = res.refundOrder[0];
                    }
                    this.detail = res;
                    this.goodsWeight = res.order.weight;
                    //获取物流信息
                    if(this.detail.refundOrder&&this.detail.refundOrder.refundStatus =='PRE_PLAT_RECEIVE' && this.type==2){
                        this.getLogisticsQuery(true)
                    }else if(this.type != 2){
                        this.detail.order.orderStatus=='COMPLETELY' || this.detail.order.orderStatus == 'PRE_RECEVICE' || this.detail.order.orderStatus === 'PRE_EVALUATE'? this.getLogisticsQuery(): null;
                    }
                    
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //打开审核弹框
            examineOrderList() {
                this.detailExamine = {};
                this.$http.get(this.$api.mallOrderAuditDetail, {refundId: this.id}, true).then(res=>{
                    let goodsName = [],
                        refundPic = [];
                    res.refundByRefundId.forEach((item, index)=>{
                        goodsName.push(item.goodsName);
                        if(index==0) {
                            item.refundPic?refundPic.push(...item.refundEvidence): null
                        }
                    })
                    res.refundByRefundId[0].goodsName = goodsName;
                    res.refundByRefundId[0].refundPic = refundPic;
                    this.detailExamine = res.refundByRefundId[0];

                    this.examineVisible = true;
                    this.getDetail();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //审核订单
            examineConfirm() {
                this.$refs['checkFormOrder'].validate((params,url) => {
                    if(params) {
                        params.refundId = this.id;
                        this.$http.post(url, params, true).then(res=>{
                            this.getDetail();
                            this.$message.success('审核成功');
                            this.examineVisible = false;
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }else{
                        console.log('验证失败')
                    }
                })
            },
            back() {
                switch(this.type) {
                    case 1:
                        this.$router.push("/orderListGoods");
                        break;
                    case 2:
                        this.$router.push("/orderListAfterSale");
                        break;
                    case 3:
                        this.$router.push({ path: "/closeGoodsList"});
                        break;
                    case 100: // 其余页面
                        this.$router.go(-1);
                        break;
                }
            },
            //修改运费页面详情，打开运费模态框
            modifyPriceDetail() {
                this.$http.get(this.$api.mallOrderUpdatePostFeeDetail, {orderId: this.orderId}, true).then(res=>{
                    this.detailPoee = res;
                    this.modifyPriceVisible=true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //修改邮费
            modifyPrice() {
                this.$refs['checkModifyPrice'].validate(params=>{
                    if(params) {
                        this.loadingConfirm = true;
                        this.$http.post(this.$api.mallOrderUpdatePostFee, params, true).then(res=>{
                            this.loadingConfirm = false;
                            this.updateTransPrice = false;
                            this.modifyPriceVisible = false;
                            this.getDetail();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                            this.loadingConfirm = false;
                        })
                    }else{
                        return false;
                    }
                })
            },
            // 发货
            deliveryGoods() {
                this.detail.orderId = this.orderId;
                this.detailsSend = this.detail;
                this.deliveryDialog = true;
            },
            //确定发货
            sendLogisitics() {
                this.$refs['checkForm'].validate(params=>{
                    if(params) {
                        this.loadingSendGoods = true;
                        params.userId = this.userId;
                        if(params.logisticsName === 'XK') { // 晓可物流去选择骑手
                           this.loadingSendGoods = false;
                           this.riderDialog = true;
                           this.logisticsInfo = JSON.parse(JSON.stringify(params)) // 物理信息
                        } else { // 第三方物流
                                this.$http.post(this.$api.mallOrderConfirmShipping, params, true).then(res=>{
                                this.deliveryDialog = false;
                                this.loadingSendGoods = false;
                                this.getDetail();
                            })
                            .catch(err=>{
                                this.loadingSendGoods = false;
                                this.$message.error(err.message);
                            })
                        }
                    }else{
                        return false;
                    }
                });
            },
            //获取物流信息
            getLogisticsQuery(type) {
                /**
                 * @param orderType          NORMAL：正常订单     REFUND：退款订单
                 * @param logisticsType      PLATFORM：平台       USER：用户
                 * @param XkModule           jf_mall：积分商城    mall：自营商城
                 * @param orderId            订单号ID（正常、退货）
                 */
                let params = {
                    orderId: this.orderId,
                    logisticsType: type? 'USER':'PLATFORM',
                    xkModule: 'mall',
                    orderType: this.type==1 || this.type==2 && this.detail.refundOrder.refundStatus == 'PRE_PLAT_RECEIVE'? 'NORMAL': 'REFUND'
                }
                type? (params.orderType = 'REFUND', params.orderId = this.id): null;
                this.$http.get(this.$api.logisticsQuery, params, true).then(res=>{
                    res? this.logistic = res: null;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //预览H5页面
            viewTmp(url, item) {
                if(url){
                    this.previewSpredTemplateVisible = true
                    this.spredTemplateUrl = {
                        url: url,
                        text: ''
                    } 
                }
                else{
                    this.previewSpredTemplateVisible = true;
                    this.spredTemplateUrl = {
                        url: "",
                        text: item.info
                    }
                }
            },
            //退货详情
            getGoods() {
                this.getGoodsDetail = {};
                this.$http.get(this.$api.mallOrderMoneyDetail, {refundId: this.id}, true).then(res=>{
                    console.log(res)
                    let goodsName = [],
                        refundPic = [];
                    res.SRefundVO.forEach(item=>{
                        goodsName.push(item.goodsName);
                        item.refundPic?refundPic.push(...JSON.parse(item.refundPic)): null
                    })
                    res.SRefundVO[0].goodsName = goodsName;
                    res.SRefundVO[0].refundPic = refundPic;
                    this.verifyForm = res.SRefundVO[0];

                    this.getGoodsDetail = Object.assign(res.SRefundVO[0], {logisticsName: res.logisticsName, logisticsNo: res.logisticsNo});

                    this.getGoodsDetailVisible = true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //确认退货详情
            _ConfirmGetGoods() {
                this.$http.post(this.$api.mallOrderConfirmReceive, { refundId: this.id,userId: this.userId }, true).then(res=>{
                    this.getGoodsDetailVisible = false;
                    this.$message.success('确认收货成功');
                    this.getDetail();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
             //确认退款
            backMoney(id) {
                this.$confirm('确定对该订单执行退款吗？退款将按原支付方式及账户退回！', '退款', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(()=>{
                    this.$http.post(this.$api.mallOrderConfirmRefund, {refundId: id, userId: this.userId}, true).then(res=>{
                        this.verifyVisible = false;
                        this.getDetail();
                        this.$message.success('退款成功');
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }).catch(()=>{});
            },
            //大宗商品完成交易
            finishTrade() {
                this.tradeVisible = true;
            },
            //修改保存物流信息
            updateNoFn() {
                this.updateVisible = true;
            }
        },
        filters: {
            formatOrderStatus(val) {
                return enumFormatter(val, EnumOrderStatus);
            },
            formatRefundOrderStatus(val) {
                return enumFormatter(val, EnumRefundOrderStatus);
            },
            formatCategory(val) {
                return enumFormatter(val, goodsCategroy, {key: 'code', value: 'name'});
            },
            formatLogisticsName(val) {
                return enumFormatter(val, EnumLogisticsName);
            },
            formatRefundType(val) {
                return enumFormatter(val, EnumRefundType);
            },
            //审核状态
            formatRefundStatus(val) {
                return enumFormatter(val, EnumRefundStatus);
            },
            //用户发货状态
            formatEnumRefundUserStatus(val) {
                return enumFormatter(val, EnumRefundUserStatus);
            },
            formatTicket(val) {
                return enumFormatter(val, EnumPayWay.concat([{key: 'online', value: '线上支付'}, {key: 'offline', value: '线下支付'}]));
            },
            //
            formatNormal(val) {
                return enumFormatter(val, EnumNormalRefund)
            }
        },
        watch: {
            modifyPriceVisible(val) {
                !val? this.getDetail():"";
            },
            deliveryDialog(val) {
                !val?this.getDetail() :"";
            },
             riderDialog(val) {
                !val? this.deliveryDialog = false : null
            },
            tradeVisible(val) {
                !val? this.getDetail(): null;
            },
            updateVisible(val) {
                !val? this.getDetail() : null;
            }
        }
    }
</script>
<style lang="scss" scoped src="./orderListAfterSaleDetail.scss"></style>
