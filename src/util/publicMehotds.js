//公共方法
import CryptoJS from 'crypto-js'
import {signKey, dataKey, uploadPath, xkMangeVersion, alias} from './publicParams'
import http from '../axios/index'
import api from '../service/index'
import {Message} from 'element-ui'

/**
 * 判断系统(android/ios)
 * @returns {string}
 */
export const system = () => {
    const u = navigator.userAgent;

    let name;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        name = 'android';
    } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        name = 'ios';
    } else {
        name = 'unknown';
    }

    return name;
};

/**
 * 调用native的方法
 * @param fun  方法名
 * @param params  参数
 */
export function callNative(fun, params) {
    if (system() === "android") {
        Android[fun](params);
    } else if (system() === "ios") {
        window.webkit.messageHandlers[fun].postMessage(params);
    }
}

/**
 * 获取路径参数
 * @param key
 * @returns {any}
 */
export function queryParam(key) {
    let uri = window.location.href;
    let re = new RegExp("" + key + "\=([^\&\?]*)", "ig");
    return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
}

/**
 * 保存cookie
 * @param key
 * @param str
 * @param days  //cookie保存时间   X / 天
 */
export function saveCookie(key, str, days) {
    // let Days = 1; //此 cookie 将被保存 1 天
    let exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = key + "=" + str + ";expires=" + exp.toGMTString();
}

/**
 * 获取cookie
 * @param key
 * @returns {*}
 */
export function getCookie(key) {  //获取指定名称的cookie的值
    let arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
    if (arr != null) {
        return arr[2];
    }
    return null;
}

/**
 * 存储session
 * @param key
 * @param str
 */
export function saveSession(key, str) {
    sessionStorage.setItem(key, des3("123321", str));
    sessionStorage.setItem(alias.catchVersion, xkMangeVersion);
}

/**
 * 根据key获取session
 * @param key
 * @returns {string}
 */
export function getSession(key) {
    return sessionStorage.getItem(key) ? des3Decrypt(sessionStorage.getItem(key), "123321") : "";
}

/**
 * 退出登录
 */
export function loginOut() {
    sessionStorage.removeItem("xk-role");
    sessionStorage.removeItem("xk-user");
    sessionStorage.removeItem("permission");
    sessionStorage.removeItem("rule-key");
    sessionStorage.removeItem("headMenu");
    sessionStorage.removeItem("className");
    sessionStorage.removeItem("subIndex");
    location.reload();
}

//判断是否是微信浏览器的函数
export function isWeiXin() {
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取随机数
 * @param len   随机数长度
 * @returns {string}
 * @constructor
 */
export function mathRand(len) {
    let num = "";
    for (let i = 0; i < len; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

/**
 * 3des 加密data
 * @param salt
 * @param data
 * @returns {string}
 */
export function des3(salt, data) {
    const md5_hash = CryptoJS.MD5(salt + "" + dataKey).toString();
    return CryptoJS.TripleDES.encrypt(data, CryptoJS.enc.Utf8.parse(md5_hash), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

/**
 * 3des  data内容解密
 * @param data
 * @param key
 * @returns {string}
 */
export function des3Decrypt(data, key) {
    const md5_hash = CryptoJS.MD5(key + "" + dataKey).toString();
    return CryptoJS.TripleDES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(data)
    }, CryptoJS.enc.Utf8.parse(md5_hash), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}


//获取客户端操作系统类型
export function detectOS() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWin2003 = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWin2003) return "WinVista";
        var isWin2003 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin2003) return "Win7";
    }
    return "None";
}

let os = detectOS();


/**
 * 重新组装params  生成sign
 * @param service
 * @param param
 * @param isEncrypt  //data是否加密
 * @returns {{service: *, timestamp: number, version: string, salt: string, sign: *, data: string}}
 */
export function assembleParams(service, param, isEncrypt = false) {
    let user = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
    if (user) {
        param.userId = user.id;
        param.token = user.token;
        param.os = os;
    }
    const arr = service.split("/");
    const api = arr[arr.length - 2];
    const version = arr[arr.length - 1];
    const timestamp = getTimestamp();
    const salt = mathRand(6);
    const data = isEncrypt ? des3(salt, JSON.stringify(param)) : JSON.stringify(param);
    return {
        service: api,
        timestamp,
        version: version,
        salt,
        sign: CryptoJS.MD5(api + timestamp + data + version + salt + signKey).toString(),
        data
    };
}

/**
 * 数组合并去重
 * @returns {any[]}
 */
export function combine() {
    let arr = [].concat.apply([], arguments);  //没有去重复的新数组，之后用Set数据结构的特性来去重
    return Array.from(new Set(arr));
}

/**
 * 获取签名时间戳
 * @returns {*}
 */
function getTimestamp() {
    let temp = localStorage.getItem("timestamp") ? JSON.parse(localStorage.getItem("timestamp")) : {}
    if (temp && temp.temp) {
        return temp.temp + (Date.parse(new Date()) - temp.currentTemp);
    } else {
        return Date.parse(new Date());
    }
}


/**
 * 获取七牛上传token
 * @returns {Promise<*>}
 */
export async function getQiNiuToken() {
    const token = getCookie("qiniu_token");
    if (!token) {
        let res = await http.get(api.qiniu_token, {}, true);

        if (!res) {
            Message.error("获取七牛token失败");
            return false;
        }
        saveCookie("qiniu_token", res.upToken, .04);
        return res.upToken;
    }
    return token;
}


/**
 * 修改数组中对象的key
 * @param arr
 * @param oldKey
 * @param newKey
 * @returns {Array}
 */
