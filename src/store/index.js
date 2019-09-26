// import Vue from 'vue'
// import Vuex from 'vuex'
import transition from './modules/transition'
import permission from './modules/permission'
import selfMallManager from './modules/selfMall/manager/index'
import selfMallGoods from './modules/selfMall/goods/index'
import selfMallSet from './modules/selfMall/set/index'
import operateUser from './modules/operate/user/index'
import operateGoods from './modules/operate/goods/index'
import operatePlatform from './modules/operate/platform/index'
import operateCategory from './modules/operate/category/index'
import service from './modules/service/index'
// 直播后台
import liveGift from './modules/live/gift/index'
import liveAttention from './modules/live/attention/index'
import liveFamily from './modules/live/family/index'
import userInfo from './modules/main'

//夺奖派对
import welfarePrize from './modules/welfare/prize/index'
import welfareWelfareOrder from './modules/welfare/welfareOrder/index'

//财务管理
import financialOther from './modules/financial/other/index'
import financialMain from './modules/financial/main/index'
import financialWithdraw from './modules/financial/withdraw/index';
import financialAccount from './modules/financial/account/index';
import financialCurrency from './modules/financial/currency/index';
import financialMerchant from './modules/financial/merchant/index';
import financialDispatch from './modules/financial/dispatch/index';

// 红点数
import redTree from './redTree'

//推荐店铺管理
import operateBuiness from './modules/operate/buiness/index';

// Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        transition,
        permission,
        selfMallManager,
        selfMallGoods,
        selfMallSet,
        operateUser,
        operateGoods,
        operateCategory,
        operatePlatform,
        operateBuiness,
        service,
        liveGift,
        liveAttention,
        liveFamily,

        welfarePrize,
        welfareWelfareOrder,
        userInfo,
        financialOther,
        financialMain,
        financialWithdraw,
        financialAccount,
        financialCurrency,
        financialMerchant,
        financialDispatch,
        
        
        redTree
    }
})
