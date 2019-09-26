<template>
    <div class="xk-container">
        <!--内容-->
        <div class="xk-body xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                    <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="普通商品" name="GOODS"></el-tab-pane>
                <el-tab-pane label="大宗商品" name="BIG_GOODS"></el-tab-pane>
            </el-tabs>
            <el-form :model="ruleForm" label-width="120px" ref="ruleForm"
                     class="demo-ruleForm pubBackground xk-search">
                <!--第一排-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input :size="$size" v-model.trim="ruleForm.name" placeholder="请输入商品名称" style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input :size="$size" v-model.trim="ruleForm.goodsID" style="width: 100%;" placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总销量：">
                            <el-col :span="11">
                                <el-form-item prop="minSaleQ" :rules="rules.num">
                                    <el-input :size="$size" placeholder="0" v-model="ruleForm.minSaleQ"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align:center">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="maxSaleQ" :rules="rules.num">
                                    <el-input :size="$size" placeholder="0" v-model="ruleForm.maxSaleQ"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品品牌：">
                            <el-input :size="$size" v-model="ruleForm.brandName" placeholder="请输入商品品牌"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-cascader
                                v-model="ruleForm.category"
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
                            <el-input :size="$size" v-model="ruleForm.supplierName" placeholder="请输入商品供应商"></el-input>
                        </el-form-item>
                    </el-col>

                    <template v-if="activeName=='GOODS'">
                            <el-col :span="8">
                                <el-form-item label="零售价格：">
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="minPrice">
                                            <el-input v-model.trim="ruleForm.minPrice" :size="$size" placeholder="最小价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="maxPrice">
                                            <el-input v-model.trim="ruleForm.maxPrice" :size="$size" placeholder="最大价"></el-input>
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
                                            <el-input v-model.trim="ruleForm.minB2bSubscription" :size="$size" placeholder="最小价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="maxB2bSubscription">
                                            <el-input v-model.trim="ruleForm.maxB2bSubscription" :size="$size" placeholder="最大价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="精选预约金：">
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="minB2cSubscription">
                                            <el-input v-model.trim="ruleForm.minB2cSubscription" :size="$size" placeholder="最小价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item :rules="rules.num" prop="maxB2cSubscription">
                                            <el-input v-model.trim="ruleForm.maxB2cSubscription" :size="$size" placeholder="最大价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                        </template>
                </el-row>
            </el-form>
        </div>
        <div class="marintop20 xk-radius">
            <!--表格数据-->
            <div class="pubBackground solidtop lower-goods">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" v-permission="'lowerGoodsUp'" :size="$size" @click="addedGoods()" :disabled="isUpload">批量上架</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                    v-loading="tableLoading"
                    :data="tableData"
                    tooltip-effect="dark"
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
                            <div class="picList">
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
                                v-permission="activeName ==='GOODS' ? 'lowerGoodsEdit' : 'lowerBigGoodsEdit'"
                                :size="$size"
                                @click="handleEdit(scope.$index, scope.row.id)">编辑
                            </el-button>
                            <el-button
                                v-permission="activeName === 'GOODS' ? 'lowerGoodsUp' : 'lowerBigGoodsUp'"
                                :size="$size"
                                type="primary"
                                @click="addedGoods(scope.row.id)">上架
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--上架提示-->
                <el-dialog title="温馨提示" :visible.sync="onlineVisible" width="30%" top="30px">
                    <span>是否对商品重新上架，商品需要重新发布才可以上架</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="onlineVisible = false">取 消</el-button>
                        <el-button type="primary" @click="Release">发布</el-button>
                    </span>
                </el-dialog>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
    </div>
</template>

