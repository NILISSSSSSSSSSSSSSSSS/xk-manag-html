<template>
    <el-dialog
            :title="sPublishContentTitle"
            :visible="dialogVisible"
            width="963px"
            :before-close="fnHandleClose">
        <div class='publish-content'>
            <el-form ref="oFormRef" :model="oForm" :rules="rule" label-width="100px" :size="$size">
                <el-form-item label="用户：" prop="userGroupIds">
                    <el-select style="width: 100%"
                        v-model="oForm.userGroupIds"
                        filterable
                        multiple 
                        remote
                        :disabled="disableFlag"
                        :remote-method="remoteMethod"
                        :loading="loadingUserGroup"
                        placeholder="请选择推送用户(可以输入用户组名称精确匹配)">
                            <el-option v-for="(item,index) in userGroup" :key="index" :label="item.name"
                                        :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="标题：">
                    <el-input maxlength="15"  v-model.trim="oForm.title" :disabled="disableFlag" placeholder="请输入推送标题"></el-input>
                </el-form-item>
                <el-form-item label="时间：" prop="pushTime">
                    <el-date-picker
                            v-model="oForm.pushTime"
                            :disabled="disableFlag"
                            type="datetime"
                            :picker-options="pickerOptions"
                            placeholder="请选择推送时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="封面图片：" prop="cover">
                    <template v-if="!disableFlag">
                        <image-upload :more="false" v-model="oForm.cover" size="2" class="cover-img">
                            <img class="img-show" v-if="oForm.cover" :src="oForm.cover" alt="">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                        <p><span class="xk-danger">* </span>建议上传尺寸：670*220px（图片大小2M以内），最多上传1张图片</p>
                    </template>
                    <template v-else>
                        <img class="img-show" :src="oForm.cover" alt="">
                    </template>
                </el-form-item>
                <el-form-item label="内容：">
                    <div v-if="!disableFlag">
                        <el-radio :disabled="disableFlag" v-model="oForm.consultType" label="text">富文本</el-radio>
                        <el-radio :disabled="disableFlag" v-model="oForm.consultType" label="url">H5外链</el-radio>
                    </div>
                    <el-row>
                        <el-col :span="18" v-if="oForm.consultType==='url'">
                            <el-form-item prop="url" label-width="0">
                                <el-input :disabled="disableFlag" class="add-information-inp" :size="$size" v-model="oForm.url"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18" v-else>
                            <el-form-item prop="htmlContent" label-width="0">
                                <template v-if="!disableFlag">
                                    <u-e v-model="oForm.htmlContent" UEheight="height:410px"></u-e>
                                </template>
                                <div v-else v-html="oForm.htmlContent"></div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button @click="fnHandleClose" :size="$size">取 消</el-button>
                <el-button type="primary" v-if="buttonFlag" :loading="submitLoading" @click="fnHandleSure" :size="$size">确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import moment from 'moment';
    import UE from '@/components/UE.vue';
    import ImageUpload from '@/components/ImageUpload.vue';
    import { site } from '@/util/regExp.js';
    export default {
        name: 'PublishContent',
        components: {
            UE,
            ImageUpload
        },
        data() {
            const checkUrl = (rule, value, call) => {
                if(!value) {
                    return call(new Error('请输入H5地址'))
                }
                if(!site.test(value)) {
                    return call(new Error('H5链接格式不正确'))
                }
                call();
            }
            return {
                oForm: {
                    consultType: 'text'
                },
                page: {
                    limit: 100,
                    page: 1
                },
                disableFlag: false,
                bCreateType: false,
                submitLoading: false,
                loadingUserGroup: false,
                buttonFlag: true,
                sTypeName: "",
                bCreateUserGroup: false,
                groupIdOrName: "",
                userGroup: [],
                rule: {
                    userGroupIds: [
                        {required: true, message: '请选择需要推送的用户', trigger: 'change'},
                    ],
                    title: [
                        {required: true, message: '推送标题不能为空', trigger: 'blur'}
                    ],
                    pushTime: [
                        {required: true, message: '请选择推送时间', trigger: 'blur'},
                    ],
                    htmlContent: [
                        {required: true, message: '请输入推送内容', trigger: 'blur'},
                    ],
                    url: [
                        { required: true, validator: checkUrl, trigger: 'change' }
                    ]
                },
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0));
                    },
                }
            };
        },
        props: {
            bPublishContent: Boolean,
            sPublishContentTitle: String,
            activityDetail: {
                type: Object,
                default: ()=>({})
            }
        },
        computed: {
            dialogVisible() {
                return this.bPublishContent;
            }
        },
        created() {
            this.getUserGroup();
        },
        watch: {
            bPublishContent(val) {
                if(val&&this.activityDetail.id) {
                    this.buttonFlag = true;
                    this.disableFlag = false;

                    this.activityDetail.pushTime = new Date(this.activityDetail.pushTime * 1000);
                    if (this.activityDetail.isPush === 0) {
                        this.sPublishContentTitle = "修改推送内容";
                    } else {
                        this.buttonFlag = false;
                        this.disableFlag = true;
                    }
                    
                    this.oForm = this.activityDetail;
                    if(this.activityDetail.htmlContent) {
                        this.oForm.consultType='text';
                    }else{
                        this.oForm.consultType = 'url'
                    }
                }else{
                    this.buttonFlag = true;
                    this.disableFlag = false;
                    this.oForm= {
                        consultType: 'text',
                        userGroupIds: []
                    }
                }
            }
        },
        methods: {
            getUserGroup() {
                let param = {
                    limit: this.page.limit,
                    page: this.page.page
                };
                if (this.groupIdOrName) {
                    // param.id = this.groupIdOrName;
                    param.name = this.groupIdOrName;
                }
                this.loadingUserGroup = true;
                this.$http.get(this.$api.xkUserGroupPage, param, true)
                    .then(res => {
                        this.userGroup = res.data;
                        this.loadingUserGroup = false;
                    })
                    .catch(err => {
                        this.loadingUserGroup = false;
                    })
            },
            fnHandleClose() {
                this.$emit('update:bPublishContent', false);
            },
            fnHandleSure() {
                this.$refs["oFormRef"].validate((valid) => {
                    if (valid) {
                        if(this.oForm.pushTime < Date.now()){
                            this.$message.error("推送时间必须大于当前时间");
                            return false;
                        }
                        //判断是富文本模式还是html模式
                        let param = {
                            userGroupIds: this.oForm.userGroupIds,
                            title: this.oForm.title,
                            pushTime: moment(this.oForm.pushTime).format('X'),
                            cover:this.oForm.cover,
                            content: '这个版本已经不需要这个字段了，Java端记得把这个验证去掉！',
                            pushContentType: this.oForm.consultType
                        }
                        this.oForm.id? param.id=this.oForm.id: null;
                        if(this.oForm.consultType=='text') {
                            param.htmlContent = this.oForm.htmlContent;
                            param.url = this.generateH5(); //生成url
                            this.oForm.id?param.url = param.url + this.oForm.id: null;
                        }else{
                            param.url = this.oForm.url
                        }
                        console.log(JSON.stringify(param))
                        // return false;
                        this.submitLoading = true;
                        let url = this.$api.pushContentCreate;  //新增
                        if(this.oForm.id){
                            //修改
                            url = this.$api.pushContentUpdate;
                        }
                        this.$http.post(url, param, true)
                            .then(res => {
                                this.submitLoading = false;
                                this.fnHandleClose();
                                this.$emit("successCallback")
                            }).catch(err => {
                            this.submitLoading = false;
                            this.$message.error(err.message)
                        })
                    }else{
                        console.log('验证失败')
                        return false;
                    }
                })
            },
            fnCreateUserGroup() {
                this.bCreateUserGroup = true;
            },
            fnCreateType() {
                this.bCreateType = true;
            },
            fnCreateTypeClose() {
                this.bCreateType = false;
            },
            fnCreateUserGroupClose() {
                this.bCreateUserGroup = false;
            },
            remoteMethod(query) {
                if (query) {
                    this.groupIdOrName = query;
                } else {
                    this.groupIdOrName = "";
                }
                this.page.page = 1;
                this.getUserGroup();
            },
            //根据当前环境，生成对应的h5页面
            generateH5() {
                let url = '//dev.xksquare.com/share/#/newsContentInformation?id=';
                if(location.host.indexOf('localhost') > -1) {
                    return window.location.protocol +'//dev.xksquare.com/share/#/newsContentInformation?id=';
                }else{
                    return window.location.protocol+ '//'+location.host+ '/share/#/newsContentInformation?id='
                }
            }
        },
    }
</script>
<style lang='scss' scoped>
    .publish-content {
        .el-range-separator {
            padding: 0;
        }
        .img-show {
            width: 268px;
            height: 88px;
        }
        /deep/ .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 268px;
            height: 88x;
            line-height: 88px;
            text-align: center;
            border: 1px dashed #ccc;
        }
        /deep/ .el-upload{
            width: 268px;
            height: 88px;
            img{
                width: 100%;
            }
        }
    }
</style>