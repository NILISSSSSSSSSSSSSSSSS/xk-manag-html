const mallDiscountTicket = r => require.ensure([], () => r(require('../../../page/operate/card/mallDiscountTicket')), 'mallDiscountTicket');//自营商城优惠券
const shopDiscountTicket = r => require.ensure([], () => r(require('../../../page/operate/card/shopDiscountTicket')), 'shopDiscountTicket');//商圈店铺优惠券
const mallVipCard = r => require.ensure([], () => r(require('../../../page/operate/card/mallVipCard')), 'mallVipCard');//自营商城会员卡管理
const shopVipCard = r => require.ensure([], () => r(require('../../../page/operate/card/shopVipCard')), 'shopVipCard');//商圈店铺会员卡管理
const mallDiscountTicketAdd = r => require.ensure([], () => r(require('../../../page/operate/card/mallDiscountTicket/mallDiscountTicketAdd')), 'mallDiscountTicketAdd');//自营商城优惠券添加


export default [
    { //自营商城优惠券
        path: '/mallDiscountTicket',
        component: mallDiscountTicket
    },
    { //商圈店铺优惠券
        path: '/shopDiscountTicket',
        component: shopDiscountTicket
    },
    { //自营商城会员卡管理
        path: '/mallVipCard',
        component: mallVipCard
    },
    { //商圈店铺会员卡管理
        path: '/shopVipCard',
        component: shopVipCard
    },
    { //自营商城优惠券添加
        path: '/mallDiscountTicketAdd',
        component: mallDiscountTicketAdd
    }
]