<template>
    <div class="platform-pool-detail xk-container">
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
                        <el-form-item label="模板ID：">
                            <el-input v-model="searchForm.templateId" :size="$size" placeholder="请输入模板ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="城市：">
                            <province-cascader v-model="searchForm.countyCode" :size="$size"></province-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.financialNumber" :size="$size" placeholder="请输入流水号"></el-input>
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
                <el-table-column label="流水号" prop="financialNumber"></el-table-column>
                <el-table-column label="所属模板" prop="templateName"></el-table-column>
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="scope">
                        {{ scope.row.descriptionType!='DISBURSE'? '+': '-' }}{{ scope.row.financialMoney }} 元
                    </template>
                </el-table-column>
                <el-table-column label="用户昵称" prop="nickName"></el-table-column>
                <el-table-column label="用户账号" prop="userAccount"></el-table-column>
                <el-table-column label="业务类型">
                    <template slot-scope="scope">
                        {{ scope.row.descriptionType | formatDescriptionType }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformPoolDetailInfo'" :size="$size" :loading="scope.row.btnLoading" type="text" @click="openDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    const EnumDescriptionType = [{key: 'INCOME', value: '收入'}, { key: "RECHARGE", value: '充值' }, { key: 'DISBURSE', value: '支出' }];
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { getPorvinceInfo, enumFormatter } from '@/util/publicMehotds.js';
    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                getPorvinceInfo,
                labelWidth: '150px',
                loadingSearch: false,
                loadingTable: false,
                dialogVisible: false,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                detail: {}
            }
        },
        created() {
            this.searchData
                ? (this.searchForm = this.searchData.searchForm, this.page = this.searchData.page)
                : null;
            this.getList();
        },
        computed: {
            ...mapState({
                searchData: state => state.financialOther.pool
            })
        },
        methods: {
            ...mapMutations({
                setPool: "financialOther/setPool"
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
                [this.page.page, this.page.limit, this.searchForm] = [1, 10, {}];
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.searchForm.countyCode ? params.countyCode = this.searchForm.countyCode[this.searchForm.countyCode.length-1]: null;
                this.searchForm.rangeTime? (
                    params.startTime = moment(this.searchForm.rangeTime[0]).format('X'),
                    params.endTime = moment(this.searchForm.rangeTime[1]).format('X')
                ): null;
                this.searchForm.templateId? params.templateId = this.searchForm.templateId: null;
                this.searchForm.financialNumber? params.financialNumber = this.searchForm.financialNumber: null;
                console.log(JSON.stringify(params))
                this.loadingTable = true;
                this.$http.get(this.$api.jackpotFinancialQPage, params, true).then(res=>{
                    this.setPool(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.tableData = res?res.data: [];
                    this.page.total = res? res.total: 0;
                    console.log(res)
                })
                .catch(err=>{
                    this.tableData = [];
                    this.page.total=0;
                    this.loadingTable = false;
                    this.loadingSearch = false;
                    this.$message.error('查询失败');
                })
            },
            openDetail(row) {
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
                                    tradeProduct: 'gift' //默认传这个字段
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
                return enumFormatter(val, EnumDescriptionType)
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-pool-detail {
        
    }
</style>
