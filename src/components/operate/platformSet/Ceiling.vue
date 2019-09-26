<template>
    <div class="ceiling" v-loading="loading">
        <div class="content">
            <el-form :model="formData" ref="formData" label-width="300px">
               <el-form-item label="绑定店铺有效期：" prop="SHOP_BIND_CODE_EXPIRY" :rules="rules.num">
                   <el-input :size="$size" style="width:200px" v-model="formData.SHOP_BIND_CODE_EXPIRY"></el-input>
                   <span>秒</span>
               </el-form-item>
               <el-form-item label="商户员工数量上限：" prop="MERCHANT_EMPLOYEE_NUMBER_LIMIT" :rules="rules.num">
                   <el-input :size="$size" style="width:200px" v-model="formData.MERCHANT_EMPLOYEE_NUMBER_LIMIT"></el-input>
                   <span>人</span>
               </el-form-item>
               <el-form-item label="官方群管理商户设置管理员数量上限：" prop="ADMINISTRATORS_NUMBER_LIMIT" :rules="rules.num">
                   <el-input :size="$size" style="width:200px" v-model="formData.ADMINISTRATORS_NUMBER_LIMIT"></el-input>
                   <span>人</span>
               </el-form-item>
               <!-- <el-form-item label="联盟商绑定安全期：" prop="MERCHANT_BIND_SELF_TIME" :rules="rules.num">
                   <el-input :size="$size" style="width:200px" v-model="formData.MERCHANT_BIND_SELF_TIME"></el-input>
                   <span>天</span>
               </el-form-item>
               <el-form-item label="安全码未激活循环周期：" prop="SECURITYCODE_ACTIVATION_CYCLE" :rules="rules.num">
                   <el-input :size="$size" style="width:200px" v-model="formData.SECURITYCODE_ACTIVATION_CYCLE"></el-input>
                   <span>月</span>
               </el-form-item> -->
               <div style="text-align: center">
                   <el-button :size="$size" type="primary" @click="saveOtherSet" :loading="btnLoading" v-permission="otherSetSet">保存</el-button>
               </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "ceiling",
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        let num = (rule, value, callback) => {
            console.log(typeof value)
            if(!/^[1-9]\d*$/.test(value)) {
               callback(new Error("请输入正整数！"))
            } else {
                callback();
            }
        }
        return {
            formData: {},
            rules: {
                num: [{validator: num}, {required: true}]
            },
            loading: false,
            btnLoading: false
        }
    },
    watch: {
        name(val) {
            if(val === 'third') {
                this.getOtherSet();
            }
        }
    },
    methods: {
        getOtherSet() {
            this.loading = true
            this.$http.get(this.$api.merchantOtherConfigDetail, {}, true)
            .then(res => {
                console.log(res)
                this.formData = res ? res : this.formData
                this.loading = false;
            })
            .catch(err => {
                this.$message.error(err.message)
                this.loading = false;
            })
        },
        saveOtherSet() {
            this.$refs['formData'].validate(valid => {
                if(valid) {
                    this.btnLoading = true
                    console.log('save')
                    console.log(typeof this.formData.SHOP_BIND_CODE_EXPIRY)
                    this.$http.post(this.$api.merchantOtherConfig, this.formData, true)
                    .then(res => {
                        this.$message.success("保存成功")
                        this.btnLoading = false
                        this.getOtherSet();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                        this.btnLoading = false;
                    })
                }
            })
            
        }

    }
}
</script>

<style lang="scss" scoped>
    .content {
        padding: 20px 20px 20px 20px;
    }
    .title {
        font-size: 18px;
    }
</style>
