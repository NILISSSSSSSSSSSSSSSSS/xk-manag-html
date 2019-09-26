<template>
    <div class="virtual-evaluate">
        <el-dialog title="新增评价详情" :visible.sync="visible">
            <el-form label-width="150px" :model="evalForm" ref="evalForm" :rules="rules">
                <el-form-item label="商品评分：" prop="score">
                    <el-rate v-model="evalForm.score"></el-rate>
                </el-form-item>
                <el-form-item label="评价内容：" prop="content">
                    <el-input :size="$size" v-model.trim="evalForm.content"></el-input>
                </el-form-item>
                <el-form-item label="评价视频：" class="videoUrl">
                    <image-upload :more="false" v-model="evalForm.video" @percentage="percentage" :accept="'video/*'">
                        <img v-if="persent && !persent.status && persent.url" :src="persent.url+'?vframe/jpg/offset/2/'" alt="">
                        <video v-if="evalForm.video && !persent.url" :src="evalForm.video" poster></video>
                        <i v-else-if="!persent.url" class="el-icon-plus avatar-uploader-icon"></i>
                        <el-progress v-if="persent.status" class="circly-progress" type="circle" :percentage="persent.percentage" color="#8e71c7"></el-progress>
                    </image-upload>
                    <el-button v-if="evalForm.video" :size="$size" type="primary" @click="$viewImage(evalForm.video, true)">预览视频</el-button>
                    <el-button v-if="evalForm.video" :size="$size" type="danger" @click="deleteVideo()">删除视频</el-button>
                    <!-- <p><span class="xk-danger">*  </span><span class="limint-txt">评价视频默认第一张显示，最多一个，不超过50M</span></p> -->
                </el-form-item>
                <el-form-item label="评价图片：">
                    <image-upload v-model="evalForm.pictures" :isShow="isShow" :more="true" size="3" uploadNumber="9"></image-upload>
                    <!-- <p><span class="xk-danger">*  </span><span class="limint-txt">商品图片至少上传1张，最多5张，商品主图大小不能超过3MB，比例1:1尺寸1137*1137px</span></p> -->
                </el-form-item>
                <el-form-item label="是否启用：">
                     <el-checkbox v-model="evalForm.enabled" :true-label="1" :false-label="0"></el-checkbox>
                </el-form-item>
            </el-form>
           <div class="btn-group">
               <el-button :size="$size" type="primary" @click="visible=false">取消</el-button>
               <el-button :submitLoading="submitLoading1" :disabled="submitLoading1" :size="$size" type="primary" @click="submitEval('evalForm', false)">确定</el-button>
               <el-button :submitLoading="submitLoading2" :disabled="submitLoading2" :size="$size" type="primary" @click="submitEval('evalForm', true)">确定并继续新增</el-button>
           </div>
        </el-dialog>
    </div>
</template>
<script>
    import ImageUpload from "@/components/ImageUpload.vue"
    export default {
        props: {
            visible: {
                default: false,
                type: Boolean
            },
            goodsIds: [],
            type: {
                default: 'mall',
                type: String
            },
            goods: []
        },
        components: {
            ImageUpload
        },
        data() {
            return {
                persent: {},   //进度条
                isShow: true,  
                submitLoading1: false,
                submitLoading2: false,
                evalForm: {
                    enabled: 0
                },
                rules: {
                    content: [
                        { required: true , message: '不能为空', trigger: 'blur'}
                    ],
                    score: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            hideDia() {
                this.$emit('update:visible', false)
            },
            //进度条
            percentage(obj) {
                this.persent = obj
            },
            //删除视频
            deleteVideo() {
                this.evalForm.video = "";
                this.persent = {};
            },
            submitEval(formName, bool) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = {
                            content: this.evalForm.content,
                            score: this.evalForm.score,
                            enabled: this.evalForm.enabled
                        };
                        this.evalForm.video
                        ? params.video = {
                            url: this.evalForm.video,
                            mainPic: this.evalForm.video + '&vframe/jpg/offset/1/'
                        }
                        : null;
                        this.evalForm.pictures                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                        ? params.pictures = this.evalForm.pictures
                        : null;
                        if(this.type === 'mall'){
                            params.goodsIds = this.goodsIds
                        }else{
                            params.goods = this.goods;
                        }
                        console.log(params);
                        bool? this.submitLoading2 = true: this.submitLoading1 = true;
                        this.$http
                        .post(this.type === 'mall'? this.$api.createCommentsInMall: this.$api.createCommentsInBCircle, params, true)
                        .then(res=>{
                            this.submitLoading1 = false;
                            this.submitLoading2 = false;
                            this.$message.success('保存成功');
                            this.evalForm = {
                                enabled: 0
                            };
                            this.persent = {};
                            if(!bool) {
                                this.visible = false;
                                this.hideDia();
                            }
                        })
                        .catch(err=>{
                            this.submitLoading1 = false;
                            this.submitLoading2 = false;
                            this.$message.error(err.message)
                        })
                    }
                })
            }
        },
        watch: {
            visible(val) {
                !val? this.hideDia() : this.$refs['evalForm']? this.$refs['evalForm'].resetFields(): null;
                if(val) {
                    this.evalForm = {
                        enabled: 0
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .virtual-evaluate {
        .videoUrl {
            /deep/ .el-upload {
                width: 146px;
                height: 146px;
                line-height: 146px;
                position: relative;
                border: 1px dashed #c0ccda;
                border-radius: 6px;
                i{
                    font-size: 28px;
                    color: #8c939d;
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
            video{
                width: 100%;
                height: 100%;
            }
            .circly-progress{
                position: absolute;
                left: 0;
                top: 0;
                background: #fff;
                width: 100%;
                height: 100%;
                display: flex;
                z-index: 666;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
