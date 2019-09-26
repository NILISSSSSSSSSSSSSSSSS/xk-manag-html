const state = {
    platformTicket: null, // 推荐保证金
    welfareMall: null,    //平台夺奖派对明细
    selfMall: null,     //平台自营商城明细
    merchantMall: null,    //平台商圈对账明细
    gameChange: null,     //游戏币兑换记录
    giftPurchase: null    //礼物购买明细
};
const getters = {};
const action = {};

const mutations = {
    setPlatformTicket(state, payload) {
        state.platformTicket = payload
    },
    setWelfareMall(state, payload) {
        state.welfareMall = payload
    },
    setSelfMall(state, payload) {
        state.selfMall = payload
    },
    setMerchantMall(state, payload) {
        state.merchantMall = payload
    },
    setGameChange(state, payload) {
        state.gameChange = payload
    },
    setGiftPurchase(state, payload) {
        state.giftPurchase = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}