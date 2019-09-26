// import HelloWorld from '@/components/HelloWorld'
import main from '../page/main'
import goods from './goods'
import service from "./service"
import welfare from './welfare'
import Login from "@/page/login"
import welcome from '../page/welcome'
import financial from './financial'
import operate from './operate'
import live from "./live"

// import user from './user/index'

//权限管理

// Vue.use(Router)

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/main',
            component: main,
            children: [
                {
                    path: '/welcome',
                    component: welcome
                }
            ]
        },
        {
            path: '/login',
            component: Login
        },
        goods,
        service,
        welfare,
        financial,
        operate,
        live
    ]
})


let date = [
    {
        "name": "颜色",
        "key": "A",
        "attr": [
            {
                "name": "黑色",
                "key": "A01"
            },
            {
                "name": "黄色",
                "key": "A02"
            }
        ]
    },
    {
        "name": "内存",
        "key": "B",
        "attr": [
            {
                "name": "64g",
                "key": "B01"
            },
            {
                "name": "128g",
                "key": "B02"
            }
        ]
    }
]

function formatData(data) {
    for (let i = 0; i < data.length; i++) {

    }
}
