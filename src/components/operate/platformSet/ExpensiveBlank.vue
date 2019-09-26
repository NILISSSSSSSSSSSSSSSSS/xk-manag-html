<template>
    <div class="expensive-set-black">
        <el-form label-width="280px" :model="blackForm" ref="blackForm" :rules="blackFormRules">
            <el-form-item label="进入黑名单后随机红包金额设置：">
                <el-row>
                    <el-col :span="3">
                        <el-form-item prop="randomRedPacketAmountMin">
                            <el-input :size="$size" placeholder="0.01" v-model.number="blackForm.randomRedPacketAmountMin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" class="center">至</el-col>
                    <el-col :span="3">
                        <el-form-item prop='randomRedPacketAmountMax'>
                            <el-input :size="$size" placeholder="0.05" v-model.number="blackForm.randomRedPacketAmountMax"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">元</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="无违规行为自动从黑名单删除时间设置：">
                <el-row>
                    <el-col :span="3">
                        <xk-form-item prop="autoDeleteBlackerTime" type="integer">
                            <el-input :size="$size" placeholder="48" v-model.number="blackForm.autoDeleteBlackerTime"></el-input>
                        </xk-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;&nbsp;小时</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label-width="0">
                <el-row v-for="(item, index) in blackForm.blackListRules" :key="index">
                    <el-col :span="24" class="line">
                        <el-col :span="8">
                            <el-col :span="6">
                                <xk-form-item :prop="'blackListRules.' + index + '.ruleCommandTime'" type="money">
                                    <el-input :size="$size" placeholder="2" v-model.number="item.ruleCommandTime"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="6" class="center">小时内，连续</el-col>
                            <el-col :span="6">
                                <xk-form-item :prop="'blackListRules.' + index + '.ruleCommandOrderNum'" type="integer">
                                    <el-input :size="$size" placeholder="10" v-model.number="item.ruleCommandOrderNum"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="2" class="center">单</el-col>
                        </el-col>
                        <el-col :span="10">
                            <el-col :span="24">
                                <el-col :span="1">
                                    <el-radio v-model="item.average" label="0">&nbsp;</el-radio>
                                </el-col>
                                <el-col :span="5">
                                    平均金额小于
                                </el-col>
                                <el-col :span="5">
                                    <xk-form-item :prop="'blackListRules.' + index + '.ruleCommandAverageAmount'" :type="item.average==0?'money': 'none'">
                                        <el-input :size="$size" placeholder="10" v-model.number="item.ruleCommandAverageAmount"></el-input>
                                    </xk-form-item>
                                </el-col>
                                <el-col :span="13">&nbsp;&nbsp;&nbsp;&nbsp;元，则把用户加入刷单抽奖黑名单中。</el-col>
                            </el-col>
                            <el-col :span="24">
                                <el-col :span="1">
                                    <el-radio v-model="item.average"  label="1">&nbsp;</el-radio>
                                </el-col>
                                <el-col :span="23">
                                    金额相同，则把用户加入刷单抽奖黑名单中。
                                </el-col>
                            </el-col>
                        </el-col>
                        <el-col :span="6">
                            <el-button v-if="blackForm.blackListRules.length!=1" :size="$size" type="danger" @click="deleteItem(index)"><i class="el-icon-close"></i></el-button>
                            <el-button v-if="blackForm.blackListRules.length-1==index" :size="$size" type="primary" @click="addItem()"><i class="el-icon-plus"></i></el-button>
                        </el-col>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import XkFormItem from '@/components/common/XKFormItem.vue';
    export default {
        components: {
            XkFormItem
        },
        data() {
            return {
                blackFormRules: {
                    randomRedPacketAmountMin: [
                        { required: true, validator: (rule, value, call)=>{
                            if(!value) {
                                return call(new Error('请输入红包金额.'))
                            }
                            if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                                return call(new Error('请输入数字或2位小数'))
                            }
                            let maxRedMoney = this.blackForm.randomRedPacketAmountMax
                            if(maxRedMoney && maxRedMoney*1 <= value) {
                                return call(new Error('请输入小于'+maxRedMoney+'的数'))
                            }
                            call();
                        }, trigger: 'blur' }
                    ],
                    randomRedPacketAmountMax: [
                        { required: true, validator: (rule, value, call)=>{
                            if(!value) {
                                return call(new Error('请输入红包金额.'))
                            }
                            if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                                return call(new Error('请输入数字或2位小数'))
                            }
                            let minRedMoney = this.blackForm.randomRedPacketAmountMin
                            if(minRedMoney && minRedMoney*1 >= value) {
                                return call(new Error('请输入大于'+minRedMoney+'的数'))
                            }
                            call();
                        }, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                blackForm: state => state.operatePlatform.blackForm
            })
        },
        methods: {
            addItem(index) {
                let obj = { 
                    ruleCommandOrderNum: '',
                    ruleCommandAverageAmount: '',
                    ruleCommandTime: '',
                    average: '0'
                }
                this.blackForm.blackListRules.push(obj);
            },
            deleteItem(index) {
                this.blackForm.blackListRules.splice(index,1)
            },
            save() {
                return new Promise((resolve, reject) => {
                    this.$refs['blackForm'].validate(v=>{
                        if(v) {
                            resolve(true);
                        }else{
                            reject(false);
                        }
                    })
                })
                
            }
        }
    }
</script>
<style scoped lang="scss">
    .expensive-set-black {
        /deep/ .el-form-item{
            margin-bottom: 10px;
        }
        .line {
            margin-bottom: 15px;
            padding-bottom: 10px;
            position: relative;
            &::after{
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                display: block;
                background: #e6e5e5;
                height: 1px;
                width: 100%;
            }
        }
    }
</style>
