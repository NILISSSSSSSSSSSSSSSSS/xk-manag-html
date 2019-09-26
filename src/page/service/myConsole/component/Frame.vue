<template>
    <el-dialog :visible.sync="open" width="400px">
        <iframe :src="url" v-if='open' frameborder="0"></iframe>
    </el-dialog>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            open: this.show
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            this.$emit('update:show', val);
            if (!val) {
                this.url = '';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
iframe {
    width: 375px;
    height: 667px;
}
</style>
