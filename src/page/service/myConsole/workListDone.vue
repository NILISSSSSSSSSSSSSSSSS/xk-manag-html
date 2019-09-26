<template>
    <div class = 'xk-container'>
        <div class='xk-body'>
            <div class='work-list-done'>
                <div class="xk-radius">
                    <div class='xk-title'>
                        <div class="vus-title">
                            <span></span>
                            已完成工单搜索
                        </div>
                        <div class="vus-btn">
                            <el-button type="primary" :size="$size" :loading='load' @click="onSubmit">查询</el-button>
                        </div>
                        <div class="vus-bottom"></div>
                    </div>
                    <el-form :size="$size" 
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
                            <el-select v-model="formInline.orderStatus" placeholder="工单状态">
                                <el-option label="所有" value=""></el-option>
                                <el-option label="已完成" value="finish"></el-option>
                                <el-option label="未接单" value="not_receipt"></el-option>
                                <el-option label="已接单" value="receipt"></el-option>
                                <el-option label="已评价" value="evaluate"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客服：">
                            <el-select v-model="formInline.customerServiceId" placeholder="客服分类">
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
                <div class="xk-radius marintop20">
                    <div class='xk-title'>
                        <div class="vus-title">
                            <span></span>
                            已完成工单列表
                        </div>
                        <div class="vus-btn"></div>
                        <div class="vus-bottom"></div>
                    </div>
                    <el-table
                        :data="tableData"
                        v-loading='vloading'
                        stripe
                        style="width: 100%"
                        border>
                        <!-- <el-table-column
                        prop="order"
                        label="序号">
                        </el-table-column> -->
                        <el-table-column
                        prop="id"
                        label="工单id">
                        </el-table-column>
                        <el-table-column
                        prop="title"
                        label="工单标题">
                        </el-table-column>
                        <el-table-column
                        prop="description"
                        label="工单描述">
                        </el-table-column>
                        <el-table-column
                        prop="attachments"
                        label="工单附件">
                        <template slot-scope="scope">
                            <a target="_blank" style="margin-right:5px" v-for="(item,index) in scope.row.attachments" :href="item" :key="index">附件{{index+1}}</a>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="finishAt"
                        label="完成时间">
                        <template slot-scope="scope">
                            {{scope.row.finishAt*1000 | formatTime}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="createdName"
                        label="创建客服真名">
                        <template slot-scope="scope">
                            {{scope.row.createdRealName?scope.row.createdRealName:"未知"}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="createdName"
                        label="创建客服昵称">
                        <template slot-scope="scope">
                            {{scope.row.createdNickName?scope.row.createdNickName:"未知"}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                            {{scope.row.orderStatus | WorkStatus}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="level"
                        label="评价星级">
                        </el-table-column>
                        <el-table-column
                        label="操作" 
                        width="150px"
                        fixed="right">
                        <template slot-scope="scope">
                            <el-button v-permission="'workListDoneLook'" @click="handleClick(scope.row)" type="primary" :size="$size">查看</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            <listdetail :showdetail='showdetail' @closeshowdetail='closeshowdetail' :workId='workId'></listdetail>
        </div>
    </div>
</template>
<script>
import Listdetail from '@/components/service/ListDetail';
import {mapState, mapMutations} from 'vuex'
export default {
  name:'workListDone',
  data () {
    return {
        formInline: {
          id: '',
          title: '',
          orderStatus:"",
          customerServiceId:""
        },
        options:JSON.parse(localStorage.getItem('customerQPage')),
        tableData:[
            // {
            //     order:1,
            //     id: 1,
            //     title: '退货单',
            //     description: '我觉得不应该给他退货，但是我拿不定主意',
            //     attachments:["aa","bb"],
            //     finishAt:"8月28日 2：00",
            //     createdName:"乔达摩",
            //     orderStatus:true,
            //     level:4
            // }
        ],
        currentPage:1,
        pageSize:10,
        total:0,
        load:true,
        showdetail:false,
        workId:'',
        vloading:false
    };
  },
  components: {
      Listdetail
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
      this.getThisPage();
      this.formInline = this.myDoneWorkOrder ? this.myDoneWorkOrder : {
          id: '',
          title: '',
          orderStatus:"",
          customerServiceId:""
        };
      
  },
  computed: {
      ...mapState({
          myDoneWorkOrder:state => state.service.myDoneWorkOrder
      })
  },
  mounted() {},
  methods: {
      ...mapMutations({
          setmyDoneWorkOrder:'service/setmyDoneWorkOrder'
      }),
      getThisPage(data={limit:this.pageSize,page:this.currentPage}){
          this.load = true;
          this.vloading = true ;
          this.$http.get(this.$api.workOrderPageComplete,data,true)
            .then(res => {
                console.log(res)
                this.load = false;
                this.vloading = false ;
                this.tableData = []
                if(res.data){
                    res.data.forEach((item,index) => {
                        this.tableData.push(item)
                        this.tableData[index].order = index + 1 + this.pageSize*(this.currentPage - 1)
                    });
                }
                if(res.total){
                    this.total = res.total;
                }
            })
            .catch(err => {
                this.$message.error(err.message);
                this.load = false;
                this.vloading = false ;
            })
      },
      onSubmit() {
        // console.log(this.formInline)
        this.setmyDoneWorkOrder(this.formInline)
        let data = {
            limit:this.pageSize,
            page:this.currentPage
        }
        for (const key in this.formInline) {
            if(this.formInline[key]){
                data[key] = this.formInline[key]
            }
        }
        
        this.getThisPage(data);
      },
      fnpagechange(val,page){
          console.log(val,page)
          this.currentPage = val;
          this.pageSize = page ;
          this.vloading = true ;
          this.getThisPage()
      },
      handleClick(target){
          this.workId = target.id;
          this.showdetail = true ;
      },
      closeshowdetail(){
          this.showdetail = false
      }
  }
}
</script>
<style lang='scss' scoped>
</style>