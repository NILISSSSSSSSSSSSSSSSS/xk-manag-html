<template>
    <div class = 'cash-on-the-way'>
        <div class="title">
            <slot/>
        </div>
        <el-form :inline="true" :model="value" class="demo-form-inline" status-icon :rules="rules" ref="ruleForm">
            <el-row :gutter="20">
                <div class="cash-top">
                    <el-col :span="24">
                        <el-form-item label="最低提现金额" prop="leastAmount">
                            <el-input v-model="value.leastAmount" placeholder="10000" :size="$size"></el-input>
                            <span style="margin-right:20px;">元</span>
                        </el-form-item>
                        <el-form-item label="最高提现金额" prop="mostAmount">
                            <el-input v-model="value.mostAmount" placeholder="10000" :size="$size"></el-input>
                            <span style="margin-right:20px;">元</span>
                        </el-form-item>
                        <el-form-item label="日最多提现次数 ：" prop="enableCount">
                            <el-input v-model="value.enableCount" placeholder="5" :size="$size"></el-input>
                            <span>次</span>
                        </el-form-item>
                    </el-col>
                </div>
                <div class="cash-num-set" v-for="(item,index) in value.ranges" :key="index">
                    <el-col :span="24">
                        <el-form-item label="提现金额" :prop="'ranges.'+index+'.startAmount'" :rules='minReg'>
                            <el-input v-model="item.startAmount" placeholder="10000" :size="$size"></el-input>
                            <span>~</span>
                        </el-form-item>
                        <el-form-item :prop="'ranges.'+index+'.endAmount'" :rules='maxReg'>
                            <el-input v-model="item.endAmount" placeholder="10000" :size="$size"></el-input>
                            <span>时，单笔最高提现手续费为</span>
                        </el-form-item>
                        <el-form-item :prop="'ranges.'+index+'.rate'" :rules='rules.rate'>
                            <el-input v-model="item.rate" placeholder="1" :size="$size"></el-input>%
                        </el-form-item>
                        <el-form-item>
                            <el-input :size="$size" disabled :placeholder="$math.divide($math.multip(item.endAmount, item.rate), 100)"></el-input>元
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" icon="el-icon-minus" circle v-if="index==value.ranges.length-1 && value.ranges.length!=1" @click="fnReduce(index)"></el-button>
                            <el-button type="primary" icon="el-icon-plus" circle v-if="index==value.ranges.length-1" @click="fnPlus"></el-button>
                        </el-form-item>
                    </el-col>
                </div>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    name:'cashOnTheWay',
    data () {
        let numberReg = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('内容不能为空'));
            } else {
                if(value != parseFloat(value)){
                    callback(new Error('请输入数字'));
                }
                callback();
            }
        }
        return {
            rules:{
                leastAmount : [
                    { validator: numberReg, trigger: 'blur' }
                ],
                mostAmount: [
                    { validator: numberReg, trigger: 'blur' }
                ],
                enableCount : [
                    { validator: numberReg, trigger: 'blur' }
                ],
                rate : [
                    { validator: numberReg, trigger: 'blur' }
                ],
            },
            minReg:{
                validator: this.fnMin, trigger: 'blur'
            },
            maxReg:{
                validator: this.fnMax, trigger: 'blur'
            }
        };
    },
    props: {
        value:{
            type:[String,Object],
            default: ()=>({
                ranges:[
                    {
                        startAmount:0,
                        endAmount:5000,
                        rate:'1',
                        maxAmount:1
                    }
                ]
            })
        }
    },
    methods: {
        fnReduce(index){
            this.value.ranges.splice(index, 1);
            this.updateValue();
        },
        fnPlus(){
            let last = this.value.ranges[this.value.ranges.length - 1] ;
            this.value.ranges.push({
                startAmount:this.$math.add(last.endAmount, 0.01),
                endAmount:this.$math.add(last.endAmount, 1000),
                rate:'1',
                num:1
            })
            this.updateValue();
        },
        updateValue(){
            this.$emit('input',this.value);
        },
        fnMin(rule, value, callback , target){
            let keyname = ''
            for (const key in target) {
                keyname = key ;
            }
            let index = parseInt(keyname.split('.')[1]);
            if (value === '') {
                callback(new Error('内容不能为空'));
            } else {
                if(value != parseFloat(value)){
                    callback(new Error('请输入数字'));
                }
                let min = parseFloat(this.value.ranges[index].startAmount);
                let max = parseFloat(this.value.ranges[index].endAmount);
                if(min>=max){
                    callback(new Error('需要小于右侧数字'));
                }
                if(index){
                    let lastMax = parseFloat(this.value.ranges[index-1].endAmount);
                    if(min<lastMax){
                        callback(new Error('需大于上一组最大值'));
                    }
                }
                callback();
            }
        },
        fnMax(rule, value, callback , target){
            let keyname = ''
            for (const key in target) {
                keyname = key ;
            }
            let index = parseInt(keyname.split('.')[1]);
            if (value === '') {
                callback(new Error('内容不能为空'));
            } else {
                if(value != parseFloat(value)){
                    callback(new Error('请输入数字'));
                }
                let min = parseFloat(this.value.ranges[index].startAmount);
                let max = parseFloat(this.value.ranges[index].endAmount);
                if(min>=max){
                    callback(new Error('需要大于左侧数字'));
                }
                this.$refs.ruleForm.validateField('ranges.'+index+'.startAmount');
                if(index<this.value.ranges.length-1){
                    let nextMin = parseFloat(this.value.ranges[index+1].startAmount);
                    if(nextMin<max){
                        callback(new Error('需小于下一组最小值'));
                    }
                }
                callback();
            }
        },
        fnReg(){
            let p1 = new Promise((resolve, reject)=>{
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        resolve(true)
                    } else {
                        reject(false);
                        return false;
                    }
                });
                
            })
            let p2 = new Promise((resolve, reject)=>{
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        resolve(true)
                    } else {
                        reject(false);
                        return false;
                    }
                });
            })
            return new Promise((resolve, reject)=>{
                Promise.all([p1,p2]).then(res=>{
                    this.updateValue();
                    resolve(true)
                }).catch(err=>{
                    reject(false);
                    this.$nextTick(()=>{
                        let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                        $('.xk-container').animate({
                            scrollTop: num - 90
                        }, 500)
                    })
                    return false;
                })
            });
        }
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.cash-on-the-way{
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dddddd;
    .title{
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 600
    }
    .cash-top,.cash-num-set{
        margin-bottom: 10px;
        overflow: hidden;
    }
    /deep/ .el-input{
        width: 120px;
    } 
}
</style>