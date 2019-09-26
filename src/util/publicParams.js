/**
 * 公共变量
 */

/**
 * https / http
 * @type {string}
 */
const reqHttp = window.location.protocol;

/**
 * baseUrl
 * @type {string}
 */
export const baseUrl = "/api/";


const host = location.hostname;
let phpUrl = "//zhibo.xksquare.com/"; //生产环境
let knowledgeUrl = "//xkadmin.xksquare.com/web/#/"; //生产环境
let h5Url = "//xkadmin.xksquare.com/"
if (host === "dev.xksquare.com" || host === "devw.xksquare.com") {
    //开发环境
    phpUrl = "//zb.dev.xksquare.com/"
    knowledgeUrl = "//dev.xksquare.com/web/#/"
    h5Url = "//dev.xksquare.com/"
} else if (host === "test.xksquare.com" || host === "testw.xksquare.com") {
    //测试环境
    phpUrl = "//zb.test.xksquare.com/";
    knowledgeUrl = "//test.xksquare.com/web/#/";
    h5Url = "//test.xksquare.com/"
} else if (host === "final.xksquare.com") {
    phpUrl = "//zb.final.xksquare.com/"
    knowledgeUrl = "//final.xksquare.com/web/#/";
    h5Url = "//final.xksquare.com/"
}

/**
 * catch版本号
 * @type {string}
 */
export const xkMangeVersion = "1.0.0";

/**
 * storage别名
 * @type {{}}
 */
export const alias = {
    catchVersion: "xk_manage_version"
}

/**
 * php  baseURl
 * @type {string}
 */
export const phpBaseUrl = phpUrl;
export const knowledgePointUrl = knowledgeUrl;
export const h5BaseUrl = reqHttp + h5Url;

/**
 * 签名密匙signKey
 * @type {string}
 */
export const signKey = "e10adc3949ba59abbe56e057f20f883e";

/**
 * data加密密匙dataKey
 * @type {string}
 */
export const dataKey = "c33367701511b4f6020ec61ded352059";


/**
 * 七牛上传路径
 * @type {string}
 */
// export const uploadPath = "http://upload.qiniup.com/";http(s)://://upload-z2.qiniup.com
export const uploadPath = "//upload-z2.qiniup.com/";

/**
 * 七牛上传图片预览地址
 *
 */
// export const previewPath = "http://pc5n254yj.bkt.clouddn.com/";
// export const previewPath = "http://pe453h5rw.bkt.clouddn.com/";
export const previewPath = `${reqHttp}//gc.xksquare.com/`;


/**
 * 正则表达式
 * @type {{}}
 */
export const regex = {
    phone: /^1[34578]\d{9}$/,
};


//枚举开奖方式
export const EnumJDrawType = [
    {key: 'bytime', value: '按开奖时间'},
    {key: 'bymember', value: '按开奖进度'},
    {key: 'bytime_or_bymember', value: '按开奖时间或进度'},
    {key: 'bytime_and_bymember', value: '按开奖时间和进度'}
];

//枚举审核状态
export const EnumAuditStatus = [
    {key: '', value: '全部'},
    {key: 'UNAUDITED', value: '待审核'},
    {key: 'VERIFIED', value: '已审核'},
    {key: 'UNAPPROVED', value: '未通过'}
]

//枚举夺奖派对开奖时间类型
export const EnumWeebday = [
    {key: 'monday', value: '星期一'},
    {key: 'tuesday', value: '星期二'},
    {key: 'wednesday', value: '星期三'},
    {key: 'thursday', value: '星期四'},
    {key: 'friday', value: '星期五'},
    {key: 'saturday', value: '星期六'},
    {key: 'sunday', value: '星期日'},
    {key: 'daily', value: '日历'}
];

//枚举自营商城订单状态
export const EnumOrderStatus = [
    {key: 'PRE_PAY', value: '待支付'},
    {key: 'PRE_SHIP', value: '待配送'},
    {key: 'PRE_RECEVICE', value: '待收货'},
    {key: 'PRE_EVALUATE', value: '待评价'},
    {key: 'COMPLETELY', value: '已完成'},
    {key: 'PRE_STOCK', value: '备货中'}
]

