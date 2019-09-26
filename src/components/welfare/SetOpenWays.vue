<template>
    <div class="set-open-ways">
        <el-dialog :visible.sync="visible" title="设置开奖方式" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDia">
            <el-form label-width="120px" :model="setForm" ref="setForm" class="custom-row">
                <el-form-item label="设置开奖方式：">
                    <el-radio-group v-model="activeRadio">
                        <el-radio label="first">每日固定几次开奖</el-radio>
                        <el-radio label="second">统一间隔开奖</el-radio>
                        <el-radio label="third">每期自定义开奖</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="activeRadio!='third'">
                    <el-form-item label="选择开奖日期：" prop="setTime" :rules="rules.checkNum">
                        <el-date-picker 
                            :size="$size" 
                            :editable="false"
                            :picker-options="pickerOptions"
                            type="datetimerange" 
                            v-model="setForm.setTime"
                            range-separator="至" 
                            start-placeholder="开始日期" 
                            end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </template>
                <!-- 每日固定几次开奖 -->
                <template v-if="activeRadio=='first'">
                    <el-form-item label="每日开奖时间：">
                        <div v-for="(item,index) in setForm.fixedData" :key="index">
                            <el-form-item label-width="0" :prop="'fixedData.' + index+ '.continue'" :rules="rules.checkEqual">
                                <el-time-picker :editable="false" :size="$size" v-model="item.continue"></el-time-picker>
                                <el-button v-if="setForm.fixedData.length!==1" :size="$size" type="danger" @click="delContinue(index)">-</el-button>
                                <el-button v-if="setForm.fixedData.length-1==index" :size="$size" @click="addContinue()">+</el-button>
                            </el-form-item>
                        </div>
                    </el-form-item>
                </template>
                <!-- 统一间隔开奖  半小时为间隔 -->
                <template v-if="activeRadio=='second'">
                    <el-form-item label="连续开奖每隔：">
                        <el-form-item label-width="0" prop="divideTime" :rules="rules.checkTime">
                            <el-time-select 
                                :size="$size" 
                                :editable="false"
                                v-model="setForm.divideTime"
                                :picker-options="{
                                    start: '00:30',
                                    step: '00:30',
                                    end: '23:30'
                                    }"></el-time-select>
                        </el-form-item>
                    </el-form-item>
                </template>
                
                <template v-if="activeRadio=='third'">
                    <!-- 每期自定义开奖 -->
                    <el-form-item label="选择开奖日期：">
                        <div v-for="(item, index) in setForm.custom" :key="index">
                            <el-row>
                                <el-col :span="3">日期：</el-col>
                                <el-col :span="19">
                                    <el-form-item label-width="0" :prop="'custom.'+index + '.date'" :rules="rules.checkEqual">
                                        <el-date-picker :picker-options="pickerOptions" :editable="false" :size="$size" type="date" v-model="item.date"></el-date-picker>
                                        <el-button style="float:right" v-if="setForm.custom.length-1=== index" :size="$size" type="success" @click="addCustom()">新增</el-button>
                                        <el-button style="float:right" v-if="setForm.custom.length !== 1" :size="$size" type="danger" @click="delCustom(index)">删除</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-for="(subItem, subIndex) in item.times" :key="subIndex">
                                <el-col :span="3">第{{ subIndex+1 }}次</el-col>
                                <el-col :span="19">
                                    <el-form-item label-width="0" :prop="'custom.' + index + '.times.' + subIndex + '.time'" :rules="rules.checkEqual">
                                        <el-time-picker :editable="false" :size="$size" type="date" v-model="subItem.time"></el-time-picker>
                                        <el-button :size="$size" v-if="item.times.length !== 1" @click="delCustomTime(index, subIndex)" type="warning" icon="el-icon-delete" circle></el-button>
                                        <el-button :size="$size" v-if="item.times.length-1 === subIndex" @click="addCustomTime(index)" type="primary" icon="el-icon-plus" circle></el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form-item>
                </template>
                <el-form-item label="总计开奖期数：">{{ total }} 期</el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="closeDia()">取消</el-button>
                <el-button :size="$size" type="primary" @click="confim('setForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        props: {
            visible: {
                type: Boolean, 
                default: false
            },
            value: {}
        },
        data() {
            return {
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0));
                    }
                },
                rules: {
                    checkTime: [
                        { required: true, message: '不能为空' , trigger: 'change' }
                    ],
                    checkNum: [
                        { 
                            required: true, 
                            validator: (rule, value, call) => {
                                if(!value) {
                                    return call(new Error('不能为空'))
                                }
                                if(moment(value[0]).format('X') == moment(value[1]).format('X')) {
                                    return call(new Error('不能选择同个时间'))
                                }
                                return call();
                            }, 
                            trigger: 'change'
                        }
                    ],
                    checkEqual: [
                        { 
                            required: true, 
                            validator: (rule, value, call) => {
                                if(!value) {
                                    return call(new Error('不能为空'))
                                }
                                let formArr = rule.field.split(".");
                                let pIndex = formArr[1];
                                let cIndex = formArr[3];
                                //判断是否有重复的值
                                if(pIndex&&!cIndex) {
                                    if(formArr[0]=='fixedData') {
                                        return this.setForm.fixedData.filter((item,index)=>{
                                            return moment(item.continue).format('X')== moment(value).format('X') && index!=pIndex;
                                        }).length? call(new Error('不能填写相同的时间')): call();
                                    }else{
                                        return this.setForm.custom.filter((item,index)=>{
                                            return moment(item.date).format('X') == moment(value).format('X') && index!=pIndex;
                                        }).length? call(new Error('不能填写相同的时间')): call();
                                    }
                                }
                                return this.setForm.custom[pIndex].times.filter((item,index)=>{
                                    return moment(item.time).format('X') == moment(value).format('X') && index!=cIndex;
                                }).length? call(new Error('不能填写相同的时间')): call();
                            }, 
                            trigger: 'change'
                        }
                    ]
                },
                setForm: {},
                activeRadio: 'first'
            }
        },
        computed: {
            total() {
                let sum = 0;
                let dayTamp = 86400;//一天的时间戳
                switch(this.activeRadio) {
                    case "first":
                        //时间没设置退出判断
                        if(!this.setForm.setTime) {
                            break;
                        }
                        //获取开始时间和结束时间的时间戳
                        let startTamp = Number(moment(this.setForm.setTime[0]).format('X'));
                        let endTamp = Number(moment(this.setForm.setTime[1]).format('X'));
                        //计算开奖日期中间间隔
                        let firstDayTamp = Number(moment(this.setForm.setTime[0]).startOf('day').format('X')); //获取选择的第一个日期的0晨时间戳
                        let lastDayTamp = Number(moment(this.setForm.setTime[1]).startOf('day').format('X')); //获取选择的最后一个日期的0晨时间戳
                        let departDay = parseInt((lastDayTamp- firstDayTamp)/dayTamp) +1;       //间隔天数
                        let currentDayTamp = Number(moment().startOf('day').format('X'));         //获取当前0晨时间戳

                        let sortArr = [];
                        for(let i=0; i< departDay; i++) {
                            this.setForm.fixedData.forEach(item=>{
                                if(item.continue) {
                                    //获取当前选中项时分秒时间抽
                                    let hourTamp = moment(item.continue).hours()*3600 + moment(item.continue).minute()*60 + moment(item.continue).second();
                                    sortArr.push(firstDayTamp + hourTamp + i*dayTamp);
                                }
                            })
                        }
                        sum = sortArr.filter(item=>{
                            if(currentDayTamp==firstDayTamp) {
                                return (item <=endTamp && item >= Number(moment().format('X')));
                            }else{
                                return (item <=endTamp && item >= startTamp);
                            }
                        }).length;
                        break;
                    case "second":
                        //时间没设置退出判断
                        if(!this.setForm.setTime || !this.setForm.divideTime) {
                            break;
                        }
                        //获取开始时间和结束时间的时间戳
                        let startTamp2 = Number(moment(this.setForm.setTime[0]).format('X'));
                        let endTamp2 = Number(moment(this.setForm.setTime[1]).format('X'));

                        //将间隔时间转为时间戳
                        let departTimeArr2 = JSON.parse(JSON.stringify(this.setForm.divideTime)).split(":");
                        let divideTimeTamp = Number(departTimeArr2[0]) * 3600 + Number(departTimeArr2[1]) * 60;

                        let i = 0;
                        let secondArr = [startTamp2];
                        do{
                            i = divideTimeTamp + secondArr[secondArr.length-1];
                            secondArr.push(i);
                        }while (i < endTamp2){
                            sum = secondArr.filter(item=>{
                                return item>=Number(moment().format('X')) && item<= endTamp2;
                            }).length;
                        }
                        break;
                    case "third":
                        let thirdArr = [];
                        this.setForm.custom.forEach(item=>{
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
                        sum = thirdArr.filter(item=>{
                            return item>=Number(moment().format('X'));
                        }).length;
                        break;
                }
                return sum;
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.setForm = {
                    fixedData: [{continue: ""}],
                    custom: [
                        { date:"", times: [{time: ""}] }
                    ]
                };
            },
            closeDia() {
                this.$emit('update:visible', false);
            },
            confim(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = Object.assign(this.setForm, {activeRadio: this.activeRadio, total: this.total});
                        this.$emit('input', params);
                        this.closeDia();
                    }else{
                        this.$emit('input', "");
                        return false;
                    }
                })
            },
            //每日固定添加时间
            addContinue() {
                this.setForm.fixedData.push({
                    continue: ""
                })
            },
            //每日固定删除时间
            delContinue(index) {
                this.setForm.fixedData.splice(index, 1);
            },
            //自定义增加
            addCustom() {
                this.setForm.custom.push({ date:"", times: [{time: ""}] })
            },
            //自定义删除
            delCustom(index) {
                this.setForm.custom.splice(index, 1);
            },
            //自定义时间删除
            delCustomTime(pIndex, cIndex) {
                this.setForm.custom[pIndex].times.splice(cIndex, 1);
            },
            //自定义时间新增
            addCustomTime(pIndex) {
                this.setForm.custom[pIndex].times.push({time: ""});
            }
        },
        watch: {
            activeRadio(val) {
                this.$refs['setForm']?this.$refs['setForm'].clearValidate(): null;
            },
            visible(val) {
                if(val) {
                    this.$refs['setForm']?this.$refs['setForm'].clearValidate(): null;
                }
            },
            value: {
                handler(val) {
                    if(val) {
                        let obj = {};
                        for(let i in val) {
                            if(i!='activeRadio'&&i !='activeRadio') {
                                obj[i] = val[i];
                            }
                        }
                        this.setForm = obj;
                    }else{
                        this.init();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .set-open-ways {
        .custom-row {
            /deep/ .el-form-item{
                margin-bottom: 15px;
            }
        }
    }
</style>
