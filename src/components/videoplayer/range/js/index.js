class Horizontal{
    constructor(element){
        this.element = element
    }
    onmousedown(e){
        if (e.touches) e = e.touches[0]
        this.startX = e.clientX
        this.handleOffsetX = this.handle.offsetLeft
        this.restrictHandleX = this.slider.offsetWidth - this.handle.offsetWidth
    }
    onmousemove(e){
        e.preventDefault()
        if (e.touches) e = e.touches[0]

        var leftOffset = this.handleOffsetX + e.clientX - this.startX
        var position = (this.steps) ? findClosest(leftOffset, this.steps) : leftOffset

        if (leftOffset <= 0) {
            this.setPosition(0)
        } else if (leftOffset >= this.restrictHandleX) {
            this.setPosition(this.restrictHandleX)
        } else {
            this.setPosition(position)
        }
        this.setValue(this.handle.style.left, this.slider.offsetWidth - this.handle.offsetWidth)
    }
    onmouseup(e){
        this.options.onTouchend(e)
        this.unselectable(this.slider, false)
    }
}
export default function (element) {
    return new Horizontal(element)
}