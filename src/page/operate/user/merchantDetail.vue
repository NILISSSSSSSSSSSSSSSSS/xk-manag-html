<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>{{getMerchantTypes(this.$route.query.type)}}详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <el-card style="margin-bottom: 10px">
            <div>基本信息</div>
            <el-row class="info-class">
                <el-col>姓名： {{detailData.merchant.name}}</el-col>
                <el-col>手机号码： {{detailData.merchant.phone}}</el-col>
                <el-col>性别： {{detailData.merchant.sex === 'male' ? '男' : detailData.merchant.sex === 'female' ? '女' : '保密'}}</el-col>
                <el-col>身份证号码： {{detailData.merchant.idCardNo}}</el-col>
                <el-col>联盟商号：{{detailData.merchant.code}}</el-col>
                <el-col>安全码： {{detailData.securityCode}}</el-col>
                <el-col v-if="this.$route.query.type ==='anchor'">家族安全码：{{detailData.familySecurityCode}}</el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 10px">
                <div class="title">资料信息</div>
                <el-card style="margin-top: 10px">
                    <div class="title">公司资料</div>
                    <el-row>
                         <el-col :span="10" style="text-align: left; font-size: 14px;line-height: 30px;margin-left: 80px" v-for="(item, index) in companyInfo" :key="index">
                             {{item.name}} ：
                             <!-- <img v-if="item.media === 'picture'" :src="item.value" class="img-size"/> -->
                              <img v-if="item.media === 'picture' && (typeof(item.value) == 'string')" @click="$viewIamge(url, false)" :src="item.value" class="img-size"/>
                             <el-row v-else-if="item.media === 'picture' && (item.value instanceof Array)">
                                 <el-col :span="6" v-for="(url, index) of item.value" :key="index">
                                     <img :src="url"  @click="$viewIamge(url, false)" class="img-size"/>
                                 </el-col>
                             </el-row>
                             <video v-else-if="item.media === 'video'" :src="item.value"
                             @click="$viewImage(item.value + '?type=video', true)" class="img-size"></video>
                             <span v-else>
                                 <span v-if="item.key ==='companyCategory'">
                                     {{item.value === 'company' ? '公司' : '个人'}}
                                 </span>
                                 <span v-else-if="item.key ==='accountCreationType'">
                                     {{item.value === 'create' ? '创建新的晓可账号' : '绑定已有晓可账号'}}
                                 </span>
                                 <span v-else-if="item.key === 'businessAddress' || item.key === 'registerAddress' || item.key==='companyAddress'">
                                     {{getPorvinceInfo(item.value)}}
                                 </span>
                                 <span v-else-if="item.key==='mainCities'">
                                     <span v-for="(city, index) of item.value" :key="index" style="margin-right: 10px">
                                         {{getPorvinceInfo(city)}}
                                     </span>
                                 </span>
                                 <span v-else-if="item.key==='companyType'">
                                     <span>{{item.value === 'online' ? '线上' : '线下'}}</span>
                                 </span>
                                 <span v-else-if="item.key==='specialIndustry'">
                                     <span v-if="item.value">{{getIndustryName(item, index)}}</span>
                                     <span>{{item.newValue}}</span>
                                 </span>
                                 <span v-else-if="item.key==='companyNature'">
                                     <span>{{getCompanyNature(item.value)}}</span>
                                 </span>
                                 <span v-else-if="item.key==='firstIndustry'">
                                      <span v-if="item.value">{{getIndustryName(item, index)}}</span>
                                      <span>{{item.newValue}}</span>
                                 </span>
                                 <span v-else-if="item.key==='businessLicenseDate'">
                                     <span>{{item.value | formatTime('YYYY-MM-DD')}}</span>
                                 </span>
                                 <span v-else-if="item.key==='legalPersonIdCardDate'">
                                     <span>{{item.value | formatTime("YYYY-MM-DD")}}</span>
                                 </span>
                                 <span v-else>
                                      {{item.value}}
                                 </span>
                             </span>
                        </el-col>
                    </el-row>
                </el-card>
                <!-- <el-card style="margin-top: 10px">
                    <div class="title">银行资料</div>
                    <el-row>
                         <el-col :span="10" style="text-align: left; font-size: 14px;line-height: 30px;margin-left: 80px" v-for="(item, index) in bankInfo" :key="index">
                             {{item.name}}：
                             <span v-if="item.key === 'bankAccountType'">
                                 {{!item.value  ? '未填写' : item.value === 'pub' ? '对公账户' : '对私账户'}}
                             </span>
                             <span v-else-if="item.key === 'openBank'">
                                 {{getBankQuery(item)}}{{item.newValue}}
                             </span>
                             <span v-else-if="item.key === 'bankNo'">
                                 {{getBankDotQuery(item)}}{{item.newValue}}
                             </span>
                             <span v-else>{{item.value}}</span>
                        </el-col>
                    </el-row>
                </el-card> -->
                <el-card style="margin-top: 10px">
                    <div class="title">自定义资料</div>
                    <el-row>
                         <el-col :span="10" style="text-align: left; font-size: 14px;line-height: 30px;margin-left: 80px" v-for="(item, index) in customInfo" :key="index">
                             <span>{{item.name}} : {{item.value}}</span>
                        </el-col>
                    </el-row>
                </el-card>
                 <el-card style="margin-top:10px" v-if="this.$route.query.type === 'company'">
                    <div class="title">绑定联盟商列表</div>
                    <el-form label-width="120px" :model="bindForm">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="联盟商ID：">
                                    <el-input :size="$size" placeholder="请输入联盟商ID" v-model="bindForm.merchantId"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="联盟商手机：">
                                    <el-input :size="$size" placeholder="请输入联盟商手机" v-model="bindForm.phone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" style="text-align: right">
                                <el-button :size="$size" type="primary" @click="getDetailData">查询</el-button>
                                <el-button :size="$size" type="plain" @click="resetForm">清空</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-table stripe :data="bindData" v-loading="loading">
                        <el-table-column label="ID" prop="bindMerchantId"></el-table-column>
                        <el-table-column label="安全码" prop="bindSecurityCode"></el-table-column>
                        <el-table-column label="联盟商手机号" prop="bindPhone"></el-table-column>
                        <el-table-column label="联盟商姓名" prop="bindMerchantName"></el-table-column>
                        <el-table-column label="推荐用户" prop="recommendUser"></el-table-column>
                        <el-table-column label="推荐联盟商" prop="recommendMerchant"></el-table-column>
                        <el-table-column label="联盟商类型" prop="bindIdentityStatus">
                            <template slot-scope="scope">
                                {{getBindMerchantTypes(scope.row.bindIdentityStatus)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="商户首次入驻时间">
                            <template slot-scope="scope">
                                {{scope.row.bindEnterTime | formatTime}}
                            </template>
                        </el-table-column>
                        <el-table-column label="账号状态">
                            <template slot-scope="scope">
                                {{scope.row.bindBizStatus === 'enable' ? '激活' : '冻结'}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-card>

        <div style="margin-top: 20px; text-align: center">
            <el-button :size="$size" type="plain" @click="goBack">返回账号详情</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  import {getPorvinceInfo} from '@/util/publicMehotds'
  import {MerchantAuditorType, MerchantTypes,CompanyNature} from '@/util/publicParams'
  export default {
      name: "businessDetails",
      data() {
        return {
          id: '',
          merchantData: [],
          detailData: {
              merchant: {}
            },
          shop: {},
          taskData: [],
          ratio: '',
          authStatus: '',
          oneLevels: '',
          twoLevels: '',
          msg: '',
          merchantTypesData: [],
          companyInfo: [],
          baseInfo: [],
          bankInfo: [],
          customInfo: [],
          loading: false, // 合伙人绑定列表加载
          bindData: [],
          bindForm: {
              merchantId: '',
              phone: ''
          },
        }
      },
      created() {
        this.getDetailData();
        // this.getIndustryList();
      },
      methods: {
        getPorvinceInfo,
        goBack() {
          this.$router.go(-1);
        },
        getSex(val) {
          switch(val) {
            case "male":
              return "男";
            case "female":
              return "女";
            case "unknown":
              return "保密";
          }
        },
        getMerchantTypes(val) {
          let name = '';
          for(let item of MerchantTypes) {
            if(val === item.key) {
              name = item.label;
            }
          }
          return name;
        },
        getCompanyNature(val) { // 公司（商户）性质
            let name = '';
            for(let item of CompanyNature) {
                if(val === item.key) {
                name = item.label;
                }
            }
          return name;
        },
        getIndustryName(item, index) { // 特约行业分类和行业类目
          if(item.value) {
            this.$http.get(this.$api.tfIndustryQuery, {code: item.value}, true)
              .then(res => {
                  // item.newValue = res.name;
                  this.$set(item, 'newValue', res ? res.name : item.value)
              })
              .catch(err => {
                  this.$message.error(err.message)
              })
          } else {
              this.$set(item, 'newValue', item.value)
          }
        },
        // getBankQuery(item) { // 银行信息
        //   if(item.value) {
        //     this.$http.get(this.$api.tfBankQuery, {code: item.value}, true)
        //       .then(res => {
        //           // item.newValue = res.name;
        //           this.$set(item, 'newValue', res ? res.name : item.value)
        //       })
        //       .catch(err => {
        //           this.$message.error(err.message)
        //       })
        //   } else {
        //       this.$set(item, 'newValue', item.value)
        //   }
        // },
        // getBankDotQuery(item) { // 银行网点(行号)信息
        //   if(item.value) {
        //       this.$http.get(this.$api.tfBankDotQuery, {code: item.value}, true)
        //       .then(res => {
        //           // item.newValue = res.name;
        //           this.$set(item, 'newValue', res ? res.name : item.value)
        //       })
        //       .catch(err => {
        //           this.$message.error(err.message)
        //       })
        //   } else {
        //       this.$set(item, 'newValue', item.value)
        //   }
        // },
        resetForm() {
            this.bindForm = {}
        },
        getBindMerchantTypes(val) { // 绑定联盟商类型
            let name = ''
            if(val) {
                for(let item of val) {
                    switch(item.merchantType) {
                        case 'shops':
                            name = name + '商家' + ' ';
                            break;
                        case 'personal':
                            name = name + '个人/团队/公司' + ' ';
                            break;
                        case 'company':
                            name = name + '合伙人' + ' ';
                            break;
                        case 'anchor':
                            name = name + '主播' + ' ';
                            break;
                        case 'familyL1':
                            name = name + '家族长' + ' ';
                            break;
                        case 'familyL2':
                            name = name + '公会' + ' ';
                            break;
                    }
                }
            }
            return name;
        },
        getDetailData() { // 账号角色详情
            let paramList = {
                merchantId: this.$route.query.id,
                merchantType: this.$route.query.type,
                bindMerchantId: this.bindForm.merchantId,
                bindPhone: this.bindForm.phone
            }
            console.log(paramList)
            this.$http.get(this.$api.merchantIdentityExamineDetail, paramList, true)
            .then(res => {
                this.detailData = res
                this.initInfoData(this.detailData)
                this.bindData = this.detailData.bindMerchants ? this.detailData.bindMerchants : []// 绑定联盟商列表
                console.log(this.detailData)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        initInfoData(val) { //处理资料信息
            this.baseInfo = [];
            this.companyInfo = [];
            this.bankInfo = [];
            this.customInfo = [];
            this.infoData = JSON.parse(JSON.stringify(val));
            console.log(val)
            if(!this.infoData.identity) {
                    return;
            } else {
                for(let item of this.infoData.identity) {
                    switch(item.group) {
                        case 'company':
                            this.companyInfo.push(item);
                            break;
                        case 'bank':
                            this.bankInfo.push(item)
                            break;
                        default:
                            this.customInfo.push(item)
                    }
                }
            }
        },
      }
  }
</script>

<style  scoped>
.img-border {
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 30px;
  text-align: center;
  overflow: hidden;
}
.imgSize {
  height: 100px;
  vertical-align: middle;
}
.img-border::after {
  display: inline-block;
  width: 0;
  height: 100%;
  content: '';
  vertical-align: middle;
}
.content {
  margin: 20px auto;
  text-align: center;
}
.item-content {
        font-size: 14px;
        line-height: 30px;
        /* margin-left: 80px; */
    }
.img-size {
        width: 150px;
        vertical-align: top;
        margin-bottom: 20px;
    }
    .info-class {
        font-size: 14px;
        margin-left: 80px;
        line-height: 30px;
    }
</style>
