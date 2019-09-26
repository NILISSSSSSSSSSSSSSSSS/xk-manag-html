<template>
    <div class="xk-container shop-discount-ticket">
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
                                    <el-date-picker type="daterange" :size="$size" v-model="searchForm.rangeTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效状态：">
                                    <el-select :size="$size" v-model="searchForm.cardConditionStatus">
                                        <el-option v-for="item in EnumCouponTypeList" :key="item.key" :value="item.key" :label="item.value"></el-option>
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
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable">
                    <el-table-column label="优惠券ID" prop="id" width="220px"></el-table-column>
                    <el-table-column label="优惠券名称" prop="name" width="100px"></el-table-column>
                    <el-table-column label="所属店铺" prop="storeName" width="100px"></el-table-column>
                    <el-table-column label="类型" width="120px">
                        <template slot-scope="scope">
                            {{ scope.row.couponType | formatEnumTicket }}
                        </template>
                    </el-table-column>
                    <el-table-column label="范围" width="120px">
                        <template slot-scope="scope">
                            {{ scope.row.scope | formatEnumScope }}
                        </template>
                    </el-table-column>
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
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.couponStatus |  formatEnumType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180px">
                        <template slot-scope="scope">
                            <el-button v-permission="'shopDiscountTicketDetail'" :size="$size" type="primary" :loading="scope.row.loading" @click="viewDetail(scope.row.id, scope.row)">查看</el-button>
                            <el-button v-permission="'shopDiscountTicketAbandon'" :size="$size" type="danger" :disabled="scope.row.couponStatus==='STOP'" @click="abandon(scope.row.id)">{{ scope.row.couponStatus==='STOP'?"已作废":"作废" }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>

        <!-- 优惠券信息 -->
        <discount-ticket-detail :visible.sync="dialogDetailVisible" :detailForm="detailForm" trade></discount-ticket-detail>
    </div>
</template>

<script>
    import { EnumCouponTypeList,EnumCouponType } from '@/util/publicParams.js'
    //枚举品类范围
    const EnumScope = [{key: "ALL", value:"全场"},{key: "GOODS", value:"单品"},{key: "CATEGORY", value:"品类"}]
    //枚举优惠券类型
    const EnumTicket = [{key: "All", value:"全部"}, {key: "DISCOUNT", value:"打折券"}, {key: "DEDUCTION", value: "抵扣券"}, {key: "FULL_SUB", value: "满减券"}]

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
                searchForm: {},
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                dialogDetailVisible: false,
                searchLoading: false,
                loadingTable: false,
                detailForm: {}
            }
        },
        created() {
            this.getCat();
            this.getList()
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            getList() {
                let { rangeTime, ...condition } = this.searchForm;
                let params = {
                    condition,
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.dialogDetailVisible = false;
                this.loadingTable = true;
                
                rangeTime
                    ? [params.condition.validTime, params.condition.invalidTime] = [moment(rangeTime[0]).format('X'), moment(rangeTime[1]).format("X")]
                    : null;

                this.$http.get(this.$api.shopCardCouponQPage, params, true).then(res=> {
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.loadingTable = false;
                    this.searchLoading = false
                })
                .catch(err=> {
                    this.$message.error(err.message);
                    [this.loadingTable, this.searchLoading, this.tableData, this.page.total] = [false, false, [], 0];
                })
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList()
            },
            clearInput() {
                this.searchForm = {}
                this.getList();
            },
            //获取店铺分类
            getCat() {
                this.$http.get(this.$api.industryAllQList, {}, true).then(res=>{
                    let arr = [];
                    arr.concat(res.oneLevel);
                    arr.concat(res.twoLevel);
                    this.transformCat(arr);
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //生成map对象
            transformCat(arr) {
                for(let i=0, len = arr.length; i< len; i++) {
                    let obj = {
                        name: arr[i].name
                    }
                    catMap.set(arr[i].code, obj);
                }
            },
            //转换分类code为中文名称
            transformCode(res) {
                for(let i=0,len = res.goods.length; i< len; i++) {
                    res.goods[i].Categories = {
                        cc_fri: res.goods[i].name1 ? res.goods[i].name1.name: '无',
                        cc_sec: res.goods[i].name2 ? res.goods[i].name2: '无'
                    }
                    res.goods[i].sGoodsName = res.goods[i].bcleGoodsName;
                    res.goods[i].sGoodsId = res.goods[i].code;
                    res.goods[i].couponName = res.name;
                    res.goods[i].couponId = res.id
                }
                return res;
            },
            //查看
            viewDetail(id, row) {
                console.log(id)
                this.$set(row, 'loading', true)
                this.$http.get(this.$api.shopCouponDetail, {id: id}, true).then(res=> {
                    this.transformCode(res);
                    console.log(res)
                    this.detailForm = res;
                    this.$set(row, 'loading', false);
                    this.dialogDetailVisible = true;
                })
                .catch(err=> {
                    this.$message.error(err.message);
                    this.$set(row, 'loading', false);
                })
            },
            //作废
            abandon(id) {
                this.$confirm('是否作废当前优惠券','提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(()=>{
                    this.$http.post(this.$api.shopCouponDelete, {id: id}, true).then(res=>{
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
        },
        filters: {
            formatEnumScope(val) {
                return enumFormatter(val, EnumScope)
            },
            formatEnumType(val) {
                return enumFormatter(val, EnumCouponTypeList);
            },
            formatEnumTicket(val) {
                return enumFormatter(val, EnumCouponType, {value: 'label'});
            }
        }
    }
</script>
<style scoped lang="scss">
    @import './shopDiscountTicket.scss';
</style>
