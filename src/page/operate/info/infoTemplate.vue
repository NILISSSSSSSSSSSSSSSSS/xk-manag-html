<template>
<div class="xk-container">
  <div class="xk-radius">
       <div class="xk-title">
           <div class="vus-title">
                        <span></span>短信模板列表
           </div>
           <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                <el-button v-permission="'infoTemplateAdd'" type="primary" :size="$size" @click="addTemplate()">新增模板</el-button>
                <el-button v-permission="'infoTemplateDelete'" type="danger" :size="$size" @click="batchDelete">批量删除</el-button>
                <el-button type="primary" :size="$size" @click="resetSearch">清空搜索</el-button>
            </div>
            <div class="vus-bottom"></div>
            <el-form  label-width="120px" :model="searchForm" class="xk-search">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="短信渠道：" >
                            <el-select :size="$size" v-model="searchForm.smsType" @change="resetSmsType">
                                <el-option v-for="(item, index) in SmsType" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="短信业务类型：" v-if="searchForm.smsType === 'AUTH'">
                            <el-select :size="$size" v-model="searchForm.bizType">
                                <el-option v-for="(item, index) in authType" :key="index" :label="item[Object.keys(item)[0]]" :value="Object.keys(item)[0]"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="短信业务类型：" v-if="searchForm.smsType === 'NOTIFY'">
                            <el-select :size="$size" v-model="searchForm.bizType">
                                <el-option v-for="(item, index) in notifyType" :key="index" :label="item[Object.keys(item)[0]]" :value="Object.keys(item)[0]"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="短信业务类型：" v-if="searchForm.smsType === 'EXTENSION'">
                            <el-select :size="$size" v-model="searchForm.bizType">
                                <el-option v-for="(item, index) in extensionType" :key="index" :label="item[Object.keys(item)[0]]" :value="Object.keys(item)[0]"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="模板号：" >
                            <el-input :size="$size" v-model="searchForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
       </div>
       <el-table :data="tableData" v-loading="loading" @selection-change="selectionChange">
            <el-table-column type="selection" width="55px"></el-table-column>
            <el-table-column label="渠道" prop="channel">
                <template slot-scope="scope">
                    {{getChannel(scope.row.channel)}}
                </template>
            </el-table-column>
            <el-table-column label="短信类型" prop="smsType">
                <template slot-scope="scope">
                    {{getSmsType(scope.row.smsType)}}
                </template>
            </el-table-column>
            <el-table-column label="短信业务类型" prop="bizType">
                <template slot-scope="scope">
                    {{getBizType(scope.row.bizType)}}
                </template>
            </el-table-column>
            <el-table-column label="使用平台" prop="app">
                <template slot-scope="scope">
                    {{getAppName(scope.row.app)}}
                </template>
            </el-table-column>
            <el-table-column label="签名" prop="sign"></el-table-column>
            <el-table-column label="模板号" prop="code"></el-table-column>
            <el-table-column label="模板内容" prop="template"></el-table-column>
            <el-table-column label="操作" prop="">
                <template slot-scope="scope">
                    <el-button type="text" :size="$size" @click="templateDetail(scope.row.id)" v-permission="'infoTemplateDetail'">查看详情</el-button>
                    <el-button type="text" :size="$size" @click="addTemplate(scope.row)" :loading="scope.row.loading"
                    v-permission="'infoTemplateEdit'">修改</el-button>
                    <el-button type="text" :size="$size" @click="deleteTemplate(scope.row.id)"
                    v-permission="'infoTemplateDelete'">删除</el-button>
                </template>
            </el-table-column>
       </el-table>
       <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="pageChange"></pagination>
       <add-info-template :addDialog.sync="addDialog" :formData="editData" @success="getInfoTemplate"
       :authType="authType" :notifyType="notifyType" :extensionType="extensionType"></add-info-template>
       <info-template-detail :detailDialog.sync="detailDialog" :detailData="detailData" :smsTemplateEnum="smsTemplateEnum"></info-template-detail>
   </div>
</div>
</template>


<script>
import AddInfoTemplate from "../../../components/operate/AddInfoTemplate"
import InfoTemplateDetail from "../../../components/operate/InfoTemplateDetail"
import { SmsType, BizType } from "@/util/publicParams"

