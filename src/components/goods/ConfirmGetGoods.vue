<template>
    <div class="confirm-get-goods">
        <el-dialog :visible.sync="visible" title="请确认收到以下退货商品" width="800px">
            <el-row>
                <el-col :span="4">申请退货商品：</el-col>
                <el-col :span="20">
                    <p v-for="(item, index) in detail.goodsName" :key="index"><strong>商品{{index+1}}：</strong>{{ item }}</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">退货原因：</el-col>
                <el-col :span="20">{{ detail.refundReason }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">退货说明：</el-col>
                <el-col :span="20">{{ detail.refundMessage || '无' }}</el-col>
            </el-row>
            <el-row v-if="detail.refundEvidence">
                <el-col :span="4">图片描述：</el-col>
                <el-col :span="20">
                    <image-list v-for="(item, index) in detail.refundEvidence" 
                                :url="item.refundPic"
                                :type="item.refundVideo? 'video': 'image'"
                                :videoUrl="item.refundVideo"
                                :key="index"></image-list>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">物流名称：</el-col>
                <el-col :span="20">{{ detail.logisticsName | formatLogistics }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">物流单号：</el-col>
                <el-col :span="20">{{ detail.logisticsNo }}</el-col>
            </el-row>
            <slot></slot>
        </el-dialog>
    </div>
</template>
<script>
    import { EnumLogisticsName } from '@/util/publicParams.js';
    import ImageList from '@/components/common/ImageList.vue';
    import { enumFormatter } from '@/util/publicMehotds.js';
    export default {
        components: {
            ImageList
        },
        props: {
            detail: {
                type: Object,
                default: ()=>({})
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        filters: {
            formatLogistics(val) {
                if(val) {
                    return enumFormatter(val, EnumLogisticsName)
                }
                return val;
            }
        }
    }
</script>

<style scoped lang="scss">
    .confirm-get-goods {
        /deep/ .el-row {
            margin-bottom: 15px;
        }
    }
</style>
