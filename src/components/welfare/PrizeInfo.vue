<template>
    <div class="prize-info">
        <el-row>
            <el-col :span="6">奖品ID：{{ detail.id }}</el-col>
            <el-col :span="6">奖品类型：{{ detail.type==='substance'? '实物奖品': '虚拟奖品' }}</el-col>
            <el-col :span="6" v-if="detail.type==='substance'">奖品分类：{{ detail.categoryId | formatCate }}</el-col>
            <el-col :span="6" v-if="detail.type==='substance'">奖品品牌：{{ detail.brandName || '无' }}</el-col>
            <el-col :span="24">奖品标题：{{ detail.name }}</el-col>
            <el-col :span="6">奖品用途：{{ detail.usage | formatUsage }}</el-col>
            <el-col :span="6">奖品价格：{{ detail.price? $math.divide(detail.price, 100):0 }}券</el-col>
            <el-col :span="6">奖品邮寄方式：包邮</el-col>
            <el-col :span="24" v-if="detail.showPics">奖品图片：</el-col>
            <el-col :span="24" style="padding:0 20px;box-sizing:border-box" v-if="detail.showPics">
                <image-list v-for="(item, index) in detail.showPics" :url="item" :key="index"></image-list>
            </el-col>
            <template v-if="detail.microPic">
                <el-col :span="24">奖品缩略图：</el-col>
                <el-col :span="24" style="padding:0 20px;box-sizing:border-box">
                    <image-list :url="detail.microPic"></image-list>
                </el-col>
            </template>
            <el-col :span="6">奖品规格：{{ detail.specInfo }}</el-col>
            <el-col :span="6">是否需要分享：{{ detail.isFreeShare == 1? "需要": "不需要" }}</el-col>
            <el-col :span="6" v-if="detail.returnPrice">晒单后返回奖励：{{ detail.returnPrice.type==='voucher'? $math.divide(detail.returnPrice.count, 100) + '  消费券': detail.returnPrice.count + '  AA彩票' }}</el-col>
            <el-col :span="24">简介：{{ detail.description? detail.description: "无" }}</el-col>            
            <el-col :span="6" v-if="detail.drawType">开奖方式：{{detail.drawType.jDrawType | prizeWay}}</el-col> 

            <el-col :span="24" class="paddtop20" v-if="detail.drawType">
                <el-col :span="6">开奖日期：{{ detail.expectDrawTime? moment(detail.expectDrawTime*1000).format('YYYY-MM-DD'): '未开始' }}</el-col>
                <el-col :span="6">开奖时间： {{ detail.expectDrawTime ?moment(detail.expectDrawTime*1000).format('H:mm:ss') : '未开始' }}</el-col>
                <el-col :span="6">开奖期数：第{{detail.currentNper}}期</el-col>
            </el-col>
            <el-col :span="24" v-if="detail.drawType && detail.drawType.jDrawType !== 'bytime'">
                <el-col :span="6">开奖总期数： {{detail.drawType.totalSequenceNumber}} </el-col>
                <el-col :span="6">每注优惠券金额： {{ $math.divide(detail.drawType.eachNotePrice, 100) }}</el-col>
                <el-col :span="6">总需参与人次： {{detail.maxStake}}</el-col>
                <el-col :span="6">当前参与人次： {{detail.drawType.eachSequenceNumber || 0 }}</el-col>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import moment from 'moment';
    import { enumFormatter } from '../../util/publicMehotds.js';
    import { EnumJDrawType,PrizeUsageEnum } from '../../util/publicParams.js';
    import ImageList from '@/components/common/ImageList.vue';
    let cat = null;
    export default {
        components: {
            ImageList
        },
        props: {
            detail: {
                type: Object,
                default: ()=>({})
            }
        },
        data() {
            return {
                moment
            }
        },
        created() {
            this.getCat();
        },
        methods: {
            getCat() {
                this.$http.get(this.$api.queryJFCategory, {}, true).then(res=>{
                    cat = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        filters: {
            prizeWay(val) {
                return enumFormatter(val, EnumJDrawType);
            },
            formatCate(val) {
                if(cat && val) {
                    return enumFormatter(val, cat, { key: 'code', value: 'name' });
                }
            },
            formatUsage(val) {
                if(val) {
                    return enumFormatter(val, PrizeUsageEnum)
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .prize-info {
        /deep/ .el-col {
            margin-bottom: 10px;
            font-size: 14px;
            color: #555;
        }
    }
</style>
