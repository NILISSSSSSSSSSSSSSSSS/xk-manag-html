<template>
    <div class="logistics-detail">
        <el-row class="paddbottom20 logistics">
            <template v-if="needLogistics==1">
                <el-col :span="5">物流名称：{{ logisticsDetail.companyName | formatLogistic }}</el-col>
                <el-col :span="8">快递单号：{{ logisticsDetail.number }}</el-col>
                <el-col :span="5">
                    <el-button v-permission="'winPrizeUpdateNo'" size="mini" type="primary" @click="updateNo()">修改</el-button>
                </el-col>
            </template>
            <template v-else>不需要物流</template>
        </el-row>
        <logistics-way :detail="logisticsDetail"></logistics-way>
        <!-- 修改物流 -->
        <update-logistic-no :visible.sync="updateVisible" type="j_mall" :orderId="orderId" :goodsWeight="goodsWeight"></update-logistic-no>
    </div>
</template>
<script>
    import LogisticsWay from "@/components/welfare/LogisticsWay.vue";
    import { EnumLogisticsName } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import UpdateLogisticNo from '@/components/common/UpdateLogisticNo.vue';
    export default {
        components: {
            LogisticsWay,
            UpdateLogisticNo
        },
        props: {
            needLogistics: {
                type: [String, Number],
                default: '1'
            },
            /**
             * @param orderType          NORMAL：正常订单     REFUND：退款订单
             * @param logisticsType      PLATFORM：平台       USER：用户
             * @param xkModule           jf_mall：积分商城    mall：自营商城
             * @param orderId            订单号ID（正常、退货）
             */
            orderId: '',
            orderType: '',
            xkModule: '',
            logisticsType: '',
            goodsWeight: 0       //商品重量
        },
        data() {
            return {
                logisticsDetail: {},
                updateVisible: false
            }
        },
        methods: {
            getLogistics() {
                let params = {
                    orderId: this.orderId,
                    orderType: this.orderType,
                    xkModule: this.xkModule,
                    logisticsType: this.logisticsType
                }
                this.$http.get(this.$api.logisticsQuery, params, true).then(res=>{
                    this.logisticsDetail = res? res: {
                        companyName: '暂无',
                        number: '暂无'
                    };
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            updateNo() {
                this.updateVisible = true;
            }
        },
        watch: {
            orderId: {
                handler(val){
                    if(val&&this.needLogistics==1) {
                        this.getLogistics();
                    }
                },
                immediate: true
            },
            updateVisible(val) {
                !val? this.getLogistics() : null;
            }
        },
        filters: {
            formatLogistic(val) {
                return enumFormatter(val, EnumLogisticsName)
            }
        }
    }
</script>
<style scoped lang="scss">
    .logistics-detail {
        padding-left: 20px;
        .paddBoth {
            .el-col {
                color: #555;
                font-size: 14px;
                margin-bottom: 10px;
            }
        }
        .logistics {
            font-size: 15px;
            color: #555;
        }
    }
</style>
