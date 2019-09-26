<template>
    <div class="platform-lottery-detail xk-container">
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
                            <el-input v-model="searchForm.id" :size="$size" placeholder="请输入流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型：">
                            <el-select v-model="searchForm.aaLotterySource" :size="$size" placeholder="请选择业务类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumLottery" :key="index" :label="item.value" :value="item.key"></el-option>
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
                <el-table-column label="流水号" prop="id"></el-table-column>
                <el-table-column label="业务时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="用户ID" prop="userId" width="220"></el-table-column>
                <el-table-column label="用户账号" prop="phone"></el-table-column>
                <el-table-column label="用户昵称" prop="userName"></el-table-column>
                <el-table-column label="数量" prop="lotteryNumber"></el-table-column>
                <el-table-column label="业务类型" :formatter="formatType"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformLotteryDetailInfo'"  :size="$size" type="text" @click="openDetail(scope.row.id)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    const EnumLottery = [{ key: 'platform_activity', value: '平台' },{ key: 'merchant_activity', value: '商户' },
    { key: 'jorder_comment', value: '福利晒单' }, { key: 'competition', value: '游戏比赛'}];

    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                searchLoading: false,
                loadingTable: false,
                EnumLottery,
                labelWidth: '150px',
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialMain.platformTicket
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
                setPlatformTicket: "financialMain/setPlatformTicket"
            }),
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            getList() {
                let params = {
                    id: this.searchForm.id,
                    aaLotterySource: this.searchForm.aaLotterySource,
                    page: this.page.page,
                    limit: this.page.limit,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): ''
                }
                this.loadingTable = true;
                this.$http.get(this.$api.aaLotteryTicketQPage, params, true).then(res=>{
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    [this.searchLoading, this.loadingTable] = [false, false];
                    this.setPlatformTicket(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                })
                .catch(err=>{
                    [this.loadingTable, this.searchLoading, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            formatType(row) {
                return enumFormatter(row.aaLotterySource, EnumLottery);
            },
            searchList() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                [this.page.page, this.page.limit, this.searchForm] = [1, 10, {}];
                this.setPlatformTicket(null);
                this.getList();
            },
            openDetail(lotteryId) {
                this.$router.push({
                    path: '/platformLotteryDetailInfo',
                    query: {
                        lotteryId: lotteryId
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-lottery-detail {
        
    }
</style>
