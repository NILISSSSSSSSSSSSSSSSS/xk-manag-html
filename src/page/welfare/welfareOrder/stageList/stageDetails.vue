<template>
    <div class="xk-container">
        <!--内容-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>第{{ drawDetail.currentNper }}期详情
                </div>
                <div class="vus-bottom"></div>
            </div>

            <div class="pubpadd">
                <el-card class="box-card">
                    <div slot="header">
                        <span>奖品信息：</span>
                    </div>
                    <div class="paddBoth">
                        <div class="prize-info">
                            <el-row>
                                <el-col :span="24">奖品标题：{{ goods.name }}</el-col>
                                <el-col :span="6">奖品ID：{{ goods.id }}</el-col>
                                <el-col :span="6">奖品类型：{{ goods.type==='substance'? '实物奖品': '虚拟奖品' }}</el-col>
                                <el-col :span="6" v-if="goods.type==='substance'">奖品分类：{{ goods.realAttr.categoryCode | formatCate }}</el-col>
                                <el-col :span="6" v-if="goods.type==='substance'">奖品品牌：{{ goods.realAttr.brandName || '无' }}</el-col>
                                <el-col :span="6">奖品用途：{{ goods.usage | formatUsage }}</el-col>
                                <el-col :span="6" v-if="goods.realAttr && goods.realAttr.originalValue">奖品价格：{{ goods.realAttr.originalValue? $math.divide(goods.realAttr.originalValue, 100):0 }}券</el-col>
                                <el-col :span="6" v-if="goods.realAttr && goods.realAttr.specInfo">奖品规格：{{ goods.realAttr.specInfo }}</el-col>
                                <el-col :span="6">奖品邮寄方式：包邮</el-col>
                                <el-col :span="24">奖品图片：</el-col>
                                <el-col :span="24" style="padding:0 20px">
                                    <template v-if="goods.realAttr && goods.realAttr.showPics">
                                        <image-list v-for="(item, index) in goods.realAttr.showPics" 
                                                    :url="item"
                                                    :key="index"></image-list>
                                    </template>
                                    <image-list v-else :url="goods.virtualAttr.mainPic"></image-list>
                                </el-col>
                                <el-col :span="24">缩略图：</el-col>
                                <el-col :span="24" v-if="goods.microPic" style="padding:0 20px">
                                    <image-list :url="goods.microPic"></image-list>
                                </el-col>
                                <el-col :span="6" v-if="goods.commentAward">晒单后返回奖励：{{ goods.commentAward.type==="voucher"? $math.divide(goods.commentAward.count, 100) + '  消费券': goods.commentAward.count + '  张AA彩票' }}</el-col>
                                <el-col :span="6">是否需要分享：{{ goods.isFreeShare == 1? "需要": "不需要" }}</el-col>
                                <el-col :span="24">简介：{{ goods.description? goods.description: '无' }}</el-col>
                                <el-col :span="6">开奖方式：{{drawDetail.lotteryWay.jDrawType | prizeWay}}</el-col>
                                <el-col :span="6">开奖日期：{{ drawDetail.expectLotteryDate? moment(drawDetail.expectLotteryDate*1000).format('YYYY-MM-DD') : '未开始'}}</el-col>
                                <el-col :span="6">开奖时间： {{ drawDetail.expectLotteryDate? moment(drawDetail.expectLotteryDate*1000).format('HH:mm:ss') : '未开始'}}</el-col>
                                <el-col :span="6">开奖期数：第{{drawDetail.currentNper}}期</el-col>
                                <el-col :span="6">期号：{{ drawDetail.id }}</el-col>
                                <template v-if="drawDetail.lotteryWay.jDrawType !== 'bytime'">
                                    <el-col :span="6">开奖注数： {{drawDetail.lotteryWay.eachSequenceNumber}} 注</el-col>
                                    <el-col :span="6">每注优惠券金额： {{ $math.divide(drawDetail.lotteryWay.eachNotePrice, 100) }}</el-col>
                                    <el-col :span="6">总需参与人次： {{drawDetail.lotteryWay.eachSequenceNumber || '不限'}}</el-col>
                                    <el-col :span="6">当前参与人次： {{drawDetail.currentCustomerNum || 0 }}  </el-col>
                                </template>
                            </el-row>
                        </div>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header">
                        <span>本期参与名单：</span>
                    </div>
                    <div class="paddBoth">
                        <!--表格数据-->
                        <div class="pubpadd marintop20 solidtop">
                            <el-table v-loading="tableLoading" :data="tableData">
                                <el-table-column prop="userId" label="用户UID"></el-table-column>
                                <el-table-column prop="userTel" label="用户手机号"></el-table-column>
                                <el-table-column prop="orderNumber" label="购买注数"></el-table-column>
                                <el-table-column label="支付金额">
                                    <template slot-scope="scope">
                                        {{ $math.divide(scope.row.price, 100) }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="下单时间" width="150">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.createdAt | formatTime}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单状态" :formatter="formatterLottery" width="150"></el-table-column>
                            </el-table>
                            <!--分页组件-->
                            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
        <div class="btn-group">
            <el-button :size="$size" @click="back()" type="primary">返回</el-button>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    let cat = [];
    //枚举订单状态
    const EnumLottery = [{key: 'NO_LOTTERY', value: '未开奖'},{key: 'LOSING_LOTTERY', value: '未中奖'},{key: 'WINNING_LOTTERY', value: '已中奖'},{key: 'SHARE_LOTTERY', value: '已晒单'},{key: 'SHARE_AUDIT_ING', value: '晒单审核中'},{key: 'SHARE_AUDIT_FAIL', value: '晒单未通过'}];
    import PrizeInfo from '@/components/welfare/PrizeInfo.vue';
    import { PrizeUsageEnum,EnumJDrawType } from '@/util/publicParams';
    import {enumFormatter} from '@/util/publicMehotds.js';
    import ImageList from '@/components/common/ImageList.vue';

    export default {
        name: "stageDetails",
        components: {
            PrizeInfo,
            ImageList
        },
        data(){
            return{
                EnumLottery,
                EnumJDrawType,
                id:'',     //奖品id
                goods: {
                    commentAward: {},
                    realAttr: {},
                    virtualAttr: {}
                },  //基本信息
                drawDetail: {
                    lotteryWay: {}
                },  //期数信息
                tableData: [],
                tableLoading: false,
                prizeClass: '',
                page: {
                    page: 1,
                    total: 0,
                    limit: 10
                },
                moment,
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.goodsId = this.$route.query.goodsId;
            this.getPrizeClass();
            this.allList();
            this.tableList();
        },
        methods:{
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.tableList();
            },
            /**获取奖品分类 */
            getPrizeClass() {
                this.$http.get(this.$api. queryJFCategory, {}, true
                ).then(res => {
                    cat = res;
                    this.getGoodsDetail();
                }).catch(err => {
                    this.$message.error(err.message);
                    this.getGoodsDetail()
                });
            },
            //获取奖品详情
            getGoodsDetail() {
                this.$http.get(this.$api.jfmallGoodsDetail4Manager, {jGoodsId: this.goodsId}, true).then(res=>{
                    console.log(res);
                    this.goods = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            allList() {
                let params={
                    id:this.id
                };
                this.$http.get(this.$api.jSequenceDetailById, params, true).then((res)=>{
                    console.log(res);
                    this.drawDetail = res;
                }).catch(err=>{
                    err.code===409? this.tableData=[]:"";
                    this.$message.error(err.message)
                });
            },
            tableList() {
                let params = {
                    termNumber: this.id,
                    page: this.page.page,
                    limit: this.page.limit
                };

                this.tableLoading = true;
                this.$http.get(this.$api.jMallLotteryOrderByTermNumberQPage, params, true).then(res=>{
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.tableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                })
            },
            formatterLottery(row) {
                return enumFormatter(row.lottery, EnumLottery)
            },
            back() {
                this.$router.push('/stageList');
            }
        },
        filters: {
            prizeWay(val) {
                return enumFormatter(val, EnumJDrawType);
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
        /deep/ .el-row {
            font-size: 14px;
            color: #666;
            >>> .el-col {
                margin-bottom: 10px;
            }
        }
    }
    .imgInfo {
        width: 80px;
        height: 80px;
        margin-left: 20px;
        border: 1px dotted #999;
    }
    .prize-info {
        /deep/ .el-col {
            margin-bottom: 10px;
            font-size: 14px;
            color: #555;
        }
    }
</style>
