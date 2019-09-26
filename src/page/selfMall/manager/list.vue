<template>
    <div class="xk-container selfmall-manager-list">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="普通商品" name="GOODS"></el-tab-pane>
                <el-tab-pane label="大宗商品" name="BIG_GOODS"></el-tab-pane>
            </el-tabs>
            <el-form :model="ruleForm" :label-width="labelWidth" class="xk-search" @keyup.enter.native="searchList">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="订单ID：">
                            <el-input v-model.trim="ruleForm.orderId" placeholder="请输入订单ID" :size="$size"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户手机号：">
                            <el-input v-model.trim="ruleForm.phone" placeholder="请输入用户手机号" :size="$size"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input v-model.trim="ruleForm.sGoodsId" placeholder="请输入商品ID" :size="$size"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="支付方式：">
                            <el-select v-model.trim="ruleForm.payChannel" :size="$size">
                                <el-option v-for="(item, index) in EnumPayWay" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下单日期：">
                            <el-date-picker
                                v-model="ruleForm.timeRange"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :size="$size"
                                align="right">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单状态：">
                            <el-select 
                                :size="$size"
                                v-model="ruleForm.orderStatus">
                                <el-option v-for="(item,index) in EnumOrderStatus" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户类型：">
                            <el-select v-model="ruleForm.userType" placeholder="全部分类" :size="$size">
                                <el-option v-for="item in EnumUserType" :key="item.value" :label="item.value" :value="item.key">{{ item.value }}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button v-if="activeName!=='BIG_GOODS'" v-permission="'orderListGoodsOut'" :size="$size" type="success" @click="visibleOrder=true">导出订单</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                v-loading="loadingTable"
                border
                :data="tableData">
                <el-table-column
                    prop="orderId"
                    label="订单ID">
                </el-table-column>
                <el-table-column
                    width="200"
                    label="下单日期">
                    <template slot-scope="scope">
                        {{ scope.row.orderTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" width="160" label="用户手机号">
                </el-table-column>
                <el-table-column width="130" label="用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.userType ==='user'? '普通用户': '商户' }}
                    </template>
                </el-table-column>
                <el-table-column width="130" label="支付方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payChannelIn">
                            {{ scope.row.payChannelIn  | formatTicket}}
                        </span>
                        <div v-else>
                            <span class="xk-danger"></span>
                            <p v-for="(item, index) in JSON.parse(scope.row.payChannel)" :key="index">
                                {{ item.payChannel | formatTicket }}
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="130" :formatter="formatterOrderStatus" label="订单状态"></el-table-column>
                <template v-if="activeName==='GOODS'">
                    <el-table-column
                        width="130"
                        label="是否开发票">
                        <template slot-scope="scope">
                            {{ scope.row.isNeedInvoice === '0'? '否': '是' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="totalPrice"
                        width="200"
                        label="订单实付总金额">
                        <template slot-scope="scope">
                            <p v-for="(item, index) in JSON.parse(scope.row.payChannel)" :key="index">
                                <template v-if="/alipay|wxpay|tfAlipay|tfWxpay|applePay/g.test(scope.row.payChannel)">
                                    <span v-if="item.payChannel=='alipay' || item.payChannel=='wxpay' ||item.payChannel=='tfAlipay' ||item.payChannel=='tfWxpay' ||item.payChannel=='applePay' ">{{ $math.divide(scope.row.rmbPrice, 100).toFixed(2)+'  元' }}</span>
                                    <span v-else>
                                        {{ $math.divide(scope.row.voucherPrice, 100).toFixed(2) +'  ' }}{{ item.payChannel | formatTicket }}
                                    </span> 
                                </template>
                                <template v-else>
                                    {{ $math.divide(item.amount, 100).toFixed(2) +'  ' }}{{ item.payChannel | formatTicket }}
                                </template>
                            </p>
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                        width="130"
                        label="预约金">
                        <template slot-scope="scope">
                            <p v-for="(item, index) in JSON.parse(scope.row.payChannel)" :key="index">
                                <template v-if="/alipay|wxpay|tfAlipay|tfWxpay|applePay/g.test(scope.row.payChannel)">
                                    <span v-if="item.payChannel=='alipay' || item.payChannel=='wxpay' ||item.payChannel=='tfAlipay' ||item.payChannel=='tfWxpay' ||item.payChannel=='applePay' ">{{ $math.divide(scope.row.rmbPrice, 100).toFixed(2)+'  元' }}</span>
                                    <span v-else>
                                        <template v-if="item.payChannel!=='offline'&&item.payChannel!=='online'">
                                            {{ $math.divide(scope.row.voucherPrice, 100).toFixed(2) +'  ' }}{{ item.payChannel | formatTicket }}
                                        </template>
                                    </span> 
                                </template>
                                <template v-else>
                                    <span v-if="item.payChannel!=='offline'&&item.payChannel!=='online'">
                                        {{ $math.divide(item.amount, 100).toFixed(2) +'  ' }}{{ item.payChannel | formatTicket }}
                                    </span>
                                </template>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="130"
                        label="交易价格">
                        <template slot-scope="scope">
                            {{ scope.row.tradePrice? $math.divide(scope.row.tradePrice, 100).toFixed(2): '' }}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column fixed="right" width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="activeName === 'GOODS' ? 'orderListGoodsDetail':'orderListBigGoodsDetail'" :size="$size" type="text" @click="viewDetails(scope.row)">查看详情</el-button>
                        <template v-if="activeName==='GOODS'">
                            <el-button v-permission="'orderListGoodsModify'" :size="$size" v-if="scope.row.orderStatus==='PRE_PAY'" :loading="scope.row.loadingUpdate" type="text" @click="updatePrice(scope.row)">修改运费</el-button>
                            <el-button v-permission="'orderListGoodsSend'" :size="$size" v-if="scope.row.orderStatus==='PRE_SHIP'" :loading="scope.row.loadingSend" type="text"  @click="deliveryGoods(scope.row)">发货</el-button>
                        </template>
                        <el-button v-permission="'orderListGoodsDazong'" v-if="activeName==='BIG_GOODS' && scope.row.orderStatus==='PRE_SHIP'" :size="$size" type="text" @click="finishTrade(scope.row)">完成交易</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <!-- 修改运费 -->
        <confirm-modify-logistics-price :visible.sync="updateTransPrice" :detail="detail" ref="checkModifyPrice">
            <div class="btn-group">
                <el-button :size="$size" @click="updateTransPrice=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="modifyPrice()" :loading="loadingConfirm" :disabled="loadingConfirm">确定</el-button>
            </div>
        </confirm-modify-logistics-price>
        <!-- 发货 -->
        <ConfirmSendLogisitics :visible.sync="deliveryDialog" :detailsSend="detailsSend" ref="checkForm">
            <template>
                <div class="btn-group">
                    <el-button :size="$size" @click="deliveryDialog=false">取消</el-button>
                    <el-button :size="$size" type="primary" @click="sendLogisitics()" :loading="loadingSendGoods" >下一步</el-button>
                </div>
            </template>
        </ConfirmSendLogisitics>
        <!-- 选择骑手 -->
        <rider :riderDialog.sync="riderDialog" :orderId="orderId" :weight="goodsWeight" xkModule="mall"></rider>

        <!-- 订单导出功能 -->
        <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>

        <!-- 完成交易 -->
        <complete-trade :visible.sync="tradeVisible" :orderId="orderId"></complete-trade>
    </div>
</template>
<script>
    //枚举用户类型
    const EnumUserType = [{key: '', value: '全部'},{key: 'user', value: '普通用户'},{key: 'muser', value: '商户'}];
    //枚举订单状态
    const EnumOrderStatus = [{key: '', value: '全部'},{key: 'PRE_PAY', value: '待支付'},{key: 'PRE_SHIP', value: '待配送'},{key: 'PRE_RECEVICE', value: '待收货'},{key: 'PRE_EVALUATE', value: '待评价'},{key: 'COMPLETELY', value: '已完成'}, {key: 'PRE_STOCK', value: '备货中'}]
    const EnumPayWay = [{ key: '', value: '全部' },{ key: 'xfq', value: '消费券' },{ key: 'swq', value: '实物券' },{ key: 'rmb', value: '人民币' }];

    import ConfirmModifyLogisticsPrice from "@/components/goods/ConfirmModifyLogisticsPrice.vue";
    import ConfirmSendLogisitics from "@/components/goods/ConfirmSendLogisitics.vue";
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import  { EnumTicketType } from '@/util/publicParams.js';
    import  { enumFormatter, assembleParams } from '@/util/publicMehotds.js';
    import Rider from "@/components/goods/Rider.vue" ;
    import XkFormItem from '@/components/common/XKFormItem.vue';
    import OrderOut from '@/components/common/OrderOut.vue';
    import CompleteTrade from '@/components/goods/CompleteTrade.vue';
    export default {
        components: {
            ConfirmModifyLogisticsPrice,
            ConfirmSendLogisitics,
            XkFormItem,
            Rider,
            OrderOut,
            CompleteTrade
        },
        data() {
            const checkLimit = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为0或者不能为空！'))
                }
                if(!/^[1-9]\d*/.test(value)) {
                    return call(new Error('必须为正整数'))
                }
                if(Number(value)>100){
                    return call(new Error('不能大于100'))
                }
                call();
            }
            return {
                activeName: 'GOODS',
                EnumUserType,
                EnumOrderStatus,
                EnumPayWay,
                loadingSearch: false,
                updateTransPrice: false,
                deliveryDialog: false,
                loadingConfirm: false,   //修改运费loading
                loadingSendGoods: false,  //发送货物
                loadingTable: false,
                visibleOrder: false,   //订单导出
                loadingDown: false,
                listStatus:[],
                labelWidth: '100px',
                ruleForm: {},
                orderForm: {},
                pickerOptions: {
                    shortcuts: [{
                        text: '最近三天',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tableData:[],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                detail: {},
                detailsSend: {
                    goods: {},
                    order: {},
                    user: {},
                    address: {}
                },
                riderDialog: false,
                orderId: '',
                goodsWeight: 0,    //商品重量
                orderRule: {
                    limit: [
                        { required: true, validator: checkLimit, trigger: 'blur' }
                    ]
                },
                /**
                 * 大宗商品
                 */
                tradeVisible: false
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallManager.searchCondition
            })
        },
        created() {
            this.searchData? (this.page=this.searchData.page,this.ruleForm = this.searchData.searchForm, this.activeName=this.searchData.activeName): null;
            this.getList();
        },
        watch: {
            deliveryDialog(val) {
                !val?this.getList() :"";
            },
             riderDialog(val) {
                !val? this.deliveryDialog = false : ""
            }
        },
        methods: {
            ...mapMutations({
                setSearchCondition: "selfMallManager/setSearchCondition"
            }),
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            viewDetails(row) {
                this.$router.push({path:'/orderListAfterSaleDetail',query:{type:1,orderId: row.orderId, activeName: this.activeName}});
            },
            //修改运费
            updatePrice(row) {
                this.$set(row, 'loadingUpdate', true);
                this.$http.get(this.$api.mallOrderUpdatePostFeeDetail, {orderId: row.orderId}, true).then(res=>{
                    this.detail = res;
                    this.$set(row, 'loadingUpdate', false);
                    this.updateTransPrice = true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'loadingUpdate', false);
                })
            },
            //发货，并打开发货弹窗
            deliveryGoods(row) {
                this.$set(row, 'loadingSend', true);
                this.$http.get(this.$api.mallOrderDetail, {orderId: row.orderId}, true).then(res=>{
                    console.log(res)
                    res.orderId = row.orderId;
                    this.detailsSend = res;
                    this.$set(row, 'loadingSend', false);
                    this.deliveryDialog = true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'loadingSend', false);
                })
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
                           this.orderId = this.detailsSend.orderId;
                           this.goodsWeight = this.detailsSend.order.weight
                        } else { // 第三方物流
                            this.$http.post(this.$api.mallOrderConfirmShipping, params, true).then(res=>{
                                this.deliveryDialog = false;
                                this.loadingSendGoods = false;
                                this.getList();
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
            //修改邮费
            modifyPrice() {
                this.$refs['checkModifyPrice'].validate(params=>{
                    if(params) {
                        this.loadingConfirm = true;
                        this.$http.post(this.$api.mallOrderUpdatePostFee, params, true).then(res=>{
                            this.loadingConfirm = false;
                            this.updateTransPrice = false;
                            this.getList();
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
            searchList() {
                this.loadingSearch = true;
                this.page.page = 1;
                this.getList();
            },
            //清空列表
            clearCondition(){
                this.ruleForm = {};
                this.setSearchCondition(null);
                this.getList();
            },
            //获取列表
            getList() {
                let params = {
                    condition: {
                        goodsDivide: this.activeName
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.ruleForm.timeRange
                    ? (params.condition.timeStart = moment(this.ruleForm.timeRange[0]).format("X"), params.condition.timeEnd = moment(this.ruleForm.timeRange[1]).format("X"))
                    : "";
                this.ruleForm.userType? params.condition.userType = this.ruleForm.userType: "";
                this.ruleForm.payChannel? params.condition.payChannel = this.ruleForm.payChannel: "";
                this.ruleForm.orderStatus? params.condition.orderStatus = this.ruleForm.orderStatus: "";
                this.ruleForm.sGoodsId? params.condition.sGoodsId = this.ruleForm.sGoodsId: "";
                this.ruleForm.orderId? params.condition.orderId = this.ruleForm.orderId: "";
                this.ruleForm.phone? params.condition.phone = this.ruleForm.phone: "";
                this.loadingTable = true;
                console.log(JSON.stringify(params))
                this.$http.get(this.$api.mallOBMOrderQPage, params, true).then(res=>{
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    console.log(res)
                    this.setSearchCondition(Object.assign({searchForm: this.ruleForm}, {page: this.page}, {activeName: this.activeName}));
                    this.tableData = res?res.data: [];
                    this.page.total = res?res.total: 0;
                })
                .catch(err=>{
                    [this.loadingTable, this.loadingSearch, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error(err.message);
                })
            },
            formatterOrderStatus(row) {
                return enumFormatter(row?row.orderStatus: '', EnumOrderStatus)
            },
            downExcel(limit) {
                let params = {
                    condition: {
                        goodsDivide: 'GOODS'
                    },
                    page: this.page.page,
                    limit
                }
                this.ruleForm.timeRange
                    ? (params.condition.timeStart = moment(this.ruleForm.timeRange[0]).format("X"), params.condition.timeEnd = moment(this.ruleForm.timeRange[1]).format("X"))
                    : "";
                this.ruleForm.userType? params.condition.userType = this.ruleForm.userType: "";
                this.ruleForm.payChannel? params.condition.payChannel = this.ruleForm.payChannel: "";
                this.ruleForm.orderStatus? params.condition.orderStatus = this.ruleForm.orderStatus: "";
                this.ruleForm.sGoodsId? params.condition.sGoodsId = this.ruleForm.sGoodsId: "";
                this.ruleForm.orderId? params.condition.orderId = this.ruleForm.orderId: "";
                this.ruleForm.phone? params.condition.phone = this.ruleForm.phone: "";
                
                this.loadingDown = true;
                
                this.$http
                .downGet(this.$api.downloadMallOrderPage, params, true)
                .then(res=>{
                    this.loadingDown = false;
                    this.$message.success(res.message);
                })
                .catch(err=>{
                    this.loadingDown = false;
                    this.$message.error(err.message)
                })
            },
            /**
             * 大宗商品
             */
            finishTrade(row) {
                this.orderId = row.orderId;
                this.tradeVisible = true;
            },
            tabClick(e) {
                this.page.page = 1;
                this.searchForm = this.searchData.searchForm;
                this.getList();                
            }
        },
        filters: {
            formatTicket(val) {
                return enumFormatter(val, EnumTicketType.concat([{key: 'online', value: '线上'}, {key: 'offline', value: '线下'}]))
            }
        },
        watch: {
            tradeVisible(val) {
                !val? this.getList() :null
            }
        }
    }
</script>
<style lang="scss" scoped>
    .selfmall-manager-list {
        /deep/ .el-select,
        /deep/ .el-date-editor {
            width: 100%;
        }
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
