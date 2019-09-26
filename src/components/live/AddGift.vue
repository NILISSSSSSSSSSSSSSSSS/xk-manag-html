<template>
    <el-dialog :title="title" :visible.sync="dialog" :before-close="handleClose" width="600px">
        <el-form :model="giftForm" label-position="right" label-width="120px" ref="giftForm">
            <el-form-item label="礼物ID：" v-if="giftForm.id">
                {{giftForm.id}}
            </el-form-item>
            <el-form-item label="礼物名称：" prop="name" :rules="{required: true, message: '名称不能为空'}">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="giftForm.name" :disabled="this.title ==='礼物详情'"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="礼物价格：" prop="price" :rules="rules.num">
                <el-row>
                    <el-col :span="16">
                        <el-input :size="$size" v-model="giftForm.price" :disabled="this.title ==='礼物详情'"></el-input>
                    </el-col>
                    <el-col :span="4" style="text-align: center">晓可币</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="动画key：" prop="giftKey" :rules="{required: true, message: '不能为空'}">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="giftForm.giftKey" :disabled="this.title ==='礼物详情'" placeholder="礼物名的英文名"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="礼物类型：">
                <el-row>
                    <el-col :span="20">
                        <el-select :size="$size" v-model="giftForm.giftSize" :disabled="this.title ==='礼物详情'" style="width: 100%">
                            <el-option v-for="(item, index) in giftType" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="小图：">
                <el-row>
                    <el-col :span="20">
                        <img :src="giftForm.smallPicture" class="smallImg" v-if="this.title === '礼物详情'">
                        <image-upload v-model="giftForm.smallPicture" :more='false' v-else>
                            <img :src="giftForm.smallPicture" class="smallImg" v-if="giftForm.smallPicture">
                            <div v-else class="avatar">
                                <i class="el-icon-plus"></i>
                            </div>
                        </image-upload>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="大图：">
                <el-row>
                    <el-col :span="20">
                        <img :src="giftForm.bigPicture" class="largeImg" v-if="this.title === '礼物详情'">
                        <image-upload :more="false" v-model="giftForm.bigPicture" v-else>
                            <img :src="giftForm.bigPicture" class="largeImg" v-if="giftForm.bigPicture">
                            <div v-else class="avatarLarge">
                                <i class="el-icon-plus"></i>
                            </div>
                        </image-upload>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="序号：" prop="index">
                <el-row>
                    <el-col :span="6">
                        <el-input :size="$size" v-model="giftForm.index" :disabled="this.title ==='礼物详情'"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
             <el-form-item label="选择数量：">
                <el-row>
                    <el-col :span="20">
                        <el-switch :size="$size" v-model="giftForm.allowSelectNumber" :disabled="this.title ==='礼物详情'"></el-switch>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="连送：">
                <el-row>
                    <el-col :span="6">
                        <el-switch :size="$size" v-model="giftForm.allowContinuity" :disabled="this.title ==='礼物详情'"></el-switch>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="连送判断时间：" prop="continuityTime">
                            <el-input :size="$size" v-model="giftForm.continuityTime" :disabled="this.title ==='礼物详情'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">秒</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="送出确认：">
                <el-row>
                    <el-col :span="20">
                        <el-switch :size="$size" v-model="giftForm.confirm" :disabled="this.title ==='礼物详情'"></el-switch>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="启用：">
                <el-row>
                    <el-col :span="20">
                        <el-switch :size="$size" v-model="giftForm.status" :disabled="this.title ==='礼物详情'"></el-switch>
                    </el-col>
                </el-row>
            </el-form-item>
            <div class="content">
                <el-button :size="$size" type="primary" @click="handleClose" :loading="loadiing" v-if="this.title === '礼物详情'">保存</el-button>
                <el-button :size="$size" type="primary" @click="handleGift" :loading="loadiing" v-else>保存</el-button>
                <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import ImageUpload from "@/components/ImageUpload.vue"
