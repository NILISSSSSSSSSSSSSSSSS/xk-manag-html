<template>
    <div class = 'poundag-set xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    提现手续费设置
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
                <cash-on-the-way v-model="merchantPoundage" ref="ref2">
                    商户提现
                </cash-on-the-way>
                <cash-on-the-way v-model="anchorPoundage" ref="ref3">
                    主播提现
                </cash-on-the-way>
                <div class="btn-center">
                    <el-button v-permission="'poundagSetEdit'" type="primary" :size="$size" @click="fnSubmit" :loading="loadingSave">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import cashOnTheWay from "@/components/financial/CashOnTheWay"
export default {
    name:'poundagSet',
    data () {
        return {
            loadingSave: false,
            merchantPoundage:{
                ranges:[
                    {
                        startAmount:0,
                        endAmount:0,
                        rate:'1',
                        num:1
                    }
                ]
            },
            anchorPoundage:{
                ranges:[
                    {
                        startAmount:0,
                        endAmount:0,
                        rate:'1',
                        num:1
                    }
                ]
            },
        };
    },
    components: {
        cashOnTheWay
    },
    created() {
        this.getDetail();
    },
    methods: {
        fnSubmit(){
            let p2 = this.$refs.ref2.fnReg();
            let p3 = this.$refs.ref3.fnReg();
            Promise.all([p2,p3]).then(res=>{
                let params = {
                    poundage : {
                        anchorPoundage: {
                            enableCount: this.anchorPoundage.enableCount,
                            leastAmount: this.changeNum(this.anchorPoundage.leastAmount, true),
                            mostAmount: this.changeNum(this.anchorPoundage.mostAmount, true),
                            ranges: this.changeNum(this.anchorPoundage.ranges, true)
                        },
                        merchantPoundage:  {
                            enableCount: this.merchantPoundage.enableCount,
                            leastAmount: this.changeNum(this.merchantPoundage.leastAmount, true),
                            mostAmount: this.changeNum(this.merchantPoundage.mostAmount, true),
                            ranges: this.changeNum(this.merchantPoundage.ranges, true)
                        }
                    }
                }
                this.saveDetail(params);
            }).catch(err =>{
                console.log('失败')
            })
        },
        getDetail() {
            this.$http.get(this.$api.queryWithdrawPoundage, {}, true).then(res=>{
                if(res) {
                    this.merchantPoundage = {
                        enableCount: res.merchantPoundage.enableCount,
                        leastAmount: this.changeNum(res.merchantPoundage.leastAmount, false),
                        mostAmount: this.changeNum(res.merchantPoundage.mostAmount, false),
                        ranges: this.changeNum(res.merchantPoundage.ranges, false)
                    }
                    this.anchorPoundage = {
                        enableCount: res.anchorPoundage.enableCount,
                        leastAmount: this.changeNum(res.anchorPoundage.leastAmount, false),
                        mostAmount: this.changeNum(res.anchorPoundage.mostAmount, false),
                        ranges: this.changeNum(res.anchorPoundage.ranges, false)
                    }
                }
                console.log(res)
            })
            .catch(err=>{
                this.$message.error(err.message);
            })
        },
        saveDetail(params) {
            this.loadingSave = true;
            console.log(JSON.stringify(params))
            this.$http.post(this.$api.withdrawPoundageSave, params, true).then(res=>{
                this.$message.success('保存成功');
                this.loadingSave = false;
            }).catch(err=>{
                this.loadingSave = false;
                this.$message.error(err.message);
            })
        },
        changeNum(params, bool) {
            if(Array.isArray(params)) {
                return params.map(item=>{
                    return {
                        startAmount: bool? this.$math.multip(item.startAmount, 100) : this.$math.divide(item.startAmount, 100),
                        endAmount: bool? this.$math.multip(item.endAmount, 100) : this.$math.divide(item.endAmount, 100),
                        rate: bool? this.$math.multip(item.rate, 100) : this.$math.divide(item.rate, 100),
                        maxAmount: bool? this.$math.multip(item.endAmount, this.$math.divide(item.rate, 100), 100) : this.$math.divide(item.endAmount, item.rate, 10000),
                    }
                })
            }else{
                return bool? this.$math.multip(params, 100): this.$math.divide(params, 100)
            }
        }
    },
    watch: {
        shopCashData:{
            handler: (val, oldVal)=> {
                // console.log(val)
            },
            deep: true
        }
    }
}
</script>
<style scoped lang="scss">
.btn-center{
    text-align: center
}
</style>