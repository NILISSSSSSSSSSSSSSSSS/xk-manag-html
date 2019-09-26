<template>
    <div class="xk-container next-prizes">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>设置开奖方式
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-form label-width="100px"
                     class=" demo-ruleForm pubpadd">
                <div class="paddBoth">
                    <el-card class="box-card">
                        <div slot="header">
                            <span>基本信息：</span>
                        </div>
                        <div class="paddBoth">
                            <el-row class="basic-info info-content">
                                <el-col :span="6">奖品ID：{{ infoForm.id }}</el-col>
                                <el-col :span="6">奖品类型：{{ infoForm.type==="virtual" ? '虚拟奖品': '实物奖品' }}</el-col>
                                <el-col :span="6" v-if="infoForm.type !== 'virtual'">奖品分类：{{ infoForm.realAttr && infoForm.realAttr.categoryCode | formatCategory }}</el-col>
                                <el-col :span="6" v-if="infoForm.type !== 'virtual'">奖品品牌：{{ infoForm.realAttr && infoForm.realAttr.brandName }}</el-col>
                                <el-col :span="6">邮寄方式：{{ infoForm.isFreeShipping=='0'?"不包邮":"包邮" }}</el-col>
                                <el-col :span="6">奖品标题：{{ infoForm.name }}</el-col>
                                <el-col :span="6">奖品用途：{{ infoForm.usage | formatUsage }}</el-col>
                                <el-col :span="24">商品图片：</el-col>
                                <el-col :span="24" class="goods-pic" v-if="(infoForm.realAttr!=null && infoForm.realAttr.showPics!=null) || (infoForm.virtualAttr!=null && infoForm.virtualAttr.mainPic!=null)">
                                    <div v-if="infoForm.realAttr!=null && infoForm.realAttr.showPics!=null">
                                        <image-list v-for="(item,index) in infoForm.realAttr.showPics" 
                                                    :url="item"
                                                    :key="index"></image-list>
                                    </div>
                                    <div v-if="infoForm.virtualAttr!=null && infoForm.virtualAttr.mainPic!=null">
                                        <image-list :url="infoForm.virtualAttr.mainPic"></image-list>
                                    </div>
                                </el-col>
                                <el-col :span="6" v-if="infoForm.type !== 'virtual'">奖品规格：{{ infoForm.realAttr && infoForm.realAttr.specInfo? infoForm.realAttr.specInfo: '无' }}</el-col>
                                <el-col :span="6" v-if="infoForm.type !== 'virtual'">奖品价格：{{ infoForm.realAttr && infoForm.realAttr.originalValue ? $math.divide(infoForm.realAttr.originalValue, 100): 0 }} 消费券</el-col>
                                <el-col :span="6">晒单后奖励：{{ infoForm.commentAward && infoForm.commentAward.type ? infoForm.commentAward.type=="aa_lottery"?  infoForm.commentAward.count+'  张AA彩票':  $math.divide(infoForm.commentAward.count, 100)+'  消费券': '无' }}</el-col>
                                <el-col :span="6">是否需要分享：{{ infoForm.isFreeShare == 1? "需要": "不需要" }}</el-col>
                                <el-col :span="24">商品简介：{{ infoForm.description }}</el-col>
                                <el-col :span="24">奖品缩略图：</el-col>
                                <el-col :span="24" class="goods-pic" v-if="infoForm.microPic">
                                    <image-list :url="infoForm.microPic"></image-list>
                                </el-col>
                                <el-col :span="24">商品详情：</el-col>
                                <el-col :span="24" class="goods-pic" v-html="infoForm.detailPics"></el-col>
                            </el-row>
                        </div>
                    </el-card>
                    <!--设置开奖方式-->
                    <el-card class="box-card marintop10">
                        <div slot="header">
                            <span>设置开奖方式：</span>
                        </div>
                        <div class="paddBoth info-content">
                            <el-form label-width="110px">
                                <!-- 第一种开奖方式 -->
                                <el-row>
                                    <el-col :span="24"><el-radio v-model="radio" :label="EnumJDrawType[0].key" name="type">按开奖时间&nbsp;&nbsp;&nbsp;&nbsp;（时间到自动开奖）</el-radio></el-col>
                                    <el-col :span="24" class="marintop10">
                                        <el-form :model="setForm1" ref="setForm1" :rules="rulesForm" label-position="left">
                                            <el-form-item v-if="infoForm.usage!=='expense'" label="设置开奖期数：" label-width="110px">
                                                <el-input v-model="setForm1.totalSequenceNumber" :size="$size" placeholder="100"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;（设置100期，即库存100件奖品，分100次开奖抽完）
                                            </el-form-item>
                                            <el-form-item label="设置开奖时间：">
                                                <el-form-item prop="way" ref="setForm1way" label-width="110px">
                                                    <el-button :size="$size" type="primary" @click="openDialog(setForm1, 1)">选择开奖方式</el-button>
                                                </el-form-item>
                                                <!--提示弹框2-->
                                                <template v-if="infoForm.usage==='expense'">
                                                    <set-open-ways :visible.sync="visible" v-model="setForm1.way"></set-open-ways>
                                                </template>
                                                <template v-else>
                                                    <set-open-way v-model="setForm1.way" :visible.sync="tipsVisible1" :totalNper="setForm1.totalSequenceNumber"></set-open-way>
                                                    <show-open-way v-if="setForm1.way" :detail="setForm1.way"></show-open-way>
                                                </template>
                                                
                                            </el-form-item>
                                            <el-form-item v-if="infoForm.usage==='expense'" label="开奖期数：" label-width="110px">
                                                {{ setForm1.way? setForm1.way.total : 0 }} 期&nbsp;&nbsp;&nbsp;&nbsp;（设置n期，即库存n件奖品，分n次开奖抽完）
                                            </el-form-item>
                                            <el-form-item label="每注：" prop="eachNotePrice" label-width="60px">
                                                <el-input v-model.number="setForm1.eachNotePrice" :size="$size" placeholder="100"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;消费券
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>
                                
                                <div class="line"></div>
                                <!-- 第二种开奖方式 -->
                                <el-row class="marintop20">
                                    <el-col :span="24"><el-radio v-model="radio" :label="EnumJDrawType[1].key" name="type">按开奖进度&nbsp;&nbsp;&nbsp;&nbsp;（进度完成自动开奖）</el-radio></el-col>
                                    <el-col :span="24" class="marintop10">
                                        <el-form :model="setForm2" ref="setForm2" :rules="rulesForm">
                                            <el-form-item label="设置开奖期数：" prop="totalSequenceNumber" label-width="110px">
                                                <el-input v-model="setForm2.totalSequenceNumber" :size="$size" placeholder="100"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;（设置100期，即库存100件奖品，分100次开奖抽完）
                                            </el-form-item>
                                            <el-col :span="8">
                                                <el-form-item label="设置开奖注数：" prop="eachSequenceNumber" label-width="110px">
                                                    <el-input v-model="setForm2.eachSequenceNumber" :size="$size" placeholder="100"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;注
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="10" v-if="infoForm.usage !='expense'">
                                                <el-form-item label="每注：" prop="eachNotePrice" label-width="60px">
                                                    <el-input v-model.number="setForm2.eachNotePrice" :size="$size" placeholder="100"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;消费券
                                                </el-form-item>
                                            </el-col>
                                        </el-form>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </el-card>
                    <el-card class="box-card marintop10">
                        <div slot="header">温馨提示：</div>
                        <div class="info-content paddBoth">
                            <el-row>
                                <el-col :span="24">1.开奖方式一旦设置，即视为开奖，无法再对奖品进行和编辑和删除或下架，只可设置下一期奖品，或者暂停开奖功能。</el-col>
                                <el-col class="marintop10" :span="24">2.开奖方式查询，需在奖品列表中查询。</el-col>
                            </el-row>
                            <div class="marintop20">
                                <div class="listInfo solidbottom1px"><strong style="margin-right: 40px">是否暂停奖品投放</strong>选择奖品暂停投放，上一期奖品开奖后，停止投放，如需开启，需重新选择奖品</div>
                            </div>
                        </div>
                    </el-card>

                    <!--底部按钮-->
                    <div slot="footer" class="textCenter marintop20">
                        <el-button :size="$size" v-if="goodsStatus==='UP'"  type="warning" @click="pause" class="marintop20" plain>下一期暂停</el-button>
                        <el-button :size="$size" type="success" @click="submitForm('ruleForm')" plain>确定</el-button>
                        <el-button :size="$size" type="primary" @click="back" plain>返回</el-button>
                    </div>
                </div>
                
                <!--提示弹框1-->
                <el-dialog title="温馨提示" :visible.sync="tipsVisible" width="30%" top="30px">
                    <el-col>奖品名称：{{ infoForm.name }}</el-col>
                    <el-col v-if="infoForm.realAttr">奖品价格： {{ $math.divide(infoForm.realAttr.originalValue, 100) }}券</el-col>
                    <el-col>开奖方式： {{ radio | prizeWay }}</el-col>
                    <el-col v-if="submitParams.lotteryWay">开奖期数：{{ submitParams.lotteryWay.totalSequenceNumber }}期</el-col>
                    <el-col>提示： 开奖方式一旦设置，即视为开奖，无法再对 奖品进行编辑、删除或下架，只可设置下一 期奖品，或者暂停开奖功能。</el-col>
                    <span slot="footer" class="dialog-footer">
                    <el-button :size="$size" type="primary" :loading="saveLoading" :disabled="saveLoading" @click="sure()">确 定</el-button>
                    <el-button :size="$size" type="primary" @click="tipsVisible=false">返回</el-button>
                 </span>
                </el-dialog>
            </el-form>
        </div>
    </div>
