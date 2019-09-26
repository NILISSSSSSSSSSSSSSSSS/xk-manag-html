
<template>
    <!-- 修改运费 -->
    <div class="confirm-send-logistics">
        <el-dialog title="修改订单总金额" :visible.sync="visible" class="dialog-price" width="600px">
            <el-form :model="modifyPriceForm" label-width="170px" ref="modifyPriceForm">
                <el-form-item label="订单ID：">
                    {{ detail.orderId }}
                </el-form-item>
                <el-form-item label="下单时间：">{{ detail.createdAt | formatTime }}</el-form-item>
                <el-form-item label="参与活动促销：" v-if="detail.type">{{ detail.memberName ? detail.memberName: detail.couponName }}</el-form-item>
                <el-form-item label="使用优惠券/折扣卡：" v-else>无</el-form-item>
                <el-form-item label="商品总价格：">{{ detail.totalMoney? $math.divide(detail.totalMoney, 100).toFixed(2): 0 }}元</el-form-item>
                <el-form-item label="会员折扣：" v-if="detail.type === 'member'">{{ detail.discountMoney? $math.divide(detail.discountMoney, 100).toFixed(2): '0' }}元</el-form-item>
                <el-form-item label="抵扣/满减总金额：" v-else>{{ detail.discountMoney? $math.divide(detail.discountMoney, 100).toFixed(2): '0' }}元</el-form-item>
                <el-form-item label="运费：">{{ detail.postFee? $math.divide(detail.postFee, 100).toFixed(2): 0 }}元</el-form-item>
                <el-form-item label="订单总金额：">{{ detail.payMoney? $math.divide(detail.payMoney, 100).toFixed(2): 0 }}元</el-form-item>
                <el-form-item label="修改运费为：" :rules="rules.updatePrice" prop="updatePrice">
                    <el-input v-if="visible" :size="$size" :placeholder="`${detail.postFee? $math.divide(detail.postFee, 100).toFixed(): 0}`" style="width: 60%" v-model.trim="modifyPriceForm.updatePrice"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;元
                </el-form-item>
                <el-form-item label="修改后订单总金额为：">{{ modifyPriceForm.updatePrice&& $math.divide(modifyPriceForm.updatePrice, 100)? $math.sub($math.sub($math.divide(detail.payMoney,100), ( $math.sub($math.divide(detail.postFee,100) , modifyPriceForm.updatePrice) ))).toFixed(2): $math.divide(updatePriceTotal, 100).toFixed(2) }}元</el-form-item>
            </el-form>
            <slot :row="submitData"></slot>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: true
            },
            detail:{
                type: Object,
                default: ()=>({
                    postFee: 0
                })
            }
        },
        data() {
            const checkNum = (rule, value, call) =>{
                if(value==0 || !value) {
                    return call();
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                    return call(new Error('运费格式不正确，请输入两位小数或正数'))
                }
                call();
            }
            return {
                modifyPriceForm: {},
                submitData: {},
                updatePriceTotal: 0,
                rules: {
                    updatePrice: [
                        { validator: checkNum, trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            hideDialog() {
                this.$emit('update:visible', false);
            },
            validate(call) {
                this.$refs['modifyPriceForm'].validate(v=>{
                    if(v) {
                        let params = {
                            orderId: this.detail.orderId,
                            postFee: this.modifyPriceForm.updatePrice!==''? this.$math.multip(this.modifyPriceForm.updatePrice, 100): this.detail.postFee!=0 ? this.detail.postFee : 0
                        }
                        call(params)
                    } else {

                        return false;
                    }
                })
                
            }
        },
        watch: {
            visible(val) {
                val===false?this.hideDialog(): (this.updatePriceTotal = this.detail.payMoney, this.$set(this.modifyPriceForm, 'updatePrice', ""));
            },
            "modifyPriceForm.updatePrice": {
                handler(val) {
                    !val? this.updatePriceTotal = this.detail.payMoney:"";
                },
                deep: true
            }
        }
    }
</script>
<style scoped lang="scss">
    .confirm-send-logistics {
        .deliver-title {
            padding: 0 0 10px 10px;
            font-weight: bolder;
            border-bottom: 1px solid #ccc;
            margin-top: 20px;
            &:first-child {
                margin-top: 0;
            }
        }
    }
    .dialog-price {
        .el-form-item {
            margin-bottom: 0;
        }
    }
</style>
