<template>
    <el-dialog
            title="创建新的类型"
            :visible.sync="dialogVisible"
            width="400px"
            :before-close="handleClose">
        <el-form ref="formType" :model="form" :rules="rules" class="add-information" label-width="100px">
            <el-form-item label="类型名称" prop="name">
                <el-input :size="$size" class="add-information-inp" placeholder="请输入新的类型名称"
                          v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-sub">
            <el-button :loading="loadingSub" @click="submitType" :size="$size" type="primary"> 确定</el-button>
            <el-button @click="handleClose" :size="$size"> 返回</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                form: {},
                loadingSub: false,
                rules: {
                    name: [
                        {required: true, message: '请输入新的类型名称', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false);
            },
            submitType() {
                this.loadingSub = true;
                this.$refs["formType"].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.$api.activityTypeCreate, {name: this.form.name}, true)
                            .then(res => {
                                this.$message.success("创建成功");
                                this.getActivityTypePage();
                            })
                            .catch(err => {
                                console.log(err);
                                this.loadingSub = false;
                                this.$message.error(err.message);
                            })
                    }
                })
            },
            getActivityTypePage() {
                let param = {
                    limit: 100,
                    page: 1
                };
                this.$http.get(this.$api.activityTypePage, param, true)
                    .then(res => {
                        this.$emit("typeList", res.data);
                        this.loadingSub = false;
                        this.form.name = "";
                        this.handleClose();
                    })
                    .catch(err => {
                        this.loadingSub = false;
                    })
            },
        }
    }
</script>

<style scoped>
    .dialog-sub {
        text-align: center;
    }
</style>