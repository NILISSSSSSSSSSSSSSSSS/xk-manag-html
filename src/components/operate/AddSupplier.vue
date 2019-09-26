<template>
    <div>
        <el-dialog :visible.sync="dialog" width="600px" :before-close="handleClose" :title="title">
            <el-form label-width="120px" :model="supplierForm" ref="supplierForm">
                <el-form-item label="供应商名称：">
                    <el-input :size="$size" v-model="supplierForm.supplierName"></el-input>
                </el-form-item>
                <el-form-item label="首字母：">
                    <el-input :size="$size" v-model="supplierForm.firstChar"></el-input>
                </el-form-item>
                <el-form-item label="全拼：">
                    <el-input :size="$size" v-model="supplierForm.allChar"></el-input>
                </el-form-item>
                <el-form-item label="供应商图片：">
                    <image-upload :more="false" v-model="supplierForm.supplierUrl">
                        <img style="width: 100px;height: 100px" :src="supplierForm.supplierUrl" class="imgSize" v-if="supplierForm.supplierUrl">
                        <div v-else class="avatar">
                            <i class="el-icon-plus"></i>
                        </div>
                    </image-upload>
                </el-form-item>
                <el-form-item label="供应商描述：">
                    <el-input :size="$size" v-model="supplierForm.intro" type="textarea" :autosize="{minRows: 3, maxRows: 6}"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-switch v-model="supplierForm.effective" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div style="text-align: center">
                <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
                <el-button :size="$size" type="primary" @click="handleAdd" v-if="type === 'add'">确定</el-button>
                <el-button :size="$size" type="primary" @click="handleEdit" v-if="type === 'edit'">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload'
export default {
    name: 'AddSupplier',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        addOrEdit: {
            type: String,
            default: ''
        },
        detail: {
            type: Object,
            default: ()=> ({})
        }
    },
    data() {
        return {
            dialog: false,
            title: '',
            type: '',
            supplierForm: {
                supplierUrl: ''
            }
        }
    },
    watch: {
        dialogVisible(val) {
            this.dialog = val
            this.supplierForm = {}
        },
        addOrEdit(val) {
            if(val === 'add') {
                this.title = '新增供应商'
            } else {
                this.title = '编辑供应商'
            }
            this.type = val
            console.log(this.type)
        },
        detail: {
            handler(val) {
                this.supplierForm = val
                console.log(123)
            },
            deep: true
        }
    },
    methods: {
        handleClose() {
            this.dialog = false
            this.$emit("update:dialogVisible", false)
        },
        handleAdd() {
            console.log(123)
            let paramList = {
                supplier: {
                    supplierName: this.supplierForm.supplierName,
                    supplierUrl: this.supplierForm.supplierUrl,
                    firstChar: this.supplierForm.firstChar,
                    allChar: this.supplierForm.allChar,
                    intro: this.supplierForm.intro,
                    effective: this.supplierForm.effective
                }
            }
            this.$http.post(this.$api.supplierCreate, paramList, true)
            .then(res => {
                this.$message.success('添加成功');
                this.handleClose();
                this.$emit('success')
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        handleEdit() {
            let paramList = {
                supplier: {
                    id: this.supplierForm.id,
                    supplierName: this.supplierForm.supplierName,
                    supplierUrl: this.supplierForm.supplierUrl,
                    firstChar: this.supplierForm.firstChar,
                    allChar: this.supplierForm.allChar,
                    intro: this.supplierForm.intro,
                    effective: this.supplierForm.effective
                }
            }
            console.log(paramList)
            this.$http.post(this.$api.supplierUpdate, paramList, true)
            .then(res => {
                this.$message.success('编辑成功');
                this.handleClose();
                this.$emit('success')
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        }
    },
    components: {
        ImageUpload
    }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .avatar:hover {
    border: 1px dashed #4c63b7;
  }
  .el-icon-plus {
    font-size: 28px;
    color: #8c939d;
  }
  .imgSize {
    width: 320px;
    height: 160px;
  }
</style>
