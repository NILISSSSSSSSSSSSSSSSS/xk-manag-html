<template>
    <div class="xk-container mall-discount-ticket">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="优惠券ID：">
                                    <el-input :size="$size" v-model="searchForm.id" placeholder="请输入优惠券ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="优惠券名称：">
                                    <el-input :size="$size" v-model="searchForm.name" placeholder="请输入优惠券名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="优惠券类型：">
                                    <el-select :size="$size" v-model="searchForm.couponType">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="item in EnumCouponType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="时间：">
                                    <el-date-picker type="daterange" :size="$size" v-model="searchForm.rangeTime" range-separator="至" start-placeholder="生效时间" end-placeholder="结束时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效状态：">
                                    <el-select :size="$size" v-model="searchForm.cardConditionStatus">
                                        <el-option v-for="item in EnumCouponTypeList" :key="item.key" :value="item.key" :label="item.value">{{ item.value }}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="优惠券范围：">
                                    <el-select :size="$size" v-model="searchForm.couponScope">
                                        <el-option v-for="item in EnumScope" :key="item.key" :value="item.key" :label="item.value">{{ item.value }}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                    </el-form>
                </div>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="'mallDiscountTicketAdd'" type="primary" size="small" @click="add('addTicketForm')">新增</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable">
                    <el-table-column label="优惠券ID" prop="id" width="220px"></el-table-column>
                    <el-table-column label="优惠券名称" prop="name" width="160px"></el-table-column>
                    <el-table-column label="类型" prop="couponType" :formatter="formatterCouponType" width="120px"></el-table-column>
                    <el-table-column label="范围" prop="scope" :formatter="formatterScope" width="60px"></el-table-column>
                    <el-table-column label="生效时间" width="200px">
                        <template slot-scope="scope">
                            {{ scope.row.validTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" width="200px">
                        <template slot-scope="scope">
                            {{ scope.row.invalidTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="总量" prop="totalNum" width="150px"></el-table-column>
                    <el-table-column label="已领" prop="num"></el-table-column>
                    <el-table-column label="状态" prop="couponStatus" :formatter="formatterStatus"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="260px">
                        <template slot-scope="scope">
                            <el-button v-permission="'mallDiscountTicketDetail'" :size="$size" type="primary" :loading="scope.row.loading" @click="viewDetail(scope.row.id, scope.row)">查看</el-button>
                            <el-button v-permission="'mallDiscountTicketAbandon'" :size="$size" type="danger" :disabled="scope.row.couponStatus==='STOP'" @click="abandon(scope.row.id)">{{ scope.row.couponStatus==='STOP'? '已作废': '作废'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
        <!-- 优惠券信息 -->
        <discount-ticket-detail :visible.sync="dialogDetailVisible" :detailForm="detailForm"></discount-ticket-detail>
    </div>
</template>

<script>
    import { EnumCouponTypeList,EnumCouponType } from '@/util/publicParams.js'
    //枚举品类范围
    const EnumScope = [{key: "ALL", value:"全场"},{key: "GOODS", value:"单品"},{key: "CATEGORY", value:"品类"}]

    import DiscountTicketDetail from "@/components/operate/DiscountTicketDetail.vue";
    import  { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment';

    let catMap = new Map();
    export default {
        components: {
            DiscountTicketDetail
        },
        data() {
            return {
                EnumScope,
                EnumCouponTypeList,
                EnumCouponType,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                loadingTable: false,
                searchLoading: false,
                dialogVisible: false,
                dialogDetailVisible: false,
                detailForm: {},
                catArr: []
            }
        },
        created() {
            this.getCat();
            this.getList();
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            formatterStatus(row) {
                return enumFormatter(row.couponStatus, EnumCouponTypeList);
            },
            formatterCouponType(row) {
                return enumFormatter(row.couponType, EnumCouponType, {value: 'label'});
            },
            formatterScope(row) {
                return enumFormatter(row.scope, EnumScope);
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList()
            },
            clearInput() {
                this.searchForm = {};
                this.getList();
            },
            //获取分类
            getCat() {
                this.$http.get(this.$api.categoryQueryList, {}, true).then(res=>{
                    this.transformCat(res);
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //生成map对象
            transformCat(arr) {
                for(let i=0, len = arr.length; i< len; i++) {
                    if(arr[i].children instanceof Array) {
                        this.transformCat(arr[i].children);
                    }
                    let obj = {
                        name: arr[i].name
                    }
                    catMap.set(arr[i].code, obj);
                }
            },
            //转换分类code
            transformCode(res) {
                for(let i=0,len = res.goods.length; i< len; i++) {
                    res.goods[i].Categories.cc_fri ?res.goods[i].Categories.cc_fri = catMap.get(res.goods[i].Categories.cc_fri).name: '无';
                    res.goods[i].Categories.cc_sec ?res.goods[i].Categories.cc_sec = catMap.get(res.goods[i].Categories.cc_sec).name: '无';
                    res.goods[i].Categories.cc_thr ?res.goods[i].Categories.cc_thr = catMap.get(res.goods[i].Categories.cc_thr).name: '无';
                }
                return res;
            },
            //获取列表
            getList() {
                let params = {
                    condition: {
                        validTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                        invalidTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                        id: this.searchForm.id,
                        name: this.searchForm.name,
                        couponType: this.searchForm.couponType,
                        cardConditionStatus: this.searchForm.cardConditionStatus,
                        couponScope: this.searchForm.couponScope
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                console.log(JSON.stringify(params))
                this.loadingTable = true;
                this.$http.get(this.$api.cardCouponQPage, params, true).then(res=> {
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.loadingTable = false;
                    this.searchLoading = false;
                })
                .catch(err=> {
                    this.$message.error(err.message)
                    this.loadingTable = false;
                    this.searchLoading = false;
                })
            },
            //新增
            add(formName) {
                this.$router.push("/mallDiscountTicketAdd")
            },
            //查看详情
            viewDetail(id, row) {
                let param = {
                    id: id
                }
                this.$set(row, 'loading', true);
                this.$http.get(this.$api.cardCouponDetail, param, true).then(res=>{
                    console.log(res)
                    if(res.goods && res.goods.length>0) {
                        this.detailForm = this.transformCode(res);
                    }else{
                        this.detailForm = res;
                    }
                    
                    this.dialogDetailVisible = true;
                    this.$set(row, 'loading', false);
                })
                .catch(err=>{
                    this.$set(row, 'loading', false);
                    this.$message.error(err.message)
                })
            },
            //作废
            abandon(id) {
                console.log(id)
                this.$confirm('是否作废当前优惠券','提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(()=>{
                    this.$http.post(this.$api.cardCouponDelete, {id: id}, true).then(res=>{
                        this.$message({
                            message: '作废成功',
                            type: 'success'
                        })
                        this.getList();
                    })
                    .catch(err=>{
                        this.$message.error(err.message)
                    })
                })
                .catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '取消作废'
                    })
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    @import './mallDiscountTicket.scss'
</style>
