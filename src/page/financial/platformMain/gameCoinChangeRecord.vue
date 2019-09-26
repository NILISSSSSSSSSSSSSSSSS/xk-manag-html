<template>
    <div class="game-coin-change-record xk-container">
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
                        <el-form-item label="游戏ID：">
                            <el-input v-model="searchForm.gameId" :size="$size" placeholder="请输入游戏ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户ID：">
                            <el-input v-model="searchForm.userId" :size="$size" placeholder="请输入用户ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="游戏名称：">
                            <el-input v-model="searchForm.gameName" :size="$size" placeholder="请输入游戏名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态：">
                            <el-select v-model="searchForm.exchangeStatus" :size="$size">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in ExchangeStatus" :label="item.label" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="兑换时间：">
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
                <el-table-column label="游戏ID" prop="gameId" show-overflow-tooltip></el-table-column>
                <el-table-column label="游戏名称" prop="gameName"></el-table-column>
                <el-table-column label="用户ID" prop="userId" show-overflow-tooltip></el-table-column>
                <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip></el-table-column>
                <el-table-column label="订单金额">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.channelAmount, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="兑换方式">
                    <template slot-scope="scope">
                        {{ scope.row.payChannel | formatChannel }}
                    </template>
                </el-table-column>
                <el-table-column label="实际支付">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.payAmount, 100) }}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="汇率">
                    <template slot-scope="scope">
                        <div v-if="scope.row.exchangeStatus === 'paying'">
                            暂无比例
                        </div>
                        <div v-else>
                            <span v-if="scope.row.payAmount===0">
                                {{scope.row.channelAmount}} : 0
                            </span>
                            <span v-else-if="scope.row.payAmount%scope.row.payAmount==0">
                                {{ $math.divide(scope.row.channelAmount, scope.row.payAmount) }} ： 1
                            </span>
                            <span v-else>
                                {{scope.row.channelAmount%scope.row.payAmount}} : {{ parseInt($math.divide(scope.row.channelAmount, scope.row.payAmount)) }}
                            </span>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column label="兑换时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="兑换状态" :formatter="formatExchange"></el-table-column>
                <el-table-column label="操作" fixed="right" width="80">
                    <template slot-scope="scope">
                        <el-button v-permission="'gameCoinChangeRecordInfo'" :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import { ExchangeStatus, EnumPayWay } from '@/util/publicParams';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import { mapMutations, mapState } from 'vuex';
    import moment from 'moment';
    export default {
        data() {
            return {
                ExchangeStatus,
                labelWidth: '150px',
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                loadingTable: false,
                loadingSearch: false,
                searchForm: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialMain.gameChange
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
                setGameChange: "financialMain/setGameChange"
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
                    condition: {
                        gameId: this.searchForm.gameId,
                        gameName: this.searchForm.gameName,
                        userId: this.searchForm.userId,
                        startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                        endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                        exchangeStatus: this.searchForm.exchangeStatus
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.loadingTable = true;
                this.$http.get(this.$api.gameOrderQPage, params,true).then(res=>{
                    this.setGameChange(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    [this.loadingTable, this.loadingSearch, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            getDetail(row) {
                this.$router.push({
                    path: '/userGameDetail',
                    query: {
                        id: row.orderNo
                    }
                })
            },
            formatExchange(row) {
                return enumFormatter(row.exchangeStatus, ExchangeStatus, {key: 'key', value: 'label'});
            }
        },
        filters: {
            formatChannel(val) {
                return enumFormatter(val, EnumPayWay);
            }
        }
    }
</script>

<style scoped lang="scss">
    .game-coin-change-record {
        
    }
</style>
