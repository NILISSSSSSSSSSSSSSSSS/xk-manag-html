<template>
    <div class="videoplayer">
        <video ref="videoDom" :src="src"></video>
        <div class="vus-control" @click="fnclick" ref = "vusControl">
            <center-status 
                    :playstatus = "playstatus"
                    @fnPlayPause = "fnPlayPause">
            </center-status>
            <playerControls
                    :playstatus = "playstatus"
                    @fnPlayPause = "fnPlayPause"
                    :currentTime = "currentTime"
                    :duration = "duration"
                    :bvoice = "bmuted"
                    @fnmuted = "changemuted"
                    @rateChange = "changeRate"
                    @fnScreen = "changeScreen"
                    @changetime = "changplaytime"
                    @fndraging = "fndraging"
                    @voicechange = "fnvoice">
            </playerControls>
        </div>
    </div>
</template>
<script>
import range from './range';
import centerStatus from "./center";
import playerControls from "./control";
export default {
    name:"videoplayer",
    data(){
        return{
            isPlay:false,//是否播放状态
            currentTime:0,//当前播放时长（秒数）
            duration:0,//总时长（秒数）
            bmuted:this.muted,//是否静音
            cwidth:window.screen.width,
            cheight:window.screen.height,
            isdrag:false,
            timer:null
        }
    },
    components:{
        range,
        centerStatus,
        playerControls
    },
    computed:{
        videoDom(){
            return this.$refs.videoDom ;
        },
        playstatus(){
            return this.isPlay ? "play" : "pause";
        }
    },
    props:{
        src:{
            type: String,
            default: "https://gslb.miaopai.com/stream/LabCGWBdTVihf4q7doK1~Jy4mr~kMuoOeJgJfg__.mp4?ssig=a0b90d68b54f4513d71d90599b879639&time_stamp=1536308320401&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=LabCGWBdTVihf4q7doK1%7EJy4mr%7EkMuoOeJgJfg__"
        },
        poster:{
            type: String,
            default: "http://img.zcool.cn/community/01e8a157f86d8ca84a0d304fcb9943.jpg@2o.jpg"
        },
        playsinline:{
            type:Boolean,
            default:true
        },
        muted:{
            type:Boolean,
            default:false
        }
    },
    mounted(){
        this.videoStatus();
        // 获取当前播放时间
        this.videoDom.addEventListener("timeupdate",()=>{
            this.currentTime = this.videoDom.currentTime ;
        });
        // 获取总时长
        this.videoDom.addEventListener("loadedmetadata",()=>{
            this.duration = this.videoDom.duration;
        });
        if(this.playsinline){
            this.videoDom.setAttribute('playsinline', this.playsinline)
            this.videoDom.setAttribute('webkit-playsinline', this.playsinline)
            this.videoDom.setAttribute('x5-playsinline', this.playsinline)
            this.videoDom.setAttribute('x5-video-player-type', 'h5')
            this.videoDom.setAttribute('x5-video-player-fullscreen', false)
        }
        if(this.muted){
            this.videoDom.setAttribute('muted',"muted")
        }
    },
    methods:{
        fnPlayPause(type){
            switch (type) {
                case "pause":
                    this.videoDom.pause();
                    break;
            
                default:
                    this.videoDom.play();
                    break;
            }
        },
        videoStatus(){
            this.videoDom.addEventListener("pause",this.playpause,false);
            this.videoDom.addEventListener("play",this.playpause,false);
        },
        playpause(e){
            switch (e.type) {
                case "play":
                    this.isPlay = true ;
                    break;
                case "pause":
                    this.isPlay = false ;
                    break;
            
                default:
                    break;
            }
        },
        changemuted(b){
            this.bmuted = !b;
            this.videoDom.muted = !b ;
        },
        changeRate(rate){
            this.videoDom.playbackRate = parseFloat(rate);//速率
        },
        changeScreen(b){
            let oDomStyle = document.querySelector(".videoplayer").style;
            if(b){
                oDomStyle.width = this.cheight + "px";
                oDomStyle.height = this.cwidth + "px";
                oDomStyle.transform = `translate(${this.cwidth}px,0) rotate(90deg)`;
            }else{
                oDomStyle.width = "100%";
                oDomStyle.height = "auto";
                oDomStyle.transform = "rotate(0deg)";
            }
        },
        changplaytime(t){
            if(this.isdrag){
                this.videoDom.currentTime = t
            }
        },
        fndraging(e){
            this.isdrag = e
        },
        fnvoice(e){
            this.videoDom.volume = (e/100)
        },
        fnclick(){
            clearTimeout(this.timer);
            this.$refs.vusControl.style.opacity = 1 ;
            this.timer = setTimeout(() => {
                if(this.isPlay){
                    this.$refs.vusControl.style.opacity = 0;
                }else{
                    this.$refs.vusControl.style.opacity = 1;
                }
            }, 3600);
        }
    }
}
</script>
<style lang="scss" scoped>
    .videoplayer{
        width: 100%;
        position: relative;
        transform-origin:0 0;
        video{
        width: 100%;
        }
        .vus-control{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            transition: all 1s;
        }
    }
</style>


