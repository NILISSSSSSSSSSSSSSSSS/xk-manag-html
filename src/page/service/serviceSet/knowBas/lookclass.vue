<template>
  <div class = 'lookclass'>
      <el-dialog
        :visible="dialogTableVisible"
        width="793px"
        @close="handleClose">
            <el-form ref="lookclass" :model="form" label-width="120px" v-loading='loading'>
                <el-form-item label="分类名称：">
                    <template>
                        {{form.name}}
                    </template>
                </el-form-item>
                <el-form-item label="分类描述：">
                    <template>
                        {{form.description}}
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
                <div class="btn-center">
                    <el-button type="primary" @click.stop="fncancel" :size="$size">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>
  </div>
</template>
<script>
export default {
  name:'lookclass',
  data () {
    return {
        form:[
            {
               name:"" ,
               description:"",
               createdBy:"",
               status:"",
               viewerType:""
            }
        ],
        loading:false
    };
  },
  props:{
      msgId:{
          type:String
      },
      dialogTableVisible:{
          type:Boolean,
          default:false
      }
  },
  methods: {
      handleClose(){
          this.$emit('closeclass',false)
      },
      fncancel(){
          this.$emit('closeclass',false)
      },
      fnchakan(data={id:this.msgId}){
          this.loading = true ;
          this.$http.get(this.$api.categoryManagerDetail,data,true)
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