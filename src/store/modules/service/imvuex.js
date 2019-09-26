export const ImState = {
    groupChat:null,
    imMsg:null,
    updateMsg:null,
    historyMsg:null,
    jumpRouter:false,
    canGetHistory:false,
    allTeams:null
}

export const ImMutations = {
    setInit(ImState, payload){
        ImState.groupChat = payload
    },
    setImMsg(ImState, payload){
        ImState.imMsg = payload
    },
    setUpdateMsg(ImState, payload){
        ImState.updateMsg = payload
    },
    setHistoryMsg(ImState, payload){
        ImState.historyMsg = payload
    },
    setJumpRouter(ImState){
        ImState.jumpRouter = !ImState.jumpRouter
    },
    setCanGetHistory(ImState,payload){
        ImState.canGetHistory = payload ;
    },
    setAllTeams(ImState,payload){
        ImState.allTeams = payload
    }
}