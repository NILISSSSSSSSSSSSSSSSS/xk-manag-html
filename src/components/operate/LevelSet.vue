<template>
    <el-dialog  title="等级设置" :visible.sync="dialog" :before-close="handleClose" width="750px">
        <el-form  label-width="100px" label-position="right" :model="setForm" :rules="rules" ref="setForm">
                <el-form-item label="等级名称：" prop="name">
                    <el-row>
                        <el-col :span="20">
                            <el-input :size="$size" placeholder="请输入等级名称" v-model="setForm.name"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="积分设置：">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="minScore">
                                <el-input :size="$size" placeholder="0" v-model="setForm.minScore"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" style="text-align: center">
                            <span>--</span>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="maxScore">
                                <el-input :size="$size" placeholder="500" v-model="setForm.maxScore"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="等级颜色：" prop="color">
                    <el-row>
                        <el-col :span="20">
                            <el-input :size="$size" placeholder="请输入等级颜色" v-model="setForm.color"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                 <el-form-item label="上传图标：">
                    <el-row>
                        <el-col :span="20">
                            <image-upload :more="false" v-model="setForm.icon">
                                <img :src="setForm.icon" class="imgSize" v-if="setForm.icon">
                                <div v-else class="avatarLarge">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </image-upload>
                        </el-col>
                    </el-row>
                </el-form-item>
                 <el-form-item label="描述：">
                    <el-row>
                        <el-col :span="20">
                            <el-input :size="$size" placeholder="请输入描述" 
                            v-model="setForm.remark" type="textarea" :autosize="{minRows: 3, maxRows:5}">
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <div style="text-align: center">
                    <el-button :size="$size" type="primary" @click="handleEdit" :loading="btnLoading">确定</el-button>
                    <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
                </div>
        </el-form>
    </el-dialog>
</template>

<script>
import ImageUpload from "@/components/ImageUpload"
export default {
    name: "levelSet",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        detailData: {
            type: Object,
            default: ()=>({})
        }
    },
    data() {
        return {
            setForm: {
                name: '',
                minScore: '',
                maxScore: '',
                color: "#",
            },
            dialog: false,
            rules: {
                name: [{ required: true, message: "不能为空", trigger: 'blur'}],
                minScore: [{ required: true, message: "不能为空", trigger: 'blur'}],
                maxScore: [{ required: true, message: "不能为空", trigger: 'blur'}],
                color: [{ required: true, message: "不能为空", trigger: 'blur'}]
            },
            btnLoading: false
        }
    },
    watch: {
        dialogVisible(val) {
            this.dialog = val
        },
        detailData(val) {
            this.setForm = val
        }
    },
    methods: {
        handleClose() {
           this.dialog = false;
           this.$emit("update:dialogVisible", false);
           this.$refs["setForm"].resetFields();
           this.$emit("success");
        },
        handleEdit() {
            this.$refs["setForm"].validate((valid) => {
                if(valid) {
                    if(this.setForm.id) {
                        let paramList = {
                            id: this.setForm.id,
                            name: this.setForm.name,
                            icon: this.setForm.icon,
                            minScore: parseInt(this.setForm.minScore),
                            maxScore: parseInt(this.setForm.maxScore),
                            color: this.setForm.color,
                            remark: this.setForm.remark
                    }
                    console.log(paramList)
                    this.btnLoading = true
                    this.$http.get(this.$api.xkUserLevelUpdate, paramList, true)
                    .then(res => {
                        this.btnLoading = false;
                        this.$message.success('修改成功')
                        this.handleClose();
                    })
                    .catch(err => {
                        this.btnLoading = false;
                        this.$message.error(err.message);
                    })
                    } else {
                        let paramList = {
                                name: this.setForm.name,
                                icon: this.setForm.icon,
                                minScore: parseInt(this.setForm.minScore),
                                maxScore: parseInt(this.setForm.maxScore),
                                color: this.setForm.color,
                                remark: this.setForm.remark
                        }
                        console.log(paramList)
                        this.$http.get(this.$api.xkUserLevelCreate, paramList, true)
                        .then(res => {
                            this.$message.success("添加成功");
                            this.handleClose();
                        })
                        .catch(err => {
                            this.$message.error(err.message)
                        })
                    }
                } else {
                    return false;
                }
            })
        }
    },
    components: {
        ImageUpload
    }

}
</script>

<style lang="scss" scoped>
.img-border {
    width: 100px;
    height: 100px;
    border: dashed 1px #c0ccda;
    line-height: 100px;
    text-align: center;
}
.img-border:hover {
    border: dashed 1px #9795E3;
}
.el-icon-plus {
    font-size: 20px;
    text-align: center;
    vertical-align: middle;
}
.imgSize {
    height: 50px;
    width: 50px;
}
.avatarLarge {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .avatar:hover, .avaterLarge:hover {
    border: 1px dashed #4c63b7;
  }

</style>
