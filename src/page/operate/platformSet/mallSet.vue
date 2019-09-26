<template>
    <div class = 'xk-container'>
        <div class='xk-radius'>          
            <div class="mall-set">
                <div class='xk-title' v-if="getPermission('mallsetHot')">
                  <div class='vus-title'>
                      热搜设置
                  </div>
                  <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="saveSearch" :loading='load' >保存</el-button>
                </div>
                <div class='vus-bottom'></div>
                </div>
              <el-form v-if="getPermission('mallsetHot')" ref="form" :model="form" label-width="200px" label-position="left">
                    <el-form-item label="热搜关键词数量：">
                    <el-select v-model="selectNum" :size="$size">
                        <el-option :value="item" v-for="item in maxNum" :key="item"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="关键词填写：">
                        <el-form-item class="key-words" label-width="0px" v-for="(item,index) in selectNum" :key="item" :prop="'keyWord.'+index" :rules="
                            [ { required: true, validator: checkKeyWords, trigger: 'blur' } ]
                        ">
                            <el-input class="m-b-0" :size="$size" v-model.trim="form.keyWord[index]"></el-input>
                        </el-form-item>
                    </el-form-item>
              </el-form>
                <!-- 热门城市 -->
                <div class='xk-title'  v-if="getPermission('mallsetCity')">
                  <div class='vus-title'>
                      热门城市
                  </div>
                  <div class='vus-btn'>
                        <el-button type='primary' :size='$size' @click="saveCity" :loading='load'>保存</el-button>
                    </div>
                    <div class='vus-bottom'></div>
                </div>
                <el-form v-if="getPermission('mallsetCity')" ref="cityForm" :model="cityForm" label-width="200px" label-position="left">
                    <el-form-item label="热门城市数量">
                        <el-form-item label-width="0px">
                            <el-select :size="$size" v-model="cityForm.hotNum">
                                <el-option v-for="(item,index) in hotNum" :key="index" :value="item" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="关键词填写：">
                        <el-row>
                            <el-col :span="6" v-for="(item,index) in cityForm.hotNum" :key="index">
                                <el-form-item label-width="0px" :prop="'codes.'+index" :rules="
                                    [ {required: true, message: '不能为空', trigger: 'blur'} ]
                                ">
                                    <province-cascader onlyCity v-model="cityForm.codes[index]"></province-cascader>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>

                <div class='xk-title' v-if="getPermission('mallsetAuto')">
                  <div class='vus-title'>
                      自动设置
                  </div>
                  <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="saveAuto" :loading='load'>保存</el-button>
                </div>
                <div class='vus-bottom'></div>
                </div>
                <el-form v-if="getPermission('mallsetAuto')" ref="autoForm" label-width="200px" label-position="left" :model="autoForm">
                    <el-form-item label="用户自动确认收货："
                    prop='autoCollectGoods'
                    :rules="[
                        { required: true, message: '天数不能为空'},
                        { type: 'number', message: '天数必须为整数'}
                    ]">
                    <el-input :size="$size" v-model.number="autoForm.autoCollectGoods"></el-input>&nbsp;&nbsp;天
                    </el-form-item>
                    <el-form-item label="订单完成自动五星好评："
                    prop='autoEvaluate'
                    :rules="[
                        { required: true, message: '天数不能为空'},
                        { type: 'number', message: '天数必须为整数'}
                    ]">
                    <el-input :size="$size" v-model.number="autoForm.autoEvaluate"></el-input>&nbsp;&nbsp;天
                    </el-form-item>
                    <el-form-item label="未支付自动关闭订单："
                    prop='autoClose'
                    :rules="[
                        { required: true, message: '分钟数不能为空'},
                        { type: 'number', message: '分钟数必须为整数'}
                    ]">
                    <el-input :size="$size" v-model.number="autoForm.autoClose"></el-input>&nbsp;&nbsp;分钟
                    </el-form-item>
                    <el-form-item label="商户不处理退货自动退款："
                    prop='autoRefund'
                    :rules="[
                        { required: true, message: '天数不能为空'},
                        { type: 'number', message: '天数必须为整数'}
                    ]">
                    <el-input :size="$size" v-model.number="autoForm.autoRefund"></el-input>&nbsp;&nbsp;天
                    </el-form-item>
                    <el-form-item label="售后最长期限："
                    prop='maxTerm'
                    :rules="[
                        { required: true, message: '天数不能为空'},
                        { type: 'number', message: '天数必须为整数'}
                    ]">
                    <el-input :size="$size" v-model.number="autoForm.maxTerm"></el-input>&nbsp;&nbsp;天
                    </el-form-item>
                    
                    <el-form-item label="用户关闭推送后短信通知订单信息：" label-width="250px">
                    <el-switch
                        v-model="autoForm.sendSms"
                        active-color="#13ce66"
                        inactive-color="#dcdfe6">
                    </el-switch>
                    </el-form-item>
                </el-form>

                <!-- 销售奖励设置 -->
                <!-- <div class='xk-title'>
                    <div class='vus-title'>
                        销售奖励设置
                    </div>
                    <div class='vus-btn'>
                        <el-button type='primary' :size='$size' @click="saveSale" :loading='load'>保存</el-button>
                    </div>
                    <div class='vus-bottom'></div>
                </div>
                <el-form label-width="200px" label-position="left" :model="saleForm" ref="saleForm">
                    <el-form-item label="月销售额结束日期：" prop="dayOfMonth" :rules="rules.dayOfMonth">
                        <el-input :size="$size" placeholder="1-28的数字" v-model.trim="saleForm.dayOfMonth"></el-input>&nbsp;&nbsp;日
                    </el-form-item>
                </el-form> -->

                <!-- 夺奖派对库存预警设置 -->
                <div class='xk-title' v-if="getPermission('mallsetAlarm')">
                    <div class='vus-title'>夺奖派对库存预警设置</div>
                    <div class='vus-btn'>
                        <el-button type='primary' :size='$size' @click="savePrize()" :loading='loadPrize'>保存</el-button>
                    </div>
                    <div class='vus-bottom'></div>
                    <el-form label-width="200px" label-position="left" :model="prizeForm" ref="prizeForm">
                        <el-form-item label="派对奖品剩余期数为：">
                            <xk-form-item label-width="0px" style="display:inline-block" prop="WARING_NUMBER" type="integer">
                                <el-input :size="$size" placeholder="10" v-model.trim="prizeForm.WARING_NUMBER"></el-input>
                            </xk-form-item>&nbsp;&nbsp;时，向管理员&nbsp;&nbsp;
                            <xk-form-item label-width="0px" style="display:inline-block" type="phone" prop="ADMIN_PHONE">
                                <el-input :size='$size' placeholder="183********" v-model.trim="prizeForm.ADMIN_PHONE"></el-input>
                            </xk-form-item>&nbsp;&nbsp;发送短信报警
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
     </div>