//枚举物流公司
export const EnumLogisticsName = [
    {key: 'XK', value: '晓可配送'},
    {key: 'SF', value: '顺丰'},
    {key: 'YD', value: '韵达'},
    {key: 'ZT', value: '中通'},
    {key: 'ST', value: '申通'},
    {key: 'YT', value: '圆通'},
    {key: 'BSHT', value: '百世汇通'}
]

//枚举自营商城售后申请项
export const EnumRefundType = [
    {key: '', value: '全部'},
    {key: 'REFUND', value: '仅退款'},
    {key: 'REFUND_GOODS', value: '退款退货'}];

//枚举自营商城售后状态
export const EnumRefundStatus = [
    {key: 'APPLY', value: '待审核'},
    {key: 'REFUSED', value: '未通过'},
    {key: 'PRE_REFUND', value: '待退款'},
    {key: 'REFUNDING', value: '退款中'},
    {key: 'PRE_USER_SHIP', value: '待发货'},
    {key: 'PRE_PLAT_RECEIVE', value: '待收货'},
    {key: 'COMPLETE', value: '已完成'}]

//枚举自营商城用户订单状态
export const EnumRefundUserStatus = [
    {key: 'APPLY', value: '待审核'},
    {key: 'REFUSED', value: '未通过'},
    {key: 'PRE_USER_SHIP', value: '待用户发货'},
    {key: 'PRE_PLAT_RECEIVE', value: '待平台收货'},
    {key: 'PRE_REFUND', value: '待平台退款'},
    {key: 'REFUNDING', value: '退款中'},
    {key: 'COMPLETE', value: '退款完成'},
]

//枚举自营商城售后子单状态
export const EnumRefundOrderStatus = [
    {key: 'NONE', value: '未退款'},
    {key: 'APPLY', value: '已申请'},
    {key: 'REFUSED', value: '未通过'},
    {key: 'PRE_REFUND', value: '待平台退款'},
    {key: 'REFUNDING', value: '退款中'},
    {key: 'PRE_USER_SHIP', value: '待用户发货'},
    {key: 'PRE_PLAT_RECEIVE', value: '待平台收货'},
    {key: 'COMPLETE', value: '退款完成'}
]

// 枚举短信类型
export const SmsType = [
    {key: 'AUTH', value: '短信验证码'},
    {key: 'NOTIFY', value: '通知'},
    {key: 'EXTENSION', value: '推广短信'}
]

// 枚举短信验证码业务类型
export const AuthType = [
    {key: 'REGISTER', value: '注册'},
    {key: 'LOGIN', value: '登录'},
    {key: 'RESET_PASSWORD', value: '密码重置'},
    {key: 'RESET_PHONE', value: '修改手机号'},
    {key: 'BIND_PHONE', value: '绑定手机号'},
    {key: 'CREATE_BIND_CODE', value: '创建授权码'},
    {key: 'BIND_SHOP', value: '绑定店铺'},
    {key: 'DELETE_EMPLOYEE', value: '删除员工'},
    {key: 'UNBIND_SHOP', value: '解绑店铺'},
    {key: 'BIND_BANK_CARD', value: '绑定银行卡'},
    {key: 'UNBIND_BANK_CARD', value: '解绑银行卡'},
    {key: 'CREATE_SHOP_BIND_MANAGER_PHONE', value: '创建管理员'},
    {key: 'RESET_MANAGER_PHONE', value: '修改管理员手机号'},
    {key: 'CREATE_EMPLOYEE', value: '新增员工'},
    {key: 'RESET_EMPLOYEE_PHONE', value: '修改员工手机号'},
    {key: 'VALIDATE', value: '验证'},
    {key: 'MERCHANT_RESET_PASSWORD', value: '商户未登陆找回密码'},
    {key: 'TLOGIN_BIND_PHONE', value: '三方登录绑定手机号'},
    {key: 'BIND_RIDER', value: '绑定骑手'},
    {key: 'UNBIND_RIDER', value: '骑手解绑'}
]

