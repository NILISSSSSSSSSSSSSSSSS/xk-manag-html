<template>
    <el-dialog :title="title" :visible="dialogTableVisible" @close = "fnclose" width="793px">
        <el-form ref="form" :model="form" label-width="100px" label-position="left">
            <el-form-item label="状态设置：">
                <el-radio v-model="form.status" label="active">启用</el-radio>
                <el-radio v-model="form.status" label="disabled">停用</el-radio>
            </el-form-item>
            <el-form-item label="有效期设置：" style="display:none">
                <el-radio v-model="form.validityType" label="FOREVER">永久有效</el-radio>
                <el-radio v-model="form.validityType" label="CUSTOM">自定义有效期</el-radio>
            </el-form-item>
            <el-form-item v-show="form.validityType === 'CUSTOM'">
                <el-date-picker
                    v-model="form.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :size="$size">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="知识点" required>
                <el-input type="text" v-model="form.name" :size="$size"></el-input>
            </el-form-item>
            <!-- <el-form-item label="用户视角">
                <el-select v-model="form.viewerType" :size="$size" placeholder="请选择">
                    <el-option
                        v-for="item in viewerType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="知识点分类" required>
                <el-select v-model="form.kpCategoryId" :size="$size" placeholder="请选择">
                    <el-option
                        v-for="item in kpCategoryId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form label-position='top' :model='form.content'>
                <el-form-item  label="问题答案：" required>
                    <el-button @click.stop="fncloseshow" type="primary" :size='$size' style="float:right;margin-top:-40px;margin-bottom:5px">预览</el-button>
                    <div style="clear:both"></div>
                    <UE v-model="form.content" UEheight='height:300px'></UE>
                </el-form-item>
            </el-form>
            <div class="btn-center">
                <el-button @click="fnclose" :size='$size'>取消</el-button>
                <el-button type="primary" @click="onSubmit" :size='$size' :loading='load'>确定</el-button>
            </div>
        </el-form>
        <el-dialog :visible = 'diaShow' append-to-body @close = "closeson">
            <div v-html='form.content'></div>
        </el-dialog>
    </el-dialog>
</template>
<script>
import UE from '@/components/UE'
export default {
  name:'',
  data () {
    return {
        form: {
          status:"active",
          validityType:"FOREVER",
          name:"",
        //   viewerType:'USER',
          content:'',
          time:[]
        },
        viewerType:JSON.parse(localStorage.getItem('viewerType')),
        diaShow:false,
        load:false,
        title:"新增知识点",
        kpCategoryId:[]
    };
  },
  props:{
      dialogTableVisible:{
          type:Boolean,
          default:true
      },
      targetId:{}
  },
  components: {UE},
  computed: {},
  mounted() {},
  methods: {
      dataInit(){
          this.title = "新增知识点"
          this.form = {
                    status:"active",
                    // validityType:"FOREVER",
                    name:"",
                    // viewerType:'USER',
                    content:'',
                    // time:[]
                }
      },
      fncloseshow(){
          console.log(this.form)
          this.diaShow = true;
      },
      onSubmit() {
          if(this.form.name && this.form.content.length){
            this.load = true;
            let obj = {};
            for (const key in this.form) {
                if(key === 'content'){
                    obj[key] = this.form[key]
                }else if(key === 'time'){
                    if(this.form.time.length && this.form.validityType === 'CUSTOM'){
                        obj.startTime = this.form[key][0].getTime();
                        obj.endTime = this.form[key][1].getTime();
                    }
                }else{
                    obj[key] = this.form[key]
                }
            }
            console.log(obj);
            
            if(this.targetId){
                obj.id = this.targetId ;
                this.$http.post(this.$api.knowledgePointUpdate,obj,true)
                    .then(res => {
                        this.dataInit()
                        this.$emit("update:dialogTableVisible",false);
                        this.$emit("addSuccsee");
                        this.load = false;
                        this.$message({
                            showClose: true,
                            message: '操作成功',
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.load = false;
                        this.$message.error(err.message);
                    })
            }else{
                this.$http.post(this.$api.knowledgePointCreate,obj,true)
                    .then(res => {
                        this.dataInit()
                        this.$emit("update:dialogTableVisible",false);
                        this.$emit("addSuccsee");
                        this.load = false;
                        this.$message({
                            showClose: true,
                            message: '操作成功',
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.load = false;
                        this.$message.error(err.message);
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
          this.$emit("update:dialogTableVisible",false);
      },
      closeson(){
          this.diaShow = false
      },
      getDetail(){
          this.$http.get(this.$api.knowledgePointDetail,{id:this.targetId},true)
                .then(res => {
                    console.log(res);
                    this.form = {
                        status:res.status,
                        // validityType:"FOREVER",
                        name:res.name,
                        kpCategoryId:res.kpCategoryId,
                        // viewerType:res.viewerType,
                        content:res.content,
                        // time:[]
                    }
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      knowledgePointCategoryPage(){
            this.$http.get(this.$api.knowledgePointCategoryPage,{limit:0,page:0,bizStatus:"active"} , true).then((res) => {
                console.log(res)
                this.kpCategoryId = res ? res.data : [];
            }).catch((err) => {
                console.log(err);
                this.$message.error(err.message);
            });
      }
  },
  watch:{
     dialogTableVisible(newV){
         if(this.dialogTableVisible){
             this.dataInit();
             this.knowledgePointCategoryPage()
             if(this.targetId){
                 this.title = "编辑知识点"
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