const state = {
    normalFamilyCommit: null, // 普通家族列表
    diamondFamilyCommit: null,// 钻石家族列表
    hostCommit: null, // 主播列表
    interventionCommit: null, // 平台介入主播列表
    interventionFamilyCommit: null, // 平台介入家族列表
};
const getters = {};
const action = {};

const mutations = {
    setNormalFamilyCommit(state, data) {
        state.normalFamilyCommit = data;
    },
    setDiamondFamilyCommit(state, data) {
        state.diamondFamilyCommit = data
    },
    setHostCommit(state, data) {
        state.hostCommit = data;
    },
    setInterventionCommit(state, data) {
        state.interventionCommit = data
    },
    setInterventionFamilyCommit(state, data) {
        state.interventionFamilyCommit = data
    },
}

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}