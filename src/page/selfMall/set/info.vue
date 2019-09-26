<template>
    <div class="xk-container">
        <div class="container-header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item> 商品基本信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="selfmall-set-info">
            <div class="xk-radius">
                <el-row>
                    <el-col :span="5">&nbsp;</el-col>
                    <el-col :span="14">
                        <el-form :label-width="labelWidth">
                            <el-form-item label="商城Logo：">
                                <img :src="mallInfoDetail.logo" alt="" @click="$viewImage(mallInfoDetail.logo)">
                            </el-form-item>
                            <el-form-item label="商城名称：">
                                {{ mallInfoDetail.name }}
                            </el-form-item>
                            <el-form-item label="联系方式：">
                                {{ mallInfoDetail.phone }}
                            </el-form-item>
                            <el-form-item label="收货地址：">
                                {{ district }}
                            </el-form-item>
                            <div class="bottom">
                                <el-button type="primary" @click="updateInfo();" size="small" style="margin-left: 120px;">修改基本信息</el-button>
                            </div>
                        </el-form>
                    </el-col>
                    <el-col :span="5">&nbsp;</el-col>
                </el-row>
                <el-dialog title="基本信息" :visible.sync="dialogVisible" width="750px" class="edit-info">
                    <el-form label-width="140px" :model="ruleForm" ref="ruleForm" :rules="rules">
                        <el-form-item label="商城Logo：" prop="logoUrl">
                            <upload-image :more="false" v-model="ruleForm.logoUrl" :uploadType="1">
                                <img class="img-show" v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" alt="">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </upload-image>
                        </el-form-item>
                        <el-form-item label="商城名称：" prop="name">
                            <el-input placeholder="输入商城名称" v-model="ruleForm.name" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式：" class="contact" required>
                            <el-col :span="5">
                                <el-form-item prop="contact1" ref="contact1">
                                    <el-input placeholder="区号" size="small" v-model="ruleForm.contact1"></el-input>&nbsp;&nbsp;---&nbsp;&nbsp;
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item prop="contact2" ref="contact2">
                                    <el-input class="contact-num" placeholder="固定号码" size="small" v-model="ruleForm.contact2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="收货地址：" required>
                            <el-form-item prop="region3">
                                <div style="width:60%">
                                    <province-cascader v-model="ruleForm.region3"></province-cascader>
                                </div>
                            </el-form-item>
                            <el-form-item prop="region4" style="margin-top: 15px">
                                <el-input placeholder="请输入详细地址" size="small" v-model="ruleForm.region4"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <div class="edit-info-bottom">
                            <el-button type="primary" size="small" @click="submitForm('ruleForm')" :loading="submitLoading">提交</el-button>
                            <el-button size="small" @click="dialogVisible=false">返回</el-button>
                        </div>
                    </el-form>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    import UploadImage from '@/components/ImageUpload.vue'
    import ProvinceCascader from "@/components/ProvinceCascader.vue"

    let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

    export default {
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
            const checkContact2 = (rule, value, callback) => {
                if(!value) {
                    callback(new Error('不能为空'))
                }else if(!/^[0-9]\d*$/g.test(value)) {
                    callback(new Error('必须为整数'))
                }else {
                    callback()
                }
            }
            return {
                ruleForm: {
                    contact2: '',
                    contact1: ''
                },
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
                        { required: true, validator: (rule, value, callback) => {
                            if(!value) {
                                callback(new Error('不能为空'))
                            }else if(!/^[0-9]\d*$/g.test(value)) {
                                callback(new Error('必须为整数'))
                            }else{
                                callback();
                            }
                        },  trigger: 'blur'}
                    ],
                    contact2: [
                        { required: true, validator: (rule, value, callback) => {
                            if(!value) {
                                callback(new Error('不能为空'))
                            }else if(!/^[0-9]\d*$/g.test(value)) {
                                callback(new Error('必须为整数'))
                            }else{
                                callback();
                            }
                        }, trigger: 'blur'}
                    ]
                },
                dialogVisible: false,
                labelWidth: '120px',
                mallInfoDetail: {},
                district: '',
                submitLoading: false
            }
        },
        created() {
            this.getMallInfoDetail();
        },
        methods: {
            getMallInfoDetail() {
                this.$http.get(this.$api.mallInfoDetail, {}, true).then(res => {
                    this.mallInfoDetail = res;
                    this.getProvince();
                })
            },
            //获取省份
            getProvince() {
                this.district += province.get(this.mallInfoDetail.provinceCode).name;
                this.getCity()
            },
            //获取城市
            getCity() {
                this.district += city.get(this.mallInfoDetail.cityCode).name;
                this.getDistrict();
            },
            //获取区县
            getDistrict() {
                this.district += district.get(this.mallInfoDetail.districtCode).name + this.mallInfoDetail.street;
            },
            updateInfo() {
                //去除验证
                if(this.$refs['ruleForm']){
                    this.$refs['ruleForm'].resetFields();
                }
                this.dialogVisible = true;
                if(this.mallInfoDetail && typeof this.mallInfoDetail === 'object'){
                    let phoneArr = this.mallInfoDetail.phone.split("-")
                    this.ruleForm = {
                        logoUrl: this.mallInfoDetail.logo,
                        name: this.mallInfoDetail.name,
                        contact1: phoneArr.length>1 ? phoneArr[0]: '0',
                        contact2: phoneArr.length>1 ? phoneArr[1]: phoneArr[0],
                        region3: [this.mallInfoDetail.provinceCode, this.mallInfoDetail.cityCode, this.mallInfoDetail.districtCode],
                        region4: this.mallInfoDetail.street
                    }
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj = {
                            logo: this.ruleForm.logoUrl,
                            name: this.ruleForm.name,
                            phone: this.ruleForm.contact1+'-'+this.ruleForm.contact2,
                            provinceCode: this.ruleForm.region3[0],
                            cityCode: this.ruleForm.region3[1]?this.ruleForm.region3[1]: '000000',
                            districtCode: this.ruleForm.region3[2]?this.ruleForm.region3[2]: '000000',
                            street: this.ruleForm.region4
                        }
                        this.submitLoading = true
                        this.$http.post(this.$api.mallInfoSetting, obj, true).then(res => {
                            this.district = '';
                            this.getMallInfoDetail();
                            this.dialogVisible= false;
                            this.submitLoading = false;
                        }).catch(err=> {
                            this.submitLoading = false
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped src="./info.scss"></style>
<style>
.selfmall-set-info .el-upload {
    width: 146px;
    height: 146px;
    line-height: 146px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
}
</style>