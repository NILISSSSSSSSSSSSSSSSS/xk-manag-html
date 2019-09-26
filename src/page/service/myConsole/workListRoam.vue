<template>
    <div class = 'xk-container'>
        <div class='xk-body xk-radius'>
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    工单流转
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <list-roam :allroam='allroam'></list-roam>
        </div>
    </div>
</template>
<script>
import ListRoam from './component/listRoam'
export default {
  name:'workListRoam',
  data () {
    return {
        allroam:true
    };
  },
  components: {
      ListRoam
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
    @import "./scss/workListRoam"
</style>