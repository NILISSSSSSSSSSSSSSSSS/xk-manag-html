<template>
    <el-dialog title="短信渠道详情" width="500px" top="50px" :visible.sync="dialog" :before-close="handleClose">
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">渠道：</el-col>
            <el-col :span="16">{{getChannel(detailForm.channel)}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">模板号：</el-col>
            <el-col :span="16">{{detailForm.code}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">模板内容：</el-col>
            <el-col :span="16">{{detailForm.template}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">短信类型：</el-col>
            <el-col :span="16">{{getSmsType(detailData.smsType)}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">短信业务类型：</el-col>
            <el-col :span="16">{{getBizType(detailData.bizType)}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">发送限制：</el-col>
            <el-col :span="16">{{detailData.unitTime}}秒内可以发送{{detailData.sendTime}}次</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">短信有效期：</el-col>
            <el-col :span="16">{{detailData.effectiveTime}}s</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">使用平台：</el-col>
            <el-col :span="16">{{getAppName(detailData.app)}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">签名：</el-col>
            <el-col :span="16">{{detailData.sign}}</el-col>
        </el-row>
        <div class="content">
            <el-button :size="$size" type="plain" @click="handleClose">返回</el-button>
             <el-button :size="$size" type="primary" @click="handleClose">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { SmsType, BizType } from "@/util/publicParams"

export default {
    name: 'InfoTemplateDetail',
    props: {
        detailDialog: {
            type: Boolean,
            default: false
        },
        detailData: {
            type: Object,
            default: ()=>({})
        },
        smsTemplateEnum: {
            type: Array,
            default: ()=>[]
        }
    },
    data() {
        return {
            detailForm: [],
            dialog: false
        }
    },
    watch: {
        detailDialog(val) {
            this.dialog = val
        },
        detailData(val) {
            console.log(val)
            this.detailForm = val
        }
    },
    methods: {
        getChannel(val) { // 渠道
            switch (val) {
                case "ALIYUN":
                    return "阿里云短信";
                default:
                    return "腾讯云短信";
            }
    },
        getSmsType(val) { // 短信类型
            let typeName = '';
            for(let type of SmsType) {
                if(val === type.key) {
                    typeName = type.value;
                }
            }
            return typeName;
        },
        getBizType(val) { // 短信业务类型
            let name = ''
            for(let item of this.smsTemplateEnum) {
               if(Object.keys(item)[0] === val) {
                   name = item[val]
                   break;
               }
            }
            return name;
        },
        // getSmsType(val) { // 短信类型
        //     switch(val) {
        //         case "AUTH":
        //             return "短信验证码";
        //         case "NOTIFY":
        //             return "通知";
        //         case "EXTENSION":
        //             return "推广短信";
        //         default: 
        //             return val
        //     }
        // },
        // getBizType(val) { // 短信业务类型
        //     switch(val) {
        //         case "REGISTER":
        //             return "注册";
        //         case "LOGIN":
        //             return "登录";
        //         case "RESET_PASSWORD":
        //             return "密码重置";
        //         case "RESET_PHONE":
        //             return "修改手机号";
        //         case "BIND_PHONE":
        //             return "绑定手机号";
        //         case "CREATE_BIND_CODE":
        //             return "创建授权码";
        //         case "SEND_BIND_CODE":
        //             return "发送授权码";
        //         case "BIND_SHOP":
        //             return "绑定店铺";
        //         case "DELETE_EMPLOYEE":
        //             return "删除员工";
        //         case "UNBIND_SHOP":
        //             return "解绑店铺";
        //         case "LIGHTEN_SECURITY_CODE":
        //             return "点亮安全码";
        //         case "EXTINGUISH_SECURITY_CODE":
        //             return "熄灭安全码";
        //         case "NEW_BIND_SECURITY_CODE":
        //             return "新绑定安全码";
        //         case "BIND_BANK_CARD":
        //             return "新增银行卡";
        //         case "CREATE_SHOP_BIND_MANAGER_PHONE":
        //             return "创建管理员";
        //         case "RESET_MANAGER_PHONE":
        //             return "修改管理员手机";
        //         case "CREATE_EMPLOYEE":
        //             return "新增员工";
        //         case "RESET_EMPLOYEE_PHONE":
        //             return "修改员工手机号";
        //         default: 
        //             return val
        //     }
        // },
        getAppName(val) { // 平台名称
            switch(val) {
                 case "ua":
                    return "晓可广场APP";
                case "ma":
                    return "晓可联盟APP";
                case "mam":
                    return "晓可联盟商户后台";
                case "ca":
                    return "客服APP";
                case "da":
                    return "骑手APP";
                case "zb":
                    return "晓可直播APP";
                case "om":
                    return "晓可广场web后台";
                default: 
                    return val
            }
        },
        handleClose() {
            this.$emit("update:detailDialog", false)
        }
    }
}
</script>

<style lang="scss" scoped>
    .rowClass {
        margin-bottom: 15px;
    }
    .labelClass {
        padding-left: 30px;
    }
    .content {
        text-align: center;
    }
    .danger {
        color: #F56C6C;
    }
    .warning {
        color:#E6A23C;
    }
    .success {
        color: #67C23A;
    }
</style>
