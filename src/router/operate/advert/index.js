const groomGoodsRegulation = r => require.ensure([], () => r(require('../../../page/operate/advert/groomGoodsRegulation')), 'groomGoodsRegulation');//推荐商品管理
const groomGameRegulation = r => require.ensure([], () => r(require('../../../page/operate/advert/groomGameRegulation')), 'groomGameRegulation');//推荐游戏管理
const bannerList = r => require.ensure([], () => r(require('../../../page/operate/advert/bannerList')), 'bannerList');//首页banner管理
const groomContentRegulation = r => require.ensure([], () => r(require('../../../page/operate/advert/groomContentRegulation')), 'groomContentRegulation');//推荐内容管理
const spreadTemplate = r => require.ensure([], () => r(require('../../../page/operate/advert/spreadTemplate')), 'spreadTemplate');//推广模板管理
const informationManage = r => require.ensure([], () => r(require('../../../page/operate/advert/information')), 'information');//热门资讯管理
const indexActivity = r => require.ensure([], () => r(require('../../../page/operate/advert/indexActivity')), 'indexActivity');//首页活动管理

export default [
    { //推荐商品管理
        path: '/groomGoodsRegulation',
        component: groomGoodsRegulation
    },
    { //推荐游戏管理
        path: '/groomGameRegulation',
        component: groomGameRegulation
    },
    { //首页banner管理
        path: '/bannerList',
        component: bannerList
    },
    { //推荐内容管理
        path: '/groomContentRegulation',
        component: groomContentRegulation
    },
    { //推广管理
        path: '/spreadTemplate',
        component: spreadTemplate
    },
    
    { //热门资讯管理
        path: '/information',
        component: informationManage
    },
    { //首页活动管理
        path: '/indexActivity',
        component: indexActivity
    },
]