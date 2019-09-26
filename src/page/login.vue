<template>
    <div class="login">
        <div class="login-container">
            <img class="login-back" src="//gc.xksquare.com/11.png" alt="">
            <div class="login-info">
                <p class="login-name">XIAOKE SQUARE</p>
                <div class="login-desc">
                    <p class="title">晓可广场后台管理系统</p>
                    <p class="desc">Xiao Ke square backstage management system</p>
                </div>
            </div>
        </div>
        <div class="login-form">
            <p class="login-title">Sign Up</p>
            <p class="login-join">登录</p>
            <el-form @keyup.enter.native="submitForm()" :model="xkadmin" ref="xkadmin" class="demo-ruleForm">
                <el-form-item prop="account">
                    <i class="icon-user icon-login"></i>
                    <el-input style="width: 100%" type="account" clearable v-model.number.trim="xkadmin.phone"
                              auto-complete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <i class="icon-password icon-login"></i>
                    <el-input style="width: 100%" :type="showPwd? '': 'password'" v-model.number.trim="xkadmin.password"
                              auto-complete="off" placeholder="请输入用户密码"></el-input>
                    <img class="show-pwd" @click="showPwd=!showPwd"
                         :src="showPwd? '//gc.xksquare.com/openeye.png': '//gc.xksquare.com/closeeye.png'" alt="">
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="sub-btn" :loading="submitLoading" @click="submitForm()">登 录
                    </el-button>
                </el-form-item>
                <div class="remember">
                    <el-checkbox v-model="checked">记住密码</el-checkbox>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {detectOS, combine, saveSession, saveCookie, getCookie} from '../util/publicMehotds'
    import {loginInit} from '../util/dictionaries'

    export default {
        data() {
            return {
                xkadmin: {
                    phone: '',
                    password: '',
                    guid: "xk-pc",
                    os: detectOS()
                },
                submitLoading: false,
                showPwd: false,
                checked: false
            };
        },
        created() {
            let xkUser = JSON.parse(getCookie('remember'));
            if (xkUser) {
                [this.xkadmin.phone, this.xkadmin.password, this.checked] = [xkUser.phone, xkUser.password, xkUser.checked];
            }
        },
        methods: {
            submitForm() {
                if (!this.xkadmin.phone) {
                    this.$message.error("请输入你的用户名");
                    return false;
                }
                if (!this.xkadmin.password) {
                    this.$message.error("密码不能为空");
                    return false;
                }
                if (this.xkadmin.password.length < 6) {
                    this.$message.error("密码不能少于6位");
                    return false;
                }
                this.submitLoading = true;
                this.$http.post(this.$api.login, this.xkadmin, true)
                    .then(res => {
                        let roles = [];
                        for (let item of res.roles) {
                            roles = combine(roles, item.keyList);
                        }
                        let roleMap = [];
                        for (let item of roles) {
                            roleMap.push([item, item])
                        }
                        saveSession('platform-phone', res.platformPhone); // 平台联系电话
                        saveSession("xk-role", JSON.stringify(roleMap));
                        saveSession("xk-user", JSON.stringify(res.user));
                        saveSession("xk-im-account", JSON.stringify(res.userImAccount));
                        loginInit();
                        let role = require("../menu/index").default;
                        let map = [];
                        let headMenu = {};
                        for (let key in role) {
                            let flag = false;
                            if (role.hasOwnProperty(key)) {
                                for (let item of role[key].items) {
                                    if (item.subs && item.subs.length > 0) {
                                        for (let val of item.subs) {
                                            map.push([val.index, val.show]);
                                            if (val.show && !flag) {
                                                flag = true;
                                            }
                                        }
                                    } else {
                                        map.push([item.index, item.show]);
                                        if (item.show && !flag) {
                                            flag = true;
                                        }
                                    }
                                }
                                if (flag) {
                                    headMenu[`${key}`] = {
                                        name: role[`${key}`].name
                                    }
                                }
                            }
                        }
                        const other = require("../menu/index").otherRule;
                        for (let key in other) {
                            if (other.hasOwnProperty(key)) {
                                map.push([key, other[key]])
                            }
                        }
                        saveSession("permission", JSON.stringify(map));
                        saveSession("headMenu", JSON.stringify(headMenu));
                        this.$router.push({path: "welcome"});

                        //保存用户名及密码
                        if (this.checked) {
                            saveCookie("remember", JSON.stringify({
                                phone: this.xkadmin.phone,
                                password: this.xkadmin.password,
                                checked: this.checked
                            }))
                        } else {
                            saveCookie("remember", JSON.stringify(""))
                        }
                        //这里只是一个登录界面UE优化
                        setTimeout(() => {
                            this.submitLoading = false;
                        }, 2000)
                    })
                    .catch(err => {
                        this.submitLoading = false;
                        this.$message.error(err.message);
                    })
            }
        }
    }
</script>
<style lang="scss">
    .login {
        height: 100%;
        position: relative;
        background-color: #393857;;
        overflow: hidden;
        .login-container {
            position: absolute;
            width: 50%;
            left: 12%;
            top: 50%;
            transform: translateY(-50%);
        }
        .login-back {
            width: 100%;
            /*height: 62vh;*/
            box-shadow: 5px 8px 25px 8px rgba(0, 0, 0, 0.2);
        }
        .login-info {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(57, 56, 87, .6);
            padding: 9% 0 13% 9%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .login-name {
                font-family: Impact;
                font-size: 40px;
                color: #FFFFFF;
            }
            .login-desc {
                .title {
                    font-size: 32px;
                    color: #FFFFFF;
                }
                .desc {
                    font-size: 21px;
                    color: #C2C2C2;
                }
            }
        }
        .login-form {
            position: absolute;
            background: #FFFFFF;
            box-shadow: 0 6px 21px 9px rgba(37, 37, 56, 0.06);
            border-radius: 10px;
            width: 28%;
            /*height: 74vh;*/
            right: 14%;
            top: 50%;
            transform: translateY(-50%);
            padding: 5% 4% 6% 4%;
            .login-title {
                opacity: 0.8;
                font-family: Impact;
                font-size: 40px;
                color: #393857;
            }
            .login-join {
                opacity: 0.8;
                font-size: 26px;
                color: #393857;
            }
            .sub-btn {
                width: 100%;
                margin-top: 30%;
            }
        }
        .demo-ruleForm {
            width: 100%;
            margin-top: 26%;
            .el-button--xk-btn {
                width: 100%;
                color: #ffffff;
                background: rgba(0, 0, 0, 0.14);
                border: 0;
                /*letter-spacing: 10px*/
            }
            .el-button--xk-btn:hover {
                color: #ffffff;
                background: rgba(0, 0, 0, 0.14);
            }
            .el-input__inner {
                padding: 0 70px;
                border: none;
                border-bottom: 1px solid rgba(155, 153, 230, .6);
                border-radius: 0;
            }
            .el-form-item:first-child {
                margin-bottom: 40px;
            }
            .el-form-item__content {
                position: relative;
                .icon-login {
                    font-size: 20px;
                    color: #393857;
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                }
                .div {
                    width: 1px;
                    height: 30px;
                    position: absolute;
                    left: 50px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    background: #868B9D
                }
            }
        }
        .show-pwd {
            position: absolute;
            width: 20px;
            height: 20px;
            right: 0;
            top: 12px;
            z-index: 66666;
            cursor: pointer;
        }
        .remember {
            text-align: right;
        }
    }
</style>
