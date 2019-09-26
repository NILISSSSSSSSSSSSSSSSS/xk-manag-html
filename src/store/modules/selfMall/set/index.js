const state = {
    searchCondition: null
};

const getters = {};
const action = {};

const mutations = {
    setSearchCondition(state, payload) {
        state.searchCondition = payload
    }
};


export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
