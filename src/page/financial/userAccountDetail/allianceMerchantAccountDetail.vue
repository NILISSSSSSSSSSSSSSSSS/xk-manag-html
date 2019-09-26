<template>
    <div class='alliance-merchant-account-detail xk-container'>
        <div class="xk-radius">
            <el-tabs v-model="activeName">
                <el-tab-pane label="现金" name="cash">
                    <xj :show="activeName=='cash'? true: false"/>
                </el-tab-pane>
                <el-tab-pane label="晓可币" name="xkb">
                    <xkb :show="activeName=='xkb'? true: false" currency="xkb"/>
                </el-tab-pane>
                <el-tab-pane v-if="isAnchor==1" label="钻石" name="zs">
                    <zs :show="activeName=='zs'? true: false" :userId="userId"/>
                </el-tab-pane>
                <el-tab-pane label="消费券" name="xfq">
                    <xkb :show="activeName=='xfq'? true: false" currency="xfq"/>
                </el-tab-pane>
                
                <el-tab-pane label="实物券" name="swq">
                    <swq :show="activeName=='swq'? true: false"/>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import Xj from './subPage/Xj.vue';
    import Xkb from './subPage/Xkb.vue';
    import Zs from './subPage/Zs.vue';
    import Swq from './subPage/Swq.vue';
    
    export default {
        data () {
            return {
                activeName: 'cash',
                isAnchor: 0,
                userId: ""
            };
        },
        props: {},
        components: {
            Xj,
            Xkb,
            Zs,
            Swq
        },
        computed: {},
        created() {
            this.userId = this.$route.query.userId;
            this.isAnchor = this.$route.query.isAnchor
        },
        mounted() {},
        methods: {},
        watch: {}
    }
</script>
<style scoped>
</style>