<template>
    <div class="virtual-sh-evaluate xk-container">
        <div class="xk-radius xk-search">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button :size="$size" type="primary" @click="clear()">清空</el-button>
                    <el-button :size="$size" :loading="loadingSearch" type="primary" @click="search()">查询</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="150px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input :size="$size" v-model.trim="searchForm.name" placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input :size="$size" v-model="searchForm.id" placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-select :size="$size" v-model="searchForm.category">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺名称：">
                            <el-select :size="$size" filterable remote  v-model="searchForm.shopId" :remote-method="getShops">
                                <el-option v-for="(item,index) in goodsNames" :key="index" :label="item.shopName" :value="item.id"></el-option>
                            </el-select>
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
                    <el-button :disabled="selectData.length? false: true" :size="$size" type="success" @click="openDia()" v-permission="'virtualShEvaluateAdd'">批量添加</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table v-loading="tableLoading" :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="店铺名称" prop="shopName"></el-table-column>
                <el-table-column label="商品分类">
                    <template slot-scope="scope">
                        {{ scope.row | formatterCat }}
                    </template>
                </el-table-column>
                <el-table-column label="商品ID" prop="id"></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.mainPic" @click="$viewImage(scope.row.mainPic)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column label="真实评价数量" prop="evaluateNum1"></el-table-column>
                <el-table-column label="虚假评论数量" prop="evaluateNum2"></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button :size='$size' type="primary" @click="openDia(scope.row)" v-permission="'virtualShEvaluateAdd'">添加评价</el-button>
                        <el-button :size='$size' type="primary" @click="goToDetail(scope.row)" v-permission="'virtualShEvaluateDetail'">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 新增评价详情 -->
        <virtual-evaluate :goodsIds="goodsIds" :visible.sync="visible" :shopId="shopId" type="shop" :goods="goods"></virtual-evaluate>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { enumFormatter } from "../../../util/publicMehotds.js";
    import VirtualEvaluate from '@/components/goods/VirtualEvaluate.vue';
    let options = [];
    export default {
        components: {
            VirtualEvaluate
        },
        data() {
            return {
                tableData: [],
                tableLoading: false,
                loadingSearch: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                options: [],
                searchForm: {},
                shopId: "",
                goodsIds: null,
                visible: false,
                selectData: [],
                goods: null,
                goodsNames: []
            }
        },
        async created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.options = await this.getService();
            options = this.options;
            this.getList();
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallGoods.shEvaluate
            })
        },
        methods: {
            ...mapMutations({
                setShEvaluate: "selfMallGoods/setShEvaluate"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            //获取店铺
            getShops(val) {
                if(val&&val.trim()) {
                    this.$http.get(this.$api.virtualShopQPage, {
                        shopName: val,
                        limit: "999999",
                        page: "1"
                    }, true)
                    .then(res=>{
                        this.goodsNames = res? res.data: [];
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }else{
                    this.goodsNames = [];
                }
            },
            //获取服务分类
            getService() {
                return new Promise((resolve, reject) => {
                    this.$http.get(this.$api.serviceCatalogList, {}, true)
                    .then(res=>{
                        resolve(res);
                    })
                    .catch(err=>{
                        reject(err);
                        this.$message.error(err.message);
                    })
                })
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            handleSelectionChange(val) {
                this.selectData = val;
            },
            clear() {
                this.page.page=1;
                this.page.limit=10;
                this.searchForm={};
                this.setShEvaluate(null);
                this.getList();
            },
            search() {
                this.page.page = 1;
                this.loadingSearch = true;
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    name: this.searchForm.name,
                    id: this.searchForm.id,
                    category: this.searchForm.category,
                    shopId: this.searchForm.shopId
                }
                this.tableLoading= true;
                this.$http.get(this.$api.goodsQPageInBCircle, params, true)
                .then(res=>{
                    this.setShEvaluate(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableLoading= false;
                    this.loadingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.tableLoading= false;
                    this.loadingSearch = false;
                    this.$message.error(err.message);
                })
            },
            openDia(row) {
                if(row) {
                    this.goods = [{
                        shopId: row.shopId,
                        goodsId: row.id
                    }]
                    this.shopId = [row.shopId]
                }else{
                    this.goods = this.selectData.map(item=>{
                        return {
                            shopId: item.shopId,
                            goodsId: item.id
                        }
                    })
                }
                this.visible = true;
            },
            goToDetail(row) {
                this.$router.push({
                    path: 'virtualShEvaluateDetail',
                    query: {
                        goodsId: row.id,
                        shopId: row.shopId
                    }
                })
            }
        },
        filters: {
            formatterCat(row) {
                if(row) {
                    return enumFormatter(row.category.goodsTypeId, options, {
                        key: 'code',
                        value: 'name'
                    })
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
    .virtual-sh-evaluate {
        img{
            width: 60px;
            height: auto;
        }
    }
</style>
