<template>
    <div class="virtual-mall-evaluate xk-container">
        <div class="xk-radius xk-search">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button :size="$size" type="primary" @click="clear()">清空</el-button>
                    <el-button :size="$size" type="primary" @click="search()">查询</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="150px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input :size="$size" placeholder="请输入商品名称" v-model="searchForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input :size="$size" placeholder="请输入商品ID" v-model="searchForm.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="评价数量：">
                            <el-input :size="$size" placeholder="请输入评价数量" v-model="searchForm.evaluateNum1"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-cascader
                                    v-model="searchForm.category"
                                    :size="$size"
                                    :options="options"
                                    :props="props"
                                    change-on-select
                                    placeholder="全部分类"
                                    style="width: 100%;"
                                >
                                </el-cascader>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
            </el-form>
        </div>

        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button :disabled="seletData.length? false: true" :size="$size" type="success" @click="openDia()" v-permission="'virtualMallEvaluateAdd'">批量添加</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table v-loading="loadingTable" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="商品ID" prop="id"></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.pic" @click="$viewImage(scope.row.pic)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="商品类型">
                    <template slot-scope="scope">
                        {{ scope.row | formatterCat }}
                    </template>
                </el-table-column>
                <el-table-column label="真实评价数量" prop="evaluateNum1"></el-table-column>
                <el-table-column label="虚假评论数量" prop="evaluateNum2"></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button :size='$size' type="primary" @click="openDia(scope.row)" v-permission="'virtualMallEvaluateAdd'">添加评价</el-button>
                        <el-button :size='$size' type="primary" @click="goToDetail(scope.row)" v-permission="'virtualMallEvaluateDetail'">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 新增评价详情 -->
        <virtual-evaluate :goodsIds="goodsIds" :visible.sync="visible" type="mall"></virtual-evaluate>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { enumFormatter } from "../../../util/publicMehotds.js";
    import VirtualEvaluate from '@/components/goods/VirtualEvaluate.vue';
    let goodsCategroy = [];
    export default {
        components: {
            VirtualEvaluate
        },
        data() {
            return {
                tableData: [],
                searchForm: {},
                goodsCategroy: [],
                options: [],
                props: {
                    value: 'code',
                    label: 'name'
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                visible: false,
                tableDetail: [],
                goodsIds: null,
                seletData: [],
                loadingTable: false
            }
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getQueryList();
            this.getList();
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallGoods.mallEvaluate
            })
        },
        methods: {
            ...mapMutations({
                setSearchMallEvaluate: "selfMallGoods/setSearchMallEvaluate"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            handleSelectionChange(val) {
                this.seletData = val;
            },
            search() {
                this.page.page = 1;
                this.getList();
            },
            clear() {
                this.page.page = 1;
                this.searchForm = {};
                this.setSearchMallEvaluate(null);
                this.getList();
            },
            goToDetail(row) {
                this.$router.push({
                    path: '/virtualMallEvaluateDetail',
                    query: {
                        goodsId: row.id
                    }
                })
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    name: this.searchForm.name,
                    id: this.searchForm.id,
                    category: this.searchForm.category&&this.searchForm.category[this.searchForm.category.length-1]!=='000000'?this.searchForm.category[this.searchForm.category.length-1]: '',
                    // evaluateNum1: this.searchForm.evaluateNum1
                }
                this.loadingTable = true;
                this.$http
                .get(this.$api.goodsQPageInMall, params, true)
                .then(res=>{
                    this.loadingTable = false;
                    this.setSearchMallEvaluate(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.loadingTable = false;
                    this.$message.error(err.message);
                })
            },
            getQueryList() {
                this.$http.get(this.$api.queryList, {}, true).then(res=> {
                    this.goodsCategroy = this.flatten(res);
                    goodsCategroy = this.goodsCategroy;
                    let obj = {
                        code: '000000',
                        name: '全部'
                    }
                    this.options = res;
                    this.options.unshift(obj);
                }).catch(err=> {
                    this.$message.error(err.message)
                })
            },
            //扁平化数组
            flatten(arr){
                var res = [];
                for(var i=0;i<arr.length;i++){
                    if(Array.isArray(arr[i].children)){
                        res = res.concat(this.flatten(arr[i].children));
                    }else{
                        res.push(arr[i]);
                    }
                }
                return res;
            },
            openDia(row) {
                if(row) {
                    this.goodsIds = [row.id];
                }else{
                    this.goodsIds = this.seletData.map(item=>{
                        return item.id;
                    })
                }
                this.visible = true;
            }
        },
        filters: {
            formatterCat(row) {
                if(row) {
                    let code = row.categories.cc_thr?row.categories.cc_thr:row.categories.cc_sec?row.categories.cc_sec:row.categories.cc_fri;
                    return enumFormatter(code, goodsCategroy, {key: 'code', value: 'name'})
                }
            }
        },
        watch: {
            visible(val) {
                !val? this.getList() : null;
            }
        }
    }
</script>

<style scoped lang="scss">
    .virtual-mall-evaluate {
        img {
            width: 60px;
            height: auto;
        }
        .videoUrl {
            /deep/ .el-upload {
                width: 146px;
                height: 146px;
                line-height: 146px;
                position: relative;
                border: 1px dashed #c0ccda;
                border-radius: 6px;
                i{
                    font-size: 28px;
                    color: #8c939d;
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
            video{
                width: 100%;
                height: 100%;
            }
            .circly-progress{
                position: absolute;
                left: 0;
                top: 0;
                background: #fff;
                width: 100%;
                height: 100%;
                display: flex;
                z-index: 666;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
