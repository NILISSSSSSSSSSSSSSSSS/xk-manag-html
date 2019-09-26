<template>
    <div class="expensive-bag-component">
        <el-form :model="value" ref="value" label-width="0" class="collapse-box" :rules="rules">
            <span>{{ num }}笔中随机出&nbsp;&nbsp;</span>
            <el-form-item label-width="0" style="display:inline-block;width:150px" prop="everyCycleProvideNum">
                <el-input :size="$size" v-model.trim="value.everyCycleProvideNum"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;个
            <el-row>
                <el-col :span="3" class="lh42">总金额为</el-col>
                <el-col :span="4">
                    <el-form-item label-width="0" prop="totalAmount">
                        <el-input :size="$size" v-model.trim="value.totalAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="17" class="lh42">&nbsp;&nbsp;元（可填最大、最小数字提示“个数X红包最大、小金额”）</el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-radio :disabled="isSelect" v-model="value.isAutoAssign" label="1">&nbsp;</el-radio>自动平均分配名额：{{ value.everyCycleProvideNum? num/value.everyCycleProvideNum: num }}笔中出1个（自动根据总笔数和奖品计算）
                </el-col>
                <el-col :span="24">
                    <el-radio v-model="value.isAutoAssign" label="0">&nbsp;</el-radio>手动分配
                </el-col>
            </el-row>
            <num-component v-model="value.winningAssignRules" :everyCycleProvideNum="value.everyCycleProvideNum" :isAutoAssign="value.isAutoAssign"></num-component>
        </el-form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import NumComponent from './NumComponent.vue';
    export default {
        components: {
            NumComponent
        },
        props: {
            value: {
                default:()=> ({
                    totalAmount: '',
                    isAutoAssign: '0',
                    winningAssignRules: [
                        {startNum: 1, endNum: '', appearNum: ''}
                    ]
                })
            },
            minPrice: {
                default: 0,
                type: [String, Number]
            },
            maxPrice: {
                default: 0,
                type: [String, Number]
            }
        },
        computed: {
            ...mapState({
                num: state => state.operatePlatform.totalMoney
            })
        },
        data() {
            return {
                rules: {
                    totalAmount: [{ required: true, validator: this.checkBagMax, trigger: 'blur' }],
                    everyCycleProvideNum: [{ required: true, validator: this.checkMoney, trigger: 'blur' }]
                },
                isSelect: false
            }
        },
        methods: {
            //检测红包金额，总金额检测
            checkBagMax(rule, value, call, item) {
                if(!value) {
                    return new Error('请输入红包总金额！')
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                    return call(new Error('必须为数字类型'));
                }
                let everyCycleProvideNum = this.value.everyCycleProvideNum;
                if(!everyCycleProvideNum || !/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(everyCycleProvideNum)) {
                    return call(new Error(`请先输入随机个数!`))
                }
                if(value > everyCycleProvideNum *this.maxPrice*3 || value < this.minPrice*everyCycleProvideNum) {
                    return call(new Error(`接收${this.minPrice*everyCycleProvideNum}到${this.maxPrice*everyCycleProvideNum*3}的数字`))
                }
                return call();
            },
            //检测个数
            checkMoney(rule, value, call, item) {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                    return call(new Error('必须为数字类型且大于0'));
                }
                if(value > this.num) {
                    return call(new Error(`不能超过${this.num}`))
                }
                call();
            },
            _validate() {
                return new Promise((resolve, reject) =>{
                    this.$refs['value'].validate(v=>{
                        if(v){
                            resolve(true);
                            this.$emit('input', this.value);
                        }else{
                            reject(false)
                            return false;
                        }
                    })
                })
            }
        },
        watch: {
            "value.isAutoAssign": {
                handler(val) {
                    if(val==0) {
                        this.value.winningAssignRules[0].startNum = 1;
                    }
                },
                deep: true
            },
            "value.everyCycleProvideNum": {
                handler(val) {
                    if(val) {
                        if(this.num%val==0) {
                            this.isSelect = false;
                        }else{
                            this.isSelect = true;
                            this.value.isAutoAssign = '0'
                        }
                    }
                },
                deep: true
            }
        }
    }
</script>
<style scoped lang="scss">
    .expensive-bag-component {
        font-size: 14px;
        color: #606266;
        .lh42 {
            line-height: 42px;
        }
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
