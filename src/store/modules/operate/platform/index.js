const state = {
    personCommit: null,
    goodsCommit: null,
    /**
    * @params
    */
    currListIndex: 0,  //存放第几个模板的索引
    totalMoney: 1000,   //奖池总笔数
    tmpName: '',     // 模板名称
    tmpId: '',   //模板ID
    //保存模板列表
    tempList: [{name: '全国默认模板', subTitle: { firstName: '运营基础设置', secondName: '用户抽奖转盘设置', thirdName: '联盟商抽奖转盘设置'}}],
    bagForm: {
        default: {
            prizeType: 'red_packet'
        },
        bagArr: []
    },
    basicForm: {},
    bagWeight: [],   //红包权重
    prizeWeight: [],    //奖品权重
    blackForm: {
        blackListRules: [{
            ruleCommandTime: "",
            ruleCommandOrderNum: "",
            ruleCommandAverageAmount: "",
            average: '0'   //0不平均分配
        }]
    },
    orderWeight: [{
        name: '', weight: [{ startAmount: '1', endAmount: '', proportion: ''}]
    }],
    /**
     * 基础抽奖设置
     */
    basicLotterySet: {regions:[{regions: ''}]},
    prizeForm:[],


    //转盘奖品列表
    lotteryPrizeList: [],
    //推广抽奖设置，列表选择
    spreadList: [],
    //运营专用奖品ID
    expenseId: "",
    //推广活动抽奖ID
    spreadId: "",
    versionCommit: null, //版本管理
    lotteryType: 2      //转盘类型
};

const getters = {};
const action = {};

const mutations = {
    //初始化数据结构
    initData(state) {
        state.basicLotterySet = {regions:[{regions: ''}]};
        state.prizeForm = [];
        state.orderWeight = [];
        state.blackForm = {
            blackListRules: [{
                ruleCommandTime: "",
                ruleCommandOrderNum: "",
                ruleCommandAverageAmount: "",
                average: '0'   //0不平均分配
            }]
        };
        state.prizeWeight = [];
        state.bagForm = {
            default: {
                prizeType: 'red_packet'
            },
            bagArr: []
        }

        //初始化转盘设置
        state.spreadList = [];
        state.expenseId = "";
        state.spreadId = "";
    },
    setTmpList(state, payload) {
        state.tempList = payload;
    },
    setCurrListIndex(state, payload) {
        state.currListIndex = payload;
    },
    setTmpName(state, payload) {
        state.tmpName = payload;
    },
    setTmpId(state, payload) {
        state.tmpId = payload;
    },
    setTotalMoney(state, payload) {
        state.totalMoney = Number(payload);
    },
    setBagWeight(state, payload) {
        state.bagWeight = payload;
    },
    setPrizeWeight(state, payload) {
        state.prizeWeight = payload;
    },
    /**
     * 设置基础抽奖设置
     * @param {*} state  
     * @param {*} payload 
     */
    setBasicForm(state, payload) {
        state.basicForm = payload;
    },
    /**
     * 红包红包
     * @param {*} state 
     * @param {*} payload 
     */
    setBagForm(state, payload) {
        state.bagForm = payload;
    },
    /**
     * 设置黑名单设置
     */
    setBlackForm(state, payload) {
        state.blackForm = payload;
    },
    /**
     * 设置订单金额权限
     */
    setOrderWeight(state, payload) {
        state.orderWeight = payload;
    },
    /**
     * 网络数据存放地址
     */
    setBasicLotterySet(state, payload) {
        state.basicLotterySet = payload;
    },
    setPrizeForm(state, payload) {
        state.prizeForm = payload;
    },
    /**
     * 设置转盘奖品
     */
    setLotteryPrizeList(state, payload) {
        state.lotteryPrizeList = payload;
    },
    /**
     * 创建推广抽奖设置列表
     */
    setSpreadList(state, payload) {
        state.spreadList = payload;
    },
    /**
     * 设置运营专用奖品
     */
    setExpenseId(state, payload) {
        state.expenseId = payload;
    },
    /***
     * 设置推广活动抽奖ID
     */
    setSpreadId(state, payload) {
        state.spreadId = payload;
    },
    /**
     * 转盘类型
     */
    setLotteryType(state, payload) {
        state.lotteryType = payload;
    },
    /**
     * 版本管理
     */
    setVersionCommit(state, data) {
        state.versionCommit = data
    }
};

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
