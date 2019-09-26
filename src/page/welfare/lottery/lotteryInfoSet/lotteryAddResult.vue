<template>
    <div class="lottery-add-result">
        <el-dialog
            :visible.sync="visible"
            width="900px"
            title="新增开奖结果"
            :size="$size"
            :before-close="handleClose">
            <h5>说明：若当期浮动奖项中奖时，需要登记浮动奖金</h5>
            <el-table
                :data="lotteryData.winningList"
                border
                stripe
                v-loading="loading"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="奖项">
                </el-table-column>
                <el-table-column
                    prop="condition"
                    label="中奖条件">
                    <template slot-scope="scope">
                        <span v-for="item in scope.row.condition" :key="item">
                            {{item}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="winningNum"
                    label="中奖注数">
                </el-table-column>
                <el-table-column
                    prop="singlePrice"
                    label="单注奖金"
                    width='140'>
                    <template slot-scope="scope">
                        <div v-if="scope.$index<2">
                            <div>
                                <el-input  :size="$size" v-model.number="scope.row.singlePrice" style="width:100px" @keyup.native="fnReg(scope.$index,scope.row.singlePrice)"></el-input>
                                <span>元</span>
                            </div>
                            <transition name="fade">
                                <div class="error" v-show="errArr[scope.$index]">
                                    {{error}}
                                </div>
                            </transition>
                        </div>
                        <span v-else>{{scope.row.singlePrice | Division | NumThree}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="taxMoney"
                    label="税后单注奖金">
                    <template slot-scope="scope">
                        <span v-if="scope.$index<2">{{(scope.row.singlePrice*0.8).toFixed(2) | NumThree}}元
                        </span>
                        <span v-else>{{scope.row.singlePrice | Division | NumThree}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="shouldMoney"
                    label="应发奖金合计">
                    <template slot-scope="scope">
                        <span v-if="scope.$index<2">{{(scope.row.singlePrice*0.8*scope.row.winningNum).toFixed(2) | NumThree}}元
                        </span>
                        <span v-else>{{(scope.row.singlePrice*scope.row.winningNum).toFixed(2) | Division | NumThree}}元</span>
                    </template>
                </el-table-column>
            </el-table>
            <h2 class="look-h2">
                <div>统计：</div>
                <div>
                    <div>共计兑奖<span>{{lotteryData.totalNum}}</span>注彩票</div>
                    <div>线上兑奖<span>{{lotteryData.couponPriceOnLine | Division}}</span>消费券，需转账<span>{{lotteryData.moneyOnLine | Division}}</span> 人民币到营销账户</div>
                    <div>线下兑奖<span>{{downNum | NumThree}}</span>人民币</div>
                    <div>注意：请确认是否已转账到营销账户</div>
                </div>
            </h2>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" :size="$size">返 回</el-button>
                <el-button type="primary" @click="fnSureCarryOver" :size="$size">确认已转账</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="确认转账"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleAgainClose">
            <el-form label-width="160px">
                <el-form-item label="运营彩票名称：">
                    大乐透
                </el-form-item>
                <el-form-item label="开奖期数：">
                    <h3>
                        第 <span class="red">{{lotteryResult.sequenceNo}}</span> 期
                    </h3>
                </el-form-item>
                <el-form-item label="当期奖池：">
                   <span class="red">{{lotteryResult.jackpotAmount | Division | NumThree}}</span>元
                </el-form-item>
                <el-form-item label="开奖号码：">
                    <template v-for="(item,index) in lotteryResult.numbers">
                        <span class="red" v-if="index<5" :key='index'>{{item}} </span>
                        <span v-if="index==5" :key='index'>+</span>
                        <span class="blue" v-if="index>=5" :key='index'>{{item}} </span>
                    </template>
                    
                </el-form-item>
                <el-form-item label="浮动奖金（单注）：" v-if="lotteryData.winningList && lotteryData.winningList.length">
                    <div>
                        一等奖：<span class="red">{{lotteryData.winningList[0].singlePrice?lotteryData.winningList[0].singlePrice:0 | NumThree}}元</span>
                    </div>
                    <div>
                        二等奖：<span class="red">{{lotteryData.winningList[1].singlePrice?lotteryData.winningList[1].singlePrice:0  | NumThree}}元</span>
                    </div>
                </el-form-item>
            </el-form>
            <h2 class="look-h2">
                <div>请确认：</div>
                <div>
                    <div>线上兑奖<span>{{lotteryData.couponPriceOnLine | Division}}</span>消费券，需转账<span>{{lotteryData.moneyOnLine | Division}}</span> 人民币到营销账户。</div>
                    <div>请确认是否转账！</div>
                </div>
            </h2>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleAgainClose" :size="$size">返 回</el-button>
                <el-button type="primary" @click="fnAgainSure" :size="$size" :loading="sureLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'lotteryAddResult',
    data () {
        return {
            lotteryData:{},
            error:"请输入数字",
            errArr:[false,false],
            dialogVisible:false,
            loading:false,
            sureLoading:false,
            lineOffArr:[],//线下兑奖信息
        };
    },
    props: {
        visible:{},
        dialogAdd:{},
        lotteryResult:{},
        maxPrice:{}
    },
    components: {},
    computed: {
        downNum(){
            let [oneNum,twoNum,otherNum]=[0,0,0]
            try {
                oneNum = this.lotteryData.winningList[0].singlePrice*0.8*this.lotteryData.winningList[0].winningNum;
                twoNum = this.lotteryData.winningList[1].singlePrice*0.8*this.lotteryData.winningList[1].winningNum;
                this.lineOffArr.forEach(item => {
                    otherNum += item.singlePrice*item.winningNum/100 ;
                });
            } catch (error) {
                
            }
            return (oneNum + twoNum + otherNum).toFixed(2)
        }
    },
    created() {},
    mounted() {},
    methods: {
        handleClose(){
            this.$emit('update:visible',false);
        },
        fnReg(index,val){
            if(typeof val != 'number'){
                this.$set(this.errArr,index,true);
                this.error = '请输入数字';
            }else{
                this.$set(this.errArr,index,false);
                this.error = '请输入数字';
            }
        },
        fnSureCarryOver(){
            if(this.lotteryData.winningList[0].winningNum && !this.lotteryData.winningList[0].singlePrice){
                this.$set(this.errArr,0,true);
                this.error = '因为有人中奖，所以此单注奖金必填';
                return false ;
            }
            if(this.lotteryData.winningList[1].winningNum && !this.lotteryData.winningList[1].singlePrice){
                this.$set(this.errArr,1,true);
                this.error = '因为有人中奖，所以此单注奖金必填';
                return false ;
            }
            this.dialogVisible = true ;
        },
        handleAgainClose(){
            this.dialogVisible = false ;
        },
        fnAgainSure(){
            let obj = {
                sequence:{
                    sequenceNo:this.lotteryResult.sequenceNo,
                    totalNum:this.lotteryData.totalNum,
                    aaLotteryType:"super_lotto",
                    winningNo:this.lotteryResult.numbers,
                    awardsSettings:this.lotteryData.winningList,
                    id:this.lotteryData.id,
                    // moneyOnLine:this.lotteryData.moneyOnLine,
                    couponPriceOnLine:this.lotteryData.couponPriceOnLine,
                    priceOnline:this.lotteryData.moneyOnLine,
                    priceOffline: this.$math.multip(this.downNum, 100),
                }
            }
            //乘以100
            if(obj.sequence.awardsSettings.length){
                for (let index = 0; index < obj.sequence.awardsSettings.length; index++) {
                    if(obj.sequence.awardsSettings[index].isFloat && obj.sequence.awardsSettings[index].singlePrice){
                        obj.sequence.awardsSettings[index].singlePrice = this.$math.multip(obj.sequence.awardsSettings[index].singlePrice, 100)
                    }
                }
            }
            console.log(obj)
            this.sureLoading = true ;
            this.$http.get(this.$api.drawLottery, obj, true).then((res) => {
                console.log(res)
                this.dialogVisible = false ;
                this.sureLoading = false ;
                this.$emit('update:visible',false);
                this.$emit('update:dialogAdd',false);
                try {
                    this.$parent.fnGetSequenceWinningList();
                } catch (error) {
                    
                }
            }).catch((err) => {
                console.log(err);
                this.dialogVisible = false ;
                this.sureLoading = false ;
                this.$emit('update:visible',false);
                this.$emit('update:dialogAdd',false);
                this.$message.error(err.message);
            });
            
        },
        fnGetDetail(param){
            this.loading = true ;
            let obj = {
                ...param,
                type:"super_lotto"
            }
            console.log(obj)
            this.$http.get(this.$api.lotteryResult,obj , true).then((res) => {
                console.log(res)
                if(res){
                    this.lotteryData = res ;
                    this.lineOffArr = res.winningList.filter(item=>{
                        return item.singlePrice > this.maxPrice ;
                    });
                }else{
                    this.lotteryData = {}
                }
                this.loading = false ;
            }).catch((err) => {
                console.log(err);
                this.loading = false ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        visible(val){
            if(val){
                let obj = {
                    numbers:this.lotteryResult.numbers,
                    sequenceNo:this.lotteryResult.sequenceNo,
                }
                this.fnGetDetail(obj);
            }
        }
    }
}
</script>
<style scoped lang='scss'>
.look-h2{
    display: flex;
    font-size: 18px;
    color: #333;
    padding-top: 20px;
    span{
        color: #f44336
    }
}
.error{
    color: #f44336
}
.red{
    color: #f44336;
    font-size: 26px;
    font-weight: 600
}
.blue{
    color: #2196f3;
    font-size: 26px;
    font-weight: 600
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>