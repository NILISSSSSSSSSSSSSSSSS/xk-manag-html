<template>
    <div class = 'self-table'>
        <el-table :data="tableData3" tooltip-effect="dark" :size='$size' border stripe v-loading='vloading' @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column prop='index' label="序号" width="80"></el-table-column>
            <el-table-column prop="goodsId" label="商品ID"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop='category' label="商品类别"></el-table-column>
            <el-table-column label="地区（到区县）">
                <template slot-scope="scope">
                    <p v-for="(item,index) in scope.row.addressName" :key="index">{{ item }}</p>
                </template>
            </el-table-column>
            <el-table-column prop='price' label="价格"></el-table-column>
            <el-table-column label="排序">
                <template slot-scope="scope">
                    <el-button icon="el-icon-top" :loading="scope.row.upLoading" :size="$size" type="success" @click="move(scope.row.goodsId, 'UP', scope.row)"></el-button>
                    <el-button icon="el-icon-bottom" :loading="scope.row.downLoading" :size="$size" type="warning" @click="move(scope.row.goodsId, 'DOWN', scope.row)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" fixed='right' width='200px'>
                <template slot-scope="scope">
                    <el-button v-permission="'groomGoodsRegulationWelfareDetail'" type="primary" :size="$size" @click.stop='fnChakan(scope.row)'>查看详细</el-button>
                    <el-button v-permission="'groomGoodsRegulationWelfareDelete'" type="danger" :size="$size" @click.stop='fnDel(scope.row)'>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            width="800px"
            title="商品详情"
            :visible.sync="innerVisible"
            append-to-body>
            <look-welfare type="detail" :innerVisible.sync='innerVisible' :target='target' @addSucessNow = 'addSucessNow'></look-welfare>
        </el-dialog>
        <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
    </div>
</template>
<script>
    import lookWelfare from '@/components/WelfareDetail.vue'
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    export default {
    name:'welfareTable',
    data () {
        return {
            currentPage:1,
            pageSize:10,
            total:0,
            tableData3: [],
            multipleSelection: [],
            vloading:false,
            innerVisible:false,
            target:null
        };
    },
    props: {
        condition:{
            type: Object,
            default: ()=>({})
        },
        isSearch:{
            type: Boolean,
            default: false
        }
    },
    components: {
        lookWelfare
    },
    created() {
        this.getList()
    },
    methods: {
            fnChakan(target){
                this.target = [target.goodsId] ;
                this.innerVisible = true ;
            },
            fnpagechange(currentPage,pageSize){
                this.currentPage = currentPage ;
                this.pageSize = pageSize ;
                this.getList()
            },
            fnDel(target){
                this.$confirm('是否继续删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.fnDelGoods([target.goodsId]);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.$emit("canDel", !this.multipleSelection.length);
            },
            addSucessNow(){
                this.getList()
            },
            //查询
            fnSearch(){
                this.vloading = true ;
                this.currentPage = 1;
                this.getList();
            },
            //删除所有
            fnDelAll(){
                let jArr = [];
                this.multipleSelection.forEach(item => {
                    jArr.push(item.goodsId)
                });
                this.fnDelGoods(jArr);
            },
            /**
             * 清除查询条件
             */
            fnClear() {
                this.currentPage = 1;
                this.condition = {};
                this.getList();
            },
            /**
             * 删除商品接口的方法
             */
            fnDelGoods(goodsIds) {
                this.$http.post(this.$api.jfmallDeleteRecommendJGoods4Manager,{goodsIds:goodsIds} , true).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList()
                }).catch((err) => {
                    this.$message.error(err.error);
                });
            },
            /**
             * 获取列表数据
             */
            getList() {
                let params = {
                    page: this.currentPage,
                    limit: this.pageSize,
                    condition: {
                        ...this.condition
                    }
                }
                if(params.condition.address&&params.condition.address.length) {
                    params.condition.address = params.condition.address.slice(-1).toString();
                }
                this.vloading = true;
                this.$http.get(this.$api.jfmallRecommendJGoodsQPage4Manager, params, true).then(res => {
                    this.vloading = false ;
                    console.log(res)
                    this.total = res? res.total: 0;
                    if (res) {
                        this.tableData3 = res.data.map(item=>{
                            return {
                                index: item.index,
                                goodsId: item.goodsId,
                                goodsName: item.goodsName,
                                category:item.category,
                                addressName: item.address.map(ele=>{
                                    return getPorvinceInfo(ele.code? ele.code: ele.districtCode? ele.districtCode: ele.cityCode? ele.cityCode: ele.provideCode)
                                }),
                                price: this.$math.divide(item.price, 100)
                            }
                        })
                    }else{
                        this.tableData3 = [];
                    }
                }).catch((err) => {
                    this.vloading = false;
                    this.tableData3 = [];//清空
                    this.total = 0;
                });
            },
            /**
             * index 当前商品的序号
             * type up向上移动， down向下移动
             */
            move(goodsId, type, row) {
                if(type=='UP') {
                    this.$set(row, 'upLoading', true);
                }else{
                    this.$set(row, 'downLoading', true);
                }
                this.$http.post(this.$api.jfmallUpdateIndex, {
                    goodsId: goodsId,
                    recommendIndexChangeType: type
                }, true)
                .then(res=>{
                    this.$message.success("移动成功");
                    this.$set(row, 'upLoading', false);
                    this.$set(row, 'downLoading', false);
                    this.getList();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'upLoading', false);
                    this.$set(row, 'downLoading', false);
                })
            }
    },
    watch: {
        isSearch(val) {
            val? this.fnSearch(): null;
        }
    }
}
</script>
<style scoped>
</style>