<template>
    <div class="expensive-spread">
        <el-card>
            <el-button type="danger" v-permission="'consumeLuckDrawCenterDel'" :size="$size" @click="deleteItem()">删除当前模组</el-button>
            <el-form label-width="200px" class="spread-set" :model="platformActivity" ref="platformActivity" :rules="rules">
                <h2>抽奖模组设置</h2>
                <div class="lottery-set">
                    <el-form-item label="抽奖模组名称：" prop="name">
                        <el-input class="input-size" v-model.trim="platformActivity.name" :size="$size" placeholder="请填写模组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="抽奖组件：">
                        <el-select class="input-size" :size="$size" v-model="platformActivity.uiType" @change="changeUiType">
                            <el-option value="slot" label="老虎机"></el-option>
                            <el-option value="turntable" label="大转盘"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连抽笔数设置：" class="margintop20">
                        <el-row class="input-size" style="display: inline-block;float: left">
                            <el-col :span="11">
                                <el-form-item label-width="0">
                                    <el-input v-model.trim="platformActivity.consNumberScope.min" :size="$size" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" class="center">-</el-col>
                            <el-col :span="11">
                                <el-form-item label-width="0" :prop="`consNumberScope.max`" :rules="rules.checkInteger">
                                    <el-input v-model.trim="platformActivity.consNumberScope.max" :size="$size" @change="changePrizeNum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item style="display: inline-block;float: left" label-width="0">&nbsp;&nbsp;笔</el-form-item>
                    </el-form-item>
                    <!-- <xk-form-item label="每个用户每天可参与次数：" type="integer" prop="receiveLimit">
                        <el-input class="input-size" :size="$size" v-model.trim="platformActivity.receiveLimit" placeholder="1"></el-input>
                    </xk-form-item> -->
                    <el-form-item label="选择奖品数量：">
                        <el-select class="input-size" :size="$size" v-model.trim="platformActivity.prizeQuantity">
                            <template v-if="platformActivity.uiType==='slot'">
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

                    <!-- 大转盘 -->
                    <turntable-component 
                            rules="spread" 
                            :detail="lotteryDetail" 
                            :lotteryNum="platformActivity.prizeQuantity" 
                            :max="platformActivity.consNumberScope.max"  
                            @on-save="saveData" 
                            @on-pos="savePosData"></turntable-component>
                    <!-- 推广条件设置 -->
                    <h2 class="margintop20">推广条件设置</h2>
                    <expensive-spread-condition
                            ref="condition"
                            v-model="platformActivity.promotionRule" 
                            :conditionData="conditionData" 
                            :activeType="activeType"
                            @selection-change="handleSelectionChange">
                    </expensive-spread-condition>

                    <!-- 奖品连中设置 -->
                    <h2 class="margintop20">奖品连抽设置</h2>

                    <!-- 奖品连中设置 -->
                    <div class="prize-continue">
                        <!-- 连中设置 -->
                        <prize-continue-set ref="prizeContinue" :rules="platformActivity.consecutiveRules" :prizeData="prizeData"></prize-continue-set>
                    </div>

                </div>
            </el-form>
        </el-card>
    </div>
</template>


