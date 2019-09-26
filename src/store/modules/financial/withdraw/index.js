const state = {
    withdrawExamine: null, // 提现审核
    withdrawRecord: null, // 提现记录
    withdrawTaxExamine: null, //退税审核
};
const getters = {};
const action = {};

const mutations = {
    setWithdrawExamine(state, payload) {
        state.withdrawExamine = payload
    },
    setWithdrawRecord(state, payload) {
        state.withdrawRecord = payload
    },
    setWithdrawTaxExamine(state, payload) {
        state.withdrawTaxExamine = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}