const state = {
    searchCommodityCondition: null,
    searchLowerCondition: null,
    evaluate: null,
    mallEvaluate: null,
    mallSales: null,
    shEvaluate: null,
    shSales: null
};
const mutations = {
    setSearchCommodityCondition(state, payload) {
        state.searchCommodityCondition = payload;
    },
    setSearchLowerCondition(state, payload) {
        state.searchLowerCondition = payload;
    },
    setEvaluate(state, payload) {
        state.evaluate = payload;
    },
    //自营虚拟评价
    setSearchMallEvaluate(state, payload) {
        state.mallEvaluate = payload
    },
    //自营虚拟销量
    setSearchMallSales(state, payload) {
        state.mallSales = payload;
    },
    //口碑虚拟评价
    setShEvaluate(state, payload) {
        state.shEvaluate = payload;
    },
    //口碑虚拟销量
    setShSales(state, payload) {
        state.shSales = payload;
    }
};

export default {
    namespaced: true,
    state,
    mutations
}
