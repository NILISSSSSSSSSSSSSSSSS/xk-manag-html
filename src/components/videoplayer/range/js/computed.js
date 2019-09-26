export default {
    rangeBox(){
        return document.querySelector(".vus-range-box");
    },
    rangeBoxWidth(){
        let c1 = this.isFull ;//只是为了改变
        let c2 = this.issizechange ;//只是为了改变
        let rangWidth = this.getStyle(this.rangeBox,"width");
        if(this.tempwidth){
            rangWidth = this.tempwidth
        }
        return parseFloat(rangWidth);
    }
}