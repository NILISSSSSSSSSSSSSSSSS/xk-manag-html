<template>
    <div class="examine-order">
        <el-dialog title="退货审核" :visible.sync="visible" width="600px">
            <el-form :model="rejectForm" label-width="120px" ref="rejectForm">
                <el-form-item label="申请退货商品：">
                    <p v-for="(item, index) in detail.goodsName" :key="index"><strong>商品{{index+1}}：</strong>{{ item }}</p>
                </el-form-item>
                <el-form-item label="退货原因：">{{ detail.refundReason }}</el-form-item>
                <el-form-item label="退货说明：">{{ detail.refundMessage || '无' }}</el-form-item>
                <el-form-item label="图片描述：" v-if="detail.refundEvidence">
                    <image-list v-for="(item, index) in detail.refundEvidence" 
                                :url="item.refundPic"
                                :type="item.refundVideo? 'video': 'image'"
                                :videoUrl="item.refundVideo"
                                :key="index"></image-list>
                </el-form-item>
                <el-form-item label="人工审核：">
                    <el-radio-group v-model="radio">
                        <el-radio label="1">同意</el-radio>
                        <el-radio label="2">不同意</el-radio>
                    </el-radio-group>
                    <el-input 
                            v-if="radio=='2'" 
                            style="margin-bottom:10px" 
                            placeholder="输入不通过原因" 
                            type="textarea" 
                            resize="none" 
                            v-model="refundReason"
                            :autosize="{ minRows: 6, maxRows: 6}"></el-input>
                </el-form-item>
                <template v-if="detail.refundType !=='REFUND' && radio==1">
                    <el-form-item label="平台收货地址：" prop="refundAddress" :rules="rules.refundAddress">
                        <el-input :size="$size" placeholder="输入收货地址" v-model="rejectForm.refundAddress"></el-input>
                    </el-form-item>
                    <el-form-item class="marintop20" label="平台联系电话：" prop="refundPhone" :rules="rules.refundPhone">
                        <el-input :size="$size" placeholder="输入联系电话" v-model="rejectForm.refundPhone"></el-input>
                    </el-form-item>
                    <el-form-item class="marintop20" label="平台联系人：" prop="refundReceiver" :rules="rules.refundReceiver">
                        <el-input :size="$size" placeholder="输入联系人姓名" v-model="rejectForm.refundReceiver"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <slot></slot>
        </el-dialog>
    </div>
</template>
<script>
    import ImageList from '@/components/common/ImageList.vue';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            detail: {
                type: Object,
                default: ()=>({})
            }
        },
        components: {
            ImageList
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
                rejectForm: {},
                radio: '1',
                refundReason: '',
                rules: {
                    refundReceiver: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    refundAddress: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    refundPhone: [
                        { required: true, validator: checkPhone, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            hideDialog() {
                this.rejectForm = {};
                this.refundReason = "";
                this.$emit("update:visible", false)
            },
            validate(call) {
                this.$refs['rejectForm'].validate(v=>{
                    if(v){
                        let params = {
                            refundId: this.detail.refundId
                        }
                        let url = this.$api.mallOrderRefundAccept;
                        if(this.radio === '2') {
                            if(!this.refundReason) {
                                this.$message.warning('请填写拒绝原因');
                                return false;
                            }
                            url = this.$api.mallOrderRefundRefused;
                            params.refundReason = this.refundReason;
                            call(params, url);
                        }else {
                            if(this.detail.refundType){
                                params.refundAddress = this.rejectForm.refundAddress;
                                params.refundPhone = this.rejectForm.refundPhone;
                                params.refundReceiver = this.rejectForm.refundReceiver
                            }
                            call(params, url);
                        }
                    }else{
                        return false;
                    }
                    
                })
                
            }
        },
        watch: {
            visible(val) {
                val===false? this.hideDialog(): this.$refs['rejectForm']?this.$refs['rejectForm'].clearValidate(): null
            }
        }
    }
</script>
<style scoped lang="scss">
    .examine-order{
        .left{
            float: left;
        }
        /deep/ .el-form-item{
            margin-bottom: 0
        }
    }
</style>
