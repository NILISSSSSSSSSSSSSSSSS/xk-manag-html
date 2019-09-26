<template>
    <div class="select-origin">
        <el-dialog :visible.sync="visible" title="选择区域" top="50px" width="700px" append-to-body class="select-origin-dialog">
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <div class="list-main">
                            <el-checkbox v-model="allCountryValue" @change="handleCheckAll">全国</el-checkbox>（港澳台除外）
                        </div>
                    </el-col>
                    <el-col :span="6" v-for="(pro,index) in province" :key="index">
                        <div class="list-main" @click="selectIndex(index)">
                            <el-checkbox class="hover" v-model="checkAll['checkAll'+index]" :indeterminate="isIndeterminate['isIndeterminate'+index]" @change="handleCheckAllChange">{{pro.name}}&nbsp;&nbsp;<i class="el-icon-arrow-up"></i></el-checkbox>
                            <div class="list">
                                <el-checkbox-group v-model="checkedCities['city'+index]" @change="handleCheckedCitiesChange">
                                        <el-checkbox class="fl" v-for="city in pro.cities" :key="city.code" :label="city.code+'|'+city.name+'|'+city.parentCode">{{city.name}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-col>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="close()">取消</el-button>
                <el-button :size="$size" type="primary" @click="save()">保存</el-button>
            </div>
        </el-dialog>

        <!-- 提示重复的选项 -->
        <el-dialog :visible.sync="repeatDialog" title="错误提示" width="800px" append-to-body class="error-dialog">
            <el-row>
                <el-col :span="24" v-for="(item, index) in repeatArr" :key="index">
                    {{ item }}
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="repeatDialog=false">好的，我知道了</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    let _p = new Map(JSON.parse(localStorage.getItem("xk-province")));
    let province = [];
    _p.forEach((item, code, arr)=>{
        item.code = code;
        province.push(item);
    });
    let _c = new Map(JSON.parse(localStorage.getItem("xk-city")));
    let city = [];
    _c.forEach((item, code, arr)=>{
        item.code = code;
        city.push(item);
    })
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            editData: {
                type: [Object, String, Array],
                default:''
            },
            allData: {
                type: Array,
                default: ()=>[]
            }
        },
        data() {
            return {
                isIndeterminate: {},
                checkAll: {},
                checkedCities: {},
                province: '',
                city: '',
                clickIndex: '',
                allCountry: false,
                allCountryValue: false,
                map: null,
                repeatDialog: false,
                repeatArr: []
            }
        },
        created() {
            this.setMap();
        },
        methods: {
            initData() {
                let editData = this.editData,
                    lenJ = this.editData.length,
                    province = this.province,
                    lenI = this.province.length,
                    saveProvince = [],
                    saveCities = [];
                for(let i = 0; i < lenJ; i++) {
                    if(editData[i].split("|").length >2) {
                        saveCities.push(editData[i])
                    }else{
                        saveProvince.push(editData[i])
                    }
                }
                this.sortProvince(saveProvince)
                this.sortCity(saveCities)
            },
            sortProvince(value) {
                let len = value.length;
                let province = this.province;
                for(let i =0; i<len; i++){
                    for(let j=0, lenJ = province.length; j< lenJ; j++) {
                        if(province[j].code === value[i].split("|")[0]){
                            this.checkAll['checkAll'+j] = true;
                            this.checkedCities['city'+j] = this.convertStr(this.province[j].cities)
                        }
                    }
                }
            },
            convertStr(arr) {
                let strArr = [];
                for(let i = 0, len = arr.length; i < len; i++) {
                    strArr[i] = arr[i].code + '|' + arr[i].name + "|"+ arr[i].parentCode;
                }
                return strArr
            },
            sortCity(cities) {
                for(let i = 0,len = cities.length; i < len; i++) {
                    for(let j =0, lenJ = this.province.length; j < lenJ ;j++) {
                        if(this.province[j].code === cities[i].split("|")[2]){
                            this.checkAll['checkAll'+j] = true;
                            this.isIndeterminate['isIndeterminate'+ j] = true;
                            this.checkedCities['city'+j].push(cities[i])
                        }
                    }
                }
            },
            searchData(value, key) {
                for(let i = 0, len = value.length; i< len; i++) {
                    if(value[i].code === key) {
                        return value[i].code
                    }else{
                        this.searchData(value[i], key)
                    }
                }
            },
            selectIndex(index) {
                this.clickIndex = index;
            },
            handleCheckAllChange(val) {
                let cities = [];
                if(val) {
                    let citiesArr = this.province[this.clickIndex].cities;
                    for(let i = 0, len = citiesArr.length; i < len; i++) {
                        cities[i] = citiesArr[i].code + '|' +citiesArr[i].name + "|"+citiesArr[i].parentCode;
                    }
                }
                this.checkedCities['city'+this.clickIndex] = val ? cities : [];
                this.isIndeterminate['isIndeterminate'+this.clickIndex] = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll['checkAll'+this.clickIndex] = checkedCount === this.province[this.clickIndex].cities.length;
                this.isIndeterminate['isIndeterminate'+ this.clickIndex] = checkedCount > 0 && checkedCount < this.province[this.clickIndex].cities.length;
            },
            //获取省份
            getProvince() {
                for(let i=0, len = province.length; i< len;i++) {
                    let cities = []
                    for(let j=0,lenJ = city.length; j<lenJ; j++) {
                        if(province[i].code===city[j].parentCode) {
                            let children = {
                                code: city[j].code,
                                name: city[j].name,
                                parentCode: city[j].parentCode
                            }
                            cities.push(children)
                            province[i].cities = cities
                        }
                    }
                    this.$set(this.checkAll, 'checkAll'+i, false)
                    this.$set(this.isIndeterminate, 'isIndeterminate'+i, false);
                    this.$set(this.checkedCities, 'city'+i, [])
                }
                this.province = province;
            },
            save() {
                // 如果是勾选全国
                if(this.allCountryValue) {
                    if(this.allData.length>0) {
                        this.repeatArr =['您已经选择了其它省市，请不要选全国，您可以从新新建一个独立的全国运费模板。']
                        this.repeatDialog = true;
                        return false;
                    }
                    this.$emit('success', ['000000|全国']);
                    this.close();
                }else {
                    //优先检查是否选择省份
                    let province = this.province;
                    let addressName = [];
                    for(let i =0, len = province.length; i< len; i++) {
                        if(this.checkedCities['city'+i].length===0) {
                        }else if(province[i].cities.length === this.checkedCities['city'+i].length){
                            let str = province[i].code+"|"+province[i].name
                            addressName.push(str)
                        }else{
                            let cities = this.checkedCities['city'+i]
                            for(let j =0, lenJ = cities.length; j<lenJ; j++) {
                                addressName.push(cities[j])
                            }
                        }
                    }
                    if(addressName.length===0){
                        this.$message.error('请选择一个城市或者省份');
                        return false;
                    }else{
                        this.repeatArr = this.isRepeatSelect(addressName);
                        if(this.repeatArr.length!==0) {
                            this.repeatDialog = true;
                        }else{
                            this.$emit('success', addressName);
                            this.close();
                        }
                    }
                    
                }
            },
            handleCheckAll(val) {
                if(val) {
                    let province = this.province;
                    for(let i=0,len = province.length; i< len;i++) {
                        this.checkAll['checkAll'+i] = true;
                        this.checkedCities['city'+i] = this.convertStr(this.province[i].cities)
                    }
                }else{
                    let province = this.province;
                    for(let i=0,len = province.length; i< len;i++) {
                        this.checkAll['checkAll'+i] = false;
                        this.checkedCities['city'+i] = []
                    }
                }
            },
            close() {
                this.$emit('update:visible', false)
            },
            //将已选择的省市存入map对象，便于比对是否选择过当前对象
            setMap() {
                let allData = this.allData;
                this.map = new Map();
                for(let i = 0, len = allData.length; i< len; i++) {
                    for(let j=0, lenJ = allData[i].destCities.length; j <lenJ ; j++) {
                        let arr = allData[i].destCities[j].split("|");
                        let obj = {
                            code: arr[0],
                            name: arr[1]
                        }
                        arr.length>2? obj.parentCode = arr[2]: null;
                        this.map.set(arr[0], obj);
                    }
                }
            },
            isRepeatSelect(params) {
                let result = [];
                for(let i=0, len=params.length; i< len; i++) {
                    let arr = params[i].split("|");
                    //选择的是城市
                    if(arr.length>2){
                        let str = "";
                        if(this.map.get(arr[0]) && this.map.get(arr[0]).code == arr[0]) {
                            str = '您已选择了  '+arr[1]+'  请不要再选  '+arr[1]
                            result.push(str);
                            continue;
                        }
                        if(this.map.get(arr[2]) && this.map.get(arr[2]).code == arr[2]) {
                            str = '您已选择了  '+this.map.get(arr[2]).name+'  请不要再选  '+arr[1]
                            result.push(str);
                            continue;
                        }
                    }else{
                        let res = this.isSelectProvince(this.map.get(arr[0]));
                        res.length>0 ? result=result.concat(res): null;
                    }
                }
                return result;
            },
            //在先选择城市的情况下，判断是否已经选了省
            isSelectProvince(params) {
                if(!params)return false;
                let list = [];
                this.map.forEach((item, index, arr) => {
                    if(item.parentCode == params.code) {
                        let str = '您已选择了  '+item.name+'  请不要全选  '+params.name;
                        list.push(str);
                    }else if(item.code == params.code) {
                        let str = '您已选择了  '+item.name+'  请不要重复选择  '+params.name;
                        list.push(str);
                    }
                    
                })
                return list;
            }
        },
        watch: {
            visible(val) {
                if(val) {
                    this.setMap();
                    this.getProvince();
                    if(this.editData) {
                        if(this.editData[0] === '000000|全国') {
                            let province = this.province;
                            for(let i=0,len = province.length; i< len;i++) {
                                this.checkAll['checkAll'+i] = true;
                                this.checkedCities['city'+i] = this.convertStr(this.province[i].cities)
                            }
                        }else{
                            this.initData();
                        }
                    }
                }else{
                    this.map=null;
                    this.close()
                }
            },
            checkAll: {
                handler(val, oldVal) {
                    for(let i in val){
                        if(!val[i]){
                            this.allCountryValue = false;
                            return false;
                        }else {
                            this.allCountryValue = true;
                        }
                    }
                },
                deep: true
            }
        }
    }
