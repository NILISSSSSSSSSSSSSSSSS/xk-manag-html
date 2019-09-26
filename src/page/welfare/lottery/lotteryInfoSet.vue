<template>
    <div class = 'xk-container lottery-info-set'>
        <div class="xk-radius">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-if="getPermission('lotteryResult')" label="开奖结果" name="lotteryResults"></el-tab-pane>
                <el-tab-pane v-if="getPermission('lotteryInfo')"  label="彩票运营信息" name="lotteryOperationInfo"></el-tab-pane>
            </el-tabs>
            <component :is="activeName"></component>
        </div>
    </div>
</template>
<script>
import {getPermission} from '@/util/publicMehotds';
import lotteryResults from './lotteryInfoSet/lotteryResults';
import lotteryOperationInfo from './lotteryInfoSet/lotteryOperationInfo';
export default {
    name:'lotteryInfoSet',
    data () {
        return {
            activeName: 'lotteryResults'
        };
    },
    props: {},
    components: {
        lotteryResults,
        lotteryOperationInfo
    },
    computed: {},
    created() {
        
    },
    mounted() {},
    methods: {
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        getPermission
    },
    watch: {}
}
</script>
<style scoped>
</style>