<template>
    <div class="xk-radius">
        <el-col class="item-class">
            <el-col class="title">小视频敏感词设置（标题+直播间+评论）</el-col>
            <el-col class="content">
                        <span class="content-item">上传敏感词：
                            <span class="haveValue" v-if="videoDetail.docName">
                                <a :download="videoDetail.docName" :href="videoDetail.docUrl +'?attname=' + videoDetail.docName" 
                                style="text-decoration: none; color: #409EFF">{{videoDetail.docName}}</a>
                            </span>
                            <span class="notValue" v-show="!videoDetail.docUrl">请上传小视频敏感词</span>
                        </span>
                        <!-- <file-upload>替换</file-upload> -->
                        <file-upload style="display: inline-block" @input="videoSuccess">
                            <el-button type="primary" :size="$size" v-if="videoDetail.docUrl" v-permission="uploadSensitiveWord">替换</el-button>
                        </file-upload>
                        <!-- <file-upload style="display: inline-block">
                            <el-button type="primary" :size="$size" v-if="videoDetail.docUrl" @click.stop="down(videoDetail.docUrl, videoDetail.docName)">下载</el-button>
                        </file-upload> -->
                        <file-upload style="display: inline-block" @input="videoSuccess">
                            <el-button type="primary" :size="$size" v-if="!videoDetail.docUrl" v-permission="uploadSensitiveWord">上传</el-button>
                        </file-upload>
                        <a :download="videoDetail.docName" :href="videoDetail.docUrl +'?attname=' + videoDetail.docName" 
                        class="upload-class" v-if="videoDetail.docUrl">下载</a>
            </el-col>
            <el-col class="warning-text" v-if="!videoDetail.docUrl">*请上传txt格式文件</el-col>
            <el-col class="line"></el-col>
        </el-col>
        <el-col class="item-class">
            <el-col class="title">可有圈敏感词设置（标题+直播间+评论）</el-col>
            <el-col class="content">
                        <span class="content-item">上传敏感词：
                            <span class="haveValue" v-if="keyouDetail.docName">
                                <a :download="keyouDetail.docName" :href="keyouDetail.docUrl +'?attname=' + keyouDetail.docName" 
                                style="text-decoration: none; color: #409EFF">{{keyouDetail.docName}}</a>
                             </span>
                            <span class="notValue" v-show="!keyouDetail.docUrl">请上传小视频敏感词</span>
                        </span>
                        <file-upload style="display: inline-block" @input="keyouSuccess">
                            <el-button type="primary" :size="$size" v-if="keyouDetail.docUrl" v-permission="uploadSensitiveWord">替换</el-button>
                        </file-upload>
                        <!-- <file-upload style="display: inline-block">
                            <el-button type="primary" :size="$size" v-if="keyouDetail.docUrl" 
                            @click="down(keyouDetail.docUrl, keyouDetail.docName)">下载</el-button>
                        </file-upload> -->
                        <!-- <a :download="keyouDetail.docName" :href="keyouDetail.docUrl" class="upload-class" target="_blank">下载</a> -->
                        <file-upload style="display: inline-block" @input="keyouSuccess">
                            <el-button type="primary" :size="$size" v-if="!keyouDetail.docUrl" v-permission="uploadSensitiveWord">上传</el-button>
                        </file-upload>
                        <a :download="keyouDetail.docName" :href="keyouDetail.docUrl +'?attname=' + keyouDetail.docName" 
                        class="upload-class"  v-if="keyouDetail.docUrl">下载</a>
            </el-col>
            <el-col class="warning-text" v-if="!keyouDetail.docUrl">*请上传txt格式文件</el-col>
            <el-col class="line"></el-col>
        </el-col>
         <el-col class="item-class">
            <el-col class="title">商品/商圈评价敏感词设置（标题+直播间+评论）</el-col>
            <el-col class="content">
                        <span class="content-item">上传敏感词：
                            <span class="haveValue" v-if="businessDetail.docName">
                                <a :download="businessDetail.docName" :href="businessDetail.docUrl +'?attname=' + businessDetail.docName"
                                style="text-decoration: none; color: #409EFF" >{{businessDetail.docName}}</a>
                            </span>
                            <span class="notValue" v-show="!businessDetail.docUrl">请上传小视频敏感词</span>
                        </span>
                        <file-upload style="display: inline-block" @input="businessSuccess">
                            <el-button type="primary" :size="$size" v-if="businessDetail.docUrl" v-permission="uploadSensitiveWord">替换</el-button>
                        </file-upload>
                        <!-- <file-upload style="display: inline-block">
                            <el-button type="primary" :size="$size" v-if="businessDetail.docUrl"
                            @click="down(businessDetail.docUrl, businessDetail.docName)">下载</el-button>
                        </file-upload> -->
                        <!-- <a :download="businessDetail.docName" :href="businessDetail.docUrl" class="upload-class" target="_blank">下载</a> -->
                        <file-upload style="display: inline-block" @input="businessSuccess">
                            <el-button type="primary" :size="$size" v-if="!businessDetail.docUrl" v-permission="uploadSensitiveWord">上传</el-button>
                        </file-upload>
                        <a :download="businessDetail.docName" :href="businessDetail.docUrl +'?attname=' + businessDetail.docName" 
                        class="upload-class"  v-if="businessDetail.docUrl">下载</a>
            </el-col>
            <el-col class="warning-text" v-if="!businessDetail.docUrl">*请上传txt格式文件</el-col>
        </el-col>
    </div>
