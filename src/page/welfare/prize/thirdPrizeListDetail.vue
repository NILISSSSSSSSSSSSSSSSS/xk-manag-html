<template>
    <div class="xk-container third-prize-list-detail">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>商品详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-row>
                <el-col :span="6">奖品ID：{{ detail.id }}</el-col>
                <el-col :span="6">奖品名称：{{ detail.name }}</el-col>
                <el-col :span="6">奖品类型：{{ detail.type==='virtual'? '虚拟': '实物' }}</el-col>
                <el-col :span="6">奖品用途：{{ detail.usage ==='expense'? '运营专用奖品': '福利抽奖' }}</el-col>
                <el-col :span="6">商品来源：{{ detail.from==='jf_mall'? '夺奖派对': detail.from==='mall'? '自营商城': '店铺' }}</el-col>
                <el-col :span="6">来源商户ID：{{ detail.fromMerchantId }}</el-col>
                <!-- 实物奖品属性 -->
                <el-row v-if="detail.realAttr">
                    <el-col :span="6">商品类别：{{ detail.realAttr.categoryCode | formatCode }}</el-col>
                    <el-col :span="6">品牌名称：{{ detail.realAttr.brandName }}</el-col>
                    <el-col :span="6">商品规格：{{ detail.realAttr.specInfo }}</el-col>
                    <el-col :span="24" v-if="detail.realAttr.showPics && detail.realAttr.showPics.length>0">商品图片：</el-col>
                    <el-col :span="24" v-if="detail.realAttr.showPics && detail.realAttr.showPics.length>0">
                        <div class="img-list">
                            <div class="list" v-for="(item, index) in detail.realAttr.showPics" :key="index">
                                <img :src="item" alt="" @click="$viewImage(item)">
                            </div>
                        </div>
                    </el-col>
                    
                </el-row>
                <el-col :span="6">每注返回消费券：{{ detail.isReturnWhenLost == 0 ? '不返还': '返还' }}</el-col>
                <el-col :span="6">是否设置期：{{ detail.isSetting == 0? '否': '是' }}</el-col>
                <el-col :span="6">最后更新时间：{{ detail.updatedAt | formatTime }}</el-col>
                <el-col :span="24">商品详情介绍图片集：</el-col>
                <el-col :span="24" v-if="detail.detailPics">
                    <div style="padding:10px" v-html="detail.detailPics"></div>
                </el-col>
            </el-row>
            <div class="line"></div>
            <el-row>
                <el-col :span="2">商品审核：</el-col>
                <el-col :span="20" v-if="!type">{{ detail.auditRecord && detail.auditRecord.status==='UNAPPROVED' ? '未通过': detail.auditRecord && detail.auditRecord.status==='UNAUDITED'?'未审核': '审核通过' }}</el-col>
                <el-col :span="20" class="m-b-0" v-else>
                    <el-col :span="2">
                        <el-radio v-model="status" label="VERIFIED">通过</el-radio>
                    </el-col>
                    <el-col :span="10" class="m-b-0">
                        <el-col :span="24">
                            <el-radio v-model="status" label="UNAPPROVED">未通过</el-radio>
                        </el-col>
                        <el-col :span="24" class="m-b-0" v-if="status==='UNAPPROVED'">
                            <el-input :size="$size" v-model.trim="auditFailedReason" placeholder="输入不通过原因" type="textarea" :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button type="primary" :size="$size" @click="submit()" v-if="type">确定</el-button>
                <el-button type="success" :size="$size" @click="back()">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    let classMap = new Map();
    export default {
        data() {
            return {
                jGoodsId: null,
                status: 'VERIFIED',
                type: null,
                detail: {
                    commentAward: {},
                    auditRecord: {},
                    realAttr: {},
                    virtualAttr: {
                        aaCard: {},
                        freeCard: {},
                        cashPrize: {},
                        aaLotterySetting: {}
                    }
                }
            }
        },
        created() {
            this.jGoodsId = this.$route.query.id;
            this.type=this.$route.query.type
            this.getClass();
        },
        methods: {
            //获取商品类别
            getClass() {
                this.$http.get(this.$api.queryJFCategory, {}, true).then(res=>{
                    res.forEach(item=>{
                        classMap.set(item.code, item)
                    })
                    this.getDetail();
                })
                .catch(err=>{
                    this.getDetail();
                    this.$message.error(err.message);
                })
            },
            getDetail() {
                this.$http.get(this.$api.jfmallGoodsDetail4Manager,  {
                    jGoodsId: this.jGoodsId
                }, true).then(res=>{
                    this.detail = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            back() {
                this.$router.push("/thirdPrizeList")
            },
            submit() {
                let params = {
                    status: this.status
                }
                if(this.status === 'UNAPPROVED') {
                    if(!this.auditFailedReason) {
                        this.$alert('请填写不通过的原因', '提示！',{
                            confirmButtonText: '确定',
                            callback:()=>{}
                        })
                    }else{
                        params.auditFailedReason = this.auditFailedReason;
                        this.postData(params);
                    }
                }else{
                    this.postData(params);
                }
            },
            postData(params) {
                let auditRecord = {
                    jGoodsId: this.jGoodsId,
                    auditRecord: params
                }
                this.$http.post(this.$api.auditShopJGoods4Manager, auditRecord, true).then(res=>{
                    this.$message.success('审核成功')
                    this.$router.push({
                        path: '/thirdPrizeList'
                    })
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            }
        },
        filters: {
            formatCode(val) {
                if(val) {
                    return classMap.get(val)&&classMap.get(val).name? classMap.get(val).name: val;
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import './thirdPrizeListDetail.scss';
</style>
