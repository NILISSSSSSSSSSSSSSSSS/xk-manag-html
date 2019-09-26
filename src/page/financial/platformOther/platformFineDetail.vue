<template>
    <div class="platform-fine-detail xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="searchList()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.settleNo" :size="$size" placeholder="请输入流水账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="罚款来源：">
                            <el-select v-model="searchForm.type" :size="$size" placeholder="请选择发放场景">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="推荐商品收益" value="consume"></el-option>
                                <el-option label="销售收益" value="spread"></el-option>
                                <el-option label="平台收益" value="shop"></el-option>
                                <el-option label="主播打赏" value="anchor"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联盟商ID：">
                            <el-input v-model="searchForm.merchantId" :size="$size" placeholder="请输入联盟商ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地区：">
                            <province-cascader all v-model="searchForm.areaCode"></province-cascader>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="8">
                        <el-form-item label="罚款时间：">
                            <el-date-picker :clearable="false" v-model="searchForm.rangeTime" :size="$size" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
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
                    <el-button v-permission="'platformFineDetailDown'" type="success" :size="$size"  @click="visibleOrder=true">导出到Excel</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="settleNo"></el-table-column>
                <el-table-column label="罚款时间">
                    <template slot-scope="scope">
                        {{ scope.row.penaltyTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="罚款联盟商ID" prop="merchantId"></el-table-column>
                <el-table-column label="联盟商姓名" prop="merchantName"></el-table-column>
                <el-table-column label="联盟商类型">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.merchantTypes" :key="item">
                            {{ item | formatMerchant }}<template v-if="index!=scope.row.merchantTypes.length-1">，</template>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="罚款金额">
                    <template slot-scope="scope">
                        {{ scope.row.punishAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="罚款原因" prop="breakRuleDesc"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformFineDetailInfo'" :size="$size" type="text" :loading="scope.row.loading" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <!-- 平台罚款详情 -->
        <el-dialog title="平台罚款明细" :visible.sync="visible" width="800px" class="dialog-visible">
            <h4>罚款基本信息</h4>
            <el-row>
                <el-col :span="12">罚款流水号：{{ detail.settleNo }}</el-col>
                <el-col :span="12">罚款金额：{{ detail.punishAmount}}</el-col>
                <el-col :span="12">罚款时间：{{ detail.penaltyTime | formatTime }}</el-col>
                <el-col :span="12">罚款来源：
                    <template v-for="(item, index) in detail.punishSource">
                        <span :key="item">
                            {{ item | formatResource }}
                        </span><template v-if="index != detail.punishSource.length-1">，</template>
                    </template>
                </el-col>
                <el-col :span="24">罚款原因：{{ detail.breakRuleDesc }}</el-col>
            </el-row>

            <h4>联盟商信息<el-button class="fr" :size="$size" type="text" @click="goToUserInfo(detail.merchantId)">查看详情</el-button></h4>
            <el-row>
                <el-col :span="12">联盟商ID：{{ detail.merchantId }}</el-col>
                <el-col :span="12">姓名：{{ detail.merchantName }}</el-col>
                <el-col :span="12">用户账号：{{ detail.merchantPhone }}</el-col>
                <el-col :span="12">所属城市：{{ detail.regionName }}</el-col>
            </el-row>

            <h4>订单基础信息<el-button class="fr" :size="$size" type="text" @click="getOrderDetail(detail.orderType, detail.orderId)">查看详情</el-button></h4>
            <el-row>
                <el-col :span="12">订单ID：{{ detail.orderId }}</el-col>
                <el-col :span="12">订单类型：{{ detail.orderType | formatOrderType }}</el-col>
                <el-col :span="12">下单时间：{{ detail.createAt | formatTime }}</el-col>
                <el-col :span="12">支付时间：{{ detail.payTime | formatTime }}</el-col>
                <el-col :span="12">订单支付金额：{{ detail.orderMoney }}元</el-col>
            </el-row>

            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="visible=false">确定</el-button>
            </div>
        </el-dialog>

        <!-- 订单导出 -->
        <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>
    </div>
</template>
<script>
    const EnumResource = [{label: '直播', value: 'live'},{label: '货源', value: 'source'},{label: '平台', value: 'platform'},{label: '销售', value: 'sale'}];
    const EnumOrderType = [
        {label: '自营', value: 'DEALERS'},
        {label: '批发', value: 'WHOLESALE'},
        {label: '商圈', value: 'BCIRCLE'},
        {label: '礼物', value: 'GIFT'},
        {label: '彩票', value: 'LOTTERY'},
        {label: '游戏', value: 'GAME'}]
    import { EnumMerchantType } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { mapMutations, mapState } from 'vuex';
    import OrderOut from '@/components/common/OrderOut.vue';
    import moment from 'moment';
    export default {
        data() {
            return {
                visible: false,
                labelWidth: '150px',
                loadingSearch: false,
                loadingTable: false,
                detail: {},
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {
                    rangeTime: [moment().week(moment().week()).startOf('month'), moment()]
                },
                loadingDown: false,
                visibleOrder: false
            }
        },
        components: {
            ProvinceCascader,
            OrderOut
        },
        created() {
            this.searchData
                ? (this.searchForm = this.searchData.searchForm, this.page = this.searchData.page)
                : null;
            this.getList();
        },
        computed: {
            ...mapState({
                searchData: state => state.financialOther.fine
            })
        },
        methods: {
            ...mapMutations({
                setFine: "financialOther/setFine"
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
                [this.page.page, this.page.limit, this.searchForm] = [1,10, {rangeTime: [moment().week(moment().week()).startOf('month'), moment()]}];
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    startTime: moment(this.searchForm.rangeTime[0]).format('X'),
                    endTime: moment(this.searchForm.rangeTime[1]).format('X'),
                    areaCode: this.searchForm.areaCode? this.searchForm.areaCode[this.searchForm.areaCode.length-1]: '',
                    settleNo: this.searchForm.settleNo,
                    merchantId: this.searchForm.merchantId,
                    revenueType: this.searchForm.revenueType
                };
                
                this.loadingTable = true;
                this.$http.get(this.$api.dividedPenaltyPage, params, true).then(res=>{
                    this.setFine(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.tableData = [];
                    this.page.total=0;
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.$message.error('查询失败');
                })
            },
            getDetail(row) {
                this.$set(row, 'loading', true);
                this.$http.get(this.$api.dividedPenaltyDetail, {settleNo: row.settleNo}, true).then(res=>{
                    this.visible = true;
                    this.$set(row, 'loading', false);
                    this.detail = res;
                })
                .catch(err=>{
                    this.$set(row, 'loading', false);
                    this.$message.error(err.message);
                })
            },
            goToUserInfo(id) {
                this.$router.push({
                    path: '/businessDetail',
                    query: {
                        id: id
                    }
                })
            },
            getOrderDetail(type, orderId){
                switch(type) {
                    case 'GAME':
                        this.$router.push({
                            path: '/userGameDetail',
                            query: {
                                id: orderId
                            }
                        });
                        break;
                    case 'GIFT':
                        this.$router.push({
                            path: '/userGiftDetail',
                            query: {
                                orderNo: orderId,
                                tradeProduct: 'gift' //默认传这个字段
                            }
                        });
                        break;
                    case 'WHOLESALEMALL':
                        this.$router.push({
                            path: '/orderSelfMallDetail',
                            query: {
                                id: orderId
                            }
                        });
                        break;
                    case 'SELECTMALL':
                        this.$router.push({
                            path: '/orderSelfMallDetail',
                            query: {
                                id: orderId
                            }
                        });
                        break;
                    case 'BCIRCLE':
                        this.$router.push({
                            path: '/buinessMallDetail',
                            query: {
                                orderId: orderId
                            }
                        });
                        break;
                }
            },
            downExcel(limit) {
                let params = {
                    page: this.page.page,
                    limit: limit,
                    startTime: moment(this.searchForm.rangeTime[0]).format('X'),
                    endTime: moment(this.searchForm.rangeTime[1]).format('X'),
                    areaCode: this.searchForm.areaCode? this.searchForm.areaCode[this.searchForm.areaCode.length-1]: '',
                    settleNo: this.searchForm.settleNo,
                    merchantId: this.searchForm.merchantId,
                    revenueType: this.searchForm.revenueType
                }
                this.loadingDown = true;

                this.$http
                .downGet(this.$api.dividedPenaltyPageDown, params, true)
                .then(res=>{
                    this.loadingDown = false;
                    this.$message.success(res.message);
                })
                .catch(err=>{
                    this.loadingDown = false;
                    this.$message.error(err.message)
                })
            }
        },
        filters: {
            formatMerchant(val) {
                return enumFormatter(val, EnumMerchantType)
            },
            formatResource(val) {
                return enumFormatter(val, EnumResource, {key: 'value', value: 'label'})
            },
            formatOrderType(val) {
                return enumFormatter(val, EnumOrderType, {key: 'value', value: 'label'})
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-fine-detail {
        .dialog-visible {
            h4 {
                font-size: 15px;
                margin-bottom: 10px;
                font-weight: bolder;
                &::after{
                    content: "";
                    display: block;
                    height: 1px;
                    background: #ccc;
                    margin-top: 10px;
                }
                .fr {
                    float: right
                }
            }
            /deep/ .el-row .el-col {
                margin-bottom: 15px;
            }
            .xk-table {
                border: 1px solid #ccc;
                .table-box {
                    display: flex;
                    div {
                        text-align: center;
                        flex: 1;
                        padding: 10px 0;
                    }
                }
                .table-title {
                    border-bottom: 1px solid #ccc;
                }
            }
        }
    }
</style>
