<template>
  <div class="xk-container">
    <div class="xk-radius">
      <el-tabs v-model="activeName" class="xk-tabs" @tab-click="tabClick">
          <!--<el-tab-pane label="个人" name="personal">-->
              <!--<person :activeName="activeName"></person>-->
          <!--</el-tab-pane>-->
          <el-tab-pane label="商品" name="goods">
             <goods :activeName="activeName"></goods>
          </el-tab-pane>
          <el-tab-pane label="举报" name="report">
             <report :activeName="activeName"></report>
          </el-tab-pane>
          <el-tab-pane label="平台" name="platforms">
              <platforms :activeName="activeName"></platforms>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import Person from "../../../components/operate/Person.vue"
import Goods from "../../../components/operate/Goods.vue"
import Report from "../../../components/operate/Report.vue"
import Platforms from "../../../components/operate/Platforms.vue"
    export default {
        name: "feedback",
        data() {
          return {
            activeName: "goods"
          }
        },
        methods: {
            tabClick(node) {
                // if(node.name === 'personal') {
                //     this.activeName="personal"
                // } else {
                //     this.activeName = 'goods'
                // }
                this.activeName = node.name
            }
        },
        components: {
            Person,
            Goods,
            Report,
            Platforms,
        }
    }
</script>

<style scoped>

</style>
