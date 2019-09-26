<template>
  <div class="xk-container">
    <div class="xk-radius">
      <el-tabs v-model="activeName" class="xk-tabs">
          <el-tab-pane label="文字监管" name="textRegulation">
              <xkcoin></xkcoin>
          </el-tab-pane>
          <el-tab-pane label="图片视频监管" name="photoVideo">
            <vouchers></vouchers>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import xkcoin from "../../../components/financial/Xkcoin"
import vouchers from "../../../components/financial/Vouchers"

    export default {
        name: "userAccDetail",
        data() {
          return {
            activeName: "textRegulation"
          }
        },
        components: {
            xkcoin,
            vouchers
        }
    }
</script>

<style scoped>

</style>
