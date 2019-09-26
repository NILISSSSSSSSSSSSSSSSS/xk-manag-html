import {baseUrl} from '../util/publicParams'

export default {
    //根据父分类返回子分类
    queryByPCode: baseUrl + 'manager/om/queryByPCode/1.0',
    //商品新增
    goodsCreate: baseUrl + 'manager/om/goodsCreate/1.0',
    //返回所有分类(商城）
    queryList: baseUrl + 'manager/om/categoryQueryList/1.0',

    queryAll: baseUrl + 'manager/om/queryAll/1.0',
    //根据分类返回分类属性
    queryCategoryAttrList: baseUrl + 'manager/om/queryCategoryAttrList/1.0',
    //销售中商品列表
    goodsOnSaleQPage: baseUrl + 'manager/om/goodsOnSaleQPage/1.0',
    //已下架商品列表
    goodsUnshelveQPage: baseUrl + 'manager/om/goodsUnshelveQPage/1.0',
    //批量下架
    unshelveGoods: baseUrl + 'manager/om/goodsUnshelve/1.0',
    //批量上架
    goodsAdded: baseUrl + 'manager/om/goodsAdded/1.0',
    //设置基本信息
    mallInfoSetting: baseUrl + 'manager/om/mallInfoSetting/1.0',
    //查看详情
    mallInfoDetail: baseUrl + 'manager/om/mallInfoDetail/1.0',
    //删除运费模板
    postfeeDelete: baseUrl + 'manager/om/postfeeDelete/1.0',
    //批量删除运费模板
    postfeeDeleteByIds: baseUrl + 'manager/om/postfeeDeleteByIds/1.0',
    //新建运费模板
    postfeeCreate: baseUrl + 'manager/om/postfeeCreate/1.0',
    //运费模板列表
    postfeeQPage: baseUrl + 'manager/om/postfeeQPage/1.0',
    //获取商品详情
    jfmallGoodsDetail: baseUrl + 'manager/om/jfmallGoodsDetail/1.0',
    //运费模板详情
    postfeeDetail: baseUrl + 'manager/om/postfeeDetail/1.0',
    //修改运费模板
    postfeeUpdate: baseUrl + 'manager/om/postfeeUpdate/1.0',
    //商品编辑
    goodsUpdate: baseUrl + 'manager/om/goodsUpdate/1.0',
    //自营商品明细
    goodsDetail: baseUrl + 'manager/om/goodsDetail/1.0',
    //查询全部
    postfeeQList: baseUrl + 'manager/om/postfeeQList/1.0',

    //评论列表
    mallGoodsCommentList: baseUrl + 'manager/om/mallGoodsCommentList/1.0',
    //评论管理列表
    mallGoodsCommentList4Manager: baseUrl + 'manager/om/mallGoodsCommentList4Manager/1.0',
    //回复评论
    mallGoodsCommentMallReply4Manager: baseUrl + 'manager/om/mallGoodsCommentMallReply4Manager/1.0',
    //评价详情
    mallGoodsCommentDetail: baseUrl + 'manager/om/mallGoodsCommentDetail/1.0',
    //回复列表
    mallGoodsCommentReplyList4Manager: baseUrl + 'manager/om/mallGoodsCommentReplyList4Manager/1.0',


    //订单管理
    mallOBMFinishOrderQPage: baseUrl + 'manager/om/mallOBMFinishOrderQPage/1.0',
    //订单列表
    mallOBMOrderQPage: baseUrl + 'manager/om/mallOBMOrderQPage/1.0',
    //已关闭订单列表
    mallOBMFinishOrderQPage: baseUrl + 'manager/om/mallOBMFinishOrderQPage/1.0',
    //售后订单
    mallRefundOrderQPage: baseUrl + 'manager/om/mallRefundOrderQPage/1.0',
    //修改运费详情页面
    mallOrderUpdatePostFeeDetail: baseUrl + 'manager/om/mallOrderUpdatePostFeeDetail/1.0',
    //修改运费
    mallOrderUpdatePostFee: baseUrl + 'manager/om/mallOrderUpdatePostFee/1.0',
    //确认发货
    mallOrderConfirmShipping: baseUrl + 'manager/om/mallOrderConfirmShipping/1.0',
    //订单详情
    mallOrderDetail: baseUrl + 'manager/om/mallOrderDetail/1.0',
    //确认收到用户返货
    mallOrderConfirmReceive: baseUrl + 'manager/om/mallOrderConfirmReceive/1.0',
    //确认退款
    mallOrderConfirmRefund: baseUrl + 'manager/om/mallOrderConfirmRefund/1.0',
    //同意退款
    mallOrderRefundAccept: baseUrl + 'manager/om/mallOrderRefundAccept/1.0',
    //拒绝申请
    mallOrderRefundRefused: baseUrl + 'manager/om/mallOrderRefundRefused/1.0',
    //审核状态详情
    mallOrderAuditDetail: baseUrl + 'manager/om/mallOrderAuditDetail/1.0',
    //售后订单确认售后详情
    mallOrderMoneyDetail: baseUrl + 'manager/om/mallOrderMoneyDetail/1.0',
    // 附近骑手列表
    nearbyRider: baseUrl + 'manager/om/nearbyRider/1.0',
    // 骑手派单
    dispatchOrder: baseUrl + 'manager/om/dispatchOrder/1.0',


    //发票列表
    invoiceQPage: baseUrl + 'manager/om/invoiceQPage/1.0',
    //详情
    invoiceDetail: baseUrl + 'manager/om/invoiceDetail/1.0',

    //关联商户列表merchantManagerPage
    merchantManagerPage: baseUrl + 'manager/om/merchantManagerPage/2.0',
    //控制台
    homePageFixed: baseUrl + 'manager/om/homePageFixed/1.0',
    homePageSales: baseUrl + 'manager/om/homePageSales/1.0',
    homePageVolume: baseUrl + 'manager/om/homePageVolume/1.0',


    //下载订单列表
    downloadMallOrderPage: baseUrl + 'manager/om/downloadMallOrderPage/1.0',




    //商品服务
    //新增
    sgoodsServiceCreate: baseUrl + 'manager/om/sgoodsServiceCreate/2.0.12',
    //删除
    sgoodsServiceDelete: baseUrl + 'manager/om/sgoodsServiceDelete/2.0.12',
    //所有有效商品服务
    sgoodsServices: baseUrl + 'manager/om/sgoodsServices/2.0.12',
    //修改
    sgoodsServiceUpdate: baseUrl + 'manager/om/sgoodsServiceUpdate/2.0.12',
    //下拉框
    supplierQListEffective: baseUrl + 'manager/om/supplierQListEffective/2.0.12',
    //自营商品服务是否可删除
    sgoodsServiceDeleteAfterGoods: baseUrl + 'manager/om/sgoodsServiceDeleteAfterGoods/2.0.12',
    //自营商品查询服务
    sgoodsServicesByName: baseUrl + 'manager/om/sgoodsServicesByName/2.0.12',


    //商品虚拟销量列表
    virtualQPage:  baseUrl + 'manager/om/virtualQPage/1.0',
    virtualCreate:  baseUrl + 'manager/om/virtualCreate/1.0',
    virtualUpdate:  baseUrl + 'manager/om/virtualUpdate/1.0',
    virtualDetail:  baseUrl + 'manager/om/virtualDetail/1.0',
    virtualShopQPage:  baseUrl + 'manager/om/virtualShopQPage/1.0',
    goodsQPageInMall:  baseUrl + 'manager/om/goodsQPageInMall/2.0.12',
    createCommentsInMall: baseUrl + 'manager/om/createCommentsInMall/2.0.12',
    goodsQPageInBCircle:  baseUrl + 'manager/om/goodsQPageInBCircle/2.0.12',
    createCommentsInBCircle: baseUrl + 'manager/om/createCommentsInBCircle/2.0.12',
    //
    QPageInMall: baseUrl + 'manager/om/QPageInMall/2.0.12',  //平台
    QPageInBCircle:  baseUrl + 'manager/om/QPageInBCircle/2.0.12',  //商圈
    detailCommentsInMall:  baseUrl + 'manager/om/detailCommentsInMall/2.0.12',
    detailCommentsInBCircle: baseUrl + 'manager/om/detailCommentsInBCircle/2.0.12',
    deleteCommentsInBCircle:  baseUrl + 'manager/om/deleteCommentsInBCircle/2.0.12',
    deleteCommentsInMall:  baseUrl + 'manager/om/deleteCommentsInMall/2.0.12',
    editCommentsInMall: baseUrl + 'manager/om/editCommentsInMall/2.0.12',
    editCommentsInBCircle: baseUrl + 'manager/om/editCommentsInBCircle/2.0.12',


    //大宗商品
    confirmOrderByBigGoods: baseUrl + 'manager/om/confirmOrderByBigGoods/1.0',

    //修改物流
    sOrderUpdateLogistics: baseUrl + 'manager/om/sOrderUpdateLogistics/2.1.1'
}