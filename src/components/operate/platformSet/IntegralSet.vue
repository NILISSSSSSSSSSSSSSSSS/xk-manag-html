<template>
    <div v-loading="loading">
            <el-form :model="integralForm" lable-position="right"  ref="integralForm">
                <el-form-item label="消费消费券：" label-width="150px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item :prop="'xfqSetData.amount'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.xfqSetData.amount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">换算等级积分</el-col>
                        <el-col :span="3">
                            <el-form-item :prop="'xfqSetData.integral'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.xfqSetData.integral"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="消费现金（RMB）：" label-width="150px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item :prop="'rmbData.amount'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.rmbData.amount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">换算等级积分</el-col>
                        <el-col :span="3">
                            <el-form-item :prop="'rmbData.integral'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.rmbData.integral"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="用户收到消费券：" label-width="150px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item :prop="'xfqGetData.amount'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.xfqGetData.amount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">换算等级积分</el-col>
                        <el-col :span="3">
                            <el-form-item :prop="'xfqGetData.integral'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.xfqGetData.integral"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="用户收到钻石：" label-width="150px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item :prop="'zsData.amount'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.zsData.amount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">换算等级积分</el-col>
                        <el-col :span="3">
                            <el-form-item :prop="'zsData.integral'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.zsData.integral"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="用户收到晓可币：" label-width="150px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item :prop="'xkbData.amount'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.xkbData.amount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">换算等级积分</el-col>
                        <el-col :span="3">
                            <el-form-item :prop="'xkbData.integral'" :rules="rules.checkValue">
                                <el-input :size="$size" v-model.number="integralForm.xkbData.integral"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="content">
                <el-button :size="$size" type="primary" @click="setIntergral" :loading="btnLoading" v-permission="'integralSet'">保存</el-button>
            </div>
    </div>
</template>
<script>
export default {
    name:'integralSet',
    props: {
        name: {
            type: String,
            default: 'second'
        }
    },
    data () {
        let checkValue = (rule, value, callback) => {
            if(!value) {
                callback(new Error("不能为空"));
            } else if(!/^[1-9]\d*$/.test(value)) {
                callback(new Error("请输入正整数"));
            } else {
                callback();
            }
        }
        return {
            integralForm: {
                xfqGetData: {},
                xfqSetData: {},
                rmbData: {},
                zsData: {},
                xkbData: {}  
            },
            rules: {
               checkValue: [{validator: checkValue}],
            },
            loading: false,
            btnLoading: false,
        }
    },
    watch: {
        name(val) {
            if(val === 'second') {
                this.getIntergralDetail();
            }
        }
    },
    methods: {
        getIntergralDetail() { // 获取设置详情
            this.loading = true
            this.$http.get(this.$api.XkUserLevelSettingDetail, {}, true)
            .then(res => {
                this.loading = false;
                if(res.xkUserConsumes.length > 0) {
                    // this.integralForm = this.integralForm
                    for(let item of res.xkUserConsumes) {
                        if(item.currency === 'xfq' && item.billType=== 'fo') {
                            this.integralForm.xfqSetData = item
                        } 
                        if(item.currency === 'xfq' && item.billType=== 'fi') {
                            this.integralForm.xfqGetData = item
                        }
                        if(item.currency === 'rmb') {
                            this.integralForm.rmbData = item
                        }
                        if(item.currency === 'zs') {
                            this.integralForm.zsData = item
                        }
                        if(item.currency === 'xkb') {
                            this.integralForm.xkbData = item
                        }
                    }
                }
                else {
                   this.integralForm = this.integralForm
                }
            })
            .catch(err => {
                this.loading =false;
                this.$message.error(err.message)
            })
        },
        setIntergral() { // 设置积分
            this.$refs["integralForm"].validate((valid) => {
                if(valid) {
                    let paramList = {
                        xkUserConsumes: [
                            {
                                currency: 'xfq',
                                amount: this.integralForm.xfqSetData.amount,
                                integral: this.integralForm.xfqSetData.integral,
                                billType: 'fo'
                            },
                            {
                                currency: 'xfq',
                                amount: this.integralForm.xfqGetData.amount,
                                integral: this.integralForm.xfqGetData.integral,
                                billType: 'fi'
                            },
                            {
                                currency: 'rmb',
                                amount: this.integralForm.rmbData.amount,
                                integral: this.integralForm.rmbData.integral,
                                billType: 'fo'
                            },
                            {
                                currency: 'zs',
                                amount: this.integralForm.zsData.amount,
                                integral: this.integralForm.zsData.integral,
                                billType: 'fi'
                            },
                            {
                                currency: 'xkb',
                                amount: this.integralForm.xkbData.amount,
                                integral: this.integralForm.xkbData.integral,
                                billType: 'fi'
                            },
                        ]
                    }
                    this.btnLoading = true;
                    this.$http.get(this.$api.xkUserLevelSetting, paramList, true)
                    .then(res => {
                        this.btnLoading = false;
                        this.$message.success("保存成功");
                    })
                    .catch(err => {
                        this.btnLoading = false;
                        this.$message.error(err.message);
                    })
                } else {
                    return false;
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
 .content {
     text-align: center;
 }
</style>