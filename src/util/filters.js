/**
 * Created by choizhang on 2018/1/31.
 */
// import Vue from 'vue';
import Moment from 'moment';
import filterMath from './math';

Vue.filter('formatTime', (time, type) => {
    if (!time) {
        return ""
    }
    time = Number(time) < 10000000000 ? time * 1000 : time;
    if (type) {
        return Moment(time).format(type);
    } else {
        return Moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
});

Vue.filter('formatSize', (bytes) => {
    if (bytes === 0) return '0 B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
});

Vue.filter('decodeURI', (url) => {
    if (url) {
        return decodeURIComponent(url)
    }
    return "";
})

Vue.filter('formatPrice', (value) => {
    if (value) {
        return Number(value).toFixed(2);
    } else {
        return "0.00";
    }
})

Vue.filter('viewerType', (type) => {
    switch (type) {
        case 'USER':
            return "晓可用户";
        case 'PERSONAL':
            return "个人";
        case 'COMPANY':
            return "合伙人";
        case 'SHOPS':
            return "商户";
        case 'ANCHOR':
            return "主播";
        case 'FAMILYL1':
            return "家族长";
        case 'FAMILYL2':
            return "公会";
        default:
            break;
    }
})

Vue.filter('bannerModule', (type) => {
    switch (type) {
        case 'XKSQUARE':
            return "晓可广场";
        case 'BUSINESS_AREA':
            return "商圈首页";
        case 'WELFARE':
            return "夺奖派对首页(广场)";
        case 'SELF_SHOP':
            return "自营商城首页";
        case 'ALLIANCE':
            return "晓可联盟首页";
        case 'LIVE_VIDEO':
            return "晓可直播首页";
        case 'MERCHANT_WELFARE':
            return '夺奖派对首页(商户)';
        case 'MERCHANT_SELF_SHOP':
            return '批发商城首页';
        case 'GAME':
            return '游戏首页';
        case 'WX_GAME':
            return '微信服务号游戏中心首页';
        default:
            break;
    }
})

Vue.filter('templateName', (type) => {
    switch (type) {
        case 'TMP_ONE':
            return "模板一";
        case 'TMP_TWO':
            return "模板二";
        case 'TMP_THREE':
            return "模板三";
        case 'TMP_FOUR':
            return "模板四";
        case 'TMP_FIVE':
            return "模板五";
        default:
            break;
    }
})

Vue.filter('msgType', (type) => {
    switch (type) {
        case 1001:
            return "文本消息";
        case 1002:
            return "图片消息";
        case 1003:
            return "语音消息";
        case 4002:
            return "知识点消息";
        case 4001:
            return "订单消息";
        default:
            return "未知消息";
            break;
    }
})

Vue.filter('WorkStatus', (type) => {
    switch (type) {
        case 'finish':
            return "已完成";
        case 'not_receipt':
            return "未接单";
        case 'receipt':
            return "已接单";
        case 'evaluate':
            return "已评价";
        default:
            break;
    }
})

Vue.filter('UserType', (type) => {
    switch (type) {
        case 'user':
            return "晓可用户";
        case 'muser':
            return "商户用户";
        case 'anchor':
            return "主播";
        default:
            break;
    }
})

Vue.filter('MerchantType', (type) => {
    switch (type) {
        case 'EXTENSION_WORKER':
            return "个人";
        case 'ZHUBO':
            return "主播";
        case 'MERCHANT':
            return "商户";
        case 'PARTNER':
            return "合伙人";
        case 'BROKERAGE_FIRM':
            return "经济公司";
        default:
            break;
    }
})
Vue.filter('AllianceMerchantType', (type) => {
    switch (type) {
        case 'personal':
            return "个人";
        case 'anchor':
            return "主播";
        case 'shops':
            return "商户";
        case 'company':
            return "公司（合伙人）";
        case 'familyL1':
            return "普通家族（家族长）";
        case 'familyL2':
            return "钻石家族（工会）";
        default:
            break;
    }
})
Vue.filter('GameCategory', (type) => {
    switch (type) {
        case 1:
            return "益智";
        case 2:
            return "动作";
        case 3:
            return "角色";
        case 4:
            return "街机";
        case 5:
            return "卡牌";
        case 6:
            return "冒险";
        case 7:
            return "刺激";
        case 8:
            return "养成";
        case 9:
            return "文字";
        default:
            break;
    }
})

Vue.filter('NumThree', (value) => {
    let num = '' + value;
    let arr = num.split('.');
    let IntNum = '' + Number.parseInt(arr[0]);
    return IntNum.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (arr[1] ? '.' + arr[1] : '');
})
Vue.filter('Division', (value, num) => {
    if (!value) {
        return 0;
    }
    let denominator = num ? num : 100;
    return filterMath.divide(value, denominator);
})
Vue.filter('Multiplication', (value, num) => {
    if (!value) {
        return 0;
    }
    let multiple = num ? num : 100;
    return filterMath.multip(value, multiple);
})

// 赠送方式
Vue.filter('lotterySource', (value) => {
    switch (value) {
        case 'platform_activity':
            return '平台'
        case 'merchant_activity':
            return '商户'
        case 'jorder_comment':
            return '晒单'
        default:
            break;
    }
})
Vue.filter('lotteryStatus', (value) => {
    switch (value) {
        case 'lost':
            return '未中奖'
        case 'finish':
            return '已兑奖'
        case 'claim_prize_time_over':
            return '兑奖失败'
        default:
            break;
    }
})


// -------------------竞赛列表------------
Vue.filter('competitionStatus', (value) => {
        let list = { "PREPARE": "准备中", "APPLY": "报名中", "AWAIT_BEGIN": "待开赛", "COMPETITIONED": "比赛中", "AWAIT_SETTLE": "待结算", "OFF_LINE": "已下线", "CANCEL": "已取消" };
        return list[value] ? list[value] : ""
    })
    // -------------------轮次状态------------
Vue.filter('roundStatus', (value) => {
        let list = { "AWAIT_BEGIN": "未开始", "COMPETITIONED": "进行中", "AWAIT_SETTLE": "待结算", "SETTLED": "已结束", };
        return list[value] ? list[value] : ""
    })
    // -------------------竞赛列表------------
Vue.filter('PrizeStatus', (value) => {
    let list = { "normal": "正常", "abnormal": "异常" };
    return list[value] ? list[value] : ""
})

// -------------------类型------------
Vue.filter('competitionType', (value) => {
    let list = { "GAME": "游戏类", "UPLOAD": "上传类" };
    return list[value] ? list[value] : ""
})

export const prizeSource = [
    { key: "INCREASE", label: '新增' },
    { key: "BOUTIQUE_MALL", label: '精选商城' },
    { key: "AA_LOTTERY", label: 'AA彩票' },
    { key: "WELFARE_MALL", label: '比赛专用' },
]
Vue.filter('prizeSource', value => {
    switch (value) {
        case 'INCREASE':
            return '新增'
        case 'BOUTIQUE_MALL':
            return '精选商城'
        case 'AA_LOTTERY':
            return 'AA彩票'
        case 'WELFARE_MALL':
            return '比赛专用'
        default:
            return value;
            break;
    }
})


// -------------------发放状态------------
Vue.filter('prizeSendStatus', (value) => {
        let list = { "unsend": "未发送", "sending": "发送中", "sendsuc": "发送成功", "sendfail": "发送失败", };
        return list[value] ? list[value] : ""
    })
    // -------------------发放方式------------
Vue.filter('terrain', (value) => {
    let list = { "online": "线上", "offline": "线下" };
    return list[value] ? list[value] : ""
})

//
Vue.filter('aaLotterySource', (value) => {
    let list = { "platform_activity": "平台抽奖", "merchant_activity": "店铺抽奖", "jorder_comment": "晒单", "competition": "比赛" };
    return list[value] ? list[value] : ""
})

Vue.filter('acceptanceStatus', (type) => {
    switch (type) {
        case 'NO_ACCEPT':
            return "未受理";
        case 'REQUIRE':
            return "转需求";
        case 'DEFECT':
            return "转缺陷";
        case 'DESIGN':
            return "设计如此";
        default:
            break;
    }
});
Vue.filter('platformStatus', (type) => {
    switch (type) {
        case 'ua':
            return "用户app";
        case 'ma':
            return "商户app";
        case 'mam':
            return "商户web";
        case 'zb':
            return "直播";
        case 'om':
            return "小可运营后台";
        case 'da':
            return "骑手APP";
        default:
            break;
    }
})
