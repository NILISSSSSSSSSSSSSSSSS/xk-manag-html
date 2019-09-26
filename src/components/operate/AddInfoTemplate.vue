<template>
    <el-dialog title="短信模板配置" :visible.sync="dialogVisible" :before-close="handleClose" width="600px">
        <el-form :rules="rules" ref="templateForm" label-width="120px" label-position="right" :model="templateForm">
            <el-form-item label="渠道：" prop="channel">
                <el-row>
                    <el-col :span="20">
                        <el-select v-model="templateForm.channel" prop="channel" :size="$size" style="width: 100%">
                            <el-option v-for="(item, index) in activeType" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="模板号：" prop="code">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="templateForm.code"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
             <el-form-item label="模板内容：" prop="template">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" type="textarea" :autosize="{minRows: 3, maxRows:5}" v-model="templateForm.template"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="短信类型：" prop="smsType">
                <el-row>
                    <el-col :span="20">
                       <el-select v-model="templateForm.smsType" :size="$size" style="width:100%">
                           <el-option v-for="(item, index) in infoType" :key="index" :label="item.value" :value="item.key"></el-option>
                       </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="短信业务类型：" prop="bizType">
                <el-row>
                    <el-col :span="20">
                        <el-select v-model="templateForm.bizType" :size="$size" style="width:100%" v-if="templateForm.smsType === 'AUTH' || !templateForm.smsType">
                           <el-option v-for="(item, index) in authType" :key="index" :label="item[Object.keys(item)[0]]" :value="Object.keys(item)[0]"></el-option>
                       </el-select>
                       <el-select v-model="templateForm.bizType" :size="$size" style="width:100%" v-if="templateForm.smsType === 'NOTIFY'">
                           <el-option v-for="(item, index) in notifyType" :key="index" :label="item[Object.keys(item)[0]]" :value="Object.keys(item)[0]"></el-option>
                       </el-select>
                       <el-select v-model="templateForm.bizType" :size="$size" style="width:100%" v-if="templateForm.smsType === 'EXTENSION' && extensionType.length > 0">
                           <el-option v-for="(item, index) in extensionType" :key="index" :label="item[Object.keys(item)[0]]" :value="Object.keys(item)[0]"></el-option>
                       </el-select>
                       <el-select v-model="templateForm.bizType" :size="$size" style="width:100%" v-if="templateForm.smsType === 'EXTENSION' && extensionType.length == 0">
                           <el-option  key="item" label="暂无" value="NOT"></el-option>
                       </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发送限制：" v-if="templateForm.smsType === 'AUTH'">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="unitTime">
                            <el-col :span="12">
                                <el-input :size="$size" v-model="templateForm.unitTime"></el-input>
                            </el-col>
                            <el-col :span="12" style="text-align: center">秒内可发送</el-col>
                        </el-form-item>
                    </el-col>
                     <el-col :span="8">
                        <el-form-item prop="sendTime">
                            <el-col :span="18">
                                <el-input :size="$size" v-model="templateForm.sendTime"></el-input>
                            </el-col>
                            <el-col :span="6" style="text-align: center">次</el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="短信有效期：" prop="effectiveTime" v-if="templateForm.smsType === 'AUTH'">
                <el-row>
                    <el-col :span="18">
                        <el-input :size="$size" v-model="templateForm.effectiveTime"></el-input>
                    </el-col>
                    <el-col :span="2" style="text-align:center">秒</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="使用平台：" >
                <el-row>
                    <el-col :span="9">
                        <el-form-item prop="app">
                            <el-select v-model="templateForm.app" :size="$size" style="width:100%">
                            <el-option v-for="(item, index) in platform" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&emsp;</el-col>
                    <el-col :span="9">
                        <el-form-item prop="sign">
                        <el-input :size="$size" v-model="templateForm.sign" placeholder="签名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <div class="content">
                <el-button :size="$size" type="primary" @click="handleSubmit" :loading="loading" :disabled="!activeType">保存</el-button>
                <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { SmsType, AuthType, NotifyType, ExtensionType, BizType } from "@/util/publicParams"
