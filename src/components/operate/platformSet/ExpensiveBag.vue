<template>
    <div class="expensive-bag">
        <el-form :model="bagForm" ref="bagForm" label-width="180px" :rules="rules">
            <el-card class="marginbottom20">
                <h2 slot="header" class="default-bag">默认红包（默认的随机红包，不能设置金额权重及几率，作用为填补{{ num }}笔中其他所有奖品的空缺）</h2>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="红包缩略图：" prop="microPic">
                            <image-upload v-model="bagForm.microPic" :more="false" size="2">
                                <img v-if="bagForm.microPic" :src="bagForm.microPic" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </image-upload>
                            <p><span class="xk-danger">* </span>提示：图片建议尺寸168*98，大小不超过2M</p>
                        </el-form-item>
                        <el-form-item label="奖品简介：" label-width="120px" prop="description" class="jianjie">
                            <el-input 
                                type="textarea" 
                                style="width: 500px"
                                v-model.trim="bagForm.description" 
                                :size="$size" 
                                placeholder="请输入简介" 
                                :autosize="{ minRows: 4, maxRows: 4}"
                                resize="none"
                                show-word-limit 
                                maxlength="150"></el-input>
                                <div class="count-num">{{ bagForm.description? bagForm.description.length: 0 }}/150</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <bag-component ref="bagDefault" v-model="bagForm.default"></bag-component>
                    </el-col>
                    <el-col :span="4"></el-col>
                </el-row>
            </el-card>
            <el-card class="marginbottom20" v-for="(item, index) in bagForm.bagArr" :key="index">
                <div slot="header" class="clearfix">
                    <el-button icon="el-icon-delete" style="float: right; padding: 0;color:#F56C6C " type="text" @click="deleteItem(index)"></el-button>
                </div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <bag-component :ref="index" v-model="item.basic"></bag-component>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="center">
                            <el-button type="text" @click="item.collapse=!item.collapse">收起/打开几率设置</el-button>
                        </div>
                        <el-collapse-transition>
                            <expensive-bag-component :minPrice="item.basic.minAmount" :maxPrice="item.basic.maxAmount" :ref="'win'+index" v-show="item.collapse" v-model="item.winningAssignRules"></expensive-bag-component>
                        </el-collapse-transition>
                    </el-col>
                    <el-col :span="12">
                        <div class="center">
                            <el-button type="text" @click="item.collapsePro=!item.collapsePro">收起/打开权重设置</el-button>
                        </div>
                        <el-collapse-transition>
                            <order-weight-set v-show="item.collapsePro" :ref="'weight'+index" v-model="item.orderWeightsAssignRules"></order-weight-set>
                        </el-collapse-transition>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <div class="btn-group">
            <el-button :size="$size" type="success" @click="addItem()">新增红包梯次</el-button>
            <!-- <el-button :size="$size" type="primary" @click="saveBag()">保存红包设置</el-button> -->
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import BagComponent from './BagComponent.vue';
    import ExpensiveBagComponent from './ExpensiveBagComponent.vue';
    import OrderWeightSet from './OrderWeightSet.vue';
    import ImageUpload from '../../ImageUpload.vue';
    export default {
        components: {
            BagComponent,
            ExpensiveBagComponent,
            OrderWeightSet,
            ImageUpload
        },
        data() {
            return {
                visibleDialog: false,
                rules: {
                    description: [
                        { required: true, min: 1, max: 150, message: '请输入1-150字', trigger: 'blur' }
                    ],
                    microPic: [
                        { required: true, message: '缩略图不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                bagForm: state => state.operatePlatform.bagForm,
                num: state => state.operatePlatform.totalMoney
            })
        },
        methods: {
            ...mapMutations({
                setBagWeight: 'operatePlatform/setBagWeight'
            }),
            deleteItem(index) {
                this.bagForm.bagArr.splice(index, 1);
            },
            addItem() {
                this.bagForm.bagArr.push({
                    basic: {},
                    prizeType: 'red_packet',
                    orderWeightsAssignRules: [
                        {
                            startAmount: "",
                            endAmount: "",
                            proportion: ""
                        }
                    ],
                    winningAssignRules: {
                        isAutoAssign: '0',
                        winningAssignRules: [
                            {startNum: 1, endNum: '', appearNum: ''}
                        ]
                    },
                    collapse: true,
                    collapsePro: true
                })
            },
            saveBag() {
                return new Promise((resolve, reject) => {
                    this.$refs['bagForm'].validate(v=>{
                        if(v) {
                            let checkRes = [];
                            checkRes.push(this.$refs['bagDefault']._validate());
                            this.bagForm.bagArr.forEach((item, index) => {
                                checkRes.push(this.$refs[index][0]._validate());
                                checkRes.push(this.$refs['weight'+index][0]._validate());
                                checkRes.push(this.$refs['win'+index][0]._validate());
                            })
                            Promise.all(checkRes).then(res=> {
                                resolve(true)
                            })
                            .catch(res=>{
                                reject(false)
                            })
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
    .expensive-bag {
        .default-bag {
            font-size: 16px;
            color: #222;
        }
        .input-num {
            width: 100px;
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
                left: 510px;
            }
        }
    }
    
    /deep/ .el-form-item {
        margin-bottom: 15px;
    }
    .lh42 {
        line-height: 42px;
    }
    .collapse-box {
        padding: 0 40px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>
