<template>
    <div v-if="isShow" class="xk-image-upload">
        <el-row type="flex" justify="start">
            <el-col v-if="!clip">
                <template v-if="draggable">
                    <vuedraggable class="_wrapper" v-model="draggableUrl">
                        <transition-group>
                            <div v-for="item in draggableUrl" class="draggable-url" :key="item">
                                <img :src="item">
                                <div :class="hiddenDraggable? 'hidden': 'draggable-level'">
                                    <span class="el-icon-close" @click="deleteItem(item)"></span>
                                    <i class="preview el-icon-view" @click="$viewImage(item)"></i>                                    
                                </div>
                            </div>
                        </transition-group>
                    </vuedraggable>
                    <div :id="draggableId" class="draggable" v-if="draggableUrl.length<uploadNumber">
                        <i class="el-icon-plus">
                            <input multiple type="file" name="" @change="draggabel">
                        </i>
                    </div>
                </template>
                <template v-else>
                    <el-upload
                            v-if="more" 
                            :http-request="autoUpload"
                            :action="uploadPath"
                            list-type="picture-card"
                            :before-upload="beforeUpload"
                            :data="uploadParam"
                            :on-error="handleError"
                            :on-remove="handleRemove"
                            :accept="accept"
                            :file-list="fileList"
                            multiple>
                        <i class="el-icon-plus"></i>
                        <slot></slot>
                        <!-- <el-progress type="circle" :percentage="uploadPercent"></el-progress> -->
                    </el-upload>
                    <el-upload
                            v-else
                            :http-request="autoUpload"
                            class="avatar-uploader"
                            :action="uploadPath"
                            :show-file-list="false"
                            :data="uploadParam"
                            :auto-upload="true"
                            :on-error="handleError"
                            :on-remove="handleRemove"
                            :accept="accept"
                            :before-upload="beforeUpload">
                        <slot></slot>
                    </el-upload>
                </template>
            </el-col>
            <el-col v-else>
                <slot></slot>
                <el-upload
                        class="avatar-uploader uploader-cover"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-error="handleError"
                        :on-change="beforeCoverUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar-cover">
                    <i v-else class="el-icon-plus avatar-uploader-icon avatar-cover"></i>
                </el-upload>
                <el-dialog title="图片裁剪" :visible.sync="dialogTableVisible" width="1000px">
                    <upload-image :optionsConfig="optionsConfig" @on-success="uploadSuccess"
                                  v-if="dialogTableVisible"></upload-image>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getQiNiuToken, getUUid} from '../util/publicMehotds'
    import {uploadPath, previewPath} from '../util/publicParams.js'
    import UploadImage from '@/components/clipImage/ClipImage.vue'
    import vuedraggable from 'vuedraggable';

    export default {
        name: 'imageupload',
        components: {
            UploadImage,
            vuedraggable
        },
        props: {
            value: {
                type: [String , Array],
                default: ()=> []
            },
            isShow: {
                type: Boolean,
                default: true
            },
            more: {
                type: Boolean,
                default: false
            },
            checkFun: {
                type: Function,
                default: () => {
                    return true;
                }
            },
            size: [String, Number],   //默认为兆
            sizeUnit: {
                type: String,
                default: 'MB'
            },  // 默认图片单位
            limit: {               //图片宽高限制
                type: Object,
                default: ()=> ({})
            },
            clip: {
                type: Boolean,
                default: false
            },
            optionsConfig: {
                type: Object,
                default: ()=> ({})
            },
            accept: {
                type: String,
                default: 'image/*'
            },
            uploadType: {  //图片上传类型   0：任何类型   1：用户头像
                type: Number,
                default: 0
            },
            draggable: {
                type:Boolean,
                default: false
            },
            uploadNumber: {   //图片允许上传张数
                type: [String , Number],
                default: 8,
            },
        },
        data() {
            return {
                uploadPath,
                uploadParam: {
                    token: "",
                },
                imageUrl: '',
                flag: false,
                dialogTableVisible: false,
                fileList: [],
                uploadPercent: 0,
                isIe9: false,
                draggableUrl: [],
                hiddenDraggable: false,
                draggableId: 'draggable'+ parseInt(Math.random()*1000000)
            }
        },
        created() {
            //  判断IE9
            if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9){
                this.isIe9 = true;
            }
            this.handleList(this.value)
        },
        methods: {
            async draggabel(e) {
                if(this.uploadNumber <= this.draggableUrl.length) {
                    this.$message.error(`图片上传不能超过${this.uploadNumber}张！`);
                    return false;
                }
                let multipleFile = document.getElementById(this.draggableId).getElementsByTagName("input")[0].files;
                if(multipleFile.length+this.draggableUrl.length > this.uploadNumber) {
                   this.$message.error(`图片上传不能超过${this.uploadNumber}张！`);
                   return false;
                }
                await this.beforeUpload();
                for(let i=0, len=multipleFile.length; i<len; i++) {
                    this.autoUpload({
                        file: multipleFile[i],
                        filename: 'file'
                    })
                }
                // this.autoUpload({
                //         file: e.target.files[0],
                //         filename: 'file'
                //     })
            },
            autoUpload(files) {
                if(this.more && this.uploadNumber <= this.fileList.length) {
                    this.$message.error(`图片上传不能超过${this.uploadNumber}张！`);
                    this.fileList.splice(this.fileList.length, 1);
                    return false;
                }
                if(!this.checkFileType(files.file.type.split('/')[0])) {
                    if(this.more) {
                        this.fileList.splice(this.fileList.length, 1);
                    }else{
                        this.fileList = "";
                    }
                    this.$message.error('文件格式不正确，请重新选择！');
                    return false;
                }
                let key;
                if (this.uploadType === 1) {   //上传用户头像指定上传目录
                    key = "avatar/" + getUUid();
                    this.uploadParam.key = key
                }
                if(this.size && this.sizeUnit === 'MB') {
                    if(this.size<= files.file.size/1024/1024) {
                        this.$message.error(`不能上传超过${this.size}M的图片`)
                        if(this.more) {
                            this.fileList.splice(this.fileList.length, 1);
                        }else{
                            this.fileList = "";
                        }
                        return false;
                    }
                }
                if(this.size && this.sizeUnit != 'MB') {
                    if(this.size<= files.file.size/1024) {
                        this.$message.error(`不能上传超过${this.size}KB的图片`)
                        if(this.more) {
                            this.fileList.splice(this.fileList.length, 1);
                        }else{
                            this.fileList = "";
                        }
                        return false;
                    }
                }
                
                let ratio = this.limit.width / this.limit.height;
                if(this.limit.width || this.limit.height) {
                    this.checkLimit(files.file, res=>{
                        if(res.w/res.h != ratio) {
                            this.$message.error(`请上传图片宽高分别为${this.limit.width}*${this.limit.height}的图片`)
                        }else{
                            this.$emit("size",{imgWidth:res.w,imgHeight:res.h,imgSize:files.file.size});
                            this.uploadFiles(files.file, key?key: getUUid(), files.file.name, files.file.type);
                        }
                    });
                }else{
                    if(this.accept.includes("image")){
                        this.checkLimit(files.file, res=>{
                            this.$emit("size",{imgWidth:res.w,imgHeight:res.h,imgSize:files.file.size});
                            this.uploadFiles(files.file, key?key: getUUid(), files.file.name, files.file.type); 
                        });
                    }else{ //传视频
                        this.uploadFiles(files.file, key?key: getUUid(), files.file.name, files.file.type); 
                    }
                }
            },
            checkLimit(data, call) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    let data = e.target.result;
                    let image = new Image();
                    image.onload=function(){
                        call({
                            w: image.width,
                            h: image.height
                        })
                    };
                    image.src= data;
                };
                reader.readAsDataURL(data);
            },
            uploadFiles(file, key, fname, type) {
                if(!this.isIe9) {
                    let form = new FormData();
                    form.append('file', file);
                    form.append('token', this.uploadParam.token);
                    form.append('key', key);
                    form.append('fname', fname);
                    
                    axios.post(uploadPath, form, {
                        onUploadProgress: res=>{
                            console.log(res)
                            let obj = {
                                status: true,
                                percentage:  (res.loaded *100 / res.total).toFixed(2)
                            }
                            this.$emit("percentage", obj)
                        }
                        })
                        .then(res => {
                            // debugger;
                            console.log(res);
                            if(!this.draggable){
                                this.imageUrl = []
                                this.$emit("percentage", {status: false, url: previewPath + res.data.key});
                                if(this.fileList) {
                                    this.fileList.forEach(item=>{
                                        this.imageUrl.push(item.url);
                                    })
                                }
                                this.fileList = ""
                                this.more
                                    ? this.imageUrl.push(previewPath + res.data.key + '?type=' + type)
                                    : this.imageUrl = previewPath + res.data.key + '?type=' + type;
                            }else{
                                this.draggableUrl.push(previewPath + res.data.key + '?type=' + type);
                                this.imageUrl = this.draggableUrl;
                            }
                            console.log(this.imageUrl)
                            this.updateURL();
                        })
                        .catch(err => {
                            this.$message.error(err.message)
                        })
                    }else{
                    }
            },
            async beforeUpload(file) {
                // if (!this.checkFun(file)) {
                //     this.flag = true;
                //     return false;
                // }
                //获取七牛token
                await getQiNiuToken().then(res => {
                    console.log(res)
                    this.uploadParam.token = res;
                });
                if (this.uploadType === 1) {   //上传用户头像指定上传目录
                    let key = "avatar/" + getUUid();
                    this.uploadParam.key = key
                }
            },
            handleError(err, file, fileList) {
                // flag  处理除七牛自身意外的异常
                if (!this.flag) {
                    //七牛token过期重新获取七牛token
                    getQiNiuToken();
                    this.$message.error("七牛token过期，请重新上传");
                }
            },
            handleRemove(file, fileList) {
                let newUrls = [];
                for (let i = 0, len = fileList.length; i < len; i++) {
                    if (fileList[i].response) {
                        newUrls[i] = previewPath + fileList[i].response.key
                    } else {
                        newUrls[i] = fileList[i].url
                    }
                }
                this.imageUrl = newUrls;
                this.updateURL();
            },
            //更新父节点的值
            updateURL() {
                if(this.more&&this.uploadNumber) {
                    if(this.draggable) {
                        this.imageUrl = this.draggableUrl;
                    }
                    this.imageUrl = this.imageUrl.slice(0, this.uploadNumber);
                }
                this.$emit("input", this.imageUrl)
            },
            beforeCoverUpload(file) {
                let dataURL = window.URL.createObjectURL(file.raw);
                this.tmpUrl = dataURL
                this.optionsConfig.imgUrl = dataURL
                this.dialogTableVisible = true
            },
            uploadSuccess(options) {
                this.imageUrl = options.url;
                this.dialogTableVisible = false;
                this.updateURL();
                this.uploadParam = {
                    token: ""
                };
                this.flag = false
            },
            handleList(val) {
                if (Array.isArray(val) && val.length > 0) {
                    if(!this.draggable){
                        this.fileList = [];
                        for (let i = 0, len = val.length; i < len; i++) {
                            let obj = {
                                url: val[i]
                            }
                            this.fileList.push(obj)
                        }
                    }else{
                        this.draggableUrl = val;
                    }
                }else{
                    this.fileList = [];
                    this.imageUrl = ""
                }
            },
            deleteItem(url) {
                let index = this.draggableUrl.indexOf(url);
                this.draggableUrl.splice(index, 1);
                this.imageUrl = this.draggableUrl;
                this.updateURL()
            },
            //检查上传的类型是否正确
            checkFileType(type) {
                if(this.accept.indexOf(type) > -1){
                    return true;
                }
                return false;
            }
        },
        watch: {
            value(val, old) {
                this.handleList(val);
            },
            draggableUrl: {
                handler(val) {
                    this.$emit("input", val)
                },
                deep: true
            },
            fileList:{
                handler(val) {
                    if(this.more && val.length> this.uploadNumber) {
                        this.fileList = val.slice(0, this.uploadNumber);
                        this.$message.error(`图片上传不能超过${this.uploadNumber}张！`)
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        background: #fff;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 146px;
        height: 146px;
        line-height: 146px;
        text-align: center;
    }

    .avatar {
        width: 146px;
        height: 146px;
        display: block;
    }
    ._wrapper {
        display: inline-block;
        float: left;
        span{
            display: inline-block;
        }
        .draggable-url {
            width: 146px;
            margin-right: 10px;
            position: relative;
            height: 146px;
            display: inline-block;
            float: left;
            overflow: hidden;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            &:hover{
                .draggable-level {
                    display: block;
                    background: rgba(0,0,0,.3);
                    transition: all .3s;
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
            .draggable-level {
                display: none;
                width:100%;
                height: 100%;
                position: absolute;
                left:0;
                top: 0;
                z-index: 555;
            }
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 0;
                z-index: 666;
                background: #409eff;
                color: #fff;
                cursor: pointer;
            }
            .preview {
                color: #fff;
                position: absolute;
                z-index: 10;
                left: 50%;
                top: 50%;
                cursor: pointer;
                transform: translateX(-50%) translateY(-50%)
            }
        }
    }
    .draggable {
        display: inline-block;
        text-align: center;
        line-height: 146px;
        border: 1px dashed #d9d9d9;
        width: 146px;
        height: 146px;
        position: relative;
        margin-right: 10px;
        input {
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            opacity: 0;
            width: 100%;
            height: 100%;
            z-index: 666;
        }
    }
</style>
