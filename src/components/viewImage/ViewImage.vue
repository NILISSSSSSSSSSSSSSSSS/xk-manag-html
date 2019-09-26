<template>
    <div class="view-image">
        <!-- 图片、视频查看 -->
        <el-dialog :visible.sync="visible" :title="!type || picUrl.split('?')[1] && picUrl.split('?')[1].indexOf('video')==-1 || picUrl.split('?').length==1? '预览图片':'预览视频'" width="600px" class="prviewPic">
            <img v-if="!type || picUrl.split('?')[1] && picUrl.split('?')[1].indexOf('video')==-1 || picUrl.split('?').length==1" :src="picUrl" alt="" class="preview-pic">
            <video v-else :src="picUrl" controls></video>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            type: Boolean
        },
        data() {
            return {
                picUrl: '',
                visible: false
            }
        },
        watch: {
            visible(val) {
                !val? this.picUrl="":null;
            }
        }
    }
</script>
<style scoped lang="scss">
    .view-image {
        .prviewPic {
            text-align: center;
            img {
                max-width: 100%;
            }
            video {
                max-width: 100%;
            }
        }
    }
</style>
