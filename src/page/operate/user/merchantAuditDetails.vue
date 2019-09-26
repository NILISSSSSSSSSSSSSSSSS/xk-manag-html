<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>{{title}}审核详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <div class="pubpadd" v-loading="loading">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>姓名： {{merchantAuditData.realName}}</el-col>
                        <el-col>手机号码：{{merchantAuditData.phone}}</el-col>
                        <el-col>性别：{{getSex(merchantAuditData.sex)}}</el-col>
                        <el-col>身份证号码：{{merchantAuditData.idCard}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺地址：{{merchantAuditData.address}}</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>银行卡信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">

                      <el-table :data="merchantAuditData.cardNumbers" border stripe>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="cardNumber" label="银行卡号"></el-table-column>
                        <el-table-column prop="bankName" label="银行名称"></el-table-column>
                        <el-table-column prop="openBank" label="开户行"></el-table-column>
                      </el-table>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" v-if="this.merchantType === 'MERCHANT' || this.merchantType === 'PARTNER'">
                <div slot="header" class="clearfix">
                    <span>店铺信息：</span>
                </div>
                <div class="paddBoth">
                    <!-- <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺名称： xx的晓可商铺</el-col>
                        <el-col>店铺地址：xxxx</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row> -->
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺门头照片： </el-col>
                        <el-col v-if="!merchantAuditData.doorheadPhoto">暂无店铺门头照</el-col>
                        <el-col v-else>
                          <div class="img-border">
                            <img :src="merchantAuditData.doorheadPhoto" class="imgSize"/>
                          </div>
                        </el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row  class="paddtop20" v-if="this.merchantType === 'MERCHANT'">
                        <el-col :span="4">店铺店内照片： </el-col>
                        <el-col v-if="!merchantAuditData.shopPhotos|| merchantAuditData.shopPhotos.length == 0" :span="4">暂无店铺店内照片</el-col>
                        <el-col :span="20" v-else>
                          <div class="img-border" v-for="photo in merchantAuditData.shopPhotos" :key="photo">
                            <img :src="photo" class="imgSize"/>
                          </div>
                        </el-col>
                    </el-row>
                    <el-row  type="flex" justify="space-between" class=" paddtop20">
                        <el-col>营业执照照片：</el-col>
                        <el-col v-if="!merchantAuditData.businessLicense">暂无营业执照照片</el-col>
                        <el-col v-else>
                          <div class="img-border">
                            <img :src="merchantAuditData.businessLicense" class="imgSize"/>
                          </div>
                        </el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>其他信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>主推城市:
                          <span v-if="!merchantAuditData.mainCities || merchantAuditData.mainCities.length == 0">暂无主推城市信息</span>
                          <span v-else v-for="code in merchantAuditData.mainCities" :key="code">
                          {{getCitys(code.provinceCode, code.cityCode, code.districtCode)}}&nbsp;
                          </span>
                          </el-col>    
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>合作推广优势：{{merchantAuditData.advantage}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>邀请码： {{merchantAuditData.inviteCode}}</el-col>
                        <el-col>商家加盟合同： 已同意</el-col>
                        <el-col>特别合约：  已同意</el-col>
                        <el-col>担保书：  已同意</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>审核：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between">
                        <el-col>审核结果：
                          <!-- <el-radio v-model="auditStatus" label="SUCCESS">通过</el-radio>
                          <el-radio v-model="auditStatus" label="FAILED">不通过</el-radio> -->
                          {{getAuthStatus(merchantAuditData.firstAuthStatus)}}
                        </el-col>
                        <!-- <el-col>
                          <el-input v-if="auditStatus === 'FAILED'" type="textarea" placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}" 
                          v-model="reason"></el-input>
                        </el-col> -->
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <div class="content">
              <el-button type="primary" @click="merchantAudit">确定</el-button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  export default {
      name: "merchantAuditDetails",
      data() {
        return {
            auditStatus: "",
            merchantAuditData: [],
            loading: false,
            reason: '',
            merchantType: '',
            title: ''
        }
      },
      created() {
        this.getMerchantAuditDetails();
      },
      methods: {
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
        getAuthStatus(val) {
            switch(val) {
              case "SUCCESS":
                return '认证成功';
              case "SUBMIT":
                return '提交认证';
              case "FAILED":
                return '认证失败';
            }
        },
        getCitys(pCode, cCode, dCode) { // 获取主推城市
          let address = "";
          if(pCode) {
            let isExit = new Map(JSON.parse(window.localStorage.getItem("xk-province"))).get(pCode) ; // 省
            address += isExit ? isExit.name : '';
          }
          if(cCode) {
            let isExit = new Map(JSON.parse(window.localStorage.getItem("xk-city"))).get(cCode);// 市
            address += isExit ? isExit.name : '';
          }
          if(dCode) {
            let isExit = new Map(JSON.parse(window.localStorage.getItem("xk-district"))).get(dCode) // 区
            address += isExit ? isExit.name : ''
          }
          return address;
          // let districts = JSON.parse(window.localStorage.getItem("xk-district")); // 区县
          // let provinces = JSON.parse(window.localStorage.getItem("xk-province")) // 省
          // let citys = JSON.parse(window.localStorage.getItem("xk-city")); // 市
          // let cityName = "";
          // let districtName ="";
          // let provinceName = ""
          // if(!pCode) {
          //   provinceName = ''
          // } else {
          //   for(let province of provinces) {
          //     if(province.code === pCode) {
          //       provinceName = province.name;
          //       break;
          //     }
          //   }
          // }
          // if(!cCode) {
          //   cityName = ''
          // } else {
          //   for(let city of citys) {
          //     if(city.code === cCode) {
          //       cityName = city.name;
          //       break;
          //     }
          //   }
          // }
          // if(!dCode) {
          //   districtName = ""
          // } else {
          //   for(let district of districts) {
          //     if(district.code === dCode) {
          //       districtName = district.name;
          //       console.log(districtName)
          //       break;
          //     }
          //   }
          // }
          // return provinceName + cityName + districtName;
        },
        getmerchantTypes(val) { // 枚举商户类型
            switch(val) {
              case 'EXTENSION_WORKER':
                  return '推广人员';
                  break;
              case 'ZHUBO':
                  return '主播';
                  break;
              case 'MERCHANT':
                  return '商户';
                  break;
              case 'PARTNER':
                  return '合伙人';
              case 'BROKERAGE_FIRM':
                  return '经济公司';
                  break;
            }
      },
        getMerchantAuditDetails() { // 获取商户审核详情
          let id = this.$route.query.mAuthResultId;
          this.merchantType = this.$route.query.merchantType;
          this.title = this.getmerchantTypes(this.merchantType);
          console.log(id);
          this.loading = true;
          this.$http.get(this.$api.mAuthDetail, {mAuthResultId: id}, true)
          .then(res => {
            this.merchantAuditData = res;
            this.auditStatus = res.firstAuthStatus;
            // this.reason = this.merchantAudit
            this.loading = false;
            console.log(this.merchantAuditData)
          })
          .catch(error => {
            this.loading = false;
            this.merchantAuditData = [];
            this.$message.error("获取详情失败")
          })
        },
        merchantAudit() { // 返回商户审核列表
          this.$router.push({path: "/merchantAudit"})
        }
        // handleMerchantAudit() {
        //   let id = this.merchantAuditData.merchantId;
        //   let type= this.$route.query.merchantType;
        //   // console.log(id+type+"::"+this.auditStatus+this.reason)
        //   let paramlist = {
        //     merchantId: id,
        //     authStatus:this.auditStatus,
        //     merchantType: type,
        //     message: this.reason
        //   }
        //   console.log(paramlist)
        //   this.$http.post(this.$api.merchantFirstAuth, paramlist, true)
        //   .then(res => {
        //     this.$router.push({path: "/merchantAudit"});
        //   })
        //   .catch(err => {
        //     this.$message.error("提交失败");
        //     this.$router.push({path: "/merchantAudit"});
        //   })
        // }
      }
  }
</script>

<style scoped>
.img-border {
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 30px;
  text-align: center;
  /* overflow: hidden; */
}
.img-border::after {
  display: inline-block;
  width: 0;
  height: 100%;
  content: '';
  vertical-align: middle;
}
.imgSize {
  height: 100px;
  vertical-align: middle;
}
.content {
  margin: 20px auto;
  text-align: center;
}
</style>
