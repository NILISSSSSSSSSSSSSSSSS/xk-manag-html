<template>
    <div class="bag-component">
        <el-form :model="value" label-width="180px" ref="value" :rules="rules">
            <el-form-item label="设置随机红包备注：" prop="name">
                <el-row>
                    <el-col :span="22">
                        <el-input maxlength="20" :size="$size" placeholder="红包" v-model.trim="value.name"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="随机红包金额设置：">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label-width="0" prop="minAmount">
                            <el-input :size="$size" placeholder="0.01" v-model.number="value.minAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="center">至</el-col>
                    <el-col :span="10">
                        <el-form-item label-width="0" prop="maxAmount">
                            <el-input :size="$size" placeholder="0.03" v-model.number="value.maxAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="center">元</el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Object,
                default: ()=>({})
            }
        },
        data() {
            return {
                rules: {
                    name: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    minAmount: [{
                        required: true, validator: (rule, value, call, item) => {
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                                return call(new Error('请输入大于0的数'));
                            }
                            let index ='';
                            for(let obj in item) {
                                let arr = obj.split('.')
                                if(arr.length>1) {
                                    index = arr[1]
                                }
                            }
                            if(index!=''){
                                let maxAmount = Number(this.value.bagArr[index].maxAmount);
                                if(maxAmount && maxAmount <= value) {
                                    return call(new Error(`必须小于${maxAmount}`))
                                }
                                return call();
                            }else{
                                let maxAmount = Number(this.value.maxAmount);
                                if(maxAmount && maxAmount <= value) {
                                    return call(new Error(`必须小于${maxAmount}`))
                                }
                                return call();
                            }
                        }, trigger: 'blur'}],
                    maxAmount: [{
                        required: true, validator: (rule, value, call, item) => {
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                                return call(new Error('请输入大于0的数'));
                            }
                            let index ='';
                            for(let obj in item) {
                                let arr = obj.split('.')
                                if(arr.length>1) {
                                    index = arr[1]
                                }
                            }
                            if(index!=''){
                                let minAmount = Number(this.value.bagArr[index].minAmount);
                                if(minAmount && minAmount >= value) {
                                    return call(new Error(`必须大于${minAmount}`))
                                }
                                return call();
                            }else{
                                let minAmount = Number(this.value.minAmount);
                                if(minAmount && minAmount >= value) {
                                    return call(new Error(`必须大于${minAmount}`))
                                }
                                return call();
                            }
                        }, trigger: 'blur'}]
                },
            }
        },
        methods: {
            _validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['value'].validate(v=>{
                        if(v) {
                            resolve(true);
                            this.$emit('input', this.value);
                        }else{
                            reject(false);
                            return false;
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .bag-component {
        .default-bag {
            font-size: 16px;
            color: #222;
        }
        .input-num {
            width: 100px;
        }
    }
</style>
