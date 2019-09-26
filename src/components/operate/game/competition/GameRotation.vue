/*
 * @Author: liusheng 
 * @Date: 2019-06-14 18:21:24 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-26 16:59:52
 */
 //比赛轮次
<template>
    <div class='game-rotation'>
        <el-tabs v-model="rotationTabs" type="card">
            <!-- index起始为1 -->
            <el-tab-pane :key="index" v-for="index in rotation" :label="`第${fnHan(index)}轮`" :name="index">
                <h4> 基本设置：</h4>
                <el-form :model="baseForm.GAME[index-1]" :ref="'ruleForm'+index" v-if="gameType=='GAME'" label-width="120px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="单人比赛局数：" prop="innings" :rules="numberRuler">
                                <el-input :size="$size" v-model.number="baseForm.GAME[index-1].innings" style="width:80%">
                                </el-input>
                                <span>局</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="晋级排名：" v-if="rotationTabs!==rotation" prop="promotedNum" :rules="numberRuler">
                                <el-input :size="$size" v-model.number="baseForm.GAME[index-1].promotedNum" style="width:80%">
                                </el-input>
                                <span>名</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="房间分配：" prop="roomNum" :rules="numberRulerMax">
                                <span>每</span>
                                <el-input :size="$size" v-model.number="baseForm.GAME[index-1].roomNum" style="width:80px">
                                </el-input>
                                <span>人一房间进行比赛</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-form :model="baseForm.UPLOAD[index-1]" :ref="'ruleForm'+index" v-else label-width="180px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="开始时间：" prop="startTime" :rules="startTimeRuler">
                                <el-date-picker v-model="baseForm.UPLOAD[index-1].startTime" type="datetime" :size="$size"
                                    value-format="timestamp" placeholder="选择开始时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结束时间：" prop="endTime" :rules="endTimeRuler">
                                <el-date-picker v-model="baseForm.UPLOAD[index-1].endTime" type="datetime" :size="$size"
                                    value-format="timestamp" placeholder="选择结束时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12" v-if="rotationTabs!==rotation">
                            <el-form-item label="晋级排名：" prop="promotedNum" :rules="numberRuler">
                                <span>前</span>
                                <el-input :size="$size" v-model.number="baseForm.UPLOAD[index-1].promotedNum" style="width:80px">
                                </el-input>
                                <span>名</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否继续使用上轮作品：" v-if="rotationTabs!=1">
                                <el-select :size="$size" v-model="baseForm.UPLOAD[index-1].employ" placeholder="请选择">
                                    <el-option label="使用" value="yes">
                                    </el-option>
                                    <el-option label="不使用" value="no">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <template v-if="gameType=='GAME'">
                    <!-- 非最终轮次为晋级轮 -->
                    <gamePrizeSet v-model="prizeData[index-1].promotedData" v-if="rotationTabs!==rotation">
                        <span slot='title'>晋级奖：</span>
                        <span
                            slot='tips'>注：两者积分数相同，则将两者的胜场数来比较进行二次排名，如果积分相同的情况下，胜场数也相同，则空出后一个（相同的人数）计算后面的名次；例如：第①名有两个，且胜场数相同，则没有第②名，两个并列第一名，然后就是第三名</span>
                    </gamePrizeSet>
                    <!-- 最终轮次为决赛轮 -->
                    <GameFinalPrizeSet v-else v-model="prizeData[index-1].finaldData" ref="GameFinalPrizeSetRef">
                        <span slot='title'>排名奖：</span>
                    </GameFinalPrizeSet>
                    <gamePrizeSet v-model="prizeData[index-1].participationData">
                        <span slot='title'>参与奖：</span>
                    </gamePrizeSet>
                </template>
                <template v-else>
                    <!-- 非最终轮次为晋级轮 -->
                    <gamePrizeSet v-model="prizeData[index-1].promotedData" v-if="rotationTabs!==rotation">
                        <span slot='title'>晋级奖：</span>
                        <span
                            slot='tips'>注：两者积分数相同，则将两者的胜场数来比较进行二次排名，如果积分相同的情况下，胜场数也相同，则空出后一个（相同的人数）计算后面的名次；例如：第①名有两个，且胜场数相同，则没有第②名，两个并列第一名，然后就是第三名</span>
                    </gamePrizeSet>
                    <!-- 最终轮次为决赛轮 -->
                    <GameFinalPrizeSet v-else v-model="prizeData[index-1].finaldData" ref="GameFinalPrizeSetRef">
                        <span slot='title'>排名奖：</span>
                    </GameFinalPrizeSet>
                    <gamePrizeSet v-model="prizeData[index-1].participationData">
                        <span slot='title'>参与奖：</span>
                    </gamePrizeSet>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import gamePrizeSet from './GamePrizeSet';
