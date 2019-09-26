<template>
    <div class="expensive-consume">
        <el-card>
            <el-form label-width="200px" class="spread-set" :model="consumeForm" ref="consumeForm">
                <h2>抽奖组件设置</h2>
                <div class="lottery-set">
                    <el-form-item label="抽奖组件：">
                        <el-select class="input-size" :size="$size" v-model="consumeForm.uiType" @change="changeNum">
                            <el-option value="slot" label="老虎机"></el-option>
                            <el-option value="turntable" label="大转盘"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连抽笔数设置：" class="margintop20">
                        <el-row class="input-size" style="display: inline-block;float: left">
                            <el-col :span="11">
                                <el-form-item label-width="0">
                                    <el-input :size="$size" v-model.trim="consumeForm.consNumberScope.min" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" class="center">-</el-col>
                            <el-col :span="11">
                                <xk-form-item label-width="0" type="integer" :prop="'consNumberScope.max'">
                                    <el-input :size="$size" v-model.number="consumeForm.consNumberScope.max" @change="changePrizeNum"></el-input>
                                </xk-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item style="display: inline-block;float: left" label-width="0">&nbsp;&nbsp;笔</el-form-item>
                    </el-form-item>
                    <!-- <xk-form-item label="每个用户每天可参与次数：" type="integer" prop="receiveLimit">
                        <el-input class="input-size" :size="$size" v-model.trim="consumeForm.receiveLimit" placeholder="1"></el-input>
                    </xk-form-item> -->
                    <el-form-item label="选择奖品数量：">
                        <el-select class="input-size" :size="$size" v-model.trim="consumeForm.prizeQuantity">
                            <template v-if="consumeForm.uiType==='slot'">
                                <el-option value="8" label="8"></el-option>
                                <el-option value="10" label="10"></el-option>
                                <el-option value="12" label="12"></el-option>
                            </template>
                            <template v-else>
                                <el-option value="4" label="4"></el-option>
                                <el-option value="6" label="6"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <!-- 转盘配置 -->
                    <turntable-component 
                            rules="consume" 
                            :detail="lotteryDetail" 
                            :lotteryNum="consumeForm.prizeQuantity" 
                            :max="consumeForm.consNumberScope.max" 
                            @on-save="saveData" 
                            @on-pos="savePosData"></turntable-component>

                    <!-- 随机红包加倍设置 -->
                    <h2 class="margintop20">随机红包加倍设置</h2>
                    <el-row>
                        <el-col :span="16">
                            <el-button style="float:right" :size="$size" type="success" @click="addRangeSet()">新增一个区间设置</el-button>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 5px">
                        <el-col :span="16">
                            <el-table :data="consumeForm.redoubles">
                                <el-table-column label="消费金额区间">
                                    <template slot-scope="scope">
                                        {{ scope.row.startAmount }} - {{ scope.row.endAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="最高加倍数" prop="multiple"></el-table-column>
                                <el-table-column label="更新时间">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.updatedAt">
                                            {{ scope.row.updatedAt | formatTime }}
                                        </span>
                                        <span v-else>
                                            {{ moment().format('YYYY-MM-DD HH:mm:ss') }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" :size="$size" @click="editRangeSet(scope.row, scope.$index)">编辑</el-button>
                                        <el-button type="text" :size="$size" @click="delRangeSet(scope.$index)" class="xk-danger">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>

                    <!-- 奖品连中设置 -->
                    <h2 class="margintop20">奖品连抽设置</h2>

                    <!-- 奖品连中设置 -->
                    <div class="prize-continue">
                        <prize-continue-set :rules="consumeForm.consecutiveRules" :prizeData="prizeData"></prize-continue-set>
                    </div>
                </div>
            </el-form>
        </el-card>

        <!-- 区间设置弹框 -->
        <el-dialog :visible.sync="rangeVisible" :title="edit? '修改随机红包加倍设置': '新增随机红包加倍设置'" width="400px" top="40vh">
            <el-form label-width="120px" :model="rangForm" :rules="rules" ref="rangForm">
                <el-form-item label="金额区间">
                    <el-row class="range-form-row">
                        <el-col :span="9">
                            <el-form-item label-width="0" prop="startAmount">
                                <el-input :size="$size" v-model.trim="rangForm.startAmount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" class="center">至</el-col>
                        <el-col :span="9">
                            <el-form-item label-width="0" prop="endAmount">
                                <el-input :size="$size" v-model.trim="rangForm.endAmount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" class="center">元</el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="最高翻">
                    <el-row class="range-form-row">
                        <el-col :span="21">
                            <el-form-item label-width="0" prop="multiple">
                                <el-input :size="$size" v-model.trim="rangForm.multiple"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" class="center">倍</el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" type="danger" @click="rangeVisible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="updateRangeSet('rangForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import PrizeContinueSet from './PrizeContinueSet.vue';
    import XkFormItem from '@/components/common/XKFormItem.vue';
    import TurntableComponent from './TurntableComponent.vue';
    import { mapState } from 'vuex';
    import moment from 'moment';
    
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        components: {
            PrizeContinueSet,
            XkFormItem,
            TurntableComponent
        },
        data() {
            return {
                moment,
                lotteryDetail: "",
                prizeData: [],
                consumeForm: {
                    uiType: 'slot',
                    consNumberScope: {
                        min: 1
                    },
                    prizeQuantity: 8,
                    consecutiveRules: {
                        0: {
                            winRatio: '',
                            ids:[[]]
                        }
                    },
                    positions: []
                },
                visible: false,
                lotteryMap: new Map(),
                rangeVisible: false,
                rangForm: {},
                edit: false,
                editIndex: 0,
                rules: {
                    startAmount: [
                        { required: true, validator: (rule, value, call) => {
                            if(!value) {
                                return call(new Error('不能为空!'))
                            }
                            if(!/(^[0-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                                return call(new Error('请输入数字类型'))
                            }
                            if(Number(this.rangForm.endAmount)<=Number(value) && !isNaN(Number(this.rangForm.endAmount))) {
                                return call(new Error(`请输入小于${this.rangForm.endAmount}的值`))
                            }
                            call();
                        }, trigger: 'blur' }
                    ],
                    endAmount: [
                        { required: true, validator: (rule, value, call) => {
                            if(!value) {
                                return call(new Error('不能为空!'))
                            }
                            if(!/(^[0-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                                return call(new Error('请输入数字类型'))
                            }
                            if(Number(this.rangForm.startAmount)>=Number(value) && !isNaN(Number(this.rangForm.startAmount))) {
                                return call(new Error(`请输入大于${this.rangForm.startAmount}的值`))
                            }
                            call();
                        }, trigger: 'blur' }
                    ],
                    multiple: [
                        { required: true, validator: (rule, value, call) => {
                            if(!value) {
                                return call(new Error('不能为空!'))
                            }
                            if(!/(^[1-9]\d*$)/.test(value)) {
                                return call(new Error('请输入大于0的数字'))
                            }
                            call();
                        }, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                expenseId: state=> state.operatePlatform.expenseId
            })
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.consumeForm = {
                    uiType: 'slot',
                    consNumberScope: {
                        min: 1
                    },
                    prizeQuantity: 8,
                    consecutiveRules: {
                        0: {
                            winRatio: '',
                            ids:[[]]
                        }
                    },
                    positions: [],
                    redoubles: []
                }
                this.lotteryDetail = "";
                this.prizeData = [];
            },
            openEdit(row) {
                this.visible = true;
            },
            saveData(data) {
                this.changePrizeNum(this.consumeForm.consNumberScope.max);
                this.prizeData = data;
            },
            savePosData(data) {
                this.consumeForm.positions = data;
            },
            save() {
                return new Promise((resolve, reject) => {
                    this.$refs['consumeForm'].validate(v=>{
                        if(v) {
                            console.log(this.consumeForm)
                            resolve(this.consumeForm);
                        }else{
                            reject(false);
                        }
                    })
                    
                })
            },
            /***
             * 回显数据
             */
            re_platformData(params) {
                console.log(params)
                this.consumeForm = {
                    id: params.id,
                    uiType: params.uiType,
                    consNumberScope: {
                        min: 1,
                        max: params.consNumberScope.max
                    },
                    // receiveLimit: params.receiveLimit,
                    prizeQuantity:  params.positions.length== params.prizeQuantity? Number(params.prizeQuantity): params.positions.length,
                    consecutiveRules: this.handleConsecutiveRules(params.consecutiveRules),
                    positions: this.re_createPrizeData(params.positions),
                    redoubles: params.redoubles? params.redoubles.map(item=>{
                        return {
                            startAmount: this.$math.divide(item.startAmount, 100),
                            endAmount: this.$math.divide(item.endAmount, 100),
                            multiple: item.multiple,
                            redoubleId: item.redoubleId,
                            updatedAt: item.updatedAt
                        }
                    }): []
                }
                this.handleLotteryData(params.positions);
                console.log(this.consumeForm)
            },
            //处理转盘中已选择的奖品ID
            handleLotteryData(params) {
                this.lotteryMap = new Map();
                params.forEach(item=>{
                    this.getLotteryMap(item.prizes)
                })
            },
            getLotteryMap(params) {
                params.forEach(item=>{
                    if(!this.lotteryMap.get(item.id)){
                        this.lotteryMap.set(item.id, item)
                    }
                })
            },
            getDetail() {
                this.$http.get(this.$api.activityPlatformDetail, { id: this.expenseId }, true).then(res=>{
                    console.log(JSON.stringify(res))
                    this.re_platformData(res);
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //处理连中数据
            handleConsecutiveRules(params) {
                let obj = {};
                params.forEach((item, index)=> {
                    obj[index] = {
                        winRatio: item.winRatio/100,
                        ids:[]
                    }
                    for(let j =0; j< item.consecutivePrizes.length; j++) {
                        obj[index].ids.push(item.consecutivePrizes[j].prizeIds);
                    }
                })
                return obj;
            },
            /**
             * 构造奖品原始数据结构
             */
            re_createPrizeData(params) {
                let arr = [];
                this.lotteryDetail = params.map(item=>{
                    arr.push({
                        positionType: item.positionType,
                        prizeIds: item.prizes.map(subItem=>{
                            return subItem.id
                        }),
                        position: item.position
                    });

                    return {
                        name:item.positionType==='consecutive'? '连抽': item.prizes[0].type==="red_packet"? '红包': item.prizes[0].name,
                        positionType: item.positionType,
                        prizeIds: item.prizes.map(subItem=>{
                            return subItem.id
                        })
                    }
                })
                return arr;
            },
            //连中最大值变化时，改变连中设置
            changePrizeNum(val) {
                let max = val? val: 1;
                let obj = {};
                for(let i=0; i<val;i++) {
                    obj[i] = {
                        winRatio: '',
                        ids:[[]]
                    };
                    for(let j=0; j<i; j++) {
                        obj[i].ids.push([]);
                    }
                }
                this.consumeForm.consecutiveRules = obj;
            },
            changeNum(val) {
                this.consumeForm.prizeQuantity = val==='slot'? '8': '4';
            },
            //随机红包加倍设置
            editRangeSet(row, index) {
                this.edit = true;
                this.rangForm = JSON.parse(JSON.stringify(row));
                this.rangeVisible=true;
                this.editIndex = index;
            },
            addRangeSet() {
                this.rangForm = {};
                this.edit = false;
                this.rangeVisible=true;
            },
            updateRangeSet(formName) {
                console.log(this.rangForm)
                this.$refs[formName].validate(v=> {
                    if(v) {
                        if(this.edit) {
                            this.$set(this.consumeForm.redoubles, this.editIndex, this.rangForm);
                        }else{
                            this.consumeForm.redoubles.push(this.rangForm);
                        }
                        this.rangeVisible = false;
                    }else{
                        return false;
                    }
                })
            },
            delRangeSet(index) {
                this.$alert('是否删除当前行？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning'
                })
                .then(()=>{
                    this.consumeForm.redoubles.splice(index, 1);
                })
                .catch(()=>{})
            }
        },
        watch: {
            //当选中当前选项卡时，获取详情
            show(val) {
                val&&this.expenseId?this.getDetail(): this.initData();
            },
            //当活动ID变化时，获取详情
            expenseId(val) {
                val?this.getDetail(): this.initData();
            },
            lotteryMap: {
                handler(maps) {
                    let list = [];
                    maps.forEach(item=>{
                        if(item.isDefaultRedPacket != 1) {
                            list.push(item);
                        }
                    })
                    this.prizeData = list;
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    $fontSize : 14px;
    $fontColor: #666;
    $lh40: 40px;
    $inputSize: 300px;
    $percentInput : 150px;
    .spread-set {
        padding: 20px;
    }
    .spread-condition-set {
        padding: 20px;
    }

    .font-style {
        font-size: $fontSize;
        color: $fontColor
    }
    .line-height{
        line-height: $lh40;
    }
    .input-size {
        width: $inputSize
    }
    .percentInput {
        width: $percentInput
    }
    /deep/ .el-form-item {
        margin-bottom: 10px;
    }
    .prize-continue {
        padding: 0 20px;
        .prize-continue-box {
            padding: 20px;
            border: 1px solid #f5f5f5;
            border-radius: 10px;
            box-shadow: 0px 5px 15px #ddd;
        }
    }
    .mb10 {
        margin-bottom: 5px;
    }
    h4{
        color: $fontColor;
        font-weight: bolder;
        font-size: $fontSize;
    }
    .range-form-row {
        /deep/ .el-form-item {
            margin-bottom: 0;
        }
    }
</style>

