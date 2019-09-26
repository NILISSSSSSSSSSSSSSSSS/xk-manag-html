<template>
    <div class='xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                    <span></span>
                    已完成搜索
                </div>
                <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="fnSearch">查 询</el-button>
                    <el-button type='danger' :size='$size' @click="fnClear">清 空</el-button>
                </div>
                <div class='vus-bottom'></div>
                <el-form :size="$size" :inline="true" :model="searchData" label-position='right' label-width='120px'
                    class="demo-form-inline xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label='用户ID：'>
                                <el-input v-model="searchData.xkUserId" placeholder="输入用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='运营彩票名称：'>
                                <el-input v-model="searchData.typeName" placeholder="输入运营彩票名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='开奖时间：'>
                                <el-date-picker v-model="searchData.time" type="datetimerange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label='所在地区：'>
                                <province-cascader v-model="searchData.region" placeholder="所属区域"></province-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='状态：'>
                                <el-select v-model="searchData.phases">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="未中奖" value="LOST"></el-option>
                                    <el-option label="已兑奖" value="IS_CLAIM"></el-option>
                                    <el-option label="兑奖失败" value="FAIL_CLAIM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
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
                    已完成列表
                </div>
                <div class='vus-bottom'></div>
            </div>
            <el-table :data="tableData" stripe border v-loading="loading" style="width: 100%">
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="typeName" label="运营彩票名称">
                </el-table-column>
                <el-table-column prop="invoiceNo" label="参与期数">
                    <template slot-scope="scope">
                        第{{scope.row.invoiceNo}}期
                    </template>
                </el-table-column>
                <el-table-column prop="prizeName" label="奖项">
                    <template slot-scope="scope">
                        {{scope.row.prizeName?scope.row.prizeName:"未中奖"}}
                    </template>
                </el-table-column>
                <el-table-column prop="singleNoteAmount" label="单注奖金">
                    <template slot-scope="scope">
                        {{scope.row.singleNoteAmount?scope.row.singleNoteAmount:0 | Division | NumThree}}
                    </template>
                </el-table-column>
                <el-table-column prop="lotteryNumber" label="注数">
                    <template slot-scope="scope">
                        {{scope.row.lotteryNumber?scope.row.lotteryNumber:1}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalAmount" label="兑奖总额">
                    <template slot-scope="scope">
                        {{scope.row.totalAmount?scope.row.totalAmount:0 | Division | NumThree}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalPrizeAmount" label="实际兑奖金额">
                    <template slot-scope="scope">
                        {{scope.row.totalPrizeAmount?scope.row.totalPrizeAmount:0 | Division | NumThree}}
                    </template>
                </el-table-column>
                <el-table-column prop="aaLotteryGetPrizeWay" label="兑奖方式">
                    <template slot-scope="scope">
                        {{scope.row.aaLotteryGetPrizeWay?scope.row.aaLotteryGetPrizeWay=="offline"?"线下":"线上":"未中奖"}}
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
                <el-table-column prop="aaLotteryStatus" label="状态">
                    <template slot-scope="scope">
                        {{scope.row.aaLotteryStatus | lotteryStatus}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'lotteryFinishedLook'" @click="fnLook(scope.row)" :size="$size">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="fnpagechange">
            </Pagination>
            <component :is="componentId" :dialogVisible.sync="dialogVisible" :ticketId='ticketId'></component>
        </div>
    </div>
</template>
<script>
import ProvinceCascader from "@/components/ProvinceCascader.vue";
import lotteryAlreadyBig from "./lotteryFinishedList/lotteryAlreadyBig";
import lotteryAlreadySmall from "./lotteryFinishedList/lotteryAlreadySmall";
import lotteryUnlucky from "./lotteryFinishedList/lotteryUnlucky";
import lotteryFailed from "./lotteryFinishedList/lotteryFailed";
import { getPorvinceInfo } from '@/util/publicMehotds';
export default {
    name: 'lotteryFinishedList',
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchData: {},
            tableData: [],
            dialogVisible: false,
            componentId: "",
            ticketId: '',
            loading: false
        };
    },
    props: {},
    components: {
        ProvinceCascader,
        lotteryAlreadyBig,
        lotteryAlreadySmall,
        lotteryUnlucky,
        lotteryFailed
    },
    computed: {},
    created() {
        this.fnGetPage();
    },
    mounted() { },
    methods: {
        getPorvinceInfo,
        fnSearch() {
            let obj = {};
            for (const key in this.searchData) {
                if (this.searchData[key]) {
                    if (key === 'time') {
                        obj.startTime = this.searchData[key][0].getTime() / 1000;
                        obj.endTime = this.searchData[key][1].getTime() / 1000;
                    } else if (key === 'region') {
                        obj.areaCode = this.searchData[key][this.searchData[key].length - 1];
                    } else {
                        obj[key] = this.searchData[key]
                    }
                }
            }
            this.currentPage = 1;
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
        fnLook(target) {
            if (target.aaLotteryStatus == 'finish') {
                if (target.aaLotteryGetPrizeWay == "offline") {
                    this.componentId = "lotteryAlreadyBig";
                } else {
                    this.componentId = "lotteryAlreadySmall";
                }
            } else if (target.aaLotteryStatus == 'lost') {
                this.componentId = "lotteryUnlucky";
            } else {
                this.componentId = "lotteryFailed";
            }
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.ticketId = target.ticketId;
            })
        },
        fnGetPage(params = {}) {
            let obj = {
                ...params,
                aaLotterySource:this.searchData.aaLotterySource,
                limit: this.pageSize,
                page: this.currentPage
            }
            for (const key in this.searchData) {
                if (this.searchData[key]) {
                    if (key === 'time') {
                        obj.startTime = this.searchData[key][0].getTime() / 1000;
                        obj.endTime = this.searchData[key][1].getTime() / 1000;
                    } else if (key === 'region') {
                        obj.areaCode = this.searchData[key][this.searchData[key].length - 1];
                    } else {
                        obj[key] = this.searchData[key]
                    }
                }
            }
            console.log(obj)
            this.loading = true;
            this.$http.get(this.$api.aaLotteryFinishQPage, obj, true).then((res) => {
                console.log(res)
                this.loading = false;
                this.total = res ? res.total : 0;
                this.tableData = res ? res.data : [];

            }).catch((err) => {
                console.log(err);
                this.loading = false;
                this.tableData = [];
                this.$message.error(err.message);
            });
        }
    },
    watch: {}
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