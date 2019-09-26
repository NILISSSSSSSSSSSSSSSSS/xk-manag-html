<template>
    <div>
        <el-dialog
                :visible.sync="dialog"
                width="900px"
                :before-close="handleCancle"
                :title="title"
        >
            <el-form label-width="120px">
                <el-row>
                    <el-col>
                        <el-form-item label="上级分类：" required>
                            {{thirdData?thirdData.name:""}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="分类名称：" required>
                            <el-input :size="$size" v-model="name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="分类图片：" required>
                            <image-upload :more="false" v-model="imgData">
                                <img style="width: 50px;height: 50px" :src="imgData" class="imgSize" v-if="imgData">
                                <div v-else class="avatar">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </image-upload>
                            <!--<div>(点击上传图片)</div>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="属性模板设置：">
                            <el-button :size="$size" type="primary" @click.stop="addAttar">
                                {{!categoryAttrs.length?"添加":"修改"}}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="是否启用：">
                            <el-switch v-model="switchValue"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="content">
                <el-button :size="$size" type="plain" @click="handleCancle">取消</el-button>
                <el-button :size="$size" type="primary" @click="handleSure">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="attrDialog"
                title="设置属性"
                width="793px"
                :before-close="attrCancle"
        >
            <set-attr v-model="setValue" :saveData='saveData' :attrDialog='attrDialog'
                      :categoryAttrs='categoryAttrs'></set-attr>
            <div class="attr-center">
                <el-button type="plain" @click.stop="attrCancle" :size="$size">取消</el-button>
                <el-button type="primary" @click.stop="attrSure" :size="$size">确定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import ImageUpload from "@/components/ImageUpload";
    import setAttr from "../setAttr";

    export default {
        name: "addThirdCategory",
        data() {
            return {
                data: [],
                switchValue: "false",
                imgData: "",
                name: '',
                dialog: false,
                attrDialog: false,
                setValue: "",
                saveData: false,
                categoryAttrs: []
            };
        },
        props: {
            thirdDialog: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ""
            },
            thirdData: {}
        },
        components: {
            ImageUpload,
            setAttr
        },
        methods: {
            dataInit() {
                this.switchValue = false;
                this.imgData = '';
                this.name = '';
                this.categoryAttrs = []
            },
            handleCancle() {
                this.dialog = false;
                this.$emit("update:thirdDialog", false);
            },
            handleSure() {
                if (!this.name) {
                    this.$message.error('分类名称不能为空！');
                    return;
                }
                if (!this.imgData) {
                    this.$message.error('分类图片不能为空！');
                    return;
                }
                // if(!this.categoryAttrs.length){
                //   this.$message.error('属性模板不能为空！');
                //   return ;
                // }
                let sortnum = 1;
                if (this.thirdData.children) {
                    sortnum = this.thirdData.children[this.thirdData.children.length - 1].sort + 1
                }
                let obj = {
                    categoryCreateDTO: {
                        category: {
                            picUrl: this.imgData,
                            enable: this.switchValue ? 1 : 0,
                            name: this.name,
                            sort: sortnum,
                            level: 3,
                            pCode: this.thirdData.code
                        }
                    }
                }
                if (this.categoryAttrs.length) {
                    obj.categoryCreateDTO.categoryAttrs = this.categoryAttrs;
                }
                this.$http.post(this.$api.categoryCreate, obj, true).then((res) => {
                    this.dialog = false;
                    this.$emit("update:thirdDialog", false);
                    this.$emit('categoryRefresh');
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    });
                    console.log(obj);

                }).catch((err) => {
                    console.log(obj)
                    this.$message.error(err.message)
                });
            },
            attrCancle() {
                this.attrDialog = false;
            },
            addAttar() {
                this.attrDialog = true;
            },
            attrSure() {
                this.saveData = !this.saveData;
                let arr = [];
                this.setValue.forEach((item, index) => {
                    if (item.setName) {
                        arr.push({
                            columns: [],
                            name: item.setName
                        });
                        item.nameArr.forEach((list, i) => {
                            if (list.setName) {
                                arr[arr.length - 1].columns.push({
                                    name: list.setName,
                                    required: list.must ? 1 : 0
                                })
                            }
                        });
                    }
                });
                this.categoryAttrs = arr;
                this.attrDialog = false;
            }
        },
        watch: {
            thirdDialog(val) {
                this.dialog = val;
                console.log(this.thirdData);
                this.dataInit()
            }
        }
    };
</script>

<style lang="scss" scoped>
    .avatar {
        width: 50px;
        height: 50px;
        line-height: 60px;
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

    .content {
        margin: 0 auto;
        text-align: center;
    }

    .attr-center {
        text-align: center;
        padding: 20px 0 0 0;
    }
</style>
