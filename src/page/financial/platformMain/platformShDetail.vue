<template>
    <div class="platform-sh-detail xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="城市：">
                            <province-cascader style="width:100%" v-model="searchForm.areaCode" :size="$size"></province-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderId" :size="$size" placeholder="请输入订单"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户ID：">
                            <el-input v-model="searchForm.id" :size="$size" placeholder="请输入用户ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联盟商ID：">
                            <el-input v-model="searchForm.merchantId" :size="$size" placeholder="请输入联盟商ID"></el-input>
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
                    <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="所属城市">
                    <template slot-scope="scope">
                        {{ getPorvinceInfo(scope.row.areaCode) }}
                    </template>
                </el-table-column>
                <el-table-column label="订单号" prop="orderId"></el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.createAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户ID" prop="userId"></el-table-column>
                <el-table-column label="用户账号" prop="userPhone"></el-table-column>
                <el-table-column label="收款联盟商ID" prop="merchantId"></el-table-column>
                <el-table-column label="交易类型" :formatter="formatTrade"></el-table-column>
                <el-table-column label="实付金额">
                    <template slot-scope="scope">
                        {{ $math.divide($math.add(scope.row.payAmount, scope.row.voucher, scope.row.shopVoucher), 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" :formatter="formatStatus"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformShDetailInfo'" :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import {getPorvinceInfo,enumFormatter} from '@/util/publicMehotds.js';
    import  { EnumBusinessType, EnumBusinessOrderStatus } from '@/util/publicParams.js';
    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                getPorvinceInfo,
                labelWidth: '150px',
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                loadingSearch: false,
                loadingTable: false,
                searchForm: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialMain.merchantMall
            })
        },
        created() {
            this.searchData
                ? (this.searchForm = this.searchData.searchForm, this.page = this.searchData.page)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setMerchantMall: "financialMain/setMerchantMall"
            }),
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            searchList() {
                this.page.page = 1;
                this.loadingSearch = true;
                this.getList();
            },
            clearCondition() {
                [this.page.page, this.page.limit, this.searchForm] = [1,10,{}];
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                    orderId: this.searchForm.orderId,
                    areaCode: this.searchForm.areaCode? this.searchForm.areaCode[this.searchForm.areaCode.length-1]: '',
                    merchantId: this.searchForm.merchantId,
                    id: this.searchForm.id
                }
                this.loadingTable = true;
                this.$http.get(this.$api.userShopOrderQPage, params, true).then(res=>{
                    this.setMerchantMall(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            getDetail(row) {
                this.$router.push({
                    path: '/buinessMallDetail',
                    query: {
                        orderId: row.orderId
                    }
                })
            },
            formatTrade(row) {
                return enumFormatter(row.sceneStatus, EnumBusinessType, {key: 'key', value: 'label'});
            },
            formatStatus(row) {
                return enumFormatter(row.orderStatus, EnumBusinessOrderStatus, {key: 'key', value: 'label'})
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-sh-detail {
        
    }
</style>
