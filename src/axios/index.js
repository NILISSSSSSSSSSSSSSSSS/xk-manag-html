/**
 * Created by qiushaoyu on 2017/12/6.
 */
// import axios from 'axios'
import config from './config'
import service from '../service/index'
import {des3Decrypt, assembleParams, loginOut, outLoginTime, getSession} from '../util/publicMehotds'
import {errorHandler} from '../util/error'
import {Message, MessageBox} from 'element-ui'
import { platform } from 'os';

const http = {
    /**
     * axios Post请求
     * @param service  服务器API
     * @param params  对象参数
     * @param isEncrypt  data是否加密
     * @param timeout  请求超时时间
     * @returns {Promise}
     * @constructor
     */
    post(service, params, isEncrypt = false, timeout) {
        return new Promise((resolve, reject) => {
            params = assembleParams(service, params, isEncrypt);
            if (timeout) {
                config.timeout = timeout;
            }
            config.params = "";
            axios.post(service, params, config)
                .then(res => {
                    httpCallback(res, "post", resolve, reject);
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /**
     * axios  Get请求
     * @param service  服务器api
     * @param params  路径参数
     * @param isEncrypt  data是否加密
     * @returns {Promise}
     * @constructor
     */
    get(service, params, isEncrypt = false) {
        return new Promise((resolve, reject) => {
            params = assembleParams(service, params, isEncrypt);
            config.params = params;
            axios.get(service, config)
                .then(res => {
                    httpCallback(res, "get", resolve, reject);
                })
                .catch(err => {
                    reject(err);
                })

        })
    },
    /**
     * axios PHP Post请求
     * @param service  服务器API
     * @param params  对象参数
     * @param isEncrypt  data是否加密
     * @param timeout  请求超时时间
     * @param isPHP  PHP请求特殊处理
     * @returns {Promise}
     * @constructor
     */
    PhpPost(service, params, isEncrypt = false, timeout) {
        return new Promise((resolve, reject) => {
            // params = assembleParams(service, params, isEncrypt);
            if (timeout) {
                config.timeout = timeout;
            }
            config.params = "";
            axios.post(service, params, config)
                .then(res => {
                    //请求成功回调
                    httpCallback(res, "php", resolve, reject);
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /**
     * 
     * @param {*} service 
     * @param {*} params 
     * @param {*} isEncrypt 
     * @param {*} timeout   表格下载
     */
    downGet(service, params, isEncrypt = false, timeout) {

        return new Promise((resolve, reject) => {
            params = assembleParams(service, params, isEncrypt);
            config.params = params;
            config.responseType = 'blob';
            axios.get(service, config)
                .then(res => {
                    if(res.code===409) {
                        resolve({
                            message: '数据为空'
                        })
                        return false;
                    }
                    try {
                        let blob = res.data;
                        let reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = function (e) {
                            let elink = document.createElement('a');
                            elink.download = decodeURI(res.headers['content-disposition'].split("=")[1]);  //下载的文件名
                            elink.style.display = 'none';
                            elink.href = URL.createObjectURL(blob);
                            $("body").append(elink);    // 修复firefox中无法触发click
                            elink.click();
                            $(elink).remove();
                            resolve({
                                message: '导出成功'
                            })
                        }
                    } catch(e) {
                        reject(e)
                    }
                    
                })
                .catch(err => {
                    reject(err);
                })
                .finally(()=>{
                    config.responseType = 'json';
                })
        })
    },
    downFile(url, fileName) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.onreadystatechange=function() {
            if(xhr.status == 200) {
                let eleLink = document.createElement('a');
                eleLink.download = fileName;
                eleLink.style.display = 'none';
                let blob = new Blob([xhr.response]);
                eleLink.href = URL.createObjectURL(blob);
                document.body.appendChild(eleLink);
                eleLink.click();
                document.body.removeChild(eleLink);
            }
        }
    }
};

/**
 * http返回处理
 */
function httpCallback(res, type, resolve, reject) {
    //请求成功回调
    if (res.data.code === 200) {
        resolve(res.data.body);
    }//服务器错误
    else if (res.data.code === 500) {
        reject(res.data.message ? res.data : {code: 500, message: "服务器异常，错误码：500"});
        errorHandler({...res, type: "api"});  // 错误上报 服务器500异常
    } else if (res.data.code === 409) {
        //查询结果为空
        resolve("");
    } else if (res.data.code === 415) {
        //415  该接口为缓存接口   服务端未更新数据缓存  前端不更新数据缓存
        resolve("");
    }
    //其它异常
    else {
        reject(res.data);
    }
}

/**
 * 不需要验证token的接口
 * @type {Array}
 */
const noCheckUrl = [service.regionPage];

/***
 * 不需要验证resultCode 的API
 * @param api
 * @returns {boolean}
 */

function checkUrl(api) {
    return noCheckUrl.some((v, i) => (v === api));
}

export function getTemp() {
    let temp = localStorage.getItem("timestamp");
    if (!temp || !temp.temp) {
        http.get(service.timestamp, {})
            .then(res => {
                const obj = {
                    temp: res.timestamp,
                    currentTemp: Date.parse(new Date())
                };
                localStorage.setItem("timestamp", JSON.stringify(obj));
            })
            .catch(err => {
                Message.error("获取systemTime失败")
            })
    }
}

axios.interceptors.response.use(response => {
    // IE 8-9
    if (response.data) {
        response.data = responseSet(response.data);
        return response;
    }
    if (response.data == null && response.config.responseType === 'json' && response.request.responseText != null) {
        try {
            let data = JSON.parse(response.request.responseText);
            response.data = responseSet(data);
        } catch (e) {
        }
    }
    return response;
})


function responseSet(data) {
    // http 500
    if (!data) {
        return "";
    }
    //单独处理文件上传到七牛云时判断
    if(!data.body && data.hash) {
        return data;
    }
    //判断是否需要解密
    data.body = data.key ? JSON.parse(des3Decrypt(data.body, data.key)) : data.body ? typeof data.body === "object" ? data.body : JSON.parse(data.body) : data.body;
    switch (data.code) {
        case 400:
            MessageBox.confirm("请求错误，请重试。", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {

            });
            break;
        case 403:
            MessageBox.confirm("拒绝访问", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {
                //删除用户信息  然后刷新页面
                location.reload();
            });
            break;
        case 404:
            MessageBox.confirm("请求接口不存在", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {

            });
            break;
        case 405:
            //删除本地时间戳  重新拉取服务器时间戳
            localStorage.removeItem("timestamp");
            getTemp();
            MessageBox.confirm("请求超时，请重新发送请求", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {

            });
            break;
        case 406:
            MessageBox.confirm("权限不足，请联系管理员", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {

            });
            break;
        case 413:
            MessageBox.confirm("token失效，请重新登录", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {
                loginOut();
                location.reload();
            });
            outLoginTime();
            break;
        case 1413:
            MessageBox.confirm("token验证失败，请重新登录", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {
                loginOut();
                location.reload();
            });
            outLoginTime();
            break;
        case 1349:
            MessageBox.confirm("您已被强制下线，请重新登录", "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {
                loginOut();
                location.reload();
            });
            outLoginTime();
            break;
        case 1356:
            MessageBox.confirm(`你的账号已冻结，如有疑问请联系平台(${getSession('platform-phone') ? getSession('platform-phone') : ''})`, "提示", {
                type: 'warning',
                showCancelButton: false
            }).then(res => {
                loginOut();
                location.reload();
            });
            outLoginTime();
            break;
    }
    return data;
}

export default http;