export default {
    name: 'AddInfoChannel',
    props: {
        addDialog: {
            type: Boolean,
            default: false
        },
       formData: {
            type: Object,
            default: ()=>({})
        },
        authType: {
            type: Array,
            default: ()=>[]
        },
        notifyType: {
            type: Array,
            default: ()=>[]
        },
        extensionType: {
            type: Array,
            default: ()=>[]
        }
    },

    data() {
        return {
            dialogVisible: false,
            templateForm: [],
            rules: {
                channel: [{required: true, message: "不能为空"}],
                code: [{required: true, message: "不能为空"}],
                template: [{required: true, message: "不能为空"}],
                smsType: [{required: true, message: "不能为空"}],
                bizType:[{required: true, message: "不能为空"}],
                unitTime: [{required: true, message: "不能为空"}],
                sendTime: [{required: true, message: "不能为空"}],
                effectiveTime: [{required: true, message: "不能为空"}],
                app: [{required: true, message: "不能为空"}],
                sign: [{required: true, message: "不能为空"}],
            },
            type: [ // 渠道
                {
                    label:" 阿里云短信",
                    value: 'ALIYUN'
                }, 
                {
                    label: "腾讯云短信",
                    value: "TENCENT"
                }
            ],
            infoType: SmsType,
            // authType: AuthType,
            // notifyType: NotifyType,
            // extensionType: ExtensionType,
            // authType: [ // 短信验证码类型
            //     {
            //         label: "注册",
            //         value: "REGISTER"
            //     }, {
            //         label: "登录",
            //         value: "LOGIN"
            //     }, {
            //         label: "密码重置",
            //         value: "RESET_PASSWORD"
            //     }, {
            //         label: "修改手机号",
            //         value: "RESET_PHONE"
            //     }, {
            //         label: "绑定手机号",
            //         value: "BIND_PHONE"
            //     }, {
            //         label: "创建授权码",
            //         value: "CREATE_BIND_CODE"
            //     }, {
            //         label: "绑定店铺",
            //         value: "BIND_SHOP"
            //     }, {
            //         label: "删除员工",
            //         value: "DELETE_EMPLOYEE"
            //     }, {
            //         label: "解绑店铺",
            //         value: "UNBIND_SHOP"
            //     }, {
            //         label: "新增银行卡",
            //         value: "BIND_BANK_CARD"
            //     }, {
            //         label: "创建管理员",
            //         value: "CREATE_SHOP_BIND_MANAGER_PHONE"
            //     }, {
            //         label: "修改管理员手机号",
            //         value: "RESET_MANAGER_PHONE"
            //     }, {
            //         label: "新增员工",
            //         value: "CREATE_EMPLOYEE"
            //     }, {
            //         label: "修改员工手机号",
            //         value: "RESET_EMPLOYEE_PHONE"
            //     }
            // ],
            // notifyType: [ // 通知类型
            //     {
            //         label: "发送授权码",
            //         value: "SEND_BIND_CODE"
            //     }, {
            //         label: "点亮安全码",
            //         value: "LIGHTEN_SECURITY_CODE"
            //     }, {
            //         label: "熄灭安全码",
            //         value: "EXTINGUISH_SECURITY_CODE"
            //     }, {
            //         label: "新绑定安全码",
            //         value: "NEW_BIND_SECURITY_CODE"
            //     }
            // ],
            // extensionType: [ // 推广短信类型
            //     {
            //         label: "暂无",
            //         value: ""
            //     }
            // ],
            platform: [{ // 平台类型
                label: "晓可广场APP",
                value: "ua"
            }, {
                label: "晓可联盟APP",
                value: "ma"
            }, {
                label: "晓可联盟商户后台",
                value: "mam"
            }, {
                label: "客服APP",
                value: "ca"
            }, {
                label: "骑手APP",
                value: "da"
            }, {
                label: "晓可直播APP",
                value: "zb"
            }, {
                label: "晓可广场web后台",
                value: "om"
            }, {
                label: "微信",
                value: "wx"
            }],
            loading: false,
            activeType: [] // 存在并且激活的短信渠道
        }
    },
    created(){
        this.getChannel();
    },
    watch: {
       addDialog(val) {
            this.dialogVisible = val
        },
        formData(val) {
            this.templateForm = val
        }
    },
    methods: {
        handleClose() {
            this.dialogVisible = false;
            this.$emit('update:addDialog', false)
            this.$refs["templateForm"].resetFields();
        },
        getChannel() {
            this.$http.get(this.$api.smsChannelPage, {status: "active", limit: 0}, true)
            .then(res => {
                for(let item of res.data) {
                    if(item.channel === "ALIYUN") {
                        this.activeType.push({label: "阿里云短信", value: "ALIYUN"})
                    } else if(item.channel === "TENCENT") {
                        this.activeType.push({label: "腾讯云短信", value: "TENCENT"})
                    } else {
                        this.activeType = []
                    }
                }
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        handleSubmit() {
            this.$refs["templateForm"].validate((val) => {
                if(val) {
                    if(this.templateForm.id) {
               this.loading = true
               this.$http.get(this.$api.smsTemplateConfigUpdate, this.templateForm, true)
               .then(res => {
                   this.loading = false;
                  this.dialogVisible = false;
                  this.$emit('update:addDialog', false)
                  this.$emit("success")
                  this.$message.success("编辑成功")
               })
               .catch(err => {
                   this.loading =false;
                   this.dialogVisible = false;
                   this.loading = false;
                   this.$emit('update:addDialog', false)
                   this.$emit("success")
                   this.$message.error(err.message)
               })
           }
           else {
               let paramList = {
               channel: this.templateForm.channel,
               code: this.templateForm.code,
               template: this.templateForm.template,
               smsType: this.templateForm.smsType,
               bizType: this.templateForm.bizType,
               unitTime: this.templateForm.unitTime,
               sendTime: this.templateForm.sendTime,
               effectiveTime: this.templateForm.effectiveTime,
               app: this.templateForm.app,
               sign: this.templateForm.sign
           }
           console.log("添加")
           console.log(paramList)
           this.loading = true
           this.$http.get(this.$api.smsTemplateConfigCreate, paramList, true)
           .then(res => {
               this.loading =false;
               this.$emit('update:addDialog', false)
               this.$emit("success")
               this.$message.success("创建成功")
           })
           .catch(err => {
               this.loading = false;
               this.$emit('update:addDialog', false)
               this.$emit("success")
               this.$message.error(err.message)
           })
           }
                } else {
                    return false;
                }
            })
        },
        // handleSubmit() {
        //    if(this.templateForm.id) {
        //        this.loading = true
        //        this.$http.get(this.$api.smsTemplateConfigUpdate, this.templateForm, true)
        //        .then(res => {
        //            this.loading = false;
        //           this.dialogVisible = false;
        //           this.$emit('update:addDialog', false)
        //           this.$emit("success")
        //           this.$message.success("编辑成功")
        //        })
        //        .catch(err => {
        //            this.loading =false;
        //            this.dialogVisible = false;
        //            this.loading = false;
        //            this.$emit('update:addDialog', false)
        //            this.$emit("success")
        //            this.$message.error(err.message)
        //        })
        //    }
        //    else {
        //        let paramList = {
        //        channel: this.templateForm.channel,
        //        code: this.templateForm.code,
        //        template: this.templateForm.template,
        //        smsType: this.templateForm.smsType,
        //        bizType: this.templateForm.bizType,
        //        unitTime: this.templateForm.unitTime,
        //        sendTime: this.templateForm.sendTime,
        //        effectiveTime: this.templateForm.effectiveTime,
        //        app: this.templateForm.app,
        //        sign: this.templateForm.sign
        //    }
        //    console.log("添加")
        //    console.log(paramList)
        //    this.loading = true
        //    this.$http.get(this.$api.smsTemplateConfigCreate, paramList, true)
        //    .then(res => {
        //        this.loading =false;
        //        this.$emit('update:addDialog', false)
        //        this.$emit("success")
        //        this.$message.success("创建成功")
        //    })
        //    .catch(err => {
        //        this.loading = false;
        //        this.$emit('update:addDialog', false)
        //        this.$emit("success")
        //        this.$message.error(err.message)
        //    })
        //    }
        // },
    }
}
</script>

<style lang="scss" scoped>
.content {
    text-align: center;
}

</style>
