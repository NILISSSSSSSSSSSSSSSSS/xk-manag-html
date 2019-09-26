<template>
    <div class="xk-container">
        <div class="xk-radius">
            <el-tabs v-model="activeName">
                <el-tab-pane label="晓可币" name="xkb">
                   <xkb-list :name="activeName"></xkb-list>
                </el-tab-pane>
                <el-tab-pane label="消费券" name="xfq">
                    <xfq-list :name="activeName"></xfq-list>
                </el-tab-pane>
                <el-tab-pane label="优惠卡券" name="yhq">
                    <yhq-list :name="activeName"></yhq-list>
                </el-tab-pane>
                <el-tab-pane label="店铺消费券" name="shopxfq">
                    <shopxfq-list :name="activeName"></shopxfq-list>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import XkbList from "@/components/operate/user/account/XkbList"
import XfqList from "@/components/operate/user/account/XfqList.vue"
import YhqList from "@/components/operate/user/account/YhqList"
import ShopxfqList from "@/components/operate/user/account/ShopxfqList"
export default {
    name: 'userAccount',
    data() {
        return {
            activeName: 'xkb'
        }
    },
    methods: {},
    components: {
        XkbList,
        XfqList,
        YhqList,
        ShopxfqList
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs__item {
        height: 50px;
        line-height: 50px
    }
</style>
