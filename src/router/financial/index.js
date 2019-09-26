/*
 * @Author: liusheng 
 * @Date: 2019-01-15 16:42:56 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-01-18 10:19:22
 */
import Main from '../../page/main'
/**
 * 提现管理
 *  */
const cashLookThrouList = r => require.ensure([], () => r(require('../../page/financial/cashAdmin/cashLookThrouList')), 'cashLookThrouList');//提现审核列表
const cashRecord = r => require.ensure([], () => r(require('../../page/financial/cashAdmin/cashRecord')), 'cashRecord');//提现记录
const drawbackLookThrouList = r => require.ensure([], () => r(require('../../page/financial/cashAdmin/drawbackLookThrouList')), 'drawbackLookThrouList');//退税审核列表
const drawbackRecord = r => require.ensure([], () => r(require('../../page/financial/cashAdmin/drawbackRecord')), 'drawbackRecord');//退税记录
/**
 * 用户账户明细
 *  */
const vipsList = r => require.ensure([], () => r(require('../../page/financial/userAccountDetail/vipsList')), 'vipsList');//会员列表
const allianceMerchantAccountDetail = r => require.ensure([], () => r(require('../../page/financial/userAccountDetail/allianceMerchantAccountDetail')), 'allianceMerchantAccountDetail');//联盟商账户明细
const allianceMerchantAccountList = r => require.ensure([], () => r(require('../../page/financial/userAccountDetail/allianceMerchantAccountList')), 'allianceMerchantAccountList');//联盟商账户明细

/** 
 * 平台主业务流水
*/
const gameCoinChangeRecord = r => require.ensure([], () => r(require('../../page/financial/platformMain/gameCoinChangeRecord')), 'gameCoinChangeRecord');
const platformLotteryDetail = r => require.ensure([], () => r(require('../../page/financial/platformMain/platformLotteryDetail')), 'platformLotteryDetail');
const giftPurchaseDetail = r => require.ensure([], () => r(require('../../page/financial/platformMain/giftPurchaseDetail')), 'giftPurchaseDetail');
const platformMallDetail = r => require.ensure([], () => r(require('../../page/financial/platformMain/platformMallDetail')), 'platformMallDetail');
const platformShDetail = r => require.ensure([], () => r(require('../../page/financial/platformMain/platformShDetail')), 'platformShDetail');
const platformWelfareDetail = r => require.ensure([], () => r(require('../../page/financial/platformMain/platformWelfareDetail')), 'platformWelfareDetail');
const platformLotteryDetailInfo = r => require.ensure([], () => r(require('../../page/financial/platformMain/platformLotteryDetailInfo')), 'platformLotteryDetailInfo');
const netEaseDetail = r => require.ensure([], () => r(require('../../page/financial/platformMain/netEaseDetail')), 'netEaseDetail');

/** 
 * 平台其它业务流水
*/
const platformRedpackageDetail = r => require.ensure([], () => r(require('../../page/financial/platformOther/platformRedpackageDetail')), 'platformRedpackageDetail');
const platformCreditDetail = r => require.ensure([], () => r(require('../../page/financial/platformOther/platformCreditDetail')), 'platformCreditDetail');
const platformDrawDetail = r => require.ensure([], () => r(require('../../page/financial/platformOther/platformDrawDetail')), 'platformDrawDetail');
const platformFineDetail = r => require.ensure([], () => r(require('../../page/financial/platformOther/platformFineDetail')), 'platformFineDetail');
const platformPoolDetail = r => require.ensure([], () => r(require('../../page/financial/platformOther/platformPoolDetail')), 'platformPoolDetail');
const platformPromiseCoinDetail = r => require.ensure([], () => r(require('../../page/financial/platformOther/platformPromiseCoinDetail')), 'platformPromiseCoinDetail');

/**
 * 平台流通虚拟币明细
 */
const platformXkCoin = r => require.ensure([], () => r(require('../../page/financial/platformVitualCoin/platformXkCoin')), 'platformXkCoin');
const platformSwqDetail = r => require.ensure([], () => r(require('../../page/financial/platformVitualCoin/platformSwqDetail')), 'platformSwqDetail');
const platformXfqDetail = r => require.ensure([], () => r(require('../../page/financial/platformVitualCoin/platformXfqDetail')), 'platformXfqDetail');

/**
 * 联盟商收益分成明细
 */
