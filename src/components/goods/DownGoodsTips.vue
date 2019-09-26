<template>
    <div class="down-goods-tips">
        <el-dialog title="以下商品有生效中的单品优惠券，不可下架！" :visible.sync="visible" :before-close="close">
            <el-row v-if="goodsData">
                <template v-for="item in goodsData">
                    <el-col :span="12" :key="item.goodsId">商品编号：{{ item.goodsId }}</el-col>
                    <el-col :span="12" :key="item.goodsId">商品名称：{{ item.goodsName }}</el-col>
                </template>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="close()">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props:{
            visible: {
                type: Boolean,
                default: false
            },
            goodsData: {
                type: Array,
                default: ()=> []
            }
        },
        data() {
            return {}
        },
        methods: {
            close() {
                this.$emit('update:visible', false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .down-goods-tips {
        /deep/ .el-col {
            margin-bottom: 15px;
        }
    }
</style>