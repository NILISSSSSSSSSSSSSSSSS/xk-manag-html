const state = {
    vipAccount: null, // 会员列表
    merchantAccount: null, // 联盟商账户列表
};
const getters = {};
const action = {};

const mutations = {
    setVipAccount(state, payload) {
        state.vipAccount = payload
    },
    setMerchantAccount(state, payload) {
        state.merchantAccount = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}