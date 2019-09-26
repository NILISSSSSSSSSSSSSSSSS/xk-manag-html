<template>
    <div class="sale-detail">
        <el-card>
            <div class="list">
                <div class="label-txt">税金：</div>
                <div class="label-content">
                    <span class="input-style">{{ detail.tax.ratio }}</span>%
                </div>
            </div>
            <el-row v-if="!type">
                <el-col :span="12">
                    <div class="list">
                        <div class="label-txt">维护收益（合伙人）：</div>
                        <div class="label-content">
                            <span class="input-style">{{ detail.regionAdmin.ratio }}</span>%
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="list">
                        <div class="label-txt">维护收益门槛：</div>
                        <div class="label-content">
                            <span class="input-style">{{ $math.divide(detail.regionAdmin.sales, 100) }}</span> 元
                        </div>
                    </div>
                </el-col>
            </el-row>
            
            <div class="list" v-if="type">
                <div class="label-txt">单笔销售奖励：</div>
                <div class="label-content">
                    <span class="input-style">{{ detail.sale.ratio }}</span>%
                </div>
            </div>
            <el-row>
                <el-col :span="12">
                    <div class="list">
                        <div class="label-txt">月销售额奖励：</div>
                        <div class="label-content">
                            <span class="input-style">{{ detail.mothSale.ratio }}</span>%
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="list">
                        <div class="label-txt">月销售总额门槛：</div>
                        <div class="label-content">
                            <span class="input-style">{{ $math.divide(detail.mothSale.sales, 100) }}</span>元
                        </div>
                    </div>
                    <div class="list">
                        <div class="label-txt">月销售总额奖励类型：</div>
                        <div class="label-content">{{ detail.mothSale.currency | formatTicket }}</div>
                    </div>
                </el-col>
            </el-row>

            
            <el-row>
                <el-col :span="12">
                    <div class="list">
                        <div class="label-txt">单次批量奖励：</div>
                        <div class="label-content">
                            <span class="input-style">{{ detail.singleBatch.ratio }}</span>%
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="list">
                        <div class="label-txt">批量奖励的数量门槛：</div>
                        <div class="label-content">
                            <span class="input-style">{{ $math.divide(detail.singleBatch.sales, 100) }}</span>元
                        </div>
                    </div>
                    <div class="list">
                        <div class="label-txt">单次批量奖励类型：</div>
                        <div class="label-content">{{ detail.singleBatch.currency | formatTicket }}</div>
                    </div>
                </el-col>
            </el-row>
            <div class="list">
                <div class="label-txt">临时补贴：</div>
                <div class="label-content">
                    <el-card v-for="(item,index) in detail.saleSubsidyTempList" :key="index">
                        <div class="list">
                            <div class="label-txt">区域：</div>
                            <div class="label-content">
                                <template v-if="item.areaCodes.length">
                                    <el-tag v-for="_item in item.areaCodes" style="margin-right: 5px" :key="_item" type="success">{{ getPorvinceInfo(_item) }}</el-tag>
                                </template>
                                <template v-else>未设置</template>
                            </div>
                        </div>
                        <div class="list">
                            <div class="label-txt">给购买用户（{{ type? '消费券': '实物券' }}）：</div>
                            <div class="label-content">
                                <span class="input-style">{{ item.buyerRatio}}</span>%
                            </div>
                        </div>
                        <div class="list">
                            <div class="label-txt">给区域合伙人（钱）：</div>
                            <div class="label-content">
                                <span class="input-style">{{ item.areaAdminRatio }}</span>%
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    const tickectType= {
        yhq: '单品优惠券',
        xfq: '消费券',
        swq: '实物券',
        rmb: '现金'
    }
    export default {
        props: {
            type: {
                type: Boolean,
                default: true   //true 精选商城， false批发商城
            },
            detail: {
                type: Object,
                default: ()=> ({
                    tax: {},           //税金
                    sale: {},         //单笔销售奖励
                    regionAdmin: {},        //维护收益门槛
                    mothSale: {},               //月销售额奖励
                    singleBatch: {},          //单词批量奖励
                    saleSubsidyTempList: [
                        {
                            areaCodes: '',
                            buyerRatio: '',
                            areaAdminRatio: '',
                            areaAdminCurrency: '',
                            buyerCurrency: ''
                        }
                    ]      //临时补贴
                })
            }
        },
        data() {
            return {
                getPorvinceInfo,
                tickectType
            }
        },
        filters: {
            formatTicket(val) {
                if(val) {
                    return tickectType[val]
                }
                return '未设置'
            }
        }
    }
</script>
<style scoped lang="scss">
    .sale-detail {
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
            box-sizing: border-box;
            border: 1px solid #dcdfe6;
            padding: 0 15px;
            line-height: 28px;
            height: 30px;
            margin: 0 5px;
            vertical-align: middle;
        }
    }
</style>
