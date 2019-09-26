<template>
    <div class="xk-container mall-discount-ticket-add">
        <div class="xk-body xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>自营商城优惠券新增
                </div>
            </div>
            <el-form :model="addTicketForm" label-width="120px" ref="addTicketForm" :rules="addTicketFormRules">
                    <el-form-item label="优惠券名称：" prop="name">
                        <el-col :span="10">
                            <el-input :size="$size" v-model="addTicketForm.name" placeholder="请输入会员卡名称"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="类型：" required>
                        <el-col :span="10">
                            <el-select :size="$size" v-model="addTicketForm.couponType">
                                <template v-for="item in EnumCouponType">
                                    <el-option :key="item.key" :label="item.label" :value="item.key"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="优惠：" required>
                        <el-form-item prop="discounts" v-if="addTicketForm.couponType === 'DISCOUNT'">
                            <el-col :span="10">
                                <el-input :size="$size" v-model="addTicketForm.discounts" placeholder="折"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="discounts" v-else-if="addTicketForm.couponType === 'DEDUCTION'">
                            <el-col :span="10">
                                <el-input :size="$size" v-model="addTicketForm.discounts" placeholder="元"></el-input>
                            </el-col>
                        </el-form-item>
                        
                        <el-col :span="10" v-else>
                            <el-row>
                                <el-col :span="11">
                                    <el-form-item prop="discounts">
                                        <el-input :size="$size" v-model="addTicketForm.discounts" placeholder="满"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">&nbsp;</el-col>
                                <el-col :span="11">
                                    <el-form-item prop="subMoney">
                                        <el-input :size="$size" v-model="addTicketForm.subMoney" placeholder="减"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="范围：">
                        <el-radio-group v-model="addTicketForm.scope">
                            <el-radio v-for="item in EnumScope" :key="item.key" :label="item.key">{{ item.value }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="总量：" prop="totalNum">
                        <el-col :span="10">
                            <el-input :size="$size" v-model="addTicketForm.totalNum" placeholder="请输入优惠券总量（张）"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="每用户限领：" prop="limitNum">
                        <el-col :span="10">
                            <el-input :size="$size" v-model="addTicketForm.limitNum" placeholder="请输入用户限领张数（张）"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="优惠券有效期：" prop="timeRange">
                        <el-col :span="10">
                            <el-date-picker range-separator="至" start-placeholder="选择生效时间" end-placeholder="选择结束时间" type="datetimerange" v-model="addTicketForm.timeRange" placeholder="请选择生效时间" :size="$size"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <!-- 选择可用单品 -->
                    <el-form-item label="选择可用单品：" v-if="addTicketForm.scope === EnumScope[1].key">
                        <el-row type="flex" justify="center" align="middle">
                            <el-col :span="11">
                                <el-table border :data="tableListSingle" @selection-change="handleSelectionChangeT1" height="305px">
                                    <el-table-column
                                        type="selection"
                                        width="35">
                                    </el-table-column>
                                    <el-table-column label="一级分类" prop="firstCategory"></el-table-column>
                                    <el-table-column label="二级分类" prop="secondCategory"></el-table-column>
                                    <el-table-column label="三级分类" prop="thirdCategory"></el-table-column>
                                    <el-table-column label="商品名称" prop="sGoodsName"></el-table-column>
                                    <el-table-column label="商品ID" prop="sGoodsId" :show-overflow-tooltip="true"></el-table-column>
                                </el-table>
                                共{{ tableListSingle.length }} 条   已选中{{ selectDataStatus&&selectData? selectData.length: 0 }} 条
                                <!-- <pagination :currentPage="pageSingle.page" :pageSize="100000000000000" :total="tableListSingle.length" @change="changePageSingle"></pagination> -->
                            </el-col>
                            <el-col :span="2">
                                <el-row style="text-align:center">
                                    <el-row type="flex" justify="center" align="middle">
                                        <el-col :span="24"><el-button :size="$size" type="primary" @click="addCatSingle">添加 <i class="el-icon-arrow-right"></i></el-button></el-col>
                                    </el-row>
                                    <el-row type="flex" justify="center" align="middle">
                                        <el-col :span="24"><el-button :size="$size" type="danger" @click="moveCatSingle"><i class="el-icon-arrow-left"></i> 移除</el-button></el-col>
                                    </el-row>
                                </el-row>
                            </el-col>
                            <el-col :span="11">
                                <el-table border :data="tableListSingleData" @selection-change="handleSelectionChangeT2" height="305px">
                                    <el-table-column
                                        type="selection"
                                        width="35">
                                    </el-table-column>
                                    <el-table-column label="一级分类" prop="firstCategory"></el-table-column>
                                    <el-table-column label="二级分类" prop="secondCategory"></el-table-column>
                                    <el-table-column label="三级分类" prop="thirdCategory"></el-table-column>
                                    <el-table-column label="商品名称" prop="sGoodsName"></el-table-column>
                                    <el-table-column label="商品ID" prop="sGoodsId" :show-overflow-tooltip="true"></el-table-column>
                                </el-table>
                                共{{ tableListSingleData.length }} 条   已选中{{ !selectDataStatus&&selectData? selectData.length: 0 }} 条
                                <!-- <pagination :currentPage="pageSingled.page" :pageSize="pageSingle.limit" :total="pageSingled.total" @change="changePageSingled"></pagination> -->
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <!-- 选择可用品类 -->
                    <el-form-item label="选择可用品类：" v-if="addTicketForm.scope === EnumScope[2].key">
                            <el-tabs v-model="selectCat" type="card" @tab-click="handleClick">
                                <el-tab-pane label="一级分类" name="1">
                                    <el-row type="flex" justify="center" align="middle">
                                        <el-col :span="11">
                                            <el-table :data="tableList1" @selection-change="handleSelectionChangeT1" height="305px" ref="multipleTable1">
                                                <el-table-column
                                                    type="selection"
                                                    width="35">
                                                </el-table-column>
                                                <el-table-column label="一级分类" prop="first"></el-table-column>
                                            </el-table>
                                            <!-- <pagination :currentPage="pageSingle.page" :pageSize="pageSingle.limit" :total="pageSingle.total" @change="changePageSingle"></pagination> -->
                                        </el-col>
                                        <el-col :span="2">
                                            <el-row style="text-align:center">
                                                <el-row type="flex" justify="center" align="middle">
                                                    <el-col :span="24"><el-button :size="$size" type="primary" @click="addCat1">添加 <i class="el-icon-arrow-right"></i></el-button></el-col>
                                                </el-row>
                                                <el-row type="flex" justify="center" align="middle">
                                                    <el-col :span="24"><el-button :size="$size" type="danger" @click="moveCat1"><i class="el-icon-arrow-left"></i> 移除</el-button></el-col>
                                                </el-row>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="11">
                                            <el-table :data="tableListData1" @selection-change="handleSelectionChangeT2" height="305px" ref="multipleTable11">
                                                <el-table-column
                                                    type="selection"
                                                    width="35">
                                                </el-table-column>
                                                <el-table-column label="一级分类" prop="first"></el-table-column>
                                            </el-table>
                                            <!-- <pagination :currentPage="pageSingled.page" :pageSize="pageSingle.limit" :total="pageSingled.total" @change="changePageSingled"></pagination> -->
                                        </el-col>
                                    </el-row>  
                                </el-tab-pane>
                                <el-tab-pane label="二级分类" name="2">
                                    <el-row type="flex" justify="center" align="middle">
                                        <el-col :span="11">
                                            <el-table :data="tableList2" @selection-change="handleSelectionChangeT1" height="305px" ref="multipleTable2">
                                                <el-table-column
                                                    type="selection"
                                                    width="35">
                                                </el-table-column>
                                                <el-table-column label="一级分类" prop="first"></el-table-column>
                                                <el-table-column label="二级分类" prop="second"></el-table-column>
                                            </el-table>
                                            <!-- <pagination :currentPage="pageSingle.page" :pageSize="pageSingle.limit" :total="pageSingle.total" @change="changePageSingle"></pagination> -->
                                        </el-col>
                                        <el-col :span="2">
                                            <el-row style="text-align:center">
                                                <el-row type="flex" justify="center" align="middle">
                                                    <el-col :span="24"><el-button :size="$size" type="primary" @click="addCat2">添加 <i class="el-icon-arrow-right"></i></el-button></el-col>
                                                </el-row>
                                                <el-row type="flex" justify="center" align="middle">
                                                    <el-col :span="24"><el-button :size="$size" type="danger" @click="moveCat2"><i class="el-icon-arrow-left"></i> 移除</el-button></el-col>
                                                </el-row>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="11">
                                            <el-table :data="tableListData2" @selection-change="handleSelectionChangeT2" height="305px" ref="multipleTable22">
                                                <el-table-column
                                                    type="selection"
                                                    width="35">
                                                </el-table-column>
                                                <el-table-column label="一级分类" prop="first"></el-table-column>
                                                <el-table-column label="二级分类" prop="second"></el-table-column>
                                            </el-table>
                                            <!-- <pagination :currentPage="pageSingled.page" :pageSize="pageSingle.limit" :total="pageSingled.total" @change="changePageSingled"></pagination> -->
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                                <el-tab-pane label="三级分类" name="3">
                                    <el-row type="flex" justify="center" align="middle">
                                        <el-col :span="11">
                                            <el-table :data="tableList" @selection-change="handleSelectionChangeT1" height="305px" ref="multipleTable3">
                                                <el-table-column
                                                    type="selection"
                                                    width="35">
                                                </el-table-column>
                                                <el-table-column label="一级分类" prop="first"></el-table-column>
                                                <el-table-column label="二级分类" prop="second"></el-table-column>
                                                <el-table-column label="三级分类" prop="third"></el-table-column>
                                            </el-table>
                                            <!-- <pagination :currentPage="pageSingle.page" :pageSize="pageSingle.limit" :total="pageSingle.total" @change="changePageSingle"></pagination> -->
                                        </el-col>
                                        <el-col :span="2">
                                            <el-row style="text-align:center">
                                                <el-row type="flex" justify="center" align="middle">
                                                    <el-col :span="24"><el-button :size="$size" type="primary" @click="addCat">添加 <i class="el-icon-arrow-right"></i></el-button></el-col>
                                                </el-row>
                                                <el-row type="flex" justify="center" align="middle">
                                                    <el-col :span="24"><el-button :size="$size" type="danger" @click="moveCat"><i class="el-icon-arrow-left"></i> 移除</el-button></el-col>
                                                </el-row>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="11">
                                            <el-table :data="tableListData" @selection-change="handleSelectionChangeT2" height="305px" ref="multipleTable33">
                                                <el-table-column
                                                    type="selection"
                                                    width="35">
                                                </el-table-column>
                                                <el-table-column label="一级分类" prop="first"></el-table-column>
                                                <el-table-column label="二级分类" prop="second"></el-table-column>
                                                <el-table-column label="三级分类" prop="third"></el-table-column>
                                            </el-table>
                                            <!-- <pagination :currentPage="pageSingled.page" :pageSize="pageSingle.limit" :total="pageSingled.total" @change="changePageSingled"></pagination> -->
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                            </el-tabs>
                            
                    </el-form-item>
                </el-form>
                <div class="btn-group">
                    <el-button :size="$size" @click="back()">返回</el-button>
                    <el-button :size="$size" type="primary" @click="addCard('addTicketForm')">保存</el-button>
                </div>
            </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import { EnumCouponType } from '@/util/publicParams.js'

    //枚举品类范围
    const EnumScope = [{key: "ALL", value:"全场"},{key: "GOODS", value:"单品"},{key: "CATEGORY", value:"品类"}]
    /**分类 */
    const EnumTypes = ['一级分类', '二级分类', '三级分类']
    export default {
        data() {
            const checkCount = (rule, value, call)=> {
                if(!value) {
                    return call(new Error('请输入折扣'))
                }
                if(!/^(?:([1-9](?:\.[\d]{0,2})?)|(?:0\.[1-9]{1,2})|10)$/g.test(value)) {
                    return call(new Error('折扣格式不正确'))
                }
                if(value > 999999.99){
                    return call(new Errror('折扣价格过大，请重新输入！'))
                }
                call();
            }
            const checkMoney = (rule, value, call)=>{
                if(!value){
                    return call(new Error('请输入优惠价格'))
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/g.test(value)){
                    return call(new Error('优惠价格不正确'))
                }
                if(value> 999999.99){
                    return call(new Error('优惠券价格过大，请重新输入!'))
                }
                call();
            }
            const checkNum = (rule, value, call)=>{
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/g.test(value)){
                    return call(new Error('请输入正整数'))
                }
                if(value > 99){
                    return call(new Error('数据输入过大，请重新输入'));
                }
                call();
            }
            return {
                EnumScope,
                EnumTypes,
                EnumCouponType,
                addTicketFormRules: {
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    discounts: [
                        { 
                            required: true,
                            validator: (rule, value, call)=>{
                                this.addTicketForm.couponType === 'DISCOUNT'?checkCount(rule, value, call): checkMoney(rule, value, call)
                            },
                            trigger: 'blur'
                        }
                    ],
                    subMoney: [
                        { required: true, validator: checkMoney, trigger: 'blur'}
                    ],
                    totalNum: [
                        { required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    limitNum: [
                        { required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    timeRange: [
                        { required: true, message: '请选择优惠券有效期', trigger: 'blur'}
                    ],
                    isUseCat: [
                        { required: true, validator: (rule, value, call)=>{
                            if(this.addTicketForm.codes){
                                call()
                            }else{
                                call(new Error('请至少选择一个分类'))
                            }
                        }, trigger: 'blur' }
                    ],
                    isUseSingle: [
                        { required: true, validator: (rule, value, call)=>{
                            if(this.addTicketForm.goodsIds){
                                call()
                            }else{
                                call(new Error('请至少选择一个分类'))
                            }
                        }, trigger: 'blur' }
                    ]
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                pageSingle: {
                    page: 1,
                    limit: 5,
                    total: 0
                },
                pageSingled: {
                    page: 1,
                    limit: 5,
                    total: 0
                },
                selectCat: '1',   //选择可用品类
                addTicketForm: {
                    couponType: EnumCouponType[0].key,
                    scope: EnumScope[0].key
                },
                tableList1: [],
                tableListData1: [],  //一级
                tableList2: [],
                tableListData2: [],  //二级
                tableList: [],
                tableListData: [],
                selectData: [],     //选中的表格中的内容
                tableListSingle: [],  //单品左表格
                tableListSingleData: [],
                codes: [],
                selectDataStatus: true    //true显示单品左边勾选条数， false显示单品右边勾选条数
            }
        },
        created(){
            this.getList();
            this.getGoodsList();
        },
        methods: {
            //提交
            addCard(formName) {
                this.$refs[formName].validate(v=> {
                    if(v){
                        let params = {
                            limitNum: this.addTicketForm.limitNum,
                            discounts: this.$math.multip(this.addTicketForm.discounts, 100),
                            totalNum: this.addTicketForm.totalNum,
                            couponType: this.addTicketForm.couponType,
                            couponScope: this.addTicketForm.scope,
                            name: this.addTicketForm.name,
                            validTime: moment(this.addTicketForm.timeRange[0]).format('X'),
                            invalidTime: moment(this.addTicketForm.timeRange[1]).format('X')
                        };
                        this.addTicketForm.couponType==='FULL_SUB'?params.subMoney = this.$math.multip(this.addTicketForm.subMoney, 100): "";
                        if(this.addTicketForm.scope===this.EnumScope[1].key) {
                            if(this.tableListSingleData.length===0) {
                                this.$message.error('请至少选择一个单品')
                                return false;
                            }else{
                                let goodsIds = [];
                                for(let i=0; i<this.tableListSingleData.length; i++) {
                                    goodsIds.push(this.tableListSingleData[i].sGoodsId)
                                }
                                params.goodsIds = goodsIds;
                            }
                        }
                        if(this.addTicketForm.scope===this.EnumScope[2].key) {
                            if(this.tableListData1.length!==0 || this.tableListData2.length!==0 || this.tableListData.length!==0) {
                                this.codes = [];
                                params.codes = this.tableListData1.length>0 
                                ? this.getCode(this.tableListData1)
                                : this.tableListData.length>0
                                ? this.getCode(this.tableListData)
                                : this.getCode(this.tableListData2);
                                
                            }else{
                                this.$message.error('请至少选择一个分类')
                                return false;
                                
                            }
                        }
                        this.$http.post(this.$api.cardCouponCreate, {coupon: params}, true).then(res=>{
                            this.$router.push("/mallDiscountTicket")
                        })
                        .catch(err=> {
                            this.$message.error(err.message)
                        })
                    }else{
                        return false;
                    }
                })
            },
            //获取品类
            getList() {
                this.$http.get(this.$api.cardCouponQListSGoodsCode, {}, true).then(res=>{
                    let result = this.sortData(res.codes)
                    this.tableList = result.arr;
                    this.tableList1 = result.arr1;
                    this.tableList2 = result.arr2;
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //获取单品
            getGoodsList() {
                this.$http.get(this.$api.cardCouponQListSGoods, {}, true).then(res=>{
                    this.tableListSingle = res.sGoods;
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //选择可用单品左边表格
            handleSelectionChangeT1(val) {
                if(!this.isSelect()){
                    this.selectData = val;
                    this.selectDataStatus = true
                }
            },
            //选择可用单品右边表格
            handleSelectionChangeT2(val) {
                this.selectData = val;
                if(val) {
                    this.selectDataStatus = false;
                }
            },
            //单品从左往右
            addCatSingle() {
                this.tableListSingleData = this.tableListSingleData.concat(this.selectData);
                this.deleteArr(this.tableListSingle, this.selectData);
            },
            //单品从右往左
            moveCatSingle() {
                this.tableListSingle = this.tableListSingle.concat(this.selectData);
                this.deleteArr(this.tableListSingleData, this.selectData);
            },
            //从右往左
            moveCat() {
                this.tableList = this.tableList.concat(this.selectData);
                this.deleteArr(this.tableListData, this.selectData);
            },
            //从左往右
            addCat() {
                if(!this.isSelect()) {
                    this.tableListData = this.tableListData.concat(this.selectData);
                    this.deleteArr(this.tableList, this.selectData);
                }
            },
            //从右往左
            moveCat1() {
                this.tableList1 = this.tableList1.concat(this.selectData);
                this.deleteArr(this.tableListData1, this.selectData);
            },
            //从左往右
            addCat1() {
                if(!this.isSelect()) {
                    this.tableListData1 = this.tableListData1.concat(this.selectData);
                    this.deleteArr(this.tableList1, this.selectData);
                }
            },
            //从右往左
            moveCat2() {
                this.tableList2 = this.tableList2.concat(this.selectData);
                this.deleteArr(this.tableListData2, this.selectData);
            },
            //从左往右
            addCat2() {
                if(!this.isSelect()) {
                    this.tableListData2 = this.tableListData2.concat(this.selectData);
                    this.deleteArr(this.tableList2, this.selectData);
                }
            },
            //单品删除方法
            deleteArr(leftArr, rightArr){
                rightArr.map((item, index, arr)=> {
                    for(let i =0, len = leftArr.length; i< len; i++) {
                        if(leftArr[i] && leftArr[i].sGoodsId === item.sGoodsId) {
                            leftArr.splice(i,1);
                        }
                    }
                })
            },
            //获取最小code
            getCode(arr) {
                for(let i =0; i< arr.length; i++) {
                    if(Array.isArray(arr[i].children)) {
                        this.getCode(arr[i].children)
                    }else{
                        this.codes.push(arr[i].code?arr[i].code: arr[i].sGoodsId)
                    }
                }
                return this.codes;
            },
            sortData(arr) {
                let res = {
                    arr: [],   //三级
                    arr1: [],  //一级
                    arr2: []  //二级
                };
                for(let i =0; i< arr.length; i++) {
                    if(Array.isArray(arr[i].children)) {
                        for(let j=0; j< arr[i].children.length; j++) {
                            if(Array.isArray(arr[i].children[j].children)) {
                                for(let k =0; k<arr[i].children[j].children.length; k++) {
                                    res.arr.push({
                                        first: arr[i].name,
                                        second: arr[i].children[j].name,
                                        third: arr[i].children[j].children[k].name,
                                        sGoodsId: arr[i].children[j].children[k].code
                                    })
                                }
                            }
                                let obj2 = {
                                    first: arr[i].name,
                                    second: arr[i].children[j].name,
                                    children: arr[i].children[j].children,
                                    sGoodsId: arr[i].children[j].code
                                }
                                res.arr2.push(obj2)
                            
                        }
                    }
                    let obj1 = {
                        first: arr[i].name,
                        children: arr[i].children,
                        sGoodsId: arr[i].code
                    }
                    res.arr1.push(obj1)
                }
                return res;
            },
            //扁平化数组
            flatten(arr){
                let res = [];
                for(let i=0;i<arr.length;i++){
                    if(Array.isArray(arr[i].children)){
                        res = res.concat(this.flatten(arr[i].children));
                    }else{
                        res.push(arr[i]);
                    }
                }
                return res;
            },
            //选中的表格
            isSelect() {
                switch(parseInt(this.selectCat)) {
                    case 1:
                        if(this.tableListData.length>0 || this.tableListData2.length>0)  {
                            this.$message.error(this.tableListData.length>0?'请移除三级分类中的右边分类再选择':'请移除二级分类中的右边分类再选择');
                            return true
                        }
                    break;
                    case 2: 
                        if(this.tableListData.length>0 || this.tableListData1.length>0)  {
                            this.$message.error(this.tableListData.length>0?'请移除三级分类中的右边分类再选择':'请移除一级分类中的右边分类再选择');
                            return true
                        }
                    break;
                    case 3:
                        if(this.tableListData1.length>0 || this.tableListData2.length>0)  {
                            this.$message.error(this.tableListData2.length>0?'请移除二级分类中的右边分类再选择':'请移除一级分类中的右边分类再选择');
                            return true
                        }
                    break
                }
            },
            handleClick() {
                this.selectData = [];
                this.toggleSelection()
            },
            toggleSelection(rows) {
                this.$refs.multipleTable1.clearSelection();
                this.$refs.multipleTable11.clearSelection();
                this.$refs.multipleTable2.clearSelection();
                this.$refs.multipleTable22.clearSelection();
                this.$refs.multipleTable3.clearSelection();
                this.$refs.multipleTable33.clearSelection();
            },
            back() {
                this.$router.push("/mallDiscountTicket")
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './mallDiscountTicketAdd.scss';
</style>
