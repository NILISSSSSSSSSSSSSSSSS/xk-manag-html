<template>
  <div class = 'lookquick'>
    <el-dialog
      title="详情"
      :visible="showchakan"
      width="793px"
      @close="handleClose">
      <el-form ref="lookquick" :model="form" label-width="120px">
          <el-form-item label="快捷回复内容：">
              <template>
                  {{form.content}}
              </template>
          </el-form-item>
          <el-form-item label="创建时间：">
              <template>
                  {{form.createdAt*1000 | formatTime}}
              </template>
          </el-form-item>
          <el-form-item label="更改时间：">
              <template>
                  {{form.updatedAt*1000 | formatTime}}
              </template>
          </el-form-item>
          <el-form-item label="id：">
              <template>
                  {{form.id}}
              </template>
          </el-form-item>
          <el-form-item label="用户id：">
              <template>
                  {{form.sUserId}}
              </template>
          </el-form-item>
          <el-form-item label="状态：">
              <template>
                  {{form.status==='active'?"启用":"禁用"}}
              </template>
          </el-form-item>
          <div class="btn-center">
              <el-button type="primary" @click="handleClose" :size="$size">关闭</el-button>
          </div>
      </el-form>
  </el-dialog>
  </div>
</template>
<script>
export default {
  name:'lookquick',
  data () {
    return {
      form:{
        // content:'',
        // createdAt:"",
        // sUserId:"",
        // status:"",
        // updatedAt:"",
        // id:""
      }
    };
  },
  props: {
    showchakan:{},
    msgId:{}
  },
  computed: {},
  mounted() {},
  methods: {
    handleClose(){
      this.$emit('closelookquick')
    }
  },
  watch:{
    showchakan(newV){
      if(newV){
        this.$http.get(this.$api.csQuickReplyDetail,{id:this.msgId},true)
            .then(res => {
              this.form = res
            })
            .catch(err => {
              this.$message.error(err.message);
            })
      }
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