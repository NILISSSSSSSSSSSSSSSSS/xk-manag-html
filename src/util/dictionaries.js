import axios from '../axios/index'
import api from '../service/index'
import {Message} from 'element-ui'
import {getSession, getPermission} from './publicMehotds'
import store from '../store'
// import { mapMutations, mapState } from 'vuex'
// import { Level } from '_chalk@2.4.2@chalk';

let user = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
let version = 2;

///临时清除省市区
export function checkUpdate() {
    let xkVersion = localStorage.getItem("xk-address-version");
    if (!xkVersion || xkVersion < version) {
        localStorage.setItem("xk-address-version", version);
        localStorage.removeItem("xk-all-address");
    }
    localStorage.removeItem('updated');
    localStorage.removeItem("provinceVersion");
    localStorage.removeItem("cityVersion");
    localStorage.removeItem("districtVersion");
}

export function getAddress() {
    checkUpdate();
    for (let i = 0; i < 3; i++) {
        initAddress(i);
    }
}

async function initAddress(level) {
    let areaJson = [];

    switch (level) {
        case 0:
            areaJson = require('../../static/region/province.json');
            break;
        case 1:
            areaJson = require('../../static/region/city.json');
            break;
        case 2:
            areaJson = require('../../static/region/area.json');
            break;
    }

    let arr = [];
    for (let item of areaJson) {
        let obj = {
            id: item.id,
            name: item.name
        }
        level != 0 ? obj.parentCode = item.parentCode : null;
        arr.push([item.code, obj])
    }
    localStorage.setItem(level == 2 ? "xk-district" : level == 1 ? "xk-city" : "xk-province", JSON.stringify(arr));
    if (level == 2) {
        cacheProvince();
    }
}

function cacheProvince() {
    let result = [];
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));
    city.forEach((item, code) => {
        let arr = {
            cities: []
        };
        district.forEach((subItem, subCode) => {
            if (subItem.parentCode == code) {
                let obj = subItem;
                obj.code = subCode;
                obj.parentCode = code;
                arr.cities.push(obj)
            }
        })
        arr.code = code;
        arr.name = item.name;
        arr.parentCode = item.parentCode;
        result.push([code, arr]);
    })
    cacheAllAddress(result)
}

function cacheAllAddress(params) {
    let cities = new Map(params);
    let result = [];
    let province = new Map(JSON.parse(localStorage.getItem('xk-province')))
    province.forEach((item, code) => {
        let arr = {
            cities: []
        };
        cities.forEach((subItem, subCode) => {
            if (subItem.parentCode == code) {
                let obj = subItem;
                obj.code = subCode;
                arr.cities.push(obj)
            }
        })
        arr.code = code;
        arr.name = item.name;
        result.push(arr);
    })
    localStorage.setItem('xk-all-address', JSON.stringify(result));
}

//视角名字 ViewerType
function getViewer() {
    let data = [
        {
            value: 'USER',
            label: '晓可用户'
        },
        {
            value: 'PERSONAL',
            label: '个人'
        },
        {
            value: 'COMPANY',
            label: '合伙人'
        },
        {
            value: 'SHOPS',
            label: '商户'
        },
        {
            value: 'ANCHOR',
            label: '主播'
        },
        {
            value: 'FAMILYL1',
            label: '家族长'
        },
        {
            value: 'FAMILYL2',
            label: '公会'
        }];
    localStorage.setItem("viewerType", JSON.stringify(data))
}

//用户类型 UserType
function UserType() {
    let data = [
        {
            value: 'user',
            label: '晓可用户'
        },
        {
            value: 'muser',
            label: '商户用户'
        },
        {
            value: 'anchor',
            label: '主播'
        }];
    localStorage.setItem("UserType", JSON.stringify(data))
}

//小可模块 bannerModule
function bannerModule() {
    let data = [
        {
            value: 'XKSQUARE',
            label: '晓可广场'
        },
        {
            value: 'BUSINESS_AREA',
            label: '商圈首页'
        },
        {
            value: 'WELFARE',
            label: '夺奖派对首页(广场)'
        },
        {
            value: 'SELF_SHOP',
            label: '精选商城首页'
        },
        {
            value: 'MERCHANT_WELFARE',
            label: '夺奖派对首页(商户)'
        },
        {
            value: 'MERCHANT_SELF_SHOP',
            label: '批发商城首页'
        },
        {
            value: 'ALLIANCE',
            label: '晓可联盟首页'
        },
        {
            value: 'LIVE_VIDEO',
            label: '晓可直播首页'
        },
        {
            value: 'GAME',
            label: '游戏首页'
        },
        {
            value: 'WX_GAME',
            label: '微信服务号游戏中心首页'
        }];
    localStorage.setItem("bannerModule", JSON.stringify(data))
}

//客服列表
function customerQPage() {
    axios.get(api.customerQPage, {}, true).then(res => {
        localStorage.setItem("customerQPage", JSON.stringify(res))
    }).catch(err => {
        console.log(err)
    })

}

//店铺分类
function industryAllQList() {
    axios.get(api.industryAllQList, {}, true).then(res => {
        localStorage.setItem("industryAllQList", JSON.stringify(res))
    })
        .catch(err => {
            Message.error(err.message)
        })
}

//商户类型 MerchantType
function MerchantType() {
    let data = [
        {
            value: 'EXTENSION_WORKER',
            label: '个人'
        },
        {
            value: 'ZHUBO',
            label: '主播'
        },
        {
            value: 'MERCHANT',
            label: '商户'
        },
        {
            value: 'PARTNER',
            label: '合伙人'
        },
        {
            value: 'BROKERAGE_FIRM',
            label: '经济公司'
        }];
    localStorage.setItem("MerchantType", JSON.stringify(data))
}

//联盟商类型 AllianceMerchantType
function AllianceMerchantType() {
    let data = [
        {
            value: 'personal',
            label: '个人'
        },
        {
            value: 'anchor',
            label: '主播'
        },
        {
            value: 'shops',
            label: '商户'
        },
        {
            value: 'company',
            label: '公司（合伙人）'
        },
        {
            value: 'familyL1',
            label: '普通家族（家族长）'
        },
        {
            value: 'familyL2',
            label: '钻石家族（工会）'
        }];
    localStorage.setItem("AllianceMerchantType", JSON.stringify(data))
}

/**
 * 会员实名认证未审核,获取未审核的数量
 */
export function realNotAuth() {
    let count = 0;
    let paramList = {
        page: 0,
        limit: 0,
        authStatus: 'SUBMIT'
    }
    if (!getPermission("realAuthSearch")) return;
    axios.get(api.xkUserAuthPage, paramList, true)
        .then(res => {
            if (res) {
                store.state.redTree.countCommit = res.data ? res.data.length : 0
            } else {
                store.state.redTree.countCommit = 0
            }
            console.log('count', store.state.redTree.countCommit)
            //   console.log('count', store)
        })
        .catch(err => {
            Message.error(err.message)
            console.log('store', store)
        })
}

/**
 * 需要登录后初始化的内容
 */
export function loginInit() {
    // getAddress();
    customerQPage();
    industryAllQList();
    realNotAuth();
}


if (user.token) {
    loginInit();
}

{
    getViewer();
    bannerModule();
    UserType();
    MerchantType();
    AllianceMerchantType();
    getAddress();
}
