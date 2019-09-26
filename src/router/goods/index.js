import Main from '../../page/main'
const commoditySales = r => require.ensure([], () => r(require('../../page/selfMall/goods/commoditySales')), 'commoditySales');
const lowerGoods = r => require.ensure([], () => r(require('../../page/selfMall/goods/lowerGoods')), 'lowerGoods');
const evaluate = r => require.ensure([], () => r(require('../../page/selfMall/goods/evaluate')), 'evaluate');
const goodsInfo = r => require.ensure([], () => r(require('../../page/selfMall/goods/goodsInfo')), 'goodsInfo');
const goodsDetailInfo = r => require.ensure([], () => r(require('../../page/selfMall/goods/goodsDetailInfo.vue')), 'goodsDetailInfo');
const uploadGoods = r => require.ensure([], () => r(require('../../page/selfMall/goods/uploadGoods')), 'uploadGoods');
const board = r => require.ensure([], () => r(require('../../page/selfMall/goods/board')), 'board');
const mallInfo = r => require.ensure([], () => r(require('../../page/selfMall/set/info.vue')), 'mallInfo')
const priceModal = r => require.ensure([], () => r(require('../../page/selfMall/set/price.vue')), 'priceModal')

//订单管理
const orderListGoods = r => require.ensure([], () => r(require('../../page/selfMall/manager/list.vue')), 'list')
const closeGoodsList = r => require.ensure([], () => r(require('../../page/selfMall/manager/closeList.vue')), 'closeList')
const orderListAfterSale = r => require.ensure([], () => r(require('../../page/selfMall/manager/saleList.vue')), 'saleList')
const orderListAfterSaleDetail = r => require.ensure([], () => r(require('../../page/selfMall/manager/secondPage/orderListAfterSaleDetail.vue')), 'orderListAfterSaleDetail')


//商城设置
const invoiceManager = r => require.ensure([], () => r(require('../../page/selfMall/set/invoiceManager.vue')), 'invoiceManager')
const goodsServiceManage = r => require.ensure([], () => r(require('../../page/selfMall/set/goodsServiceManage.vue')), 'goodsServiceManage')


//虚假
const virtualMallEvaluate = r => require.ensure([], () => r(require('../../page/selfMall/goods/virtualMallEvaluate')), 'virtualMallEvaluate');
const virtualMallEvaluateDetail = r => require.ensure([], () => r(require('../../page/selfMall/goods/virtualMallEvaluateDetail')), 'virtualMallEvaluateDetail');
const virtualShEvaluate = r => require.ensure([], () => r(require('../../page/selfMall/goods/virtualShEvaluate')), 'virtualShEvaluate');
const virtualShEvaluateDetail = r => require.ensure([], () => r(require('../../page/selfMall/goods/virtualShEvaluateDetail')), 'virtualShEvaluateDetail');
const virtualMallSales = r => require.ensure([], () => r(require('../../page/selfMall/goods/virtualMallSales')), 'virtualMallSales');
const virtualShSales = r => require.ensure([], () => r(require('../../page/selfMall/goods/virtualShSales')), 'virtualShSales');

export default {
    path: "/",
    component: Main,
    children: [
        {
            path: "/commoditySales",
            component: commoditySales
        },
        {
            path: "/lowerGoods",
            component: lowerGoods
        },
        {
            path: "/evaluate",
            component: evaluate
        },
        {
            name: "goodsInfo",
            path: "/goodsInfo",
            component: goodsInfo
        },
        {
            name: "goodsDetailInfo",
            path: '/goodsDetailInfo',
            component: goodsDetailInfo
        },
        {
            path: "/uploadGoods",
            component: uploadGoods
        },
        {
            path: "/board",
            component: board
        },
        {
            path: "/mallInfo",
            component: mallInfo
        },
        {
            path: "/priceModal",
            component: priceModal
        },
        {
            path: "/orderListGoods",
            component: orderListGoods
        },
        {
            path: "/orderListAfterSale",
            component: orderListAfterSale
        },
        {
            path: "/closeGoodsList",
            component: closeGoodsList
        },
        {
            path: '/orderListAfterSaleDetail',
            component: orderListAfterSaleDetail
        },
        {
            path: '/invoiceManager',
            component: invoiceManager
        },
        {
            path: '/goodsServiceManage',
            component: goodsServiceManage
        },
        {
            path: '/virtualMallEvaluate',
            component: virtualMallEvaluate
        },
        {
            path: '/virtualMallSales',
            component: virtualMallSales
        },
        {
            path: '/virtualShEvaluate',
            component: virtualShEvaluate
        },
        {
            path: '/virtualShSales',
            component: virtualShSales
        },
        {
            path: '/virtualShEvaluateDetail',
            component: virtualShEvaluateDetail
        },
        {
            path: '/virtualMallEvaluateDetail',
            component: virtualMallEvaluateDetail
        }
    ]
}