// 枚举短信通知业务类型
export const NotifyType = [
    {key: 'SEND_BIND_CODE', value: '发送授权码'},
    {key: 'LIGHTEN_SECURITY_CODE', value: '点亮安全码'},
    {key: 'EXTINGUISH_SECURITY_CODE', value: '熄灭安全码'},
    {key: 'NEW_BIND_SECURITY_CODE', value: '新绑定安全码'},
    {key: 'XKUSER_ACTIVATE', value: '会员激活'},
    {key: 'XKUSER_FROZEN', value: '会员冻结'},
    {key: 'MERCHANT_ACCOUNT_ACTIVATE', value: '联盟商账号激活'},
    {key: 'MERCHANT_ACCOUNT_FROZEN', value: '联盟商账号冻结'}
]

// 枚举短信推广业务类型
export const ExtensionType = [
    {key: '', value: '暂无'}
]

// 枚举所有短信业务类型
export const BizType = AuthType.concat(NotifyType, ExtensionType);


//枚举商户类型
export const EnumMerchantType = [
    {key: 'personal', value: '个人/公司/企业'},
    {key: 'anchor', value: '主播'},
    {key: 'shops', value: '商户'},
    {key: 'company', value: '公司（合伙人）'},
    {key: 'familyL1', value: '普通家族（家族长）'},
    {key: 'familyL2', value: '钻石家族（工会）'}
]

//枚举商品类型
export const EnumGoodsType = [
    {key: '', value: '全部'},
    {key: '1', value: '服务类'},
    {key: '2', value: '商品类'},
    {key: '3', value: '外卖类'},
    {key: '4', value: '住宿类'}
]

//枚举彩票类型
export const EnumLottery = [
    {key: 'liuhe_lottery', value: '六合彩票'},
    {key: 'double_chromosphere', value: '双色球彩票'},
    {key: 'super_lotto', value: '大乐透'}
]

//虚拟奖品类型
export const EnumVirtualType = [
    {key: 'aa_card', value: 'AA卡'},
    {key: 'free_card', value: '免单卡'},
    {key: 'money_car', value: '现金大奖'}
]

//枚举商户处罚设置条件定义类型
export const FineSources = [
    {key: 'sale_total_amount', label: '销售总额'},
    {key: 'active_user', label: '活跃用户数'},
    {key: 'rd_users', label: '推荐用户数'},
    {key: 'rd_merchants', label: '推荐商户数'},
    {key: 'refuse_order', label: '拒单数'},
    {key: 'turnover', label: '成交额'},
    {key: 'qualified_merchant', label: '合规商户数'},
    {key: 'rd_goods', label: '推荐商品成交额'},
    {key: 'gift_amount', label: '礼物金额'},
    {key: 'zhubo_number', label: '主播数量'},
    {key: 'live_time', label: '直播时长'},
    {key: 'vedio_publish', label: '小视频发布数'}
];

//枚举支付状态
export const PayStatus = [
    {key: 'notPay', value: '未支付'},
    {key: 'paySuc', value: '支付成功'},
    {key: 'paying', value: '支付中'},
    {key: 'payfail', value: '支付失败'}
]

//枚举彩票状态
export const EnumLotteryStatus = [
    {key: 'wait_for_choose', value: '等待选号'},
    {key: 'wait_for_bill', value: '等待出票'},
    {key: 'wait_for_ballot', value: '等待开奖'},
    {key: 'lost', value: '未中奖'},
    {key: 'wait_for_apply_acquire', value: '等待申请领奖'},
    {key: 'wait_for_claim_prize', value: '等待兑奖'},
    {key: 'wait_for_confirm_acquire', value: '等待确认到账'},
    {key: 'wait_for_comment', value: '等待晒单'},
    {key: 'wait_for_comment_audit', value: '等待晒单审核'},
    {key: 'finish', value: '结束'},
    {key: 'claim_prize_time_over', value: '兑奖过期'}
]


//枚举券类型
export const EnumTicketType = [
    {key: 'xkb', value: '晓可币'},
    {key: 'alipay', value: '支付宝'},
    {key: 'wxpay', value: '微信'},
    {key: 'xfq', value: '消费券'},
    {key: 'swq', value: '实物券'},
    {key: 'xkq', value: '晓可券'},
    {key: 'tfAlipay', value: '天府银行-支付宝'},
    {key: 'tfWxpay', value: '天府银行-微信'},
    {key: 'applePay', value: '苹果内购'}
]


