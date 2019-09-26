import {baseUrl} from '../util/publicParams'

export default {

    // 用户管理

    // 会员管理
    xkUserPage: baseUrl + 'manager/om/xkUserPage/1.0', // 会员列表查询
    xkUserDetail: baseUrl + 'manager/om/xkUserDetail/1.0', // 会员详情
    xkUserUpdate: baseUrl + 'manager/om/xkUserUpdate/1.0', // 会员修改
    xkUserDelete: baseUrl + 'manager/om/xkUserDelete/1.0', // 会员删除
    xkUserBatchDelete: baseUrl + 'manager/om/xkUserBatchDelete/1.0', // 会员批量删除(已去除)
    xkUserBatchFrozen: baseUrl + 'manager/om/xkUserBatchFrozen/1.0', // 冻结会员
    xkUserBatchActivate: baseUrl + 'manager/om/xkUserBatchActivate/1.0', // 激活会员
    userQPage: baseUrl + 'manager/om/userQPage/2.0', // 用户组列表用户分页

    /**会员列表详情相关 */
    // 联盟商详情
    merchantManagerDetail: baseUrl + 'manager/om/merchantManagerDetail/2.0', // 联盟商详情（当前联盟商）
    merchantDetailInUserList: baseUrl + 'manager/om/merchantDetailInUserList/2.0', // 联盟商详情（会员的推荐商户）
    merchantIdentityExamineDetail: baseUrl + 'manager/om/merchantIdentityExamineDetail/2.0', // 联盟商具体角色详情
    // 账户详情
    userAccBillQPage: baseUrl + 'manager/om/userAccBillQPage/1.0', // 晓可币列表、消费券列表公用
    userAccBillDetail: baseUrl + 'manager/om/userAccBillDetail/1.0', // 账户列表晓可币/消费券详情
    jOrderDetailLevelSecond: baseUrl + 'manager/om/jOrderDetailLevelSecond/1.0', // 账户列表晓可币/消费券详情
    userCouponQPage: baseUrl + 'manager/om/userCouponQPage/1.0', // 会员用户优惠券列表
    cardCouponDetail: baseUrl + 'manager/om/cardCouponDetail/1.0', // 优惠劵详情
    UserMemberCardQPage: baseUrl + 'manager/om/UserMemberCardQPage/1.0', // 会员用户会员卡列表
    mallOrderDetailAndDivided: baseUrl + 'manager/om/mallOrderDetailAndDivided/1.0', // 财务管理 - 自营订单详情
    cardMemberCardDetail: baseUrl + 'manager/om/cardMemberCardDetail/1.0', // 会员卡详情
    userAccXfqsQPage: baseUrl + 'manager/om/userAccXfqsQPage/1.0', // 店铺消费券列表
    userAccBillXfqsQPage: baseUrl + 'manager/om/userAccBillXfqsQPage/1.0', // 店铺消费券明细列表
    userShopOrderQPage: baseUrl + 'manager/om/userShopOrderQPage/1.0', // 商圈订单列表
    // 消费抽奖记录
    drawTicketInOBMQPage: baseUrl + 'manager/om/drawTicketInOBMQPage/1.0',// 消费抽奖列表
    userDrawHandSelDetail: baseUrl + 'manager/om/userDrawHandSelDetail/1.0', // 消费抽奖详情
    // 游戏列表
    gameOrderQPage: baseUrl + 'manager/om/gameOrderQPage/1.0', // 游戏列表
    gameOrderDetail: baseUrl + 'manager/om/gameOrderDetail/1.0', // 游戏详情
    game4177ThirdAccountQuery: baseUrl + 'manager/om/game4177ThirdAccountQuery/1.0', // 4177三方账号余额查询
    gameChannelList: baseUrl + 'manager/om/gameChannelList/1.0', // 游戏渠道列表
    // 礼物列表
    userAccGiftQPage: baseUrl + 'manager/om/userAccGiftQPage/1.0', // 会员用户送礼列表
    userSendGiftsDetail: baseUrl + 'manager/om/userSendGiftsDetail/1.0', // 礼物详情
    // 浏览记录
    historyQPage: baseUrl + 'manager/om/historyQPage/1.0', // 用户商城浏览记录
    xkUserOpenShopWindow: baseUrl + 'manager/om/xkUserOpenShopWindow/1.0', // 开启橱窗
    xkUserCloseShopWindow: baseUrl + 'manager/om/xkUserCloseShopWindow/1.0', // 关闭橱窗
    xkUserOpenLongVideo: baseUrl + 'manager/om/xkUserOpenLongVideo/1.0', // 开启长视频
    xkUserCloseLongVideo: baseUrl + 'manager/om/xkUserCloseLongVideo/1.0', // 关闭长视频
    //会员实名认证
    xkUserAuthPage: baseUrl + 'manager/om/xkUserAuthPage/1.0', // 认证列表
    xkUserAuthDetail: baseUrl + 'manager/om/xkUserAuthDetail/1.0', // 认证详情
    xkUserAuthBatchDelete: baseUrl + 'manager/om/xkUserAuthBatchDelete/1.0', // 删除，批量删除
    // xkUserAuthAccept: baseUrl + 'manager/om/xkUserAuthAccept/1.0', // 认证审核（废弃）
    openAutoAuditXkUserAuth: baseUrl + 'manager/om/openAutoAuditXkUserAuth/1.0', // 开启人工审核
    closeAutoAuditXkUserAuth: baseUrl + 'manager/om/closeAutoAuditXkUserAuth/1.0', // 关闭人工审核
    xkUserAuthSuccess: baseUrl + 'manager/om/xkUserAuthSuccess/1.0', // 认证成功
    xkUserAuthFailed: baseUrl + 'manager/om/xkUserAuthFailed/1.0', // 认证失败

    // 商户列表
    // merchantList: baseUrl + 'manager/om/merchantList/1.0', // 商户查询列表
    // merchantDetail: baseUrl + 'manager/om/merchantDetail/1.0', // 商户详情
    // merchantDisabled: baseUrl + 'manager/om/merchantDisabled/1.0', // 商户冻结
    // merchantActive: baseUrl + 'manager/om/merchantActive/1.0', // 商户激活

    // 商户列表（2.0）
    merchantQPage: baseUrl + 'manager/om/merchantQPage/2.0', // 商户查询列表
    // 商户详情（见会员联盟商详情）
    merchantDisable: baseUrl + 'manager/om/merchantDisable/2.0', // 商户冻结
    merchantEnable: baseUrl + 'manager/om/merchantEnable/2.0', // 商户激活
    merchantSemicolonSearch: baseUrl + "manager/om/merchantSemicolonSearch/2.0", // 分号搜索
    merchantSemicolonQPage: baseUrl + "manager/om/merchantSemicolonQPage/2.0", // 商户分号分页
    merchantShopQPage: baseUrl + 'manager/om/merchantShopQPage/2.0', // 店铺列表
    mShopUnLine: baseUrl + 'goods/om/mShopUnLine/1.0', // 店铺下架
    mShopOnLine: baseUrl + 'goods/om/mShopOnLine/1.0', // 店铺上架
    merchantGoodsQPage: baseUrl + 'manager/om/merchantGoodsQPage/2.0', // 店铺商品列表
    merchantEnterNumberLimitQuery: baseUrl + 'manager/om/merchantEnterNumberLimitQuery/1.0', // 商户入驻数量显示详情
    merchantEnterNumberLimitCreate: baseUrl + 'manager/om/merchantEnterNumberLimitCreate/1.0', // 商户入驻数量保存
    thirdLoginDetail: baseUrl + 'manager/om/thirdLoginDetail/1.0', // 第三方登录详情
    thirdLoginSetting: baseUrl + 'manager/om/thirdLoginSetting/1.0', // 第三方登录设置

    // 商户审核
    // merchantQPage: baseUrl + 'manager/om/merchantQPage/1.0', // 商户审核
    mAuthDetail: baseUrl + 'manager/om/mAuthDetail/1.0', // 商户审核详情
    tfIndustryQuery: baseUrl + "sys/om/tfIndustryQuery/1.0", // 一级行业和特约行业类别查询
    tfBankQuery: baseUrl + "sys/om/tfBankQuery/1.0", // 银行信息查询
    tfBankDotQuery: baseUrl + "sys/om/tfBankDotQuery/1.0", // 银行网点查询
    merchantFirstAuth: baseUrl + 'manager/om/merchantFirstAuth/1.0', // 商户审核
    mShopQPage: baseUrl + 'manager/om/mShopQPage/1.0', // 店铺列表
    mShopDetail: baseUrl + 'manager/om/mShopDetail/1.0', // 店铺详情查询
    mShopDisable: baseUrl + 'manager/om/mShopDisable/1.0', // 店铺下架
    mShopEnable: baseUrl + 'manager/om/mShopEnable/1.0', // 店铺上架
    mShopAuthQPage: baseUrl + 'manager/om/mShopAuthQPage/1.0', // 店铺审核列表
    mShopOnlineQPage: baseUrl + 'manager/om/mShopOnlineQPage/1.0', // 已审核后的已上线店铺
    shopGoodsQPage: baseUrl + 'manager/om/shopGoodsQPage/1.0', // 查询店铺下的商品
    mShopAuth: baseUrl + 'manager/om/mShopAuth/1.0',// 店铺审核
    NotAuthNum: baseUrl + 'manager/om/NotAuthNum/1.0', // 店铺,商户未审核数
    // 用户组管理
    xkUserGroupPage: baseUrl + 'manager/om/xkUserGroupPage/1.0', // 用户组查询列表
    xkUserGroupCreate: baseUrl + 'manager/om/xkUserGroupCreate/1.0',  // 创建用户组
    xkUserGroupDelete: baseUrl + 'manager/om/xkUserGroupDelete/1.0',  // 删除用户组
    xkUserGroupUpdate: baseUrl + 'manager/om/xkUserGroupUpdate/1.0',  // 更改用户组
    xkUserGroupDetail: baseUrl + 'manager/om/xkUserGroupDetail/1.0', // 用户组详情
    xkUserGroupMemberQPage: baseUrl + 'manager/om/xkUserGroupMemberQPage/1.0', // 用户组会员列表
    xkUserGroupPushMember: baseUrl + 'manager/om/xkUserGroupPushMember/1.0', // 用户组添加成员
    xkUserGroupPullMember: baseUrl + 'manager/om/xkUserGroupPullMember/1.0', // 用户组删除成员

    // 商品管理
    shopGoodsDBOVerifiedQPage: baseUrl + 'manager/om/shopGoodsDBOVerifiedQPage/1.0', // 商品已审核列表
    shopGoodsDBOUnauditedQPage: baseUrl + 'manager/om/shopGoodsDBOUnauditedQPage/1.0', // 商品待审核列表
    shopDBOGoodsUnshelve: baseUrl + 'manager/om/shopDBOGoodsUnshelve/1.0', // 商品下架
    shopDBOGoodsDetail: baseUrl + 'manager/om/shopDBOGoodsDetail/1.0', // 商品详情
    shopDBOGoodsUpdateByAudit: baseUrl + 'manager/om/shopDBOGoodsUpdateByAudit/1.0', // 商品审核
    serviceCatalogList: baseUrl + 'sys/om/serviceCatalogList/1.0', // 服务分类
    // 分类管理
    categoryUpdateSort: baseUrl + 'manager/om/categoryUpdateSort/1.0', //自营商城分类 -- 修改分类排序

    categoryQueryList: baseUrl + 'manager/om/categoryQueryList/1.0', //自营商城分类列表

    categoryCreate: baseUrl + 'manager/om/categoryCreate/1.0', //自营商城分类增加

    categoryUpdate: baseUrl + 'manager/om/categoryUpdate/1.0', //自营商城分类修改

    categoryDelete: baseUrl + 'manager/om/categoryDelete/1.0', //自营商城分类删除

    queryCategoryAttrList: baseUrl + 'manager/om/queryCategoryAttrList/1.0', //根据分类返回分类属性

    addCategoryAttr: baseUrl + 'manager/om/addCategoryAttr/1.0', //添加分类模板属性

    jfCategoryUpdateSort: baseUrl + 'manager/om/jfCategoryUpdateSort/1.0', //夺奖派对分类 -- 修改分类排序

    queryJFCategory: baseUrl + 'manager/om/queryJFCategory/1.0', //夺奖派对分类列表

    createJFCategory: baseUrl + 'manager/om/createJFCategory/1.0', //夺奖派对分类增加

    updateJFCategory: baseUrl + 'manager/om/updateJFCategory/1.0', //夺奖派对分类修改

    deleteJFCategory: baseUrl + 'manager/om/deleteJFCategory/1.0', //夺奖派对分类删除

    industryAllQList: baseUrl + 'sys/om/industryAllQList/1.0', //查询所有的一、二级分类

    industryOneCreate: baseUrl + 'sys/om/industryOneCreate/1.0', //创建一级分类

    industryTwoCreate: baseUrl + 'sys/om/industryTwoCreate/1.0', //创建二级分类

    industryDelete: baseUrl + 'sys/om/industryDelete/1.0', //删除行业分类

    industryUpdate: baseUrl + 'sys/om/industryUpdate/1.0', //修改行业分类

    industryUpdateSort: baseUrl + 'sys/om/industryUpdateSort/1.0', //移动行业分类位置

    queryAll: baseUrl + 'manager/om/queryAll/1.0', //自营商城品牌列表

    brandUpdate: baseUrl + 'manager/om/brandUpdate/1.0', //品牌修改

    brandDelete: baseUrl + 'manager/om/brandDelete/1.0', //删除品牌

    brandCreate: baseUrl + 'manager/om/brandCreate/1.0', //增加品牌

    // 平台监管
    personalFeedbackPage: baseUrl + 'manager/om/personalFeedbackPage/1.0', // 个人反馈分页
    personalFeedbackDetail: baseUrl + 'manager/om/personalFeedbackDetail/1.0', // 个人反馈详情
    personalFeedbackDelete: baseUrl + 'manager/om/personalFeedbackDelete/1.0', // 个人反馈删除

    goodsFeedbackPage: baseUrl + 'manager/om/goodsFeedbackPage/1.0',  // 商品反馈分页
    goodsFeedbackDetail: baseUrl + 'manager/om/goodsFeedbackDetail/1.0', // 商品反馈详情
    goodsFeedbackDelete: baseUrl + 'manager/om/goodsFeedbackDelete/1.0', // 商品反馈删除

    reportPage: baseUrl + 'manager/om/reportPage/1.0', // 举报列表
    reportAccept: baseUrl + 'manager/om/reportAccept/1.0', // 受理举报
    reportDetail: baseUrl + 'manager/om/reportDetail/1.0', // 受理举报详情
    reportBatchDelete: baseUrl + 'manager/om/reportBatchDelete/1.0', // 删除受理举报
    //广告推送管理
    // mallRecommendSGoodsQPage: baseUrl + 'manager/om/mallRecommendSGoodsQPage/1.0', // 自营商城推荐商品 列表

    mallDeleteRecommendSGoodsById: baseUrl + 'manager/om/mallDeleteRecommendSGoodsById/1.0', // 自营商城推荐商品 删除

    mallDeleteRecommendSGoodsByIds: baseUrl + 'manager/om/mallDeleteRecommendSGoodsByIds/1.0', // 自营商城推荐商品 批量删除

    xkGoodsQPage: baseUrl + 'manager/om/xkGoodsQPage/1.0', // 自营商城推荐商品 新增商品列表

    mallCreateRecommendSGoods: baseUrl + 'manager/om/mallCreateRecommendSGoods/1.0', // 自营商城推荐商品 新增

    goodsDetail: baseUrl + 'manager/om/goodsDetail/1.0', // 自营商城推荐商品 详情

    jfmallRecommendJGoodsQPage4Manager: baseUrl + 'manager/om/jfmallRecommendJGoodsQPage4Manager/1.0', //夺奖派对推荐商品 列表

    jfmallUnRecommendJGoodsQPage4Manager: baseUrl + 'manager/om/jfmallUnRecommendJGoodsQPage4Manager/1.0', // 夺奖派对推荐商品 新增列表


    jfmallSaveRecommendJGoods4Manager: baseUrl + 'manager/om/jfmallSaveRecommendJGoods4Manager/1.0', // 夺奖派对推荐商品 新增

    // jMallDeleteRecommendJGoodsById: baseUrl + 'manager/om/jMallDeleteRecommendJGoodsById/1.0', // 夺奖派对推荐商品 删除

    jfmallDeleteRecommendJGoods4Manager: baseUrl + 'manager/om/jfmallDeleteRecommendJGoods4Manager/1.0', // 夺奖派对推荐商品 批量删除

    // jfmallGoodsDetail: baseUrl + 'manager/om/jfmallGoodsDetail/1.0', // 夺奖派对推荐商品 详情
    jfmallRecommendGoodsDetail4Manager: baseUrl + 'manager/om/jfmallRecommendGoodsDetail4Manager/1.0', // 福利商品推荐详情

    bannerCreate: baseUrl + 'manager/om/bannerCreate/1.0', // Banner 创建

    promotionTemplateQPage: baseUrl + 'manager/om/promotionTemplateQPage/1.0', //推广模板—列表
    promotionTemplateDelete: baseUrl + "manager/om/promotionTemplateDelete/1.0", //推广模板—删除
    promotionTemplateUpdate: baseUrl + 'manager/om/promotionTemplateUpdate/1.0', //推广模板—编辑
    promotionTemplateCreate: baseUrl + 'manager/om/promotionTemplateCreate/1.0', //推广模板—新增
    promotionTemplateDetail: baseUrl + 'manager/om/promotionTemplateDetail/1.0', //推广模板—详情

    bannerUpdate: baseUrl + 'manager/om/bannerUpdate/1.0', // Banner 修改

    bannerDetail: baseUrl + 'manager/om/bannerDetail/1.0', // banner 详情

    bannerPage: baseUrl + 'manager/om/bannerPage/1.0', // banner 列表

    bannerDisabled: baseUrl + 'manager/om/bannerDisabled/1.0', // banner 停封

    bannerEnabled: baseUrl + 'manager/om/bannerEnabled/1.0', // banner 启用

    bannerDelete: baseUrl + 'manager/om/bannerDelete/1.0', // banner 删除

    consultContentPage: baseUrl + 'manager/om/consultContentPage/1.0', // 热门资讯列表

    activityTypePage: baseUrl + 'manager/om/activityTypePage/1.0', // 推送内容类型

    activityTypeCreate: baseUrl + 'manager/om/activityTypeCreate/1.0', // 广告推送内容类型创建

    consultContentCreate: baseUrl + 'manager/om/consultContentCreate/1.0', // 热门资讯创建

    consultContentDetail: baseUrl + 'manager/om/consultContentDetail/1.0', // 热门资讯详情

    consultContentDelete: baseUrl + 'manager/om/consultContentDelete/1.0', // 热门资讯删除

    consultContentUpdate: baseUrl + 'manager/om/consultContentUpdate/1.0', // 热门资讯修改

    pushContentCreate: baseUrl + 'manager/om/pushContentCreate/1.0', // 创建推送内容

    pushContentPage: baseUrl + 'manager/om/pushContentPage/1.0', // 推送内容列表

    pushContentDetail: baseUrl + 'manager/om/pushContentDetail/1.0', // 推送内容详情

    pushContentDelete: baseUrl + 'manager/om/pushContentDelete/1.0', // 推送内容删除

    pushContentUpdate: baseUrl + 'manager/om/pushContentUpdate/1.0', // 推送内容修改


    // 平台设置
    mallConfigDetail: baseUrl + 'manager/om/mallConfigDetail/1.0', // 商城设置详情
    platformPtotocolConfigDetail: baseUrl + 'manager/om/platformPtotocolConfigDetail/1.0', // 平台协议设置详情
    settingPlatformProtocolConfig: baseUrl + 'manager/om/settingPlatformProtocolConfig/1.0', // 修改平台协议设置
    cqsscQlist: baseUrl + 'manager/om/cqsscQlist/2.1.1',
    manuallyNo: baseUrl + 'manager/om/manuallyNo/2.1.1',

    consumeLotteryConfigDetail: baseUrl + 'manager/om/consumeLotteryConfigDetail/1.0', // 运营专用奖品设置详情
    settingConsumeLotteryConfig: baseUrl + 'manager/om/settingConsumeLotteryConfig/1.0', // 运营专用奖品设置
    durationConfigDetail: baseUrl + 'manager/om/durationConfigDetail/1.0', // 刷单阈值设置详情
    settingDurationConfig: baseUrl + 'manager/om/settingDurationConfig/1.0', // 刷单阈值设置


    settingMallConfig: baseUrl + 'manager/om/settingMallConfig/1.0', // 商城设置详情

    sensitiveWordQPage: baseUrl + 'manager/om/sensitiveWordQPage/1.0', // 敏感词列表

    sensitiveWordEnable: baseUrl + 'manager/om/sensitiveWordEnable/1.0', // 敏感词激活

    sensitiveWordDisable: baseUrl + 'manager/om/sensitiveWordDisable/1.0', // 敏感词冻结

    sensitiveWordCreate: baseUrl + 'manager/om/sensitiveWordCreate/1.0', // 敏感词添加

    blackListThresholdDetail: baseUrl + 'manager/om/blackListThresholdDetail/1.0', // 黑名单阈值详情

    settingBlackListThreshold: baseUrl + 'manager/om/settingBlackListThreshold/1.0', // 黑名单阀值设置

    merchantWhiteListQPage: baseUrl + 'manager/om/merchantWhiteListQPage/1.0', // 白名单列表
    merchantWhiteListCreate: baseUrl + 'manager/om/merchantWhiteListCreate/1.0', // 添加白名单
    merchantWhiteListDelete: baseUrl + 'manager/om/merchantWhiteListDelete/1.0', // 删除白名单
    merchantQList: baseUrl + 'manager/om/merchantQList/1.0', // 查询商户
    merchantOtherConfigDetail: baseUrl + 'manager/om/merchantOtherConfigDetail/1.0', // 商户高级设置-其他设置-查询
    merchantOtherConfig: baseUrl + 'manager/om/merchantOtherConfig/1.0', // 商户高级设置-其他设置-保存
    merchantRewardDetail: baseUrl + 'manager/om/merchantRewardDetail/1.0', // 商户达标奖励详情
    merchantRewardUpdate: baseUrl + 'manager/om/merchantRewardUpdate/1.0', // 商户达标奖励设置

    xkUserLevelPage: baseUrl + 'manager/om/xkUserLevelPage/1.0', // 用户等级列表
    xkUserLevelCreate: baseUrl + 'manager/om/xkUserLevelCreate/1.0', // 新增用户等级
    xkUserLevelUpdate: baseUrl + 'manager/om/xkUserLevelUpdate/1.0', // 修改用户等级
    xkUserLevelDetail: baseUrl + 'manager/om/xkUserLevelDetail/1.0', // 用户等级详情
    // xkUserLevelRuleList: baseUrl + 'manager/om/xkUserLevelRuleList/1.0', // 查询消费积分（废弃）
    // xkUserLevelRuleSave: baseUrl + 'manager/om/xkUserLevelRuleSave/1.0', // 设置消费积分（废弃）
    XkUserLevelSettingDetail: baseUrl + 'manager/om/XkUserLevelSettingDetail/1.0', // 用户消费等级详情
    xkUserLevelSetting: baseUrl + 'manager/om/xkUserLevelSetting/1.0', // 用户消费等级设置


    RmbExchangeRateQList: baseUrl + 'manager/om/RmbExchangeRateQList/1.0', // 虚拟货币兑换详情
    RmbExchangeRateCreate: baseUrl + 'manager/om/RmbExchangeRateCreate/1.0', // 虚拟货币兑换创建和修改

    clientVersionDefinePage: baseUrl + 'manager/om/clientVersionDefinePage/1.0', // 客户端版本分页
    clientVersionDefineCreate: baseUrl + 'manager/om/clientVersionDefineCreate/1.0', // 客户端版本创建
    clientVersionDefineUpdate: baseUrl + 'manager/om/clientVersionDefineUpdate/1.0', //客户端版本修改
    clientVersionDefineDelete: baseUrl + 'manager/om/clientVersionDefineDelete/1.0', //客户端版本删除
    clientVersionDefineDetail: baseUrl + 'manager/om/clientVersionDefineDetail/1.0', // 主版本详情
    clientVersionInstancePage: baseUrl + 'manager/om/clientVersionInstancePage/1.0', // 客户端子版本分页
    clientVersionInstanceUpdate: baseUrl + 'manager/om/clientVersionInstanceUpdate/1.0', // 客户端子版本编辑
    clientVersionInstanceCreate: baseUrl + 'manager/om/clientVersionInstanceCreate/1.0', // 客户端子版本创建
    clientVersionInstanceDetail: baseUrl + 'manager/om/clientVersionInstanceDetail/1.0', // 子版本详情
    clientVersionInstanceDelete: baseUrl + 'manager/om/clientVersionInstanceDelete/1.0', // 删除子版本


    //广告推送管理
    mShopRecommendShopQPage: baseUrl + 'manager/om/mShopRecommendShopQPage/1.0',   //推荐店铺列表
    unRecommendShopQPage: baseUrl + 'manager/om/unRecommendShopQPage/1.0',   //新增推荐店铺列表
    xkMShopQPage: baseUrl + 'manager/om/xkMShopQPage/1.0',    //店铺列表
    mShopRecommend: baseUrl + 'manager/om/mShopRecommend/1.0',   //推荐店铺
    mShopUnRecommend: baseUrl + 'manager/om/mShopUnRecommend/1.0',   //店铺取消推荐
    mShopDeleteRecommend: baseUrl + 'manager/om/mShopDeleteRecommend/1.0',  //取消首页、商圈推荐（刘国权）
    mShopAddRecommend: baseUrl + 'manager/om/mShopAddRecommend/1.0',  //添加首页、商圈推荐
    mShopSortRecommend: baseUrl + 'manager/om/mShopSortRecommend/1.0',  //首页、商圈推荐排序（刘国权）
    mShopAddRecommendShopQPage: baseUrl + 'manager/om/mShopAddRecommendShopQPage/1.0',

    homePageActivityPage: baseUrl + 'manager/om/homePageActivityPage/1.0',   //首页活动管理
    homePageActivityDetail: baseUrl + 'manager/om/homePageActivityDetail/1.0',   //商圈首页活动详情
    homePageActivityDown: baseUrl + 'manager/om/homePageActivityDown/1.0',   //商圈首页活动下架（王鹏）
    homePageActivityConfirm: baseUrl + 'manager/om/homePageActivityConfirm/1.0',   //商圈首页活动添加确认
    homePageActivityCreate: baseUrl + 'manager/om/homePageActivityCreate/1.0',   //商圈首页活动新增（王鹏）

    //卡券管理
    cardMemberCardQPage: baseUrl + 'manager/om/cardMemberCardQPage/1.0',   //会员卡查询列表
    cardMemberCardDelete: baseUrl + 'manager/om/cardMemberCardDelete/1.0',   //作废
    cardMemberCardCreate: baseUrl + 'manager/om/cardMemberCardCreate/1.0',    //新增会员卡
    mallMemberCardUserDraw: baseUrl + 'trade/om/mallMemberCardUserDraw/1.0',    //用户领取自营会员卡

    shopMemberCardDetail: baseUrl + 'manager/om/shopMemberCardDetail/1.0',    //商圈会员卡详情
    shopCouponDetail: baseUrl + 'manager/om/shopCouponDetail/1.0',
    shopMemberCardQPage: baseUrl + 'manager/om/shopMemberCardQPage/1.0',     //商圈会员卡查询列表
    shopMemberCardDelete: baseUrl + 'manager/om/shopMemberCardDelete/1.0',    //商圈会员卡作废

    cardCouponQPage: baseUrl + 'manager/om/cardCouponQPage/1.0',     //自营商城优惠券检索列表
    cardCouponCreate: baseUrl + 'manager/om/cardCouponCreate/1.0',   //平台创建优惠券
    cardCouponDelete: baseUrl + 'manager/om/cardCouponDelete/1.0',    //平台优惠券作废

    shopCardCouponQPage: baseUrl + 'manager/om/shopCardCouponQPage/1.0',   //商圈优惠券检索列表
    shopCouponDelete: baseUrl + 'manager/om/shopCouponDelete/1.0',    //商圈优惠券作废
    shopOBMQPageMember: baseUrl + 'trade/om/shopOBMQPageMember/1.0',    //会员卡领卡用户明细
    shopCouponUserDraw: baseUrl + 'manager/om/shopCouponUserDraw/1.0',    //用户领取商圈优惠券

    cardMemberCardQListSGoods: baseUrl + 'manager/om/cardMemberCardQListSGoods/1.0',   //平台优惠券新增 商品详情
    cardCouponQListSGoods: baseUrl + 'manager/om/cardCouponQListSGoods/1.0',    //平台优惠券新增 商品详情列表
    cardCouponQListSGoodsCode: baseUrl + 'manager/om/cardCouponQListSGoodsCode/1.0',   //平台优惠券新增 品类列表
    shopOBMQPageCoupon: baseUrl + 'trade/om/shopOBMQPageCoupon/1.0',     //优惠券领券用户明细.




//首页ICON管理
    homeIconQList: baseUrl + 'manager/om/homeIconQList/1.0',  //广场首页ICON
    scategoryQList: baseUrl + 'manager/om/scategoryQList/1.0',   //自营商城icon
    jcategoryQList: baseUrl + 'manager/om/jcategoryQList/1.0',  //夺奖派对ICON
    industryQList: baseUrl + 'manager/om/industryQList/1.0',  //商圈ICON

    homeIconUpdate: baseUrl + 'manager/om/homeIconUpdate/1.0',  //广场首页ICON编辑
    scategoryUpdate: baseUrl + 'manager/om/scategoryUpdate/1.0',   //自营商城icon编辑
    jcategoryUpdate: baseUrl + 'manager/om/jcategoryUpdate/1.0',  //夺奖派对ICON编辑
    industryIconUpdate: baseUrl + 'manager/om/industryIconUpdate/1.0',  //商圈ICON编辑
    homeIconIosIsHide: baseUrl + 'manager/om/homeIconIosIsHide/1.0',   //iOS隐藏
    homeIconIosNotHide: baseUrl + 'manager/om/homeIconIosNotHide/1.0',   //iOS取消隐藏
    homeIconAndroidIsHide: baseUrl + 'manager/om/homeIconAndroidIsHide/1.0',   //Android隐藏
    homeIconAndroidNotHide: baseUrl + 'manager/om/homeIconAndroidNotHide/1.0',   //Android隐藏

    scategoryAndroidHide: baseUrl + 'manager/om/scategoryAndroidHide/2.1.0', // 自营商城图标android隐藏设置
    scategoryIosHide: baseUrl + 'manager/om/scategoryIosHide/2.1.0', // 自营商城图标ios隐藏设置
    industryAndroidHide: baseUrl + 'manager/om/industryAndroidHide/2.1.0', // 商圈首页图标android隐藏设置
    industryIosHide: baseUrl + 'manager/om/industryIosHide/2.1.0', // 商圈首页图标ios隐藏设置


    homeIconIsMove: baseUrl + 'manager/om/homeIconIsMove/1.0',  //广场首页ICON移动
    scategoryIsMove: baseUrl + 'manager/om/scategoryIsMove/1.0',   //自营商城icon移动
    jcategoryIsMove: baseUrl + 'manager/om/jcategoryIsMove/1.0',  //夺奖派对ICON移动
    industryIsMove: baseUrl + 'manager/om/industryIsMove/1.0',  //商圈ICON移动

    homeIconNotMove: baseUrl + 'manager/om/homeIconNotMove/1.0',  //广场首页ICON移动
    scategoryNotMove: baseUrl + 'manager/om/scategoryNotMove/1.0',   //自营商城icon移动
    jcategoryNotMove: baseUrl + 'manager/om/jcategoryNotMove/1.0',  //夺奖派对ICON移动
    industryNotMove: baseUrl + 'manager/om/industryNotMove/1.0',  //商圈ICON移动


    //短信渠道模板管理
    smsChannelPage: baseUrl + 'manager/om/smsChannelPage/1.0', // 短信渠道列表
    smsChannelCreate: baseUrl + 'manager/om/smsChannelCreate/1.0', // 短信渠道创建
    smsChannelDetail: baseUrl + 'manager/om/smsChannelDetail/1.0', // 短信渠道详情
    smsChannelUpdate: baseUrl + 'manager/om/smsChannelUpdate/1.0', // 短信渠道修改
    smsChannelBatchDelete: baseUrl + 'manager/om/smsChannelBatchDelete/1.0', // 短信渠道批量删除
    smsChannelDisabled: baseUrl + 'manager/om/smsChannelDisabled/1.0', // 短信渠道禁用
    smsChannelEnabled: baseUrl + 'manager/om/smsChannelEnabled/1.0', // 短信渠道启用
    smsTemplateConfigPage: baseUrl + 'manager/om/smsTemplateConfigPage/1.0', // 短信模板列表
    smsTemplateConfigCreate: baseUrl + 'manager/om/smsTemplateConfigCreate/1.0', // 短信模板创建
    smsTemplateConfigUpdate: baseUrl + 'manager/om/smsTemplateConfigUpdate/1.0', // 短信模板修改
    smsTemplateConfigDetail: baseUrl + 'manager/om/smsTemplateConfigDetail/1.0', // 短信模板详情
    smsTemplateConfigBatchDelete: baseUrl + 'manager/om/smsTemplateConfigBatchDelete/1.0', // 短信模板批量删除
    smsTemplateEnumQuery: baseUrl + 'manager/om/smsTemplateEnumQuery/1.0', // 短信枚举业务


//城市交易管理
    cityTradePage: baseUrl + 'manager/om/cityTradePage/1.0',   //城市交易管理分页
    cityTradeTakeoutDisabled: baseUrl + 'manager/om/cityTradeTakeoutDisabled/1.0',  //关闭外卖
    cityTradeOrderDisabled: baseUrl + 'manager/om/cityTradeOrderDisabled/1.0',  //关闭订单交易
    cityTradeTakeoutEnabled: baseUrl + 'manager/om/cityTradeTakeoutEnabled/1.0',  //开启外卖
    cityTradeOrderEnabled: baseUrl + 'manager/om/cityTradeOrderEnabled/1.0',    //开启订单交易


    //修改热搜设置
    settingHotWord: baseUrl + 'manager/om/settingHotWord/1.0',
    //热搜设置详情
    hotWordDetail: baseUrl + 'manager/om/hotWordDetail/1.0',
    //修改热门城市
    hotRegionSetting: baseUrl + 'manager/om/hotRegionSetting/1.0',
    //热门城市列表
    hotRegionPage: baseUrl + 'manager/om/hotRegionPage/1.0',
    //自动设置详情
    autoConfigDetail: baseUrl + 'manager/om/autoConfigDetail/1.0',
    //修改自动设置
    settingAutoConfig: baseUrl + 'manager/om/settingAutoConfig/1.0',
    //修改销售奖励设置
    settingSalesReward: baseUrl + 'manager/om/settingSalesReward/1.0',
    //销售奖励设置详情
    salesRewardDetail: baseUrl + 'manager/om/salesRewardDetail/1.0',
    //创建充值面额
    createXkbDenomination: baseUrl + 'manager/om/createXkbDenomination/1.0',
    //充值面额列表
    pagesXkbDenomination: baseUrl + 'manager/om/pagesXkbDenomination/1.0',
    //删除充值面额
    deleteXkbDenomination: baseUrl + 'manager/om/deleteXkbDenomination/1.0',



    //运营专用奖品设置
    /**
     * 补贴活动列表
     */
    subsidiesActivitiePage: baseUrl + 'manager/om/subsidiesActivitiePage/1.0',
    /**
     * 新增补贴活动
     */
    subsidiesActivitieCreate: baseUrl + 'manager/om/subsidiesActivitieCreate/1.0',
    /**
     * 可选活动列表
     */
    goodsForSubsidiesActivitie: baseUrl + 'manager/om/goodsForSubsidiesActivitie/1.0',
    /**
     * 删除补贴活动
     */
    subsidDeleteById: baseUrl + 'manager/om/subsidDeleteById/1.0',
    /**
     * 统计补贴奖品信息
     */
    subsidieCount: baseUrl + 'manager/om/subsidieCount/1.0',
    /**
     * 游戏
     */
    gameQpage: baseUrl + 'manager/om/gameQpage/1.0',//游戏列表（王琪）
    gameDetail: baseUrl + 'manager/om/gameDetail/1.0',//游戏详情（王琪）
    gameCreate: baseUrl + 'manager/om/gameCreate/1.0',//新增游戏（王琪）
    gameUpdate: baseUrl + 'manager/om/gameUpdate/1.0',//游戏编辑（王琪）
    gameDelete: baseUrl + 'manager/om/gameDelete/1.0',//删除游戏（王琪）
    gameUnUpper: baseUrl + 'manager/om/gameUnUpper/1.0',//下架游戏（王琪）
    gameUpper: baseUrl + 'manager/om/gameUpper/1.0',//上架游戏（王琪）
    gameDoRecommend: baseUrl + 'manager/om/gameDoRecommend/1.0',//设置推荐游戏（王琪）
    gameUnRecommend: baseUrl + 'manager/om/gameUnRecommend/1.0',//取消推荐游戏（王琪）
    gameDoHotGame: baseUrl + 'manager/om/gameDoHotGame/1.0',//设为热门游戏（王琪）
    gameUnHotGame: baseUrl + 'manager/om/gameUnHotGame/1.0',//取消热门（王琪）
    drawoutSaleGameDefine: baseUrl + 'manager/om/drawoutSaleGameDefine/1.0',//游戏销售分成模板（郑智斌）

    // 竞赛列表
    queryCompetition: baseUrl + 'manager/om/queryCompetition/1.0',//比赛列表（李云龙）
    competitionDetail: baseUrl + 'manager/om/competitionDetail/1.0',//比赛详情
    deletePrize: baseUrl + 'manager/om/deletePrize/1.0',//删除竞赛奖品
    gameCompetitionList: baseUrl + 'manager/om/gameCompetitionList/1.0',//游戏赛事监控
    updateGameStatisics: baseUrl + 'manager/om/updateGameStatisics/1.0',//修改游戏赛事记录
    uploadCompetitionList: baseUrl + 'manager/om/uploadCompetitionList/1.0',//上传赛事监
    disqualification: baseUrl + 'manager/om/disqualification/1.0',//取消比赛资格
    competitionRoomCount: baseUrl + 'manager/om/competitionRoomCount/1.0',//房间个数
    productionDetail: baseUrl + 'manager/om/productionDetail/1.0',//小视频详情
    videoCommentQPage: baseUrl + 'manager/om/videoCommentQPage/2.0.13',
    deleteVideoComment: baseUrl + 'manager/om/deleteVideoComment/2.0.13',
    deleteVideoCommentReply: baseUrl + 'manager/om/deleteVideoCommentReply/2.0.13',
    videoCommentReplyList: baseUrl + 'manager/om/videoCommentReplyList/2.0.13',
    giftOrderInGameQPage: baseUrl + 'manager/om/giftOrderInGameQPage/2.0.13',
    recoveryQualification: baseUrl + 'manager/om/recoveryQualification/1.0',
    settleGameCompetition: baseUrl + 'manager/om/settleGameCompetition/1.0',
    competitionSubclasses: baseUrl + 'manager/om/competitionSubclasses/1.0',
    competitionEvnets: baseUrl + 'manager/om/competitionEvnets/1.0',
    queryRegustration: baseUrl + 'manager/om/queryRegustration/1.0',
    queryRegustrationDown: baseUrl + 'manager/om/queryRegustrationDown/1.0',
    uploadCompetitionListDown: baseUrl + 'manager/om/uploadCompetitionListDown/1.0',
    gameCompetitionListDown: baseUrl + 'manager/om/gameCompetitionListDown/1.0',
    competitionRoundInfo: baseUrl + 'manager/om/competitionRoundInfo/1.0',


    competitionCreate: baseUrl + 'manager/om/competitionCreate/1.0',//创建游戏比赛（李云龙）
    createPrize: baseUrl + 'manager/om/createPrize/1.0',//比赛场创建奖品到奖品池（李云龙）
    listPrize: baseUrl + 'manager/om/listPrize/1.0',//竞赛奖品列表（李云龙）
    prizeDetail: baseUrl + 'manager/om/prizeDetail/1.0',//竞赛奖品详情（李云龙）
    modifyPrize: baseUrl + 'manager/om/modifyPrize/1.0',//比赛场修改奖品（李云龙）
    deletePrize: baseUrl + 'manager/om/deletePrize/1.0',//删除竞赛奖品（李云龙）
    competitionSubclasses: baseUrl + 'manager/om/competitionSubclasses/1.0',//创建-竞赛子类型列表 (李云龙)
    competitionEvnets: baseUrl + 'manager/om/competitionEvnets/1.0',//
    competitionTeamCreate: baseUrl + 'im/om/competitionTeamCreate/1.0',//
    competitionCancel: baseUrl + 'manager/om/competitionCancel/1.0',//
    userPrizeRecord: baseUrl + 'manager/om/userPrizeRecord/1.0',//
    anewAwardUserPrize: baseUrl + 'manager/om/anewAwardUserPrize/1.0',//

    jfmallGoodsDetail4Manager: baseUrl + 'manager/om/jfmallGoodsDetail4Manager/1.0',//奖品详情（涂龙飞）
    goodsDetail: baseUrl + 'manager/om/goodsDetail/1.0',//自营商城推荐商品 详情(王鹏)

    //运营模板
    //创建、修改
    activityPlatformTemplateCreateOrModify: baseUrl + 'manager/om/activityPlatformTemplateCreateOrModify/1.0',
    //运营模板详情
    activityPlatformTemplateDetail: baseUrl + 'manager/om/activityPlatformTemplateDetail/1.0',
    //模板列表
    activityPlatformTemplateQueryAll: baseUrl + 'manager/om/activityPlatformTemplateQueryAll/1.0',
    //删除模板
    activityPlatformTemplateDelete: baseUrl + 'manager/om/activityPlatformTemplateDelete/1.0',
    //奖品列表
    activityPlatformTemplatePrizes: baseUrl + 'manager/om/activityPlatformTemplatePrizes/1.0',
    //活动保存
    activityPlatformCreate: baseUrl + 'manager/om/activityPlatformCreate/1.0',
    //模板下的所有活动简要信息
    activityPlatformList: baseUrl + 'manager/om/activityPlatformList/1.0',
    //活动详情
    activityPlatformDetail: baseUrl + 'manager/om/activityPlatformDetail/1.0',
    //删除活动
    activityPlatformDelete: baseUrl + "manager/om/activityPlatformDelete/1.0",
    //活动修改
    activityPlatformUpdate: baseUrl + "manager/om/activityPlatformUpdate/1.0",
    //奖池可用余额
    jackpotMoneyRemaining: baseUrl + "manager/om/jackpotMoneyRemaining/1.0",
    //奖池充值
    jackpotRecharge: baseUrl + "manager/om/jackpotRecharge/1.0",
    //奖池明细列表
    jackpotFinancialQPage: baseUrl + "manager/om/jackpotFinancialQPage/1.0",
    //奖池明细详情
    jackpotDetailInformation: baseUrl + "manager/om/jackpotDetailInformation/1.0",
    //充值详情
    rechargeDetail: baseUrl + "manager/om/rechargeDetail/1.0",

    //监管黑名单
    activityPlatformBlacklistQPage: baseUrl + "manager/om/activityPlatformBlacklistQPage/1.0",
    activityPlatformBlacklistDetail: baseUrl + "manager/om/activityPlatformBlacklistDetail/1.0",
    activityPlatformBlacklistDelete: baseUrl + "manager/om/activityPlatformBlacklistDelete/1.0",
    activityPlatformBlacklistUpdateFreezeDraw: baseUrl + "manager/om/activityPlatformBlacklistUpdateFreezeDraw/1.0",


    //会员商圈订单详情
    shopOrderDetail: baseUrl + 'manager/om/shopOrderDetail/1.0',
    lotteryRepertoryWarningConfigDetail: baseUrl + 'manager/om/lotteryRepertoryWarningConfigDetail/1.0',
    lotteryRepertoryWarningConfigSetting: baseUrl + 'manager/om/lotteryRepertoryWarningConfigSetting/1.0',



    //平台基础信息设置
    baseInfoSetting: baseUrl + 'manager/om/baseInfoSetting/1.0',
    //平台基本信息详情
    baseInfoDetail: baseUrl + 'manager/om/baseInfoDetail/1.0',

    // 供应商管理
    supplierCreate: baseUrl + 'manager/om/supplierCreate/2.0.12', // 新增供应商
    supplierUpdate: baseUrl + 'manager/om/supplierUpdate/2.0.12', // 编辑供应商
    supplierDelete: baseUrl + 'manager/om/supplierDelete/2.0.12', // 删除供应商
    supplierDetail: baseUrl + 'manager/om/supplierDetail/2.0.12', // 供应商详情
    supplierQpage: baseUrl + 'manager/om/supplierQpage/2.0.12', // 供应商分页

    //手续费
    poundageQueryAll: baseUrl + 'manager/om/poundageQueryAll/1.0',
    //平台枚举
    poundagePlatforms: baseUrl + 'manager/om/poundagePlatforms/1.0',

    // 新敏感词
    sensitiveWordLibraryQPage: baseUrl + 'manager/om/sensitiveWordLibraryQPage/2.0.13', // 敏感词库列表
    sensitiveWordLibraryUpdate: baseUrl + 'manager/om/sensitiveWordLibraryUpdate/2.0.13', // 敏感词库替换和上传

    poundagePayChannels: baseUrl + 'manager/om/poundagePayChannels/1.0',
    poundageCreate: baseUrl + 'manager/om/poundageCreate/1.0',


    //自营商城批量推荐创建
    mallCreateRecommend: baseUrl + 'manager/om/mallCreateRecommend/2.1.0',
    //自营商城商品推荐列表（王琪）
    mallRecommendSGoodsNewQPage: baseUrl + 'manager/om/mallRecommendSGoodsNewQPage/2.1.0',
    //mallUnRecommendSGoodsNewQPage
    mallUnRecommendSGoodsNewQPage: baseUrl + 'manager/om/mallUnRecommendSGoodsNewQPage/2.1.0',
    //批量删除自营推荐商品（王琪）
    mallDeleteRecommend: baseUrl + 'manager/om/mallDeleteRecommend/2.1.0',
    //推荐自营商品上下移动（王琪）
    mallUpdateIndex: baseUrl + 'manager/om/mallUpdateIndex/2.1.0',
    //推荐自营商品启用到首页（王琪）
    mallEnableRecommend: baseUrl + 'manager/om/mallEnableRecommend/2.1.0',
    //推荐商品禁用到首页(王琪)
    mallUnableRecommend: baseUrl + 'manager/om/mallUnableRecommend/2.1.0',

    //新增批量推荐商品（王琪）
    jfmallSaveRecommendJGoods4ManagerList: baseUrl + 'manager/om/jfmallSaveRecommendJGoods4ManagerList/2.1.0',
    //推荐商品排序修改（王琪）
    jfmallUpdateIndex: baseUrl + 'manager/om/jfmallUpdateIndex/2.1.0',


    // 商圈业务管理
    shopQueryQualification: baseUrl + 'manager/om/shopQueryQualification/2.1.0', // 查询店铺资质配置
    shopConfigQualification: baseUrl + 'manager/om/shopConfigQualification/2.1.0', // 设置店铺资质配置

    //开启游戏下载
    gameEnableDownload: baseUrl + "manager/om/gameEnableDownload/2.1.1",
    //关闭游戏下载（王琪）
    gameUnableDownload: baseUrl + "manager/om/gameUnableDownload/2.1.1",
    //平台反馈分页（雷国敏）
    personalFeedbackPage: baseUrl + 'manager/om/personalFeedbackPage/1.0',
    //平台反馈详情（雷国敏）
    personalFeedbackDetail: baseUrl + 'manager/om/personalFeedbackDetail/1.0',
    //平台意见反馈受理（崔鹏）
    personalFeedbackUpdate: baseUrl + 'manager/om/personalFeedbackUpdate/2.1.1',
}
