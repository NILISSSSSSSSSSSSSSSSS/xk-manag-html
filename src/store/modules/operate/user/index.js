const state = {
    merchantCommit: null, // 商户列表
    membersCommit: null,  // 会员列表
    realAuthCommit: null, // 实名认证
    merchantAuditCommit: null, // 商户审核
    shopCommit: null, // 店铺列表
    shopAuditCommit: null, // 店铺审核
    userGroupCommit: null, //用户组列表
    userCommit: null // 用户组会员列表
};
const getters = {}
const action = {}


const mutations = {
    setMerchantCommit(state, data) {
        state.merchantCommit = data;
    },
    setMembersCommit(state, data) {
        state.membersCommit = data;
    },
    setRealAuthCommit(state, data) {
        state.realAuthCommit = data;
    },
    setMerchantAuditCommit(state, data) {
        state.merchantAuditCommit = data;
    },
    setShopCommit(state, data) {
        state.shopCommit = data;
    },
    setShopAuditCommit(state, data) {
        state.shopAuditCommit = data;
    },
    setUserGroupCommit(state, data) {
        state.userGroupCommit = data
    },
    setUserCommit(state, data) {
        state.userCommit = data;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}