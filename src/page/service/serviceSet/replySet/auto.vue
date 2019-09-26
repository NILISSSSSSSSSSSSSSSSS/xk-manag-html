<template>
  <div class = 'auto' v-loading='vloading'>
        <el-input
            type="textarea"
            :rows="20"
            placeholder="请输入自动回复内容"
            v-model="textarea"
            @blur="handle">
        </el-input>
  </div>
</template>
<script>
export default {
  name:'auto',
  data () {
    return {
        textarea:"",
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
      this.$http.get(this.$api.csSetReplyUpdate,{autoContent:this.textarea},true)
        .then(res => {
          this.$message({
              showClose: true,
              message: '自动回复保存成功',
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
          if(res.autoContent){
            this.textarea = res.autoContent
          }
        })
        .catch(err => {
          this.vloading = false ;
          this.$message.error(err.message);
        })
    }
  }
}
</script>
<style lang='scss' scoped>
.el-textarea textarea{
    height: 300px;
}
</style>