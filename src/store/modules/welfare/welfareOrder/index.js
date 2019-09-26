const state = {
    searchPrizeOrderCondition: null,
    searchPrizeSeqCondition: null,
    searchFLList: null,
    searchFLSaleList: null,
    searchRandomList: null
};
const mutations = {
    setPrizeOrderCondition(state, payload) {
        state.searchPrizeOrderCondition = payload;
    },
    setPrizeSeqCondition(state, payload) {
        state.searchPrizeSeqCondition = payload;
    },
    setFLList(state, payload) {
        state.searchFLList = payload;
    },
    setFLSaleList(state, payload) {
        state.searchFLSaleList = payload;
    },
    setRandomList(state, payload) {
        state.searchRandomList = payload;
    }
};

export default {
    namespaced: true,
    state,
    mutations
}
