import Main from '../../page/main'
//prize-------------
const console = r => require.ensure([], () => r(require('../../page/welfare/prize/console')), 'console');
const prizesList = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesList/prizesList')), 'prizesList');
const prizesAdd = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesAdd/prizesAdd')), 'prizesAdd');
const prizesAddList = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesAdd/prizesAddList')), 'prizesAddList');
const prizesSelf = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesAdd/prizesSelf')), 'prizesSelf');
const prizesDetails = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesAdd/prizesDetails')), 'prizesDetails');
const nextPrizes = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesList/nextPrizes')), 'nextPrizes');
const openPrizesDetails = r => require.ensure([], () => r(require('../../page/welfare/prize/prizesList/openPrizesDetails')), 'openPrizesDetails');
const thirdPrizeList = r => require.ensure([], () => r(require('../../page/welfare/prize/thirdPrizeList')), 'thirdPrizeList');
const thirdPrizeListDetail = r => require.ensure([], () => r(require('../../page/welfare/prize/thirdPrizeListDetail')), 'thirdPrizeListDetail');

//welfareOrder---------
const orderList = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/orderList/orderList')), 'orderList');
const stageList = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/stageList/stageList')), 'stageList');
const stageDetails = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/stageList/stageDetails')), 'stageDetails');
const winPrize = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/winPrize/winPrize')), 'winPrize');
const prizeDetails = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/winPrize/prizeDetails')), 'prizeDetails');
const customerList = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/customerList/customerList')), 'customerList');
const customerDetails = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/customerList/customerDetails')), 'customerDetails');
const orderDetails = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/orderList/orderDetails')), 'orderDetails');

//随机红包中奖列表
const randomBagWinList = r => require.ensure([], () => r(require('../../page/welfare/welfareOrder/randomBagWinList')), 'randomBagWinList');

//彩票列表
import lottery from "./lottery" 

const sunburnList = r => require.ensure([], () => r(require('../../page/welfare/sunburnManager/sunburnList')), 'sunburnList');
const listDetails = r => require.ensure([], () => r(require('../../page/welfare/sunburnManager/listDetails')), 'listDetails');

export default {
    path: "/",
    component: Main,
    children: [
        //彩票
        ...lottery,

        {
            path: "/console",
            component: console
        },
        {
            path: "/prizesList",
            component: prizesList
        },
        {
            path: "/prizesAdd",
            component: prizesAdd
        },
        {
            path: "/prizesAddList",
            component: prizesAddList
        },
        {
            path: "/prizesSelf",
            component: prizesSelf
        },
        {
            path: "/prizesDetails",
            component: prizesDetails
        },
        {
            path: "/nextPrizes",
            component: nextPrizes
        },
        {
            path: "/openPrizesDetails",
            component: openPrizesDetails
        },
        {
            path: "/orderList",
            component: orderList
        },
        {
            path: "/stageList",
            component: stageList
        },
        {
            path: "/winPrize",
            component: winPrize
        },
        {
            path: "/customerList",
            component: customerList
        },
        {
            path: "/sunburnList",
            component: sunburnList
        },
        {
            path: "/listDetails",
            component: listDetails
        },
        {
            path: "/orderDetails",
            component: orderDetails
        },
        {
            path: "/stageDetails",
            component: stageDetails
        },
        {
            path: "/prizeDetails",
            component: prizeDetails
        },
        {
            path: "/customerDetails",
            component: customerDetails
        },
        {
            path: "/randomBagWinList",
            component: randomBagWinList
        },
        {
            path: "/thirdPrizeList",
            component: thirdPrizeList
        },
        {
            path: "/thirdPrizeListDetail",
            component: thirdPrizeListDetail
        },
    ]
}
