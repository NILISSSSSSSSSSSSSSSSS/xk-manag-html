<template>
    <div class="xk-container">
        <div class="board">
            <div class="board-top xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>今日待处理事项
                    </div>
                </div>
                <el-row class="el-row-title">
                    <el-col :span="3">
                        <p>交易金额</p>
                        <p class="timer-animation" :data-to="$math.divide(fixedData.totalMoney, 100)" data-speed="1500">{{ $math.divide(fixedData.totalMoney, 100) }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>总订单数</p>
                        <p class="timer-animation" :data-to="fixedData.totalCount" data-speed="1000">{{ fixedData.totalCount || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>待支付订单</p>
                        <p class="timer-animation" :data-to="fixedData.totalWaitPay" data-speed="1000">{{ fixedData.totalWaitPay || 0 }}</p>
                    </el-col>
                    <el-col :span="3">
                        <p>取消订单</p>
                        <p class="timer-animation" :data-to="fixedData.totalCancel" data-speed="1000">{{ fixedData.totalCancel || 0 }}</p>
                    </el-col>
                    <el-col :span="4">
                        <p>待发货订单</p>
                        <p class="timer-animation" :data-to="fixedData.totalNotSend" data-speed="1000">{{ fixedData.totalNotSend || 0 }}</p>
                    </el-col>
                    <el-col :span="4">
                        <p>售后待审核</p>
                        <p class="timer-animation" :data-to="fixedData.totalNotAuth" data-speed="1000">{{ fixedData.totalNotAuth || 0 }}</p>
                    </el-col>
                </el-row>
            </div>
            <div class="board-content">
                <el-row>
                    <el-col :span="12">
                        <div class="el-con">
                            <div class="board-content-title">
                                <div class='xk-title'>
                                    <div class="vus-title">
                                        <span></span>自营商品分类交易金额占比
                                    </div>
                                </div>
                            </div>
                            <div style="width: 90%;height:350px;">
                                <pie-echarts :pieData="pieData"></pie-echarts>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="el-con">
                            <div class="board-content-title">
                                <div class='xk-title'>
                                    <div class="vus-title">
                                        <span></span>商品销售排行榜
                                    </div>
                                </div>
                            </div>
                            <el-form label-width="110px">
                                <el-form-item label="选择类别：">
                                    <el-cascader
                                        class="xk-search"
                                        v-model="categoryCode"
                                        :options="options"
                                        @change="getGoodsRank"
                                        :props="props"
                                        :size="$size"
                                        :show-all-levels="false">
                                    </el-cascader>
                                </el-form-item>
                            </el-form>
                            <el-table :data="goodsSalesRankings" height="290" style="margin-top: 10px;padding: 0 10px" v-loading="loadingTable">
                                <el-table-column 
                                    width="125" 
                                    align="center" 
                                    label="排行榜">
                                    <template slot-scope="scope">
                                        <img v-if="scope.$index < 5" class="rank-img" :src='"../../../assets/image/rank"+(scope.$index+1)+".png"' />
                                        <span v-else> {{ scope.$index }} </span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="goodsName" label="商品名称" show-overflow-tooltip></el-table-column>
                                <el-table-column align="center" prop="categoryName" label="所属类别" show-overflow-tooltip></el-table-column>
                                <el-table-column align="center" label="价格">
                                    <template slot-scope="scope">
                                        {{ $math.divide(scope.row.amount, 100) }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="board-footer xk-radius">
                <el-row type="flex">
                    <el-col :span="8">
                        <div class="board-footer-title">
                            <div class='xk-title'>
                                <div class="vus-title">
                                    <span></span>订单成交量趋势
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="7"></el-col>
                    <el-col :span="3" class="xk-type">
                        <el-button :class="activeName==1? 'xk-primary':''" :size="$size" type="text" @click="activeName=1;getOrderVolume('week')">本周</el-button>
                        <el-button :class="activeName==2? 'xk-primary':''" :size="$size" type="text" @click="activeName=2;getOrderVolume('month')">本月</el-button>
                        <el-button :class="activeName==3? 'xk-primary':''" :size="$size" type="text" @click="activeName=3;getOrderVolume('year')">全年</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-date-picker @change="getOrderVolume()" v-model="orderCategory" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :size="$size" type="datetimerange" style="margin-top: 13px" class="xk-search"></el-date-picker>
                    </el-col>
                </el-row>
                <line-echarts :datas="echartsData"></line-echarts>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import {count} from "../../../../static/lib/timepeople.js";
    import LineEcharts from '@/components/echarts/Line.vue';
    import PieEcharts from '@/components/echarts/Pie.vue';
    
    export default {
        components: {
            LineEcharts,
            PieEcharts
        },
        data() {
            return {
                activeName: 1,
                fixedData: {},
                categoryCode: [],
                orderCategory: '',
                echartsData: {},
                pieData: [],
                props: {
                    value: 'code',
                    label: 'name'
                },
                options: [{code: '', name: '全部'}],
                loadingTable: false,
                goodsSalesRankings: []
            }
        },
        created() {
            this.getCategory();
            this.getGoodsRank();
            this.getFixedData();
            this.getOrderVolume('week');
        },
        methods: {
            //今日待处理事项、交易金额占比
            getFixedData() {
                this.$http.get(this.$api.homePageFixed, {}, true).then(res=>{
                    this.fixedData = res.orderData;
                    this.$nextTick(()=>{
                        $('.timer-animation').each(count) 
                    })
                    console.log(res)
                    this.pieData = res.categorySalesRankings
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //商品销售排行
            getGoodsRank() {
                this.loadingTable = true;
                this.$http.get(this.$api.homePageSales, {
                    categoryCode: this.categoryCode? this.categoryCode[this.categoryCode.length-1]: ''
                }, true).then(res=>{
                    this.loadingTable = false;
                    this.goodsSalesRankings = res.goodsSalesRankings.length>4? res.goodsSalesRankings.slice(0,4): res.goodsSalesRankings;
                })
                .catch(err=>{
                    this.loadingTable = false;
                    this.$message.error(err.message);
                })
            },
            //获取订单成交量数据
            getOrderVolume(param) {
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
                        params.startTime = moment().month(moment().month()).startOf('year').format('X');
                        params.dateType = 'month';
                        break;
                    default:
                        this.activeName = "";
                        params.startTime = moment(this.orderCategory[0]).format('X');
                        params.endTime = moment(this.orderCategory[1]).format('X');
                }

                this.$http.get(this.$api.homePageVolume, params, true).then(res=>{
                    this.echartsData = this.createModel(res.salesVolumes)
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //获取分类
            getCategory() {
                this.$http.get(this.$api.categoryQueryList, {}, true)
                    .then(res => {
                        res.forEach(item => {
                            this.options.push(item);
                        })
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
            },
            handleCateCode(params) {
                let arr = [];
                if(Array.isArray(params[0].children)) {
                    arr.unshift(...this.handleCateCode(params[0].children))
                }
                arr.unshift(params[0].code)
                return arr;
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
            //创建模型数据
            createModel(param) {
                if(param.length> 0) {
                    let xData = [], yData = [];
                    param.forEach(item=>{
                        yData.push(item.number)
                        xData.push(item.date)
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
<style lang="scss" src="./board.scss"></style>