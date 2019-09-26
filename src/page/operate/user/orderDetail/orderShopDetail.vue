<template>
    <div class="xk-container">
        <div class="xk-radius">
           <div class='xk-title'>
            <div class="vus-title">
                <span></span>订单详情
            </div>
            <div class="vus-bottom"></div>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">订单信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">订单ID: {{detailData.orderDetail.orderNo}}</el-col>
                    <el-col :span="8">支付时间: {{detailData.orderDetail.payTime | formatTime}}</el-col>
                    <el-col :span="8">支付方式: {{getPayChannel(detailData.orderDetail.payChannel)}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">下单时间:{{detailData.orderDetail.createTime | formatTime}}</el-col>
                    <el-col :span="8">订单总金额: {{$math.divide(detailData.orderDetail.amount, 100)}}元</el-col>
                    <el-col :span="8">订单类型: {{detailData.userDetail ? '用户充值' : '商户充值'}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.userDetail">
                <el-row>
                    <el-col :span="12" class="title">用户信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goUserDetail(detailData.userDetail.id)">用户详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">是否实名认证: {{detailData.userDetail.auth ? '是': '否'}}</el-col>
                    <el-col :span="8">用户名: {{detailData.userDetail.name}}</el-col>
                    <el-col :span="8">用户账号: {{detailData.userDetail.phone}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.userDetail.cityCode)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.merchantDetail">
                <el-row>
                    <el-col :span="12" class="title">联盟商信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goMuserDetail(detailData.merchantDetail.id)">查看详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">联盟商ID: {{detailData.merchantDetail.id}}</el-col>
                    <el-col :span="8">姓名: {{detailData.merchantDetail.name}}</el-col>
                    <el-col :span="8">用户账号: {{detailData.merchantDetail.phone}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.merchantDetail.cityCode)}}</el-col>
                </el-row>
            </el-card>
           
        </div>
        </div>
    </div>
    
</template>

<script>
import { getPorvinceInfo } from "@/util/publicMehotds"
import { EnumPayWay } from '@/util/publicParams'
export default {
    name: 'orderShopDetail',
    data() {
        return {
            detailData: {
                merchantDetail: {},
                userDetail: {},
                orderDetail: {}
            },
            getPorvinceInfo: getPorvinceInfo
        }
    },
    created() {
        this.getDetailData();
    },
    methods: {
        goUserDetail(userId) {
            this.$router.push({path: '/userDetail', query: {id: userId}})
        },
        goMuserDetail(merchantId) {
            this.$router.push({path: '/businessDetail', query: {id: merchantId}})
        },
        getDetailData() {
            let paramList = {
                action: this.$route.query.source,
                currency: this.$route.query.type,
                id: this.$route.query.id
            }
            this.$http.get(this.$api.userAccBillDetail, paramList, true)
            .then(res => {
                this.detailData = res;
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getPayChannel(val) { // 支付方式
            let name = ''
            for(let item of EnumPayWay) {
                if(val === item.key) {
                    name = item.value
                    break;
                }
            }
            return name;
        },
    }
}
</script>

<style lang="scss" scoped>
.title {
    font-weight: 600;
}
.line {
    height: 1px;
    width: 100%;
    background-color: #e3e3e3;
    margin: 10px 0;
}
.info-content {
    margin-left: 20px;
    font-size: 14px;
    min-height: 30px;
    line-height: 30px;
}
.income-title {
    color: #0000FF;
}
.blue-line {
    height: 1px;
    width: 100px;
    background-color: #0000FF;
}
/deep/ .el-table th {
    padding: 0 0 ;
}
/deep/ .el-table--border th {
    border: none;
}

</style>
