<template>
    <div class="cascader-province">
        <el-popover
            placement="bottom"
            width="670"
            v-model="visible"
            trigger="click">
                <div class="cascader-address">
                    <div class="cascader-item">
                        <div class="cascader-item-list cascader-item-list-header"></div>
                        <div class="cascader-item-list cascader-item-list-body" >
                            <div @click="provinceClassIndex='all'; selectAll()">
                                <span :class="provinceClassIndex=='all'? 'xk-danger': ''">全国</span>
                            </div>
                            <div v-for="(item, index) in province" :key="index" @click="provinceClassIndex = index;getCity(item[0])">
                                <el-badge :value="item[1].count">
                                    <span :class="provinceClassIndex == index? 'xk-danger': ''">{{ item[1].name }}</span>
                                </el-badge>
                            </div>
                        </div>
                        
                    </div>
                    <div class="cascader-item">
                        <div class="cascader-item-list cascader-item-list-header">
                            <el-checkbox v-model="checkCity">全选</el-checkbox>
                        </div>
                        <div class="cascader-item-list cascader-item-list-body">
                            <div v-for="(item, index) in selectCity" :key="index" @click="cityClassIndex=index;getAddress(item[0], true)">
                                <el-badge :value="selectObj[item[0].substring(0,4)+'00']&&selectObj[item[0].substring(0,4)+'00'].length> 0 ?selectObj[item[0].substring(0,4)+'00'].length: ''">
                                    <span :class="[getStyle(item[0])? 'xk-danger': '',cityClassIndex==index? 'under_line': '']">{{ item[1].name }}</span>
                                </el-badge>
                                <i style="margin-left: 10px" v-if="getStyle(item[0])" class="el-icon-s-release" @click.stop="cancleSelect(item[0])" title="取消选择"></i>
                            </div>
                        </div>
                    </div>
                    <div class="cascader-item">
                        <div class="cascader-item-list cascader-item-list-header"></div>
                        <div class="cascader-item-list cascader-item-list-body">
                            <div v-for="(item, index) in selectAddress" :key="index" @click="handleAddress(item[0])">
                                <span :class="districtClass.indexOf(item[0]) != -1? 'xk-danger': ''">{{ item[1].name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <el-button type="primary" :size="$size" @click="saveAddress()">确定</el-button>
                </div>
            <div slot="reference" class="cascader-content">
                <el-tag closable v-for="item in addressArr" :key="item" @close="deleteAddress(item)">{{ getPorvinceInfo(item) }}</el-tag>
            </div>
        </el-popover>
    </div>
</template>

<script>
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    export default {
        props: {
            value: {
                default: ()=> []
            }
        },
        data() {
            return {
                getPorvinceInfo,
                visible: false,
                province: JSON.parse(localStorage.getItem('xk-province')),
                city: JSON.parse(localStorage.getItem('xk-city')),
                district: JSON.parse(localStorage.getItem('xk-district')),
                allAddress: JSON.parse(localStorage.getItem('xk-all-address')),
                selectCity: [],
                selectAddress: [],
                provinceClassIndex: "",
                cityClassIndex: '',
                districtClass: [],
                checkCity: false,


                //记录当前已经点选的对象
                selectObj: {},
                addressArr: []
            }
        },
        created() {
            this.getCity(this.province[0][0]);
            this.getAddress(this.selectCity[0][0])
        },
        mounted() {
            this.numToString(this.value)
        },
        methods: {
            getCity(code) {
                this.selectCity = [];
                this.city.forEach(item=>{
                    if(item[0].substring(0,2) === code.substring(0,2)) {
                        this.selectCity.push(item);
                    }
                })
                this.getAddress(this.selectCity[0][0]);
            },
            getAddress(code, bool) {
                this.selectAddress = [];

                if(bool) {
                    if(!this.selectObj[code]) {
                        this.selectObj[code] = [];
                    }
                }
                this.district.forEach(item=>{
                    if(item[0].substring(0,4) === code.substring(0,4)) {
                        this.selectAddress.push(item);
                    }
                })
                this.findProvinceCode();
            },
            handleAddress(code) {
                if(this.selectObj && this.selectObj[code.substring(0,4)+'00']) {
                    let obj = this.selectObj[code.substring(0,4)+'00'];
                    if(obj && obj.indexOf(code)==-1) {
                        obj.push(code)
                    }else{
                        this.selectObj[code.substring(0,4)+'00'] = obj.filter(item=>{
                            return item!=code;
                        })
                    }
                    if(this.districtClass.indexOf(code) !== -1) {
                        this.districtClass = this.districtClass.filter(item=>{
                            return item!==code;
                        })
                    }else{
                        this.districtClass.push(code);
                    }
                }
            },
            //保存选中的区域
            saveAddress() {
                this.handleCnView();
            },
            //判断是否应该显示样式
            getStyle(code) {
                for(let item in this.selectObj) {
                    if(item==code) {
                        return true;
                    }
                }
                return false;
            },
            //取消市区选择
            cancleSelect(code) {
                this.selectObj[code].forEach(item=>{
                    let index = this.districtClass.indexOf(item);
                    if(index > -1) {
                        this.districtClass.splice(index, 1);
                    }
                })
                Vue.delete(this.selectObj, code);
                this.findProvinceCode();
            },
            findProvinceCode() {
                this.province.forEach(item=>{
                    let count = 0;
                    for(let obj in this.selectObj) {
                        if(obj.substring(0,2)+'0000' == item[0]) {
                            count++;
                        }
                    }
                    if(count>0) {
                        item[1].count = count;
                    }else{
                        item[1].count = "";
                    }
                })
            },
            //转换为中文显示
            handleCnView() {
                let arr = [];
                if(this.provinceClassIndex!=='all') {
                    for(let item in this.selectObj) {
                        if(this.selectObj[item] && this.selectObj[item].length>0) {
                            arr.push(...this.selectObj[item])
                        }else{
                            arr.push(item)
                        }
                    }
                }else{
                    arr = ['000000']
                }
                if(arr.length>1 && arr.indexOf('000000')>-1) {
                    this.$message.error('已经选中了全国，不能选择其它城市!')
                    return false;
                }
                this.addressArr = arr;
                this.$emit('input', this.addressArr);
                this.visible = false;
            },
            //删除选中的城市
            deleteAddress(code) {
                if(this.visible) {
                    this.$message.error('地区选择器展开状态不能删除！')
                    return false;
                }
                let index = this.addressArr.indexOf(code);
                this.addressArr.splice(index, 1);
                this.$emit('input', this.addressArr);
            },
            //重新渲染回显样式
            re_renderSelect() {
                let obj = {},
                    classArr = [];
                for(let item of this.addressArr) {
                    if(item.substring(4,6)=='00') {
                        obj[item] = []
                    }else{
                        if(obj[item.substring(0,4)+'00']) {
                            obj[item.substring(0,4)+'00'].push(item);
                        }else{
                            obj[item.substring(0,4)+'00'] = [item]
                        }
                        classArr.push(item);
                    }
                }
                this.selectObj = obj;
                this.districtClass = classArr;
                this.findProvinceCode();
            },
            //删除被匹配到的区县code
            deleteDistrictCode() {
                this.districtClass = this.districtClass.filter(item=>{
                    return item.substring(0,2) !== this.selectCity[0][0].substring(0,2);
                })
            },
            //数字类型转字符串
            numToString(val) {
                if(val[0] == '000000') {
                    this.provinceClassIndex = 'all';
                    this.selectCity = [];
                    this.selectAddress = [];
                    this.addressArr = val;
                }else if(val.length>0) {
                    let arr = [];
                    val.forEach(item=>{
                        arr.push(item+'');
                    })
                    this.addressArr = arr;
                }
                this.re_renderSelect()
            },
            //选择全国
            selectAll() {
                this.selectCity = [];
                this.selectAddress = [];
                this.selectObj = {};
                this.classArr = [];
                this.districtClass = [];
                this.findProvinceCode();
            }
        },
        watch: {
            visible(val) {
                if(val && this.addressArr.length>0) {
                    this.re_renderSelect()
                }
            },
            checkCity(val) {
                if(val) {
                    this.selectCity.forEach(item=>{
                        this.selectObj[item[0]] = [];
                    })
                }else{
                    this.selectCity.forEach(item=>{
                        delete this.selectObj[item[0]];
                    })
                }
                this.findProvinceCode();
                this.deleteDistrictCode();
            },
            value: {
                handler(val) {
                    this.numToString(val)
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .cascader-province {
        position: relative;
        .cascader-content {
            height: 64px;
            border: 1px solid #9B99E6;
            border-radius: 4px;
            line-height: 32px;
            padding: 3px;
            overflow: auto;
        }
    }
</style>

<style lang="scss">
    .cascader-address {
        width: 645px;
        background-color: #fff;
        // border: 1px solid #ccc;
        height: 330px;
        display: flex;
        position: relative;
        .cascader-item{
            flex: 1;
            padding-bottom: 10px;
            overflow: auto;
            display: flex;
            flex-direction: column;
            .cascader-item-list {
                height: 30px;
                padding: 5px;
                box-sizing: border-box;
                line-height: 30px;
                cursor: pointer;
            }
            .cascader-item-list-header {
                height: 40px;
                background-color: #fff;
                border-bottom: 1px solid #ccc;
            }
            .cascader-item-list-body {
                padding-left: 10px;
                flex: 1;
                overflow: auto;
                span{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                .under_line {
                    text-decoration: underline;
                }
                .el-badge {
                    width: 80%;
                }
                .el-badge__content.is-fixed {
                    top: 14px;
                }
            }
            &:nth-child(2) {
                border-left: 1px solid #ccc;
                border-right: 1px solid #ccc;
            }
        }
    }
</style>

