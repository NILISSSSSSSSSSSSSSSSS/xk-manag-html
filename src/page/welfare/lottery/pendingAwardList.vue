<template>
    <div class='xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                    <span></span>
                    待开奖搜索
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
                            <el-form-item label='出票时间：'>
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
                    </el-row>
                    <el-row>
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
                    共计： <strong class="red-tip">{{ total }}</strong> 张
                </div>
                <div class='vus-bottom'></div>
            </div>
            <el-table :data="tableData" stripe border v-loading="tableLoading" style="width: 100%">
                <el-table-column prop="ticketId" label="彩票ID">
                </el-table-column>
                <el-table-column prop="userId" label="用户ID">
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
                <el-table-column prop="aaLotteryType" label="彩票类型">
                    <template slot-scope="scope">
                        {{scope.row.aaLotteryType==='super_lotto'?'大乐透':'未知'}}
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="彩票名称">
                </el-table-column>
                <el-table-column prop="invoiceNo" label="参与期数">
                </el-table-column>
                <el-table-column label="参与号码">
                    <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.invoiceNum">
                            <span class="red" v-if="index<5" :key="index">
                                {{item}}
                            </span>
                            <span class="blue" v-else :key="index">{{item}} </span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="出票时间">
                    <template slot-scope="scope">
                        {{ scope.row.invoiceTime | formatTime}}
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" @click="ticketId=scope.row.ticketId;pendingAwardDetailDia=true;">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="fnpagechange">
            </Pagination>
        </div>
        <!-- 待开奖详情弹框 -->
        <pending-awardDetail :pendingAwardDetailDia.sync="pendingAwardDetailDia" :ticketId="ticketId"></pending-awardDetail>
    </div>
</template>
<script>
import ProvinceCascader from "@/components/ProvinceCascader.vue";
import { getPorvinceInfo } from '@/util/publicMehotds';
import PendingAwardDetail from '@/components/welfare/PendingAwardDetail.vue';
export default {
    name: 'lotteryWaitForTicketsList',
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchData: {
                time: []
            },
            tableData: [],
            tableLoading: false,
            pendingAwardDetailDia: false,
            ticketId:"",
        };
    },
    props: {},
    components: {
        ProvinceCascader,
        PendingAwardDetail
    },
    computed: {},
    created() {
    },
    mounted() {
        this.fnGetPage();
    },
    methods: {
        getPorvinceInfo,
        fnSearch() {
            this.currentPage = 1;
            this.fnGetPage();

        },
        fnClear() {
            this.searchData = {
                time: []
            };
            this.fnGetPage();
        },
        fnpagechange(currentPage, pageSize) {
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.fnGetPage();
        },


        fnGetPage() {
            let data = {
                limit: this.pageSize,
                page: this.currentPage,
                xkUserId: this.searchData.xkUserId,
                aaLotterySource: this.searchData.aaLotterySource,
                startTime: this.searchData.time && this.searchData.time[0] ? this.searchData.time[0] / 1000 : null,
                endTime: this.searchData.time && this.searchData.time[1] ? this.searchData.time[1] / 1000 : null,
                areaCode: this.searchData.region && this.searchData.region.length !== 0 ? this.searchData.region[this.searchData.region.length - 1] : null,
            }

            console.log(data)
            this.tableLoading = true;
            this.$http.get(this.$api.aaLotteryInvoicedQPage, data, true).then((res) => {
                console.log(res)
                this.tableLoading = false;
                this.total = res ? res.total : 0;
                this.tableData = res ? res.data : [];

            }).catch((err) => {
                console.log(err);
                this.tableLoading = false;
                this.tableData = [];
                this.$message.error(err.message);
            });

        },


    },

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
.red-tip {
    color: red;
}

</style>