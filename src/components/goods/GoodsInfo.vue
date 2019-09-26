<template>
        <div class="add-good">
            <div class="add-goods">
                    <template>
                        <div class="format-goods">
                            <div class="format-goods-top">
                                <el-radio-group @change="changeFormat" v-model="format">
                                    <el-radio label="1">单规格</el-radio>
                                    <el-radio label="2">多规格</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="format-goods-name">
                                <div>
                                    <el-form label-width="100px" labelPosition="left" :model="tableArr" ref="tableArr">
                                        <el-form-item label="添加规格：">
                                            <el-button 
                                                :size="$size" 
                                                type="primary" 
                                                @click="addSku" 
                                                class="el-icon-plus"
                                                :disabled="format ==='1' && goodsNameList.length>0 || goodsNameList.length >= keyType.length"></el-button>

                                            <div class="goods-name-list">
                                                <div class="" v-for="(list, index) in goodsNameList" :key="index">
                                                    <el-tag 
                                                        closable 
                                                        @close="deleteListName(index)">{{ goodsNameList[index].name }}&nbsp;&nbsp;</el-tag>
                                                    <el-tag 
                                                        type="info"
                                                        v-for="(attr,ind) in goodsNameList[index].attr" 
                                                        :closable="goodsNameList[index].attr.length===1?false:true" 
                                                        :key="ind" 
                                                        @close="deleteAttr(index, ind)">{{ attr }}&nbsp;&nbsp;</el-tag>
                                                    <el-input 
                                                        class="more-select" 
                                                        :size="$size" 
                                                        v-model="goodsNameList[index].value"
                                                        placeholder="继续添加规格选项"></el-input>
                                                    <el-button 
                                                        type="primary" 
                                                        @click="addAttr(index, goodsNameList[index].value)"
                                                        size="mini"><i class="el-icon-plus"></i></el-button>
                                                </div>
                                            </div>
                                            <!--<p style="color: #f00">注：库存价格填写值为-1时，前端页面不展示此规格商品</p>-->
                                        </el-form-item>
                                        <el-form-item label="规格详情：">
                                            <div class="format-goods-detail-right">
                                                <table width="100%" border="0" cellspacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th v-for="title in tableArr.tableHead" :key="title">{{ title }}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(content,indexCon) in tableArr.tableBody" :key="indexCon">
                                                            <td v-for="(item,index) in content.arr" :key="index">{{ item }}</td>
                                                            <!-- 批发预约金 -->
                                                            <td v-if="type">
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.b2bSubscription'" :rules="rules.b2cSubscription">
                                                                    <el-input 
                                                                        :size="$size" 
                                                                        :title="content.b2bSubscription"
                                                                        v-model="content.b2bSubscription"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <!-- 精选预约金 -->
                                                            <td v-if="type">
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.b2cSubscription'" :rules="rules.b2cSubscription">
                                                                    <el-input 
                                                                        :size="$size" 
                                                                        :title="content.b2cSubscription"
                                                                        v-model="content.b2cSubscription"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.b2cPrice'" :rules="rules.b2cPrice">
                                                                    <el-input :size="$size" v-model="content.b2cPrice"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.b2bPrice'" :rules="rules.b2bPrice">
                                                                    <el-input 
                                                                        :size="$size" 
                                                                        :title="content.b2bPrice"
                                                                        v-model="content.b2bPrice"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.price'" :rules="rules.price">
                                                                    <el-input 
                                                                        :size="$size" 
                                                                        :title="content.price"
                                                                        v-model="content.price"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.costPrice'" :rules="!type? rules.costPrice: rules.noCheck">
                                                                    <el-input 
                                                                        :disabled="type"
                                                                        :size="$size" 
                                                                        :title="content.costPrice"
                                                                        v-model="content.costPrice"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <!-- <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.stock'" :rules="rules.stock">
                                                                    <el-input-number 
                                                                        class="add-stock-num"
                                                                        :size="$size" 
                                                                        :title="content.stock"
                                                                        v-model="content.stock"
                                                                        controls-position="right"
                                                                        :min="content.isDefault ===true? 1: -1"></el-input-number>
                                                                </el-form-item>
                                                            </td> -->
                                                            

                                                            <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.weight'" :rules="rules.weight">
                                                                    <el-input :size="$size" v-model="content.weight"></el-input>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item style="margin-bottom: 0" :prop="'tableBody.'+indexCon+'.skuUrl'" :rules="rules.picUrl">
                                                                    <image-upload v-model="content.skuUrl" :more="false" class="img-upload" size="100" sizeUnit="KB">
                                                                        <img v-if="content.skuUrl" :src="content.skuUrl">
                                                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                                        <i v-if="content.skuUrl" style="margin-left: 5px" class="el-icon-view" @click.stop="$viewImage(content.skuUrl)"></i>

                                                                    </image-upload>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-checkbox
                                                                    v-model="content.isDefault" @change="defaultDisplay(indexCon)"></el-checkbox>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </div>

                        <!-- 添加规格 -->
                        <el-dialog title="添加规格" :visible.sync="addVisible" width="500px" class="addvisible">
                            <el-form :model="moreSku" label-width="120px" ref="moreSku" :rules="addFormRules">
                                <el-form-item label="规格名称：" prop="name">
                                    <el-input :size="$size" placeholder="请输入规格名称" v-model.trim="moreSku.name"></el-input>
                                </el-form-item>
                                <el-form-item label="规格选项：">
                                    <div v-for="(item,index) in moreSku.moreSkuAttr" :key="index">
                                        <el-form-item :rules="addFormRules.skuAttr" :prop="'moreSkuAttr.'+index+'.value'">
                                            <el-input v-model.trim="item.value" :size="$size" placeholder="添加规格选项"></el-input>
                                            <i class="el-icon-close" v-if="index>0" @click="deleteSkuAttr(index)"></i>
                                        </el-form-item>
                                    </div>
                                    <el-button :disabled="moreSku.moreSkuAttr.length>=MAX_SIZE? true: false" :size="$size" type="primary" @click="addSkuAttr" icon="el-icon-plus"></el-button>
                                </el-form-item>
                            </el-form>
                            <div class="btn-group">
                                <el-button :size="$size" type="primary" @click="saveSku('moreSku')">确定</el-button>
                                <el-button :size="$size" @click="addVisible=false">取消</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </div>
    </div>
