<template>
    <div class="vus-range" ref = "domrange">
        <input class="vus-range-input" v-model.number="currentValue">
        <div class="vus-min" v-show="minShow">{{min}}</div>
        <div class="vus-range-box" :style="{height:height,background:bg1}">

            <div class="vus-already" 
                        :style="{
                            background:bg2,
                            width:alreadyWidth
                        }"> 
            </div>

            <div class="vus-btn" 
                        :style="{
                            width:btnWidth,
                            height:btnWidth,
                            background:bg3,
                            left:pianyi
                        }"
                        @mousedown = "onButtonDown"
                        @touchstart = "onButtonDown">
            </div>

        </div>
        <div class="vus-max" v-show="maxShow">{{max}}</div>
    </div>
</template>
<script>
import vusProps from "./js/props";
import vusMethods from "./js/methods";
import vusComputed from "./js/computed";
export default {
    name:"range",
    data(){
        return {
            currentValue:0,
            cankaoValue:0,
            startX:0,
            startY:0,
            currentX:0,
            currentY:0,
            pianyi:0,
            alreadyWidth:0,
            pianyiRate:0,
            issizechange:false,
            tempwidth:null
        }
    },
    props:vusProps,
    created(){
        this.currentValue = this.value ;
        this.cankaoValue = this.value ;
        
    },
    mounted(){
        window.addEventListener("resize",this.onsizechange,false);
        this.tempwidth = parseFloat(this.getStyle(this.$refs.domrange,"width"));
    },
    computed:vusComputed,
    methods:vusMethods,
    watch:{
        value(newV){
            if(!newV){
                this.cankaoValue = 0 ;
            }
            this.currentValue = newV ;
        },
        currentValue(newV){
            if(newV >= this.max){
                newV = this.max
            }
            if(newV <= this.min){
                newV = this.min
            }
            let w = this.rangeBoxWidth*newV/this.max ;
            if(w <= 0){
                w = 0 ;
            }
            if(w >= (this.rangeBoxWidth - parseFloat(this.btnWidth))){
                w = this.rangeBoxWidth - parseFloat(this.btnWidth) ;
            }
            this.alreadyWidth = w + "px";
            this.pianyi = w + "px";
            this.$emit('onValueChange',newV)
        },
        isFull(newV){
            this.tempwidth = parseFloat(this.getStyle(this.$refs.domrange,"width"));
        },
        issizechange(newV){
            this.tempwidth = parseFloat(this.getStyle(this.$refs.domrange,"width"));
        }
    }
}
</script>
<style lang="scss" scoped>
    @import "./css/index.scss";
</style>


