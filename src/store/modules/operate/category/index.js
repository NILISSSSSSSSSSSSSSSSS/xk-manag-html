const state = {
    openCode: 0,
    storeOpenCode:0
};

const getters = {};
const action = {};

const mutations = {
    setOpenCode(state, data) {
        console.log(data)
        state.openCode = data;
    },
    setStoreOpenCode(state, data) {
        console.log(data)
        state.storeOpenCode = data;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
