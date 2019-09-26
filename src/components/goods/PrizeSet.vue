<template>
    <div class="prize-set">
        <el-card style="600px" class="marintop20">
            <el-form :model="value" ref="detailForm">
                <el-row type="flex" align="middle">
                    <el-col :span="5">税金：</el-col>
                    <el-col :span="2">
                        <el-form-item :rules="rules.checkPersent" :prop="'tax.ratio'">
                            <el-input :size="$size" style="width: 100%" v-model.trim="value.tax.ratio"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;%</el-col>
                </el-row>
                <el-row type="flex" align="middle" v-if="type">
                    <el-col :span="5">单笔销售奖励：</el-col>
                    <el-col :span="2">
                        <el-form-item :rules="rules.checkPersent" :prop="'sale.ratio'">
                            <el-input :size="$size" style="width: 100%" v-model.trim="value.sale.ratio"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;%</el-col>
                </el-row>

                <el-row type="flex" v-if="!type">
                    <el-col :span="5">维护收益（合伙人）：</el-col>
                    <el-col :span="2">
                        <el-form-item :rules="rules.checkPersent" :prop="'regionAdmin.ratio'">
                            <el-input v-model.trim="value.regionAdmin.ratio" :size="$size" style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;%</el-col>
                    <el-col :span="14">
                        <el-row type="flex" align="middle">
                            <el-col :span="10">维护收益门槛：</el-col>
                            <el-col :span="14">
                                <el-form-item :prop="'regionAdmin.sales'" :rules="value.regionAdmin.ratio? rules.checkNumSpe: rules.noCheck">
                                    <el-input :disabled="value.regionAdmin.ratio? false: true" :size="$size" v-model.trim="value.regionAdmin.sales" placeholder="请输入门槛月消费额"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col :span="5">月销售额奖励：</el-col>
                    <el-col :span="2">
                        <el-form-item :rules="rules.checkPersent" :prop="'mothSale.ratio'">
                            <el-input :size="$size" style="width:100%" v-model.trim="value.mothSale.ratio"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;%</el-col>
                    <el-col :span="14">
                        <el-row type="flex" align="middle">
                            <el-col :span="10">月销售总额门槛：</el-col>
                            <el-col :span="14">
                                <el-form-item :prop="'mothSale.sales'" :rules="value.mothSale.ratio? rules.checkNumSpe: rules.noCheck">
                                    <el-input :disabled="value.mothSale.ratio? false: true" :size="$size" v-model.trim="value.mothSale.sales" placeholder="请输入销售总额奖励的门槛"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" align="middle">
                            <el-col :span="10">月销售总额奖励类型：</el-col>
                            <el-col :span="14">
                                <el-radio v-model="value.mothSale.currency" label="yhq">单品优惠券</el-radio>
                                <el-radio v-model="value.mothSale.currency" label="xfq" v-if="type">消费券</el-radio>
                                <el-radio v-model="value.mothSale.currency" label="swq" v-else>实物券</el-radio>
                                <el-radio v-model="value.mothSale.currency" label="rmb" v-if="!type">现金</el-radio>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col :span="5">单次批量奖励：</el-col>
                    <el-col :span="2">
                        <el-form-item :prop="'singleBatch.ratio'" :rules="rules.checkPersent">
                            <el-input v-model.trim="value.singleBatch.ratio" :size="$size" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;%</el-col>
                    <el-col :span="14">
                        <el-row type="flex" align="middle">
                            <el-col :span="10">批量奖励的数量门槛：</el-col>
                            <el-col :span="14">
                                <el-form-item :prop="'singleBatch.sales'" :rules="value.singleBatch.ratio? rules.checkNumSpe: rules.noCheck">
                                    <el-input :disabled="value.singleBatch.ratio? false: true" v-model.trim="value.singleBatch.sales" :size="$size" placeholder="请输入批量奖励的门槛数量"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" align="middle">
                            <el-col :span="10">单次批量奖励类型：</el-col>
                            <el-col :span="14">
                                <el-radio v-model="value.singleBatch.currency" label="yhq">单品优惠券</el-radio>
                                <el-radio v-model="value.singleBatch.currency" label="xfq" v-if="type">消费券</el-radio>
                                <el-radio v-model="value.singleBatch.currency" label="swq" v-else>实物券</el-radio>
                                <el-radio v-model="value.singleBatch.currency" label="rmb" v-if="!type">现金</el-radio>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <h3>临时补贴：</h3>
                <el-card class="marginbottom20 nopadding" style="width: 80%;margin:0 auto 20px" v-for="(item, index) in value.saleSubsidyTempList" :key="index">
                    <div slot="header" class="header">
                        <i class="el-icon-delete" v-if="index!=0" @click="deleteItem(index)"></i>
                    </div>
                    <el-row type="flex" align="middle">
                        <el-col :span="20">
                            <el-row type="flex" align="middle">
                                <el-col :span="19">
                                    <el-form-item label-width="180px" label="区域：">
                                        <cascader-province v-model="item.areaCodes"></cascader-province>
                                        <!-- <province-cascader :clearable="true" class="long-input" v-model="item.areaCode"></province-cascader> -->
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" align="middle">
                                <el-col :span="19">
                                    <el-form-item :label="`给购买用户（${type? '消费券': '实物券'}）：`" label-width="180px" :prop="'saleSubsidyTempList.'+index+'.buyerRatio'" :rules="item.areaCodes&& item.areaCodes.length>0 ? rules.checkPersentSpe: rules.noCheck">
                                        <el-input :disabled="item.areaCodes? false: true" class="long-input" :size="$size" v-model.trim="item.buyerRatio"></el-input>&nbsp;&nbsp;%
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--2019.9.7===================start================= -->
                            <el-row type="flex" align="middle">
                                <el-col :span="19">
                                    <el-form-item label="是否展示到前台：" label-width="180px">
                                        <el-radio>展示</el-radio>
                                        <el-radio>不展示</el-radio>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" align="middle">
                                <el-col :span="19">
                                    <el-form-item label="最大优惠金额（返券展示的计算）：" label-width="240px">
                                        <el-input :disabled="item.areaCodes? false: true" :size="$size" v-model.trim="item.maxMoney"  class="long-input" ></el-input>&nbsp;&nbsp;元
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--2019.9.7===================end================= -->
                            <el-row type="flex" align="middle">
                                <el-col :span="19">
                                    <el-form-item label="给区域合伙人（钱）：" label-width="180px" :prop="'saleSubsidyTempList.' +index+ '.areaAdminRatio'" :rules="item.areaCodes&& item.areaCodes.length>0 ? rules.checkPersentSpe: rules.noCheck">
                                        <el-input :disabled="item.areaCodes? false: true" class="long-input" :size="$size" v-model.trim="item.areaAdminRatio"></el-input>&nbsp;&nbsp;%
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-card>
                <div class="btn-group">
                    <el-button :size="$size" type="primary" @click="addItem()">新增一条销售补贴（临时）</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    /**
     * 枚举说明  [xfq消费券，swq实物券，yhq优惠券， rmb现金]
     */
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import CascaderProvince from '@/components/common/CascaderProvince.vue';
    export default {
        props: {
            type: {
                type: Boolean,
                default: true   //true 精选商城， false批发商城
            },
            value: {
                type: Object,
                default: ()=>({})
            }
        },
        components: {
            ProvinceCascader,
            CascaderProvince
        },
        mounted() {
            this.detail = this.value;
        },
        data() {
            return {
                rules: {
                    checkPersentSpe: [
                        { validator: this.checkPersentSpe, trigger: 'blur' }
                    ],
                    checkPersent: [
                        { validator: this.checkPersent, trigger: 'blur' }
                    ],
                    checkNum: [
                        { validator: this.checkNum, trigger: 'blur' }
                    ],
                    checkNumSpe: [
                        { validator: this.checkNumSpe, trigger: 'blur' }
                    ],
                    noCheck: [
                        { validator: this.noCheck, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            updateValue() {
                this.$emit('input', this.value);
            },
            checkPersent(rule, value, call) {
                if(!value) {
                    return call()
                }
                if(!/^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('格式不正确'))
                }
                return call();
            },
            checkPersentSpe(rule, value, call) {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('格式不正确'))
                }
                return call();
            },
            checkNum(rule, value, call) {
                if(!value) {
                    return call()
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请填写正整数'))
                }
                return call();
            },
            checkNumSpe(rule, value, call) {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请填写正整数'))
                }
                return call();
            },
            noCheck(rule, value, call) {
                return call();
            },
            _validate(fn) {
                return new Promise((resolve, reject) => {
                    this.$refs['detailForm'].validate(v=>{
                        if(v){
                            console.log('验证通过')
                            resolve(true);
                            this.updateValue();
                        }else{
                            this.$nextTick(()=>{
                                let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                                $('.xk-container').animate({
                                    scrollTop: num - 90
                                }, 500)
                            })
                            reject(false);
                            return false;
                        }
                    })
                })
            },
            /**
             * 新增一条分配
             */
            addItem() {
                this.value.saleSubsidyTempList.push({
                    areaCodes: '',
                    buyerRatio: '',
                    areaAdminRatio: '',
                    areaAdminCurrency: '',
                    buyerCurrency: ''
                })
            },
            deleteItem(index) {
                this.value.saleSubsidyTempList.splice(index, 1);
            }
        }
    }
</script>

<style scoped lang="scss">
    .prize-set {
        .el-form-item {
            margin-bottom: 0;
        }
        .el-col {
            margin-bottom: 15px;
        }
        .nopadding {
            /deep/ .el-card__header {
                padding: 0 20px;
            }
        }
        h3 {
            color: #303133;
            font-size: 14px;
        }
        .danger {
            color: #F56C6C;
            cursor: pointer;
        }
        .header {
            text-align: right;
            cursor: pointer;
            color: #F56C6C
        }
        .long-input {
            width: 90%;
            /deep/ .el-cascader{
                >>> .el-input {
                    width: 100%;
                }
            }
        }
        /deep/ .el-radio {
            margin-right: 15px;
        }
    }
</style>
