<template>
    <div class="wrapper">
        <div :class="{'animationMenu':isCollapse}" class="left-menu">
            <div :class="{'animationHeader':isCollapse}" class="menu-header">
                <span v-if="!isCollapse" class="xk-logo">XK SQUARE</span>
                <img @click="collapseFun" class="xk-menu-icon" src="../assets/image/menu.png" alt="">
            </div>
            <sidebar :collapse="isCollapse" :routeItem="routeItem"></sidebar>
            <!--<span @click="collapse" class="collapse-btn"></span>-->
        </div>
        <div class="right-content">
            <div class="header">
                <div class="nav-menu">
                    <span v-for="(navMenu, key, index) in headMenu" :key="index"
                          @click="loadingMenu(navMenu, key)"
                          :class="key === ruleKey ? 'activeMenu': ''">
                        {{ navMenu.name }}
                        <div class="xk-red-dot" v-if="navMenu.name === '运营管理' && realCount > 0"></div>
                    </span>
                    <span @click="openLive">直播入口</span>
                </div>
                <div class="user">
                    <el-dropdown @command="handleCommand">
                        <div class="el-dropdown-link user-div">
                            <img class="user-img"
                                 onerror="javascript:this.src='//gc.xksquare.com/userHeadImg.png';"
                                 :src="userPersonalInfo.avatar" alt="">
                            <span class="username">{{userPersonalInfo.realName}}</span>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="xk-main">
                <transition name="fade-transverse">
                    <!--<keep-alive>-->
                    <router-view v-if="isRouterAlive"></router-view>
                    <!--</keep-alive>-->
                </transition>
            </div>
            <notifi @fnChooseId='fnChooseId' @systomPushClick="systomPushClick"></notifi>
        </div>
    </div>
</template>

<script>
    import Sidebar from '../components/Sidebar'
    import {loginOut, saveSession, getSession, getPermission} from '../util/publicMehotds'
    import ImInit from './imInit.js';
    import {mapState, mapMutations} from 'vuex';
    import notifi from '../components/Xknotification'
    import service from '../service'

    export default {
        components: {
            Sidebar,
            notifi
        },
        data() {
            return {
                ruleList: require('../menu/index').default,
                headMenu: getSession("headMenu") ? JSON.parse(getSession("headMenu")) : {},
                isCollapse: false,
                username: "tom",
                isRouterAlive: true,
                routeItem: '',
                currMenu: '',
                openUrl:'',
                ruleKey: getSession("rule-key"),
                user: getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {},
            }
        },
        provide() {
            return {
                reload: this.reload
            }
        },
        computed: {
            ...mapState({
                groupChat: state => state.service.groupChat,
                userPersonalInfo: state => state.userInfo.userPersonalInfo,
                realCount: state => state.redTree.countCommit
            })
        },
        methods: {
            ...ImInit,
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                })
            },
            collapseFun() {
                this.isCollapse = !this.isCollapse;
            },
            handleCommand(command) {
                if (command == 'loginOut') {
                    loginOut();
                }
            },
            loadingMenu(menu, key) {
                saveSession("rule-key", key);
                this.ruleKey = key;
                this.routeItem = this.isSecondPermission(this.ruleList[`${key}`].items);
                this.currMenu = menu.name;
            },
            //判断是否有二级菜单权限
            isSecondPermission(routes) {
                return routes.filter(item=>{
                    return item.subs.some(_item=>{
                        return _item.show
                    })
                })
            },
            fnChooseId(obj) {
                this.setJumpRouter();
                if (obj.which === "service") {
                    this.$router.push({path: 'inService', query: {tid: obj.tid}});
                } else {
                    this.$router.push({path: 'groupManagement', query: {tid: obj.tid, allMute: obj.allMute}});
                }

            },
            ...mapMutations({
                setJumpRouter: "service/setJumpRouter",
                setUserPersonalInfo: "userInfo/setUserPersonalInfo",
            }),
            systomPushClick(data) {
                console.log("系统推送点击：", data)
            },
            openLive(){
                window.open(`${service.liveLogin}?suserId=${this.user.id}`)
            }
        },
        created() {
            this.setUserPersonalInfo(this.user);//设置个人信息
            this.initChat();//如果是客服初始化
            if (this.ruleKey) {
                this.routeItem = this.isSecondPermission(this.ruleList[`${this.ruleKey}`].items)
            } else {
                for (let key in this.headMenu) {
                    console.log(this.headMenu)
                    this.ruleKey = key;
                    this.routeItem = this.isSecondPermission(this.ruleList[`${key}`].items);
                    console.log(this.routeItem);
                    return false;
                }
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        display: flex;
        height: 100vh;
    }

    .left-menu {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 232px;
        background: #393857;
    }

    .right-content {
        position: relative;
        overflow: hidden;
        flex-grow: 1;
        background-color: #edf0f5;
        display: flex;
        flex-direction: column;
        min-width: 1000px;
    }

    .xk-main {
        display: inline-flex;
        flex: 1;
        width:100%;
        height:100%;
    }

    .menu-header {
        flex-shrink: 0;
        height: 70px;
        padding: 0 20px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        background: #30304D;
    }

    .menu-header div {
        width: 70%;
        height: 1px;
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        bottom: -10px;
        left: 15%;
    }

    .collapse-btn {
        position: absolute;
        right: -10px;
        top: 200px;
        width: 10px;
        height: 40px;
        z-index: 99;
        background-color: red;
    }

    .header {
        height: 70px;
        background: url("//gc.xksquare.com/sh-headBack.png") no-repeat;
        background-size: 100% 100%;
    }

    .user {
        height: 70px;
        float: right;
        padding: 0 50px 0 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .user-div {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .user-img {
        position: relative;
        width: 25px;
        height: 25px;
        margin-right: 5px;
        border-radius: 50%;
    }

    .username {
        position: relative;
        display: inline-block;
        color: #ffffff;
        font-size: 16px;
    }

    .content {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 48px;
    }

    .title-one {
        display: inline-block;
        margin-top: 18px;
    }

    .title-two {
        display: inline-block;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
    }

    .fade-transverse-enter-active {
        transition: all .3s;
    }

    .fade-transverse-leave-active {
        transition: all 0s;
    }

    .fade-transverse-enter {
        opacity: 0;
        transform: translateX(-30px);
    }

    .fade-transverse-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    .nav-menu {
        float: left;
        margin-left: 20px;
        color: rgba(255, 255, 255, .6);
        font-size: 16px;
    }

    .nav-menu span {
        padding: 0 35px;
        display: inline-block;
        line-height: 70px;
    }

    .nav-menu span:hover {
        cursor: pointer;
        color: #ffffff;
    }

    .activeMenu {
        color: #ffffff;
    }

    .xk-logo {
        font-family: Impact;
        font-size: 20px;
        color: #ffffff;
    }

    .xk-menu-icon {
        width: 16px;
        cursor: pointer;
    }
</style>
