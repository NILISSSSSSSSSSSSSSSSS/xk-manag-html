<template>
    <div class="order-info">
        <el-row>
            <el-col :span="8">订单类型：{{ detail.awardUsage | formatUsage }}</el-col>
            <el-col :span="8">订单ID：{{ detail.orderId }}</el-col>
            <el-col :span="8">下单时间：{{ detail.createdAt | formatTime }}</el-col>
            <el-col :span="8">购买注数：{{ detail.orderNumber }}次</el-col>
            <el-col :span="8">每注：{{ detail.eachPrice? $math.divide(detail.eachPrice, 100) : 0 }}  消费券</el-col>
            <el-col :span="8">订单总金额：{{ detail.price? $math.divide(detail.price, 100) : 0 }}</el-col>
            <el-col :span="8">兑奖方式：消费券</el-col>
            <el-col :span="8">兑奖号码：{{ detail.lotteryNumbers }}</el-col>
            <el-col :span="8">订单状态：{{ detail.orderStatus | formatStatus }}</el-col>
        </el-row>
    </div>
</template>
<script>
    import { enumFormatter } from '../../util/publicMehotds.js';
    import { EnumUsage } from '../../util/publicParams.js';
    const EnumOrderStatus = [
        {key: 'NO_LOTTERY', value: '未开奖'},
        {key: 'LOSING_LOTTERY', value: '未中奖'},
        {key: 'SHARE_LOTTERY', value: '已晒单'},
        {key: 'SHARE_AUDIT_ING', value: '晒单审核中'},
        {key: 'SHARE_AUDIT_FAIL', value: '晒单未通过'},
        {key: 'NOT_SHARE', value: '未分享'},
        {key: 'WAIT_FOR_RECEVING', value: '待领取'},
        {key: 'NOT_DELIVERY', value: '未发货'},
        {key: 'DELIVERY', value: '已发货'},
        {key: 'RECEVING', value: '已收货'},
        {key: 'CHANGED', value: '已换货'},
        {key: 'SHARE_LOTTERY', value: '已晒单'}
    ]
    export default {
        props: {
            detail: {
                type: Object,
                default: ()=>({})
            }
        },
        filters: {
            formatStatus(val) {
                return enumFormatter(val, EnumOrderStatus)
            },
            formatUsage(val) {
                return enumFormatter(val, EnumUsage)
            }
        }
    }
</script>
<style scoped lang="scss">
    .order-info {
        /deep/ .el-col {
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
        }
    }
</style>
