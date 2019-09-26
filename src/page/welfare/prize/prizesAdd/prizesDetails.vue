<template>
    <div class="xk-container prizes-details">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>商品详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                     class=" demo-ruleForm pubpadd">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>基本信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class="paddtop20">
                            <el-col :span="6">商品ID：{{ruleForm.base.id}}</el-col>
                            <el-col :span="6">商品类型： 实物</el-col>
                            <el-col :span="6">商品分类：{{ruleForm.category}}</el-col>
                            <el-col :span="6">奖品品牌：{{ruleForm.brandName}}</el-col>
                            <el-col :span="6" v-if="ruleForm.base.isFreeShipping==0">邮寄方式：不包邮</el-col>
                            <el-col :span="6" v-else>邮寄方式：包邮</el-col>
                            <el-col :span="24">商品标题：{{ruleForm.base.name}}</el-col>
                            <el-col :span="24">商品图片：</el-col>
                            <el-col :span="24" class="img-box" v-if="ruleForm.base.showPicUrl">
                                <image-list v-for="(value,index) in ruleForm.base.showPicUrl" 
                                            :url="value"
                                            :key="index"></image-list>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20" v-if="ruleForm.goodsAttrs.attrList&&ruleForm.goodsAttrs.attrList.length!=0">
                    <div slot="header" class="clearfix">
                        <span>商品属性信息：</span>
                    </div>
                    <div class="paddBoth">
                        <div v-for="(value,index) in ruleForm.goodsAttrs.attrList" :key="index">
                            <div v-if="value.columns==null"></div>
                            <div v-else>
                                <el-card class="box-card marintop20">
                                    <div slot="header" class="clearfix">
                                        <span style="font-weight:bolder">{{value.name}}</span>
                                    </div>
                                    <div v-for="(v,subIndex) in value.columns" :key="subIndex" class="normal-style">
                                        {{v.name}}：{{v.value}}
                                    </div>
                                </el-card>
                                
                            </div>
                        </div>
                    </div>
                </el-card>

                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>商品规格信息：</span>
                    </div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                             class=" demo-ruleForm ">
                        <el-form-item label="规格详情：">
                            <el-table :data="tableData" border>
                                <el-table-column
                                    v-for="(tableTitle,index) in ruleForm.skuAttr.attrList"
                                    :key="index"
                                    :label="tableTitle.name">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.code.split("|")[index] | codeToName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="批发价格（元）">
                                    <template slot-scope="scope">
                                        <span>{{ $math.divide(scope.row.b2bPrice, 100).toFixed(2) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="零售价格（元）">
                                    <template slot-scope="scope">
                                        <span>{{ $math.divide(scope.row.b2cPrice,100).toFixed(2) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="重量（g）" prop="weight"></el-table-column>
                                <el-table-column
                                    label="商品图片">
                                    <template slot-scope="scope">
                                        <span class="imgInfo">
                                            <img :src="scope.row.skuUrl" @click="$viewImage(scope.row.skuUrl)">
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" fixed="right" width="150" v-if="!from">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="primary"
                                            @click="choice(scope.$index, scope.row)">选择
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-form>
                <!--底部提示-->
            <div class="pubpadd">
                <el-card class="box-card marintop20">
                    <el-form :model="setForm" label-width="180px" :rules="rules" ref="setForm">
                        <el-form-item label="奖品缩略图：" prop="microPic">
                            <image-upload size="2" v-model="setForm.microPic" :more="false">
                                <img v-if="setForm.microPic" :src="setForm.microPic" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </image-upload>
                            <p><span class="xk-danger">*  </span>提示：图片建议尺寸为168*98，大小不超过2M</p>
                        </el-form-item>
                        <el-form-item label="晒单后奖励：">
                            <el-row>
                                <el-col :span="2">
                                    <el-radio v-model="setForm.type" :label="'voucher'">消费券</el-radio>
                                </el-col>
                                <el-col :span="22" style="margin-bottom: 18px">
                                    <el-form-item prop="jf">
                                        <el-input :size="$size" v-model.number="setForm.jf" placeholder="请输入消费券"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <el-radio v-model="setForm.type" :label="'aa_lottery'">AA彩票</el-radio>
                                </el-col>
                                <el-col :span="22">
                                    <el-form-item prop="aa">
                                        <el-input :size="$size" v-model="setForm.aa" placeholder="请填写赠送彩票张数"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="开奖后未中奖返还消费券：" v-if="setForm.use!='expense'">
                            <el-radio-group v-model="setForm.isReturnWhenLost">
                                <el-radio :label="1">返还</el-radio>
                                <el-radio :label="0">不返还</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="中奖后是否需要分享：" required>
                            <el-radio-group v-model="setForm.isFreeShare">
                                <el-radio label="1">需要</el-radio>
                                <el-radio label="0">不需要</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="奖品分类：" prop="categoryCode">
                            <el-select :size="$size" placeholder="请选择产品分类" v-model="setForm.categoryCode" @change="change">
                                <el-option v-for="(value,index) in priClass" :key="index" :label="value.name"
                                        :disabled="value.enable==1? false: true"
                                        :value="value.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="单品ID限购次数：">
                            <el-col :span="2">
                                <el-radio v-model="setForm.purchaseNumberType" :label="-1">不限</el-radio>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="1">
                                    <el-radio v-model="setForm.purchaseNumberType" :label="1"></el-radio>
                                </el-col>
                                <el-col :span="18">
                                    <el-form-item prop="purchaseNumber" class="m-b-0">
                                        <el-input :size="$size" placeholder="10" v-model="setForm.purchaseNumber"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="奖品用途：">
                            <el-select v-model="setForm.use" :size="$size">
                                <el-option v-for="item in PrizeUsageEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖品简介：" prop="description">
                            <el-input :size="$size" v-model.trim="setForm.description" placeholder="请输入奖品简介" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                        <div class="paddbottom20">
                            <div class="solidbottom1px listInfo">温馨提示：</div>
                            <div class="paddtop20 marginleft20 el-row">
                                <p>1. 自营商品添加奖品默认包邮，默认为实物奖品。</p>
                                <p>2. 自营商品已经添加设置，商品会自动添加到奖品池列表，如需设置奖品开奖方式须在奖品列表中设置。</p>
                                <p>3. 添加自营商品为奖品，原自营商品赠送的消费券不予赠送。</p>
                                <p>4. 添加自营商品为奖品需要设置奖品消费券，具体消费券设置可根据销售价进行参考。</p>
                            </div>
                        </div>
                    </el-form>
                </el-card>
            </div>

            <div class="btn-group" v-if="from">
                <el-button :size="$size" type="primary" @click="$router.go(-1)">返回上一页</el-button>
            </div>

             <!--提示弹框-->
            <el-dialog title="温馨提示" :visible.sync="tipsVisible1" width="30%" top="30px"
                        @close="close">
                <span>是否选择&emsp;{{ruleForm.base.name}}&emsp;{{currentName}}&emsp;该商品为奖品,点击确认，设置奖品消费券价格</span>
                <span slot="footer" class="dialog-footer">
                            <el-button :size="$size" @click="tipsVisible1 = false">取 消</el-button>
                            <el-button :size="$size" type="primary" @click="tipsVisible2=true">确 定</el-button>
                        </span>
            </el-dialog>
            <!--奖品消费券提示-->
            <el-dialog title="奖品消费券设置" :visible.sync="tipsVisible2" width="30%" top="30px"
                        @close="close">
                <el-col>您已经选择&emsp;{{ruleForm.base.name}}&emsp;{{currentName}}
                    &emsp;该商品为奖品
                </el-col>
                <el-col>商品价格：{{ $math.divide(currentB2bPrice, 100) }}元</el-col>
                <el-col>奖品消费券：<el-input style="display:inline-block;width: 50%" :size="$size" v-model.trim="ruleForm.price" placeholder="请输入奖品消费券价格"></el-input>
                </el-col>
                <el-col>提示：该商品已经选择，会自动进入奖品列表，如需取消,该奖品，须在奖品列表中取消，且奖品未设置开期</el-col>
                <span slot="footer" class="dialog-footer">
                            <el-button :size="$size" @click="tipsVisible2 = false">取 消</el-button>
                            <el-button :size="$size" type="primary" @click="sure()" :disabled="sureLoading" :loading="sureLoading">确 定</el-button>
                        </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    let tableEnum = null;
    import {getSession,enumFormatter} from '../../../../util/publicMehotds.js';
    import { PrizeUsageEnum } from '@/util/publicParams.js';
    import ProvinceCascader from "@/components/ProvinceCascader.vue"
    import ImageUpload from "../../../../components/ImageUpload.vue";
    import ImageList from '@/components/common/ImageList.vue';

    export default {
        name: "prizesDetails",
        components: {
            ProvinceCascader,
            ImageUpload,
            ImageList
        },
        data() {
            const checkPrice = (rule, value, call) => {
                if(!value) {
                    call(new Error('不能为空'))
                }else if(!/^[0-9]*$/g.test(value)){
                    call(new Error('必须为数字'))
                }else{
                    call()
                }
            }
            return {
                PrizeUsageEnum,
                tipsVisible1: false,
                tipsVisible2: false,
                currentName: '',             //当前商品名字
                currentB2bPrice: '',          //当前商品价格
                currentUrl: [],                //当前商品图片
                prizesId: '',               //奖品ID
                weight: 0,                    //奖品重量
                editId: '',  //编辑ID
                ruleForm: {
                    base: {},
                    goodsAttrs: {},
                    skuAttr: {},
                    skuAttrValue: {},
                    price: ''
                },                        //表单数据
                categories: {},
                tableData: [],
                tableTitle: '',
                setForm: {
                    use: "expense",
                    type: 'voucher',
                    isReturnWhenLost: 1,
                    purchaseNumberType: -1,
                    isFreeShare: '0'
                },  //添加
                rules:{
                    returnPrice: [
                        { required: true, validator: checkPrice, trigger: "blur"}
                    ],
                    categoryCode: [
                        { required: true, message: '请选择奖品分类', trigger: 'change'}
                    ],
                    purchaseNumber: [
                        { validator: (rule, value, call)=>{
                            if(this.setForm.purchaseNumberType=='-1'){
                                return call();
                            }
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/^[1-9]\d*$/.test(value)){
                                return call(new Error('格式不正确'))
                            }
                            return call();
                        }, trigger: 'blur' }
                    ],
                    jf: [
                        { validator: true, validator: (rule, value, call)=>{
                            if(this.setForm.type=='voucher') {
                                if(!value){
                                    return call(new Error(value===0?'不能为0':'不能为空'))
                                }
                                if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                                    return call(new Error('消费券格式填写不正确'))
                                }
                                if(Number(value)>10000) {
                                    return call(new Error('不能超过10000'))
                                }
                                return call();
                            }else{
                                call();
                            }
                        }, trigger: 'blur' }
                    ],
                    aa: [
                        { validator: true, validator: (rule, value, call)=>{
                            if(this.setForm.type=='aa_lottery') {
                                if(!value){
                                    return call(new Error('不能为空'))
                                }
                                if(!/^[1-9]\d*$/.test(value)) {
                                    return call(new Error('彩票张数格式不正确'))
                                }
                                if(Number(value)>100) {
                                    return call(new Error('不能超过100'))
                                }
                                return call();
                            }else{
                                call();
                            }
                        }, trigger: 'blur' }
                    ],
                    description: [
                        { required: true, min: 1, max: 51, message: '请输入1-50字', trigger: 'blur' }
                    ],
                    microPic: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                },
                sureLoading: false,
                priClass: '',
                from: ""      //有值代表从财务管理跳转过来
            }
        },
        created() {
            this.prizesId = this.$route.query.id;
            this.from = this.$route.query.from;
            if(this.$route.query.prizeId){
                this.editId = this.$route.query.prizeId;
                this.getEditDetail(this.editId);
            }
            this.prizesClass();
            this.prizesClassw();
        },
        methods: {
            //获取奖品类别
            prizesClassw() {
                this.$http.get(this.$api. queryJFCategory, {}, true
                ).then((res) => {
                    this.priClass = res;
                }).catch(() => {
                });
            },
            //获取详情内容
            prizesClass() {
                let data = {
                    id: this.prizesId,
                };
                tableEnum = [];
                this.$http.post(this.$api.xkGoodsDetail, data, true).then(res => {
                    this.ruleForm = res;
                    this.tableData = res.skuAttrValue;
                    for(let i=0, len = res.skuAttr.attrList.length ; i< len; i++) {
                        for(let j=0, lenJ = res.skuAttr.attrList[i].attrValues.length; j<lenJ ;j++){
                            tableEnum.push(res.skuAttr.attrList[i].attrValues[j])
                        }
                    }
                    //获取所有商品图片
                    this.currentUrl = res.base.showPicUrl
                });
            },
            choice(index, row) {
                this.$refs['setForm'].validate(valid => {
                    if (valid) {
                        this.currentName = row.name;
                        this.currentB2bPrice = row.b2bPrice;
                        this.weight = row.weight;
                        this.tipsVisible1 = true;
                    }else{
                        let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                        $('.xk-container').animate({
                            scrollTop: num - 90
                        }, 500)
                        return false;
                    }
                });
            },
            //根据返回的code查询对应的name值
            getName(arr) {
                let str = "";
                for(let i=0, len=arr.length; i<len; i++){
                    str += tableEnum.filter(item=>{
                        return item.code ===arr[i]
                    })[0].name + "   "
                }
                return str
            },
            sure() {
                if (this.ruleForm.price != ''&&this.ruleForm.price!=undefined) {
                    let data = {
                        goods: {
                            detailPics: this.ruleForm.base.detail,
                            isReturnWhenLost: this.setForm.isReturnWhenLost,
                            usage: this.setForm.use,
                            name: this.ruleForm.base.name,
                            commentAward: {
                                count: this.setForm.type === 'voucher'? this.$math.multip(this.setForm.jf,100): this.setForm.aa,
                                type: this.setForm.type
                            },
                            from: 'mall',
                            type: "substance",
                            realAttr: {
                                brandName: this.ruleForm.base.brandName,
                                specInfo: this.currentName,
                                originalValue: this.$math.multip(this.ruleForm.price ,100),
                                showPics: this.currentUrl,
                                // showPics: this.currentUrl instanceof Array? this.currentUrl: [this.currentUrl],
                                categoryCode: this.setForm.categoryCode,
                                weight: this.weight
                            },
                            mallGoodsId: this.ruleForm.base.id,
                            purchaseNumber: this.setForm.purchaseNumberType==-1? -1: this.setForm.purchaseNumber,
                            microPic: this.setForm.microPic,
                            description: this.setForm.description,
                            isFreeShare: this.setForm.isFreeShare
                        }
                    };
                    this.sureLoading = true;
                    let url = this.$api.jfmallGoodsCreate4Manager;
                    if(this.editId) {
                        data.goods.id = this.editId;
                        url = this.$api.jfmallGoodsUpdate4Manager;
                    }
                    console.log(JSON.stringify(data))
                    this.$http.post(url, data, true).then((res) => {
                        this.sureLoading = false;
                        this.$message({
                            type: 'success',
                            message: '已提交!',
                        });
                        this.className = sessionStorage.removeItem('className');
                        this.clickIndex= sessionStorage.removeItem('subIndex');
                        this.$router.push('prizesList');
                    }).catch(err => {
                        this.sureLoading = false;
                        this.$message.error(err.message)
                    });
                } else {
                    this.$message({
                        message: '请先输入奖品消费券价格',
                        type: 'warning'
                    });
                }
            },
            //获取编辑详情
            getEditDetail(id) {
                this.$http.get(this.$api.jfmallGoodsDetail4Manager, {jGoodsId: id}, true).then(res=>{
                    this.setForm.categoryCode = res.realAttr.categoryCode;
                    this.ruleForm.price = this.$math.divide(res.realAttr.originalValue ,100);
                    this.setForm.usage = res.usage;
                    this.setForm.purchaseNumberType = res.purchaseNumber >0? 1: -1;
                    res.purchaseNumber >0? this.setForm.purchaseNumber = res.purchaseNumber: null;
                    this.setForm.isReturnWhenLost = res.isReturnWhenLost;
                    this.setForm.type = res.commentAward.type;
                    this.$set(this.setForm, "microPic", res.microPic)
                    this.setForm.description = res.description;
                    this.setForm.isFreeShare = res.isFreeShare!==null&&res.isFreeShare!==undefined? res.isFreeShare+'': '1';
                    res.commentAward.type==="voucher"? this.setForm.jf = this.$math.divide(res.commentAward.count ,100): this.setForm.aa = res.commentAward.count;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        filters: {
            codeToName(val){
                return enumFormatter(val, tableEnum, {key: 'code', value: 'name'});
            }
        }
    }
</script>

<style lang='scss' scoped>
    .prizes-details{
        .m-b-0 {
            margin-bottom: 0;
        }
        .paddBoth {
            padding-left: 20px;
            padding-right: 20px;
        }

        .listInfo {
            line-height: 48px;
        }
        .imgInfo {
            display: inline-block;
            width: 80px;
            height: 80px;
            margin-left: 20px;
            padding-top: 5px;
            img {
                max-width: 100%;
            }
        }
        /deep/ .el-table th {
            padding: 0;
        }
        /deep/ .el-select,
        .el-input{
            width: 400px;
        }
        /deep/ .el-row {
            color: #555;
            font-size: 14px;
            >>> .el-col {
                margin-bottom: 10px;
            }
        }
        .normal-style {
            color: #666;
            font-size: 14px;
            line-height: 30px;
        }
        /deep/ .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        /deep/ .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        /deep/ .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 148px;
            height: 148px;
            line-height: 148px;
            text-align: center;
        }
        /deep/ .avatar {
            width: 148px;
            height: 148px;
            display: block;
        }
        .img-box {
            padding: 0 20px;
        }
    }
</style>