export default {
    name: 'addGift',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        detailData: {
            type: Object,
            default: ()=>({})
        }
    },
    data() {
        let num = (rule, value, callback) => {
            // if(!/^[1-9]\d*$/.test(value)) {
            //     callback(new Error('请输入正整数'));
            // } else {
            //     callback();
            // }
            if(!/^(\d|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
                callback(new Error('请输入正确的正数（最多保留2位小数）'))
            } else if(value == 0){
                callback(new Error('不能为0'))
            } else {
                callback();
            }
        }
        return {
            dialog: false,
            title: '',
            loading: false,
            giftType: [
                {label: '大', value: 1},
                {label: '中', value: 2},
                {label: '小', value: 3},
            ],
            giftForm: {
                allowContinuity: false,
                status: false,
                num: false
            },
            imgUrl: '',
            rules: {
                num:[{validator: num}]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            this.dialog = val;
        },
        title(val) {
            this.title = val;
        },
        detailData(val) {
            this.giftForm = val
        }
    },
    methods: {
        handleClose() {
            // this.dialog = false;
            this.$emit("update:dialogVisible", false)
        },
        // beforeUpload(file) {
        //     if(file.size/1024/1024 > 2) {
        //         this.$message.error("上传图片不能超过2M")
        //     }
        // },
        handleGift() { // 保存礼物
            this.$refs['giftForm'].validate((valid) => {
                if(valid) {
                    this.loading = true;
                    let paramList = {
                        id: this.giftForm.id,
                        name: this.giftForm.name,
                        price: this.giftForm.price * 100,
                        giftKey: this.giftForm.giftKey,
                        giftSize: this.giftForm.giftSize,
                        smallPicture: this.giftForm.smallPicture,
                        bigPicture: this.giftForm.bigPicture,
                        allowSelectNumber: this.giftForm.allowSelectNumber ? 1 : 0,
                        allowContinuity: this.giftForm.allowContinuity ? 1 : 0,
                        continuityTime: parseInt(this.giftForm.continuityTime),
                        confirm: this.giftForm.confirm ? 1 : 0,
                        index: parseInt(this.giftForm.index),
                        status: this.giftForm.status ? "active" : "disabled"
                    }
                    console.log('gift', paramList)
                    if(!this.giftForm.id) {
                        this.$http.get(this.$api.giftCreate, paramList, true)
                        .then(res => {
                            this.loading = false;
                            this.$message.success("添加成功");
                            this.$emit("update:dialogVisible", false);
                            this.$emit('success')
                        })
                        .catch(err => {
                            this.loading = false;
                            this.$message.error(err.message)
                            this.$emit("update:dialogVisible", false);
                        })
                } else {
                        this.$http.get(this.$api.giftUpdate, paramList, true)
                        .then(res => {
                            this.$message.success("修改成功");
                            this.$emit('success')
                            this.$emit("update:dialogVisible", false)
                        })
                        .catch(err => {
                            this.loading = false;
                            this.$message.error(err.message)
                        })
            }
                } else {
                    return false
                }
            })
            // this.loading = true;
            // let paramList = {
            //     id: this.giftForm.id,
            //     name: this.giftForm.name,
            //     price: this.giftForm.price * 100,
            //     smallPicture: this.giftForm.smallPicture,
            //     bigPicture: this.giftForm.bigPicture,
            //     allowSelectNumber: this.giftForm.allowSelectNumber ? 1 : 0,
            //     allowContinuity: this.giftForm.allowContinuity ? 1 : 0,
            //     continuityTime: parseInt(this.giftForm.continuityTime),
            //     confirm: this.giftForm.confirm ? 1 : 0,
            //     index: parseInt(this.giftForm.index),
            //     status: this.giftForm.status ? "active" : "disabled"
            // }
            // console.log(paramList)
            // if(!this.giftForm.id) {
            //     this.$http.get(this.$api.giftCreate, paramList, true)
            //     .then(res => {
            //         this.loading = false;
            //         this.$message.success("添加成功");
            //         this.$emit("update:dialogVisible", false);
            //         this.$emit('success')
            //     })
            //     .catch(err => {
            //         this.loading = false;
            //         this.$message.error(err.message)
            //         this.$emit("update:dialogVisible", false);
            //     })
            // } else {
            //     this.$http.get(this.$api.giftUpdate, paramList, true)
            //     .then(res => {
            //         this.$message.success("修改成功");
            //         this.$emit('success')
            //         this.$emit("update:dialogVisible", false)
            //     })
            //     .catch(err => {
            //         this.loading = false;
            //         this.$message.error(err.message)
            //     })
            // }
        }
    },
    components: {
        ImageUpload
    }
}
</script>

<style lang="scss" scoped>
    .content {
        text-align: center;
    }
    .avatar {
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
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
  .el-icon-plus {
    font-size: 12px;
    color: #8c939d;
  }
  .smallImg {
    width: 25px;
    height: 25px;
  }
  .largeImg {
      width: 50px;
      height: 50px;
  }
</style>
