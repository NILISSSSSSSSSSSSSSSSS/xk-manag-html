<template>
    <div class = 'lottery-date'>
        <el-date-picker
            :disabled="disabled"
            v-model="time"
            :size="$size"
            value-format="timestamp"
            type="datetimerange"
            range-separator="至"
            @change="timeChange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
    </div>
</template>
<script>
export default {
    name:'lotteryDate',
    data () {
        return {
            disabled:false,
            time:[]
        };
    },
    props: {
        value:{}
    },
    components: {},
    computed: {},
    created() {
        this.disabled = this.value.cannotDel?true:false;
        this.time = [...this.value];
    },
    mounted() {},
    methods: {
        timeChange(arr){
            let inputArr = this.value ? this.value : [] ;
            if(arr){
                inputArr[0] = arr[0];
                inputArr[1] = arr[1];
            }else{
                inputArr[0] = null;
                inputArr[1] = null;
            }
            this.$emit('input',inputArr)
        }
    },
    watch: {}
}
</script>
<style scoped>
</style>