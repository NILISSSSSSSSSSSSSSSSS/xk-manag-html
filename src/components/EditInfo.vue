<template>
    <div class="edit-info">
        <el-form :label-width="labelWidth" :model="ruleForm" ref="ruleForm" :rules="rules">
            <el-form-item label="商城Logo：" prop="logoUrl">
                <upload-image :more="false" v-model="ruleForm.logoUrl">
                    <img v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" alt="">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </upload-image>
            </el-form-item>
            <el-form-item label="商城名称：" prop="name">
                <el-input placeholder="输入商城名称" v-model="ruleForm.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" class="contact" required>
                <el-col :span="5">
                    <el-form-item prop="contact1">
                        <el-input placeholder="区号" size="small" v-model="ruleForm.contact1"></el-input>&nbsp;&nbsp;---&nbsp;&nbsp;
                    </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item prop="contact2">
                        <el-input class="contact-num" placeholder="固定号码" size="small" v-model="ruleForm.contact2"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="收货地址：" required>
                <el-form-item prop="region3">
                    <province-cascader v-model="ruleForm.region3"></province-cascader>
                </el-form-item>
                <el-form-item prop="region4" style="margin-top: 15px">
                    <el-input placeholder="请输入详细地址" size="small" v-model="ruleForm.region4"></el-input>
                </el-form-item>
            </el-form-item>
            <div class="edit-info-bottom">
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">提交</el-button>
                <el-button size="small" @click="closeDialog">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import UploadImage from '@/components/ImageUpload.vue'
    import ProvinceCascader from "@/components/ProvinceCascader.vue"
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            editInfo: {
                type: Object,
                default: ()=>({})
            }
        },
        components: {
            UploadImage,
            ProvinceCascader
        },
        data() {
            const checkLogo = (rule, value, callback) => {
                if(value==='' || value === void 0) {
                    callback(new Error('请上传商城Logo'))
                }else{
                    callback()
                }
            }
            return {
                
                labelWidth: '140px',
                ruleForm: {},
                rules: {
                    logoUrl: [
                        { required: true, validator: checkLogo, trigger: 'change'}
                    ],
                    name: [
                        { required: true, message:'请输入商城名称', trigger: 'blur'}
                    ],
                    region3: [
                        { required: true, message: '请选择收货地址', trigger: 'change'}
                    ],
                    region4: [
                        { required: true, message: '请输入详细地址', trigger: 'blur'}
                    ],
                    contact1: [
                        { required: true, message: '请输入区号', trigger: 'blur'}
                    ],
                    contact2: [
                        { required: true, message: '请输入电话号码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj = {
                            logo: this.ruleForm.logoUrl,
                            name: this.ruleForm.name,
                            phone: this.ruleForm.contact1+'-'+this.ruleForm.contact2,
                            provinceCode: this.ruleForm.region3[0],
                            cityCode: this.ruleForm.region3[1],
                            districtCode: this.ruleForm.region3[2],
                            street: this.ruleForm.region4
                        }
                        this.$http.post(this.$api.mallInfoSetting, obj, true).then(res => {
                            this.closeDialog()
                        })
                    } else {
                        return false;
                    }
                });
            },
            closeDialog() {
                this.$emit('update:visible', false)
            }
        }
    }
</script>
<style lang="scss">
    .edit-info {
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 146px;
            height: 146px;
            line-height: 146px;
            text-align: center;
            border: 1px dashed #8c939d;
        }
        .el-upload{
            width: 146px;
            height: 146px;
            img{
                width: 100%;
            }
        }
        .el-cascader,
        .el-input {
            width: 60%;
        }
        .contact .el-input {
            width: 75%
        }
        .contact .contact-num {
            width: 63%;
        }
        .edit-info-bottom {
            padding-left: 250px;
        }
    }
</style>
