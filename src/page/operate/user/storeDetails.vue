<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>店铺审核详情
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
                        <el-col>财务是否独立：{{storeDetails.isSelf === "0" ? "是": "否"}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <!-- <el-col>层级关系：{{storeDetails.masterName}}/{{storeDetails.detail.name}}</el-col> -->
                        <el-col>店铺分类：
                            <el-dropdown>
                            <span class="el-dropdown-link">
                                全部分类<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="code in storeDetails.detail.industry" :key="code">
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
                        <el-col :span="6">管理员手机号： {{storeDetails.detail.adminPhone}}</el-col>
                        <el-col :span="6">店铺地址：{{storeDetails.detail.address}}</el-col>
                        <el-col :span="6" v-if="!storeDetails.detail.contactPhones || storeDetails.detail.contactPhones.length == 0">
                            联系电话：暂无电话</el-col>
                        <el-col :span="6" v-else>联系电话：
                             <span v-for="item in storeDetails.detail.contactPhones" :key="item" style="margin-right: 10px">{{item}}</span>
                        </el-col>
                        <el-col :span="2">营业时间：</el-col>
                        <el-col :span="4" v-if="JSON.stringify(storeDetails.detail.businessTime) == '{}'">暂无营业时间</el-col>
                        <!-- <el-col v-if="!storeDetails.detail.businessTime"> -->
                        <!-- <el-col v-else>营业时间：星期一 8: 00-20:00 其他时间不营业</el-col> -->
                        <el-col v-else :span="4">
                            <div v-if="storeDetails.detail.businessTime.mon">星期一: 
                                {{storeDetails.detail.businessTime.mon.startAt}}-{{storeDetails.detail.businessTime.mon.endAt}}
                            </div>
                            <div v-if="storeDetails.detail.businessTime.tue">星期二: 
                                {{storeDetails.detail.businessTime.tue.startAt}}-{{storeDetails.detail.businessTime.tue.endAt}}
                            </div>
                            <div v-if="storeDetails.detail.businessTime.wed">星期三: 
                                {{storeDetails.detail.businessTime.wed.startAt}}-{{storeDetails.detail.businessTime.wed.endAt}}
                            </div>
                            <div v-if="storeDetails.detail.businessTime.thu">星期四: 
                                {{storeDetails.detail.businessTime.thu.startAt}}-{{storeDetails.detail.businessTime.thu.endAt}}
                            </div>
                            <div v-if="storeDetails.detail.businessTime.fri">星期五: 
                                {{storeDetails.detail.businessTime.fri.startAt}}-{{storeDetails.detail.businessTime.fri.endAt}}
                            </div>
                            <div v-if="storeDetails.detail.businessTime.sat">星期六: 
                                {{storeDetails.detail.businessTime.sat.startAt}}-{{storeDetails.detail.businessTime.sat.endAt}}
                            </div>
                            <div v-if="storeDetails.detail.businessTime.sun">星期天: 
                                {{storeDetails.detail.businessTime.sun.startAt}}-{{storeDetails.detail.businessTime.sun.endAt}}
                            </div>
                            <div>其他时间不营业</div>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>人均消费： {{storeDetails.detail.avgConsumption}}元</el-col>
                        <el-col>当前是否接单：{{storeDetails.detail.isBusiness === "1" ? "接单" : "不接单"}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺介绍： {{storeDetails.detail.description}}</el-col>
                    </el-row>
                    <el-row  class="paddtop20">
                        <el-col :span="4">店铺图片： </el-col>
                        <el-col v-if="storeDetails.detail.pictures === null ||storeDetails.detail.pictures === undefined || storeDetails.detail.pictures.length == 0">暂无店内图片</el-col>
                        <el-col :span="20" v-else>
                            <div class="img-border" v-for="img in storeDetails.detail.pictures" :key="img">
                                <img class="imgSize" :src="img"/>
                            </div>
                        </el-col>
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
                          <!-- <el-radio v-model="status" label="SUCCESS">通过</el-radio>
                          <el-radio v-model="status" label="FAILED">不通过</el-radio> -->
                          {{getAuthStatus(storeDetails.detail.firstAuthStatus)}}
                        </el-col>
                        <!-- <el-col>
                          <el-input type="textarea" v-if="this.status === 'FAILED'" v-model='message'
                          placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}">
                          </el-input>
                        </el-col> -->
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20">
                <div slot="header" class="clearfix">
                    <span>抽成比例：</span>
                </div>
                <div class="paddBoth">
                    <el-row :gutter="10">
                        <el-col :span="2">抽成比例：</el-col>
                        <!-- <el-col :span="2">
                                <el-form>
                                    <el-input :size="$size" v-model="commission" disabled></el-input>
                                </el-form>
                        </el-col> -->
                        <el-col :span="2" v-if="!commission">未设置</el-col>
                        <el-col :span="2" v-else>{{this.commission}}%</el-col>
                    </el-row>
                </div>
            </el-card>
            <div class="content">
              <el-button type="primary" @click="storeAudit">确定</el-button>
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
           status: "",
           storeDetails: {
               detail: {
                   businessTime: {
                       mon: {},
                       tue: {},
                       wed: {},
                       thu: {},
                       fri: {},
                       sat: {},
                       sun: {}
                   }
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
        merchantsList() { // 返回店铺审核列表
          this.$router.push({path: "/storeAudit"});
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
        getStoreDetails() { // 获取审核详情
            let id = this.$route.query.id;
            this.$http.get(this.$api.mShopDetail, {id: id}, true)
            .then(res => {
                this.storeDetails = res;
                console.log(this.storeDetails)
               this.status = this.storeDetails.detail.firstAuthStatus;
               this.commission = res.commission;
            })
            .catch(err => {
                this.$message.error("获取店铺详情失败");
            })
        },
        storeAudit() {
            this.$router.push({path: "/storeAudit"});
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
