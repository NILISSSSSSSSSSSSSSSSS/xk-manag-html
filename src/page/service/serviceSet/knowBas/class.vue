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
            <el-table-column
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
            </el-table-column>
            <el-table-column
                label="视角">
                <template slot-scope="scope">
                 {{scope.row.viewerType | viewerType}}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.status==="active"?"正常":"关闭"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="handle"
                fixed="right"
                label="操作"
                width="300px">
                <template slot-scope="scope">
                    <el-button v-permission="knowledgeBaseKnowClassStop" v-if='scope.row.status==="active"' @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.status==="active"?'封停':'启用'}} -->
                        封停
                    </el-button>
                    <el-button v-permission="knowledgeBaseKnowClassStart" v-if='scope.row.status!=="active"' @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.status==="active"?'封停':'启用'}} -->
                        启用
                    </el-button>
                    <el-button v-permission="knowledgeBaseKnowClassEdit" @click="fnbianji(scope.row)" type="primary" v-if="scope.row.status != 'active'" :size="$size">编辑</el-button>
                    <el-button v-permission="knowledgeBaseKnowClassDelete" @click="fndel(scope.row.id)" type="primary" v-if="scope.row.status != 'active'" :size="$size">删除</el-button>
                    <el-button v-permission="knowledgeBaseKnowClassLook" @click="fnchakan(scope.row)" type="primary" :size="$size">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        <lookclass :msgId='msgId' :dialogTableVisible='islookclass' @closeclass="fncloseclass"></lookclass>
    </div>
</template>
<script>
import lookclass from "./lookclass"
export default {
  name:'serviceClass',
  data () {
    return {
        tableData: [
            // {
            //     order: 1,
            //     name: "这是一个分类",
            //     description: "分类分的很好",
            //     createdBy:"王小虎",
            //     viewerType:"USER",
            //     status:'active',
            //     handle:true
            // }
          ],
          currentPage:1,
          pageSize:10,
          total:1,
          islookclass:false,
          msgId:null,
          vloading:true
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
      fnpagechange(val,page){
          this.pageSize = page ;
          this.currentPage = val;
          this.vloading = true ;
          this.fngetList();
      },
      fngetList(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.post(this.$api.categoryManagerList,data,true)
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
          if(target.status === 'active'){
              this.$http.post(this.$api.categoryManagerDisable,{id:target.id},true)
                .then(res => {
                    this.tableData[target.order%this.pageSize - 1].status = 'disabled'
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
          }else{
              this.$http.post(this.$api.categoryManagerEnable,{id:target.id},true)
                .then(res => {
                    this.tableData[target.order%this.pageSize - 1].status = 'active'
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
          }
          
      },
      fndel(id){
          
          this.$http.post(this.$api.categoryManagerDelete,{id:id},true)
                .then(res => {
                    this.fngetList()
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      fnbianji(target){
          this.$emit('update',target)
      },
      fnchakan(target){
          this.msgId = target.id;
          this.islookclass = true ;
      },
      fncloseclass(){
          this.islookclass = false ;
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