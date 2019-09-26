import {baseUrl} from '../util/publicParams'

export default {
    // 任务中心
    xkCustomerServiceTaskList: baseUrl + "im/om/xkCustomerServiceTaskList/1.0",//任务列表

    xkCustomerServiceReceipt: baseUrl + "im/om/xkCustomerServiceReceipt/1.0",//晓可客服接单

    // 客服
    

    xkCustomerServiceNotFinishList: baseUrl + "im/om/xkCustomerServiceNotFinishList/1.0",//客服未完成任务列表

    xkCustomerServiceTaskStart: baseUrl + "im/om/xkCustomerServiceTaskStart/1.0",//添加星标工单

    xkCustomerServiceTaskStartCancel: baseUrl + "im/om/xkCustomerServiceTaskStartCancel/1.0",//取消星标工单

    expireLog: baseUrl + "im/om/expireLog/1.0",//业务错过记录

    workOrderMsgRecordsList: baseUrl + "im/om/workOrderMsgRecordsList/1.0",//查询工单消息记录


    // 我的工作台
    workListDone: baseUrl + "manager/om/workOrderPageNormal/1.0",//已完成工单

    workOrderFinish: baseUrl + "manager/om/workOrderFinish/1.0",//创建-受理中-完成

    workOrderTransfer: baseUrl + "manager/om/workOrderTransfer/1.0",//创建-受理中-流转

    workOrderReceipt: baseUrl + "manager/om/workOrderReceipt/1.0",//流转接单
    
    invitationEvaluate: baseUrl + "im/om/invitationEvaluate/1.0",//评价

    workOrderPageTakeOver: baseUrl + "manager/om/workOrderPageTakeOver/1.0",//工单流转-列表

    workOrderPageComplete: baseUrl + "manager/om/workOrderPageComplete/1.0",//已完成工单列表




    // 客服设置
    questionQList: baseUrl + "manager/om/questionQList/1.0",//问题列表
    
    questionCreate: baseUrl + "manager/om/questionCreate/1.0",//创建问题
    
    questionDisable: baseUrl + "manager/om/questionDisable/1.0",//停封问题

    questionEnable: baseUrl + "manager/om/questionEnable/1.0",//启用问题

    questionDelete: baseUrl + "manager/om/questionDelete/1.0",//删除问题

    questionDetail: baseUrl + "manager/om/questionDetail/1.0",//查看问题

    questionUpdate: baseUrl + "manager/om/questionUpdate/1.0",//编辑问题

    categoryManagerCreate: baseUrl + "manager/om/categoryManagerCreate/1.0",//新增分类

    categoryManagerList: baseUrl + "manager/om/categoryManagerList/1.0",//分类列表

    categoryManagerDisable: baseUrl + "manager/om/categoryManagerDisable/1.0",//分类封停

    categoryManagerEnable: baseUrl + "manager/om/categoryManagerEnable/1.0",//分类启用

    categoryManagerDelete: baseUrl + "manager/om/categoryManagerDelete/1.0",//分类删除

    categoryManagerUpdate: baseUrl + "manager/om/categoryManagerUpdate/1.0",//编辑分类

    categoryManagerDetail: baseUrl + "manager/om/categoryManagerDetail/1.0",//查看分类

    knowledgePointList: baseUrl + "manager/om/knowledgePointList/1.0",//知识列表

    knowledgePointCreate: baseUrl + "manager/om/knowledgePointCreate/1.0",//新增知识点

    knowledgePointDelete: baseUrl + "manager/om/knowledgePointDelete/1.0",//删除知识点
    
    knowledgePointUpdate: baseUrl + "manager/om/knowledgePointUpdate/1.0",//修改知识点

    knowledgePointDisable: baseUrl + "manager/om/knowledgePointDisable/1.0",//封停知识点

    knowledgePointEnable: baseUrl + "manager/om/knowledgePointEnable/1.0",//启动知识点

    knowledgePointDetail: baseUrl + "manager/om/knowledgePointDetail/1.0",//查看知识点

    csQuickReplyQPage: baseUrl + "manager/om/csQuickReplyQPage/1.0",//快捷回复内容列表
    
    csQuickReplyCreate: baseUrl + "manager/om/csQuickReplyCreate/1.0",//添加快捷回复

    cdQuickReplyDelete: baseUrl + "manager/om/cdQuickReplyDelete/1.0",//删除快捷回复

    csQuickReplyDetail: baseUrl + "manager/om/csQuickReplyDetail/1.0",//查看快捷回复详情

    csQuickReplyUpdate: baseUrl + "manager/om/csQuickReplyUpdate/1.0",//修改快捷回复内容

    csQuickReplyUpdateStatus: baseUrl + "manager/om/csQuickReplyUpdateStatus/1.0",//修改快捷回复状态

    csSetReplyDetail: baseUrl + "manager/om/csSetReplyDetail/1.0",//获取自动、离线回复、接待人数

    csSetReplyUpdate: baseUrl + "manager/om/csSetReplyUpdate/1.0",//修改自动、离线回复、接待人数

    csCustomerUpdate: baseUrl + "manager/om/csCustomerUpdate/1.0",//客服个人资料设置

    csCustomerDetail: baseUrl + "manager/om/csCustomerDetail/1.0",//客服个人资料详情

    knowledgePointCategoryPage: baseUrl + "manager/om/knowledgePointCategoryPage/1.0",//知识库分类分页

    KnowledgePointCategoryEnable: baseUrl + "manager/om/KnowledgePointCategoryEnable/1.0",//知识库分类启用

    KnowledgePointCategoryDisable: baseUrl + "manager/om/KnowledgePointCategoryDisable/1.0",//知识库分类禁用

    knowledgePointCategoryDetail: baseUrl + "manager/om/knowledgePointCategoryDetail/1.0",//知识库分类详情

    KnowledgePointCategoryCreate: baseUrl + "manager/om/KnowledgePointCategoryCreate/1.0",//知识库分类创建

    knowledgePointCategoryUpdate: baseUrl + "manager/om/knowledgePointCategoryUpdate/1.0",//知识库分类修改


    // 客服管理中心
    csLoginLogQPage: baseUrl + "manager/om/csLoginLogQPage/1.0",//客服登录日志列表

    csWorkStatusQPage: baseUrl + "manager/om/csWorkStatusQPage/1.0",//坐席状态列表

    expireTimeSetting: baseUrl + "manager/om/expireTimeSetting/1.0",//设置过期时间

    expireTimeDetail: baseUrl + "manager/om/expireTimeDetail/1.0",//查看过期时间

    workOrderStatistics: baseUrl + "manager/om/workOrderStatistics/1.0",//近一周工作量趋势

    complaintPage: baseUrl + "manager/om/complaintPage/1.0",//投诉列表

    workOrderPage: baseUrl + "manager/om/workOrderPage/1.0",//工单列表(管理员)

    workOrderDetail: baseUrl + "manager/om/workOrderDetail/1.0",//工单详情

    complaintDetail: baseUrl + "manager/om/complaintDetail/1.0",//投诉详情

    customerQPage: baseUrl + "user/om/customerQPage/1.0",//查询所有的客服

    // 地区运营群
    teamList: baseUrl + "manager/om/teamList/1.0",//官方群列表

    trainTeamCreate: baseUrl + "manager/om/trainTeamCreate/1.0",//创建晓可官方群

    teamInfo: baseUrl + "manager/om/teamInfo/1.0",//查询官方群信息

    userTeamAuth: baseUrl + "manager/om/userTeamAuth/1.0",//查询当前登录用户是否在群内

    teamUserMute: baseUrl + "manager/om/teamUserMute/1.0",//禁言群成员

    muteAll: baseUrl + "manager/om/muteAll/1.0",//禁言整个群

    teamFileUpload: baseUrl + "manager/om/teamFileUpload/1.0",//上传群文件

    teamFileList: baseUrl + "manager/om/teamFileList/1.0",//群文件列表

    betachUpdateTeamManager: baseUrl + "manager/om/betachUpdateTeamManager/1.0",//批量修改群管理员

    changeTeamOwner: baseUrl + "manager/om/changeTeamOwner/1.0",//更换群主

    teamRemove1: baseUrl + "manager/om/teamRemove1/1.0",//解散群

    teamMsgRecordPage: baseUrl + "manager/om/teamMsgRecordPage/1.0",//培训群历史聊天记录查询

    mShopQPageList: baseUrl + "manager/om/mShopQPageList/2.1.0",//商圈店铺列表

    updateShopOnbusinessStatus: baseUrl + "manager/om/updateShopOnbusinessStatus/2.1.0",//修改店铺营业状态
}