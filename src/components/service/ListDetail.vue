<template>
  <div class = 'listDetail'>
      <el-dialog
        title="工单详情"
        :visible="showdetail"
        width="1200px"
        @close="handleClose">
            <div class="xk-detail">
                <div class="xk-top">
                    <div class="xk-list">
                        <div class="xk-item" style="border-top:0">
                            <div class="xk-table-title">
                                工单ID
                            </div>
                            <div class="xk-table-content">
                                {{data.id}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                创建客服
                            </div>
                            <div class="xk-table-content">
                                {{data.createdName?data.createdName:"无"}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                工单标题
                            </div>
                            <div class="xk-table-content">
                                {{data.title}}
                            </div>
                        </div>
                        <div class="xk-item xk-2">
                            <div class="xk-table-title">
                                工单描述
                            </div>
                            <div class="xk-table-content">
                                {{data.description}}
                            </div>
                        </div>
                        <div class="xk-item xk-2">
                            <div class="xk-table-title">
                                工单附件
                            </div>
                            <div class="xk-table-content enclosure">
                                <span v-if="!data.attachments">
                                    无附件
                                </span>
                                <span v-else>
                                    <a target="_blank" :href="item" :key="index" v-for="(item,index) in data.attachments">
                                        附件{{index+1}}
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                创建时间
                            </div>
                            <div class="xk-table-content">
                                {{data.createdAt | formatTime}}
                            </div>
                        </div>
                    </div>
                    <div class="xk-list">
                        <div class="xk-item" style="border-top:0">
                            <div class="xk-table-title">
                                工单状态
                            </div>
                            <div class="xk-table-content">
                                {{data.orderStatus | WorkStatus}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                流转客服
                            </div>
                            <div class="xk-table-content">
                                {{data.takeOverName?data.takeOverName:"无"}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                用户
                            </div>
                            <div class="xk-table-content">
                                {{data.customerPhone}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                姓名
                            </div>
                            <div class="xk-table-content">
                                {{data.customerName}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                完成时长
                            </div>
                            <div class="xk-table-content">
                                {{timeLone}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                完成时间
                            </div>
                            <div class="xk-table-content">
                                {{data.finishedAt | formatTime}}
                            </div>
                        </div>
                        <div class="xk-item xk-2">
                            <div class="xk-table-title">
                                评分
                            </div>
                            <div class="xk-table-content">
                                {{data.level}}
                            </div>
                        </div>
                    </div>
                    <div class="xk-list">
                        <div class="xk-item" style="border-top:0">
                            <div class="xk-table-title">
                                是否投诉客服
                            </div>
                            <div class="xk-table-content">
                                {{data.complaintStatus?"是":"否"}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                投诉时间
                            </div>
                            <div class="xk-table-content">
                                <span v-if='data.complaintCreatedAt'>
                                    {{data.complaintCreatedAt | formatTime}}
                                </span>
                                <span v-else>
                                    无
                                </span>
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                投诉事件ID
                            </div>
                            <div class="xk-table-content">
                                {{data.complaintStatus?data.id:"无"}}
                            </div>
                        </div>
                        <div class="xk-item">
                            <div class="xk-table-title">
                                投诉附件
                            </div>
                            <div class="xk-table-content enclosure" style="line-height:39px">
                                <span v-if="!data.complaintAttachments">
                                    无附件
                                </span>
                                <span v-else>
                                    <a target="_blank" :href="item" v-for="(item,index) in data.complaintAttachments" :key="index">
                                        附件{{index+1}}
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div class="xk-item xk-4">
                            <div class="xk-table-title">
                                投诉原因
                            </div>
                            <div class="xk-table-content">
                                {{data.complaintReason?data.complaintReason:"无"}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="xk-bottom">
                    <div class="xk-table-title">
                        IM记录
                    </div>
                    <div class="xk-table-content">
                        <!-- <div v-for="item in imList" :key="item">
                            <span>
                                <span style="color:#999;margin-right:10px">{{item.sendTime | formatTime}}</span>
                                <span style="color:#666">{{item.nickname}}： </span>
                                <span v-if="item.body">
                                    <span v-if="item.body.type===0 || item.body.type===1">
                                        {{item.body.data.msgContent}}
                                    </span>
                                    <span v-if="item.body.type===2">
                                        <img :src="item.body.data.url+'.'+item.body.data.ext" alt="">
                                    </span>
                                    <span v-if="item.body.type===13">
                                        <a :href="item.body.data.url"></a>
                                    </span>
                                </span>
                            </span>
                        </div> -->
                        <div v-for="item in imList" :key="item">
                            <div class="day" v-show="item.showDay">{{item.sendTime | formatTime('YY-MM-DD')}}</div>
                            <div class="nick-time" v-if="item.body.type===1001||
                                                    item.body.type===1008 || 
                                                    item.body.type===1002 ||
                                                    item.body.type===1003 ||
                                                    item.body.type===1004 ||
                                                    item.body.type===4001 || item.body.type===4002">
                                <span>{{item.nickname}}</span>
                                <span>{{item.sendTime | formatTime('HH:mm:ss')}}</span>
                            </div>
                            <div class="im-content">
                                <span v-if="item.body.type===1001||item.body.type===1008">
                                    {{item.body.data.msgContent}}
                                </span>
                                <span v-if="item.body.type===1002">
                                    <img :src='item.body.data.imgUrl + "?imageMogr2/auto-orient"' style='max-width:400px;'>
                                </span>
                                <div v-if="item.body.type===1003">
                                    <audio :src="item.body.data.voiceUrl" controls></audio>
                                </div>
                                <div v-if="item.body.type===1004">
                                    <video :src="item.body.data.videoUrl" controls width='400' ></video>
                                </div>
                                <div v-if="item.body.type===4001" class="xk-content" @click.stop='fnJumpOrder(item.body)'>
                                    <div class='xk-order'>
                                        <img :src="item.body.data.orderIconUrl" />
                                        <div class='xk-detail'>
                                            <div class='xk-name'>
                                                {{item.body.data.commodityName}}
                                            </div>
                                            <div class='xk-spec' v-show="item.body.data.orderType==2">
                                                {{item.body.data.commoditySpecification}}
                                            </div>
                                            <div class='xk-price'>
                                                订单号：<span>{{item.body.data.orderId}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="item.body.type===4002">
                                    <a :href="item.body.data.knowledgeUrl" target="_blank">{{item.body.data.msgContent}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </el-dialog>
  </div>
</template>
<script>
import Moment from 'moment';
export default {
  name:'listDetail',
  data () {
    return {
        data: {
            id:'',
            createdName:"",
            title:"",
            description:"",
            attachments:[],
            createdAt:"",

            orderStatus:"",
            takeOverName:"",
            customerPhone:"",
            customerName:"",
            duration:"",
            finishedAt:"",
            level:"",

            complaintStatus:"",
            complaintCreatedAt:"",
            complaintAttachments:"",
            complaintReason:""
        },
        imList:[],
        day:0
    };
  },
  props:{
      showdetail:{},
      workId:{},
      isComplain:{
          type:Boolean,
          default:false
      }
  },
  components: {},
  computed: {
      timeLone(){
          let time = this.data.duration;
          let h = parseInt(time/3600);
          let m = parseInt((time%3600)/60);
          let s = (time%3600)%60 ;
          let t = '';
          if(h){
              t += h + '小时'
          }
          if(m){
              m = m <10 ? "0" + m : m;
              t += m + "分钟"
          }
          t+=s+"秒"
          return t;
      }
  },
  created() {},
  methods: {
      dataInit(){
          this.data = {
                id:'',
                createdName:"",
                title:"",
                description:"",
                attachments:[],
                createdAt:'',

                orderStatus:"",
                takeOverName:"",
                customerPhone:"",
                customerName:"",
                duration:"",
                finishedAt:"",
                level:"",

                complaintStatus:"",
                complaintCreatedAt:"",
                complaintAttachments:"",
                complaintReason:""
            };
            this.imList=[]
      },
      handleClose(){
          this.$emit('closeshowdetail')
      },
      getdetail(){
            console.log(this.isComplain)
            let apiName = "workOrderDetail";
            let obj = {
                id:this.workId
            };
            if(this.isComplain){
                obj = {
                    workOrderId:this.workId
                };
                apiName = 'complaintDetail'
            }
            this.$http.get(this.$api[apiName],obj,true)
                .then(res => {
                    console.log(res);
                    this.data = res;
                })
                .catch(err => {
                    console.log(obj)
                    this.$message.error(err.message);
                })
      },
      getIMpage(){
          this.$http.get(this.$api.workOrderMsgRecordsList,{workOrderId:this.workId},true)
            .then(res => {
                console.log(res);
                
                this.imList = res;
                try {
                    this.imList.forEach((item,index) => {
                        if(index===0){
                            this.day = Moment(item.sendTime).format("YY-MM-DD")
                            this.imList[index].showDay = true ;
                            
                        }else{
                            if(Moment(item.sendTime).format("YY-MM-DD")==this.day){
                                this.imList[index].showDay = false ;
                            }else{
                                this.imList[index].showDay = true ;
                                this.day = Moment(item.sendTime).format("YY-MM-DD")
                            }
                        }
                    });
                } catch (error) {
                    
                }
            })
            .catch(err => {
                this.imList = [];
                this.$message.error(err.message);
            })
      },
      fnJumpOrder(target){
          console.log(target)
          window.open(target.data.url)
      }
  },
  watch:{
      showdetail(newV){
          if(newV){
              this.getdetail();
              this.getIMpage()
          }else{
              this.dataInit()
          }
      }
  }
}
</script>
<style lang='scss' scoped>
@import './listDetail'
</style>