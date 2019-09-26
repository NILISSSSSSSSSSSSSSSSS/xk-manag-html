<template>
  <div class = 'addquick'>
      <el-dialog
        :title="msgId?'编辑快捷回复':'新增快捷回复'"
        :visible="dialogVisible"
        width="793px"
        @close="handleClose">
        <el-input
            type="textarea"
            :rows="20"
            placeholder="请输入快捷回复内容"
            v-model="textarea"
            style="margin-bottom:10px">
        </el-input>
        <div class="btn-center">
            <el-button :size="$size" @click="fncancel">取 消</el-button>
            <el-button type="primary" :size="$size" @click="fnsure" :loading="load">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name:'addquick',
  data () {
    return {
        textarea:"",
        load:false
    };
  },
  props:{
      dialogVisible:{},
      msgId:{}
  },
  components: {},
  computed: {},
  mounted() {},
  methods: {
      handleClose(done) {
          this.$emit("changeShow",false)
      },
      fncancel(){
          this.$emit("changeShow",false)
      },
      fnsure(){
          this.load = true ;
          let obj = {
              content:this.textarea
          }
          let apiName = "csQuickReplyCreate"
          if(this.msgId){
              obj.id = this.msgId ;
              apiName = "csQuickReplyUpdate"
          }
          this.$http.post(this.$api[apiName],obj,true)
            .then(res => {
                this.load = false ;
                this.$emit("changeShow",false,true );
                this.textarea = "";
            })
            .catch(err => {
                this.load = false ;
                this.$message.error(err.message);
            })
      }
  }
}
</script>
<style lang='scss' scoped>
.btn-center{
    display: flex;
    justify-content: center;
}
</style>