<script>
    import moment from 'moment';
    import { mapState, mapMutations } from 'vuex';
    import PrizeContinueSet from './PrizeContinueSet.vue';
    import ExpensiveSpreadCondition from './ExpensiveSpreadCondition.vue';
    import XkFormItem from '@/components/common/XKFormItem.vue';
    import TurntableComponent from './TurntableComponent.vue';

    export default {
        components: {
            PrizeContinueSet,
            ExpensiveSpreadCondition,
            TurntableComponent,
            XkFormItem
        },
        props: {
            //2是普通用户，其它是联盟商
            activeType: {
                default: 2,
                type: [Number,String]
            },
            //false代表推广抽奖，true代表消费抽奖
            lotteryType: {
                default: false,
                type: Boolean
            },
            //转盘活动ID
            activeId: ""
        },
        data() {
            const checkDecimal = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/(^[0-9]{1}[\.]{0,1}\d*$)|(^[1-9]\d*[\.]{0,1}\d*$)/.test(value)) {
                    return call(new Error('请输入正整数或小数'))
                }
                call()
            }

            const checkInteger = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                call();
            }
            return {
                lotteryDetail: "",
                prizeData: [],
                moment: moment,
                platformActivity: {},
                promotionForm: {},
                dialogVisible: false,
                current: {},
                conditionData:[],
                rules: {
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    checkDecimal: [
                        { required: true, validator: checkDecimal, trigger: 'blur' }
                    ],
                    checkInteger: [
                        { required: true, validator: checkInteger, trigger: 'blur' }
                    ],
                    validTime: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    checkNum: [
                        { required: true, validator: checkInteger, trigger: 'blur' }
                    ],
                    nocheck: [
                        { required: true, validator: this.nocheck, trigger: 'blur' }
                    ]
                },
                userContinueTotal: 1,
                selectIndex: '0',
                lotteryMap: new Map(),
                lotteryData: [],
                isChange: false
            }
        },
        created() {
            this.initData();
            this.initActivity();
        },
        computed: {
            ...mapState({
                tmpList: state => state.operatePlatform.tempList,
                spreadList: state => state.operatePlatform.spreadList,
                currListIndex: state => state.operatePlatform.currListIndex,
                spreadId: state => state.operatePlatform.spreadId
            })
        },
        methods: {
            ...mapMutations({
                setSpreadList: "operatePlatform/setSpreadList",
                setExpenseId: "operatePlatform/setExpenseId",
                setSpreadId: "operatePlatform/setSpreadId"
            }),
            nocheck(rule, value, call) {
                return call();
            },
            initData() {
                // this.conditionData =[
                //     { name: '分享自营商品', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'mall_goods_share' , checked: false},
                //     { name: '订单金额达标', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'order_amount_reach' , checked: false }
                // ];
                // let userData = [
                //     { name: '分享店铺', set: '', validTime: '', weightAmount: '', isMustReach: 0, type: 'shop_share'  , checked: false},
                //     { name: '上传的小视频达标', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'video_reach' , checked: false},
                //     { name: '分享游戏', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'game_share'  , checked: false},
                //     { name: '分享小视频或直播', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'video_share' , checked: false},
                //     { name: '分享平台活动', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'platform_activity_share' , checked: false}
                // ]

                // if(this.activeType==2) {
                //     this.conditionData.push(...userData);
                // }
                this.conditionData = [];

                this.lotteryDetail = "";
                this.prizeData = [];
                this.isChange = false;
            },
            initActivity() {
                this.platformActivity = {
                    uiType: 'slot',
                    prizeQuantity: 8,
                    consNumberScope: {
                        min: 1
                    },
                    promotionRule: {
                        isAllFinish: '1'     //  0 不全部满足    1 全部满足
                    },
                    consecutiveRules: {
                        0: {
                            winRatio: '',
                            ids:[[]]
                        }
                    },
                    positions: [],
                    selectedCondition: [],   //保存推广行为设置选中的类
                }
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
                this.platformActivity.consecutiveRules = obj;
            },
            handleSelectionChange(val) {
                this.platformActivity.selectedCondition = val;
            },
            saveData(data) {
                this.changePrizeNum(this.platformActivity.consNumberScope.max);
                this.prizeData = data;
            },
            savePosData(data) {
                this.platformActivity.positions = data;
            },
            save() {
                return new Promise((resolve, reject) => {
                    this.$refs['platformActivity'].validate(v=>{
                        if(v) {
                            let result = this.$refs['prizeContinue'].validate();
                            let condition = this.$refs['condition'].validate();
                            Promise.all([result, condition])
                            .then(res=>{
                                console.log(this.platformActivity)
                                resolve(this.platformActivity);
                            })
                            .catch(err=>{
                                reject(false);
                            })
                            
                        }else{
                            reject(false);
                            return false;
                        }
                    })
                })
            },
            selecteTab(node) {
                if(node.name=='add') {
                    this.$prompt('请输入推广抽奖模板名称', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValidator: (value)=>{
                            if(!value) {
                                return '不能为空'
                            }
                        }
                    }).then(({value}) => {
                        this.spreadList.push({name:value, id:""})
                        this.selectIndex = this.spreadList.length-1;
                        this.initData();
                    }).catch(()=>{
                        this.selectIndex = '1'
                    })
                }
            },
            /**
             * 删除模板
             */
            deleteItem() {
                if(this.spreadList[this.selectIndex].id){
                    this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning'
                    }).then(() => {
                        this.$http.post(this.$api.activityPlatformDelete, {id: this.spreadList[this.selectIndex].id}, true).then(res=>{
                            this.$message.success('删除成功');
                            this.getTmpList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }).catch();
                }
            },
            /**
             * 获取
             */
            getTmpList() {
                //获取转盘推广抽奖设置简要
                this.$http.get(this.$api.activityPlatformList, {templateId: this.tmpList[this.currListIndex].templateId, suitableUsers: this.activeType=='2'? 'COMMON_USER': 'MERCHANT' }, true).then(res=>{
                    if(res){
                        let arr = [], expenseId="";
                        res.activities.forEach(item=>{
                            if(item.type === "promotion") {
                                arr.push(item)
                            }else{
                                expenseId = item.id;
                            }
                        })
                        this.setExpenseId(expenseId? expenseId: "")
                        this.setSpreadList(arr);
                        this.setSpreadId(arr[0].id);
                    }else{
                        this.setSpreadList([])
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            /**
             * 获取模板详情
             */
            getDetail(id) {
                if(id){
                    this.$http.get(this.$api.activityPlatformDetail, {id: id}, true).then(res=>{
                        console.log(res)
                        this.re_CreatData(res);
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }else{
                    this.initData();
                    this.initActivity()
                }
            },
            /**
             * 构建回显数据
             */
            re_CreatData(params) {
                this.initData();
                this.isChange = true;
                this.platformActivity = {
                    id: params.id,
                    name: params.name,
                    uiType: params.uiType,
                    prizeQuantity: params.positions.length== params.prizeQuantity? Number(params.prizeQuantity): params.positions.length,
                    consNumberScope: {
                        min: 1,
                        max: params.consNumberScope.max
                    },
                    // receiveLimit: params.receiveLimit,
                    // promotionRule: {
                    //     isAllFinish: params.promotionRule.isAllFinish+'',     //  0 不全部满足    1 全部满足
                    //     finishQuantity: params.promotionRule.finishQuantity
                    // },
                    consecutiveRules: this.handleConsecutiveRules(params.consecutiveRules),
                    positions: this.re_createPrizeData(params.positions),
                    selectedCondition: params.promotionRule.promotionActions,   //保存推广行为设置选中的类
                }
                if(!this.lotteryType) {
                    this.platformActivity.promotionRule = {
                        isAllFinish: params.promotionRule.isAllFinish+'',     //  0 不全部满足    1 全部满足
                        finishQuantity: params.promotionRule.finishQuantity
                    };
                    this.platformActivity.selectedCondition = params.promotionRule.promotionActions;
                    //推广行为
                    this.conditionData = params.promotionRule.promotionActions;
                }
                
                this.handleLotteryData(params.positions);
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
            //处理连中数据
            handleConsecutiveRules(params) {
                let obj = {};
                params.forEach((item, index)=> {
                    obj[index] = {
                        winRatio: item.winRatio /100,
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
            changeUiType() {
                this.isChange = false;
            }
        },
        watch: {
            activeType(val) {
                this.selectIndex = '0';
            },
            selectIndex(val) {
                val&& val!=='add'&& this.spreadList[val] ? this.getDetail(this.spreadList[val].id): null;               
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
            },
            // spreadList: {
            //     handler(val) {
            //         if(val.length==0) {
            //             this.spreadList.push({name:"抽奖模组一", id:""})
            //         }else{
            //             this.getDetail(this.spreadList[this.selectIndex]
            //             ? this.spreadList[this.selectIndex].id
            //             : ""
            //             );
            //         }
            //     }
            // },
            "platformActivity.uiType"(val){
                this.platformActivity.prizeQuantity= val=='slot'? this.isChange? this.platformActivity.prizeQuantity:'8': this.isChange? this.platformActivity.prizeQuantity: '4'
            },

            //优化
            activeId(val) {
                console.log('奖品获取：', val)
                this.getDetail(val);
            }
        }
    }
</script>

<style scoped lang="scss">
    $inputSize: 300px;

    .spread-set {
        padding: 20px;
    }
    .input-size {
        width: $inputSize
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
    .dialog-edit-spread {
        /deep/ .el-input {
            width: 350px;
        }
    }
</style>
