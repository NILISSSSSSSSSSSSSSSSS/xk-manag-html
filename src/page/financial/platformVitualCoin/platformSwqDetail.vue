<template>
    <div class="platform-swq-detail xk-container">
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
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNo" :size="$size" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地区：">
                            <province-cascader v-model="searchForm.code"></province-cascader>
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
                <el-table-column label="订单号" prop="orderNo"></el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商ID" prop="merchantId"></el-table-column>
                <el-table-column label="联盟商名称" prop="merchantName"></el-table-column>
                <el-table-column label="实物券金额">
                    <template slot-scope="scope">
                        {{ scope.row.newAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="业务类型" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.billType==='fi'? '收入': scope.row.billType==='fo'? '支出': scope.row.billType }}
                    </template>
                </el-table-column>
                <el-table-column label="地区">
                    <template slot-scope="scope">
                        {{ getPorvinceInfo(scope.row.code) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformSwqDetailInfo'" :size="$size" type="text" @click="openDialog(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="margintop20">平台总计：{{ balance? balance: 0 }}元</div>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="选择订单" :visible.sync="selectDialog" width="500px">
            <template v-if="orderDetail.orderNoList">
                <el-row v-for="item of orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
                    <el-col :span="18">订单号：{{item}}</el-col>
                    <el-col :span="6" style="text-align: center">
                        <el-button :size="$size" type="text" @click="goToDetail(item)" >查看详情</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    import { mapMutations, mapState } from 'vuex';
    import moment from 'moment';
    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                getPorvinceInfo,
                labelWidth: '150px',
                loadingSearch: false,
                loadingTable: false,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                balance: 0,
                selectDialog: false,
                orderDetail: {
                    orderNoList: []
                }, // 当前订单的详情
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialCurrency.swq
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
                setSwq: "financialCurrency/setSwq"
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
                    currency: 'swq',
                    page: this.page.page,
                    limit: this.page.limit,
                    code: this.searchForm.code? this.searchForm.code[this.searchForm.code.length-1]: '',
                    orderNo: this.searchForm.orderNo,
                    merchantId: this.searchForm.merchantId,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                }
                this.loadingTable = true;
                this.$http.get(this.$api.platformAccBillQPage, params, true).then(res=>{
                    this.setSwq(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res? res.pageable.data: [];
                    console.log(this.tableData)
                    this.page.total = res? res.pageable.total: 0;
                    this.balance = res.newBalance;
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            openDialog(row) { // 订单列表弹框
                this.orderDetail = row;
                console.log(row)
                this.selectDialog = true;
            },
            goToDetail(orderId) {
                this.$router.push({path: '/orderSelfMallDetail', query: {id: orderId}})
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-swq-detail {

    }
</style>
