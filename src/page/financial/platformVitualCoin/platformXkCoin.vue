<template>
    <div class="platform-xk-coin xk-container">
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
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.billId" :size="$size" placeholder="请输入流水账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型：">
                            <el-select v-model="searchForm.billType" :size="$size" placeholder="请选择业务类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="收入" value="fi"></el-option>
                                <el-option label="支出" value="fo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.orderNo" :size="$size" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地区：">
                            <province-cascader all v-model="searchForm.code"></province-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户类型：">
                            <el-select v-model="searchForm.userType" :size="$size">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="普通用户" value="user"></el-option>
                                <el-option label="商户" value="muser"></el-option>
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
                    <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="billId"></el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.userType=='user'? '普通用户': '商户' }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户ID">
                    <template slot-scope="scope">
                        {{ scope.row.userType==='user'? scope.row.userId: scope.row.merchantId }}
                    </template>
                </el-table-column>
                <el-table-column label="交易类型">
                    <template slot-scope="scope">
                        {{ getSource(scope.row.source) }}
                    </template>
                </el-table-column>
                <el-table-column label="交易金额">
                    <template slot-scope="scope">
                        {{ scope.row.newAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="业务类型">
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
                        <el-button v-permission="'platformXkCoinInfo'" :size="$size" type="text" @click="handleDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="margintop20">平台总计：{{ balance? balance: 0 }}元</div>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 晓可币详情 -->
        
    </div>
</template>

<script>
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { getPorvinceInfo,enumFormatter } from '@/util/publicMehotds.js';
    import { XkbSources } from "@/util/publicParams";
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
                balance: 0
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialCurrency.xkb
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
                setXbk: "financialCurrency/setXbk"
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
                    currency: 'xkb',
                    limit: this.page.limit,
                    page: this.page.page,
                    code: this.searchForm.code? this.searchForm.code[this.searchForm.code.length-1]: '',
                    orderNo: this.searchForm.orderNo,
                    billId: this.searchForm.billId,
                    userType: this.searchForm.userType,
                    billType: this.searchForm.billType,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                }
                this.loadingTable = true;
                this.$http.get(this.$api.platformAccBillQPage, params, true).then(res=>{
                    this.setXbk(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res? res.pageable.data: [];
                    this.page.total = res? res.pageable.total: 0;
                    this.balance = res.newBalance
                    
                    console.log(res)
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            getSource(val) { // 交易类型 / 来源
                return enumFormatter(val, XkbSources, {key: 'key', value: 'label'})
            },
            handleDetail(val) {
                switch(val.source) {
                    case 'platform_charge':
                        this.$router.push({path: '/orderShopDetail', query: {type: 'xkb', id: val.billId, source: val.source}});
                        break;
                    case 'shop_charge':
                        this.$router.push({path: '/orderShopDetail', query: {type: 'xkb', id: val.billId, source: val.source}});
                        break;
                    case 'winning_red_packets':
                        this.$router.push({path: '/orderRedDetail', query: {type: 'xkb', id: val.billId, source: val.source}});
                        break;
                    case 'giving_red_packets':
                        this.$router.push({path: '/orderRedDetail', query: {type: 'xkb', id: val.billId, source: val.source}});
                        break;
                    case 'giving_gifts':
                        this.$router.push({path: '/userGiftDetail', query: {type: 'xkb', id: val.billId, source: val.source}});
                        break;
                    case 'game_charge':
                        this.$router.push({path: '/userGameDetail', query: {type: 'xkb', id: val.billId, source: val.source}})
                    default: 
                        this.$message.warning("来源不存在")
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-xk-coin {

    }
</style>
