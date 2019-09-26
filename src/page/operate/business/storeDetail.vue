<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>店铺详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div class="pubpadd" v-if='Object.keys(detail).length>0'>
                <el-card class="box-card">
                    <div class="paddBoth infoSize">
                        <el-row :gutter="20">
                            <el-col :span='2'>店铺编号:</el-col>
                            <el-col :span='10'>{{detail.code||"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>上级店铺:</el-col>
                            <el-col :span='10'>{{all.masterName||"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>在架状态:</el-col>
                            <el-col :span='10'>{{detail.status=='active'?"正常":detail.status=='disable'?"下架":"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>审核状态:</el-col>
                            <el-col :span='10'>{{authStatus(detail.secondAuthStatus)}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>财务是否独立:</el-col>
                            <el-col :span='10'>{{all.isSelf?(all.isSelf?"不独立":"独立"):"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>店铺分类:</el-col>
                            <el-col :span='10'>
                                <el-tag class='tag' v-for='(item,index) in detail.industry' :key='index'>{{item.levelOneName}}
                                    -
                                    {{item.levelTwoName}}
                                </el-tag>
                                <!-- <el-tag class='tag' v-for='(item,index) in detail.industry' :key='index'>{{oneFilter(item.levelOneCode)}}
                                    -
                                    {{twoFilter(item.levelTwoCode)}}
                                </el-tag> -->
                            </el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>店铺名称:</el-col>
                            <el-col :span='10'>{{detail.name||"暂无"}}</el-col>
                        </el-row>
                        <!-- <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>管理员手机号:</el-col>
                            <el-col :span='10'>{{detail.adminPhone||"暂无"}}</el-col>
                        </el-row> -->
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>店铺地址:</el-col>
                            <el-col :span='10'>{{detail.address||"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>联系电话:</el-col>
                            <el-col :span='10'>{{detail.contactPhones?(detail.contactPhones[0]||detail.contactPhones||"暂无"):"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>营业时间:</el-col>
                            <el-col :span='10'>
                                <div v-if="!detail.newBusinessTime">暂无营业时间</div>
                                <div v-else>{{detail.newBusinessTime.startAt}} - {{detail.newBusinessTime.endAt}}</div>
                            </el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>人均消费:</el-col>
                            <el-col :span='10'>{{money(detail.avgConsumption)||"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>当前是否接单:</el-col>
                            <el-col :span='10'>{{detail.isBusiness?"是":"否"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>店铺介绍:</el-col>
                            <el-col :span='10'>{{detail.description||"暂无"}}</el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20" v-if='detail.logo'>
                            <el-col :span='2'>店铺logo:</el-col>
                            <el-col :span='10'>
                                <img class='small-img' :src="detail.logo" @click='$viewImage(detail.logo)' alt="">
                            </el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20" v-if='detail.pictures&&detail.pictures.length>0'>
                            <el-col :span='2'>图片:</el-col>
                            <el-col :span='10'>
                                <img class='small-img' :src="item" v-for="(item,index) in detail.pictures" :key='index' @click='$viewImage(item)' alt="">
                            </el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20" v-if='detail.qualifiedPictures&&detail.qualifiedPictures.length>0'>
                            <el-col :span='2'>相关资质:</el-col>
                            <el-col :span='10'>
                                <img class='small-img' :src="item" v-for="(item,index) in detail.qualifiedPictures" :key='index' @click='$viewImage(item)'
                                    alt="">
                            </el-col>
                        </el-row>
                        <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>店铺抽成比例:</el-col>
                            <el-col :span='10'>{{all.commission?all.commission+"%":"暂无"}}</el-col>
                        </el-row>
                        <!-- <el-row class="margintop20" :gutter="20">
                            <el-col :span='2'>店铺详情:</el-col>
                            <el-col :span='10'>暂无</el-col>
                        </el-row> -->
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            detail: {},
            all: {},
            week: null,
            one: null,
            two: null
        };
    },
    created() {
        // this.getList().then(res => {
        //     console.log('TCL: created -> res', res);
        //     this.one = res.oneLevel;
        //     this.two = res.twoLevel;
        // });
        this.getDetail();
    },
    methods: {
        authStatus(status) {
            switch (status) {
                case 'SUBMIT':
                    return '提交认证';
                    break;
                case 'SUCCESS':
                    return '认证成功';
                    break;
                case 'FAILED':
                    return '认证失败';
                    break;
                default:
                    return '暂无';
                    break;
            }
        },
        oneFilter(code) {
            if (!this.one) return;
            for (let item of this.one) {
                if (item.code == code) {
                    return item.name;
                }
            }
        },
        twoFilter(code) {
            if (!this.two) return;
            for (let item of this.two) {
                if (item.code == code) {
                    return item.name;
                }
            }
        },
        weekFilter(day) {
            switch (day) {
                case 'mon':
                    return '周一';
                    break;
                case 'tue':
                    return '周二';
                    break;
                case 'wed':
                    return '周三';
                    break;
                case 'thur':
                    return '周四';
                    break;
                case 'fri':
                    return '周五';
                    break;
                case 'sat':
                    return '周六';
                    break;
                case 'sun':
                    return '周日';
                    break;

                default:
                    break;
            }
        },
        getList() {
            return this.$http.get(this.$api.industryAllQList, {}, true);
        },
        getDetail() {
            let id = this.$route.query.id;
            if (!id) {
                this.$router.go(-1);
                return;
            }
            this.$http
                .get(this.$api.mShopDetail, { id }, true)
                .then(res => {
                    console.log('TCL: getDetail -> res', res);
                    this.detail = res.detail;
                    this.all = res;
                    this.week = this.detail.businessTime;
                })
                .catch(err => {
                    console.log('TCL: getDetail -> err', err);
                });
        },
        money(money) {
            if (typeof money != 'number') return '暂无';
            return (money / 100).toFixed(2);
        }
    }
};
</script>
<style lang="scss" scoped>
.infoSize {
    font-size: 14px;
}
.small-img {
    width: 100px;
    display: inline-block;
    margin-left: 10px;
}
.tag {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>

