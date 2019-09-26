// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//promise 兼容处理
import 'babel-polyfill'

// import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store'
//进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//mathjs
import math from './util/math.js'

import axios, {getTemp} from './axios/index'
//初始化时间戳   用于数据签名  加密
getTemp();
// import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/**
 * element 自定义主题
 */
import './assets/sass/element-variables.scss'
import './assets/sass/index.scss'
import './assets/sass/dialog.scss'
/**
 * 字体图标
 */
import './icomoon/style.css'
import service from './service'
import './util/filters'
import {getSession, realNotAuth} from './util/publicMehotds'
import Pagination from './components/Pagination'

import {Message} from 'element-ui'

import "./util/dictionaries.js"

/**图片预览 */
import viewImage from "./components/viewImage/ViewImage";

import {errorHandler} from './util/error'

/**权限按钮 */
import permission from './util/directive.js';
Vue.use(permission);

Vue.config.productionTip = false;

/**
 * 全局错误监听
 * @param err
 * @param vm
 * @param info
 */
Vue.config.errorHandler = errorHandler;

Vue.prototype.$http = axios;
Vue.prototype.$api = service;
Vue.prototype.$size = "small";
Vue.prototype.$viewImage = viewImage;
Vue.prototype.$math = math;
Vue.prototype.$knowledgePointUrl = 'http://www.google.com/';
/**
 * 自动抛出异常   便于框架异常捕获
 * @param error
 */
Vue.prototype.$throw = (error) => errorHandler(error, this);

// Vue.use(ElementUi);

Vue.component('Pagination', Pagination);

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.path !== "/login") {
        let user = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
        if (user.token) {
            if (to.path !== "/welcome") {
                let arr = to.path.split("/");
                let map = JSON.parse(getSession("permission")) ? new Map(JSON.parse(getSession("permission"))) : null;
                if (!map.get(arr[1])) {
                    Message.error("你的权限不足，请联系管理员");
                    next({path: "/welcome"});
                    NProgress.done()
                } else {
                    next();
                }
            } else {
                next();
            }
        } else {
            //防止浏览器回退按钮
            window.history.forward(1);
            next({path: "/login"});
        }
    } else {
        next();
    }
})

router.afterEach(() => {
    NProgress.done()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})
