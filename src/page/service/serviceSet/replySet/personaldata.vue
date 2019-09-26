<template>
    <div class='personaldata' v-loading='vloading'>
        <el-form :model="form" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="客服头像：" prop="avatar" required>
                <image-upload v-model="form.avatar" :uploadType="uploadType" :isShow.sync='isShow'>
                    <img v-if="form.avatar" :src="form.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </image-upload>
            </el-form-item>
            <el-form-item label="客服昵称：" required>
                <el-input v-model="form.nickName"></el-input>
            </el-form-item>
            <el-form-item label="客服星级：">
                {{level}}
            </el-form-item>
            <el-form-item label="个人简介：" required>
                <el-input type='textarea' v-model="form.introduce"></el-input>
            </el-form-item>
            <div class="btn-center">
                <el-button :size="$size">取消</el-button>
                <el-button :size="$size" type="primary" @click.stop="submit" :loading="load">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    import ImageUpload from '@/components/ImageUpload.vue'
    import {mapState, mapMutations} from 'vuex';
    export default {
        name: 'personaldata',
        data() {
            return {
                form: {
                    avatar: "",
                    nickName: "",
                    introduce: ""
                },
                uploadType: 1,
                level: null,
                isShow: true,
                vloading:false,
                load:false
            };
        },
        components: {
            ImageUpload
        },
        computed: {
             ...mapState({
                userPersonalInfo: state => state.userInfo.userPersonalInfo,
            })
        },
        created() {
            this.getcsCustomerDetail();
            console.log(this.userPersonalInfo)
        },
        mounted() {
        },
        methods: {
            ...mapMutations({
                setUserPersonalInfo: "userInfo/setUserPersonalInfo",
            }),
            submit() {
                console.log(this.form);
                this.vloading = true ;
                this.$http.get(this.$api.csCustomerUpdate, this.form, true).then(res => {
                    this.vloading = false ;
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    // 更新头像
                    this.userPersonalInfo.avatar = this.form.avatar ;
                    this.userPersonalInfo.nickName = this.form.nickName ;
                    this.setUserPersonalInfo(this.userPersonalInfo)
                }).catch(err => {
                    this.$message.error(err.message);
                    this.vloading = false ;
                })
            },
            getcsCustomerDetail() {
                this.vloading = true ;
                this.$http.get(this.$api.csCustomerDetail, {}, true).then(res => {
                    console.log(res);
                    this.vloading = false ;
                    if(!res){
                        return
                    }
                    if (typeof res.level === 'number') {
                        this.level = res.level;
                    } else {
                        this.level = '未评分';
                    }
                    this.form.avatar = res.avatar;
                    this.form.nickName = res.nickName;
                    this.form.introduce = res.introduce;
                }).catch(err => {
                    this.$message.error(err.message);
                    this.vloading = false ;
                })
            }
        }
    }
</script>
<style scoped>
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

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

<style lang='scss' scoped>
    .btn-center {
        display: flex;
        justify-content: center;
    }
</style>