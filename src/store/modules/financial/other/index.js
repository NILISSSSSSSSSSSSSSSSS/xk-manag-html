const state = {
    promiseCoin: null, // 推荐保证金
    redPacket: null, // 红包明细
    draw: null,   //平台抽奖明细
    fine: null,    //平台罚款明细
    pool: null,   //平台奖池资金明细
};
const getters = {};
const action = {};

const mutations = {
    setPromiseCoin(state, payload) {
        state.promiseCoin = payload
    },
    setRedPacket(state, payload) {
        state.redPacket = payload
    },
    setDraw(state, payload) {
        state.draw = payload
    },
    setFine(state, payload) {
        state.fine = payload
    },
    setPool(state, payload) {
        state.pool = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}