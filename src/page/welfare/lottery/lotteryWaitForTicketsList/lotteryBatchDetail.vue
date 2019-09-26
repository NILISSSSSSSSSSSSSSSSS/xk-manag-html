<template>
    <div class = 'xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                 <span></span>
                    扫描出票
                </div>
                <div style="display:none">
                    <select id="device" style="width: 90px" name="device" onchange="changeDev()"></select>
                    <select id="selRes" style="width: 90px" name="selRes"></select>
                </div>
                <div class='vus-bottom'></div>
                <div class="video-area-out">
                    <div id="video-area">
                        <object id="view1" type="application/x-eloamplugin" width="912" height="684" name="view"></object>
                        <div id="DominoActionBar">
                            <iframe id='iframebar' :style="{left:actX/4+'px',top:actY/4+'px'}" src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0></iframe>
                        </div>
                    </div>
                    <div class="video-set">
                        <span>截图初始位置:</span>
                        <span>X:</span>
                        <el-input :size="$size" v-model.number="actX" @keyup.native.up="actX+=10" @keyup.native.down="actX-=10"></el-input>
                        <span>Y:</span>
                        <el-input :size="$size" v-model.number="actY" @keyup.native.up="actY+=10" @keyup.native.down="actY-=10"></el-input>
                        <el-button :size="$size" @click="Scan" :disabled="!baiduToken || phoneIng" :loading="phoneIng">拍照识别</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class='xk-body xk-radius marintop20' style="min-height:820px">
            <div class='xk-title'>
                <div class='vus-title'>
                 <span></span>
                    拍照结果
                </div>
                <div class='vus-btn out-top' v-loading="!qiList.length">
                    <span>彩票期数：</span>
                        <el-select :size="$size" v-model="qiNumber" placeholder="请选择">
                            <el-option
                            v-for="item in qiList"
                            :key="item.sequenceNo"
                            :label="'第'+item.sequenceNo+'期'"
                            :value="item.sequenceNo">
                            </el-option>
                        </el-select>
                    开奖时间：<span v-if="thisQi.length" style="color:red">{{thisQi[0].sequenceTime.end | formatTime}} </span>
                    当期奖池：<el-input v-model.number="nowJackpotAmount" v-if="thisQi.length" placeholder="请输入奖池" :size="$size"></el-input>
                </div>
                <div class='vus-bottom'></div>
                <div class="handle-btn">
                    <b class="tip">（请准确核对彩票基本信息，保证准确）</b>
                    <el-button :size="$size" @click="fnAbnormalTicketBtn" :disabled="!this.errArr.length">导出异常出票</el-button>
                    <el-button :size="$size" type="primary" @click="fnOutTicketBtn" :disabled="!this.succussArr.length">出 票</el-button>
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    border
                    v-loading="phoneIng"
                    style="width: 100%">
                    <el-table-column
                        prop="smallUrl"
                        label="扫描图片"
                        width="320">
                        <template slot-scope="scope">
                            <img width="300" :src="scope.row.smallUrl" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="ocrNumArr"
                        width="260"
                        label="识别号码">
                        <template slot-scope="scope">
                            <el-input style="width:130px;margin-right:10px" :size="$size" v-model.trim="scope.row.ocrNumArr[0]"></el-input>
                            <el-input style="width:70px" :size="$size" v-model.trim="scope.row.ocrNumArr[1]"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="succuss"
                        label="匹配结果">
                        <template slot-scope="scope">
                            <span style="color:green" v-if="scope.row.succuss">成功</span>
                            <span style="color:red" v-else>失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userId"
                        label="用户ID">
                    </el-table-column>
                    <el-table-column
                        prop="userNumbers"
                        label="用户选择号码">
                        <template slot-scope="scope">
                            <template v-for="(item,index) in scope.row.userNumbers" >
                                <el-button :type="index<5?'danger':'primary'" circle :key="index"  size="mini" v-if="item">
                                    {{item}}
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="bigUrl"
                        width="320"
                        label="彩票全图">
                        <template slot-scope="scope">
                            <!-- <div style="width:300px;height:387px;margin-top:40px">
                                <img width="300" :src="scope.row.bigUrl" class="bigimg" alt=""> 
                            </div> -->
                            <img width="300" :src="scope.row.bigUrl" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button :size="$size" @click="fnRestart(scope.row,scope.$index)" :loading="scope.row.reStartLoaing">重新匹配</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
            title="确认出票"
            :visible.sync="dialogVisibleOut"
            width="600px"
            :before-close="handleCloseOut">
            <el-form label-width="120px" v-if="thisQi.length">
                <el-form-item label="彩票期数：">
                    第{{qiNumber}}期
                </el-form-item>
                <el-form-item label="开奖时间：">
                    {{thisQi[0].sequenceTime.end | formatTime}}
                </el-form-item>
                <el-form-item label="当期奖池：">
                    {{nowJackpotAmount | NumThree}}元
                </el-form-item>
                <el-form-item label="识别号码：">
                    <div v-for="item in succussArr" :key="item">
                        <template v-for="(item,index) in item.userNumbers" >
                            <el-button :type="index<5?'danger':'primary'" circle :key="index"  size="mini" v-if="item">
                                {{item}}
                            </el-button>
                        </template>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleOut = false" :size="$size">返 回</el-button>
                <el-button type="primary" @click="fnOutTicket" :size="$size" :loading="outTicketLoading">出 票</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="再次确认"
            :visible.sync="dialogVisibleAbnormal"
            width="600px"
            :before-close="handleCloseAbnormal">
            <el-form label-width="120px">
                <template v-for="(item,index) in errArr">
                    <div v-if="item.ocrNumArr.length&&item.ocrNumArr[0]&&item.ocrNumArr[0].length>10&&item.ocrNumArr[1]&&item.ocrNumArr[1].length>4" :key="index">
                        <el-form-item label="扫描图片：">
                            <img :src="item.smallUrl" width="300">
                        </el-form-item>
                        <el-form-item label="识别号码：">
                            {{item.ocrNumArr[0]}}
                            +
                            {{item.ocrNumArr[1]}}
                        </el-form-item>
                        <el-form-item label="出票期数：">
                            第{{qiNumber}}期
                        </el-form-item>
                    </div>
                </template>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleAbnormal = false" :size="$size">返 回</el-button>
                <el-button type="primary"  @click="fnSureAbnormal" :size="$size" :loading="abnormalLoading">确 定</el-button>
            </span>
        </el-dialog>
        <div class="xk-back-btn">
            <el-button :size="$size" @click="$router.push('lotteryWaitForTicketsList')">返回</el-button>
        </div>
    </div>
