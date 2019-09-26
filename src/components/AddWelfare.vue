<template>
  <div>
        <el-dialog
        title="新增福利商品"
        :visible.sync="dialogVisible"
        width="900px"
        :before-close="fnCancel">
        <div class="add-self">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>新增福利商品
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click.stop='fnSearch'>查询</el-button>
                        <el-button type="info" :size="$size" @click.stop='fnClear'>清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :inline="true" :model="condition" :size="$size" class="demo-form-inline">
                        <el-form-item label="商品ID：">
                            <el-input v-model="condition.goodsId" placeholder="商品ID"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称：">
                            <el-input v-model="condition.goodsName" placeholder="商品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="商品类别：">
                            <el-select v-model="condition.categoryCode" placeholder="商品类别">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品价格：">
                            <div class="self-price">
                                <el-input v-model.number="condition.cashInterval.start" placeholder="最低价"></el-input>
                                <span>到</span>
                                <el-input v-model.number="condition.cashInterval.end" placeholder="最高价"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="xk-body xk-radius marintop20">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>商品列表
                    </div>
                    <div class="vus-btn">
                        <el-button :disabled="multipleSelection.length? false: true" type="primary" :size="$size" @click.stop="fnAdd()">批量添加</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData3" tooltip-effect="dark" style="width: 100%" border v-loading='vloading' @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column label="商品ID" prop="goodsId"></el-table-column>
                    <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                    <el-table-column prop="category" label="商品类别"></el-table-column>
                    <el-table-column prop="brandName" label="商品品牌"></el-table-column>
                    <el-table-column prop="price" label="商品价格">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.price, 100) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" :size="$size" @click.stop="fnAdd(scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="fnCancel" :size='$size'>关 闭</el-button>
        </span>
            <el-dialog
                width="1000px"
                title="商品详情"
                :visible.sync="innerVisible"
                append-to-body>
                <welfare-detail :innerVisible.sync='innerVisible' :target='target' @addSucessNow='addSucessNow'></welfare-detail>
            </el-dialog>
        </el-dialog>
  </div>
</template>
<script>
import welfareDetail from './WelfareDetail'
export default {
  name:'addSelf',
  data () {
    return {
        currentPage:1,
        pageSize:10,
        total:0,
        condition:{
            goodsId:"",
            goodsName:"",
            categoryCode:"",
            cashInterval:{
                start:"",
                end:""
            }
        },
        tableData3: [],
        multipleSelection: [],
        innerVisible:false,
        target:null,
        vloading:false,
        options:[]
    };
  },
  props: {
      dialogVisible:{},
      type:{
          default:"detail"
      }
  },
  components: {
      welfareDetail
  },
  computed: {},
  created() {
      this.fnGetCategory();
  },
  mounted() {},
  methods: {
        fnCancel(){
            this.$emit('update:dialogVisible',false)
        },
        fnpagechange(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            this.getThisPage()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getThisPage(data={page:this.currentPage,limit:this.pageSize,condition:{}}){
            this.vloading = true ;
            console.log(data)
            this.$http.get(this.$api.jfmallUnRecommendJGoodsQPage4Manager,data , true).then((res) => {
               console.log(res)
               this.vloading = false ;
               this.tableData3 = []
               if(res.total){
                   this.total = res.total
               }
               if(res.data){
                   this.tableData3 = res.data
               }
            }).catch((err) => {
               console.log(err)
               this.vloading = false ;
               this.tableData3 = [] ;
               this.$message.error(err.message);
            });
        },
        fnAdd(target){
            this.target = target? [ target.goodsId ]: this.multipleSelection.map(item=>{
                return item.goodsId
            });
            this.innerVisible = true ;
        },
        addSucessNow(){
            this.$emit('addSucess');
            this.getThisPage();
        },
        fnSearch(){
            let obj = {
                page:this.currentPage,
                limit:this.pageSize,
                condition:{}
            };
            for (const key in this.condition) {
                if(this.condition[key]){
                    obj.condition[key] = this.condition[key]
                }
                if(key==='cashInterval'){
                    if(this.condition[key].start){
                        obj.condition['cashInterval']['start'] = this.condition[key].start
                    }else{
                        delete obj.condition.cashInterval.start
                    }
                    if(this.condition[key].end){
                        obj.condition['cashInterval']['end'] = this.condition[key].end
                    }else{
                        delete obj.condition.cashInterval.end
                    }
                    if(!this.condition[key].end && !this.condition[key].start){
                        delete obj.condition.cashInterval
                    }
                }
            }
            console.log(obj);
            this.getThisPage(obj)
        },
        fnClear(){
            this.condition={
                goodsId:"",
                goodsName:"",
                categoryCode:"",
                cashInterval:{
                    start:"",
                    end:""
                }
            }
            this.getThisPage()
        },
        fnGetCategory(){
            this.$http.get(this.$api.queryJFCategory,{},true).then(res=>{
                console.log(res);
                this.options = [{label:"所有",value:""}] ;
                for (const item of res) {
                    this.options.push({
                        label:item.name,
                        value:item.code
                    })
                }
            }).catch(err => {
                console.log(err);
                this.$message.error(err.message);
            })
        }
  },
  watch: {
      dialogVisible(){
          if(this.dialogVisible){
              this.getThisPage()
          }
      }
  }
}
</script>
<style lang='scss'>
.self-price{
    .el-input{
        width: 150px;
    }
    span{
        margin:0 10px;
    }
}
</style>