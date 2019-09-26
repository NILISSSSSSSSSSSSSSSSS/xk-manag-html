import {getPermission} from '../../util/publicMehotds'

export default {
    name: '统计分析',
    items: [
        {
            icon: 'icon-service',
            index: 'census-0',
            title: '统计分析',
            subs: [
                {
                    show: getPermission("sellCreate"),
                    index: 'addgoods',
                    title: '活跃分析'
                }
            ]
        }
    ]
}