</template>
<script>
import {liangTianData,liangTianMethods} from "./liangTian.js"

export default {
    name:'lotteryBatchDetail',
    data () {
        return {
            tableData: [],
            dialogVisibleOut:false,
            dialogVisibleAbnormal:false,
            ...liangTianData,
            baiduToken:"",
            phoneIng:false,
            qiList:[],//所有期列表
            qiNumber:"",//当前期号
            outTicketLoading:false,
            abnormalLoading:false,
            urlExpectNo:null,
            nowJackpotAmount:0
        };
    },
    props: {},
    components: {},
    computed: {
        thisQi(){//当前期所有信息
            let arr = this.qiList.filter(item=>{
                return item.sequenceNo == this.qiNumber ;
            })
            try {
                this.nowJackpotAmount = arr[0].jackpotAmount/100 ;
            } catch (error) {
                
            }
            return arr ;
        },
        errArr(){
            let arr = this.tableData.filter(item=>{
                return !item.succuss && item.ocrNumArr.length;
            });
            return arr ;
        },
        succussArr(){
            let arr = this.tableData.filter(item=>{
                return item.succuss
            });
            return arr ;
        }
    },
    created() {
        this.urlExpectNo = this.$route.query.expectNo ;
        this.invoiceTicketToken();
        this.sequenceNotOpenList();
    },
    mounted() {
        this.$nextTick(()=>{
            this.Init()
        })
    },
    methods: {
        ...liangTianMethods,
        fnRestart(target,index){
            console.log(target,index);
            if(target.ocrNumArr && target.ocrNumArr.length == 2){
                this.tableData[index]['reStartLoaing'] = true ;
                this.tableData.push();
                let ids = [];
                try {
                    this.tableData.forEach(item=>{
                        if(item.succuss){
                            ids.push(item.allData.id)
                        }
                    })
                } catch (error) {
                    
                }
                this.fnToMatch({ids},index)
            }else{
                this.$message.error('识别号码不符合规范');
            }
        },
        fnAbnormalTicketBtn(){
            let _this = this ;
            let num = $(".xk-container").get(0).scrollHeight ;
            $('.xk-container').animate({
                scrollTop: num - 867
            }, 300,function(){
                _this.dialogVisibleAbnormal = true ;
            });
        },
        fnOutTicketBtn(){
            let _this = this ;
            let num = $(".xk-container").get(0).scrollHeight ;
            $('.xk-container').animate({
                scrollTop: num - 867
            }, 300,function(){
                _this.dialogVisibleOut = true ;
            });
        },
        handleCloseOut(){
            this.dialogVisibleOut = false ;
        },
        handleCloseAbnormal(){
            this.dialogVisibleAbnormal = false ;
        },
        fnOutTicket(){
            let obj = {
                invoiceRecord:[],
                jackpotAmount: Number(this.$math.multip(this.nowJackpotAmoun, 100).toFixed(2))
            }
            this.succussArr.forEach(item => {
                console.log(item.ocrNum)
                obj.invoiceRecord.push({
                    aaLotteryType:"super_lotto",
                    aaLotterySequenceNo:this.qiNumber,
                    scanPic:item.smallUrl,
                    isMatchSuccess:1,
                    // discriminateNo:item.ocrNum,
                    discriminateNo:item.ocrNumArr[0] + " + " + item.ocrNumArr[1],
                    matchSequenceNo:item.allData.expectNo,
                    aaLotteryId:item.allData.id,
                    maxPic:item.bigUrl,
                })
            });
            console.log(obj)
            this.outTicketLoading = true ;
            this.$http.get(this.$api.invoiceSuccessTickets, obj, true).then((res) => {
                console.log(res)
                this.outTicketLoading = false ;
                this.dialogVisibleOut = false ;
            }).catch((err) => {
                console.log(err);
                this.outTicketLoading = false ;
                this.dialogVisibleOut = false ;
                this.$message.error(err.message);
            });
        },
        fnSureAbnormal(){
            let obj = {
                invoiceRecord:[],
                jackpotAmount:Number(this.$math.multip(this.nowJackpotAmount, 100).toFixed(2))
            }
            
            this.errArr.forEach(item => {
                console.log(item.ocrNum)
                if(item.ocrNumArr.length&&item.ocrNumArr[0]&&item.ocrNumArr[1]){
                    obj.invoiceRecord.push({
                        aaLotteryType:"super_lotto",
                        aaLotterySequenceNo:this.qiNumber,
                        scanPic:item.smallUrl,
                        // discriminateNo:item.ocrNum,
                        discriminateNo:item.ocrNumArr[0] + " + " + item.ocrNumArr[1],
                        isMatchSuccess:0,
                        matchSequenceNo:this.qiNumber,
                        maxPic:item.bigUrl,
                    })
                }
            });
            console.log(obj)
            this.abnormalLoading = true ;
            this.$http.get(this.$api.invoiceFailedTickets, obj, true).then((res) => {
                console.log(res)
                this.abnormalLoading = false ;
                this.dialogVisibleAbnormal = false ;
            }).catch((err) => {
                console.log(err);
                this.abnormalLoading = false ;
                this.dialogVisibleAbnormal = false ;
                this.$message.error(err.message);
            });
            
        },
        invoiceTicketToken(){
            this.$http.get(this.$api.invoiceTicketToken, {}, true).then((res) => {
                console.log(res)
                this.baiduToken = res.token ;
            }).catch((err) => {
                console.log(err);
                this.baiduToken = '' ;
                this.$message.error(err.message);
            });
        },
        sequenceNotOpenList(){
            this.$http.get(this.$api.sequenceNotOpenList,{type:'super_lotto'} , true).then((res) => {
                console.log(res)
                if(res && res.length){
                    this.qiList = res ;
                    if(this.urlExpectNo){
                        this.qiNumber = this.urlExpectNo
                    }else{
                        this.qiNumber = res[0].sequenceNo ;
                    }
                }else{
                    this.qiList = [] ;
                }
            }).catch((err) => {
                console.log(err);
                this.qiList = [] ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {},
}
</script>
<style scoped lang="scss">
@import "./lotteryBatchDetail.scss"
</style>