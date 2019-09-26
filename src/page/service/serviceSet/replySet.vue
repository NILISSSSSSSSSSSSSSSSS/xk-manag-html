<template>
    <div class = 'xk-container'>
        <div class='xk-body'>
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        回复设置
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary service-btn" v-permission="'replySetFastAdd'" :size="$size" v-show="selecVal==='quick'" @click.stop="fnaddquick">新增快捷回复</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <div class='reply-set'>
                    <div class="reply-main">
                        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="quick" v-permission="'replySetFastPage'">快捷回复</el-menu-item>
                            <el-menu-item index="auto" v-permission="'replySetAuto'">自动回复</el-menu-item>
                            <!-- <el-menu-item index="offline">离线回复</el-menu-item> -->
                            <el-menu-item index="num" v-permission="'replySetNum'">人数设置</el-menu-item>
                            <el-menu-item index="personaldata" v-permission="'replySetPersonalData'">个人资料设置</el-menu-item>
                        </el-menu>
                    </div>
                    <div class="reply-table">
                        <component :is="selecVal" @replyedit="fngetmsgid" :listrefresh = "listrefresh"></component>
                    </div>
                </div>
            </div>
            <add-quick :dialogVisible="addshow" @changeShow="fnchangeShow" :msgId='msgId'></add-quick>        
        </div>
    </div>
</template>
<script>
import Quick from './replySet/quick'
import Auto from './replySet/auto'
import Offline from './replySet/offline'
import Num from './replySet/num'
import Personaldata from './replySet/personaldata'
import AddQuick from './replySet/addquick'
export default {
  name:'replySet',
  data () {
    return {
        activeIndex:"quick",
        selecVal:"quick",
        addshow:false,
        msgId:null,
        listrefresh:false
    };
  },
  components: {
      Quick,
      Auto,
      Offline,
      Personaldata,
      Num,
      AddQuick,
  },
  computed: {},
  mounted() {},
  methods: {
      handleSelect(v){
          this.selecVal = v;
      },
      fnaddquick(){
          this.msgId = null ;
          this.addshow = true
      },
      fnchangeShow(v1,v2){
          this.addshow = false;
          if(v2){
              this.listrefresh = !this.listrefresh
          }
      },
      fngetmsgid(id){
          this.msgId = id ;
          this.addshow = true
      }
  }
}
</script>
<style lang='scss' scoped>
@import "./scss/replySet"
</style>