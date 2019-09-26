import Main from '../../page/main'
// 用户管理
const members = r => require.ensure([], () => r(require('../../page/operate/user/members')), 'members');
const merchants = r => require.ensure([], () => r(require('../../page/operate/user/merchants')), 'merchants');
const realAuth = r => require.ensure([], () => r(require('../../page/operate/user/realAuth')), 'realAuth');
const userDetail = r => require.ensure([], () => r(require('../../page/operate/user/userDetail')), 'userDetail');
const reconmmendDetail = r => require.ensure([], () => r(require('../../page/operate/user/reconmmendDetail')), 'reconmmendDetail');
// 会员详情相关
const businessDetail = r => require.ensure([], () => r(require('../../page/operate/user/businessDetail')), 'businessDetail');
const merchantDetail = r => require.ensure([], () => r(require('../../page/operate/user/merchantDetail')), 'merchantDetail');
const storeSecAuditInfo = r => require.ensure([], () => r(require('../../page/operate/user/storeSecAuditInfo')), 'storeSecAuditInfo');
const userAccount = r => require.ensure([], () => r(require('../../page/operate/user/userAccount')), 'userAccount');
const userGameList = r => require.ensure([], () => r(require('../../page/operate/user/userGameList')), 'userGameList');
const userGameDetail = r => require.ensure([], () => r(require('../../page/operate/user/userGameDetail')), 'userGameDetail');
const userGiftRecord = r => require.ensure([], () => r(require('../../page/operate/user/userGiftRecord')), 'userGiftRecord');
const userGiftDetail = r => require.ensure([], () => r(require('../../page/operate/user/userGiftDetail')), 'userGiftDetail');
const orderLotteryDetail = r => require.ensure([], () => r(require('../../page/operate/user/orderDetail/orderLotteryDetail')), 'orderLotteryDetail');
const orderPlatformDetail = r => require.ensure([], () => r(require('../../page/operate/user/orderDetail/orderPlatformDetail')), 'orderPlatformDetail');
const orderRedDetail = r => require.ensure([], () => r(require('../../page/operate/user/orderDetail/orderRedDetail')), 'orderRedDetail');
const orderSelfMallDetail = r => require.ensure([], () => r(require('../../page/operate/user/orderDetail/orderSelfMallDetail')), 'orderSelfMallDetail');
const orderShopDetail = r => require.ensure([], () => r(require('../../page/operate/user/orderDetail/orderShopDetail')), 'orderShopDetail');
const userOrderRecord = r => require.ensure([], () => r(require('../../page/operate/user/userOrderRecord')), 'userOrderRecord');
const userLotteryRecord = r => require.ensure([], () => r(require('../../page/operate/user/userLotteryRecord')), 'userLotteryRecord');
const userReadRecord = r => require.ensure([], () => r(require('../../page/operate/user/userReadRecord')), 'userReadRecord');

// 海淘实名认证
const haitaoAuth = r => require.ensure([], () => r(require('../../page/operate/user/haitaoAuth')), 'haitaoAuth');


// 商圈详情
const buinessMallDetail = r => require.ensure([], () => r(require('../../page/operate/user/mallDetail/buinessMallDetail')), 'buinessMallDetail');




const audit = r => require.ensure([], () => r(require('../../page/operate/user/audit')), 'audit');
const orderRecord = r => require.ensure([], () => r(require('../../page/operate/user/orderRecord')), 'orderRecord');
const memOrderDetails = r => require.ensure([], () => r(require('../../page/operate/user/memOrderDetails')), 'memOrderDetails');
const merchantsDetails = r => require.ensure([], () => r(require('../../page/operate/user/merchantsDetails')), 'merchantsDetails');
const checkGoods = r => require.ensure([], () => r(require('../../page/operate/user/checkGoods')), 'checkGoods');
const merchantDetails = r => require.ensure([], () => r(require('../../page/operate/user/merchantDetails')), 'merchantDetails');
const storeDetails = r => require.ensure([], () => r(require('../../page/operate/user/storeDetails')), 'storeDetails');
const storeAudit = r => require.ensure([], () => r(require('../../page/operate/user/storeAudit')), 'storeAudit');
const merchantAudit = r => require.ensure([], () => r(require('../../page/operate/user/merchantAudit')), 'merchantAudit');
const storeAuditDetails = r => require.ensure([], () => r(require('../../page/operate/user/storeAuditDetails')), 'storeAuditDetails');
const partnerAuditDetails = r => require.ensure([], () => r(require('../../page/operate/user/partnerAuditDetails')), 'partenrAuditDetails');
const promoteAuditDetails = r => require.ensure([], () => r(require('../../page/operate/user/promoteAuditDetails')), 'promoteAuditDetails');
const hostAuditDetails = r => require.ensure([], () => r(require('../../page/operate/user/hostAuditDetails')), 'hostAuditDetails');
const merchantAuditDetails = r => require.ensure([], () => r(require('../../page/operate/user/merchantAuditDetails')), 'merchantAuditDetails');
const merchantAuditAudit = r => require.ensure([], () => r(require('../../page/operate/user/merchantAuditAudit')), 'merchantAuditAudit');
const RelateHost = r => require.ensure([], () => r(require('../../components/operate/user/RelateHost')), 'RelateHost'); // 商户关联主播组件


