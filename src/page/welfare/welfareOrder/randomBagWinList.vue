<template>
    <div class="xk-container random-bag-win-list">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :mode="searchForm" label-width="120px" class="xk-search" ref="searchForm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户ID：">
                            <el-input :size="$size" placeholder="输入用户ID" v-model="searchForm.userId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="中奖时间：">
                            <el-date-picker v-model="searchForm.timeRange" :size="$size" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="抽奖模板：">
                            <el-select v-model="searchForm.templateId" :size="$size" placeholder="请选择">
                                <el-option value="" label="全部"></el-option>
                                <el-option v-for="item in tmpList" :value="item.templateId" :label="item.name" :key="item.templateId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="中奖金额：">
                            <el-col :span="10">
                                <el-form-item label-width="0" prop="minAmount" :rules="[{ type: 'number', message: '中奖金额必须为数字值' }]">
                                    <el-input v-model.trim="searchForm.minAmount" :size="$size" placeholder="0.01"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" class="center">至</el-col>
                            <el-col :span="10">
                                <el-form-item label-width="0" prop="maxAmount" :rules="[{ type: 'number', message: '中奖金额必须为数字值' }]">
                                    <el-input v-model.trim="searchForm.maxAmount" :size="$size" placeholder="1"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所在地区：">
                            <province-cascader all v-model="searchForm.districtCode"></province-cascader>
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
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="tableLoading">
                <el-table-column label="用户ID" prop="userId" width="220"></el-table-column>
                <el-table-column label="用户所在地区">
                    <template slot-scope="scope">
                        {{ getPorvinceInfo(scope.row.districtCode) }}
                    </template>
                </el-table-column>
                <el-table-column label="适用抽奖模板" show-overflow-tooltip prop="templateName"></el-table-column>
                <el-table-column label="中奖金额">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.quotaAmount, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="中奖时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.lotteryTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="订单ID" prop="orderId"></el-table-column>
                <el-table-column label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button v-permission="'randomBagWinListDetail'" :disabled="scope.row.drawTicketType==='consumption_ticket'? false: true" type="text" :size="$size" @click="viewDetail(scope.row)">查看订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    //枚举
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                getPorvinceInfo,
                searchForm: {},
                tableData: [],
                searchLoading: false,
                tableLoading: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                tmpList: []
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfareWelfareOrder.searchRandomList
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getTmpList();
            this.getList();
        },
        methods: {
            ...mapMutations({
                setRandomList: "welfareWelfareOrder/setRandomList"
            }),
            //获取模板列表
            getTmpList() {
                this.$http.get(this.$api.activityPlatformTemplateQueryAll, {}, true).then(res=>{
                    this.tmpList = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            search() {
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                this.setRandomList(null);
                this.searchForm = {};
                this.getList();
            },
            getList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    spendLotteryRecordDto: {
                        districtCode: this.searchForm.districtCode? this.searchForm.districtCode[this.searchForm.districtCode.length-1]: '',
                        startTime: this.searchForm.timeRange? moment(this.searchForm.timeRange[0]).format('X'): '',
                        endTime: this.searchForm.timeRange? moment(this.searchForm.timeRange[1]).format('X'): '',
                        minAmount: this.searchForm.minAmount? this.$math.multip(this.searchForm.minAmount, 100): '',
                        maxAmount: this.searchForm.maxAmount? this.$math.multip(this.searchForm.maxAmount, 100): '',
                        userId: this.searchForm.userId,
                        templateId: this.searchForm.templateId
                    }
                }
                this.tableLoading = true;
                this.$http.get(this.$api.activityRedPacketQpage, params, true).then(res=>{
                    this.searchLoading = false;
                    this.tableLoading = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.setRandomList(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                })
                .catch(err=>{
                    this.searchLoading = false;
                    this.tableLoading = false;
                    this.$message.error(err.message);
                })
            },
            viewDetail(row) {
                this.$router.push({
                    path: '/orderLotteryDetail',
                    query: {
                        source: 'plat',
                        orderId: row.id
                    }
                })
            }
        }
    }
</script>