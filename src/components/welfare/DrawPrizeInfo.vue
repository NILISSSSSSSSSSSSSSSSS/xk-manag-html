<template>
    <div class="draw-prize-info">
        <el-row>
            <el-col :span="8">时时彩期数：{{ detail.thirdWinningNo }}</el-col>
            <el-col :span="8">时时彩时间：{{ detail.thirdWinningTime | formatTime }}</el-col>
            <el-col :span="8">时时彩号码：{{ detail.thirdWinningNumber }}</el-col>
            <el-col :span="8">中奖号码：{{ detail.currentWinningNumber }}</el-col>
            <el-col :span="8">中奖时间：{{ detail.realityLotteryDate | formatTime }}</el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            detail: {
                type: Object,
                default: ()=>({})
            }
        }
    }
</script>
<style scoped lang="scss">
    .draw-prize-info {
        /deep/ .el-col {
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
        }
    }
</style>
