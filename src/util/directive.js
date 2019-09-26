import {getPermission} from './publicMehotds';

export default {
    install: function(Vue) {
        Vue.directive('permission', {
            bind: function(el, binding, vnode) {
                if(!binding.value) {
                    return false;
                };
                if(!Vue.prototype.$_permission(binding.value)) {
                    el.parentNode.removeChild(el); 
                }
            }
        })
    }
}

Vue.prototype.$_permission = function(value) {
    return getPermission(value);
}