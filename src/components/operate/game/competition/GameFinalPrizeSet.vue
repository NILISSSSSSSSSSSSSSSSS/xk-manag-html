/*
 * @Author: liusheng 
 * @Date: 2019-06-15 14:02:03 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-27 14:56:18
 */
<template>
    <div class='game-final-prize-set'>
        <h4>
            <slot name="title" />
            <div class="btns">
                <el-button type="primary" :size="$size" @click="fnAddQuJian">增加区间</el-button>
                <el-button type="danger" :size="$size" @click="fnDelQuJian">删除区间</el-button>
            </div>
        </h4>
        <el-tabs v-model="activeTab" class="rank-tabs" type="border-card" tab-position="left">
            <!-- item=index+1 -->
            <el-tab-pane v-for="(item,index) in editableTabs" :key="index">
                <el-input class="tabs-title" :size="$size" slot="label" v-model="dataArr[index].title" :placeholder="`${fnHan(index)}等奖`"></el-input>
                <el-form :inline="true" :model="dataArr[index].sectionArr" :ref="'dataForm'+index">
                    <el-form-item :label="`(${dataArr[index].title?dataArr[index].title:fnHan(index)+'等奖'})排名区间：`" prop="0" :rules="rule1">
                        <span>第</span>
                        <el-input :size="$size" v-model.number="dataArr[index].sectionArr[0]" style="width:100px"></el-input>
                        <span>名</span>
                    </el-form-item>
                    <el-form-item>
                        <span>——</span>
                    </el-form-item>
                    <el-form-item prop="1" :rules="rule2">
                        <span>第</span>
                        <el-input :size="$size" v-model.number="dataArr[index].sectionArr[1]" style="width:100px"></el-input>
                        <span>名</span>
                    </el-form-item>
                </el-form>
                <gamePrizeSet v-model="dataArr[index].finaldData" isFinal>
                    <span slot='tips'>注：两者积分数相同，则将两者的胜场数来比较进行二次排名，如果积分相同的情况下，胜场数也相同，则空出后一个（相同的人数）计算后面的名次；例如：第①名有两个，且胜场数相同，则没有第②名，两个并列第一名，然后就是第三名</span>
                </gamePrizeSet>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import gamePrizeSet from './GamePrizeSet';
