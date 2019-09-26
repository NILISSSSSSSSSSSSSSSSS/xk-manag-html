import {getQiNiuToken,uploadFile} from '@/util/publicMehotds';
import {previewPath} from '@/util/publicParams.js';
export let liangTianData = {
    actX:130,
    actY:860,
    DeviceMain:undefined,
    Video:undefined,
    SelectType:2,//1 表示YUY2 ，2 表示MJPG ，4表示UYVY,传0自动选择一个类型
    
}
let viewDom = '';
export let liangTianMethods = {
    addEvent(obj, name, func) {
        try {
            if (obj.attachEvent) {
                obj.attachEvent("on" + name, func);
            } else {
                obj.addEventListener(name, func, false);
            }
        } catch (error) {
            
        }
    },
    OpenVideo() {
        var sResolution = document.getElementById('selRes');
        var sDevice = document.getElementById('device');
        var dev;
    
        if (sDevice.selectedIndex != -1) {
            this.CloseVideo()
    
            if (sDevice.selectedIndex == viewDom.Device_GetIndex(this.DeviceMain)) {
                dev = this.DeviceMain;//选中主头
            }
    
            
            var nResolution = sResolution.selectedIndex;
            this.Video = viewDom.Device_CreateVideo(dev, nResolution, this.SelectType);
            if (this.Video) {
                viewDom.View_SelectVideo(this.Video);
                viewDom.View_SetText("高拍仪打开中，请等待...", 0);
            }
        }
    },
    CloseVideo() {
        if (this.Video) {
            viewDom.View_SetText("", 0);
            viewDom.Video_Release(this.Video);
            this.Video = null;
        }
    },
    changeDev() {
        var sResolution = document.getElementById('selRes');
        var sDevice = document.getElementById('device');
        var dev;
        
        if (sDevice.selectedIndex != -1) {
            if (sDevice.selectedIndex == viewDom.Device_GetIndex(this.DeviceMain)) {
                dev = this.DeviceMain;//选中主头
            }
    
    
            var nResolution = viewDom.Device_GetResolutionCountEx(dev, this.SelectType);//根据出图模式获取分辨率
            sResolution.options.length = 0;
            for (var i = 0; i < nResolution; i++) {
                var width = viewDom.Device_GetResolutionWidthEx(dev, this.SelectType, i);
                var heigth = viewDom.Device_GetResolutionHeightEx(dev, this.SelectType, i);
                sResolution.add(new Option(width.toString() + "*" + heigth.toString()));
            }
            sResolution.selectedIndex = 0;
        }
    },
    Init() {
        //设备接入和丢失
        //type设备类型， 1 表示视频设备， 2 表示音频设备
        //idx设备索引
        //dbt 1 表示设备到达， 2 表示设备丢失
        let _this = this ;
        viewDom = document.getElementById('view1');
        this.Unload()
        this.addEvent(viewDom, 'DevChange', function (type, idx, dbt) {
            if (1 == type){//视频设备
                if (1 == dbt){//设备到达
                    var deviceType = viewDom.Global_GetEloamType(1, idx);
                    if (1 == deviceType){//主摄像头
                        if (null == _this.DeviceMain) {
                            _this.DeviceMain = viewDom.Global_CreateDevice(1, idx);
                            if (_this.DeviceMain) {
                                var sDevice = document.getElementById('device');
                                sDevice.add(new Option(viewDom.Device_GetFriendlyName(_this.DeviceMain)));
                                sDevice.selectedIndex = idx;//选中主头
                                _this.changeDev();
                                _this.OpenVideo();//是主头自动打开视频
                            }
                        }
                    }
                }
            }
        });
    
    
        viewDom.Global_SetWindowName("view");
    
        viewDom.Global_InitDevs();
        
    },
    Unload() {
        if (this.Video) {
            viewDom.View_SetText("", 0);
            viewDom.Video_Release(this.Video);
            this.Video = null;
        }
        if (this.DeviceMain) {
            viewDom.Device_Release(this.DeviceMain);
            this.DeviceMain = null;
        }
        viewDom.Global_DeinitDevs();
    },
    Scan() {
        this.phoneIng = true ;
        setTimeout(() => {//转菊花立即生效
            var obj = viewDom.Video_CreateImage(this.Video, 0, viewDom.View_GetObject());
            let base64 = viewDom.Image_GetBase64(obj,13,0);
            this.tableData = [] ;
            viewDom.Image_Release(obj);
            this.upToQiNiu(base64);
        }, 0);
    },
    async upToQiNiu(base64){
        let token = await getQiNiuToken();
        let _this = this ;
        uploadFile(base64,token,(url)=>{
            let imgUrl = previewPath + url ;
            for (let index = 0; index < 3; index++) {
                let nactX = _this.actX + index*1160;
                _this.tableData[index] = {
                    ocrNum:[],//防止errArr报错
                    ocrNumArr:[],//防止errArr报错
                };
                // let nowUrl = `${imgUrl}?imageMogr2/crop/!1160x890a${nactX}a${_this.actY}/rotate/90`;
                let nowUrl = `${imgUrl}?imageMogr2/crop/!860x890a${nactX}a${_this.actY}/rotate/90`;
                _this.tableData[index].bigUrl = nowUrl;
                _this.tableData[index].reStartLoaing = false;
                _this.tableData.push();
                _this.getBase64(index,imgUrl)
            }
        })
    },
    getBase64(num,imgUrl){
        let nowUrl = `${imgUrl}?imageMogr2/crop/!200x890a${470+this.actX+1160*num}a${this.actY}/rotate/90`;
        let _this = this ;
        _this.tableData[num].smallUrl = nowUrl ;
        _this.tableData.push();
        let xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open("GET", nowUrl, true);
        // 以 ArrayBuffer 的形式返回数据
        xmlHTTP.responseType = "arraybuffer";
        xmlHTTP.onload = function(e) {
            // 1. 将返回的数据存储在一个 8 位无符号整数值的类型化数组里面
            let arr = new Uint8Array(xmlHTTP.response);
            // 2. 转为 charCode 字符串
            let raw = Array.prototype.map.call(arr, charCode =>String.fromCharCode(charCode) ).join("");
            // 3. 将二进制字符串转为 base64 编码的字符串
            let b64 = btoa(raw);
            _this.GetNum(num,b64);
        };
        xmlHTTP.onerror = function(err) {
            console.log(err);
        };
        xmlHTTP.send();
    },
    GetNum(num,nowUrl) {
        let _this = this ;
        setTimeout(function() {
            $.ajax({
                url:"https://aip.baidubce.com/rest/2.0/ocr/v1/lottery?access_token="+_this.baiduToken,
                type:"post",
                data:{
                    image:nowUrl
                },
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                success:function(res){
                    if(res.words_result){
                        _this.Str(res.words_result,num);
                    }else{
                        _this.Str('',num);
                    }
                },
                error:function(err){
                    console.log(err);
                    _this.Str('',num);
                }
            })
        }, num*600);
    },
    Str(arr,num){
        let target = ""
        if(arr && arr.length){
            target = arr[0].words
        }
        console.log(target)
        this.StrTo2Str(target,num)
    },
    StrTo2Str(target,num){
        let str1 = target.replace(/[^0-9]/g,"");
        let str2 = '';
        for (let index = 0; index < str1.length; index++) {
            if(index%2){
                if(index==9){
                    str2 += str1[index]+" + "
                }else{
                    str2 += str1[index]+" "
                }
            }else{
                str2 += str1[index]
            }
        }
        this.tableData[num].ocrNum = str2.trim() ;
        this.tableData[num].ocrNumArr = str2.trim().split("+") ;
        this.tableData.push();
        if(num==2){
            this.fnToMatch() ;
        }
    },
    fnToMatch(params={},errIndex){
        let obj = {
            aaLotteryType:"super_lotto",
            expectNo:this.qiNumber,
            chooseNumDtos:[],
            ...params
        }
        // 分红篮球
        for (let index = 0; index < this.tableData.length; index++) {
            if(this.tableData[index].ocrNum && this.tableData[index].ocrNum.length>=22){
                
                let arr1 = this.tableData[index].ocrNum.split(' + ');
                let redArr = arr1[0].split(' ').map(item=>{
                    return {num:item,type:"red_boll"}
                });
                let blueArr = arr1[1].split(' ').map(item=>{
                    return {num:item,type:"blue_boll"}
                });;
                obj.chooseNumDtos.push({
                    count:1,
                    index,
                    numbers:[
                        ...redArr,
                        blueArr[0],
                        blueArr[1],
                    ]
                });
                
            }
        }
        if(errIndex || errIndex==0){
            obj.chooseNumDtos = [] ;
            console.log(this.tableData)
            let redArr = this.tableData[errIndex].ocrNumArr[0].split(' ').map(item=>{
                return {num:item,type:"red_boll"}
            });
            let blueArr = this.tableData[errIndex].ocrNumArr[1].split(' ').map(item=>{
                return {num:item,type:"blue_boll"}
            });;
            obj.chooseNumDtos.push({
                count:1,
                index:errIndex,
                numbers:[
                    ...redArr,
                    blueArr[0],
                    blueArr[1],
                ]
            });
        }
        console.log("obj",obj)
        this.$http.get(this.$api.aaLotteryMatchNum,obj , true).then((res) => {
            console.log("res",res);
            if(errIndex || errIndex==0){
                this.tableData[errIndex]['reStartLoaing'] = false ;
                this.tableData.push();
                this.$message({
                    message: '重新匹配完成！',
                    type: 'success'
                });
            }
            
            this.phoneIng = false ;
            if(res){
                for (let ind = 0; ind < res.data.length; ind++) {
                    let i =  res.data[ind].index;
                    let arr = [
                        res.data[ind].num1,
                        res.data[ind].num2,
                        res.data[ind].num3,
                        res.data[ind].num4,
                        res.data[ind].num5,
                        res.data[ind].num6,
                        res.data[ind].num7
                    ]
                    let obj = {
                        smallUrl:this.tableData[i].smallUrl,
                        ocrNum:this.tableData[i].ocrNum,
                        ocrNumArr:this.tableData[i].ocrNumArr,
                        bigUrl:this.tableData[i].bigUrl,
                        succuss:true,
                        userId:res.data[ind].userId,
                        userNumbers:arr,
                        allData:res.data[ind]
                    }
                    this.$set(this.tableData,i,obj)
                }
            }
        }).catch((err) => {
            console.log(err);
            this.phoneIng = false ;
            this.$message.error(err.message);
            if(errIndex || errIndex==0){
                this.tableData[errIndex]['reStartLoaing'] = false ;
                this.tableData.push();
            }
        });
    }
}
