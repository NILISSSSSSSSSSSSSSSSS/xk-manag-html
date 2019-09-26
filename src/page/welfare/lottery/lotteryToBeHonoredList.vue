<template>
    <div class='xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                    <span></span>
                    待兑奖搜索
                </div>
                <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="fnSearch">查 询</el-button>
                    <el-button type='danger' :size='$size' @click="fnClear">清 空</el-button>
                </div>
                <div class='vus-bottom'></div>
                <el-form :size="$size" :inline="true" :model="searchData" label-position='right' label-width='120px'
                    v-loading="searchLoading" class="demo-form-inline xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label='用户ID：'>
                                <el-input v-model="searchData.xkUserId" placeholder="输入用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='中奖号码：'>
                                <el-row>
                                    <el-col :span="13">
                                        <el-input v-model="searchData.redNumbers" placeholder="红球号码"></el-input>
                                    </el-col>
                                    <el-col :span="1">
                                        <div>&nbsp;</div>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input v-model="searchData.blueNumbers" placeholder="蓝球号码"></el-input>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='参与期数：'>
                                <el-select v-model="searchData.invoiceNo">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option :label="'第'+item+'期'" :value="item" v-for="(item,index) in qiList"
                                        :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label='开奖时间：'>
                                <el-date-picker v-model="searchData.time" type="datetimerange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='所在地区：'>
                                <province-cascader v-model="searchData.region" placeholder="所属区域"></province-cascader>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                                <el-form-item label='赠送方式：'>
                                    <el-select v-model="searchData.aaLotterySource">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="平台" value="platform_activity"></el-option>
                                        <el-option label="商户" value="merchant_activity"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> -->

                        <el-col :span="8">
                            <el-form-item label='彩票来源：'>
                                <el-select v-model="searchData.aaLotterySource">
                                    <el-option label="全部"></el-option>
                                    <el-option label="游戏比赛" value="competition"></el-option>
                                    <el-option label="晒单" value="jorder_comment"></el-option>
                                    <el-option label="平台抽奖" value="platform_activity "></el-option>
                                    <el-option label="店铺抽奖" value="merchant_activity"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
        </div>
        <div class='xk-body xk-radius marintop20'>
            <div class="xk-title">
                <div class='vus-title'>
                    <span></span>
                    待兑奖列表
                </div>
                <div class='vus-btn'>
                    <span>兑奖方式：</span>
                    <el-radio-group v-model="cashWay" :size="$size">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="online">线上</el-radio-button>
                        <el-radio-button label="offline">线下</el-radio-button>
                    </el-radio-group>
                </div>
                <div class='vus-bottom'></div>
            </div>
            <el-table :data="tableData" stripe border v-loading="tableLoading" style="width: 100%">
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="aaLotteryType" label="彩票类型">
                    <template slot-scope="scope">
                        {{scope.row.aaLotteryType==='super_lotto'?'大乐透':'未知'}}
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="运营彩票名称">
                </el-table-column>
                <el-table-column prop="invoiceNo" label="参与期数">
                    <template slot-scope="scope">
                        第{{scope.row.invoiceNo}}期
                    </template>
                </el-table-column>
                <el-table-column prop="prizeName" label="奖项">
                </el-table-column>
                <el-table-column prop="winningNumbers" label="中奖号码" width='220'>
                    <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.winningNumbers">
                            <el-button :type="index<5?'danger':'primary'" circle :key="index" size="mini" v-if="item">
                                {{item}}
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="prizeAmount" label="实际兑奖金额">
                    <template slot-scope="scope">
                        {{scope.row.prizeAmount | Division | NumThree}}
                    </template>
                </el-table-column>
                <el-table-column prop="aaLotteryGetPrizeWay" label="兑奖方式">
                    <template slot-scope="scope">
                        {{scope.row.aaLotteryGetPrizeWay=="offline" ? '线下' : '线上'}}
                    </template>
                </el-table-column>
                <el-table-column prop="lotteryTime" label="开奖时间">
                    <template slot-scope="scope">
                        {{scope.row.lotteryTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="彩票来源">
                    <template slot-scope="scope">
                        {{scope.row.aaLotterySource | aaLotterySource}}
                    </template>
                </el-table-column>
                <el-table-column prop="areaCode" label="所在地区">
                    <template slot-scope="scope">
                        {{getPorvinceInfo(''+scope.row.areaCode)}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'lotteryHonore'" @click="fnDuiJiang(scope.row)"
                            v-if="!scope.row.isNeedFillInformation || scope.row.aaLotteryGetPrizeWay=='online'"
                            :size="$size">兑奖</el-button>
                        <span v-else>待用户完善信息</span>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="fnpagechange">
            </Pagination>
        </div>
        <component :is="componentId" :dialogVisible.sync="dialogVisible" :ticketId='ticketId'></component>
    </div>
</template>
<script>
import ProvinceCascader from "@/components/ProvinceCascader";
import lotteryLineDown from "./lotteryToBeHonoredList/lotteryLineDown";
import lotteryLineUp from "./lotteryToBeHonoredList/lotteryLineUp";
import { getPorvinceInfo } from '@/util/publicMehotds';
export default {
    name: 'lotteryToBeHonoredList',
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchData: {},
            tableData: [],
            cashWay: 'offline',//兑奖方式
            dialogVisible: false,
            componentId: '',
            qiList: [],
            searchLoading: false,
            ticketId: '',
            tableLoading: false
        };
    },
    props: {},
    components: {
        ProvinceCascader,
        lotteryLineDown,
        lotteryLineUp
    },
    computed: {},
    created() {
        this.fnGetPage();
        this.sequenceNoAll();
    },
    mounted() { },
    methods: {
        getPorvinceInfo,
        fnSearch() {
            let obj = {};

            for (const key in this.searchData) {
                if (this.searchData[key]) {
                    switch (key) {
                        case 'time':
                            obj.startTime = this.searchData[key][0].getTime() / 1000;
                            obj.endTime = this.searchData[key][1].getTime() / 1000;
                            break;
                        case 'region':
                            obj.areaCode = this.searchData[key][this.searchData[key].length - 1];
                            break;
                        case 'redNumbers':
                            obj.redNumbers = this.searchData[key].split(' ');
                            break;
                        case 'blueNumbers':
                            obj.blueNumbers = this.searchData[key].split(' ');
                            break;
                        default:
                            obj[key] = this.searchData[key]
                            break;
                    }
                }
            }
            this.currentPage = 1;//重置为1
            this.fnGetPage(obj);
        },
        fnClear() {
            this.searchData = {};
            this.fnGetPage();
        },
        fnpagechange(currentPage, pageSize) {
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.fnGetPage();
        },
        fnDuiJiang(target) {
            if (target.aaLotteryGetPrizeWay == "offline") {
                this.componentId = 'lotteryLineDown'
            } else {
                this.componentId = 'lotteryLineUp'
            }
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.ticketId = target.ticketId;
            })
        },
        fnGetPage(params = {}) {
            let obj = {
                ...params,
                page: this.currentPage,
                limit: this.pageSize,
                lotteryType: 'lotteryType',
                 aaLotterySource:this.searchData.aaLotterySource
            }
            if (this.cashWay == 'online') {
                obj.aaLotteryGetPrizeWay = 1
            }
            if (this.cashWay == 'offline') {
                obj.aaLotteryGetPrizeWay = 0
            }
            for (const key in this.searchData) {
                if (this.searchData[key]) {
                    switch (key) {
                        case 'time':
                            obj.startTime = this.searchData[key][0].getTime() / 1000;
                            obj.endTime = this.searchData[key][1].getTime() / 1000;
                            break;
                        case 'region':
                            obj.areaCode = this.searchData[key][this.searchData[key].length - 1];
                            break;
                        case 'redNumbers':
                            obj.redNumbers = this.searchData[key].split(' ');
                            break;
                        case 'blueNumbers':
                            obj.blueNumbers = this.searchData[key].split(' ');
                            break;
                        default:
                            obj[key] = this.searchData[key]
                            break;
                    }
                }
            }
            this.tableLoading = true;
            console.log(obj);
            this.$http.get(this.$api.aaLotteryClaimQPage, obj, true).then((res) => {
                this.tableLoading = false;
                this.total = res ? res.total : 0;
                this.tableData = res ? res.data : [];
            }).catch((err) => {
                this.tableLoading = false;
                this.tableData = [];
                this.$message.error(err.message);
            });
        },
        sequenceNoAll() {//查询所有已开奖期号（吴常辉）
            let searchLoading = true;
            this.$http.get(this.$api.sequenceNoAll, { type: 'super_lotto' }, true).then((res) => {
                if (res && res.length) {
                    this.qiList = res;
                } else {
                    this.qiList = [];
                }
                let searchLoading = false;
            }).catch((err) => {
                this.qiList = [];
                let searchLoading = false;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        cashWay(val) {
            this.fnGetPage();
        }
    }
}
</script>
<style scoped lang="scss">
.xk-search {
    .el-form-item {
        width: 100%;
    }
    /deep/ .el-form-item__content {
        width: calc(100% - 120px) !important;
    }
}
</style>