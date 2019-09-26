const state = {
    giftCommit: null
};
const getters = {};
const action = {};

const mutations = {
    setGiftCommit(state, data) {
        state.giftCommit = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}