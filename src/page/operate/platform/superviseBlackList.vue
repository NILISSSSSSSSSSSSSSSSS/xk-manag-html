<template>
    <div class="supervise-black-list xk-container">
        <div class="xk-radius">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="IM监管黑名单" name="im">
                    <im-black-list :show="activeTab=='im'? true: false"></im-black-list>
                </el-tab-pane>
                <el-tab-pane label="抽奖监管黑名单" name="prize">
                    <prize-black-list :show="activeTab=='prize'? true: false"></prize-black-list>
                </el-tab-pane>
                <el-tab-pane label="密友监管黑名单" name="friend">
                    <friend-balck-list :show="activeTab=='friend'? true: false"></friend-balck-list>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>


<script>
    import ImBlackList from '@/components/operate/supervise/IMBlackList.vue';
    import PrizeBlackList from '@/components/operate/supervise/PrizeBlackList.vue';
    import FriendBalckList from '@/components/operate/supervise/FriendBalckList.vue';
    export default {
        components: {
            ImBlackList,
            PrizeBlackList,
            FriendBalckList
        },
        data() {
            return {
                activeTab: 'im'
            }
        }
    }
</script>

<style scoped lang="scss">
    .supervise-black-list {

    }
</style>
