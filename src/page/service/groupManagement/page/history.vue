<template>
    <div class="training-chatHistory">
        <div class="search-box">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="content"
                :size="$size">
            </el-input>
            <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :size="$size">
            </el-date-picker>
            <el-button type="primary" :size="$size" style="margin-left:20px" :loading="searchLoading" @click.stop="fnSearch">查询</el-button>
        </div>
        <div class="chat-history" ref="oHistoryDom" v-loading="loading">
            <div class="all-history">
                <div class="refresh-box" v-show="pullDownRefresh">
                    <bubble :y='bubbleY' v-if="beforePullDown"></bubble>
                    <img src="@/assets/image/loading.gif" v-show="pullDownLoading">
                </div>
                <div class="one-history" v-for="(item,index) in aHistory" :key="index">
                    <div class="nick-time">
                        <div class="nick">{{item.username}}</div>
                        <div class="time">{{item.sendTime | formatTime}}</div>
                    </div>
                    <div class="content" v-if="item.body.type===1||item.body.type===1001">
                        {{item.body.data.msgContent}}
                    </div>
                    <div class="content" v-if="item.body.type===2||item.body.type===1002">
                        <img :src="item.body.data.imgUrl+ '?imageMogr2/auto-orient'" width="400" alt="">
                    </div>
                    <div class="content" v-if="item.body.type===4">
                        <div v-if="item.body.data.all">
                            【系统消息】{{item.body.data.msgContent?"管理员开启全局禁言":"管理员解除全局禁言"}}
                        </div>
                        <div v-else>
                            <span v-if="item.body.data.msgContent">
                                【系统消息】{{item.body.data.username}}被禁言
                            </span>
                            <span v-else>
                                【系统消息】{{item.body.data.username}}禁言解除
                            </span>
                        </div>
                    </div>
                    <div class="content" v-if="item.body.type===5">
                        【文件消息】{{item.body.data.username}}上传{{item.body.data.msgContent}}，到群文件。
                    </div>
                </div>
            </div>
            <div v-show="afterPullDown" class="pull-tip">{{pullDownTip}}</div>
        </div>
        
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import bubble from './bubble';
export default {
  name:'history',
  data () {
    return {
        oScroll:null,
        aHistory:[],
        BScroll:null,
        pullDownRefresh:false,
        beforePullDown:true,//加载数据前
        pullDownLoading:false,//加载数据中
        afterPullDown:false,//加载结束提示
        pullDownTip:"加载成功",
        pullTimer:null,
        bubbleY:0,
        lastHeight:0,
        content:"",//查询内容
        timeRange:"",//时间区间
        limit:30,//历史消息条数
        loading:false,
        searchLoading:false
    };
  },
  props: {
      tid:{}
  },
  components: {
      bubble
  },
  computed: {},
  created() {
      this.getHistory()
  },
  mounted() {
        this.BScroll = new BScroll(this.$refs.oHistoryDom,{
            probeType:1,
            mouseWheel:true,
            pullDownRefresh:true,
            click:true
        });
        // 下拉
        this.BScroll.on('scroll', (pos) => {
            if(this.beforePullDown){
                this.bubbleY = this.bubbleY = Math.max(0, pos.y - 50);   
                if(pos.y > 15){
                    this.pullDownRefresh = true;
                }else{
                    this.pullDownRefresh = false;
                }
            }else{
                this.bubbleY = 0
            }
        });
        // 下拉释放
        this.BScroll.on('pullingDown', () => {
            this.beforePullDown = false;
            this.pullDownLoading = true ;
            this.lastHeight = document.querySelector(".all-history").scrollHeight;
            // ajax请求
            let time = this.aHistory[0].sendTime - 1
            this.getHistory(time);
        })
  },
  methods: {
      fnScrollCurrent(){
          this.$nextTick(()=>{
                this.BScroll.refresh();
                let nowHeight = document.querySelector(".all-history").scrollHeight;
                let height = document.querySelector(".chat-history").offsetHeight; 
                if(!this.pullDownRefresh){//是否下拉加载
                    this.BScroll.scrollTo(0,-nowHeight+height)
                }else{
                    this.BScroll.scrollTo(0,-nowHeight+this.lastHeight + 20);//维持当前滚动高度
                }
          })
      },
      fnSearch(){
          this.searchLoading = true ;
          this.getHistory();
      },
      getHistory(isPull){
          let param = {
              tid:this.tid,
              limit:this.limit,
              reverse:0
          } ;
          
        //   聊天消息模糊查询
          if(this.content){
              param.content = this.content ;
          }
        // 聊天消息时间区间
          if(this.timeRange){
              if(this.timeRange[0]){
                  param.beginTime = this.timeRange[0].getTime()
              }
              if(this.timeRange[1]){
                  param.endTime = this.timeRange[1].getTime()
              }
          }
          if(isPull){
              param.endTime = isPull ;
          }
          console.log(param)
          this.loading = true ;
          this.$http.get(this.$api.teamMsgRecordPage,param , true).then((res) => {
             console.log(res)
             this.loading = false ;
             this.searchLoading = false ;
             if(res){
                 if(!isPull){
                     this.aHistory = [];
                     res.data.forEach((item,index) => {
                         this.aHistory.unshift(item)
                     });
                 }else{
                     // 请求成功
                    this.pullDownLoading = false ;
                    this.afterPullDown = true ;
                    this.BScroll.finishPullDown();
                    res.data.forEach((item,index) => {
                        this.aHistory.unshift(item)
                    });
                    clearTimeout(this.pullTimer)
                    this.pullTimer = setTimeout(()=>{
                        // 成功后1秒延迟消失（给用户提示）
                        this.beforePullDown = true ;
                        this.afterPullDown = false ;
                        this.pullDownRefresh = false ;
                    },1000)
                     
                 }
             }else{
                 if(!isPull){
                     this.aHistory = [];
                 }
             }
          }).catch((err) => {
                console.log(err);
                this.loading = false ;
                this.searchLoading = false ;
                //请求历史消息错误重置
                this.pullDownLoading = false ;
                this.BScroll.finishPullDown();
                this.beforePullDown = true ;
                this.afterPullDown = false ;
                this.pullDownRefresh = false ;
                this.$message.error(err.message);
          });
      }
  },
  watch: {
      aHistory(){
          this.fnScrollCurrent();
      }
  }
}
</script>
<style lang='scss'>
    // 聊天记录
    @import '../scss/trainingChatHistory/index.scss';
</style>