import GameFinalPrizeSet from './GameFinalPrizeSet';
export default {
    name: 'gameRotation',
    data() {
        let numberRuler = (rule, value, callback) => {
            if (!value && value !== 0) {
                callback(new Error('不能为空'));
            } else {
                if (!Number.isInteger(value) || value < 1) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            }
        };
        let numberRulerMax = (rule, value, callback) => {
            if (!value && value !== 0) {
                callback(new Error('不能为空'));
            } else {
                if (!Number.isInteger(value) || value < 1) {
                    callback(new Error('请输入正整数'));
                } else {
                    if (parseInt(value) > 190) {
                        callback(new Error('不能大于190'));
                    } else {
                        callback();
                    }
                }
            }
        };
        let startTimeRuler = (rule, value, callback) => {
            if (!value && value !== 0) {
                callback(new Error('请选择日期'));
            } else {
                console.log(this.ruleRotation, value, this.baseForm);
                if (this.ruleRotation > 1 && value <= this.baseForm.UPLOAD[this.ruleRotation - 2].endTime) {
                    callback(new Error(`必须大于第${this.fnHan(this.ruleRotation - 1)}轮的结束时间`));
                } else {
                    if (
                        value >= this.baseForm.UPLOAD[this.ruleRotation - 1].endTime &&
                        this.baseForm.UPLOAD[this.rotationTabs - 1].endTime
                    ) {
                        callback(new Error('必须小于结束时间'));
                    } else {
                        callback();
                    }
                }
            }
        };
        let endTimeRuler = (rule, value, callback) => {
            if (!value && value !== 0) {
                callback(new Error('请选择日期'));
            } else {
                if (value <= this.baseForm.UPLOAD[this.ruleRotation - 1].startTime) {
                    callback(new Error('必须大于开始时间'));
                } else {
                    this.$refs['ruleForm' + this.ruleRotation][0].validateField('startTime'); //验证前一个输入框
                    callback();
                }
            }
        };
        return {
            // 选择的当前轮次
            rotationTabs: 1,
            baseForm: {
                GAME: [
                    {
                        innings: '', //单人比赛局数
                        promotedNum: '', //晋级排名
                        roomNum: '' //房间分配
                    }
                ],
                UPLOAD: [
                    {
                        startTime: '', //开始时间
                        endTime: '', //结束时间
                        employ: 'no', //是否继续使用上轮作品
                        promotedNum: '' //晋级排名
                    }
                ]
            },
            prizeData: [
                {
                    promotedData: [], //晋级
                    finaldData: [], //排名
                    participationData: [] //参与
                }
            ], //奖项内容
            numberRuler: [{ required: true, validator: numberRuler, trigger: 'blur' }],
            numberRulerMax: [{ required: true, validator: numberRulerMax, trigger: 'blur' }],
            startTimeRuler: [{ required: true, validator: startTimeRuler, trigger: 'change' }],
            endTimeRuler: [{ required: true, validator: endTimeRuler, trigger: 'change' }],
            ruleRotation: 1 //当前正则验证轮次
        };
    },
    props: {
        // 总轮次数
        rotation: {
            type: Number,
            default: 1
        },
        gameType: {
            type: String,
            default: 'GAME'
        },
        // 轮次数据
        value: {}
    },
    components: {
        gamePrizeSet,
        GameFinalPrizeSet
    },
    computed: {},
    created() {
        this.fnEditBaseForm();
        this.fnValueInit(); //绑定value值
    },
    mounted() {},
    methods: {
        // 如果有轮次数据，则初始化数据
        fnValueInit() {
            if (this.value && this.value.length) {
                console.log(this.value);
                //  let obj = {
                //         ...item,
                //         participation:{
                //             awardPrizes:this.prizeData[index].participationData,
                //             plateName:"参与奖-板块",
                //             lowerLimit:null,
                //             upperLimit:null
                //         }
                //     }
                //     if(index != (this.rotation-1)){//晋级奖
                //         obj.promoted = {
                //             awardPrizes:this.prizeData[index].promotedData,
                //             plateName:"晋级奖",
                //         }
                //         obj.tournamentType = 'PROMOTED'
                //     }else{//排名奖
                //         obj.rankings = this.prizeData[index].finaldData ;
                //         obj.tournamentType = 'RANKING'
                //     }
                this.value.forEach((item, index) => {
                    if (this.gameType == 'GAME') {
                        this.$set(this.baseForm[this.gameType][index], 'innings', item.innings);
                        this.$set(this.baseForm[this.gameType][index], 'promotedNum', item.promotedNum);
                        this.$set(this.baseForm[this.gameType][index], 'roomNum', item.roomNum);
                        try {
                            if (item.participation) {
                                this.$set(this.prizeData[index], 'participationData', item.participation.awardPrizes); //参与奖
                            }
                            if (item.promoted) {
                                this.$set(this.prizeData[index], 'promotedData', item.promoted.awardPrizes); //晋级奖
                            }
                            this.$set(this.prizeData[index], 'finaldData', item.rankings); //排名奖
                        } catch (error) {}
                    } else {
                        this.$set(this.baseForm[this.gameType][index], 'startTime', item.startTime);
                        this.$set(this.baseForm[this.gameType][index], 'endTime', item.endTime);
                        this.$set(this.baseForm[this.gameType][index], 'employ', item.employ);
                        this.$set(this.baseForm[this.gameType][index], 'promotedNum', item.promotedNum);
                        try {
                            if (item.participation) {
                                this.$set(this.prizeData[index], 'participationData', item.participation.awardPrizes); //参与奖
                            }
                            if (item.promoted) {
                                this.$set(this.prizeData[index], 'promotedData', item.promoted.awardPrizes); //晋级奖
                            }
                            this.$set(this.prizeData[index], 'finaldData', item.rankings); //排名奖
                        } catch (error) {}
                    }
                });
                console.log(this.prizeData);
            }
        },
        fnHan(index) {
            let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
            return arr[index - 1];
        },
        // 轮次变化改变baseForm内容
        fnEditBaseForm(lastNum = 1) {
            let i = this.rotation - lastNum;
            if (i > 0) {
                for (let index = 0; index < i; index++) {
                    this.baseForm.GAME.push({
                        innings: '', //单人比赛局数
                        promotedNum: '', //晋级排名
                        roomNum: '' //房间分配
                    });
                    this.baseForm.UPLOAD.push({
                        startTime: '', //开始时间
                        endTime: '', //结束时间
                        employ: 'no', //是否继续使用上轮作品
                        promotedNum: '' //晋级排名
                    });
                    this.prizeData.push({
                        promotedData: [], //晋级
                        finaldData: [], //排名
                        participationData: [] //参与
                    });
                }
            }
            if (i < 0) {
                for (let index = 0; index < -i; index++) {
                    this.baseForm.GAME.pop();
                    this.baseForm.UPLOAD.pop();
                    this.prizeData.pop();
                }
            }
        },
        fnValidate(call) {
            // call(true);
            // return
            for (let index = 0; index < this.rotation; index++) {
                let continueBoolean = true;
                console.log(this.$refs);
                this.ruleRotation = index + 1; //改变当前正则轮次
                this.$refs['ruleForm' + (index + 1)][0].validate(valid => {
                    if (valid) {
                        // 轮次数1开始           当前索引0开始
                        if (this.rotation == index + 1) {
                            this.$refs.GameFinalPrizeSetRef[this.rotation - 1].validate(callData => {
                                if (callData) {
                                    call(true); //最后一轮返回true
                                } else {
                                    call(false);
                                }
                            });
                        } else {
                            call(false);
                        }
                    } else {
                        // this.$message.error(`第${this.fnHan(index+1)}轮开始出错`);
                        continueBoolean = false; //跳出循环
                        call(false);
                        this.rotationTabs = index + 1;
                        this.$nextTick(() => {
                            let num = Number($('.xk-container').scrollTop()) + Number($('.is-error:first').offset().top);
                            $('.xk-container').animate(
                                {
                                    scrollTop: num - 90
                                },
                                500
                            );
                        });
                        return false;
                    }
                });
                if (!continueBoolean) {
                    break;
                }
            }
        }
    },
    watch: {
        rotationTabs(val) {
            console.log(val);
            this.ruleRotation = val;
        },
        gameType() {
            console.log(this.$refs);
        },
        // 轮次
        rotation(val, old) {
            this.rotationTabs = this.rotationTabs <= val ? this.rotationTabs : 1;
            this.fnEditBaseForm(old);
        },
        // 基本设置 如单人比赛局数、晋级排名等
        baseForm: {
            handler(val) {
                // 基本设置改变时改变v-model值
                let arr = [];
                console.log(val[this.gameType]);
                val[this.gameType].forEach((item, index) => {
                    let obj = {
                        ...item,
                        participation: {
                            awardPrizes: this.prizeData[index].participationData,
                            plateName: '参与奖-板块',
                            lowerLimit: null,
                            upperLimit: null
                        }
                    };
                    if (index != this.rotation - 1) {
                        //晋级奖
                        obj.promoted = {
                            awardPrizes: this.prizeData[index].promotedData,
                            plateName: '晋级奖'
                        };
                        obj.tournamentType = 'PROMOTED';
                    } else {
                        //排名奖
                        obj.rankings = this.prizeData[index].finaldData;
                        obj.tournamentType = 'RANKING';
                    }
                    arr.push(obj);
                });
                this.$emit('input', arr);
            },
            deep: true
        },
        // 奖项内容 如第一轮发什么奖品 第二轮发什么
        prizeData: {
            // 晋级	PROMOTED
            // 排名	RANKING
            handler(val) {
                // 奖项内容改变时改变v-model值
                console.log(val);
                console.log(this.baseForm[this.gameType]);
                let arr = [];
                this.baseForm[this.gameType].forEach((item, index) => {
                    let obj = {
                        ...item,
                        participation: {
                            awardPrizes: val[index].participationData,
                            plateName: '参与奖-板块',
                            lowerLimit: null,
                            upperLimit: null
                        }
                    };
                    if (index != this.rotation - 1) {
                        //晋级奖
                        obj.promoted = {
                            awardPrizes: val[index].promotedData,
                            plateName: '晋级奖'
                        };
                        obj.tournamentType = 'PROMOTED';
                    } else {
                        //排名奖
                        obj.rankings = val[index].finaldData;
                        obj.tournamentType = 'RANKING';
                    }
                    arr.push(obj);
                });
                console.log(arr);
                this.$emit('input', arr);
            },
            deep: true
        }
    }
};
</script>
<style scoped lang="scss">
.game-rotation {
    /deep/ .el-tabs__header {
        margin: 0;
        .el-tabs__nav {
            background: #efefef;
            border-color: #ffffff;
            .el-tabs__item {
                border-color: #ffffff;
            }
            .is-active {
                border-bottom-color: #efefef;
            }
        }
    }
    /deep/ .el-tabs__content {
        background: #efefef;
        padding: 15px;
    }
    h4 {
        font-weight: 600;
        height: 40px;
        line-height: 30px;
        border-bottom: 1px solid #ada7a7;
        color: #333333;
        margin-bottom: 20px;
    }
}
</style>