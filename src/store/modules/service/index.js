import {ImState,ImMutations} from './imvuex'
const state = {
    taskCenter: null,
    myDoneWorkOrder:null,
    knowledgeBase:null,
    loginLog:null,
    workList:null,
    ...ImState,
    teamName:"",
    isMeCreate:null,
    groupTid:null
};
const mutations = {
    setTaskCenter(state, payload) {
        console.log(payload);
        state.taskCenter = payload
    },
    setmyDoneWorkOrder(state, payload) {
        console.log(payload);
        
        state.myDoneWorkOrder = payload
    },
    setknowledgeBase(state, payload) {
        console.log(payload);
        
        state.knowledgeBase = payload
    },
    setloginLog(state, payload) {
        console.log(payload);
        
        state.loginLog = payload
    },
    setworkList(state, payload) {
        console.log(payload);
        
        state.workList = payload
    },
    ...ImMutations,
    setTeamName(state, payload){
        state.teamName = payload
    },
    setIsMeCreate(state, payload){
        state.isMeCreate = payload
    },
    setGroupTid(state, payload){
        state.groupTid = payload
    }
};
export default {
    namespaced: true,
    state,
    mutations
}