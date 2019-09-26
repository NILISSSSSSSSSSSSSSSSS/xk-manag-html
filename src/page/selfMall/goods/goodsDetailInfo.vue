<template>
    <div class="xk-container goods-detail-info" v-loading="loadingDetail">
        <div class="xk-body xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>商品基本信息
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class="list">
                <div class="label-txt">商品分成类型：</div>
                <div class="label-content">{{ goods.base.goodsDivide == '1'? '普通商品': '大宗商品' }}</div>
            </div>
            <div class="list">
                <div class="label-txt">商品类型：</div>
                <div class="label-content">{{ goods.base.type === 'NEW'? '全新': '二手' }}</div>
            </div>
            <div class="list">
                <div class="label-txt">商品标题：</div>
                <div class="label-content">{{ goods.base.name }}</div>
            </div>
            <div class="list">
                <div class="label-txt">商品分类：</div>
                <div class="label-content">{{ goods.base.categories | formatterCat }}</div>
            </div>
            <div class="list">
                <div class="label-txt">商品品牌：</div>
                <div class="label-content">{{ goods.brand }}</div>
            </div>
            
            <div class="list" v-if="goods.base.showPicUrl.length">
                <div class="label-txt">商品图片：</div>
                <div class="label-content">
                    <image-list v-for="(item,index) in goods.base.showPicUrl" :key="index" :url="item"></image-list>
                </div>
            </div>
            <div class="list">
                <div class="label-txt">主图视频：</div>
                <div class="label-content">
                    <template v-if="goods.base.showVideoUrl">
                        <image-list :url="goods.base.showVideoUrl" type="video" :videoUrl="goods.base.showVideoUrl"></image-list>
                    </template>
                    <template v-else>无</template>
                </div>
            </div>
            <div class="list">
                <div class="label-txt">商品供应商：</div>
                <div class="label-content">{{ goods.base.supplierName || '无' }}</div>
            </div>
            <div class="list">
                <div class="label-txt">直营店利润分润比例：</div>
                <div class="label-content">{{ goods.base.ratio? goods.base.ratio: 0 }}%</div>
            </div>
            
            <div class="list">
                <div class="label-txt">商品服务：</div>
                <div class="label-content">
                    <template v-if="goods.base.goodsServiceIds&&goods.base.goodsServiceIds.length">
                        <el-tag style="margin-right: 5px" v-for="(item, index) in goods.base.goodsServiceIds" :key="index">
                            {{ item | formatService }}
                        </el-tag>
                    </template>
                    <template v-else>无</template>
                </div>
            </div>
            <!-- 大宗商品没有运费信息 -->
            <div class="list" v-if="goods.base.goodsDivide!=2">
                <div class="label-txt">运费设置：</div>
                <div class="label-content">
                    <template v-if="goods.base.isFreeShipping ===1">包邮</template>
                    <template v-else>
                        {{ goods.base.carriage | formatTrance }}
                    </template>
                </div>
            </div>
            <div class="list">
                <div class="label-txt">库存计数：</div>
                <div class="label-content">{{ goods.base.reduceStock==1? '是': '否' }}</div>
            </div>
            <div class="list">
                <div class="label-txt">推广模板：</div>
                <div class="label-content">
                    <template v-if="goods.promotionTemplates.length">
                        <el-button 
                            :size="$size" 
                            type="primary" 
                            v-for="item in goods.promotionTemplates" 
                            :key="item.id" 
                            @click="fnViewTemplate(item.h5Url, item)">
                                {{ item.name }}
                        </el-button>
                    </template>
                    <template v-else>无</template>
                </div>
            </div>
            <div class="list">
                <div class="label-txt">上架状态：</div>
                <div class="label-content">上架中</div>
            </div>
            <div class="list">
                <div class="label-txt">商品来源：</div>
                <div class="label-content">{{ goods.base.overSeas==1? '海淘优选': '无' }}</div>
            </div>
            
            <div class="list marginbottom20" v-if="goods.goodsAttrs.attrList.length">
                <div class="label-txt">商品属性：</div>
                <div class="label-content">
                    <div class="attr-content">
                        <el-card style="width: 70%" v-for="(item,index) in goods.goodsAttrs.attrList" :key="index">
                            <div slot="header">{{ item.name }}</div>
                            <div class="attr-list" v-for="(_item, _index) in item.columns" :key="_index">
                                <div class="list">
                                    <div class="label-txt label-txt-120">{{  _item.name }}：</div>
                                    <div class="label-content" style="margin-left: 120px">{{ _item.value }}</div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
            <div class="list">
                <div class="label-txt">规格设置：</div>
                <div class="label-content">
                    <el-card style="width: 70%">
                        <table width="100%" border="0" cellspacing="0">
                            <thead>
                                <tr class="body-title">
                                    <template v-if="goods.skuAttr.attrList.length">
                                        <th v-for="(item,index) in goods.skuAttr.attrList" :key="index">{{ item.name }}</th>
                                    </template>
                                    <template v-if="goods.base.goodsDivide==2">
                                        <th>批发预约金（元）</th>
                                        <th>精选预约金（元）</th>
                                    </template>
                                    <th>零售价格（元）</th>
                                    <th>批发价格（元）</th>
                                    <th>原价（元）</th>
                                    <th>进价价格（元）</th>
                                    <th>重量（g）</th>
                                    <th>商品图片</th>
                                    <th>默认展示</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in goods.skuAttrValue" :key="index" class="tr">
                                    <td v-for="(_item, _index) in item.code.split('|')" :key="_index">{{ _item | skuAttrToName }}</td>
                                    <template v-if="goods.base.goodsDivide==2">
                                        <td>{{ $math.divide(item.b2bSubscription, 100) }}</td>
                                        <td>{{ $math.divide(item.b2cSubscription, 100) }}</td>
                                    </template>
                                    <td>{{ $math.divide(item.b2cPrice, 100) }}</td>
                                    <td>{{ $math.divide(item.b2bPrice, 100) }}</td>
                                    <td>{{ $math.divide(item.price, 100) }}</td>
                                    <td>{{ $math.divide(item.costPrice, 100) }}</td>
                                    <td>{{ item.weight }}</td>
                                    <td>
                                        <image-list class="tr-img-list" :size="{width: '40px', height: '40px'}" :url="item.skuUrl"></image-list>
                                    </td>
                                    <td>{{ item.isDefault===1? '勾选': '未勾选' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </el-card>
                </div>
            </div>
            

            
            <div class="list margintop20">
                <div class="label-txt">商品详情：</div>
                <div class="label-content">
                    <div class="goods-detail-box">
                        <div class="goods-detail" v-html="goods.base.detail"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="xk-body xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>销售分成信息
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class="list">
                <div class="label-txt">精选商城销售奖励设置：</div>
                <div class="label-content">
                    <div style="width: 70%">
                        <sale-detail :detail="b2c"></sale-detail>
                    </div>
                </div>
            </div>

            <div class="list">
                <div class="label-txt">批发商城销售奖励设置：</div>
                <div class="label-content">
                    <div style="width: 70%">
                        <sale-detail :detail="b2b" :type="false"></sale-detail>
                    </div>
                </div>
            </div>

            <div class="list">
                <div class="label-txt">精选商城货源奖励：</div>
                <div class="label-content">
                    <div style="width: 70%">
                        <source-detail :detail="b2c_resource"></source-detail>
                    </div>
                </div>
            </div>

            <div class="list">
                <div class="label-txt">批发商城货源奖励：</div>
                <div class="label-content">
                    <div style="width: 70%">
                        <source-detail :detail="b2b_resource"></source-detail>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-group">
            <el-button v-if="!origin" :size="$size" type="primary" @click="edit()">编辑</el-button>
            <el-button :size="$size" type="info" @click="$router.go(-1)">返回上一页</el-button>
        </div>

        <!-- 预览推广模板 -->
        <el-dialog title="预览推广模板" :visible.sync="previewSpredTemplateVisible" width="415px" append-to-body>
            <div class="iframWebPage">
                <iframe v-if="spredTemplateUrl.url" :src="spredTemplateUrl.url" frameborder="0"></iframe>
                <div class="h5-prview" v-else v-html="spredTemplateUrl.text"></div>
            </div>
        </el-dialog>
        <down-goods-tips :visible.sync="tipsVisible" :goodsData="goodsData"></down-goods-tips>
    </div>
</template>

<script>
    import ImageList from '@/components/common/ImageList.vue';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import SaleDetail from '@/components/goods/SaleDetail.vue';
    import SourceDetail from '@/components/goods/SourceDetail.vue';
    import DownGoodsTips from '@/components/goods/DownGoodsTips.vue';

    let goodsServiceList = [];   //存商品服务的枚举
    let skuAttrEnum = [];        //存商品规格的枚举
    let template = [];          //运费模板
    let options = [];     //商品分类
    export default {
        components: {
            ImageList,
            SaleDetail,
            SourceDetail,
            DownGoodsTips
        },
        data() {
            return {
                loadingDetail: false,
                goods: {
                    base: {
                        showPicUrl: [],        //商品图片
                        goodsServiceIds: [],  //商品服务
                    },
                    promotionTemplates: [],       //推广模板
                    goodsAttrs: {
                        attrList: []
                    },   //商品属性
                    skuAttr: {        //商品规格
                        attrList: []
                    },
                    skuAttrValue: []      //商品规格的值
                },
                b2b: {    //批发商城
                    tax: {},           //税金
                    regionAdmin: {},        //维护收益门槛
                    mothSale: {},               //月销售额奖励
                    singleBatch: {},          //单词批量奖励
                    saleSubsidyTempList: []      //临时补贴
                },
                b2c: {      //精选商城
                    tax: {},           //税金
                    sale: {},         //单笔销售奖励
                    mothSale: {},               //月销售额奖励
                    singleBatch: {},          //单词批量奖励
                    saleSubsidyTempList: []      //临时补贴
                },
                b2b_resource: {
                    //批发商城
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                },
                b2c_resource: {
                    //精选商城
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                },
                previewSpredTemplateVisible: false,
                spredTemplateUrl: {},
                origin: '',   //从哪里跳转来的
                tipsVisible: false,
                goodsData: []    //绑定了单品优惠券的商品
            }
        },
        async created() {
            this.origin = this.$route.query.origin;
            this.loadingDetail = true;
            await this.goodsServicesList();   //获取商品服务
            await this.getPostfeeQPage();    //获取运费模板
            await this.getQueryList();   //获取商品分类
            this.getGoodsDetail();
        },
        methods: {
            //获取商品分类
            getQueryList() {
                 return new Promise((resolve) => {
                    this.$http.get(this.$api.queryList, {}, true).then(res=> {
                        options = this.flatten(res);
                        resolve(true);
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        this.loadingDetail = false;
                        resolve(true);
                    })
                })
            },
            flatten(arr){
                var res = [];
                for(var i=0;i<arr.length;i++){
                    if(Array.isArray(arr[i].children)){
                        res = res.concat(this.flatten(arr[i].children));
                    }else{
                        res.push(arr[i]);
                    }
                }
                return res;
            },
            //获取商品详情
            getGoodsDetail() {
                this.$http
                .get(this.$api.goodsDetail, {id: this.$route.query.id}, true)
                .then(res => {
                    this.loadingDetail =false;
                    console.log(res)
                    skuAttrEnum = [];
                    for(let i=0, len = res.goods.skuAttr.attrList.length ; i< len; i++) {
                        for(let j=0, lenJ = res.goods.skuAttr.attrList[i].attrValues.length; j<lenJ ;j++){
                            skuAttrEnum.push(res.goods.skuAttr.attrList[i].attrValues[j])
                        }
                    }
                    this.goods = res.goods;
                    if(res.drawout) {
                        this.b2b = this.fnHandleDrawout(res.drawout.b2b, 'b2b');
                        this.b2c = this.fnHandleDrawout(res.drawout.b2c, 'b2c');

                        this.b2b_resource = {
                            sourceOfGoods: res.drawout.b2b&&res.drawout.b2b.sourceOfGoods?res.drawout.b2b.sourceOfGoods: {},
                            sourceOfGoodsMonthSaleSubsidy: res.drawout.b2b&&res.drawout.b2b.sourceOfGoodsMonthSaleSubsidy?res.drawout.b2b.sourceOfGoodsMonthSaleSubsidy: {}
                        };
                        this.b2c_resource = {
                            sourceOfGoods: res.drawout.b2c&&res.drawout.b2c.sourceOfGoods?res.drawout.b2c.sourceOfGoods: {},
                            sourceOfGoodsMonthSaleSubsidy: res.drawout.b2c&&res.drawout.b2c.sourceOfGoodsMonthSaleSubsidy?res.drawout.b2c.sourceOfGoodsMonthSaleSubsidy: {}
                        };
                    }
                })
                .catch(err=>{
                    this.loadingDetail =false;
                    this.$message.error(err.message);
                })
            },
            //获取服务详情
            goodsServicesList() {
                return new Promise((resolve) => {
                    this.$http
                    .get(this.$api.sgoodsServices, {}, true)
                    .then(res=>{
                        goodsServiceList = res;
                        resolve(true)
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        this.loadingDetail = false;
                        resolve(true)
                    })
                })
            },
            //获取运费模板
            getPostfeeQPage() {
                return new Promise(resolve => {
                    this.$http.get(this.$api.postfeeQList, {limit: 100,page: 1}, true).then(res => {
                        template = res.templates;
                        resolve(true);
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        this.loadingDetail = false;
                        resolve(true);
                    })
                })
                
            },
            fnHandleDrawout(drawout, type) {
                if(drawout===null|| drawout==="" || drawout===undefined) {
                    drawout = {};
                }
                let obj = {
                    mothSale: drawout.mothSale? drawout.mothSale: {},
                    sale: drawout.sale? drawout.sale: {},
                    saleSubsidyTempList: drawout.saleSubsidyTempList? drawout.saleSubsidyTempList: [{
                            areaCodes: '',
                            buyerRatio: '',
                            areaAdminRatio: '',
                            areaAdminCurrency: '',
                            buyerCurrency: ''
                        }],
                    singleBatch: drawout.singleBatch? drawout.singleBatch: {},
                    tax: drawout.tax? drawout.tax: {}
                }
                if(type==='b2b') {
                    obj.regionAdmin = drawout.regionAdmin? drawout.regionAdmin: {}
                }else{
                    obj.sale = drawout.sale? drawout.sale: {}
                }

                return obj;
            },
            //预览推广模板
            fnViewTemplate(url, item) {
                if(url){
                    this.previewSpredTemplateVisible = true
                    this.spredTemplateUrl = {
                        url: url,
                        text: ''
                    } 
                } else{
                    this.previewSpredTemplateVisible = true;
                    this.spredTemplateUrl = {
                        url: "",
                        text: item.info
                    }
                }
            },
            //编辑彩票
            edit() {
                this.$confirm('销售中的商品需要该商品下架，才可以进行编辑, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$api.unshelveGoods, {
                        ids: [this.$route.query.id]
                    }, true).then(res=> {
                        if(res.success) {
                            this.$router.push({
                                path: 'goodsInfo',
                                query: {
                                    id: this.$route.query.id
                                }
                            })
                        }else{
                            this.goodsData = res.data;
                            this.tipsVisible = true;
                        }
                        
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
        },
        filters: {
            formatService(val) {
                return enumFormatter(val, goodsServiceList, {key: 'id', value: 'name'})
            },
            skuAttrToName(val){
                return enumFormatter(val, skuAttrEnum, {key: 'code', value: 'name'});
            },
            formatTrance(val) {
                return enumFormatter(val, template, {key: 'id', value: 'name'})
            },
            formatterCat(row) {
                if(row){
                    let code = row.cc_thr?row.cc_thr:row.cc_sec?row.cc_sec:row.cc_fri;
                    return enumFormatter(code, options, {key: 'code', value: 'name'});
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .goods-detail-info {
        .list {
            color: #606266;
            font-size: 14px;
        }
        /deep/ .el-card {
            margin-bottom: 10px;
            >>> .el-card__header {
                padding: 0 20px;
            }
        }
        .label-txt {
            text-align: right;
            padding: 0 12px 0 0;
            float: left;
            width: 180px;
            line-height: 40px;
        }
        .label-txt-120 {
            width: 150px;
        }
        .label-content {
            line-height: 40px;
            margin-left: 180px;
        }
        table {
            text-align: center;
            td {
                padding: 10px 0;
            }
        }
        
        .body-title {
            th{
                border-bottom: 1px solid #d4d4d4;
            }
        }
        .tr{
            td{
                border-bottom: 1px solid #d4d4d4;
            }
            &:last-child {
                td{
                    border-bottom: none;
                }
            }
        }
        .goods-detail-box {
            width: 70%;
            height: 450px;
            overflow: hidden;
            border: 1px solid #d4d4d4;
            margin-bottom: 15px;
            padding: 15px;
            box-sizing: border-box;
            box-shadow: 2px 2px 5px #d3d6da;
            .goods-detail {
                height: 100%;
                overflow: auto;
                img{
                    max-width: 100%
                }
            }
        }
    }
    .iframWebPage {
        height: 655px;
        overflow: auto;
        iframe {
            width: 375px;
            height: 667px;
        }
    }
</style>
<style lang="scss">
    .goods-detail-info {
        .goods-detail-box {
            .goods-detail {
                img{
                    max-width: 100%
                }
            }
        }
    }
</style>