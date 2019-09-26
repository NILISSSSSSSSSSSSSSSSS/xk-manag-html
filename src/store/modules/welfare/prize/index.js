const state = {
    searchThirdCondition: null,
    searchSelfPrizeCondition: null,
};
const mutations = {
    setSearchThirdCondition(state, payload) {
        console.log(payload)
        state.searchThirdCondition = payload;
    },
    setSelfPrizeCondition(state, payload) {
        state.searchSelfPrizeCondition = payload;
    }
};

export default {
    namespaced: true,
    state,
    mutations
}