</template>
<script>
import ProvinceCascader from "@/components/ProvinceCascader.vue";
import XkFormItem from '@/components/common/XKFormItem.vue';
import {getPermission} from '@/util/publicMehotds';
let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

export default {
  name: "mallSet",
  data() {
      const checkDateNum = (rule, value, call)=>{
          if(!value) {
              return call(new Error('月销售额结束日期不能为空'))
          }
          if(!/^[1-9]{1}\d*$/.test(value)){
              return call(new Error('日期必须为数字或第一个数字不能为0'))
          }
          if(value>28 || value <1) {
              return call(new Error('请输入1-28的数字'))
          }
          call();
      }
    return {
      maxNum: 10,
      selectNum: 1,
      hotNum: 9,
      dateNum: 28,
      form: {
        keyWord: [],
      },
      autoForm: {},
      cityForm: {
        hotNum: 1,
        codes:[]
      },
      saleForm: {},
    //   merchantForm: {},
      prizeForm: {},
      switchValue: true,
      load: false,
      loadPrize: false,
      rules: {
          dayOfMonth: [
              { required: true, validator: checkDateNum, trigger: 'blur' }
          ]
      }
    };
  },
  components: { ProvinceCascader,XkFormItem },
  created() {
    this.getSearch();
    this.getCity();
    this.getAuto();
    // this.getSale();
    this.getPrize();
  },
  methods: {
      getPermission,
      checkKeyWords(rule, value, call) {
          if(!value) {
              return call(new Error('不能为空'));
          }
          if(value.length>7) {
              return call(new Error('字符串长度不能超过7'))
          }
          call();
      },
      //保存热搜关键字
      saveSearch() {
          this.$refs['form'].validate(v=>{
              if(v){
                  let params = {
                      keyWord: this.form.keyWord.slice(0,this.selectNum)
                  }
                  this.$http.post(this.$api.settingHotWord, params, true)
                      .then(res=>{
                          this.$message.success('保存成功')
                      })
                      .catch(err=>{
                          this.$message.error(err.message);
                      })
              }else{
                  return false;
              }
          })
      },
      //保存热门城市
      saveCity() {
          this.$refs['cityForm'].validate(v=>{
              if(v){
                  let params = {
                      ids: []
                  }
                  this.cityForm.codes.slice(0, this.cityForm.hotNum).forEach((item, index, array)=>{
                      if(item.length===3) {
                          params.ids.push(district.get(item[item.length-1]).id)
                      }else if(item.length===2) {
                          params.ids.push(city.get(item[item.length-1]).id)
                      }else{
                          params.ids.push(province.get(item[item.length-1]).id)
                      }
                  })
                  this.$http.post(this.$api.hotRegionSetting, params, true)
                      .then(res=>{
                          this.$message.success('保存成功')
                      })
                      .catch(err=>{
                          this.$message.error(err.message);
                      })
              }else{
                  return false;
              }
          })
      },
      //保存自动设置
      saveAuto() {
          this.$refs['autoForm'].validate(v=>{
              if(v){
                  let params = JSON.parse(JSON.stringify(this.autoForm))
                  params.sendSms = params.sendSms?1: 0;
                  this.$http.post(this.$api.settingAutoConfig, params, true)
                      .then(res=>{
                          this.$message.success('保存成功')
                      })
                      .catch(err=>{
                          this.$message.error(err.message);
                      })
              }else{
                  return false;
              }
          })
      },
      //保存销售奖励设置
      saveSale() {
          this.$refs['saleForm'].validate(v=>{
              if(v){
                  this.$http.post(this.$api.settingSalesReward, this.saleForm, true)
                      .then(res=>{
                          this.$message.success('保存成功')
                      })
                      .catch(err=>{
                          this.$message.error(err.message);
                      })
              }else{
                  return false;
              }
          })
      },
      //保存未开放城市商户入驻数量限制
    //   saveMerchant() {
    //       this.$http.get(this.$api, {}, true)
    //         .then(res=>{
    //             console.log(res)
    //         })
    //         .catch(err=>{
    //             this.$message.error(err.message);
    //         })
    //   },
      //保存夺奖派对库存预警设置
      savePrize() {
          this.$refs['prizeForm'].validate(v=>{
              if(v){
                this.loadPrize = true;
                this.$http.post(this.$api.lotteryRepertoryWarningConfigSetting, this.prizeForm, true)
                    .then(res=>{
                        this.loadPrize = false;
                        this.$message.success('保存成功')
                    })
                    .catch(err=>{
                        this.loadPrize = false;
                        this.$message.error(err.message);
                    })
              }else{
                  return false;
              }
          })
      },
      getSearch() {
          this.$http.get(this.$api.hotWordDetail, {}, true)
            .then(res=>{
                if(res){
                    this.selectNum = res.keyWord.length;
                    this.form.keyWord = res.keyWord;
                }
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
      },
      getCity() {
          this.$http.get(this.$api.hotRegionPage, {}, true)
            .then(res=>{
                if(res) {
                    this.cityForm.hotNum = res.regions.length;
                    res.regions.forEach((item, index, array) => {
                        let arr = [];
                        if(item.level===3) {
                            arr.unshift(item.code);
                            arr.unshift(item.parentCode);
                            arr.unshift(city.get(item.parentCode).parentCode);
                        }else if(item.level === 2) {
                            arr.unshift(item.code);
                            arr.unshift(item.parentCode);
                        }else{
                            arr.push(item.code)
                        }
                        this.cityForm.codes.push(arr);
                    })
                }
                
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
      },
      getAuto() {
          this.$http.get(this.$api.autoConfigDetail, {}, true)
            .then(res=>{
                if(res) {
                    res.sendSms = res.sendSms==1? true: false;
                    this.autoForm = res;
                }
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
      },
    //   getSale() {
    //       this.$http.get(this.$api.salesRewardDetail, {}, true)
    //         .then(res=>{
    //             if(res) {
    //                 this.saleForm = res;
    //             }
    //         })
    //         .catch(err=>{
    //             this.$message.error(err.message)
    //         })
    //   },
    //   getMerchant() {
    //       this.$http.get(this.$api.salesRewardDetail, {}, true)
    //         .then(res=>{
    //             if(res) {
    //                 this.merchantForm = res;
    //             }
    //         })
    //         .catch(err=>{
    //             this.$message.error(err.message)
    //         })
    //   },
      getPrize() {
          this.$http.get(this.$api.lotteryRepertoryWarningConfigDetail, {}, true)
            .then(res=>{
                console.log(res);
                if(res) {
                    this.prizeForm = res;
                }
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
      }

  }
};
</script>
<style lang='scss' scoped>
@import "./scss/mallSet";
</style>