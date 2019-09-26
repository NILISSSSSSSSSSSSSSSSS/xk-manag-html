<template>
    <div class = 'xk-container'>
        <div class='xk-body'>
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        工单列表搜索
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form size="mini" 
                            :inline="true" 
                            :model="formInline"
                            class="demo-form-inline xk-search">
                        <el-form-item label="工单id：">
                            <el-input v-model="formInline.id" placeholder="工单id"></el-input>
                        </el-form-item>
                        <el-form-item label="工单标题：">
                            <el-input v-model="formInline.title" placeholder="工单标题"></el-input>
                        </el-form-item>
                        <el-form-item label="工单状态：">
                            <el-select v-model="formInline.orderStatus" placeholder="状态">
                                <el-option label="所有" value=""></el-option>
                                <el-option label="已完成" value="finish"></el-option>
                                <el-option label="未接单" value="not_receipt"></el-option>
                                <el-option label="已接单" value="receipt"></el-option>
                                <el-option label="已评价" value="evaluate"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客服分类：">
                            <el-select v-model="formInline.customerServiceId" placeholder="分类">
                                <el-option label="所有" value=""></el-option>
                                <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.realname"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            
            <div class='work-list xk-radius marintop20'>
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        工单列表
                    </div>
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                </div>
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
                        prop="id"
                        label="工单ID">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="工单名称">
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="工单描述">
                    </el-table-column>
                    <el-table-column
                        label="工单创建客服真名">
                        <template slot-scope="scope">
                            {{scope.row.createdRealName?scope.row.createdRealName:"未知"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="工单创建客服昵称">
                        <template slot-scope="scope">
                            {{scope.row.createdNickName?scope.row.createdNickName:"未知"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="工单流传客服真名">
                        <template slot-scope="scope">
                            {{scope.row.takeOverRealName?scope.row.takeOverRealName:"未知"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="工单流传客服昵称">
                        <template slot-scope="scope">
                            {{scope.row.takeOverNickName?scope.row.takeOverNickName:"未知"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="工单创建时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt*1000 | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="orderStatus"
                        label="状态">
                        <template slot-scope="scope">
                            {{scope.row.orderStatus | WorkStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        width="150px"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button v-permission="'complaintServiceLook'" @click="handleClick(scope.row)" type="primary" :size="$size">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <listdetail :showdetail='showdetail' @closeshowdetail='closeshowdetail' :workId='workId'></listdetail>
                <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            </div>
        </div>
    </div>
</template>
<script>
import Listdetail from '@/components/service/ListDetail'
import {mapState,mapMutations} from 'vuex'
export default {
  name:'workList',
  data () {
    return {
        formInline: {
          id: '',
          title: '',
          orderStatus:"finish",
          customerServiceId:""
        },
        options:JSON.parse(localStorage.getItem('customerQPage')),
        tableData: [
        //     {
        //     order: 1,
        //     id: 19161651,
        //     title: "dsubf",
        //     description:"王小虎",
        //     createdName:"客服长得丑",
        //     takeOverBy:"2018",
        //     createdAt:1,
        //     orderStatus:1,
        //     handle:true
        //   }
          ],
          currentPage:1,
          pageSize:10,
          total:1,
          showdetail:false,
          workId:null,
          vloading:true
    };
  },
  components: {
      Listdetail
  },
  computed: {
      ...mapState({
          workList:state => state.service.workList
      })
  },
  created(){
      this.$http.get(this.$api.customerQPage, {}, true).then((res) => {
         if(res){
           this.options = res ;
         }
         localStorage.setItem("customerQPage", JSON.stringify(res))
      }).catch((err) => {
        this.$message.error(err.message);
      });
      this.fnWorkList();
      this.formInline = this.workList ? this.workList : {
          id: '',
          title: '',
          orderStatus:"finish",
          customerServiceId:""
        }
  },
  mounted() {},
  methods: {
      ...mapMutations({
          setworkList:'service/setworkList'
      }),
      onSubmit(){
          let obj = {
              limit:this.pageSize,
              page:this.currentPage
          }
          for (const key in this.formInline) {
              if(this.formInline[key]){
                  obj[key] = this.formInline[key]
              }
          }
          console.log(obj);
          this.setworkList(this.formInline)
          this.fnWorkList(obj)
      },
      fnpagechange(val,page){
          this.currentPage = val ;
          this.pageSize = page ;
          this.vloading = true ;
          this.fnWorkList()
      },
      handleClick(val){
          this.workId = val.id;
          this.showdetail = true ;
      },
      closeshowdetail(){
          this.showdetail = false ;
      },
      fnWorkList(data={limit:this.pageSize,page:this.currentPage}){
          this.$http.post(this.$api.workOrderPage,data,true)
            .then(res => {
                console.log(res);
                this.vloading = false ;
                this.tableData = []
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
  }
}
</script>
<style lang='scss' scoped>
</style>