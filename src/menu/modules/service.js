import { getPermission } from "../../util/publicMehotds";

export default {
    name: '客服',
    items: [
        {
            icon: 'icon-icon20',
            index: 'service-0',
            title: '任务中心',
            subs: [
                {
                    show: getPermission('publicServiceHallSearch'),
                    index: 'publicServiceHall',
                    title: '公共任务大厅'
                }
            ]
        },
        {
            icon: 'icon-icon26',
            index: 'service-1',
            title: '我的工作台',
            subs: [
                {
                    show: getPermission('inServicePage'),
                    index: 'inService',
                    title: '受理中'
                },
                {
                    show: getPermission('starTaskPage'),
                    index: 'starTask',
                    title: '星标任务'
                },
                {
                    show: getPermission('workListDoneSearch'),
                    index: 'workListDone',
                    title: '已完成工单'
                },
                {
                    show: getPermission('workListRoamPage'),
                    index: 'workListRoam',
                    title: '工单流转'
                }
            ]
        },
        {
            icon: 'icon-icon15',
            index: 'service-2',
            title: '客服设置',
            subs: [
                {
                    show: getPermission('knowledgeBaseKnowClassPage') || getPermission('knowledgeBaseQusPage') || getPermission('knowledgeBaseQusClassPage'),
                    index: 'knowledgeBase',
                    title: '知识库'
                },
                {
                    show: getPermission('replySetFastPage') || getPermission('replySetAuto') || getPermission('replySetNum') || getPermission('replySetPersonalData'),
                    index: 'replySet',
                    title: '回复设置'
                }
            ]
        },
        {
            icon: 'icon-icon14',
            index: 'service-3',
            title: '客服管理中心',
            subs: [
                {
                    show: getPermission('serviceLoginLogSearch'),
                    index: 'serviceLoginLog',
                    title: '客服登录日志'
                },
                {
                    show: getPermission('onlineStatusSearch'),
                    index: 'onlineStatus',
                    title: '坐席在线状态'
                },
                {
                    show: getPermission('missedRecordPage'),
                    index: 'missedRecord',
                    title: '业务错过记录'
                },
                {
                    show: getPermission('weekTrendPage'),
                    index: 'weekTrend',
                    title: '近一周工作量趋势'
                },
                {
                    show: getPermission('complaintServicePage'),
                    index: 'complaintService',
                    title: '投诉客服记录'
                },
                {
                    show: getPermission('workListSearch'),
                    index: 'workList',
                    title: '工单列表'
                }
            ]
        },
        {
            icon: 'icon-business',
            index: 'service-4',
            title: '地区运营群管理',
            subs: [
                {
                    show: getPermission('groupManagementListSearch'),
                    index: 'groupManagementList',
                    title: '群列表'
                },
                {
                    show: getPermission('groupManagementSearch'),
                    index: 'groupManagement',
                    title: '聊天'
                }
            ]
        }
    ]
}