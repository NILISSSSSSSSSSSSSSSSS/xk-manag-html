<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>商圈配置
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="setForm">
                <el-form-item label="店铺资质是否必填：">
                    <el-switch v-model="setForm.storeQualification" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div style="text-align: center">
                <el-button type="primary" @click="setStoreQualification" :size="$size">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'businessSet',
    data() {
        return {
            setForm: {
                storeQualification: 0
            }
        }
    },
    created() {
        this.getStoreQualificationDetail();
    },
    methods: {
        getStoreQualificationDetail() {
            this.$http.get(this.$api.shopQueryQualification, {}, true)
            .then(res => {
                console.log(res)
                this.setForm.storeQualification = res.isNecessarily
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        setStoreQualification() {
            console.log(this.setForm.storeQualification)
            this.$http.post(this.$api.shopConfigQualification, {isNecessarily: this.setForm.storeQualification}, true)
            .then(res => {
                this.$message.success("设置成功");
                this.getStoreQualificationDetail();
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        }
    }
}
</script>

<style>

</style>
