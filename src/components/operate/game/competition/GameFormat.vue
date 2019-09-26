/*
 * @Author: liusheng 
 * @Date: 2019-06-14 18:03:19 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-24 18:43:16
 */
//  赛制及奖励设置
<template>
    <div class='game-format'>
        <el-form label-width="120px" :model="integralSet" :size="$size" ref="integralSetForm">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="总轮次：">
                        <el-select :size="$size" class="xk-input" v-model="rotation">
                            <el-option v-for="i in 12" :label="i+'轮'" :value="i" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <template v-if="gameType!='GAME'">
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item label="初始积分：" prop="initialPoints" :rules="integerNum">
                            <el-input :size="$size" v-model.number="integralSet.initialPoints"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="点击查看积分：" prop="clickViewPoints" :rules="validateIntegerNumFive">
                            <el-input :size="$size" v-model.number="integralSet.clickViewPoints"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="每个点赞积分：" prop="likePoints" :rules="validateIntegerNumFive">
                            <el-input :size="$size" v-model.number="integralSet.likePoints"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item label="每条评论积分：" prop="commentPoints" :rules="validateIntegerNumFive">
                            <el-input :size="$size" v-model.number="integralSet.commentPoints"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="每次分享积分：" prop="sharePoints" :rules="validateIntegerNumFive">
                            <el-input :size="$size" v-model.number="integralSet.sharePoints"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="礼物价值积分：" prop="giftPoints" :rules="validateIntegerNumFive">
                            <el-input :size="$size" v-model.number="integralSet.giftPoints"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </el-form>
        <div class="lunci">
            <GameRotation v-model="baseAndPrizeData" :rotation="rotation" :gameType="gameType" ref="GameRotationRef">
            </GameRotation>
        </div>
    </div>
</template>
<script>
// 轮次
import GameRotation from './GameRotation';
export default {
    name: 'gameFormat',
    data() {
        const validateIntegerNum = (rule, value, callback) => {
            console.log(value);
            if (value) {
                if (Number.isInteger(value)) {
                    if (value >= 0 && value <= 100) {
                        callback();
                    } else {
                        callback(new Error('请输入0~100之间的整数'));
                    }
                } else {
                    callback(new Error('请输入整数'));
                }
            } else {
                callback();
            }
        };
        const validateIntegerNumFive = (rule, value, callback) => {
            console.log(value);
            let i = 0;
            for (const key in this.integralSet) {
                if (this.integralSet.hasOwnProperty(key) && key != 'initialPoints') {
                    i += this.integralSet[key];
                }
            }
            if (!i) {
                callback(new Error('此五项不能全部为0'));
            }
            if (value) {
                if (Number.isInteger(value)) {
                    if (value >= 0 && value <= 100) {
                        callback();
                    } else {
                        callback(new Error('请输入0~100之间的整数'));
                    }
                } else {
                    callback(new Error('请输入整数'));
                }
            } else {
                callback();
            }
        };
        return {
            rotation: 1,
            integralSet: {
                initialPoints: 1, //初始化积分
                clickViewPoints: 1, //点击查看积分
                likePoints: 1, //每个点赞积分
                commentPoints: 1, //评论积分
                sharePoints: 1, //每次分享积分
                giftPoints: 1 //礼物价值积分
            },
            integerNum: [{ validator: validateIntegerNum, trigger: 'blur' }],
            validateIntegerNumFive: [{ validator: validateIntegerNumFive, trigger: 'blur' }],
            baseAndPrizeData: '' //基本设置和奖项设置
        };
    },
    props: {
        gameType: {
            type: String,
            default: 'GAME'
        },
        value: {}
    },
    components: {
        GameRotation
    },
    computed: {},
    created() {
        this.fnValueInit();
    },
    mounted() {},
    methods: {
        fnValueInit() {
            if (this.value) {
                // 积分
                this.integralSet = {
                    ...this.integralSet,
                    ...this.value
                };
                // 轮次
                this.rotation = this.value.totalRound;
                // 轮次内容
                this.baseAndPrizeData = this.value.tournaments;
                console.log(this.value);
            }
        },
        submitForm(call) {
            this.$refs.integralSetForm.validate(valid => {
                if (valid) {
                    this.$refs.GameRotationRef.fnValidate(callData => {
                        if (callData) {
                            call(true);
                        } else {
                            call(false);
                        }
                    });
                } else {
                    call(false);
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
        },
        resetForm() {
            this.$refs.integralSetForm.resetFields();
        }
    },
    watch: {
        gameType(val) {
            console.log(this.value);
        },
        rotation(val) {
            console.log(val);
        },
        baseAndPrizeData: {
            handler(val) {
                console.log(val);
                let obj = {
                    tournaments: val,
                    totalRound: this.rotation
                };
                console.log(obj);
                if (this.gameType == 'UPLOAD') {
                    //上传类上传积分设置
                    obj = {
                        ...obj,
                        ...this.integralSet
                    };
                }
                console.log(obj);
                this.$emit('input', obj);
            },
            deep: true
        },
        integralSet: {
            handler(val) {
                let obj = {
                    tournaments: this.baseAndPrizeData,
                    totalRound: this.rotation
                };
                if (this.gameType == 'UPLOAD') {
                    //上传类上传积分设置
                    obj = {
                        ...obj,
                        ...val
                    };
                }
                this.$emit('input', obj);
            },
            deep: true
        }
    }
};
</script>
<style scoped lang="scss">
.lunci {
    padding: 10px;
}
</style>