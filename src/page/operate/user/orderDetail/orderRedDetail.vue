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
                    <el-col :span="12" class="title">红包信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">红包ID: {{detailData.redPacketsBase.redPacketsId}}</el-col>
                    <el-col :span="8">发送用户类型: {{detailData.redPacketsBase.isAnchor == 1?'主播' :'普通用户'}}</el-col>
                    <el-col :span="8">红包个数: {{detailData.redPacketsBase.num}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">发送场景: {{getAppScene(detailData.redPacketsBase.appScene)}}</el-col>
                    <el-col :span="8">红包类型: {{detailData.redPacketsBase.isGivingToSingle == 1 ? '一对一' : '一对多'}}</el-col>
                    <el-col :span="8">发送时间: {{detailData.redPacketsBase.createdAt | formatTime}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">红包内容</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content" v-if="detailData.redPacketsReceiving && detailData.redPacketsReceiving.length > 0">
                    <el-col :span="8">红包内容: 
                        {{detailData.redPacketsReceiving[0].redPacketsType === 'xkb' ? '晓可币': detailData.redPacketsReceiving[0].redPacketsType === 'gift' ? '礼物' : '卡券'}}
                    </el-col>
                    <el-col :span="8" v-if="detailData.redPacketsReceiving.redPacketsType === 'xkb'">晓可币数量: {{detailData.redPacketsReceiving.count}}</el-col>
                </el-row>
                <el-table v-if="detailData.redPacketsReceiving && detailData.redPacketsReceiving.length > 0 && detailData.redPacketsReceiving[0].redPacketsType === 'cardCoupon'" :data="detailData.redPacketsContent.cardCoupons">
                    <el-table-column label="ID" prop="cardCouponId"></el-table-column>
                    <el-table-column label="名称" prop="cardCouponName"></el-table-column>
                    <el-table-column label="类型" prop="cardCouponType">
                        <template slot-scope="scope">
                            {{scope.row.cardCouponType === 'COUPON' ? '优惠券' : '会员卡'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="总量" prop="num"></el-table-column>
                    <el-table-column label="状态" prop="grabStatus">
                        <tempalte slot-scope="scope">
                            {{scope.row.grabStatus === 'doing' ? '未抢完': scope.row.grabStatus === 'over' ? '已抢完' : '已过期'}}
                        </tempalte>
                    </el-table-column>
                </el-table>
                <el-row v-if="detailData.redPacketsReceiving && detailData.redPacketsReceiving.length > 0  && detailData.redPacketsReceiving[0].redPacketsType=== 'gift'">
                    <el-row class="info-content">
                        <el-col :span="8">礼物ID: {{detailData.redPacketsContent.gift.giftId}}</el-col>
                        <el-col :span="8">名称: {{detailData.redPacketsContent.gift.giftName}}</el-col>
                        <el-col :span="8">类型: {{detailData.redPacketsContent.gift.giftSize == 1 ? '大': 
                            detailData.redPacketsContent.gift.giftSize == 2 ? '中': '小'}}</el-col>
                    </el-row>
                    <el-row class="info-content">
                        <el-col :span="8">礼物总额: {{$math.divide(detailData.redPacketsContent.gift.giftTotalPrice, 100)}}</el-col>
                        <el-col :span="8">礼物数量: {{detailData.redPacketsContent.gift.giftNum}}</el-col>
                        <el-col :span="8">状态: {{detailData.redPacketsContent.gift.grabStatus === 'doing' ? '未抢完': detailData.redPacketsContent.gift.grabStatus === 'over' ? '已抢完' : '已过期'}}</el-col>
                    </el-row>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">领取信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-table :data="detailData.redPacketsReceiving">
                    <el-table-column label="领取用户ID" prop="userId"></el-table-column>
                    <el-table-column label="领取用户昵称" prop="userName"></el-table-column>
                    <el-table-column label="领取时间">
                        <template slot-scope="scope">
                            {{scope.row.receivingTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="领取红包内容">
                        <template slot-scope="scope">
                            {{getRedPacketsType(scope.row.redPacketsType)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="领取数量" prop="count"></el-table-column>
                </el-table>
            </el-card>
           <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">发送红包用户信息</el-col>
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
        </div>
        </div>
    </div>
    
</template>

<script>
import { getPorvinceInfo } from "@/util/publicMehotds"
import { AppScene, RedPacketsType } from "@/util/publicParams"
export default {
    name: 'userRedDetail',
    data() {
        return {
            detailData: {
                redPacketsBase: {},
                redPacketsContent: {},
                redPacketsReceiving: [
                    {redPacketsType: ''}
                ],
                userDetail: {}
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
        goCardDetail() {},
        getDetailData() {
            let paramList = {},
                url = this.$api.userAccBillDetail;
            if(this.$route.query.type) {
                paramList = {
                    action: this.$route.query.source,
                    currency: this.$route.query.type,
                    id: this.$route.query.id
                }
            }else{
                paramList = {
                    orderNo: this.$route.query.id
                }
                url = this.$api.redPacketsDetail;
            }
            this.$http.get(url, paramList, true)
            .then(res => {
                this.detailData = res
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getAppScene(val) { // 红包场景
            let name = ''
            for(let item of AppScene) {
                if(item.key === val) {
                    name = item.label
                    break;
                }
            }
            return name;
        },
        getRedPacketsType(val) { // 红包类型
            let name = ''
            for(let item of RedPacketsType) {
                if(item.key === val) {
                    name = item.label;
                    break;
                }
            }
            return name;
        }
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

/deep/ .el-table--border th {
    border: none;
}

</style>
