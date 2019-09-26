import { getPermission } from "../../util/publicMehotds";

export default {
    name: '夺奖派对',
    items: [{
            icon: 'icon-icon12',
            index: 'welfare-0',
            title: '奖品池',
            subs: [{
                    show: getPermission("consoleInfo"),
                    index: 'console',
                    title: '控制台'
                },
                {
                    show: getPermission("prizesAddWelfare") || getPermission("prizesAddMall"),
                    index: 'prizesAdd',
                    title: '添加奖品'
                },
                {
                    show: getPermission("thirdPrizeListSearch"),
                    index: 'thirdPrizeList',
                    title: '三方奖品列表'
                },
                {
                    show: getPermission("prizesListSearch") || getPermission("prizesAddWelfare") || getPermission("prizesAddMall"),
                    index: 'prizesList',
                    title: '自营奖品列表'
                }
            ],
        },
        {
            icon: 'icon-uniE932',
            index: 'welfare-1',
            title: '彩票管理',
            subs: [{
                    show: getPermission('lotteryResult') || getPermission("lotteryInfo"),
                    index: 'lotteryInfoSet',
                    title: '彩票信息设置'
                },
                {
                    show: getPermission('lotteryWaitForTicketListPage'),
                    index: 'lotteryWaitForTicketsList',
                    title: '待出票列表'
                },
                {
                    show: getPermission('lotteryHonorList'),
                    index: 'lotteryToBeHonoredList',
                    title: '待兑奖列表'
                },
                {
                    show: getPermission('lotteryFinishedpage'),
                    index: 'lotteryFinishedList',
                    title: '已完成列表'
                },
                {
                    show: getPermission('pendingAwardListSearch'),
                    index: 'pendingAwardList',
                    title: '待开奖列表'
                },
                {
                    show: getPermission('dryingList'),
                    index: 'dryingList',
                    title: '晒单列表'
                },
            ]
        },
        {
            icon: 'icon-icon6',
            index: 'welfare-2',
            title: '福利订单',
            subs: [{
                    show: getPermission("orderListSearch"),
                    index: 'orderList',
                    title: '订单列表'
                },
                {
                    show: getPermission("stageListSearch"),
                    index: 'stageList',
                    title: '期列表'
                },
                {
                    show: getPermission('randomBagWinListSearch'),
                    index: 'randomBagWinList',
                    title: '随机红包中奖列表'
                },
                {
                    show: getPermission('winPrizeSearch'),
                    index: 'winPrize',
                    title: '福利大奖中奖列表'
                },
                {
                    show: getPermission('customerListSearch'),
                    index: 'customerList',
                    title: '售后列表'
                }
            ],
        },
        {
            icon: 'icon-icon22',
            index: 'welfare-3',
            title: '晒单管理',
            subs: [{
                show: getPermission('sunburnListSearch'),
                index: 'sunburnList',
                title: '晒单列表'
            }],
        }
    ]
}