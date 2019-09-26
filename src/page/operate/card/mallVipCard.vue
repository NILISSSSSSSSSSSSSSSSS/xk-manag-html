<template>
    <div class="xk-container">
        <div class="xk-body mall-vip-card">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="会员卡ID：">
                                    <el-input :size="$size" v-model="searchForm.memberCardId" placeholder="请输入优惠券ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="会员卡名称：">
                                    <el-input :size="$size" v-model="searchForm.name" placeholder="请输入优惠券名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="类型：">
                                    <el-select :size="$size" v-model="searchForm.memberType">
                                        <el-option v-for="item in EnumCardType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效时间：">
                                    <el-date-picker type="datetime" :size="$size" v-model="searchForm.validTime" placeholder="请选择生效时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="结束时间：">
                                    <el-date-picker type="datetime" :size="$size" v-model="searchForm.invalidTime" placeholder="请选择结束时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效状态：">
                                    <el-select :size="$size" v-model="searchForm.cardConditionStatus">
                                        <el-option v-for="item in EnumCouponTypeList" :key="item.key" :value="item.key" :label="item.value">{{ item.value }}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                    </el-form>
                </div>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="'mallVipCardAdd'" type="primary" size="small" @click="add('addCardForm')">新增</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable">
                    <el-table-column label="会员卡ID" prop="id" width="220px"></el-table-column>
                    <el-table-column label="会员卡名称" prop="name" width="100px"></el-table-column>
                    <el-table-column label="类型" prop="cardType" :formatter="formatterType" width="120px"></el-table-column>
                    <el-table-column label="生效时间" width="200px">
                        <template slot-scope="scope">
                            {{ scope.row.validTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" width="200px">
                        <template slot-scope="scope">
                            {{ scope.row.invalidTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="总量" prop="totalNum" width="150px"></el-table-column>
                    <el-table-column label="已领" prop="num"></el-table-column>
                    <el-table-column label="状态" prop="newStatus" :formatter="formatterStatus"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="240px">
                        <template slot-scope="scope">
                            <el-button v-permission="'mallVipCardDetail'" :size="$size" type="primary" :loading="scope.row.loading" @click="viewDetail(scope.row.id, scope.row)">查看</el-button>
                            <el-button v-permission="'mallVipCardAbandon'" :size="$size" type="danger" :disabled="scope.row.newStatus==='STOP'" @click="cardMemberCardDelete(scope.row.id)">{{ scope.row.newStatus==='STOP'?"已作废": "作废"}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>

        <!-- 新增会员卡 -->
        <el-dialog title="新增会员卡" width="600px" :visible.sync="dialogVisible" class="dialog-visible">
            <el-form :model="addCardForm" label-width="120px" ref="addCardForm" :rules="addCardFormRules">
                <el-form-item label="会员卡名称：" prop="name">
                    <el-input :size="$size" v-model="addCardForm.name" placeholder="请输入会员卡名称"></el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="cardType">
                    <el-select :size="$size" v-model="addCardForm.cardType">
                        <el-option v-for="item in EnumCardType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠：" prop="discount">
                    <el-input :size="$size" v-model="addCardForm.discount" placeholder="折"></el-input>
                </el-form-item>
                <el-form-item label="总量：">
                    <el-radio-group v-model="totalNum">
                        <el-radio :label="0">不限</el-radio>
                        <el-radio :label="1">限制</el-radio>
                    </el-radio-group>
                    <el-form-item v-if="totalNum===1" prop="totalNum">
                        <el-input :size="$size" v-model="addCardForm.totalNum" placeholder="请输入优惠券总量（张）"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="购卡费用：">
                    <el-radio-group v-model="price">
                        <el-radio :label="0">免费</el-radio>
                        <el-radio :label="1">价格</el-radio>
                    </el-radio-group>
                    <el-form-item v-if="price===1" prop="price"><el-input :size="$size" v-model="addCardForm.price" placeholder="元"></el-input></el-form-item>
                </el-form-item>
                <el-form-item label="会员卡有效期：" prop="timeRange">
                    <el-date-picker range-separator="至" start-placeholder="选择生效时间" end-placeholder="选择结束时间" type="datetimerange" v-model="addCardForm.timeRange" placeholder="请选择生效时间" :size="$size"></el-date-picker>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="dialogVisible=false">返回</el-button>
                <el-button :size="$size" type="primary" @click="addCard('addCardForm')">保存</el-button>
            </div>
        </el-dialog>
        <vip-card-detail :visible.sync="cardVisible" :details="cardDetail"></vip-card-detail>
    </div>
</template>

<script>
    import { EnumCouponTypeList } from '@/util/publicParams.js'
    //枚举会员类型
    const EnumCardType = [{key: "VIP", value:"VIP会员卡"},{key: "GENERAL", value:"普通会员卡"}]
    import VipCardDetail from '@/components/operate/VipCardDetail.vue';
    import  { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment'
    export default {
        components: {
            VipCardDetail
        },
        data() {
            const checkDiscount = (rule, value, call)=>{
                if(!value) {
                    call(new Error('请填写折扣'))
                }else if(!/^(?:([1-9](?:\.[\d])?)|(?:0\.[1-9])|10)$/g.test(value)) {
                    call(new Error('折扣格式填写错误（正确格式如：9.5）'))
                }else{
                    call()
                }
            }
            const checkNum = (rule, value, call) => {
                if(!value) {
                    return call(new Error('优惠券总量不能为空！'))
                }
                if(!/^[1-9]\d*$/.test(value)){
                    return call(new Error('请输入大于1 的正整数'))
                }
                if(value*1 > 99999999) {
                    return call(new Error('输入的数量过大，请重新输入！'))
                }
                call();
            }
            const checkPrice = (rule, value, call) => {
                if(!value || /^[0]{1}[\.]{1}[0]*$/.test(value)) {
                    return call(new Error('购卡费用不能为空或不能为0！'))
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)){
                    return call(new Error('请输入大于0的两位有效正数！'))
                }
                if(value > 999999.99) {
                    return call(new Error('输入的价格过大，请重新输入！'))
                }
                call()
            }
            return {
                cardVisible: false,
                searchForm: {},
                EnumCardType,
                EnumCouponTypeList,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                loadingTable: false,
                searchLoading: false,
                dialogVisible: false,
                totalNum: 0,
                price: 0,
                addCardForm: {
                    timeRange: []
                },
                addCardFormRules:{
                    name: [{ required: true, message: '会员卡名称不能为空', trigger: 'blur' }],
                    cardType: [{ required: true, message: '会员卡名称不能为空', trigger: 'blur' }],
                    discount: [{ required: true, validator: checkDiscount, trigger: 'blur' }],
                    totalNum: [{ required: true, validator: checkNum, trigger: 'blur' }],
                    price: [{ required: true, validator: checkPrice, trigger: 'blur' }],
                    timeRange: [{ required: true, message: '请选择时间范围', trigger: 'blur' }]
                },
                cardDetail: {}
            }
        },
        created() {
            this.getCardList();
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getCardList();
            },
            formatterStatus(row) {
                return enumFormatter(row.newStatus, EnumCouponTypeList)
            },
            formatterType(row) {
                return enumFormatter(row.cardType, EnumCardType)
            },
            //查询
            search() {
                this.page.page = 1;
                this.searchLoading = true
                this.getCardList();
            },
            //清空
            clearInput() {
                this.searchForm = {};
                this.getCardList()
            },
            //新增
            add(formName) {
                this.title = '新增'
                this.dialogVisible = true;
                this.$refs[formName]?this.$refs[formName].resetFields():"";
            },
            //新增会员卡
            addCard(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        let params = {
                            memberCard: {
                                name: this.addCardForm.name,
                                memberType: this.addCardForm.cardType,
                                discount: this.$math.multip(this.addCardForm.discount, 100),
                                totalNum: this.totalNum===0?-1: this.addCardForm.totalNum,  //-1表示总量不限制
                                price: this.price ===0? 0: this.addCardForm.price,   //0代表免费
                                validTime: moment(this.addCardForm.timeRange[0]).format('X'),   //开始时间
                                invalidTime: moment(this.addCardForm.timeRange[1]).format('X'),   //结束时间
                                source: 'mall'
                            }
                        }
                        this.$http.post(this.$api.cardMemberCardCreate, params, true).then(res=> {
                            this.dialogVisible = false;
                            this.getCardList()
                            this.$message({
                                message: '保存成功',
                                type: "success"
                            })
                        })
                        .catch(err=>{
                            this.$message.error(err.message)
                        })
                    }else{
                        return false;
                    }
                })
            },
            //获取列表
            getCardList() {
                let params = {
                    condition: this.searchForm,
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.loadingTable = true;
                params = JSON.parse(JSON.stringify(params))
                params.condition.validTime?params.condition.validTime = moment(params.condition.validTime).format('X'): ""
                params.condition.invalidTime?params.condition.invalidTime = moment(params.condition.invalidTime).format('X'): ""
                this.$http.get(this.$api.cardMemberCardQPage, params, true).then(res=> {
                    this.tableData = res? res.data: []
                    this.page.total = res? res.total: 0;
                    this.loadingTable = false;
                    this.searchLoading = false
                }).catch(err=> {
                    this.$message.error(err.message);
                    this.loadingTable = false;
                    this.searchLoading = false
                })
            },
            //作废
            cardMemberCardDelete(id) {
                this.$confirm("确定作废该会员卡吗？", '作废会员卡', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(()=>{
                    this.$http.post(this.$api.cardMemberCardDelete, {
                        id: id    //会员卡ID
                    }, true).then(res=> {
                        this.$message({
                            type: "success",
                            message: "作废成功"
                        })
                        this.getCardList();
                    })
                    .catch(err=> {
                        this.$message.error(err.message)
                    })
                    
                })
                .catch(()=>{
                    this.$message({
                        type: "info",
                        message: "已取消作废"
                    })
                })
            },
            //查看会员卡详情
            viewDetail(id, row) {
                this.$set(row,"loading",true);
                this.$http.get(this.$api.cardMemberCardDetail , {id: id}, true).then(res=>{
                    this.cardDetail = res;
                    this.cardVisible = true;
                    this.$set(row,"loading",false);
                })
                .catch(err=>{
                    this.$message.error(err.message)
                    this.$set(row,"loading",false);
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "./mallVipCard.scss"
</style>
