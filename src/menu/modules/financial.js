import financial from "../../service/financial";
import { getPermission } from "../../util/publicMehotds";

/*
 * @Author: liusheng 
 * @Date: 2019-01-15 16:48:06 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-01-18 10:19:35
 */
export default {
    name: '财务管理',
    items: [
        {
            icon: 'icon-icon25',
            index: 'finance-0',
            title: '提现管理',
            subs: [
                {
                    show: getPermission('cashLookThrouListSearch'),
                    index: 'cashLookThrouList',
                    title: '提现审核'
                }, 
                {
                    show: getPermission('cashRecordSearch'),
                    index: 'cashRecord',
                    title: '提现记录'
                }, 
                {
                    show: getPermission('drawbackLookThrouListSearch'),
                    index: 'drawbackLookThrouList',
                    title: '退税审核'
                },
                // {
                //     show: true,
                //     index: 'drawbackRecord',
                //     title: '退税记录'
                // },
            ]
        },
        {
            icon: 'icon-icon30',
            index: 'finance-2',
            title: '用户账户明细',
            subs: [
                {
                    show: getPermission('vipsListSearch'),
                    index: 'vipsList',
                    title: '会员列表'
                }, 
                {
                    show: getPermission('allianceMerchantAccountListSearch'),
                    index: 'allianceMerchantAccountList',
                    title: '联盟商账户列表'
                },
            ]
        },
        {
            icon: 'icon-business1',
            index: 'finance-3',
            title: '平台主业务流水',
            subs: [
                {
                    show: getPermission('platformWelfareDetailSearch'),
                    index: 'platformWelfareDetail',
                    title: '平台夺奖派对明细'
                }, 
                {
                    show: getPermission('platformMallDetailSearch'),
                    index: 'platformMallDetail',
                    title: '平台自营商城明细'
                },
                {
                    show: getPermission('platformShDetailSearch'),
                    index: 'platformShDetail',
                    title: '平台商圈对账明细'
                },
                {
                    show: getPermission('gameCoinChangeRecordSearch'),
                    index: 'gameCoinChangeRecord',
                    title: '游戏币兑换记录'
                },
                {
                    show: getPermission('giftPurchaseDetailSearch'),
                    index: 'giftPurchaseDetail',
                    title: '礼物购买明细'
                },
                {
                    show: getPermission('platformLotteryDetailSearch'),
                    index: 'platformLotteryDetail',
                    title: '平台彩票明细'
                },
                {
                    show: getPermission('netEaseDetailSearch'),
                    index: 'netEaseDetail',
                    title: '网易游戏订单明细'
                }
            ]
        },
        {
            icon: 'icon-yewu',
            index: 'finance-4',
            title: '平台其它业务流水',
            subs: [
                {
                    show: getPermission('platformRedpackageDetailSearch'),
                    index: 'platformRedpackageDetail',
                    title: '平台红包明细'
                }, 
                {
                    show: getPermission('platformDrawDetailSearch'),
                    index: 'platformDrawDetail',
                    title: '平台抽奖明细'
                },
                {
                    show: getPermission('platformFineDetailSearch'),
                    index: 'platformFineDetail',
                    title: '平台罚款明细'
                },
                // {
                //     show: true,
                //     index: 'platformCreditDetail',
                //     title: '平台赊账明细'
                // },
                {
                    show: getPermission('platformPromiseCoinDetailSearch'),
                    index: 'platformPromiseCoinDetail',
                    title: '平台保证金明细'
                },
                {
                    show: getPermission('platformPoolDetailSearch'),
                    index: 'platformPoolDetail',
                    title: '平台奖池资金明细'
                },
            ]
        },
        {
            icon: 'icon-huobiduihuan',
            index: 'finance-5',
            title: '平台流通虚拟币',
            subs: [
                {
                    show: getPermission('platformXkCoinSearch'),
                    index: 'platformXkCoin',
                    title: '平台晓可币明细'
                }, 
                {
                    show: getPermission('platformSwqDetailSearch'),
                    index: 'platformSwqDetail',
                    title: '平台实物券明细'
                },
                {
                    show: getPermission('platformXfqDetailSearch'),
                    index: 'platformXfqDetail',
                    title: '平台消费券明细'
                }
            ]
        },
        {
            icon: 'icon-icon6',
            index: 'finance-6',
            title: '联盟商收益分成',
            subs: [
                {
                    show: getPermission('platformTakeTaxDetailSearch'),
                    index: 'platformTakeTaxDetail',
                    title: '平台代缴个税明细'
                },
                // {
                //     show: true,
                //     index: 'platformProfitDivideDetail',
                //     title: '平台收益分成明细'
                // },
                // {
                //     show: true,
                //     index: 'saleProfitDivideDetail',
                //     title: '销售收益分成明细'
                // },
                // {
                //     show: true,
                //     index: 'recommendGoodsProfitDetail',
                //     title: '推荐商品收益明细'
                // }
            ]
        },
        {
            icon: 'icon-navicon-psf',
            index: 'finance-7',
            title: '配送费明细',
            subs: [
                {
                    show: getPermission('dispatchCostSearch'),
                    index: 'dispatchCost',
                    title: '配送支出明细表'
                }
            ]
        },
        {
            icon: 'icon-icon1',
            index: 'finance-8',
            title: '财务设置',
            subs: [
                {
                    show: getPermission('fazhiSetEdit'),
                    index: 'fazhiSet',
                    title: '提现阈值设定'
                }, {
                    show: getPermission('poundagSetEdit'),
                    index: 'poundagSet',
                    title: '提现手续费设置'
                },
                {
                    show: getPermission('outTaxSetSearch'),
                    index: 'outTaxSet',
                    title: '退税相关设置'
                }
            ]
        }
    ]
}

export const financialRouter = {
    'allianceMerchantAccountDetail':true,
    "platformTakeTaxDetailInfo": true
}