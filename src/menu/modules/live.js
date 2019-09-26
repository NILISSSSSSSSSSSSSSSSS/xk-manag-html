import {getPermission} from '../../util/publicMehotds'

export default {
    name: "直播后台",
    items: [
        {
            icon: "icon-icon11",
            index: 'live-0',
            title: "家族管理",
            subs: [
                {
                    show: getPermission("normalFamilySearch"),
                    index: "normalFamily",
                    title: "普通家族管理"
                },
                {
                    show: getPermission("diamondFamilySearch"),
                    index: "diamondFamily",
                    title: "钻石家族管理"
                },
                {
                    show: getPermission("hostListSearch"),
                    index: 'hostList',
                    title: '主播管理'
                },
                {
                    show: getPermission("interventionSearch"),
                    index: 'intervention',
                    title: '主播退出家族'
                },
                {
                    show: getPermission("interventionFamilySearch"),
                    index: 'interventionFamily',
                    title: '家族退出钻石家族'
                },
                {
                    show: getPermission("recommendHostSearch"),
                    index: 'recommendHost',
                    title: '推荐主播申请审核'
                }
            ]
        },
        {
            icon: "icon-icon2",
            index: "live-1",
            title: "关注",
            subs: [
                {
                    show: getPermission("recommendedUserSearch"),
                    index: "recommendedUser",
                    title: "推荐用户列表"
                }
            ]
        }, 
        {
            icon: "icon-icon16",
            index: "live-2",
            title: "礼物管理",
            subs: [
                {
                    show: getPermission("giftListSearch"),
                    index: "giftList",
                    title: "所有礼物" 
                }, 
                {
                    show: getPermission("hourSetSet"),
                    index: "hourSet",
                    title: "上小时排行设置"
                }
            ]
        }, 
        // {
        //     icon: "icon-system_manage",
        //     index: "live-3",
        //     title: "系统管理",
        //     subs: [
        //         {
        //             show: true,
        //             index: "thirdShare",
        //             title: "第三方分享" 
        //         }
        //     ]
        // }
    ]
}