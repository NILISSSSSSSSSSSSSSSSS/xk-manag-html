<template>
    <div class='chat' v-loading='vloading'>
        <div class="left-list" v-show="xkGods.length">
            <div class="top-search">
                <div class="demo-input-suffix">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" clearable v-model="inputsearch">
                    </el-input>
                </div>
            </div>
            <div class="bottom-user-list">
                <div class="xk-god" :class="{'chat-select':index===selectedIndex}" v-for="(item,index) in xkGods" :key="index" @click.stop="fnselectone(index)">
                    <div class="sanjiao" v-show="item.starWorkOrder"></div>
                    <div class="xk-timer">{{item.time | formatTime('HH:mm')}}</div>
                    <div class="xk-new-msg-num" v-show="item.newNum">{{item.newNum}}</div>
                    <div class="avatar-box">
                        <img :src="item.avatar" @error="nofind">
                        <div class="status" :class="{online:item.online}"></div>
                    </div>
                    <div class="god-content">
                        <div class="nick">{{item.nickname}}</div>
                        <div class="txt" v-html="item.content" style="margin-bottom:5px"></div>
                        <div class="txt" v-show="item.transferId" style="font-size:10px;">{{item.transferName}}流转</div>
                        <div class="xk-remove" style="display:none">&times;</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-content">
            <div class="xk-god-info" v-show="xkGods.length">
                <div class="list">{{inserviceGod.nickname}}</div>
                <div class="list">{{inserviceGod.phone}}</div>
                <div class="list">{{inserviceGod.userType | UserType}}</div>
                <div class="star" :class="{'star-true':inserviceGod.starWorkOrder}" @click="fnstar">星标</div>
                <!-- <div class="star-icon" :class="{'star-true':inserviceGod.starWorkOrder}" @click = "fnstar">
                  星标
                  <div class="one"></div>
                  <div class="two"></div>
              </div> -->
            </div>
            <div class="xk-chat-content" v-show="xkGods.length">
                <div class="chat-msg-box" id="xk-chat-main" ref='scrolldom' v-loading='chatLoading'>
                    <div class="content">
                        <div class="refresh-box" v-show="pullDownRefresh">
                            <div class="not-txt">
                                <bubble :y="bubbleY" v-if="beforePullDown"></bubble>
                                <div class="loading" v-show="pullDownLoading">
                                    <img src="@/assets/image/loading.gif" alt="">
                                </div>
                            </div>
                        </div>

                        <div v-for="(item,index) in msgs" :key="index" style="width:100%;overflow: hidden;padding-top:10px">
                            <template v-if="  item.content.type===1001 ||
                                        item.content.type===1002 ||
                                        item.content.type===1003 || 
                                        item.content.type===1004 || 
                                        item.content.type===4001 || 
                                        item.content.type===4002">
                                <div class="xk-time" v-show="item.showtime">{{item.time | formatTime('HH:mm')}}</div>
                                <div class="xk-msg" :class="{'self-msg':item.self}">
                                    <div class="xk-avatar">
                                        <img :src="item.avatar" @error="nofind">
                                    </div>
                                    <div class="msg-txt">
                                        <div class="xk-nick">{{item.nickname}}</div>
                                        <!-- type 1001 普通消息 -->
                                        <div class="xk-content" v-if='item.content.type===1001' v-html="urlFilter(item.content.data.msgContent)"
                                            @click='openUrl(item.content.data.msgContent)'>
                                            <!-- 普通消息 html -->
                                        </div>
                                        <!-- type 4002 知识点消息 -->
                                        <div class="xk-content" v-if='item.content.type===4002'>
                                            <a :href="item.content.data.knowledgeUrl" target="_blank">{{item.content.data.msgContent}}</a>
                                        </div>
                                        <!-- type 1002 图片消息 -->
                                        <div class="xk-content" v-if='item.content.type===1002'>
                                            <img :src='item.content.data.imgUrl + "?imageMogr2/auto-orient"' style='max-width:400px;' @load='fnimgLoad'
                                                @click='$viewImage(item.content.data.imgUrl + "?imageMogr2/auto-orient")' />
                                        </div>
                                        <!-- type 1003 语音消息 -->
                                        <div class="audio-msg" v-if='item.content.type===1003'>
                                            <div class="xk-content" v-if='item.content.type===1003' @click.stop='fnPlayAudio(index)'>
                                                <audio :src="item.content.data.voiceUrl" :ref='"audio"+index' :audioid='index+"audio"'></audio>
                                                <img src="../../../../assets/image/audio.png" :ref='"imgstatus"+index' style="height:20px">
                                            </div>
                                            <span class="audio-time">{{Math.ceil(item.content.data.voiceTime/1000)}}s</span>
                                        </div>
                                        <!-- type 1004 视频消息 -->
                                        <div class="xk-content" v-if='item.content.type===1004'>
                                            <video :src="item.content.data.videoUrl" controls width='400'
                                                :height="400*item.content.data.videoHeight/item.content.data.videoWidth"></video>
                                        </div>
                                        <!-- type 4001 订单消息 -->
                                        <div class="xk-content" v-if='item.content.type===4001' @click.stop="fnJumpOrder(item.content)">
                                            <div class='xk-order'>
                                                <img :src="item.content.data.orderIconUrl" />
                                                <div class='xk-detail'>
                                                    <div class='xk-name'>
                                                        {{item.content.data.orderCommodityCount>1?`共${item.content.data.orderCommodityCount}件商品`:item.content.data.commodityName}}
                                                    </div>
                                                    <div class='xk-spec' v-if="item.content.data.orderType==2&&item.content.data.orderCommodityCount==1">
                                                        <span>产品规格 :</span> <span>{{item.content.data.commoditySpecification}}</span>
                                                    </div>
                                                    <!-- <div class='xk-spec' v-if="item.content.data.orderType==1">
                                                        <span>时间 :</span> <span>{{item.content.data.commoditySpecification}}</span>
                                                    </div> -->
                                                    <!-- <div class='xk-spec' v-if="item.content.data.orderType==2">
                                                        <span>数量 :</span> <span>{{item.content.data.orderCommodityCount}}</span>
                                                    </div> -->
                                                    <div class='xk-price'
                                                        v-if='item.content.data.orderCommodityCount>1&&item.content.data.orderTotalAmount&&item.content.data.orderType==2'>
                                                        价格：<span>{{$math.divide(item.content.data.orderTotalAmount,100)}}元</span>
                                                    </div>
                                                    <div class='xk-price'>
                                                        订单号：<span>{{item.content.data.orderId}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                    </div>
                    <div class="load-txt" v-show="afterPullDown">{{tipTitle}}</div>
                </div>
                <div class="chat-input">
                    <div class="chat-handle">
                        <div class="handle-item" style="border:0">
                            <emoticon @fnDelEmoticon="fnDelEmoticon" @fnAddEmoticon="fnAddEmoticon" @Emoticons="fnEmoticons"
                                :emoticonVisible.sync='emoticonVisible'></emoticon>
                        </div>
                        <div class="handle-item">
                            <el-popover placement="top" width="300" v-model="showOften">
                                <div class='xk-title'>
                                    <div class="vus-title">
                                        <span></span>
                                        快捷用语
                                    </div>
                                </div>
                                <ul class="xk-often">
                                    <li v-for="(item,index) in ofenPage" v-show='item.status=="active"' :key="index" @click='fnoftenclick(item)'>
                                        {{item.content}}</li>
                                </ul>
                                <div slot="reference">
                                    <img src="../../../../assets/image/fast.png" alt="">
                                </div>
                            </el-popover>
                        </div>
                        <!-- <div class="handle-item" @click.stop='fnpingjia'>
                            <img src="../../../../assets/image/pin.png" alt="">
                        </div> -->
                        <div class="handle-item" @click.stop="fndone">
                            <img src="../../../../assets/image/done.png" alt="">
                        </div>
                        <div class="handle-item" @click.stop="fnroam">
                            <img src="../../../../assets/image/roam.png" alt="">
                        </div>
                        <div class="handle-item">
                            <el-popover placement="top" width="300" v-model="showPoint">
                                <el-form label-position="top">
                                    <div class='xk-title'>
                                        <div class="vus-title">
                                            <span></span>
                                            知识点
                                        </div>
                                    </div>
                                    <el-form-item label="请选择视角：">
                                        <el-select v-model="viewerValue" placeholder="请选择视角" :size="$size" @change='viewerTypechange'>
                                            <el-option label="所有" value="">
                                            </el-option>
                                            <el-option v-for="item in viewerType" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="请选择发送知识点：">
                                        <ul class="xk-often">
                                            <li @click='fnpointclick(item)' :key="index" v-for="(item,index) in pointPage" style="cursor:point">
                                                {{item.name}}
                                            </li>
                                        </ul>
                                    </el-form-item>
                                </el-form>

                                <div slot="reference">
                                    <img src="../../../../assets/image/know.png" alt="">
                                </div>
                            </el-popover>
                        </div>
                    </div>
                    <div class="chat-text-input">
                        <textarea v-model="textarea" autofocus></textarea>
                        <div class="send-btn">
                            <el-button type="primary" :size="$size" @click.stop="fnClickSend">发送</el-button>
                            <div class="tip">按Enter键发送，按Ctrl+Enter换行</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="no-xk-god" v-if="!xkGods.length">
                <img src="../../../../assets/image/zhanwuneirong.png" alt="">
                <div>还没有消息呢...</div>
            </div>
        </div>
        <workdone :workdoneshow='workdoneshow' @refreshPage='fnrefreshPage' @closeshow='fncloseshow' :customerId='customerId' :workOrderId='workOrderId'>
        </workdone>
        <workroam :workroamshow='workroamshow' @refreshPage='fnrefreshPage' @closeshow='fncloseshow' :customerId='customerId' :workOrderId='workOrderId'>
        </workroam>

        <el-dialog title="确认邀请评价" :visible="evaluate" width="793px" @close="evaluate = false">
            <span>是否确认邀请用户为您评价？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="evaluate = false" :size='$size'>取 消</el-button>
                <el-button type="primary" @click="fnevaluate" :size='$size' :loading='pload'>确 定</el-button>
            </span>
        </el-dialog>
        <frame :show.sync='openServiceUrl' :url='serviceUrl'></frame>
        <img src="../../../../assets/image/default_avatar.png" ref="timg" style="display:none;width:0;height:0;opacity:0;position:absolute">
        <img src="../../../../assets/image/audio.png" ref="timg1" style="display:none;width:0;height:0;opacity:0;position:absolute">
        <img src="../../../../assets/image/audio.gif" ref="timg2" style="display:none;width:0;height:0;opacity:0;position:absolute">
    </div>
</template>
<script>
import Workdone from './chatpage/done';
import Workroam from './chatpage/roam';
import bubble from './chatpage/bubble';
import { mapState } from 'vuex';
import doMsg from './doMsg';
import BScroll from 'better-scroll';
import Emoticon from '@/components/emoticon/Emoticon';
import Frame from './Frame.vue';
export default {
    name: 'chat',
    data() {
        return {
            openServiceUrl: false,
            serviceUrl: '',
            evaluate: false,
            inputsearch: '',
            xkGods: [],
            textarea: '',
            selectedIndex: 0,
            inserviceGod: {
                // avatar:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2278739224,3680254183&fm=27&gp=0.jpg",
                // nickname:"uzi",
                // txt:"adc",
                // id:"6161615",
                // status:true,
                // phone:"",
                // userIdentity:"",
                // starWorkOrder:""
            },
            msgs: [
                // {
                //     avatar:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2278739224,3680254183&fm=27&gp=0.jpg",
                //     nickname:"uzi",
                //     content:"这个东西怎么用啊，我都不会使用，好难啊！这个东西怎么用啊，我不会使用，好难啊！",
                //     userId:"6161615",
                //     time:'12:44',
                //     self:false
                // }
            ],
            workdoneshow: false,
            workroamshow: false,
            isupload: false,
            data: {},
            showOften: false,
            ofenPage: [],
            showPoint: false,
            pointPage: [],
            viewerType: JSON.parse(localStorage.getItem('viewerType')),
            viewerValue: '',
            timer: {},
            oldtime: 0,
            vloading: true,
            pload: false,
            BScroll: null,
            pullDownRefresh: false,
            beforePullDown: true, //加载数据前
            pullDownLoading: false, //加载数据中
            afterPullDown: false,
            bubbleY: 0,
            lastHeight: 0, //上次高，下拉加载时记录位置
            pullTimer1: null,
            tipTitle: '加载成功...',
            chatLoading: true,
            emoticonValue: '',
            emoticonVisible: false
        };
    },
    components: {
        Workdone,
        Workroam,
        bubble,
        Emoticon,
        Frame
    },
    created() {
        this.pullDownInitTop = -50;
        this.getcsQuickReplyQPage();
        this.getpointList();
        this.$nextTick(() => {
            setTimeout(() => {
                //延时一秒，防止极端情况网易云未写入历史消息
                this.initGods();
            }, 1000);
            this.BScroll = new BScroll(this.$refs.scrolldom, {
                probeType: 1,
                click: true,
                scrollY: true,
                mouseWheel: true,
                pullDownRefresh: true,
                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO)$/ }
            });
            let _this = this;
            this.BScroll.on('scroll', pos => {
                // console.log(pos)
                if (this.beforePullDown) {
                    this.bubbleY = this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
                    if (pos.y + this.pullDownInitTop > -35) {
                        this.pullDownRefresh = true;
                    } else {
                        this.pullDownRefresh = false;
                    }
                    // console.log(this.bubbleY,this.pullDownRefresh)
                } else {
                    this.bubbleY = 0;
                }
            });
            this.BScroll.on('pullingDown', () => {
                this.beforePullDown = false;
                this.pullDownLoading = true;
                this.lastHeight = document.querySelector('#xk-chat-main').scrollHeight;
                this.getHistory(this.inserviceGod.tid, this.msgs[0].time);
            });
        });
    },
    mounted() {
        document.addEventListener('keydown', this.fnkeyup, false);
        this.fnScrollToEnd();
    },
    updated() {
        //   this.fnScrollToEnd();
    },
    computed: {
        oChat() {
            return document.querySelector('#xk-chat-main');
        },
        customerId() {
            return this.inserviceGod.userId;
        },
        workOrderId() {
            return this.inserviceGod.workOrderId;
        },
        ...mapState({
            groupChat: state => state.service.groupChat,
            imMsg: state => state.service.imMsg,
            updateMsg: state => state.service.updateMsg,
            jumpRouter: state => state.service.jumpRouter, //notification点击后路由跳转
            canGetHistory: state => state.service.canGetHistory //网易云信初始化成功后再拉取历史消息
        })
    },
    props: {
        taskstar: {}
    },
    methods: {
        ...doMsg,
        // 转换聊天记录的url样式
        urlFilter(msg) {
            if ((msg.includes('http://') || msg.includes('https://')) && !msg.includes('<img')) {
                let arr = msg.split(' ');
                for (let item of arr) {
                    if (item.includes('://')) {
                        let arr2 = item.split('?');
                        let [http, ...querys] = arr2;
                        let query = querys.join('?');
                        let arr3 = http.split('http');
                        let http2 = arr3[1];
                        let url = '';
                        if (query) {
                            url = `http${http2}?${query}`;
                        } else {
                            url = `http${http2}`;
                        }
                        let newMsg = msg.replace(url, `<span class='is-url'>${url}</span>`);
                        return newMsg;
                    }
                }
                return msg;
            } else {
                return msg;
            }
        },
        // 打开聊天记录内的链接
        openUrl(msg) {
            if (msg.includes('<img')) return;
            let arr = msg.split(' ');
            for (let item of arr) {
                if (item.includes('://')) {
                    let arr2 = item.split('?');
                    let [http, ...querys] = arr2;
                    let query = querys.join('?');
                    let arr3 = http.split('http');
                    let http2 = arr3[1];
                    let url = '';
                    if (query) {
                        url = `http${http2}?${query}`;
                    } else {
                        url = `http${http2}`;
                    }
                    this.serviceUrl = url;
                    this.openServiceUrl = true;
                    return;
                }
            }
        },
        nofind() {
            var img = event.srcElement;
            img.src = this.$refs.timg.src;
            img.onerror = null; //控制不要一直跳动
        },
        fnScrollToEnd() {
            this.$nextTick(() => {
                this.BScroll.refresh();
                let allHeight = document.querySelector('#xk-chat-main').scrollHeight;
                let height = document.querySelector('#xk-chat-main').offsetHeight;
                if (!this.pullDownRefresh) {
                    this.BScroll.scrollTo(0, -allHeight + height);
                } else {
                    this.BScroll.scrollTo(0, -allHeight + this.lastHeight - 80);
                }
            });
        },
        fnClickSend() {
            this.emoticonVisible = false;
            if (this.textarea) {
                this.fnsend();
            }
        },
        fnkeyup(e) {
            this.emoticonVisible = false; //表情选择消失
            let ctrlKey = e.ctrlKey;
            if (e.keyCode === 13 && !ctrlKey && e.which === 13) {
                e.preventDefault();
                e.cancelBubble = true;
                e.stopPropagation();
                this.textarea = this.textarea.replace('\n', '');
                if (this.textarea) {
                    this.fnsend();
                }
            }
            if (e.keyCode === 13 && ctrlKey) {
                e.preventDefault();
                this.textarea += '\n';
            }
            if (e.keyCode === 38) {
                this.xkGods.forEach((item, index) => {
                    if (item.userId === this.inserviceGod.userId) {
                        if (index > 0) {
                            this.fnselectone(index - 1);
                        }
                    }
                });
            }
            if (e.keyCode === 40) {
                this.xkGods.forEach((item, index) => {
                    if (item.userId === this.inserviceGod.userId) {
                        if (index < this.xkGods.length - 1) {
                            this.fnselectone(index + 1);
                        }
                    }
                });
            }
        },
        fnJumpOrder(target) {
            console.log(target);
            //   window.open(target.data.url)
            // goodsDetailInfo
            if (target.data.orderType == 2) {
                this.$router.push({ path: '/orderListAfterSaleDetail', query: { orderId: target.data.orderId, from: 'chat' } });
            } else if (target.data.orderType == 1) {
                this.$router.push({ path: '/orderDetails', query: { id: target.data.orderId, from: 'chat' } });
            }
        },
        fnPlayAudio(i) {
            let [pauseImg, playImg] = [this.$refs.timg1.src, this.$refs.timg2.src];
            for (const key in this.$refs) {
                if (key.includes('audio')) {
                    this.$refs[key][0].addEventListener(
                        'pause',
                        e => {
                            let n = parseInt(e.currentTarget.getAttribute('audioid'));
                            this.$refs['imgstatus' + n][0].setAttribute('src', pauseImg);
                        },
                        false
                    );
                    this.$refs[key][0].addEventListener(
                        'play',
                        e => {
                            let n = parseInt(e.currentTarget.getAttribute('audioid'));
                            this.$refs['imgstatus' + n][0].setAttribute('src', playImg);
                        },
                        false
                    );
                    if (key === 'audio' + i) {
                        //播放或暂停当前
                        if (this.$refs['audio' + i][0].paused) {
                            this.$refs['audio' + i][0].play();
                        } else {
                            this.$refs['audio' + i][0].pause();
                        }
                    } else {
                        //暂停所有非当前
                        this.$refs[key][0].pause();
                    }
                }
            }
        },
        fnimgLoad() {
            this.fnScrollToEnd();
        },
        fnstar() {
            let title = '确认星标工单';
            let tip = '是否确认标记此工单为星标工单?';
            if (this.inserviceGod.starWorkOrder) {
                title = '确认取消星标工单';
                tip = '是否确认取消标记此工单为星标工单?';
            }
            this.$confirm(`${tip}`, `${title}`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    if (this.inserviceGod.starWorkOrder) {
                        this.$http
                            .get(this.$api.xkCustomerServiceTaskStartCancel, { rid: this.customerId }, true)
                            .then(res => {
                                this.inserviceGod.starWorkOrder = this.inserviceGod.starWorkOrder ? 0 : 1;
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                            })
                            .catch(err => {
                                this.$message({
                                    type: 'error',
                                    message: '操作失败!'
                                });
                            });
                    } else {
                        this.$http
                            .get(this.$api.xkCustomerServiceTaskStart, { rid: this.customerId }, true)
                            .then(res => {
                                this.inserviceGod.starWorkOrder = this.inserviceGod.starWorkOrder ? 0 : 1;
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                            })
                            .catch(err => {
                                this.$message({
                                    type: 'error',
                                    message: '操作失败!'
                                });
                            });
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
        fnselectone(i) {
            //切换对象
            //   console.log(i)
            this.msgs = [];
            this.xkGods[i].newNum = 0;
            this.selectedIndex = i;
            this.inserviceGod = this.xkGods[i];
            if (this.canGetHistory) {
                this.getHistory(this.inserviceGod.tid);
            }
        },
        fndone() {
            console.log(this.inserviceGod);

            if (this.inserviceGod.transferId) {
                this.$http
                    .get(this.$api.workOrderFinish, { id: this.inserviceGod.workOrderId }, true)
                    .then(res => {
                        console.log(res);
                        this.initGods();
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                        this.initGods();
                    });
            } else {
                this.workdoneshow = true;
            }
        },
        fncloseshow() {
            this.workdoneshow = false;
            this.workroamshow = false;
        },
        fnroam() {
            this.workroamshow = true;
        },
        getpointList(data = { limit: 0, page: 1, status: 'active' }) {
            this.$http
                .get(this.$api.knowledgePointList, data, true)
                .then(res => {
                    // console.log("知识点",res);
                    this.pointPage = res.data;
                })
                .catch(err => {
                    // this.$message.error(err.message);
                    this.pointPage = [];
                });
        },
        viewerTypechange() {
            console.log(this.viewerValue);
            this.getpointList({ limit: 0, page: 1, viewerType: this.viewerValue, status: 'active' });
        },
        getcsQuickReplyQPage() {
            this.$http
                .get(this.$api.csQuickReplyQPage, { limit: 1000, page: 1, status: 'active' }, true)
                .then(res => {
                    this.ofenPage = [];
                    if (res.data) {
                        res.data.forEach(item => {
                            this.ofenPage.push({
                                status: item.status,
                                content: item.content
                            });
                        });
                    }
                })
                .catch(err => {
                    // this.$message.error(err.message);
                    this.ofenPage = [];
                });
        },
        fnoftenclick(val) {
            //常用语发送
            console.log(val.content);
            this.fnsend(val.content);
            this.showOften = false;
        },
        fnpingjia() {
            //邀请评价
            console.log(this.inserviceGod);
            this.evaluate = true;
        },
        fnevaluate() {
            //确认邀请评价
            this.pload = true;
            this.$http
                .get(this.$api.invitationEvaluate, { rid: this.inserviceGod.userId }, true)
                .then(res => {
                    console.log(res);
                    this.pload = false;
                    this.evaluate = false;
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.evaluate = false;
                    this.pload = false;
                });
        },
        fnpointclick(val) {
            //发送知识点消息
            console.log(val);
            this.fnsend(`${val.name}`, `${val.id}`);
            this.showPoint = false;
        },
        xkCustomerServiceNotFinishList() {
            //获取正在服务列表
            return new Promise((resolve, reject) => {
                this.$http
                    .get(this.$api.xkCustomerServiceNotFinishList, {}, true)
                    .then(res => {
                        this.vloading = false;
                        resolve(res);
                    })
                    .catch(err => {
                        this.xkGods = [];
                        this.vloading = false;
                        reject(err);
                    });
            });
        },
        fnrefreshPage() {
            //完成或者流转后重新更新列表
            this.initGods();
        },
        async initGods() {
            try {
                let res = await this.xkCustomerServiceNotFinishList();
                console.log('顾客列表', res);

                this.xkGods = [];
                res.reverse();
                res.forEach(item => {
                    if (this.taskstar) {
                        if (item.starWorkOrder) {
                            this.xkGods.push({
                                ...item,
                                type: 'text',
                                content: '',
                                newNum: 0
                            });
                        }
                    } else {
                        this.xkGods.push({
                            ...item,
                            type: 'text',
                            content: '',
                            newNum: 0
                        });
                    }
                });

                this.inserviceGod = this.xkGods[0] ? this.xkGods[0] : {};
                console.log('当前服务对象', this.inserviceGod);
                if (this.canGetHistory) {
                    for (let index = 0; index < this.xkGods.length; index++) {
                        this.getHistory(this.xkGods[index].tid);
                    }
                }
            } catch (error) {}
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
                    if (str && str.includes(item.name)) {
                        let biao_n = item.name.replace('[', '\\[');
                        biao_n = biao_n.replace(']', '\\]');
                        // biao_n = biao_n.replace("?","\\?");
                        let reg = new RegExp(biao_n, 'g');
                        str = str.replace(reg, `<img src="${item.url}" width="40" >`);
                    }
                });
            }
            return str;
        }
    },
    watch: {
        msgs() {
            this.msgs.forEach((item, index) => {
                let longtime = item.time - this.oldtime;
                if (longtime > 180000) {
                    this.msgs[index].showtime = true;
                } else {
                    this.msgs[index].showtime = false;
                }
                if (!index) {
                    this.msgs[index].showtime = true;
                }
                this.oldtime = item.time;
                if (item.content.type == 1001) {
                    this.msgs[index].content.data.msgContent = this.fnFontToImg(this.msgs[index].content.data.msgContent);
                }
            });
            this.fnScrollToEnd();
        },
        imMsg(msg) {
            this.doImMsg(msg);
        },
        updateMsg(msg) {
            this.doUpdateMsg(msg);
        },
        jumpRouter() {
            let tid = this.$route.query.tid;
            try {
                for (let index = 0; index < this.xkGods.length; index++) {
                    if (this.xkGods[index].tid == tid) {
                        this.fnselectone(index);
                    }
                }
            } catch (error) {}
        },
        canGetHistory() {
            if (this.canGetHistory) {
                for (let index = 0; index < this.xkGods.length; index++) {
                    this.getHistory(this.xkGods[index].tid);
                }
            }
        }
    }
};
</script>
<style lang='scss'>
.chat .chat-text-input .el-input__inner {
    background-color: #eceaea !important;
}
.el-popover__title {
    font-size: 24px;
    font-weight: bold;
}
.xk-name {
    max-width: 370px;
}
@import './scss/popper.scss';
</style>

<style lang='scss' scoped>
@import './scss/chat.scss';
</style>