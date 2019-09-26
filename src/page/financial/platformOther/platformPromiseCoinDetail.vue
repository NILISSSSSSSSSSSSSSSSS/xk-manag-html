<template>
    <div class="platform-promise-coin-detail xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="searchLoading" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.orderNo" :size="$size" placeholder="请输入流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联盟商类型：">
                            <el-select v-model="searchForm.merchantType" :size="$size" placeholder="请选择联盟商类型">
                                <el-option value="" label="全部"></el-option>
                                <el-option v-for="(item, index) in EnumMerchantType" :value="item.key" :label="item.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="8">
                        <el-form-item label="交易时间：">
                            <el-date-picker v-model="searchForm.rangeTime" :size="$size" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <!-- <el-button type="success" :size="$size" :loading="loadingSearch">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="orderNo"></el-table-column>
                <el-table-column label="缴纳时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商ID" prop="merchantId"></el-table-column>
                <el-table-column label="联盟商类型">
                    <template slot-scope="scope">
                        {{ scope.row.merchantType | formatMerchant }}
                    </template>
                </el-table-column>
                <el-table-column label="缴纳金额">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.amount, 100) }} 元
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformPromiseCoinDetailInfo'" :size="$size" type="text" @click="openDetail(scope.row.merchantId)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import { EnumMerchantType } from '@/util/publicParams.js';
    import { mapMutations, mapState } from 'vuex';
    export default {
        data() {
            return {
                EnumMerchantType,
                labelWidth: '150px',
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                loadingTable: false,
                searchLoading: false
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialOther.promiseCoin
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setPromiseCoin: "financialOther/setPromiseCoin"
            }),
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    orderNo: this.searchForm.orderNo,
                    merchantType: this.searchForm.merchantType,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): ''
                }
                this.loadingTable = true;
                this.$http.get(this.$api.tradeAppMJDOrderQPage, params, true).then(res=>{
                    this.loadingTable = false;
                    this.searchLoading = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.setPromiseCoin(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                })
                .catch(err=>{
                    this.tableData = [];
                    this.page.total=0;
                    this.loadingTable = false;
                    this.searchLoading = false;
                    this.$message.error('查询失败');
                })
            },
            searchList() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                [this.page.page, this.page.limit, this.searchForm] = [1, 10, {}];
                this.setPromiseCoin(null);
                this.getList();
            },
            openDetail(merchantId) {
                console.log(merchantId)
                this.$router.push({
                    path:'/businessDetail', 
                    query: {
                        id: merchantId
                    }
                })
            }
        },
        filters: {
            formatMerchant(val) {
                if(val) {
                    let result = EnumMerchantType.filter(item=>{
                        return item.key === val;
                    })
                    return result[0]
                            ? result[0].value
                            : val;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-promise-coin-detail {
        
    }
</style>
