import {getSession,saveSession} from '@/util/publicMehotds';
const state = {
    userPersonalInfo: null
};
const mutations = {
    setUserPersonalInfo(state, payload) {
        let user = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {} ;
        user.avatar = payload.avatar ;
        user.nickName = payload.nickName ;
        saveSession("xk-user", JSON.stringify(user));
        state.userPersonalInfo = payload
    }
};
export default {
    namespaced: true,
    state,
    mutations
}