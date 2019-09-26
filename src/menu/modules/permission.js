export default {
    name: '权限管理',
    items: [
        {
            icon: 'icon-search',
            index: 'permission-0',
            title: '管理员管理',
            subs: [
                {
                    show: true,
                    index: 'account',
                    title: '账户管理'
                },
                {
                    show: true,
                    index: 'role',
                    title: '角色组管理'
                },
            ]
        },
        {
            icon: 'icon-content',
            index: 'permission-1',
            title: '其它账号管理',
            subs: [
                {
                    show: true,
                    index: 'business',
                    title: '商户账号管理'
                },
                {
                    show: true,
                    index: 'cooperation',
                    title: '合伙人账号管理'
                },
                {
                    show: true,
                    index: 'virtual',
                    title: '虚拟商户账号管理'
                }
            ]
        },
        {
            icon: 'icon-extension',
            index: 'permission-2',
            title: '日志管理',
            subs: [
                {
                    show: true,
                    index: 'log',
                    title: '管理员操作日志'
                }
            ]
        }
    ]
}