<template>
    <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="700px"
            :before-close="handleClose">
        <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="OS" prop="os">
                    <el-select :disabled="disable" v-model="ruleForm.os" style="width: 100%" :size="$size">
                        <el-option value="ios" label="苹果"></el-option>
                        <el-option value="android" label="安卓"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platform">
                    <el-select :disabled="disable" v-model="ruleForm.platform" style="width: 100%" :size="$size">
                        <el-option value="ua" label="晓可广场"></el-option>
                        <el-option value="ma" label="晓可商联"></el-option>
                        <el-option value="zb" label="晓可小视频"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="面额RMB" prop="amount">
                    <el-input :disabled="disable" type="number" v-model="ruleForm.amount" :size="$size"
                              placeholder="人民币"></el-input>
                </el-form-item>
                <el-form-item label="充值面额" prop="denomination">
                    <el-input :disabled="disable" type="number" v-model="ruleForm.denomination" :size="$size"
                              placeholder="晓可币"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.os === 'ios'" label="产品Id" prop="iosId">
                    <el-input :disabled="disable" v-model="ruleForm.iosId" :size="$size"
                              placeholder="ios产品ID"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="sub-btn">
            <el-button :size="$size" @click="handleClose">取 消</el-button>
            <el-button v-if="!disable" v-loading="subLoading" :size="$size" type="primary" @click="submit">确 定
            </el-button>
        </div>

    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            detail: {
                type: Object,
                default: ()=>({})
            }
        },
        watch: {
            /**
             * @author 刘峰  
             * 修改弹框，点击同一个元素不显示数据bug  
             */
            dialogVisible(val) {
                if(val) {
                    if(this.detail.id) {
                        this.detail = JSON.parse(JSON.stringify(this.detail));
                        this.detail.amount = this.$math.divide(this.detail.amount, 100);
                        this.detail.denomination = this.$math.divide(this.detail.denomination, 100);
                        this.ruleForm = this.detail;
                        this.disable = true;
                    }else{
                        this.$refs['ruleForm']? this.$refs['ruleForm'].resetFields(): null;
                        this.ruleForm = {};
                        this.disable = false;
                    }
                }
            }
        },
        data() {
            const validatePass = (rule, value, callback) => {
                if (this.ruleForm.os === 'ios') {
                    if (!this.ruleForm.iosId) {
                        return callback(new Error('请填写ios产品ID'));
                    }
                }
                callback();
            }
            return {
                disable: false,
                subLoading: false,
                ruleForm: {},
                rules: {
                    os: [
                        {required: true, message: '请选择系统', trigger: 'change'}
                    ],
                    platform: [
                        {required: true, message: '请选择平台', trigger: 'change'}
                    ],
                    amount: [
                        {required: true, message: '请填写RMB金额', trigger: 'change'}
                    ],
                    denomination: [
                        {required: true, message: '请填写晓可币金额', trigger: 'change'}
                    ],
                    iosId: [
                        {required: true, validator: validatePass, trigger: 'change'}
                    ],
                }
            }
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false)
                this.ruleForm = {};
            },
            submit() {
                this.$refs["ruleForm"].validate((valid) => {
                    if (valid) {
                        this.subLoading = true;
                        const param = JSON.parse(JSON.stringify(this.ruleForm));
                        param.denomination = this.$math.multip(param.denomination, 100);
                        param.amount = this.$math.multip(param.amount, 100);
                        this.$http.post(this.$api.createXkbDenomination, {xkbDenomination: param}, true)
                            .then(res => {
                                this.subLoading = false;
                                this.$emit("successCallback");
                                this.handleClose();
                            })
                            .catch(err => {
                                this.subLoading = false;
                                this.$message.error(err.message)
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .sub-btn {
        text-align: right;
    }
</style>