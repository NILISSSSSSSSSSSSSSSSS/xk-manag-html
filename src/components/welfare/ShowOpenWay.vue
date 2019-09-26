<template>
    <div class="show-open-way">
        <el-row style="padding: 0 20px;margin-top: 10px;font-size: 14px;background:#ccc">
            <el-col>
                <el-col style="width:80px">开奖日期：</el-col>
                <el-col :span="6">
                    <span v-if="detail.type!=='daily'">{{ detail.type | formatDate }}</span>
                    <span v-else>{{ moment(detail.firstDrawDate).format('YYYY-MM-DD') }}</span>
                </el-col>
            </el-col>
            <el-col>
                <el-col style="width:80px">开奖时间：</el-col>
                <el-col :span="6">
                    <span v-for="(item,index) in detail.times" :key="index">第{{ index+1 }}次：{{ moment(item).format('H:mm:ss') }}<br/></span>
                </el-col>
            </el-col>
            <el-col>
                <el-col style="width:110px">连续开奖方式：</el-col>
                <el-col :span="6">{{ detail.perDay==0? '每天开奖': `每隔  ${detail.perDay}  天` }}</el-col>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import { EnumWeebday } from '@/util/publicParams';
    import moment from 'moment';
    export default {
        props: {
            detail:{
                type: Object,
                default: ()=>({})
            }
        },
        data() {
            return {
                moment
            }
        },
        filters: {
            formatDate(val) {
                for(let i=0, len = EnumWeebday.length; i< len; i++) {
                    if(EnumWeebday[i].key === val) {
                        return EnumWeebday[i].value
                    }
                }
                return val;
            }
        }
    }
</script>
<style scoped>

</style>
