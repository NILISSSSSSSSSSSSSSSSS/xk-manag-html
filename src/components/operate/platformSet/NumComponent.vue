<template>
    <div class="num-component">
        <el-form ref="value" :model="value" label-width="0" >
            <el-row class="center lh42" v-for="(item, index) in value" :key="index">
                <el-col :span="4">
                    <el-form-item :prop="index+ '.startNum'" :rules="[
                            { required: true, validator: checkMin, trigger: 'blur' }
                        ]">
                        <el-input :disabled="true" :size="$size" v-model.number="item.startNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">至</el-col>
                <el-col :span="4">
                    <el-form-item :prop="index+ '.endNum'" :rules="[
                            { required: true, validator: checkMax, trigger: 'blur' }
                        ]">
                        <el-input :disabled="value.length-1==index && index!=0|| value.length==1? false: true" :size="$size" v-model.number="item.endNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3">笔中出</el-col>
                <el-col :span="4">
                    <el-form-item :prop="index+ '.appearNum'" :rules="[
                            { required: true, validator: checkNum, trigger: 'blur' }
                        ]">
                        <el-input :disabled="value.length-1==index && index!=0|| value.length==1? false: true" :size="$size" v-model.number="item.appearNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">个</el-col>
                <el-col :span="5" style="text-align: left">
                    <el-button :size="$size" type="danger" @click="deleteItem(index)" v-if="value.length-1 == index &&  value.length!=1">
                        <i class="el-icon-close"></i>
                    </el-button>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :disabled="value[value.length-1].endNum*1>= num || addBtnDisable? true: false" :size="$size" type="primary" @click="addItem()">新增一条分配设置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        value: {
            default: ()=> [{startNum: 1, endNum: '', appearNum: ''}]
        },
        isAutoAssign: {
            default: 1
        },
        everyCycleProvideNum: {
            default: 1
        }
    },
    data() {
        return{
            addBtnDisable: false,
            rules: {
                totalAmount: [{ required: true, validator: this.checkBagMax, trigger: 'blur' }],
            }
        }
    },
    computed: {
        ...mapState({
            num: state => state.operatePlatform.totalMoney
        })
    },
    methods: {
        addItem() {
            let winning = this.value;
            let isEmpty = false;
            winning.forEach((item, index)=> {
                if(!item.startNum || !item.endNum || !item.appearNum) {
                    isEmpty = true;
                }
            })
            if(isEmpty) {
                this.$message.warning('请先完善表单数据！');
                return false;
            }
            winning.push({startNum: Number(winning[winning.length-1].endNum)+1, endNum: '', appearNum: ''});
        },
        deleteItem(index) {
            this.value.splice(index, 1);
        },
        //检测最小的数字
        checkMin(rule, value, call, item) {
            if(this.isAutoAssign==0) {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('必须为数字类型且大于0'));
                }
                let index;
                for(let obj in item) {
                    index = Number(obj.split(".")[0]);
                }
                let endNum = this.value[index].endNum;
                if(index!=0) {
                    if(this.value[index-1].endNum != Number(value)-1) {
                        return call(new Error(`奖品个数应为${Number(this.value[index-1].endNum) +1}`))
                    }
                }else{
                    if(value!=1) {
                        return call(new Error('第一个数字必须为1'));
                    }
                }
                
                if(index == this.value.length -1) {

                }
                return call();
            }
            
            return call();
        },
        //检测最大值
        checkMax(rule, value, call, item) {
            if(this.isAutoAssign==0){
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('必须为数字类型且大于0'));
                }
                let index;
                for(let obj in item) {
                    index = obj.split(".")[0];
                }
                let startNum = this.value[index].startNum;
                let endNum = this.value[index].endNum;
                //判断是否到最后一个
                if(index == this.value.length-1) {
                    if(endNum > this.num*1) {
                        return call(new Error(`不能超过${this.num}`))
                    }
                    if(this.addBtnDisable && endNum != this.num) {
                        return call(new Error(`必须等于${this.num}`))
                    }
                }
                if(startNum && parseInt(startNum*1) >= value) {
                    return call(new Error(`必须大于${startNum}`))
                }
                return call();
            }

            return call();
        },
        //检测个数
        checkNum(rule, value, call, item) {
            if(this.isAutoAssign==0){
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('必须为数字类型且大于0'));
                }
                let index;
                for(let obj in item) {
                    index = obj.split(".")[0];
                }
                if(index==this.value.length-1) {
                    let sum = 0;
                    this.value.forEach(item=>{
                        if(typeof (item.appearNum*1) !== 'number') {
                            return sum=0;
                        }
                        sum += Number(item.appearNum);
                    })
                    if(sum > this.everyCycleProvideNum) {
                        return call(new Error(`不能大于${this.everyCycleProvideNum}`))
                    }
                }
                return call();
            }
            return call();
        },
        save() {
            return new Promise((resolve, reject) => {
                this.$refs['value'].validate(v=>{
                    if(v) {
                        resolve(true)
                    }else{
                        reject(false)
                    }
                })
            })
        }
    },
    watch: {
        value: {
            handler(val, old) {
                let sum = 0;
                val.forEach(item => {
                    sum += Number(item.appearNum);
                })
                this.addBtnDisable = sum >= this.everyCycleProvideNum? true: false;
            },
            deep: true
        },
    }
}
</script>

<style scoped lang="scss">
    .num-component {
        .lh42 {
            line-height: 42px;
        }
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
