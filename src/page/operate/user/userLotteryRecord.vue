<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>消费抽奖记录
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form :label-position="right" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="流水号：" >
                        <el-input :size="$size" v-model="searchForm.id" placeholder="请输入流水号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发放场景：" >
                        <el-select v-model="searchForm.drawTicketType" :size="$size">
                            <el-option v-for="item in EnumDrawTicketType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="奖券状态：" >
                        <el-select v-model="searchForm.status" :size="$size">
                            <el-option v-for="item in drawStatus" :key="item.key" :label="item.label" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="选择日期时间：" >
                        <el-col :span="11">
                            <el-date-picker :size='$size' value-format="timestamp" v-model="searchForm.startTime"></el-date-picker>
                        </el-col>
                        <el-col :span="2" style="text-align: center">至</el-col>
                        <el-col :span="11">
                            <el-date-picker :size='$size' value-format="timestamp" v-model="searchForm.endTime"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loading">
                <el-table-column label="流水号" prop="id"></el-table-column>
                <el-table-column label="发出时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="所属城市">
                    <template slot-scope="scope">
                        {{getPorvinceInfo(scope.row.districtCode)}}
                    </template>
                </el-table-column>
                <el-table-column label="所属模板" prop="templateName"></el-table-column>
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
                <el-table-column label="领取用户ID" prop="userId"></el-table-column>
                <el-table-column label="用户账号" prop="phone"></el-table-column>
                <el-table-column label="用户昵称" prop="username"></el-table-column>
                 <el-table-column label="奖券状态">
                     <template slot-scope="scope">
                        {{scope.row.ticketStatus === 'used' ? '已使用' : scope.row.ticketStatus === 'unused' ? '未使用' :'已过期'}}
                    </template>
                 </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="openOrderDetail(scope.row)" v-if="scope.row.source === 'plat'">查看详情</el-button>
                        <el-button :size="$size" type="text" @click="goLotteryDetailShop(scope.row)" v-if="scope.row.source != 'plat'">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="选择订单" :visible.sync="selectDialog" v-if="this.orderDetail.serialNums" width="500px">
            <el-row v-for="item of this.orderDetail.serialNums" :key="item" style="margin-bottom: 10px">
                <el-col :span="18">订单号：{{item}}</el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button :size="$size" type="text" @click="goLotteryDetail(item)">查看详情</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { getPorvinceInfo } from '@/util/publicMehotds'
import { EnumDrawTicketType } from '@/util/publicParams'
export default {
    name: 'userGiftRecord',
    data() {
        return {
            searchForm: {drawTicketType: 'consumption_ticket'},
            tableData: [{name: '占位'}],
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            drawStatus: [
                {key: '', label: '全部'},
                {key: 'used', label: '已使用'},
                {key: 'unused', label: '未使用'},
                {key: 'invalid', label: '已过期'}
            ],
            EnumDrawTicketType: EnumDrawTicketType,
            getPorvinceInfo: getPorvinceInfo,
            selectDialog: false,
            orderDetail: {
                serialNums: []
            },
            source: ''
        }
    },
    created() {
        this.getLotteryList();
    },
    watch: {
        'searchForm.drawTicketType'() {
            this.getLotteryList();
        }
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getLotteryList();
        },
        resetForm() {
            this.pageData.currentPage = 1
            this.searchForm = {drawTicketType: 'consumption_ticket'};
            this.getLotteryList();
        },
        goLotteryDetail(val) { // 推广和消费抽奖
            this.$router.push({path: '/orderLotteryDetail', query: {serialNum: val, source: this.source}})
        },
        goLotteryDetailShop(val) { // 店铺消费抽奖
            this.$router.push({path: '/orderLotteryDetail', query: {orderId: val.id, source: val.source}})
        },
        getLotteryList() {
            this.loading = true
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                qUserId: this.$route.query.id,
                id: this.searchForm.id,
                drawTicketType: this.searchForm.drawTicketType, // 必传
                drawStatus: this.searchForm.status,
                startTime: this.searchForm.startTime / 1000,
                endTime: this.searchForm.endTime / 1000
            }
            console.log(paramList)
            this.$http.get(this.$api.drawTicketInOBMQPage, paramList, true)
            .then(res => {
                this.loading = false
                this.tableData = res.data
                console.log('data', res.data)
                this.pageData.total = res.total
            })
            .catch(err => {
                this.loading = false
                this.$message(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getLotteryList();
        },
        openOrderDetail(val) {
            this.selectDialog = true
            this.source = val.source
            this.orderDetail.serialNums =  val.serialNums ? val.serialNums : []
        }
    },
}
</script>

<style>

</style>
