<template>
    <div class="xk-container">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>晒单详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div class="pubpadd">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>基本信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class="paddtop20">
                            <el-col :span="24">晒单奖品名称： {{ basicObj.name }}</el-col>
                            <el-col :span="6">晒单编号： {{ id }}</el-col>
                            <el-col :span="6" v-if="basicObj.type==='substance'">晒单奖品品牌： {{ basicObj.brandName }}</el-col>
                            <el-col :span="6">奖品类型： {{ basicObj.type==='substance'? '实物奖品': '虚拟奖品' }}</el-col>
                            <el-col :span="6" v-if="basicObj.type==='substance'">奖品分类： {{ basicObj.categoryId | formatCate }}</el-col>
                            <el-col :span="6" v-if="basicObj.type==='substance'">奖品规格： {{ basicObj.specInfo }}</el-col>
                            <el-col :span="6" v-if="basicObj.type!=='virtual'">晒单奖品价格： {{ $math.divide(basicObj.price, 100) }}券</el-col>
                            <el-col :span="6">奖品用途：{{ basicObj.usage | formatUsage }}</el-col>
                            <el-col :span="6" v-if="basicObj.returnPrice">晒单后奖励：
                                {{ 
                                    basicObj.returnPrice.type === 'voucher'
                                    ?  $math.divide(basicObj.returnPrice.count, 100)+ ' 消费券'
                                    :  basicObj.returnPrice.count+ ' 张AA彩票' 
                                }}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>用户信息：</span>
                    </div>
                    <div class="paddBoth">
                        <el-row class=" paddtop20">
                            <el-col :span="6">用户名： {{ detail.commenter.nickName }}</el-col>
                            <el-col :span="6">手机号码： {{ detail.commenter.phone }}</el-col>
                            
                        </el-row>
                        <el-row class=" paddtop20">
                            <el-col :span="2">
                                <span>评论内容：</span>
                            </el-col>
                            <el-col :span="22">{{ detail.content }}
                            </el-col>
                        </el-row>
                        <el-row class="paddtop20" type="flex" justify="start">
                            <el-col :span="2">
                                <span>晒单图片：</span>
                            </el-col>
                            <el-col :span="22">
                                <image-list v-for="(item, index) in detail.pictures" 
                                            :url="item"
                                            :key="index"></image-list>
                                <!-- 视频类 -->
                                <image-list v-if="detail.video&&detail.video.mainPic"
                                            type="video"
                                            :videoUrl="detail.video.url"
                                            :url="detail.video.mainPic"></image-list>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="box-card marintop20">
                    <div slot="header" class="clearfix">
                        <span>晒单审核：</span>
                    </div>
                     <!-- 审核 -->
                    <div class="paddBoth" v-if="type == 1">
                        <el-row class="paddtop20">
                            <el-form :model="verifyForm" label-width="100px">
                                <el-form-item label="审核结果：">
                                    <el-row>
                                        <el-col style="width: 90px">
                                            <el-radio v-model="verifyForm.status" label="verified">通过</el-radio>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-radio v-model="verifyForm.status" label="unApproved">不通过</el-radio>
                                            <el-input 
                                                v-if="verifyForm.status==='unApproved'"
                                                v-model="verifyForm.auditFailedReason"
                                                resize="none"
                                                type="textarea"
                                                :autosize="{ minRows: 5, maxRows: 5}"
                                                placeholder="请输入不通过的原因" 
                                                style="margin-top:10px"></el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </el-row>
                    </div>
                    <!-- 查看，晒单详情 -->
                    <div class="paddBoth" v-else>
                        <el-row class=" paddtop20">
                            <el-col>审核结果： {{ detail.audit.status | formatVerify}}</el-col>
                        </el-row>
                        <el-row class="paddtop20" v-if="detail.audit.auditFailedReason">
                            <el-col>审核不通过原因： {{ detail.audit.auditFailedReason }}</el-col>
                        </el-row>
                        <el-row class="paddtop20">
                            <el-col>审核时间： {{ detail.audit.auditDate | formatTime }}</el-col>
                        </el-row>
                    </div>
                </el-card>
                <div class="textCenter">
                    <el-button v-if="type == 1" :size="$size" @click="back()">返 回</el-button>
                    <el-button :size="$size" @click="goJump" type="primary" class="marintop20">确 定</el-button>
                </div>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import {enumFormatter} from '@/util/publicMehotds.js';
    import { EnumUsage } from '@/util/publicParams.js';
    //枚举开奖状态
    const EnumStatus = [{key: '', value: '全部'}, {key: 'unApproved', value: '未通过'},{key: 'verified', value: '已通过'},{key: 'unAudited', value: '未审核'}];
    import PrizeInfo from '@/components/welfare/PrizeInfo.vue';
    import ImageList from '@/components/common/ImageList.vue'
    let cat = null;
    export default {
        name: "listDetails",
        components: {
            PrizeInfo,
            ImageList
        },
        data() {
            return {
                EnumStatus,
                examineResult: "1",
                type: "",
                id: "",
                goodsId: '',
                detail: {
                    goods: {},
                    commenter: {},
                    audit: {}
                },
                basicObj: {
                    returnPrice: {}
                },
                verifyForm: {
                    status: 'verified'
                }
            }
        },
        created() {
            this.type = this.$route.query.type;
            this.id = this.$route.query.id;
            this.goodsId = this.$route.query.goodsId;
            this.getPrizeClass();
            this.getBasic();
        },
        methods: {
             /**获取奖品分类 */
            getPrizeClass() {
                this.$http.get(this.$api. queryJFCategory, {}, true
                ).then((res) => {
                    console.log(res)
                    cat = res;
                    this.getDetail();
                }).catch(err => {
                    this.$message.error(err.message);
                    this.getDetail()
                });
            },
            goJump() {
                if(this.type == 1) {
                    this.submitVerify();
                }else{
                    this.$router.push('sunburnList');
                }
            },
            back() {
                this.$router.push('sunburnList');
            },
            //获取详情
            getDetail() {
                let params = {
                    id: this.id,
                    orderId: this.goodsId
                }
                this.$http.get(this.$api.jGoodsCommentDetail4Manager, params, true).then(res=>{
                    this.detail = res;
                    console.log(res);
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //获取基本信息
            getBasic() {
                let params = {
                    orderId: this.goodsId
                }
                console.log(params);
                this.$http.get(this.$api.jMallOBMOrderDetail, params, true).then(res=>{
                    this.basicObj = res.goods;
                    console.log(res);
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //审核
            verify() {
                this.$http.get(this.$api.jGoodsCommentAudit4Manager, params, true).then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //提交审核状态
            submitVerify() {
                let params = {
                    audit: {
                        status: this.verifyForm.status
                    },
                    id: this.id
                }
                if(this.verifyForm.status === 'unApproved') {
                    if(!this.verifyForm.auditFailedReason) {
                        this.$message.warning('请填写不通过的原因！');
                        return false;
                    }
                    params.audit.auditFailedReason = this.verifyForm.auditFailedReason;
                }
                this.$http.post(this.$api.jGoodsCommentAudit4Manager, params, true).then(res=>{
                    this.$message.success('提交成功');
                    this.$router.push("/sunburnList");
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        filters: {
            formatVerify(val) {
                return enumFormatter(val, EnumStatus);
            },
            formatCate(val) {
                return enumFormatter(val, cat, {key: 'code', value: 'name'});
            },
            formatUsage(val) {
                if(val){
                    return enumFormatter(val, EnumUsage)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .paddBoth {
        padding-left: 20px;
        padding-right: 20px;
    }
    .el-col{
        font-size: 14px;
        color: #555;
    }
    /deep/ .el-col {
        margin-bottom: 15px;
    }
</style>
