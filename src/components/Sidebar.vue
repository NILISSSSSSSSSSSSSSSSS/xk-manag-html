<template>
    <div class="xk-menu">
        <el-menu :collapse="collapse" :background-color="backColor" :text-color="textColor" mode="vertical"
                 :active-text-color="activeColor" :default-active="onRoutes" class="el-menu-vertical-demo"
                 unique-opened
                 router>
            <template v-for="(item,index) in routeItem">
                <template v-if="item.subs">
                    <el-submenu v-if="showMenu(item)" :index="item.index" :key="item.index" >
                              <!-- :class="item.index===clickIndex && clickIndex.indexOf(currMenu) !==-1? 'is-active is-opened is-sub-ul': ''"   -->
                        <template slot="title"><i class="icon-xk-menu" :class="item.icon"></i> <span slot="title">{{ item.title }}
                            <div class="xk-red-dot" v-if="item.title === '用户管理' && realCount > 0"></div>
                        </span>
                        </template>
                        <template v-for="(subItem,i) in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(menu,index) in subItem.subs" :key="index" :index="menu.index">
                                    {{menu.title}}
                                </el-menu-item>
                            </el-submenu>

                            <el-menu-item :class="className=== subItem.index +'test'+index? 'is-active is-actived': ''"
                                          @click="refresh(subItem.index,index, item.index)" v-else-if="subItem.show"
                                          :key="i"
                                          :index="subItem.index">
                                {{subItem.title}}
                                <div class="xk-red-dot" v-if="subItem.index === 'realAuth' && realCount > 0"></div>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index"
                                  v-if="item.show"
                                  :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex'
    import {getSession} from '@/util/publicMehotds.js'
    export default {
        inject: ['reload'],
        props: {
            collapse: {
                type: Boolean,
                default: false
            },
            routeItem: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                isCollapse: false,
                oldIndex: "",
                backColor: "rgba(0,0,0,0)",
                textColor: "rgba(255, 255, 255, .6)",
                activeColor: "#ffffff",
                className: sessionStorage.getItem('className') ? sessionStorage.getItem('className') : "",
                clickIndex: sessionStorage.getItem('subIndex') ? sessionStorage.getItem('subIndex') : '',
                currMenu: getSession('rule-key') ? getSession('rule-key') : '',
                haveRed: false
            }
        },
        computed: {
            onRoutes() {
                this.className = sessionStorage.getItem('className');
                this.currMenu = getSession('rule-key');
                this.clickIndex= sessionStorage.getItem('subIndex');
                return this.$route.path.replace('/', '');
            },
            ...mapState({
                realTree: state => state.redTree,
                realCount: state => state.redTree.countCommit
            }),
            // getKey() {
            //     return 
            // }
        },
        methods: {
            showMenu(item) {
                return item.subs.some((value) => (value.show === true))
            },
            refresh(path, preIndex, subIndex) {
                this.className = path+'test' + preIndex;
                sessionStorage.setItem('className', this.className);
                sessionStorage.setItem('subIndex', subIndex);
                this.oldIndex = this.$route.path;
                if (this.oldIndex === "/" + path) {
                    this.reload();
                }
            },
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        /* width: 272px; */
        width: 100%;
        min-height: 400px;
    }

    .is-actived {
        color: rgb(255, 255, 255) !important;
    }
</style>
<style>
    .is-sub-ul > ul {
        display: block !important;
    }
</style>