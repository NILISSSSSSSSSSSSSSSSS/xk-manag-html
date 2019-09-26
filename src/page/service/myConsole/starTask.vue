<template>
    <div class = 'xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    受理中
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class='xk-body'>
                <div class='in-service-box'>
                    <chat taskstar='true'></chat>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Chat from './component/chat'
export default {
  name:'starTask',
  data () {
    return {
    };
  },
  components: {
      Chat
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
@import './scss/starTask'
</style>