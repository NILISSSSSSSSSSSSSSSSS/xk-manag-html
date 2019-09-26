<template>
  <div class="xk-container">
    <div class="xk-radius">
      <div class="xk-title">
          <div class="vus-title">
              <span></span>商户高级设置
          </div>
           <div class="vus-bottom"></div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="商户免审白名单" name="first">
            <merchant-white-list :name="activeName"></merchant-white-list>
          </el-tab-pane>
          <!-- <el-tab-pane label="商户达标奖励" name="second">
            <standard-reward :name="activeName"></standard-reward>
          </el-tab-pane> -->
          <el-tab-pane label="其他设置" name="third">
            <ceiling :name="activeName"></ceiling>
          </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import MerchantWhiteList from "@/components/operate/platformSet/MerchantWhiteList"
import StandardReward from "@/components/operate/platformSet/StandardReward"
import Ceiling from "@/components/operate/platformSet/Ceiling.vue"
export default {
  name:'merchantSeniorSet',
  data () {
    return {
      activeName: "first"
    };
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    },
    getNode(data, node) {
      console.log(data, node)
    }
  },
  components: {
    MerchantWhiteList,
    StandardReward,
    Ceiling
  }
}
</script>
<style scoped>
</style>