import {getPermission} from '../../util/publicMehotds'
export default {
    name: '自营商城',
    items: [
        {
            icon: 'icon-icon24',
            index: 'selfmall-0',
            title: '商品管理',
            subs: [
                {
                    show: getPermission("homePageFixed"),
                    index: 'board',
                    title: '自营商城首页'
                },
                {
                    show: getPermission("commoditySalesSearch") || getPermission("uploadGoodsAdd"),
                    index: 'commoditySales',
                    title: '销售中的商品',
                },
                {
                    show: getPermission("lowerGoodsSearch") || getPermission("uploadGoodsAdd"),
                    index: 'lowerGoods',
                    title: '已下架的商品'
                },
                {
                    show: getPermission("evaluateSearch"),
                    index: 'evaluate',
                    title: '评价管理'
                },
                {
                    show: getPermission("uploadGoodsAdd"),
                    index: 'uploadGoods',
                    title: '上传商品'
                },
                {
                    show: getPermission("virtualMallEvaluateList"),
                    index: 'virtualMallEvaluate',
                    title: '自营商城虚拟评价上传'
                },
                {
                    show: getPermission("virtualShEvaluateList"),
                    index: 'virtualShEvaluate',
                    title: '口碑商圈虚拟评价上传'
                },
                {
                    show: getPermission("virtualMallSalesList"),
                    index: 'virtualMallSales',
                    title: '自营商城虚拟销量上传'
                },
                {
                    show: getPermission("virtualShSalesList"),
                    index: 'virtualShSales',
                    title: '口碑商圈虚拟销量上传'
                }
            ]
        },
        {
            icon: 'icon-icon4',
            index: 'selfmall-1',
            title: '订单管理',
            subs: [
                {
                    show: getPermission("orderListGoodsSearch"),
                    index: 'orderListGoods',
                    title: '订单列表'
                },
                {
                    show: getPermission("orderListAfterSaleSearch"),
                    index: 'orderListAfterSale',
                    title: '售后订单列表'
                },
                {
                    show: getPermission("closeGoodsListSearch"),
                    index: 'closeGoodsList',
                    title: '已关闭的订单'
                }
            ]
        },
        {
            icon: 'icon-icon23',
            index: 'selfmall-2',
            title: '商城设置',
            subs: [
                // {
                //     show: true,
                //     // show: getPermission("mallInfoDetail") || getPermission("mallInfoSetting"),
                //     index: 'mallInfo',
                //     title: '基本信息'
                // },
                {
                    show: getPermission("priceModalSearch"),
                    index: 'priceModal',
                    title: '运费模板'
                },
                {
                    show: getPermission("invoiceManagerSearch"),
                    index: 'invoiceManager',
                    title: '发票管理'
                },
                {
                    show: getPermission("goodsServiceManageList"),
                    index: 'goodsServiceManage',
                    title: '商品服务管理'
                }
            ]
        }
    ]
}
