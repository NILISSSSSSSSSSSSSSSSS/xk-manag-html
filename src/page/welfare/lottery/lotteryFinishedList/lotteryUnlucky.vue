<template>
    <div class="lottery-unlucky" v-if="dialogVisible">
        <el-dialog
            :visible.sync="dialogVisible"
            title="未中奖详情"
            width="900px"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="180px" v-loading="loading">
                <el-form-item label="用户ID：">
                    {{form.userId}}
                </el-form-item>
                <el-form-item label="身份证号：">
                    {{form.authIdCard}}
                </el-form-item>
                <el-form-item label="手机号码：">
                    {{form.phone}}
                </el-form-item>
                
                <el-form-item label-width="0">
                    <div class="border"></div>
                </el-form-item>
                <el-form-item label="彩票类型：">
                    体彩——超级大乐透
                </el-form-item>
                <el-form-item label="运营彩票名称：">
                    {{form.typeName}}
                </el-form-item>
                <el-form-item label="参与期数：">
                    第{{form.invoiceNo}}期
                </el-form-item>
                <el-form-item label="本期中奖号码：">
                    <template v-for="(item,index) in form.winningNo">
                        <span class="red" v-if="index<5" :key="index">
                            {{item}}
                        </span>
                        <span class="blue" v-else :key="index">{{item}} </span>
                    </template>
                </el-form-item>
                <el-form-item label="参与号码：">
                    <template v-for="(item,index) in form.joinNumber">
                        <span class="red" v-if="index<5" :key="index">
                            {{item}}
                        </span>
                        <span class="blue" v-else :key="index">{{item}} </span>
                    </template>
                </el-form-item>
                <el-form-item label="兑奖号码：">
                    <template v-for="(item,index) in form.prizeNumbers">
                        <span class="red" v-if="index<5" :key="index">
                            {{item}}
                        </span>
                        <span class="blue" v-else :key="index">{{item}} </span>
                    </template>
                </el-form-item>
                <el-form-item label="彩票来源：">
                    {{form.aaLotterySource | aaLotterySource}}
                </el-form-item>
                <el-form-item label="所在地区：">
                    {{getPorvinceInfo(''+form.areaCode)}}
                </el-form-item>
                <el-form-item label="选号时间：">
                    {{form.waitForInvoiceTime | formatTime}}
                </el-form-item>
                <el-form-item label="出票时间：">
                    {{form.invoiceTime | formatTime}}
                </el-form-item>
                <el-form-item label="开奖时间：">
                    {{form.lotteryTime | formatTime}}
                </el-form-item>
                <el-form-item label="奖项：">
                    未中奖
                </el-form-item>
                <el-form-item label-width="0">
                    <div class="border"></div>
                </el-form-item>
                <el-form-item label="参与进度："></el-form-item>
                <div style="padding-left:120px">
                    <el-steps direction="vertical" :active="5" finish-status="success" :space="50">
                        <el-step :title="'选号时间'+Moment(form.waitForInvoiceTime*1000).format('YYYY-MM-DD HH:mm:ss')" ></el-step>
                        <el-step :title="'出票时间'+Moment(form.invoiceTime*1000).format('YYYY-MM-DD HH:mm:ss')"></el-step>
                        <el-step :title="'开奖时间'+Moment(form.lotteryTime*1000).format('YYYY-MM-DD HH:mm:ss')"></el-step>
                        <!-- <el-step :title="'申请兑奖时间'+Moment(form.claimTime*1000).format('YYYY-MM-DD HH:mm:ss')"></el-step>
                        <el-step :title="'确认兑奖时间'+Moment(form.doClaimTime*1000).format('YYYY-MM-DD HH:mm:ss')"></el-step> -->
                    </el-steps>
                </div>
                <el-form-item>
                    <el-button :size="$size" @click="handleClose()">返 回</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import Moment from 'moment';
import {getPorvinceInfo} from '@/util/publicMehotds';
export default {
    name:'lotteryUnlucky',
    data () {
        return {
            form: {},
            loading:false
        };
    },
    props: {
        dialogVisible:{},
        ticketId:{}
    },
    components: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        Moment,
        getPorvinceInfo,
        handleClose(){
            this.$emit('update:dialogVisible',false);
        },
        fnGetDetail(){
            this.loading = true ;
            this.$http.get(this.$api.aaLotteryFinishDetail, {
                ticketId: this.ticketId,
            }, true).then((res) => {
                console.log(res)
                this.loading = false ;
                this.form = res ;
            }).catch((err) => {
                console.log(err);
                this.loading = false ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        ticketId:{
            handler(val){
                if(val){
                    this.fnGetDetail()
                }
            },
            deep:true
        }
    }
}
</script>
<style scoped lang="scss">
.red{
    color: #f44336
}
.blue{
    color: #2196f3;
}
.border{
    border-top: 1px solid #ddd
}
</style>