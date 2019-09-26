<template>
  <div class = 'training-center'>
        <div class="training-center-main" v-if="sTid">
            <div class="tranining-select">
                <div class="group-name">
                    {{teamName}}
                </div>
                <div class="select-btn">
                    <el-button type="text" :class="{selected:sSelectName==='chat'}" @click.stop='fnClickSelect("chat")'>聊天</el-button>
                    <el-button type="text" :class="{selected:sSelectName==='file'}" @click.stop='fnClickSelect("file")'>文件</el-button>
                    <el-button type="text" :class="{selected:sSelectName==='history'}" @click.stop='fnClickSelect("history")'>聊天记录</el-button>
                    <el-button type="text" :class="{selected:sSelectName==='set'}" @click.stop='fnClickSelect("set")'>设置</el-button>
                </div>
            </div>
            <!-- <keep-alive> -->
            <component :is="sSelectName" :tid="sTid" :isMeCreate="isMeCreate" :allMute="allMute"></component>
            <!-- </keep-alive> -->
        </div>
        <div v-else class="no-group">
            没有对应的群
        </div>
  </div>
</template>
<script>
import chat from './page/chat';
import file from './page/file';
import history from './page/history';
import set from './page/set';
//枚举联盟商身份
const EnumIdentity = [
    { key: '1', value: '主播' },
    { key: '2', value: '家族长' },
    { key: '3', value: '个人/公司/企业' },
    { key: '4', value: '商户' },
    { key: '5', value: '合伙人' },
]
export default {
  name:'trainingCenter',
  data () {
    return {
        EnumIdentity: EnumIdentity,
        //组建名
        sSelectName:'chat',
        oScroll:null,
        allMute:0,//0没有全局禁言 1 全局禁言
    };
  },
  props: {},
  components: {
      chat,
      file,
      history,
      set
  },
  computed: {
      teamName(){// 当前群名
            return this.$store.state.service.teamName;
      },
      isMeCreate(){//0不是我创建 1 是我创建
            return this.$store.state.service.isMeCreate;
      },
      sTid(){//当前群id
            return this.$store.state.service.groupTid;
      }
  },
  created() {
      if(this.$route.query.tid){
          this.teamName = this.$route.query.teamName;
          this.allMute = this.$route.query.allMute;
          localStorage.setItem('allMute',this.$route.query.allMute);
      }else{
          this.allMute = parseInt(localStorage.getItem('allMute'));
      }
  },
  mounted() {},
  methods: {
      fnClickSelect(param){//切换组件
          this.sSelectName = param ;
      }
  },
  watch: {}
}
</script>
<style lang='scss'>
@import './scss/trainingCenter'
</style>