<template>
    <div class="xk-container customer-list">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>售后列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" label-width="120px" class=" demo-ruleForm xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="手机号码：">
                            <el-input :size="$size" v-model.trim="searchForm.userTel" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单ID：">
                            <el-input :size="$size" v-model.trim="searchForm.orderId" placeholder="输入订单ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item  label="用户ID：">
                            <el-input :size="$size" v-model.trim="searchForm.userId" placeholder="请输入用户ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="期号：">
                            <el-input :size="$size" v-model.trim="searchForm.sequenceId" placeholder="输入期号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开奖期数：">
                            <el-input v-model.trim="searchForm.currentNper" :size="$size" placeholder="请输入开奖期数"></el-input>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="8">
                        <el-form-item label="审核状态：">
                            <el-select :size="$size" v-model="searchForm.audit" placeholder="请选择审核状态" style="width: 100%;">
                                <el-option v-for="(item, index) in EnumAuditStatus" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="选择日期：">
                            <el-date-picker
                                :size="$size"
                                style="width: 100%"
                                v-model="searchForm.rangeTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格数据-->
        <div class="marintop20 xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-table v-loading="tableLoading" :data="tableData" tooltip-effect="dark">
                <el-table-column label="期号" width="220" prop="termNumber"></el-table-column>
                <el-table-column label="期数" prop="currentNper" width="90"></el-table-column>
                <el-table-column prop="orderId" width="160" label="订单ID"></el-table-column>
                <el-table-column prop="userId" width="120" label="用户ID" show-overflow-tooltip></el-table-column>
                <el-table-column prop="uid" width="120" label="用户UID"></el-table-column>
                <el-table-column label="手机号" width="150" prop="userTel"></el-table-column>
                <el-table-column show-overflow-tooltip label="退货奖品" prop="goodsName"></el-table-column>
                <el-table-column label="类别" :formatter="formatterCate" width="100"></el-table-column>
                <el-table-column width="110" label="用户是否换货">
                    <template slot-scope="scope">
                        <span v-if="scope.row.audit === 'UNAUDITED'">否</span>
                        <div v-else>
                            <el-button
                                v-permission="'customerListConfirm'"
                                v-if="scope.row.state===0 && scope.row.audit !=='UNAPPROVED' "
                                :size="$size"
                                type="primary"
                                :loading="scope.row.loadingConfirm"
                                @click="confirmGoods(scope.row.refundId, scope.row)">
                                确认收货
                            </el-button>
                            <span v-else-if="scope.row.audit==='UNAPPROVED'">否</span>
                            <span v-else>已收货</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="审核">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="'customerListVerify'"
                            v-if="scope.row.audit === 'UNAUDITED'"
                            :size="$size"
                            type="primary"
                            @click="openVerifyDialog(scope.row.orderId, scope.row.refundId)">
                            未审核
                        </el-button>
                        <span v-else-if="scope.row.audit ==='UNAPPROVED'">未通过</span>
                        <span v-else>已审核</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="220" >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="'customerListSend'"
                            v-if="scope.row.state !=0 && scope.row.audit !='UNAPPROVED' && scope.row.audit !='UNAUDITED' && scope.row.refundState!=='DELIVERED'"
                            :size="$size"
                            type="success"
                            :loading="scope.row.reissuseLoading"
                            @click="showReissueDialog(scope.row.orderId,scope.row)">补发发货
                        </el-button>
                            <el-button
                                v-permission="'customerListDetail'"
                                :size="$size"
                                type="primary"
                                @click="viewDetail(scope.row.orderId, scope.row)"
                            >订单详情
                            </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="补发奖品" :visible.sync="tipsVisible1" width="700px" top="30px" class="reissue-dialog">
                <el-form :model="reissuePrizeForm" ref="reissuePrizeForm" label-width="150px" :rules="reissueRules">
                    <el-form-item label="奖品名称：">{{ reissuePrizeForm.name }}</el-form-item>
                    <el-form-item label="收件人：">{{ reissuePrizeForm.receiver }}</el-form-item>
                    <el-form-item label="手机号码：">{{ reissuePrizeForm.phone }}</el-form-item>
                    <el-form-item label="配送地址：">{{ reissuePrizeForm.street || '未填写' }}</el-form-item>
                    <el-form-item label="快递名称：" required>
                        <el-row>
                            <el-form-item prop="logisticsName">
                                <el-select :size="$size" style="width:84%" placeholder="请选择第三方物流" v-model="reissuePrizeForm.logisticsName">
                                    <el-option v-for="(item, index) in EnumLogisticsName" :key="index" :label="item.value" :value="item.key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="快递单号：" prop="logistics" v-if="reissuePrizeForm.logisticsName!=='XK'">
                        <el-input :size="$size" placeholder="请输入快递单号" v-model.trim="reissuePrizeForm.logistics" style="width: 84%"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btn-group">
                    <el-button :size="$size" @click="tipsVisible1=false">取消</el-button>
                    <el-button :size="$size" type="primary" @click="reissueSend()">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="确认收货" :visible.sync="tipsVisible2" width="30%" top="30px">
                <span>确认用户退货商品已经返回仓库</span>
                <span slot="footer" class="dialog-footer">
                        <el-button :size="$size" @click="tipsVisible2 = false">取 消</el-button>
                        <el-button :size="$size" type="primary" @click="collectGoods">确 定</el-button>
                    </span>
            </el-dialog>
            <el-dialog title="退货审核" :visible.sync="tipsVisible3" width="30%" top="30px" class="examine-dialog">
                
                <el-form label-width="150px" ref="examineForm" :model="examineForm" :rules="examineFormRules">
                    <el-form-item label="申请退货奖品：">{{ examineForm.refund.name }}</el-form-item>
                    <el-form-item label="退货说明：">{{ examineForm.refund.reason || '无' }}</el-form-item>
                    <el-form-item label="奖品图片：" v-if="examineForm.refund.explainUrl">
                        <div class="imgInfo" v-for="(item, index) in examineForm.refund.explainUrl" :key="index">
                            <img v-if="!JSON.parse(item).video" :src="JSON.parse(item).pic" @click="$viewImage(JSON.parse(item).pic)">
                            <img v-else :src="JSON.parse(item).pic?JSON.parse(item).pic: JSON.parse(item).video+'?vframe/jpg/offset/10/w/146/h/146'" alt="" @click="$viewImage(JSON.parse(item).video+'?video', true)">
                        </div>
                    </el-form-item>
                    <el-form-item label="人工审核：" class="m-b-0">
                        <el-radio-group v-model="examineForm.audit">
                            <el-radio label="VERIFIED">审核通过</el-radio>
                            <el-radio label="UNAPPROVED">审核不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row v-if="examineForm.audit=== 'UNAPPROVED'">
                        <el-col :span="7">&emsp;</el-col>
                        <el-col :span="17" >
                            <el-form-item label-width="0" prop="verify">
                                <el-input type="textarea" v-model.trim="examineForm.verify" placeholder="请输入不通过的原因" resize="none" :autosize="{minRows: 5, maxRows: 5}"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-else>
                        <el-form-item label="平台收货地址：" prop="refundAddress">
                            <el-input :size="$size" v-model.trim="examineForm.refundAddress"></el-input>
                        </el-form-item>
                        <el-form-item class="margintop10" label="平台收货人姓名：" prop="refundReceiver">
                            <el-input :size="$size" v-model.trim="examineForm.refundReceiver"></el-input>
                        </el-form-item>
                        <el-form-item class="margintop10" label="平台收货人电话：" prop="refundPhone">
                            <el-input :size="$size" v-model.trim="examineForm.refundPhone"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div class="btn-group">
                    <el-button :size="$size" @click="tipsVisible3 = false">取 消</el-button>
                    <el-button :size="$size" type="primary" @click="auditCompletion">确 定</el-button>
                </div>
            </el-dialog>

            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <rider :riderDialog.sync="riderDialog" :orderId="riderOrderId" :weight="goodsWeight" xkModule="jf_mall"></rider>
    </div>
