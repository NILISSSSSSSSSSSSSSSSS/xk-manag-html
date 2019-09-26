<template>
    <div class="complete-trade">
        <el-dialog :visible.sync="visible" :title="status? '确认交易': '完成交易'" :close-on-click-modal="false" width="500px" :before-close="beforeClose">
            <el-form label-width="150px" ref="tradeForm" :model="tradeForm">
                <el-form-item label="订单ID：">{{ orderId }}</el-form-item>
                <el-form-item label="下单时间：">{{ detail.createdAt | formatTime }}</el-form-item>
                <el-form-item label="特惠价：">{{ detail.specialPrice }}元</el-form-item>
                <el-form-item label="预约金：">{{ detail.subscribePrice }}元</el-form-item>
                <el-form-item label="进货价：">{{ detail.costPrice }}元</el-form-item>
                <xk-form-item label="交易价格：" prop="tradePrice" type="money">
                    <el-row>
                        <el-col :span="15" v-if="!status">
                            <el-input :size="$size" v-model.trim.number="tradeForm.tradePrice"></el-input>
                        </el-col>
                        <el-col :span="9">&nbsp;&nbsp;&nbsp;<template v-if="status">{{ tradeForm.tradePrice }}</template>元</el-col>
                    </el-row>
                </xk-form-item>
                <xk-form-item label="商品收益：" prop="orderIncome" type="money">
                    <el-row>
                        <el-col :span="15" v-if="!status">
                            <el-input :size="$size" v-model.trim.number="tradeForm.orderIncome"></el-input>
                        </el-col>
                        <el-col :span="9">&nbsp;&nbsp;&nbsp;<template v-if="status">{{ tradeForm.orderIncome }}</template>元</el-col>
                    </el-row>
                </xk-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="cancle()">{{ status? '返回修改': '取消' }}</el-button>
                <el-button :size="$size" :loading="confirmLoading" type="primary" @click="confirm('tradeForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import XkFormItem from '@/components/common/XKFormItem.vue';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            orderId: String
        },
        components: {
            XkFormItem
        },
        data() {
            return {
                tradeForm: {},
                confirmLoading: false,
                status: false,
                detail: {}
            }
        },
        methods: {
            beforeClose() {
                this.status = false;
                this.tradeForm ={};
                this.closeDia();
            },
            closeDia() {
                this.$emit('update:visible', false)
            },
            cancle() {
                if(!this.status) {
                    this.closeDia()
                }else{
                    this.status = !this.status;
                }
            },
            getDetail() {
                this.$http.get(this.$api.mallOrderDetail, {orderId: this.orderId}, true)
                .then(res=>{
                    console.log(res)
                    this.detail = {
                        createdAt: res.order.createdAt, //下单时间
                        specialPrice: this.$math.divide(res.goods[0].specialPrice, 100), //特惠价
                        subscribePrice: this.$math.divide(res.goods[0].price, 100),   //预约金
                        costPrice: this.$math.divide(res.goods[0].costPrice, 100)     //进货价
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            confirm(formName) {
                if(!this.status) {
                    this.$refs[formName].validate(v=>{
                        if(v) {
                            console.log();
                            this.status = true;
                        }else{
                            return false;
                        }
                    })
                }else{
                    this.confirmLoading = true;
                    let params = {
                        orderId: this.orderId,
                        tradePrice: this.$math.multip(this.tradeForm.tradePrice, 100),
                        orderIncome: this.$math.multip(this.tradeForm.orderIncome, 100)
                    }
                    this.$http.post(this.$api.confirmOrderByBigGoods, params, true)
                    .then(res=>{
                        this.confirmLoading = false;
                        this.status = false;
                        this.closeDia();
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        this.confirmLoading = false;
                    })
                }
            }
        },
        watch: {
            visible(val) {
                if(val) {
                    this.$refs['tradeForm']? this.$refs['tradeForm'].resetFields(): null;
                    this.getDetail();
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .complete-trade {

    }
</style>