<script>
    const categoriesKey = ['cc_fri', 'cc_sec', 'cc_thr']  //枚举商品分类
    import {getPermission, enumFormatter} from "../../../util/publicMehotds.js";
    import { mapMutations, mapState } from 'vuex'
    import mixins from '@/util/mixins.js'

    export default {
        name: "lowergoods",
        mixins: [mixins],
        data() {
            const checkNum = (rule, value, call)=>{
                if(!value || /^-{0,1}\d*[\.]{0,1}[0-9]{1}\d*$/g.test(value)){
                    call();
                }else{
                    call(new Error('请输入数字或小数'));
                }
            }
            return {
                activeName: 'GOODS',
                onlineVisible:false,
                dialogFormVisible: false,    //表单弹框
                listValue: {},                //表格行数据
                selectGoods:[],               //所选的全部商品些
                ruleForm: {},
                upPermission: getPermission("goodsAdded"),
                editPermission: getPermission("goodsUpdate"),
                tableData: [],
                isUpload: true,
                loadingTable: false,
                options: [{
                    code: '000000',
                    name: '全部'
                }],
                rules: {
                    num: [
                        { validator: checkNum, trigger: 'blur'}
                    ]
                },
                props: {
                    value: 'code',
                    label: 'name'
                },
                page: {
                    page: 1,
                    total: 0,
                    limit: 10
                },
                goodsCategroy:[],
                searchLoading: false,
                tableLoading: false
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallGoods.searchLowerCondition
            })
        },
        created() {
            this.searchData
                ? (this.ruleForm = this.searchData.ruleForm, this.page = this.searchData.page, this.activeName = this.searchData.activeName)
                : null;
        },
        mounted(){
            this.getGoodsList()
        },
        methods: {
            ...mapMutations({
                setSearchLowerCondition: "selfMallGoods/setSearchLowerCondition"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getGoodsList();
            },
            //编辑表格行内容
            handleEdit(index, id) {
                this.$router.push({
                    path: 'goodsInfo',
                    query: {
                        id: id
                    }
                })
            },
            //上架商品提示
            online(index, row){
                this.listValue = row;
                this.onlineVisible=true
            },
            //确认发布商品
            Release(){
                this.onlineVisible=false;
            },
            //所选全部的商品
            selectChange(val) {
                this.selectGoods = val;
                val.length===0
                    ? this.isUpload = true
                    : this.isUpload = false
            },
            //删除所有选中项
            deleteGoods(){
                this.$confirm('此操作将永久删除该数据, 是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    });
                }).catch(() => {
                });
            },
            search() {
                this.page.page = 1;
                this.$refs['ruleForm'].validate(v=>{
                    if(v){
                        this.searchLoading = true;
                        this.getGoodsList();
                    }else{
                        return false;
                    }
                })
            },
            clearInput() {
                this.ruleForm = {};
                this.$refs['ruleForm'].resetFields();
                this.getGoodsList();
            },
            //获取商品列表
            getGoodsList() {
                this.tableLoading = true;
                let params = {
                    condition: {
                        goodsDivide: this.activeName,
                        id: this.ruleForm.goodsID?this.ruleForm.goodsID:'',
                        name: this.ruleForm.name?this.ruleForm.name:"",
                        category: this.ruleForm.category? this.ruleForm.category[this.ruleForm.category.length-1]: '',
                        minPrice: this.ruleForm.minPrice? this.$math.multip(this.ruleForm.minPrice, 100):"",
                        maxPrice: this.ruleForm.maxPrice? this.$math.multip(this.ruleForm.maxPrice, 100):"",
                        minSaleQ: this.ruleForm.minSaleQ?this.ruleForm.minSaleQ:"",
                        maxSaleQ: this.ruleForm.maxSaleQ?this.ruleForm.maxSaleQ:"",
                        brandName: this.ruleForm.brandName ? this.ruleForm.brandName : '',
                        supplierName: this.ruleForm.supplierName ? this.ruleForm.supplierName : null,
                        minB2bSubscription: this.$math.multip(this.ruleForm.minB2bSubscription, 100)|| '',
                        maxB2bSubscription: this.$math.multip(this.ruleForm.maxB2bSubscription, 100)|| '',
                        minB2cSubscription: this.$math.multip(this.ruleForm.minB2cSubscription, 100)|| '',
                        maxB2cSubscription: this.$math.multip(this.ruleForm.maxB2cSubscription, 100)|| ''
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                console.log(JSON.stringify(params))
                this.$http.get(this.$api.goodsUnshelveQPage, params, true).then(res => {
                    console.log(res)
                    this.searchLoading = false;
                    this.tableLoading = false;
                    this.setSearchLowerCondition(Object.assign({ruleForm: this.ruleForm}, {page: this.page}, {activeName: this.activeName}));
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                }).catch(err => {
                    [this.tableData, this.page.total, this.searchLoading, this.tableLoading] = [0, 0, false, false];
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
            //批量上架
            addedGoods(id) {
                this.$confirm('是否对商品重新上架，商品需要重新发布才可以上架？', '温馨提示', {
                    confirmButtonText: '发布',
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
                    this.$http.post(this.$api.goodsAdded, params, true).then(res => {
                        if(res) {
                            this.getGoodsList();
                            this.$message({
                                showClose: true,
                                message: '上架成功',
                                type: 'success'
                            });
                        }
                        this.loadingTable = false;
                    }).catch(err => {
                        this.$message.error(err.message)
                    })
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
                this.arr = [];
                let code = row.categories.cc_thr?row.categories.cc_thr:row.categories.cc_sec?row.categories.cc_sec:row.categories.cc_fri;

                return enumFormatter(code, this.goodsCategroy, {key: 'code', value: 'name'});
            }
        },
        watch: {
            options(val, old) {
                this.goodsCategroy = this.flatten(val);
            },
            activeName(val) {
                this.clearInput();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './lowerGoods.scss';
</style>

