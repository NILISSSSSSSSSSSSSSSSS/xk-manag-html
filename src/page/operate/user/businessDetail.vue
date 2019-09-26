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
        <el-card style="margin-bottom: 10px">
            <div>基本信息</div>
            <el-row class="info-class">
                <el-col>姓名： {{detailData.merchant.name}}</el-col>
                <el-col>手机号码： {{detailData.merchant.phone}}</el-col>
                <el-col>性别： {{detailData.merchant.sex === 'male' ? '男' : detailData.merchant.sex === 'female' ? '女' : '保密'}}</el-col>
                <el-col>身份证号码： {{detailData.merchant.idCardNo}}</el-col>
                <el-col>身份证正面： 
                    <img :src="detailData.merchant.frontOfIdCard" class="img-size">
                </el-col>
                <el-col>身份证反面： 
                    <img :src="detailData.merchant.backOfIdCard" class="img-size">
                </el-col>
                <!-- <el-col>手持身份证照片： 
                    <img :src="detailData.merchant.handIdCard" class="img-size">
                </el-col> -->
                <el-col>联盟商号：{{detailData.merchant.code}}</el-col>
                <el-col>联盟商名称：{{detailData.merchant.merchantName}}</el-col>
                <el-col>归属地区：{{getPorvinceInfo(detailData.merchant.districtCode)}}</el-col>
                <el-col>推荐人安全码： {{detailData.merchant.esCode}}</el-col>
                <el-col>安全码： {{detailData.securityCode}}</el-col>
                <el-col v-if="detailData.familySecurityCode">家族安全码：{{detailData.familySecurityCode}}</el-col>
            </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px">
          <el-row>
            <el-col :span="12">推荐情况</el-col>
            <el-col :span="12" style="text-align:right">
                <el-button :size="$size" type="primary" @click="goRecommend">查看推荐详情</el-button>
            </el-col>
          </el-row>
          <el-row class="info-class">
              <el-col>普通用户：{{detailData.recommendUser}}</el-col>
              <!-- <el-col>联盟商：{{detailData.recommendMerchant}}</el-col> -->
              <el-col>联盟商：{{detailData.recommendMerchant}}</el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 10px">
            <div>加盟商类型</div>
            <!-- <el-row class="info-class">
                <el-row v-for="(item, index) in this.merchantTypesData" :key="index">
                    <el-col style="margin-bottom: 20px" v-if="item.auditStatus === 'success'">
                        <span style="margin-right: 20px; ">{{getMerchantTypes(item.merchantType)}}</span>
                        <el-button :size="$size" type="primary" @click="merchantDetail(item.merchantType)">查看{{getMerchantTypes(item.merchantType)}}详情</el-button>
                    </el-col>
                </el-row>
            </el-row> -->
            <el-row>
                  <el-table stripe :data="this.merchantTypesData" style="margin-top: 10px;width:800px">
                      <el-table-column prop="merchantType" label="身份">
                          <template slot-scope="scope">
                              {{getMerchantTypes(scope.row.merchantType)}}
                          </template>
                      </el-table-column>
                      <el-table-column prop="createdAt" label="入驻时间">
                          <template slot-scope="scope">
                              {{scope.row.enterTime | formatTime}}
                          </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text" @click="merchantDetail(scope.row.merchantType)">查看详情</el-button>
                        </template>
                      </el-table-column>
                  </el-table>
                </el-row>
        </el-card>
        <el-card v-if="this.detailData.shops" style="margin-bottom: 10px">
            <div>店铺列表</div>
            <el-row style="line-height: 30px" v-for="(shop, index) in this.detailData.shops" :key="index">
               <el-col style="line-height: 50px; font-size: 14px;margin-left: 80px">
                   <span style="margin-right: 20px">店铺名称：{{shop.name}}</span>
                   <span style="margin-right: 20px">抽成比例：{{shop.ratio}}%</span>
                   <el-button :size="$size" type="primary" @click="goShopDetail(shop.id)">查看店铺详情</el-button>
               </el-col>
            </el-row>
        </el-card>
        <el-card>
            <div style="margin-bottom: 10px">分号列表</div>
            <el-table :data="branchData" v-loading="branchLoading">
            <el-table-column label="ID" prop="id" width="250px"></el-table-column>
            <el-table-column label="安全码" prop="securityCode"></el-table-column>
            <el-table-column label="联系人账号" prop="phone"></el-table-column>
            <el-table-column label="联系人姓名" prop="name"></el-table-column>
            <el-table-column label="分号创建时间">
              <template slot-scope="scope">
                {{scope.row.createdAt | formatTime}}
              </template>
            </el-table-column>
            <el-table-column label="是否主号">
              <template slot-scope="scope">
                {{scope.row.isAdmin == 1 ? '主号': '分号'}}
              </template>
            </el-table-column>
            <el-table-column label="归属身份" width="200px">
              <template slot-scope="scope">
                {{getMerchantTypes(scope.row.merchantType)}}
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="pageData.total" :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" @change="changePage"></pagination>
        </el-card>
        <div style="margin-top: 20px; text-align: center">
            <el-button :size="$size" type="plain" @click="goBack">返回</el-button>
            <el-button :size="$size" type="primary" @click="goBack">确定</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  import { getPorvinceInfo,enumFormatter } from "@/util/publicMehotds";
  import {MerchantTypes} from '@/util/publicParams'
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
          branchData: [],
          branchLoading: false,
          pageData: {
              total: 0,
              currentPage: 1,
              pageSize: 10
          }
        }
      },
      created() {
        this.getDetailData();
        // this.getBranchData();
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
            return enumFormatter(val, MerchantTypes, {value: 'label'})
        },
        business() {
          this.$router.push({path: "/business"});
        },
        goHostList() { // 到关联主播页面
          this.$router.push({path: "/hostList"});
        },
        getDetailData() { // 账号详情
        if(this.$route.query.typeSource === 'user') { // 会员详情里查看联盟商详情
            this.$http.get(this.$api.merchantDetailInUserList, {mrCode: this.$route.query.mrCode}, true)
            .then(res => {
                this.detailData = res
                console.log(res)
                this.merchantTypesData = this.detailData.merchant.identityStatuses
                this.getBranchData();
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        } else {
              this.$http.get(this.$api.merchantManagerDetail, {id: this.$route.query.id}, true)
                .then(res => {
                    this.detailData = res
                    this.merchantTypesData = this.detailData.merchant.identityStatuses
                    console.log('id', this.detailData.merchant.id)
                    this.getBranchData();
                    console.log(this.detailData)
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            }
        },
        merchantDetail(type) { // 账号的联盟商角色详情
            this.$router.push({path: '/merchantDetail', query: {type: type, id: this.detailData.merchant.id}})
        },
        goShopDetail(id) { // 店铺详情
            this.$router.push({path: '/storeSecAuditInfo', query:{id: id}})
        },
        getBranchData() { // 搜索分号数据
          let paramList = {
              page: this.pageData.currentPage,
              limit: this.pageData.pageSize,
              // merchantId: this.$route.query.id
              merchantId: this.detailData.merchant.id
          }
          this.branchLoading = true
          this.$http.get(this.$api.merchantSemicolonQPage, paramList, true)
          .then(res => {
              this.branchLoading = false
              if(res) {
                  console.log('res', res)
                  this.branchData = res.data ? res.data : []
                  this.pageData.total = res.total ? res.total : 0
              }
          })
          .catch(err => {
            this.branchLoading = false
            this.$message.error(err.message)
          })
      },
      changePage(page, limit) { // 分页请求
            // page:第几页, limit: 每页条数
            [this.pageData.currentPage, this.pageData.pageSize] = [page, limit];
            this.getBranchData();
          },
      goRecommend() { // 推荐详情列表
            this.$router.push({path: '/reconmmendDetail', query: {code: this.detailData.merchant.securityCode}})
        }
      },
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
