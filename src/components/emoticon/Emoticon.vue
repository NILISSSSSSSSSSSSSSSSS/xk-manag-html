<template>
    <el-popover
        placement="top-start"
        width="590"
        v-model="emoticonVisible"
        popper-class="emoticon">
        <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
            <!-- slides -->
            <swiper-slide>
                <img v-for="(item,index) in emoticons.emoticon1" :key="index" :src="item.url" @click.stop="fnAddEmoticon(item)">
            </swiper-slide>
            <swiper-slide>
                <img v-for="(item,index) in emoticons.emoticon2" :key="index" :src="item.url" @click.stop="fnAddEmoticon(item)">
            </swiper-slide>
            <swiper-slide>
                <img v-for="(item,index) in emoticons.emoticon3" :key="index" :src="item.url" @click.stop="fnAddEmoticon(item)">
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
        <img width="20" src="data:image/png;base64,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" slot="reference">
    </el-popover>
</template>
<script>
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import emoticons from "./emoticons"
export default {
    name:'',
    data () {
        return {
            ...emoticons,
            swiperOption:{
                pagination: {
                    el: '.swiper-pagination'
                }
            }
        };
    },
    props: {
        emoticonVisible:{},
    },
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    created() {
        // let str = "大笑啥都会发生[大笑]戏[][哭笑不得]"
        // var regex = /\[(?<val>[^\]]+)\]/g;
        // var string = "阿萨德[][大笑][大佬][a]";
        this.$emit('Emoticons',this.emoticons)
    },
    mounted() {
        // console.log(this.swiper)
        this.swiper.slideTo(0, 1000, false) ;
    },
    methods: {
        fnAddEmoticon(target){
            if(target.name=="del"){
                this.$emit("fnDelEmoticon");
            }else{
                this.$emit("fnAddEmoticon",target.name);
            }
        },
        fnFontToImg(content){
            let str = content;
            for (const key in this.emoticons) {
                this.emoticons[key].forEach(item => {
                    if(str.indexOf(item.name) != -1){
                        let biao_n = item.name.replace("[","\\[");
                        biao_n = biao_n.replace("]","\\]");
                        let reg = new RegExp(biao_n,"g");
                        str=str.replace(reg,item.url);
                    }
                });
            }
            return str;
        },
        callback(i){
            console.log(i)
        }
    },
    watch: {}
}
</script>
<style lang="scss">
.emoticon{
    .swiper-container{
        width: 100%;
        height: 260px;
        .swiper-slide{
            word-break: break-all;
            img{
                width: 60px;
                margin: 5px;
                cursor: pointer;
            }
            img:last-child{
                width: 50px;
                height: 53px;
            }
        }
    }
}
 
</style>