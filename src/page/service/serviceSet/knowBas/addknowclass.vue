<template>
    <el-dialog :title="title" :visible="dialogTableVisible" @close = "fnclose" width="793px">
        <el-form ref="form" :model="form" label-width="120px" label-position="left" v-loading="loading">
            <!-- <el-form-item label="状态设置：">
                <el-radio v-model="form.status" label="active">启用</el-radio>
                <el-radio v-model="form.status" label="disabled">停用</el-radio>
            </el-form-item> -->
            <el-form-item label="知识点分类名称" required>
                <el-input type="text" v-model="form.name" :size="$size"></el-input>
            </el-form-item>
            <el-form-item label="用户视角">
                <el-select v-model="form.viewerType" :size="$size" placeholder="请选择">
                    <el-option
                        v-for="item in viewerType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类描述" onSubmit>
                <el-input type="textarea" :size="$size" v-model="form.description"></el-input>
            </el-form-item>
            <div class="btn-center">
                <el-button @click="fnclose" :size="$size">取消</el-button>
                <el-button type="primary" @click="onSubmit" :size="$size" :loading = "load">确定</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>
<script>
export default {
  name:'',
  data () {
    return {
        form: {
        //   status:"active",
        //   validityType:"FOREVER",
        //   time:[],
          name:"",
          viewerType:"USER",
          description:""
        },
        viewerType:JSON.parse(localStorage.getItem('viewerType')),
        load:false,
        title:"新增知识点分类",
        loading:false
    };
  },
  props:{
      dialogTableVisible:{
          type:Boolean,
          default:true
      },
      targetId:{}
  },
  components: {},
  computed: {},
  mounted() {},
  methods: {
      dataInit(){
          this.title="新增知识点分类"
          this.form = {
                        // status:"active",
                        // validityType:"FOREVER",
                        // time:[],
                        name:"",
                        viewerType:"USER",
                        description:""
                    }
      },
      onSubmit() {
          if(this.form.name && this.form.description){
                this.load = true ;
                let obj = {};
                for (const key in this.form) {
                    obj[key] = this.form[key]
                }
                console.log(obj)
                if(this.targetId){
                    obj.id = this.targetId;
                    this.$http.post(this.$api.knowledgePointCategoryUpdate,obj,true)
                        .then(res => {
                            this.load = false;
                            this.dataInit();
                            this.$emit("update:dialogTableVisible",false)
                            this.$emit("addSuccsee");
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                        })
                        .catch(err => {
                            this.load = false;
                            this.$message({
                                showClose: true,
                                message: err.message,
                                type: 'error'
                            });
                        })
                }else{
                    this.$http.post(this.$api.KnowledgePointCategoryCreate,obj,true)
                        .then(res => {
                            this.load = false;
                            this.dataInit();
                            this.$emit("update:dialogTableVisible",false)
                            this.$emit("addSuccsee");
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                        })
                        .catch(err => {
                            this.load = false;
                            this.$message({
                                showClose: true,
                                message: err.message,
                                type: 'error'
                            });
                        })
                }
                
          }else{
                this.$message({
                    showClose: true,
                    message: '必填内容不能为空',
                    type: 'error'
                });
          }
        
      },
      fnclose(){
          this.$emit("update:dialogTableVisible",false)
      },
      getDetail(){
            this.loading = true ;
            this.$http.get(this.$api.knowledgePointCategoryDetail,{id:this.targetId},true).then(res => {
                console.log(res);
                this.loading = false ;
                this.form = {
                    status:res.status,
                    // validityType:"FOREVER",
                    // time:[],
                    name:res.name,
                    viewerType:res.viewerType,
                    description:res.description
                }
            }).catch(err => {
                this.loading = false ;
                this.$message.error(err.message);
            })
      }
  },
  watch:{
     dialogTableVisible(newV){
         if(this.dialogTableVisible){
             this.dataInit()
            if(this.targetId){
                this.title="编辑知识点分类"
                this.getDetail()
            }
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