</template>

<script>
import FileUpload from "@/components/FileUpload"
export default {
    name: 'newBadWord',
    data() {
        return {
            detail: {},
            videoDetail: {},
            keyouDetail: {},
            businessDetail: {},
            videoFileObj: {},
            keyouFileObj: {},
            businessFileObj: {}
        }
    },
    created() {
        this.getSensitiveWordLibraryQPage();
    },
    methods: {
        getSensitiveWordLibraryQPage() { // 敏感词列表
            let paramList = {
                    page: 1,
                    limit: 10
                }
            this.$http.get(this.$api.sensitiveWordLibraryQPage, paramList, true)
            .then(res => {
                console.log(res)
                if(res.data) {
                    for(let item of res.data) {
                        if(item.wordLibraryType === 'VIDEO') {
                            this.videoDetail = item
                        }
                        if(item.wordLibraryType === 'KEYOU') {
                            this.keyouDetail = item
                        }
                        if(item.wordLibraryType === 'BCIRCLE') {
                            this.businessDetail = item
                        }
                    }
                }
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        isTxt(val) {
            let valArr = val.split('.')
            if(valArr.length > 0) {
                if(valArr[valArr.length-1] === 'txt') {
                    return true
                } else {
                    return false
                }
            } else {
                return false;
            }
        },
        videoSuccess(obj) {
            if(this.isTxt(obj.fileName)) {
                let paramList = {
                    wordLibraryId: this.videoDetail.id,
                    docName: obj.fileName,
                    docUrl: obj.fileUrl
                }
                this.$http.post(this.$api.sensitiveWordLibraryUpdate, paramList, true)
                .then(res => {
                    this.$message.success('上传成功')
                    this.getSensitiveWordLibraryQPage();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                this.$message.warning("请上传txt格式文件")
            }
        },
        keyouSuccess(obj) {
            if(this.isTxt(obj.fileName)) {
                let paramList = {
                    wordLibraryId: this.keyouDetail.id,
                    docName: obj.fileName,
                    docUrl: obj.fileUrl
                }

                this.$http.post(this.$api.sensitiveWordLibraryUpdate, paramList, true)
                .then(res => {
                    this.$message.success('上传成功')
                    this.getSensitiveWordLibraryQPage();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                this.$message.warning("请上传txt格式文件")
            }
        },
        businessSuccess(obj) {
            if(this.isTxt(obj.fileName)) {
                let paramList = {
                    wordLibraryId: this.businessDetail.id,
                    docName: obj.fileName,
                    docUrl: obj.fileUrl
                }

                this.$http.post(this.$api.sensitiveWordLibraryUpdate, paramList, true)
                .then(res => {
                    this.$message.success('上传成功')
                    this.getSensitiveWordLibraryQPage();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                this.$message.warning("请上传txt格式文件")
            }
        },
        down(url, name) { // 下载文件
            this.$http.downFile(url, name);
        }
    },
    components: {
        FileUpload
    }
}
</script>

<style lang="scss" scoped>
    .title {
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .content {
        margin-bottom: 10px;
    }
    .content-item {
        font-size: 14px;
    }
    .haveValue {
        display: inline-block;
        color: #409EFF;
        margin-right: 20px;
    }
    .notValue {
        display: inline-block;
        color: #909399;
        margin-right: 20px;
    }
    .line {
        width: 100%;
        height: 1px;
        background-color: #e3e3e3;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .warning-text {
        color: #E6A23C;
        font-size: 14px;
    }
    .upload-class {
        display: inline-block;
        font-size: 12px;
        text-decoration: none;
        padding: 8px 15px 9px 15px;
        border-radius: 3px;
        background-color: #9795E3;
        color: #ffffff;
    }
</style>
