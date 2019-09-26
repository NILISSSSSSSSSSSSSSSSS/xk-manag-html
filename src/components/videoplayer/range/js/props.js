export default {
    value:{
        type:Number,
        default:0
    },
    min:{
        type:Number,
        default:0
    },
    max:{
        type:Number,
        default:100
    },
    minShow:{
        type:Boolean,
        default:false
    },
    maxShow:{
        type:Boolean,
        default:false
    },
    height:{
        type:String,
        default:"5px"
    },
    bg1:{ //大的滑条
        type:String,
        default:"#ebebeb"
    },
    bg2:{ //已经滚动滑条
        type:String,
        default:"#009e06"
    },
    bg3:{ //滑块
        type:String,
        default:"blue"
    },
    btnWidth:{
        type:String,
        default:"20px"
    },
    isFull:{
        type:Boolean,
        default:false
    }
}