<template>
  <div class = 'blackSet'>
      <el-input v-model="day1" placeholder="2" :size='$size'></el-input>
      天内，管理员确认不良信息达到
      <el-input v-model="num1" placeholder="10" :size='$size'></el-input>
      条时，自动进入黑名单<br/><br/>
      <el-input v-model="day2" placeholder="2" :size='$size'></el-input>
      天内，管理员确认不良信息达到
      <el-input v-model="num2" placeholder="10" :size='$size'></el-input>
      条时，则把用户加入刷单抽奖黑名单中，且自动封停用户相应功能。<br/><br/>
      <div class="center">
        <el-button type="primary" :size='$size' @click="fncancel">取消</el-button>
        <el-button v-permission="infoSuperSetHset" type="primary" :size='$size' @click="setblack" :loading='load'>修改</el-button>
      </div>
  </div>
</template>
<script>
export default {
  name:'blackSet',
  data () {
    return {
        day1:2,
        num1:10,
        day2:2,
        num2:10,
        load:false
    };
  },
  props: {},
  components: {},
  computed: {},
  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {
    getDetail(){
      this.$http.get(this.$api.blackListThresholdDetail,{},true).then(res => {
        console.log(res,'res');
        this.day1 = res.blackListDuration;
        this.num1 = res.blackListCount;
        this.day2 = res.offFunctionDuration;
        this.num2 = res.offFunctionCount;
      }).catch(err => {
        console.log(err);
        
      })
    },
    setblack(){
      let data = {
                    blackListDuration:this.day1,
                    blackListCount:this.num1,
                    offFunctionDuration:this.day2,
                    offFunctionCount:this.num2
                  }
      this.load = true ;
      this.$http.post(this.$api.settingBlackListThreshold,data,true).then(res => {
        console.log(res);
        this.load = false ;
      }).catch(err => {
        console.log(err);
        this.load = false ;
      })
    },
    fncancel(){
      this.day1=2;
      this.num1=10;
      this.day2=2;
      this.num2=10
    }
  },
  watch: {}
}
</script>
<style>
.blackSet .el-input{
    width: 150px;
}
.center{
  display: flex;
  justify-content: center
}
</style>