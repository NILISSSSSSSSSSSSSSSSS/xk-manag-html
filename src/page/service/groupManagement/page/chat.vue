<template>
    <div class="training-chat">
        <div class="chat-main">
            <div class="chat-content" ref='oChatDom' v-loading="bChatLoading">
                <div class="all-msgs">
                    <div class="refresh-box" v-show="pullDownRefresh">
                        <bubble :y='bubbleY' v-if="beforePullDown"></bubble>
                        <img src="@/assets/image/loading.gif" v-show="pullDownLoading">
                    </div>
                    <div class="msg" v-for="(item,index) in aMsgs" :key="index">
                        <div class="time-msg" v-show="item.showTime">{{item.time | formatTime}}</div>
                        <!-- 文本消息 -->
                        <div class="text-img-msg" :class="{self:item.self}" v-if="item.content.type==1001||item.content.type==1">
                            <div class="avatar">
                                <img :src="item.avatar" alt="">
                            </div>
                            <div class="msg-right">
                                <div class="nick-name">{{item.nickName}}</div>
                                <div class="msg-txt" v-html="item.content.data.msgContent">
                                    <!-- {{item.content.data.msgContent}} -->
                                </div>
                            </div>
                        </div>
                        <!-- 图片消息 -->
                        <div class="text-img-msg" :class="{self:item.self}" v-if="item.content.type==1002||item.content.type==2">
                            <div class="avatar">
                                <img :src="item.avatar" alt="">
                            </div>
                            <div class="msg-right">
                                <div class="nick-name">{{item.nickName}}</div>
                                <div class="msg-txt">
                                    <img :src='item.content.data.imgUrl + "?imageMogr2/auto-orient"' @load="fnScrollToEnd"
                                        @click='$viewImage(item.content.data.imgUrl + "?imageMogr2/auto-orient")'>
                                </div>
                            </div>
                        </div>
                        <!-- 视频消息 -->
                        <div class="text-img-msg" :class="{self:item.self}" v-if="item.content.type==1004">
                            <div class="avatar">
                                <img :src="item.avatar" alt="">
                            </div>
                            <div class="msg-right">
                                <div class="nick-name">{{item.nickName}}</div>
                                <div class="msg-txt">
                                    <video :src="item.content.data.videoUrl" controls width='400'
                                        :height="400*item.content.data.videoHeight/item.content.data.videoWidth"></video>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="tip-msg" v-show="item.content.type==4">
                            <div v-if="item.content.data.msgContent && item.content.data.all">管理员已开启全局禁言，只有管理员能够发言</div>
                            <div v-if="!item.content.data.msgContent && item.content.data.all">管理员已解开全局禁言</div>
                            <div v-if="item.content.data.msgContent && !item.content.data.all">{{item.content.data.username}}，已被管理员禁言</div>
                            <div v-if="!item.content.data.msgContent && !item.content.data.all">{{item.content.data.username}}，解除禁言</div>
                        </div> -->
                        <div class="tip-msg" v-if="item.content.type==5">
                            <div>{{item.nickName}}，上传了 {{item.content.data.msgContent}} 到群文件</div>
                        </div>
                        <div class="tip-msg" v-if="item.content.type==1008">
                            <div>{{item.content.data.msgContent}}</div>
                        </div>
                        <div class="msg-clear"></div>
                    </div>
                </div>
                <div v-show="afterPullDown" class="after-tip">{{pullDownTip}}</div>
            </div>
            <div class="chat-send">
                <div class="extend-btn">
                    <div class="btn">
                        <emoticon @fnDelEmoticon="fnDelEmoticon" @fnAddEmoticon="fnAddEmoticon" @Emoticons="fnEmoticons" :emoticonVisible="emoticonVisible">
                        </emoticon>
                        <!-- <img src="@/assets/image/faceyellow.png" alt=""> -->
                    </div>
                    <div class="btn">
                        <img src="@/assets/image/img.png" alt="">
                        <image-upload v-model="imgUrl" @size='getSize'></image-upload>
                    </div>
                    <div class="btn" @click.stop="fnMuteAll" :class="{cannotClick:muteAllStatus}">
                        <img src="@/assets/image/globalBan.png" v-if='bAllmute'>
                        <img src="@/assets/image/globalSay.png" v-else>
                    </div>
                </div>
                <div class="chat-textarea">
                    <textarea class="training-textarea" v-model="textarea"></textarea>
                    <div class="send-btn" @click.stop="fnSendMsg">
                        <div>发送</div>
                        <div>Enter</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-search">
            <!-- 搜索 -->
            <div class="search">
                <div class="search-box">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input21">
                    </el-input>
                </div>
            </div>
            <!-- 群成员列表 -->
            <div class="group-members">
                <div class="member" v-for="(item,index) in showMembers" :key="index">
                    <span>{{item.userTeamIdentity=="owner"?"[群主]":item.userTeamIdentity=="normal"?"":"[管理员]"}}{{item.username}}</span>
                    <img src="@/assets/image/audio1.png" alt="" :class="{cannotClick:item.cannotClick}" @click='fnMutedOne(item,index)' v-if="!item.isMute"
                        v-show="hasMutePower">
                    <img src="@/assets/image/mute.png" alt="" :class="{cannotClick:item.cannotClick}" @click='fnMutedOne(item,index)' v-else
                        v-show="hasMutePower">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import bubble from './bubble';
