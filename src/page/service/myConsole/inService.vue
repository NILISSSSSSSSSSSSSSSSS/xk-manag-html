<template>
    <div class = 'xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    受理中
                </div>
                <div class="vus-btn">
                    <el-button type="primary" size="small" @click.stop="changeCom">{{showTxt}}</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div class='xk-body'>
                <div class='in-service-box'>
                    <component :is="showComponent"></component>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Chat from './component/chat.vue'
import ListRoam from './component/listRoam.vue'
import {getSession} from '@/util/publicMehotds';
export default {
  name:'inService',
  data () {
    return {
        showComponent:"Chat",
        giveNum:0,
        xkaccount : getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {},
        timer:null
    };
  },
  components: {
      Chat,
      ListRoam
  },
  computed: {
      showTxt(){
          let txt = '';
          if(this.showComponent === 'Chat'){
              txt = `流转给我的工单（${this.giveNum}）`;
          }else{
              txt = "客服IM"
          }
          return txt ;
      }
  },
  mounted() {
      this.getThisPage();
      this.timer = setInterval(()=>{
          this.getThisPage()
      },60000)
      console.log("当前客服",this.xkaccount);
      
  },
  methods: {
      changeCom(){
          this.showComponent = this.showComponent==='Chat'?"ListRoam":"Chat";
          this.getThisPage();
      },
      getThisPage(data={page:1,limit:10,customerServiceId:this.xkaccount.accid,orderStatus:"not_receipt"}){
        this.$http.get(this.$api.workOrderPageTakeOver,data,true)
          .then(res => {
              console.log(res);
              
            if(res.total){
                this.giveNum = res.total;
            }else{
                this.giveNum = 0;
            }
          })
          .catch(err => {
            // this.$message.error(err.message);
          })
      }
  },
  watch: {
      showComponent(val){
          if(val=='Chat'){
              this.getThisPage();
          }
      }
  },
  destroyed(){
      clearInterval(this.timer)
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/inService"
</style>