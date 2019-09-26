<template>
    <div class="confirm-send-logisitics">
        <el-dialog title="确认发货" :visible.sync="visible" width="800px" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="base-title">
                <h3>基本信息</h3>
                <el-row v-for="(item, index) in detailsSend.goods" :key="index">
                    <template v-if="item.itemStatus !== 'COMPLETE'">
                        <div style="border-bottom: 1px dashed ;padding-bottom: 10px;overflow:hidden">
                            <el-col :span="24">商品名称：{{ item.goodsName }}</el-col>
                            <el-col :span="8">商品类型：{{ item.goodsType==='NEW'?"全新":"二手" }}</el-col>
                            <el-col :span="8">商品规格：{{ item.goodsAttr }}</el-col>
                            <el-col :span="8">商品数量：{{ item.num }}</el-col>
                            <el-col :span="8">总重量：{{ item.goodsWeight }}</el-col>
                            <el-col :span="8">运费设置：{{ item.isFreeShipping==0?'不包邮': '包邮' }}</el-col>
                            <el-col :span="8">订单总金额：{{ $math.divide(item.price, 100).toFixed(2) }}元</el-col>
                        </div>
                    </template>
                </el-row>
            </div>
            <div class="base-title">
                <h3>用户信息</h3>
                <el-row>
                    <el-col :span="8">用户名：{{ detailsSend.user.nickName }}</el-col>
                    <el-col :span="8">手机号码：{{ detailsSend.user.amount }}</el-col>
                    <el-col :span="8">用户类型：{{ detailsSend.user.userType==='user'? '普通用户':  detailsSend.user.userType==='muser'? '商户': '管理员'}}</el-col>
                </el-row>
            </div>
            <div class="base-title">
                <h3>发货信息</h3>
                <el-row>
                    <el-col :span="8">收件人：{{ detailsSend.address.receiver }}</el-col>
                    <el-col :span="8">手机号码：{{ detailsSend.address.phone }}</el-col>
                    <el-col :span="24">配送地址：{{ detailsSend.address.street }}</el-col>
                    <el-col :span="24">留言：{{ detailsSend.address.remark }}</el-col>
                </el-row>
            </div>
            <el-form :model="logisticsForm" label-width="100px" label-position="left" ref="logisticsForm" :rules="rules">
                <div class="base-title">
                    <h3>物流信息</h3>
                    <el-row>
                        <el-form-item label="快递名称：" style="margin-top:10px;margin-bottom:0" prop="logisticsName">
                            <el-select :size="$size" placeholder="请选择快递名称" v-model="logisticsForm.logisticsName" style="width: 70%">
                                <el-option v-for="(item, index) in EnumLogisticsName" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快递单号：" prop="logisticsNo" v-if="logisticsForm.logisticsName !='XK'">
                            <el-input v-model.trim="logisticsForm.logisticsNo" style="width:70%" :size="$size" placeholder="填写快递单号"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
                <div class="base-title" v-if="detailsSend.order.isNeedInvoice">
                    <h3>发票信息</h3>
                    <el-row>
                        <el-form-item label="上传发票：" prop="electInvoice" ref="electInvoice">
                            <image-upload v-model="logisticsForm.electInvoice" :more="false">
                                <div class="img-show" v-if="logisticsForm.electInvoice">
                                    <img :src="logisticsForm.electInvoice" alt="">
                                </div>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </image-upload>
                        </el-form-item>
                    </el-row>
                </div>
            </el-form>
            <slot></slot>
        </el-dialog>
    </div>
</template>
<script>
    import ImageUpload from '@/components/ImageUpload.vue';
    import { EnumLogisticsName } from '@/util/publicParams.js';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            detailsSend: {
                type: Object,
                default: ()=>({
                    goods: {},
                    order: {},
                    user: {},
                    address: {}
                })
            }
        },
        components: {
            ImageUpload
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
                logisticsForm: {
                    postType: 'OWN'
                },
                rules: {
                    logisticsName: [
                        { required: true, message: '请选择快递名称', trigger: 'change'}
                    ],
                    logisticsNo: [
                        { required: true, validator: checkLogistic, trigger: 'blur' }
                    ],
                    electInvoice: [
                        { required: true, message: '请上传电子发票', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            hideDialog() {
                this.$emit('update:visible', false)
            },
            validate(call) {
                this.$refs['logisticsForm'].validate(v=>{
                    if(v) {
                        let params = {
                            orderId: this.detailsSend.orderId,
                            logisticsName: this.logisticsForm.logisticsName,
                            logisticsNo: this.logisticsForm.logisticsNo,
                            electInvoice: this.logisticsForm.electInvoice,
                            postType: this.logisticsForm.logisticsName === 'XK' ? 'OWN' : 'THIRD'
                        }
                        call(params);
                    }else{
                        return false;
                    }
                })
            }
        },
        watch: {
            visible(val) {
                val===false? this.hideDialog(): this.logisticsForm = {
                    postType: 'OWN'
                };
                this.$refs['logisticsForm']?this.$refs['logisticsForm'].resetFields():"";
            },
            "logisticsForm.electInvoice": {
                handler(val) {
                    val? this.$refs['electInvoice'].clearValidate():"";
                },
                deep: true
            }
        }
    }
</script>
<style scoped lang="scss">
    .confirm-send-logisitics {
        h3 {
            background: #ccc;
            padding: 5px 10px;
        }
        /deep/ .el-dialog__body{
            padding: 0 20px 30px;
        }
        .base-title {
            margin-top: 10px;
            /deep/ .el-row {
                padding: 0px 20px;
                .el-col {
                    margin-top: 10px;
                    font-size: 13px;
                }
            }
            .el-form-item{
                margin-bottom: 14px
            }
        }
        /deep/ .dialog-config {
                .el-row {
                    padding: 0 10px
                }
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        .img-show{
            display: inline-block;
            font-size: 0;
            border: 1px dashed #ccc;
            width: 100px;
            height: 100px;
            padding: 5px;
            overflow: hidden;
            img{
                width: 100%;
            }
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            border: 1px dashed #8c939d;
        }
        .el-upload{
            width: 100px;
            height: 100px;
        }
    }
</style>