import { mapState } from 'vuex';
import ImageUpload from '@/components/ImageUpload.vue';
import { getSession } from '@/util/publicMehotds';
import Emoticon from '@/components/emoticon/Emoticon';
export default {
    name: 'trainingChat',
    data() {
        return {
            textarea: '', //输入内容
            aMsgs: [], //所有消息
            aMembers: [], //所有群成员
            bubbleY: 0, //拉取高
            BScroll: null, //滚动实例
            pullDownRefresh: false, //下拉加载
            beforePullDown: true, //加载数据前
            pullDownLoading: false, //加载数据中
            afterPullDown: false, //加载结束提示
            pullDownTip: '加载成功', //加载成功提示语
            pullTimer: null,
            lastHeight: 0,
            bChatLoading: false, //加载消息动画
            imgUrl: '', //上传图地址
            bAllmute: false, //是否全局禁言
            userData: getSession('xk-user') ? JSON.parse(getSession('xk-user')) : {},
            lastTime: 0,
            historyLimit: 30, //每次加载历史消息条数
            hasMutePower: false, //是否拥有禁言权力
            emoticonValue: '', //表情数据
            emoticonVisible: false,
            muteAllStatus: false, //全部禁言状态,
            upImgInfo: {}, //长传图片的长宽大小信息
            input21: '', //群成员搜索input
            newMembers: []
        };
    },
    props: {
        tid: {},
        isMeCreate: {
            type: Number,
            default: 0
        }
    },
    components: {
        bubble,
        ImageUpload,
        Emoticon
    },
    computed: {
        ...mapState({
            groupChat: state => state.service.groupChat,
            imMsg: state => state.service.imMsg,
            canGetHistory: state => state.service.canGetHistory
        }),
        showMembers() {
            return this.newMembers.length > 0 ? this.newMembers : this.aMembers;
        }
    },
    created() {
        document.addEventListener('keydown', this.fnKeyUp, false);
        this.groupChat.getTeam({
            teamId: this.tid,
            done(error, obj) {
                console.log(error);
                console.log(obj);
                console.log('获取群' + (!error ? '成功' : '失败'));
                if (!error) {
                    if (obj.mute) {
                        localStorage.setItem('allMute', 1);
                    } else {
                        localStorage.setItem('allMute', 0);
                    }
                }
            }
        });
        this.bAllmute = JSON.parse(localStorage.getItem('allMute')) ? true : false;
    },
    mounted() {
        this.initChat();
        this.BScroll = new BScroll(this.$refs.oChatDom, {
            probeType: 1,
            mouseWheel: true,
            pullDownRefresh: true,
            click: true
        });
        // 下拉
        this.BScroll.on('scroll', pos => {
            if (this.beforePullDown) {
                this.bubbleY = this.bubbleY = Math.max(0, pos.y - 50);
                if (pos.y > 15) {
                    this.pullDownRefresh = true;
                } else {
                    this.pullDownRefresh = false;
                }
            } else {
                this.bubbleY = 0;
            }
        });
        // 下拉释放
        this.BScroll.on('pullingDown', () => {
            this.beforePullDown = false;
            this.pullDownLoading = true;
            this.lastHeight = document.querySelector('.all-msgs').scrollHeight;
            let endTime = this.aMsgs[0].time;
            this.fnGetHistoryMsg(endTime); // 下拉请求历史消息
        });
    },
    methods: {
        async initChat() {
            //初始化群
            await this.fnGetTrainingTeamInfo(); //获取群信息
            if (this.canGetHistory) {
                this.fnGetHistoryMsg(); //获取历史消息
            }
        },
        fnGetTrainingTeamInfo() {
            //获取群成员
            let _this = this;
            return new Promise((resolve, reject) => {
                this.groupChat.getTeamMembers({
                    teamId: this.tid,
                    sync: true,
                    done(err, obj) {
                        if (err) {
                            _this.$message.error('获取群成员失败！');
                            _this.aMembers = [];
                            resolve(false);
                        } else {
                            console.log(obj);
                            _this.aMembers = [];
                            let arr = [];
                            let userObjs = {};
                            for (const item of obj.members) {
                                arr.push(item.account);
                                let isMute = false;
                                if (_this.bAllmute && item.type == 'normal') {
                                    isMute = true;
                                }
                                userObjs[item.account] = {
                                    accid: item.account,
                                    avatar: null,
                                    isMute: isMute ? 1 : item.mute ? 1 : 0,
                                    merchantCode: null,
                                    merchantName: null,
                                    merchantType: null,
                                    userId: item.account,
                                    userTeamIdentity: item.type,
                                    username: null
                                };
                            }
                            if (arr.length) {
                                function split_array(arr, len) {
                                    let arr_length = arr.length;
                                    let newArr = [];
                                    for (let i = 0; i < arr_length; i += len) {
                                        newArr.push(arr.slice(i, i + len));
                                    }
                                    return newArr;
                                }
                                let arrArr = split_array(arr, 150); //云信最多150，要拆分成多个数组
                                for (let index = 0; index < arrArr.length; index++) {
                                    const newArr = arrArr[index];
                                    _this.groupChat.getUsers({
                                        accounts: newArr,
                                        sync: true,
                                        done(err, users) {
                                            users.forEach(item => {
                                                userObjs[item.account].avatar = item.avatar;
                                                userObjs[item.account].merchantName = item.nick;
                                                userObjs[item.account].username = item.nick;
                                                //查询自己是否拥有禁言权利
                                                if (item.account == _this.userData.id) {
                                                    if (userObjs[item.account].userTeamIdentity != 'normal') {
                                                        _this.hasMutePower = true;
                                                    }
                                                }
                                                _this.aMembers.push(userObjs[item.account]);
                                            });
                                            resolve(true);
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            });

            // return new Promise((resolve,reject)=>{
            //     this.$http.get(this.$api.teamInfo, {tid:this.tid}, true).then((res) => {
            //         this.aMembers = [];
            //         console.log(res)
            //         // 群成员
            //         for (const [index,item] of res.members.entries()) {
            //             this.aMembers.push(item);
            //             // 判断自己是否有禁言权利
            //             if(item.userId==this.userData.id){
            //                 console.log(item);
            //                 if(item.userTeamIdentity != "normal"){
            //                     this.hasMutePower = true ;
            //                 }
            //             }
            //         }
            //         console.log(this.aMembers);
            //         resolve(true)
            //     }).catch((err) => {
            //         console.log(err)
            //         resolve(false)
            //         this.aMembers = [];
            //         this.$message.error(""+err.message);
            //     });
            // })
        },
        fnGetHistoryMsg(endTime) {
            //拉取历史消息
            let historyData = {
                //首次加载历史消息
                scene: 'team',
                to: this.tid,
                done: this.getHistoryMsgsDone,
                asc: true,
                limit: this.historyLimit
            };
            if (endTime) {
                //如果传endTime表示是下拉加载历史消息 否则为初次加载历史消息
                historyData.asc = false;
                historyData.endTime = endTime;
            } else {
                this.bChatLoading = true;
            }
            this.groupChat.getHistoryMsgs(historyData);
        },
        fnScrollToEnd() {
            this.$nextTick(() => {
                this.BScroll.refresh();
                let allHeight = document.querySelector('.all-msgs').scrollHeight;
                let height = document.querySelector('.chat-content').offsetHeight;
                if (!this.pullDownRefresh) {
                    //是否下拉加载
                    this.BScroll.scrollTo(0, -allHeight + height); //滚动到底部
                } else {
                    this.BScroll.scrollTo(0, -allHeight + this.lastHeight + 20); //维持当前滚动高度
                }
            });
        },
        fnKeyUp(e) {
            this.emoticonVisible = false;
            if (e.keyCode === 13) {
                if (e.ctrlKey) {
                    this.textarea += '\n';
                    return false;
                } else {
                    this.textarea = this.textarea.replace('\n', '');
                    this.fnSendMsg();
                    return false;
                }
            }
        },
        fnSendMsg() {
            this.emoticonVisible = false;
            if (!this.textarea.trim()) {
                // this.$message.warning('消息不能为空！！');
                return false;
            }
            let obj = {
                data: {
                    msgContent: this.textarea
                },
                type: 1001,
                group: 1
            };
            var msg = this.groupChat.sendCustomMsg({
                scene: 'team',
                to: this.tid,
                content: JSON.stringify(obj),
                done: this.sendMsgDone
            });
        },
        fnMutedOne(target, index) {
            //单个禁言
            let obj = {
                tid: this.tid,
                teamUserId: target.userId,
                muteType: target.isMute ? 0 : 1
            };
            console.log(obj);
            if (target.cannotClick) {
                this.$message({
                    type: 'warning',
                    message: `${target.isMute ? '解除禁言中，请勿重复操作' : '禁言中，请勿重复操作'}`
                });
                return false;
            }
            Vue.set(this.aMembers[index], 'cannotClick', true);
            this.$http
                .get(this.$api.teamUserMute, obj, true)
                .then(res => {
                    console.log(res, target);
                    this.$message({
                        type: 'success',
                        message: `${target.isMute ? '解除禁言成功' : '禁言成功'}`
                    });
                    target.isMute = !target.isMute;
                    Vue.set(this.aMembers[index], 'cannotClick', false);
                    this.aMembers.splice(index, 1, target);
                })
                .catch(err => {
                    console.log(err);
                    Vue.set(this.aMembers[index], 'cannotClick', false);
                    this.$message.error(err.message);
                });
        },
        fnMuteAll() {
            //进行全局禁言
            if (this.muteAllStatus) {
                this.$message({
                    type: 'warning',
                    message: `${this.bAllmute ? '解除全局禁言中，请勿重复操作' : '全局禁言中，请勿重复操作'}`
                });
                return false;
            }
            this.$confirm(`确认全体${this.bAllmute ? '解除禁言' : '禁言'}`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let obj = {
                        tid: this.tid,
                        muteType: this.bAllmute ? 0 : 1 //0解除禁言 1全局禁言
                    };
                    console.log(obj);
                    this.muteAllStatus = true;
                    this.$http
                        .get(this.$api.muteAll, obj, true)
                        .then(res => {
                            console.log(res);
                            this.$message({
                                type: 'success',
                                message: `全局${this.bAllmute ? '解除禁言' : '禁言'}成功`
                            });
                            this.bAllmute = !this.bAllmute;
                            this.fnGetTrainingTeamInfo(); //重新获取禁言情况
                            this.muteAllStatus = false;
                        })
                        .catch(err => {
                            this.$message.error('' + err.error);
                            this.muteAllStatus = false;
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
        },
        sendMsgDone(error, msg) {
            console.log(msg);
            if (error) {
                this.$message.error(error.message);
                return;
            }
            this.aMsgs.push({
                type: 1001,
                time: new Date().getTime(),
                showTime: false,
                nickName: this.userData.realName,
                avatar: this.userData.avatar,
                content: JSON.parse(msg.content),
                self: true
            });
            this.textarea = '';
        },
        getHistoryMsgsDone(error, obj) {
            console.log('历史消息', obj);
            this.bChatLoading = false;
            if (!error) {
                if (this.pullDownRefresh) {
                    //下拉历史消息
                    this.fnHistoryToPage(obj, true);
                } else {
                    this.fnHistoryToPage(obj, false);
                }
            } else {
                if (this.pullDownRefresh) {
                    this.beforePullDown = true;
                    this.afterPullDown = false;
                    this.pullDownRefresh = false;
                }
                this.groupChat.disconnect();
                this.groupChat.connect();
            }
        },
        fnHistoryToPage(obj, pullDownRefresh) {
            let arrMethod = 'push';
            if (obj.msgs) {
                if (pullDownRefresh) {
                    // 操作下拉
                    this.pullDownLoading = false;
                    this.afterPullDown = true;
                    this.BScroll.finishPullDown();
                    let arr = obj.msgs.filter(item => {
                        return item.type === 'custom';
                    });
                    if (!arr.length) {
                        this.pullDownTip = '没有更多历史消息！';
                    }
                    arrMethod = 'unshift';
                    clearTimeout(this.pullTimer);
                    this.pullTimer = setTimeout(() => {
                        // 成功后1秒延迟消失（给用户提示）
                        this.beforePullDown = true;
                        this.afterPullDown = false;
                        this.pullDownRefresh = false;
                    }, 1000);
                }
                obj.msgs.forEach((item, index) => {
                    let attachObj = item.attach ? item.attach : {};
                    if (item.type === 'custom') {
                        let content = {};
                        try {
                            content = JSON.parse(item.content);
                        } catch (error) {}
                        this.aMsgs[arrMethod]({
                            time: item.time,
                            showTime: false,
                            nickName: item.fromNick,
                            avatar: this.userData.id == item.from ? this.userData.avatar : '//gc.xksquare.com/FgbxxWwWCxqHiTiD_2YBgfSlYmau',
                            content: content,
                            self: this.userData.id == item.from ? true : false
                        });
                    } else if (attachObj.type === 'updateTeam') {
                        this.aMsgs[arrMethod]({
                            time: item.time,
                            showTime: false,
                            content: {
                                data: {
                                    msgContent: `${item.fromNick}， ${item.attach.team.mute ? '开启' : '关闭'} 全局禁言`
                                },
                                type: 1008
                            }
                        });
                    } else if (attachObj.type === 'updateTeamMute') {
                        let arr = this.aMembers.filter(filteritem => {
                            return filteritem.accid === item.attach.account;
                        });
                        arr.push({});
                        this.aMsgs[arrMethod]({
                            time: item.time,
                            showTime: false,
                            content: {
                                data: {
                                    msgContent: `${arr[0].username}，被 ${item.fromNick} ${item.attach.mute ? '' : '解除'}禁言`
                                },
                                type: 1008
                            }
                        });
                    }
                });
            }
        },
        fnDelEmoticon() {
            console.log('执行删除表情操作');
            this.textarea = this.textarea.replace(/([^\]]|\[[^\[]+?\])$/, '');
            //   this.emoticonVisible = true;//表情选择不消失
        },
        fnAddEmoticon(data) {
            this.textarea += data;
            this.emoticonVisible = true; //表情选择不消失
            console.log('执行增加表情操作', data);
        },
        fnEmoticons(val) {
            this.emoticonValue = val;
        },
        fnFontToImg(content) {
            let str = content;
            for (const key in this.emoticonValue) {
                this.emoticonValue[key].forEach(item => {
                    if (str.includes(item.name)) {
                        let biao_n = item.name.replace('[', '\\[');
                        biao_n = biao_n.replace(']', '\\]');
                        let reg = new RegExp(biao_n, 'g');
                        str = str.replace(reg, `<img src="${item.url}" width="40">`);
                    }
                });
            }
            return str;
        },
        getSize(imgValue) {
            console.log('TCL: getSize -> imgValue', imgValue);
            this.upImgInfo = imgValue;
        }
    },
    watch: {
        input21(val) {
            console.log('TCL: val', val);
            console.log('TCL: this.aMembers', this.aMembers);
            if (val != undefined && val != null && val != '') {
                let arr = [];
                for (let item of this.aMembers) {
                    if (item.username.includes(val)) {
                        arr.push(item);
                    }
                }
                this.newMembers = arr;
            } else {
                this.newMembers = [];
            }
        },
        aMsgs(val) {
            console.log(val);
            let spaceTime = 180000; //时间间隔（毫秒）
            this.aMsgs.forEach((item, index) => {
                let longtime = Math.abs(item.time - this.lastTime);
                if (longtime > spaceTime) {
                    this.aMsgs[index].showTime = true;
                } else {
                    this.aMsgs[index].showTime = false;
                }
                if (!index) {
                    this.aMsgs[index].showTime = true;
                }
                this.lastTime = item.time;
                if (item.content.type == 1 || item.content.type == 1001) {
                    this.aMsgs[index].content.data.msgContent = this.fnFontToImg(item.content.data.msgContent);
                }
            });
            this.fnScrollToEnd();
        },
        canGetHistory() {
            //实例化成功后再对云信操作
            this.initChat();
        },
        imgUrl() {
            //发送图片
            if (this.imgUrl) {
                let obj = {
                    data: {
                        ...this.upImgInfo,
                        imgUrl: this.imgUrl
                    },
                    type: 1002,
                    group: 1
                };
                console.log('TCL: imgUrl -> obj', obj);
                var msg = this.groupChat.sendCustomMsg({
                    scene: 'team',
                    to: this.tid,
                    content: JSON.stringify(obj),
                    done: this.sendMsgDone
                });
            }
            this.imgUrl = '';
        },
        bAllmute() {
            localStorage.setItem('allMute', this.bAllmute ? 1 : 0);
        },
        imMsg(value) {
            console.log(value);
            let imMsg = this.imMsg;
            let attachObj = imMsg.attach ? imMsg.attach : {};
            if (imMsg.type === 'custom' && imMsg.to === this.tid) {
                let content = JSON.parse(imMsg.content);
                this.aMsgs.push({
                    time: imMsg.time,
                    showTime: false,
                    nickName: imMsg.fromNick,
                    avatar: '//gc.xksquare.com/FgbxxWwWCxqHiTiD_2YBgfSlYmau',
                    content: content,
                    self: false
                });
                // if(content.type===4 && !content.data.all){//当个禁言本地操作
                //     try {
                //         this.aMembers.forEach((item,index) => {
                //             if(item.userId == JSON.parse(imMsg.content).data.userId){
                //                 console.log()
                //                 let target = item ;
                //                 target.isMute = !target.isMute ;
                //                 this.aMembers.splice(index,1,target)
                //             }
                //         })
                //     } catch (error) {
                //         this.fnGetTrainingTeamInfo();//全体禁言操作重新拉取群成员
                //     }

                // }
            } else if (attachObj.type === 'updateTeam') {
                this.fnGetTrainingTeamInfo(); //全体禁言操作重新拉取群成员
                this.aMsgs.push({
                    time: imMsg.time,
                    showTime: false,
                    content: {
                        data: {
                            msgContent: `${imMsg.fromNick}， ${imMsg.attach.team.mute ? '开启' : '关闭'} 全局禁言`
                        },
                        type: 1008
                    }
                });
            } else if (attachObj.type === 'updateTeamMute') {
                let arr = this.aMembers.filter(filteritem => {
                    return filteritem.accid === imMsg.attach.account;
                });
                arr.push({});
                this.aMsgs.push({
                    time: imMsg.time,
                    showTime: false,
                    content: {
                        data: {
                            msgContent: `${arr[0].username}，被 ${imMsg.fromNick} ${imMsg.attach.mute ? '' : '解除'}禁言`
                        },
                        type: 1008
                    }
                });
            }
        }
    },
    destroyed() {
        document.removeEventListener('keyup', this.fnKeyUp, false);
    }
};
</script>
<style lang='scss'>
// 聊天
@import '../scss/trainingChat/index.scss';
</style>