</script>
<style lang="scss">
    .select-origin{
        .el-icon-arrow-up{
            transition: transform .3s;
        }
        .list-main:hover .el-icon-arrow-up{
            transform: rotateZ(-180deg);
        }
        .list-main:hover .list{
            display: block
        }
        .list-main{
            position: relative;
            margin-bottom: 20px;
            .list {
                transition: display .3s;
                display: none;
                width: 550px;
                position: absolute;
                background: #fff;
                top: 20px;
                left: -70px;
                z-index: 666;
                padding: 0 10px 20px 0;
                border: 1px solid #e4e7ed;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                box-sizing: border-box;
                border-radius: 8px;
                .fl {
                    float: left;
                    margin-left: 20px;
                    margin-top: 20px;
                }
            }
        }
    }
    .select-origin-dialog {
        .el-icon-arrow-up{
            transition: transform .3s;
        }
        .list-main:hover .el-icon-arrow-up{
            transform: rotateZ(-180deg);
        }
        .list-main:hover .list{
            display: block
        }
        .list-main{
            position: relative;
            margin-bottom: 20px;
            .list {
                transition: display .3s;
                display: none;
                width: 550px;
                position: absolute;
                background: #fff;
                top: 20px;
                left: -70px;
                z-index: 666;
                padding: 0 10px 20px 0;
                border: 1px solid #e4e7ed;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                box-sizing: border-box;
                border-radius: 8px;
                .fl {
                    float: left;
                    margin-left: 20px;
                    margin-top: 20px;
                }
            }
        }
        .btn-group {
            margin-top: 40px;
        }
    }
    .error-dialog {
        /deep/ .el-col {
            margin-bottom: 10px;
            font-size: 15px;
        }
    }
    
</style>
