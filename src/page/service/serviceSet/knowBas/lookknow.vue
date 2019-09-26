<template>
  <div class = 'lookknow'>
        <el-dialog
            :visible="dialogTableVisible"
            width="793px"
            @close="handleClose">
            <el-form ref="lookknow" :model="form" label-width="120px" v-loading="loading">
                <el-form-item label="创建人真名：">
                    <template>
                        {{form.createdRealName?form.createdRealName:"未知"}}
                    </template>
                </el-form-item>
                <el-form-item label="创建人昵称：">
                    <template>
                        {{form.createdNickName?form.createdNickName:"未知"}}
                    </template>
                </el-form-item>
                <el-form-item label="知识点：">
                    <template>
                        {{form.name}}
                    </template>
                </el-form-item>
                <el-form-item label="视角：">
                    <template>
                        {{form.viewerType | viewerType}}
                    </template>
                </el-form-item>
                <el-form-item label="状态：">
                    <template>
                        {{form.status==='active'?"启用":"禁用"}}
                    </template>
                </el-form-item>
                <div class="btn-center">
                    <el-button type="primary" @click="fncancel" :size="$size">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>
  </div>
</template>
<script>
export default {
  name:'lookknow',
  data () {
    return {
        form:{},
        loading:false
    };
  },
  props:{
      msgId:{
          type:String
      },
      dialogTableVisible:{}
  },
  components:{},
  methods: {
      handleClose(){
          this.$emit('closeknow',false)
      },
      fncancel(){
          this.$emit('closeknow',false)
      },
      fnchakan(data={id:this.msgId}){
          this.loading = true ;
          this.$http.get(this.$api.knowledgePointDetail,data,true)
                .then(res => {
                    console.log(res);
                    this.form = res ;
                    this.loading = false ;
                })
                .catch(err => {
                    this.loading = false ;
                    this.$message.error(err.message);
                })
      }
  },
  watch:{
      dialogTableVisible(n){
          if(n){
              this.fnchakan()
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