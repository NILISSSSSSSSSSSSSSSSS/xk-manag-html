<template>
   <div class="xk-container">
       <div class="xk-radius">
           <div class="xk-title">
                <div class='vus-title'>
                 <span></span>
                        用户等级设置
                </div>
           </div>
        <div class='vus-bottom'></div>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="用户等级列表" name="first">
            <user-level-list :name="activeName"></user-level-list>
          </el-tab-pane>
          <el-tab-pane label="消费积分设置" name="second">
           <integral-set :name="activeName"></integral-set>
          </el-tab-pane>
      </el-tabs>
       </div>
   </div>
    
</template>

<script>
import UserLevelList from "@/components/operate/platformSet/UserLevelList"
import IntegralSet from "@/components/operate/platformSet/IntegralSet"
import LevelSet from "@/components/operate/LevelSet";
import { getSession } from '../../../util/publicMehotds';
export default {
    name: 'userLevel',
    data() {
        return {
            activeName: "first",
            setDialog: false,
            detailData: []
        }
    },
    methods: {
        tabClick(val) {
            this.activeName = val.name
        },
        addUserLevel() {
            this.detailData = []
            this.setDialog = true;
        }
    },
    components: {
        UserLevelList,
        IntegralSet,
        LevelSet
    }
}
</script>

<style>

</style>
