<template>
    <div class="prize-continue-set">
        <el-form :model="rules" ref="rules">
            <div class="prize-continue-box" v-for="(item, index) in rules" :key="index">
                <h4>用户连抽数为{{ Number(index)+1 }}时，占&nbsp;&nbsp;
                    <el-form-item style="display:inline-block" label-width="0" :prop="index+'.winRatio'" :rules="rule.checkNum">
                        <el-input v-model.number="item.winRatio" class="percentInput" :size="$size"></el-input>
                    </el-form-item>&nbsp;&nbsp;%
                </h4>
                <div v-for="(subItem, subIndex) in item.ids" :key="subIndex" class="marginbottom20">
                    <el-row class="font-style">
                        <el-col :span="5">
                            <p>&nbsp;&nbsp;{{ index==0? '': `第 ${subIndex+1} 次` }}中奖奖品选择：</p>
                            <p>（从选中奖品中随机出一个）</p>
                        </el-col>
                        <el-col :span="19">
                            <el-row>
                                <el-checkbox-group v-model="item.ids[subIndex]">
                                    <el-col class="mb10 ellipsis" v-for="_item in prizeData" :key="_item.id" :span="6"><el-checkbox :title="_item.name" :label="_item.id">{{_item.name}}</el-checkbox></el-col>
                                </el-checkbox-group>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: {
            rules: {
                default: ()=>[]
            },
            prizeData: {
                type: Array,
                default: ()=> []
            }
        },
        data() {
            return {
                rule: {
                    checkNum: [
                        { required: true, validator: this.checkNum, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            checkNum(rule, value, call, item) {
                if(!value) {
                    return call(new Error('不能为空或0'))
                }
                if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                    return call(new Error('请输入1-100的数字'))
                }
                if(value>100) {
                    return call(new Error('请输入小于100的数字'))
                }
                //检查百分比之和是否为100
                
                let index = Number(Object.keys(item)[0].split('.')[0]);
                let sum = 0;
                for(let i in this.rules) {
                    sum += this.rules[i].winRatio
                }
                if(sum!=100) {
                    return call(new Error('连中概率之和不为100'));
                }
                return call();
            },
            validate() {
                return new Promise((resolve, reject) => {
                    this.$refs['rules'].validate(v=>{
                        if(v) {
                            for(let item in this.rules) {
                                let arr = this.rules[item].ids;
                                for(let i=0,len = arr.length; i<len; i++) {
                                    if(arr[i].length==0) {
                                        this.$alert('至少勾选一个奖品', '提示',{
                                            confirmButtonText: '确定'
                                        })
                                        reject(false);
                                        return false;
                                    }
                                }
                            }
                            resolve(true)
                        }
                        else{
                            reject(false);
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    $percentInput : 150px;
    $fontSize : 14px;
    $fontColor: #666;

    .prize-continue-set {
        .prize-continue-box {
            padding: 20px;
            border: 1px solid #f5f5f5;
            border-radius: 10px;
            box-shadow: 0px 5px 15px #ddd;
        }
        .mb10 {
            margin-bottom: 5px;
        }
        .percentInput {
            width: $percentInput
        }
        .font-style {
            font-size: $fontSize;
            color: $fontColor
        }
        h4{
            color: $fontColor;
            font-weight: bolder;
            font-size: $fontSize;
        }
        .ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 20px;
            box-sizing: border-box;
        }
    }
</style>
