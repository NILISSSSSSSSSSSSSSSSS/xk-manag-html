<template>
    <div class="xk-container welfare-win-prize">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search('searchForm')" :loading="searchLoading">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-form :model="searchForm" ref="searchForm" label-width="120px" class=" demo-ruleForm xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="奖品名称：">
                            <el-input :size="$size" v-model.trim="searchForm.goodsName" placeholder="请输入奖品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="中奖ID：">
                            <el-input :size="$size" v-model.trim="searchForm.lotteryRecordId" placeholder="输入中奖ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开奖期数：">
                            <el-input  :size="$size" v-model="searchForm.currentNper" placeholder="请输入期数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户账号：">
                            <el-input :size="$size" v-model.trim="searchForm.userTel" placeholder="请输入用户账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品类型：">
                            <el-select :size="$size" v-model="searchForm.goodsType">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumPrizeType" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品用途：">
                            <el-select :size="$size" v-model="searchForm.awardUsage">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumUsage" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="选择日期：">
                            <el-date-picker
                                :size="$size"
                                v-model="searchForm.timeRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发货状态：">
                            <el-select :size="$size" v-model="searchForm.goodsState" placeholder="请选择">
                                <el-option v-for="(item, index) in EnumDeliverStatus" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格数据-->
        <div class="xk-radius marintop20">
            <!--表格标题-->
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-table
                :data="tableData"
                v-loading="tableLoading">
                <el-table-column label="中奖ID" prop="id" width="120"></el-table-column>
                <el-table-column label="奖品类型" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.goodsType | formatPrize }}
                    </template>
                </el-table-column>
                <el-table-column label="订单ID" prop="orderId" width="160"></el-table-column>
                <el-table-column label="奖品名称" prop="goodsName" show-overflow-tooltip></el-table-column>
                <el-table-column label="奖品用途" width="120" :formatter="formatUsage"></el-table-column>
                <el-table-column label="用户账号" prop="userTel"></el-table-column>
                <el-table-column label="期号" prop="termNumber" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="currentNper" label="期数" width="120"></el-table-column>
                <el-table-column label="订单状态" width="120" :formatter="formatDeliverStatus"></el-table-column>
                <el-table-column label="是否需要分享" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.goodsShare ==1 ? '需要': '不需要'}}
                    </template>
                </el-table-column>
                <el-table-column label="中奖时间" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdAt | formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button class="xk-danger" v-permission="'winPrizeSend'" :disabled="scope.row.jGoodsShare=='NOT_SHARE' || scope.row.goodsType=='virtual'? true: false" v-if="scope.row.goodsState === 'NOT_DELIVERY'" :size="$size" type="text" @click="sendGoods(scope.row)" >发货</el-button>
                        <el-button class="xk-success" v-permission="'winPrizeDetail'" :size="$size" type="text" @click="viewDetail(scope.row)">订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>

            <!-- 福利抽奖确认发货 -->
            <confirm-send-logisitics :visible.sync="deliveryDialog" :detailsSend="detailsSend" ref="checkForm">
                <div class="btn-group">
                    <el-button :size="$size" @click="deliveryDialog=false">取消</el-button>
                    <el-button :size="$size" type="primary" @click="sendLogisitics()">确定</el-button>
                </div>
            </confirm-send-logisitics>
            <!-- 运营专用奖品模态框 -->
            <el-dialog title="确认发货" :visible.sync="expenseVisible" width="600px">
                <el-form :model="expenseForm" ref="expenseForm" label-width="150px" :rules="rules">
                    <el-form-item label="收货地址：">
                        <el-input :disabled="true" :size="$size" v-model="expenseForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <el-input :disabled="true" :size="$size" v-model="expenseForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="是否需要物流：">
                        <el-radio v-model="expenseForm.needLogistics" label="yes">需要物流</el-radio>
                        <el-radio v-model="expenseForm.needLogistics" label="no">不需要物流</el-radio>
                    </el-form-item>
                    <el-form-item label="物流选择：" v-if="expenseForm.needLogistics==='yes'" prop="logisticsName">
                        <el-select :size="$size" v-model="expenseForm.logisticsName" style="width: 100%">
                            <el-option v-for="(item, index) in EnumLogisticsName" :key="index" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物流单号：" v-if="expenseForm.logisticsName!='XK' && expenseForm.needLogistics!=='no'" prop="logisticsNo">
                        <el-input :size="$size" v-model.trim="expenseForm.logisticsNo"></el-input>
                    </el-form-item>
                </el-form>
                <p class="tips center">备注：（福利订单默认已填写，消费抽奖订单需客服电联客户后手动填写）</p>
                <div class="btn-group">
                    <el-button :size="$size" @click="expenseVisible=false">取消</el-button>
                    <el-button v-if="expenseForm.logisticsName!='XK'" :size="$size" type="primary" @click="sendExpenseLogistic()">确定</el-button>
                    <el-button v-else :size="$size" type="primary" @click="riderDialog=true">确定</el-button>
                </div>
            </el-dialog>
        </div>

        <rider :riderDialog.sync="riderDialog" :orderId="riderOrderId" :weight="goodsWeight" xkModule="jf_mall"></rider>
    </div>
