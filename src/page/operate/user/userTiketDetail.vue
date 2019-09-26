<template>
    <div class="xk-container">
        <div class="xk-radius">
           <div class='xk-title'>
            <div class="vus-title">
                <span></span>券详情
            </div>
            <div class="vus-bottom"></div>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">券信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">优惠券ID: {{detailData.orderDetail.orderNo}}</el-col>
                    <el-col :span="8">优惠券名称: {{detailData.orderDetail.payTime | formatTime}}</el-col>
                    <el-col :span="8">类型: {{detailData.orderDetail.payChannel}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">范围:{{detailData.orderDetail.createTime | formatTime}}</el-col>
                    <el-col :span="8">折扣: {{detailData.orderDetail.amount}}</el-col>
                    <el-col :span="8">状态: </el-col>
                </el-row>
                 <el-row class="info-content">
                    <el-col :span="8">总量:{{detailData.orderDetail.createTime | formatTime}}</el-col>
                    <el-col :span="8">已领取: {{detailData.orderDetail.amount}}</el-col>
                    <el-col :span="8">每用户限领: </el-col>
                </el-row>
                 <el-row class="info-content">
                    <el-col :span="8">获取方式:{{detailData.orderDetail.createTime | formatTime}}</el-col>
                    <el-col :span="8">生效时间: {{detailData.orderDetail.amount}}</el-col>
                    <el-col :span="8">结束时间: </el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">状态:{{detailData.orderDetail.createTime | formatTime}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">可用单品</el-col>
                </el-row>
                <div class="line"></div>
                <el-table>
                    <el-table-column label="优惠券ID"></el-table-column>
                    <el-table-column label="优惠券名称"></el-table-column>
                    <el-table-column label="一级分类"></el-table-column>
                    <el-table-column label="二级分类"></el-table-column>
                    <el-table-column label="三级分类"></el-table-column>
                </el-table>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">领券用户</el-col>
                </el-row>
                <div class="line"></div>
                <el-table>
                    <el-table-column label="用户ID"></el-table-column>
                    <el-table-column label="用户名称"></el-table-column>
                    <el-table-column label="领券日期"></el-table-column>
                    <el-table-column label="是否使用"></el-table-column>
                </el-table>
            </el-card>
           
        </div>
        </div>
    </div>
    
</template>

<script>
import { getPorvinceInfo } from "@/util/publicMehotds"
export default {
    name: 'orderShopDetail',
    data() {
        return {
            detailData: {
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
        getDetailData() {
            let paramList = {
                action: this.$route.query.source,
                currency: this.$route.query.type,
                id: this.$route.query.id
            }
            console.log(paramList)
            this.$http.get(this.$api.userAccBillDetail, paramList, true)
            .then(res => {
                this.detailData = res
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
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
