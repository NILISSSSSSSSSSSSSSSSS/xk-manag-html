<template>
    <div class="out-tax-set xk-container">
        <el-card>
            <el-form :model="taxForm" label-width="150px" ref="taxForm" :rules="rules">
                <h3>1. 退税发票抬头设置</h3>
                <el-form-item label="发票抬头：" :rules="rules.promptingMessage" prop="invoiceTitle">
                    <el-input :size="$size" v-model.trim="taxForm.invoiceTitle" placeholder="请输入发票抬头"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号：" :rules="rules.tax" prop="taxpayerIdentificationNumber">
                    <el-input :size="$size" v-model.trim="taxForm.taxpayerIdentificationNumber" placeholder="请输入纳税人识别号"></el-input>
                </el-form-item>
                <el-form-item label="电话：" :rules="rules.phone" prop="phone">
                    <el-input :size="$size" v-model.trim="taxForm.phone" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item label="开户行：" :rules="rules.promptingMessage" prop="openingBank">
                    <el-input :size="$size" v-model.trim="taxForm.openingBank" placeholder="请输入开户行"></el-input>
                </el-form-item>
                <el-form-item label="账号：" prop="account">
                    <el-input :size="$size" v-model.trim="taxForm.account" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="地址：" :rules="rules.address" prop="address">
                    <el-input type="textarea" :size="$size" :autosize="{ minRows: 5, maxRows: 5}" resize="none" v-model.trim="taxForm.address" placeholder="请输入地址"></el-input>
                </el-form-item>

                <h3>2. 退税教程</h3>
                <el-form-item label="编辑退税教程：" :rules="rules.noEmpty" prop="course">
                    <div style="width: 80%">
                        <u-e v-model.trim="taxForm.course"></u-e>
                    </div>
                </el-form-item>

                <h3>3. 展示票样</h3>
                <el-form-item label="劳务费票样：" :rules="rules.noEmpty" prop="laborWageImg">
                    <image-upload size="1" v-model.trim="taxForm.laborWageImg" :limit="{width: '325', height: '225'}">
                        <img class="img-show" v-if="taxForm.laborWageImg" :src="taxForm.laborWageImg" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                </el-form-item>
                <el-form-item label="服务费票样：" :rules="rules.noEmpty" prop="serviceChargeImg">
                    <image-upload size="1" v-model.trim="taxForm.serviceChargeImg" :limit="{width: '325', height: '225'}">
                        <img class="img-show" v-if="taxForm.serviceChargeImg" :src="taxForm.serviceChargeImg" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                </el-form-item>

                <h3>4. 寄送发票信息</h3>
                <el-form-item label="寄送地址：" :rules="rules.address" prop="sendAddress">
                    <el-input type="textarea" :size="$size" :autosize="{ minRows: 5, maxRows: 5}" resize="none" v-model.trim="taxForm.sendAddress" placeholder="请输入寄送地址"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" :rules="rules.phone" prop="contactNumber">
                    <el-input :size="$size" v-model.trim="taxForm.contactNumber" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="收件人：" :rules="rules.receive" prop="addressee">
                    <el-input :size="$size" v-model.trim="taxForm.addressee" placeholder="请输入收件人"></el-input>
                </el-form-item>
                <el-form-item label="提示语：" prop="promptingMessage">
                    <el-input :size="$size" v-model.trim="taxForm.promptingMessage" placeholder="请输入提示语"></el-input>
                </el-form-item>
            </el-form>

            <div class="btn-group">
                <el-button :loading="saveLoading" :size="$size" type="primary" @click="saveData()">保存</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
    import UE from '@/components/UE.vue';
    import ImageUpload from '@/components/ImageUpload.vue';
    import XkFormItem from '@/components/common/XKFormItem.vue';
    export default {
        components: {
            UE,
            ImageUpload,
            XkFormItem
        },
        data() {
            const checkPhone = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^\d*$/.test(value.trim())) {
                    return call(new Error('电话号码格式不正确'))
                }
                if(value.length>12 || value.length<6) {
                    return call(new Error('电话号码位数不正确'))
                }
                call();
            }
            //检测收件人
            const checkReceive = (rule, value, call) => {
                if(value.length<2 || value.length>12) {
                    return call(new Error('请输入2-12位字符串'))
                }
                call();
            }
            //检测地址
            const checkAddress= (rule, value, call) =>{ 
                if(value.length<6 || value.length>50) {
                    return call(new Error('请输入6-50位字符串'))
                }
                call();
            }
            //检测纳税人识别号
            const checkTax = (rule, value, call) => {
                if(!/^([A-Z]|[0-9]){15,20}$/.test(value)) {
                    return call(new Error('请输入数字、大写字母：15-20位'))
                }
                call();
            }
            const checkPro = (rule, value, call) => {
                if(value.length>30 || value.length<6) {
                    return call(new Error('请输入6-30位的字符串'))
                }
                call();
            }
            const checkNo = (rule, value, call) => {
                if(!/^\d*$/.test(value)) {
                    return call(new Error('请输入数字类型'))
                }
                if(value.length>20 || value.length<15) {
                    return call(new Error('请输入15-20位的账号'))
                }
                call();
            }
            return {
                taxForm: {},
                rules: {
                    noEmpty: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
                    address: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { required: true, validator: checkAddress, trigger: 'blur' }
                    ],
                    receive: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { required: true, validator: checkReceive, trigger: 'blur' }
                    ],
                    tax: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { required: true, validator: checkTax, trigger: 'blur' }
                    ],
                    promptingMessage: [
                        { required: true, validator: checkPro, trigger: 'blur' }
                    ],
                    account: [
                        { required: true, validator: checkNo, trigger: 'blur' }
                    ]
                },
                saveLoading: false
            }
        },
        created() {
            this.getData();
        },
        methods: {
            saveData() {
                this.$refs['taxForm'].validate(v=>{
                    if(v){
                        this.saveLoading = true;
                        console.log(JSON.stringify(this.taxForm))
                        this.$http.post(this.$api.drawBackSetting, this.taxForm, true).then(res=>{
                            this.saveLoading = false;
                            this.$message.success('保存成功')
                        })
                        .catch(err=>{
                            this.saveLoading = false;
                            this.$message.error(err.message);
                        })
                    }else{
                        this.$nextTick(()=>{
                            let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                            $('.xk-container').animate({
                                scrollTop: num - 90
                            }, 500)                            
                        })
                        return false;
                    }
                })
            },
            getData() {
                this.$http.get(this.$api.queryDrawBackSetting, {}, true).then(res=>{
                    if(res&&res.data) {
                        this.taxForm = res.data;
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .out-tax-set{
        h3{
            margin-bottom: 15px;
            font-weight: bolder;
        }
        /deep/ .el-input, .el-textarea {
            width: 600px;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 146px;
            height: 146px;
            line-height: 146px;
            text-align: center;
            border: 1px dashed #8c939d;
        }
        /deep/ .el-upload{
            width: 146px;
            height: 146px;
            img{
                width: 100%;
            }
        }
    }
</style>
