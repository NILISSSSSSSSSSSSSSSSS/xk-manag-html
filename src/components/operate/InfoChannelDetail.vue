<template>
    <el-dialog title="短信渠道详情" width="500px" top="50px" :visible.sync="detailDialog" :before-close="handleClose">
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">渠道：</el-col>
            <el-col :span="16">{{getChannel(detailData.channel)}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">产品：</el-col>
            <el-col :span="16">{{detailData.product}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">域名：</el-col>
            <el-col :span="16">{{detailData.domain}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">APPid：</el-col>
            <el-col :span="16">{{detailData.appId}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">秘钥：</el-col>
            <el-col :span="16">{{detailData.secret}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">前占位符：</el-col>
            <el-col :span="16">{{detailData.placeholderPrefix}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">后占位符：</el-col>
            <el-col :span="16">{{detailData.placeholderSuffix}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">优先级：</el-col>
            <el-col :span="16">{{detailData.index}}</el-col>
        </el-row>
        <el-row class="rowClass">
            <el-col :span="8" class="labelClass">状态：</el-col>
            <el-col :span="16" :class="statusColor(detailData.status)">{{detailData.status==="active" ?"已启用" : "已禁用"}}</el-col>
        </el-row>
        <div class="content">
            <el-button :size="$size" type="plain" @click="handleClose">返回</el-button>
             <el-button :size="$size" type="primary" @click="handleClose">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "InfoChannelDetail",
    props: {
        detailDialog: {
            type: Boolean,
            default: false
        },
        detailInfo: {
            type: [Object, String],
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            detailData: [],
        }
    },
    watch: {
        detailInfo(val) {
            this.detailData = val;
        }
    },
    methods: {
        getChannel(val) {
            switch(val) {
                case "ALIYUN":
                    return "阿里云短信";
                default:
                    return "腾讯云短信"
            }
        },
        statusColor(val) {
            switch(val) {
                case "active": 
                    return "success"
                default:
                    return "danger"
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
