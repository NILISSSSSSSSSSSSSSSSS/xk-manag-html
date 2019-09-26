<template>
    <div class="prize-component">
        <el-form label-width="0" ref="value" :model="value" :rules="rules">
            <div class="">
                <div>
                    <el-form-item label="奖品缩略图：" label-width="120px" prop="microPic">
                        <image-upload v-model="value.microPic" :more="false" size="2">
                            <img v-if="value.microPic" :src="value.microPic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                        <p><span class="xk-danger">* </span>提示：图片建议尺寸168*98，大小不超过2M</p>
                    </el-form-item>
                    <el-form-item label="奖品简介：" label-width="120px" prop="description" class="jianjie">
                        <el-input 
                            type="textarea" 
                            style="width: 80%" 
                            v-model.trim="value.description" 
                            :size="$size" 
                            placeholder="请输入简介" 
                            :autosize="{ minRows: 7, maxRows: 7}"
                            resize="none"
                            show-word-limit 
                            maxlength="150"></el-input>
                            <div class="count-num">{{ value.description? value.description.length: 0 }}/150</div>
                    </el-form-item>
                </div>
                <div>
                    <span class="font-style">{{ totalNum }}笔中随机出&nbsp;&nbsp;</span>
                    <el-form-item style="display: inline-block" prop="everyCycleProvideNum">
                        <el-input class="input" :size="$size" v-model.trim="value.everyCycleProvideNum" placeholder="1"></el-input>
                    </el-form-item>
                    <span class="font-style">&nbsp;&nbsp;个</span>
                </div>
                <div>
                    <el-form-item :label="`设置奖品连${goodsType=='j_mall'?'场':'中'}次数：`" label-width="140px" class="m-b-0">
                        <el-form-item style="display:inline-block" label-width="0" prop="rowStart">
                            <el-input :size="$size" class="input" v-model.trim="value.rowStart"></el-input>
                        </el-form-item>
                        <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
                        <el-form-item style="display:inline-block" label-width="0" prop="rowEnd">
                            <el-input :size="$size" class="input" v-model.trim="value.rowEnd"></el-input>
                        </el-form-item>
                        <span>&nbsp;&nbsp;{{ goodsType=='j_mall'?'场':'份' }}</span>
                    </el-form-item>
                </div>
            </div>
            <div class="font-style">
                <el-radio :disabled="isSelect" v-model.trim="value.average" label="1">&nbsp;</el-radio>自动平均分配名额：
                {{ 
                    value.everyCycleProvideNum&& typeof (value.everyCycleProvideNum*1) ==='number'
                        ? totalNum%(value.everyCycleProvideNum)===0 ?
                        totalNum/(value.everyCycleProvideNum) : (totalNum/(value.everyCycleProvideNum)).toFixed(2) : totalNum 
                }} 笔中出一个
            </div>
            <div class="font-style">
                <el-radio v-model.trim="value.average" label="0">&nbsp;</el-radio>手动分配
            </div>

            <!-- 列表 -->
            <num-component ref="winningAssignRules" v-model="value.winningAssignRules" :isAutoAssign="value.average" :everyCycleProvideNum="value.everyCycleProvideNum"></num-component>
        </el-form>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import NumComponent from './NumComponent.vue';
    import ImageUpload from '../../ImageUpload.vue';
    export default {
        components: {
            NumComponent,
            ImageUpload
        },
        props: {
            value: {
                default: ()=>({})
            },
            goodsType: {
                type: String,
                default: 'welfare'  //夺奖派对商品
            }
        },
        computed: {
            ...mapState({
                totalNum: state => state.operatePlatform.totalMoney
            })
        },
        data() {
            const checkNum = (rule, value, call) => {
                if(!value){
                    return call(new Error('不能为空'));
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('必须为数字类型'));
                }
                if(value > this.totalNum) {
                    return call(new Error(`不能超过${this.totalNum}`))
                }
                return call();
            }
            return {
                rules: {
                    everyCycleProvideNum: [{ required: true, validator: this.checkNum, trigger: 'blur' }],
                    rowStart: [
                        { required: true, validator: (rule, value, call)=>{
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/^[1-9]\d*$/.test(value)) {
                                return call(new Error('必须为数字类型'));
                            }
                            if(value>18) {
                                return call(new Error('不能超过18'))
                            }

                            if(this.value.rowEnd && Number(this.value.rowEnd) < Number(value)) {
                                return call(new Error(`应小于等于${this.value.rowEnd}`));
                            }
                            return call();
                        }, trigger: 'blur'}
                    ],
                    rowEnd: [
                        { required: true, validator: (rule, value, call)=>{
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/^[1-9]\d*$/.test(value)) {
                                return call(new Error('必须为数字类型'));
                            }
                            if(value>18) {
                                return call(new Error('不能超过18'))
                            }
                            if(this.value.rowStart && Number(this.value.rowStart) > Number(value)) {
                                return call(new Error(`应大于等于${this.value.rowStart}`));
                            }
                            return call();
                        }, trigger: 'blur'}
                    ],
                    description: [
                        { required: true, min: 1, max: 150, message: '请输入1-150字', trigger: 'blur' }
                    ],
                    microPic: [
                        { required: true, message: '缩略图不能为空', trigger: 'blur' }
                    ]
                },
                isSelect: false
            }
        },
        methods: {
            //检测个数
            checkNum(rule, value, call, item) {
                if(this.value.average!=0) {
                    return call();
                }
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('必须为数字类型且大于0'));
                }
                let index;
                for(let obj in item) {
                    index = Number(obj.split(".")[1]);
                }
                if(index==this.value.winningAssignRules.length-1) {
                    let sum = 0;
                    this.value.winningAssignRules.forEach(item=>{
                        if(typeof (item.appearNum*1) !== 'number') {
                            return sum=0;
                        }
                        sum += parseInt(item.appearNum);
                    })
                    if(sum > this.value.everyCycleProvideNum) {
                        return call(new Error(`奖品不能大于${this.value.everyCycleProvideNum}`))
                    }
                }
                return call();
            },
            _validate() {
                return new Promise((resolve, reject) => {
                     Promise.all([this.$refs['winningAssignRules'].save()]).then(res=>{
                        this.$refs['value'].validate(v=>{
                            if(v){
                                if(this.totalNum%this.value.everyCycleProvideNum!==0&&this.value.average==1) {
                                    reject(false);
                                    this.$notify.error({
                                        duration: 2000,
                                        title: '错误',
                                        message: '请重新检查模板奖品设置，平均分类名额配置不正确！'
                                    });
                                }else{
                                    resolve(true);
                                    this.$emit('input', this.value);
                                }
                            }else{
                                reject(false);
                                return false;
                            }
                        })
                     })
                     .catch(()=>{
                         reject(false);
                     })
                    
                    
                })
            }
        },
        watch: {
            "value.everyCycleProvideNum": {
                handler(val) {
                    if(val) {
                        if(this.totalNum%val==0) {
                            console.log('执行')
                            this.isSelect = false;
                        }else{
                            this.isSelect = true;
                            this.value.average = '0'
                        }
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    $fontSize : 14px;
    $fontColor: #666;
    $lh40: 40px;
    .prize-component {
        font-size: 14px;
        color: #606266;
        /deep/ .el-form-item {
            margin-bottom: 15px;
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
        .m-b-0 {
            margin-bottom: 0;
        }
        /deep/ .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        /deep/ .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        /deep/ .avatar-uploader-icon {
            font-size: 16px;
            color: #8c939d;
            width: 68px;
            height: 68px;
            line-height: 68px;
            text-align: center;
        }
        /deep/ .avatar {
            width: 68px;
            height: 68px;
            display: block;
        }
        .jianjie {
            position: relative;
            .count-num{
                position: absolute;
                z-index: 666;
                bottom: -10px;
                left: 81%;
            }
        }
    }
</style>
