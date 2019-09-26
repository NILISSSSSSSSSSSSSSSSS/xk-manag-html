<template>
    <div>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>优惠卡券列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="120px" :model="searchForm" class="xk-search" ref="searchForm">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="卡劵类型：">
                            <el-select v-model="searchForm.type" :size="$size">
                                <el-option v-for="item in type" :label="item.label" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <el-table style="margin-top: 20px" width="100%" stripe v-loading="loading" v-show="searchForm.type === 'yhq'" :data="tableData">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="优惠券ID" prop="couponId"></el-table-column>
                <el-table-column label="优惠券名称" prop="name" ></el-table-column>
                <el-table-column label="类型" prop="cardType">
                    <template slot-scope="scope">
                        {{getXfqCouponType(scope.row.couponType)}}
                    </template>
                </el-table-column>
                <el-table-column label="范围" prop="couponScope">
                    <template slot-scope="scope">
                        {{getXfqCouponScope(scope.row.couponScope)}}
                    </template>
                </el-table-column>
                <el-table-column label="生效时间" prop="validTime">
                    <template slot-scope="scope">
                        {{scope.row.validTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" prop="invalidTime">
                    <template slot-scope="scope">
                        {{scope.row.invalidTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{getXfqCouponStatus(scope.row.couponStatus)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" :loading="scope.row.loading" @click="handleTicket(scope.row)"
                        :disabled="/^[0-9]*[1-9][0-9]*$/.test(scope.row.couponId)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <el-table style="margin-top: 20px" width="100%" stripe v-loading="loading" v-show="searchForm.type === 'hyk'" :data="tableUserData">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="会员卡ID" prop="memberId"></el-table-column>
                <el-table-column label="会员卡名称" prop="name" ></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.cardType === 'VIP' ? 'VIP' : '普通'}}
                    </template>
                </el-table-column>
                <el-table-column label="生效时间">
                    <template slot-scope="scope">
                        {{scope.row.validTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template slot-scope="scope">
                        {{scope.row.invalidTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{getNewStatus(scope.row.newStatus)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" :loading="scope.row.loading" @click="handleVip(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <vip-card-detail :visible.sync="vipDialog" :details="VipDetail" :trade="trade"></vip-card-detail>
        <discount-ticket-detail :visible.sync="ticketDialog" :detailForm="ticketDetail"></discount-ticket-detail>
    </div>
</template>

<script>
import { EnumCouponStatus, EnumnewStatus, EnumCouponScope, EnumCouponType} from '@/util/publicParams'
import VipCardDetail from '@/components/operate/VipCardDetail'
import DiscountTicketDetail from '@/components/operate/DiscountTicketDetail'
export default {
    name: 'YhqList',
    props: {
        name: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            searchForm: {type: 'yhq'},
            type: [
                {key: 'yhq', label: '优惠券'},
                {key: 'hyk', label: '会员卡'},
            ],
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            tableData: [],
            tableUserData:[],
            vipDialog: false,
            ticketDialog: false,
            ticketDetail: {},
            VipDetail: {},
            trade: false // true是商圈，false是自营
        }
    },
    watch: {
        name(val) {
            if(val == 'yhq') {
                this.getYhqList();
            }
        },
        'searchForm.type': {
            handler(val) {
                [this.pageData.pageSize, this.pageData.currentPage] = [10,1];
                if(val === 'yhq') {
                    this.getYhqList();
                } else {
                    this.getUserMemeberList();
                }
            },
            deep: true
        }
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getYhqList();
        },
        resetForm() {
            this.searchForm= {type: 'yhq'};
            this.pageData.currentPage = 1;
            this.getYhqList();
        },
        getXfqCouponType(val) { // 优惠券类型
            let name = ''
            for(let item of EnumCouponType) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name
        },
        getXfqCouponScope(val) { // 优惠券使用范围
            let name = ''
            for(let item of EnumCouponScope) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name
        },
        getXfqCouponStatus(val) { // 优惠券使用状态
            let name = ''
            for(let item of EnumCouponStatus) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name
        },
        getNewStatus(val) { // 会员卡状态
            let name = ''
            for(let item of EnumnewStatus) {
                if(val === item.key) {
                    name = item.label
                    break;
                }
            }
            return name
        },
        getYhqList() { // 
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                id: this.$route.query.id,
                // condition: {}
            }
            console.log(paramList)
            this.loading = true
            this.$http.get(this.$api.userCouponQPage, paramList, true)
            .then(res => {
                this.loading = false;
                this.tableData = res? res.data: []
                this.pageData.total = res? res.total: 0;
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        getUserMemeberList() { // 会员卡列表
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                id: this.$route.query.id,
                // condition: {}
            }
            this.loading = true
            this.$http.get(this.$api.UserMemberCardQPage, paramList, true)
            .then(res => {
                console.log(res)
                this.loading = false;
                this.tableUserData = res? res.data: []
                this.pageData.total = res? res.total: 0
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getYhqList();
        },
        handleTicket(val) {
            this.$set(val, 'loading', true)
            if(val.source === 'shop'|| val.source=== 'shop_lottery') {
                this.trade = true
            } else {
                this.trade = false
            }
            this.$http.get(this.$api.cardCouponDetail, {id: val.couponId}, true)
            .then(res => {
                this.$set(val, 'loading', false)
                this.ticketDetail = res
                this.ticketDialog = true
            })
            .catch(err => {
                this.$set(val, 'loading', false)
                this.$message.error(err.message)
            })
        },
        handleVip(val) {
            // this.vipDialog = true
            this.$set(val, 'loading', true)
            this.$http.get(this.$api.cardMemberCardDetail, {id: val.memberId}, true)
            .then(res => {
                this.VipDetail = res
                this.$set(val, 'loading', false)
                this.vipDialog = true
            })
            .catch(err => {
                this.$message.error(err.message)
                this.$set(val, 'loading', false)
            })
        }
    },
    components: {
        VipCardDetail,
        DiscountTicketDetail
    }
}
</script>

<style>

</style>
