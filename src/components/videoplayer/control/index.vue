<template>
    <div class="player-controls">
        <div class="play-range">
            <range 
                :max="duration" 
                :value = "currentTime" 
                :isFull = "fullScreen"
                @onValueChange = "fncurrentChange" 
                @onRangeChangeStart = "fndragstart" 
                @onRangeChangeEnd = "fndragend"></range>
        </div>
        <div class="play-pause-btn" @click = "fnPlay">
            <!-- 播放bofang 暂停iconstop -->
            <i class="iconfont" :class="this.playIcon"></i>
        </div>
        <div class="time-status">
            {{nowtime}}
            <span>/</span>
            <span>{{alltime}}</span>
        </div>
        <div class="space"></div>
        <div class="play-voice">
            <!-- 声音shengyin 静音ic_volume_off_px -->
            <div class="muted" @click.stop = "fnvoice">
                <i class="iconfont" :class="voiceicon"></i>
            </div>
            <div class="rangebox">
                <range :value = "voiceValue" @onValueChange = "fnvoicevalue"></range>
            </div>
            <div class="voicevalue">{{parseInt(voiceValue)}}</div>
        </div>
        <div class="play-rate">
            <div @click.stop = "changerate">{{ratesatus}}</div>
            <ul class="play-rate-lists" v-show = "rateshow">
                <li v-for="(item,index) in rate" 
                    :key="index" 
                    v-text="item"
                    @click.stop = "chooserate(item,index)"
                    :class="{rateselected:rateindex===index}">
                </li>
            </ul>
        </div>
        <div class="play-size"  @click="fnfullScreen">
            <!-- 全屏quanping 取消全屏tuichuquanping -->
            <i class="iconfont" :class="screenIcon"></i>
        </div>
    </div>
</template>
<script>
import range from "./../range"
export default {
    name:"control",
    data(){
        return{
            rate:[
                "2x",
                "1.5x",
                "1.25x",
                "1x"
            ],
            ratesatus:"倍数",
            rateindex:3,//选中速率的索引
            rateshow:false,//选取列表是否显示
            voiceValue:50,
            fullScreen:false
        }
    },
    components:{
        range
    },
    props:{
        playstatus:{
            type:String
        },
        duration:{
            type:Number,
            default:0
        },
        currentTime:{
            type:Number,
            default:0
        },
        bvoice:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        playIcon(){
            let icon = "icon-iconstop"
            if(this.playstatus === "pause"){
                icon = "icon-bofang"
            }
            return icon;
        },
        nowtime(){
            return this.time(this.currentTime);
        },
        alltime(){
            return this.time(this.duration);
        },
        voiceicon(){
            let vicon = this.bvoice ? "icon-ic_volume_off_px" : "icon-shengyin";
            if(this.voiceValue == 0){
                vicon = "icon-ic_volume_off_px"
            }
            return vicon;
        },
        screenIcon(){
            return this.fullScreen ? "icon-tuichuquanping" : "icon-quanping"
        }
    },
    methods:{
        time(t){
            let min = parseInt(t/60) < 10 ? "0" + parseInt(t/60) : parseInt(t/60);
            let s = parseInt(t%60) < 10 ? "0" + parseInt(t%60) : parseInt(t%60);
            return `${min}:${s}`;
        },
        fnPlay(){
            if(this.playstatus === "pause"){
                this.$emit("fnPlayPause","play");
            }else{
                this.$emit("fnPlayPause","pause");
            }
        },
        fnvoice(){
            this.$emit("fnmuted",this.bvoice);
        },
        changerate(){
            this.rateshow = !this.rateshow;
        },
        chooserate(rate,index){
            if (rate === "1x") {
                this.ratesatus = "倍数";
            }else{
                this.ratesatus = rate;
            }
            this.rateindex = index ;
            this.rateshow = false ;
            this.$emit("rateChange",rate)
        },
        fnfullScreen(){
            this.fullScreen = !this.fullScreen ;
            this.$emit("fnScreen",this.fullScreen);
        },
        fncurrentChange(t){
            this.$emit("changetime",t)
        },
        fndragstart(){
            this.$emit('fndraging',true)
        },
        fndragend(){
            this.$emit('fndraging',false)
        },
        fnvoicevalue(e){
            this.voiceValue = e
            this.$emit('voicechange',e)
        }
    },
    watch:{
        playstatus(newV){
            this.playstatus = newV ;
        },
        duration(newV){
            this.duration = newV ;
        },
        currentTime(newV){
            this.currentTime = newV ;
        },
        bvoice(newV){
            this.bvoice = newV ;
        }
    }
}
</script>
<style lang="scss" scoped>
    @import "./iconfont/iconfont.css";
    @import "./control";
</style>

