<template>
    <div class='service-qus'>
        <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading='vloading'
        border>
            <el-table-column
                prop="order"
                label="序号">
            </el-table-column>
            <el-table-column
                prop="title"
                label="问题标题">
            </el-table-column>
            <el-table-column
                prop="content"
                label="问题答案">
            </el-table-column>
            <el-table-column
                prop="knowledgePointName"
                label="关联知识点">
            </el-table-column>
            <el-table-column
                prop="categoryName"
                label="问题分类">
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
                prop="viewerType"
                label="视角">
                <template slot-scope="scope">
                    {{scope.row.viewerType | viewerType}}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.status === 'active'?"正常":"关闭"}}
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width='300px'>
                <template slot-scope="scope">
                    <el-button v-permission="knowledgeBaseKnowStop" v-if="scope.row.status === 'active'" @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.status === 'active' ? '封停':'启用'}} -->
                        封停
                    </el-button>
                    <el-button v-permission="knowledgeBaseKnowStop" v-if="scope.row.status !== 'active'" @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.status === 'active' ? '封停':'启用'}} -->
                        启用
                    </el-button>
                    <el-button v-permission="knowledgeBaseKnowEdit" @click="fnbianji(scope.row)" type="primary" :size="$size" v-if="scope.row.status !== 'active'">
                        编辑
                    </el-button>
                    <el-button v-permission="knowledgeBaseKnowDelete" @click="fndel(scope.row)" type="primary" :size="$size" v-if="scope.row.status !== 'active'">
                        删除
                    </el-button>
                    <el-button v-permission="knowledgeBaseKnowLook" @click="fnchakan(scope.row)" type="primary" :size="$size">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        <lookqus :showlook='islookqus' :msgId='msgId' @closelook="fncloselook" ></lookqus>
    </div>
</template>
<script>
import lookqus from "./lookqus"
export default {
  name:'serviceQus',
  data () {
    return {
        tableData: [
        //     {
        //     order: 1,
        //     title: "优惠券怎么用",
        //     id:"",
        //     content: "有两种使用方式：一、二",
        //     knowledgePointName:"王小虎",
        //     categoryName:"客服长得丑",
        //     createdBy:"2018",
        //     viewerType:"禽兽",
        //     status:true
        //   }
          ],
          currentPage:1,
          pageSize:10,
          total:0,
          islookqus:false,
          msgId:"",
          vloading:true
    };
  },
  props:{
      issearch:{},
      searchData:{},
      isadd:{}
  },
  components: {
      lookqus
  },
  computed: {},
  created() {
      this.getThisPage()
  },
  mounted() {},
  methods: {
      handleClick(target){
          if(target.status === 'active'){
              this.$http.post(this.$api.questionDisable,{id:target.id},true)
                    .then(res => {
                        this.tableData[target.order%this.pageSize - 1].status = 'disable'
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
          }else{
              this.$http.post(this.$api.questionEnable,{id:target.id},true)
                    .then(res => {
                        this.tableData[target.order%this.pageSize - 1].status = 'active'
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
          }
      },
      fnbianji(target){
          this.$emit('update',target)
      },
      fndel(target){
          this.$http.post(this.$api.questionDelete,{id:target.id},true)
                .then(res => {
                    this.getThisPage()
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      fnchakan(target){
          this.islookqus = true;
          this.msgId = target.id;
      },
      getThisPage(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.post(this.$api.questionQList,data,true)
                .then(res => {
                    console.log(res);
                    
                    this.tableData = [];
                    this.$emit('searchSuccess');
                    this.vloading = false;
                    if(res.data){
                        for (let i = 0 ,j = res.data.length; i < j; i++) {
                            this.tableData.push({
                                order:i + 1 + (this.currentPage - 1)*this.pageSize,
                                title: res.data[i].title,
                                id:res.data[i].id,
                                content: res.data[i].content,
                                knowledgePointName:res.data[i].knowledgePointName,
                                categoryName:res.data[i].categoryName,
                                createdBy:res.data[i].createdBy,
                                createdRealName:res.data[i].createdRealName,
                                createdNickName:res.data[i].createdNickName,
                                viewerType:res.data[i].viewerType,
                                status:res.data[i].status
                            })
                        }
                    }else{
                        this.vloading = false;
                        this.$message({
                            message: '没有相关内容',
                            type: 'warning'
                        });
                    }
                    
                    if(res.total){
                        this.total = res.total;
                    }
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      fnpagechange(val,page){
          this.pageSize = page ;
          this.currentPage = val;
          this.vloading = true ;
          this.getThisPage()
      },
      fncloselook(v){
          this.islookqus = false
      }
  },
  watch:{
      issearch(newV){
          let obj = {
              limit:this.pageSize,
              page:this.currentPage,
              status:this.searchData.status
          }
          if(this.searchData.title){
              obj.title = this.searchData.title
          }
          if(this.searchData.viewerType){
              obj.viewerType = this.searchData.viewerType
          }
          if(this.searchData.categoryId){
              obj.categoryId = this.searchData.categoryId
          }
          this.getThisPage(obj);
      },
      isadd(){
          this.getThisPage();
      }
  }
}
</script>
<style lang='scss' scoped>
@import "./qus"
</style>