//枚举支付方式
export const EnumPayWay = [
    {key: 'alipay', value: '支付宝'},
    {key: 'wxpay', value: '微信'},
    {key: 'xkb', value: '晓可币'},
    {key: 'swq', value: '实物券'},
    {key: 'xfq', value: '消费券'},
    {key: 'xfqs', value: '店铺消费券'},
    {key: 'wls', value: '物流余额'},
    {key: 'xkq', value: '账户余额'},
    {key: 'tfAlipay', value: '天府银行-支付宝'},
    {key: 'tfWxpay', value: '天府银行-微信'},
    {key: 'applePay', value: '苹果内购'},
    {key: 'gzh', value: '公众号'}
]

// 枚举联盟商类型
export const MerchantTypes = [
    {key: 'personal', label: '个人/团队/公司'},
    {key: 'company', label: '合伙人'},
    {key: 'shops', label: '商家'},
    {key: 'anchor', label: '主播'},
    {key: 'familyL1', label: '家族长'},
    {key: 'familyL2', label: '公会'}
];

// 公司性质
export const CompanyNature = [
    {key: 'STATE_OWNED', label: '国有'},
    {key: 'COLLECTIVE', label: '集体'},
    {key: 'PRIVATELY_OPERATED', label: '民营'},
    {key: 'JOINT_VENTURE', label: '合资'},
    {key: 'SHAREHOLDING_SYSTEM', label: '股份制'},
    {key: 'PERSONAL', label: '个人'},
    {key: 'OTHER', label: '其他'}
]

// 投诉原因
export const ReportReasonType = [
    {key: 'INDUCE', label: '诱导分享、关注、骗点赞'},
    {key: 'YELLOW', label: '色情低俗'},
    {key: 'ILLEGALITY', label: '违法涉改'},
    {key: 'VULGAR_CONTENT', label: '内容引人不适'},
    {key: 'ABUSE', label: '侮辱谩骂他人'},
    {key: 'SPAM', label: '垃圾广告'},
    {key: 'JUVENILE_MISCONDUCT', label: '未成年人行为不当'},
    {key: 'OTHER', label: '其他'}
]

// 投诉对象
export const ReportObjType = [
    {key: 'XKUSER', label: '小可用户'},
    {key: 'SUSER', label: '系统用户'},
    {key: 'MUSER', label: '商户'},
    {key: 'GOODS', label: '商品'},
    {key: 'SHOP', label: '店铺'},
    {key: 'VIDEO', label: '视频'},
    {key: 'MUSIC', lable: '音乐'}
]
//aa彩票类型
export const JLotteryType = [
    {key: "super_lotto", label: "大乐透"}
]


// 店铺类型
export const ShopType = [
    {key: 'MASTER', label: '总店'},
    {key: 'BRANCH', label: '分店'},
    {key: 'SHOP_IN_SHOP', label: '店中店'}
]
//抽奖监管黑名单用户状态枚举
export const EnumSuperviseBlackType = [
    {key: '0', value: '正常'},
    {key: '1', value: '封停'}
]

// 晓可币来源/去向
export const XkbSources = [
    {key: 'platform_charge', label: '平台充值'},
    {key: 'shop_charge', label: '店铺充值'},
    {key: 'winning_red_packets', label: '领取红包'},
    {key: 'giving_gifts', label: '购买礼物'},
    {key: 'game_charge', label: '游戏充值'},
    {key: 'giving_red_packets', label: '发红包'}
]

// 消费券来源/去向
export const XfqSources = [
    {key: 'platform_back', label: '平台返还'},
    {key: 'share_award', label: '晒单奖励'},
    {key: 'draw_hansel', label: '抽奖赠送'},
    {key: 'receiving_gifts', label: '收到礼物'},
    {key: 'shopping_deduction', label: '购物抵扣'},
    {key: 'jamll_exchange', label: '福利兑奖'},
    {key: 'platform_charge', label: '晓可币充值'},
    {key: 'mall_pay_back', label: '自营销售分成所得'},
    {key: 'game_consume_back', label: '游戏消费返还'},
    {key: 'other', label: '其他'}
]

