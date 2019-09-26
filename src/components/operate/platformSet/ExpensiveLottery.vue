<template>
    <div class="expensive-lottery">
        <div class="draw-content">
            <div class="save-btn">
                <slot/>
                <el-button v-permission="'consumeLuckDrawCenterAdd'" :loading="loadingBtn" :size="$size" type="primary" @click="saveActivity()">保存</el-button>
            </div>
        </div>
        <el-tabs v-model="tabSelect">
            <el-tab-pane :label="activeType==2? '用户推广抽奖设置':'联盟商推广抽奖设置'" name="one">
                <el-tabs :stretch="true" v-model="selectIndex" @tab-click="selecteTab">
                    <el-tab-pane v-for="(item, index) in spreadList" :key="index" :label="item.name" :name="item.id!='xkkj'&&item.id?item.id:'xkkj'"></el-tab-pane>
                    <el-tab-pane v-permission="'consumeLuckDrawCenterAdd'" label="添加抽奖模组" name="add"></el-tab-pane>
                </el-tabs>
                <expensive-spread ref="first" :activeType="activeType" :activeId="activeId"></expensive-spread>
            </el-tab-pane>
            <el-tab-pane :label="activeType==2? '用户消费抽奖设置':'联盟商消费抽奖设置'" name="two">
                <expensive-consume ref="second" :show="tabSelect==='two'"></expensive-consume>
            </el-tab-pane>
            <!-- <el-tab-pane label="补贴/活动设置" name="three">
                <expensive-draw></expensive-draw>
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
    import { mapState,mapMutations } from 'vuex';
    import moment from 'moment';

    import ExpensiveSpread from './ExpensiveSpread.vue';
    import ExpensiveConsume from './ExpensiveConsume.vue';
    import ExpensiveDraw from './ExpensiveDraw.vue';

    export default {
        props: {
            activeType: {
                type: [Number, String],
                default: 2
            }
        },
        components: {
            ExpensiveSpread,
            ExpensiveConsume,
            ExpensiveDraw
        },
        data() {
            return {
                tabSelect: 'one',
                loadingBtn: false,

                //优化=
                activeId: ''
            }
        },
        computed: {
            ...mapState({
                templateId: state => state.operatePlatform.tmpId,
                spreadList: state => state.operatePlatform.spreadList,
                currListIndex: state => state.operatePlatform.currListIndex
            }),
            //优化
            selectIndex() {
                return this.spreadList[0]? this.spreadList[0].id: 'xkkj'
            }
        },
        methods: {
            ...mapMutations(
                {
                    setSpreadList: "operatePlatform/setSpreadList",
                    setExpenseId: "operatePlatform/setExpenseId",
                    setSpreadId: "operatePlatform/setSpreadId"
                }
            ),
            //更新列表
            updateList(){
                this.$http.get(this.$api.activityPlatformList, {templateId: this.templateId, suitableUsers: this.activeType==2? 'COMMON_USER': 'MERCHANT'}, true).then(res=>{
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
            saveActivity() {
                if(this.tabSelect==='three' || !this.templateId) {
                    this.$message.error('保存失败!')
                    return false;
                }
                //保存消费抽奖设置
                if(this.tabSelect==='two') {
                    let second = this.$refs['second'].save();
                    Promise.all([second]).then(res=>{
                        let id = res[0].id;
                        if(!this.isSelectRedPacket(res[0])) {
                            this.$message.error('请至少配置一个红包！！')
                            return false;
                        }
                        let params = this.createParams(res[0]);
                        if(!params) {
                            this.$message.error('请完善奖品连中设置！！')
                            return false;
                        }
                        this.submitNetData(params, id)
                    })
                    .catch(err=>{
                        this.$message.error(err&err.err? err.err: '验证失败！');
                    })
                }
                //保存推广抽奖
                if(this.tabSelect === 'one') {
                    let first = this.$refs['first'].save();
                    Promise.all([first]).then(res=>{
                        console.log(JSON.stringify(res))
                        if(!this.isSelectRedPacket(res[0])) {
                            this.$message.error('请至少配置一个红包！！')
                            return false;
                        }
                        let params = this.createParams(res[0]);
                        if(!params || params.err) {
                            this.$message.error(`${params.err? params.err: '请完善奖品连中设置！！'}`);
                            return false;
                        }
                        this.submitNetData(params, res[0].id)
                    })
                    .catch(err=>{
                        this.$message.error(err&err.err? err.err: '验证失败！');
                    })
                }
                return false;
            },
            /**
             * @param id  判断是否是更新
             */
            submitNetData(param, id) {
                let url = id? this.$api.activityPlatformUpdate: this.$api.activityPlatformCreate;
                id? param.platformActivity.id = id: null;
                this.loadingBtn = true;
                this.$http.post(url, param, true).then(res=>{
                    this.$message.success('保存成功');
                    this.loadingBtn = false;
                    this.updateList();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.loadingBtn = false;
                })
            },
            createParams(prams) {

                /**
                 * 判断连抽是否配置正确
                 */
                if(prams.consNumberScope&&prams.consNumberScope.max==1) {
                    let isConsecutive = prams.positions.filter(item=>{
                        return item.positionType==='consecutive'
                    });
                    if(isConsecutive.length) {
                        return {
                            err: '连抽笔数为1时转盘不能配置连抽'
                        };
                    }
                }
                /**
                 * 判断配置的奖品数量是否和转盘上的奖品数量一致
                 */
                if(prams.prizeQuantity!=prams.positions.length) {
                    return {
                        err: '奖品转盘配置不正确！'
                    };;
                }
                
                /**
                 * @param 说明：如果type为消费抽奖， 推广行为为不必传
                 */
                let consecutiveRules = this.handleConsecutiveRules(prams.consecutiveRules);
                if(!consecutiveRules) {
                    return false;
                }
                let obj = {
                    platformActivity: {
                        suitableUsers: this.activeType==2? 'COMMON_USER': 'MERCHANT',
                        consecutiveRules: consecutiveRules,
                        prizeQuantity: prams.prizeQuantity,   //奖品数量
                        uiType: prams.uiType,    //转盘类型
                        receiveLimit: 1,      //临时添加
                        // receiveLimit: prams.receiveLimit,
                        consNumberScope: {
                            min: prams.consNumberScope.min,
                            max: prams.consNumberScope.max
                        },    //连中笔数设置
                        positions: this.computedPosition(prams.positions, prams.prizeQuantity),      //转盘配置
                        templateId: this.templateId,    //模板ID
                        type: this.tabSelect==='one'? 'promotion': this.tabSelect==='two'? 'expense': ''    //活动类型
                    }
                }

                if(this.tabSelect==='one') {
                    //判断推广行为是否填写完成
                    let notComplete = false;
                    prams.selectedCondition.forEach(item=>{
                        if(!item.validTime) {
                            notComplete = true;
                            return false;
                        }
                    })
                    if(notComplete) {
                        this.$notify.error({
                            title: '错误',
                            message: `推广行为未填写完整`
                        });
                        return false;
                    }
                    if(notComplete || prams.selectedCondition.length==0) {
                        this.$notify.error({
                            title: '错误',
                            message: `请至少选择一个推广行为！`
                        });
                        return false;
                    }
                    obj.platformActivity.promotionRule= this.createPromotionRule(prams.selectedCondition, prams.promotionRule.isAllFinish, prams.promotionRule.finishQuantity);
                    obj.platformActivity.name= prams.name;   //活动名称
                    obj.reachRules= this.handlePromotion(prams.selectedCondition);
                }else{
                    obj.platformActivity.redoubles = prams.redoubles.map(item=>{
                        let _obj = {
                            startAmount: this.$math.multip(item.startAmount, 100),
                            endAmount: this.$math.multip(item.endAmount, 100),
                            multiple: item.multiple
                        }
                        item.redoubleId? _obj.redoubleId=item.redoubleId: null;
                        return _obj;
                    })
                }
                return obj;
            },
            //处理奖品位置
            computedPosition(pos, num) {
                return pos.map((item, index)=>{
                    return {
                        position: index+1,
                        prizeIds: item.prizeIds,
                        positionType: item.positionType
                    }
                })
            },
            handleConsecutiveRules(params) {
                let rules = [];
                for(let item in params) {
                    if(!this.createRules(params[item].ids)) {
                        return false;
                    }
                    let obj = {
                        consecutivePrizes: this.createRules(params[item].ids),
                        consNumber: Number(item)+1,
                        winRatio: this.$math.multip(params[item].winRatio, 100)
                    }
                    rules.push(obj);
                }

                return rules;
            },
            createRules(param) {
                let result = [],
                    isComplete = true;
                param.forEach((item, index)=>{
                    if(item.length<1) {
                        isComplete = false;
                        return false;
                    }
                    let obj = {
                        prizeIds: item,
                        consNumberTh: index+1
                    }
                    result.push(obj);
                })
                return isComplete? result: false;
            },
            //处理推广行为
            createPromotionRule(param, isAllFinish, finishQuantity) {
                let arr = {
                    isAllFinish: isAllFinish,
                    promotionActions: []
                };
                isAllFinish==0 ? arr.finishQuantity= finishQuantity: null;
                console.log(param)
                param.forEach(item=>{
                    let obj = {
                        weightAmount: item.weightAmount * 100,
                        multiple: item.multiple,
                        validTime: {
                            start: moment(item.validTime[0]).format('X') - new Date(new Date().setHours(0, 0, 0, 0)) / 1000,
                            end:  moment(item.validTime[1]).format('X') - new Date(new Date().setHours(0, 0, 0, 0)) / 1000
                        },
                        type: item.type
                    }
                    item.isMustReach==1? obj.isMustReach=1: null;
                    arr.promotionActions.push(obj);
                })
                return arr;
            },
            //处理推广行为操作次数
            handlePromotion(params) {
                let obj = {};
                params.forEach(item=>{
                    if(item.type==='order_amount_reach') {
                        obj[item.type] = {
                            amount: this.$math.multip(item.amount, 100)   //这里还是金钱
                        }
                    }else if(item.type==='video_reach') {
                        obj[item.type] = {
                            likedCount: item.likedCount,
                            commentCount: item.commentCount,
                            forwardCount: item.forwardCount
                        }
                    }else{
                        obj[item.type] = {
                            doTimes: 1
                        }
                    }

                })
                return obj;
            },
            //判断是否选择了红包对象
            isSelectRedPacket(params) {
                let arr = params.positions.filter(item=>{
                    return item.prizeIds&&item.prizeIds.length>1;
                })
                return arr.length>0;
            },

            //改版
            selecteTab(node) {
                if(node.name=='add') {
                    this.$prompt('请输入推广抽奖模板名称', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValidator: (value)=>{
                            if(!value) {
                                return '不能为空'
                            }
                        }
                    }).then(({value}) => {
                        this.spreadList.push({name:value, id:"xkkj"})
                        this.selectIndex = "xkkj";
                        this.activeId = "";
                    }).catch(()=>{
                        this.selectIndex = this.spreadList[0].id&&this.spreadList[0].id!='xkkj'?this.spreadList[0].id: "xkkj"
                    })
                }else{
                    console.log(node.name)
                    this.activeId = node.name=="xkkj"? "": node.name;
                    this.selectIndex = node.name
                }
            },
        },
        watch: {
            currListIndex(val) {
                this.tabSelect = 'one';
            },
            activeType(val, oldVal) {
                if(val!=oldVal) {
                    this.tabSelect = 'one';
                }
            },
            spreadList: {
                handler(val) {
                    val.length == 0
                        ? this.spreadList.push({name:"抽奖模组一", id:"xkkj"})
                        : this.selectIndex="xkkj";
                }
            },
            selectIndex(val) {
                this.activeId = val=='xkkj'? "": val;
                console.log('selectIndex：', val)
            }
        }
    }
</script>

<style scoped lang="scss">
    .expensive-lottery{
        .save-btn {
            text-align: right;
        }
        .draw-content {
            flex: 1;
            padding-left: 20px;
        }
    }
</style>
