import SDK from  '@/assets/lib/NIM_Web_SDK_v5.5.0.js';
import {getSession} from '@/util/publicMehotds';
import {knowledgePointUrl} from '@/util/publicParams';
export default {
    initChat(){
        let xkaccount = getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {};
        this.groupChat = SDK.NIM.getInstance({
            appKey: 'abe7a770f36b0621d05426343363baa5',
            account: xkaccount.accid,
            token: xkaccount.token,
            onteams: this.onTeams,
            onteammembers: this.onTeamMembers,
            onconnect: this.onConnect,
            onwillreconnect: this.onWillReconnect,
            ondisconnect: this.onDisconnect,
            onerror: this.onError,
            onmsg: this.onMsg,
            onroamingmsgs: this.onRoamingMsgs,
            onofflinemsgs: this.onOfflineMsgs,
            onsessions: this.onSessions,
            onupdatesession: this.onUpdateSession,
        })
    },
    onTeams(teams){
        // console.log('收到群列表', teams);
        this.data.teams = this.groupChat.mergeTeams(this.data.teams, teams);
        this.onInvalidTeams(teams.invalid);
    },
    onInvalidTeams(teams) {
        this.data.teams = this.groupChat.cutTeams(this.data.teams, teams);
        this.data.invalidTeams = this.groupChat.mergeTeams(this.data.invalidTeams, teams);
    },
    onTeamMembers(obj) {
        // console.log('群id', teamId, '群成员', members);
        var teamId = obj.teamId;
        var members = obj.members;
        this.data.teamMembers = this.data.teamMembers || {};
        this.data.teamMembers[teamId] = this.groupChat.mergeTeamMembers(this.data.teamMembers[teamId], members);
        this.data.teamMembers[teamId] = this.groupChat.cutTeamMembers(this.data.teamMembers[teamId], members.invalid);
    },
    onConnect() {
        console.log('连接成功');
        this.xkGods.forEach(item => {
            this.getHistory(item.tid)
        });
    },
    onError(error) {
        console.log(error);
    },
    onWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        // console.log(obj.retryCount);
        // console.log(obj.duration);
    },
    onDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        // console.log('丢失连接');
            // console.log(error);
        if (error) {
            switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
                break;
            // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
            case 417:
                break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
                break;
            default:
                break;
            }
        }
    },
    onMsg(msg) {
        // console.log('收到消息', msg.scene, msg.type, msg);
        this.pushMsg(msg);
        switch (msg.type) {
        case 'custom':
            this.onCustomMsg(msg);
            break;
        // 其它case
        default:
            break;
        }
    },
    pushMsg(msgs) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].scene + '-' + msgs[0].account;
        this.data.msgs = this.data.msgs || {};
        this.data.msgs[sessionId] = this.groupChat.mergeMsgs(this.data.msgs[sessionId], msgs);
    },
    fnsend(content=this.textarea,sec){
        console.log(sec);
        
        let xkUser = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
        let msg = null ;
        if(sec){//给网易云信知识点消息
            msg = this.groupChat.sendCustomMsg({
                scene: 'team',
                to: this.inserviceGod.tid,
                content: JSON.stringify({
                    data:{
                        msgContent:content,
                        // url:`${this.$knowledgePointUrl}${sec}`
                        url:`${knowledgePointUrl}knowledge?id=${sec}`
                    },
                    type:14,
                    "group":1
                }),
                done: this.sendMsgDone
            });
            // 组装本地知识点消息
            this.msgs.push({
                avatar:xkUser.avatar,
                nickname:xkUser.nickName,
                content:{
                  data:{
                      msgContent:content,
                    //   url:`${this.$knowledgePointUrl}${sec}`
                      url:`${knowledgePointUrl}knowledge?id=${sec}`
                  },
                  type:14,
                  "group":1
                },
                time:new Date().getTime(),
                self:true
            })
        }else{
            // 给网易云信发普通消息
            msg = this.groupChat.sendCustomMsg({
                scene: 'team',
                to: this.inserviceGod.tid,
                content: JSON.stringify({
                    data:{
                        msgContent:content
                    },
                    type:1,
                    "group":1
                }),
                done: this.sendMsgDone
            });
            // 组装本地普通消息
            this.msgs.push({
                avatar:xkUser.avatar,
                nickname:xkUser.nickName,
                content:{
                  data:{
                      msgContent:content
                  },
                  type:1,
                  "group":1
                },
                time:new Date().getTime(),
                self:true
            })
        }
        this.pushMsg(msg);
        
        this.textarea = '';
    },
    sendMsgDone(error, msg) {
        // console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
        this.pushMsg(msg);
        this.textarea = '';
    },
    onRoamingMsgs(obj) {
        // console.log('收到漫游消息', obj);
        this.pushMsg(obj.msgs);
    },
    onOfflineMsgs(obj) {
        // console.log('收到离线消息', obj);
        this.pushMsg(obj.msgs);
    },
    onSessions(sessions) {
        // console.log('收到会话列表', sessions);
        this.data.sessions = this.groupChat.mergeSessions(this.data.sessions, sessions);
    },
    getHistory(tid='1412869820'){
        this.groupChat.getHistoryMsgs({
            scene: 'team',
            to: tid,
            done: this.getHistoryMsgsDone
        });
    },
    onCustomMsg(msg) {
        console.log('处理自定义消息',msg);
        let pushmsg = {
            avatar:this.inserviceGod.avatar,
            nickname:this.inserviceGod.nickname,
            content:JSON.parse(msg.content),
            userId:msg.from,
            time:msg.time,
            self:false
        }

        this.msgs.push(pushmsg);
        
        // 处理自定义消息
    },
    onUpdateSession(session) {
        console.log('会话更新了', session);
        this.data.sessions = this.groupChat.mergeSessions(this.data.sessions, session);
        let customContent = {
            data:{}
        };
        try {
            customContent = JSON.parse(session.lastMsg.content)
        } catch (error) {
            
        }
        this.xkGods.forEach((item,index) => {
            if(item.tid===session.lastMsg.to){
                Vue.set(this.xkGods[index],'time',session.lastMsg.time)
                if(customContent.type === 0 || customContent.type === 1){
                    Vue.set(this.xkGods[index],'content',customContent.data.msgContent)
                }else if(customContent.type === 2){
                    Vue.set(this.xkGods[index],'content',"[图片消息]")
                }else if(customContent.type === 3){
                    Vue.set(this.xkGods[index],'content',"[语音消息]")
                }else if(customContent.type === 14){
                    Vue.set(this.xkGods[index],'content',`<a href='#'>${customContent.data.msgContent}</a>`)
                }else{
                    Vue.set(this.xkGods[index],'content',"[订单消息]")
                }
            }
        });
        let xkaccount = getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {};
        let tipcontent = '';
        switch (customContent.type) {
            case 0:
            case 1:
                tipcontent = customContent.data.msgContent;
                break;
            case 2:
                tipcontent = '[图片消息]'
                break;
            case 3:
                tipcontent = '[语音消息]'
                break;
            case 14:
                tipcontent = `<a href='#'>${customContent.data.msgContent}</a>`
                break;
            case 13:
                tipcontent = `[订单消息]`
                break;
        
            default:
                break;
        }
        
        if(session.lastMsg.from !== xkaccount.accid){
            if(session.lastMsg.type !== "notification"){
                this.getnewservice = !this.getnewservice;
                this.tipnickname = this.inserviceGod.nickname;
                this.tipcontent = tipcontent;
                this.tipavatar = this.inserviceGod.avatar;
                this.tiptid = this.inserviceGod.tid;
            }
        }
    },
    getHistoryMsgsDone(error, obj) {
        let xkaccount = getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {};
        let xkUser = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
        // console.log('获取team历史消息' + (!error?'成功':'失败'));
        // console.log(error);
        console.log(obj);
        if (!error) {
            // console.log(obj.msgs);
            try {
                if(!obj.msgs.length){
                    this.timer[obj.msgs.to] = setInterval(()=>{
                        this.getHistory(obj.msgs.to);
                        console.log(obj.msgs.to);
                    },1000)
                }
                clearInterval(this.timer[obj.msgs.to]);
                this.xkGods.forEach((item,index) => {
                    if(item.tid===obj.msgs[0].to){
                        let thismsg = JSON.parse(obj.msgs[0].content);
                        Vue.set(this.xkGods[index],'time',obj.msgs[0].time)
                        if(thismsg.type === 0 || thismsg.type === 1){
                            Vue.set(this.xkGods[index],'content',thismsg.data.msgContent)
                        }else if(thismsg.type === 2){
                            Vue.set(this.xkGods[index],'content',"[图片消息]")
                        }else if(thismsg.type === 14){
                            Vue.set(this.xkGods[index],'content',`<a href='#'>${thismsg.data.msgContent}</a>`)
                        }else{
                            Vue.set(this.xkGods[index],'content',"[订单消息]")
                        }
                        
                    }
                });
                if(obj.to===this.inserviceGod.tid){
                    this.msgs = [];
                    obj.msgs.reverse()
                    obj.msgs.forEach((item,index) => {
                        let pushmsg = {
                            avatar:xkaccount.accid===item.from?xkUser.avatar:this.inserviceGod.avatar,
                            nickname:xkaccount.accid===item.from?xkUser.nickName:this.inserviceGod.nickname,
                            content:{},
                            userId:item.from,
                            time:item.time,
                            self:xkaccount.accid===item.from?true:false
                        }
                        
                        if(item.type==='custom'){
                            let customContent = {
                                data:{}
                            }
                            try {
                                 customContent = JSON.parse(item.content);
                            } catch (error) {
                                
                            }
                            pushmsg.content = customContent ;
                            this.msgs.push(pushmsg);
                        }
                        
                    });
                    console.log(this.msgs);
                    
                }
            } catch (error) {
                
            }
        }
    }
}