</template>

<script>
    //枚举开奖方式
    import { EnumJDrawType, EnumWeebday } from '@/util/publicParams';

    import {saveSession,enumFormatter} from '../../../../util/publicMehotds'
    import SetOpenWay from '@/components/welfare/SetOpenWay.vue'
    import SetOpenWays from '@/components/welfare/SetOpenWays.vue'
    import ShowOpenWay from '@/components/welfare/ShowOpenWay.vue'
    import ImageList from '@/components/common/ImageList.vue';
    import { EnumUsage } from '@/util/publicParams.js';
    import moment from 'moment';
    const PadZero = str =>{
        return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
    }
    let categroyList = [];
    export default {
        name: "nextPrizes",
        components: {
            SetOpenWay,
            ShowOpenWay,
            ImageList,
            SetOpenWays
        },
        data() {
            const checkNum = (rule, value, call) => {
                if(!value) {
                    call(new Error('不能为空'));
                }else if(!/(^[1-9]{1}\d*$)|(^[0-9]{1}$)/g.test(value)) {
                    call(new Error('必须为数字，且不能为0'))
                }else{
                    call();
                }
            }
            const checkWay = (rule, value, call) =>{
                if(!value || JSON.stringify(value) === '{}') {
                    call(new Error('请选择开奖方式'))
                }else {
                    call()
                }
            }
            const checkMoney = (rule, value, call) => {
                if(!value) {
                    return call(new Error(value=='0' || value===0? '不能为0':'不能为空'))
                }
                if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                    return call(new Error('格式不正确'));
                }
                call();
            }
            return {
                moment,
                EnumJDrawType,
                id:'',             //奖品id
                nextId: '',   //下一期ID
                visible: false,
                radio:EnumJDrawType[0].key,
                tipsVisible: false,
                tipsVisible1:false,
                infoForm: {},
                rulesForm: {},
                setForm1:{},
                setForm2:{},
                goodsStatus: '',       //为UP时调用sequenceCreate,否则为sequenceUpdate
                rulesForm: {
                    totalSequenceNumber: { validator: checkNum, trigger: 'blur' },
                    eachSequenceNumber: { validator: checkNum, trigger: 'blur' },
                    eachNotePrice: { validator: checkMoney, trigger: 'blur' },
                    way: { validator: checkWay, trigger: 'blur' }
                },
                submitParams:{},
                saveLoading: false
            }
        },
        created(){
            this.id=this.$route.query.id;
            this.goodsStatus = this.$route.query.type;
            this.nextId = this.$route.query.nextId;
            this.queryJFCategoryList();
        },
        methods:{
            queryJFCategoryList() {
                this.$http.get(this.$api.queryJFCategory, {}, true).then(res => {
                    categroyList = res;
                    this.getPrizesDetails();
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.getPrizesDetails();
                })
            },
            //获取奖品详情
            getPrizesDetails(){
                let params = {
                    jGoodsId: this.id
                };
                this.$http.get(this.$api.jfmallGoodsDetail4Manager, params, true).then(res => {
                    // res.usage==='expense'? this.radio = EnumJDrawType[1].key: null;
                    this.infoForm = res;
                    //如果为运营专用奖品，只有按进度方式
                }).catch(err => {
                    this.$message.error(err.message);
                });
            },
            //提交
            submitForm() {
                switch(this.radio) {
                    case this.EnumJDrawType[0].key:
                        this.$refs['setForm1'].validate(v=>{
                            if(v){
                                this.submitParams = this.createParame(this.setForm1);
                                this.tipsVisible = true
                            }else{
                                this.toErrorValidate()
                                return false;
                            }
                        })
                    break;
                    case this.EnumJDrawType[1].key:
                        this.$refs['setForm2'].validate(v=>{
                            if(v){
                                this.submitParams = this.createParame(this.setForm2, true);
                                this.tipsVisible = true
                            }else{
                                this.toErrorValidate()
                                return false;
                            }
                        })
                    break;
                }
            },
            //检查错误验证
            toErrorValidate() {
                this.$nextTick(()=>{
                    let num = Number($(".xk-container").scrollTop()) + Number($(".is-error:first").offset().top);
                    $('.xk-container').animate({
                        scrollTop: num - 90
                    }, 500)                            
                })
            },
            //打开开奖方式
            openDialog(form, index) {
                if(this.infoForm.usage==='expense') {
                    this.visible = true;
                }else{
                    if(!form.totalSequenceNumber) {
                        this.$alert('请先设置期数！', '提示', {
                            confirmButtonText: '确定',
                            call:()=>{}
                        });
                        return false
                    }
                    this['tipsVisible'+index] = true
                }
            },
            //设置开奖
            sure() {
                let params = {
                    jSequence: this.submitParams,
                    isFirst: this.goodsStatus==='DOWN'? 0: 1
                };
                console.log(JSON.stringify(params))
                this.saveLoading = true;
                this.$http.post(this.$api.jSequenceCreate, params, true).then((res) => {
                    this.saveLoading = false;
                    this.$router.push("/prizesList")
                }).catch(err => {
                    this.saveLoading = false;
                    this.$message.error(err.message);
                });
            },
            //构建请求参数
            createParame(obj, bool) {
                let params = {
                    type: 'welfare',
                    goods: {
                        id: this.id
                    },
                    lotteryWay: {
                        jDrawType: this.radio,   //开奖方式
                        totalSequenceNumber: this.infoForm.usage==='expense'&&this.radio==='bytime'? obj.way.total: obj.totalSequenceNumber       //总期数
                    }
                };
                this.infoForm.usage==='expense'? params.type="activity": null;
                this.infoForm.usage==='expense'&&this.radio==='bymember'? null : params.lotteryWay.eachNotePrice = this.$math.multip(obj.eachNotePrice, 100);   //每注价格
                this.infoForm.usage==='competition'? params.type="competition": null;
                
                this.radio!=='bytime'? params.lotteryWay.eachSequenceNumber = obj.eachSequenceNumber: null;    //每期总注数
                obj.lotteryDate? params.lotteryWay.lotteryDate = obj.lotteryDate: null;      //如果不是按进度进度完成自动开奖
                this.nextId? params.lotteryWay.id = this.nextId: null;

                let lotteryDate = [];
                if(!bool) {
                    if(this.infoForm.usage==='expense') {
                        params.lotteryWay.lotteryDate =this.transformTimestampExpense(obj)
                    }else{
                        params.lotteryWay.lotteryDate =this.transformTimestamp(obj);
                    }
                }
                return params;
            },
            /**--------------------------------------------------平台运营抽奖走这里--------------------------------- */
            //将预置的时间转为时间戳
            transformTimestampExpense(params) {
                let dayTamp = 86400;//一天的时间戳
                switch(params.way.activeRadio) {
                    case "first":
                        //获取开始时间和结束时间的时间戳
                        let startTamp = Number(moment(params.way.setTime[0]).format('X'));
                        let endTamp = Number(moment(params.way.setTime[1]).format('X'));
                        //计算开奖日期中间间隔
                        let firstDayTamp = Number(moment(params.way.setTime[0]).startOf('day').format('X')); //获取选择的第一个日期的0晨时间戳
                        let lastDayTamp = Number(moment(params.way.setTime[1]).startOf('day').format('X')); //获取选择的最后一个日期的0晨时间戳
                        let departDay = parseInt((lastDayTamp- firstDayTamp)/dayTamp) +1;       //间隔天数
                        let currentDayTamp = Number(moment().startOf('day').format('X'));         //获取当前0晨时间戳

                        let sortArr = [];
                        for(let i=0; i< departDay; i++) {
                            params.way.fixedData.forEach(item=>{
                                if(item.continue) {
                                    //获取当前选中项时分秒时间抽
                                    let hourTamp = moment(item.continue).hours()*3600 + moment(item.continue).minute()*60 + moment(item.continue).second();
                                    sortArr.push(firstDayTamp + hourTamp + i*dayTamp);
                                }
                            })
                        }

                        return sortArr.filter(item=>{
                            if(currentDayTamp==firstDayTamp) {
                                return (item <=endTamp && item >= Number(moment().format('X')));
                            }else{
                                return (item <=endTamp && item >= startTamp);
                            }
                        });
                    case "second":
                        //获取开始时间和结束时间的时间戳
                        let startTamp2 = Number(moment(params.way.setTime[0]).format('X'));
                        let endTamp2 = Number(moment(params.way.setTime[1]).format('X'));

                        //将间隔时间转为时间戳
                        let departTimeArr2 = JSON.parse(JSON.stringify(params.way.divideTime)).split(":");
                        let divideTimeTamp = Number(departTimeArr2[0]) * 3600 + Number(departTimeArr2[1]) * 60;

                        let i = 0;
                        let secondArr = [startTamp2];
                        do{
                            i = divideTimeTamp + secondArr[secondArr.length-1];
                            secondArr.push(i);
                        }while (i < endTamp2){
                            return secondArr.filter(item=>{
                                return item>=Number(moment().format('X'))&& item<= endTamp2;
                            });
                        }
                        break;
                    case "third":
                        let thirdArr = [];
                        params.way.custom.forEach(item=>{
                            if(item.date) {
                                //获取被选中日期的0晨时间戳
                                let zeroTamp = Number(moment(item.date).startOf('day').format('X'));
                                item.times.forEach(cItem=> {
                                    if(cItem.time) {
                                        //获取当前选中项时分秒时间抽
                                        let hourTamp = moment(cItem.time).hours()*3600 + moment(cItem.time).minute()*60 + moment(cItem.time).second();
                                        thirdArr.push(zeroTamp+hourTamp);
                                    }
                                })
                            }
                        })
                        return thirdArr.filter(item=>{
                            return item>=Number(moment().format('X'));
                        });
                }
                return [];
            },
            /**--------------------------------------------------平台运营抽奖走这里-------------------END---------------------------- */

            /**
             * -------------------------------------------------------游戏专用和福利抽奖走这里---------------------------------
             */
            //将星期转换为时间戳
            transformTimestamp(params) {
                let timeArr = [],   //存储第一次开奖的0时间戳
                    zeroTimestamp = null;    //存储第一次开奖的0晨时间戳

                //accordTime存储符合第一次开奖时间的时间段，notAccordTime存储不符合的时间段，针对时间段特殊情况
                let accordTime = [],
                    notAccordTime=[],
                    accordStatus = false;
                //首先计算第一次开奖日期的时间戳；


                //如果不是星期类型
                if(params.way.type != 'daily') { 
                    //获取当天星期
                    let date = new Date();
                    let week = date.getDay();
                    
                    EnumWeebday.forEach((item,index)=>{
                        if(item.key === params.way.type) {
                            //当前选择星期小于当天星期，则从下个星期开始开奖
                            if(index < week-1) {
                                zeroTimestamp = 86400 *(7 - (week-1-index)) + this.getCurrDayTimestamp(date);
                            }else 
                            //如果所选星期等于当天星期，并且开奖时间
                            if(index == week -1 || (index+1)%7==0){
                                //先判断哪些时间符合当天开奖时间
                                let currTime = date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds();
                                
                                for(let i=0, len = params.way.times.length ; i< len; i++) {
                                    //中间加5分钟容错时间
                                    if(this.getDatePickerTimestamp(params.way.times[i]) >= currTime){
                                        accordTime.push(parseInt(params.way.times[i].getTime()/1000));
                                    }else{
                                        notAccordTime.push(params.way.times[i]);
                                    }
                                }

                                accordStatus = true;

                                //如果第一次开奖时间的时间段为0，则当天不再开奖，改为下个周该时段开奖
                                if(accordTime.length===0) {
                                    zeroTimestamp = 86400 *7 + this.getCurrDayTimestamp(date);
                                }else{
                                    zeroTimestamp = this.getCurrDayTimestamp(date)
                                }
                            } else {
                                zeroTimestamp = (index+1 -week) * 86400 + this.getCurrDayTimestamp(date);
                            }
                        }
                    })
                }else{
                    let date = new Date();
                    zeroTimestamp = parseInt(params.way.firstDrawDate.getTime()/1000);
                    //如果所选日期等于当前日期
                    if(parseInt(params.way.firstDrawDate.getTime()/1000) == parseInt(date.getTime()/1000)-date.getHours() *3600 - date.getMinutes() * 60 - date.getSeconds()) {
                        let currTime = date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds();
                        
                        for(let i=0, len = params.way.times.length ; i< len; i++) {
                            //中间加5分钟容错时间
                            if(this.getDatePickerTimestamp(params.way.times[i]) >= currTime){
                                accordTime.push(parseInt(params.way.times[i].getTime()/1000));
                            }else{
                                notAccordTime.push(params.way.times[i]);
                            }
                        }
                        accordStatus = true;
                    }
                }

                //计算间隔时间
                let departTimestamp = params.way.perDay * 86400 + 86400;
                //时间段长度
                let timeLen = params.way.times.length;

                let lotteryDate = [];
                let _tmpArr = [];
                let eachLen = Math.ceil(params.totalSequenceNumber/params.way.times.length);

                if(accordStatus) {
                    for(let i=0; i<eachLen; i++) {
                        _tmpArr.push(params.way.times);
                    }
                    for(let i=0, len = _tmpArr.length; i< len; i++) {
                        for(let j=0, lenJ= _tmpArr[i].length; j< lenJ; j++) {
                            lotteryDate.push(this.timeToTimestamp(_tmpArr[i][j], (i+1)*departTimestamp) + zeroTimestamp);
                        }
                    }
                    accordTime.length>0? lotteryDate = accordTime.concat(lotteryDate):null;
                }else{
                    for(let i=0; i<eachLen; i++) {
                        _tmpArr.push(params.way.times);
                    }
                    for(let i=0, len = _tmpArr.length; i< len; i++) {
                        for(let j=0, lenJ= _tmpArr[i].length; j< lenJ; j++) {
                            lotteryDate.push(this.timeToTimestamp(_tmpArr[i][j], i*departTimestamp) + zeroTimestamp);
                        }
                    }
                }
                return lotteryDate;
            },
            // 计算第一天开奖时间的时间戳
            timeToTimestamp(date, departTime) {
               return date.getHours()*3600 + date.getMinutes() *60 + date.getSeconds() + departTime;
            },
            //获取当天0晨的时间戳
            getCurrDayTimestamp(date) {
                return parseInt(date.getTime()/1000) - date.getHours()*3600 - date.getMinutes()*60 - date.getSeconds();
            },
            //返还日期选择器所选择的时分秒时间戳
            getDatePickerTimestamp(date = new Date()) {
                return date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds();
            },
            /***********--------------------------------------------------------游戏专用和福利抽奖走这里----------------------------------------------- */
            //下一期暂停
            pause(){
                this.$confirm('确定下一期暂停该奖品?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id:this.id,
                    };
                    this.$http.post(this.$api.jSequencePauseNext, data, true
                    ).then((res) => {
                        this.$router.push('prizesList');
                    }).catch(err => {
                        this.$message.error(err.message);
                    });
                }).catch(() => {
                });
            },
            //返回上一页
            back() {
                this.$router.push("/prizesList")
            }
        },
        filters: {
            // 奖品分类
            formatCategory(val) {
                return enumFormatter(val, categroyList, {key: 'code', value: 'name'});
            },
            formatUsage(val) {
                return enumFormatter(val, EnumUsage);
            },
            prizeWay(val) {
                return enumFormatter(val, EnumJDrawType);
            },
            formatDate(val) {
                return enumFormatter(val, EnumWeebday);
            },
            formatTimes(_seconds) {
                _seconds = parseInt(_seconds);
                let hours, mins, seconds;
                let result = '';
                seconds = parseInt(_seconds % 60);
                mins = parseInt(_seconds % 3600 / 60)
                hours = parseInt(_seconds / 3600);
                if (hours)
                    result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}`
                else
                    result = `${PadZero(mins)}:${PadZero(seconds)}`
                return result;
            }
        },
        watch: {
            'setForm1.way': {
                handler(val) {
                    this.$refs['setForm1way']?this.$refs['setForm1way'].clearValidate():""
                }
            },
            radio(val, oldVal) {
                switch(oldVal) {
                    case 'bytime':
                        this.$refs['setForm1']&&!this.setForm1.way?this.$refs['setForm1'].resetFields():"";
                    break;
                    case 'bymember':
                        this.$refs['setForm2']&&!this.setForm2.way?this.$refs['setForm2'].resetFields():"";
                    break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./nextPrizes.scss";
</style>