export default {
    data() {
        return {
            tableData: [],
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading: false,
            detailDialog: false,
            detailData: {},
            addDialog: false,
            editData: {},
            btnLoading: false,
            ids: [],
            smsTemplateEnum: [], // 短信所有枚举集合,
            authType: [],
            notifyType: [],
            extensionType: [],
            searchForm: {
                bizType: ''
            },
            SmsType: SmsType,
            channel: [
                {key: 'ALIYUN', label: '阿里云短信'},
                {key: 'TENCENT', label: '腾讯云短信'},
                {key: '', label: '全部'}
            ]
        }
    },
    created() {
        this.getSmsTemplateEnum();
        this.getInfoTemplate();
    },
    methods: {
        getChannel(val) {
            switch(val) {
                case "ALIYUN":
                    return "阿里云短信";
                case "TENCENT":
                    return "腾讯云短信";
                default:
                    return val
            }
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
        resetSmsType() { // 短信渠道改变时，短信业务类型默认置空
            this.searchForm.bizType = ''
        },
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
        getAppName(val) { // 平台
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
                case "wx":
                    return "微信";
                default: 
                    return val
            }
        },
        resetSearch() {
            this.searchForm = {
                bizType: ''
            }
        },
        search() {
            this.pageData.currentPage = 1;
            this.getInfoTemplate();
        },
        getInfoTemplate() { // 模板列表
           let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                code: this.searchForm.code,
                bizType: this.searchForm.bizType,
                // channel: this.searchForm.channel
            }
            console.log(this.searchForm.smsType)
            console.log(paramList)
            this.loading = true
            this.$http.get(this.$api.smsTemplateConfigPage, paramList, true)
            .then(res => {
                this.loading = false;
                console.log(res)
                this.tableData = res.data
                this.pageData.total = res.total ? res.total : 0
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        pageChange(page, pageSize) {
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getInfoTemplate();
        },
        templateDetail(id) { // 模板详情
            this.$http.get(this.$api.smsTemplateConfigDetail, {id: id}, true)
            .then(res => {
                console.log(res)
                this.detailData = res
                this.detailDialog = true
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        addTemplate(val) { // 新建和编辑弹框
            if(!val) {
                this.addDialog = true
                this.editData = {}
            } else {
                this.$set(val, "loading", true)
                this.$http.get(this.$api.smsTemplateConfigDetail, {id: val.id}, true)
                .then(res => {
                    this.editData = res;
                    this.$set(val ,"loading", false);
                    this.addDialog = true
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            }
        },
        selectionChange(val) { // 删除的集合
            this.ids = [];
            for(let item of val) {
            this.ids.push(item.id);
            }
     },
        batchDelete() { //批量删除
            if(this.ids.length === 0) {
                this.$confirm("请选择要删除的选项", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(()=>{})
                .catch(()=>{})
            } else {
                this.$confirm("确认删除这些选项吗？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.$http.get(this.$api.smsTemplateConfigBatchDelete, {ids: this.ids}, true)
                    .then(res => {
                        this.$message.success("删除成功")
                        this.getInfoTemplate();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                        this.getInfoTemplate();
                    })
                })
                .catch(()=> {
                    this.$message.info("已取消删除")
                })
            }
        },
        deleteTemplate(id) { // 单个删除
            this.$confirm("确认删除该条模板吗？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$http.get(this.$api.smsTemplateConfigBatchDelete, {ids: [id]}, true)
                .then(res => {
                    this.$message.success("删除成功")
                    this.getInfoTemplate();
                })
                .catch(err => {
                    this.$message.error(err.message)
                    this.getInfoTemplate();
                })
            })
            .catch(() => {
                this.$message("已取消删除")
            })
        },
        getSmsTemplateEnum() { // 所有短信枚举类型
            this.$http.get(this.$api.smsTemplateEnumQuery, {}, true)
            .then(res => {
                console.log('channel',res)
                this.smsTemplateEnum = res.smsNotifyBizTypes.concat(res.smsAuthBizTypes, res.smsExtensionBizTypes ? res.smsExtensionBizTypes : [])
                this.authType = res.smsAuthBizTypes
                this.notifyType = res.smsNotifyBizTypes
                console.log('notify', this.notifyType)
                console.log(res)
                this.extensionType = res.smsExtensionBizTypes ? res.smsExtensionBizTypes : []
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        }
    },
    components: {
        AddInfoTemplate,
        InfoTemplateDetail
    }

}
</script>

<style>

</style>
