<template>
    <div class="xk-container consume-luck-draw-center">
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                <span></span>
                    消费抽奖设置
                </div>
                <div class='vus-bottom'></div>
            </div>

            <div class="tmp-list">
                <div class="consume-luck-left">
                    <div class="consume-luck-menu">
                        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" unique-opened  @select="openItem">
                            <el-submenu v-for="(item, index) in tmpList" :key="index" :index="index+''">
                                <template slot="title">
                                    <span :title="item.name">{{ item.name }}</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item :index="index+'-1'">{{ item.subTitle.firstName }}</el-menu-item>
                                    <el-menu-item :index="index+'-2'">{{ item.subTitle.secondName }}</el-menu-item>
                                    <el-menu-item :index="index+'-3'">{{ item.subTitle.thirdName }}</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </el-menu>
                    </div>
                    <div class="add-item">
                        <el-button v-permission="'consumeLuckDrawCenterAdd'" type="text" class="item-button" @click="addItem()">+ 添加运营模板</el-button>
                    </div>
                </div>

                <div class="draw-content">
                    <expensive v-show="currTab==1">
                        <el-button v-permission="consumeLuckDrawCenterDel" v-if="currListIndex!=0" :size="$size" type="danger" @click="deleteTmp()">删除</el-button>
                    </expensive>
                    <expensive-lottery v-show="currTab==2 || currTab == 3" :activeType="currTab">
                        <el-button v-permission="consumeLuckDrawCenterDel" v-if="currListIndex!=0" :size="$size" type="danger" @click="deleteTmp()">删除</el-button>
                    </expensive-lottery>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Expensive from '@/components/operate/platformSet/Expensive.vue';
    import ExpensiveLottery from '@/components/operate/platformSet/ExpensiveLottery.vue';
    import { mapMutations, mapState, mapActions } from 'vuex';
    export default {
        components: {
            Expensive,
            ExpensiveLottery
        },
        data() {
            return {
                defaultActive: '0-1',
                currTab: '1',
                activeLeft: 1,
                isCollapse: true,
                contentLoading: true
            }
        },
        computed: {
            ...mapState({
                tmpList: state => state.operatePlatform.tempList,
                currListIndex: state => state.operatePlatform.currListIndex,
                tmpId: state => state.operatePlatform.tmpId,
                spreadList: state => state.operatePlatform.spreadList
            })
        },
        created() {
            this.getList();
        },
        methods: {
            ...mapMutations({
                initData: "operatePlatform/initData",
                setTotalMoney: 'operatePlatform/setTotalMoney',
                setCurrListIndex: "operatePlatform/setCurrListIndex",
                setTmpList: "operatePlatform/setTmpList",
                setTmpId: "operatePlatform/setTmpId",
                setBasicLotterySet: "operatePlatform/setBasicLotterySet",
                setBlackForm: "operatePlatform/setBlackForm",
                setBagForm: "operatePlatform/setBagForm",
                setPrizeForm: "operatePlatform/setPrizeForm",
                setLotteryPrizeList: "operatePlatform/setLotteryPrizeList",
                setSpreadList: "operatePlatform/setSpreadList",
                setExpenseId: "operatePlatform/setExpenseId",
                setSpreadId: "operatePlatform/setSpreadId",
                setLotteryType: "operatePlatform/setLotteryType"
            }),
            getList() {
                this.$http.get(this.$api.activityPlatformTemplateQueryAll, {}, true).then(res=>{
                    if(res && res.length>0) {
                        let arr = [];
                        res.forEach(item=>{
                            let obj = {name: item.name, subTitle: { firstName: '运营基础设置', secondName: '用户抽奖转盘设置', thirdName: '联盟商抽奖转盘设置'}, templateId: item.templateId};
                            arr.push(obj);
                        })
                        this.setCurrListIndex(0);
                        this.setTmpId(res[0].templateId)
                        this.setTmpList(arr);
                        this.getTmpDetail();
                        this.activeLeft = 1;
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            selectTab(tab) {
                if(tab.name==='add') {
                    this.$prompt('请输入模板名称', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValidator: (value)=>{
                            if(!value) {
                                return '不能为空'
                            }
                        }
                    }).then(({value}) => {
                        this.tmpList.push({name: value});
                        this.activeLeft = this.tmpList.length;
                    }).catch(()=>{
                        this.activeLeft = 1
                    })
                }
            },
            deleteTmp() {
                this.$confirm('是否删除当前运营模板？' ,'提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(res=>{
                    this.defaultActive= '0-1';
                    if(this.tmpId) {
                        this.$http.post(this.$api.activityPlatformTemplateDelete, {templateId: this.tmpId}, true).then(res=>{
                            this.$message.success('删除成功');
                            this.getList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }else{
                        this.tmpList.splice(this.currListIndex,1);
                        this.$message.success('删除成功');
                        this.getList();
                    }
                }).catch();
            },
            /**
             * 获取模板详情
             */
            getTmpDetail() {
                if(this.tmpList[this.currListIndex].templateId) {
                    //获取运营基础设置
                    if(this.currTab==1) {
                        this.$http.get(this.$api.activityPlatformTemplateDetail, {templateId: this.tmpList[this.currListIndex].templateId }, true).then(res=>{
                            this.setTotalMoney(res.baseSetting.everyCycleSize);
                            this.setTmpId(res.id)
                            //生成基础抽奖设置基础信息
                            let obj = {
                                ticketExpireTime: this.$math.divide(res.baseSetting.ticketExpireTime , 3600),
                                everyCycleSize: res.baseSetting.everyCycleSize,
                                regions: this.deposeRegions(res.baseSetting.activityRegions),
                                name: res.baseSetting.name,
                                merchantLotteryDivided: this.$math.divide(res.baseSetting.merchantLotteryDivided ,100),
                                drawoutGiftRate: this.$math.divide(res.poolSetting.drawoutGiftRate ,100),
                                productO2ORate: this.$math.divide(res.poolSetting.productO2ORate ,100),
                                productGameRate: this.$math.divide(res.poolSetting.productGameRate ,100),
                                drawoutB2CRate: this.$math.divide(res.poolSetting.drawoutB2CRate ,100),
                                drawoutB2BRate: this.$math.divide(res.poolSetting.drawoutB2BRate ,100),
                                warningAmount: this.$math.divide(res.poolSetting.warningAmount ,100),
                                warningPhone: res.poolSetting.warningPhone,
                                poolId: res.poolSetting.poolId
                            }
                            this.setBasicLotterySet(obj);
                            //生成黑名单
                            let black = {
                                autoDeleteBlackerTime: this.$math.divide(res.blackListSetting.autoDeleteBlackerTime ,3600),
                                randomRedPacketAmountMax: this.$math.divide(res.blackListSetting.randomRedPacketAmountMax ,100),
                                randomRedPacketAmountMin: this.$math.divide(res.blackListSetting.randomRedPacketAmountMin ,100),
                                blackListRules: this.deposeBlack(res.blackListSetting.blackListRules)
                            }
                            this.setBlackForm(black);
                            //生成随机红包设置和模板奖品
                            let [bag, prize] = this.deposePrize(res.prizeSetting)
                            this.setBagForm(bag);
                            this.setPrizeForm(prize);
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }else{
                        //获取抽奖转盘设置
                        this.$http.get(this.$api.activityPlatformTemplatePrizes, {templateId: this.tmpList[this.currListIndex].templateId}, true).then(res=>{
                            let goods_arr = [],
                            bag_arr = {
                                name: '红包',
                                positionType: 'red_packet',
                                bag_content: [],
                                bag_default_content: []
                            };
                        
                            if(Array.isArray(res) && res.length>0) {
                                res.forEach((item, index) => {
                                    if(item.prizeType == 'red_packet') {
                                        if(item.redPacketRule.isDefault!=1) {
                                            bag_arr.bag_content.push(item)
                                        }else{
                                            bag_arr.bag_default_content.push(item)
                                        }
                                        
                                    }else{
                                        goods_arr.push(item);
                                    }
                                })
                            }
                            this.setLotteryPrizeList([bag_arr, ...goods_arr])
                        })
                        .catch(err=> {
                            this.$message.error(err.message);
                        })

                        if(this.currTab==2) {
                            this.setLotteryType(2);
                            this.getActivityList('COMMON_USER');
                        }else{
                            this.setLotteryType(3);
                            this.getActivityList('MERCHANT');
                        }
                    }
                }
            },
            //获取活动简要信息
            getActivityList(suitableUsers) {
                this.setExpenseId("");
                this.setSpreadList([]);
                console.log({templateId: this.tmpList[this.currListIndex].templateId, suitableUsers: suitableUsers})
                this.$http.get(this.$api.activityPlatformList, {templateId: this.tmpList[this.currListIndex].templateId, suitableUsers: suitableUsers}, true).then(res=>{
                    if(res){
                        let arr = [], expenseId="";
                        res.activities.forEach(item=>{
                            if(item.type === "promotion") {
                                arr.push(item)
                            }else{
                                expenseId = item.id;
                            }
                        })
                        this.setExpenseId(expenseId? expenseId: "")
                        this.setSpreadList(arr);
                        this.setSpreadId(arr[0]?arr[0].id: expenseId);
                    }else{
                        this.setExpenseId("");
                        this.setSpreadList([])
                    }
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            /**
             * 新增一个菜单
             */
            addItem() {
                this.$prompt('请输入消费抽奖模板名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: (value)=>{
                        if(!value) {
                            return '不能为空'
                        }
                    }
                }).then(({value}) => {
                    this.tmpList.push({
                        name: value,
                        subTitle: { firstName: '运营基础设置', secondName: '抽奖转盘设置', thirdName: '联盟商抽奖转盘设置'}
                    })
                }).catch(()=>{})
            },
            openItem(item, itemPath) {
                this.currTab = item.split("-")[1];
                this.setCurrListIndex(itemPath[0]);
                this.setTmpId(this.tmpList[itemPath[0]].templateId);
                if(this.tmpList[itemPath[0]].templateId) {
                    this.getTmpDetail()
                }else{
                    this.initData();
                }
            },
            deposeBlack(param) {
                if(param.length==0) {
                    return [{
                        ruleCommandTime: "",
                        ruleCommandOrderNum: "",
                        ruleCommandAverageAmount: "",
                        average: '0'   //0不平均分配
                    }]
                }
                let arr = [];
                param.forEach(item=>{
                    let obj = {
                        ruleCommandTime: this.$math.divide(item.ruleCommandTime, 3600),
                        ruleCommandOrderNum: item.ruleCommandOrderNum
                    }
                    if(item.ruleCommandAverageAmount) {
                        obj.average = '0';
                        obj.ruleCommandAverageAmount = this.$math.divide(item.ruleCommandAverageAmount,100)
                    }else{
                        obj.average = '1';
                    }
                    arr.push(obj);
                })
                return arr;
            },
            /**
             * 解构 红包设置、奖品设置
             */
            //创建奖品参数
            deposePrize(arr) {
                // console.log(JSON.stringify(arr))
                let bagObj = {
                        default: {},
                        bagArr: []
                    };
                let prizeArr = [];

                arr.forEach(item=>{
                    //解析红包参数
                    if(item.prizeType === "red_packet") {
                        //默认红包
                        if(item.redPacketRule.isDefault===1) {
                            bagObj.default = {
                                prizeType: 'red_packet',
                                name: item.name,
                                maxAmount: this.$math.divide(item.redPacketRule.maxAmount ,100),
                                minAmount: this.$math.divide(item.redPacketRule.minAmount ,100),
                                _id: item.id
                            }
                            bagObj.description = item.description;
                            bagObj.microPic = item.microPic;
                        }else{
                            let obj = {
                                prizeType: 'red_packet',
                                _id: item.id,
                                winningAssignRules: {
                                    totalAmount: this.$math.divide(item.redPacketRule.totalAmount ,100),
                                    isAutoAssign: item.isAutoAssign+'',
                                    everyCycleProvideNum: item.everyCycleProvideNum
                                },
                                basic: {
                                    name: item.name,
                                    maxAmount: this.$math.divide(item.redPacketRule.maxAmount ,100),
                                    minAmount: this.$math.divide(item.redPacketRule.minAmount ,100),
                                    isDefault: item.redPacketRule.isDefault
                                },
                                orderWeightsAssignRules: this.deposeWeightParam(item.orderWeightsAssignRules),
                                collapse: true,
                                collapsePro: true
                            }

                            if(item.isAutoAssign=='1') {
                                obj.winningAssignRules.winningAssignRules = [{startNum: '', endNum: '', appearNum: ''}];
                            } else {
                                obj.winningAssignRules.winningAssignRules = item.winningAssignRules;
                            }

                            bagObj.bagArr.push(obj);
                        }
                    }else{
                        // 构建模板奖品参数
                        let obj = {
                            prizeType: item.prizeType,
                            _id: item.id,
                            name: item.name,
                            win: {
                                everyCycleProvideNum: item.everyCycleProvideNum,
                                average: item.isAutoAssign+'',
                                rowStart: item.rowStart,
                                rowEnd: item.rowEnd,
                                orderWeightsAssignRules: this.deposeWeightParam(item.orderWeightsAssignRules),
                                winningAssignRules: item.winningAssignRules,
                                microPic: item.microPic,
                                description: item.description
                            },
                            skuCode: item.skuCode,
                            collapse: true,
                            order: this.deposeWeightParam(item.orderWeightsAssignRules)
                        }
                        item.prizeType==='mall' || item.prizeType === 'j_mall' || item.prizeType==='aa_lottery' ? obj.id = item.assPrizeId: null;
                        item.prizeType ==='mall'? obj.skuValue = item.skuCode: null;

                        item.prizeType==='aa_lottery'? obj.type=item.type? item.type: 'super_lotto': null;
                        if(item.isAutoAssign == 0) {
                            obj.win.winningAssignRules = item.winningAssignRules;
                        }else{
                            obj.win.winningAssignRules =  [{ startNum: 1, endAmount: '', appearNum: ''}];
                        }

                        prizeArr.push(obj);
                    }
                })
                return [bagObj, prizeArr];

                //构建奖品参数配置
                if(this.prizeInfo) {
                    this.prizeInfo.forEach(item => {
                        let obj = {
                            prizeType: item.prizeType,
                            rowStart: item.win.rowStart,
                            rowEnd: item.win.rowEnd,
                            everyCycleProvideNum: item.win.everyCycleProvideNum,
                            isAutoAssign: item.win.average,
                            orderWeightsAssignRules: this.createWeightParam(item.order)
                        }
                        item._id? obj.id = item.id: null;
                        item.prizeType==='mall' || item.prizeType === 'j_mall'? obj.goodsId = item.id: null;
                        item.prizeType ==='mall'? obj.skuCode = item.skuCode: null;
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
            //解析权重配置
            deposeWeightParam(param) {
                let arr = [];
                if(param&&param.length>0) {
                    param.forEach(item=>{
                        arr.push({
                            startAmount: this.$math.divide(item.startAmount ,100),
                            endAmount: this.$math.divide(item.endAmount ,100),
                            proportion: this.$math.divide(item.proportion ,100)
                        })
                    })
                }else{
                    arr.push({
                        startAmount: "",
                        endAmount: "",
                        proportion: ""
                    })
                }
                return arr;
            },
            /**
             * 解构区县
             */
            deposeRegions(arr) {
                if(arr[0].cityCode === '000000' || arr[0].countyCode === '000000' || arr[0].provinceCode === '000000') {
                    return arr;
                }
                return arr.map(item => {
                    return { regions: [item.provinceCode, item.cityCode, item.countyCode]}
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .consume-luck-draw-center {
        .save-btn {
            text-align: right;
        }
        .tmp-list {
            display: flex;
        }
        .consume-luck-left {
            width: 210px;
            overflow: hidden;
            box-sizing: border-box;
            /deep/ .el-submenu__title {
                overflow: hidden;
                span{
                    width: 150px;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .add-item {
                padding-left: 20px;
                .item-button {
                    font-size: 14px;
                    color: #303133;
                }
            }
            .consume-luck-menu {
                // max-height: 1000px;
                // overflow-y: scroll;
            }
            
        }
        .draw-content {
            flex: 1;
            padding-left: 20px;
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
        }
    }
</style>
