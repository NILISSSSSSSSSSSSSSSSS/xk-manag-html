<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>推荐商品管理
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click.stop='fnSearch'>查询</el-button>
                    <el-button type="info" :size="$size" @click.stop='fnClear'>清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form :inline="true" :model="condition" :size="$size" class="demo-form-inline">
                    <el-form-item label="商品ID：">
                        <el-input v-model="condition.goodsId" placeholder="商品ID"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称：">
                        <el-input v-model="condition.goodsName" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区域：">
                        <province-cascader v-model="condition.address"></province-cascader>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="xk-body xk-radius marintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>推荐商品管理
                </div>
                <div class="vus-btn">
                    <el-button v-permission="'groomGoodsRegulationAddWelfare'" type="success" :size="$size" @click.stop='fnAddWelfare' v-show='activeName==="welfare"'>新增福利商品</el-button>
                    <el-button v-permission="'groomGoodsRegulationWelfareDelete'" type="success" :size="$size" :disabled='iscanDelWel' @click.stop='delAll()' v-show='activeName==="welfare"'>删除</el-button>
                    <el-button v-permission="'groomGoodsRegulationAddSelf'" type="success" :size="$size" @click.stop="fnAddSelf" v-show='activeName==="square"'>新增精选商品</el-button>
                    <el-button v-permission="'groomGoodsRegulationSelfDelete'" type="success" :size="$size" :disabled='iscanDelJx' @click.stop='delAll()' v-show='activeName==="square"'>删除</el-button>
                    <el-button type="success" :size="$size" @click.stop="fnAddSelf" v-show='activeName==="merchant"'>新增批发商品</el-button>
                    <el-button type="success" :size="$size" :disabled='iscanDel' @click.stop='delAll()' v-show='activeName==="merchant"'>删除</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="夺奖派对商品" name="welfare">
                        <welfare-table
                            ref="welfare"
                            :condition='condition' 
                            :isSearch="activeName==='welfare'" 
                            @canDel='canDelwel'></welfare-table>
                    </el-tab-pane>
                    <el-tab-pane label="精选商城商品" name="square">
                        <self-table 
                            ref="square"
                            type="square" 
                            :condition='condition' 
                            :isSearch="activeName==='square'" 
                            @canDel='canDelJx'>
                        </self-table>
                    </el-tab-pane>
                    <el-tab-pane label="批发商城商品" name="merchant">
                        <self-table 
                            ref="merchant"
                            type="merchant" 
                            :condition='condition' 
                            :isSearch="activeName==='merchant'" 
                            @canDel='canDel'></self-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <add-self :dialogVisible.sync='dialogVisible' :goodsType="activeName"></add-self>
        <add-welfare :dialogVisible.sync='welfareVisible'></add-welfare>
    </div>
</template>
<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    import selfTable from './goods/selfTable.vue'
    import welfareTable from './goods/welfareTable.vue'
    import addSelf from './goods/addSelf.vue'
    import addWelfare from '@/components/AddWelfare.vue'
    
    export default {
      name: "groomGoodsRegulation",
      data() {
        return {
          condition: {},
          activeName:'welfare',
          dialogVisible:false,
          iscanDel:true,
          iscanDelWel:true,
          iscanDelJx: true,
          welfareVisible:false
        };
      },

      components: {
          ProvinceCascader,
          selfTable,
          welfareTable,
          addSelf,
          addWelfare
      },

      methods: {
            fnSearch(){
                this.$refs[this.activeName].fnSearch();
            },
            fnClear(){
                this.condition = {};
                this.$refs[this.activeName].fnClear();
            },
            /**添加精选和批发 */
            fnAddSelf(){
                this.dialogVisible = true
            },
            /**添加夺奖派对奖品 */
            fnAddWelfare(){
                this.welfareVisible = true ;
            },
            /**批发商城删除按钮状态 */
            canDel(b){
                this.iscanDel = b
            },
            /**夺奖派对删除按钮状态 */
            canDelwel(b){
                this.iscanDelWel = b
            },
            /**精选按钮删除状态 */
            canDelJx(bool) {
                this.iscanDelJx = bool;
            },
            /**删除所有的 */
            delAll(){
                this.$confirm('是否删除所有选中项?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs[this.activeName].fnDelAll();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
      },
      watch: {
          dialogVisible(val) {
              if(!val){
                  this.$refs[this.activeName].fnSearch();
              }
          },
          welfareVisible(val) {
              if(!val) {
                  this.$refs[this.activeName].fnSearch();
              }
          }
      }
    };
</script>
<style scoped>
</style>