const userGroupsList = r => require.ensure([], () => r(require('../../page/operate/user/userGroupsList')), 'userGroupsList');
const setupUserGroup = r => require.ensure([], () => r(require('../../page/operate/user/setupUserGroup')), 'setupUserGroup');
const addGroupMembers = r => require.ensure([], () => r(require('../../page/operate/user/addGroupMembers')), 'addGroupMembers');
const editUserGroup = r => require.ensure([], () => r(require('../../page/operate/user/editUserGroup')), 'editUserGroup');

const userList = r => require.ensure([], () => r(require('../../page/operate/user/userList')), 'userList');


// 商品管理
const goodsDetails = r => require.ensure([], () => r(require('../../page/operate/goods/goodsDetails')), 'goodsDetails');
const goodsAuditDetails = r => require.ensure([], () => r(require('../../page/operate/goods/goodsAuditDetails')), 'goodsAuditDetails');
const haveAuditGoods = r => require.ensure([], () => r(require('../../page/operate/goods/haveAuditGoods')), 'haveAuditGoods');
const notAuditGoods = r => require.ensure([], () => r(require('../../page/operate/goods/notAuditGoods')), 'notAuditGoods');


// 平台监管
const feedback = r => require.ensure([], () => r(require('../../page/operate/platform/feedback')), 'feedback');
const InfoGoodsDetails = r => require.ensure([], () => r(require('../../page/operate/platform/goodsDetails')), 'InfoGoodsDetails');
const InfoPersonDetails = r => require.ensure([], () => r(require('../../page/operate/platform/personDetails')), 'InfoPersonDetails');
const userRegulation = r => require.ensure([], () => r(require('../../page/operate/platform/userRegulation')), 'userRegulation');
const superviseBlackList = r  => require.ensure([], () => r(require('../../page/operate/platform/superviseBlackList')), 'superviseBlackList');

//晓可币充值

const xkCurrency = r => require.ensure([], () => r(require('../../page/operate/platform/xkCurrency')), 'xkCurrency');

import category from './category'//分类管理

import advert from './advert'//广告推送管理

import platformSet from './platformSet'//平台设置

import card from './card'  //卡券管理
import info from "./info" // 短信模板管理
import game from './game'  //游戏管理
import city from './city'   //城市发展管理
import business from "./business"  //商圈业务管理

