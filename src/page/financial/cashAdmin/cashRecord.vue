<template>
    <div class = 'cash-record xk-container'>
        <div class="xk-radius">
            <div class='xk-title xk-search'>
                <div class="vus-title">
                    <span></span>
                    提现记录
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search()" :loading="loadingSearch">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clear()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-width="120px" :model="searchData">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="提现单号：">
                                <el-input v-model="searchData.orderNo" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联盟商ID：">
                                <el-input v-model="searchData.qUserId" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核状态：">
                                <el-select v-model="searchData.audit" :size="$size">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in EnumAudit" :label="item.label" :value="item.value" :key="item.key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期：">
                                <el-date-picker
                                    :size="$size"
                                    v-model="searchData.rangeTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="xk-body xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                v-loading="loadingTable"
                style="width: 100%">
                <el-table-column
                    prop="orderNo"
                    label="提现单号">
                </el-table-column>
                <el-table-column
                    label="申请时间">
                    <template slot-scope="scope">
                        {{ scope.row.updatedAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="通过时间">
                    <template slot-scope="scope">
                        {{ scope.row.auditTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="auditUserId"
                    label="操作管理员">
                </el-table-column>
                <el-table-column
                    prop="merchantId"
                    label="联盟商ID">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户名称">
                </el-table-column>
                <el-table-column
                    label="提现金额">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.amount, 100) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.merchantType | formatType }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="提现银行类型">
                    <template slot-scope="scope">
                        {{ scope.row.bankType == 1? '对公': '个人' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="bankName"
                    label="提现银行">
                </el-table-column>
                <el-table-column
                    prop="openBank"
                    label="开户行">
                </el-table-column>
                <el-table-column
                    prop="bankCard"
                    label="提现卡号">
                </el-table-column>
                <el-table-column
                    label="提现状态">
                    <template slot-scope="scope">
                        <!-- 转账失败  UN_FINISH -->
                        {{ scope.row.audit==='VERIFIED'? '提现中': scope.row.audit==='FINISH'? '提现成功': '提现失败' }}
                    </template>
                </el-table-column>
                <el-table-column
                    width="120"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'cashRecordInfo'" :size="$size" type="text" @click="getDetail(scope.row)" :loading="scope.row.loading">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "page.page" :pageSize = "page.limit" :total = "page.total" @change = "fnpagechange"></Pagination>
        </div>

        <!-- 提现详情 -->
        <el-dialog title="提现记录详情" :visible.sync="visible" width="600px" class="verify">
            <el-row>
                <el-col :span="12">提现单号：{{ detail.orderNo }}</el-col>
                <el-col :span="12">申请时间：{{ detail.createdAt | formatTime }}</el-col>
                <el-col :span="12">联盟商名称：{{ detail.merchantName }}</el-col>
                <el-col :span="12">联盟商ID：{{ detail.merchantId }}</el-col>
                <el-col :span="12">提现金额：{{ $math.divide(detail.actualAmount, 100) }}</el-col>
                <el-col :span="12">操作后余额：{{ detail.usable }}</el-col>
                <el-col :span="12">提现银行：{{ detail.bankName }}</el-col>
                <el-col :span="12">银行卡号：{{ detail.bankCard }}</el-col>
                <el-col :span="12">开户行：{{ detail.openBank }}</el-col>
                <el-col :span="12">预留手机号：{{ detail.phone }}</el-col>
                <el-col :span="12">持卡人姓名：{{ detail.cardName }}</el-col>
                <el-col :span="12">提现状态：{{ detail.audit | formatAudit }}</el-col>
                <el-col :span="12" v-if="detail.audit!='UNAUDITED'">提现日期：{{ detail.auditTime | formatTime }}</el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="visible = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment';
import { mapMutations, mapState } from 'vuex';
import { enumFormatter } from '@/util/publicMehotds.js';
import { MerchantTypes } from '@/util/publicParams.js';
const EnumAudit = [{value: 'VERIFIED', label: '提现中'},{value: 'FINISH', label: '提现成功'}]
export default {
    name:'cashRecord',
    data () {
        return {
            EnumAudit,
            loadingSearch: false,
            loadingTable: false,
            visible: false,
            searchData:{},
            tableData:[],
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            detail: {}
        };
    },
    computed: {
        ...mapState({
            searchStateData: state => state.financialWithdraw.withdrawRecord
        })
    },
    created() {
        this.searchStateData
                ? (this.searchData = this.searchStateData.searchForm, this.page = this.searchStateData.page)
                : null;
        this.getList();
    },
    methods: {
        ...mapMutations({
            setWithdrawRecord: "financialWithdraw/setWithdrawRecord"
        }),
        fnpagechange(page, limit) {
            [this.page.page, this.page.limit] = [page,limit];
            this.getList();
        },
        getList() {
            let params = {
                limit: this.page.limit,
                page: this.page.page,
                startTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[0]).format('X'): '',
                endTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[1]).format('X'): '',
                orderNo: this.searchData.orderNo,
                audit: this.searchData.audit,
                qMerchantId: this.searchData.qUserId,
                type: 2
            }
            this.loadingTable = true;
            this.$http.get(this.$api.merchantAdvanceQPage, params, true).then(res=>{
                this.setWithdrawRecord(Object.assign({searchForm: this.searchData}, {page: this.page}));
                this.loadingTable = false;
                this.loadingSearch = false;
                this.tableData = res? res.data: [];
                this.page.total = res? res.total: 0;
                console.log(res)
            })
            .catch(err=>{
                [this.loadingTable, this.loadingSearch, this.tableData, this.page.total] = [false, false, [], 0];
                this.$message.error('查询失败');
            })
        },
        search() {
            this.page.page = 1;
            this.loadingSearch = true;
            this.getList();
        },
        clear() {
            [this.page.page, this.page.limit, this.searchData] = [1,10,{}];
            this.getList();
        },
        getDetail(row) {
            this.$set(row,'loading', true);
            this.$http.get(this.$api.merchantAdvanceDetail, {id: row.id}, true).then(res=>{
                console.log(res);
                this.detail = res;
                this.$set(row,'loading', false);
                this.visible = true;
            })
            .catch(err=>{
                this.$set(row,'loading', false);
                this.$message.error(err.message);
            })
        }
    },
    watch: {},
    filters: {
        formatType(val) {
            return enumFormatter(val, MerchantTypes, {value: 'label'})
        },
        formatAudit(val) {
            return enumFormatter(val, EnumAudit, {key: 'value', value: 'label'})
        }
    }
}
</script>
<style scoped lang="scss">
    .cash-record {
        .verify {
            /deep/ .el-row .el-col {
                margin-bottom: 15px;
            }
            
        }
    }
</style>