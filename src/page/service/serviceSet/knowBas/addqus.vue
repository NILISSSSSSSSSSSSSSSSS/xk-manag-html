<template>
    <el-dialog :title="title" :visible="dialogTableVisible" @close = "fnclose" width="793px">
        <el-form ref="form" :model="form" label-width="100px" label-position="left">
            <el-form-item label="状态设置：">
                <el-radio v-model="form.status" label="active">启用</el-radio>
                <el-radio v-model="form.status" label="disable">停用</el-radio>
            </el-form-item>
            <el-form-item label="有效期设置：">
                <el-radio v-model="form.validityType" label="FOREVER">永久有效</el-radio>
                <el-radio v-model="form.validityType" label="CUSTOM">自定义有效期</el-radio>
            </el-form-item>
            <el-form-item v-show="form.validityType==='CUSTOM'">
                <el-date-picker
                    v-model="form.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="标准问题" required>
                <el-input type="text" v-model="form.title" :size="$size"></el-input>
            </el-form-item>
            <el-form-item label="相似问题" v-if="form.aLikeTitles.length">
                <el-input type="text" v-model="form.aLikeTitles[0]" :size="$size"></el-input>
            </el-form-item>
            <el-form-item label="相似问题" v-if="form.aLikeTitles.length === 2">
                <el-input type="text" v-model="form.aLikeTitles[1]" :size="$size"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button plain type="primary" @click="addAboutQus" :size="$size">添加相似问题</el-button>
            </el-form-item>
            <el-form-item label="问题答案" required>
                <el-input type="textarea" v-model="form.content" :size="$size"></el-input>
            </el-form-item>
            <!-- <el-form-item label="视角">
                <el-select v-model="form.viewerType" placeholder="请选择" :size="$size">
                    <el-option
                        v-for="item in viewerType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="问题分类" required>
                <el-select v-model="form.categoryId" placeholder="请选择" :size="$size">
                    <el-option
                        v-for="item in categoryId"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属知识点" >
                <el-select v-model="form.pointId" placeholder="请选择" :size="$size">
                    <el-option
                    v-for="item in pointId"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="btn-center">
                <el-button @click="fnclose" :size="$size">取消</el-button>
                <el-button type="primary" @click="onSubmit" :size="$size" :loading='load'>确定</el-button>
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
          status:"active",
          validityType:"FOREVER",
          time:"",
          title:"",
          aLikeTitles:[],
          content:"",
          categoryId:"",
          pointId:"",
        //   viewerType:'USER'
        },
        viewerType:JSON.parse(localStorage.getItem('viewerType')),
        categoryId:[],
        pointId:[],
        load:false,
        title:"新增问题"
    };
  },
  props:{
      dialogTableVisible:{
          type:Boolean,
          default:false
      },
      targetId:{}
  },
  components: {},
  computed: {},
  created() {
      this.getpointList();
      this.getClassList();
  },
  mounted() {},
  methods: {
      dataInit(){
          this.title = '新增问题'
          this.form = {
                status:"active",
                validityType:"FOREVER",
                time:"",
                title:"",
                aLikeTitles:[],
                content:"",
                categoryId:"",
                pointId:""
            }
      },
      onSubmit() {
          if(this.form.title && this.form.content && this.form.categoryId){
                let obj = {aLikeTitles:[]};
                this.load = true;
                for (const key in this.form) {
                    if(key==='time'){
                        if(this.form.validityType === 'CUSTOM' && this.form.time.length){
                            obj.startTime = this.form.time[0].getTime()
                            obj.endTime = this.form.time[1].getTime()
                        }
                    }if(key === 'aLikeTitles'){
                        obj.aLikeTitles.push(this.form.aLikeTitles[0])
                        obj.aLikeTitles.push(this.form.aLikeTitles[1])
                    }else{
                        obj[key] = this.form[key]
                    }
                }
                console.log(obj);
                
                if(this.targetId){
                    obj.id = this.targetId;
                    this.$http.post(this.$api.questionUpdate,obj,true)
                        .then(res => {
                            this.dataInit();
                            this.load = false;
                            this.$emit("update:dialogTableVisible",false)
                            this.$emit("addSuccsee");
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                        })
                        .catch(err => {
                            this.$message.error(err.message);
                        })
                }else{
                    this.$http.post(this.$api.questionCreate,obj,true)
                        .then(res => {
                            this.dataInit();
                            this.load = false;
                            this.$emit("update:dialogTableVisible",false)
                            this.$emit("addSuccsee");
                            this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                            });
                        })
                        .catch(err => {
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
          this.$emit("update:dialogTableVisible",false)
      },
      addAboutQus(){
          if(this.form.aLikeTitles.length < 2){
              this.form.aLikeTitles.push("")
          }
      },
      getpointList(){
          this.$http.post(this.$api.knowledgePointList,{limit:0,page:1,status:"active"},true)
            .then(res => {
                if(res.data){
                    this.pointId = [];
                    for (let i = 0,j = res.data.length; i < j; i++) {
                        this.pointId.push({
                            value: res.data[i].id,
                            label: res.data[i].name
                        })
                    }
                }
            })
            .catch(err => {
                this.$message.error(err.message);
            })
      },
      getClassList(){
          this.$http.post(this.$api.categoryManagerList,{limit:0,page:1,status:"active"},true)
                .then(res => {
                    if(res.data){
                        this.categoryId = [];
                        for (let i = 0,j = res.data.length; i < j; i++) {
                            this.categoryId.push({
                                value: res.data[i].id,
                                label: res.data[i].name
                            })
                        }
                    }
                    this.$emit('listdata',this.categoryId)
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      getDetail(){
          this.$http.get(this.$api.questionDetail,{id:this.targetId},true)
                .then(res => {
                    try {
                        this.form = {
                                status:res.status,
                                validityType:res.validityType,
                                time:[],
                                title:res.title,
                                aLikeTitles:[],
                                content:res.content,
                                categoryId:res.categoryId,
                                pointId:res.knowledgePointId,
                            }
                        console.log(res);
                        if(res.aLikeTitles){
                            res.aLikeTitles.forEach(item => {
                                if(item){
                                    this.form.aLikeTitles.push(item)
                                }
                            });
                        }
                        if(res.validityType==='CUSTOM'){
                            this.form.time.push(res.startTime)
                            this.form.time.push(res.endTime)
                        }
                        if(res.viewerType){
                            this.form.viewerType=res.viewerType
                        }
                    } catch (error) {
                        
                    }
                    
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      }
  },
  watch:{
     dialogTableVisible(n){
         if(n){
            this.getClassList();
            this.getpointList();
            this.dataInit()
            if(this.targetId){
                this.title = '编辑问题'
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