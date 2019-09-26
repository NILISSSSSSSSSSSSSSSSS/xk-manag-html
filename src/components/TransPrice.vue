<template>
    <el-dialog :title="'新建运费模板'" :visible.sync="visibleDialog" width="1100px" top="30px" :before-close="close">
        <div class="trans-price">
            <el-form :label-position="labelPosition" :label-width="formLabelWidth" :model="freighForm" :rules="rules"
                            ref="freighForm">
                    <el-form-item label="模板名称：" prop="templateName" class="tmpName">
                        <el-input :size="$size" v-model="freighForm.templateName" placeholder="请输入运费模板名称"></el-input>
                    </el-form-item>
                    <el-form-item label="发货地址：" prop="address">
                        <div style="width:60%;">
                            <province-cascader v-model="freighForm.address"></province-cascader>
                        </div>
                    </el-form-item>
                    <el-form-item label="发货时间：" prop="deliveryTime">
                        <el-select v-model="freighForm.deliveryTime" placeholder="请选择发货时间" :size="$size">
                            <el-option label="4小时之后" value="0"></el-option>
                            <el-option label="6小时之后" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计价方式：" required>
                        <el-radio-group v-model="freighForm.valuateType">
                            <el-radio label="0">按件数</el-radio>
                            <el-radio label="1">按重量</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="运送方式：" required>
                        <el-radio-group v-model="freighForm.postType">
                            <el-radio label="0">快递</el-radio>
                            <el-radio label="1">晓可自营物流</el-radio>
                        </el-radio-group>
                        <el-card class="box-card">
                            <div class="trans-way line">
                                <el-form :inline="true" :model="freighForm" ref="freighForm2">
                                    <el-form-item label="默认运费：" prop="defaultNum" :rules="rules.inputNumDef">
                                        <el-input class="num" :size="$size" v-model="freighForm.defaultNum" placeholder="1"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="`${freighForm.valuateType==0? '件': 'KG'}`" prop="defaultFee" :rules="rules.inputPriceDef">
                                        <el-input class="price" :size="$size" v-model="freighForm.defaultFee" placeholder="10"></el-input>
                                    </el-form-item>
                                    <el-form-item label="元，每增加" prop="increNum" :rules="rules.inputNumDef">
                                        <el-input class="num" :size="$size" v-model="freighForm.increNum" placeholder="1"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="`${freighForm.valuateType==0? '件': 'KG'}，增加运费`" prop="increFee" :rules="rules.inputPriceDef">
                                        <el-input class="price" :size="$size" v-model="freighForm.increFee" placeholder="1"></el-input>
                                    </el-form-item>
                                    <el-form-item label="元。"></el-form-item>
                                </el-form>
                            </div>
                            <div class="line">
                                <el-button :size="$size" type="danger" :disabled="deleteAllDisabled" @click="deleteSelect">全部删除</el-button>
                                <el-button :disabled="freighForm.tableData3[0] 
                                                      && freighForm.tableData3[0].destCities[0]
                                                      && freighForm.tableData3[0].destCities[0].split('|')[0]=='000000'
                                ? true :false " :size="$size" type="primary" @click="addAddress">新增</el-button>
                            </div>
                            <div>
                                <el-form :model="freighForm" ref="tableForm" label-width="1">
                                    <el-table
                                        ref="multipleTable"
                                        :data="freighForm.tableData3"
                                        tooltip-effect="dark"
                                        style="width: 100%"
                                        @selection-change="handleSelectionChange">
                                        <el-table-column
                                            type="selection"
                                            width="35px">
                                        </el-table-column>
                                        <el-table-column
                                            label="运送到"
                                            width="220">
                                            <template slot-scope="scope">
                                                <span v-for="(destFees, index) in scope.row.destCities" :key="destFees.code">{{ destFees.split("|")[1] }}{{ scope.row.destCities.length-1===index?"":"，" }}</span>
                                                <el-button type="text" @click="editTabelData(scope.row.destCities, scope.$index)">编辑</el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column :label="`${freighForm.valuateType==0? '首件数（件）': '首重（KG）'}`">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'tableData3.' + scope.$index + '.defaultNum'" :rules='rules.inputNum'>
                                                    <el-input :size="$size" v-model="scope.row.defaultNum" placeholder="1"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="首费（元）">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'tableData3.' + scope.$index + '.defaultFee'" :rules='rules.inputPrice'>
                                                    <el-input :size="$size" v-model="scope.row.defaultFee" placeholder="10"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column :label="`${freighForm.valuateType==0? '续件数（件）': '续重（KG）'}`">
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'tableData3.' + scope.$index + '.increNum'" :rules='rules.inputNum'>
                                                    <el-input :size="$size" v-model="scope.row.increNum" placeholder="1"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="续费（元）" >
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'tableData3.' + scope.$index + '.increFee'" :rules='rules.inputPrice'>
                                                    <el-input :size="$size" v-model="scope.row.increFee" placeholder="3"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="操作"
                                            width="60px">
                                            <template slot-scope="scope">
                                                <el-button
                                                type="text"
                                                @click="deleteTableData(scope.row, scope.$index)"
                                                :size="$size">
                                                删除
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form>
                            </div>
                        </el-card>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button :size="$size" type="primary" @click="submitFreigh('freighForm');" :loading="saveLoading" :disabled="saveLoading">{{ templateData? '保存': '提交' }}</el-button>
                    <el-button :size="$size" @click="close()">返回</el-button>
                </div>
            <select-origin :visible.sync="dialogVisible" :editData="editData" @success="saveAddress" :allData="allData"></select-origin>
        </div>
    </el-dialog>
