<template>
    <div class = 'cash-look-throu-list xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    提现审核列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="search()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clear()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form class="xk-search" label-width="120px" :model="searchData">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="提现单号：">
                                <el-input v-model="searchData.orderNo" :size="$size" placeholder="请输入提现单号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联盟商ID：">
                                <el-input v-model="searchData.qUserId" :size="$size" placeholder="请输入联盟商ID"></el-input>
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
                        <el-col :span="8">
                            <el-form-item label="提现金额：">
                                <el-row>
                                    <el-col :span="11">
                                        <el-input v-model="searchData.startMoney" :size="$size" placeholder="请输入..."></el-input>
                                    </el-col>
                                    <el-col :span="2" class="center">至</el-col>
                                    <el-col :span="11">
                                        <el-input v-model="searchData.endMoney" :size="$size" placeholder="请输入..."></el-input>
                                    </el-col>
                                </el-row>
                                
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
                <div class="vus-btn">
                        <!-- <el-button type="primary" :size="$size">批量审核</el-button> -->
                        <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                v-loading="loadingTable"
                style="width: 100%">
                <!-- <el-table-column
                    type="selection"
                    width="35">
                </el-table-column> -->
                <el-table-column
                    prop="orderNo"
                    label="提现单号">
                </el-table-column>
                <el-table-column
                    label="申请时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
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
                    prop="bankCard"
                    label="提现卡号">
                </el-table-column>
                <el-table-column
                    label="审核状态">
                    <template slot-scope="scope">
                        {{ scope.row.audit | formatAudit }}
                    </template>
                </el-table-column>
                <el-table-column
                    width="120"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'cashLookThrouListExamine'" :size="$size" :loading="scope.row.loading" type="text" v-if="scope.row.audit==='UNAUDITED'" @click="verify(scope.row)">审核</el-button>
                        <el-button v-permission="'cashLookThrouListInfo'" :size="$size" :loading="scope.row.loadingInfo" type="text" v-else @click="verify(scope.row, true)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage = "page.page" :pageSize = "page.limit" :total = "page.total" @change = "fnpagechange"></pagination>
        </div>

        <!-- 提现审核 -->
        <el-dialog :visible.sync="visible" width="800" title="提现审核" class="verify">
            <el-row>
                <el-col :span="12">提现单号：{{ detail.orderNo }}</el-col>
                <el-col :span="12">申请时间：{{ detail.createdAt | formatTime }}</el-col>
                <el-col :span="12">用户名称：{{ detail.merchantName }}</el-col>
                <el-col :span="12">联盟商ID：{{ detail.merchantId }}</el-col>
                <el-col :span="12">提现金额：{{ $math.divide(detail.actualAmount, 100) }}</el-col>
                <el-col :span="12">账户余额：{{ detail.usable }}</el-col>
                <el-col :span="12">提现银行：{{ detail.bankName }}</el-col>
                <el-col :span="12">银行卡号：{{ detail.bankCard }}</el-col>
                <el-col :span="12">预留手机号：{{ detail.phone }}</el-col>
                <el-col :span="12">持卡人姓名：{{ detail.cardName }}</el-col>
            </el-row>
            <div class="line" v-if="detail.audit== 'UNAUDITED'">
                <el-row>
                    <el-col :span="2">人工审核：</el-col>
                    <el-col :span="22">
                        <el-radio-group v-model="radio">
                            <el-radio label="1">同意</el-radio>
                            <el-radio label="0">不同意</el-radio>
                        </el-radio-group>
                    </el-col>
                    <template v-if="radio==0">
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="6">
                            <el-input v-model="error" type="textarea" :autosize="{ minRows: 5, maxRows: 5}" rows="4" resize="none"></el-input>
                        </el-col>
                    </template>
                </el-row>
            </div>
            <div class="line" v-else>
                <el-row>
                    <el-col :span="24">人工审核：{{ detail.audit | formatAudit }}</el-col>
                    <el-col :span="24">审核时间：{{ detail.auditTime | formatTime }}</el-col>
                    <el-col :span="24">不通过原因：{{ detail.error }}</el-col>
                </el-row>
            </div>
            <div class="btn-group">
                <el-button v-if="detail.audit== 'UNAUDITED'" :size="$size" @click="visible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="confirm(detail.audit== 'UNAUDITED')" :loading="loadingAudit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment';
