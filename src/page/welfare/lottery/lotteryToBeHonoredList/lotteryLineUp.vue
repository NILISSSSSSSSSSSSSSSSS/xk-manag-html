<template>
    <div class="lottery-line-up" v-if="dialogVisible">
        <el-dialog :visible.sync="dialogVisible" title="线上兑奖" width="900px" :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="180px" v-loading="loading">
                <el-form-item label="税后兑奖总额：">
                    {{form.afterTaxPrizeAmount | Division | NumThree}}元
                </el-form-item>
                <el-form-item label="实际兑奖金额：">
                    <span class="red">{{form.actualPrizeAmount | Division | NumThree}}消费券</span>
                </el-form-item>
                <el-form-item label="出票图片：">
                    <img :src="form.maxPic" width="400" alt="">
                </el-form-item>
                <el-form-item label-width="0">
                    <div class="border"></div>
                </el-form-item>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="彩票类型：">
                            体彩——超级大乐透
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="奖项：">
                            {{form.prizeName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="运营彩票名称：">
                            {{form.typeName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="注数：">
                            {{form.lotteryNumber}}注
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="参与期数：">
                            第{{form.invoiceNo}}期
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="税前兑奖总额：">
                            {{form.preTaxPrizeAmount | Division | NumThree}}元
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="当期奖池：">
                            {{form.jackpotAmount | Division | NumThree}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="彩票来源：">
                            {{form.aaLotterySource | aaLotterySource}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="本期中奖号码：">
                            <template v-for="(item,index) in form.winningNo">
                                <span class="red" :key="index" v-if="index<5">{{item}} </span>
                                <span class="blue" :key="index" v-else>{{item}} </span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="所在地区：">
                            {{getPorvinceInfo(''+form.areaCode)}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="参与号码：">
                            <template v-for="(item,index) in form.joinNumber">
                                <span class="red" :key="index" v-if="index<5">{{item}} </span>
                                <span class="blue" :key="index" v-else>{{item}} </span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="选号时间：">
                            {{form.waitForInvoiceTime | formatTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="兑奖号码：">
                            <template v-for="(item,index) in form.prizeNumbers">
                                <span class="red" :key="index" v-if="index<5">{{item}} </span>
                                <span class="blue" :key="index" v-else>{{item}} </span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="出票时间：">
                            {{form.invoiceTime | formatTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <div>&nbsp;</div>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="开奖时间：">
                            {{form.lotteryTime | formatTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label-width="0">
                    <div class="border"></div>
                </el-form-item>
                <el-form-item label="用户ID：">
                    {{form.userId}}
                </el-form-item>
                <el-form-item label="身份证号：">
                    {{form.authIdCard}}
                </el-form-item>
                <el-form-item label="联系方式：">
                    {{form.phone}}
                </el-form-item>
                <el-form-item>
                    <el-button :size="$size" @click="handleClose()">返 回</el-button>
                    <el-button type="primary" :size="$size" @click="onSubmit">去兑奖</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogAgain" append-to-body title="线上确认兑奖" width="600px"
                :before-close="handleCloseAgain">
                <el-form>
                    <el-form-item label="税后金额：">
                        {{form.afterTaxPrizeAmount | Division | NumThree}}元
                    </el-form-item>
                    <el-form-item label="实际兑奖金额：">
                        <span class="red">{{form.actualPrizeAmount | Division | NumThree}}消费券</span>
                    </el-form-item>
                    <el-form-item label="出票图片：">
                        <img :src="form.maxPic" width="400" alt="">
                    </el-form-item>
                    <el-form-item label-width="0">
                        <div class="border"></div>
                    </el-form-item>
                    <el-form-item label="用户ID：">
                        {{form.userId}}
                    </el-form-item>
                    <el-form-item label="身份证号：">
                        {{form.authIdCard}}
                    </el-form-item>
                    <el-form-item label="联系方式：">
                        {{form.phone}}
                    </el-form-item>
                    <el-form-item>
                        <el-button :size="$size" @click="handleCloseAgain">返 回</el-button>
                        <el-button type="primary" :size="$size" @click="fnSure" :loading="sureLoading">确认兑奖</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
import { getPorvinceInfo } from '@/util/publicMehotds';
export default {
    name: 'lotteryLineUp',
    data() {
        return {
            form: {},
            dialogAgain: false,
            sureLoading: false,
            loading: false
        };
    },
    props: {
        dialogVisible: {},
        ticketId: {}
    },
    components: {},
    computed: {},
    created() { },
    mounted() { },
    methods: {
        getPorvinceInfo,
        onSubmit() {
            console.log('submit!');
            this.dialogAgain = true;
        },
        handleClose() {
            this.$emit('update:dialogVisible', false);
        },
        handleCloseAgain() {
            this.dialogAgain = false;
        },
        fnSure() {
            let obj = { ticketId: this.ticketId };
            if (this.form.claimId) {
                obj.obj = this.form.claimId
            }
            this.sureLoading = true;
            this.$http.get(this.$api.aaLotteryClaimOnlineClaim, obj, true).then((res) => {
                console.log(res)
                this.handleClose();
                this.dialogAgain = false;
                this.sureLoading = false;
                this.$parent.fnGetPage()
            }).catch((err) => {
                console.log(err);
                this.handleClose();
                this.dialogAgain = false;
                this.sureLoading = false;
                this.$message.error(err.message);
            });

        },
        fnGetDetail() {
            this.loading = true;
            this.$http.get(this.$api.aaLotteryClaimDetail, { ticketId: this.ticketId }, true).then((res) => {
                console.log(res)
                this.form = res;
                this.loading = false;
            }).catch((err) => {
                console.log(err);
                this.loading = false;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        ticketId(val) {
            if (val) {
                this.fnGetDetail();
            }
        }
    }
}
</script>
<style scoped lang="scss">
.red {
    color: #f44336;
}
.border {
    border-top: 1px solid #ddd;
}
</style>