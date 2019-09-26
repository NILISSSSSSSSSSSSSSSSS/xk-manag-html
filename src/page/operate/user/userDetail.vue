<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>会员详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-card style="margin-bottom: 10px">
                <div>基本信息</div>
                <el-row>
                    <el-col class="info">用户UID：{{detailData.baseInfo.uid}}</el-col>
                    <el-col class="info">用户ID：{{detailData.baseInfo.id}}</el-col>
                    <el-col class="info">用户昵称：{{detailData.baseInfo.nickname}}</el-col>
                    <el-col class="info">用户头像：<img :src="detailData.baseInfo.avatar" class="imgSize"/></el-col>
                    <el-col class="info">手机号码：{{detailData.baseInfo.phone}}</el-col>
                    <el-col class="info">性别：{{detailData.baseInfo.sex === 'male' ? '男' : detailData.baseInfo.sex === 'female' ? '女' : '保密'}}</el-col>
                    <el-col class="info">生日：{{detailData.baseInfo.birthday | formatTime("YYYY-MM-DD")}}</el-col>
                    <el-col class="info">推荐人员工安全码：{{detailData.baseInfo.erCode}}</el-col>
                    <el-col>
                        <el-row>
                            <el-col class="info" :span="4">推荐人商户安全码：{{detailData.baseInfo.mrCode}}</el-col>
                            <el-col :span="10">
                                <el-button :size='$size' type="primary" @click="goBusiness(detailData.baseInfo.mrCode)">查看所属联盟商详情</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="info">所在城市：{{getPorvinceInfo(detailData.baseInfo.districtCode)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <div>实名认证</div>
                <el-row>
                    <el-col class="info">真实姓名：{{detailData.xkUserAuth.realName}}</el-col>
                    <el-col class="info">身份证号：{{detailData.xkUserAuth.idCardNum}}</el-col>
                    <el-col class="info">身份证正反面：
                        <img :src="detailData.xkUserAuth.idCardImageBack" style="width: 100px;height: 80px;vertical-align:bottom"/>
                        <img :src="detailData.xkUserAuth.idCardImageFront" style="width: 100px;height: 80px;vertical-align:bottom"/>
                    </el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12">账户信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goUserAccount(detailData.baseInfo.id)">查看账号详情</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="info">晓可币账户余额：{{ detailData.userAcc.userAccXkb }}</el-col>
                    <el-col class="info">消费券账户余额：{{ detailData.userAcc.userAccXfq }}</el-col>
                </el-row>
            </el-card>
             <el-card style="margin-bottom: 10px">
               <el-row>
                    <el-col :span="12">可友相关业务</el-col>
                    <!-- <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary">查看可友圈详情</el-button>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col class="info">添加可友数量：{{detailData.userRelationship.friendCount}}</el-col>
                    <el-col class="info">创建密友圈数量：{{detailData.userRelationship.secretCircleCount}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12">直播业务</el-col>
                    <el-col :span="12" style="text-align: right">
                         <el-button :size="$size" type="primary" @click="goGiftRecord(detailData.baseInfo.id)" :disabled="!isAnchor">查看礼物购买记录</el-button>
                        <!-- <el-button :size="$size" type="primary">查看小视频列表</el-button> -->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="info">用户等级：<img :src="this.detailData.zbInfo.userLevel" style="width: 60px;vertical-align:bottom"/></el-col>
                    <el-col class="info">平台等级：
                        <el-radio-group v-model="platformRecommend" style="margin-right: 20px" :disabled="!isAnchor">
                            <el-radio label="A">A级平台推荐</el-radio>
                            <el-radio label="B">B级平台推荐</el-radio>
                            <el-radio label="C">C级平台推荐</el-radio>
                            <el-radio label="NO">不推荐</el-radio>
                        </el-radio-group>
                        <el-button type="primary" :size="$size" @click="saveRecommend" :disabled="!isAnchor">保存推荐</el-button>
                    </el-col>
                    <el-col class="info">开启橱窗：
                        <el-radio :label="0" v-model="shopWindow" :disabled="!isAnchor">关闭橱窗</el-radio>
                        <el-radio :label="1" v-model="shopWindow" :disabled="!isAnchor">开启橱窗</el-radio>
                        <el-button type="primary" :size="$size" @click="saveWindow" style="margin-left: 20px" :disabled="!isAnchor">保存</el-button>
                    </el-col>
                    <el-col class="info">开启长视频：
                        <el-radio :label="0" v-model="longVideo" :disabled="!isAnchor">关闭长视频</el-radio>
                        <el-radio :label="1" v-model="longVideo" :disabled="!isAnchor">开启长视频</el-radio>
                        <el-button type="primary" :size="$size" @click="saveVideo" style="margin-left: 20px" :disabled="!isAnchor">保存</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12">商城相关</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goOrderRecord(detailData.baseInfo.id)">查看订单记录</el-button>
                        <el-button :size="$size" type="primary" @click="goReadRecord(detailData.baseInfo.id)">查看浏览记录</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="info">订单总数：{{detailData.shop.orderTotalNum}}</el-col>
                    <el-col class="info">订单评价：{{detailData.shop.orderEvaluateNum}}</el-col>
                    <el-col class="info">好评率：{{detailData.shop.orderEvaluateRate}}%</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12">平台抽奖相关</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goLotteryRecord(detailData.baseInfo.id)">查看消费抽奖记录</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="info">平台抽奖总数：{{detailData.drawTicket.countIsUsed}}</el-col>
                    <el-col class="info">平台抽奖数量：{{detailData.drawTicket.countNotIsUsed}}</el-col>
                    <el-col class="info">平台抽奖券过期数量：{{detailData.drawTicket.countInvalid}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12">游戏相关</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click="goGameList(detailData.baseInfo.id)">查看游戏充值记录</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="info">玩过的游戏：</el-col>
                </el-row>
            </el-card>
            <div style="text-align: center;margin-top: 10px">
                <el-button type="plain" :size="$size" @click="goBack">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {getPorvinceInfo} from '@/util/publicMehotds'
export default {
    name: 'userDetail',
    data() {
        return {
            detailData: {
                baseInfo: {},
                xkUserAuth: {},
                userAcc: {},
                userRelationship: {},
                zbInfo: {},
                drawTicket: {},
                gameHistory: {},
                shop: {}
            },
            getPorvinceInfo: getPorvinceInfo,
            platformRecommend: '',
            shopWindow: 1,
            longVideo: 1,
            isAnchor: false // 是否有主播身份入驻
        }
    },
    created() {
        this.getUserDetail();
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        goBusiness(mrCode) { // 联盟商详情
            this.$router.push({path: '/businessDetail', query: {mrCode: mrCode, typeSource: 'user'}})
        },
        notMerchant() {
            this.$message.warning("该会员还没有联盟商身份入驻！")
        },
        goUserAccount(id) { // 账户详情
            this.$router.push({path: '/userAccount', query: {id: id}})
        },
        goGameList(id) { // 游戏列表
            this.$router.push({path: '/userGameList', query: {id: id}})
        },
        goGiftRecord(id) { // 礼物列表
            this.$router.push({path: '/userGiftRecord', query: {id: id}})
        },
        goOrderRecord(id) { // 订单列表
            this.$router.push({path: '/userOrderRecord', query: {id: id}})
        },
        goLotteryRecord(id) { // 消费抽奖
            this.$router.push({path: '/userLotteryRecord', query: {id: id}})
        },
        goReadRecord(id) {
            this.$router.push({path: '/userReadRecord', query: {id: id}})
        },
        getUserDetail() { // 会员详情
            this.$http.get(this.$api.xkUserDetail, {id: this.$route.query.id}, true)
            .then(res => {
                this.detailData = res
                this.platformRecommend =  this.detailData.zbInfo ? this.detailData.zbInfo.recommendLevel : ''
                this.longVideo = this.detailData.zbInfo ? this.detailData.zbInfo.isLongVideo : ''
                this.shopWindow = this.detailData.zbInfo ? this.detailData.zbInfo.isShopWindow : ''
                if(this.detailData.baseInfo.userIdentities) {
                    for(let item of this.detailData.baseInfo.userIdentities) {
                        if(item === 'anchor') {
                            this.isAnchor = true;
                            break;
                        }
                    }
                }
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        saveRecommend() { // 设置推荐等级
            let paramList = {
                // 
                merchantId: this.detailData.zbInfo.merchantId,
                recommendLevel: this.platformRecommend
            }
            console.log(paramList)
            this.$http.get(this.$api.platformRecommendSetting, paramList, true)
            .then(res => {
                this.$message.success('保存推荐成功');
                this.getUserDetail();
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        saveWindow() { // 橱窗设置
            if(this.shopWindow == 1) {
                this.$http.get(this.$api.xkUserOpenShopWindow, {rid: this.$route.query.id}, true)
                .then(res => {
                    this.$message.success('开启橱窗成功');
                    this.getUserDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                this.$http.get(this.$api.xkUserCloseShopWindow, {rid: this.$route.query.id}, true)
                .then(res => {
                    this.$message.success('关闭橱窗成功');
                    this.getUserDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            }
        },
        saveVideo() { // 长视频设置
            console.log(this.longVideo)
            if(this.longVideo == 1) {
                this.$http.get(this.$api.xkUserOpenLongVideo, {rid: this.$route.query.id}, true)
                .then(res => {
                    this.$message.success('开启长视频成功');
                    this.getUserDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                this.$http.get(this.$api.xkUserCloseLongVideo, {rid: this.$route.query.id}, true)
                .then(res => {
                    this.$message.success('关闭长视频成功');
                    this.getUserDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .info {
        line-height: 40px;
        font-size: 14px;
        margin-left: 60px;
    }
    .imgSize {
        height: 100px;
        width: 100px;
        vertical-align: top;
    }
</style>
