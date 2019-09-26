// 商圈店铺管理列表
const storeManage = r => require.ensure([], () => r(require("../../../page/operate/business/storeManage.vue")), "storeManage");
// 商圈店铺管理详情
const storeDetail = r => require.ensure([], () => r(require("../../../page/operate/business/storeDetail.vue")), "storeDetail");
// 商圈配置
const businessSet = r => require.ensure([], () => r(require("../../../page/operate/business/businessSet.vue")), "businessSet");
const groomMerchantRegulationList = r => require.ensure([], () => r(require('../../../page/operate/business/groomMerchantRegulationList')), 'groomMerchantRegulationList');//店铺列表
const groomMerchantRegulation = r => require.ensure([], () => r(require('../../../page/operate/business/groomMerchantRegulation')), 'groomMerchantRegulation');//推荐商户管理


export default [
    {
        path: "/storeManage",
        component: storeManage,
        name: "storeManage"
    },
    {
        path: "/storeDetail",
        component: storeDetail,
        name: "storeDetail"
    },
    {
        path: '/businessSet',
        component: businessSet,
        name: 'businessSet'
    },
    { //推荐商户管理
        path: '/groomMerchantRegulation',
        component: groomMerchantRegulation
    },
    { //店铺列表
        path: '/groomMerchantRegulationList',
        component: groomMerchantRegulationList
    }
];
