<template>
    <div class="xk-container pool-detail">
        <div class="xk-body xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search()" :loading="searchLoading">查询</el-button>
                    <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" label-width="100px" ref="searchForm"
                     class="pubBackground xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input :size="$size" v-model.trim="searchForm.financialNumber" placeholder="请输入流水号" style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="交易时间：">
                            <el-date-picker
                                :size="$size"
                                v-model="searchForm.timeRange"
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

        <!-- 表格 -->
        <div class="marintop20 xk-radius">
            <div class="pubBackground solidtop lower-goods">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <!-- <el-button type="success" :size="$size" :disabled="isUpload">导出到Excel</el-button> -->
                    </div>
                    <div class="vus-bottom"></div>
                </div>
            </div>
            <!--表格数据-->
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="financialNumber" width="280px"></el-table-column>
                <el-table-column label="所属模板" prop="templateName" show-overflow-tooltip></el-table-column>
                <el-table-column label="时间" width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="scope">
                        {{ scope.row.descriptionType!='DISBURSE'? '+': '-' }}{{ scope.row.financialMoney }} 元
                    </template>
                </el-table-column>
                <!-- <el-table-column label="奖池余额">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.financialMoney, 100) }} 元
                    </template>
                </el-table-column> -->
                <el-table-column label="用户昵称" prop="nickName"></el-table-column>
                <el-table-column label="用户账号" prop="userAccount"></el-table-column>
                <el-table-column label="业务类型" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.descriptionType | formatDescriptionType }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120px">
                    <template slot-scope="scope">
                        <!-- :disabled="scope.row.rackType==null? true: false"  -->
                        <el-button :loading="scope.row.btnLoading" type="primary" :size="$size" @click="viewDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 充值的情况下，显示弹框 -->
        <el-dialog :visible.sync="dialogVisible" title="充值详情">
            <h4>基本信息</h4>
            <el-row class="recharge-box">
                <el-col :span="8">充值时间：{{ detail.chargeTime | formatTime }}</el-col>
                <el-col :span="8">充值金额：{{ detail.amount }}元</el-col>
            </el-row>
            <h4>操作员信息</h4>
            <el-row class="recharge-box">
                <el-col :span="8">操作员姓名：{{ detail.userName }}</el-col>
                <el-col :span="8">操作员ID：{{ detail.userId }}</el-col>
                <el-col :span="24" class="margintop10">操作员角色：
                    <span v-for="(item, index) in detail.userRole" :key="index">
                        {{ item }}
                        <template v-if="detail.areas.length>1 && index<detail.areas.length-1">、</template>
                    </span>
                </el-col>
            </el-row>
            <h4>抽奖模板信息</h4>
            <el-row class="recharge-box">
                <el-col :span="24">模板名称：{{ detail.templateName }}</el-col>
                <el-col :span="24" class="margintop10">适用地区：
                    <template v-if="!detail.areas || detail.areas[0].provinceCode==='000000'">全国</template>
                    <template v-else>
                        <span v-for="(item, index) in detail.areas" :key="index">
                            {{ getPorvinceInfo(item.countyCode) }}
                            <template v-if="detail.areas.length>1 && index<detail.areas.length-1">、</template>
                        </span>
                    </template>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="dialogVisible=false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    const EnumDescriptionType = [{key: 'INCOME', value: '收入'}, { key: "RECHARGE", value: '充值' }, { key: 'DISBURSE', value: '支出' }];

    export default {
        data() {
            return {
                getPorvinceInfo,
                templateId: "",
                searchLoading: false,
                loadingTable: false,
                dialogVisible: false,
                searchForm: {},
                page: {
                    page: 1,
                    total: 0,
                    limit: 10
                },
                tableData: [],
                detail: {}
            }
        },
        created() {
            this.templateId = this.$route.query.templateId;
            this.getList();
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            search() {
                this.searchLoading = true;
                this.getList();
            },
            clearInput() {
                this.page = {
                    page: 1,
                    limit: 10,
                    total: 0
                }
                this.searchForm = {};
                this.getList();
            },
            //查看列表详情
            getList() {
                let params = {
                    templateId: this.templateId,
                    page: this.page.page,
                    limit: this.page.limit,
                    financialNumber: this.searchForm.financialNumber,
                    startTime: this.searchForm.timeRange? moment(this.searchForm.timeRange[0]).format('X'): '',
                    endTime: this.searchForm.timeRange? moment(this.searchForm.timeRange[1]).format('X'): ''
                }
                this.loadingTable = true;
                console.log(JSON.stringify(params));
                this.$http.get(this.$api.jackpotFinancialQPage, params, true).then(res=>{
                    this.tableData = res? res.data:[];
                    this.page.total = res? res.total: 0;
                    this.searchLoading = false;
                    this.loadingTable = false;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.searchLoading = false;
                    this.loadingTable = false;
                })
            },
            viewDetail(row) {
                if(row.descriptionType ==='INCOME') {
                    /**
                     * 一、rackType字段说明
                     *  1. GAMES  游戏充值订单
                     *  2. GIFT   送礼订单
                     *  3. WHOLESALEMALL    自营商城订单（精选商城）
                     *  4. SELECTMALL       自营商城订单（批发商城）
                     *  5. BCIRCLE          商圈订单
                     * 
                     * 二、correlationId字段
                     */
                    switch(row.rackType) {
                        case 'GAMES':
                            this.$router.push({
                                path: '/userGameDetail',
                                query: {
                                    id: row.correlationId
                                }
                            });
                            break;
                        case 'GIFT':
                            this.$router.push({
                                path: '/userGiftDetail',
                                query: {
                                    orderNo: row.correlationId,
                                    tradeProduct: 'gift'
                                }
                            });
                            break;
                        case 'RED_GIFT':
                            this.$router.push({
                                path: '/userGiftDetail',
                                query: {
                                    orderNo: row.correlationId,
                                    tradeProduct: 'redPackets'
                                }
                            });
                            break;
                        case 'WHOLESALEMALL':
                            this.$router.push({
                                path: '/orderSelfMallDetail',
                                query: {
                                    id: row.correlationId
                                }
                            });
                            break;
                        case 'SELECTMALL':
                            this.$router.push({
                                path: '/orderSelfMallDetail',
                                query: {
                                    id: row.correlationId
                                }
                            });
                            break;
                        case 'BCIRCLE':
                            this.$router.push({
                                path: '/buinessMallDetail',
                                query: {
                                    orderId: row.correlationId
                                }
                            });
                            break;
                    }
                } 
                if(row.descriptionType ==='DISBURSE') {
                    this.$router.push({
                        path: '/orderLotteryDetail',
                        query: {
                            source: 'plat',
                            orderId: row.correlationId,
                            from: 'platform'
                        }
                    })
                }
                if(row.descriptionType === 'RECHARGE') {
                    this.dialogVisible = true;
                    this.$set(row, 'btnLoading', true);
                    this.lookDetail(row);
                }
            },
            //查看充值详情
            lookDetail(row) {
                this.$http.get(this.$api.rechargeDetail, {financialNumber: row.financialNumber}, true).then(res=>{
                    this.$set(row, 'btnLoading', false);
                    this.detail = res;
                    this.dialogVisible = true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'btnLoading', false);
                })
            }
        },
        filters: {
            formatDescriptionType(val) {
                if(val) {
                    for(let i=0,len = EnumDescriptionType.length ;i< len; i++) {
                        if(EnumDescriptionType[i].key === val) {
                            return EnumDescriptionType[i].value;
                        }
                    }
                    return val;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './poolDetail.scss';
</style>
