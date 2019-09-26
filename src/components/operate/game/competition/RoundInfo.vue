<template>
    <div style="padding: 0 20px" class="wrapperBox">
        <!-- 基本设置 -->
        <div>
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>基本设置：
                </div>
            </div>
            <el-row :gutter="20" class="competionTitleItem" v-if="type=='UPLOAD'">
                <el-col :span="6">
                    开始时间：
                    <span v-if="roundDetail.contestTime && roundDetail.contestTime.startTime">{{ roundDetail.contestTime.startTime | formatTime}}</span>
                </el-col>
                <el-col :span="6"  v-if="roundDetail.contestTime && roundDetail.contestTime.endTime">
                    结束时间：
                    <span>{{ roundDetail.contestTime.endTime | formatTime}}</span>
                </el-col>
                <el-col :span="6" v-if="!isLast">
                    晋级排名：
                    <span>前{{ roundDetail.promotedNum }}名</span>
                </el-col>
                <el-col :span="6">
                    是否继续使用上轮作品：
                    <span>{{ roundDetail.employ=='yes' ? "是" : "否" }}</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="competionTitleItem" v-else>
                <el-col :span="6">
                    单人比赛局数：
                    <span>{{ roundDetail.innings }}局</span>
                </el-col>
                <el-col :span="6" v-if="!isLast">
                    晋级排名：
                    <span>前{{ roundDetail.promotedNum }}名</span>
                </el-col>
                <el-col :span="6">
                    房间分配：
                    <span>每 {{ roundDetail.roomNum }}人一房间进行比赛</span>
                </el-col>
            </el-row>
        </div>
        <!-- 晋级奖或者排名奖 -->
        <div>
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>
                    {{ isLast ? "排名奖" : "晋级奖" }}：
                </div>
            </div>
            <el-row
                :gutter="20"
                class="competionTitleItem"
                style="margin-bottom:15px"
            >  
            <!-- 如果是最后一轮，就是排名奖 -->
                <template v-if="isLast">
                      <el-tabs v-model="activeName"  tab-position="left">
                        <el-tab-pane  :label="item.plateName"  :name="index" v-for="(item,index) in roundDetail.rankings" :key="index">
                             <prize-info hasPeriod="true" :prizeList="item"></prize-info>
                        </el-tab-pane>
                 </el-tabs>
                 <!-- 如果不是最后一轮,就是晋级奖 -->
                </template>
                 <template v-else>
                     <div>
                         <prize-info :prizeList="roundDetail.promoted"></prize-info>
                     </div>
                 </template>
            </el-row>
        </div>
        <!-- 参与奖 -->
        <div>
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>参与奖：
                </div>
            </div>
           <prize-info :prizeList="roundDetail.participation"></prize-info>
        </div>
    </div>
</template>
<script>
import PrizeInfo from "@/components/operate/game/competition/PrizeInfo";
export default {
    name: "轮次详情",
    components: {PrizeInfo},
    props: {
        isLast: {
            type: Boolean,
            default: false
        },
        type: {
            default: ""
        },
        roundDetail:{
             default:() =>({})
        }
    },
    data() {
        return {
            loadingTable: false,
            activeName:"0"
        };
    },
    methods: {}
};
</script>
<style scoped lang="scss">
/deep/ .competionTitleItem {
    margin-bottom: 10px;
}
.wrapperBox > div {
    margin-bottom: 40px;
}
.fontBold {
    font-weight: bold;
    font-size: 15px;
}
</style>