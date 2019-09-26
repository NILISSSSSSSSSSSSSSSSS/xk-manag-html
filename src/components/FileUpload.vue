<template>
    <div class = 'file-upload'>
        <el-upload
                :action="uploadPath"
                :before-upload="beforeUpload"
                :data="uploadParam"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-progress="handleProcess"
                :show-file-list='false'
                >
            <slot></slot>
        </el-upload>
    </div>
</template>
<script>
import {getQiNiuToken, getUUid} from '../util/publicMehotds'
import {uploadPath, previewPath} from '../util/publicParams.js'
export default {
    name:'fileUpload',
    data () {
        return {
            uploadPath,
            uploadParam: {
                token: "",
            },
            uploadPercent: 0
        };
    },
    props: {
        value: {
            type: [String , Array , Object],
            default: ()=>({})
        },
        type: ""
    },
    methods: {
        async beforeUpload(file){
            if(this.type) {
                this.uploadParam.key = "/wypayorder/"+ new Date().getTime() + "/"+getUUid() +".cvs";
            }
            //获取七牛token
            await getQiNiuToken().then(res => {
                this.uploadParam.token = res;
            });
            this.$emit('percent',0)
        },
        handleSuccess(response, file, fileList){
            // console.log(response);
            // console.log(file);
            // console.log(fileList);
            let obj = {
                fileName:file.name,
                fileUrl:previewPath + response.key,
                fileSize:file.raw.size,
                fileSuffix:file.raw.type.split("/")[1]
            }
            this.$emit('input',obj)
        },
        handleError(){
            //七牛token过期重新获取七牛token
            getQiNiuToken();
            this.$message.error("七牛token过期，请重新上传");
        },
        handleProcess(event, file, fileList){
            console.log(event, file, fileList);
            this.$emit('percent',event.percent.toFixed(2))
        },
    },
    watch: {}
}
</script>
<style scoped>
</style>