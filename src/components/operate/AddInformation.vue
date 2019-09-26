<template>
    <div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="900px"
                :before-close="handleClose">
            <el-form ref="formInfo" :model="form" :rules="rules" class="add-information" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-row>
                        <el-col :span="18">
                            <el-input :size="$size" class="add-information-inp" placeholder="请填写标题"
                                      v-model="form.title"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="类型" prop="activityTypeId">
                    <el-row>
                        <el-col :span="18">
                            <el-select :size="$size" class="add-information-inp" placeholder="请选择类型"
                                       v-model="form.activityTypeId">
                                <el-option v-for="(item,index) in activityTypes" :label="item.name" :value="item.id"
                                           :key="index"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="in-right" :span="6">
                            <el-button @click="addType" :size="$size" type="primary">创建类型</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="时间" prop="pushTime">
                    <el-row>
                        <el-col :span="18">
                            <el-date-picker type="datetime" :size="$size" placeholder="请选择发送时间"
                                            class="add-information-inp"
                                            v-model="form.pushTime"></el-date-picker>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-row>
                        <el-col :span="18">
                            <el-input
                                    type="textarea"
                                    :rows="5"
                                    class="add-information-inp"
                                    v-model="form.content"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="图片" prop="content">
                    <image-upload class="avatar-uploader" v-model="form.image" :more="false">
                        <img v-if="form.image" :src="form.image" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                </el-form-item>
                <el-form-item label="内容格式：">
                    <div>
                        <el-radio v-model="form.consultType" label="text">富文本</el-radio>
                        <el-radio v-model="form.consultType" label="url">H5外链</el-radio>
                    </div>
                    <el-row>
                        <el-col :span="18" v-if="form.consultType==='url'">
                            <el-form-item prop="url" label-width="0">
                                <el-input class="add-information-inp" :size="$size" v-model="form.url"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18" v-else>
                            <el-form-item prop="extendContent" label-width="0">
                                <u-e v-model="form.extendContent" UEheight="height:410px"></u-e>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>

            <div class="dialog-sub">
                <el-button @click="submit" :loading="loadingSub" :size="$size" type="primary"> 确定</el-button>
                <el-button @click="handleClose" :size="$size"> 返回</el-button>
            </div>
        </el-dialog>
        <add-activity-type :dialogVisible.sync="visible" @typeList="typeList"></add-activity-type>
    </div>
</template>

<script>
    import AddActivityType from '../AddActivityType.vue';
    import ImageUpload from '../ImageUpload';
    import moment from 'moment';
    import UE from '../UE.vue';

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            activityTypes: {
                type: Array,
                default: ()=> []
            },
            information: {
                type: Object,
                default: ()=>({})
            },
            userGroup: {
                type: Array,
                default: ()=>[]
            }
        },
        components: {
            UE,
            AddActivityType,
            ImageUpload
        },
        data() {
            const checkContent = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空！'))
                }
                call();
            }
            return {
                dialogTitle:"发布资讯",
                visible: false,
                loadingSub: false,
                form: {
                    consultType: 'text'
                },
                rules: {
                    title: [
                        {required: true, message: '请填写资讯标题', trigger: 'blur'}
                    ],
                    activityTypeId: [
                        {required: true, message: '请选择资讯类型', trigger: 'blur'}
                    ],
                    pushTime: [
                        {required: true, message: '请选择时间', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '资讯内容不能为空', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请填写H5外链', trigger: 'blur'}
                    ],
                    extendContent: [
                        { required: true, validator: checkContent, trigger: 'change' }
                    ]
                }
            }
        },
        watch: {
            information(val) {
                if (val.id) {
                    val.pushTime = new Date(this.$math.multip(val.pushTime, 1000));
                }
                this.dialogTitle = val.id ? "编辑资讯" : "发布资讯";
                val.consultType==='text'? delete val.url: null;
                val.image == '[]'? val.image= '': null;
                this.form = JSON.parse(JSON.stringify(val));
            }
        },
        methods: {
            handleClose() {
                this.$emit("update:dialogVisible", false)
            },
            submit() {
                this.$refs["formInfo"].validate((valid) => {
                    if (valid) {
                        let param = JSON.parse(JSON.stringify(this.form,));
                        if(param.consultType==='text') {
                            param.url = this.generateH5();
                        }
                        param.pushTime = Number(moment(param.pushTime).format('X'));
                        this.loadingSub = true;
                        this.$http.post(param.id? this.$api.consultContentUpdate: this.$api.consultContentCreate, param, true)
                            .then(res => {
                                this.$message.success(param.id?"编辑成功": "创建成功");
                                this.handleClose();
                                this.$emit("successCallback");
                                this.loadingSub = false;
                            })
                            .catch(err => {
                                this.loadingSub = false;
                                this.$message.error(err.message);
                            })
                    }
                })
            },
            addType() {
                this.visible = true;
            },
            typeList(res) {
                this.activityTypes = res;
            },
            //根据当前环境，生成对应的h5页面
            generateH5() {
                let url = '//dev.xksquare.com/share/#/newsInformation?id=';
                if(location.host.indexOf('localhost') > -1) {
                    return window.location.protocol +'//dev.xksquare.com/share/#/newsInformation?id=';
                }else{
                    return window.location.protocol+ '//'+location.host+ '/share/#/newsInformation?id='
                }
            }
        }
    }
</script>

<style scoped>
    .add-information-inp {
        width: 100%;
    }

    .add-information-inp.el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }

    .in-right {
        text-align: right;
    }

    .dialog-sub {
        text-align: center;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader img {
        width: 100px;
        height: 100px;
    }

    .avatar-uploader-icon {
        border: 1px dashed #8c939d;
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>