<template>
    <div class="xk-container selfmall-manager-salelist">
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
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search" @keyup.enter.native="search('searchForm')">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="售后订单ID：">
                            <el-input v-model.trim="searchForm.refundId" placeholder="请输入订单ID" :size="$size"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户类型：">
                            <el-select :size="$size" placeholder="请选择用户类型" v-model="searchForm.userType">
                                <el-option v-for="(item,index) in EnumUserType" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户手机号：">
                            <el-input placeholder="请输入用户手机号" :size="$size" v-model.trim="searchForm.phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请项：">
                            <el-select :size="$size" placeholder="请选择申请项" v-model="searchForm.refundType">
                                <el-option v-for="(item,index) in EnumRefundType" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核状态：">
                            <el-select :size="$size" placeholder="请选择审核状态" v-model="searchForm.auditStatus">
                                <el-option v-for="(item,index) in EnumAuditStatus" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间：">
                            <el-date-picker
                                v-model="searchForm.timeRange"
                                type="daterange"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :size="$size"
                                align="right">
                            </el-date-picker>
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
                    <!-- <el-button :size="$size" type="success">导出订单</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="dataTable" v-loading="tableLoading">
                <el-table-column prop="refundId" label="售后订单ID"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="用户手机号"></el-table-column>
                <el-table-column prop="refundType" label="申请项" :formatter="formatRefundType"></el-table-column>
                <!-- <el-table-column prop="auditStatus" label="审核状态" :formatter="formatAuditStatus"></el-table-column> -->
                <el-table-column prop="saleStatus" label="售后状态">
                    <template slot-scope="scope">
                        {{ scope.row.refundStatus | formatAuditStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" v-permission="'orderListAfterSaleVerify'" v-if="scope.row.refundStatus == 'APPLY'" @click="verifyOrder(scope.row.refundId, scope.row)" :loading="scope.row.verifyBtnLoading">审核</el-button>
                        <el-button :size="$size" type="text" v-permission="'orderListAfterSaleReceiving'" v-if="scope.row.refundStatus == 'PRE_PLAT_RECEIVE'" @click="confirmGoods(scope.row.refundId, scope.row)" :loading="scope.row.goodsBtnLoading">确认收货</el-button>
                        <!-- <el-button type="text" @click="confirmGoods(scope.row.refundId)">确认收货</el-button> -->
                        <el-button :size="$size" type="text" v-permission="'orderListAfterSaleConfirm'" v-if="scope.row.refundStatus == 'PRE_REFUND'" @click="backMoney(scope.row.refundId, scope.row.userId)">确认退款</el-button>
                        <el-button :size="$size" type="text" v-permission="'orderListAfterSaleDetail'" @click="viewDetail(scope.row.refundId, scope.row.orderId, scope.row.refundType,scope.row.userId)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>注：
                </div>
                <div class="vus-bottom"></div>
                <div style="font-size: 14px;line-height: 24px;color: #666;">
                    <p>1.待收货售后申请项：仅退款、退款退货、换货。</p>
                    <p>2.已收货售后申请项：退款退货（仅在确认收货七天内）、换货。</p>
                    <p>3.仅退款流程：申请-通过-退款-完成</p>
                    <p>4.退款退货流程：申请-通过-买家寄货-收到货物-退款-完成</p>
                    <p>5.换货流程：申请-通过-买家寄货-收到货物-卖家寄货-买家确认收货-完成</p>
                </div>
            </div>
        </div>
        <!-- 审核 -->
        <el-dialog title="确认收到以下退货商品" :visible.sync="verifyVisible" width="800px">
            <el-form :model="verifyForm" ref="verifyForm" label-width="150px">
                <el-form-item label="申请退货商品：">
                    <p v-for="(item, index) in verifyForm.goodsName" :key="index"><strong>商品{{index+1}}：</strong>{{ item }}</p>
                </el-form-item>
                <el-form-item label="退货原因：">
                    {{ verifyForm.refundReason }}
                </el-form-item>
                <el-form-item label="退货说明：">
                    {{ verifyForm.refundMessage?verifyForm.refundMessage:"无" }}
                </el-form-item>
                <el-form-item label="图片描述：" v-if="verifyForm.refundPic">
                    <image-list  v-for="(item, index) in verifyForm.refundPic" 
                                :url="item.refundPic"
                                :type="item.refundVideo? 'video': 'image'"
                                :videoUrl="item.refundVideo"
                                :key="index"></image-list>
                </el-form-item>
                <!-- 确认收货 -->
                <el-form-item label="物流名称：">{{ verifyForm.logisticsName | formatLogistics }}</el-form-item>
                <el-form-item label="物流单号：">{{ verifyForm.logisticsNo }}</el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="verifyVisible=false">取消</el-button>
                <el-button :size="$size" type="primary" :loading="verifyLoading" @click="submitVerify('verifyForm')">确定</el-button>
            </div>
        </el-dialog>

        <!-- 审核 -->
        <examine-order :detail="detailExamine" :visible.sync="examineVisible" ref="checkFormOrder">
            <template>
                <div class="btn-group">
                    <el-button :size="$size" @click="examineVisible=false">取消</el-button>
                    <el-button :size="$size" type="primary" @click="examineConfirm()">确定</el-button>
                </div>
            </template> 
        </examine-order>
    </div>
</template>
<script>
    //枚举申请项
    const EnumRefundType = [{key: '', value: '全部'},
                            {key: 'REFUND', value: '仅退款'},
                            {key: 'REFUND_GOODS', value: '退款退货'}];
    //枚举审核状态
    const EnumAuditStatus = [{key: '', value: '全部'},
                            {key: 'UNAUDITED', value: '待审核'},
                            {key: 'UNAPPROVED', value: '未通过'},
                            {key: 'VERIFIED', value: '已通过'}];
    //枚举用户类型
    const EnumUserType = [{key: '', value: '全部'},
                        {key: 'user', value: '用户'},
                        {key: 'muser', value: '商户'}];
    //售后状态
    const EnumRefundStatus = [{key: 'APPLY', value: '待审核'},
                              {key: 'REFUSED', value: '未通过'},
                              {key: 'PRE_REFUND', value: '待退款'},
                              {key: 'REFUNDING', value: '退款中'},
                              {key: 'PRE_USER_SHIP', value: '待发货'},
                              {key: 'PRE_PLAT_RECEIVE', value: '待收货'},
                              {key: 'COMPLETE', value: '已完成'}]
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex'
    
    import { EnumLogisticsName } from '@/util/publicParams.js';
    import  { enumFormatter } from '@/util/publicMehotds.js';
    import ConfirmGetGoods from '@/components/goods/ConfirmGetGoods.vue';
    import ExamineOrder from "@/components/goods/ExamineOrder.vue";
    import ImageList from '@/components/common/ImageList.vue';
    
    export default {
        components: {
            ConfirmGetGoods,
            ImageList,
            ExamineOrder
        },
        data() {
            const checkPhone = (rule, value, call)=>{
                if(!value){
                    return call(new Error('不能为空'))
                }
                if(!/^1\d{10}$/.test(value)){
                    return call(new Error('手机号格式不正确，请仔细核对！'))
                }
                call();
            }
            return {
                EnumRefundStatus,
                labelWidth: '100px',
                EnumRefundType,
                EnumAuditStatus,
                EnumUserType,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                dataTable: [],
                tableLoading: false,
                searchLoading: false,
                verifyVisible: false,
                verifyLoading: false,
                refundId: '',
                userId: '',
                verifyForm: {},
                rules: {
                    refundAddress: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    refundPhone: [
                        { required: true, validator: checkPhone, trigger: 'blur' }
                    ]
                },

                confimGetGoodsVisible: false, //确认收货
                getGoodsDetail: {},     //确认收货详情
                examineVisible: false,
                detailExamine: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallManager.searchConditionSale
            })
        },
        created() {
            this.searchData? (this.page=this.searchData.page,this.searchForm = this.searchData.searchForm): null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setSearchConditionSale: "selfMallManager/setSearchConditionSale"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            //获取售后订单列表
            getList() {
                let params = {
                    condition: {
                        refundType: this.searchForm.refundType? this.searchForm.refundType: EnumRefundType[0].key,
                        auditStatus: this.searchForm.auditStatus? this.searchForm.auditStatus: EnumAuditStatus[0].key
                    },
                    limit: this.page.limit,
                    page: this.page.page
                }
                this.searchForm.phone?params.condition.phone=this.searchForm.phone:"";
                this.searchForm.timeRange?(params.condition.timeStart=moment(this.searchForm.timeRange[0]).format("X"),params.condition.timeEnd=moment(this.searchForm.timeRange[1]).format("X")):"";
                this.searchForm.userType?params.condition.userType=this.searchForm.userType:"";
                this.searchForm.refundId?params.condition.refundId=this.searchForm.refundId:"";
                this.tableLoading = true;
                this.$http.get(this.$api.mallRefundOrderQPage, params, true).then(res=>{
                    this.setSearchConditionSale(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.dataTable = res.data;
                    this.page.total = res.total;
                })
                .catch(err=>{
                    this.tableLoading = false;
                    this.searchLoading = false;
                    err.code===409? this.dataTable=[]: "";
                    this.$message.error(err.message);
                })
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                this.searchForm={};
                this.page.page=1;
                this.getList();
            },
            //查看详情
            viewDetail(id, orderId, refundType, userId) {
                let query = {
                    type: 2, id: id, orderId: orderId, sale: parseInt(Math.random()*1000), userId: userId
                }
                refundType==='REFUND_GOODS'? query.refundType = refundType: null;
                this.$router.push({ path: "/orderListAfterSaleDetail", query: query});
            },
            formatRefundType(row) {
                return enumFormatter(row.refundType, EnumRefundType)
            },
            //确认退款
            backMoney(id, userId) {
                this.$confirm('确定对该订单执行退款吗？退款将按原支付方式及账户退回！', '退款', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(()=>{
                    this.$http.post(this.$api.mallOrderConfirmRefund, {refundId: id, userId: userId}, true).then(res=>{
                        this.verifyVisible = false;
                        this.getList();
                        this.$message.success('退款成功');
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                })
                .catch(()=>{});
            },
            // 审核详情
            verifyOrder(id, row) {
                this.detailExamine = {};
                this.refundId = id;
                this.userId = row.userId;
                this.$set(row, 'verifyBtnLoading', true);
                
                this.$http.get(this.$api.mallOrderAuditDetail, {refundId: id}, true).then(res=>{
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
                    
                    this.refundType = row.refundType;
                    this.examineVisible = true;
                    this.$set(row, 'verifyBtnLoading', false);
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'verifyBtnLoading', false);
                })
            },
            confirmGoods(refundId, row) {
                this.handleStatus = '';
                this.refundId = refundId;
                this.userId = row.userId;
                this.$set(row, 'goodsBtnLoading', true);
                this.$http.get(this.$api.mallOrderMoneyDetail, {refundId: refundId}, true).then(res=>{
                    let goodsName = [],
                        refundPic = [];
                    res.SRefundVO.forEach(item=>{
                        goodsName.push(item.goodsName);
                        if(item.refundPic&&JSON.parse(item.refundPic).length>0) {
                            JSON.parse(item.refundPic).forEach(_item=>{
                                refundPic.push(JSON.stringify(_item))
                            })
                        }
                    })
                    res.SRefundVO[0].goodsName = goodsName;
                    res.SRefundVO[0].refundPic = Array.from(new Set(refundPic)).map(item=>{
                        return JSON.parse(item)
                    });
                    this.verifyForm = res.SRefundVO[0];

                    this.verifyForm = Object.assign(res.SRefundVO[0], {logisticsName: res.logisticsName, logisticsNo: res.logisticsNo});
                    this.verifyVisible = true;
                    this.$set(row, 'goodsBtnLoading', false);
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'goodsBtnLoading', false);
                })
            },
             //审核订单
            examineConfirm() {
                this.$refs['checkFormOrder'].validate((params,url) => {
                    if(params) {
                        params.refundId = this.refundId;
                        this.$http.post(url, params, true).then(res=>{
                            this.getList();
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

            // 提交审核
            submitVerify(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = {
                            refundId: this.refundId,
                            userId: this.userId
                        }
                        this.verifyLoading = true;
                        this.$http.post(this.$api.mallOrderConfirmReceive, params, true).then(res=>{
                            this.$message.success('确认收货成功');
                            this.verifyLoading = false;
                            this.verifyVisible = false;
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
            //退货详情
            getGoods(refundId, row) {
                this.getGoodsDetail = {};
                this.$set(row, 'goodsBtnLoading', true);
                this.$http.get(this.$api.mallOrderMoneyDetail, {refundId: refundId}, true).then(res=>{
                    this.$set(row, 'goodsBtnLoading', false);
                    this.getGoodsDetail = res;
                    this.confimGetGoodsVisible = true;
                })
                .catch(err=>{
                    this.$set(row, 'goodsBtnLoading', false);
                    this.$message.error(err.message);
                })
            },
            //确认退货详情
            _ConfirmGetGoods() {
                this.$http.post(this.$api.mallOrderConfirmReceive, { refundId: this.id }, true).then(res=>{
                    this.confimGetGoodsVisible = false;
                    this.$message.success('确认收货成功')
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        filters: {
            formatAuditStatus(refundStatus) {
                return enumFormatter(refundStatus, EnumRefundStatus);
            },
            formatLogistics(val) {
                return enumFormatter(val, EnumLogisticsName);
            }
        }
    }
</script>
<style lang="scss" src="./saleList.scss" scoped></style>