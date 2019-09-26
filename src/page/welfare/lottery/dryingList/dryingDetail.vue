<template>
    <div class = 'drying-detail xk-container'>
        <div class="xk-radius">
            <div class="xk-title">
                <div class='vus-title'>
                    <span></span>
                    AA大乐透晒单详情
                </div>
                <div class='vus-bottom'></div>
                <div class="aa-detail" v-loading="vLoading">
                    <el-form size="mini" label-width="120px" :model="formData">
                        <div class="aa-title">基本信息</div>
                        <el-form-item label="彩票ID：">
                            {{formData.aaLotteryTicketVo.id}}
                        </el-form-item>
                        <el-row>
                            <el-col :span='12'>
                                <el-form-item label="彩票类型：">
                                    {{formData.aaLotteryTicketVo.typeName}}
                                </el-form-item>
                            </el-col>
                            <el-col :span='12'>
                                <el-form-item label="奖项：">
                                    {{formData.aaLotteryTicketVo.prizeName}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='12'>
                                <el-form-item label="参与期数：">
                                    第{{formData.aaLotteryTicketVo.invoiceNo}}期
                                </el-form-item>
                            </el-col>
                            <el-col :span='12'>
                                <el-form-item label="兑奖方式：">
                                    {{formData.aaLotteryTicketVo.onLine?"线上":"线下"}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <!-- <el-col :span='12'>
                                <el-form-item label="赠送方式：">
                                    {{formData.aaLotteryTicketVo.aaLotterySource=="platform_activity"?"平台 ":formData.aaLotteryTicketVo.aaLotterySource=="merchant_activity"?"联盟商":"晒单"}}
                                </el-form-item>
                            </el-col> -->
                            <el-col :span='12'>
                                <el-form-item label="开奖时间：">
                                    {{formData.aaLotteryTicketVo.lotteryTime | formatTime}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="aa-title">晒单信息</div>
                        <el-row>
                            <el-col :span='12'>
                                <el-form-item label="晒单ID：">
                                    {{formData.aaLotteryComment.id}}
                                </el-form-item>
                            </el-col>
                            <el-col :span='12'>
                                <el-form-item label="用户ID：">
                                    {{formData.aaLotteryComment.commenter.id}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='12'>
                                <el-form-item label="用户名：">
                                    {{formData.aaLotteryComment.commenter.nickName}}
                                </el-form-item>
                            </el-col>
                            <el-col :span='12'>
                                <el-form-item label="手机号码：">
                                    {{formData.aaLotteryComment.commenter.phone}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="评论内容：">
                            {{formData.aaLotteryComment.content}}
                        </el-form-item>
                        <el-form-item label="晒单图片/视频：">
                            <image-list 
                                :url="formData.aaLotteryComment.maxPic"></image-list>
                            <image-list
                                v-if="formData.aaLotteryComment.video && formData.aaLotteryComment.video.url"
                                :url="formData.aaLotteryComment.video.mainPic"
                                type="video"
                                :videoUrl="formData.aaLotteryComment.video.url"
                                ></image-list>
                            <image-list v-for="(item,index) in formData.aaLotteryComment.pictures" :key="index" :url="item"></image-list>
                        </el-form-item>
                        <el-form-item label="晒单时间：">
                            {{formData.aaLotteryComment.createdAt | formatTime}}
                        </el-form-item>
                        <div class="aa-title">晒单审核</div>
                        <template v-if="formData.aaLotteryComment.audit.status=='unAudited'">
                            <el-form-item label="审核结果：">
                                <el-radio v-model="radio" :label="true">通过</el-radio>
                                <el-radio v-model="radio" :label="false">不通过</el-radio>
                                <transition name="slide-fade">
                                    <el-input
                                        v-if="!radio"
                                        type="textarea"
                                        :rows="4"
                                        placeholder="输入不通过原因"
                                        v-model="auditFailedReason">
                                    </el-input>
                                </transition>
                            </el-form-item>
                        </template>
                        <template v-if="formData.aaLotteryComment.audit.status=='verified'">
                            <el-form-item label="审核结果：">
                                已通过
                            </el-form-item>
                            <el-form-item label="审核时间：">
                                {{formData.aaLotteryComment.audit.auditDate | formatTime}}
                            </el-form-item>
                        </template>
                        <template v-if="formData.aaLotteryComment.audit.status=='unApproved'">
                            <el-form-item label="审核结果：">
                                不通过
                            </el-form-item>
                            <el-form-item label="不通过原因：">
                                {{formData.aaLotteryComment.audit.auditFailedReason}}
                            </el-form-item>
                            <el-form-item label="审核时间：">
                                {{formData.aaLotteryComment.audit.auditDate | formatTime}}
                            </el-form-item>
                        </template>
                        <div class="button">
                            <el-button :size="$size" @click="goBack">返回</el-button>
                            <el-button v-if="formData.aaLotteryComment.audit.status=='unAudited'" :size="$size" type="primary" @click="fnAudited" :loading="loading">确定</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ImageList from '@/components/common/ImageList.vue';
export default {
    name:'dryingDetail',
    data () {
        return {
            formData:{
                aaLotteryComment:{
                    audit:{},
                    commenter:{},
                    pictures:[],
                    video:{}
                },
                aaLotteryTicketVo:{}
            },
            radio:true,
            auditFailedReason:"",//不通过原因
            loading:false,
            vLoading:false,
        };
    },
    props: {},
    components: {
        ImageList
    },
    computed: {},
    created() {
        this.fnGetDetail();
    },
    mounted() {},
    methods: {
        fnGetDetail(){
            let aaLotteryCommentId = this.$route.query.aaLotteryCommentId ;
            this.vLoading = true ;
            this.$http.get(this.$api.aaLotteryCommentDetail,{aaLotteryCommentId} , true).then((res) => {
                if(res){
                    this.formData = res ;
                }else{
                    this.formData = {
                        aaLotteryComment:{
                            audit:{},
                            commenter:{},
                            pictures:[],
                            video:{}
                        },
                        aaLotteryTicketVo:{}
                    }
                }
                this.vLoading = false ;
            }).catch((err) => {
                this.formData = {
                    aaLotteryComment:{
                        audit:{},
                        commenter:{},
                        pictures:[],
                        video:{}
                    },
                    aaLotteryTicketVo:{}
                }
                this.vLoading = false ;
                this.$message.error(err.message);
            });
        },
        goBack(){
            // this.$router.push('/dryingList');
            this.$router.push({
                path:'/dryingList',
                query:{
                    // ticketId:this.formData.aaLotteryComment.ticketId,
                    auditStatus:typeof this.$route.query.auditStatus == 'string' ? this.$route.query.auditStatus : 'unAudited'
                }
            })
        },
        fnAudited(){
            let params = {
                aaLotteryCommentId:this.$route.query.aaLotteryCommentId,
                authStatus:this.radio ? "verified" : "unApproved"
            }
            if(this.auditFailedReason){
                params.auditFailedReason = this.auditFailedReason ;
            }
            this.loading = true ;
            this.$http.get(this.$api.aaLotteryCommentAuth,params , true).then((res) => {
                this.loading = false ;
                this.$message({
                    message: '审核成功！',
                    type: 'success'
                });
                this.goBack();
            }).catch((err) => {
                this.loading = false ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {}
}
</script>
<style scoped lang="scss">
@import "./dryingDetail.scss"
</style>