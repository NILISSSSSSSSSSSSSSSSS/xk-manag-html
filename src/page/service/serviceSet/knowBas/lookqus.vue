<template>
  <div class = 'lookqus'>
      <el-dialog
        :visible="showlook"
        width="793px"
        @close="handleClose"
        >
            <el-form ref="lookqus" :model="form" label-width="120px" v-loading="loading">
                <el-form-item label="问题标题：">
                    <template>
                        {{form.title}}
                    </template>
                </el-form-item>
                <el-form-item label="问题答案：">
                    <template>
                        {{form.content}}
                    </template>
                </el-form-item>
                <el-form-item label="相关知识点：">
                    <template>
                        {{form.knowledgePointName}}
                    </template>
                </el-form-item>
                <el-form-item label="问题分类：">
                    <template>
                        {{form.categoryName}}
                    </template>
                </el-form-item>
                <el-form-item label="创建人：">
                    <template>
                        {{form.createdName?form.createdName:"未知"}}
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
                <el-form-item label="有效期：">
                    <template>
                        <span v-if="form.validityType==='FOREVER'">
                            永久有效
                        </span>
                        <span v-else>
                            {{form.startTime ? form.startTime :1537523300573 | formatTime('YYYY-MM-DD hh:mm:ss')}}
                            ~
                            {{form.endTime ? form.endTime :1537523300573 | formatTime('YYYY-MM-DD hh:mm:ss')}}
                        </span>
                        
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
  name:'lookqus',
  data () {
    return {
        form:{
            // title:"16161615611",
            // content:"s",
            // knowledgePointName:"5",
            // categoryName:"1",
            // createdBy:"",
            // viewerType:"",
            // status:""
        },
        loading:false
    };
  },
  props:{
      showlook:{
          type:Boolean,
          default:false
      },
      msgId:{}
  },
  methods: {
      handleClose(){
          this.$emit('closelook',false)
      },
      fnchakan(data={id:this.msgId}){
          this.loading = true ;
          this.$http.get(this.$api.questionDetail,data,true)
                .then(res => {
                    console.log(res);
                    this.form = res ;
                    this.loading = false ;
                })
                .catch(err => {
                    this.loading = false ;
                    this.$message.error(err.message);
                })
      },
      fncancel(){
          this.$emit('closelook',false)
      }
  },
  watch:{
      showlook(n){
          console.log(n);
          if(n){
              this.fnchakan({id:this.msgId})
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