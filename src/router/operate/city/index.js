const cityTransaction = r => require.ensure([], () => r(require('../../../page/operate/city/cityTransaction')), 'cityTransaction');
const specialtyFoodExamine = r => require.ensure([], () => r(require('../../../page/operate/city/specialtyFoodExamine')), 'specialtyFoodExamine');
const specialtyFoodManage = r => require.ensure([], () => r(require('../../../page/operate/city/specialtyFoodManage')), 'specialtyFoodManage');
const specialtyFoodDetail = r => require.ensure([], () => r(require('../../../page/operate/city/secondPage/specialtyFoodDetail')), 'specialtyFoodDetail');


export default [
    {
        path: "/cityTransaction", // 城市交易管理
        component: cityTransaction
    },
    {
        path: "/specialtyFoodExamine", // 游戏列表
        component: specialtyFoodExamine  //招牌菜申购审核
    },
    {
        path: "/specialtyFoodManage", // 游戏列表
        component: specialtyFoodManage  //招牌菜申购审核
    },
    {
        path: "/specialtyFoodDetail", // 游戏列表
        component: specialtyFoodDetail  //招牌菜申购审核
    }
]