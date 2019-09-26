const state = {
    permission: null
};

const getters = {
    getPermissionRouter: (state) => {
        return state.permission
    }
};
const action = {};

const mutations = {
    setPermission(state, payload) {
        state.permission = payload.permission
    }
};


export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}
