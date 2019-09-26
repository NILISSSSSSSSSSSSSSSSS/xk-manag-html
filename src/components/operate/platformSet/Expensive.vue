<template>
    <div class="expensive">
        <div class="draw-content">
            <div class="save-btn">
                <slot/>
                <el-button v-permission="'consumeLuckDrawCenterAdd'" :loading="loadingBtn" :disabled="loadingBtn" :size="$size" type="primary" @click="saveAll()">全部保存</el-button>
            </div>
        </div>
        <el-tabs v-model="tabSelect">
            <el-tab-pane label="基础抽奖设置" name="one">
                <expensive-basic @save="saveBasic" ref="basic"></expensive-basic>
            </el-tab-pane>
            <el-tab-pane label="随机红包设置" name="two">
                <expensive-bag @save="saveBag" ref="bag"></expensive-bag>
            </el-tab-pane>
            <el-tab-pane label="模板奖品设置" name="three">
                <expensive-prize @save="savePrize" ref="prize"></expensive-prize>
            </el-tab-pane>
            <el-tab-pane label="抽奖黑名单设置" name="five">
                <expensive-blank @save="saveBlack" ref="black"></expensive-blank>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import ExpensiveBasic from './ExpensiveBasic.vue';
    import ExpensiveBag from './ExpensiveBag.vue';
    import ExpensivePrize from './ExpensivePrize.vue';
    import ExpensiveBlank from './ExpensiveBlank.vue';


    export default {
        components: {
            ExpensiveBasic,
            ExpensiveBag,
            ExpensivePrize,
            ExpensiveBlank
        },
        data() {
            return {
                tabSelect: 'one',
                basicInfo: '',
                bagInfo: '',
                prizeInfo: '',
                weightInfo: '',
                blackInfo: '',
                loadingBtn: false
            }
        },
        computed: {
            ...mapState({
                currListIndex: state => state.operatePlatform.currListIndex,
                templateId: state => state.operatePlatform.tmpId,
                bagForm: state => state.operatePlatform.bagForm,
                prizeForm: state => state.operatePlatform.prizeForm,
                blackForm: state => state.operatePlatform.blackForm
            })
        },
        methods: {
            ...mapMutations({
                setTmpId: "operatePlatform/setTmpId",
                setTmpList: "operatePlatform/setTmpList",
                setCurrListIndex: "operatePlatform/setCurrListIndex",
            }),
            saveBasic(data) {
                this.basicInfo = data;
            },
            saveBag(data) {
                this.bagInfo = data;
            },
            savePrize(data) {
                this.prizeInfo = data;
            },
            saveBlack(data) {
                this.blackInfo = data;
            },
            saveAll() {
                let promiseReg = [this.$refs['basic'].saveInfo(), this.$refs['bag'].saveBag(), this.$refs['prize'].saveInfo(), this.$refs['black'].save()];
                console.log(promiseReg);
                Promise.all(promiseReg).then(res=>{
                    let params= this.createParams();
                    this.loadingBtn = true;
                    this.$http.post(this.$api.activityPlatformTemplateCreateOrModify, params, true).then(res=>{
                        // console.log(res)
                        this.$message.success('保存成功');
                        this.loadingBtn = false;
                        this.getList();
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        this.loadingBtn = false;
                    })
                    // console.log(JSON.stringify(params));
                })
                .catch(err=>{
                    this.$message.error('验证失败')
                })
                
                return false;
                
            },
            getList() {
                this.$http.get(this.$api.activityPlatformTemplateQueryAll, {}, true).then(res=>{
                    let arr = [];
                    res.forEach(item=>{
                        let obj = {name: item.name, subTitle: { firstName: '运营基础设置', secondName: '用户抽奖转盘设置', thirdName: '联盟商抽奖转盘设置'}, templateId: item.templateId};
                        arr.push(obj);
                    })
                    this.setTmpList(arr);
                    this.$parent.getTmpDetail();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //构建提交参数
            createParams() {
                let obj = {
                    baseSetting: {
                        ticketExpireTime:  this.$math.multip(this.basicInfo.ticketExpireTime , 3600), //运营专用奖品券时效设置
                        everyCycleSize: this.basicInfo.everyCycleSize,      //奖池总笔数
                        activityRegions: this.createRegion(),
                        name: this.basicInfo.name,
                        merchantLotteryDivided: this.$math.multip(this.basicInfo.merchantLotteryDivided, 100)       //彩票平台分成
                    },
                    poolSetting: {
                        drawoutGiftRate: this.$math.multip(this.basicInfo.drawoutGiftRate ,100),          //商家彩票平台分成
                        productO2ORate: this.$math.multip(this.basicInfo.productO2ORate ,100),      //口碑商圈抽成比例(服务费)
                        productGameRate: this.$math.multip(this.basicInfo.productGameRate ,100),    //游戏业务抽成比例
                        drawoutB2CRate: this.$math.multip(this.basicInfo.drawoutB2CRate ,100),    //精选商城抽成比例
                        drawoutB2BRate: this.$math.multip(this.basicInfo.drawoutB2BRate ,100),    //批发商城抽成比例
                        warningAmount: this.$math.multip(this.basicInfo.warningAmount ,100),       //奖池预警金额
                        warningPhone: this.basicInfo.warningPhone       //预警电话
                    },
                    blackListSetting: {
                        autoDeleteBlackerTime: this.$math.multip(this.blackForm.autoDeleteBlackerTime , 3600),  //自动删除黑名单时间
                        randomRedPacketAmountMin: this.$math.multip(this.blackForm.randomRedPacketAmountMin ,100), //黑名单随机金额红包设置（小）
                        randomRedPacketAmountMax: this.$math.multip(this.blackForm.randomRedPacketAmountMax ,100), //黑名单随机金额红包设置（大）
                        blackListRules: this.createBlack()   //黑名单参数
                    },
                    prizeSetting: this.createPrize()
                }
                this.templateId? obj.templateId = this.templateId: null;
                return obj;
            },
            //生成模板适用地区
            createRegion() {
                if(this.currListIndex==0) {
                    return [{
                        countyCode:"000000",
                        provinceCode:"000000",
                        cityCode:"000000"
                    }]
                }
                let arr = [];
                this.basicInfo.regions.forEach(item => {
                    arr.push({
                        countyCode: item.regions[2]? item.regions[2]: '' ,
                        provinceCode: item.regions[0]? item.regions[0]: '' ,
                        cityCode: item.regions[1]? item.regions[1]: ''
                    })
                })
                return arr;
            },
            //黑名单参数
            createBlack() {
                let arr = [];
                this.blackForm.blackListRules.forEach(item=>{
                    let obj = {
                        ruleCommandTime: this.$math.multip(item.ruleCommandTime, 3600),
                        ruleCommandOrderNum: item.ruleCommandOrderNum,
                        isSettingSameAmount: item.average
                    }
                    if(item.average==0) {
                        obj.ruleCommandAverageAmount = this.$math.multip(item.ruleCommandAverageAmount , 100)
                    }
                    arr.push(obj);
                })
                return arr;
            },
            //创建奖品参数
            createPrize() {
                let arr = [];
                //构建红包参数
                if(this.bagForm) {
                    console.log(this.bagForm);
                    let _obj = {
                        prizeType: this.bagForm.default.prizeType,
                        name: this.bagForm.default.name,
                        redPacketRule: {
                            isDefault: 1,
                            maxAmount: this.$math.multip(this.bagForm.default.maxAmount ,100),
                            minAmount: this.$math.multip(this.bagForm.default.minAmount ,100)
                        },
                        description: this.bagForm.description,
                        microPic: this.bagForm.microPic
                    }
                    this.bagForm.default._id? _obj.id=this.bagForm.default._id: null;
                    arr.push(_obj);
                    this.bagForm.bagArr.forEach(item=>{
                        let obj = {
                            prizeType: item.prizeType,
                            name: item.basic.name,
                            everyCycleProvideNum: item.winningAssignRules.everyCycleProvideNum,
                            isAutoAssign: item.winningAssignRules.isAutoAssign,
                            redPacketRule: {
                                isDefault: 0,
                                maxAmount: this.$math.multip(item.basic.maxAmount ,100),
                                minAmount: this.$math.multip(item.basic.minAmount ,100),
                                totalAmount: this.$math.multip(item.winningAssignRules.totalAmount ,100)
                            },
                            description: this.bagForm.description,
                            microPic: this.bagForm.microPic,
                            orderWeightsAssignRules: this.createWeightParam(item.orderWeightsAssignRules)
                        }
                        item._id? obj.id =item._id : null;
                        if(item.winningAssignRules.isAutoAssign=='1') {
                            obj.autoWinningAssignNum = this.basicInfo.everyCycleSize/item.winningAssignRules.everyCycleProvideNum;
                        }else{
                            obj.winningAssignRules = item.winningAssignRules.winningAssignRules
                        }
                        arr.push(obj);
                    })
                }

                //构建奖品参数配置
                if(this.prizeForm) {
                    console.log(this.prizeForm)
                    this.prizeForm.forEach(item => {
                        let obj = {
                            prizeType: item.prizeType,
                            rowStart: item.win.rowStart,
                            rowEnd: item.win.rowEnd,
                            everyCycleProvideNum: item.win.everyCycleProvideNum,
                            isAutoAssign: item.win.average,
                            orderWeightsAssignRules: this.createWeightParam(item.order),
                            description: item.win.description,
                            microPic: item.win.microPic
                        }

                        item._id? obj.id = item._id: null;
                        item.prizeType==='mall' || item.prizeType === 'j_mall' || item.prizeType==='aa_lottery' ? obj.goodsId = item.id: null;
                        item.prizeType ==='mall'? obj.skuCode = item.skuCode: null;
                        item.prizeType==='aa_lottery' ?obj.type= item.type: null;
                        if(item.win.average == 0) {
                            obj.winningAssignRules = item.win.winningAssignRules;
                        }else{
                            obj.autoWinningAssignNum =  this.basicInfo.everyCycleSize/item.win.everyCycleProvideNum;
                        }
                        arr.push(obj);
                    })
                }
                return arr;
            },
            //权重配置
            createWeightParam(param) {
                let arr = [];
                param.forEach(item=>{
                    arr.push({
                        startAmount: this.$math.multip(item.startAmount ,100),
                        endAmount: item.endAmount? this.$math.multip(item.endAmount ,100): '',
                        proportion: this.$math.multip(item.proportion ,100)
                    })
                })
                return arr;
            }
        }
    }
</script>

<style scoped lang="scss">
    .expensive {
        .save-btn {
            text-align: right;
        }
        .draw-content {
            flex: 1;
            padding-left: 20px;
        }
    }
</style>
