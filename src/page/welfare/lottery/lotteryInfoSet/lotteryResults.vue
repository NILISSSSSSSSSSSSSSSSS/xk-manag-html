<template>
    <div class = 'lotter-results'>
        <div class='xk-title' v-loading="qiLoading">
            <!-- <div class="vus-title">
                <span></span>
                公共服务大厅搜索
            </div> -->
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="fnSearch">查询</el-button>
                <el-button type="danger" :size="$size" @click="fnClear">清空</el-button>
            </div>
            <!-- <div class="vus-bottom"></div> -->
            <el-form :size="$size" 
                    :inline="true" 
                    :model="searchData"
                    class="demo-form-inline xk-search"
                    style="padding-right:150px">
                <el-form-item label='运营彩票名称：'>
                    <el-input v-model="searchData.name" placeholder="输入彩票名称"></el-input>
                </el-form-item>
                <el-form-item label="开奖期数：">
                    <el-select v-model="searchData.sequenceNo ">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="'第'+item.label+'期'" :value="item.value" v-for="(item,index) in qiList" :key="index" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开奖时间：">
                    <el-date-picker
                        v-model="searchData.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="vus-bottom"></div>
        </div>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    开奖结果
                </div>
                <div class="vus-btn">
                    <el-button v-permission="'closeCityTime'" :size="$size" @click="bCloseMarketTime=true,closeTimeArr=[]">登记休市时间</el-button>
                    <el-button v-permission="'lotteryResultAddNew'" type="primary" :size="$size" @click="fnAddNew">新增开奖结果</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                v-loading="tableLoad"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="运营彩票名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sequenceNo"
                    label="开奖期数"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="winningNo"
                    label="开奖号码">
                    <template slot-scope="scope">
                        <template v-for="(item,index) in scope.row.winningNo" >
                            <el-button :type="index<5?'danger':'primary'" circle :key="index"  size="mini">
                                {{item}}
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sequenceTime"
                    label="开奖时间">
                    <template slot-scope="scope">
                        {{scope.row.sequenceTime.end | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'lotteryResultLook'" @click="fnLook(scope.row)" :size="$size" >查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
        <el-dialog
            title="新增开奖结果"
            :visible.sync="dialogAdd"
            width="700px"
            :before-close="handleClose">
            <el-form ref="addForm" :model="addForm" label-width="180px" :rules="rules" v-if="addOpation.length">
                <el-form-item label="彩票类型：">
                    体彩——超级大乐透
                </el-form-item>
                <el-form-item label="开奖期数：" prop="sequenceNo">
                    <el-select v-model="addForm.sequenceNo" placeholder="请选择" :size="$size">
                        <el-option
                            v-for="item in addOpation"
                            :key="item.sequenceNo"
                            :label="'第'+item.sequenceNo+'期'"
                            :value="item.sequenceNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运营彩票名称：">
                    {{addData.name}}
                </el-form-item>
                <el-form-item label="开奖时间：">
                    {{addData.sequenceTime.end | formatTime}}
                </el-form-item>
                <el-form-item label="当期奖池：">
                    {{addData.jackpotAmount | Division | NumThree}}元
                </el-form-item>
                <el-form-item label="开奖号码：" prop="inputNum">
                    <el-input 
                        class="lottery-number" 
                        :size="$size"
                        style="width:180px"
                        v-model="addForm.inputNum"></el-input>
                        <span style="color:#f44336">请准确核对当期开奖号码</span>
                        <el-popover
                            placement="top-start"
                            width="300"
                            trigger="hover">
                            <div class="rule">
                                <p>1、号码加空格，前五位号码为红色，后两位号码为蓝色</p>
                                <p>2、小于10的前面加0，如  1 则输入 01</p>
                                <p>3、示例：01 02 11 12 15 06 13</p>
                            </div>
                            <el-button slot="reference" type="text"> 规则</el-button>
                        </el-popover>
                </el-form-item>
            </el-form>
            <div v-else>无待开奖期数</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" :size="$size">取 消</el-button>
                <el-button type="primary" :size="$size" @click="fnAddSubmit" :disabled="!addOpation.length">计算中奖结果</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="登记休市时间"
            :visible.sync="bCloseMarketTime"
            width="700px"
            >
            <div class="close-time-content" v-loading="closeTimeVLoading">
                <div class="tip">注：当到达休市时间时，立即生效，不可修改该时间</div>
                <div class="date-pick" v-for="(item,index) in closeTimeArr" :key="index">
                    <!-- <el-date-picker
                        :disabled="item.cannotDel"
                        v-model="closeTimeArr[index]"
                        :size="$size"
                        value-format="timestamp"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker> -->
                    <lottery-date v-model="closeTimeArr[index]"></lottery-date>
                    <!-- <el-button :disabled="item.cannotDel" type="danger" :size="$size" @click="closeTimeArr.splice(index,1)">删除本条休市时间</el-button> -->
                </div>
                <el-button type="success" :size="$size" @click="closeTimeArr.push('')">添加</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button :size="$size" @click="bCloseMarketTime = false">取 消</el-button>
                <el-button :size="$size" type="primary" @click="addStopSetting" :loading="closeTimeLoading">保 存</el-button>
            </span>
        </el-dialog>
        <lottery-look :visible.sync="dialogLook" :sequenceNo="sequenceNo"></lottery-look>
        <lottery-add-result :visible.sync="lotteryAddResult" :dialogAdd.sync='dialogAdd' :lotteryResult="lotteryResult" :maxPrice='maxPrice'></lottery-add-result>
    </div>
</template>
<script>
import lotteryLook from './lotteryLook';
import lotteryAddResult from './lotteryAddResult';
import lotteryDate from "./lotteryDate"
export default {
    name:'lotteryResults',
    data () {
        return {
            currentPage:1,
            pageSize:10,
            total:0,
            searchData:{},
            tableData: [],
            dialogAdd:false,
            dialogLook:false,
            addForm:{
                sequenceNo:""
            },
            addOpation:[],
            lotteryAddResult:false,
            tableLoad:false,
            lookLoad:false,//查看
            sequenceNo:'',
            qiList:[],//所有已开奖期
            qiLoading:false,//所有已开奖期
            rules:{
                sequenceNo: [
                    { required: true, message: '请选择开奖期数', trigger: 'change' }
                ],
                inputNum:[
                    { required: true, message: '请输入开奖号码', trigger: 'blur' },
                    { min: 20,max:20, message: '输入号码不符合规则', trigger: 'blur' }
                ]
            },
            addLoading:false,//新增开奖结果
            lotteryResult:{},//彩票开奖结果查询
            maxPrice:0,//小额兑奖最大值
            bCloseMarketTime:false,
            closeTimeArr:[],
            closeTimeLoading:false,
            closeTimeVLoading:false,
        };
    },
    props: {},
    components: {
        lotteryLook,
        lotteryAddResult,
        lotteryDate
    },
    computed: {
        addData(){
            let arr = this.addOpation.filter((item)=>{
                return item.sequenceNo == this.addForm.sequenceNo ;
            })
            return arr[0]?arr[0]:{sequenceTime:{}};
        }
    },
    created() {
        this.fnGetSequenceWinningList();
        this.sequenceNoAll();
    },
    mounted() {},
    methods: {
        fnSearch(){
            let obj = {};
            for (const key in this.searchData) {
                if(this.searchData[key]){
                    if (key==='time') {
                        obj.startTime  = this.searchData[key][0].getTime()/1000;
                        obj.endTime   = this.searchData[key][1].getTime()/1000;
                    }else{
                        obj[key] = this.searchData[key]
                    }
                }
            }
            this.fnGetSequenceWinningList(obj);
        },
        fnClear(){
            this.searchData = {} ;
            this.fnGetSequenceWinningList();
        },
        fnAddNew(){
            this.dialogAdd = true ;
            this.$nextTick(()=>{
                try {
                    this.$refs.addForm.resetFields();
                } catch (error) {
                    
                }
            })
            this.sequenceNotWinningList();
        },
        fnpagechange(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            this.fnGetSequenceWinningList();
        },
        fnLook(target){
            this.sequenceNo = target.sequenceNo;
            this.dialogLook = true ;
        },
        handleClose(){
            this.dialogAdd = false ;
        },
        fnAddSubmit(){
            this.$refs.addForm.validate((valid)=>{
                if(valid){
                    this.lotteryAddResult = true ;
                    let arr = this.addForm.inputNum.split(' ');
                    this.lotteryResult = {
                        sequenceNo:this.addForm.sequenceNo,
                        numbers:arr,
                        jackpotAmount:this.addData.jackpotAmount
                    }
                    this.maxPrice = this.addData.maxPrice
                }else{
                    return false ;
                }
            })
        },
        fnGetSequenceWinningList(params={}){//查询已开奖的期（吴常辉）
            let obj = {
                request:{
                    ...params,
                    aaLotteryType:"super_lotto"
                },
                limit:this.pageSize,
                page:this.currentPage,
            }
            this.tableLoad = true ;
            console.log(obj)
            this.$http.get(this.$api.sequenceWinningList,obj , true).then((res) => {
                console.log(res);
                this.tableData = res? res.data: [];
                this.total = res? res.total: 0;
                this.tableLoad = false ;
            }).catch((err) => {
                this.tableLoad = false ;
                this.tableData = [];
                this.$message.error(err.message);
            });
        },
        sequenceNoAll(){//查询所有已开奖期号（吴常辉）
            this.qiLoading = true ;
            this.$http.get(this.$api.sequenceNoAll,{type:'super_lotto'} , true).then((res) => {
                if(res){
                    res.forEach(item => {
                        this.qiList.push({
                            label:item,
                            value:item
                        })
                    });
                }else{
                    this.qiList = []
                }
                this.qiLoading = false ;
            }).catch((err) => {
                this.qiLoading = false ;
                this.$message.error(err.message);
            });
        },
        sequenceNotWinningList(){//查询未开奖的已结束期（吴常辉）
            let param = {
                type:"super_lotto"
            }
            this.addLoading = true ;
            this.$http.get(this.$api.sequenceNotWinningList,param , true).then((res) => {
                console.log(res)
                this.addLoading = false ;
                if(res && res.length){
                    this.addOpation = res ;
                    this.addForm.sequenceNo = res[0].sequenceNo
                }else{
                    this.addOpation = [];
                }
            }).catch((err) => {
                console.log(err);
                this.addLoading = false ;
                this.addOpation = [];
                this.$message.error(err.message);
            });
        },
        stopSettingDetail(){
            let params = {
                guid:"web"
            } ;
            this.closeTimeVLoading = true ;
            this.$http.get(this.$api.stopSettingDetail,params , true).then((res) => {
                this.closeTimeVLoading = false ;
                if(res){
                    res.dateSettings.forEach(item => {
                        let arr = [
                            item.start*1000,
                            item.end*1000
                        ]
                        // 新增为undefined 所以取反
                        arr.cannotDel = !item.canModify ;
                        arr.id = item.id ;
                        this.closeTimeArr.push(arr);
                    });
                }
            }).catch((err) => {
                this.closeTimeVLoading = false ;
                this.$message.error(err.message);
            });
        },
        addStopSetting(){
            this.closeTimeLoading = true ;
            let dateSettings = this.closeTimeArr.filter(item=>{
                return !item.cannotDel && item[0] && item[1];
            }).map(item=>{
                return item.id ? {
                            start:item[0]/1000,
                            end:item[1]/1000,
                            id:item.id
                        }:{
                            start:item[0]/1000,
                            end:item[1]/1000
                        }
            });
            let params = {
                stopSetting:{
                    dateSettings
                }
            }
            console.log(params)
            this.$http.get(this.$api.addStopSetting,params , true).then((res) => {
                this.bCloseMarketTime = false ;
                this.closeTimeLoading = false ;
            }).catch((err) => {
                this.closeTimeLoading = false ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        bCloseMarketTime(val){
            if(val){
                this.stopSettingDetail();
            }
        }
    }
}
</script>
<style scoped lang="scss">
/deep/ .el-dialog__footer{
    text-align: center
}
@import "./lotteryResult.scss"
</style>