import { mapMutations, mapState } from 'vuex';
import { MerchantTypes } from '@/util/publicParams.js';
import { enumFormatter } from '@/util/publicMehotds.js';
const EnumAudit = [{value: 'UNAUDITED', label: '未审核'},{value: 'UNAPPROVED', label: '未审核通过'}]
export default {
    name:'cashLookThrouList',
    data () {
        return {
            EnumAudit,
            searchData:{},
            loadingSearch: false,
            loadingTable: false,
            loadingAudit: false,
            visible: false,
            detail: {},
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            radio: '1',
            error: '',
            tableData:[]
        };
    },
    computed: {
        ...mapState({
            searchStateData: state => state.financialWithdraw.withdrawExamine
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
            setWithdrawExamine: "financialWithdraw/setWithdrawExamine"
        }),
        fnpagechange(page, limit) {
            [this.page.page, this.page.limit] = [page,limit];
            this.getList();
        },
        getList() {
            let params = {
                page: this.page.page,
                limit: this.page.limit,
                startMoney: this.searchData.startMoney? this.$math.multip(this.searchData.startMoney, 100): '',
                endMoney: this.searchData.endMoney? this.$math.multip(this.searchData.endMoney, 100): '',
                startTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[0]).format('X'): '',
                endTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[1]).format('X'): '',
                audit: this.searchData.audit,
                orderNo: this.searchData.orderNo,
                qMerchantId: this.searchData.qUserId,
                type: 1
            };
            this.loadingTable = true;
            this.$http.get(this.$api.merchantAdvanceQPage, params, true).then(res=>{
                this.setWithdrawExamine(Object.assign({searchForm: this.searchData}, {page: this.page}));
                this.loadingTable = false;
                this.loadingSearch = false;
                this.tableData= res?res.data: [];
                this.page.total = res? res.total: 0;
            })
            .catch(err=>{
                [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                this.$message.error('查询失败');
            })
        },
        search(){
            this.page.page = 1;
            this.loadingSearch = true;
            this.getList();
        },
        clear() {
            [this.page.page, this.page.limit, this.searchData] =[1,10,{}];
            this.getList();
        },
        verify(row, bool) {
            this.$set(row,bool? 'loadingInfo': 'loading', true);
            this.$http.get(this.$api.merchantAdvanceDetail, {id: row.id}, true).then(res=>{
                this.detail = res;
                this.$set(row, bool? 'loadingInfo': 'loading', false);
                this.visible = true;
            })
            .catch(err=>{
                this.$set(row, bool? 'loadingInfo': 'loading', false);
                this.$message.error(err.message);
            })
        },
        confirm(bool) {
            if(bool) {
                let params = {
                    orderNo: this.detail.orderNo,
                    audit: this.radio,
                }
                if(this.radio ==0) {
                    if(!this.error) {
                        this.$message.error('请输入不通过原因！')
                        return false;
                    }
                    params.error = this.error;
                }
                this.loadingAudit = true;
                this.$http.post(this.$api.advanceAudit ,params, true).then(res=>{
                    this.loadingAudit = false;
                    this.visible = false;
                    this.$message.success('审核成功');
                    this.getList();
                })
                .catch(err=>{
                    this.loadingAudit = false;
                    this.visible = false;
                    this.$message.error(err.message);
                })
            }else{
                this.visible = false;
            }
        }
    },
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
    .cash-look-throu-list {
        .verify {
            /deep/ .el-row .el-col {
                margin-bottom: 15px;
            }
        }
        .line {
            margin-top: 20px;
        }
    }
    
</style>