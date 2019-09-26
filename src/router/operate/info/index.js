const infoChannel = r => require.ensure([], () => r(require('../../../page/operate/info/infoChannel')), 'infoChannel');
const infoTemplate = r => require.ensure([], () => r(require('../../../page/operate/info/infoTemplate')), 'infoTemplate');

export default [
    {
        path: "/infoChannel", // 短信渠道
        component: infoChannel
    },
    {
        path: "/infoTemplate", // 短信渠道
        component: infoTemplate
    }
]