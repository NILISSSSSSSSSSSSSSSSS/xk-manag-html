<template>
    <div class="set-open-way">
        <el-dialog title="设置开奖方式" :visible.sync="visible" width="700px">
            <el-form :model="setPrizeWay" :label-width="labelWidth" ref="setPrizeWay" :rules="rulesPrize">
                <el-form-item label="选择开奖日期：">
                    <el-row>
                        <el-col :span="3">
                            <el-radio v-model="setPrizeDate" label="0" value="星期">星期</el-radio>
                        </el-col>
                        <el-col :span="12">
                            <el-select :size="$size" style="width: 220px" v-model="setPrizeWay.type" :disabled="setPrizeDate=='1'">
                                <el-option v-for="(item,index) in EnumWeebday" :key="item.key" v-if="index < EnumWeebday.length-1" :value="item.key" :label="item.value" ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <el-radio v-model="setPrizeDate" label="1" value="每天">日期</el-radio>
                        </el-col>
                        <el-col :span="20">
                            <el-date-picker :size="$size" v-model="setPrizeWay.firstDrawDate" :disabled="setPrizeDate=='0'"></el-date-picker>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="设置开奖时间：">
                    <el-row v-for="(item,index) in setTime" :key="index">
                        <el-col :span="3">第{{ index+1 }}次</el-col>
                        <el-col :span="21">
                            <el-time-picker v-model="setPrizeWay.times[index]"
                                    :clearable="false"
                                    :editable="false"
                                    :picker-options="{
                                        selectableRange: `00:00:00 - 23:59:59`
                                    }"
                                :size="$size">
                            </el-time-picker>
                            <el-button v-if="index !==0 " :size="$size" type="danger" @click="deleteTime(index)"><i class="el-icon-close"></i></el-button>
                            <el-button v-if="setTime.length === (index+1)" :size="$size" type="primary" @click="addTime"><i class="el-icon-plus"></i></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="设置连续开奖方式：">
                    <el-row>
                        <el-col :span="3">每隔</el-col>
                        <el-col :span="12">
                            <el-form-item label="" prop="perDay">
                                <el-input v-model="setPrizeWay.perDay" :size="$size" style="width:220px" placeholder="0"></el-input>&nbsp;&nbsp;&nbsp;天
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="margintop20 textCenter">
                <el-button :size="$size" type="primary" @click="confirm">确 定</el-button>
                <el-button :size="$size" @click="closeDialog()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { EnumWeebday } from '@/util/publicParams';
    import moment from 'moment';
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false            
            },
            totalNper: {
                type: Number,
                default: 1
            },
            value: {}
        },
        data() {
            const checkNum = (rule, value, call)=>{
                if(!value){
                    return call();
                }
                if(!/(^[1-9]{1}\d*$)|(^[0-9]{1}$)/g.test(value)) {
                    return call(new Error('必须为数字或者第一个数字不能为0'));
                }
                call()
            }
            return {
                moment: moment,
                labelWidth: "150px",
                setPrizeWay: {
                    times: [],   //设置开奖时间
                },
                setTime:[0],
                setPrizeDate: '0',
                EnumWeebday: EnumWeebday,
                rulesPrize: {
                    perDay: [
                        { validator: checkNum, trigger: 'blur'}
                    ]
                },
                oldForm:{}
            }
        },
        methods: {
            closeDialog() {
                this.visible=false
            },
            hideDialog() {
                this.$emit('update:visible', false)
            },
            confirm() {
                let params = {
                    times: []
                };
                //判断开奖日期
                if(!this.setPrizeWay.type&&this.setPrizeDate==='0' || !this.setPrizeWay.firstDrawDate&&this.setPrizeDate==='1') {
                    this.$message.warning('请选择开奖日期');return false;
                }
                //判断开奖时间
                if(this.setPrizeWay.times.length===0){this.$message.warning('请设置开奖时间');return false;}
                for(let i =0, len = this.setPrizeWay.times.length; i< len; i++) {
                    if(!this.setPrizeWay.times[i]) {
                        this.$message.warning('请设置第'+i+'次开奖时间');
                        return false;
                    }
                    params.times[i] = this.setPrizeWay.times[i];
                }
                this.setPrizeDate === '0'? params.type = this.setPrizeWay.type: (params.firstDrawDate = this.setPrizeWay.firstDrawDate, params.type=EnumWeebday[7].key);
                params.perDay = this.setPrizeWay.perDay? this.setPrizeWay.perDay: 0;
                this.$refs['setPrizeWay'].validate(v=>{
                    if(v){
                        let _date = params.firstDrawDate? moment(params.firstDrawDate).format('YYYYMMDD'):"";
                        for(let i =0, len = this.setPrizeWay.times.length; i< len; i++) {
                            let condition = moment(this.setPrizeWay.times[i]).format('X') - moment().format('X') < 1800;
                            if( condition && this.setPrizeWay.type == moment().format('dddd').toLowerCase() || (condition && _date && moment().format('YYYYMMDD') == _date)) {
                                this.$confirm('当前时间距离开奖时间小于30分钟，是否继续？', '警告', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(()=>{
                                    params.times = this.sortTime(params.times);
                                    this.visible = false;
                                    this.$emit('input', params);
                                    this.hideDialog();
                                }).catch(()=>{
                                    return false;
                                })
                            }else{
                                params.times = this.sortTime(params.times);
                                this.visible = false;
                                this.$emit('input', params);
                                this.hideDialog();
                            }
                        }
                    }else{
                        return false;
                    }
                })
            },
            deleteTime(index) {
                this.setTime.splice(index, 1);
                this.setPrizeWay.times.splice(index, 1);
            },
            addTime() {
                if(this.setTime.length >= this.totalNper){
                    this.$alert('开奖时间次数不能超过开奖期数！', '提示', {
                        confirmButtonText: '确定',
                        call:()=>{}
                    });
                    return false;
                }
                this.setTime.push(0);
            },
            //时间排序
            sortTime(val) {
                let result = [];
                if(Array.isArray(val)) {
                    let _arr = val.map(item => {
                        return moment(item).format('x');
                    })
                    result = _arr.sort();
                }
                return result.map(item=>{
                    return new Date(item*1);
                })
            }
        },
        watch: {
            visible(val) {
                val===false? this.hideDialog(): "";
                if(this.value){
                    for(let i in this.value) {
                        this.setPrizeWay[i] = this.value[i];
                    }
                    this.setTime = JSON.parse(JSON.stringify(this.value.times));
                }
            }
        }
    }
</script>