export default {
    name: 'gameFinalPrizeSet',
    data() {
        // 验证左侧名次
        let rankRule1 = (rule, value, callback) => {
            if (!value && value !== 0) {
                callback(new Error('不能为空'));
            } else {
                if (!Number.isInteger(value) || value < 1) {
                    callback(new Error('请输入正整数'));
                } else {
                    // 非第一轮 且 输入值小于前一轮右测轮次
                    if (this.ruleRotation != '0' && value <= this.dataArr[this.ruleRotation - 1].sectionArr[1]) {
                        let lastObj = this.dataArr[this.ruleRotation - 1];
                        let prizeName = `${lastObj.title ? lastObj.title : this.fnHan(this.ruleRotation - 1) + '等奖'}`;
                        let tip = `${prizeName}最后一名为：第${lastObj.sectionArr[1]}名`;
                        callback(new Error(`必须大于${prizeName}最后一名(${tip})`));
                    } else {
                        // 第一轮，左侧小于右侧
                        if (value > this.dataArr[this.ruleRotation].sectionArr[1]) {
                            callback(new Error('不能大于右侧名次'));
                        } else {
                            if (this.ruleRotation > 0) {
                                let lastNum = this.dataArr[this.ruleRotation - 1].sectionArr[1];
                                if (value - lastNum > 1) {
                                    this.$message({
                                        message: `警告！${
                                            value - lastNum == 2 ? '第' + (value - 1) + '名' : '第' + (lastNum + 1) + '至第' + (value - 1) + '名'
                                        }将无法获得奖励！`,
                                        type: 'warning'
                                    });
                                }
                            }
                            callback();
                        }
                    }
                }
            }
        };
        // 右侧验证，需要大于左侧
        let rankRule2 = (rule, value, callback) => {
            if (!value && value !== 0) {
                callback(new Error('不能为空'));
            } else {
                if (!Number.isInteger(value) || value < 1) {
                    callback(new Error('请输入正整数'));
                } else {
                    if (value < this.dataArr[this.ruleRotation].sectionArr[0]) {
                        callback(new Error('不能小于左侧名次'));
                    } else {
                        this.$refs['dataForm' + this.ruleRotation][0].validateField('0'); //验证前一个输入框
                        callback();
                    }
                }
            }
        };
        return {
            activeTab: '0', //展示的tab数据为dataArr[activeTab]
            ruleRotation: '0', //当前正则验证轮次0开始
            editableTabs: 1,
            dataArr: [
                {
                    title: '', //奖项名
                    sectionArr: [], //各项数据
                    finaldData: [] //奖品
                }
            ],
            rule1: [
                {
                    required: true,
                    validator: rankRule1,
                    trigger: 'blur'
                }
            ],
            rule2: [
                {
                    required: true,
                    validator: rankRule2,
                    trigger: 'blur'
                }
            ]
        };
    },
    props: {
        value: {}
    },
    components: {
        gamePrizeSet
    },
    computed: {},
    created() {
        this.fnValueInit();
    },
    mounted() {},
    methods: {
        fnValueInit() {
            console.log(this.value);
            if (this.value && this.value.length) {
                this.dataArr = [];
                this.value.forEach(item => {
                    this.dataArr.push({
                        title: item.plateName, //奖项名
                        sectionArr: [item.lowerLimit, item.upperLimit], //各项数据
                        finaldData: item.awardPrizes //奖品
                    });
                });
                this.editableTabs = this.dataArr.length;
                console.log(this.dataArr);
            }
        },
        fnHan(index) {
            let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六'];
            return index < arr.length ? arr[index] : index + 1;
        },
        fnAddQuJian() {
            this.editableTabs += 1;
            this.dataArr.push({
                title: '', //奖项名
                sectionArr: [], //各项数据
                finaldData: [] //奖项内容
            });
        },
        fnDelQuJian() {
            if (this.editableTabs > 1) {
                this.editableTabs -= 1;
                this.dataArr.pop();
                this.$nextTick(() => {
                    // 防止tab处于active被删除后页面错乱
                    if (this.activeTab == this.editableTabs) {
                        this.activeTab = '' + (this.activeTab - 1);
                    }
                });
            } else {
                this.$message({
                    message: '至少需要保留一个区间',
                    type: 'warning'
                });
            }
        },
        validate(call) {
            for (let index = 0; index < this.editableTabs; index++) {
                let continueBoolean = true;
                this.ruleRotation = '' + index;
                this.$refs['dataForm' + index][0].validate(valid => {
                    if (valid) {
                        if (index == this.editableTabs - 1) {
                            //最后一轮返回true
                            call(true);
                        } else {
                            call(false);
                        }
                    } else {
                        call(false);
                        this.activeTab = '' + index;
                        continueBoolean = false;
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
        activeTab(val) {
            this.ruleRotation = val;
        },
        dataArr: {
            handler(val) {
                // {
                //     title:"",//奖项名
                //     sectionArr:[],//各项数据
                //     finaldData:"",//奖品
                // }
                let arr = [];
                val.forEach((item, index) => {
                    arr.push({
                        awardPrizes: item.finaldData,
                        plateName: item.title ? item.title : this.fnHan(index) + '等奖',
                        lowerLimit: item.sectionArr[0],
                        upperLimit: item.sectionArr[1]
                    });
                });
                this.$emit('input', arr);
            },
            deep: true
        }
    }
};
</script>
<style scoped lang="scss">
.game-final-prize-set {
    margin-bottom: 20px;
    h4 {
        font-weight: 600;
        height: 40px;
        line-height: 30px;
        border-bottom: 1px solid #ada7a7;
        color: #333333;
        margin-bottom: 20px;
        position: relative;
        .btns {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
}
</style>
<style lang="scss" scoped>
.rank-tabs {
    /deep/ .el-tabs__header {
        background: transparent !important;
        border-color: transparent !important;
        margin-right: 0 !important;
        .el-tabs__nav-scroll {
            min-height: 300px;
            max-height: 500px;
            background: transparent !important;
            border-color: transparent !important;
        }
        .el-input__inner {
            background: transparent !important;
            border-color: transparent !important;
        }
        .is-active {
            .el-input__inner {
                border-color: #9795e3;
            }
        }
        .el-tabs__item {
            height: auto;
        }
    }
}
</style>