</template>
<script>
    import ImageUpload from '@/components/ImageUpload.vue'

    const keyType = ['A', 'B', 'C'];
    const checkPicUrl = (rule, value, callback) => {
        if(value === '' || value === void 0 || !value) {
            callback(new Error('请添加图片'))
        }else{
            callback();
        }
    }

    let MAX_LIMIT_LENGTH = 7;   //表格限制长度
    const MAX_SIZE = 8;

    export default {
        name: 'addGoods',
        props: {
            value: {
                type: Object
            },
            type: {
                type: Boolean,   //true为大宗，false是普通商品
                default: false
            }
        },
        components: {
            ImageUpload
        },
        data() {
            const checkNum = (rules, value, callback) => {
                console.log(value)
                if(!value) {
                    value===0?callback('不能为0'):callback(new Error('不能为空'))
                }else if(value==='0.0' || value === '0.00' || value==='0') {
                    callback(new Error('不能为0'))
                } else if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/g.test(value)) {
                    callback(new Error('请输入正整数或两位小数'))
                } else {
                    if(value>99999999) {
                        callback(new Error('超出上限99999999'))
                    }else{
                        callback()
                    }
                }
            }
            const checkInteger = (rules, value, callback) => {
                if(!value) {
                    value===0?callback():callback(new Error('不能为空'))
                }else if(!/^[1-9]\d*$/g.test(value)) {
                    callback(new Error(value==='0'?'必须大于0':'必须为正整数'))
                } else if(/\./g.test(value)) {
                    callback(new Error('不能为小数'))
                } else {
                    if(parseInt(value) > 9999999) {
                        callback(new Error('超出上限9999999'))
                    }else{
                        callback();
                    }
                    
                }
            }
            const checkStock = (rules, value, callback) => {
                if(!value) {
                    callback(new Error(value===0?'不能为0':'不能为空'))
                }else if(!/^\-|[1-9]\d*$/g.test(value)) {
                    callback(new Error('必须为整数'))
                } else if(/\./g.test(value)) {
                    callback(new Error('不能为小数'))
                } else {
                    callback()
                }
            }
            //检测大于0的数
            const checkMaxZero = (rules, value, callback) => {
                if(!value){
                    return callback();
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/g.test(value)){
                    return callback(new Error('单价格式不正确'))
                }
                callback();
            }
            const noCheck = (rules, value, call)=> {
                call();
            }
            return {
                MAX_SIZE,
                format: '1',
                keyType,
                formatName: '',
                goodsNameList: [],
                imageUrl: '',
                tableArr: {
                    tableHead: ['零售价格(元)', '批发价格(元)', '原价(元)', '进货价格(元)', '重量(g)', '商品图片(< 100kb)', '默认展示'],//, '库存(件)'
                    tableBody: []
                },
                jsonStr: '',
                skuAttr: [],
                skuAttrValue: [],
                skuTmp:{},
                tableData: {},
                rules: {
                    picUrl: [
                        { required: true, validator: checkPicUrl, trigger: 'change'}
                    ],
                    b2bPrice: [
                        { required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    b2cPrice: [
                        { required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    price: [
                        { required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    costPrice: [
                        { required: true, validator: checkNum, trigger: 'blur' }
                    ],
                    b2cSubscription: [
                        { required: true, validator: checkMaxZero, trigger: 'blur' }
                    ],
                    stock: [
                        { required: true, validator: checkStock, trigger: 'change'}
                    ],
                    weight: [
                        { required: true, validator: checkInteger, trigger: 'change'}
                    ],
                    noCheck: [
                        { validator: noCheck, trigger: 'change' }
                    ]
                },

                //新样式
                addVisible: false,
                moreSku:  {
                    moreSkuAttr: [{value: ""}]
                },
                addFormRules: {
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    skuAttr: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ]
                },
                disabledBtn: false
            }
        },
        methods: {
            deleteListName(index) {
                this.goodsNameList.splice(index, 1);
                this.tableArr.tableHead.splice(index, 1)
                this.skuAttr = []
                if(this.goodsNameList.length===0){this.skuAttrValue=[]}
                this.handleTabContent(true);
            },
            deleteAttr(pIndex, subIndex, value) {
                this.goodsNameList[pIndex].attr.splice(subIndex,1);
                this.skuAttrValue = []
                this.handleTabContent(true);
            },
            addAttr(pIndex, value) {
                if(!value.trim()) {
                    this.$message.error('请填写规格参数');
                    return false;
                }
                let arr = this.goodsNameList[pIndex].attr;
                //不能超过8个
                if(arr.length>=MAX_SIZE) {
                    this.$message.error(`不能超过${MAX_SIZE}`);
                    return false;
                }
                for(let i =0, len= arr.length; i< len; i++){
                    if(value === arr[i]) {
                        this.goodsNameList[pIndex].value = '';
                        this.$message.error('已经有相同的规格，请重新填写');
                        return false;
                    }
                }
                this.goodsNameList[pIndex].attr.push(this.goodsNameList[pIndex].value);
                this.goodsNameList[pIndex].value = '';
                this.handleTabContent(true)
            },
            handleTabContent(bool) {
                let arrA = [];
                let goodsNameList = this.goodsNameList;
                let len = goodsNameList.length;
                if(len ==0){ this.tableArr.tableBody = [];return false}
                for(let i=0; i< len ;i++){
                    arrA[i] = goodsNameList[i].attr;
                }
                if(bool) {
                    this.jsonStr = JSON.stringify(this.tableArr.tableBody)
                }
                let result = this.changeArr(arrA)
                if(bool) {
                    let oldValue = JSON.parse(this.jsonStr);
                    let isFirstShow = true;
                    for(let i =0,lenI = oldValue.length; i< lenI;i ++) {
                        for(let j=0, lenJ = result.length; j< lenJ; j++) {
                            if(result[j].code === oldValue[i].code) {
                                result[j] = oldValue[i]
                                if(oldValue[i].isDefault){isFirstShow=false;}
                            }
                        }
                    }
                    if(result.length>0) {
                        isFirstShow?result[0].isDefault=true:''
                    }
                    this.tableArr.tableBody = result;
                }
                this.sortTableData()
            },
            sortTableData() {
                this.skuAttr = [];
                for(let i=0, len = this.goodsNameList.length; i <len ;i++ ) {
                    let obj = {
                        name: this.goodsNameList[i].name,
                        key: keyType[i],
                        attrValues: []
                    }
                    for(let j=0, lenJ = this.goodsNameList[i].attr.length; j< lenJ; j++) {
                        let name = this.goodsNameList[i].attr[j];
                        let key = keyType[i]+j
                        obj.attrValues[j] = {
                            name: name,
                            code: key
                        }
                        this.skuTmp[name] = key;
                    }
                    if(obj.attrValues.length>0){
                        this.skuAttr.push(obj)
                    }
                }
                let oldTableBody = JSON.stringify(this.tableArr.tableBody);
                let tableBody = JSON.parse(oldTableBody);
                for(let i =0,len = tableBody.length; i< len; i++) {
                    let tableBodyArr = tableBody[i].code.split("|");
                    for(let j=0,lenJ = tableBodyArr.length; j< lenJ; j++) {
                        tableBodyArr[j] = this.skuTmp[tableBodyArr[j]]
                    }
                    tableBody[i].code = tableBodyArr.join("|");
                    let obj = {
                        b2bPrice: this.$math.multip(tableBody[i].b2bPrice, 100),
                        b2cPrice: this.$math.multip(tableBody[i].b2cPrice, 100),
                        price: this.$math.multip(tableBody[i].price, 100),
                        isDefault: tableBody[i].isDefault,
                        costPrice: this.$math.multip(tableBody[i].costPrice, 100),
                        // stock: tableBody[i].stock,
                        code: tableBody[i].code,
                        name: tableBody[i].arr.reverse().join("|"),
                        skuUrl: tableBody[i].skuUrl,
                        weight: tableBody[i].weight
                    }
                    if(this.type) {
                        obj.b2bSubscription = this.$math.multip(tableBody[i].b2bSubscription, 100);
                        obj.b2cSubscription = this.$math.multip(tableBody[i].b2cSubscription, 100);
                    }
                    this.skuAttrValue[i] = obj;
                }
                this.tableData.skuAttr = this.skuAttr
                this.tableData.skuAttrValue = this.skuAttrValue
                this.tableData.isSingleSpec = this.format
                this.$emit('input', this.tableData)
            },
            handleAvatarSuccess(response, file, fileList) {
                this.handleTabContent(true)
            },
            changeFormat(value) {
                if(value === '1' && this.goodsNameList.length>1) {
                    this.format = '2';
                    this.$message.error('当前为多规格模式，请删除多余规格。')
                    return false;
                }
            },
            defaultDisplay(index) {
                let jsonStr = JSON.stringify(this.tableArr.tableBody)
                let arr = JSON.parse(jsonStr)
                for(let i=0, len = arr.length; i <len; i++) {
                    if(i === index) {
                        arr[i].isDefault = true;
                    }else {
                        arr[i].isDefault = false;
                    }
                }
                this.tableArr.tableBody = arr;
                this.sortTableData()
            },
            validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['tableArr'].validate((valid) => {
                        if (valid && this.skuAttrValue.length != 0) {
                            resolve(true);
                        } else {
                            reject(false);
                            return false;
                        }
                    });
                })
                
            },
            /**
             * 数组交叉组合
             */
            groupMix(){
                var heads=arguments[0];
                for(var i=1,len=arguments.length;i<len;i++){
                    if(arguments[i].length){
                        heads=this.addNewArr(heads,arguments[i]);
                    }
                }
                return heads;
            },
            addNewArr(heads,choices){
                var result=[];
                for(var i=0,len=heads.length;i<len;i++){
                    for(var j=0,lenj=choices.length;j<lenj;j++){
                        result.push(heads[i]+'|'+choices[j]);
                    }
                }
                return result;
            },
            toArr(result){
                let arr = []
                for(var i=0,len=result.length;i<len;i++){
                    let obj = {
                        arr:result[i].split('|'),
                        code: result[i],
                        // stock: 1,
                        costPrice: "",
                        weight: '',
                        b2bPrice: "",
                        b2cPrice: "",
                        price: "",
                        skuUrl: "",
                        isDefault: i==0?true:false
                    }
                    if(this.type) {
                        obj.b2bSubscription = "";
                        obj.b2cSubscription = "";
                    }
                    arr.push(obj);

                }
                return arr;
            },
            changeArr(arr) {
                return this.toArr(this.groupMix(...arr))
            },
            //处理回显数据
            handleData(result) {
                console.log(JSON.stringify(result))
                this.format = result.isSingleSpec.toString();
                let attrList = result.skuAttr.attrList,
                    arr = [];
                if(attrList){
                    //判断是否是大宗商品
                    for(let i =0, len=attrList.length; i<len; i++){
                        this.tableArr.tableHead.unshift(attrList[len-1-i].name)
                        arr[i] = {
                            name: attrList[i].name,
                            value: '',
                            attr: attrList[i].attrValues.map(obj=> {
                                return obj.name
                            })
                        }
                    }
                    this.goodsNameList = arr;

                    this.handleTabContent(true);
                }
                this.renderEditData(result.skuAttrValue);
            },
            //渲染回显数据到表格中
            renderEditData(result) {
                let tableBody = this.tableArr.tableBody;
                for(let i = 0, len = result.length; i< len; i++){
                    tableBody[i].b2bPrice = this.$math.divide(result[i].b2bPrice, 100);
                    tableBody[i].b2cPrice = this.$math.divide(result[i].b2cPrice, 100);
                    tableBody[i].price = this.$math.divide(result[i].price, 100);
                    tableBody[i].costPrice = this.$math.divide(result[i].costPrice, 100);
                    tableBody[i].isDefault = result[i].isDefault==1?true: false;
                    tableBody[i].skuUrl = result[i].skuUrl;
                    tableBody[i].weight = result[i].weight;

                    if(this.type) {
                        tableBody[i].b2bSubscription = result[i].b2bSubscription? this.$math.divide(result[i].b2bSubscription, 100): '';
                        tableBody[i].b2cSubscription = result[i].b2cSubscription? this.$math.divide(result[i].b2cSubscription, 100): '';
                    }
                    // tableBody[i].stock = result[i].stock;
                }
            },
            //新样式
            addSku() {
                this.moreSku=  {
                    moreSkuAttr: [{value: ""}]
                }
                if(this.format ==='1' && this.goodsNameList.length>0) {
                    this.formatName = "";
                    this.$message.error(`当前为单规格模式，只能选择一种规格`)
                    return false
                }
                if(this.goodsNameList.length >= keyType.length) {
                    this.formatName = "";
                    this.$message.error(`最多支持${keyType.length}种规格名称`);
                    return false;
                }
                this.$refs['moreSku']?this.$refs['moreSku'].resetFields():""
                this.addVisible = true;
            },
            //新增属性
            addSkuAttr() {
                this.moreSku.moreSkuAttr.push({value: ""})
            },
            //删除属性
            deleteSkuAttr(index) {
                this.moreSku.moreSkuAttr.splice(index, 1)
            },
            saveSku(formName) {
                //检测是否有相同规格的属性
                let goodsName = this.goodsNameList;
                for(let i =0, len = goodsName.length; i< len; i++) {
                    if(this.moreSku.name === goodsName[i].name) {
                        this.formatName = "";
                        this.$message.error('已经有相同的规格名称，请重新填写');
                        return false;
                    }
                }
                let _arr = [];
                this.moreSku.moreSkuAttr.forEach((item, index, arr)=>{
                    _arr[index] = item.value;
                })
                let newSrr = Array.from(new Set(_arr));
                //不能超过8个
                if(newSrr.length>MAX_SIZE) {
                    this.$message.error(`不能超过${MAX_SIZE}`);
                    return false;
                }
                if(_arr.length!=newSrr.length) {
                    this.$message.error('请勿设置相同的规格属性，请重新填写');
                    return false;
                }
                this.$refs[formName].validate(v=>{
                    if(v){
                        let result = this.moreSku.moreSkuAttr;
                        let attr = []
                        for(let i =0, len = result.length; i<len; i++) {
                            attr[i] = result[i].value;
                        }
                        this.goodsNameList.push({
                            name: this.moreSku.name,
                            value: '',
                            attr: attr
                        });
                        this.tableArr.tableHead.length===MAX_LIMIT_LENGTH
                            ? this.tableArr.tableHead.unshift(this.moreSku.name)
                            : this.tableArr.tableHead.splice(this.tableArr.tableHead.length-MAX_LIMIT_LENGTH, 0, this.moreSku.name);
                        this.formatName = "";
                        this.addVisible = false;
                        this.handleTabContent(true);
                    }else{
                        return false;
                    }
                })
            }
        },
        watch: {
            tableArr: {
                handler(val, oldVal) {
                    this.$nextTick(()=>{
                        this.sortTableData();
                    })
                },
                deep: true
            },
            value(val, old) {
                this.handleData(val)
            },
            type(val) {
                //大宗商品
                if(val) {
                    if(this.tableArr.tableHead.indexOf('精选预约金(元)')< 0) {
                        this.tableArr.tableHead.splice(-7, 0, '批发预约金(元)', '精选预约金(元)');
                        MAX_LIMIT_LENGTH += 2;
                    }
                }else{
                    this.tableArr.tableHead.splice(-9, 2);
                    MAX_LIMIT_LENGTH -= 2;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .add-goods{
        display: flex;
        .el-icon-close:hover {
            cursor: pointer;
        }
        /deep/ .addvisible {
            .el-form-item {
                margin-bottom: 15px
            }
        }
    }
    .format-goods{
        width: 100%;
        background-color: #fff;
        padding: 10px;
        box-sizing: border-box;
    }
    .add-good .el-form--inline .el-form-item {
        width: 100%;
        display: flex;
    }
    .add-good .el-form-item {
        margin-bottom: 0;
    }
    .el-form-item__content{
        flex: 1;
    }
    .format-goods-name .el-input{
        width: 250px;
    }
    .goods-name-list{
        margin: 10px 0 0;
    }
    .goods-m-r {
        margin-right: 20px
    }
    .more-select {
        width: 150px!important;
        margin-left: 20px;
    }
    .goods-name-list .el-tag {
        margin: 0 5px;
    }
    .goods-name-list .el-tag:first-child {
        margin: 0 5px 0 0;
    }
    .format-goods-detail {
        display: flex;
        margin-top: 10px;
    }
    .format-goods-detail-left{
        width: 90px;
    }
    .format-goods-detail-right {
        flex: 1
    }
    .format-goods-detail-title {
        border-bottom: 1px solid rgba(144, 147, 153, 0.1)
    }
    .format-goods-detail-list span,
    .format-goods-detail-title span{
        padding: 0 30px;
        display: inline-block
    }
    .format-goods-detail-title .goods-price,
    .format-goods-detail-title .goods-store,
    .format-goods-detail-title .goods-pic {
        padding: 0 40px;
    }
    .format-goods-detail-right{
        th,
        td {
            text-align: center;
            border-bottom: 1px solid rgba(193, 170, 170, 0.5);
        }
        td {
            padding: 20px 0;
        }
        .el-form-item__error{
            padding-left: 20px;
            left: 15px;
        }
    }
    .add-good .format-goods-detail-right{
        .el-input {
            width: 90px;
        }
        .add-stock-num .el-input{
            width: 100%
        }
    } 
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: #fff;
    }
    .add-good .avatar-uploader .el-upload {
        width: 40px;
        height: 40px;
    }
    .el-upload {
        top: 8px;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .img-upload .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
    }
    .img-upload .avatar {
        width: 40px;
        height: 40px;
        display: block;
    }
    .img-upload img{
        width: 40px;
        height: 40px;
    }
</style>
