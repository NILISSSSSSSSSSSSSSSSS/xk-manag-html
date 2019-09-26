const state = {
    countCommit: 0, // 实名认证未审核数
    redTree:{
        selfmall: {
            user: {}
        },
        welfare:{},
        operate: {},
        financial: {},
        customer: {},
        live: {}
    }
}
const mutations = {
    setCountCommit(state, data) {
        state.countCommit = data
    },
    addCountCommit(state, data) {
        state.countCommit ++;
    },
    reduceCountCommit(state, data) {
        if(state.countCommit > 0) {
            state.countCommit --;
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
