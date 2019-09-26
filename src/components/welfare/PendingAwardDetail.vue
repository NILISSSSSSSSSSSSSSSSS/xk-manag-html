<template>
    <el-dialog :visible.sync="pendingAwardDetailDia"  append-to-body :before-close="handleClose"
        width="1100px" title="待开奖详情">
        <div v-loading="loadingTable">
            <!-- 彩票信息 -->
            <div>
                <div class="xk-title" style=" padding-top: 0;">
                    <div class="vus-title">
                        <span></span>彩票信息
                    </div>
                </div>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        彩票ID：
                        <span>{{ detail.ticketId }}</span>
                    </el-col>
                    <el-col :span="12">
                        彩票来源：
                        <span>{{ detail.aaLotterySource | aaLotterySource }}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        彩票类型：
                        <span>{{detail.aaLotteryType==='super_lotto'?'大乐透':'未知'}}</span>
                    </el-col>
                   
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        运营彩票名称：
                        <span>{{ detail.typeName }}</span>
                    </el-col>
                    <el-col :span="12">
                        所在地区：
                        <span>{{getPorvinceInfo(''+detail.areaCode)}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        参与期数：
                        <span>{{ detail.invoiceNo }}</span>
                    </el-col>
                    <el-col :span="12">
                        选号时间：
                        <span>{{ detail.selectTime | formatTime }}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        参与号码：
                           <template v-for="(item,index) in detail.invoiceNumber">
                            <span class="red" v-if="index<5" :key="index">
                                {{item}}
                            </span>
                            <span class="blue" v-else :key="index">{{item}} </span>
                        </template>
                    </el-col>
                    <el-col :span="12">
                        出票时间：
                        <span>{{ detail.invoiceTime | formatTime }}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        彩票全图：
                        <img :src="detail.maxPic" style="width:200px;height:200px" @click="$viewImage(detail.maxPic)">
                    </el-col>
                </el-row>
            </div>
            <!-- 用户信息 -->
            <div>
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>用户信息
                    </div>
                </div>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        用户ID：
                        <span>{{ detail.userId }}</span>
                    </el-col>
                    <el-col :span="12">
                        身份证号：
                        <span>{{ detail.authIdCard }}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="competionTitleItem">
                    <el-col :span="12">
                        手机号码：
                        <span>{{ detail.phone }}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
 
    </el-dialog>
</template>
<script>
import { getPorvinceInfo } from '@/util/publicMehotds';
export default {
    components: {
       
    },
    props: {
        pendingAwardDetailDia: {
            type: Boolean,
            default: false
        },
        ticketId:{
            default: ""
        }
    },
    watch: {
        pendingAwardDetailDia(val) {
            if (val) {
                this.getDetail();
            }
        }
    },
    data() {
        return {
            loadingTable: false,
           
            detail: {
              
            }
        };
    },
    methods: {
       getPorvinceInfo,
        handleClose() {
            this.$emit("update:pendingAwardDetailDia", false);
        },
        getDetail() {
            let data = { ticketId: this.ticketId };
            console.log(data);
            this.loadingTable = true;
            this.$http
                .get(this.$api.aaLotteryInvoicedDetail, data, true)
                .then(res => {
                    console.log("详情" + JSON.stringify(res));
                    if (res) {
                       this.detail=res; 
                    } else {
                      this.detail={};
                    }
                    this.loadingTable = false;
                })
                .catch(res => {
                    this.detail={};
                    this.loadingTable = false;
                    this.$message.error(res.message);
                });
        },
     
    }
};
</script>

<style scoped lang="scss">
/deep/ .el-row{
    margin-bottom: 25px;
}
/deep/ div.el-dialog__wrapper {
    overflow: hidden;
}
/deep/ .el-dialog__body {
    max-height: 89vh;
    overflow: auto;
}
</style>