export function convertKey(arr, oldKey, newKey) {
    let newArr = [];
    arr.forEach((item, index) => {
        let newObj = {};
        for (let i = 0; i < newKey.length; i++) {
            if (item[oldKey[i]] instanceof Array && item[oldKey[i]].length > 0) {
                newObj[newKey[i]] = convertKey(item[oldKey[i]], oldKey, newKey);
            } else {
                for (let key of  Object.keys(item)) {
                    let oldKeys = oldKey[i].split(",");
                    for (let old of oldKeys) {
                        if (key === old) {
                            newObj[newKey[i]] = item[key];
                        }
                    }

                }
            }
        }
        newArr.push(newObj);
    });
    return newArr;
}

// let arr = [{"code": 1001, "name": "服务类", "goodsCatalogs": [{"name": "CS", "id": "5bdabc050334556ca5693bbe"}]}];
// console.log(convertKey(arr, ["code,id", "name", "goodsCatalogs"], ['value', 'label', 'children']));

/**
 * 将数组转换为tree
 * @param data
 * @param key
 * @returns {Array}
 */
function toTree(data, key) {
    // 删除 所有 children,以防止多次调用
    /*
        data.forEach(function (item) {
            delete item.children;
        });
    */

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    let map = {};
    data.forEach(function (item) {
        map[item.id] = item;
    });
//        console.log(map);
    let val = [];
    data.forEach(function (item) {
        // 以当前遍历项，的key,去map对象中找到索引的id
        let parent = map[item[key]];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });
    return val;
}

// console.log(toTree(data,"pid"))

/**
 * 图片上传
 * file base64文件
 */
export function uploadFile(file, qiniu_token, call) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            call(JSON.parse(xhr.responseText).hash)
        }
    }
    xhr.open("POST", uploadPath + "putb64/-1", true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Authorization", "UpToken " + qiniu_token);
    xhr.send(file);
}

/**
 * 检测用户是否拥有相应权限
 * @param key
 */
let roleMap = "";

export function getPermission(key) {
    if (!key) return false
    if (!roleMap) {
        const roles = getSession("xk-role") ? JSON.parse(getSession("xk-role")) : [];
        roleMap = new Map(roles)
    }
    return roleMap.get(key) ? true : false
}

//释放内存
/**
 * 获取uuid
 * @returns {string}
 */
export function getUUid() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

/*

window.onbeforeunload = function (e) {
    console.log(e);
    e = e || window.event;
    // 兼容IE8和Firefox 4之前的版本
   /!* if (e) {
        e.returnValue = '关闭提示';
    }*!/

    //获取事件鼠标的位置
    var n = window.event.screenX - window.screenLeft;
    //获取浏览器界面可活动的窗口宽度（50是右上角关闭按钮的宽度）
    var b = n > document.documentElement.scrollWidth-50;
    //window.event.clientY表示事件的y值（鼠标）
    //window.event.altKey表示是否按下列alt键（alt+F4）
    if(b && e.clientY < 0 || e.altKey) {
        alert("是关闭而非刷新");
        e.returnValue ="是否要离开此页面？";
    }else{
        e.stop();
    }
    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return '关闭提示';

}*/
/**
 * 根据区的code获取省市区
 */
export function getPorvinceInfo(distCode) {
    try {
        if (!distCode) {
            return '全国'
        }
        if (distCode == 0 || distCode == '000000') {
            return "全国"
        }
        let province = new Map(JSON.parse(localStorage.getItem("xk-province")));
        let citys = new Map(JSON.parse(localStorage.getItem("xk-city")));
        let district = new Map(JSON.parse(localStorage.getItem("xk-district")));

        let codeStr = distCode.toString(),
            pStr = codeStr.substring(2, 6),
            cStr = codeStr.substring(4, 6);

        if (pStr === '0000') {
            return province.get(codeStr).name;
        }
        if (cStr === '00') {
            let city = citys.get(codeStr);
            let pro = province.get(city.parentCode).name;

            return pro + city.name
        }
        let dis = district.get(codeStr);
        let city = citys.get(dis.parentCode);
        let pro = province.get(city.parentCode).name;

        return pro + city.name + dis.name;
    } catch (e) {
        return distCode;
    }
}

//token 失效自动退出系统
export function outLoginTime() {
    setTimeout(() => {
        loginOut();
        location.reload();
    }, 15000)
}


/**
 * 枚举转换
 * @param val   需要被转换的枚举字段
 * @param config   非必传，默认为{ key: 'key', value: 'value' }
 * @param enumData   枚举对象
 */
export function enumFormatter(val, enumData, config) {
    if (!enumData instanceof Array) return;
    let key = 'key',
        value = 'value';
    if (typeof config === 'object') {
        config.key ? key = config.key : null;
        config.value ? value = config.value : null;
    }

    for (let item of enumData) {
        if (item[key] == val) {
            return item[value]
        }
    }
    return val;
}

// 检测当前环境是否是新版本
export function checkUpdateVersion() {
    localStorage.getItem('sysVersion')
}

/**
 * 比对catch版本号清除缓存
 * @param flag  强制清除
 */
export function clearCatch(flag = false) {
    let version = sessionStorage.getItem(alias.catchVersion);
    if (version !== xkMangeVersion || flag) {
        loginOut()
        sessionStorage.setItem(alias.catchVersion, xkMangeVersion)
    }
}


/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
};
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, t) => {
    let last;
    let timer;
    let interval = t || 500;
    return function () {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
};

/**
 * 获取推送消息，设置红点数
 */
// export function setVuexRedTree(val) {
//     switch(val.content.data.type) {
//         case '400063': // 有新的实名认证需要处理

//     }
// }