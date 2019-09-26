<template>
    <div class="platform-welfare-detail xk-container">
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
                            <el-input v-model="searchForm.orderId" :size="$size" placeholder="请输入流水号"></el-input>
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
                <el-table-column label="流水号" prop="orderId"></el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户ID" prop="userId"></el-table-column>
                <el-table-column label="用户账号" prop="userTel"></el-table-column>
                <el-table-column label="实付金额">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.price, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformWelfareDetailInfo'" :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    export default {
        data() {
            return {
                labelWidth: '150px',
                loadingSearch: false,
                loadingTable: false,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {}
            }
        },
        created() {
            this.searchStateData
                ? (this.searchForm = this.searchStateData.searchForm, this.page = this.searchStateData.page)
                : null;
            this.getList();
        },
        computed: {
            ...mapState({
                searchStateData: state => state.financialMain.welfareMall
            })
        },
        methods: {
            ...mapMutations({
                setWelfareMall: "financialMain/setWelfareMall"
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
                    limit: this.page.limit,
                    page: this.page.page,
                    condition: {
                        orderId: this.searchForm.orderId,
                        timeStart: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                        timeEnd: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): ''
                    }
                }
                this.loadingTable = true;
                this.$http.get(this.$api.jMallOBMOrderQPage, params, true).then(res=>{
                    this.setWelfareMall(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                
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
                    path: '/orderPlatformDetail',
                    query: {
                        type: 'xfq',
                        id: row.orderId
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-welfare-detail {
        
    }
</style>
