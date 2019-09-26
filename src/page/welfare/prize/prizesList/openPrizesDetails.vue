<template>
    <div class="xk-container">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>商品详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                     class=" demo-ruleForm  pubpadd">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>基本信息：</span>
                    </div>
                    <div class="paddBoth basic-info">
                        <el-row class="paddtop20">
                            <el-col :span="6">奖品ID：{{ruleForm.id}}</el-col>
                            <el-col :span="6">奖品类型：{{ ruleForm.type==="substance"?"实物奖品":"虚拟奖品" }}</el-col>
                            <el-col :span="6" v-if="ruleForm.realAttr && ruleForm.realAttr.categoryCode">奖品分类： {{ ruleForm.realAttr.categoryCode | formatCate }}</el-col>
                            <el-col :span="6" v-if="ruleForm.realAttr && ruleForm.realAttr.brandName">奖品品牌： {{ ruleForm.realAttr.brandName }}</el-col>
                            <el-col :span="6" v-if="ruleForm.realAttr && ruleForm.realAttr.isFreeShipping">邮寄方式：{{ ruleForm.realAttr.isFreeShipping==1?'包邮': '不包邮' }}</el-col>
                            <el-col :span="6">奖品标题：{{ ruleForm.name }}</el-col>
                            <el-col :span="6">奖品用途：{{ ruleForm.usage | formatUsage }}</el-col>
                            <el-col :span="24" v-if="ruleForm.realAttr && ruleForm.realAttr.showPics || ruleForm.virtualAttr && ruleForm.virtualAttr.mainPic">
                                <p>商品图片：</p>
                                <div class="goods-detail" v-if="ruleForm.realAttr && ruleForm.realAttr.showPics">
                                    <image-list v-for="(value,index) in ruleForm.realAttr.showPics" 
                                                :url="value"
                                                :key="index"></image-list>
                                </div>
                                <div class="goods-detail" v-if="ruleForm.virtualAttr && ruleForm.virtualAttr.mainPic">
                                    <image-list :url="ruleForm.virtualAttr.mainPic"></image-list>
                                </div>
                            </el-col>
                            <el-col :span="24" v-if="ruleForm.microPic">
                                <p>奖品缩略图：</p>
                                <div class="goods-detail">
                                    <image-list :url="ruleForm.microPic"></image-list>
                                </div>
                            </el-col>
                            
                            <el-col :span="6" v-if="ruleForm.realAttr && ruleForm.realAttr.specInfo">奖品规格： {{ruleForm.realAttr.specInfo}}</el-col>
                            <el-col :span="6" v-if="ruleForm.realAttr && ruleForm.realAttr.originalValue">奖品价格：  {{ $math.divide(ruleForm.realAttr.originalValue ,100)}}</el-col>
                            <el-col :span="6">晒单后奖励：{{ruleForm.commentAward.type === "voucher"? $math.divide(ruleForm.commentAward.count, 100) + '  消费券': ruleForm.commentAward.count+'  张AA彩票' }}</el-col>
                            <el-col :span="6">中奖后是否需要分享：{{ruleForm.isFreeShare == 1? "需要": "不需要" }}</el-col>
                            <el-col :span="6" v-if="ruleForm.realAttr&& ruleForm.usage=='welfare'">限制购买次数：{{ ruleForm.purchaseNumber==-1? '不限': ruleForm.purchaseNumber+'次' }}</el-col>
                            <el-col :span="24">商品简介：{{ ruleForm.description }}</el-col>
                            <el-col :span="24">
                                <p>商品详情：</p>
                                <div class="goods-detail goods-detail-v-html" v-html="ruleForm.detailPics"></div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>当前期开奖方式：{{ lotteryDetail.lotteryWay.jDrawType | prizeWay }}</span>
                    </div>
                    <div class="paddBoth">
                        <div>
                            <el-row class="marintop20">
                                <el-col :span="6">开奖期数：{{lotteryDetail.lotteryWay.totalSequenceNumber}} 期</el-col>
                                <el-col :span="6" v-if="lotteryDetail.lotteryWay.jDrawType != 'bymember'">开奖日期：{{ lotteryDetail.expectLotteryDate? moment(lotteryDetail.expectLotteryDate*1000).format('YYYY-MM-DD') : '未开始' }}</el-col>
                                <el-col :span="6" v-if="lotteryDetail.lotteryWay.jDrawType != 'bymember'">开奖时间：{{ lotteryDetail.expectLotteryDate? moment(lotteryDetail.expectLotteryDate*1000).format('HH:mm:ss') : '未开始' }}</el-col>
                            </el-row>
                            <el-row class="marintop20">
                                <el-col :span="6" v-if="lotteryDetail.lotteryWay.jDrawType !=='bytime'">开奖注数： {{lotteryDetail.lotteryWay.eachSequenceNumber || 0}} 注</el-col>
                                <el-col :span="6">每注消费券金额： {{ $math.divide(lotteryDetail.lotteryWay.eachNotePrice, 100) }}</el-col>
                            </el-row>
                        </div>
                    </div>
                </el-card>

                <el-card class="box-card marintop20" v-if="nextSequence.id">
                    <div slot="header" class="clearfix">
                        <span>下一期开奖方式：{{ nextSequence.lotteryWay.jDrawType | prizeWay }}</span>
                    </div>
                    <div class="paddBoth">
                        <div>
                            <el-row class="marintop20">
                                <el-col :span="6">开奖期数：{{nextSequence.lotteryWay.totalSequenceNumber}} 期</el-col>
                                <el-col :span="6" v-if="nextSequence.lotteryWay.jDrawType != 'bymember'">开奖日期：{{ nextSequence.expectLotteryDate? moment(nextSequence.expectLotteryDate*1000).format('YYYY-MM-DD') : '未开始' }}</el-col>
                                <el-col :span="6" v-if="nextSequence.lotteryWay.jDrawType != 'bymember'">开奖时间：{{ nextSequence.expectLotteryDate? moment(nextSequence.expectLotteryDate*1000).format('HH:mm:ss') : '未开始' }}</el-col>
                            </el-row>
                            <el-row class="marintop20">
                                <el-col :span="6" v-if="nextSequence.lotteryWay.jDrawType !=='bytime'">开奖注数： {{nextSequence.lotteryWay.eachSequenceNumber || 0}} 注</el-col>
                                <el-col :span="6">每注消费券金额： {{ $math.divide(nextSequence.lotteryWay.eachNotePrice, 100) }}</el-col>
                            </el-row>
                        </div>
                    </div>
                </el-card>

                <!--底部提示-->
                <div class="paddbottom20">
                    <div class="solidbottom1px listInfo marintop20">温馨提示：</div>
                    <div class="paddtop20 marginleft20">
                        <p>1.  开奖方式已设置，无法再对奖品进行和编辑和删除或下架，您可设置下一期奖品，或者暂停开奖功能。</p>
                        <p>2.  开奖方式查询，需再福利订单--订单列表中查询</p>
                    </div>
                </div>
                <div class="textCenter">
                    <el-button :size="$size" type="primary" @click="sureRutern">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    //枚举开奖方式
    import moment from 'moment';
    import { EnumJDrawType, PrizeUsageEnum } from '@/util/publicParams';
    import  { enumFormatter } from '@/util/publicMehotds.js';
    import ImageList from '@/components/common/ImageList.vue';

    let cat = null;
    export default {
        name: "openPrizesDetails",
        components: {
            ImageList
        },
        data() {
            return {
                PrizeUsageEnum,
                moment,
                EnumJDrawType,
                id: '',             //期ID
                goodsId: '',   //奖品ID
                //奖品详情
                ruleForm: {
                    realAttr: {},
                    commentAward: {}
                },
                //期详情
                lotteryDetail: {
                    lotteryWay: {}
                },
                //下一期详情
                nextSequence: {
                    lotteryWay: {}
                }
            }
        },
        created() {
            this.id = this.$route.query.id ;
            this.goodsId = this.$route.query.goodsId;
            this.getPrizeClass();
            this.getLotteryDetail();
        },
        methods: {
            /**获取奖品分类 */
            getPrizeClass() {
                this.$http.get(this.$api. queryJFCategory, {}, true
                ).then((res) => {
                     cat = res;
                    this.getDetail();
                }).catch(err => {
                    this.$message.error(err.message);
                    this.getDetail()
                });
            },
            //获取详情内容
            getDetail() {
                let data = {
                    jGoodsId: this.goodsId
                };
                this.$http.get(this.$api.jfmallGoodsDetail4Manager, data, true).then(res => {
                    console.log(res);
                    this.ruleForm = res;
                    if(res.nextSequence && JSON.stringify(res.nextSequence) !="{}"){
                        this.nextSequence = res.nextSequence;
                    }
                }).catch(err => {
                    this.$message.error(err.message)
                });
            },
            //获取期详情
            getLotteryDetail() {
                this.$http.get(this.$api.jSequenceDetailById, { id: this.id }, true).then(res=>{
                    this.lotteryDetail = res;
                    
                    console.log(this.nextSequence)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //确认返回
            sureRutern(){
                this.$router.push('/prizesList');
            }
        },
        filters: {
            prizeWay(val) {
                return enumFormatter(val, EnumJDrawType)
            },
            formatCate(val) {
                return enumFormatter(val, cat, {key: 'code', value: 'name'});
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
    .paddBoth {
        padding-left: 20px;
        padding-right: 20px;
    }

    .listInfo {
        line-height: 48px;
    }

    .flext{
        display: flex;
        flex-direction: row;
        justify-content: start;
    }
    .basic-info {
        /deep/ .el-col {
            margin-bottom: 15px;
            font-size: 15px;
        }
        .goods-detail{
            padding: 20px 20px 0;
            overflow: hidden;
        }
    }
    .el-row{
        font-size: 14px;
        color: #555;
    }
</style>
