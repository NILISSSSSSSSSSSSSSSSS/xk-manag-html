// 分类管理

const editCategory = r => require.ensure([], () => r(require('../../../page/operate/category/page/welfare/editCategory')), 'editCategory');
const addFirstCategory = r => require.ensure([], () => r(require('../../../page/operate/category/page/welfare/addFirstCategory')), 'addFirstCategory');
const addSecondCategory = r => require.ensure([], () => r(require('../../../page/operate/category/page/welfare/addSecondCategory')), 'addSecondCategory');
const addThirdCategory = r => require.ensure([], () => r(require('../../../page/operate/category/page/welfare/addThirdCategory')), 'addThirdCategory');
const brandInfo = r => require.ensure([], () => r(require('../../../page/operate/category/page/welfare/brandInfo')), 'brandInfo');


const welfareMallCategory = r => require.ensure([], () => r(require('../../../page/operate/category/welfareMallCategory')), 'welfareMallCategory');
const selfMallCategory = r => require.ensure([], () => r(require('../../../page/operate/category/selfMallCategory')), 'selfMallCategory');
const brandList = r => require.ensure([], () => r(require('../../../page/operate/category/brandList')), 'brandList');
const storeCategory = r => require.ensure([], () => r(require('../../../page/operate/category/storeCategory')), 'storeCategory');

const supplierManage = r => require.ensure([], () => r(require('../../../page/operate/category/supplierManage')), 'supplierManage');

export default [
    { //自营商城商品分类
        path: "/selfMallCategory",
        component: selfMallCategory
    }, { // 编辑分类
        path: "/editCategory",
        component: editCategory
    }, { // 新增一级分类
        path: "/addFirstCategory",
        component: addFirstCategory
    }, { // 添加二级分类
        path: "addSecondCategory",
        component: addSecondCategory
    }, { // 添加三级分类
        path: "addThirdCategory",
        component: addThirdCategory
    }, { // 商品品牌管理
        path: "brandList",
        component: brandList
    }, { // 添加品牌
        path: "brandInfo",
        component: brandInfo
    }, { // 夺奖派对商品分类
        path: "welfareMallCategory",
        component: welfareMallCategory
    }, { // 店铺行业分类管理
        path: "storeCategory",
        component: storeCategory
    },
    { // 供应商管理
        path: "/supplierManage",
        component: supplierManage
    }
]