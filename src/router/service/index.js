import Main from '../../page/main';
// 任务中心
const publicServiceHall = r => require.ensure([], () => r(require('../../page/service/taskCenter/publicServiceHall')), 'publicServiceHall');
// 我的控制台
const inService = r => require.ensure([], () => r(require('../../page/service/myConsole/inService')), 'inService');
const workListDone = r => require.ensure([], () => r(require('../../page/service/myConsole/workListDone')), 'workListDone');
const workListRoam = r => require.ensure([], () => r(require('../../page/service/myConsole/workListRoam')), 'workListRoam');
const starTask = r => require.ensure([], () => r(require('../../page/service/myConsole/starTask')), 'starTask');
// 客服设置
const knowledgeBase = r => require.ensure([], () => r(require('../../page/service/serviceSet/knowledgeBase')), 'knowledgeBase');
const replySet = r => require.ensure([], () => r(require('../../page/service/serviceSet/replySet')), 'replySet');
// 客服管理中心
const serviceLoginLog = r => require.ensure([], () => r(require('../../page/service/serviceAdminCenter/serviceLoginLog')), 'serviceLoginLog');
const onlineStatus = r => require.ensure([], () => r(require('../../page/service/serviceAdminCenter/onlineStatus')), 'onlineStatus');
const missedRecord = r => require.ensure([], () => r(require('../../page/service/serviceAdminCenter/missedRecord')), 'missedRecord');
const weekTrend = r => require.ensure([], () => r(require('../../page/service/serviceAdminCenter/weekTrend')), 'weekTrend');
const complaintService = r => require.ensure([], () => r(require('../../page/service/serviceAdminCenter/complaintService')), 'complaintService');
const workList = r => require.ensure([], () => r(require('../../page/service/serviceAdminCenter/workList')), 'workList');
// 地区运营群管理
const groupManagement = r => require.ensure([], () => r(require('../../page/service/groupManagement/groupManagement')), 'groupManagement');
const groupManagementList = r => require.ensure([], () => r(require('../../page/service/groupManagement/groupManagementList')), 'groupManagementList');
export default {
    path: "/",
    component: Main,
    children: [
        // 任务中心
        {
            path: "/publicServiceHall",
            component: publicServiceHall
        },
        // 我的控制台
        {
            path: "/starTask",
            component: starTask
        },
        {
            path: "/inService",
            component: inService
        },
        {
            path: "/workListDone",
            component: workListDone
        },
        {
            path: "/workListRoam",
            component: workListRoam
        },
        // 客服设置
        {
            path: "/knowledgeBase",
            component: knowledgeBase
        },
        {
            path: "/replySet",
            component: replySet
        },
        // 客服管理中心
        {
            path: "/serviceLoginLog",
            component: serviceLoginLog
        },
        {
            path: "/onlineStatus",
            component: onlineStatus
        },
        {
            path: "/missedRecord",
            component: missedRecord
        },
        {
            path: "/weekTrend",
            component: weekTrend
        },
        {
            path: "/complaintService",
            component: complaintService
        },
        {
            path: "/workList",
            component: workList
        },
        // 地区运营群管理
        {
            path: "/groupManagement",
            component: groupManagement
        },
        {
            path: "/groupManagementList",
            component: groupManagementList
        }
    ]
}