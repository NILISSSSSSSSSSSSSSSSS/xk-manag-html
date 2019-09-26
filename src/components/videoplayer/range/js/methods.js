export default {
    getStyle(obj,attr) {
        if(obj.currentStyle)
        {
            return obj.currentStyle[attr];
        }else{
            return getComputedStyle(obj,false)[attr];
        }
    },
    onButtonDown(e){
        e.preventDefault();
        this.onDragStart(e);
        window.addEventListener('mousemove', this.onDragging);
        window.addEventListener('touchmove', this.onDragging);
        window.addEventListener('mouseup', this.onDragEnd);
        window.addEventListener('touchend', this.onDragEnd);
        window.addEventListener('contextmenu', this.onDragEnd);
    },
    onDragStart(e){
        if (e.type === 'touchstart') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.$emit('onRangeChangeStart');
    },
    onDragging(e){
        let diffX = 0;
        let diffY = 0;
        
        if (e.type === 'touchmove') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }
        this.currentX = e.clientX;
        this.currentY = event.clientY;
        diffX = this.currentX - this.startX ;
        diffY = this.currentY - this.startY ;
        let pianyi = diffX ;
        if(Math.abs(diffX) < Math.abs(diffY)){
            pianyi = diffY
        }
        this.pianyiRate = pianyi / (this.rangeBoxWidth - parseFloat(this.btnWidth)) ;
        this.currentValue = this.cankaoValue + this.pianyiRate*(this.max - this.min);
    },
    onDragEnd(){
        /*
        * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
        * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
        */
        setTimeout(() => {
            //自己 无业务
            this.cankaoValue += this.pianyiRate*(this.max - this.min) ;
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
        this.$emit('onRangeChangeEnd');
    },
    onsizechange(){
        this.issizechange = !this.issizechange ;
    }
}