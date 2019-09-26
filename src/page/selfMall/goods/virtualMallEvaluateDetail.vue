<template>
    <div class="virtual-mall-evaluate-detail xk-container">
        <div class="xk-radius xk-search">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>基本信息
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
                <el-row>
                    <el-col :span="8">商品ID：{{ detail.id }}</el-col>
                    <el-col :span="8">商品类型：{{ detail.type=='NEW'? '全新': '二手' }}</el-col>
                    <el-col :span="8">商品分类：{{ detail.categories | formatCat }}</el-col>
                    <el-col :span="8">奖品品牌：{{ detail.brandName }}</el-col>
                    <el-col :span="8">邮寄方式：{{ detail.isFreeShipping==1? '': '不' }}包邮</el-col>
                    <el-col :span="24">商品标题：{{ detail.name }}</el-col>
                    <el-col :span="8">商品供应商：{{ detail.supplierId | formatSupplier }}</el-col>
                    <el-col :span="24">商品图片：</el-col>
                    <el-col :span="24" class="img-box">
                        <template v-if="detail.showPicUrl">
                            <image-list v-for="(value,index) in detail.showPicUrl" :key="index" :url="value"></image-list>
                        </template>
                    </el-col>
                    <el-col :span="24">商品服务：
                        <template v-if="detail.goodsServiceIds">
                            <span v-for="(item,index) in detail.goodsServiceIds" :key="item">
                                {{ item | formatService }}<template v-if="index!==detail.goodsServiceIds.length-1">，</template>
                            </span>
                        </template>
                    </el-col>
                    <el-col :span="24">商品详情：</el-col>
                    <el-col :span="24" class="img-box">
                        <div v-html="detail.detail"></div>
                    </el-col>
                </el-row>
            </div>

            <div class='xk-title' v-if="goodsAttrs.length">
                <div class="vus-title">
                    <span></span>商品属性信息
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
                <el-row v-for="(item,index) in goodsAttrs" :key="index">
                    <el-col :span="24" class="module-title">{{ item.name }}</el-col>
                    <el-col :span="8" v-for="(subItem,index) in item.columns" :key="index">
                        {{ subItem.name }}：{{ subItem.value }}
                    </el-col>
                </el-row>
            </div>

            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>商品规格信息
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
                <el-row>
                    <el-table :data="tableData">
                        <el-table-column
                            v-for="(item,index) in tableTitle"
                            :key="index"
                            :label="item.name">
                            <template slot-scope="scope">
                                <span>{{ scope.row.code.split("|")[index] | codeToName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="零售价格(元)">
                            <template slot-scope="scope">
                                {{ $math.divide(scope.row.b2cPrice, 100) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="批发价格(元)">
                            <template slot-scope="scope">
                                {{ $math.divide(scope.row.b2bPrice, 100) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="原价(元)">
                            <template slot-scope="scope">
                                {{ $math.divide(scope.row.price, 100) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="进货价格(元)">
                            <template slot-scope="scope">
                                {{ $math.divide(scope.row.costPrice, 100) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="重量(g)">
                            <template slot-scope="scope">
                                {{ scope.row.weight }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商品图片">
                            <template slot-scope="scope">
                                <img class="skuUrl" :src="scope.row.skuUrl" @click="$viewImage(scope.row.skuUrl)" alt="">
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </div>
        </div>

        <div class="xk-radius marintop20">
            <virtual-evaluate-detail type="mall" :goodsId="goodsId"></virtual-evaluate-detail>
        </div>
    </div>
</template>
<script>
    import { enumFormatter } from "../../../util/publicMehotds.js";
    import VirtualEvaluateDetail from '@/components/goods/VirtualEvaluateDetail.vue';
    import ImageList from '@/components/common/ImageList.vue';
    let tableEnum = null;
    let options = [];
    let goodsServiceList = [];
    let supplierList = [];
    export default {
        components: {
            VirtualEvaluateDetail,
            ImageList
        },
        data() {
            return {
                goodsId: '',  //商品ID
                detail: {},
                goodsAttrDetail: {}, //商品属性
                tableData: [],
                tableTitle: [],
                goodsAttrs: []
            }
        },
        created() {
            this.goodsId = this.$route.query.goodsId;
            this.getQueryList();
            this.goodsServicesList();
            this.getSupplierList();
            this.getGoodsDetail();
        },
        methods: {
            //获取商品分类
            getQueryList() {
                this.$http.get(this.$api.queryList, {}, true).then(res=> {
                    options = this.flatten(res);
                }).catch(err=> {
                    this.$message.error(err.message)
                })
            },
            //扁平化数组
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
            //获取商品供应商
            goodsServicesList() {
                this.$http
                .get(this.$api.sgoodsServices, {}, true)
                .then(res=>{
                    goodsServiceList = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //获取商品服务
            getSupplierList() {
                this
                .$http
                .get(this.$api.supplierQListEffective, {}, true)
                .then(res=>{
                    supplierList = res.suppliers;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            getGoodsDetail() {
                let data = {
                    id: this.goodsId,
                };
                tableEnum = [];
                this.$http.post(this.$api.xkGoodsDetail, data, true).then(res => {
                    this.detail = res.base;
                    this.tableTitle = res.skuAttr.attrList
                    this.tableData = res.skuAttrValue;
                    this.goodsAttrs = res.goodsAttrs? res.goodsAttrs.attrList: [];
                    for(let i=0, len = res.skuAttr.attrList.length ; i< len; i++) {
                        for(let j=0, lenJ = res.skuAttr.attrList[i].attrValues.length; j<lenJ ;j++){
                            tableEnum.push(res.skuAttr.attrList[i].attrValues[j])
                        }
                    }
                });
            },
        },
        filters: {
            codeToName(val){
                if(val) {
                    return enumFormatter(val, tableEnum, {key: 'code', value: 'name'});
                }
            },
            formatCat(val) {
                if(val&&options) {
                    let code = val.cc_thr?val.cc_thr:val.cc_sec?val.cc_sec:val.cc_fri;
                    return enumFormatter(code, options, {key: 'code', value: 'name'})
                }
            },
            formatService(val) {
                if(val&&goodsServiceList) {
                    return enumFormatter(val, goodsServiceList, {key: 'id', value: 'name'})
                }
            },
            formatSupplier(val) {
                if(val) {
                    return enumFormatter(val, supplierList, {key: 'id', value: 'supplierName'})
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .virtual-mall-evaluate-detail {
        h3 {
            font-weight: bolder;
            margin-bottom: 20px;
            color: #3c3c3c
        }
        /deep/ .el-row {
            padding-left: 20px;
            font-size: 14px;
            margin-bottom: 15px;
            color: #666;
            /deep/ .el-col {
                margin-bottom: 15px;
            }
        }
        .module-title {
            font-weight: bolder;
            color: #444
        }
        .img-box {
            padding: 0 20px;
            box-sizing: border-box;
            .flext {
                display: inline-block;
                margin-right: 5px;
                .imgInfo {
                    display: inline-block;
                    width: 100px;
                    height: 100px;
                    overflow: hidden;
                    border: 1px solid #ccc;
                    img {
                        width: 100%;
                    }
                }
            }
        }
        .skuUrl {
            width: 60px;
            height: auto;
        }
    }
</style>
<style lang="scss">
    .img-box {
        video {
            width: 400px!important;
        }
    }
</style>
