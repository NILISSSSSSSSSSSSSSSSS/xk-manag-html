<template>
    <div class = 'xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                 <span></span>
                    待出票搜索
                </div>
                <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="fnSearch">查 询</el-button>
                    <el-button type='danger' :size='$size' @click="fnClear">清 空</el-button>
                </div>
                <div class='vus-bottom'></div>
                <el-form :size="$size" 
                        :inline="true" 
                        :model="searchData"
                        label-position='right'
                        label-width='120px'
                        class="demo-form-inline xk-search">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label='用户ID：'>
                                    <el-input v-model="searchData.xkUserId" placeholder="输入用户ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label='用户选号：'>
                                    <el-row>
                                        <el-col :span="13">
                                            <el-input v-model="searchData.redNumbers" placeholder="红球号码"></el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            <div>&nbsp;</div>
                                        </el-col>
                                        <el-col :span="10">
                                            <el-input v-model="searchData.blueNumbers" placeholder="蓝球号码"></el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label='运营彩票名称：'>
                                    <el-input v-model="searchData.typeName" placeholder="输入运营彩票名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label='选号时间：'>
                                    <el-date-picker
                                        v-model="searchData.time"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label='所在地区：'>
                                    <province-cascader v-model="searchData.region" placeholder="所属区域"></province-cascader>
                                </el-form-item>
                            </el-col>
                               <el-col :span="8">
                            <el-form-item label='彩票来源：'>
                                <el-select v-model="searchData.aaLotterySource">
                                    <el-option label="全部"></el-option>
                                    <el-option label="游戏比赛" value="competition"></el-option>
                                    <el-option label="晒单" value="jorder_comment"></el-option>
                                    <el-option label="平台抽奖" value="platform_activity "></el-option>
                                    <el-option label="店铺抽奖" value="merchant_activity"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        </el-row>
                </el-form>
                
            </div>
        </div>
        <div class='xk-body xk-radius marintop20' >
            <div class="xk-title">
                <div class='vus-title'>
                    <span></span>
                    剩余未出票： <strong class="red-tip">{{total}}</strong> 张
                </div>
                <div class='vus-btn'>
                    <span>用户所选期数：</span>
                    <el-select v-model="expectNo" :size="$size" placeholder="请选择">
                        <el-option
                        v-for="(item,index) in expectNoList"
                        :key="index"
                        :label="'第'+item.sequenceNo+'期'"
                        :value="item.sequenceNo">
                        </el-option>
                    </el-select>
                    <el-button v-permission="'abnormalLottery'" :size='$size' @click="fnInAbnormalTickets">导入异常出票</el-button>
                    <el-button v-permission="'lotteryBatch'" type='primary' :size='$size' @click="fnOutTickets">批量出票</el-button>
                </div>
                <div class='vus-bottom'></div>
            </div>
            <el-table
            :data="tableData"
            stripe
            border
            v-loading="tableLoading"
            style="width: 100%">
                <el-table-column
                    prop="userId"
                    label="用户ID">
                </el-table-column>
                <el-table-column
                    prop="aaLotteryType"
                    label="彩票类型">
                    <template slot-scope="scope">
                        {{scope.row.aaLotteryType==='super_lotto'?'大乐透':'未知'}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="typeName"
                    label="彩票名称">
                </el-table-column>
                <el-table-column
                    prop="selectNumber"
                    label="用户选号"
                    width='220'>
                    <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.selectNumber" >
                            <el-button :type="index<5?'danger':'primary'" circle :key="index"  size="mini" v-if="item">
                                {{item}}
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="lotteryNumber"
                    label="所选注数">
                </el-table-column>
                <el-table-column
                    prop="expectNo"
                    label="用户所选期数">
                    <template slot-scope="scope">
                        第{{scope.row.expectNo}}期
                    </template>
                </el-table-column>
                <el-table-column
                    prop="selectTime"
                    label="选号时间">
                    <template slot-scope="scope">
                        {{scope.row.selectTime | formatTime}}
                    </template>
                </el-table-column>

                   <el-table-column
                    label="彩票来源">
                    <template slot-scope="scope">
                        {{scope.row.aaLotterySource | aaLotterySource}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="areaCode"
                    label="所在地区">
                    <template slot-scope="scope">
                        {{getPorvinceInfo(''+scope.row.areaCode)}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="fnOutBtn(scope.row)" :size="$size" v-permission="'lotteryBatch'">出票</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
    </div>
</template>
<script>
import ProvinceCascader from "@/components/ProvinceCascader.vue";
import {getPorvinceInfo} from '@/util/publicMehotds';
export default {
    name:'lotteryWaitForTicketsList',
    data () {
        return {
            currentPage:1,
            pageSize:10,
            total:0,
            searchData:{},
            expectNoList: [],
            expectNo: '',
            tableData:[],
            tableLoading:false,
        };
    },
    props: {},
    components: {
        ProvinceCascader
    },
    computed: {},
    created() {
        this.fnInit();
    },
    mounted() {},
    methods: {
        getPorvinceInfo,
        fnSearch(){
            let obj = {};
            for (const key in this.searchData) {
                if(this.searchData[key]){
                    switch (key) {
                        case 'time':
                            obj.startTime = this.searchData[key][0].getTime()/1000;
                            obj.endTime = this.searchData[key][1].getTime()/1000;
                            break;
                        case 'region':
                            obj.areaCode = this.searchData[key][this.searchData[key].length - 1];
                            break;
                        case 'redNumbers':
                            obj.redNumbers = this.searchData[key].split(' ');
                            break;
                        case 'blueNumbers':
                            obj.blueNumbers = this.searchData[key].split(' ');
                            break;
                        default:
                            obj[key]=this.searchData[key]
                            break;
                    }
                }
            }
            this.currentPage = 1 ;//重置为第一页
            this.fnGetPage(obj);

        },
        fnClear(){
            this.searchData = {};
            this.fnGetPage();
        },
        fnpagechange(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            this.fnGetPage();
        },
        fnInAbnormalTickets(){
            this.$router.push({path:'lotteryAbnormalDetail',query:{
                expectNo:this.expectNo
            }});//异常出票
        },
        fnOutTickets(){
            this.$router.push({
                path:'lotteryBatchDetail',
                query:{
                    expectNo:this.expectNo
                }
            });//批量出票
        },
        fnOutBtn(target){
            console.log(target);
            this.$router.push({
                path:'lotteryBatchDetail',
                query:{
                    expectNo:this.expectNo
                }
            });//批量出票
        },
        fnGetPage(param={}){
            let obj = {
                ...param,
                page:this.currentPage,
                limit:this.pageSize,
                expectNo:this.expectNo,
                aaLotterySource:this.searchData.aaLotterySource
            }
            for (const key in this.searchData) {
                if(this.searchData[key]){
                    switch (key) {
                        case 'time':
                            obj.startTime = this.searchData[key][0].getTime()/1000;
                            obj.endTime = this.searchData[key][1].getTime()/1000;
                            break;
                        case 'region':
                            obj.areaCode = this.searchData[key][this.searchData[key].length - 1];
                            break;
                        case 'redNumbers':
                            obj.redNumbers = this.searchData[key].split(' ');
                            break;
                        case 'blueNumbers':
                            obj.blueNumbers = this.searchData[key].split(' ');
                            break;
                        default:
                            obj[key]=this.searchData[key]
                            break;
                    }
                }
            }
            console.log(obj)
            this.tableLoading = true ;
            this.$http.get(this.$api.aaLotteryInvoiceQPage, obj, true).then((res) => {
                console.log(res)
                this.tableLoading = false ;
                this.total = res? res.total: 0;
                this.tableData = res? res.data: [];
            }).catch((err) => {
                this.tableLoading = false ;
                this.tableData = [];
                this.$message.error(err.message);
            });
        },
        async fnInit(){
            let qiBoolean = await this.sequenceNotOpenList();
            if(qiBoolean){
                this.expectNo = this.expectNoList[0].sequenceNo ;
                this.fnGetPage();
            }else{
                this.$message.error('无有效期！')
            }
        },
        sequenceNotOpenList(){
            let obj = {
                type:"super_lotto"
            }
            return new Promise((resolve,reject)=>{
                this.$http.get(this.$api.sequenceNotOpenList, obj, true).then((res) => {
                    // console.log(res)
                    if(res && res.length){
                        this.expectNoList = res ;
                        resolve(true)
                    }else{
                        this.expectNoList = [];
                        resolve(false)
                    }
                }).catch((err) => {
                    // console.log(err);
                    resolve(false)
                    this.$message.error(err.message);
                });
            })
            
        }
    },
    watch: {
        expectNo(val,old){
            if(old){
                this.currentPage=1;
                this.fnGetPage();
            }
        }
    }
}
</script>
<style scoped lang="scss">
.xk-search{
    .el-form-item{
        width: 100%
    }
    /deep/ .el-form-item__content{
        width: calc(100% - 120px) !important;
    }
}
.red-tip{
    color: red
}
</style>