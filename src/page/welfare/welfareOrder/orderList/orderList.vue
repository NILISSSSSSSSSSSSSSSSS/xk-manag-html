<template>
    <div class="xk-container welfare-order-list">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>订单列表查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-form :model="searchForm" ref="searchForm" label-width="120px"
                     class=" demo-searchForm xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="订单ID：">
                            <el-input :size="$size" v-model.trim="searchForm.orderId" placeholder="输入订单ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品名称：">
                            <el-input :size="$size" v-model.trim="searchForm.goodsName" placeholder="请输入奖品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户账号：">
                            <el-input :size="$size" v-model.trim="searchForm.userTel" style="width: 100%;"
                                      placeholder="请输入用户账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品用途：">
                            <el-select :size="$size" v-model="searchForm.awardUsage">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in EnumUsage" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品类型：">
                            <el-select :size="$size" v-model="searchForm.goodsType">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumPrizeType" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单状态：">
                            <el-select :size="$size" v-model="searchForm.lottery" placeholder="请选择订单状态">
                                <el-option v-for="(item,index) in EnumStatus" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="选择日期：">
                            <el-date-picker
                                :size="$size"
                                style="width: 100%"
                                v-model="searchForm.timeRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格数据-->
        <div class="marintop20 xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <el-table stripe :data="tableData" v-loading="tableLoading">
                <el-table-column label="订单ID" prop="orderId"></el-table-column>
                <el-table-column label="用户ID" prop="userId" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户账号" prop="userTel" width="120"></el-table-column>
                <el-table-column label="奖品用途" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.awardUsage | formatType }}
                    </template>
                </el-table-column>
                <el-table-column label="奖品名称" prop="goodsName" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="奖品类型" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.goodsType==='substance'?'实物': '虚拟' }}奖品</span>
                    </template>
                </el-table-column>

                <el-table-column label="购买注数" prop="orderNumber" width="100"></el-table-column>
                <el-table-column label="支付金额" width="100">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.price, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdAt | formatTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" :formatter="formatterLottery" width="100"></el-table-column>
                
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button v-permission="'orderListDetail'" :size="$size" type="primary" @click="viewOrder(scope.row.orderId)">查看订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
    import {enumFormatter} from '@/util/publicMehotds.js';
    import { EnumUsage, EnumPrizeType, PrizeUsageEnum } from '@/util/publicParams.js';
    //枚举开奖装填
    const EnumStatus = [{key: '', value: '全部'},{key: 'NO_LOTTERY', value: '待开奖'},{key: 'WINNING_LOTTERY', value: '已中奖'},{key: 'SHARE_AUDIT_ING', value: '晒单审核中'},{key: 'SHARE_AUDIT_FAIL', value: '晒单未通过'},{key: 'LOSING_LOTTERY', value: '未中奖'},{key: 'SHARE_LOTTERY', value: '已晒单'}];

    import moment from "moment";
    import { mapMutations, mapState } from 'vuex';
    export default {
        data() {
            return {
                EnumUsage,
                EnumPrizeType,
                EnumStatus,
                page: {
                    page: 1,
                    total: 0,
                    limit: 10
                },
                searchForm: {},
                options: [],
                tableData: [],
                searchLoading: false,
                tableLoading: false
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfareWelfareOrder.searchPrizeOrderCondition
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setPrizeOrderCondition: "welfareWelfareOrder/setPrizeOrderCondition"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            getList() {
                let params = {
                    condition: {},
                    page: this.page.page,
                    limit: this.page.limit
                };
                this.tableLoading = true;
                this.searchForm.timeRange?(params.condition.timeStart=moment(this.searchForm.timeRange[0]).format("X"), params.condition.timeEnd=moment(this.searchForm.timeRange[1]).format("X")):"";
                this.searchForm.awardUsage?params.condition.awardUsage=this.searchForm.awardUsage:"";
                this.searchForm.orderId?params.condition.orderId=this.searchForm.orderId:"";
                this.searchForm.userTel?params.condition.userTel=this.searchForm.userTel:"";
                this.searchForm.lottery?params.condition.lottery=this.searchForm.lottery:"";
                this.searchForm.userType?params.condition.userType=this.searchForm.userType:"";
                this.searchForm.categoryCode?params.condition.categoryCode=this.searchForm.categoryCode:"";
                this.searchForm.goodsName?params.condition.goodsName=this.searchForm.goodsName:"";
                this.searchForm.goodsType?params.condition.goodsType=this.searchForm.goodsType:"";
                
                this.$http.get(this.$api.jMallOBMOrderQPage, params, true).then(res=>{
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.setPrizeOrderCondition(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                    this.searchLoading = false;
                })
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                this.setPrizeOrderCondition(null);
                this.searchForm = {};
                this.page.page = 1;
                this.getList();
            },
            //查看订单
            viewOrder(orderId) {
                this.$router.push({path: "/orderDetails", query: { id: orderId }});
            },
            //订单状态
            formatterLottery(row) {
                return enumFormatter(row.lottery, EnumStatus);
            }
        },
        filters: {
            formatType(val) {
                if(val) {
                    return enumFormatter(val, PrizeUsageEnum)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './orderList.scss'
</style>

