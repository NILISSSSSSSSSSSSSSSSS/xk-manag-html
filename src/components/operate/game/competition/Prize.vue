/*
 * @Author: liusheng
 * @Date: 2019-06-14 13:51:05
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-26 18:03:28
 */
<template>
    <div class='prize'>
        <el-form ref="prizeFormRef" :model="prizeForm" label-width="120px" :size="$size">
            <el-form-item v-for="(item,index) in prizeConfig" :key="index" :label="item.label" :rules="item.rule?item.rule:noCheck" :prop="item.key">
                <template v-if="item.type==='text'">
                    <span v-if="item.key=='costPrice'">{{$math.divide(prizeForm[item.key], 100)}}</span>
                    <span v-else>{{prizeForm[item.key]}}</span>
                    <!-- {{prizeForm[item.key]}} -->
                </template>
                <template v-if="item.type==='input'">
                    <el-row :gutter="10">
                        <el-col :span="20">
                            <el-input v-model="prizeForm[item.key]"></el-input>
                        </el-col>
                        <el-col :span="2" v-show="item.className">{{item.className}}</el-col>
                    </el-row>
                </template>
                <el-select v-if="item.type==='select' && item.key=='specification'" v-model="prizeForm[item.key]" placeholder="请选择">
                    <el-option v-for="(op,opIn) in skuAttrArr" :key="opIn" :label="op.label" :value="op.label">
                    </el-option>
                </el-select>
                <el-select v-if="item.type==='select' && item.key!='specification'" v-model="prizeForm[item.key]" placeholder="请选择">
                    <el-option v-for="(op,opIn) in item.options" :key="opIn" :label="op.label" :value="op.value">
                    </el-option>
                </el-select>
                <UE v-if="item.type==='richtxt'" v-model="prizeForm[item.key]"></UE>
                <template v-if="item.type==='upimg'">
                    <image-upload v-model="prizeForm[item.key]" :more="false" size="2" class="up-img">
                        <img v-if="prizeForm[item.key]" :src="prizeForm[item.key]" class="img">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                    <p><span class="xk-danger">* </span>仅一张图片</p>
                </template>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import UE from '@/components/UE.vue';
import ImageUpload from '@/components/ImageUpload.vue';
export default {
    name: 'prize',
    data() {
        return {
            noCheck: [{ validator: (rule, value, call) => call(), trigger: 'blur' }],
            skuAttrArr: [],
            tableEnum: {}
        };
    },
    props: {
        value:{},
        prizeConfig:{
            type:[ Object, Array],
            default: ()=>[
                {
                    type: 'input', //类型 text input select richtxt upimg
                    className: '个', //量词
                    label: '发货单ID：',
                    key: 'sendID',
                    rule: [
                        {
                            validator: (ruler, value, call) => (value ? call() : call(new Error('不能为空'))),
                            trigger: 'blur'
                        }
                    ]
                }
            ]
        },
        searchLoading: {
            type: Boolean,
            default: false
        }
    },
    components: {
        UE,
        ImageUpload
    },
    computed: {
        prizeForm() {
            return this.value;
        }
    },
    created() {},
    mounted() {},
    methods: {
        submitForm(call) {
            this.$refs.prizeFormRef.validate(valid => {
                if (valid) {
                    call(true);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.prizeFormRef.resetFields();
        },
        fnGetDetail(id, prizeRadio, addInfo = false) {
            let api = 'goodsDetail';
            let obj = {
                id: id
            };
            if (prizeRadio == 'WELFARE_MALL') {
                api = 'jfmallGoodsDetail4Manager';
                obj = {
                    jGoodsId: id
                };
            }
            this.$http
                .get(this.$api[api], obj, true)
                .then(res => {
                    if (!res) {
                        this.$message.error('商品id不存在');
                        this.$emit('update:searchLoading', false);
                        return;
                    }
                    if (api == 'goodsDetail') {
                        //精选商城
                        let emitValue = JSON.parse(JSON.stringify(this.prizeForm));
                        if (!emitValue.productName || addInfo) {
                            emitValue.productId = res.goods.base.id;
                            emitValue.productName = res.goods.base.name;
                            this.$emit('input', emitValue);
                        }
                        try {
                            this.skuAttrArr = [];
                            res.goods.skuAttrValue.forEach((item, index) => {
                                this.skuAttrArr.push({
                                    label: item.name,
                                    code: item.code
                                });
                                this.tableEnum[item.name] = item.costPrice;
                                if (!index) {
                                    emitValue.specification = this.prizeForm.specification ? this.prizeForm.specification : item.name;
                                    emitValue.costPrice = this.prizeForm.costPrice ? this.prizeForm.costPrice : item.costPrice;
                                    emitValue.skuCode = this.prizeForm.skuCode ? this.prizeForm.skuCode : item.code;
                                    if (addInfo) {
                                        emitValue.specification = item.name;
                                        emitValue.costPrice = item.costPrice;
                                        emitValue.skuCode = item.code;
                                    }
                                    this.$emit('input', emitValue);
                                }
                            });
                        } catch (error) {}
                    } else {
                        //比赛专用
                        let emitValue = JSON.parse(JSON.stringify(this.prizeForm));
                        if (!emitValue.productName || addInfo) {
                            emitValue.productId = res.id;
                            emitValue.productName = res.name;
                            this.$emit('input', emitValue);
                        }
                    }

                    this.$emit('update:searchLoading', false);
                })
                .catch(err => {
                    this.$emit('update:searchLoading', false);
                    this.$message.error(err.message);
                });
        }
    },
    watch: {
        prizeForm: {
            handler(val) {
                try {
                    for (const key in val) {
                        if (val.hasOwnProperty(key)) {
                            if (key == 'productImage' || key == 'productId' || key == 'costPrice' || key == 'specification' || key == 'productName') {
                                val.product[key] = val[key];
                            }
                        }
                        if (key == 'specification' && this.tableEnum[val.specification]) {
                            val.costPrice = this.tableEnum[val.specification];
                            let arr = this.skuAttrArr.filter(item => {
                                return item.label == val.specification;
                            });
                            val.skuCode = arr[0].code;
                        }
                    }
                } catch (error) {}
                this.$emit('input', val);
            },
            deep: true
        },
        prizeConfig: {
            handler(val) {
                this.resetForm();
            },
            deep: true
        }
    }
};
</script>
<style scoped lang="scss">
.up-img {
    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        img {
            max-width: 228px;
        }
    }

    /deep/ .avatar-uploader .el-upload:hover {
        border-color: #409eff;
        .el-icon-plus {
            color: #409eff;
        }
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 128px;
        height: 128px;
        line-height: 128px;
        text-align: center;
    }

    .avatar {
        width: 128px;
        height: 128px;
        display: block;
    }
}
</style>
