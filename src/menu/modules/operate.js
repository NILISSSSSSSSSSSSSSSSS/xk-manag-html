import { getPermission } from "../../util/publicMehotds";

export default {
    name: '运营管理',
    items: [
        {
            icon: 'icon-icon28',
            index: 'operate-0',
            title: '用户管理',
            subs: [
                {
                    show: getPermission('userSearch'),
                    index: 'members',
                    title: '会员列表'
                },
                {
                    show: getPermission('realAuthSearch'),
                    index: 'realAuth',
                    title: '会员实名认证',
                },
                {
                    show: true,
                    index: 'haitaoAuth',
                    title: '海淘实名认证',
                },
                {
                    show: getPermission('merchantsSearch'),
                    index: 'merchants',
                    title: '联盟商列表'
                },
                {
                    show: getPermission('userGroupListSearch'),
                    index: 'userGroupsList',
                    title: '用户组管理'
                }
            ]
        },
        {
            icon: 'icon-icon24',
            index: 'operate-1',
            title: '商品管理',
            subs: [
                {
                    show: getPermission('haveAuditGoodsSearch'),
                    index: 'haveAuditGoods',
                    title: '已审核商品'
                },
                {
                    show: getPermission('notuditGoodsSearch'),
                    index: 'notAuditGoods',
                    title: '待审核商品'
                }
            ]
        },
        {
            icon: 'icon-icon5',
            index: 'operate-2',
            title: '分类管理',
            subs: [
                {
                    show: getPermission('welfareMallCategoryList'),
                    index: 'welfareMallCategory',
                    title: '夺奖派对商品分类'
                },
                {
                    show: getPermission('selfMallCategoryList'),
                    index: 'selfMallCategory',
                    title: '自营商城商品分类'
                },
                {
                    show: getPermission('brandListSearch'),
                    index: 'brandList',
                    title: '自营商城品牌'
                },
                {
                    show: getPermission('storeCategoryList'),
                    index: 'storeCategory',
                    title: '店铺行业分类'
                },
                {
                    show: getPermission('supplierSearch'),
                    index: 'supplierManage',
                    title: '自营商城供应商管理'
                }
            ]
        },
        {
            icon: 'icon-icon17',
            index: 'operate-3',
            title: '平台监管',
            subs: [
                {
                    show: getPermission('feedbackSearch'),
                    index: 'feedback',
                    title: '意见反馈投诉'
                },
                // {
                //     show: true,
                //     index: 'userRegulation',
                //     title: '用户IM监管'
                // },
                {
                    show: getPermission('superviseBlackListDrawSearch'),
                    index: 'superviseBlackList',
                    title: '监管黑名单'
                }
            ]
        },
        {
            icon: 'icon-icon9',
            index: 'operate-4',
            title: '广告推送管理',
            subs: [
                {
                    show: getPermission('groomGoodsRegulationWelfareSearch') || getPermission('groomGoodsRegulationSelfSearch'),
                    index: 'groomGoodsRegulation',
                    title: '推荐商品管理'
                },
                // {
                //     show: getPermission("groomMerchantRegulationSearch"),
                //     index: 'groomMerchantRegulation',
                //     title: '推荐商户管理'
                // },
                {
                    show: getPermission('groomGameRegulationSearch'),
                    index: 'groomGameRegulation',
                    title: '推荐游戏管理'
                },
                {
                    show: getPermission('bannerListPage'),
                    index: 'bannerList',
                    title: '首页banner管理'
                },
                {
                    show: getPermission('groomContentRegulationList'),
                    index: 'groomContentRegulation',
                    title: '推送内容管理'
                },
                {
                    show: getPermission('spreadTemplateSearch'),
                    index: 'spreadTemplate',
                    title: '推广模板管理'
                },
                {
                    show: getPermission('informationList'),
                    index: 'information',
                    title: '热门资讯管理'
                },
                {
                    show: getPermission('indexActivitySearch'),
                    index: 'indexActivity',
                    title: '首页活动管理'
                },
            ]
        },
        {
            icon: 'icon-icon13',
            index: 'operate-5',
            title: '卡券管理',
            subs: [
                {
                    show: getPermission("mallDiscountTicketSearch"),
                    index: 'mallDiscountTicket',
                    title: '自营商城优惠券'
                },
                {
                    show: getPermission("shopDiscountTicketSearch"),
                    index: 'shopDiscountTicket',
                    title: '商圈店铺优惠券'
                },
                {
                    show: getPermission("mallVipCardSearch"),
                    index: 'mallVipCard',
                    title: '自营商城会员卡管理'
                },
                {
                    show: getPermission("shopVipCardSearch"),
                    index: 'shopVipCard',
                    title: '商圈店铺会员卡管理'
                },
            ]
        },
        {
            icon: 'icon-icon18',
            index: 'operate-6',
            title: '平台设置',
            subs: [
                {
                    show: getPermission("mallsetHot") || getPermission("mallsetCity") || getPermission("mallsetAuto") || getPermission("mallsetAlarm"),
                    index: 'mallSet',
                    title: '商城设置'
                },
                // { // 暂取消
                //     show: true,
                //     index: 'otherSet',
                //     title: '其他设置'
                // },
                {
                    show: getPermission('whiteListSearch') || getPermission('otherSetDetail'),
                    index: 'merchantSeniorSet',
                    title: '商户高级设置'
                },
                {
                    show: getPermission('sensitiveWordSearch') || getPermission('infoSuperSetInfo'),
                    index: 'infoSuperSet',
                    title: '信息监管设置'
                },
                {
                    show: getPermission('consumeLuckDrawCenterLiset'),
                    index: 'consumeLuckDrawCenter',
                    title: '运营模板设置'
                },
                {
                    show: getPermission('platformProtocolSetEdit') || getPermission('platformThirdLogin') || getPermission('platformMerchantEnterNumber' || getPermission('platformBasicSet')),
                    index: 'platformProtocolSet',
                    title: '平台基础设置'
                },
                {
                    show: getPermission('virtualPropertySet'),
                    index: 'virtualProperty',
                    title: '虚拟资产汇率配置'
                },
                {
                    show: getPermission('homeIconSquareSearch') ||  getPermission('homeIconWelfareSearch') ||  getPermission('homeIconMallSearch') ||  getPermission('homeIconShSearch'),
                    index: 'homeIcon',
                    title: '首页ICON管理'
                },
                {
                    show: getPermission('userLevelSearch'),
                    index: 'userLevel',
                    title: '用户等级设置'
                },
                {
                    show: getPermission('versionManageSearch'),
                    index: 'versionManage',
                    title: '版本管理'
                },
                {
                    show: getPermission("chargePaySetList"),
                    index: 'chargePaySet',
                    title: '手续费设置'
                },
                {
                    show: getPermission("sscSetList"),
                    index: 'sscSet',
                    title: '时时彩设置'
                }
            ]
        },
        {
            icon: 'icon-recharge',
            index: 'operate-10',
            title: '晓可币充值',
            subs: [
                {
                    show: getPermission("xkcurrencySearch"),
                    index: 'xkcurrency',
                    title: '充值设置'
                },
            ]
        },
        {
            icon: 'icon-icon2',
            index: 'operate-7',
            title: '城市发展管理',
            subs: [
                {
                    show: getPermission("cityTransactionSearch"),
                    index: 'cityTransaction',
                    title: '城市交易管理'
                }
            ]
        },
        {
            icon: 'icon-icon29',
            index: 'operate-8',
            title: '游戏管理',
            subs: [
                {
                    show: getPermission('gameListSearch'),
                    index: 'gameList',
                    title: '游戏列表'
                },
                {
                    show: getPermission("gamePrizePoolSearch"),
                    index: 'gamePrizePool',
                    title: '比赛奖品池'
                },
                {
                    show: getPermission("gameMatchSearch"),
                    index: 'gameMatchList',
                    title: '比赛管理'
                },
                {
                    show: getPermission('game4177'),
                    index: 'gamePlat',
                    title: '游戏平台'
                }
            ]
        },
        {
            icon: 'icon-icon15',
            index: 'operate-9',
            title: '短信模板管理',
            subs: [
                {
                    show: getPermission('infoChannelSearch'),
                    index: 'infoChannel',
                    title: '短信渠道'
                },
                {
                    show: getPermission('infoTemplateSerach'),
                    index: 'infoTemplate',
                    title: '短信模板'
                },
            ]
        },
        {
            icon: 'icon-icon26',
            index: 'operate-11',
            title: '商圈业务管理',
            subs: [
                {
                    show: getPermission('mShopQPageList'),
                    index: 'storeManage',
                    title: '商圈店铺管理'
                },
                {
                    show: getPermission('groomMerchantRegulationSearch'),
                    index: 'groomMerchantRegulation',
                    title: '商圈店铺推荐'
                },
                {
                    show: getPermission('storeQualification'),
                    index: 'businessSet',
                    title: '商圈配置'
                },
            ]
        }
    ]
}
