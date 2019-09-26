const state = {
    tax: null, // 平台代缴个税明细
};
const getters = {};
const action = {};

const mutations = {
    setTax(state, payload) {
        state.tax = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}