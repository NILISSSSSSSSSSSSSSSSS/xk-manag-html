const state = {
    xkb: null, // 平台晓可币明细
    swq: null, // 平台实物券明细
    xfq: null,   //平台消费券明细
};
const getters = {};
const action = {};

const mutations = {
    setXbk(state, payload) {
        state.xkb = payload
    },
    setSwq(state, payload) {
        state.swq = payload
    },
    setXfq(state, payload) {
        state.xfq = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}