const state = {
    dispatch: null, // 平台代缴个税明细
};
const getters = {};
const action = {};

const mutations = {
    setDispatch(state, payload) {
        state.dispatch = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}