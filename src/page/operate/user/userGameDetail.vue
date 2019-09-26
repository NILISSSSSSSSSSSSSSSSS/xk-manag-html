<template>
    <div class="xk-container">
        <div class="xk-radius">
           <div class='xk-title'>
            <div class="vus-title">
                <span></span>游戏详情
            </div>
            <div class="vus-bottom"></div>
           </div>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">游戏信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button :size="$size" type="primary" @click='GameDetail(detailData.gameDetail.id)'>游戏详情</el-button>
                    </el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">游戏ID: {{detailData.gameDetail.id}}</el-col>
                    <el-col :span="8">游戏名称: {{detailData.gameDetail.name}}</el-col>
                    <el-col :span="8">游戏分类: {{getGameType(detailData.gameDetail.categoryCode)}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <!-- <el-col :span="8">汇率: {{'1 :' +detailData.gameDetail.exchangeRate}}</el-col> -->
                    <el-col :span="8">所属城市:{{ getPorvinceInfo(detailData.userDetail.cityCode) }}</el-col>
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
                    <el-col :span="8">是否实名认证: {{detailData.userDetail.auth == 1 ? '是' :'否'}}</el-col>
                    <el-col :span="8">用户名: {{detailData.userDetail.name}}</el-col>
                    <el-col :span="8">用户账号: {{detailData.userDetail.phone}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">所属城市: {{getPorvinceInfo(detailData.userDetail.cityCode)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">订单信息</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">订单ID: {{detailData.orderDetail.orderNo}}</el-col>
                    <el-col :span="8">兑换数量: {{detailData.orderDetail.amount}}</el-col>
                    <el-col :span="8">下单时间: {{detailData.orderDetail.createTime | formatTime}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">支付时间: {{detailData.orderDetail.payTime | formatTime}}</el-col>
                    <el-col :span="8">完成时间: {{detailData.orderDetail.finishTime | formatTime}}</el-col>
                    <el-col :span="8">支付方式: {{getPayChannel(detailData.orderDetail.payChannel)}}</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">实际支付金额: {{$math.divide(detailData.orderDetail.payAmount, 100)}}元</el-col>
                    <el-col :span="8">订单状态: {{getGameOrderStatus(detailData.orderDetail.orderStatus)}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">手续费</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">支付通道: {{getPayChannel(detailData.formalitiesDetail.payChannel)}}</el-col>
                    <el-col :span="8">当前通道费率: {{detailData.formalitiesDetail.ratio}}</el-col>
                    <el-col :span="8">手续费金额: {{ $math.divide(detailData.formalitiesDetail.formalities, 100)}}元</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px" v-if="detailData.jackpotAllocation">
                <el-row>
                    <el-col :span="12" class="title">奖池抽成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-col :span="8">当前订单归属城市: {{getPorvinceInfo(detailData.orderDetail.areaCode)}}</el-col>
                    <el-col :span="8">当前城市归属模板: {{detailData.jackpotAllocation.templateName}}</el-col>
                    <el-col :span="8">当前模板业务抽成比例: {{detailData.jackpotAllocation.earningsRatio}} %</el-col>
                </el-row>
                <el-row class="info-content">
                    <el-col :span="8">抽成金额: {{ detailData.jackpotAllocation.practicalEarningsPriceTemp}}</el-col>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">平台收益分成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-table :data="detailData.recommend">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="收益分成%" prop="earningsRatio"></el-table-column>
                        <el-table-column label="是否考核">
                            <template slot-scope="scope">
                                {{scope.row.isCheck == 1? '是' : '否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="预收收益" prop="advanceEarningsPriceTemp"></el-table-column>
                        <el-table-column label="考核状态">
                            <template slot-scope="scope">
                                {{ scope.row.assessStatus | formatStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column label="实收收益">
                            <template slot-scope="scope">
                                {{ scope.row.practicalEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="税务扣除">
                            <template slot-scope="scope">
                                {{ scope.row.serviceTaxAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="违规惩罚">
                            <template slot-scope="scope">
                                {{ scope.row.punishAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益代扣加盟费">
                            <template slot-scope="scope">
                                {{ scope.row.deductLeagueAmountTemp }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">销售收益分成</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-table :data="detailData.sales">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="收益分成%" prop="earningsRatio"></el-table-column>
                        <el-table-column label="是否考核">
                            <template slot-scope="scope">
                                {{scope.row.isCheck == 1? '是' : '否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="预收收益" prop="advanceEarningsPriceTemp"></el-table-column>
                        <el-table-column label="考核状态">
                            <template slot-scope="scope">
                                {{ scope.row.assessStatus | formatStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column label="实收收益">
                            <template slot-scope="scope">
                                {{ scope.row.practicalEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="税务扣除">
                            <template slot-scope="scope">
                                {{ scope.row.serviceTaxAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="违规惩罚">
                            <template slot-scope="scope">
                                {{ scope.row.punishAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益代扣加盟费">
                            <template slot-scope="scope">
                                {{ scope.row.deductLeagueAmountTemp	}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">推荐游戏收益(货源奖励)</el-col>
                </el-row>
                <div class="line"></div>
                <el-row class="info-content">
                    <el-table :data="detailData.sourceAward">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="收益分成%" prop="earningsRatio"></el-table-column>
                        <!-- <el-table-column label="补贴比例%" prop="earningsRatio"></el-table-column> -->
                        <el-table-column label="正常收益" prop="standbyPriceTemp"></el-table-column>
                        <el-table-column label="（正常+补贴)收益" prop="advanceEarningsPriceTemp"></el-table-column>
                        <el-table-column label="是否考核">
                            <template slot-scope="scope">
                                {{scope.row.isCheck == 1? '是' : '否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="考核状态">
                            <template slot-scope="scope">
                                {{ scope.row.assessStatus | formatStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column label="实收收益" prop="practicalEarningsPriceTemp">
                            <template slot-scope="scope">
                                {{ scope.row.practicalEarningsPriceTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="税务扣除">
                            <template slot-scope="scope">
                                {{ scope.row.serviceTaxAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="违规惩罚">
                            <template slot-scope="scope">
                                {{ scope.row.punishAmountTemp }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益代扣加盟费">
                            <template slot-scope="scope">
                                {{ scope.row.deductLeagueAmountTemp	}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-card>
            <el-card style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="12" class="title">平台利润</el-col>
                </el-row>
                <div class="line"></div>
                <el-row>
                    利润： {{ detailData.platformAllocation }}元
                </el-row>
            </el-card>
            <el-dialog title="游戏详情" :visible.sync="gameVisible" width="800px" top="50px">
            <div v-loading="editLoading">
                <el-form :model="submitForm" label-width="150px" ref="submitForm">
                    <el-form-item label="游戏名称：" prop="name">
                        <el-input v-model="submitForm.name" :size="$size" placeholder="请输入游戏名称"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏分类：" prop="class">
                        <el-select :size="$size" placeholder="游戏分类" v-model="submitForm.class">
                            <el-option v-for="(item, index) in EnumClass" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏链接：" prop="links">
                        <el-input v-model="submitForm.links" :size="$size"
                                  placeholder="H5链接or端游下载(如：http://xksquare.com)"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏类型：" prop="type">
                        <el-select :size="$size" v-model="submitForm.type">
                            <el-option v-for="(item, index) in EnumType" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏大小（端游需填写）：" prop="size">
                        <el-input v-model="submitForm.size" :size="$size" placeholder="游戏大小(单位：M)"></el-input>
                    </el-form-item>
                    <el-form-item label="适用平台：" prop="platform">
                        <el-select :size="$size" placeholder="请选择适用平台" v-model="submitForm.platform">
                            <el-option v-for="(item, index) in EnumPlatForm" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏简介：" prop="describe">
                        <!-- <UE v-model="submitForm.detail"></UE> -->
                        <el-input v-model="submitForm.describe" :size="$size" placeholder="请输入游戏简介" type="textarea"
                                  :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="游戏币汇率：" prop="rate">
                        <el-row>
                            <el-col :span="10">
                                <el-input v-model="submitForm.rate" :size="$size" placeholder="请输入游戏币汇率"></el-input>
                            </el-col>
                            <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;1晓可币= xx游戏币</el-col>
                        </el-row>
                    </el-form-item> -->
                    <!-- <el-form-item label="排序指数：" prop="sort">
                        <el-input v-model="submitForm.sort" :size="$size" placeholder="请输入排序指数"></el-input>
                    </el-form-item> -->
                    <el-form-item label="人气指数：" prop="point">
                        <el-select :size="$size" placeholder="请选择人气指数" v-model="submitForm.point">
                            <el-option v-for="(item, index) in EnumPoint" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏大图（封推）：" prop="gameBigPic" ref="gameBigPic">
                        <image-upload v-model="submitForm.gameBigPic" :more="false">
                            <img v-if="submitForm.gameBigPic" :src="submitForm.gameBigPic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                    </el-form-item>
                    <el-form-item label="游戏小图（列表）：" prop="gameSmallPic" ref="gameSmallPic">
                        <image-upload v-model="submitForm.gameSmallPic" :more="false">
                            <img v-if="submitForm.gameSmallPic" :src="submitForm.gameSmallPic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                    </el-form-item>
                    <el-form-item label="游戏详情：" prop="detail">
                        <!-- <UE v-model="submitForm.detail"></UE> -->
                        <el-input v-model="submitForm.detail" :size="$size" placeholder="请输入游戏详情" type="textarea"
                                  :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏平台：" prop="gameChannel">
                        <el-select v-model="submitForm.gameChannel" placeholder="请选择">
                            <el-option
                                    v-for="item in gamePlats"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="submitForm.type=='h5'&& item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏参数：" prop="game_id">
                        <el-input v-model.trim="submitForm.game_id" :size="$size" placeholder="请输入游戏平台的游戏参数"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="channel_id：" prop="channel_id">
                        <el-input v-model="submitForm.channel_id" :size="$size" placeholder="请输入channel_id"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏密钥：" prop="secret_key">
                        <el-input v-model="submitForm.secret_key" :size="$size" placeholder="游戏密钥"></el-input>
                    </el-form-item> -->
                    <el-form-item label="游戏公司返点：" prop="returnPoint">
                        <el-input v-model.number="submitForm.returnPoint" :size="$size" placeholder="10"
                                  style="width:200px"></el-input>&nbsp;&nbsp;%
                    </el-form-item>
                </el-form>
                <prize-set v-model="prizeset" ref="prizeset"></prize-set>
                <goods-source ref="b2c_s" v-model="b2c_s"></goods-source>
            </div>
            </el-dialog>
        </div>
    </div>
    
</template>

<script>
import ImageUpload from '@/components/ImageUpload.vue';
import PrizeSet from '@/components/operate/game/PrizeSet.vue';
import GoodsSource from '@/components/operate/game/GoodsSource.vue';
import { getPorvinceInfo,enumFormatter } from "@/util/publicMehotds";
import { EnumSequencesStatus, EnumPayWay, EnumTradeProduct, MerchantDrawType, ShopPrizeType, 
         PlatformPrizeType, EnumGameType, ExchangeStatus,EnumCheckStatus } from '@/util/publicParams'

    const EnumGame = [{label: '天天斗地主', value: '1'}, {label: '天天打麻将', value: '2'}];
    //枚举游戏指数
    const EnumPoint = [
        {label: '1', value: 1}, {label: '2', value: 2}, {label: '3', value: 3},
        {label: '4', value: 4}, {label: '5', value: 5}];
    //枚举游戏类型
    const EnumType = [{label: '端游', value: 'client'}, {label: 'H5', value: 'h5'}];
    //枚举游戏分类
    const EnumClass = [
        {label: '益智', value: 1}, {label: '动作', value: 2}, {label: '角色', value: 3},
        {label: '街机', value: 4}, {label: '卡牌', value: 5}, {label: '冒险', value: 6},
        {label: '刺激', value: 7}, {label: '养成', value: 8}, {label: '文字', value: 9}
    ];
     const EnumPlatForm = [
        {label: 'ios', value: 'ios'}, {label: '通用', value: 'all'}, {label: 'android', value: 'android'}
    ];
export default {
    name: 'userGameDetail',
     data() {
        return {
            detailData: {
                orderDetail: {},
                recommend: [],
                liveEarnings: [],
                gameDetail: {},
                sourceAward: [],
                sales: [],
                formalitiesDetail: {},
                userDetail: {}
            },
            getPorvinceInfo: getPorvinceInfo,
            gameVisible: false,
            submitForm: {},
            EnumGame,
                EnumPoint,
                EnumType,
                EnumClass,
                EnumPlatForm,
                gamePlats: [
                    {label: '163', value: 'game_163', disabled: false},
                    {label: '4177', value: 'game_4177', disabled: false},
                    {label: '六秦互动', value: 'mzcco', disabled: false},
                    {label: '游龙', value: 'game_youlong', disabled: false},
                ],
        }
    },
    created() {
        this.getGameDetail();
    },
    methods: {
        getGameDetail() {
            if(this.$route.query.source === 'game_charge') {
                this.getXkbGameDetail();
            } else {
                this.getGameDetailForList();
            }
        },
        getGameDetailForList() { // 游戏列表的游戏详情
            console.log(this.$route.query.id)
            this.$http.get(this.$api.gameOrderDetail, {orderNo: this.$route.query.id}, true)
            .then(res => {
                console.log(res)
                this.detailData = res
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        getXkbGameDetail() { // 晓可币的游戏充值详情
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
        getPayChannel(val) { // 支付方式
            return enumFormatter(val, EnumPayWay);
        },
        getGameType(val) { // 游戏分类
            return enumFormatter(val, EnumGameType, {value: 'label'});
        },
        getGameOrderStatus(val) { // 订单状态
            return enumFormatter(val, ExchangeStatus, {value: 'label'});
        },
        goUserDetail(userId) {
            this.$router.push({path:'/userDetail', query: {id: userId}})
        },
        GameDetail(gameId) { // 游戏详情的游戏详情
                this.$refs['submitForm'] ? this.$refs['submitForm'].resetFields() : "";
                // this.edit = true;
                this.gameVisible = true;
                this.editLoading = true;
                this.$http.get(this.$api.gameDetail, {id: gameId}, true).then((res) => {
                    console.log(res)
                    this.editLoading = false;
                    this.submitForm = {
                        name: res.game.name,
                        class: res.game.categoryCode,
                        links: res.game.url,
                        type: res.game.type,
                        size: res.game.size,
                        platform: res.game.gamePlatfrom,
                        detail: res.game.detail,
                        describe: res.game.describe,
                        rate: res.game.exchangerate,
                        // sort: res.game.index,
                        point: res.game.popularity,
                        gameBigPic: res.game.bigPic,
                        gameSmallPic: res.game.smallPic,
                        id: res.game.id,
                        gameChannel: res.game.gameChannelConfig.gameChannel,
                        game_id: JSON.stringify(res.game.gameChannelConfig.config),
                        returnPoint: res.drawout ? res.drawout.returnPoint ? res.drawout.returnPoint.ratio : 0 : 0,
                    }
                    if (res.drawout) {
                        this.prizeset = {
                            mothSale: res.drawout.mothSale,
                            singleBatch: res.drawout.singleBatch,
                            sale: res.drawout.sale,   //销售
                            saleSubsidyTempList: res.drawout.saleSubsidyTempList ? res.drawout.saleSubsidyTempList : [{
                                areaCode: '',
                                buyerRatio: '',
                                areaAdminRatio: '',
                                areaAdminCurrency: 'rmb',
                                buyerCurrency: 'xfq'
                            }]
                        };
                        this.b2c_s = {
                            sourceOfGoods: res.drawout.sourceOfGoods,
                            sourceOfGoodsMonthSaleSubsidy: res.drawout.sourceOfGoodsMonthSaleSubsidy
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                    this.editLoading = false;
                    this.$message.error(err.message);
                });

                // this.$set(this.submitForm,'hack',1)
                console.log(this.submitForm)
            },
    },
    components: {
        PrizeSet,
        GoodsSource,
        ImageUpload
    },
    filters: {
        formatStatus(val) {
            return enumFormatter(val, EnumCheckStatus)
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
/deep/ .el-table th {
    padding: 0 0 ;
}
/deep/ .el-table--border th {
    border: none;
}
.avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

</style>
