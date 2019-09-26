<template>
        <el-dialog title="小视频详情"   append-to-body  :visible.sync="lookVideoDia"  top="130px" :before-close="handleClose"  width="900px">
          <div v-loading="loadingTable">
                <el-row :gutter="20" v-if="detail.url">
                    <el-col :span="14">
                         <video :src="detail.url" v-if="detail.url" controls="controls" class="viedoBox"></video>
                    </el-col>
                    <el-col :span="10" class="textBox">
                        <div>
                            <span>当前排名：</span>{{ detail.rank}}
                        </div>
                         <!-- <div>
                            <span>状态：</span>
                        </div> -->
                         <div>
                            <span>视频ID：</span>{{ detail.businessId}}
                        </div>
                         <div>
                            <span>用户ID：</span>{{ detail.userId}}
                        </div>
                          <div>
                            <span>用户昵称：</span>{{ detail.userName}}
                        </div>
                          <!-- <div>
                            <span>平台推送：</span>
                        </div> -->
                          <div>
                            <span>内容：</span>{{ detail.headline}}
                        </div>
                          <div>
                            <span>发布时间：</span>{{ detail.createAt | formatTime}}
                        </div>
                         <!-- <div>
                            <span>审核员：</span>
                        </div> -->
                         <div>
                            <span>点击数：</span>{{ detail.clickViewNum}}
                        </div>
                         <div>
                            <span>获赞数：</span>{{ detail.likeNum}}
                        </div>

                          <div>
                            <span>分享数：</span>{{ detail.shareNum}}
                        </div>
                         <div>
                        </div>
                         <div>
                            <span>评论数：</span>{{ detail.commentNum}} <el-button :size="$size" type="text"  v-if="detail.businessId"  @click="videoId=detail.businessId;commentDia=true">查看评论</el-button>
                        </div>
                         <div>
                            <span>礼物价值：</span>{{ detail.giftNum}} 晓可币 <el-button :size="$size" type="text" @click="receivingUserId=detail.userId;giftDia=true">查看礼物</el-button>
                        </div>
                    </el-col>
                </el-row>
                <div v-else>您当前没有上传视频</div>
            </div>
            <div class="sub-btn" style="text-align:center;margin-top:30px">
                <el-button :size="$size" v-if="detail.qualification" @click="cancellationQualificationDia=true" type="primary">取消比赛资格</el-button>
            </div>
            <!-- 取消比赛资格弹框 -->
          <cancellation-qualification :applyId="videoData.applyId" :cancellationQualificationDia.sync="cancellationQualificationDia" reasonType="reason2"  @cancelQualificationSuccess="cancelQualificationSuccess"></cancellation-qualification>
            <!-- 查看礼物弹框 -->
       <look-gift :giftDia.sync='giftDia' :receivingUserId="receivingUserId"></look-gift>
        <!-- 查看评价弹框 -->
       <look-comment :commentDia.sync='commentDia'  :videoId="videoId"></look-comment>

        </el-dialog>
    
</template>
<script>
  import CancellationQualification from "@/components/operate/game/competition/CancellationQualification.vue"
  import  LookGift from "@/components/operate/game/competition/LookGift.vue" 
import  LookComment from "@/components/operate/game/competition/LookComment.vue" 
    export default {
        name:"小视频详情",
        components:{
          CancellationQualification,
            LookGift,
       LookComment
        },
        props:{
             lookVideoDia: {
                type: Boolean,
                default: false
            },
          videoData:{
            default: ()=>({
            })
          },
        },
        watch:{
          videoData(val){
            if(val.rid){
              this.getDetail()
            }
          }
        },
        data(){
          return{
            loadingTable:false,
            detail:{},
            competitionId:this.$route.query.competitionId,
            cancellationQualificationDia:false,
            giftDia:false,
            commentDia:false,
            receivingUserId:"",
            videoId:""
          }
        },
        methods:{
           handleClose(){
               var oVideo = document.getElementsByClassName("viedoBox")[0];
               oVideo ? oVideo.pause() : '';
             
                this.$emit("update:lookVideoDia", false);
           },
           getDetail(){
               let data={
                competitionId:this.competitionId,
                roundIndex:Number(this.videoData.roundIndex),
                rid:this.videoData.rid,
            }
             this.loadingTable = true;
             this.$http.get(this.$api.productionDetail, data, true) .then(res => {
                    console.log("视频详情" + JSON.stringify(res));
                     if( res){
                        this.detail=res;
                    }
                    else{
                        this.detail={};
                    }
                    this.loadingTable = false;

                    
                })
                .catch(res => {
                     this.detail={};
                    this.loadingTable = false;
                    this.$message.error(res.message);
                });
           },
           //资格取消成功
           cancelQualificationSuccess(){
             this.$emit("reParent");
             this.handleClose();
           }
        }
    }
</script>
<style scoped lang="scss">
    .viedoBox{
        width: 100%;height: 450px;
    }
    .textBox{
        div{
            span{
                   margin-right: 0px;
                    width: 100px;
                    display: inline-block;
                    margin-left: 30px;
            }
            line-height: 2;font-size: 15px;
        }
    }
</style>