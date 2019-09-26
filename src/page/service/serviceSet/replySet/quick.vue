<template>
  <div class = 'quick'>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        v-loading='vloading'
        border>
            <el-table-column
                prop="order"
                label="序号">
            </el-table-column>
            <el-table-column
                prop="content"
                label="快捷回复内容">
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
                width="200px"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-permission="replySetFastStop" @click="handleClick(scope.row)" type="primary" :size="$size">
                        {{scope.row.status === 'active'?"封停":"启用"}}
                    </el-button>
                    <el-button v-permission="replySetFastEdit" @click="fnbianji(scope.row)" v-if="scope.row.status === 'disabled'" type="primary" :size="$size">编辑</el-button>
                    <el-button v-permission="replySetFastDelete" @click="fndel(scope.row)" v-if="scope.row.status === 'disabled'" type="primary" :size="$size">删除</el-button>
                    <el-button v-permission="replySetFastLook" @click="fnchakan(scope.row)" type="primary" :size="$size">查看</el-button>
                </template>
            </el-table-column>
      </el-table>
      <lookquick @closelookquick="fncloselookquick" :showchakan="showchakan" :msgId = "msgId"></lookquick>
      <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
  </div>
</template>
<script>
import Lookquick from './lookquick'
export default {
  name:'quick',
  data () {
    return {
        tableData: [
            // {
            //     order: 1,
            //     content: "这是一个分类",
            //     status:'active',
            //     id:"aasdd"
            // }
          ],
        currentPage:1,
        pageSize:10,
        total:1,
        showchakan:false,
        msgId:null,
        vloading:true
    };
  },
  props: {
      listrefresh:{}
  },
  components: {
      Lookquick
  },
  created() {
      this.fnQuickList()
  },
  mounted() {},
  methods: {
      handleClick(target){
          this.$http.post(this.$api.csQuickReplyUpdateStatus,{id:target.id},true)
                .then(res => {
                    if(this.tableData[target.order - 1].status === 'active'){
                        this.tableData[target.order - 1].status = 'disabled'
                    }else{
                        this.tableData[target.order - 1].status = 'active'
                    }
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      fnbianji(target){
          this.$emit('replyedit',target.id)
      },
      fndel(target){
          this.$http.post(this.$api.cdQuickReplyDelete,{id:target.id},true)
                .then(res => {
                    this.fnQuickList()
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
      },
      fnchakan(target){
          this.msgId = target.id;
          this.showchakan = true ;
      },
      fncloselookquick(){
          this.showchakan = false ;
      },
      fnpagechange(val,page){
          this.currentPage = val ;
          this.pageSize = page ;
          this.vloading = true ;
          this.fnQuickList();
      },
      fnQuickList(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.get(this.$api.csQuickReplyQPage,data,true)
            .then(res => {
                this.vloading = false ;
                if(res.total){
                    this.total = res.total ;
                }
                this.tableData = []; 
                if(res.data){
                    res.data.forEach((item,index) => {
                        this.tableData.push(item)
                        this.tableData[index].order = index + 1 + this.pageSize*(this.currentPage - 1)
                    });
                }
            })
            .catch(err => {
                this.vloading = false ;
                this.$message.error(err.message);
            })
      }
  },
  watch:{
      listrefresh(){
          this.fnQuickList()
      }
  }
}
</script>
<style lang='scss' scoped>
.el-button{
    margin:0 5px 5px 0;
}
</style>