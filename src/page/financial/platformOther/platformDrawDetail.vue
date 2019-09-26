<template>
    <div class="platform-red-package-detail xk-container">
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
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.id" :size="$size" placeholder="请输入流水账号" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发放场景：">
                            <el-select v-model="searchForm.drawTicketType" :size="$size" placeholder="请选择发放场景">
                                <el-option v-for="item in EnumDrawTicketType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖券状态：">
                            <el-select v-model="searchForm.status" :size="$size" placeholder="请选择奖券状态">
                                <el-option v-for="item in drawStatus" :key="item.key" :label="item.label" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发出时间：">
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
                <el-table-column label="流水号" prop="id"></el-table-column>
                <el-table-column label="发出时间" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="所属城市">
                    <template slot-scope="scope">
                        {{ getPorvinceInfo(scope.row.districtCode) }}
                    </template>
                </el-table-column>
                <el-table-column label="所属模板" prop="templateName" show-overflow-tooltip></el-table-column>
                <el-table-column label="奖券来源">
                    <template slot-scope="scope">
                        {{scope.row.source === 'shop' ? '店铺' : '平台'}}
                    </template>
                </el-table-column>
                <el-table-column label="领取用户类型">
                    <template slot-scope="scope">
                        {{scope.row.userType === 'user' ? '用户' : '商户'}}
                    </template>
                </el-table-column>
                <el-table-column label="领取用户ID" prop="userId" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户账号" prop="phone"></el-table-column>
                <el-table-column label="用户昵称" prop="username"></el-table-column>
                <el-table-column label="奖券状态">
                    <template slot-scope="scope">
                        {{scope.row.ticketStatus === 'used' ? '已使用' : scope.row.ticketStatus === 'unused' ? '未使用' :'已过期'}}
                    </template>
                </el-table-column>
                <el-table-column label="使用时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.usedTime">{{ scope.row.usedTime | formatTime }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="80">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.ticketStatus == 'used'" v-permission="'platformDrawDetailInfo'" :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="选择订单" :visible.sync="selectDialog" width="500px">
            <template v-if="orderDetail.serialNums">
                <el-row v-for="item of orderDetail.serialNums" :key="item" style="margin-bottom: 10px">
                    <el-col :span="18">订单号：{{item}}</el-col>
                    <el-col :span="6" style="text-align: center">
                        <el-button :size="$size" type="text" @click="goToDetail(item)" >查看详情</el-button>
                    </el-col>
                </el-row>
            </template>
            <template v-if="orderDetail.ids">
                <el-row v-for="item of orderDetail.ids" :key="item" style="margin-bottom: 10px">
                    <el-col :span="18">订单号：{{item}}</el-col>
                    <el-col :span="6" style="text-align: center">
                        <el-button :size="$size" type="text" @click="goToShopDetail(item)" >查看详情</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>
<script>
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import { EnumDrawTicketType } from '@/util/publicParams.js'
    export default {
        data() {
            return {
                EnumDrawTicketType,
                getPorvinceInfo,
                labelWidth: '150px',
                tableData: [],
                loadingSearch: false,
                loadingTable: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                drawStatus: [
                    {key: '', label: '全部'},
                    {key: 'used', label: '已使用'},
                    {key: 'unused', label: '未使用'},
                    {key: 'invalid', label: '已过期'}
                ],
                searchForm: {
                    drawTicketType: 'consumption_ticket'
                },
                selectDialog: false,
                orderDetail: {
                    serialNums: [],
                    ids: []
                }, // 当前订单的详情
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
                searchData: state => state.financialOther.draw
            })
        },
        methods: {
            ...mapMutations({
                setDraw: "financialOther/setDraw"
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
                [this.page.page, this.page.limit, this.searchForm] = [1,10,{drawTicketType: 'consumption_ticket'}];
                this.getList();
            },
            getList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    id: this.searchForm.id,
                    drawTicketType: this.searchForm.drawTicketType, // 必传
                    drawStatus: this.searchForm.status,
                    startTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): ''
                }
                if(this.searchForm.id&&isNaN(Number(this.searchForm.id))) {
                    this.$message.error('流水号必须为数字类型！');
                    this.loadingSearch = false;
                    return false;
                }
                this.loadingTable = true;
                this.$http.get(this.$api.drawTicketInOBMQPage, params, true).then(res=>{
                    this.setDraw(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = [];
                    this.page.total = 0;
                    this.$message.error('查询失败');
                })
            },
            getDetail(row) {
                // this.$router.push({
                //     path: '/orderLotteryDetail',
                //     query: {
                //         orderId: row.id,
                //         source: row.source
                //     }
                // })
                this.selectDialog = true
                this.orderDetail = row
            },
           goToDetail(serialNum) {
               this.$router.push({path: '/orderLotteryDetail', query: {orderId: serialNum, source: this.orderDetail.source, from: 'platform'}})
            },
            goToShopDetail(id) { // 店铺抽奖
                this.$router.push({path: '/orderLotteryDetail', query: {orderId: id, source: this.orderDetail.source}})
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-red-package-detail {

    }
</style>
