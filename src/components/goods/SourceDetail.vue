<template>
    <div class="source-detail">
        <el-card>
            <div class="list">
                <div class="label-txt">推荐联盟商：</div>
                <div class="label-content">
                    <span class="input-style">{{ detail.sourceOfGoods.ratio || "" }}</span>%
                    <span v-if="detail.sourceOfGoods.merchantId">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已关联商户
                    </span>
                </div>
            </div>
            <div class="list">
                <div class="label-txt">维护推荐联盟商的合伙人：</div>
                <div class="label-content">
                    <span class="input-style">
                        {{ detail.sourceOfGoods.adminRadio }}
                    </span>%
                </div>
            </div>
            <div class="list">
                <div class="label-txt">货源奖励补贴：</div>
                <div class="label-content">此商品月货源奖励不足
                    <span class="input-style">{{ $math.divide(detail.sourceOfGoodsMonthSaleSubsidy.sales, 100) }}</span>
                    元时，额外补贴
                    <span class="input-style">{{ detail.sourceOfGoodsMonthSaleSubsidy.ratio }}</span>%
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        props: {
            detail: {
                type: Object,
                default: ()=> ({
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                })
            }
        },
        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    .source-detail {
        color: #606266;
        font-size: 14px;
        .label-txt {
            text-align: right;
            padding: 0 12px 0 0;
            float: left;
            width: 180px;
            line-height: 40px;
            color: #606266;
        }
        .label-content {
            line-height: 40px;
            margin-left: 180px;
            color: #606266;
        }
        .input-style {
            display: inline-block;
            border-radius: 4px;
            width: 100px;
            border: 1px solid #dcdfe6;
            padding: 0 15px;
            line-height: 28px;
            height: 30px;
            margin: 0 5px;
            vertical-align: middle;
        }
    }
</style>
