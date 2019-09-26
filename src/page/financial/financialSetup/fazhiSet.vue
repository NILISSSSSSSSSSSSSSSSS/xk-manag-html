/*
 * @Author: liusheng 
 * @Date: 2019-01-15 16:51:14 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-01-16 16:47:16
 */
<template>
    <div class = 'fazhi-set xk-container'>
        <el-form label-width="120px" :model="searchData" inline ref="formref">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        单日提现阈值设置
                    </div>
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                直营店提现
                            </el-col>
                            <el-col :span="8">
                                <xk-form-item label="单日提现阈值：" prop="directStoreThreshold.everyDayThreshold" type="money">
                                    <el-input v-model.number="searchData.directStoreThreshold.everyDayThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="8">
                                <xk-form-item label="单笔提现阈值：" prop="directStoreThreshold.everyHandThreshold" type="money">
                                    <el-input v-model.number="searchData.directStoreThreshold.everyHandThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="24">
                                联盟商提现
                            </el-col>
                            <el-col :span="8">
                                <xk-form-item label="单日提现阈值：" prop="merchantThreshold.everyDayThreshold" type="money">
                                    <el-input v-model.number="searchData.merchantThreshold.everyDayThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="8">
                                <xk-form-item label="单笔提现阈值：" prop="merchantThreshold.everyHandThreshold" type="money">
                                    <el-input v-model.number="searchData.merchantThreshold.everyHandThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="24">
                                主播提现
                            </el-col>
                            <el-col :span="8">
                                <xk-form-item label="单日提现阈值：" prop="anchorThreshold.everyDayThreshold" type="money">
                                    <el-input v-model.number="searchData.anchorThreshold.everyDayThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="8">
                                <xk-form-item label="单笔提现阈值：" prop="anchorThreshold.everyHandThreshold" type="money">
                                    <el-input v-model.number="searchData.anchorThreshold.everyHandThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                </xk-form-item>
                            </el-col>
                        </el-row>
                </div>
            </div>

            <div class="xk-radius marintop20">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>
                        提现审核阈值设置
                    </div>
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                直营店提现
                            </el-col>
                            <el-col :span="24">
                                <xk-form-item label="免审核阈值：" prop="directStoreThreshold.freeHandThreshold" type="money">
                                    <el-input v-model.number="searchData.directStoreThreshold.freeHandThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                    <span>小于该金额数的直营店提现操作将不通过审核直接进行提现</span>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="24">
                                联盟商提现
                            </el-col>
                            <el-col :span="24">
                                <xk-form-item label="免审核阈值：" prop="merchantThreshold.freeHandThreshold" type="money">
                                    <el-input v-model.number="searchData.merchantThreshold.freeHandThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                    <span>小于该金额数的商户提现操作将不通过审核直接进行提现</span>
                                </xk-form-item>
                            </el-col>
                            <el-col :span="24">
                                主播提现
                            </el-col>
                            <el-col :span="24">
                                <xk-form-item label="免审核阈值：" prop="anchorThreshold.freeHandThreshold" type="money">
                                    <el-input v-model.number="searchData.anchorThreshold.freeHandThreshold" :size="$size" placeholder="请输入免审核阈值"></el-input>
                                    <span>小于该金额数的主播提现操作将不通过审核直接进行提现</span>
                                </xk-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-form>

        <div class="marintop20 btn-center">
            <el-button v-permission="'fazhiSetEdit'" type="primary" :size="$size" @click="submitForm" :loading="loadingSave">保存</el-button>
        </div>
    </div>
</template>
<script>
import XkFormItem from '@/components/common/XKFormItem.vue';
export default {
    name:'fazhiSet',
    components: {
        XkFormItem
    },
    data () {
        return {
            searchData:{
                anchorThreshold: {},
                directStoreThreshold: {},
                merchantThreshold: {}
            },
            loadingSave: false
        };
    },
    props: {},
    computed: {},
    created() {
        this.getFazhiDetail();
    },
    mounted() {},
    methods: {
        submitForm(){
            this.$refs['formref'].validate((valid) => {
                if (valid) {
                    this.setFazhi();
                } else {
                    return false;
                }
            });
        },
        //阀值设置
        setFazhi() {
            this.loadingSave = true;
            let params = this.changeNum(this.searchData, true);
            this.$http.post(this.$api.withdrawThresholdSave, {threshold: params}, true).then(res=>{
                this.$message.success('保存成功');
                this.loadingSave = false;
            })
            .catch(err=>{
                this.loadingSave = false;
                this.$message.error(err.message);
            })
        },
        //获取阀值详情
        getFazhiDetail() {
            this.$http.get(this.$api.queryWithdrawThreshold, {}, true).then(res=>{
                res? this.searchData = this.changeNum(res, false): null;
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
        },
        changeNum(params, bool) {
            let { merchantThreshold, directStoreThreshold, anchorThreshold } = params;

            return {
                merchantThreshold: {
                    everyHandThreshold: bool? this.$math.multip(merchantThreshold.everyHandThreshold, 100): this.$math.divide(merchantThreshold.everyHandThreshold, 100),
                    freeHandThreshold: bool? this.$math.multip(merchantThreshold.freeHandThreshold, 100): this.$math.divide(merchantThreshold.freeHandThreshold, 100),
                    everyDayThreshold: bool? this.$math.multip(merchantThreshold.everyDayThreshold, 100): this.$math.divide(merchantThreshold.everyDayThreshold, 100)
                },
                directStoreThreshold: {
                    everyHandThreshold: bool? this.$math.multip(directStoreThreshold.everyHandThreshold, 100): this.$math.divide(directStoreThreshold.everyHandThreshold, 100),
                    freeHandThreshold: bool? this.$math.multip(directStoreThreshold.freeHandThreshold, 100): this.$math.divide(directStoreThreshold.freeHandThreshold, 100),
                    everyDayThreshold: bool? this.$math.multip(directStoreThreshold.everyDayThreshold, 100): this.$math.divide(directStoreThreshold.everyDayThreshold, 100)
                },
                anchorThreshold: {
                    everyHandThreshold: bool? this.$math.multip(anchorThreshold.everyHandThreshold, 100): this.$math.divide(anchorThreshold.everyHandThreshold, 100),
                    freeHandThreshold: bool? this.$math.multip(anchorThreshold.freeHandThreshold, 100): this.$math.divide(anchorThreshold.freeHandThreshold, 100),
                    everyDayThreshold: bool? this.$math.multip(anchorThreshold.everyDayThreshold, 100): this.$math.divide(anchorThreshold.everyDayThreshold, 100)
                }
            }
        }
    },
    watch: {}
}
</script>
<style scoped>
.btn-center{
    text-align: center
}
</style>