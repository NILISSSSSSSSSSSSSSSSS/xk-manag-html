<template>
    <div class="order-weight-set">
        <el-form ref="value" :model="value">
            <el-row v-for="(item, index) in value" :key="index">
                <el-col :span="3" class="center font-style line-height">订单金额为</el-col>
                <el-col :span="4">
                    <el-form-item label-width="0" :prop="index+'.startAmount'" :rules="
                        [
                            { required: true, validator: checkNum, trigger: 'blur' }
                        ]
                    ">
                        <el-input :disabled="index==value.length-1 &&value.length<=1 ? false: true" v-model.trim="item.startAmount" :size="$size" placeholder="10"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1" class="center font-style line-height">至</el-col>
                <el-col :span="4">
                    <el-form-item label-width="0" :prop="index+'.endAmount'" :rules="
                        [
                            { required: 'true', validator: checkNum, trigger: 'blur' }
                        ]
                    ">
                        <el-input :disabled="value.length-1== index? false: true" v-model.trim="item.endAmount" :size="$size" placeholder="100"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" class="center font-style line-height">元的用户，占</el-col>
                <el-col :span="4">
                    <el-form-item label-width="0" :prop="index+'.proportion'" :rules="
                        [
                            { required: true, validator: checkPersent, trigger: 'blur' }
                        ]
                    ">
                        <el-input :disabled="value.length-1== index? false: true" v-model.trim="item.proportion" :size="$size" placeholder="100"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1" class="center font-style line-height">%</el-col>
                <el-col :span="3" class="center line-height" v-if="value.length!=1 && value.length-1==index">
                    <el-button type="danger" :size="$size" icon="el-icon-close" @click.prevent="deleteItem(index)"></el-button>
                </el-col>
            </el-row>
            <div class="center margintop10">
                <el-button :disabled="value[value.length-1].endNum*1>= num || addBtnDisable || proportionTotal>=100? true: false" :size="$size" type="primary" @click="addItem()">新增一条分配设置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        props: {
            value: {
                type: Array,
                default: ()=> []
            }
        },
        data() {
            return {
                addBtnDisable: false,
                proportionTotal: 0
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
                let total = 0;
                winning.forEach((item, index)=> {
                    if(!item.startAmount || !item.endAmount || !item.proportion) {
                        isEmpty = true;
                    }
                    if(item.proportion) {
                        total = this.$math.add(item.proportion, total);
                    }
                })

                if(total>=100) {
                    this.$message.warning('当前百分比已分配完成');
                    this.addBtnDisable = true;
                    return false;
                }
                if(isEmpty) {
                    this.$message.warning('请先完善表单数据！');
                    return false;
                }

                this.value.push({
                    startAmount: this.$math.add(this.value[this.value.length -1].endAmount, 0.01),
                    endAmount: '',
                    proportion: ''
                })
            },
            //删除一条
            deleteItem(index) {
                this.addBtnDisable = false;
                this.value.splice(index, 1);
            },
            _validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['value'].validate(v=> {
                        if(v) {
                            resolve(true);
                        }else{
                            reject(false);
                            return false;
                        }
                    })
                })
            },
            //验证金额
            checkNum(rule, value, call, obj) {
                let index = null,
                    name = null;
                for(let key in obj) {
                    let arr = key.split('.');
                    index = arr[0];
                    name = arr[1];
                }
                if(index==this.value.length-1 && name=='endAmount' && value=='') {
                    return call();
                }
                if(!value) {
                    return call(new Error('金额不能为空'))
                }
                if(isNaN(Number(value))) {
                    return call(new Error('格式不正确'))
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                    if(name!=='endAmount') {
                        return call(new Error('请输入大于0的数'))
                    }
                }
                let maxPrice = Number(this.value[index].endAmount);
                let minPrice = Number(this.value[index].startAmount);

                if(name==='startAmount' && maxPrice && maxPrice <= value) {
                    return call(new Error('金额应小于'+maxPrice));
                }
                if(name === 'endAmount' && minPrice && minPrice >= value) {
                    return call(new Error('金额应大于' + minPrice));
                }
                return call();
            },
            //验证百分比
            checkPersent(rule, value, call, item) {
                let index = '';
                for(let _item in item) {
                    index = _item.split(".")[0];
                }
                
                if(!value&&Number(value)!=0) {
                    return call(new Error('请输入百分比！'))
                }
                if(!/^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('格式设置不正确'))
                }

                let sum = 0;
                for(let i =0, len = this.value.length; i< len; i++) {
                    sum = this.$math.add(sum, this.value[i].proportion);
                }
                
                if(index==this.value.length-1) {
                    if(sum>100) {
                        return call(new Error('百分比不能超过100%'));
                    }
                    if(sum==100) {
                        this.addBtnDisable = true;
                    }
                    if(sum<100) {
                        this.addBtnDisable = false;
                    }
                }

                return call();
            }
        }
    }
</script>

<style scoped lang="scss">
    $fontSize : 13px;
    $fontColor: #666;
    $lh40: 40px;
    .order-weight-set {
        /deep/ .el-form-item {
            margin-bottom: 15px;
        }
        .fr {
            float: right;
        }
        .input {
            width: 100px;
        }
        .font-style {
            font-size: $fontSize;
            color: $fontColor
        }
        .line-height{
            line-height: $lh40;
        }
    }
</style>
