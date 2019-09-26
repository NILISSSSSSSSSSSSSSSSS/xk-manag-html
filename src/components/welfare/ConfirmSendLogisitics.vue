<template>
    <div class="confirm-send-logisitics">
        <el-dialog title="确认发货" :visible.sync="visible" width="800px">
            <div class="base-title">
                <h3>基本信息</h3>
                <el-row>
                    <el-col :span="8">期号：{{ detailsSend.js.termNumber }}</el-col>
                    <el-col :span="8">开奖期数：{{ detailsSend.js.currentNper }}</el-col>
                    <el-col :span="8">订单ID：{{ detailsSend.order.orderId }}</el-col>
                    <el-col :span="24">奖品名称：{{ detailsSend.goods.name }}</el-col>
                    <el-col :span="8">奖品类型：{{ detailsSend.goods.type==="substance"?"实物奖品":"虚拟奖品" }}</el-col>
                    <el-col :span="8">奖品价格：{{ $math.divide(detailsSend.goods.price, 100) }}券</el-col>
                    <el-col :span="8">奖品规格：{{ detailsSend.goods.specInfo }}</el-col>
                    <el-col :span="8">奖品用途：{{ detailsSend.goods.usage==='welfare'? '福利抽奖': '运营专用奖品' }}</el-col>
                    <el-col :span="8">邮寄方式：包邮</el-col>
                </el-row>
            </div>
            <div class="base-title">
                <h3>用户信息</h3>
                <el-row>
                    <el-col :span="8">获奖用户信息：{{ detailsSend.user.username }}</el-col>
                    <el-col :span="8">手机号码：{{ detailsSend.user.tel }}</el-col>
                    <el-col :span="24">兑奖编码：{{ detailsSend.user.lotteryNumber }}</el-col>
                </el-row>
            </div>
            <div class="base-title">
                <h3>发货信息</h3>
                <el-row>
                    <el-col :span="8">收件人：{{ detailsSend.address.receiver }}</el-col>
                    <el-col :span="8">手机号码：{{ detailsSend.address.phone }}</el-col>
                    <el-col :span="24">配送地址：{{ detailsSend.address.street || '无'}}</el-col>
                    <el-col :span="24">留言：{{ detailsSend.address.remark }}</el-col>
                </el-row>
            </div>
            <el-form :model="logisticsForm" label-width="100px" label-position="left" ref="logisticsForm" :rules="rules">
                <div class="base-title">
                    <h3>物流信息</h3>
                    <el-row>
                        <el-form-item label="快递名称：">
                            <el-row style="padding:0">
                                <el-col :span="10" style="margin-top:0">
                                    <el-radio-group v-model="logisticsForm.postType">
                                        <el-radio label="OWN">晓可自营</el-radio>
                                        <el-radio label="THIRD">第三方物流</el-radio>
                                    </el-radio-group>
                                </el-col>
                                <el-col :span="10" v-if="logisticsForm.postType==='THIRD'" style="margin-top:0">
                                    <el-form-item  prop="logisticsName">
                                        <el-select :size="$size" placeholder="请选择快递名称" v-model="logisticsForm.logisticsName" style="width: 82%">
                                            <template v-for="(item, index) in EnumLogisticsName">
                                                <el-option v-if="item.key!=='HIMSELF' && item.key!=='XK'" :key="index" :label="item.value" :value="item.key"></el-option>
                                            </template>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="快递单号：" prop="logisticsNo" v-if="logisticsForm.postType=='THIRD'">
                            <el-input v-model="logisticsForm.logisticsNo" style="width:70%" :size="$size" placeholder="填写快递单号"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
            </el-form>
            <slot></slot>
        </el-dialog>
    </div>
</template>
<script>
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
                    address: {},
                    order: {},
                    user: {},
                    js:{},
                    lotteryNumber:[]
                })
            }
        },
        data() {
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
                        { required: true, message: '不能为空', trigger: 'blur'}
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
                            orderId: this.detailsSend.order.orderId,
                            logisticsName: this.logisticsForm.postType==='OWN'? 'XK': this.logisticsForm.logisticsName,
                            logisticsNo: this.logisticsForm.logisticsNo,
                            postType: this.logisticsForm.postType
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
                val===false? this.hideDialog(): "";
                this.$refs['logisticsForm']?this.$refs['logisticsForm'].resetFields():"";
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
