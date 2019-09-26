<template>
    <div class="center-status" @click = "fnPlay">
        <i class="iconfont" :class="playIcon"></i>
    </div>
</template>
<script>
export default {
    nama:"centerStatus",
    props:{
        playstatus:{
            type:String,
            default:"icon-iconstop"
        }
    },
    computed:{
        playIcon(){
            let icon = "icon-iconstop"
            if(this.playstatus === "pause"){
                icon = "icon-bofang"
            }
            return icon;
        }
    },
    watch:{
        playstatus(newV){
            this.playstatus = newV ;
        }
    },
    methods:{
        fnPlay(){
            if(this.playstatus === "pause"){
                this.$emit("fnPlayPause","play");
            }else{
                this.$emit("fnPlayPause","pause");
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    @import "./iconfont/iconfont.css";
    @import "./center";
</style>

