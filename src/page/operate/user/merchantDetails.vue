<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>商户详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <div class="pubpadd">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>姓名： {{merchantData.realName}}</el-col>
                        <el-col>手机号码：{{merchantData.phone}}</el-col>
                        <el-col>性别：{{getSex(merchantData.sex)}}</el-col>
                        <el-col>身份证号码：{{merchantData.idCard}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>地址：{{merchantData.address}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>银行卡信息：</span>
                </div>
                <div class="paddBoth">
                  <el-table :data="merchantData.banks" border stripe>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="cardNumber" label="银行卡号"></el-table-column>
                    <el-table-column prop="bankName" label="银行名称"></el-table-column>
                    <el-table-column prop="openBank" label="开户行"></el-table-column>
                  </el-table>
                </div>
            </el-card>
              <el-card class="box-card margintop20" v-if="merchantData.mAuthInfos===undefined || merchantData.mAuthInfos.length == 0">
                <div slot="header" class="clearfix">
                    <span>认证信息：</span>
                </div>
                <div class="paddBoth">
                  <el-row type="flex" justify="space-between">
                      <el-col :span="4">暂无信息 </el-col>
                  </el-row>
                </div>
              </el-card>
            <el-card v-else class="box-card margintop20" v-for="item in merchantData.mAuthInfos" :key="item">
                <div slot="header" class="clearfix">
                    <span>{{getMerchantType(item.merchantType)}}认证信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺门头照片： </el-col>
                        <el-col v-if="!item.doorheadPhoto">暂无店铺门头照</el-col>
                        <el-col v-else>
                          <div class="img-border">
                            <img :src="item.doorheadPhoto" class="imgSize"/>
                          </div>
                        </el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row  class="paddtop20">
                        <el-col :span="4">店铺店内照片： </el-col>
                        <el-col v-if="item.shopPhotos === undefined || item.shopPhotos.length == 0" :span="4">
                          暂无店铺内照片
                        </el-col>
                        <el-col v-else :span="20">
                          <div class="img-border" v-for="photo in item.shopPhotos" :key="photo">
                            <img :src="item.doorheadPhoto" class="imgSize"/>
                          </div>
                        </el-col>
                    </el-row>
                    <el-row  type="flex" justify="space-between" class="paddtop20">
                        <el-col>营业执照照片：</el-col>
                        <el-col v-if="!item.businessLicense">暂无营业执照照片</el-col>
                        <el-col v-else>
                          <div class="img-border">
                            <img :src="item.businessLicense" class="imgSize"/>
                          </div>
                          </el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 40px">
                        <!-- <el-col>主推城市： 
                          <span v-for="code in item.mainCities" :key="code">{{getCitys(code.provinceCode, code.cityCode, code.districtCode)}}&nbsp;</span></el-col> -->
                          <el-col>主推城市：
                            <span>{{getCitys(merchantData.provinceCode, merchantData.cityCode, merchantData.districtCode)}}</span>
                          </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="paddtop20">
                        <el-col>合作推广优势：{{item.advantage}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>审核结果： {{getAuthStatus(item.firstAuthStatus)}}</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>其他信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class="paddtop20">
                        <el-col>邀请码： {{merchantData.inviteCode}}</el-col>
                        <el-col>商家加盟合同： 已同意</el-col>
                        <el-col>特别合约：  已同意</el-col>
                        <el-col>担保书：  已同意</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20">
              <div slot="header" class="clearfix">
                    <span>加盟商类型：</span>
                </div>
                <div class="pdddBoth">
                  <el-row class="paddtop20">
                      <el-col v-for=" type in merchantData.merchantTypes" :key="type">
                        {{getMerchantType(type)}}
                        <el-button type="primary" :size="$size" @click="goHostList" 
                        style="margin-left:20px" v-if="type === 'ZHUBO' || type === 'PARTNER'">
                          查看关联主播</el-button>
                      </el-col>
                  </el-row>
                  
                </div>
            </el-card>
            <div class="content">
              <el-button type="primary" @click="orderRecord">确定</el-button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  export default {
      name: "memerchantDetails",
      data() {
        return {
          id: '',
          merchantData: []
        }
      },
      created() {
        this.getMerchantDetails();
        this.getCitys();
      },
      methods: {
        orderRecord() {
          this.$router.push({path: "/merchants"});
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
          // let districts = new Map(JSON.parse(window.localStorage.getItem("xk-district"))).get(dCode).name; // 区县
          // let provinces = new Map(JSON.parse(window.localStorage.getItem("xk-province"))).get(pCode).name// 省
          // let citys = new Map(JSON.parse(window.localStorage.getItem("xk-city"))).get(cCode).name; // 市
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
          // return provinces + citys + districts;
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
        getMerchantType(val) {
          switch(val) {
            case "MERCHANT":
                return "商户";
            case "ZHUBO":
                return "主播";
            case "EXTENSION_WORKER":
                return "推广人员";
            case "PARTNER":
                return "合伙人";
            case "BROKERAGE_FIRM":
                return "经济公司"
          }
        },
        goHostList() { // 到关联主播页面
          this.$router.push({path: "/RelateHost"});
        },
        getMerchantDetails() { // 商户审核详情
          this.id = this.$route.query.merchantId;
          this.$http.get(this.$api.merchantDetail, {merchantId: this.id}, true)
          .then(res => {
              this.merchantData = res;
              console.log(this.merchantData)
          })
          .catch( err => {
              this.$message.error("获取店铺详情失败")
          })
        }
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
</style>