const platformTakeTaxDetail = r => require.ensure([], () => r(require('../../page/financial/merchantProfit/platformTakeTaxDetail')), 'platformTakeTaxDetail');
const platformTakeTaxDetailInfo = r => require.ensure([], () => r(require('../../page/financial/merchantProfit/details/platformTakeTaxDetailInfo')), 'platformTakeTaxDetailInfo');

const platformProfitDivideDetail = r => require.ensure([], () => r(require('../../page/financial/merchantProfit/platformProfitDivideDetail')), 'platformProfitDivideDetail');
const saleProfitDivideDetail = r => require.ensure([], () => r(require('../../page/financial/merchantProfit/saleProfitDivideDetail')), 'saleProfitDivideDetail');
const recommendGoodsProfitDetail = r => require.ensure([], () => r(require('../../page/financial/merchantProfit/recommendGoodsProfitDetail')), 'recommendGoodsProfitDetail');

/**
 * 配送费明细
 */
const dispatchCost =  r => require.ensure([], () => r(require('../../page/financial/dispatchCost/dispatchCost')), 'dispatchCost');

/**
 * 财务设置
 *  */
const fazhiSet = r => require.ensure([], () => r(require('../../page/financial/financialSetup/fazhiSet')), 'fazhiSet');//提现阈值设定
const poundagSet = r => require.ensure([], () => r(require('../../page/financial/financialSetup/poundagSet')), 'poundagSet');//提现手续费设置
const outTaxSet = r => require.ensure([], () => r(require('../../page/financial/financialSetup/outTaxSet')), 'outTaxSet');//退税发票抬头设置




export default {
    path: '/',
    component: Main,
    children: [
        {
            path: "/cashLookThrouList",
            component: cashLookThrouList
        },
        {
            path: "/cashRecord",
            component: cashRecord
        },
        {
            path: "/drawbackLookThrouList",
            component: drawbackLookThrouList
        },
        {
            path: "/drawbackRecord",
            component: drawbackRecord
        },
        {
            path: "/vipsList",
            component: vipsList
        },
        {
            path: "/allianceMerchantAccountDetail",
            component: allianceMerchantAccountDetail
        },
        {
            path: "/allianceMerchantAccountList",
            component: allianceMerchantAccountList
        },
        {
            path: "/fazhiSet",
            component: fazhiSet
        },
        {
            path: "/poundagSet",
            component: poundagSet
        },
        {
            path: '/dispatchCost',
            component: dispatchCost
        },
        {
            path: '/platformTakeTaxDetail',
            component: platformTakeTaxDetail
        },
        {
            path: '/platformProfitDivideDetail',
            component: platformProfitDivideDetail
        },
        {
            path: '/saleProfitDivideDetail',
            component: saleProfitDivideDetail
        },
        {
            path: '/recommendGoodsProfitDetail',
            component: recommendGoodsProfitDetail
        },
        {
            path: '/platformXkCoin',
            component: platformXkCoin
        },
        {
            path: '/platformXfqDetail',
            component: platformXfqDetail
        },
        {
            path: '/platformSwqDetail',
            component: platformSwqDetail
        },
        {
            path: '/platformCreditDetail',
            component: platformCreditDetail
        },
        {
            path: '/platformDrawDetail',
            component: platformDrawDetail
        },
        {
            path: '/platformFineDetail',
            component: platformFineDetail
        },
        {
            path: '/platformPoolDetail',
            component: platformPoolDetail
        },
        {
            path: '/platformPromiseCoinDetail',
            component: platformPromiseCoinDetail
        },
        {
            path: '/platformRedpackageDetail',
            component: platformRedpackageDetail
        },
        {
            path: '/gameCoinChangeRecord',
            component: gameCoinChangeRecord
        },
        {
            path: '/giftPurchaseDetail',
            component: giftPurchaseDetail
        },
        {
            path: '/platformLotteryDetail',
            component: platformLotteryDetail
        },
        {
            path: '/platformMallDetail',
            component: platformMallDetail
        },
        {
            path: '/platformShDetail',
            component: platformShDetail
        },
        {
            path: '/platformWelfareDetail',
            component: platformWelfareDetail
        },
        {
            path: "/platformTakeTaxDetailInfo",
            component: platformTakeTaxDetailInfo
        },
        {
            path: '/platformLotteryDetailInfo',
            component: platformLotteryDetailInfo
        },
        {
            path: '/outTaxSet',
            component: outTaxSet
        },
        {
            path: "/netEaseDetail",
            component: netEaseDetail
        }
    ]

}
