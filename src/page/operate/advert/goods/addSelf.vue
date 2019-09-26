<template>
  <div>
        <el-dialog
        title="新增自营商品"
        :visible.sync="dialogVisible"
        width="1100px"
        :before-close="fnCancel">
        <div class="add-self">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>新增自营商品
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click.stop='fnSearch'>查询</el-button>
                        <el-button type="info" :size="$size" @click.stop='fnClear'>清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :inline="true" :model="condition" :size="$size" class="demo-form-inline">
                        <el-form-item label="商品ID：">
                            <el-input v-model="condition.id" placeholder="商品ID"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称：">
                            <el-input v-model="condition.name" placeholder="商品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="商品类别：">
                            <el-cascader
                                v-model="condition.category"
                                :size="$size"
                                :options="options"
                                :props="props"
                                change-on-select
                                placeholder="全部分类"
                                style="width: 100%;"
                            >
                            </el-cascader>
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
                <el-table
                    ref="multipleTable"
                    :data="tableData3"
                    tooltip-effect="dark"
                    style="width: 100%"
                    v-loading='vloading'
                    border
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="35">
                    </el-table-column>
                    <el-table-column
                    label="商品ID"
                    show-overflow-tooltip
                    prop="sGoodsId">
                    </el-table-column>
                    <el-table-column 
                    show-overflow-tooltip
                    prop="sGoodsName"
                    label="商品名称">
                    </el-table-column>
                    <el-table-column
                    prop="sGoodsCategory"
                    label="商品类别">
                    </el-table-column>
                    <el-table-column
                    prop="brandName"
                    label="商品品牌">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" :size="$size" @click.stop="fnAdd(scope.row)">添加</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="fnCancel" :size="$size">关 闭</el-button>
        </span>
            <el-dialog
                width="1200px"
                title="商品详情"
                :visible.sync="innerVisible"
                append-to-body>
                <look-self :innerVisible.sync='innerVisible' :target='target' @addSucessNow='addSucessNow' :goodsType="goodsType"></look-self>
            </el-dialog>
        </el-dialog>
  </div>
</template>
<script>
import lookSelf from './lookSelf.vue'
export default {
  name:'addSelf',
  data () {
    return {
        currentPage:1,
        pageSize:10,
        total:0,
        condition:{},
        tableData3: [],
        multipleSelection: [],
        innerVisible:false,
        target:null,
        vloading:false,
        options: [
            {
                code: '000000',
                name: '全部'
            }
        ],
        props: {
            value: 'code',
            label: 'name'
        },
    };
  },
  props: {
      dialogVisible:{},
      /**
       * goodsType 接收精选square 商户 merchant
       */
      goodsType: String
  },
  components: {
      lookSelf
  },
  computed: {},
  created() {
      this.getQueryList();
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
        getThisPage(){
            let prams = {
                page:this.currentPage,
                limit:this.pageSize,
                condition: {
                    recommendTargetType:  this.goodsType,
                    categoryCode: this.condition.category&&this.condition.category[this.condition.category.length-1]!=='000000'?this.condition.category[this.condition.category.length-1]: '',
                    goodsId: this.condition.id,
                    goodsName: this.condition.name
                }
            }
            this.vloading = true;
            this.$http.get(this.$api.mallUnRecommendSGoodsNewQPage, prams , true).then((res) => {
                console.log(res)
                this.vloading = false;
                this.tableData3 = res? res.data: [];
                this.total = res? res.total: 0;

            }).catch((err) => {
                this.$message.error(err.message);
               this.vloading = false;
               this.tableData3 = []
            });
        },
        /**
         * 批量添加
         */
        fnAdd(target){
            this.target = target? [ target.sGoodsId ]: this.multipleSelection.map(item=>{
                return item.sGoodsId
            });
            this.innerVisible = true ;
        },
        addSucessNow(){
            this.$emit('addSucess')
        },
        fnSearch(){
            [this.currentPage, this.pageSize] = [1, 10];
            this.getThisPage()
        },
        fnClear(){
            [this.condition, this.currentPage, this.pageSize] = [{}, 1, 10];
            this.getThisPage()
        },
        /**
         * 商品类别
         */
        getQueryList() {
            this.$http.get(this.$api.queryList, {}, true).then(res=> {
                let obj = {
                    code: '000000',
                    name: '全部'
                }
                this.options = res;
                this.options.unshift(obj);
            }).catch(err=> {
                this.$message.error(err.message)
            })
        }
  },
  watch: {
      dialogVisible(){
          if(this.dialogVisible){
              this.getThisPage()
          }
      },
      innerVisible(val) {
          !val? this.fnClear(): null;
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