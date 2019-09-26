<template>
    <div class="spread-condition-seting">
        <el-row class="title-bg">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="4">推广行为</el-col>
            <el-col :span="4">达标标准设置</el-col>
            <el-col :span="4">行为有效起止时间（每日）</el-col>
            <el-col :span="3">金额权重（按累加）</el-col>
            <el-col :span="4">中奖翻倍（按最高）</el-col>
            <el-col :span="4">操作</el-col>
        </el-row>
        <el-row class="title-body" v-for="(item, index) in ruleData" :key="index">
            <el-col :span="1">
                <div class="body-cell">
                    <el-checkbox v-model="item.checked" @change="selectChange"></el-checkbox>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="body-cell">{{ item.name }}</div>
            </el-col>
            <el-col :span="4">
                <div class="body-cell">
                    <p v-if="item.type !== 'video_reach' && item.type !== 'order_amount_reach'">/</p>
                    <template v-else>
                        <p v-if="item.likedCount">{{ item.likedCount }} 点赞</p>
                        <p v-if="item.commentCount">{{ item.commentCount }} 评论</p>
                        <p v-if="item.forwardCount">{{ item.forwardCount }} 转发</p>
                        <p v-if="item.amount">{{ item.amount }} 元</p>
                    </template>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="body-cell">
                    <span v-if="(item.validTime instanceof Array)">
                        {{ moment(item.validTime[0]).format('HH:mm:ss') }}
                    </span>
                    <span>至</span>
                    <span v-if="(item.validTime instanceof Array)">
                        {{ moment(item.validTime[1]).format('HH:mm:ss') }}
                    </span>
                </div>
            </el-col>
            <el-col :span="3">
                <div class="body-cell">{{ item.weightAmount }}</div>
            </el-col>
            <el-col :span="3">
                <div class="body-cell">{{ item.multiple }}</div>
            </el-col>
            <el-col :span="5">
                <div class="body-cell">
                    <el-checkbox v-model.number="item.isMustReach" :true-label="1" :false-label="0">必须满足</el-checkbox>
                    <el-button :size="$size" type="primary" @click="openEdit(item, index)">编辑</el-button>
                </div>
            </el-col>
        </el-row>


        <!-- 编辑推广行为 -->
        <el-dialog title="编辑推广行为" :visible.sync="visible" width="700px" class="dialog-edit-spread">
            <el-form label-width="120px" :model="promotionForm" ref="promotionForm" :rules="rules">
                <el-form-item label="行为名称：">{{ promotionForm.name }}</el-form-item>
                <el-form-item label="有效时间：" prop="validTime">
                    <el-time-picker v-model="promotionForm.validTime" :editable="false" :clearable="false" is-range :size="$size" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"></el-time-picker>
                </el-form-item>
                <xk-form-item label="中奖翻倍：" prop="multiple" type="integer">
                    <el-input :size="$size" v-model.trim="promotionForm.multiple"></el-input>
                </xk-form-item>
                <xk-form-item label="金额权重：" prop="weightAmount" type="money">
                    <el-input :size="$size" v-model.number="promotionForm.weightAmount"></el-input>
                </xk-form-item>
                <el-form-item label="达标标准设置：" v-if="promotionForm.type === 'video_reach' || promotionForm.type === 'order_amount_reach'">
                    <template v-if="promotionForm.type === 'order_amount_reach'">
                        <el-form-item label-width="0" prop="amount" :rules="rules.checkDecimal">
                            <el-row>
                                <el-col :span="16">
                                    <el-input :size="$size" v-model.trim="promotionForm.amount"></el-input>
                                </el-col>
                                <el-col :span="8">元（订单金额）</el-col>
                            </el-row>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label-width="0" prop="forwardCount" :rules="rules.check">
                            <el-row>
                                <el-col :span="16">
                                    <el-input :size="$size" v-model.trim="promotionForm.forwardCount"></el-input>
                                </el-col>
                                <el-col :span="8">转发（上传小视频）</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label-width="0" prop="likedCount" :rules="rules.check">
                            <el-row>
                                <el-col :span="16">
                                    <el-input :size="$size" v-model.trim="promotionForm.likedCount"></el-input>
                                </el-col>
                                <el-col :span="8">点赞</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label-width="0" prop="commentCount" :rules="rules.check">
                            <el-row>
                                <el-col :span="16">
                                    <el-input :size="$size" v-model.trim="promotionForm.commentCount"></el-input>
                                </el-col>
                                <el-col :span="8">评论</el-col>
                            </el-row>
                        </el-form-item>
                    </template>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="visible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="saveEditSpread('promotionForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import XkFormItem from '@/components/common/XKFormItem.vue';

    export default {
        components: {
            XkFormItem
        },
        props: {
            ruleData: {
                default: ()=>[],
                type: Array
            }
        },
        data() {
             const check = (rule, value, call) => {
                if(!/^(0)|(^[1-9])\d*$/) {
                    return call(new Error('格式不正确'))
                }
                return call();
            }
            return {
                moment,
                visible: false,
                promotionForm: {},
                rules: {
                    validTime: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    check: [
                        { required: true, validator: check, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            openEdit(row, index) {
                this.promotionForm = JSON.parse(JSON.stringify(Object.assign(row, {index: index})));
                this.visible = true;
            },
            selectChange(bool) {
                this.$emit("selection-change", this.getSelectData());
            },
            getSelectData() {
                return this.ruleData.filter(item=>{
                    return item.checked;
                })
            },
            saveEditSpread(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let obj = {
                            name: this.promotionForm.name,
                            type: this.promotionForm.type,
                            validTime: this.promotionForm.validTime,
                            weightAmount: this.promotionForm.weightAmount,
                            multiple: this.promotionForm.multiple,
                            checked: false
                        }
                        if(this.promotionForm.type==='order_amount_reach') {
                            obj.amount = this.promotionForm.amount
                        }
                        if(this.promotionForm.type === 'video_reach') {
                            obj.forwardCount = this.promotionForm.forwardCount;
                            obj.commentCount = this.promotionForm.commentCount;
                            obj.likedCount = this.promotionForm.likedCount;
                        }
                        this.ruleData.splice(this.promotionForm.index, 1, obj);
                        this.visible = false;
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .spread-condition-seting {
        padding: 20px;
        .title-bg {
            color: #fff;
            font-size: 14px;
            text-align: center;
            padding: 12px 0;
            background-image: linear-gradient(-248deg, #4A90FA 0%, #8E78FF 100%);
        }
        .title-body {
            text-align: center;
            font-size: 14px;
            color: #606266;
            border-left: 1px solid #EBEEF5;
            border-right: 1px solid #EBEEF5;
            border-bottom: 1px solid #EBEEF5;
            overflow:hidden;
            .body-cell {
                padding: 24px 0;
            }
            /deep/ .el-col {
                height: 100%;
                margin-bottom:-10000px;
                padding-bottom:10000px;
                border-right: 1px solid #d8d8d8;
                &:last-child {
                    border-right: none;
                }
            }
        }
    }
</style>
