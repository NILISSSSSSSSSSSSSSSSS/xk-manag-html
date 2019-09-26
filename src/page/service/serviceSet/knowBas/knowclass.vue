<template>
    <div class='service-class'>
        <el-table
        :data="tableData"
        style="width: 100%"
        :size="$size"
        stripe
        v-loading='vloading'
        border>
            <el-table-column
                prop="order"
                label="序号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="分类名称">
            </el-table-column>
            <el-table-column
                prop="description"
                label="分类描述">
            </el-table-column>
            <!-- <el-table-column
                label="创建人真名">
                <template slot-scope="scope">
                    {{scope.row.createdRealName?scope.row.createdRealName:"未知"}}
                </template>
            </el-table-column>
            <el-table-column
                label="创建人昵称">
                <template slot-scope="scope">
                    {{scope.row.createdNickName?scope.row.createdNickName:"未知"}}
                </template>
            </el-table-column> -->
            <el-table-column
                label="视角">
                <template slot-scope="scope">
                 {{scope.row.viewerType | viewerType}}
                </template>
            </el-table-column>
            <el-table-column
                prop="bizStatus"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.bizStatus==="active"?"正常":"关闭"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="handle"
                fixed="right"
                label="操作"
                width="300px">
                <template slot-scope="scope">
                    <el-button v-permission="knowledgeBaseQusClassStop" v-if='scope.row.bizStatus==="active"' @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.bizStatus==="active"?'封停':'启用'}} -->
                        封停
                    </el-button>
                    <el-button v-permission="knowledgeBaseQusClassStart" v-if='scope.row.bizStatus!=="active"' @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.bizStatus==="active"?'封停':'启用'}} -->
                        启用
                    </el-button>
                    <el-button v-permission="knowledgeBaseQusClassEdit" @click="fnbianji(scope.row)" type="primary" v-if="scope.row.bizStatus != 'active'" :size="$size">编辑</el-button>
                    <el-button v-permission="knowledgeBaseQusClassLook" @click="fnchakan(scope.row)" type="primary" :size="$size">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        <el-dialog
            title="知识点分类"
            :visible.sync="dialogVisible"
            width="693px"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="100px" v-loading="formloading">
                <el-form-item label="分类名称：">
                    {{form.name}}
                </el-form-item>
                <el-form-item label="分类描述：">
                    {{form.description}}
                </el-form-item>
                <el-form-item label="视角：">
                    {{form.viewerType | viewerType}}
                </el-form-item>
                <el-form-item label="状态：">
                    {{form.bizStatus=="active"?"正常":"关闭"}}
                </el-form-item>
            </el-form>
        </el-dialog>
        
    </div>
</template>
<script>
import lookclass from "./lookclass"
export default {
  name:'serviceClass',
  data () {
    return {
        tableData: [],
          currentPage:1,
          pageSize:10,
          total:1,
          msgId:null,
          vloading:true,
          form:{},
          dialogVisible:false,
          formloading:false,
    };
  },
  components:{
      lookclass
  },
  computed: {},
  created() {
      this.fngetList();
  },
  mounted() {},
  props:{
      searchData:{
          type:Object
      },
      isadd:{}
  },
  methods: {
      handleClose(done){
          done();
      },
      fnpagechange(val,page){
          this.pageSize = page ;
          this.currentPage = val;
          this.vloading = true ;
          this.fngetList();
      },
      fngetList(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.post(this.$api.knowledgePointCategoryPage,data,true)
                .then(res => {
                    this.tableData = res.data;
                    this.vloading = false ;
                    console.log(res);
                    
                    if(res.data){
                        for(let i = 0,j = res.data.length; i < j ;i++){
                            this.tableData[i].order = i + 1 + (this.currentPage - 1) * this.pageSize;
                        }
                    }
                    
                    if(res.total){
                        this.total = res.total
                    }
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.vloading = false ;
                })
      },
      handleClick(target){
          if(target.bizStatus === 'active'){
              this.$http.post(this.$api.KnowledgePointCategoryDisable,{id:target.id},true)
                .then(res => {
                    this.tableData[target.order%this.pageSize - 1].bizStatus = 'disabled'
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
          }else{
              this.$http.post(this.$api.KnowledgePointCategoryEnable,{id:target.id},true)
                .then(res => {
                    this.tableData[target.order%this.pageSize - 1].bizStatus = 'active'
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
          }
          
      },
      fnbianji(target){
          this.$emit('update',target)
      },
      fnchakan(target){
          this.dialogVisible = true ;
          this.formloading = true ;
          this.$http.get(this.$api.knowledgePointCategoryDetail,{id:target.id} , true).then((res) => {
             console.log(res)
             this.form = res ;
             this.formloading = false ;
          }).catch((err) => {
             console.log(err);
             this.formloading = false ;
              this.$message.error(err.message);
          });
      }
  },
  watch:{
      isadd(){
          this.fngetList();
      }
  }
}
</script>
<style lang='scss' scoped>
@import "./class.scss"
</style>