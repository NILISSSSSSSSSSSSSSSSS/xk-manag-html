<template>
    <div class="user-info">
        <el-row>
            <el-col :span="12">用户名：{{ detail.username || detail.receiver }}</el-col>
            <!-- <el-col :span="12">中奖编号：{{ detail.lotteryNumber!='' || detail.lotteryNumber != void 0? detail.lotteryNumber: '无' }}</el-col> -->
            <el-col :span="12">手机号码：{{ detail.tel ||detail.phone }}</el-col>
            <el-col :span="24" v-if="isShow">地址信息：{{ detail.street || '未填写' }}</el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            isShow: {
                type: Boolean,
                default: true
            },
            detail: {
                type: Object,
                default: ()=>({})
            }
        }
    }
</script>
<style scoped lang="scss">
    .user-info {
        .el-col {
            margin-bottom: 10px;
            font-size: 14px;
            color: #555;
        }
    }
</style>
