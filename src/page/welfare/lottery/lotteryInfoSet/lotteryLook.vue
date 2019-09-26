<template>
    <div v-if="visible">
        <el-dialog
            :visible.sync="visible"
            width="600px"
            :size="$size"
            :before-close="handleLookClose">
            <el-form label-width="120px" v-loading="loading">
                <el-form-item label="彩类类型：">
                    体育彩票——超级大乐透
                </el-form-item>
                <el-form-item label="运营彩票名称：">
                    {{lotteryData.name}}
                </el-form-item>
                <el-form-item label="开奖期数：">
                    第{{lotteryData.sequenceNo}}期
                </el-form-item>
                <el-form-item label="开奖时间：">
                    {{lotteryData.sequenceTime.end | formatTime}}
                </el-form-item>
                <el-form-item label="当期奖池：">
                    {{lotteryData.jackpotAmount | Division | NumThree}}元
                </el-form-item>
                <el-form-item label="开奖号码：">
                    <template v-for="(item,index) in lotteryData.winningNo">
                        <span style="color:red" v-if="index < 5" :key="index">{{item}} </span>
                        <span style="color:blue" v-else :key="index">{{index==5?"+ " + item : item}} </span>
                    </template>
                    
                </el-form-item>
            </el-form>
            <el-table
                :data="lotteryData.awardsSettings"
                border
                stripe
                v-loading="loading"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="奖项">
                </el-table-column>
                <el-table-column
                    prop="winningNum"
                    label="中奖注数">
                    <template slot-scope="scope">
                        {{scope.row.winningNum | NumThree}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="singlePrice"
                    label="单注奖金">
                    <template slot-scope="scope">
                        {{scope.row.singlePrice | Division | NumThree }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="singlePriceAfter"
                    label="税后单注奖金">
                    <template slot-scope="scope">
                        {{scope.row.singlePriceAfter | Division | NumThree}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="priceTotal"
                    label="应发奖金合计">
                    <template slot-scope="scope">
                        {{scope.row.priceTotal | Division | NumThree}}
                    </template>
                </el-table-column>
            </el-table>
            <h2 class="look-h2">
                <div>统计：</div>
                <div>
                    <div>共计兑奖<span>{{lotteryData.totalNum?lotteryData.totalNum:0}}</span>注彩票</div>
                    <div>线上兑奖<span>{{lotteryData.couponPriceOnLine?lotteryData.couponPriceOnLine:0 | Division}}</span>消费券，需转账<span>{{lotteryData.priceOnline?lotteryData.priceOnline:0 | Division}}</span> 人民币到营销账户</div>
                    <div>线下兑奖<span>{{lotteryData.priceOffline?lotteryData.priceOffline:0 | Division}}</span>人民币</div>
                </div>
            </h2>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleLookClose" :size="$size">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'',
    data () {
        return {
            lotteryData:{
                sequenceTime:{}
            },
            loading:false
        };
    },
    props: {
        visible:{},
        sequenceNo:{}
    },
    components: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleLookClose(){
            this.$emit('update:visible',false)
        },
        fnGetData(){//彩票开奖结果查询（吴常辉）
            let obj = {
                sequenceNo:this.sequenceNo,
                type:"super_lotto"
            } ;
            this.loading = true ;
            this.$http.get(this.$api.sequenceDetail, obj, true).then((res) => {
                console.log(res)
                if(res){
                    this.lotteryData = res ;
                }else{
                    this.lotteryData = {} ;
                }
                this.loading = false ;
            }).catch((err) => {
                this.loading = false ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        visible(val){
            if(val){
                this.fnGetData();
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
</style>