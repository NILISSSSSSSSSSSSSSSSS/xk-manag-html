<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>订单记录
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :laoding="searchLoading">搜索</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search" ref="searchForm">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="订单ID：" >
                            <el-input :size="$size" v-model="searchForm.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单类型：">
                            <el-select v-model="searchForm.type" :size="$size">
                                <el-option v-for="item in orderType" :label="item.label" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="消费充值日期：" >
                            <el-col :span="11">
                                <el-date-picker type="date" value-format="timestamp" :size="$size" v-model="searchForm.start"></el-date-picker>
                            </el-col>
                            <el-col :span="2" style="text-align: center">-</el-col>
                            <el-col :span="11">
                                <el-date-picker type="date" value-format="timestamp" :size="$size" v-model="searchForm.end"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型：">
                            <el-select v-model="searchForm.type" :size="$size">
                                <el-option v-for="item in type" :label="item.label" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <el-table stripe :data="tableData" v-loading="tableLoading" style="margin-top: 20px"
            v-if="searchForm.type ==='welfare'" key="welfare">
                <el-table-column label="订单ID" prop="orderId"></el-table-column>
                <el-table-column label="用户ID" prop="userId" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户账号" prop="userTel" width="120"></el-table-column>
                <el-table-column label="订单类型" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.awardUsage==='expense'?'运营专用奖品': '福利抽奖' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品名称" prop="goodsName" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="适用对象" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.awardUsage!=='welfare'">{{ scope.row.userType==='user'? '普通用户': '商户' }}</span>
                        <span v-else>所有用户</span>
                    </template>
                </el-table-column>
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
                <el-table-column label="订单状态">
                    <template slot-scope="scope">
                        {{getLottery(scope.row.lottery)}}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="primary" @click="viewOrder(scope.row.orderId)">查看订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-loading="tableLoading" border :data="tableData" style="margin-top: 20px"
            v-if="searchForm.type === 'selfMall'" key="selfMall">
                <el-table-column prop="orderId" label="订单ID"></el-table-column>
                <el-table-column width="200" label="下单日期">
                    <template slot-scope="scope">
                        {{ scope.row.orderTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" width="160" label="用户手机号"></el-table-column>
                <el-table-column width="130" label="用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.userType ==='user'? '普通用户': '商户' }}
                    </template>
                </el-table-column>
                <el-table-column width="130" label="支付方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payChannelIn">
                            {{ scope.row.payChannelIn }}
                        </span>
                        <div v-else>
                            <p v-for="(item, index) in JSON.parse(scope.row.payChannel)" :key="index">
                                {{ item.payChannel | formatTicket }}
                                <!-- {{getTicket(item.payChannel)}} -->
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="130" label="是否开发票">
                    <template slot-scope="scope">
                        {{ scope.row.isNeedInvoice === '0'? '否': '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalPrice" width="200" label="订单总金额">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.payChannelIn && !scope.row.payChannel">
                            {{ $math.divide(scope.row.payMoney, 100).toFixed(2) }} 元
                        </span>
                        <div v-else>
                            <p v-for="(item, index) in JSON.parse(scope.row.payChannel)" :key="index">
                                <span v-if="item.payChannel=='alipay' || item.payChannel=='wxpay' ||item.payChannel=='tfAlipay' ||item.payChannel=='tfWxpay' ||item.payChannel=='applePay' ">{{ $math.divide(item.amount, 100).toFixed(2)+'  元' }}</span>
                                <span v-else>
                                    {{ $math.divide(item.amount, 100).toFixed(2) +'  ' }}{{ item.payChannel | formatTicket }}
                                </span> 
                            </p>
                        </div>  
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="viewDetails(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table  v-loading="tableLoading" border :data="tableData" style="margin-top: 20px"
            v-if="searchForm.type === 'business'" key="business">
                <el-table-column label="所属城市" prop="areaCode">
                    <template slot-scope="scope">
                        <!-- {{getPorvinceInfo(scope.row.areaCode)}} -->
                        {{scope.row.areaCode}}
                    </template>
                </el-table-column>
                <el-table-column label="订单号" prop="orderId"></el-table-column>
                <el-table-column label="交易时间">
                    <template slot-scope="scope">
                        {{scope.row.createAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="付款用户ID" prop="userId"></el-table-column>
                <el-table-column label="用户账号" prop="userPhone"></el-table-column>
                <el-table-column label="收款联盟商ID" prop="merchantId"></el-table-column>
                <el-table-column label="交易类型" prop="areaCode">
                    <template slot-scope="scope">
                        {{getBusinessType(scope.row.sceneStatus)}}
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" prop="payAmount">
                    <template slot-scope="scope">
                        {{scope.row.payAmount / 100}}
                    </template>
                </el-table-column>
                <el-table-column label="订单状态">
                    <template slot-scope="scope">
                        {{getBusinessOrderStatus(scope.row.orderStatus)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="goBusinessMallDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
//枚举奖品用途
    const EnumUsage = [{key: '', value: '全部'},{key: 'expense', value: '运营专用奖品'},{key: 'welfare', value: '福利抽奖'}];
    //枚举奖品类型
    const EnumType = [{key: '', value: '全部'},{key: 'substance', value: '实物奖品'},{key: 'virtual', value: '虚拟奖品'}];
    //枚举开奖装填
    const EnumStatus = [{key: '', value: '全部'},{key: 'NO_LOTTERY', value: '待开奖'},{key: 'WINNING_LOTTERY', value: '已中奖'},{key: 'SHARE_AUDIT_ING', value: '晒单审核中'},{key: 'SHARE_AUDIT_FAIL', value: '晒单未通过'},{key: 'LOSING_LOTTERY', value: '未中奖'},{key: 'SHARE_LOTTERY', value: '已晒单'}, {key: 'NOT_SHARE', value: '待分享'}];
    //枚举适用对象
    const EnumUserType = [{key: '', value: '全部'},{key: 'muser', value: '商户'},{key: 'user', value: '普通用户'}];//,{key: 'suser', value: '系统管理员'}

    const EnumOrderStatus = [{key: '', value: '全部'},{key: 'PRE_PAY', value: '待支付'},{key: 'PRE_SHIP', value: '待配送'},{key: 'PRE_RECEVICE', value: '待收货'},{key: 'PRE_EVALUATE', value: '待评价'},{key: 'COMPLETELY', value: '已完成'}]
import  { EnumTicketType, EnumBusinessType, EnumBusinessOrderStatus } from '@/util/publicParams.js';
import { getPorvinceInfo } from '@/util/publicMehotds'
export default {
    name: 'userOrderRecord',
    data() {
        return {
            searchForm: {type: 'welfare'},
            searchLoading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            tableLoading: false,
            tableData: [],
            orderType: [
                {key: 'welfare', label: '夺奖派对订单'},
                {key: 'selfMall', label: '自营商城订单'},
                {key: 'business', label: '商圈订单'}
            ],
            getPorvinceInfo: getPorvinceInfo
        }
    },
    watch: {
        'searchForm.type': {
            handler(val) {
                this.tableData = [];
                this.pageData.currentPage = 1;
                if(val === 'welfare') {
                    this.getWelfareList();
                } else if(val === 'selfMall') {
                    this.getSelfMallList();
                } else if(val === 'business') {
                    this.getBusinessList()
                }
            }
        }
    },
    created() {
        this.getWelfareList();
    },
    methods: {
       changePage(page, pageSize) {
                this.pageData.limit = pageSize;
                this.pageData.currentPage = page;
                if(this.searchForm.type === 'welfare') {
                    this.getWelfareList();
                } else if(this.searchForm.type ==='selfMall') {
                    this.getSelfMallList();
                } else if(this.searchForm.type === 'business') {
                    this.getBusinessList();
                }
                
            },
            getWelfareList() { // 夺奖派对订单列表
                let params = {
                    condition: {
                        userId: this.$route.query.id,
                        orderId: this.searchForm.id
                    },
                    page: this.pageData.currentPage,
                    limit: this.pageData.pageSize
                };
                this.tableLoading = true
                this.$http.get(this.$api.jMallOBMOrderQPage, params, true).then(res=>{
                    this.tableData = res? res.data: [];
                    this.tableLoading = false;
                    console.log(res.data)
                    this.pageData.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                })
            },
            search() {
                this.pageData.currentPage = 1;
                this.searchLoading = true;
                if(this.searchForm.type === 'welfare') {
                    this.getWelfareList();
                } else if(this.searchForm.type ==='selfMall') {
                    this.getSelfMallList();
                } else if(this.searchForm.type === 'business') {
                    this.getBusinessList();
                }
            },
            //查看订单
            viewOrder(orderId) {
                this.$router.push({path: "/orderDetails", query: { id: orderId, origin: 'userOrderRecord' }});
            },
            //订单状态
            getLottery(val) {
                let name = ''
                for(let item of EnumStatus) {
                    if(item.key === val) {
                        name = item.value;
                        break;
                    }
                }
                return name;
            },
            getSelfMallList() { // 自营商城订单列表
                let params = {
                    condition: {
                        userId: this.$route.query.id,
                        orderId: this.searchForm.id
                    },
                    page: this.pageData.currentPage,
                    limit: this.pageData.pageSize
                };
                this.tableLoading = true
                this.$http.get(this.$api.mallOBMOrderQPage, params, true).then(res=>{
                    this.tableData = res.data;
                    this.tableLoading = false;
                    console.log(res.data)
                    this.pageData.total = res.total;
                })
                .catch(err=>{
                    err.code===409? this.tableData=[]:"";
                    this.$message.error(err.message);
                    this.tableLoading = false;
                })
            },
            viewDetails(row) { // 自营订单详情
                this.$router.push({path:'/orderListAfterSaleDetail',query:{type: 100,orderId: row.orderId}});
            },
            getBusinessList() {
                let paramList = {
                    id: this.$route.query.id,
                    orderId: this.searchForm.id,
                    limit: this.pageData.pageSize,
                    page: this.pageData.currentPage
                }
                console.log(paramList)
                this.tableLoading = true
                this.$http.get(this.$api.userShopOrderQPage, paramList, true)
                .then(res => {
                    this.tableLoading = false
                    this.tableData = res.data
                    console.log(res.data)
                    this.pageData.total = res.total
                })
                .catch(err => {
                    this.$message.error(err.message)
                    this.tableLoading = false
                })
            },
            getBusinessType(val) { // 商圈订单交易类型
                let name = ''
                for(let item of EnumBusinessType) {
                    if(val === item.key) {
                        name = item.label
                        break;
                    }
                }
                return name
            },
            getBusinessOrderStatus(val) { // 商圈订单状态
                let name = ''
                for(let item of EnumBusinessOrderStatus) {
                    if(val === item.key) {
                        name = item.label
                        break;
                    }
                }
                return name
            },
            goBusinessMallDetail(val) {
                this.$router.push({path: '/buinessMallDetail', query: {orderId: val.orderId}})
            }
        },
        filters: {
            formatTicket(val) {
                if(val) {
                    let name = ''
                    EnumTicketType.forEach(item=>{
                        if(item.key === val) {
                            name = item.value;
                            return false;
                        }
                    })

                    return name? name: val;
                }
            }
        }
}
</script>

<style>

</style>