</template>
<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue"
    import SelectOrigin from "@/components/goods/SelectOrigin.vue"
    //枚举计价方式
    const valuateTypeEnum = ['BY_NUMBER', 'BY_WEIGHT']
    //枚举物流方式
    const postTypeEnum = ['THIRD', 'OWN']
    export default {
        components: {
            ProvinceCascader,
            SelectOrigin
        },
        props: {
            visibleDialog: {
                type: Boolean,
                default: false
            },
            templateData: {}
        },
        data() {
            const checkNum = (rules, value, callback) => {
                if(!value) {
                    callback()
                }else if(/^[0]*$/g.test(value)){
                    callback(new Error('不能为0'))
                }
                else if(!/^[1-9]\d*$/g.test(value)) {
                    callback(new Error('必须为整数'))
                }else {
                    callback()
                }
            }
            const checkPrice = (rules, value, callback) => {
                if(!value) {
                    callback()
                }else if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/g.test(value)){
                    callback(new Error('钱格式不对'))
                }else{callback()}
            }

            const checkNumDef = (rules, value, callback) => {
                if(!value&&value!=0) {
                    return callback(new Error('不能为空或0'))
                }else if(/^[0]*$/g.test(value)){
                    callback(new Error('不能为0'))
                }
                else if(!/^[1-9]\d*$/g.test(value)) {
                    callback(new Error('必须为整数'))
                }else {
                    callback()
                }
            }
            const checkPriceDef = (rules, value, callback) => {
                if(!value&&value!=0) {
                    return callback(new Error('不能为空或0'))
                }else if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/g.test(value)){
                    callback(new Error('钱格式不对'))
                }else{callback()}
            }
            return {
                deleteAllDisabled: true,
                dialogVisible: false,
                formLabelWidth: '150px',
                labelPosition: '150px',
                freighForm:{
                    valuateType: '0',
                    postType: '0',
                    way: {},
                    tableData3: []
                },
                rules: {
                    templateName: [
                        {required: true, message: '请输入运费模板名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '发货地址不能为空', trigger: 'blur'}
                    ],
                    deliveryTime: [
                        {required: true, message: '请选择发货时间', trigger: 'change'}
                    ],
                    priceWay: [
                        { required: true, message:'必传', trigger: 'blur'}
                    ],
                    inputTxt: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    inputPrice: [
                        { validator: checkPrice, trigger: 'blur'}
                    ],
                    inputNum: [
                        { validator: checkNum, trigger: 'blur'}
                    ],
                    inputNumDef: [
                        { validator: checkNumDef, trigger: 'blur'}
                    ],
                    inputPriceDef: [
                        { validator: checkPriceDef, trigger: 'blur'}
                    ]
                },
                editData: '',
                currIndex: '',
                saveLoading: false,
                selectValue: '',
                allData:[]
            }
        },
        mounted() {
            if(this.templateData) {
                console.log(this.templateData)
                this.freighForm = {
                    templateName: this.templateData.name,
                    id: this.templateData.id,
                    address: [this.templateData.address.provinceId, this.templateData.address.cityId, this.templateData.address.districtId],
                    deliveryTime: this.templateData.postTime==4? '0': '1',
                    valuateType: this.templateData.valuateType===valuateTypeEnum[0]? '0': '1',
                    postType: this.templateData.postType === postTypeEnum[0]? '0': '1',
                    defaultNum: this.templateData.valuateType==='BY_NUMBER'? this.templateData.defaultFee.defaultNum: this.$math.divide(this.templateData.defaultFee.defaultNum, 1000),
                    defaultFee: this.$math.divide(this.templateData.defaultFee.defaultFee, 100),
                    increFee: this.$math.divide(this.templateData.defaultFee.increFee, 100),
                    increNum: this.templateData.valuateType==='BY_NUMBER'?  this.templateData.defaultFee.increNum: this.$math.divide(this.templateData.defaultFee.increNum, 1000),
                    tableData3: this.handleTableData(this.templateData.destFees)
                }
            }
        },
        methods: {
            handleTemplateData() {
                if(this.templateData) {
                    console.log(this.templateData)
                    this.freighForm = {
                        templateName: this.templateData.name,
                        id: this.templateData.id,
                        address: [this.templateData.address.provinceId, this.templateData.address.cityId, this.templateData.address.districtId],
                        deliveryTime: this.templateData.postTime==4? '0': '1',
                        valuateType: this.templateData.valuateType===valuateTypeEnum[0]? '0': '1',
                        postType: this.templateData.postType === postTypeEnum[0]? '0': '1',
                        defaultNum: this.templateData.valuateType==='BY_NUMBER'? this.templateData.defaultFee.defaultNum: this.$math.divide(this.templateData.defaultFee.defaultNum, 1000),
                        defaultFee: this.$math.divide(this.templateData.defaultFee.defaultFee, 100),
                        increFee: this.$math.divide(this.templateData.defaultFee.increFee, 100),
                        increNum: this.templateData.valuateType==='BY_NUMBER'?  this.templateData.defaultFee.increNum: this.$math.divide(this.templateData.defaultFee.increNum, 1000),
                        tableData3: this.handleTableData(this.templateData.destFees)
                    }
                }
            },
            handleTableData(arr) {
                for(let i = 0, len = arr.length ;i < len; i++) {
                    arr[i].defaultFee = this.$math.divide(arr[i].defaultFee, 100);
                    arr[i].increFee = this.$math.divide(arr[i].increFee, 100)

                    this.templateData.valuateType==='BY_WEIGHT'?arr[i].defaultNum = this.$math.divide(arr[i].defaultNum, 1000): null;
                    this.templateData.valuateType==='BY_WEIGHT'?arr[i].increNum = this.$math.divide(arr[i].increNum, 1000): null;
                    
                }
                return arr;
            },
            //提交运费模板表单
            submitFreigh(formName){
                let isSuccess1 = true,
                    isSuccess2 = true,
                    isSuccess3 = true;
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        isSuccess1 = false;
                        return false;
                    }
                });
                //验证默认运费处
                this.$refs['freighForm2'].validate((valid) => {
                    if(!valid) {
                        isSuccess2 = false;
                        return false;
                    }
                })
                //验证表格里的表单
                this.$refs['tableForm'].validate((valid) => {

                    console.log(this.freighForm.tableData3)
                    if(!valid) {
                        isSuccess3 = false;
                        return false;
                    }else{
                        let cities = this.freighForm.tableData3
                        for(let i=0, len = cities.length; i< len; i++) {
                            if(cities[i].destCities.length==0) {
                                isSuccess3 = false;
                                this.$message.error('第'+(i+1)+'个运送方式未填写！');
                            }
                        }
                        if(this.freighForm.tableData3.length==0) {
                            isSuccess3 = false;
                            this.$message.error('请至少新增一个运费模板！');
                        }
                        return false;
                    }
                })
                if(isSuccess1&&isSuccess2&&isSuccess3){
                    let obj = {
                        template: this.createParams()
                    }
                    this.saveLoading = true;
                    console.log(JSON.stringify(obj))
                    this.$http.post(this.templateData? this.$api.postfeeUpdate: this.$api.postfeeCreate, obj, true).then(res => {
                        this.$message({
                            type: 'success',
                            message: '已提交!',
                        });
                        this.close();
                        this.saveLoading = false;
                        this.$emit("update")
                    }).catch(err => {
                        this.$message.error(err.message);
                        this.saveLoading = false;
                    })
                }
            },
            createParams() {
                // 遍历code值
                let codeArr = [];
                for(let i =0,len = this.freighForm.tableData3.length; i< len; i++) {
                    let showName = '';
                    if(this.freighForm.tableData3[i].destCities[0] === '000000|全国') {
                        showName = this.freighForm.tableData3[i].destCities[0].split("|")[1];
                    }else{
                        for(let j = 0, lenJ = this.freighForm.tableData3[i].destCities.length; j < lenJ; j++) {
                            showName += this.freighForm.tableData3[i].destCities[j].split("|")[1] + " "
                        }
                    }
                    let _obj = {
                        defaultFee: this.freighForm.tableData3[i].defaultFee? this.$math.multip(this.freighForm.tableData3[i].defaultFee, 100): this.$math.multip(this.freighForm.defaultFee, 100),
                        defaultNum: this.freighForm.tableData3[i].defaultNum
                                    ? this.freighForm.valuateType==0
                                        ? this.freighForm.tableData3[i].defaultNum
                                        : this.$math.multip(this.freighForm.tableData3[i].defaultNum, 1000)
                                    : this.freighForm.valuateType==0
                                        ? this.freighForm.defaultNum
                                        : this.$math.multip(this.freighForm.defaultNum, 1000),
                        destCities: this.freighForm.tableData3[i].destCities,
                        increFee: this.freighForm.tableData3[i].increFee? this.$math.multip(this.freighForm.tableData3[i].increFee, 100): this.$math.multip(this.freighForm.increFee,100),
                                    // ? this.freighForm.valuateType==0 ? this.freighForm.tableData3[i].increFee: this.$math.multip(this.freighForm.increFee,1000)
                                    //     ? this.freighForm.tableData3[i].increFee
                                    //     : this.$math.multip(this.freighForm.tableData3[i].increFee, 1000)
                                    // : this.freighForm.valuateType==0 
                                    //     ? this.freighForm.increFee
                                    //     : this.$math.multip(this.freighForm.increFee,1000),
                        increNum: this.freighForm.tableData3[i].increNum
                                    ? this.freighForm.valuateType==0 
                                        ? this.freighForm.tableData3[i].increNum
                                        : this.$math.multip(this.freighForm.tableData3[i].increNum, 1000) 
                                    : this.freighForm.valuateType==0 
                                        ? this.freighForm.increNum
                                        : this.$math.multip(this.freighForm.increNum, 1000),
                        showName: showName,
                    }
                    codeArr.push(_obj)
                }
                let date = parseInt(new Date().getTime().toString().substr(0,10))
                let obj = {
                    address: {
                        provinceId: this.freighForm.address[0],
                        cityId: this.freighForm.address[1],
                        districtId: this.freighForm.address[2]
                    },
                    defaultFee: {
                        defaultFee: this.$math.multip(this.freighForm.defaultFee, 100),
                        defaultNum: this.freighForm.valuateType ==0 
                                    ? this.freighForm.defaultNum
                                    : this.$math.multip(this.freighForm.defaultNum, 1000),
                        increFee: this.$math.multip(this.freighForm.increFee, 100),
                        increNum: this.freighForm.valuateType ==0 
                                    ? this.freighForm.increNum
                                    : this.$math.multip(this.freighForm.increNum, 1000)
                    },
                    destFees: codeArr,
                    valuateType: valuateTypeEnum[this.freighForm.valuateType],
                    name: this.freighForm.templateName,
                    // postTime: this.freighForm.deliveryTime==0? date+3600*4: date+3600*6,
                    postTime: this.freighForm.deliveryTime==0? "4": "6",
                    postType: postTypeEnum[this.freighForm.postType]
                }
                this.templateData? obj.id = this.templateData.id: ''
                return obj;
            },
            close() {
                this.$emit('update:visibleDialog', false)
            },
            addAddress() {
                let obj = {
                    name: '',
                    destCities: [],
                    defaultNum: '',
                    defaultFee: '',
                    increNum: '',
                    increFee: ''
                }
                this.freighForm.tableData3.push(obj);
            },
            deleteTableData(row, index) {
                this.$confirm('是否删除此行数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.freighForm.tableData3.splice(index, 1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(()=> {
                    this.$message("取消操作")
                })
            },
            deleteSelect() {
                this.$confirm('是否删除此行数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let table = this.freighForm.tableData3,
                        selectValue = this.selectValue;
                    for(let i=0, len = table.length; i<len ;i++) {
                        for(let j=0, lenJ=selectValue.length; j< lenJ; j++) {
                            if(JSON.stringify(table[i]) == JSON.stringify(selectValue[j])) {
                                this.freighForm.tableData3.splice(i, 1)
                            }
                        }
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message("取消操作")
                })
            },
            editTabelData(row, index) {
                this.allData = [];
                this.currIndex = index;
                if(row.length!==0) {
                    this.editData = row;
                }else{
                    this.editData = ''
                }
                let data = this.freighForm.tableData3;
                for(let i=0, len=data.length; i< len; i++) {
                    if(i != index) {
                        this.allData.push(data[i])
                    }
                }
                this.dialogVisible = true;
            },
            saveAddress(value) {
                this.freighForm.tableData3[this.currIndex].destCities = value;
            },
            //全选
            handleSelectionChange(value) {
                if(value.length>0){
                    this.deleteAllDisabled = false;
                    this.selectValue = value;
                }else{
                    this.deleteAllDisabled = true;
                }
            }
        },
        watch: {
            visibleDialog(val, oldVal) {
                this.close();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .trans-price {
        .dialog-footer {
            text-align: center
        }
        .tmpName .el-input,
        /deep/ .el-cascader,
        /deep/ .el-select {
            width: 60%;
        }
        .trans-way .el-input {
            width: 70px;
        }
        .line {
            border-bottom: 1px solid #dcdfe6;
            margin-bottom: 10px;
            padding-bottom: 10px;
        }
        /deep/ .el-table .el-input {
            width: 60%;
        }
        /deep/ .el-table .cell, .el-table th div{
            overflow: inherit;
        }
        /deep/ .el-form-item__error {
            left: 20px;
        }
        /deep/ .el-table th{
            padding: 0;
        }
        /deep/ .el-table td {
            padding: 12px 0 22px;
        }
    }
    
</style>