</template>

<script>
    import { EnumPrizeType,EnumUsage,EnumLogisticsName } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import ConfirmSendLogisitics from "@/components/welfare/ConfirmSendLogisitics.vue";
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import Rider from '@/components/goods/Rider.vue';

    import { mapMutations, mapState } from 'vuex';
    
    import moment from 'moment';
    //枚举发货状态
    const EnumDeliverStatus = [{key: '', value: '全部'},{key: 'NOT_DELIVERY', value: '待发货'},{key: 'DELIVERY', value: '已发货'}];
    //枚举订单状态
    const EnumGoodsState = [{key: 'NOT_DELIVERY', value: '待发货'},{key: 'DELIVERY', value: '已发货'},{key: 'RECEVING', value: '已收货'},{key: 'CHANGED', value: '已换货'},{key: 'SHARE_LOTTERY', value: '已晒单'}, {key: 'WAIT_FOR_RECEVING', value: '等待接单'}, {key: 'NOT_SHARE', value: '待分享'}]
    
    export default {
        name: "winPrize",
        components: {
            ConfirmSendLogisitics,
            ProvinceCascader,
            Rider
        },
        data() {
            const checkLogistic = (rule, value, call) =>{
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!(/^\w+$/.test(value))) {
                    return call(new Error('格式不正确'))
                }
                if(value.length>=20) {
                    return call(new Error('快递单号过长，请核对！！'))
                }
                call();
            }
            return {
                EnumUsage,
                EnumPrizeType,
                EnumDeliverStatus,
                EnumLogisticsName,
                EnumGoodsState,
                searchLoading: false,
                tableLoading: false,
                
                searchForm: {},
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                tableData: [],

                deliveryDialog: false,   //发货dialog
                expenseVisible: false,    //运营专用奖品发货dialog,
                detailsSend: {   //福利抽奖
                    goods: {},
                    address: {},
                    order: {},
                    user: {},
                    js:{}
                },
                expenseForm: {
                    needLogistics: 'yes'
                },
                riderDialog: false,
                riderOrderId: '',
                goodsWeight: 0,       //商品重量
                rules: {
                    logisticsName: [ {required: true, message: '不能为空', trigger: 'change'} ],
                    logisticsNo: [{ required: true, validator: checkLogistic, trigger: 'blur' }]
                }
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfareWelfareOrder.searchFLList
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setFLList: "welfareWelfareOrder/setFLList"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                this.setFLList(null);
                this.page.page = 1;
                this.searchForm = {};
                this.getList();
            },
            getList() {
                let params = {
                    condition:{
                        timeStart: this.searchForm.timeRange? moment(this.searchForm.timeRange[0]).format('X'): '',
                        timeEnd: this.searchForm.timeRange? moment(this.searchForm.timeRange[1]).format('X'): ''
                    },
                    page:this.page.page,
                    limit: this.page.limit
                }
                this.searchForm.awardUsage? params.condition.awardUsage = this.searchForm.awardUsage: null;
                this.searchForm.lotteryRecordId? params.condition.lotteryRecordId = this.searchForm.lotteryRecordId: null;
                this.searchForm.goodsState? params.condition.goodsState = this.searchForm.goodsState: null;
                this.searchForm.userTel? params.condition.userTel = this.searchForm.userTel: null;
                this.searchForm.goodsName? params.condition.goodsName = this.searchForm.goodsName: null;
                this.searchForm.goodsType? params.condition.goodsType = this.searchForm.goodsType: null;
                this.searchForm.currentNper? params.condition.currentNper = this.searchForm.currentNper: null;
                this.searchForm.userType? params.condition.userType = this.searchForm.userType: null;
                this.tableLoading = true;
                this.$http.get(this.$api.jMallLotteryOrderQPage, params, true).then(res=>{
                    console.log(res)
                    this.setFLList(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableData = res?res.data: [];
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.$message.error(err.message)
                })
            },
            //发货弹窗和商品详情
            sendGoods(row) {
                if(row.awardUsage === 'welfare') {
                    //获取订单详情
                    this.$http.get(this.$api.jMallOBMOrderDetail, {orderId: row.orderId}, true).then(res=>{
                        this.goodsWeight = this.$math.divide(res.goods.weight, 1000);
                        this.deliveryDialog = true;
                        res.address.remark = res.order.remark;
                        this.detailsSend = res;
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }else{
                    //运营专用奖品发货
                    this.$http.get(this.$api.jLotteryOrderAddress, {jOrderId: row.orderId}, true).then(res=>{
                        this.riderOrderId = row.orderId;
                        if(res){
                            res.needLogistics = "yes";
                            this.expenseForm = res;
                        }
                        this.expenseVisible = true;
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }
            },
            // 确认发货
            sendLogisitics() {
                this.$refs['checkForm'].validate(params=>{
                    if(params) {
                        if(params.postType==='OWN') {
                            this.deliveryDialog = false;
                            this.riderOrderId = params.orderId;
                            this.riderDialog = true;
                        }else{
                            this.$http.post(this.$api.JOrderConfirmShipping, params, true).then(res=>{
                                this.$message.success('发货成功');
                                this.getList();
                                this.deliveryDialog = false;
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                            })
                        }
                    }else{
                        return false;
                    }
                })
                
            },
            //运营专用奖品发货
            sendExpenseLogistic() {
                this.$refs['expenseForm'].validate(v=>{
                    if(v) {
                        let params = {
                            orderId: this.expenseForm.orderId
                        }
                        if(this.expenseForm.needLogistics==='yes') {
                            params.logisticsName = this.expenseForm.logisticsName;
                            params.logisticsNo = this.expenseForm.logisticsNo;
                            params.postType = 'THIRD';
                        }else{
                            params.needLogistics = 'no';
                        }
                        console.log(params);
                        this.$http.post(this.$api.JOrderConfirmShipping, params, true)
                        .then(res=>{
                            this.expenseVisible = false;
                            this.expenseForm = {}
                            this.getList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }else{
                        return false;
                    }
                })
            },
            // 发货状态
            formatDeliverStatus(row) {
                return enumFormatter(row.goodsStateNew, EnumGoodsState)
            },
            //奖品用途
            formatUsage(row) {
                return enumFormatter(row.awardUsage, EnumUsage)
            },
            //查看订单详情
            viewDetail(row) {
                this.$router.push({
                    path: 'prizeDetails',
                    query: {
                        orderId: row.orderId
                    }
                })
            }
        },
        watch: {
            riderDialog(val) {
                !val? (this.expenseVisible = false, this.getList()): null;
            }
        },
        filters: {
            formatPrize(val) {
                return enumFormatter(val, EnumPrizeType)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './winPrize.scss';
</style>

