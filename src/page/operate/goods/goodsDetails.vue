<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>商品详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <div class="pubpadd">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>详情信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class="infoSize">
                        <el-col>商品编号： {{detailData.base.id}}</el-col>
                        <el-col>商品类型： {{codeToCategory(detailData.base.category.goodsTypeId)}}</el-col>
                        <el-col>店铺分类：{{getIndustry1(detailData.base.category.industryId1)}} -- {{getIndustry2(detailData.base.category.industryId2)}}</el-col>
                        <el-col>在架状态：{{getGoodsStatus(detailData.base.goodsStatus)}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize">
                        <el-col>商品名称：{{detailData.base.goodsName}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <!--住宿类特殊属性-->
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize" v-if="detailData.base.category.goodsTypeId == '1001'">
                        <el-col>是否可以0元下单：{{detailData.base.zeroOrder === 1 ? "是": "否"}}</el-col>
                        <el-col>是否可退：  {{getRefunds(detailData.base.refunds, detailData.base.refundsTime)}}</el-col>
                        <el-col>是否需要预约：{{detailData.base.reservation === 1 ? "是": "否"}}</el-col>
                        <el-col>定金功能：{{detailData.base.deposit == 1 ? "是" : "否"}}</el-col>
                    </el-row>
                    <!-- 住宿类特殊属性 -->
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize" v-if="detailData.base.category.goodsTypeId == '1003'">
                        <el-col>是否可退： {{getRefunds(detailData.base.refunds, detailData.base.refundsTime)}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <!-- 商品类特殊属性 -->
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize" v-if="detailData.base.category.goodsTypeId == '1002'">
                        <el-col>是否可加购商品： {{detailData.base.purchased === 1? '是' : '否'}}</el-col>
                        <el-col>是否需要预付费：{{detailData.base.zeroOrder === 1 ? "是": "否"}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <!-- 外卖类无特殊属性 -->
                    <el-row  class="paddtop20 infoSize">
                        <el-col :span="2">店铺图片： </el-col>
                        <el-col :span="20">
                          <span v-if="!detailData.base.mainPic">暂无封面图片</span>
                          <span v-else class="img-border"><img :src="detailData.base.mainPic" class="imgSize"/>（封面图片）</span>
                          <span v-if="!detailData.base.showPics ||detailData.base.showPics.length == 0">暂无店内图片</span>
                          <span v-else v-for="img of detailData.base.showPics" :key="img" class="img-border">
                              <img :src="img" class="imgSize"/>
                          </span>
                        </el-col>
                    </el-row>
                    <el-row class="paddtop20 infoSize">
                        <el-col :span="2">规格设置： </el-col>
                        <el-col :span="20">
                            <el-row v-for="attr of detailData.bcleGoodsSkuAttrs.attrList" :key="attr">
                                    <div v-for="attrSon of attr.attrValues" :key="attrSon" style="margin-bottom:10px">
                                        <span style="margin-right: 20px">{{attr.name}}</span>
                                        <!-- <span style="margin-right: 20px">{{attrSon.code}}</span> -->
                                        <span style="margin-right: 20px">{{attrSon.name}}</span>
                                    </div>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row class="paddtop20 infoSize">
                        <el-col :span="2">价格设置： </el-col>
                        <el-col :span="20">
                            <div v-for="goods of detailData.goodsSkuVOS" :key="goods" style="margin-bottom: 10px">
                                 <!-- <span style="margin-right: 20px">{{goods.skuCode}}</span> -->
                                 <span style="margin-right: 20px">{{goods.skuName}}</span>
                                 <span style="margin-right: 20px">市场价{{ $math.divide(goods.originalPrice, 100) }}元</span>
                                 <span style="margin-right: 20px">平台价{{ $math.divide(goods.discountPrice, 100) }}元</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize">
                        <el-col>商品介绍：{{detailData.base.details}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize">
                        <el-col>折扣类型：{{detailData.base.discountType === 'SHOP_DISCOUNT' ? '店铺' : '自定义'}}</el-col>
                        <el-col>折扣：{{ $math.divide(detailData.base.discount, 100) == 10 ? '无折扣' : $math.divide(detailData.base.discount, 100) + '折'}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20">
                <div slot="header" class="clearfix">
                    <span>店铺信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row class="infoSize">
                        <el-col>店铺名称： {{this.detailData.shop.shopName}}</el-col>
                        <el-col class="paddtop20">店铺编号： {{this.detailData.shop.shopCode}}</el-col>
                        <el-col class="paddtop20">店铺折扣： {{this.detailData.shop.shopDiscount}}折</el-col>
                        <el-col class="paddtop20">店铺店铺地址： {{this.detailData.shop.shopAddress}}</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20">
                <div slot="header" class="clearfix">
                    <span>商品审核：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" v-if="type === 'auth'" class="infoSize">
                        <el-col>审核结果：
                          <el-radio v-model="auditStatus" label="VERIFIED">通过</el-radio>
                          <el-radio v-model="auditStatus" label="UNAPPROVED">不通过</el-radio>
                          <!-- {{getAuthStatus(merchantAuditData.firstAuthStatus)}} -->
                        </el-col>
                        <el-col>
                          <el-input v-if="auditStatus === 'UNAPPROVED'" type="textarea" placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}" 
                          v-model="reason"></el-input>
                        </el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row v-else class="infoSize">
                        <el-col :span="4">审核结果：
                            <span :class="getStatusClass(detailData.base.auditStatus)">
                                {{getAuthStatus(detailData.base.auditStatus)}}
                            </span>
                        </el-col>
                        <el-col :span="6">
                          <el-input v-if="auditStatus === 'UNAPPROVED'" type="textarea" placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}" 
                          v-model="reason" disabled></el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <div class="content">
                  <el-button type="primary" @click="goBack">确定</el-button>
            </div>
          </div>
      </div>

  </div>
</template>
<script>
export default {
    name: "goodsDetails",
    data() {
      return {
        labelPosition: "right",
        searchForm: [],
        serviceCategory: [],
        detailData: { // 初始化默认信息
            base: {
                category: {
                    goodsTypeId: '',
                    goodsName: '',
                    reservation: '',
                    mainPic: '',
                    showPics: [],
                    details: '',
                    auditStatus: ''
                }
            },
            bcleGoodsSkuAttrs: {
               attrList:[]
            },
            goodsSkuVOS: [],
            shop: {}
        },
        auditStatus: "",
        reason: "",
        type: "",
        userId: ''
      }
    },
    created() {
        this.getServiceCategory();
        this.getDetail();
        // this.getUserId();
    },
    methods: {
        getServiceCategory() { //服务分类
            this.$http.get(this.$api.serviceCatalogList, {}, true)
            .then(res => {
                this.serviceCategory = res
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        codeToCategory(val) {
            let categoryName = ''
            for(let category of this.serviceCategory) {
                if(val == category.code) {
                    categoryName = category.name;
                    break;
                }
            }
            return categoryName;
        },
        getIndustry1(val) { // 行业一级分裂
            let industryIds = JSON.parse(window.localStorage.getItem("industryAllQList"));
            let name= '';
            for(let item of industryIds.oneLevel) {
                if(val == item.code) {
                    name = item.name;
                    break;
                }
            }
            return name;
        },
        getIndustry2(val) { // 行业二级分类
            let name = ''
            let industryIds = JSON.parse(window.localStorage.getItem("industryAllQList"));
            for(let item of industryIds.twoLevel) {
                if(val == item.code) {
                    name = item.name;
                    break;
                }
            }
            return name;
        },
        getGoodsStatus(val) { // 商品上下架状态
            switch(val) {
                case "UP":
                return '上架';
                case "DOWN":
                return '下架';
                case "SYS_DOWN":
                return '系统下架';
            }
      },
        getAuthStatus(val) {
          switch(val) {
            case "VERIFIED":
              return '已审核';
            case "UNAUDITED":
              return '待审核';
            case "UNAPPROVED":
              return '未通过';
          }
      },
       getStatusClass(val) {
          switch(val) {
            case "VERIFIED":
              return 'success';
            case "UNAUDITED":
              return 'warning';
            case "UNAPPROVED":
              return 'danger';
          }
      },
      getRefunds(val, time) {
          let min = time/60;
          switch(val) {
              case "CONSUME_BEFORE":
                return "消费前可退";
              case "RESERVATION_BEFORE_BYTIME":
                return "预约规定前"+ min +"分钟可退";
              case "RESERVATION_BEFORE":
                return "预约前随时可退";
              case "NOT_REFUNDS":
                return "不能退";
          }
      },
    //   getUserId() {
    //       this.userId = window.sessionStorage.getItem("xk-user");
    //       console.log(this.userId)
    //   },
        getDetail() { //获取详情
            let id= this.$route.query.goodsId;
            let shopId = this.$route.query.shopId;
            this.type = this.$route.query.type;
            this.$http.get(this.$api.shopDBOGoodsDetail, {id: id, shopId: shopId}, true)
            .then(res => {
                this.detailData = res
                this.auditStatus = res.base.auditStatus
                this.reason = res.base.message
                console.log(res)
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        goBack() { // 详情确认返回，审核确认先审核再返回
            if(this.type === "auth") {
                let paramList = {
                    goodsId: this.detailData.base.id,
                    auditStatus: this.auditStatus,
                    message: this.reason
                }
                console.log(paramList)
                if(this.auditStatus === 'VERIFIED' || this.auditStatus === 'UNAPPROVED') {
                    this.$http.get(this.$api.shopDBOGoodsUpdateByAudit, {auditDTO: paramList}, true)
                        .then(res => {
                            this.$message.success("审核完成");
                            this.$router.go(-1);
                        })
                        .catch(err => {
                            this.$message.error(err.message);
                        })
                    } else {
                        this.$message.warning("请先选择审核状态");  
                    }
            } else {
                this.$router.go(-1);
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.img-border {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
}
.imgSize {
  height: 100px;
  vertical-align: top
}
.content {
  margin: 20px auto;
  text-align: center;
}
.danger {
  color: #F58C8C;
}
.warning {
  color:#E8A23C;
}
.success {
 color: #87C23A;
}
.infoSize {
    font-size: 14px;
}
</style>
