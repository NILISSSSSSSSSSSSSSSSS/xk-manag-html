<template>
    <div class="mechantWhiteList">
        <div class="xk-radius" v-loading="loading">
           <el-form  :inline="true" :model="detailData" ref="detailData">
               <el-card>
                   <el-row>
                    <el-form-item label="推荐普通用户（上个自然月达到）：" label-width="250px" 
                    prop="commonUserRecommendRule.numberOfUser" :rules="rules.integer">
                        <el-input :size="$size" style="width: 100px;margin-right:5px"
                        v-model.number="detailData.commonUserRecommendRule.numberOfUser"></el-input>人
                    </el-form-item>
                   </el-row>
                   <el-form-item label="推荐成功标准设置：" label-width="150px" 
                   prop="commonUserRecommendRule.numberOfDayFromRegistry" :rules="rules.integer">
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model.number="detailData.commonUserRecommendRule.numberOfDayFromRegistry"></el-input>
                        <span>天内下单超过</span>
                   </el-form-item>
                   <el-form-item prop="commonUserRecommendRule.numberOfOrder" :rules="rules.integer">
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model.number="detailData.commonUserRecommendRule.numberOfOrder"></el-input>
                        <span>单，平均金额大于</span>
                   </el-form-item>
                   <el-form-item prop="commonUserRecommendRule.averageAmount" :rules="rules.money">
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model.number="detailData.commonUserRecommendRule.averageAmount"></el-input>
                        <span>元</span>
                   </el-form-item>
                   <el-form-item label="奖励抽奖券 ：" style="margin-left: 20px">
                       <el-row>
                            <el-input :size="$size" style="width: 220px;margin-right: 20px" placeholder="请输入福利商品ID"></el-input>
                            <el-button :size="$size" type="primary">确定</el-button>
                       </el-row>
                       <el-row>
                           已选择奖品名称： 咸鱼
                       </el-row>
                   </el-form-item>
               </el-card>
               <el-card style="margin-top: 20px">
                   <el-row>
                    <el-form-item label="推荐商户（上个自然月达到）：" label-width="220px"
                    prop="merchantRecommendRule.numberOfUser" :rules="rules.integer">
                        <el-input :size="$size" style="width: 100px;margin-right:5px"
                        v-model="detailData.merchantRecommendRule.numberOfUser"></el-input>人
                    </el-form-item>
                   </el-row>
                   <el-form-item label="推荐成功标准设置：" label-width="150px"
                   prop="merchantRecommendRule.numberOfDayFromRegistry" :rules="rules.integer">
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model.number="detailData.merchantRecommendRule.numberOfDayFromRegistry"></el-input>
                        <span>天内下单超过</span>
                   </el-form-item>
                   <el-form-item prop="merchantRecommendRule.numberOfOrder" :rules="rules.integer">
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model.number='detailData.merchantRecommendRule.numberOfOrder'></el-input>
                        <span>单，平均金额大于</span>
                   </el-form-item>
                   <el-form-item prop="merchantRecommendRule.averageAmount" :rules="rules.money">
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model.number="detailData.merchantRecommendRule.averageAmount"></el-input>
                        <span>元</span>
                   </el-form-item>
                   <el-form-item label="奖励抽奖券 ：" style="margin-left: 20px">
                       <el-row>
                            <el-input :size="$size" style="width: 220px;margin-right: 20px" placeholder="请输入福利商品ID"></el-input>
                            <el-button :size="$size" type="primary">确定</el-button>
                       </el-row>
                       <el-row>
                           已选择奖品名称： 狗子
                       </el-row>
                   </el-form-item>
               </el-card>
                <el-card style="margin-top: 20px">
                   <el-row>
                    <el-form-item label="接单奖励（上个自然月达到）：" label-width="220px"
                    prop="orderReceiveRule.numberOfOrder" :rules="rules.integer">
                        <el-input :size="$size" style="width: 100px;margin-right:5px"
                        v-model.number="detailData.orderReceiveRule.numberOfOrder"></el-input>单
                    </el-form-item>
                   </el-row>
                   <el-form-item label="有效订单标准设置：" label-width="150px"
                   prop="orderReceiveRule.averageAmount" :rules="rules.money">
                       <span style="margin-right: 5px">平均每单金额大于</span>
                        <el-input :size="$size" style="width: 80px;margin-right:5px"
                        v-model="detailData.orderReceiveRule.averageAmount"></el-input>
                        <span>元</span>
                   </el-form-item>
                   <el-form-item label="奖励抽奖券 ：" style="margin-left: 20px">
                       <el-row>
                            <el-input :size="$size" style="width: 220px;margin-right: 20px" placeholder="请输入福利商品ID"></el-input>
                            <el-button :size="$size" type="primary">确定</el-button>
                       </el-row>
                       <el-row>
                           已选择奖品名称： 游艇
                       </el-row>
                   </el-form-item>
               </el-card>
           </el-form>
           <div style="margin-top: 20px;text-align: center">
               <el-button :size="$size" type="primary" :loading="saveLoading" @click="saveMerchantReward">保存</el-button>
           </div>
        </div>
    </div>
</template>

<script>
 export default {
     name: "standardReward",
     props: {
         name: {
             type: String,
             default: ''
         }
     },
     data() {
         let money = (rule, value, call) => {
                if(!value) {
                    return call(new Error(value=='0' || value===0? '不能为0':'不能为空'))
                }
                if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                    return call(new Error('格式不正确'));
                }
                call();
            }
        let integer = (rule, value, call) =>  {
                if(!value) {
                    return call(new Error(value===0? '不能为0':'不能为空'))
                }
                
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                return call();
            }
         return {
             rules: {
                 money: [{validator: money, trigger: 'blur'}],
                 integer: [{validator: integer, trigger: 'blur'}]
             },
             detailData: {
                 commonUserRecommendRule: {},
                 merchantRecommendRule: {},
                 orderReceiveRule: {}
             },
             loading: false,
             saveLoading: false
         }
     },
     watch: {
         name(val) {
             if(val === 'second') {
                 this.getMerchantRewardDetail();
             }
         }
     },
     created() {
         this.getMerchantRewardDetail();
     },
     methods: {
         getMerchantRewardDetail() { // 商户达标奖励设置查询
             this.loading = true
             this.$http.get(this.$api.merchantRewardDetail, {}, true)
             .then(res => {
                 this.detailData = res
                 console.log(res)
                 this.loading = false
             })
             .catch(err => {
                 this.$message.error(err.message)
             })
         },
         saveMerchantReward() { // 保存商户达标设置
            this.saveLoading = true
            this.$http.post(this.$api.merchantRewardUpdate, this.detailData, true)
            .then(res => {
                this.saveLoading = false
                this.$message.success('保存成功')
                this.getMerchantRewardDetail();
            })
            .catch(err => {
                this.saveLoading = false
                this.$message.error(err.message)
            })
         }
     }
 }
    
</script>

<style>
</style>

