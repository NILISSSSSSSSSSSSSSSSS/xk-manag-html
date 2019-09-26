<template>
    <div class='service-know'>
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
                prop="name"
                label="知识点">
            </el-table-column>
            <el-table-column
                prop="href"
                label="内容链接">
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
                    {{scope.row.status==='active'?"正常":"关闭"}}
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="300px">
                <template slot-scope="scope">
                    <el-button v-permission="knowledgeBaseQusStop" v-if="scope.row.status === 'active'" @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.status === 'active' ? "封停" : "启用"}} -->
                        封停
                    </el-button>
                    <el-button v-permission="knowledgeBaseQusStart" v-if="scope.row.status !== 'active'" @click="handleClick(scope.row)" type="primary" :size="$size">
                        <!-- {{scope.row.status === 'active' ? "封停" : "启用"}} -->
                        启用
                    </el-button>
                    <el-button v-permission="knowledgeBaseQusEdit" @click="fnbianji(scope.row)" v-if="scope.row.status !== 'active'" type="primary" :size="$size">编辑</el-button>
                    <el-button v-permission="knowledgeBaseQusDelete" @click="fndel(scope.row)" v-if="scope.row.status !== 'active'" type="primary" :size="$size">删除</el-button>
                    <el-button v-permission="knowledgeBaseQusLook" @click="fnchakan(scope.row)" type="primary" :size="$size">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        <lookknow :msgId='msgId' :dialogTableVisible='islookknow' @closeknow="fncloseknow"></lookknow>
    </div>
</template>
<script>
import lookknow from "./lookknow"
import {knowledgePointUrl} from '@/util/publicParams';
export default {
  name:'serviceKnow',
  data () {
    return {
        tableData: [
            // {
            //     order: 1,
            //     name: "优惠券",
            //     href: "www.baidu.com",
            //     createdBy:"王小虎",
            //     viewerType:"CITY_PARTNER",
            //     status:'active',
            //     id:"sadas"
            // }
          ],
          currentPage:1,
          pageSize:10,
          total:1,
          msgId:"",
          islookknow:false,
          vloading:true
    };
  },
  components: {
      lookknow
  },
  props:{
      isadd:{
          type:Boolean
      }
  },
  computed: {},
  mounted() {
      this.fnGetKnowList();
  },
  methods: {
      fnpagechange(val,page){
          this.pageSize = page ;
          this.currentPage = val;
          this.vloading = true ;
          this.fnGetKnowList()
      },
      handleClick(target){
          if(target.status === 'active'){
              this.$http.post(this.$api.knowledgePointDisable,{id:target.id},true)
                    .then(res => {
                        this.tableData[target.order%this.pageSize - 1].status = 'disabled'
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                        
                    })
          }else{
              this.$http.post(this.$api.knowledgePointEnable,{id:target.id},true)
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
          this.$http.post(this.$api.knowledgePointDelete,{id:target.id},true)
                .then(res => {
                    this.fnGetKnowList()
                })
                .catch(err => {
                    this.$message.error(err.message);
                    
                })
      },
      fnchakan(target){
          this.islookknow = true ;
          this.msgId = target.id;
      },
      fncloseknow(){
          this.islookknow = false ;
      },
      fnGetKnowList(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.get(this.$api.knowledgePointList,data,true)
            .then(res => {
                console.log(res);
                this.vloading = false ;
                if(res.total){
                    this.total = res.total
                }
                this.tableData = [];
                if(res.data){
                    for(let i = 0,j = res.data.length;i < j; i++ ){
                        this.tableData.push({
                            order: i + 1 + (this.currentPage - 1)*this.pageSize,
                            name: res.data[i].name,
                            // href: this.$knowledgePointUrl+res.data[i].id,
                            href: `${knowledgePointUrl}knowledge?id=${res.data[i].id}`,
                            createdBy:res.data[i].createdBy,
                            createdRealName:res.data[i].createdRealName,
                            createdNickName:res.data[i].createdNickName,
                            viewerType:res.data[i].viewerType,
                            status:res.data[i].status,
                            id:res.data[i].id
                        })
                    }
                }
                
            })
            .catch(err => {
                this.$message.error(err.message);
                this.vloading = false ;
            })
      }
  },
  watch:{
      isadd(){
          this.fnGetKnowList();
      }
  }
}
</script>
<style lang='scss' scoped>
@import "./know.scss"
</style>