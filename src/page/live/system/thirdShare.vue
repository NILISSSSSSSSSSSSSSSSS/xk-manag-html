<template>
    <div class="third-share xk-container">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>第三方分享
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="submitForm" ref="submitForm" label-width="150px">
                <el-form-item label="分享模板标题：">
                    <el-input :size="$size" plcaeholder="输入分享模板标题" v-model.trim="submitForm.title"></el-input>
                </el-form-item>
                <el-form-item label="主播分享模板：">
                    <el-input :size="$size" plcaeholder="输入主播分享模板标题" v-model.trim="submitForm.anchorTitle"></el-input>
                </el-form-item>
                <el-form-item label="观众分享模板：">
                    <el-input :size="$size" plcaeholder="输入观众分享模板标题" v-model.trim="submitForm.audienceTitle"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="save('submitForm')">保存</el-button>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                submitForm: {}
            }
        },
        methods: {
            save(formName) {
                console.log('保存')
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
