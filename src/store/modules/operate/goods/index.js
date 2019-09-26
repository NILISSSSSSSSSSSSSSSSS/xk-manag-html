const state = {
    haveAuditGoodsCommit: null,
    notAuiitGoodsCommit: null
};

const getters = {};
const action = {};

const mutations = {
    setHaveAuditGoodsCommit(state, data) {
        state.haveAuditGoodsCommit = data;
    },
    setNotAuditGoodsCommit(state, data) {
        state.notAuditGoodsCommit = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