export default {
    path: '/',
    component: Main,
    children: [
        { //会员列表
            path: '/members',
            component: members
        },
        { //商户列表
            path: '/merchants',
            component: merchants
        },
        { // 商户审核列表--
            path: '/audit',
            component: audit
        },
        { // 会员列表->订单记录
            path: '/orderRecord',
            component: orderRecord
        },
        { // 会员列表->订单记录->订单详情
            path: '/memOrderDetails',
            component: memOrderDetails
        },
        { // 商户列表->店铺详情
            path: '/memMerchantsDetails',
            component: merchantsDetails
        },
        { //商户列表->店铺详情->查看商品
            path: '/merCheckGoods',
            component: checkGoods
        }, { //商户列表->查看商户详情
            path: "/memMerchantDetails",
            component: merchantDetails
        },
        { //店铺详情
            path: "/storeDetails",
            component: storeDetails
        },
        { // 店铺审核列表
            path: "/storeAudit",
            component: storeAudit
        },
        { // 商户审核列表
            path: "/merchantAudit",
            component: merchantAudit
        },
        { // 商户审核审核
            path: "/merchantAuditAudit",
            component: merchantAuditAudit
        },
        { // 商铺审核详情
            path: "/storeAuditDetails",
            component: storeAuditDetails
        },
        { // 合伙人审查详情
            path: "/partnerAuditDetails",
            component: partnerAuditDetails
        },
        { // 推广人员审核详情
            path: "/promoteAuditDetails",
            component: promoteAuditDetails
        },
        { // 主播审核详情
            path: "/hostAuditDetails",
            component: hostAuditDetails
        },
        { // 商户审核详情
            path: "/merchantAuditDetails",
            component: merchantAuditDetails
        },
        { // 商品详情
            path: "/goodsDetails",
            component: goodsDetails
        },
        { //已审核商品列表
            path: "/haveAuditGoods",
            component: haveAuditGoods
        },
        { //未审核商品列表
            path: "/notAuditGoods",
            component: notAuditGoods
        },
        { // 商品审核详情
            path: "/goodsAuditDetails",
            component: goodsAuditDetails
        },
        { // 意见反馈
            path: "/feedback",
            component: feedback
        },
        { // 意见反馈(个人)->个人详情
            path: "InfoPersonDetails",
            component: InfoPersonDetails
        },
        { // 意见反馈(商品)->商品详情
            path: "InfoGoodsDetails",
            component: InfoGoodsDetails
        },
        { // 监管黑名单
            path: 'superviseBlackList',
            component: superviseBlackList
        },
        { // 用户IM监管
            path: "userRegulation",
            component: userRegulation
        },
        { // 用户组列表
            path: "userGroupsList",
            component: userGroupsList
        },
        { // 用户组列表->查看用户列表
            path: "/userList",
            component: userList
        },
        { // 添加/设置用户组
            path: "/setupUserGroup",
            component: setupUserGroup
        },
        { // 添加用户组成员
            path: "/addGroupMembers",
            component: addGroupMembers
        },
        { // 编辑用户组
            path: "/editUserGroup",
            component: editUserGroup
        },
        { // 实名认证
            path: "/realAuth",
            component: realAuth
        },
        {
            path: 'RelateHost',
            component: RelateHost
        },
        { // 会员列表详情
            path: '/userDetail',
            component: userDetail
        },
        { //会员详情--联盟商详情
            path: '/businessDetail',
            component: businessDetail
        },
        { // 联盟商详情-各个商户详情
            path: '/merchantDetail',
            component: merchantDetail
        },
        { // 店铺（审核）详情
            path: '/storeSecAuditInfo',
            component: storeSecAuditInfo
        },
        { // 晓可币充值
            path: '/xkcurrency',
            component: xkCurrency
        },
        /**会员详情相关 */
        { // 账号详情
            path: '/userAccount',
            component: userAccount
        },
        { // 游戏列表
            path: '/userGameList',
            component: userGameList
        },
        { // 游戏详情
            path: '/userGameDetail',
            component: userGameDetail
        },
        { // 礼物记录列表
            path: '/userGiftRecord',
            component: userGiftRecord
        },
        { //礼物详情
            path: '/userGiftDetail',
            component: userGiftDetail
        },
        { // xkb/xfq抽奖相关详情
            path: '/orderLotteryDetail',
            component: orderLotteryDetail
        },
        { // xkb/xfq平台返还相关详情
            path: '/orderPlatformDetail',
            component: orderPlatformDetail
        },
        { // xkb/xfq红包相关详情
            path: '/orderRedDetail',
            component: orderRedDetail
        },
        { // xkb/xfq自营商城/购物抵扣相关详情
            path: '/orderSelfMallDetail',
            component: orderSelfMallDetail
        },
        { // xkb/xfq店铺充值相关详情
            path: '/orderShopDetail',
            component: orderShopDetail
        },
        { // 订单列表
            path: '/userOrderRecord',
            component: userOrderRecord
        },
        { //抽奖记录
            path: '/userLotteryRecord',
            component: userLotteryRecord
        },
        { // 会员浏览记录
            path: '/userReadRecord',
            component: userReadRecord
        },
        { // 商圈订单详情
            path: '/buinessMallDetail',
            component: buinessMallDetail
        },
        {
            path: '/reconmmendDetail',
            component: reconmmendDetail
        },
        {
            path: '/haitaoAuth',
            component: haitaoAuth
        },
        ...category,//分类管理
        ...advert,//广告推送管理
        ...platformSet,//平台设置
        ...card,  //卡券管理
        ...info, // 短信管理
        ...game,   //游戏管理
        ...city,   //城市发展管理
        ...business //商圈业务管理
    ]
}
