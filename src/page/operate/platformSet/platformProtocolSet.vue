<template>
 <div class = 'xk-container'>
    <div class='xk-radius'>
      <div class='xk-title'>
        <div class='vus-title'>
         <span></span>
            基础信息设置
        </div>
        <div class='vus-btn'></div>
        <div class='vus-bottom'></div>

        <el-form label-width="200px" label-position="right" style="margin-top: 25px;" ref="phoneForm" :model="phoneForm" class="basic-info" :rules="rules">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="晓可广场联系电话：" :rules="rules.phone" prop="squarePhone">
                        <el-input v-model.trim="phoneForm.squarePhone" style="width: 400px" :size="$size" placeholder="晓可广场联系电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="晓可联盟联系电话：" :rules="rules.phone" prop="merchantPhone">
                        <el-input v-model.trim="phoneForm.merchantPhone" style="width: 400px" :size="$size" placeholder="晓可联盟联系电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="晓可小视频联系电话：" :rules="rules.phone" prop="videoPhone">
                        <el-input v-model.trim="phoneForm.videoPhone" style="width: 400px" :size="$size" placeholder="晓可小视频联系电话"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="公司资质：" prop="qualification">
                <div style="width: 70%">
                    <UE v-model="phoneForm.qualification"></UE>
                </div>
            </el-form-item>
        </el-form>
        <div class="btn-group">
            <el-button :size="$size" type="primary" @click="saveData()" v-permission="'platformBasicSet'">保存基础设置</el-button>
        </div>
      </div>
    </div>
    <div class='xk-radius margintop20'>
      <div class='xk-title'>
        <div class='vus-title'>
         <span></span>
            平台基础设置
        </div>
        <div class='vus-btn'></div>
        <div class='vus-bottom'></div>
        <el-form label-position="top" label-width="80px" :model="protocol" ref="protocol">
        <el-tabs v-model="activeName">
            <el-tab-pane label="商联" name="first">
                  <div>平台协议设置</div>
                  <el-form-item label="晓可联盟：" style="margin-top: 25px">
                    <el-button @click="platformInfo($event, 'MAM_XKB_RECHARGE_RULE', 'mam')" :loading="loading.MAM_XKB_RECHARGE_RULE">晓可币充值规则</el-button>
                    <el-button @click="platformInfo($event, 'MAM_CONSUME_DRAW_RULES', 'mam')" :loading="loading.MAM_CONSUME_DRAW_RULES">消费抽奖规则</el-button>
                    <el-button @click="platformInfo($event, 'MAM_J_MALL_DRAW_RULES', 'mam')" :loading="loading.MAM_J_MALL_DRAW_RULES">夺奖派对抽奖规则</el-button>
                    <el-button @click="platformInfo($event, 'MAM_PRIVACY_PROTOCOL', 'mam')" :loading="loading.MAM_PRIVACY_PROTOCOL">隐私协议</el-button>
                    <el-button @click="platformInfo($event, 'MAM_APP_USER_PROTOCOL', 'mam')" :loading="loading.MAM_APP_USER_PROTOCOL">app用户协议</el-button>
                    <el-button @click="platformInfo($event, 'MAM_PROFIT_RULE', 'mam')" :loading="loading.MAM_PROFIT_RULE">收益规则</el-button>
                    <el-button @click="platformInfo($event, 'MAM_JOIN_MONEY_RULES', 'mam')" :loading="loading.MAM_JOIN_MONEY_RULES">商户加盟费规则</el-button>
                    <el-button @click="platformInfo($event, 'MAM_CAUTION_MONEY_RULES', 'mam')" :loading="loading.MAM_CAUTION_MONEY_RULES">商户保证金规则</el-button>
                    <el-button @click="platformInfo($event, 'ALLIANCE_MAM_DATA_EXPLAIN', 'mam')" :loading="loading.ALLIANCE_MAM_DATA_EXPLAIN">联盟商数据说明</el-button>
                  </el-form-item>
                  <el-form-item label="合伙人：">
                    <el-button @click="platformInfo($event, 'PARTNER_LEAGUE_CONTRACT', 'mam')" :loading="loading.PARTNER_LEAGUE_CONTRACT">合伙人加盟合同</el-button>
                    <el-button @click="platformInfo($event, 'PARTNER_SPECIAL_CONTRACT', 'mam')" :loading="loading.PARTNER_SPECIAL_CONTRACT">合伙人特别合约</el-button>
                  </el-form-item>
                  <el-form-item label="主播：">
                    <el-button @click="platformInfo($event, 'ZB_LEAGUE_CONTRACT', 'mam')" :loading="loading.ZB_LEAGUE_CONTRACT">主播加盟合同</el-button>
                    <el-button @click="platformInfo($event, 'ZB_SPECIAL_CONTRACT', 'mam')" :loading="loading.ZB_SPECIAL_CONTRACT">主播特别合约</el-button>
                  </el-form-item>
                  <el-form-item label="个人：">
                    <el-button @click="platformInfo($event, 'PERSONAL_LEAGUE_CONTRACT', 'mam')" :loading="loading.PERSONAL_LEAGUE_CONTRACT">个人加盟合同</el-button>
                    <el-button @click="platformInfo($event, 'PERSONAL_SPECIAL_CONTRACT', 'mam')" :loading="loading.PERSONAL_SPECIAL_CONTRACT">个人特别合约</el-button>
                  </el-form-item>
                  <el-form-item label="商户：">
                    <el-button @click="platformInfo($event, 'MERCHANT_LEAGUE_CONTRACT', 'mam')" :loading="loading.MERCHANT_LEAGUE_CONTRACT">商户加盟合同</el-button>
                    <el-button @click="platformInfo($event, 'MERCHANT_SPECIAL_CONTRACT', 'mam')" :loading="loading.MERCHANT_SPECIAL_CONTRACT">商户特别合约</el-button>
                  </el-form-item>
                  <el-form-item label="家族：">
                    <el-button @click="platformInfo($event, 'FAMILY_LEAGUE_CONTRACT', 'mam')" :loading="loading.FAMILY_LEAGUE_CONTRACT">家族加盟合同</el-button>
                    <el-button @click="platformInfo($event, 'FAMILY_SPECIAL_CONTRACT', 'mam')" :loading="loading.FAMILY_SPECIAL_CONTRACT">家族特别合约</el-button>
                  </el-form-item>
                  <el-form-item label="工会：">
                    <el-button @click="platformInfo($event, 'TRADE_UNION_LEAGUE_CONTRACT', 'mam')" :loading="loading.TRADE_UNION_LEAGUE_CONTRACT">工会加盟合同</el-button>
                    <el-button @click="platformInfo($event, 'TRADE_UNION_SPECIAL_CONTRACT', 'mam')" :loading="loading.TRADE_UNION_SPECIAL_CONTRACT">工会特别合约</el-button>
                  </el-form-item>
                  <div class="line"></div>
                  <div class="title">未开放城市商户入驻数量限制</div>
                    <el-form-item label="入驻数量限制：" prop='cityNum' :rules="rules.integer">
                        <el-input :size="$size" style="width: 200px;margin-right: 100px" v-model="protocol.cityNum"></el-input>
                        <el-button :size="$size" type="primary" @click="setCityName" :loading='cityLoading' v-permission="'platformMerchantEnterNumber'">保存入驻数量设置</el-button>
                    </el-form-item>
                   <!-- <span class="des-title">入驻数量限制：</span>
                    <el-input :size="$size" style="width: 200px" placeholder="请输入入驻限制数量"></el-input> -->
                  <!-- </el-form> -->
            </el-tab-pane>
            <el-tab-pane label="晓可广场" name="second">
              <div>平台协议设置</div>
                <el-form-item style="margin-top: 25px">
                    <el-button @click="platformInfo($event, 'UA_XKB_RECHARGE_RULE', 'ua')" :loading="loading.UA_XKB_RECHARGE_RULE">晓可币充值规则</el-button>
                    <el-button @click="platformInfo($event, 'UA_CONSUME_DRAW_RULES', 'ua')" :loading="loading.UA_CONSUME_DRAW_RULES">消费抽奖规则</el-button>
                    <el-button @click="platformInfo($event, 'UA_J_MALL_DRAW_RULES', 'ua')" :loading="loading.UA_J_MALL_DRAW_RULES">夺奖派对抽奖规则</el-button>
                    <el-button @click="platformInfo($event, 'UA_PRIVACY_PROTOCOL', 'ua')" :loading="loading.UA_PRIVACY_PROTOCOL">隐私协议</el-button>
                    <el-button @click="platformInfo($event, 'UA_APP_USER_PROTOCOL', 'ua')" :loading="loading.UA_APP_USER_PROTOCOL">app用户协议</el-button>
                    <el-button @click="platformInfo($event, 'UA_AA_LOTTERY_PROTOCOL', 'ua')" :loading="loading.UA_AA_LOTTERY_PROTOCOL">AA彩票抽奖协议</el-button>
                    <el-button @click="platformInfo($event, 'UA_AA_LOTTERY_PROTOCOL', 'ua')" :loading="loading.UA_AA_LOTTERY_PROTOCOL">海淘须知</el-button>
                </el-form-item>
                <div class="line"></div>
                <div class="title">登录设置</div>
                <div>
                  <span class="des-title">是否允许三方登录：</span>
                  <el-radio-group v-model="thirdRadio">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                  <el-button :size="$size" type="primary" @click="setThirdLogin" style="margin-left: 100px" 
                  :loading="thirdLoading" v-permission="'platformThirdLogin'">保存登录设置</el-button>
                </div>

                <!-- <div class="line margintop20"></div>
                <div class="title">基础信息设置</div> -->
                
            </el-tab-pane>
            <el-tab-pane label="晓可直播" name="third">
              <div>平台协议设置</div>
              <el-form-item  style="margin-top: 25px">
                    <el-button @click="platformInfo($event, 'ZB_APP_USER_PROTOCOL', 'zb')" :loading="loading.ZB_APP_USER_PROTOCOL">直播APP协议</el-button>
                    <el-button @click="platformInfo($event, 'ZBPRIVACY_PROTOCOL', 'zb')" :loading="loading.ZBPRIVACY_PROTOCOL">直播隐私协议</el-button>
                    <el-button @click="platformInfo($event, 'ZB_XKB_RECHARGE_RULE', 'zb')" :loading="loading.ZB_XKB_RECHARGE_RULE">直播晓可币充值规则</el-button>
                </el-form-item>
                <!-- <div class="line"></div>
                <div class="title">登录设置</div> -->
                <!-- <div>
                  <span class="des-title">是否允许三方登录：</span>
                  <el-radio-group v-model="liveRadio">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </div> -->
            </el-tab-pane>
            <el-tab-pane label="晓可骑手" name="four">
                暂无协议
            </el-tab-pane>
        </el-tabs>
        </el-form>
        <!-- <div class="platform-protocol-set"> -->
          <!-- <el-form label-position="top" label-width="80px" :model="protocol">
            <el-form-item label="商户：">
              <el-button @click="platformInfo($event, 'MERCHANT_LEAGUE_CONTRACT')" :loading="loading.MERCHANT_LEAGUE_CONTRACT">商家加盟合同</el-button>
              <el-button @click="platformInfo($event, 'MERCHANT_SPECIAL_CONTRACT')" :loading="loading.MERCHANT_SPECIAL_CONTRACT">特别合约</el-button>
              <el-button @click="platformInfo($event, 'MERCHANT_GUARANTEE')" :loading="loading.MERCHANT_GUARANTEE">担保书</el-button>
              <el-button @click="platformInfo($event, 'MERCHANT_APP_USERPROTOCOL')" :loading="MERCHANT_APP_USERPROTOCOL">app用户协议</el-button>
               <el-button @click="platformInfo($event, 'PROFIT_RULE_EXPLAIN')" :loading="PROFIT_RULE_EXPLAIN">收益规则说明</el-button>
            </el-form-item>
            <el-form-item label="主播：">
              <el-button @click="platformInfo($event, 'ZB_LEAGUE_CONTRACT')" :loading="loading.ZB_LEAGUE_CONTRACT">主播加盟合同</el-button>
              <el-button @click="platformInfo($event, 'ZB_SPECIAL_CONTRACT')" :loading="loading.ZB_SPECIAL_CONTRACT">特别合约</el-button>
            </el-form-item>
            <el-form-item label="推广人员：">
              <el-button @click="platformInfo($event, 'PERSONAL_LEAGUE_CONTRACT')" :loading="loading.PERSONAL_LEAGUE_CONTRACT">个人加盟合同</el-button>
              <el-button @click="platformInfo($event, 'PERSONAL_SPECIAL_CONTRACT')" :loading="loading.PERSONAL_SPECIAL_CONTRACT">特别合约</el-button>
            </el-form-item>
            <el-form-item label="合伙人：">
              <el-button @click="platformInfo($event, 'PARTNER_LEAGUE_CONTRACT')" :loading="loading.PARTNER_LEAGUE_CONTRACT">公司加盟合同</el-button>
              <el-button @click="platformInfo($event, 'PARTNER_SPECIAL_CONTRACT')" :loading="loading.PARTNER_SPECIAL_CONTRACT">特别合约</el-button>
            </el-form-item>
            <el-form-item label="普通用户：">
              <el-button @click="platformInfo($event, 'J_MALL_DRAW_RULES')" :loading="loading.J_MALL_DRAW_RULES">夺奖派对抽奖规则</el-button>
              <el-button @click="platformInfo($event, 'CONSUME_DRAW_RULES')" :loading="loading.CONSUME_DRAW_RULES">消费抽奖页面</el-button>
              <el-button @click="platformInfo($event, 'APP_USER_PROTOCOL')" :loading="loading.APP_USER_PROTOCOL">APP用户协议</el-button>
              <el-button @click="platformInfo($event, 'AA_LOTTERY_PROTOCOL')" :loading="loading.AA_LOTTERY_PROTOCOL">AA彩票抽奖协议</el-button>
            </el-form-item>
          </el-form> -->
          <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="793px"
            :before-close="notClose"
            :show-close="false"
            >
            <UE v-model="platformData"></UE>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editPlatform" :loading="editLoading" v-permission="'platformProtocolSetEdit'">保 存</el-button>
            </span>
          </el-dialog>
          
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import XkFormItem from '@/components/common/XKFormItem'
import UE from '@/components/UE.vue'
export default {
  name:'platformProtocolSet',
  data () {
    let integer = (rule, value, call) =>{
                if(!value) {
                    return call(new Error(value===0? '不能为0':'不能为空'))
                }
                
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                return call();
            }
    const checkPhone = (rule, value, call)=>{
        if(!value) {
            return call(new Error('不能为空'))
        }
        if(!/^\d*[-]{0,1}\d*[-]{0,1}\d*$/.test(value)) {
            return call(new Error('格式为纯数字或者028-01-23-456'))
        }
        if(value.length>15 || value.length<5) {
            return call(new Error('电话号码字符长度不对！'))
        }
        call();
    }
    return {
      protocol: {
          name: '',
          region: '',
          type: '',
          cityNum: ''
        },
      dialogVisible:false,
      loading: {},
      editLoading: false,
      title: "",
      platformData: [],
      key: '',
      content: "",
      name: '',
      type: '',
      liveRadio: '',
      thirdRadio: '',
      rules: {
        integer: [{validator: integer}],
        qualification: [{required: true, message: '不能为空', trigger: 'change'}],
        phone: [{ required: true, validator: checkPhone, trigger: 'blur'}]
      },
      cityLoading: false,
      thirdLoading: false,
      phoneForm: {},
      activeName: 'first'
    };
  },
  props: {},
  components: {
    UE,
    XkFormItem
  },
  computed: {},
  created() {
      this.getData();
    this.getCityNum();
    this.getThirdLoginDetail();
  },
  mounted() {},
  methods: {
    platformInfo(event, key, type){ // 查看协议内容
        this.title = event.target.innerText
        this.key = key;
        this.type = type;
        this.$set(this.loading, key, true);
        this.$http.get(this.$api.platformPtotocolConfigDetail, {contractConfigKey: key, forPlatform: type}, true)
        .then(res => {
            this.$set(this.loading, key, false);
            this.dialogVisible = true
            console.log(res)
            this.platformData = res ? res.content: "";
        })
        .catch(err => {
          this.$set(this.loading, key, false);
          this.$message.error(err.message)
        })
    },
    editPlatform(data) { // 编辑协议
        let paramList = {
          contractConfigKey: this.key,
          content: this.platformData,
          forPlatform: this.type,
          name: this.title
        }
        console.log(paramList)
        this.editLoading = true
        this.$http.post(this.$api.settingPlatformProtocolConfig, paramList, true)
        .then(res => {
          this.editLoading = false;
          this.dialogVisible = false;
          this.$message.success("设置成功")
        })
        .catch(err => {
          this.editLoading = false;
          this.dialogVisible = false;
          this.$message.error(err.message)
        })
    },
    notClose() {},
    getCityNum() { // 未开放城市商户入驻数量
      this.$http.get(this.$api.merchantEnterNumberLimitQuery, {}, true)
      .then(res => {
          this.protocol.cityNum = res.data.number
      })
      .catch(err => {
        this.$message.error(err.message)
      })
    },
    setCityName() { // 设置未开放城市商户入驻数量s
      this.$refs['protocol'].validate(valid => {
        if(valid) {
          this.cityLoading = true
          this.$http.post(this.$api.merchantEnterNumberLimitCreate, {number: this.protocol.cityNum}, true)
          .then(res => {
            this.cityLoading = false
            this.$message.success('保存成功')
            this.getCityNum();
          })
          .catch(err => {
              this.$message.error(err.message)
              this.cityLoading  = false
          })
        }
      })
    },
    getThirdLoginDetail() { // 第三方登录设置详情
        this.$http.get(this.$api.thirdLoginDetail, {}, true)
        .then(res => {
            this.thirdRadio = res.isOpen
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    setThirdLogin() {
      this.thirdLoading = true
      this.$http.post(this.$api.thirdLoginSetting, {isOpen: this.thirdRadio}, true)
      .then(res => {
          this.$message.success("第三方登录设置成功");
          this.thirdLoading = false
          this.getThirdLoginDetail();
      })
      .catch(err => {
          this.thirdLoading = false
          this.$message.error(err.message)
      })
    },
    //获取基础设置信息
    getData() {
        this.$http.get(this.$api.baseInfoDetail, {}, true).then(res=>{
            if(!res) return ;
            this.phoneForm = {
                videoPhone: res.videoPhone,
                squarePhone: res.squarePhone,
                merchantPhone: res.merchantPhone,
                qualification: res.qualification
            }
        })
    },
    //保存基础设置
    saveData() {
        this.$refs['phoneForm'].validate(v=>{
            if(v){
                this.$http.post(this.$api.baseInfoSetting, {
                    videoPhone: this.phoneForm.videoPhone,
                    squarePhone: this.phoneForm.squarePhone,
                    merchantPhone: this.phoneForm.merchantPhone,
                    qualification: this.phoneForm.qualification
                }, true)
                .then(res=>{
                    this.$message.success('设置成功！')
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            }else{
                return false;
            }
        })
        
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.platform-protocol-set .el-form-item__content{
  margin-left: 20px;
}
.line {
  height: 1px;
  width: 100%;
  background: #e3e3e3;
}
.title {
  margin-top: 20px;
  margin-bottom: 10px;
}
.des-title {
  font-size: 14px;
  margin-left: 60px;
}
/deep/ .el-form--label-top .el-form-item__label{
    float: left;
}
.basic-info{
    .el-row {
        /deep/ .el-form-item{
            margin-bottom: 15px;
        }
    }
}
</style>