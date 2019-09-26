<template>
    <div class="virtual-sh-evaluate-detail xk-container">
        <div class="xk-radius xk-search">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>商品信息
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class="infoSize">
                        <el-col>商品编号： {{detail.id}}</el-col>
                        <el-col>商品类型： {{codeToCategory(detail.category.goodsTypeId)}}</el-col>
                        <el-col>店铺分类：{{getIndustry1(detail.category.industryId1)}} -- {{getIndustry2(detail.category.industryId2)}}</el-col>
                        <el-col>在架状态：{{getGoodsStatus(detail.goodsStatus)}}</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize">
                        <el-col>商品名称：{{detail.goodsName}}</el-col>
                        <el-col>店铺名称：{{ detail.shopName }}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <!--住宿类特殊属性-->
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize" v-if="detail.category.goodsTypeId == '1001'">
                        <el-col>是否可以0元下单：{{detail.zeroOrder === 1 ? "是": "否"}}</el-col>
                        <el-col>是否可退：  {{getRefunds(detail.refunds, detail.refundsTime)}}</el-col>
                        <el-col>是否需要预约：{{detail.reservation === 1 ? "是": "否"}}</el-col>
                        <el-col>定金功能：{{detail.deposit == 1 ? "是" : "否"}}</el-col>
                    </el-row>
                    <!-- 住宿类特殊属性 -->
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize" v-if="detail.category.goodsTypeId == '1003'">
                        <el-col>是否可退： {{getRefunds(detail.refunds, detail.refundsTime)}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <!-- 商品类特殊属性 -->
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize" v-if="detail.category.goodsTypeId == '1002'">
                        <el-col>是否可加购商品： {{detail.purchased === 1? '是' : '否'}}</el-col>
                        <el-col>是否需要预付费：{{detail.zeroOrder === 1 ? "是": "否"}}</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <!-- 外卖类无特殊属性 -->
                    <el-row  class="paddtop20 infoSize">
                        <el-col :span="2">店铺图片： </el-col>
                        <el-col :span="20">
                          <span v-if="!detail.mainPic">暂无封面图片</span>
                          <span v-else class="img-border"><img :src="detail.mainPic" class="imgSize"/>（封面图片）</span>
                          <span v-if="!detail.showPics || !detail.showPics.length">暂无店内图片</span>
                          <span v-else v-for="img in detail.showPics" :key="img" class="img-border">
                              <img :src="img" class="imgSize"/>
                          </span>
                        </el-col>
                    </el-row>
                    <el-row class="paddtop20 infoSize">
                        <el-col :span="2">规格设置： </el-col>
                        <el-col :span="20">
                            <template v-if="bcleGoodsSkuAttrs.attrList">
                                <el-row v-for="attr in bcleGoodsSkuAttrs.attrList" :key="attr">
                                    <template v-if="attr.attrValues">
                                        <div v-for="attrSon in attr.attrValues" :key="attrSon" style="margin-bottom:10px">
                                            <span style="margin-right: 20px">{{attr.name}}</span>
                                            <span style="margin-right: 20px">{{attrSon.name}}</span>
                                        </div>
                                    </template>
                                </el-row>
                            </template>
                        </el-col>
                    </el-row>
                    <el-row class="paddtop20 infoSize">
                        <el-col :span="2">价格设置： </el-col>
                        <el-col :span="20">
                            <div v-for="goods in goodsSkuVOS" :key="goods" style="margin-bottom: 10px">
                                 <span style="margin-right: 20px">{{ goods.skuName }}</span>
                                 <span style="margin-right: 20px">市场价{{ $math.divide(goods.originalPrice, 100) }}元</span>
                                 <span style="margin-right: 20px">平台价{{ $math.divide(goods.discountPrice, 100) }}元</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="paddtop20 infoSize">
                        <el-col>商品介绍：{{detail.details}}</el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="xk-radius marintop20">
            <virtual-evaluate-detail type="shop" :goodsId="goodsId" :shopId="shopId"></virtual-evaluate-detail>
        </div>
    </div>
</template>

<script>
    import VirtualEvaluateDetail from '@/components/goods/VirtualEvaluateDetail.vue';
    export default {
        components: {
            VirtualEvaluateDetail
        },
        created() {
            this.shopId = this.$route.query.shopId;
            this.goodsId = this.$route.query.goodsId;
            this.getServiceCategory();
            this.getGoodsDetail();
        },
        data() {
            return {
                goodsId: '',
                shopId: "",  //店铺ID
                detail: {
                    category: {}
                },
                serviceCategory: [],
                bcleGoodsSkuAttrs: {},
                goodsSkuVOS: {}
            }
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
            getGoodsDetail() {
                this.$http.get(this.$api.shopDBOGoodsDetail, {
                    id: this.goodsId,
                    shopId: this.shopId
                }, true)
                .then(res=>{
                    this.detail =res.base;
                    this.bcleGoodsSkuAttrs = res.bcleGoodsSkuAttrs;
                    this.goodsSkuVOS = res.goodsSkuVOS;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.$http.get(this.$api.QPageInBCircle, params , true)
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .virtual-sh-evaluate-detail {
        /deep/ .el-row{
            font-size: 14px;
            color: #666;
            /deep/ .el-col {
                margin-bottom: 15px;
            }
        }
        .imgSize {
            width: 150px;
            height: auto;
        }
    }
</style>
