<template>
    <div class="expensive-basic">
        <el-form :model="basicForm" label-width="220px" ref="basicForm" :rules="rules">
            <h2>消费抽奖基础设置</h2>
            <el-form-item label="消费抽奖配置模板名称：" prop="name">
                <el-row>
                    <el-col :span="12">
                        <el-input maxlength="20" class="short-input" v-model.trim="basicForm.name" :size="$size" placeholder="模板名称"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="模板适用地区：">
                <el-row>
                    <el-col :span="12" v-if="currListIndex==0">
                        全国
                    </el-col>
                    <template v-else>
                        <el-col :span="24" v-for="(item, index) in basicForm.regions" :key="index">
                            <el-col :span="5">
                                <el-form-item label-width="0">
                                    <province-cascader class="short-input" v-model="item.regions"></province-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="danger" v-if="basicForm.regions.length-1!=0" :size="$size" icon="el-icon-minus" @click="deleteItem(index)"></el-button>
                                <el-button type="primary" v-if="index==basicForm.regions.length-1" :size="$size" icon="el-icon-plus" @click="addItem()"></el-button>
                            </el-col>
                        </el-col>
                    </template>
                </el-row>
            </el-form-item>
            <xk-form-item label="消费抽奖券时效设置：" prop="ticketExpireTime" type="integer">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.ticketExpireTime"></el-input>&nbsp;&nbsp;&nbsp;小时
            </xk-form-item>
            <el-form-item label="商家彩票平台分成：" prop="merchantLotteryDivided">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.merchantLotteryDivided"></el-input>&nbsp;&nbsp;&nbsp;%
            </el-form-item>
            <el-form-item label="设置计算奖品几率奖池总笔数：" prop="everyCycleSize">
                <el-input class="short-input" :size="$size" placeholder="1000" v-model.number="basicForm.everyCycleSize"></el-input>&nbsp;&nbsp;&nbsp;笔
            </el-form-item>

            <h2>奖池设置</h2>
            <el-form-item label="当前城市奖池剩余金额：">
                <span style="margin-right: 50px;color: red;font-size: 16px">{{ poolMoney }}元</span>
                <el-button v-permission="'consumeLuckDrawCenterSubsidy'" :disabled="basicForm.poolId? false: true" :size="$size" type="primary" @click="subsidy()">补贴奖池</el-button>
                <el-button v-permission="'consumeLuckDrawCenterDetail'" :disabled="basicForm.poolId? false: true" :size="$size" type="primary" @click="viewPoolDetail()">查看奖池明细</el-button>
            </el-form-item>

            <xk-form-item label="精选商城抽成比例：" prop="drawoutB2CRate" type="persent">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.drawoutB2CRate"></el-input>&nbsp;&nbsp;&nbsp;%
            </xk-form-item>
            <xk-form-item label="批发商城抽成比例：" prop="drawoutB2BRate" type="persent">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.drawoutB2BRate"></el-input>&nbsp;&nbsp;&nbsp;%
            </xk-form-item>
            <xk-form-item label="礼物业务抽成比例：" prop="drawoutGiftRate" type="persent">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.drawoutGiftRate"></el-input>&nbsp;&nbsp;&nbsp;%
            </xk-form-item>
            <xk-form-item label="游戏业务抽成比例：" prop="productGameRate" type="persent">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.productGameRate"></el-input>&nbsp;&nbsp;&nbsp;%
            </xk-form-item>
            <xk-form-item label="口碑商圈抽成比例(服务费)：" prop="productO2ORate" type="persent">
                <el-input class="short-input" :size="$size" placeholder="1" v-model.number="basicForm.productO2ORate"></el-input>&nbsp;&nbsp;&nbsp;%
            </xk-form-item>

            <h2>奖池预警</h2>
            <el-form-item label="奖池金额低于：" required>
                <xk-form-item label-width="0" prop="warningAmount" type="integer">
                    <el-input :size="$size" class="short-input" v-model="basicForm.warningAmount"></el-input>&nbsp;&nbsp;&nbsp;元时，自动报警
                </xk-form-item>
            </el-form-item>
            <xk-form-item label="报警通知短信设置：" prop="warningPhone" type="phone">
                <el-input :size="$size" class="short-input" v-model="basicForm.warningPhone"></el-input>
            </xk-form-item>
        </el-form>
        <div class="btn-group">
            <el-button :size="$size" type="primary" @click="saveInfo(true)">保存基础抽奖设置</el-button>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import XkFormItem from '@/components/common/XKFormItem.vue';
    export default {
        components: {
            ProvinceCascader,
            XkFormItem
        },
        data() {
            const checkSize = (rule, value, call) =>{
                if(!value) {
                    return call(new Error('请输入内容'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                // if(value<100 || value> 1000000) {
                //     return call(new Error(value<100? '不能小于100': '不能大于1000000'))
                // }
                // if(value%100 !=0) {
                //     return call(new Error('应为100的倍数'))
                // }
                return call();
            }
            const checkMerchant = (rule, value, call) =>{
                if(!value && value!=0) {
                    return call(new Error('不能为空'))
                }
                if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('比例格式设置不正确'))
                }
                if(value>50) {
                    return call(new Error('不能超过50'))
                }
                return call();
            }
            return {
                rules: {
                    name: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    everyCycleSize: [{ required: true, validator: checkSize, trigger: 'blur' }],
                    merchantLotteryDivided: [
                        { required: true, validator: checkMerchant, trigger: 'blur' }
                    ]
                },
                visible: true,
                poolMoney: 0   //奖池余额
            }
        },
        computed: {
            ...mapState({
                currListIndex: state=> state.operatePlatform.currListIndex,
                basicForm: state => state.operatePlatform.basicLotterySet,
                tmpId: state => state.operatePlatform.tmpId
            })
        },
        methods: {
            ...mapMutations({
                setTmpName: "operatePlatform/setTmpName",
                setTotalMoney: "operatePlatform/setTotalMoney"
            }),
            subsidy() {
                this.$prompt('请输入补贴奖池金额（元）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator:(value)=>{
                        if(!value) {
                            return '金额不能为空'
                        }
                        if(!/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/.test(value)) {
                            return '金额必须为数字类型或2位有效数字'
                        }
                    }
                })
                .then(({value}) => {
                    if(this.basicForm.poolId && value) {
                        this.fullJackpotRecharge(value);
                    }
                })
                .catch(()=>{})
            },
            //删除一个地区模板
            deleteItem(index) {
                this.basicForm.regions.splice(index, 1);
            },
            addItem() {
                this.basicForm.regions.push({
                    regions: ""
                })
            },
            saveInfo(bool) {
                return new Promise((resolve, reject) => {
                    this.$refs['basicForm'].validate(v=>{
                        if(v) {
                            this.setTmpName(this.basicForm.name);
                            this.setTotalMoney(this.basicForm.everyCycleSize);
                            this.$emit('save', this.basicForm);
                            resolve(true);
                            bool?this.$message.success('基础抽奖设置缓存成功'): null;
                        }else{
                            reject(false);
                            return false;
                        }
                    })
                })
                
            },
            //获取奖池明细
            getPoolDetail(jackpotId) {
                this.$http.get(this.$api.jackpotMoneyRemaining, { jackpotId: jackpotId }, true).then(res=>{
                    this.poolMoney = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //奖池充值
            fullJackpotRecharge(rechargeMoney) {
                this.$http.post(this.$api.jackpotRecharge, { jackpotId: this.basicForm.poolId, rechargeMoney: this.$math.multip(rechargeMoney, 100) }, true).then(res=>{
                    this.getPoolDetail(this.basicForm.poolId);
                    this.$message.success('奖池余额充值成功！')
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //查看奖池明细
            viewPoolDetail() {
                this.$router.push({
                    path: '/poolDetail',
                    query: {
                        templateId: this.tmpId
                    }
                })
            }
        },
        watch: {
            "basicForm.poolId": {
                handler(val) {
                    if(val) {
                        this.getPoolDetail(val);
                    }else{
                        this.poolMoney = 0;
                    }
                },
                deep: true
            },
            // "basicForm.everyCycleSize": {
            //     handler(val) {
            //         if(val&&/^\d*$/.test(val)&&val!=0) {
            //             console.log(val)
            //             this.setTotalMoney(val)
            //         }
            //     }
            // }
        }
    }
</script>

<style scoped lang="scss">
    .expensive-basic {
        /deep/ .el-form-item {
            margin-bottom: 15px;
        }
        /deep/ .el-select {
            width: 100%;
        }
        .short-input {
            width: 200px;
        }
    }
</style>
