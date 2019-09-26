<template>
  <div class = 'xk-container'>
      <div class="xk-radius">
        <div class='xk-title'>
            <div class="vus-title">
                <span></span>
                公共服务大厅搜索
            </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" :loading='load' @click.stop = "fnsearch">搜索</el-button>
                <el-button type="primary" :size="$size" @click.stop = "fnrefresh">刷新列表</el-button>
            </div>
            <div class="vus-bottom"></div>
            <el-form :size="$size" 
                    :inline="true" 
                    :model="formInline"
                    class="demo-form-inline xk-search">
                <el-form-item label='时间排序：'>
                    <el-select v-model="formInline.createdAt" placeholder="时间">
                      <el-option label="按时间正序" value="desc"></el-option>
                      <el-option label="按时间倒序" value="asc"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视角名字：">
                    <el-select v-model="formInline.userType" placeholder="视角名字">
                      <el-option label="所有视角" value=""></el-option>
                      <el-option :label="item.label" :value="item.value" v-for="(item,index) in UserType" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="在线状态：">
                    <el-select v-model="formInline.online" placeholder="在线状态">
                      <el-option label="所有" value=""></el-option>
                      <el-option label="在线" value="1"></el-option>
                      <el-option label="离线" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
      </div>
        
      <div class="xk-body xk-radius marintop20">
          <div class='xk-title'>
              <div class="vus-title">
                  <span></span>
                  公共服务大厅列表
              </div>
              <div class="vus-btn"></div>
              <div class="vus-bottom"></div>
          </div>
          <div class="public-service-hall" v-loading='vloading'>
              <div v-show="userLists.length" v-permission="'publicServiceHallReceipt'" :class="{'disable':item.disable}" class="xk-god" v-for="(item,index) in userLists" :key="index" @click.stop = "fnToService(item.userId,index)">
                <div class="avatar-box">
                  <img :src="item.avatar" @error="nofind">
                  <div class="online-status" :class="{onlinetrue:item.online}"></div>
                </div>
                <div class="god-content">
                  <div class="nick">{{item.nickname}}</div>
                  <div class="txt" v-if="item.body.type===1001">{{item.body.data.msgContent}}</div>
                  <div class="txt" v-else>{{item.body.type | msgType}}</div>
                  <div class="btn">去接单</div>
                </div>
                <div class="time">{{item.createdAt | formatTime('HH:mm:ss')}}</div>
              </div>
              <div style="text-align:center" v-show="!userLists.length">
                暂无客服任务，可以尝试刷新一下~
              </div>
          </div>
      </div>
      <img src="../../../assets/image/default_avatar.png" ref="timg" style="display:none;width:0;height:0;opacity:0;position:absolute">
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name:'publicServiceHall',
  data () {
    return {
        formInline: {
          createdAt: 'asc',
          userType:"",
          online:""
        },
        userLists:[
          // {
          //   createdAt:"",
          //   msgType:"",
          //   nickname:"13",
          //   online:true,
          //   avatar:"//gc.xksquare.com/FgLXy6Pamg2w1r5rTZMk0X87Fgrx",
          //   userId:"",
          //   body:{msg:1161}
          // }
        ],
        timer:null,
        UserType:JSON.parse(localStorage.getItem('UserType')),
        load:false,
        vloading:true
    };
  },
  components: {},
  computed: {
    ...mapState({
      taskCenter:state => state.service.taskCenter
    })
  },
  mounted() {
    this.fnsearch();
  },
  created(){
    // this.getThisPage();
    this.timer = setInterval(()=>{
      this.getThisPage();
    },30000)
    this.formInline = this.taskCenter ? this.taskCenter:{ createdAt: 'asc', userIdentity:"", online:"" }
    try {
      this.formInline.online = this.taskCenter.online==0 ? '0':this.taskCenter.online==1?"1":"";
    } catch (error) {
      
    }
  },
  methods: {
    ...mapMutations({
      setTaskCenter:"service/setTaskCenter"
    }),
    nofind(){
          var img=event.srcElement; 
          img.src=this.$refs.timg.src; 
          img.onerror=null; //控制不要一直跳动 
    },
    getThisPage(data){
      if(data){
        this.load = true ;
      }else{
        data = {}
      }
      
      this.$http.post(this.$api.xkCustomerServiceTaskList,data,true)
        .then(res => {
          console.log(res)
          this.userLists = res;
          this.load = false;
          this.vloading = false ;
        })
        .catch(err => {
          this.$message.error(err.message);
          this.load = false;
          this.vloading = false ;
        })
    },
    fnsearch(){
      let obj = {};
      if(this.formInline.createdAt){
        obj.createdAt = this.formInline.createdAt
      }
      if(this.formInline.userType){
        obj.userType = this.formInline.userType
      }
      if(this.formInline.online){
        if(this.formInline.online == '0'){
          obj.online = 0
        }
        if(this.formInline.online == '1'){
          obj.online = 1
        }
      }
      this.setTaskCenter(obj)
      this.getThisPage(obj);
    },
    fnrefresh(){
      this.formInline = {
          createdAt: 'asc',
          userIdentity:"",
          online:""
        }
      this.getThisPage()
    },
    fnToService(userId,index){
		if(this.userLists[index].disable){
			this.$message.error('处理中。。。，请务重复操作');
			return
		}
		this.$set(this.userLists[index],'disable',true);
		let obj = {
			rid:userId
		};
		this.$http.post(this.$api.xkCustomerServiceReceipt,obj,true)
		.then(res => {
			console.log(res);
			this.$set(this.userLists[index],'disable',false);
			this.$router.push({path:"/inService",params:res})
		})
		.catch(err => {
			this.$set(this.userLists[index],'disable',false);
			this.$message.error(''+err.message);
		})
    }
  },
  destroyed(){
    clearInterval(this.timer)
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/index"
</style>
