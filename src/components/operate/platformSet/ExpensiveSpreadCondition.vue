<template>
    <div class="expensive-spread-condition">
        <el-form ref="value" :model="value">
            <div class="spread-condition-set">
                <el-row class="font-style">
                    <el-col :span="1"><el-radio v-model="isAllFinish" label="1">&nbsp;</el-radio></el-col>
                    <el-col :span="10">同时满足后触发</el-col>
                </el-row>
                
                <el-row class="font-style line-height">
                    <el-col :span="1"><el-radio v-model.trim="isAllFinish" label="0">&nbsp;</el-radio></el-col>
                    <el-col :span="1">满足</el-col>
                    <el-col :span="2">
                        <el-form-item label-width="0" prop="finishQuantity" :rules="isAllFinish==0? rules.checkInteger: rules.nocheck">
                            <el-input :size="$size" v-model.trim="value.finishQuantity"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="center">条后触发</el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="8">
                        <el-collapse-transition>
                            <div class="font-style" v-show="isAllFinish==0">
                                <span class="xk-danger">当勾选满足n条后触发：</span>
                                <p style="line-height: 26px;">&nbsp;&nbsp;&nbsp;&nbsp;1.勾选的推广行为数量需≥满足触发条件的数量</p>
                                <p style="line-height: 26px;">&nbsp;&nbsp;&nbsp;&nbsp;2.必须满足条件的数量需≤满足触发条件的数量</p>
                            </div>
                        </el-collapse-transition>
                    </el-col>
                </el-row>
                
            </div>
        </el-form>
        <spread-condition-seting :ruleData="ruleData" @selection-change="handleSelectionChange" ref="checkCondition"></spread-condition-seting>
    </div>
</template>
<script>
    import SpreadConditionSeting from './SpreadConditionSeting.vue';

    const conditionDataIndex = {
        mall_goods_share: 0,
        order_amount_reach: 1,
        shop_share: 2,
        video_reach: 3,
        game_share: 4,
        video_share: 5,
        // platform_activity_share: 6
    }

    export default {
        components: {
            SpreadConditionSeting
        },
        props: {
            value: {
                default: ()=>({
                    isAllFinish: '1'
                }),
                type: Object
            },
            activeType: {
                default: '2',
                type:[String, Number]
            },
            conditionData: {
                default: ()=> [],
                type: Array
            }
        },
        data() {
            const checkInteger = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error(value==='0'?'不能为0':'请输入正整数'))
                }
                call();
            }
            return {
                isAllFinish: '1',
                rules: {
                    checkInteger: [
                        { required: true, validator: checkInteger, trigger: 'blur' }
                    ],
                    nocheck: [
                        { required: true, validator: this.nocheck, trigger: 'blur' }
                    ]
                },
                ruleData: []
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            nocheck(rule, value, call) {
                return call();
            },
            initData() {
                this.ruleData =[
                    { name: '分享自营商品', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'mall_goods_share' , checked: false},
                    { name: '订单金额达标', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'order_amount_reach' , checked: false }
                ];
                let userData = [
                    { name: '分享店铺', set: '', validTime: '', weightAmount: '', isMustReach: 0, type: 'shop_share'  , checked: false},
                    { name: '上传的小视频达标', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'video_reach' , checked: false},
                    { name: '分享游戏', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'game_share'  , checked: false},
                    { name: '分享小视频或直播', set: '', validTime: '', weightAmount: '', isMustReach: 0 , type: 'video_share' , checked: false}
                ]

                if(this.activeType==2) {
                    this.ruleData.push(...userData);
                }

            },
            //推广行为
            handlePromotion(params) {
                this.initData();
                params.forEach(item=> {
                    let index = conditionDataIndex[item.type];
                    if(this.activeType==3 && index>1) {
                        return false;
                    }
                    if(index == 1) {
                        this.ruleData[index].amount = item.reachRule.amount /100;
                    }
                    if(index == 3) {
                        this.ruleData[index].commentCount = item.reachRule.commentCount;
                        this.ruleData[index].forwardCount = item.reachRule.forwardCount;
                        this.ruleData[index].likedCount = item.reachRule.likedCount;
                    }
                    this.ruleData[index].validTime = [item.validTime.start*1000 +new Date(new Date().setHours(0, 0, 0, 0)).getTime(), item.validTime.end*1000 +new Date(new Date().setHours(0, 0, 0, 0)).getTime()];
                    this.ruleData[index].weightAmount = this.$math.divide(item.weightAmount, 100);
                    this.ruleData[index].multiple = item.multiple;
                    this.ruleData[index].isMustReach = item.isMustReach;
                    this.ruleData[index].checked = true;
                })
            },
            validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['checkCondition'].selectChange();
                    this.$refs['value'].validate(v=>{
                        if(v) {
                            this.value.isAllFinish=this.isAllFinish;
                            resolve(this.value);
                        }else{
                            reject(false);
                            return false;
                        }
                    })
                })
            },
            handleSelectionChange(val) {
                this.$emit('selection-change', val);
            },
        },
        watch: {
            activeType() {
                this.initData();
            },
            conditionData: {
                handler(val) {
                    console.log(val)
                    if(val.length===0 || !val) {
                        this.initData();
                    }else{
                        this.handlePromotion(JSON.parse(JSON.stringify(val)))
                    }
                },
                deep: true
            },
            "value.isAllFinish"(val) {
                this.isAllFinish = val;
            }
        }
    }
</script>

<style scoped lang="scss">
    $fontSize: 14px;
    $fontColor: #666;
    $lh40: 40px;
    $inputSize: 300px;

    .expensive-spread-condition{
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
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
