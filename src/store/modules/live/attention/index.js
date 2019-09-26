const state = {
    reUserCommit: null // 推荐用户列表
};
const getters = {};
const action = {};

const mutations = {
    setReUserCommit(state, data) {
        state.reUserCommit = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}