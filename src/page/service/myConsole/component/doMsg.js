import {getSession} from '@/util/publicMehotds';
import {knowledgePointUrl} from '@/util/publicParams';
let data = {};
export default {
    doImMsg(msg){
        // console.log(msg);
        let pushmsg = {
            avatar:this.inserviceGod.avatar,
            nickname:this.inserviceGod.nickname,
            content:JSON.parse(msg.content),
            userId:msg.from,
            time:msg.time,
            self:false
        }
        if(this.inserviceGod.userId === msg.from){
            // 是当前服务对象添加消息到聊天框
            this.msgs.push(pushmsg);
        }else{
            console.log(this.xkGods)
            this.xkGods.forEach((item,index) => {
                if(item.userId===msg.from){
                    this.xkGods[index].newNum++
                }
            });
        }
    },
    doUpdateMsg(session){
        // console.log("会话更新",session)
        let customContent = {
            data:{}
        };
        try {//防止数据格式不对导致错误
            customContent = JSON.parse(session.lastMsg.content)
        } catch (error) {
            
        }
        this.xkGods.forEach((item,index) => {
            if(item.tid===session.lastMsg.to){
                this.setLeftMsg(index,session.lastMsg.time,customContent);//设置左侧消息
            }
        });
        console.log("会话更新",customContent)
    },
    setLeftMsg(index,time,data){//左侧消息统一设置
        // console.log(index,time,data.type);
        if( data.type == 1001 || data.type == 1002 || data.type == 1003 || data.type == 1004 || data.type == 4001 || data.type == 4002){
            Vue.set(this.xkGods[index],'time',time)
            Vue.set(this.xkGods[index],'content',this.fnFontToImg(data.data.msgContent))
        }else if(data.type == 1008){//流转
            Vue.set(this.xkGods[index],'time',time)
            Vue.set(this.xkGods[index],'content',' ')
        }else{
            Vue.set(this.xkGods[index],'time',time)
            Vue.set(this.xkGods[index],'content','其他消息类型')
            // console.log('其他消息类型')
        }
        
    },
    fnsend(content=this.textarea,sec){
        console.log(sec);
        // content 内容
        // sec 是否是知识点
        let xkUser = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
        let [msg,sendData] = [null,{
            scene: 'team',
            to: this.inserviceGod.tid,
            content: '',
            done: this.sendMsgDone
        }];
        let localData = {
            avatar:xkUser.avatar,
            nickname:xkUser.nickName,
            content:'',
            time:new Date().getTime(),
            self:true
        }
        if(sec){//给网易云信知识点消息
            sendData.content = JSON.stringify({
                data:{
                    msgContent:content,
                    // knowledgeUrl:`${this.$knowledgePointUrl}${sec}`,
                    knowledgeUrl:`${knowledgePointUrl}knowledge?id=${sec}`,
                    type:4002
                },
                type:4002,
                group:1
            })
            // 组装本地知识点消息
            localData.content = {
                data:{
                    msgContent:content,
                    // knowledgeUrl:`${this.$knowledgePointUrl}${sec}`,
                    knowledgeUrl:`${knowledgePointUrl}knowledge?id=${sec}`,
                    type:4002
                },
                type:4002,
                group:1
            }
        }else{// 给网易云信发普通消息
            sendData.content = JSON.stringify({
                data:{
                    msgContent:content,
                    type:1001
                },
                type:1001,
                group:1
            })
            // 组装本地普通消息
            localData.content = {
                data:{
                    msgContent:content,
                    type:1001
                },
                type:1001,
                group:1
            }
        }
        msg = this.groupChat.sendCustomMsg(sendData);//网易云信socket
        this.msgs.push(localData);//本地显示
        this.pushMsg(msg);
        
        this.textarea = '';
    },
    pushMsg(msgs) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].scene + '-' + msgs[0].account;
        this.data.msgs = this.data.msgs || {};
        this.data.msgs[sessionId] = this.groupChat.mergeMsgs(this.data.msgs[sessionId], msgs);
    },
    getHistory(tid='1412869820',endTime){
        this.chatLoading = true ;//加载动画（切换再次请求）
        let historyData = {//首次加载历史消息
            scene: 'team',
            to: tid,
            done: this.getHistoryMsgsDone,
            asc:true,
            limit:50
        }
        if(endTime){//下拉加载更多历史消息
            historyData.asc = false ;
            historyData.endTime = endTime ;
        }
        this.groupChat.getHistoryMsgs(historyData);
    },
    getHistoryMsgsDone(error, obj) {
        let xkaccount = getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {};
        let xkUser = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
        // console.log('获取team历史消息' + (!error?'成功':'失败'));
        // console.log(error);
        console.log("历史消息",obj);
        // console.log(error);
        this.chatLoading = false ;//加载动画（切换再次请求）
        if (!error) {
            // console.log(obj.msgs);
            try {
                clearInterval(this.timer[obj.to]);
                // console.log(this.xkGods)
                this.xkGods.forEach((item,index) => {
                    if(item.tid===obj.msgs[0].to){
                        // console.log(obj.msgs[0])
                        let thismsg = {};
                        try {
                            thismsg = JSON.parse(obj.msgs[obj.msgs.length - 1].content);
                        } catch (error) {}
                        if(!this.pullDownRefresh){//非下拉加载
                            this.setLeftMsg(index,obj.msgs[obj.msgs.length - 1].time,thismsg);//设置左侧消息
                        }
                    }
                });
                
                if(obj.to===this.inserviceGod.tid){
                    if(this.pullDownRefresh){//是下拉加载
                        obj.msgs.forEach((item,index) => {
                            let pushmsg = {
                                avatar:xkaccount.accid===item.from?xkUser.avatar:this.inserviceGod.avatar,
                                nickname:xkaccount.accid===item.from?xkUser.nickName:this.inserviceGod.nickname,
                                content:{},
                                userId:item.from,
                                time:item.time,
                                self:xkaccount.accid===item.from?true:false,
                                idServer:item.idServer,
                                time:item.time
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
                                this.msgs.unshift(pushmsg);
                            }
                            
                        });
                        if(obj.msgs.length>1){
                            this.tipTitle = '加载成功...'
                        }else{
                            this.tipTitle = '没有更多数据...'
                        }
                        // 下拉加载
                        this.pullDownLoading = false ;
                        this.afterPullDown = true ;
                        this.BScroll.finishPullDown();
                        clearTimeout(this.pullTimer1)
                        this.pullTimer1 = setTimeout(()=>{
                            this.beforePullDown = true ;
                            this.afterPullDown = false ;
                            this.pullDownRefresh = false ;
                        },1000)
                    }else{
                        this.msgs = [];
                        obj.msgs.forEach((item,index) => {
                            let pushmsg = {
                                avatar:xkaccount.accid===item.from?xkUser.avatar:this.inserviceGod.avatar,
                                nickname:xkaccount.accid===item.from?xkUser.nickName:this.inserviceGod.nickname,
                                content:{},
                                userId:item.from,
                                time:item.time,
                                self:xkaccount.accid===item.from?true:false,
                                idServer:item.idServer,
                                time:item.time
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
                    }
                    
                    
                    // console.log(this.msgs);
                    
                }
            } catch (error) {
                
            }
        }else{
            if(!obj.msgs){
                // 错误尝试重新链接
                let xkaccount = getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {};
                this.groupChat.disconnect();
                this.groupChat.setOptions({
                    appKey: 'abe7a770f36b0621d05426343363baa5',
                    account: xkaccount.accid,
                    token: xkaccount.token,
                    onconnect: onConnect,
                })
                this.groupChat.connect();
                let _this = this ;
                function onConnect() {
                    console.log('链接成功')
                    // setTimeout(() => {
                    _this.getHistory(obj.to);
                    // }, 1000);
                }
                console.log(obj.to);
            }
            
        }
    }
}