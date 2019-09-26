<template>
    <div class="xk-container">
        <div class="board">
            <div class="board-top xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>总数据统计&emsp;(截止于{{ moment().format('YYYY-MM-DD') }}日)
                    </div>
                </div>
                <el-row class="el-row-title">
                    <el-col :span="3">
                        <p>总完成期数</p>
                        <p class="timer-animation" :data-to="totalData.period" data-speed="1500">{{ totalData.period || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>投放奖品数</p>
                        <p class="timer-animation" :data-to="totalData.prize" data-speed="1500">{{ totalData.prize || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>中奖人数</p>
                        <p class="timer-animation" :data-to="totalData.winning" data-speed="1500">{{ totalData.winning || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>参与人数</p>
                        <p class="timer-animation" :data-to="totalData.participate" data-speed="1500">{{ totalData.participate || 0 }}</p>
                    </el-col>
                    <el-col :span="4">
                        <p>订单总数</p>
                        <p class="timer-animation" :data-to="totalData.totalOrder" data-speed="1500">{{ totalData.totalOrder || 0 }}</p>
                    </el-col>
                    <el-col :span="4">
                        <p>晒单总数</p>
                        <p class="timer-animation" :data-to="totalData.shareOrder" data-speed="1500">{{ totalData.shareOrder || 0 }}</p>
                    </el-col>
                    <el-col :span="4">
                        <p>售后总数</p>
                        <p class="timer-animation" :data-to="totalData.afterSaleOrder" data-speed="1500">{{ totalData.afterSaleOrder || 0 }}</p>
                    </el-col>
                </el-row>
            </div>
            <div class="board-top xk-radius marintop20">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>今日待处理事项
                    </div>
                </div>
                <el-row class="el-row-title">
                    <el-col :span="3">
                        <p>新增订单数</p>
                        <p class="timer-animation" :data-to="totalData.newOrderNum" data-speed="1500">{{ totalData.newOrderNum || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>待发货订单数</p>
                        <p class="timer-animation" :data-to="totalData.waitSend" data-speed="1500">{{ totalData.waitSend || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>售后订单审核</p>
                        <p class="timer-animation" :data-to="totalData.notAudit" data-speed="1500">{{ totalData.notAudit || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>晒单订单审核</p>
                        <p class="timer-animation" :data-to="totalData.waitForAuth" data-speed="1500">{{ totalData.waitForAuth || 0 }}</p>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div class="board  marintop20">
            <div class="position1 xk-search">
                <el-row>
                    <el-col :span="10" style="line-height: 34px;">
                        <el-button :class="activeIndex==1? 'xk-primary':''" :size="$size" type="text" @click="activeIndex=1;getData('week')">本周</el-button>
                        <el-button :class="activeIndex==2? 'xk-primary':''" :size="$size" type="text" @click="activeIndex=2;getData('month')">本月</el-button>
                        <el-button :class="activeIndex==3? 'xk-primary':''" :size="$size" type="text" @click="activeIndex=3;getData('year')">全年</el-button>
                    </el-col>
                    <el-col :span="14">
                        <el-date-picker
                            v-model="value"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="~"
                            @change="getData()"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :size="$size"
                        >
                        </el-date-picker>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="订单" name="prize">
                        <!-- <line-echarts style="width: 100%" :datas="prizeData"></line-echarts> -->
                    </el-tab-pane>
                    <el-tab-pane label="中奖订单" style="width: 100%" name="order"></el-tab-pane>
                </el-tabs>
                <line-echarts style="width: 100%" :datas="orderData"></line-echarts>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import moment from 'moment';
    import {count} from "../../../../static/lib/timepeople.js";
    import LineEcharts from '@/components/echarts/Line.vue';

    export default {
        name: "prize",
        data() {
            return {
                activeName: 'prize',
                activeIndex: 1,
                moment,
                totalData: {},
                value: '',
                orderData: {
                    xData: ['016月'],
                    yData: [200]
                }
            }
        },
        components: {
            LineEcharts,
        },
        created() {
            this.getFixedData();
            this.getVolume('week');
        },
        mounted() {
        },
        methods: {
            handleClick(val) {
                this.activeIndex= 1;
                if(val.name==='order') {
                    this.getVolumePrizeOrder('week');
                }else{
                    this.getVolume('week');
                }
            },
            getData(type) {
                if(!type) {
                    this.activeIndex = "";
                }
                if(this.activeName ==='order') {
                    this.getVolumePrizeOrder(type);
                }else{
                    this.getVolume(type);
                }
            },
            //默认生成本周数据
            defaultWeek() {
                let date = new Date().getDay();
                let xData = [], yData=[];
                for(let i=0; i< date; i++) {
                    switch(i) {
                        case 0: 
                            xData.push('星期一');
                            break;
                        case 1:
                            xData.push('星期二');
                            break;
                        case 2:
                            xData.push('星期三');
                            break;
                        case 3:
                            xData.push('星期四');
                            break;
                        case 4:
                            xData.push('星期五');
                            break;
                        case 5:
                            xData.push('星期六');
                            break;
                        case 6:
                            xData.push('星期七');
                            break;
                    }
                }
                return {
                    xData,
                    yData
                }
            },
            getVolumePrizeOrder(param) {
                let params = this.createTime(param)
                this.$http.get(this.$api.jMallHomePageWinningVolume, params, true).then(res=>{
                    let obj = this.createModel(res.jMallWinningOrders);
                    this.orderData = {
                        xData: obj.xData,
                        yData: obj.yData
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            getFixedData() {
                this.$http.get(this.$api.jMallHomePageFixed, {}, true).then(res=>{
                    this.totalData = res;
                    this.$nextTick(()=>{
                        $('.timer-animation').each(count);
                    })
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //获取订单总量趋势
            getVolume(param) {
                let params = this.createTime(param)
                this.$http.get(this.$api.jMallHomePageVolume, params, true).then(res=>{
                    console.log(res)
                    let obj = this.createModel(res.jMallOrderTrends);
                    this.orderData = {
                        xData: obj.xData,
                        yData: obj.yData
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //创建时间参数
            createTime(param) {
                let params = {
                    endTime: moment().format('X'),
                    dateType: 'day'
                }
                switch(param) {
                    case 'week':
                        params.startTime = moment().week(moment().week()).startOf('week').format('X');
                        break;
                    case 'month':
                        params.startTime = moment().week(moment().week()).startOf('month').format('X');
                        break;
                    case 'year':
                        params.dateType = 'month';
                        params.startTime = moment().month(moment().month()).startOf('year').format('X');
                        break;
                    default:
                        params.startTime = moment(this.value[0]).format('X');
                        params.endTime = moment(this.value[1]).format('X');
                    }
                return params;
            },
            //创建模型数据
            createModel(param) {
                if(param.length> 0) {
                    let xData = [], yData = [];
                    param.forEach(item=>{
                        yData.push(item.number)
                        xData.push(moment(item.date*1000).format('YYYY年MM月DD日'))
                    })

                    return {
                        xData,
                        yData
                    }
                }else{
                    return this.defaultWeek()
                }
            }
        }

    }
</script>

<style lang="scss" src="../../selfMall/goods/board.scss"></style>
<style scoped lang="scss">
    .board {
        position: relative;
    }
    .position1 {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 999;
        /deep/ .el-col {
            color:#303133;
            /deep/ .el-button {
                color: #303133;
            }
            .xk-primary {
                color: #9795e3;
            }
        }
    }
    .xk-primary {
        color: #9795e3;
    }

    .paneInfo {
        width: 600px;
    }
</style>
