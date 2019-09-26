<template>
    <div class="virtual-sales">
        <!-- 销量添加 -->
        <el-dialog :visible.sync="visible" title="设置商品月销量">
            <el-form :model="setForm" label-width="120px" ref="setForm">
                <template v-if="viewStatus">
                    <el-form-item label="商品分类：">{{ detail.categories | formatterCat }}</el-form-item>
                    <el-form-item label="商品ID：">{{ detail.id }}</el-form-item>
                    <el-form-item label="商品图片：">
                        <img :src="detail.picUrl" alt="" @click="$viewImage(detail.picUrl)">
                    </el-form-item>
                    <el-form-item label="商品名称：">{{ detail.name }}</el-form-item>
                    </template>

                <el-row>
                    <el-col :span="8" v-for="(item,index) in setForm.changeRadix" :key="item.date">
                        <el-form-item :label="item.label" :prop="'changeRadix.' + index +'.' + 'number'" :rules="rules.checkNum">
                            <el-input :disabled="viewStatus" :size="$size" v-model.trim="item.number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="visible = false">取消</el-button>
                <el-button :size="$size" @click="submit('setForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const changeRadix = [
                        {date: 1, number: '', label: "1号基数"},
                        {date: 6, number: '', label: "6号基数"},
                        {date: 11, number: '', label: "11号基数"},
                        {date: 16, number: '', label: "16号基数"},
                        {date: 21, number: '', label: "21号基数"},
                        {date: 26, number: '', label: "26号基数"}
                    ];
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'mall'
            },
            detail: {}
        },
        data() {
            const checkNum = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                call();
            }
            return {
                setForm: {
                    changeRadix: changeRadix
                },
                rules: {
                    checkNum: [
                        { required: true, validator: checkNum, trigger: 'blur' }
                    ]
                },
            }
        },
        methods: {
            hideDia() {
                this.$emit('update:visible', false);
            },
            submit(formName) {
                if(this.viewStatus) {
                    this.visible = false;
                    return false;
                }
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = {
                            xkModule: this.type,
                            changeRadix: this.setForm.changeRadix.map(item=>{
                                return {
                                    date: item.date,
                                    number: item.number
                                }
                            }),
                            virtualSaleRule: {
                                goodsId: this.setForm.goodsIds[0],
                                shopId: this.setForm.shopId
                            }
                        }
                        // this.editStatus? params.goodsId = this.setForm.goodsIds[0]: params.goodsIds = this.setForm.goodsIds;
                        let url = this.editStatus? this.$api.virtualUpdate: this.$api.virtualCreate;
                        console.log(JSON.stringify(params))
                        this.$http.post(url, params, true)
                        .then(res=>{
                            this.$message.success('保存成功');
                            this.visible = false;
                            this.getList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }
                })
            }
        },
        watch: {
            visible(val) {
                !val? this.hideDia():null
            }
        }
    }
</script>

<style scoped lang="scss">
    .virtual-sales {

    }
</style>
