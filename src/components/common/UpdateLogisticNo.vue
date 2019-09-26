<template>
    <div class="update-logistic-no">
        <el-dialog :visible.sync="visible" title="修改物流" :before-close="close" width="500px">
            <el-form :model="logisticForm" ref="logisticForm" label-width="120px" :rules="rules">
                <el-form-item label="快递名称：" prop="logisticsName">
                    <el-select :size="$size" v-model="logisticForm.logisticsName" style="width: 100%">
                        <el-option v-for="item in EnumLogisticsName" :key="item.key" :value="item.key" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号：" v-if="logisticForm.logisticsName!=='XK'" prop="logisticsNo">
                    <el-input :size="$size" v-model="logisticForm.logisticsNo"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="close()">取消</el-button>
                <el-button :size="$size" @click="confirm()">确定</el-button>
            </div>
        </el-dialog>
        <rider :riderDialog.sync="riderDialog" :orderId="orderId" :weight="goodsWeight" :xkModule="type==='mall'? 'mall':'jf_mall'"></rider>    
    </div>
</template>
<script>
    import Rider from "@/components/goods/Rider.vue"
    import { EnumLogisticsName } from '@/util/publicParams.js';

    export default {
        components: {
            Rider
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            /**
             * mall  自营商城
             * j_mall  夺奖派对
             */
            type: {
                default: 'mall',
                type: String
            },
            orderType: {
                default: "",
                type: String
            },
            goodsWeight: 0,
            orderId: String    //订单ID
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
                EnumLogisticsName,
                visible: false,
                riderDialog: false,
                rules: {
                    logisticsName: [
                        { required: true, message: '请选择快递名称', trigger: 'change'}
                    ],
                    logisticsNo: [
                        { required: true, validator: checkLogistic, trigger: 'blur' }
                    ]
                },
                logisticForm: {}
            }
        },
        methods: {
            close() {
                this.$emit('update:visible', false)
            },
            confirm() {
                this.$refs['logisticForm'].validate(v => {
                    if(v) {
                        if(this.logisticForm.logisticsName!=='XK'){
                            let params = {
                                logisticsName: this.logisticForm.logisticsName,
                                orderId: this.orderId,
                                postType: 'THIRD',
                                logisticsNo: this.logisticForm.logisticsNo
                            }
                            params.orderType= this.orderType==='refund'? 'REFUND': 'NORMAL';
                            // 福利订单售后有这个字段
                            let url = this.type==='mall'? this.$api.sOrderUpdateLogistics: this.$api.jOrderUpdateLogistics;
                            this.$http.post(url, params, true).then(res=>{
                                this.$message.success('修改成功！');
                                this.close();
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
                !val? this.close(): null;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .update-logistic-no {

    }
</style>