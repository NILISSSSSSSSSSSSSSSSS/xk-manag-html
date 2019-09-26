
const mallSet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/mallSet')), 'mallSet');
const otherSet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/otherSet')), 'otherSet');
const merchantSeniorSet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/merchantSeniorSet')), 'merchantSeniorSet');
const infoSuperSet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/infoSuperSet')), 'infoSuperSet');
const platformProtocolSet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/platformProtocolSet')), 'platformProtocolSet');
const virtualProperty = r => require.ensure([], () => r(require('../../../page/operate/platformSet/virtualProperty')), 'virtualProperty');
const homeIcon = r => require.ensure([], () => r(require('../../../page/operate/platformSet/homeIcon')), 'homeIcon');
const userlevel = r => require.ensure([], () => r(require('../../../page/operate/platformSet/userLevel')), 'userLevel');
const versionManage = r => require.ensure([], () => r(require('../../../page/operate/platformSet/versionManage')), 'versionManage');
const subVersionManage = r => require.ensure([], () => r(require('../../../page/operate/platformSet/subVersionManage')), 'subVersionManage');

//临时抽奖模板
const temporaryDraw = r => require.ensure([], () => r(require('../../../page/operate/platformSet/temporaryDraw')), 'temporaryDraw');
//新版抽奖模板
const consumeLuckDrawCenter = r => require.ensure([], () => r(require('../../../page/operate/platformSet/consumeLuckDrawCenter')), 'consumeLuckDrawCenter');
//奖池明细
const poolDetail = r => require.ensure([], () => r(require('../../../page/operate/platformSet/consumeDetail/poolDetail')), 'poolDetail');
//支付手续费设置
const chargePaySet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/chargePaySet')), 'chargePaySet');
//时时彩
const sscSet = r => require.ensure([], () => r(require('../../../page/operate/platformSet/sscSet')), 'sscSet');


export default [
      { //商场设置
        path: '/mallSet',
        component: mallSet
      },
      { //其他设置
        path: '/otherSet',
        component: otherSet
      },
      { //商户高级设置
        path: '/merchantSeniorSet',
        component: merchantSeniorSet
      },
      { //信息监管设置
        path: '/infoSuperSet',
        component: infoSuperSet
      },
      { //平台协议设置
        path: '/platformProtocolSet',
        component: platformProtocolSet
      },
      { //虚拟资产汇率配置
        path: '/virtualProperty',
        component: virtualProperty
      },
      { //首页ICON管理
        path: '/homeIcon',
        component: homeIcon
      }, 
      { // 用户等级管理
        path: "/userLevel",
        component: userlevel
      },
      { // 版本管理
        path: "/versionManage",
        component: versionManage
      },
      { // 子版本管理
        path: "/subVersionManage",
        component: subVersionManage
      },
      {
          path: '/temporaryDraw',
          component: temporaryDraw
      },
      {
          path: '/consumeLuckDrawCenter',
          component: consumeLuckDrawCenter
      },
      {
          path: '/poolDetail',
          component: poolDetail
      },
      {
          path: '/chargePaySet',
          component: chargePaySet
      },
      {
          path: "/sscSet",
          component: sscSet
      }
]