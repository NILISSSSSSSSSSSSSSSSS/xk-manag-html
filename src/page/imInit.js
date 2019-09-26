import SDK from "@/assets/lib/NIM_Web_SDK_v5.8.0.js";

import { getSession } from "@/util/publicMehotds";
import { mapMutations } from "vuex";
let data = {};
export default {
    ...mapMutations({
        setInit: "service/setInit",
        setImMsg: "service/setImMsg",
        setUpdateMsg: "service/setUpdateMsg",
        setHistoryMsg: "service/setHistoryMsg",
        setCanGetHistory: "service/setCanGetHistory",
        setAllTeams: "service/setAllTeams",
        addCountCommit: "redTree/addCountCommit"
    }),
    initChat() {
        let xkaccount = getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {};
        // 初始化代码
        let CHATINIT = SDK.NIM.getInstance({
            appKey: "abe7a770f36b0621d05426343363baa5",
            account: xkaccount.accid,
            token: xkaccount.token,
            onteams: this.onTeams, //收到群列表
            onteammembers: this.onTeamMembers, //群成员
            onconnect: this.onConnect, //连接成功
            onwillreconnect: this.onWillReconnect, //此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
            ondisconnect: this.onDisconnect, // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
            onerror: this.onError, //链接失败
            onmsg: this.onMsg, //收到即时消息
            onroamingmsgs: this.onRoamingMsgs, //收到漫游消息
            onofflinemsgs: this.onOfflineMsgs, //收到离线消息
            onsessions: this.onSessions, //收到会话列表
            onupdatesession: this.onUpdateSession //会话更新了
        });
        // 初始化赋值
        this.setInit(CHATINIT);
    },
    onTeams(teams) {
        // console.log('收到群列表', teams);
        this.setAllTeams(teams);
        data.teams = this.groupChat.mergeTeams(data.teams, teams);
        this.onInvalidTeams(teams.invalid);
    },
    onInvalidTeams(teams) {
        data.teams = this.groupChat.cutTeams(data.teams, teams);
        data.invalidTeams = this.groupChat.mergeTeams(data.invalidTeams, teams);
    },
    onTeamMembers(obj) {
        // console.log('群id', teamId, '群成员', members);
        var teamId = obj.teamId;
        var members = obj.members;
        data.teamMembers = data.teamMembers || {};
        data.teamMembers[teamId] = this.groupChat.mergeTeamMembers(data.teamMembers[teamId], members);
        data.teamMembers[teamId] = this.groupChat.cutTeamMembers(data.teamMembers[teamId], members.invalid);
    },
    onConnect() {
        console.log("连接成功");
        this.setCanGetHistory(true);
    },
    onError(error) {
        console.log(error);
    },
    onWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log("即将重连");
        // console.log(obj.retryCount);
        // console.log(obj.duration);
        this.groupChat.disconnect({
            done: () => {
                this.groupChat.connect();
            }
        });
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
                case "kicked":
                    break;
                default:
                    break;
            }
        }
    },
    onMsg(msg) {
        // console.log('收到消息');
        console.log("收到消息", msg.scene, msg.type, msg);
        this.pushMsg(msg);
        switch (msg.type) {
            case "custom":
                this.onCustomMsg(msg);
                break;
            // 其它case
            default:
                break;
        }
        let attachObj = msg.attach ? msg.attach : {};
        try {
            if (attachObj.type === "updateTeam" || attachObj.type === "updateTeamMute") {
                this.onCustomMsg(msg);
            }
        } catch (error) {}
    },
    pushMsg(msgs) {
        if (!Array.isArray(msgs)) {
            msgs = [msgs];
        }
        var sessionId = msgs[0].scene + "-" + msgs[0].account;
        data.msgs = data.msgs || {};
        data.msgs[sessionId] = this.groupChat.mergeMsgs(data.msgs[sessionId], msgs);
    },
    fnsend(data) {
        console.log(data);
    },
    sendMsgDone(error, msg) {
        // console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
        this.pushMsg(msg);
        this.textarea = "";
    },
    onRoamingMsgs(obj) {
        console.log("收到漫游消息", obj);
        this.pushMsg(obj.msgs);
    },
    onOfflineMsgs(obj) {
        console.log("收到离线消息", obj);
        this.pushMsg(obj.msgs);
    },
    onSessions(sessions) {
        console.log("收到会话列表", sessions);
        data.sessions = this.groupChat.mergeSessions(data.sessions, sessions);
    },
    getHistory(tid = "1412869820") {
        console.log(tid);
        this.groupChat.getHistoryMsgs({
            scene: "team",
            to: tid,
            done: this.getHistoryMsgsDone
        });
    },
    onCustomMsg(msg) {
        console.log("TCL: onCustomMsg -> msg", JSON.parse(msg.content));
        console.log("处理自定义消息", msg);
        // 处理自定义消息
        // setVuexRedTree(msg);
        // switch(msg.content.type) {
        //      case 400063:
        //          this.addCountCommit();
        //          break;
        //     default:
        //         console.log(msg.content)
        // }
        if (JSON.parse(msg.content).type == 400063) {
            console.log("400063");
            this.addCountCommit();
        }
        this.setImMsg(msg); //处理自定义消息
    },
    onUpdateSession(session) {
        // console.log('会话更新了');
        // console.log('会话更新了', session);
        data.sessions = this.groupChat.mergeSessions(data.sessions, session);
        this.setUpdateMsg(session); //获得会话更新
    },
    getHistoryMsgsDone(error, obj) {
        // console.log('获取team历史消息' + (!error?'成功':'失败'));
        // console.log(error);
        console.log(obj);
        if (!error) {
            console.log(obj.msgs);
            this.setHistoryMsg(obj); //获得历史消息
        }
    }
};
