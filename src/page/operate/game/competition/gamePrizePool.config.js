/*
 * @Author: liusheng 
 * @Date: 2019-06-14 16:50:45 
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-24 10:51:29
 */
export default {
    BOUTIQUE_MALL:{
        name:"精选商城",
        isReal:true,
        form:[
            {label:"奖品ID：",key:"prizeId"},
            {label:"奖品来源：",key:"prizeSource"},
            {label:"奖品名称：",key:"prizeName"},
            {label:"商品ID：",key:"productId"},
            {label:"商品名称：",key:"productName"},
            {label:"选择规格：",key:"specification"},
            {label:"成本价：",key:"costPrice"},
        ],
        prizeConfig:[
            /*
            { 
                type:"input",//类型 text input select richtxt upimg
                className:"个",//量词
                label:"发货单ID：", 
                key:"sendID", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            }
            */
            { type:"text",label:"商品ID：", key:"productId"},
            { type:"text",label:"商品名称：", key:"productName"},
            { type:"input",label:"奖品名称：", key:"prizeName", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('奖品名称不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            },
            { type:"select",label:"选择规格：", key:"specification", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('奖品名称不能为空')), 
                        trigger: 'blur' 
                    }
                ],
                options:[]
            },
            { type:"text",label:"成本价：", key:"costPrice"},
        ]
    },
    INCREASE:{
        name:"新增线下奖品",
        isReal:true,
        form:[
            {label:"奖品ID：",key:"prizeId"},
            {label:"奖品名称：",key:"prizeName"},
            {label:"规格名称：",key:"specification"},
            {label:"成本价：",key:"costPrice"},
            {label:"发放方式：",key:"terrain"},
            {label:"奖品信息：",key:"priceDetail"},
        ],
        prizeConfig:[
            { type:"input",label:"奖品名称：", key:"prizeName", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            },
            { type:"input",label:"规格名称：", key:"specification", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            },
            { type:"input",label:"成本价：", key:"costPrice", className:"元",
                rule:[
                    { 
                        validator: (ruler,value,call)=>{
                            if(!value){
                                call(new Error('不能为空'))
                            }else{
                                if(parseInt(value)<0 || Number.isNaN(Number(value))){
                                    call(new Error('请输入正数'))
                                }else{
                                    call()
                                }
                            }
                        }, 
                        trigger: 'blur' 
                    }
                ]
            },
            // { type:"select",label:"发放方式：", key:"terrain",options:[
            //     {label:'线上',value:'online'},
            //     {label:'线下',value:'offline'},
            // ]},
            { type:"text",label:"发放方式：", key:"terrain"},
            { type:"upimg",label:"商品图片：", key:"productImage", 
                rule:[
                    { 
                        required:true,
                        validator: (ruler,value,call)=>value?call():call(new Error('图片必传')), 
                        trigger: 'blur' 
                    }
                ]
            },
            { type:"richtxt",label:"奖品信息：", key:"priceDetail", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            }
        ]
    },
    AA_LOTTERY:{
        name:"AA彩票",
        isReal:true,
        form:[
            {label:"奖品ID：",key:"prizeId"},
            {label:"奖品来源：",key:"prizeSource"},
            {label:"奖品名称：",key:"prizeName"},
            {label:"AA彩票数量：",key:"pieceNum"},
        ],
        prizeConfig:[
            { type:"input",label:"奖品名称：", key:"prizeName", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('奖品名称不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            },
            { type:"input",label:"AA彩票数量：", key:"pieceNum", className:"张",
                rule:[
                    { 
                        validator: (ruler,value,call)=>{
                            if(!value){
                                call(new Error('AA彩票数量不能为空'))
                            }else{
                                if(parseInt(value) < 1 || Number.isNaN(Number(value)) || !Number.isInteger(Number(value))){
                                    call(new Error('请输入正数'))
                                }else{
                                    if(parseInt(value)>10){
                                        call(new Error('不能大于10'));
                                    }else{
                                        call();
                                    }
                                }
                            }
                        }, 
                        trigger: 'blur' 
                    }
                ]
            }
        ]
    },
    WELFARE_MALL:{
        name:"比赛专用奖品",
        isReal:false,
        form:[
            {label:"奖品ID：",key:"prizeId"},
            {label:"奖品来源：",key:"prizeSource"},
            {label:"奖品名称：",key:"prizeName"},
            {label:"奖品数量：",key:"pieceNum"},
            {label:"商品ID：",key:"productId"},
            {label:"商品名称：",key:"productName"},
        ],
        prizeConfig:[
            { type:"text",label:"商品ID：", key:"productId"},
            { type:"text",label:"商品名称：", key:"productName"},
            { type:"input",label:"奖品名称：", key:"prizeName", 
                rule:[
                    { 
                        validator: (ruler,value,call)=>value?call():call(new Error('奖品名称不能为空')), 
                        trigger: 'blur' 
                    }
                ]
            },
            { type:"input",label:"奖品数量：", key:"pieceNum", className:"件",
                rule:[
                    { 
                        validator: (ruler,value,call)=>{
                            if(!value){
                                call(new Error('奖品数量不能为空'))
                            }else{
                                if(parseInt(value)<0 || Number.isNaN(Number(value))){
                                    call(new Error('请输入正数'))
                                }else{
                                    call()
                                }
                            }
                        }, 
                        trigger: 'blur' 
                    }
                ]
            }
        ]
    }
}