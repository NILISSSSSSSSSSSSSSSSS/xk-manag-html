<template>
    <div class="xk-container">
        <div class="xk-radius">
            <el-card style="margin-top: 20px">
                <el-row class="title">平台余额</el-row>
                <el-row class="line"></el-row>
                <el-row class="info">
                    <el-col :span="4">4177</el-col>
                    <el-col :span="20">预充值余额：{{detailData['4177Amount'] ? detailData['4177Amount'] : 0}}元</el-col>
                </el-row>
                <!-- <el-row class="info">
                    <el-col :span="4">4177</el-col>
                    <el-col :span="20">预充值余额：{{123}}元</el-col>
                </el-row> -->
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'gamePlat',
    data() {
        return {
            detailData: {}
        }
    },
    created() {
        this.getDetailData();
    },
    methods: {
        getDetailData() {
            this.$http.get(this.$api.game4177ThirdAccountQuery, {}, true)
            .then(res => {
                this.detailData = res
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .title {
        font-size: 16px;
        font-weight: 700;
    }
    .line {
        display: inline-block;
        width: 100%;
        height: 1px;
        background-color: #e3e3e3
    }
    .info {
        height: 40px;
        line-height: 40px;
    }
    .drag {
        height: 100px;
        width: 100px;
        background-color: red;
        border-radius: 100px;
    }
</style>
