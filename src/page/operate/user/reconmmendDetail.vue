<template>
    <div class="xk-container">
        <div class="xk-radius">
            <el-tabs v-model="activeName">
                <el-tab-pane label="推荐用户列表" name="user">
                    <user-list :nowCode="nowCode"></user-list>
                </el-tab-pane>
                <el-tab-pane label="推荐联盟商列表" name="merchant">
                    <merchants-list @getCode="getNowCode"></merchants-list>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import MerchantsList from "@/components/operate/user/MerchantsList"
import UserList from "@/components/operate/user/UserList"
export default {
    name: 'recommendDetail',
    data() {
        return {
            activeName: 'user',
            nowCode: '' // 当前联盟商的安全码
        }
    },
    methods: {
        getNowCode(nowCode) { // 接收当前联盟商安全码
            console.log('nowCode', nowCode)
            this.nowCode = nowCode
        }
    },
    components: {
        MerchantsList,
        UserList
    },
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
    font-weight: 700;
}
</style>
