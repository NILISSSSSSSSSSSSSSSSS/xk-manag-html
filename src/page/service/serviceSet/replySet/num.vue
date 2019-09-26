<template>
  <div class = 'num'>
      <div class="num-box" v-loading='vloading'>
          <div>最高接待人数：</div>
          <el-input v-model="inputnum" placeholder="请输入内容" @blur="handle"></el-input>
          <div>人</div>
      </div>
      
  </div>
</template>
<script>
export default {
  name:'num',
  data () {
    return {
      inputnum:"",
      vloading:false
    };
  },
  components: {},
  created() {
    this.getauto()
  },
  mounted() {},
  methods: {
    handle(){
      this.$http.get(this.$api.csSetReplyUpdate,{number:this.inputnum},true)
        .then(res => {
          this.$message({
              showClose: true,
              message: '最大接待人数设置成功',
              type: 'success'
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        })
    },
    getauto(){
      this.vloading = true ;
      this.$http.get(this.$api.csSetReplyDetail,{},true)
        .then(res => {
          this.vloading = false ;
          if(res.number){
            this.inputnum = res.number
          }
        })
        .catch(err => {
          this.$message.error(err.message);
          this.vloading = false ;
        })
    }
  }
}
</script>
<style lang='scss' scoped>
.num-box{
    display: flex;
    height: 40px;
    line-height: 40px;
    width: 30%;
    white-space: nowrap
}
</style>