</template>

<script>
    import moment from 'moment';
    import { EnumAuditStatus, EnumLogisticsName } from '@/util/publicParams.js';
    import {enumFormatter} from '@/util/publicMehotds.js';
    import { mapMutations, mapState } from 'vuex';
    import Rider from '@/components/goods/Rider.vue';

    export default {
        name: "customerList",
        components: {
            Rider
        },
        data() {
            const checkPhone = (rule, value, call)=>{
                if(!value){
                    return call(new Error('不能为空'))
                }
                if(!/(^\d{6,8}$)|(^\d{11}$)/.test(value)){
                    return call(new Error('电话号码格式不正确'))
                }
                call();
            }
            return {
                EnumAuditStatus,
                EnumLogisticsName,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                tipsVisible1:false,
                tipsVisible2:false,
                tipsVisible3:false,
                
                ruleForm1: {},

                tableData: [],
                tableLoading: false,
                searchLoading: false,
                disabledBtn: true,
                searchForm: {},
                EnumCategory: '',
                
                reissuePrizeForm:{},
                postType: 'OWN',
                reissueRules: {
                    logisticsName: [
                        { required: true, message: '请选择快递类型', trigger: 'change'}
                    ],
                    logistics: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ]
                },
                examineFormRules: {
                    refundAddress: [ {required: true, message: '不能为空', trigger: 'blur'} ],
                    refundReceiver: [ {required: true, message: '不能为空', trigger: 'blur'} ],
                    refundPhone: [ {required: true, validator: checkPhone, trigger: 'blur'} ],
                    verify: [ {required: true, message: '不能为空', trigger: 'blur'}]
                },


                examineForm: {
                    audit: 'VERIFIED',
                    refund:{}
                },   //审核
                riderDialog: false,
                goodsWeight: 0,    //商品重量
                riderOrderId: ''
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfareWelfareOrder.searchFLSaleList
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getClass();
        },
        methods: {
            ...mapMutations({
                setFLSaleList: "welfareWelfareOrder/setFLSaleList"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            //搜索
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            //清空
            clearCondition() {
                this.setFLSaleList(null);
                this.searchForm={};
                this.getList();
            },
            getList() {
                let params = {
                    condition: {},
                    limit: this.page.limit,
                    page: this.page.page
                };
                this.searchForm.orderId?params.condition.orderId = this.searchForm.orderId:"";
                this.searchForm.rangeTime? (params.condition.start = moment(this.searchForm.rangeTime[0]).format("X"), params.condition.end = moment(this.searchForm.rangeTime[1]).format("X")):"";
                this.searchForm.userId? params.condition.userId = this.searchForm.userId: "";
                this.searchForm.userTel? params.condition.userTel = this.searchForm.userTel: "";
                this.searchForm.currentNper? params.condition.currentNper = this.searchForm.currentNper: "";
                this.searchForm.sequenceId? params.condition.sequenceId = this.searchForm.sequenceId:"";
                this.searchForm.audit? params.condition.audit = this.searchForm.audit:"";
                this.tableLoading = true;
                console.log(params);
                this.$http.get(this.$api.jOrderRefundQPage, params, true).then(res=>{
                    this.setFLSaleList(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.tableLoading = false;
                    this.searchLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                    this.searchLoading = false;
                })
            },
            //查看订单
            viewDetail(orderId, row) {
                /**
                 * scope.row.state !=0 && scope.row.audit !='UNAPPROVED' && scope.row.audit !='UNAUDITED' && scope.row.refundState!=='DELIVERED'
                 */
                let params = {
                    orderId: orderId
                }
                if(row.audit !='UNAPPROVED' && row.audit !='UNAUDITED') {
                    if(row.refundState==='DELIVERED'){
                        params.isuser = 1
                    }
                    params.refundId=row.refundId
                }
                this.$router.push({
                    path: '/customerDetails',
                    query: params
                });
            },
            //所选全部的商品
            selectChange(val) {
                val.length>0? this.disabledBtn=false: this.disabledBtn=true;
                this.selectGoods = val;
            },

            //是否确认发货   //暂时不用了
            sureSend(){
                this.tipsVisible2=false;
            },
            collectGoods() {},    //暂时不用了
            //确认收货
            confirmGoods(id, row){
                  this.$confirm('确认用户退货商品已经返回仓库！', '去人收货', {
                      type: 'info',
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                  }).then(()=>{
                      this.$set(row, 'loadingConfirm', true);
                      console.log(JSON.stringify({refundId: id}))
                      this.$http.post(this.$api.jMallOBMOrderState, {refundId: id}, true).then(res=>{
                          this.$set(row, 'loadingConfirm', false);
                          this.getList();
                      })
                      .catch(err=>{
                          this.$message.error(err.message);
                          this.$set(row, 'loadingConfirm', false);
                      })
                  })
                  .catch(()=>{})
            },
            //打开审核弹框并获取详情
            openVerifyDialog(orderId, refundId) {
                this.examineForm.refundId = refundId;
                this.$refs['examineForm']? this.$refs['examineForm'].resetFields(): null;
                this.$http.get(this.$api.jMallOBMOrderDetail, {orderId: orderId}, true).then(res=>{
                    console.log(res)
                    this.examineForm.refund = res.refund;
                    this.examineForm.refund.name = res.goods.name;
                    this.examineForm.refund.orderId = orderId;
                    this.tipsVisible3 = true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //完成审核
            auditCompletion(){
                this.$refs['examineForm'].validate(v=>{
                    if(v) {
                        let params = {
                            refundId: this.examineForm.refundId,
                            audit: this.examineForm.audit,
                            orderId: this.examineForm.refund.orderId
                        }
                        this.examineForm.audit==='UNAPPROVED'? params.message=this.examineForm.verify: (
                            params.refundAddress = this.examineForm.refundAddress,
                            params.refundPhone = this.examineForm.refundPhone,
                            params.refundReceiver = this.examineForm.refundReceiver
                        );
                        
                        this.$http.post(this.$api.jMallOBMOrderAudit, params, true).then(res=>{
                            this.tipsVisible3=false;
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
            //获取分类
            getClass() {
                this.$http.get(this.$api.queryJFCategory, {}, true).then(res=>{
                    this.EnumCategory = res;
                    this.getList();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            formatterCate(row) {
                return enumFormatter(row.category, this.EnumCategory, {key: 'code', value: 'name'});
            },
            //补发发货弹框及详情
            showReissueDialog(orderId, row) {
                //获取中奖用户信息
                this.$refs['reissuePrizeForm']? this.$refs['reissuePrizeForm'].resetFields(): '';
                this.postType = 'OWN';
                this.reissuePrizeForm = {};
                this.$set(row, 'reissuseLoading', true);
                this.$http.get(this.$api.jMallOBMOrderDetail, {orderId: orderId}, true).then(res=>{
                    console.log(res)
                    this.goodsWeight = this.$math.divide(res.goods.weight, 1000);
                    this.riderOrderId = orderId;
                    this.tipsVisible1 = true;
                    this.reissuePrizeForm = Object.assign(res.address, {name: res.goods.name});
                    this.reissuePrizeForm.orderId = orderId;
                    this.reissuePrizeForm.refundId = row.refundId;
                    this.$set(row, 'reissuseLoading', false);
                })
                .catch(err=>{
                    this.$set(row, 'reissuseLoading', false);
                    this.$message.error(err.message);
                })
            },
            //补发发货（向服务器发送请求）
            reissueSend() {
                this.$refs['reissuePrizeForm'].validate(v=>{
                    if(v) {
                        if(this.reissuePrizeForm.logisticsName !== 'XK') {
                            let params = {
                                logisticsName: this.reissuePrizeForm.logisticsName,
                                orderId: this.reissuePrizeForm.orderId,
                                refundId: this.reissuePrizeForm.refundId,
                                postType: "THIRD",
                                logisticsNo: this.reissuePrizeForm.logistics
                            }
                            console.log(JSON.stringify(params));
                            this.$http.post(this.$api.JOrderSecondConfirmShipping, params, true).then(res=>{
                                this.$message.success('发货成功');
                                this.tipsVisible1 = false;
                                this.getList();
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                            })
                        }else{
                            this.riderDialog = true;
                        }
                    }
                })
            }
        },
        watch: {
            riderDialog(val) {
                !val? (this.tipsVisible1 = false, this.getList()): null;
            }
        }
    }
</script>

<style scoped lang="scss">
    .customer-list{
        .imgInfo {
            display: inline-block;
            width: 80px;
            height: 80px;
            margin-left: 20px;
            overflow: hidden;
            border: 1px dotted #999;
            img{
                width: 100%;
                vertical-align: middle;
            }
            &::after{
                content: '';
                display: inline-block;
                width: 0;
                height: 100%;
                vertical-align: middle;
            }
        }
        .infos{
            border: 1px solid #666;
            background-color: #eee;
        }
        .reissue-dialog {
            /deep/ .el-form-item {
                margin-bottom: 10px;
            }
        }
    }
    .examine-dialog {
        /deep/ .el-form-item{
            margin-bottom: 0;
        }
    }
</style>

