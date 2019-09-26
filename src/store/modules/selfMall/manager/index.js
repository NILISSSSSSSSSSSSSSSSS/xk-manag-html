const state = {
    searchCondition: null,
    searchConditionSale: null,
    searchConditionClose: null
};

const getters = {};
const action = {};

const mutations = {
    setSearchCondition(state, payload) {
        state.searchCondition = payload
    },
    setSearchConditionSale(state, payload) {
        state.searchConditionSale = payload
    },
    setSearchConditionClose(state, payload) {
        state.searchConditionClose = payload
    }
};


export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
