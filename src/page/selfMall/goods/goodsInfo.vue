<template>
    <div class="xk-container">
        <div class="xk-body xk-radius">
            <div class="goods-info pubBackground">
                <el-form :label-width="formLabelWidth" :model="ruleForm" :rules="rules1"
                     ref="ruleForm">
                <el-form-item label="商品分成类型：">
                    <template v-if="goodsId">
                        {{ ruleForm.goodsDivide==1? '普通商品（下单立即分成）': '大宗商品（订单完成后分成）' }}
                    </template>
                    <template v-else>
                        <el-radio-group v-model="ruleForm.goodsDivide">
                            <el-radio label="1">普通商品（下单立即分成）</el-radio>
                            <el-radio label="2">大宗商品（订单完成后分成）</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item label="商品类型：">
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio label="0">全新</el-radio>
                        <el-radio label="1">二手</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品标题：" prop="name">
                    <el-input :size="$size" v-model="ruleForm.name" placeholder="不能超过50个字"  style="width: 1000px;"></el-input>
                </el-form-item>
                <el-form-item label="商品分类：" prop="types" class="goods-type">
                    <el-cascader
                        :size="$size"
                        v-model="ruleForm.types"
                        placeholder="试试搜索：服装"
                        :options="options"
                        :props="props"
                         @change="getQueryCategoryAttrList"
                        filterable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="商品品牌：" prop="brand">
                    <el-select filterable :filter-method="searchBrand" v-model="ruleForm.brand" placeholder="请选择商品品牌"  :size="$size">
                        <el-option
                            v-for="item in brandFilter"
                            :key="item.code"
                            :label="item.name"
                            :disabled="item.enable==0? true: false"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品属性：" v-if="ruleForm.goodsAttr">
                    <el-card class="box-card" v-for="(attr,index) in ruleForm.goodsAttr" :key="index" style="margin-bottom: 15px">
                        <div slot="header" class="clearfix">
                            <span>{{ attr.name }}</span>
                        </div>
                        <div v-for="(subAttr,subIndex) in attr.columns" :key="subIndex">
                            <el-form-item
                                :label="subAttr.name+'：'"
                                :prop="'goodsAttr.'+index+'.columns.'+subIndex+'.value'"
                                :rules="[{ required: !subAttr.required? false: true, message: `${subAttr.name}不能为空`, trigger: 'blur'}]" >
                                <template v-if="!subAttr.options">
                                    <el-input
                                        :size="$size"
                                        v-model="subAttr.value"
                                        style="width: 60%;"></el-input>
                                </template>
                                <template v-else>
                                    <el-select :size="$size" v-model="subAttr.value" style="width: 60%;">
                                        <el-option v-for="(attrItem, attrIndex) in subAttr.options" :key="attrIndex" :label="attrItem" :value="attrItem"></el-option>
                                    </el-select>
                                </template>
                                
                            </el-form-item>
                        </div>
                    </el-card>
                </el-form-item>
                <el-form-item label="商品图片：" prop="showPicUrl" class="pics" ref="checkImg">
                    <image-upload :more="true" uploadNumber="5" :isShow="isShow" size="3" :draggable="true" v-model="ruleForm.showPicUrl"></image-upload>

                    <!-- <image-upload v-model="ruleForm.showPicUrl" :isShow="isShow" :more="true" size="3" uploadNumber="5">
                        <img v-if="ruleForm.showPicUrl" :src="ruleForm.showPicUrl" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload> -->
                    <p><span class="xk-danger">*  </span><span class="limint-txt">商品图片至少上传1张，最多5张，商品主图大小不能超过3MB，比例1:1尺寸1137*1137px</span></p>
                </el-form-item>
                <el-form-item label="主图视频：" class="videoUrl">
                    <image-upload :more="false" v-model="ruleForm.showVideoUrl" @percentage="percentage" :accept="'video/*'" size="50">
                        <img v-if="persent && !persent.status && persent.url" :src="persent.url+'?vframe/jpg/offset/2/w/146/h/146'" alt="">
                        <video v-if="ruleForm.showVideoUrl && !persent.url" :src="ruleForm.showVideoUrl" poster></video>
                        <i v-else-if="!persent.url" class="el-icon-plus avatar-uploader-icon"></i>
                        <el-progress v-if="persent.status" class="circly-progress" type="circle" :percentage="persent.percentage" color="#8e71c7"></el-progress>
                    </image-upload>
                    <el-button v-if="ruleForm.showVideoUrl" :size="$size" type="primary" @click="$viewImage(ruleForm.showVideoUrl, true)">预览视频</el-button>
                    <el-button v-if="ruleForm.showVideoUrl" :size="$size" type="danger" @click="deleteVideo()">删除视频</el-button>
                    <p><span class="xk-danger">*  </span><span class="limint-txt">主图视频默认第一张显示，最多一个，不超过50M</span></p>
                </el-form-item>
                <el-form-item label="商品供应商：" prop="supplierId">
                    <el-select filterable :filter-method="searchSupplier" v-model="ruleForm.supplierId" placeholder="请选择商品供应商"  :size="$size">
                        <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="直营店利润分润比例设置：" prop="ratio">
                    <el-input :size="$size" v-model.trim="ruleForm.ratio" placeholder="5%"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;%
                </el-form-item>
                <el-form-item label="规格设置：" required>
                    <el-card class="box-card" style="width: 100%">
                        <goods-set v-model="ruleForm.spec" ref="spec" :type="ruleForm.goodsDivide==1? false: true"></goods-set>
                    </el-card>
                </el-form-item>
                <el-form-item label="商品服务：">
                    <el-row style="width: 1000px" v-if="goodsServiceList.length">
                        <el-col :span="8" v-for="(item,index) in goodsServiceList" :key="index">
                            <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="商品详情：" prop="goodsDetail" ref="goodsDetail">
                    <div style="width: 1000px;height: 562px">
                        <UE v-model="ruleForm.goodsDetail" UEheight="height:500px"></UE>
                    </div>
                </el-form-item>
                <el-form-item label="精选商城销售奖励设置：">
                    <prize-set :type="true" v-model="b2c" ref="b2c"></prize-set>
                </el-form-item>
                <el-form-item label="批发商城销售奖励设置：">
                    <prize-set :type="false" v-model="b2b" ref="b2b"></prize-set>
                </el-form-item>
                <el-form-item label="精选商城货源奖励设置：">
                    <goods-source type="true" ref="b2c_s" v-model="b2c_s"></goods-source>
                </el-form-item>
                <el-form-item label="批发商城货源奖励设置：">
                    <goods-source ref="b2b_s" v-model="b2b_s"></goods-source>
                </el-form-item>
                <!-- <el-form-item label="包邮设置：">
                    <el-radio-group v-model="ruleForm.set">
                        <el-radio label="1">包邮</el-radio>
                        <el-radio label="2">不包邮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="运费模板：">
                    <el-row>
                        <el-col :span="6">
                            <el-select :size="$size" style="width: 100%">
                                <el-option label="全国运费模板一" value="1"></el-option>
                                <el-option label="全国运费模板二" value="2"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <el-button style="margin-top: 3px" class="marginleft20" type="primary" :size="$size"
                                    @click="templateVisible=true">新建运费模板
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item> -->
                <el-row v-if="ruleForm.goodsDivide==1">
                    <el-form-item label="运费设置：" prop="set">
                        <el-col :span="2">
                            <el-radio label="1" v-model="ruleForm.set">包邮</el-radio>
                        </el-col>
                        <el-col :span="22">
                            <el-col :span="2">
                                <el-radio label="0" v-model="ruleForm.set">运费模板</el-radio>
                            </el-col>
                            <el-col :span="7" v-if="ruleForm.set==0">
                                <el-form-item prop="carriage">
                                    <el-select v-model="ruleForm.carriage" placeholder="请选择运费模板"  :size="$size" style="width: 100%">
                                        <el-option v-for="tm in template" :key="tm.name" :label="tm.name" :value="tm.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" v-if="ruleForm.set==0">
                                <el-button style="margin-top: 3px" class="marginleft20" type="primary" :size="$size"
                                        @click="templateVisible=true">新建运费模板
                                </el-button>
                            </el-col>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-form-item label="库存计数：" prop="reduceStock" v-if="ruleForm.goodsDivide==1">
                    <el-checkbox v-model="ruleForm.reduceStock"></el-checkbox>&nbsp;&nbsp;&nbsp;买家拍下减库存
                </el-form-item>
                <el-form-item label="推广模板：">
                    <el-card v-if="spreadTemplate.length!==0">
                        <el-row v-for="(item,index) in spreadTemplate" :key="index">
                            <el-col :span="18">{{ item.name }}</el-col>
                            <el-col :span="6">
                                <el-button type="primary" :size="$size" icon="el-icon-search" circle @click="previewH5(item.h5Url, item)"></el-button>
                                <el-button type="danger" :size="$size" icon="el-icon-delete" circle @click="deleteSpreadTemplate(index)"></el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-button :class="spreadTemplate.length!==0 ? 'marintop20': ''" type="primary" :size="$size" @click="spreadFormVisible=true">新增推广模板</el-button>
                </el-form-item>
                <el-form-item label="上架设置：" prop="ground">
                    <el-checkbox v-model="ruleForm.ground"></el-checkbox>&nbsp;&nbsp;&nbsp;立即上架
                </el-form-item>
                <el-form-item label="商品来源：" v-if="ruleForm.goodsDivide==1">
                    <el-checkbox true-label="1" false-label="0" v-model="ruleForm.overSeas"></el-checkbox>&nbsp;&nbsp;&nbsp;海淘优选
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <template v-if="!type">
                    <template v-if="!origin">
                        <el-button type="primary" :size="$size"  @click.stop="submitForm('ruleForm')" :loading="loadingBtn" :disabled="loadingBtn">确认提交</el-button>
                        <el-button :size="$size" @click="backList">返回列表</el-button>
                    </template>
                    <template v-else>
                        <el-button :size="$size" type="primary" @click="$router.go(-1)">返回上一页</el-button>
                    </template>
                </template>
                <template v-else>
                    <el-button :size="$size" type="primary" @click="$router.push('commoditySales')">返回上一页</el-button>
                </template>
            </div>
            </div>
        </div>
        <!--新建运费模板弹框-->
        <trans-price :visibleDialog.sync="templateVisible" :templateData="templateData"  v-if="templateVisible"></trans-price>

        <!-- 新增推广模板 -->
        <spread-form v-model="spreadForm" :visible.sync="spreadFormVisible" @on-success="getSpreadTemplate"></spread-form>
        
        <!-- 预览推广模板 -->
        <el-dialog title="预览推广模板" :visible.sync="previewSpredTemplateVisible" width="415px" append-to-body>
            <div class="iframWebPage">
                <iframe v-if="spredTemplateUrl.url" :src="spredTemplateUrl.url" frameborder="0"></iframe>
                <div class="h5-prview" v-else v-html="spredTemplateUrl.text"></div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    const categoriesKey = ['cc_fri', 'cc_sec', 'cc_thr']  //枚举商品分类
    const typeEnum = ['NEW', 'USED']   //枚举商品类型
    const goodsStatusEnum = ["UP", "DOWN"]   //商品上架枚举

    import ImageUpload from "@/components/ImageUpload.vue"
    import GoodsSet from '@/components/goods/GoodsInfo.vue'
    import TransPrice from '@/components/TransPrice.vue'
    import UE from '@/components/UE.vue'
    import {convertKey} from '@/util/publicMehotds.js'
    import SpreadForm from "@/components/goods/AddSpreadTemplate.vue"
    import PrizeSet from '@/components/goods/PrizeSet.vue';
    import GoodsSource from '@/components/goods/GoodsSource.vue';
    import { h5BaseUrl } from '@/util/publicParams.js';
    import moment from 'moment'
    export default {
        name: 'goodsInfo',
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            value: {},
        },
        components: {
            ImageUpload,
            GoodsSet,
            TransPrice,
            UE,
            SpreadForm,
            PrizeSet,
            GoodsSource
        },
        data() {
            return {
                goodsId: "",    //商品ID
                visible: this.dialogFormVisible, //主表单弹框组件
                isShow: true,                       //图片上传组件
                templateVisible:false,            //新建模板弹框
                formLabelWidth: '180px',
                ruleForm: {          //主弹框表单
                    goodsDivide: '1', //大宗商品
                    type: '0',
                    types: [],
                    set: '1',
                    showPicUrl: '',
                    goodsAttr: '',
                    categories:{}
                },
                goodsAttrs: '',  //商品详情
                templateData: '',   //运费模板
                brand: '',
                brandFilter: '',
                options: [],
                rules1: {
                    name: [
                        {required: true, message: '请输入商品标题', trigger: 'blur'},
                        {max: 50, message: '请输入商品标题，50字以内', trigger: 'blur'}
                    ],
                    types: [
                        {required: true, message: "请选择商品分类", trigger: 'change'}
                    ],
                    brand: [
                        {required: true, message: '请选择商品品牌', trigger: 'change'}
                    ],
                    showPicUrl: [
                        { required: true, message: "请选择商品图片", trigger: 'change'}
                    ],
                    goodsDetail: [
                        { required: true, message: '商品详情不能为空', trigger: 'change'}
                    ],
                    weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur'},
                    ],
                    spec: [
                        {required: true, message: '请至少选择一个规格', trigger: 'change'}
                    ],
                    set: [
                        {required: true, message: '请选择运费设置', trigger: 'change'}
                    ],
                    carriage: [
                        {required: true, message: '请选择运费模板', trigger: 'change'}
                    ],
                    supplierId: [
                        { required: true, message: '请选择商品供应商', trigger: 'change' }
                    ]
                },
                props: {
                    value: 'code',
                    label: 'name',
                    disabled: 'enable'
                },
                template: '',           //运费模板,
                persent: {},      //进度条
                loadingBtn: false,
                //新增推广模板
                addSpreadVisible: false,
                spreadForm: {},
                spreadFormVisible: false,
                spreadTemplate: [],
                //选择添加项
                showSelectDialog: false,
                spredTemplateUrl: {
                    url: '',
                    text: ''
                },
                previewSpredTemplateVisible: false,

                b2c: {
                    mothSale: {
                        currency: "yhq",
                    },
                    singleBatch: {
                        currency: 'yhq'   //单词批量
                    },
                    sourceOfGoods: {},  //货源
                    tax: {},  //税金
                    regionAdmin: {},  //区域合伙人
                    sale: {},   //销售
                    saleSubsidy: {},   //销售补贴
                    saleSubsidyTempList:[{
                        areaCodes: '',
                        buyerRatio: '',
                        areaAdminRatio: '',
                        areaAdminCurrency: '',
                        buyerCurrency: ''
                    }]
                },  //精选商城销售奖励额对象
                b2b: {
                    mothSale: {
                        currency: "yhq",
                    },
                    singleBatch: {
                        currency: 'yhq'   //单词批量
                    },
                    sourceOfGoods: {},  //货源
                    tax: {},  //税金
                    regionAdmin: {},  //区域合伙人
                    sale: {},   //销售
                    saleSubsidy: {},   //销售补贴
                    saleSubsidyTempList:[{
                        areaCodes: '',
                        buyerRatio: '',
                        areaAdminRatio: '',
                        areaAdminCurrency: '',
                        buyerCurrency: ''
                    }]
                },   //批发商城销售奖励设置
                b2c_s: {
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                },
                b2b_s: {
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                },
                goodsServiceList: [],
                goodsServiceIds: [],  //商品服务被勾选的ID
                origin: '',
                type: '',  //销售中的商品
                supplierList: [],
                supplier: [],
            }
        },
        watch: {
            dialogFormVisible(val) {
                this.visible = val;
            },
            templateVisible() {
                this.getPostfeeQPage();
            },
            "ruleForm.showPicUrl": {
                handler(val) {
                    val? this.$refs['checkImg'].clearValidate(): null;
                },
                deep: true
            },
            "ruleForm.goodsDetail": {
                handler(val) {
                    val? this.$refs['goodsDetail'].clearValidate(): null;
                },
                deep: true
            }
        },
        created() {
            this.goodsId = this.$route.query.id;
            //判断是否来源于财务模块
            this.origin = this.$route.query.origin;
            //销售中的
            this.type = this.$route.query.type;
            this.getSupplierList();
            this.getMallCategoryQueryList();
            this.getPostfeeQPage();
            if(this.$route.query.id){
                this.$http.get(this.$api.goodsDetail, {id: this.$route.query.id}, true).then(res=>{
                    this.handleData(res);
                    this.goodsServicesList();
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            }else{
                //商品不存在情况下直接获取商品服务
                this.goodsServicesList();
            }
            let cat = this.$route.query.cat;
            if(cat) {
                let arr = [];
                for(let i=0, len = cat.length; i< len; i++){
                    arr[i] = parseInt(cat[i]);
                }
                this.ruleForm.types = arr;
                this.getQueryCategoryAttrList(arr);
            }
        },
        mounted() {
            this.getAllBrand();
        },
        methods: {
            getMallCategoryQueryList() {
                this.$http.get(this.$api.categoryQueryList, {isManager: 1}, true)
                    .then(res => {
                        res.forEach(item => {
                            this.options.push(item);
                        })
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
            },
            //进度条
            percentage(obj) {
                this.persent = obj
            },
            //编辑
            handleData(result) {
                console.log(result)
                let arr = [];
                result.goods.base.categories.cc_fri? arr.push(parseInt(result.goods.base.categories.cc_fri)):'';
                result.goods.base.categories.cc_sec? arr.push(parseInt(result.goods.base.categories.cc_sec)):'';
                result.goods.base.categories.cc_thr? arr.push(parseInt(result.goods.base.categories.cc_thr)):'';
                this.ruleForm = {
                    goodsDivide: result.goods.base.goodsDivide+'',
                    categories: {},
                    name: result.goods.base.name,
                    types: arr,
                    brand: parseInt(result.goods.base.brandCode),
                    showPicUrl: result.goods.base.showPicUrl.slice(0,5),  //  兼容以前多出的图片
                    showVideoUrl: result.goods.base.showVideoUrl,
                    goodsDetail: result.goods.base.detail,          //商品详情
                    type: result.goods.base.type===typeEnum[0]? "0": "1",
                    spec: {
                        skuAttr: result.goods.skuAttr,
                        skuAttrValue: result.goods.skuAttrValue,
                        isSingleSpec: result.goods.base.isSingleSpec
                    },   //商品规格
                    reduceStock: result.goods.base.reduceStock==1?true: false,   //减库存,
                    carriage: result.goods.base.carriage,         //运费模板
                    set: result.goods.base.isFreeShipping===1? '1':'0',   //是否包邮
                    id: result.goods.base.id,
                    ground: result.goods.base.goodsStatus===goodsStatusEnum[0]? true: false,
                    ratio: result.goods.base.ratio,
                    sales: '',
                    overSeas: result.goods.base.overSeas+'',
                    supplierId: result.goods.base.supplierId
                }
                this.spreadTemplate = result.goods.promotionTemplates
                this.goodsAttrs = result.goods.goodsAttrs

                result.drawout.b2b? this.b2b = this.deleteParam(result.drawout.b2b, false): null;
                result.drawout.b2c? this.b2c = this.deleteParam(result.drawout.b2c, true): null;
                
                
                this.b2c_s = {
                    sourceOfGoods: result.drawout.b2c&&result.drawout.b2c.sourceOfGoods?
                                    result.drawout.b2c.sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: result.drawout.b2c&&result.drawout.b2c.sourceOfGoodsMonthSaleSubsidy?
                                                this.changeResource(result.drawout.b2c.sourceOfGoodsMonthSaleSubsidy, true)
                                                : {}
                }
                this.b2b_s = {
                    sourceOfGoods: result.drawout.b2b&&result.drawout.b2b.sourceOfGoods
                                    ? result.drawout.b2b.sourceOfGoods
                                    : {},
                    sourceOfGoodsMonthSaleSubsidy: result.drawout.b2b&&result.drawout.b2b.sourceOfGoodsMonthSaleSubsidy 
                                    ? this.changeResource(result.drawout.b2b.sourceOfGoodsMonthSaleSubsidy, true)
                                    : {}
                }
                //商品服务
                this.goodsServiceIds = result.goods.serviceIds?result.goods.serviceIds.map(item=>{
                    return item.id&&item.checked==1? item.id: "";
                }): [];
                //加载商品属性
                this.getQueryCategoryAttrList(arr)
            },
            //回显商品属性
            renderAttr(result) {
                let goodsAttr = this.goodsAttrs;
                for(let i=0, len = goodsAttr.attrList.length; i< len; i++){
                    for(let j =0, lenJ = goodsAttr.attrList[i].columns.length; j<lenJ; j++){
                        this.ruleForm.goodsAttr[i].columns[j].value = goodsAttr.attrList[i].columns[j].value;
                    }
                }
            },
            //提交主表单
            submitForm(formName) {
                //构建商品属性数据结构
                let attrList = [], arr = this.ruleForm.goodsAttr?this.ruleForm.goodsAttr:this.goodsAttrs;
                for(let i=0, len = arr.length; i< len; i++) {
                    let obj = {
                        columns: []
                    }
                    for(let j=0, lenJ = arr[i].columns.length; j <  lenJ; j++) {
                        let obj2 = {}
                        obj2.name = arr[i].columns[j].name;
                        obj2.value = arr[i].columns[j].value;
                        obj2.format = arr[i].columns[j].format;
                        obj.columns.push(obj2);
                    }
                    obj.name = arr[i].name;
                    attrList.push(obj)
                }
                if(!this.ruleForm.spec){this.$message.error('请先选择一种规格');return false;}
                if(this.ruleForm.spec.skuAttr.length===0){this.$message.error('请设置一种规格名称');return false}
                if(this.ruleForm.spec.skuAttrValue.length===0){this.$message.error('请设置一种规格属性');return false}

                let arr_validate = [];
                arr_validate[0] = this.$refs['b2b']._validate();
                arr_validate[1] = this.$refs['b2c']._validate();
                arr_validate[2] = this.$refs['b2b_s']._validate();
                arr_validate[3] = this.$refs['b2c_s']._validate();
                arr_validate[4] = this.$refs['spec'].validate();
                arr_validate[5] = this.validate();
                
                Promise.all(arr_validate).then(res=>{
                    let obj = {
                        goods: {
                            base: {
                                goodsDivide: this.ruleForm.goodsDivide,      //1普通商品，2大宗商品
                                brandCode: this.ruleForm.brand,   //品牌ID
                                isSingleSpec: this.ruleForm.spec.isSingleSpec,   //是否单规格
                                categories: this.ruleForm.categories,     //商品分类
                                goodsStatus: this.ruleForm.ground? goodsStatusEnum[0]: goodsStatusEnum[1],
                                name: this.ruleForm.name,     //商品标题
                                showPicUrl: this.ruleForm.showPicUrl.slice(0,5),   //主图图片
                                showVideoUrl: this.ruleForm.showVideoUrl?this.ruleForm.showVideoUrl: "",   //主图视频
                                detail: this.ruleForm.goodsDetail,   //商品详情
                                type: typeEnum[this.ruleForm.type],   //新旧
                                carriage: this.ruleForm.carriage?this.ruleForm.carriage: "",        //模板ID
                                ratio: this.ruleForm.ratio,
                                supplierId: this.ruleForm.supplierId
                            },
                            goodsAttrs: {
                                // categoryAttrId: this.ruleForm.categoryAttrId,
                                categoryAttr: this.ruleForm.categoryAttrId,
                                attrList: attrList
                            },
                            skuAttr: this.ruleForm.spec.skuAttr,
                            skuAttrValue: this.ruleForm.spec.skuAttrValue,
                            templates: this.spreadTemplate
                        },
                        drawout: {
                            b2c: this.createSale(this.b2c, 'b2c'),
                            b2b: this.createSale(this.b2b, 'b2b')
                        }
                    }

                    if(this.ruleForm.goodsDivide==1) {
                        obj.goods.base.isFreeShipping = this.ruleForm.set;    //是否包邮 1包邮，0不包邮
                        obj.goods.base.reduceStock = this.ruleForm.reduceStock; //减库存
                        obj.goods.base.overSeas = this.ruleForm.overSeas;    //是否海淘
                    }
                    obj.goods.base.goodsServiceIds = this.goodsServiceList.filter(item=>{
                        return item.checked;
                    }).map(item=>{
                        return item.id
                    })

                    if(this.ruleForm.id){
                        obj.id = this.ruleForm.id
                    }
                    console.log(JSON.stringify(obj))
                    // return false;
                    this.loadingBtn = true;
                    let url = this.ruleForm.id? this.$api.goodsUpdate: this.$api.goodsCreate;
                    this.$http.post(url, obj,true)
                        .then(res => {
                        this.loadingBtn = false;
                        this.$message({
                            type: 'success',
                            message: '已提交!',
                        })
                        this.className = sessionStorage.removeItem('className');
                        this.clickIndex= sessionStorage.removeItem('subIndex');
                        obj.goods.base.goodsStatus===goodsStatusEnum[0]?this.$router.push({path: '/commoditySales'}):this.$router.push({path: '/lowerGoods'})
                    }).catch(err=> {
                        this.loadingBtn = false;
                        this.$message.error(err.message)
                    });
                })
                .catch(err=>{
                    this.$nextTick(()=>{
                        let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                        $('.xk-container').animate({
                            scrollTop: num - 90
                        }, 500)                            
                    })
                })
            },
            validate() {
                return new Promise((resolve, reject) => {
                    if(this.goodsServiceList.length) {
                        let length = this.goodsServiceList.filter(item=>{
                                return item.checked;
                            }).length;
                        if(!length) {
                            this.$message.error('请至少选择一个商品服务！');
                            reject(false);
                            return false;
                        }
                    }
                    this.$refs['ruleForm'].validate((valid) => {
                        if(valid) {
                            resolve(true)
                        }else{
                            reject(false);
                        }
                    })
                })
            },
            backList() {
                this.$router.push({path: "/lowerGoods"})
            },
            //获取所有品牌
            getAllBrand() {
                let obj = {
                    brandSearchDTO:{
                        code: "",
                        name: ""
                    },
                    page: 1,
                    limit: 99999
                }
                this.$http.get(this.$api.queryAll, obj, true).then(res => {
                    this.brand = res.data;
                    this.brandFilter = this.brand;
                })
            },
            //获取商品分类属性
            getQueryCategoryAttrList(value) {
                let categories = {}
                for(let i=0,len = value.length; i < len; i++) {
                    categories[categoriesKey[i]] = value[i];
                }
                this.ruleForm.categories = categories;
                //如果是编辑状态
                //用最低级code查询
                this.$http.get(this.$api.queryCategoryAttrList, {
                    categoryCode: value[value.length-1]
                } , true).then(res => {
                    if(res){
                        let attrArr = res.attrs;
                        for(let i=0,len =attrArr.length; i< len; i++) {
                            if(attrArr[i].columns instanceof Array) {
                                for(let j=0, lenJ = attrArr[i].columns.length; j < lenJ; j++) {
                                    attrArr[i].columns[j].value = ""
                                    if(attrArr[i].columns[j].columnValueType== 'SELECT') {
                                        attrArr[i].columns[j].options = attrArr[i].columns[j].values
                                    }
                                }
                            }
                        }
                        //组装验证规则
                        this.ruleForm.categoryAttrId = res.categoryCode;
                        this.$set(this.ruleForm, 'goodsAttr', attrArr);
                        this.goodsAttrs?this.renderAttr():''
                    }else{
                        this.$set(this.ruleForm, 'goodsAttr', "");
                    }

                }).catch(err=>{
                    if(err.code===409){
                        this.ruleForm.goodsAttr = '';
                        this.ruleForm.categoryAttrId = ""
                    }
                    this.$message.error(err.message)
                })
            },
            //获取运费模板
            getPostfeeQPage() {
                this.$http.get(this.$api.postfeeQList, {limit: 100,page: 1}, true).then(res => {
                    this.template = res.templates
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            getSpreadTemplate(res) {
                let param = JSON.parse(JSON.stringify(res))
                let obj = {
                    templateType: param.templateType,
                    h5Url: param.h5Url,
                    name: param.name,
                    startTime: parseInt((new Date(param.rangeTime[0]).getTime() +'').substring(0, 10)),
                    endTime: parseInt((new Date(param.rangeTime[1]).getTime() +'').substring(0, 10)),
                    info: param.info
                }
                this.spreadTemplate.push(obj)
            },
            //删除推广模板
            deleteSpreadTemplate(index) {
                this.$confirm('是否删除此模板？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.spreadTemplate.splice(index, 1);
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    })
                })
                .catch(()=> {
                    this.$message('取消删除')
                })

            },
            // H5预览
            previewH5(url, item) {
                if(url){
                    this.previewSpredTemplateVisible = true
                    this.spredTemplateUrl = {
                        url: url,
                        text: ''
                    } 
                }
                else{
                    this.previewSpredTemplateVisible = true;
                    this.spredTemplateUrl = {
                        url: "",
                        text: item.info
                    }
                }
            },
            previewSpredTemplate(url) {
                this.previewSpredTemplateVisible = true
                this.spredTemplateUrl = url;
            },
            /**
             * 生成精选商城销售奖励参数格式
             */
            createSale(param, type) {
                let _p = JSON.parse(JSON.stringify(param));
                let obj  = {};
                _p.singleBatch.ratio? obj.singleBatch = _p.singleBatch: null;
                _p.tax.ratio? obj.tax = _p.tax: null;
                _p.mothSale.ratio? obj.mothSale = _p.mothSale : null;

                if(_p.singleBatch.ratio) {
                    obj.singleBatch.sales = this.$math.multip(obj.singleBatch.sales, 100);
                }
                if(_p.mothSale.ratio) {
                    obj.mothSale.sales = this.$math.multip(obj.mothSale.sales ,100);
                }

                if(type==='b2c') {
                    let _r = this.regionJug(_p.saleSubsidyTempList, 'b2c')
                    _r.length >0? obj.saleSubsidyTempList = _r : null;
                    _p.sale.ratio? obj.sale = _p.sale: null;
                    if(this.b2c_s.sourceOfGoods.ratio) {
                        obj.sourceOfGoods = {
                            merchantId: this.b2c_s.sourceOfGoods.merchantId,
                            merchantName: this.b2c_s.sourceOfGoods.merchantName,
                            merchantPhone: this.b2c_s.sourceOfGoods.merchantPhone,
                            ratio: this.b2c_s.sourceOfGoods.ratio,
                            adminRadio: this.b2c_s.sourceOfGoods.adminRadio
                        }
                    }
                    if(this.b2c_s.sourceOfGoodsMonthSaleSubsidy.ratio) {
                        obj.sourceOfGoodsMonthSaleSubsidy = {
                            ratio: this.b2c_s.sourceOfGoodsMonthSaleSubsidy.ratio,
                            sales: this.$math.multip(this.b2c_s.sourceOfGoodsMonthSaleSubsidy.sales ,100)
                        }
                    }
                }else{
                    //b2b
                    let _r = this.regionJug(_p.saleSubsidyTempList, 'b2b');
                    _r.length >0? obj.saleSubsidyTempList = _r : null;

                    _p.regionAdmin.ratio? obj.regionAdmin = _p.regionAdmin : null;

                    if(_p.regionAdmin.ratio) {
                        obj.regionAdmin.sales = this.$math.multip(obj.regionAdmin.sales ,100);
                    }

                    if(this.b2b_s.sourceOfGoods.ratio) {
                        obj.sourceOfGoods = {
                            merchantId: this.b2b_s.sourceOfGoods.merchantId,
                            merchantName: this.b2b_s.sourceOfGoods.merchantName,
                            merchantPhone: this.b2b_s.sourceOfGoods.merchantPhone,
                            ratio: this.b2b_s.sourceOfGoods.ratio,
                            adminRadio: this.b2b_s.sourceOfGoods.adminRadio
                        }
                    }
                    
                    if(this.b2b_s.sourceOfGoodsMonthSaleSubsidy.ratio) {
                        obj.sourceOfGoodsMonthSaleSubsidy = {
                            ratio: this.b2b_s.sourceOfGoodsMonthSaleSubsidy.ratio,
                            sales: this.$math.multip(this.b2b_s.sourceOfGoodsMonthSaleSubsidy.sales ,100)
                        }
                    }
                }
                return obj;
            },

            /**
             * 区域合伙人参数过滤
             */
            regionJug(arr, type) {
                let _arr = [];
                arr.forEach(item=> {
                    if(item.areaCodes && item.areaCodes.length>0) {
                        let obj = {
                            areaCodes: item.areaCodes,
                            buyerRatio: item.buyerRatio,
                            areaAdminRatio: item.areaAdminRatio
                        }
                        if(type==='b2c') {
                            obj.buyerCurrency = 'xfq';
                            obj.areaAdminCurrency = 'rmb';
                        }else{
                            obj.buyerCurrency = 'swq';
                            obj.areaAdminCurrency = 'rmb';
                        }
                        _arr.push(obj);
                    }
                })

                return _arr;
            },
            /**
             * 转换货源奖励
             */
            changeResource(param, bool) {
                if(param) {
                    let _p = JSON.parse(JSON.stringify(param));
                    if(bool) {
                        _p.sales? _p.sales = this.$math.divide(_p.sales ,100): null;
                    }else{
                        _p.sourceOfGoodsMonthSaleSubsidy.sales? _p.sourceOfGoodsMonthSaleSubsidy.sales = this.$math.multip(_p.sourceOfGoodsMonthSaleSubsidy.sales,100): null;
                    }
                    return _p;
                }
                return param;
            },
            //去除额外参数,  type参数   true： 精选   false： 批发商城
            deleteParam(param, type) {
                let obj = {
                    tax: param.tax? param.tax: {},
                    saleSubsidyTempList: param.saleSubsidyTempList?this.transformOrigin(param.saleSubsidyTempList): [{
                        areaCodes: '',
                        buyerRatio: '',
                        areaAdminRatio: '',
                        areaAdminCurrency: '',
                        buyerCurrency: ''
                    }]
                }
                if(param.singleBatch) {
                    obj.singleBatch = param.singleBatch;
                    obj.singleBatch.sales = this.$math.divide(param.singleBatch.sales, 100);
                    obj.singleBatch.currency = param.singleBatch.currency? param.singleBatch.currency: 'yhq';
                }else{
                    obj.singleBatch = {
                        currency: 'yhq'
                    }
                }
                if(param.mothSale) {
                    obj.mothSale = param.mothSale;
                    obj.mothSale.sales = this.$math.divide(param.mothSale.sales, 100);
                    obj.mothSale.currency = param.mothSale.currency? param.mothSale.currency: 'yhq';
                }else{
                    obj.mothSale = {
                        currency: 'yhq'
                    }
                }
                if(!type) {
                    if(param.regionAdmin) {
                        obj.regionAdmin = param.regionAdmin
                        obj.regionAdmin.sales = this.$math.divide(param.regionAdmin.sales, 100);
                    }else{
                        obj.regionAdmin = {}
                    }
                }else{
                    obj.ratio = param.ratio?param.ratio: {};
                    obj.sale = param.sale?param.sale: {}
                }
                return obj;
            },
            //转换区域格式
            transformOrigin(arr) {
                let _arr=[]
                arr.forEach(item => {
                    let obj = {
                        areaAdminCurrency: item.areaAdminCurrency,
                        areaAdminRatio: item.areaAdminRatio,
                        buyerCurrency: item.buyerCurrency,
                        buyerRatio: item.buyerRatio
                    }

                    if(!item.areaCodes) {
                        obj.areaCodes = ""
                    }else{
                        obj.areaCodes = item.areaCodes;
                    }
                    _arr.push(obj);
                })
                return _arr;
            },
            //删除视频
            deleteVideo() {
                this.ruleForm.showVideoUrl = "";
                this.persent = {};
            },
            searchBrand(key) {
                this.brandFilter = this.brand.filter(item=>{
                    return item.name.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) == 0 || item.firstChar.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) === 0;
                })
            },
            //商品服务
            //查询所有有效的商品服务
            goodsServicesList() {
                this.$http
                .get(this.$api.sgoodsServices, {}, true)
                .then(res=>{
                    console.log(res)
                    if(this.goodsServiceIds.length) {
                        let serviceIdsArr = [];
                        res.forEach(item=>{
                            let obj = {
                                id: item.id,
                                message: item.message,
                                name: item.name,
                                picUrl: item.picUrl,
                                checked: false
                            }
                            if(this.goodsServiceIds.indexOf(item.id) > -1) {
                                obj.checked = true;
                            }
                            serviceIdsArr.push(obj)
                        })
                        this.goodsServiceList = serviceIdsArr;
                        return false;
                    }
                    this.goodsServiceList = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //供应商
            getSupplierList() {
                this
                .$http
                .get(this.$api.supplierQListEffective, {}, true)
                .then(res=>{
                    this.supplier = res.suppliers;
                    this.supplierList = res.suppliers;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            searchSupplier(key) {
                this.supplierList = this.supplier.filter(item=>{
                    return item.supplierName.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) > -1;
                })
            }
        }
    }
</script>
<style lang="scss" src="./goodsInfo.scss"></style>

