const state = {
    recommendShop: null
};

const getters = {};
const action = {};

const mutations = {
    setRecommendShop(state, payload) {
        state.recommendShop = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
