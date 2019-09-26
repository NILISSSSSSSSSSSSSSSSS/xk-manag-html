const lotteryInfoSet = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryInfoSet')), 'lotteryInfoSet'); //彩票信息设置

const lotteryWaitForTicketsList = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryWaitForTicketsList')), 'lotteryWaitForTicketsList'); //待出票列表
const lotteryBatchDetail = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryWaitForTicketsList/lotteryBatchDetail')), 'lotteryBatchDetail'); //批量-待出票详情
const lotteryAbnormalDetail = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryWaitForTicketsList/lotteryAbnormalDetail')), 'lotteryAbnormalDetail'); //异常-待出票详情

const lotteryToBeHonoredList = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryToBeHonoredList')), 'lotteryToBeHonoredList'); //待兑奖列表
const lotteryLineDown = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryToBeHonoredList/lotteryLineDown')), 'lotteryLineDown'); //线下兑奖
const lotteryLineUp = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryToBeHonoredList/lotteryLineUp')), 'lotteryLineUp'); //线上兑奖
const lotteryFinishedList = r => require.ensure([], () => r(require('../../page/welfare/lottery/lotteryFinishedList')), 'lotteryFinishedList'); //已完成列表
const pendingAwardList = r => require.ensure([], () => r(require('../../page/welfare/lottery/pendingAwardList')), 'pendingAwardList'); //待开奖列表

const dryingList = r => require.ensure([], () => r(require('../../page/welfare/lottery/dryingList')), 'dryingList'); //晒单列表
const dryingDetail = r => require.ensure([], () => r(require('../../page/welfare/lottery/dryingList/dryingDetail')), 'dryingDetail'); //晒单详情
export default [{
        path: "/lotteryInfoSet",
        component: lotteryInfoSet
    },
    {
        path: "/lotteryWaitForTicketsList",
        component: lotteryWaitForTicketsList
    },
    {
        path: "/lotteryBatchDetail",
        component: lotteryBatchDetail
    },
    {
        path: "/lotteryAbnormalDetail",
        component: lotteryAbnormalDetail
    },
    {
        path: "/lotteryToBeHonoredList",
        component: lotteryToBeHonoredList
    },
    {
        path: "/lotteryLineDown",
        component: lotteryLineDown
    },
    {
        path: "/lotteryLineUp",
        component: lotteryLineUp
    },
    {
        path: "/lotteryFinishedList",
        component: lotteryFinishedList
    },
    {
        path: "/dryingList",
        component: dryingList
    },
    {
        path: "/dryingDetail",
        component: dryingDetail
    },
    {
        path: "/pendingAwardList",
        component: pendingAwardList
    },
]