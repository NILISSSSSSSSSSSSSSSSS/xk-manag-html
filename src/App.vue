<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import {clearCatch} from './util/publicMehotds'
    export default {
        name: 'App',
        created(){
            clearCatch()
        },
        mounted() {
            let self = this;
            this.$nextTick(()=>{
                history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', function() {         // 监听回退按钮
                        window.sessionStorage.removeItem("subIndex")
                        window.sessionStorage.removeItem("className")
                },false);
            })
        }
    }
</script>

<style>
    #app {
        font-family: Arial;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        min-width: 1200px;
    }
</style>
