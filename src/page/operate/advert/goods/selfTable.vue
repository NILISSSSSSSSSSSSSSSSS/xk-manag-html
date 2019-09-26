<template>
    <div class='self-table'>
        <el-table
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%"
                :size='$size'
                border
                stripe
                v-loading='vloading'
                @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column prop='index' label="序号" width="80"></el-table-column>
            <el-table-column prop="sGoodsId" label="商品ID"></el-table-column>
            <el-table-column prop="sGoodsName" label="商品名称"></el-table-column>
            <el-table-column prop='sGoodsCategory' label="商品类别"></el-table-column>
            <el-table-column label="推荐说明" prop="recommendMessage"></el-table-column>
            <el-table-column label="地区（到区县）">
                <template slot-scope="scope">
                    <p v-for="(item,index) in scope.row.address" :key="index">{{ item }}</p>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template slot-scope="scope">
                    <el-button icon="el-icon-top" :loading="scope.row.upLoading" :size="$size" type="success" @click="move(scope.row.sGoodsId, 'UP', scope.row)"></el-button>
                    <el-button icon="el-icon-bottom" :loading="scope.row.downLoading" :size="$size" type="warning" @click="move(scope.row.sGoodsId, 'DOWN', scope.row)"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="是否展示在热门首页" width="130" v-if="type!=='merchant'">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isEnable" :active-value="1" :inactive-value="0" @change="showHot(scope.row.sGoodsId, scope.row.isEnable)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed='right' width='200px'>
                <template slot-scope="scope">
                    <el-button v-permission="'groomGoodsRegulationSelfDetail'" type="primary" :size="$size" @click.stop='fnChakan(scope.row)'>查看详细</el-button>
                    <el-button v-permission="'groomGoodsRegulationSelfDelete'" type="danger" :size="$size" @click.stop='fnDel(scope.row)'>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                width="800px"
                title="商品详情"
                :visible.sync="innerVisible"
                append-to-body>
            <look-self type="detail" :innerVisible.sync='innerVisible' :target='target' @addSucessNow='addSucessNow' :goodsType="type"></look-self>
        </el-dialog>
        <Pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="fnpagechange"></Pagination>
    </div>
</template>
<script>
    import lookSelf from './lookSelf.vue';
    import { getPorvinceInfo } from '@/util/publicMehotds.js';

    export default {
        name: 'selfTable',
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                tableData3: [],
                multipleSelection: [],
                vloading: false,
                innerVisible: false,
                target: null
            };
        },
        props: {
            /**
             * 查询条件
             */
            condition: {
                type: Object,
                default: ()=>({})
            },
            //判断是否需要刷新当前页面
            isSearch: {
                type: Boolean,
                default: false
            },
            /**判断是精选还是批发商城 */
            type: String     /**参数接收分别为 精选square 商户 merchant*/
        },
        components: {
            lookSelf
        },
        methods: {
            fnChakan(target) {
                this.target = [target.sGoodsId];
                this.innerVisible = true;
            },
            //删除商品接口
            delRecommend(sGoodsId) {
                let params = {
                    goodsIds: sGoodsId,
                    recommendTargetType: this.type
                }
                this.$http.post(this.$api.mallDeleteRecommend, params, true)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fnSearch()
                }).catch((err) => {
                    this.$message.error(err.message);
                });
            },
            //删除单个商品
            fnDel(target) {
                this.$confirm('是否删除此项?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delRecommend([target.sGoodsId]);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //切换页面
            fnpagechange(currentPage, pageSize) {
                this.currentPage = currentPage;
                this.pageSize = pageSize;
                this.getList()
            },
            //多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.$emit("canDel", !this.multipleSelection.length);
            },
            addSucessNow() {
                this.fnSearch()
            },
            //查询
            fnSearch() {
                this.currentPage = 1;
                this.getList();
            },
            //清空查询条件
            fnClear() {
                this.currentPage = 1;
                this.condition = {};
                this.getList();
            },
            /**
             * 获取列表
             */
            getList() {
                /**
                 * 每次更新列表页都将父级的删除按钮置灰
                 */
                let params = {
                    page: this.currentPage,
                    limit: this.pageSize,
                    condition: {
                        recommendTargetType: this.type,
                        ...this.condition
                    }
                }
                if(params.condition.address&&params.condition.address.length) {
                    params.condition.address = params.condition.address.slice(-1).toString();
                }
                this.vloading = true;
                this.$http.get(this.$api.mallRecommendSGoodsNewQPage, params, true).then((res) => {
                    this.vloading = false;
                    this.total = res? res.total: 0;
                    if(res) {
                        this.tableData3 = res.data.map(item=>{
                            return {
                                index: item.index,
                                sGoodsId: item.sGoodsId,
                                sGoodsName: item.sGoodsName,
                                sGoodsCategory: item.sGoodsCategory,
                                recommendMessage: item.recommendMessage,
                                address: item.address.map(ele=>{
                                    return getPorvinceInfo(ele.code? ele.code: ele.districtCode? ele.districtCode: ele.cityCode? ele.cityCode: ele.provideCode)
                                }),
                                isEnable: item.isEnable
                            }
                        })
                    }else{
                        this.tableData3 = [];
                    }
                }).catch((err) => {
                    this.$message.error(err.message);
                    this.vloading = false;
                    this.tableData3 = [];//清空
                });
            },
            fnDelAll() {
                let sGoodsIds = [];
                this.multipleSelection.forEach(item => {
                    sGoodsIds.push(item.sGoodsId)
                });
                this.delRecommend(sGoodsIds);
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
                this.$http.post(this.$api.mallUpdateIndex, {
                    goodsId: goodsId,
                    recommendIndexChangeType: type,
                    recommendTargetType: this.type
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
            },
            /**
             * 是否展示热门
             * @param id: 商品ID
             * @param isEnable：是否启用
             */
            showHot(id, isEnable) {
                let url = isEnable? this.$api.mallEnableRecommend: this.$api.mallUnableRecommend;
                this.$http
                .post(url, {
                    goodsId: id,
                    recommendTargetType: this.type
                }, true)
                .then(res=>{
                    this.$message.success(`${isEnable? '启用成功': '禁用成功'}`);
                    this.getList();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.getList();
                })
            }
        },
        watch: {
            isSearch(val) {
                val?this.fnSearch(): null;
            }
        }
    }
</script>
<style scoped>
</style>