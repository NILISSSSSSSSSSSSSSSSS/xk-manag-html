<template>
    <div class="xk-container prizes-add-list">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>{{ $route.query.id? "编辑奖品": "新增奖品" }}
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :label-width="formLabelWidth" :model="ruleForm" :rules="rules" ref="ruleForm">
                <!-- 公共部分   start       -->
                <el-form-item label="奖品ID：" v-if="prizesId!=''">{{prizesId}}</el-form-item>
                <el-form-item label="奖品名称：" prop="name" :rules="rules.name">
                    <el-input :size="$size" v-model="ruleForm.name" placeholder="请输入奖品名称"></el-input>
                </el-form-item>
                <el-form-item label="奖品价格：" v-if="ruleForm.type =='substance'" prop="realAttr.originalValue" :rules="rules.originalValue">
                    <el-input :size="$size" v-model.trim="ruleForm.realAttr.originalValue" placeholder="请选择消费券价格"></el-input>
                </el-form-item>
                <el-form-item label="晒单后奖励：" class="m-b-0" v-if="ruleForm.commentAward.type">
                    <el-row>
                        <el-col :span="2">
                            <el-radio v-model="ruleForm.commentAward.type" :label="'voucher'">消费券</el-radio>
                        </el-col>
                        <el-col :span="21">
                            <el-form-item :prop="'commentAward.jf'" :rules="rules.jf">
                                <el-input :size="$size" placeholder="请填写消费券金额" v-model.number="ruleForm.commentAward.jf"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            <el-radio v-model="ruleForm.commentAward.type" :label="'aa_lottery'">AA彩票</el-radio>
                        </el-col>
                        <el-col :span="21">
                            <el-form-item :prop="'commentAward.aa'" :rules="rules.aa">
                                <el-input :size="$size" placeholder="请填写赠送彩票张数" v-model.trim="ruleForm.commentAward.aa"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="奖品用途：">
                    <el-select :size="$size" v-model="ruleForm.usage">
                        <el-option v-for="item in EnumUsage" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中奖后是否需要分享：" prop="isFreeShare">
                    <el-radio-group v-model="ruleForm.isFreeShare">
                        <el-radio label="1">需要</el-radio>
                        <el-radio label="0">不需要</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 公共部分      stop     -->

                <!-- 自营商城关联的自营商品 -->
                <el-form-item label="关联的自营商品：" v-if="ruleForm.usage == 'shop'">
                    <el-input v-model="ruleForm.mallGoods" 
                              :size="$size" 
                              placeholder="请输入自营商城奖品ID" 
                              @blur="getMallName(ruleForm.mallGoods)"></el-input>&nbsp;&nbsp;&nbsp;{{ mallName }}
                </el-form-item>

                <el-form-item label="奖品类型：" prop="type">
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio label="substance">实物</el-radio>
                        <el-radio label="virtual" v-if="ruleForm.usage != 'welfare' &&ruleForm.usage !=='competition'">虚拟</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="开奖后未中奖返还消费券：" v-if="ruleForm.usage=='welfare'">
                    <el-radio-group v-model="ruleForm.isReturnWhenLost">
                        <el-radio :label="1">返还</el-radio>
                        <el-radio :label="0">不返还</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="奖品分类：" :prop="'realAttr.categoryCode'" v-if="ruleForm.type === 'substance'" :rules="rules.categoryCode">
                    <el-select :size="$size" placeholder="请选择产品分类" v-model="ruleForm.realAttr.categoryCode">
                        <el-option v-for="(value,index) in priClass" :key="index" :label="value.name" :disabled="value.enable==1? false: true"
                                   :value="value.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单品ID限购次数：" v-if="ruleForm.usage==='welfare' && ruleForm.type==='substance'">
                    <el-col :span="2">
                        <el-radio v-model="ruleForm.purchaseNumberType" :label="-1">不限</el-radio>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="1">
                            <el-radio v-model="ruleForm.purchaseNumberType" :label="1"></el-radio>
                        </el-col>
                        <el-col :span="18">
                            <el-form-item prop="purchaseNumber" class="m-b-0">
                                <el-input :size="$size" placeholder="10" v-model="ruleForm.purchaseNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="虚拟奖品类型：" v-if="ruleForm.type !== 'substance'">
                    <el-select v-model="ruleForm.virtualAttr.virtualType" :size="$size">
                        <el-option v-for="(item,index) in EnumVirtualType" :key="index" :value="item.key" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                        prop="virtualMaxPrice" 
                        :label="`请输入${ruleForm.virtualAttr.virtualType==='aa_card'? 'AA卡金额上限': ruleForm.virtualAttr.virtualType==='free_card' ? '免单卡金额上限': ruleForm.virtualAttr.virtualType==='money_car'? '现金大奖': 'AA彩票'}：`" 
                        v-if="ruleForm.type !== 'substance' && ruleForm.virtualAttr.virtualType !== 'aa_lottery'">
                    <el-input v-model="ruleForm.virtualMaxPrice" :size="$size" :placeholder="`请输入${ruleForm.virtualAttr.virtualType==='aa_card'? 'AA卡金额上限': ruleForm.virtualAttr.virtualType==='free_card' ? '免单卡金额上限': ruleForm.virtualAttr.virtualType==='money_car' ?'现金大奖金额': 'AA彩票'}`"></el-input>
                </el-form-item>
                <el-form-item label="商品图片：" v-if="ruleForm.type === 'virtual'" >
                    <div class="img-list-goods">
                        <el-form-item label-width="0" :prop="'virtualAttr.mainPic'" :rules="rules.mainPic">
                            <image-upload v-model="ruleForm.virtualAttr.mainPic" :more="false">
                                <img v-if="ruleForm.virtualAttr.mainPic" :src="ruleForm.virtualAttr.mainPic" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </image-upload>
                        </el-form-item>
                    </div>
                </el-form-item>
                
                <!-- 实物奖品   开始 -->
                <el-form-item label="奖品品牌：" :prop="'realAttr.brandName'" v-if="ruleForm.type === 'substance'" :rules="rules.brandName">
                    <el-input :size="$size" v-model.trim="ruleForm.realAttr.brandName" placeholder="请输入奖品品牌"></el-input>
                </el-form-item>
                <el-form-item label="奖品缩略图：" prop="microPic">
                    <image-upload v-model="ruleForm.microPic" :more="false" size="2">
                        <img v-if="ruleForm.microPic" :src="ruleForm.microPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                    <p><span class="xk-danger">*  </span>提示：图片建议尺寸为168*98，大小不超过2M</p>
                </el-form-item>
                <el-form-item label="上传商品图片：" :prop="'realAttr.showPics'" v-if="ruleForm.type === 'substance'" :rules="rules.showPics">
                    <image-upload uploadNumber="5" size="3" :draggable="true" v-model="ruleForm.realAttr.showPics"></image-upload>
                    <p><span class="xk-danger">*  </span>提示：图片建议尺寸为1137*1137，大小不超过3M，商品图片至少一张，最多5张，图片可拖拽调整顺序</p>
                </el-form-item>

                <el-form-item label="规格设置：" v-if="ruleForm.type === 'substance'">
                    <el-card class="box-card">
                        <el-form-item label="规格名称：" :prop="'realAttr.specInfo'" label-width="120px" :rules="rules.specInfo">
                            <el-input :size="$size" v-model.trim="ruleForm.realAttr.specInfo" placeholder="请输入规格名称"></el-input>
                        </el-form-item>
                        <el-form-item label="奖品重量：" :prop="'realAttr.weight'" label-width="120px" :rules="rules.integer">
                            <el-input :size="$size" v-model.trim="ruleForm.realAttr.weight" placeholder="请输入奖品重量"></el-input>&nbsp;&nbsp;单位（g）
                        </el-form-item>
                    </el-card>
                </el-form-item>
                <el-form-item label="奖品简介：" prop="description">
                    <el-input :size="$size" v-model.trim="ruleForm.description" placeholder="请输入奖品简介" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                
                <el-form-item label="奖品详情：" prop="detailPics">
                    <u-e v-model="ruleForm.detailPics" style="width: 1000px;height: 550px;"></u-e>
                </el-form-item>
                <div class="dialog-footer marintop20">
                    <template v-if="!from">
                        <el-button :loading="saveLoading" :disabled="saveLoading" :size="$size" type="danger" @click="submitForm('ruleForm')">保存</el-button>
                        <router-link to="/prizesList" v-if="prizesId!=''">
                            <el-button :size="$size" type="primary">取消</el-button>
                        </router-link>
                        <router-link to="/prizesAdd" v-else>
                            <el-button :size="$size" type="primary">返回</el-button>
                        </router-link>
                    </template>
                    <template v-else>
                        <el-button :size="$size" type="primary" @click="$router.go(-1)">返回上一页</el-button>
                    </template>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    //枚举彩票类型
    import { EnumLottery,EnumTicketType,EnumUsage,EnumVirtualType } from '@/util/publicParams.js';
    import ImageUpload from "../../../../components/ImageUpload.vue";
    import XkFormItem from '../../../../components/common/XKFormItem.vue';
    import UE from '@/components/UE.vue'

    export default {
        name: 'prizesaddList',
        components: {
            ImageUpload,
            UE,
            XkFormItem
        },
        data() {
            const checkGoodsPic = (rule, value, call)=> {
                if(value===void 0 || value === '' || value.length==0){
                    call(new Error('商品图片不能为空'))
                }else{
                    call();
                }
            }
            const checkNum = (rule, value, call)=>{
                if(!value){
                    return call(new Error('不能为空'))
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)){
                    return call(new Error('请填写大于等于0的数字，或小数格式不正确。'))
                }
                if(value=='0.00' || value== '0.0') {
                    return call(new Error(`不能为${value}`));
                }
                call();
            }
            const checkInteger = (rule, value, call)=>{
                if(!value){
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)){
                    return call(new Error('请填写大于0的数字。'))
                }
                call();
            }
            return {
                EnumVirtualType,
                EnumUsage,
                EnumTicketType,
                mallName: '',  //自营商城的商品名称
                prizesId: '',                       //奖品ID
                isShow: true,                //图片上传组件
                formLabelWidth: '270px',
                priClass: [],                //产品类别
                ruleForm: {                //表单数据
                    isReturnWhenLost: 1,
                    purchaseNumberType: -1,
                    // adaptObject: "user",
                    type: 'substance',
                    usage: 'expense',
                    virtualType: EnumVirtualType[0].key,
                    realAttr: {},   //实物virtualAttr.
                    virtualAttr: {  //虚拟奖品
                        cashPrize: {},
                        freeCard: {},
                        aaCard: {},
                        virtualType: 'aa_card'
                    },
                    commentAward: {
                        type: 'voucher'
                    },   //晒单
                    isFreeShare: '0'
                },
                rules: {
                    integer: [
                        { required: true, validator: this.integer, trigger: 'blur' }
                    ],
                    name: [
                        {required: true, message: '请输入奖品名称', trigger: 'blur'},
                        {max: 50, message: '请输入奖品名称，50字以内', trigger: 'blur'}
                    ],
                    categoryCode: [
                        {required: true, message: '请选择奖品类别', trigger: 'change'}
                    ],
                    brandName: [
                        {required: true, message: '请输入奖品品牌', trigger: 'blur'}
                    ],
                    showPics: [
                        { required: true, validator: checkGoodsPic, trigger: 'change'}
                    ],
                    specInfo: [
                        {required: true, message: '请输入规格名称', trigger: 'blur'},
                    ],
                    originalValue: [
                        {required: true, validator: checkNum, trigger: 'blur'},
                    ],
                    detailPics: [
                        { required: true, message: '奖品描述不能为空', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    returnPrice: [
                        {required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    virtualMaxPrice: [
                        {required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    purchaseNumber: [
                        { validator: (rule, value, call)=>{
                            if(this.ruleForm.purchaseNumberType=='-1'){
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
                            if(this.ruleForm.commentAward.type=='voucher') {
                                if(!value){
                                    return call(new Error(value===0?'不能为0':'不能为空'))
                                }
                                if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                                    return call(new Error('消费券数量格式不正确'))
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
                            if(this.ruleForm.commentAward.type=='aa_lottery') {
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
                    vpt4AutoTransfer: [
                        { required: true, validator: checkInteger, trigger: 'blur' }
                    ],
                    sec4AutoGenerateNum: [
                        { required: true, validator: checkInteger, trigger: 'blur' }
                    ],
                    sec4AutoTransfer: [
                        { required:true, validator: checkInteger, trigger: 'blur' }
                    ],
                    mainPic: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, min: 1, max: 51, message: '请输入1-50字', trigger: 'blur' }
                    ],
                    microPic: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    isFreeShare: [
                        { required: true, message: '不能为空', trigger: 'change' }
                    ]
                },
                saveLoading: false,
                from: ''       //从财务管理跳转过来
            }
        },
        mounted() {
            this.from = this.$route.query.from;
            this.prizesId = this.$route.query.id ? this.$route.query.id : '';
            this.prizesClass();
        },
        methods: {
            integer(rule, value, call) {
                if(!value) {
                    return call(new Error(value===0? '不能为0':'不能为空'))
                }
                
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                return call();
            },
            //获取奖品类别
            prizesClass() {
                this.$http.get(this.$api. queryJFCategory, {}, true
                ).then((res) => {
                    this.priClass = res;
                    this.getPrizes();
                }).catch(err => {
                    this.$message.error(err.message);
                    this.getPrizes();
                });
            },
            //编辑，获取详情内容
            getPrizes() {
                if (this.prizesId != '') {
                    let data = {
                        jGoodsId: this.prizesId,
                    };
                    this.$http.get(this.$api.jfmallGoodsDetail4Manager, data, true).then(res => {
                        this.ruleForm = this.handleDetail(res);
                    }).catch(err => {
                        this.$message.error(err.message);
                    });
                } else {
                    return false;
                }
            },
            //处理返回来的详情数据结构
            handleDetail(item) {
                let obj = {
                    name: item.name,   //奖品名称
                    type: item.type,   //奖品类型
                    usage: item.usage,   //奖品用途
                    isReturnWhenLost: item.isReturnWhenLost,   //开奖后未中奖返还消费券
                    commentAward: {
                        type: item.commentAward ? item.commentAward.type : ''
                    },
                    detailPics: item.detailPics,
                    microPic: item.microPic,
                    description: item.description,
                    isFreeShare: item.isFreeShare!==null&&item.isFreeShare!==undefined? item.isFreeShare+'': '1'
                }
                if(item.commentAward) { // 商户上传商品没有晒单信息
                    obj.commentAward.type==='aa_lottery'? obj.commentAward.aa = item.commentAward.count: obj.commentAward.jf = this.$math.divide(item.commentAward.count, 100);
                }
                // obj.commentAward.type==='aa_lottery'? obj.commentAward.aa = item.commentAward.count: obj.commentAward.jf = this.$math.divide(item.commentAward.count, 100);
                obj.realAttr = {};
                obj.virtualAttr = {
                    cashPrize: {},
                    freeCard: {},
                    aaCard: {},
                    virtualType: 'aa_card'
                }
                //实物
                if(item.type === 'substance') {
                    if(item.usage === 'welfare') {
                        // obj.adaptObject = item.adaptObject
                        item.purchaseNumber>0? (obj.purchaseNumber = item.purchaseNumber, obj.purchaseNumberType = 1): obj.purchaseNumberType = -1;
                    }
                    obj.realAttr.categoryCode = item.realAttr.categoryCode;
                    obj.realAttr.brandName= item.realAttr.brandName;  //品牌名称
                    obj.realAttr.specInfo= item.realAttr.specInfo;   //规格
                    obj.realAttr.brandName= item.realAttr.brandName;     //奖品品牌
                    obj.realAttr.originalValue= this.$math.divide(item.realAttr.originalValue, 100);     //奖品价格
                    obj.realAttr.showPics = item.realAttr.showPics;    //上传图片
                    obj.realAttr.weight = item.realAttr.weight;
                }else{//虚拟
                    obj.virtualAttr = {
                        mainPic: item.virtualAttr.mainPic
                    };
                    // obj.adaptObject= item.adaptObject;
                    obj.virtualAttr.virtualType	= item.virtualAttr.virtualType;   //虚拟奖品类型
                    //aa卡
                    if(item.virtualAttr.virtualType === 'aa_card') {
                        obj.virtualMaxPrice = this.$math.divide(item.virtualAttr.aaCard.maxAmount, 100)
                    }
                    //免单卡
                    if(item.virtualAttr.virtualType === 'free_card'){
                        obj.virtualMaxPrice = this.$math.divide(item.virtualAttr.freeCard.maxAmount, 100)
                    }
                    //现金奖
                    if(item.virtualAttr.virtualType === 'money_car'){
                        obj.virtualMaxPrice = this.$math.divide(item.virtualAttr.cashPrize.amount ,100)
                    }
                }
                return obj;
            },
            //新增/编辑，提交表单
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = {
                            goods: this.createParam()
                        };
                        console.log(JSON.stringify(data))
                        this.saveLoading = true;
                        this.$http.post(this.prizesId? this.$api.jfmallGoodsUpdate4Manager: this.$api.jfmallGoodsCreate4Manager, data, true).then((res) => {
                            this.$message({
                                type: 'success',
                                message: '已提交!',
                            });
                            this.className = sessionStorage.removeItem('className');
                            this.clickIndex= sessionStorage.removeItem('subIndex');
                            this.saveLoading = false;
                            this.$router.push('prizesList');
                        }).catch(err => {
                            this.$message.error(err.message)
                            this.saveLoading = false;
                        });
                    } else {
                        this.$nextTick(()=>{
                            
                            let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                            $('.xk-container').animate({
                                scrollTop: num - 90
                            }, 500)                            
                        })
                        return false;
                    }
                })
            },
            //构建提交参数
            createParam() {
                let obj = {
                    name: this.ruleForm.name,   //奖品名称
                    type: this.ruleForm.type,   //奖品类型
                    usage: this.ruleForm.usage,   //奖品用途
                    isReturnWhenLost: this.ruleForm.isReturnWhenLost,   //开奖后未中奖返还消费券
                    commentAward: {
                        type: this.ruleForm.commentAward.type,
                        count: this.ruleForm.commentAward.type==='voucher'? this.$math.multip(this.ruleForm.commentAward.jf, 100): this.ruleForm.commentAward.aa
                    },
                    detailPics: this.ruleForm.detailPics,
                    from: 'jf_mall',
                    microPic: this.ruleForm.microPic,
                    description: this.ruleForm.description,
                    isFreeShare: this.ruleForm.isFreeShare
                };
                this.prizesId? obj.id=this.prizesId: null;
                
                //实物
                if(this.ruleForm.type === 'substance') {
                    obj.realAttr = {};
                    if(this.ruleForm.usage === 'welfare') {
                        obj.purchaseNumber = this.ruleForm.purchaseNumberType === -1 ? -1: this.ruleForm.purchaseNumber;
                        // obj.adaptObject = this.ruleForm.adaptObject
                    }
                    obj.realAttr.categoryCode = this.ruleForm.realAttr.categoryCode;   //奖品分类
                    obj.realAttr.brandName= this.ruleForm.realAttr.brandName;  //品牌名称
                    obj.realAttr.specInfo= this.ruleForm.realAttr.specInfo;   //规格
                    obj.realAttr.brandName= this.ruleForm.realAttr.brandName;     //奖品品牌
                    obj.realAttr.originalValue= this.$math.multip(this.ruleForm.realAttr.originalValue, 100);     //奖品价格
                    obj.realAttr.showPics = this.ruleForm.realAttr.showPics;    //上传图片
                    obj.realAttr.weight = this.ruleForm.realAttr.weight;      //重量
                    obj.virtualAttr = {}
                    return obj;
                }else{
                    //虚拟
                    obj.virtualAttr = {
                        mainPic: this.ruleForm.virtualAttr.mainPic
                    };
                    // obj.adaptObject= this.ruleForm.adaptObject;
                    obj.virtualAttr.virtualType	= this.ruleForm.virtualAttr.virtualType;   //虚拟奖品类型
                    //判断虚拟奖品类型
                    //aa卡
                    if(this.ruleForm.virtualAttr.virtualType === 'aa_card') {
                        obj.virtualAttr.aaCard = {
                            maxAmount: this.$math.multip(this.ruleForm.virtualMaxPrice, 100)
                        }
                    }
                    //免单卡
                    if(this.ruleForm.virtualAttr.virtualType === 'free_card'){
                        obj.virtualAttr.freeCard = {
                            maxAmount: this.$math.multip(this.ruleForm.virtualMaxPrice, 100)
                        }
                    }
                    //现金奖
                    if(this.ruleForm.virtualAttr.virtualType === 'money_car'){
                        obj.virtualAttr.cashPrize = {
                            amount:this.$math.multip(this.ruleForm.virtualMaxPrice, 100)
                        }
                    }
                }
                obj.realAttr

                return obj;
            },
            /**
             * 获取自营商城商品名称
             */
            getMallName(id) {
                if(!id) return false;
                this.$http.get(this.$api.goodsOnSaleQPage,{condition: {id: id}, page:1, limit:1}, true).then(res=>{
                    this.mallName = res? '商品名称：'+res.data[0].name: "未找到相关商品";
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        watch: {
            "ruleForm.usage": {
                handler(val) {
                    if(val==='welfare') { 
                        this.ruleForm.type='substance';
                        if(!this.ruleForm.purchaseNumberType) {
                            this.ruleForm.purchaseNumberType = -1;
                        }
                    }
                },
                deep: true
            }
        }
    }
</script>
<style lang='scss' scoped>
    @import "./prizesAddList.scss";
</style>