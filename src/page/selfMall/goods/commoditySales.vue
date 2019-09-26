<template>
    <div class="xk-container">
        <!--内容-->
        <div class="xk-body commodity-sales">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">搜索</el-button>
                        <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="普通商品" name="GOODS"></el-tab-pane>
                    <el-tab-pane label="大宗商品" name="BIG_GOODS"></el-tab-pane>
                </el-tabs>
                <el-form :model="searchForm" label-width="120px" ref="searchForm"
                        class="demo-ruleForm pubBackground xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="商品名称：">
                                <el-input :size="$size" v-model.trim="searchForm.name" placeholder="请输入商品名称"
                                        style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品ID：">
                                <el-input :size="$size" v-model.trim="searchForm.id" style="width: 100%;"
                                        placeholder="请输入商品ID"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="总销量：">
                                <el-col :span="11">
                                    <el-form-item :rules="rules.intNum" prop="minSaleQ">
                                        <el-input v-model.trim="searchForm.minSaleQ" :size="$size" placeholder="最低销量"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="text-align:center">至</el-col>
                                <el-col :span="11">
                                    <el-form-item :rules="rules.intNum" prop="maxSaleQ">
                                        <el-input v-model.trim="searchForm.maxSaleQ" :size="$size" placeholder="最大销量"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品品牌：">
                                <el-input :size="$size" v-model="searchForm.brandName" placeholder="请输入商品品牌"></el-input>
                            </el-form-item>
                        </el-col>
                        
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
                        <el-col :span="8">
                            <el-form-item label="商品供应商：">
                                <el-input :size="$size" v-model="searchForm.supplierName" placeholder="请输入商品供应商"></el-input>
                            </el-form-item>
                        </el-col>
                        <template v-if="activeName=='GOODS'">
                            <el-col :span="8">
                                <el-form-item label="零售价格：">
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="minPrice">
                                            <el-input v-model.trim="searchForm.minPrice" :size="$size" placeholder="最小价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="maxPrice">
                                            <el-input v-model.trim="searchForm.maxPrice" :size="$size" placeholder="最大价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                        </template>
                        <!-- 大宗商品类型 -->
                        <template v-if="activeName=='BIG_GOODS'">
                            <el-col :span="8">
                                <el-form-item label="批发预约金：">
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="minB2bSubscription">
                                            <el-input v-model.trim="searchForm.minB2bSubscription" :size="$size" placeholder="最小价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="maxB2bSubscription">
                                            <el-input v-model.trim="searchForm.maxB2bSubscription" :size="$size" placeholder="最大价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="精选预约金：">
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="minB2cSubscription">
                                            <el-input v-model.trim="searchForm.minB2cSubscription" :size="$size" placeholder="最小价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="maxB2cSubscription">
                                            <el-input v-model.trim="searchForm.maxB2cSubscription" :size="$size" placeholder="最大价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                        </template>
                    </el-row>
                </el-form>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button type="danger" :size="$size" @click="lowerGoods()" :disabled="isLower">批量下架</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                    v-if="tabelFlag"
                    :data="tableData"
                    style="width: 100%"
                    v-loading="tableLoading"
                    @selection-change="selectChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        label="商品ID"
                        prop="id">
                    </el-table-column>
                    <el-table-column
                        label="商品图片"
                        width="120">
                        <template slot-scope="scope">
                            <div class="pic-list">
                                <img :src="scope.row.pic" alt="" @click="$viewImage(scope.row.pic)">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="商品名称"
                        prop="name">
                    </el-table-column>
                    <template v-if="activeName=='BIG_GOODS'">
                        <el-table-column
                            label="批发预约金(元)"
                            width="120">
                            <template slot-scope="scope">
                                {{ $math.divide(scope.row.b2bSubscription, 100) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="精选预约金(元)"
                            width="120">
                            <template slot-scope="scope">
                                {{ $math.divide(scope.row.b2cSubscription, 100) }}
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column
                        label="零售价格(元)"
                        width="120">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.b2cPrice, 100) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="批发价格(元)"
                        width="120">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.b2bPrice, 100) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="总销量"
                        prop="saleQ"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        label="商品分类"
                        prop="categories"
                        :formatter="formatterCat"
                        width="120">
                    </el-table-column>
                    <el-table-column label="商品品牌" width="120px" prop="brandName"></el-table-column>
                    <el-table-column label="商品供应商" width="140px" prop="supplierName"></el-table-column>
                    <el-table-column
                        label="发布时间"
                        prop="updatedAt"
                        width="170">
                        <template slot-scope="scope">
                            {{ scope.row.updatedAt | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="150" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                v-permission="activeName === 'GOODS' ?'commoditySalesEdit' : 'bigGoodsEdit'"
                                :size="$size"
                                @click="lookDetail(scope.row.id)">查看
                            </el-button>
                            <el-button
                                v-permission="activeName === 'GOODS' ? 'commoditySalesDown' : 'bigGoodsDown'"
                                :size="$size"
                                type="primary"
                                @click="lowerGoods(scope.row.id)">下架
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
        <down-goods-tips :visible.sync="tipsVisible" :goodsData="goodsData"></down-goods-tips>
    </div>
</template>
<script>
    const categoriesKey = ['cc_fri', 'cc_sec', 'cc_thr']  //枚举商品分类
    import {getPermission, enumFormatter} from "../../../util/publicMehotds.js";
    import { mapMutations, mapState } from 'vuex'
    import mixins from '@/util/mixins.js';
    import DownGoodsTips from '@/components/goods/DownGoodsTips.vue';
    export default {
        name: "commoditysales",
        mixins: [mixins],
        components: {
            DownGoodsTips
        },
        data() {
            const checkNum = (rule, value, call)=>{
                if(!value || /(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/g.test(value)){
                    call();
                }else{
                    call(new Error('请输入数字或两位小数'));
                }
            }
            const checkIntNum = (rule, value, call) => {
                if(!value || /(^[1-9]\d*$)|(^[0]{1})$/.test(value)) {
                    call();
                }else{
                    call(new Error('请输入正整数或0'))
                }
            }
            return {
                activeName:'GOODS',
                selectGoods: [],               //所选的全部商品些
                searchForm: {},
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
                tableData: [],
                isLower: true,
                getPermission,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                rules: {
                    num: [
                        { validator: checkNum, trigger: 'blur'}
                    ],
                    intNum: [
                        { validator: checkIntNum, trigger: 'blur'}
                    ]
                },
                goodsCategroy: [],
                searchLoading: false,
                tableLoading: false,
                tabelFlag: true,
                tipsVisible: false,
                goodsData: []
            }
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm, this.activeName=this.searchData.activeName)
                : null;
            this.getGoodsList();
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallGoods.searchCommodityCondition
            })
        },
        methods: {
            ...mapMutations({
                setSearchCommodityCondition: "selfMallGoods/setSearchCommodityCondition"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getGoodsList();
            },
            //根据调价搜索
            search() {
                this.page.page = 1;
                this.$refs['searchForm'].validate(v=>{
                    if(v){
                        this.searchLoading = true;
                        this.getGoodsList();
                    }else{
                        return false;
                    }
                })
                
            },
            //清空搜索条件
            clearInput() {
                this.searchForm = {};
                this.$refs['ruleForm']? this.$refs['ruleForm'].resetFields():"";
                this.setSearchCommodityCondition(null);
                this.page.page = 1;
                this.getGoodsList();
            },
            //编辑
            handleEdit(index, id) {
                this.$confirm('销售中的商品需要该商品下架，才可以进行编辑, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$api.unshelveGoods, {
                        ids: [id]
                    }, true).then(res=> {
                        this.$router.push({
                            path: 'goodsInfo',
                            query: {
                                id: id
                            }
                        })
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //所选全部的商品
            selectChange(val) {
                this.selectGoods = val;
                val.length===0
                    ? this.isLower = true
                    : this.isLower = false
            },
            //获取商品列表
            getGoodsList() {
                this.tableLoading = true;
                let params = {
                    condition: {
                        goodsDivide: this.activeName,
                        id: this.searchForm.id|| "",
                        name: this.searchForm.name|| '',
                        category: this.searchForm.category&&this.searchForm.category[this.searchForm.category.length-1]!=='000000'?this.searchForm.category[this.searchForm.category.length-1]: '',
                        minPrice: this.$math.multip(this.searchForm.minPrice, 100)|| '',
                        maxPrice: this.$math.multip(this.searchForm.maxPrice, 100)|| '',
                        minSaleQ: this.searchForm.minSaleQ|| '',
                        maxSaleQ: this.searchForm.maxSaleQ|| '',
                        brandName: this.searchForm.brandName || '',
                        supplierName: this.searchForm.supplierName || null,
                        minB2bSubscription: this.$math.multip(this.searchForm.minB2bSubscription, 100)|| '',
                        maxB2bSubscription: this.$math.multip(this.searchForm.maxB2bSubscription, 100)|| '',
                        minB2cSubscription: this.$math.multip(this.searchForm.minB2cSubscription, 100)|| '',
                        maxB2cSubscription: this.$math.multip(this.searchForm.maxB2cSubscription, 100)|| ''
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                console.log('params',params)
                this.$http.get(this.$api.goodsOnSaleQPage, params, true).then(res => {
                    console.log(res)
                    this.searchLoading = false;
                    this.tableLoading = false;
                    this.setSearchCommodityCondition(Object.assign({searchForm: this.searchForm}, {page: this.page}, {activeName: this.activeName}));
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                }).catch(err=> {
                    [this.tableData, this.page.total, this.searchLoading, this.tableLoading] = [[], 0, false, false];
                    this.$message.error(err.message)
                })
            },
            handleCategory(value) {
                let obj = {}
                for(let i=0,len = value.length; i < len; i++) {
                    obj[categoriesKey[i]] = value[i]
                }
                return obj;
            },
            lowerGoods(id) {
                this.$confirm('确定对该商品下架，商品下架后，需要重新上架该商品？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loadingTable = true;
                    let params = {
                        ids: []
                    };
                    id ? params.ids.push(id)
                    : this.selectGoods.forEach((obj, index, arr) => {
                        params.ids[index] = obj.id
                    })
                    this.$http.post(this.$api.unshelveGoods, params, true).then(res => {
                        console.log(res)
                        if(res.success) {
                            this.getGoodsList();
                        }else{
                            this.goodsData = res.data;
                            this.tipsVisible = true;
                        }
                        this.loadingTable = false;
                    })
                })
            },
            //获取所有分类
            getQueryList() {
                this.$http.get(this.$api.queryList, {}, true).then(res=> {
                    this.goodsCategroy = this.flatten(res);
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
            formatterCat(row) {
                let code = row.categories.cc_thr?row.categories.cc_thr:row.categories.cc_sec?row.categories.cc_sec:row.categories.cc_fri;
                return enumFormatter(code, this.goodsCategroy, {key: 'code', value: 'name'})
            },
            lookDetail(id) {
                this.$router.push({
                    path: 'goodsDetailInfo',
                    query: {
                        id: id
                    }
                })
            }
        },
        watch: {
            options(val, old) {
                this.goodsCategroy = this.flatten(val);
            },
            activeName(val) {
                this.tabelFlag = false;
                this.$nextTick(()=>{
                    this.tabelFlag = true;
                })
                this.clearInput();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './commoditySales.scss';
</style>
