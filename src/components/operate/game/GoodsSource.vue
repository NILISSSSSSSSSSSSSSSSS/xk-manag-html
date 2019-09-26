<template>
    <div class="goods-source">
        <el-form ref="value" :model="value" label-width="120px">
            <el-card style="600px" class="marintop20">
                <el-row type="flex" align="middle">
                    <el-col :span="5">货源奖励设置</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="货源奖励： 推荐联盟商：" label-width="186px" :rules="rules.checkPersent" :prop="'sourceOfGoods.ratio'">
                            <el-input v-model.trim.number="value.sourceOfGoods.ratio" :size="$size" style="width:70%"></el-input>
                            <span>&nbsp;%&nbsp;</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label-width="0" :prop="'sourceOfGoods.merchantId'" :rules="rules.checkMerchant">
                            <el-input style="display:none" v-model="value.sourceOfGoods.merchantId"></el-input>
                            <el-button type="info" :size="$size" @click="relation">去关联商户</el-button>
                            <span v-if="value.sourceOfGoods.merchantId">已关联商户&nbsp;&nbsp;{{ value.sourceOfGoods.merchantName }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="3">
                        <!-- <el-form-item label-width="180px" label="维护推荐联盟商的合伙人：" :rules="value.sourceOfGoods.ratio? rules.checkPersentSpe: rules.noCheck" :prop="'sourceOfGoods.adminRadio'"> -->
                        <el-form-item label-width="180px" label="维护推荐联盟商的合伙人：" :rules="value.sourceOfGoods.ratio >0 ?rules.checkPersentSpe: rules.noCheck" :prop="'sourceOfGoods.adminRadio'">
                            <el-input style="width:70%" :size="$size" :disabled="value.sourceOfGoods.ratio? false: true" v-model.trim.number="value.sourceOfGoods.adminRadio"></el-input>&nbsp;&nbsp;%
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="货源奖励补贴：">
                    此商品月货源奖励不足&nbsp;&nbsp;
                    <el-form-item label-width="0" style="display:inline-block" :prop="'sourceOfGoodsMonthSaleSubsidy.sales'" :rules="rules.checkNum">
                        <el-input :size="$size" placeholder="300" style="width:100px" class="short-input" v-model.trim="value.sourceOfGoodsMonthSaleSubsidy.sales"></el-input>
                    </el-form-item>
                    &nbsp;&nbsp;元时，额外补贴&nbsp;&nbsp;
                    <!-- <el-form-item label-width="0" style="display:inline-block" :prop="'sourceOfGoodsMonthSaleSubsidy.ratio'" :rules="value.sourceOfGoodsMonthSaleSubsidy.sales? rules.checkPersentSpe: rules.noCheck"> -->
                    <el-form-item label-width="0" style="display:inline-block" :prop="'sourceOfGoodsMonthSaleSubsidy.ratio'" :rules="value.sourceOfGoodsMonthSaleSubsidy.sales > 0 ?rules.checkPersentSpe: rules.noCheck">
                        <el-input style="width:100px" :disabled="value.sourceOfGoodsMonthSaleSubsidy.sales >0? false: true" :size="$size" placeholder="30" class="short-input" v-model.trim="value.sourceOfGoodsMonthSaleSubsidy.ratio"></el-input>
                    </el-form-item>&nbsp;&nbsp;%
                </el-form-item>
            </el-card>
        </el-form>
        <relative-merchant :visible.sync="showDialog" v-model="detail"></relative-merchant>
    </div>
</template>

<script>
    import RelativeMerchant from '@/components/goods/RelativeMerchant.vue'; 
    export default {
        props: {
            value: {
                type: Object,
                default: ()=> ({
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                })
            }
        },
        components: {
            RelativeMerchant
        },
        data() {
            return {
                rules: {
                    checkNum: [
                        { validator: this.checkNum, trigger: 'blur' }
                    ],
                    checkMerchant: [
                        { validator: this.checkMerchant, trigger: 'change' }
                    ],
                    checkPersent: [
                        {validator: this.checkPersent, trigger: 'blur' }
                    ],
                    checkPersentSpe: [
                        {validator: this.checkPersentSpe, trigger: 'blur' }
                    ],
                    noCheck: [
                        { validator: this.noCheck, trigger: 'blur' }
                    ]
                },
                showDialog: false,
                detail: ''
            }
        },
        methods: {
            checkPersentSpe(rule, value, call) {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('格式不正确'))
                }
                this.deepObj();
                return call();
            },
            checkPersent(rule, value, call) {
                if(!value) {
                    // return call(new Error('不能为空'))
                    return call();
                }
                if(!/^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('格式不正确'))
                }
                this.deepObj();
                return call();
            },
            checkNum(rule, value, call) {
                console.log(value)
                if(value=="" || value==undefined) {
                    return call()
                    // return call()
                }
                if(value===0 || value==='0') {
                    return call(new Error('不能为0'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请填写正整数'))
                }
                this.deepObj();
                return call();
            },
            checkMerchant(rule, value, call) {
                if(!value && this.value.sourceOfGoods.ratio) {
                    return call(new Error('请选择关联商户'))
                }
                this.deepObj();
                return call();
            },
            noCheck(rule, value, call) {
                console.log(value)
                return call();
            },
            relation() {
                this.showDialog = true;
            },
            _resetFields(){
                this.$refs['value']? this.$refs['value'].resetFields(): null
            },
            _validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['value'].validate(v=> {
                        if(v) {
                            resolve(true);
                            let obj = {}
                            this.$emit('input', this.value);
                        }else{
                            reject(false);
                            return false;
                        }
                    })
                })
            },
            //深拷贝对象
            deepObj() {
                this.value = JSON.parse(JSON.stringify(this.value))
            }
        },
        watch: {
            detail: {
                handler(val) {
                    if(val) {
                        this.value.sourceOfGoods.merchantId = val.merchantId;
                        this.value.sourceOfGoods.merchantName = val.merchantName;
                        this.value.sourceOfGoods.merchantPhone = val.merchantPhone;
                    }
                },
                deep: true
            },
            showDialog(val) {
                val? null: this.detail = '';
            }
        }
    }
</script>

<style scoped lang="scss">
    .goods-source {
        .short-input {
            width: 200px;
        }
    }
</style>