//枚举交易状态
export const EnumTradeStatus = [
    {key: 'success', value: '交易成功'},
    {key: 'fail', value: '交易失败'}
]

// 兑换枚举状态
export const ExchangeStatus = [
    {key: 'paying', label: '支付中'},
    {key: 'success', label: '成功'},
    {key: 'fail', label: '失败'},
    {key: 'finish', label: '完成'}
]

// 优惠券类型枚举
export const EnumCouponType = [
    {key: 'DISCOUNT', label: '打折券'},
    {key: 'DEDUCTION', label: '抵扣券'},
    {key: 'FULL_SUB', label: '满减券'}
]
//卡券管理列表中的卡券生效状态
export const EnumCouponTypeList = [
    {key: "All", value:"全部"},
    {key: "VALIDING", value:"生效中"},
    {key: "WAIT_VALID", value:"等待生效"},
    {key: "OVERDUE", value:"已过期"},
    {key: "STOP", value:"停发"}]

// 优惠券使用范围
export const EnumCouponScope = [
    {key: 'GOODS', label: '商品'},
    {key: 'ALL', label: '全场'},
    {key: 'CATEGORY', label: '分类'},
    {key: 'SINGLE_GOODS', label: '单品'}
]

// 优惠券使用状态
export const EnumCouponStatus = [
    {key: 'UNUSED', label: '未使用'},
    {key: 'INUSE', label: '使用中'},
    {key: 'USED_BUY_GOODS', label: '购买商品已使用'},
    {key: 'USED_SEND_RED_PACKET', label: '发送红包已使用'},
    {key: 'USED_USER_GIVE', label: '用户赠送已使用'}
]

// 会员卡状态
export const EnumnewStatus = [
    {key: 'WAIT_VALID', label: '等待生效'},
    {key: 'VALIDING', label: '生效中'},
    {key: 'OVERDUE', label: '过期'},
    {key: 'ALL', label: '其他'}
]

// 会员卡类型
export const EnumcardType = [
    {key: 'GENERAL', label: '普通会员卡'},
    {key: 'VIP', label: 'VIP会员卡'}
]

//枚举商圈端订单状态类型
export const EnumShopOrderStatus = [
    {key: 'STAY_ORDER', value: '待接单'},
    {key: 'STAY_PAY', value: '待付款'},
    {key: 'STAY_CONSUMPTION', value: '待消费'},
    {key: 'STOCK_CENTRE', value: '待备货'},
    {key: 'CONSUMPTION_CENTRE', value: '进行中'},
    {key: 'COMPLETELY', value: '已完成'}
]
// 商圈订单状态
export const EnumBusinessOrderStatus = [
    {key: 'STAY_ORDER', label: '待接单'},
    {key: 'STAY_PAY', label: '待付款'},
    {key: 'STAY_CONSUMPTION', label: '待消费'},
    {key: 'STOCK_CENTRE', label: '待备货'},
    {key: 'CONSUMPTION_CENTRE', label: '进行中'},
    {key: 'STAY_EVALUATE', label: '待评价'},
    {key: 'COMPLETELY', label: '已完成'},
    {key: 'CLOSE', label: '已关闭'},
    {key: 'REFUND', label: '售后'}
]

// 商圈订单交易类型
export const EnumBusinessType = [
    {key: 'SERVICE_OR_STAY', label: '服务类或者住宿类'},
    {key: 'TAKE_OUT', label: '外卖类'},
    {key: 'LOCALE_BUY', label: '现场购物类'},
    {key: 'SERVICE_AND_LOCALE_BUY', label: '服务+现场购物'},
    {key: 'SHOP_HAND_ORDER', label: '商家手动下单'},
    {key: 'ON_LINE_TAKE_OUT', label: '在线购物'}
]

// 抽奖发放场景
export const EnumDrawTicketType = [
    {key: 'consumption_ticket', label: '消费抽奖'},
    {key: 'generalize_ticket', label: '推广抽奖'},
    {key: 'shopTicket', label: '店铺抽奖'}
]

