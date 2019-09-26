<template>
    <div class='notification'>
        <audio src="//gc.xksquare.com/8515.mp3" preload id='notificationAudio' ></audio>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import {getSession} from '@/util/publicMehotds';
    import {Notification} from 'element-ui'
    let NativeNotification = window.Notification ;//原生提示
    let ElementNotification = Notification ;//饿了么提示
    export default {
        name: 'notification',
        data() {
            return {
                xkGods: null,
                xkaccount: {},
                god: {}
            }
        },
        computed: {
            ...mapState({
                updateMsg: state => state.service.updateMsg,
                groupTid: state => state.service.groupTid,
            })
        },
        created() {
            this.xkaccount = JSON.parse(getSession("xk-im-account"));
        },
        methods: {
            fnAudio(){
                document.querySelector("#notificationAudio").play()
            },
            notificationInit(param) {
                let updateMsg = param ;
                if (NativeNotification) {
                    if (NativeNotification.permission == "granted") {
                        this.fnNativeNotification(updateMsg);
                    } else if (NativeNotification.permission == "denied") {
                        this.fnElementNotification(updateMsg);
                    } else {
                        NativeNotification.requestPermission().then(res => {
                            this.notificationInit(updateMsg);
                        })
                    }
                } else {
                    console.log('浏览器不支持Notification');
                    this.fnElementNotification(updateMsg);
                }
                // this.fnAudio();//播放声音
            },
            async fnNativeNotification(updateMsg){
                //这里根据 updateMsg.lastMsg.content.type 做业务区分
                let msg = JSON.parse(updateMsg.lastMsg.content);
                if (msg.type < 10000) {
                    //type小于10000属于IM消息
                    let obj = null;
                    try {
                        obj = await this.fnGetServiceOrGroup(updateMsg)
                    } catch (error) {
                        
                    }
                    if(obj){ 
                        //"service"客服 "group"地区运营群 
                        if(obj.target=="service"){
                            this.customerServiceNotification(updateMsg,true,obj);
                        }else{
                            this.groupNotification(updateMsg,true,obj);
                        }
                    }
                } else if (msg.type > 10000) {
                    //type大于10000属于系统通知消息
                    this.pushNotification(updateMsg,true,"obj");
                }
            },
            async fnElementNotification(updateMsg){
                //这里根据 updateMsg.lastMsg.content.type 做业务区分
                let msg = JSON.parse(updateMsg.lastMsg.content);
                if (msg.type < 10000) {
                    //type小于10000属于IM消息
                    let obj = null;
                    try {
                        obj = await this.fnGetServiceOrGroup(updateMsg)
                    } catch (error) {
                        
                    }
                    if(obj){ 
                        //"service"客服 "group"地区运营群 
                        if(obj.target=="service"){
                            this.customerServiceNotification(updateMsg,false,obj);
                        }else{
                            this.groupNotification(updateMsg,false,obj);
                        }
                    }
                } else if (msg.type > 10000) {
                    //type大于10000属于系统通知消息
                    this.pushNotification(updateMsg,false,"obj");
                }
            },
            fnGetServiceOrGroup(updateMsg){
                return new Promise((resolve,reject) => {
                    let obj = {
                        target:null,
                        title:null,
                        icon:null,
                        content:null
                    }
                    if(updateMsg.lastMsg.to == this.groupTid){
                        obj = {
                            target:"group",
                            title:null,
                            icon:null,
                            content:null
                        }
                        resolve(obj);
                    }else{
                        this.$http.get(this.$api.xkCustomerServiceNotFinishList,{} , true).then((res) => {
                            // console.log(res)
                            if (res) {
                                this.xkGods = res;
                                let god = this.xkGods.filter(item => {
                                    return item.userId == updateMsg.lastMsg.from
                                })
                                if (god.length) {//客服中查到结果
                                    this.god = god[0];
                                    let customContent = {
                                        data: {}
                                    };
                                    try {
                                        customContent = JSON.parse(updateMsg.lastMsg.content)
                                    } catch (error) {

                                    }
                                    let tipcontent = customContent.data.msgContent;
                                    obj = {
                                        target:"service",
                                        title:god[0].nickname,
                                        icon:god[0].avatar,
                                        content:tipcontent
                                    }
                                    resolve(obj);
                                }else{//客服中未查到结果
                                    reject(null);
                                }

                            }else{
                                reject(null);
                            }
                        }).catch((err) => {
                            reject(null);
                        });
                    }
                })
            },
            customerServiceNotification(updateMsg,isNative,obj) {
                let _this = this ;
                if(isNative){
                    let notification = new NativeNotification(obj.title,{
                        body:obj.content,
                        icon:obj.icon
                    });
                    notification.onclick = function() {
                        let objData = {
                            clickType:"native",
                            tid:updateMsg.to,
                            which:"service"
                        }
                        _this.$emit("fnChooseId",objData)
                        notification.close();
                    }
                }else{
                    ElementNotification({
                        title:obj.title,
                        message:obj.content,
                        onClick:function(){
                            let objData = {
                                clickType:"element",
                                tid:updateMsg.to,
                                which:"service"
                            }
                            _this.$emit("fnChooseId",objData)
                            this.close();//关闭当前饿了么通知
                        }
                    })
                }
                this.fnAudio();//播放声音
            },
            groupNotification(updateMsg,isNative,obj) {
                let content = JSON.parse(updateMsg.lastMsg.content);
                let tip = "";
                let allMute = parseInt(localStorage.getItem("allMute"));
                switch (content.type) {
                    case 1001:
                        tip = content.data.msgContent;
                    case 1002:
                        tip = content.data.msgContent;
                        break;
                    case 1004:
                        tip = "[视频消息]";
                        break;
                    case 4:
                        tip = "[禁言消息]";
                        break;
                    case 1008:
                        tip = "[上传文件消息]";
                        break;
                
                    default:
                        break;
                }
                let _this = this ;
                if(isNative){
                    let notification = new NativeNotification(`地区运营群`,{
                        body:tip,
                        icon:"暂无头像"
                    });
                    notification.onclick = function() {
                        let objData = {
                            clickType:"native",
                            tid:updateMsg.to,
                            which:"group",
                            allMute
                        }
                        _this.$emit("fnChooseId",objData)
                        notification.close();
                    }
                }else{
                    ElementNotification({
                        title:`地区运营群`,
                        message:tip,
                        onClick:function(){
                            let objData = {
                                clickType:"element",
                                tid:updateMsg.to,
                                which:"group",
                                allMute
                            }
                            _this.$emit("fnChooseId",objData)
                            this.close();//关闭当前饿了么通知
                        }
                    })
                }
                this.fnAudio();//播放声音
            },
            pushNotification(updateMsg,isNative,obj) {
                let msg = JSON.parse(updateMsg.lastMsg.content);
                let _this = this ;
                if(isNative){
                    let message=msg.data.msgContent
                    .replace("来自精选商城的订单：","来自精选商城的订单：\r\n")
                    .replace("来自批发商城的订单：","来自批发商城的订单：\r\n")
                    .replace("来自夺奖派对的订单：","来自夺奖派对的订单：\r\n")
                    let notification = new NativeNotification("系统消息",{
                        body:message,
                        icon:"//gc.xksquare.com/userHeadImg.png"
                    });
                    notification.onclick = ()=> {
                        this.$emit("systomPushClick",updateMsg);
                        notification.close();
                    }
                }else{
                    ElementNotification({
                        title:"系统消息",
                        message:msg.data.msgContent,
                        onClick:function(){
                            this.$emit("systomPushClick",updateMsg);
                            this.close();//关闭当前饿了么通知
                        }
                    })
                }
                this.fnAudio();//播放声音
            }
        },
        watch: {
            updateMsg(res) {
                if (res.lastMsg.from !== this.xkaccount.accid) {   //不是本人才提示
                    if(res.lastMsg.type !== "notification"){//非网易云信的提示
                        this.notificationInit(res);
                    }
                }
            }
        }
    }
</script>
<style lang='scss' scoped>
</style>