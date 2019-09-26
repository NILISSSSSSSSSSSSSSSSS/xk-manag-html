const gameList = r => require.ensure([], () => r(require('../../../page/operate/game/gameList')), 'gameList');
const gameMatchList = r => require.ensure([], () => r(require('../../../page/operate/game/competition/gameMatchList')), 'gameMatchList');
const gameMatchAdd = r => require.ensure([], () => r(require('../../../page/operate/game/competition/gameMatchAdd')), 'gameMatchAdd');
const uploadCompetion = r => require.ensure([], () => r(require('../../../page/operate/game/competition/uploadCompetion')), 'uploadCompetion');
const gameCompetion = r => require.ensure([], () => r(require('../../../page/operate/game/competition/gameCompetion')), 'gameCompetion');
const gamePrizePool = r => require.ensure([], () => r(require('../../../page/operate/game/competition/gamePrizePool.vue')), 'gamePrizePool');

const gamePlat = r => require.ensure([], () => r(require('../../../page/operate/game/gamePlat')), 'gamePlat');

export default [
    {
        path: "/gameList", // 游戏列表
        component: gameList
    },
    {
        path: "/gameMatchList", // 比赛列表
        component: gameMatchList
    },
    {
        path: "/gameMatchAdd", // 新增比赛列表
        component: gameMatchAdd
    },
    {
        path: "/uploadCompetion", // 上传类赛事
        component: uploadCompetion
    },
    {
        path: "/gameCompetion", // 游戏类赛事
        component: gameCompetion
    },
    {
        path: '/gamePlat', // 游戏平台预充值
        component: gamePlat
    },
    {
        path: '/gamePrizePool', // 比赛奖品池
        component: gamePrizePool
    },
]