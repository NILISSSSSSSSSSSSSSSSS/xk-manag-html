<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>推广人员审核详情
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
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>其他信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>主推城市：<span v-for="code in merchantAuditData.mainCities" :key="city">{{getCitys(code)}}&nbsp;</span></el-col>
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
                          <el-radio v-model="auditStatus" label="SUCCESS">通过</el-radio>
                          <el-radio v-model="auditStatus" label="FAILED">不通过</el-radio>
                          <el-radio v-model="auditStatus" label="SUBMIT">待审核</el-radio>
                        </el-col>
                        <el-col>
                          <el-input v-if="auditStatus != 'SUCCESS'" type="textarea" placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}" v-model="reason"></el-input>
                        </el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <div class="content">
              <el-button type="primary" @click="handleMerchantAudit">确定</el-button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  export default {
      name: "promotoAuditDetails",
      data() {
        return {
            auditStatus: "",
            merchantAuditData: [],
            loading: false,
            reason: ''
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
        getCitys(code) {
          let citys = JSON.parse(window.localStorage.getItem("xk-district"));
          let cityName = "";
          for(let city of citys) {
            if(city.code === code) {
              cityName = city.name;
              break;
            }
          }
          return cityName
        },
        getMerchantAuditDetails() {
          let id = this.$route.query.mAuthResultId;
          console.log(id);
          this.loading = true;
          this.$http.get(this.$api.mAuthDetail, {mAuthResultId: id}, true)
          .then(res => {
            this.merchantAuditData = res;
            this.auditStatus = res.firstAuthStatus;
            this.loading = false;
            console.log(this.merchantAuditData)
          })
          .catch(error => {
            this.loading = false;
            this.merchantAuditData = [];
            this.$message.error("获取详情失败")
          })
        },
        handleMerchantAudit() {
          let id = this.merchantAuditData.merchantId;
          let type= this.$route.query.merchantType;
          // console.log(id+type+"::"+this.auditStatus+this.reason)
          let paramlist = {
            merchantId: id,
            authStatus:this.auditStatus,
            merchantType: type,
            message: this.reason
          }
          console.log(paramlist)
          this.$http.post(this.$api.merchantFirstAuth, paramlist, true)
          .then(res => {
            this.$router.push({path: "/merchantAudit"});
          })
          .catch(err => {
            this.$message.error("提交失败");
            this.$router.push({path: "/merchantAudit"});
          })
        }
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
