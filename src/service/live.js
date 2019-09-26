import {baseUrl} from '../util/publicParams'

export default {
    // 家族管理
    merchantFamilyQPage: baseUrl + 'manager/om/merchantFamilyQPage/1.0', // 家族列表
    merchantFamilyDetail: baseUrl + 'manager/om/merchantFamilyDetail/1.0', // 家族详情
    merchantFamilyDiamondQPage: baseUrl + 'manager/om/merchantFamilyDiamondQPage/1.0', // 钻石家族列表
    merchantFamilyDiamondDetail: baseUrl + 'manager/om/merchantFamilyDiamondDetail/1.0', // 钻石家族详情
    merchantStatusOperation: baseUrl + 'manager/om/merchantStatusOperation/1.0', // 冻结/激活家族
    merchantAnchorQPage: baseUrl + 'manager/om/merchantAnchorQPage/1.0', // 主播列表
    merchantAnchorDetail: baseUrl + 'manager/om/merchantAnchorDetail/1.0', // 主播详情
    platformRecommendSetting: baseUrl + 'manager/om/platformRecommendSetting/1.0', // 主播推荐等级
    merchantCancelFamilyCover: baseUrl + 'manager/om/merchantCancelFamilyCover/1.0', // 取消封面
    interventionQPage: baseUrl + 'manager/om/interventionQPage/1.0', // 平台介入分页
    platformIntervention: baseUrl + 'manager/om/platformIntervention/1.0', // 平台介入修改家族
    platformRecommendQPage: baseUrl + 'manager/om/platformRecommendQPage/1.0', // 主播推荐分页
    platformRecommendAuth: baseUrl + 'manager/om/platformRecommendAuth/1.0', // 推荐审核
    platformRevoke: baseUrl + 'manager/om/platformRevoke/1.0', // 撤销推荐
    platformRecommendSetting: baseUrl + 'manager/om/platformRecommendSetting/1.0', // 主播推荐等级

    
    merchantCancelFamilyCover: baseUrl + 'manager/om/merchantCancelFamilyCover/1.0', // 取消封面
    authPassword: baseUrl + 'manager/om/authPassword/1.0', // 密码验证
    familyL1ManageWithdrawalSave: baseUrl + 'manager/om/familyL1ManageWithdrawalSave/1.0', // 普通家族提现设置
    familyL2ManageWithdrawalSave: baseUrl + 'manager/om/familyL2ManageWithdrawalSave/1.0', // 钻石家族提现设置
    familyL1ManageAnchorWithdrawalSave: baseUrl + 'manager/om/familyL1ManageAnchorWithdrawalSave/1.0', //主播提现设置

    //家族管理（重构）
    familyL1ManageQPage: baseUrl + 'manager/om/familyL1ManageQPage/2.0', // 普通家族列表
    familyL1ManageDetail: baseUrl + 'manager/om/familyL1ManageDetail/2.0', // 普通家族详情
    familyL1ManageActivation: baseUrl + 'manager/om/familyL1ManageActivation/2.0', // 普通家族激活
    familyL1ManageFreeze: baseUrl + 'manager/om/familyL1ManageFreeze/2.0', // 普通家族冻结
    familyL1ManageCancelFamilyPhoto: baseUrl + 'manager/om/familyL1ManageCancelFamilyPhoto/2.0', // 普通家族取消封面
    familyL1ManageShowFamilyPhoto: baseUrl + 'manager/om/familyL1ManageShowFamilyPhoto/2.0', // 普通家族展示封面
    familyL2ManageQPage: baseUrl + 'manager/om/familyL2ManageQPage/2.0', // 钻石家族列表
    familyL2ManageDetail: baseUrl + 'manager/om/familyL2ManageDetail/2.0', // 钻石家族详情
    familyL2ManageFreeze: baseUrl + 'manager/om/familyL2ManageFreeze/2.0', // 钻石家族冻结
    familyL2ManageActivation: baseUrl + 'manager/om/familyL2ManageActivation/2.0', // 钻石家族激活
    familyL2ManageCancelFamilyPhoto: baseUrl + 'manager/om/familyL2ManageCancelFamilyPhoto/2.0', // 钻石家族取消封面
    familyL2ManageShowFamilyPhoto: baseUrl + 'manager/om/familyL2ManageShowFamilyPhoto/2.0', // 钻石家族取消封面
    familyL1ManageAnchorQPage: baseUrl + 'manager/om/familyL1ManageAnchorQPage/2.0', // 主播列表
    familyL1ManageAnchorDetail: baseUrl + 'manager/om/familyL1ManageAnchorDetail/2.0', // 主播详情
    familyL1ManageAnchorActivation: baseUrl + 'manager/om/familyL1ManageAnchorActivation/2.0', // 激活主播
    familyL1ManageAnchorFreeze: baseUrl + 'manager/om/familyL1ManageAnchorFreeze/2.0', // 冻结主播
    outFamilyAnchorQPage: baseUrl + 'manager/om/outFamilyAnchorQPage/2.0', // 平台介入主播列表
    outFamilyAnchorAgree: baseUrl + 'manager/om/outFamilyAnchorAgree/2.0', // 平台介入退出家族通过
    outFamilyAnchorRefuse: baseUrl + 'manager/om/outFamilyAnchorRefuse/2.0', // 平台介入退出家族不通过
    platformFamilyL1ApplyQPage: baseUrl + 'manager/om/platformFamilyL1ApplyQPage/2.0', // 平台介入普通家族列表
    platformFamilyL1ApplyAgree: baseUrl + 'manager/om/platformFamilyL1ApplyAgree/2.0', // 平台介入普通家族通过
    platformFamilyL1ApplyRefuse: baseUrl + 'manager/om/platformFamilyL1ApplyRefuse/2.0', // 平台介入普通家族不通过
    familyL1ManageControlAnchor: baseUrl + 'manager/om/familyL1ManageControlAnchor/2.0', // 普通家族控制主播提现
    familyL2ManageControlAnchor: baseUrl + 'manager/om/familyL2ManageControlAnchor/2.0', // 钻石家族控制主播提现
    platformRecommendSetting: baseUrl + 'manager/om/platformRecommendSetting/2.0', // 主播推荐等级
    platformRecommendAgree: baseUrl + 'manager/om/platformRecommendAgree/2.0', // 主播推荐通过
    platformRecommendRefuse: baseUrl + 'manager/om/platformRecommendRefuse/2.0', // 主播推荐不通过
    anchorRecommendPage: baseUrl + 'manager/om/anchorRecommendPage/2.0', // 推荐主播分页

    // 礼物管理
    giftPage: baseUrl + 'manager/om/giftPage/1.0', // 礼物列表
    giftCreate: baseUrl + 'manager/om/giftCreate/1.0', // 创建礼物
    giftUpdate: baseUrl + 'manager/om/giftUpdate/1.0', // 编辑礼物
    giftDelete: baseUrl + 'manager/om/giftDelete/1.0', // 删除礼物
    giftEnable: baseUrl + 'manager/om/giftEnable/1.0', // 启用礼物
    giftDisable: baseUrl + 'manager/om/giftDisable/1.0', // 禁用礼物
    giftDetail: baseUrl + 'manager/om/giftDetail/1.0', // 礼物详情

    lastHourRankingDetail: baseUrl + 'manager/om/lastHourRankingDetail/1.0', // 上小时礼物排行详情
    lastHourRankingSetting: baseUrl + 'manager/om/lastHourRankingSetting/1.0', // 上小时礼物排行设置

    // 推荐用户
    xkUserRecommendPage: baseUrl + 'manager/om/xkUserRecommendPage/1.0', // 推荐用户列表
    xkUserRecommendCreate: baseUrl + 'manager/om/xkUserRecommendCreate/1.0', // 新增推荐用户
    xkUserRecommendDelete: baseUrl + 'manager/om/xkUserRecommendDelete/1.0', // 删除推荐用户
    xkUserPageSearch: baseUrl + 'manager/om/xkUserPageSearch/1.0', // 新增推荐用户搜索列表
}