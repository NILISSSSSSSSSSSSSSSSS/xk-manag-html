import Main from '../../page/main'
const giftList = r => require.ensure([], () => r(require('../../page/live/gift/giftList')), 'giftList');
const hourSet = r => require.ensure([], () => r(require('../../page/live/gift/hourSet')), 'hourSet');
const recommendedUser = r => require.ensure([], () => r(require('../../page/live/recommendedUser/recommendedUser')), 'recommendedUser');
const normalFamily = r => require.ensure([], () => r(require('../../page/live/familyAudit/normalFamily')), 'normalFamily');
const diamondFamily = r => require.ensure([], () => r(require('../../page/live/familyAudit/diamondFamily')), 'diamondFamily');
const hostList = r => require.ensure([], () => r(require('../../page/live/familyAudit/hostList')), 'hostList');
const familyDetail = r => require.ensure([], () => r(require('../../page/live/familyAudit/familyDetail')), 'familyDetail');
const hostDetail = r => require.ensure([], () => r(require('../../page/live/familyAudit/hostDetail')), 'hostDetail');
const intervention = r => require.ensure([], () => r(require('../../page/live/familyAudit/intervention')), 'intervention');
const interventionFamily = r => require.ensure([], () => r(require('../../page/live/familyAudit/interventionFamily')), 'interventionFamily');
const recommendHost = r => require.ensure([], () => r(require('../../page/live/familyAudit/recommendHost')), 'recommendHost');



const thirdShare = r => require.ensure([], () => r(require('../../page/live/system/thirdShare')), 'thirdShare');




export default {
    path: '/',
    component: Main,
    children: [
        { // 礼物列表
            path: "/giftList",
            component: giftList
        },
        { // 上小时设置
            path: '/hourSet',
            component: hourSet
        },
        { // 推荐用户列表
            path: "/recommendedUser",
            component: recommendedUser
        }, 
        {  // 普通家族管理
            path: "/normalFamily",
            component: normalFamily
        },
        { // 钻石家族管理
            path: "/diamondFamily",
            component: diamondFamily
        },
        { // 主播列表
            path: "/hostList",
            component: hostList
        },
        { // 家族详情
            path: "/familyDetail",
            component: familyDetail
        },
        { // 主播详情
            path: "/hostDetail",
            component: hostDetail
        },
        { // 第三方分享
            path: "/thirdShare",
            component: thirdShare
        },
        { // 平台介入退出家族
            path: '/intervention',
            component: intervention
        },
        { // 平台介入退出钻石家族
            path: '/interventionFamily',
            component: interventionFamily
        },
        { //推荐主播审核
            path: '/recommendHost',
            component: recommendHost
        }
    ]
}