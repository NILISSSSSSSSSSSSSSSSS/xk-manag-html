<template>
    <el-dialog :visible.sync="competitionDetailDia" top="30px" append-to-body :before-close="handleClose" width="1100px"
        title="查看比赛">
        <div v-loading="loadingTable">
            <!-- 比赛状态 -->
            <div>
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>比赛状态
                    </div>
                </div>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="4" v-if="detail.competitionStatus">
                        比赛状态：
                        <span>{{ detail.competitionStatus | competitionStatus}}</span>
                        <span></span>
                    </el-col>
                    <template v-if="detail.competitionStatus=='CANCEL'">
                        <el-col :span="6">
                            取消原因：{{ detail.cancelReason }}
                            <span></span>
                        </el-col>
                        <el-col :span="6">
                            取消时间：
                            <span>{{ detail.cancelTime | formatTime }}</span>
                        </el-col>
                    </template>
                    <el-col :span="4">
                        总轮次：
                        <span>{{ detail.totalRound}}轮</span>
                    </el-col>
                    <el-col :span="4">
                        当前轮次：
                        <span v-if="detail.currentRoundIndex">第{{ detail.currentRoundIndex}}轮</span>
                    </el-col>
                    <el-col :span="4">
                        轮次状态：
                        <span v-if="detail.currentRoundStatus">{{ detail.currentRoundStatus | roundStatus}}</span>
                    </el-col>
                    <el-col :span="4">
                        <template v-if="detail.competitionStatus=='COMPETITIONED'">
                            赛事监测：
                            <el-button :size="$size" type="text" style="padding-top: 0;padding-bottom: 0;"
                                @click="routeJudge('monitor',detail.currentRoundIndex,true)">点击查看</el-button>
                        </template>
                        <template v-if="detail.competitionStatus=='OFF_LINE'">
                            赛事回顾：
                            <el-button :size="$size" type="text" style="padding-top: 0;padding-bottom: 0;"
                                @click="routeJudge('review',detail.currentRoundIndex,true)">点击查看</el-button>
                        </template>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="6">
                        报名名单：
                        <el-button :size="$size" type="text" @click="registrationDialog=true">点击查看</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="6" v-if="detail.operator">
                        创建人：
                        <span>{{detail.operator.userName}}</span>
                    </el-col>
                    <el-col :span="6">
                        创建时间：
                        <span v-if="detail.createdAt">{{detail.createdAt | formatTime}}</span>
                    </el-col>
                </el-row>
                <el-table :data="detail.tournaments" style="margin:20px 0" v-if="detail.tournaments.length!==0">
                    <el-table-column label="轮次" prop="roundIndex"></el-table-column>
                    <el-table-column label="开始时间">
                        <template slot-scope="scope">
                            <span
                                v-if="scope.row.contestTime && scope.row.contestTime.startTime">{{scope.row.contestTime.startTime | formatTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" prop="contestTime.endTime">
                        <template slot-scope="scope">
                            <span
                                v-if="scope.row.contestTime && scope.row.contestTime.endTime">{{scope.row.contestTime.endTime | formatTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="轮次状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.changeStatus">{{scope.row.changeStatus | roundStatus }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <!-- 这里按钮的显示根据轮次状态来判断 -->
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text"
                                @click="routeJudge('review',scope.row.roundIndex,false)"
                                v-if="scope.row.changeStatus=='SETTLED'">轮次回顾</el-button>
                            <el-button :size="$size" type="text"
                                @click="routeJudge('monitor',scope.row.roundIndex,false)"
                                v-if="scope.row.changeStatus=='COMPETITIONED'">赛事监测</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 基本设置 -->
            <div class="basicSet">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>基本设置
                    </div>
                </div>
                <el-row class="competionTitleItem">
                    <el-col :span="2">比赛名称：</el-col>
                    <el-col :span="22">
                        <span>{{detail.name}}</span>
                    </el-col>
                </el-row>

                <el-row class="competionTitleItem">
                    <el-col :span="2">比赛规则：</el-col>
                    <el-col :span="22">
                        <span v-html="detail.essential.rule"></span>
                    </el-col>
                </el-row>
                <el-row class="competionTitleItem">
                    <el-col :span="2">比赛详情：</el-col>
                    <el-col :span="22">
                        <span v-html="detail.essential.detail"></span>
                    </el-col>
                </el-row>
                <el-row class="competionTitleItem">
                    <el-col :span="2">宣传语：</el-col>
                    <el-col :span="22">
                        <span v-html="detail.essential.tagline"></span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="24">
                        比赛缩略图：
                        <img :src="detail.thumbnail" alt style="verticle-align:top;"
                            @click="$viewImage(detail.thumbnail)">
                    </el-col>
                </el-row>

                <el-row class="competionTitleItem" :gutter="10">
                    <el-col :span="6">
                        比赛类型：
                        <span>{{ detail.competitionType | competitionType}} {{ detail.subclass.name}}</span>
                    </el-col>
                    <el-col :span="5">
                        比赛项目：
                        <span>{{detail.event.eventName}}</span>
                    </el-col>
                    <template v-if="type=='GAME'">
                        <el-col :span="6">
                            用户填写对应昵称/ID：
                            <span>{{detail.gameIdentify }}</span>
                        </el-col>
                        <el-col :span="7" v-if="detail.management">
                            管理群主ID：
                            <span>{{detail.management.userId }}</span>
                        </el-col>
                    </template>
                </el-row>

                <el-row class="competionTitleItem" :gutter="10">
                    <el-col :span="6">
                        <el-row>
                            <el-col :span="7">
                                选择地区：
                            </el-col>
                            <el-col :span="14" style="text-align:left">
                                <div v-for="(item,index) in detail.matchAreas" :key="index">
                                    <template v-if="!item.provinceName">全国</template>
                                    <template
                                        v-else><span>{{ item.provinceName ? item.provinceName : ""}}</span><span>{{ item.cityName ? item.cityName : ""}}</span><span>{{ item.districtName ? item.districtName : ""}}</span>
                                    </template><span v-if="index!==detail.matchAreas.length-1">,</span>

                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="10" v-if="detail.enrollmentTime && detail.enrollmentTime.startTime">
                        报名时间：
                        <span>{{ detail.enrollmentTime.startTime | formatTime }} -
                            {{ detail.enrollmentTime.endTime | formatTime}}</span>
                    </el-col>
                    <el-col :span="6" v-if="detail.participationAstrict">
                        参赛人数下限：
                        <span>{{ detail.participationAstrict.lowerLimit}}</span>
                    </el-col>
                </el-row>
                <el-row class="competionTitleItem" :gutter="10">
                    <el-col :span="7" v-if="detail.participationAstrict">
                        参赛人数上限：
                        <span>{{ detail.participationAstrict.upperLimit}}</span>
                    </el-col>
                </el-row>
            </div>
            <!-- 赛制及奖励设置 -->
            <div>
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>赛制及奖励设置
                    </div>
                </div>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="4">
                        总轮次：
                        <span>{{ detail.totalRound}}轮</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem" v-if="type=='UPLOAD'">
                    <el-col :span="4">
                        初始积分：
                        <span>{{ detail.rankingTicket.initialPoints }}</span>
                    </el-col>
                    <el-col :span="4">
                        点击查看积分：
                        <span>{{ detail.rankingTicket.clickViewPoints }}</span>
                    </el-col>
                    <el-col :span="4">
                        每个点赞积分：
                        <span>{{ detail.rankingTicket.likePoints }}</span>
                    </el-col>
                    <el-col :span="4">
                        每条评论积分：
                        <span>{{ detail.rankingTicket.commentPoints }}</span>
                    </el-col>
                    <el-col :span="4">
                        每次分享积分：
                        <span>{{ detail.rankingTicket.sharePoints }}</span>
                    </el-col>
                    <el-col :span="4">
                        礼物价值积分：
                        <span>{{ detail.rankingTicket.giftPoints }}</span>
                    </el-col>
                </el-row>
                <el-row class="competionTitleItem" style="margin-top:30px">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane :label="`第${fnHan(index)}轮`" :name="index"
                            v-for="(item,index) in detail.tournaments" :key="index">
                            <round-info :type="type" :isLast="index==(detail.tournaments.length-1) ?  true : false"
                                :roundDetail="item"></round-info>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </div>
        </div>
        <!-- 报名名单相关 -->
        <registration-list :registrationDialog.sync="registrationDialog" :type="type" :competitionId="competitionId"
            :roundIndex="detail.currentRoundIndex"></registration-list>
    </el-dialog>
</template>
<script>
import RegistrationList from "@/components/operate/game/competition/RegistrationList.vue";
import RoundInfo from "@/components/operate/game/competition/RoundInfo.vue";
export default {
    name: "查看比赛",
    components: {
        RoundInfo,
        RegistrationList
    },
    props: {
        competitionDetailDia: {
            type: Boolean,
            default: false
        },
        competitionId: {
            type: String,
            default: ""
        }
    },
    watch: {
        competitionDetailDia(val) {
            if (val) {
                this.getDetail();
            }
        }
    },
    data() {
        return {
            statusTable: [{}],
            loadingTable: false,
            activeName: "0",
            registrationDialog: false,

            type: "",
            detail: {
                essential: {},
                event: {},
                subclass: {},
                management: {},
                enrollmentTime: {},
                operator: {},
                participationAstrict: {},

                tournaments: [],
                region: [],
                time: [],
                matchAreas: []
            }
        };
    },
    methods: {
        fnHan(index) {
            let str = "一二三四五六七八九十";
            if (index < 10) {
                return str[index]
            } else if (index == 10) {
                return "十一";
            } else if (index == 11) {
                return "十二";
            } else {
                return index;
            }
        },
        handleClose() {
            this.$emit("update:competitionDetailDia", false);
        },
        getDetail() {
            let data = { competitionId: this.competitionId };
            this.loadingTable = true;
            this.$http
                .get(this.$api.competitionDetail, data, true)
                .then(res => {
                    console.log("竞赛详情" + JSON.stringify(res));
                    if (res) {
                        this.detail = res;
                        this.type = this.detail.competitionType;
                    } else {
                        this.detail = {
                            essential: {},
                            event: {},
                            subclass: {},
                            management: {},
                            enrollmentTime: {},
                            operator: {},
                            participationAstrict: {},

                            tournaments: [],
                            region: [],
                            time: [],
                            matchAreas: []
                        };
                        this.type = "";
                    }
                    this.loadingTable = false;
                })
                .catch(res => {
                    this.detail = {
                        essential: {},
                        event: {},
                        subclass: {},
                        management: {},
                        enrollmentTime: {},
                        operator: {},
                        participationAstrict: {},

                        tournaments: [],
                        region: [],
                        time: [],
                        matchAreas: []
                    };
                    this.type = "";
                    this.loadingTable = false;
                    this.$message.error(res.message);
                });
        },
        routeJudge(stype, curentLunCi, isTurn) {
            this.detail.competitionType == "GAME"
                ? this.$router.push({
                    path: "/gameCompetion",
                    query: {
                        type: stype,
                        competitionId: this.competitionId,
                        curentLun: curentLunCi,
                        isTurnPage: isTurn,
                    }
                })
                : this.$router.push({
                    path: "/uploadCompetion",
                    query: {
                        type: stype,
                        competitionId: this.competitionId,
                        curentLun: curentLunCi,
                        isTurnPage: isTurn,
                    }
                });
        }
    }
};
</script>
<style lang="scss">
.basicSet {
    img,
    video {
        width: 200px !important;
        height: auto !important;
    }
}
</style>
<style scoped lang="scss">
/deep/ .competionTitleItem {
    margin-bottom: 15px;
}
/deep/ div.el-dialog__wrapper {
    overflow: hidden;
}
/deep/ .el-dialog__body {
    max-height: 89vh;
    overflow: auto;
}
</style>