// 期状态枚举
export const EnumSequencesStatus = [
    {key: 'running_status', label: '投放中'},
    {key: 'creation_status', label: '已创建'},
    {key: 'winning_status', label: '正在开奖'},
    {key: 'finished_status', label: '已结束'}
]

// 订单类型
export const EnumTradeProduct = [
    {key: 'b2b', label: '批发商城'},
    {key: 'b2c', label: '精选商城'},
    {key: 'o2o', label: '口碑商圈'},
    {key: 'game', label: '游戏'},
    {key: 'xkbCharge', label: '充值晓可币'}
]

// 商户抽奖类型
export const MerchantDrawType = [
    {key: 'CGift', label: '消费送礼'},
    {key: 'CLottery', label: '消费抽奖'},
    {key: 'SGift', label: '转发送奖'},
    {key: 'SLottery', label: '转发抽奖'}
]

// 店铺抽奖奖品类型
export const ShopPrizeType = [
    {key: 'memberCard', label: '会员卡'},
    {key: 'coupon', label: '优惠券'},
    {key: 'lottery', label: '彩票'},
    {key: 'good', label: '实物'},
    {key: 'AACard', label: 'aa免单卡'},
    {key: 'freeCard', label: '免单卡'},
    {key: 'xfqs', label: '商家券'},
    {key: 'goodTicket', label: '实物抽奖'},
    {key: 'AACardTicket', label: 'AA免单卡抽奖'},
    {key: 'freeCardTicket', label: '免单卡抽奖'},
    {key: 'xfqsTicket', label: '商家券抽奖'}
]

// 平台奖品类型
export const PlatformPrizeType = [
    {key: 'j_mall', label: '福利奖品'},
    {key: 'mall', label: '自营奖品'},
    {key: 'aa_lottery', label: '彩票'},
    {key: 'red_packet', label: '红包'},
    {key: 'black_packet', label: '黑名单红包'}
]

// 红包场景
export const AppScene = [
    {key: 'live_video', label: '直播'},
    {key: 'video', label: '小视频'},
    {key: 'friends_cycle', label: '朋友圈'},
    {key: 'im_group', label: '群聊'},
    {key: 'im_single', label: '私聊'}
]

// 红包类型
export const RedPacketsType = [
    {key: 'xkb', label: '晓可币'},
    {key: 'gift', label: '礼物'},
    {key: 'cardCoupon', label: '卡券'}
]

// 游戏分类
export const EnumGameType = [
    {key: 1, label: '益智'},
    {key: 2, label: '动作'},
    {key: 3, label: '角色'},
    {key: 4, label: '街机'},
    {key: 5, label: '卡牌'},
    {key: 6, label: '冒险'},
    {key: 7, label: '刺激'},
    {key: 8, label: '养成'},
    {key: 9, label: '文字'},
]


export const EnumCheckStatus = [
    {key: 'ASSESSING', value: '考核中'},
    {key: 'ASSESS_SUCCESS', value: '考核成功'},
    {key: 'ASSESS_FAIL', value: '考核失败'},
    {key: 'ASSESS_SUCCESS_AWAIT', value: '考核成功等待'},
    {key: 'ASSESS_AWAIT', value: '考核等待'}
]

//枚举奖品用途
export const EnumUsage = [
    {key: 'expense', value: '运营专用奖品'},
    {key: 'welfare', value: '福利抽奖'},
    { key: 'competition', value: '比赛专用' }
]

//枚举奖品类型
export const EnumPrizeType =[
    {key: 'substance', value: '实物奖品'},
    {key: 'virtual', value: '虚拟奖品'}
]
// 奖品来源
export const prizeSource = [
    {key: "INCREASE", label: '新增线下奖品'},
    {key: "BOUTIQUE_MALL", label: '精选商城'},
    {key: "AA_LOTTERY", label: 'AA彩票'},
    {key: "WELFARE_MALL", label: '比赛专用'},
]

//奖品用途
export const PrizeUsageEnum = [
    { key: 'expense', value: '运营专用奖品' },
    { key: 'welfare', value: '福利抽奖' },
    { key: 'competition', value: '比赛专用' }
]
