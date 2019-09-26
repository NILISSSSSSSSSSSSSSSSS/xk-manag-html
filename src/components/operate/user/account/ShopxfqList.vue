<template>
    <div>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>{{title}}
                </div>
                <div class="vus-btn">
                    <el-button type="plain" :size="$size" @click="goShopList" v-if="list ==='detail'">返回店铺消费券列表</el-button>
                </div>
                <!-- <div class="vus-bottom"></div> -->
            </div>
        </div>
        <div class="xk-radius margintop20">
            <el-table style="margin-top: 20px" width="100%" stripe v-loading="loading" :data="tableData" v-if="list === 'list'" key="list">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="店铺ID" prop="shopId"></el-table-column>
                <el-table-column label="店铺名称" prop="shopName"></el-table-column>
                <el-table-column label="地址" prop="address"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.accStatus === 'frozen' ? '冻结' : '正常'}}
                    </template>
                </el-table-column>
                <el-table-column label="余额" prop="newTotalMoney"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="goShopDetail(scope.row.shopId)">店铺详情</el-button>
                        <el-button :size="$size" type="text" @click="changeList(scope.row.merchantId)">查看明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table style="margin-top: 20px" width="100%" stripe v-loading="loading" :data="tableDetailData" v-if="list === 'detail'" key="detail">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="消费/充值单号" prop="orderNo"></el-table-column>
                <el-table-column label="消费/充值时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="金额(元)">
                    <template slot-scope="scope">
                        {{ scope.row.newAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.billType === 'fi' ? '收入' : '支出'}}
                    </template>
                </el-table-column>
                <el-table-column label="去向/来源">
                    <template slot-scope="scope">
                        {{scope.row.tradeProduct === 'activity' ? '抽奖赠送' : '店铺消费'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="handleOrderDetail(scope.row)">订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <el-dialog title="选择订单" :visible.sync="selectDialog" v-if="this.orderDetail.orderNoList" width="500px">
            <el-row v-for="item of this.orderDetail.orderNoList" :key="item" style="margin-bottom: 10px">
                <el-col :span="18">订单号：{{item}}</el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button :size="$size" type="text" @click="selfOrBusinessDetail(item)">查看详情</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ShopxfqList',
    props: {
        name: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            searchForm: {},
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading: false,
            tableData: [],
            tabelDetailData: [],
            list: 'list', // list为外层列表， detail为内层的明细列表,
            title: '店铺消费券列表',
            merchantId: '',
            selectDialog: false,
            orderDetail: {
                orderNoList: []
            }
        }
    },
    watch: {
        name(val) {
            if(val == 'shopxfq') {
                this.getShopXfqList();
            }
        }
    },
    methods: {
        search() {},
        resetSearch() {},
        getShopXfqList() { // 店铺消费券列表
           this.loading = true
           let paramList = {
               page: this.pageData.currentPage,
               limit: this.pageData.pageSize,
               id: this.$route.query.id
           }
           this.$http.get(this.$api.userAccXfqsQPage, paramList, true)
           .then(res => {
               this.loading = false
               console.log(this.list)
               console.log(res)
               this.tableData = res.list
               this.pageData.total = res.total
           })
           .catch(err => {
               this.loading = false
               this.$message.error(err.message)
           })
        },
        goShopDetail(id) {
            console.log(123)
            this.$router.push({path: '/storeSecAuditInfo', query:{id: id}})
        },
        changeList(merchantId) {
            this.list = 'detail'
            this.title = '明细列表'
            this.merchantId = merchantId
            this.getDetailList();
        },
        goShopList() {
            this.list = 'list'
        },
        getDetailList() { // 明细列表
            this.loading = true
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                id: this.$route.query.id,
                merchantId: this.merchantId,
                orderNo: ''
            }
            console.log(paramList)
            this.$http.get(this.$api.userAccBillXfqsQPage, paramList, true)
            .then(res => {
                console.log(this.list)
                this.loading = false
                console.log('shop', res)
                this.tableDetailData = res.data
                this.pageData.total = res.total ? res.total : 0
            })
            .catch(err => {
                this.$message.error(err.message)
                this.loading = false
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            if(this.list === 'list') {
                this.getXkbList();
            } else {
                this.getDetailList();
            }
        },
        handleOrderDetail(val) {
            switch(val.tradeProduct) {
                case 'activity': // 抽奖赠送
                    this.$router.push({path: '/orderLotteryDetail', query: {orderId: val.orderNo, source: 'shop'}})
                    break;
                case 'o2o': // 店铺消费
                    // this.$router.push({path: '/buinessMallDetail', query: {type: 'xfqs', orderId: val.orderNo, source: val.tradeProduct}});
                    // break;
                    this.selectDialog = true
                    this.orderDetail.orderNoList =  val.orderNoList ? val.orderNoList : []
            }
        },
        selfOrBusinessDetail(orderId) { // 店铺消费详情
             this.$router.push({path: '/buinessMallDetail', query: {type: 'xfqs', orderId: orderId, source: 'o2o'}});
        }
    }
}
</script>

<style>

</style>
