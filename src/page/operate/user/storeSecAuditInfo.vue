<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>店铺详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <div class="pubpadd">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>详情信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between">
                        <el-col>店铺编号： {{storeDetails.detail.code}}</el-col>
                        <el-col>上级店铺：{{storeDetails.masterName}}</el-col>
                        <el-col>状态：{{getOnline(storeDetails.detail.onLine)}}</el-col>
                        <el-col>财务是否独立：{{storeDetails.isSelf == 0 ? "是": "否"}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <!-- <el-col>层级关系：{{storeDetails.masterName}}/{{storeDetails.detail.name}}</el-col> -->
                        <el-col>店铺分类：
                            <el-dropdown>
                            <span class="el-dropdown-link">
                                全部分类<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(code, index) in storeDetails.detail.industry" :key="index">
                                    {{getOnelevel(code.levelOneCode)}}/{{getTwolevel(code.levelTwoCode)}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                        <el-col>店铺名称：{{storeDetails.detail.name}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row  class=" paddtop20">
                        <!-- <el-col :span="6">管理员手机号： {{storeDetails.detail.adminPhone}}</el-col> -->
                        <el-col :span="6">店铺地址：{{storeDetails.detail.address}}</el-col>
                        <el-col :span="6" v-if="!storeDetails.detail.contactPhones || storeDetails.detail.contactPhones.length == 0">联系电话：暂无电话</el-col>
                        <el-col :span="6" v-else>联系电话：
                             <span v-for="(item, index) in storeDetails.detail.contactPhones" :key="index" style="margin-right: 10px">{{item}}</span>
                        </el-col>
                        <el-col :span="6">营业时间：{{storeDetails.detail.newBusinessTime.startAt}} - {{storeDetails.detail.newBusinessTime.endAt}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>人均消费： {{storeDetails.detail.avgConsumption / 100}}元</el-col>
                        <el-col>当前是否接单：{{storeDetails.detail.isBusiness == 1 ? "接单" : "不接单"}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺介绍： {{storeDetails.detail.description}}</el-col>
                    </el-row>
                    <el-row class=" paddtop20">
                        <el-col :span="2">店铺LOGO：</el-col>
                        <el-col :span="20"><img class="imgSize" :src="storeDetails.detail.logo"/></el-col>
                    </el-row>
                    <el-row  class="paddtop20">
                        <el-col :span="2">店铺图片： </el-col>
                        <el-col v-if="!storeDetails.detail.pictures || storeDetails.detail.pictures.length == 0">暂无店内图片</el-col>
                        <el-col :span="20" v-else>
                            <div class="img-border" v-for="(url, index) in storeDetails.detail.pictures" :key="index">
                                <img class="imgSize" :src="url" />
                            </div>
                        </el-col>
                    </el-row>
                     <el-row  class="paddtop20">
                        <el-col :span="2">店铺资质： </el-col>
                        <el-col v-if="!storeDetails.detail.qualifiedPictures  || storeDetails.detail.qualifiedPictures.length == 0">暂无店内图片</el-col>
                        <el-col :span="20" v-else>
                            <div class="img-border" v-for="img in storeDetails.detail.qualifiedPictures" :key="img">
                                <img class="imgSize" :src="img"/>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <!-- <div slot="header" class="clearfix">
                    <span>审核：</span>
                </div> -->
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between">
                        <el-col>审核结果：
                          <el-radio v-model="status" label="SUCCESS" disabled>通过</el-radio>
                          <el-radio v-model="status" label="FAILED" disabled>不通过</el-radio>
                          <el-radio v-model="status" label="SUBMIT" disabled>待审核</el-radio>
                        </el-col>
                        <el-col>
                          <el-input type="textarea" v-if="this.status === 'FAILED'" v-model='message'
                          placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}">
                          </el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20">
                <div class="paddBoth">
                    <el-row :gutter="10">
                        <el-col :span="2">抽成比例：</el-col>
                        <el-col :span="2">
                                <el-form>
                                    <!-- <el-input :size="$size" v-model="commission" disabled></el-input> -->
                                    {{commission}}%
                                </el-form>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <div class="content">
              <el-button type="primary" @click="storeSecAudit">确定</el-button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  export default {
      name: "storeAuditDetails",
      data() {
        return {
           status: "SUCCESS",
           storeDetails: {
               detail: {
                   newBusinessTime: {
                       startAt: '',
                       endAt: ''
                   },
                   pictures: [],
                   contactPhones: [],
                   industry: []
               }},
           message: '',
           commission: "",
           oneLevels: '', // 店铺一级分类
           twoLevels: ''  // 店铺二级分类
        }
      },
      created() {
          this.getStoreDetails();
          this.getIndustryList();
      },
      methods: {
        storeSecAudit() { // 返回店铺审核列表
        //   this.$router.push({path: "/storeSecAudit"});
        this.$router.go(-1);        },
        getOnline(val) { // 店铺状态
            switch(val) {
                case 0:
                    return "店铺已被商家下线";
                case 1:
                    return "上线";
                case -1:
                    return "违规,已下架";
                default:
                    return val;
            }
        },
        getIndustryList() { // 店铺行业分类
            let industrys = JSON.parse(window.localStorage.getItem("industryAllQList"));
            this.oneLevels = industrys.oneLevel;
            this.twoLevels = industrys.twoLevel;
            console.log(this.oneLevels);
            console.log(this.twoLevels);
        },
        getOnelevel(code) {
            let name = ''
            for(let one of this.oneLevels) {
                if(code == one.code) {
                    name = one.name;
                    break;
                }
            }
            return name;
        },
        getTwolevel(code) {
            let name = "";
            for(let two of this.twoLevels) {
                if(code == two.code) {
                    name = two.name;
                    break;
                }
            }
            return name;
        },
        getStoreDetails() { // 商铺详情
            let id = this.$route.query.id;
            this.$http.get(this.$api.mShopDetail, {id: id}, true)
            .then(res => {
                this.storeDetails = res;
                console.log(this.storeDetails)
               this.status = this.storeDetails.detail.secondAuthStatus;
               this.commission = res.commission;
            })
            .catch(err => {
                this.$message.error("获取店铺详情失败");
            })
        }
      }
  }
</script>

<style scoped>
.img-border {
    display: inline-block;
    margin-bottom: 20px;
    margin-right: 20px;
}
.imgSize {
  height: 120px;
}
.content {
  margin: 20px auto;
  text-align: center;
}
</style>
