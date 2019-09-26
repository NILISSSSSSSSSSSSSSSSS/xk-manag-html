import {getPermission} from '../util/publicMehotds'
import selfMall from './modules/selfmall'
import census from './modules/census'
import operate from './modules/operate'
import financial,{financialRouter} from './modules/financial'
import service from './modules/service'
import welfare from './modules/welfare'
import live from './modules/live'

export default {
    selfMall,
    welfare,
    operate,
    financial,
    service,
    // census,
    live
}


export const otherRule = {
    ...financialRouter,
    "prizesAddList": true,
    "prizesSelf": true,
    "nextPrizes": true,
    "noselfDetails": true,
    "openPrizesDetails": true,
    "randomBagWinList": true,
    
    "prizesDetails": true,
    
    "goodsInfo": true,
    "goodsDetailInfo": true,
    "virtualMallEvaluateDetail": true,
    "virtualShEvaluateDetail": true,
    "orderListAfterSaleDetail": true,
    "thirdPrizeList": true,
    "thirdPrizeListDetail": true,
    "listDetails": true,

    "customerDetails": true,
    "orderDetails": true,
    "stageDetails": true,
    "prizeDetails": true,

    "orderRecord": true,
    "memOrderDetails": true,
    "memMerchantsDetails": true,
    "merCheckGoods": true,
    "memMerchantDetails": true, //和上面的不一样
    "storeDetails": true, // 店铺详情
    "merchantAudit": true,
    "merchantAuditAudit": true, // 商户审核审核
    "storeAudit": true,
    "storeAuditDetails": true,
    "partnerAuditDetails": true,
    "promoteAuditDetails": true,
    "hostAuditDetails": true,
    "merchantAuditDetails": true,
    "goodsDetails": true,
    "goodsAuditDetails": true,
    "editCategory": true,
    "addFirstCategory": true,
    "addSecondCategory": true,
    "addThirdCategory": true,
    "brandInfo": true,
    "spreadTemplate": true,
    "groomMerchantRegulationList": true, // 店铺列表
    "homeIcon": true,   // 首页ICON管理
    "mallDiscountTicketAdd": true,  //卡券管理->自营商城优惠券新增

    "InfoGoodsDetails": true, // 意见反馈->商品->商品详情
    "InfoPersonDetails": true, // 意见反馈->个人->个人详情

    "userList": true, // 用户组列表->查看用户列表
    "setupUserGroup": true, // 用户组列表->添加用户组
    "userGroupsList": true, // 返回用户组列表
    "addGroupMembers": true, // 添加用户组成员
    "editUserGroup": true, // 编辑用户组
    "RelateHost": true, // 关联主播


    "gameList": true,   //游戏管理
    "cityTransaction": true,   //城市发展管理
    "specialtyFoodManage": true,   //城市发展管理
    "specialtyFoodExamine": true,   //城市发展管理
    "specialtyFoodDetail": true,  //城市发展管理->招牌菜详情
    "groupManagementList": true,   //地区运营群管理->群列表

    "thirdShare": true,        //第三方分享
    "hostList": true, // 主播列表
    "familyDetail": true, // 家族详情
    "hostDetail": true, // 主播详情,

    "temporaryDraw": true,    //临时抽奖模板

    "subVersionManage": true, // 子版本管理

    "userDetail": true, // 会员详情,
    "businessDetail": true, // 联盟商详情
    "merchantDetail": true, // 联盟商各个身份详情
    "storeSecAuditInfo": true, // 店铺(审核)详情
    "reconmmendDetail": true, // 推荐详情（联盟商和会员）
    "userAccount": true, // 账户详情
    "userGameList": true, // 游戏列表
    "userGameDetail": true, // 游戏详情
    "userGiftRecord": true, // 礼物记录列表
    "userGiftDetail": true, // 礼物详情
    "orderShopDetail": true, // 店铺充值订单详情
    "orderSelfMallDetail": true, // 自营/购物抵扣订单详情
    "orderRedDetail": true, // 红包订单详情
    "orderPlatformDetail": true, // 平台返还订单详情
    "orderLotteryDetail": true, // 抽奖订单详情
    "userReadRecord": true, // 浏览记录
    "userOrderRecord": true, // 订单列表
    "userLotteryRecord": true, //抽奖记录
    "poolDetail": true,    //奖池明细
    "aaTicketReceiveList": true,
    "aaTicketChangeList": true,
    "lotteryAdd": true,
    "lotteryList": true,

    "lotteryBatchDetail": true, // 彩票 批量-待出票详情,
    "lotteryAbnormalDetail": true,    //彩票 异常-待出票详情
    "lotteryLineDown": true, // 彩票 线下兑奖,
    "lotteryLineUp": true,    //彩票 线上兑奖
    "dryingDetail": true,    //晒单详情
    "buinessMallDetail": true,
    "platformLotteryDetailInfo": true,
    "gameMatchAdd": true,
    "gameMatchList":true,
    "uploadCompetion":true,
    "gameCompetion":true,
    "storeDetail":true  //商圈业务管理   店铺详情

}