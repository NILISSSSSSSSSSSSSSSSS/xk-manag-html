<template>
    <div class="vip-card-detail">
        <el-dialog 
                title="会员卡详情" 
                :visible.sync="visible" 
                width="800px" 
                :before-close="hideDialog"
                class="detail-dialog">
            <el-row>
                <el-col :span="3">会员卡名称：</el-col>
                <el-col :span="21">{{ details.name }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">类<span style="visibility: hidden">占位符</span>型：</el-col>
                <el-col :span="21">{{ details.memberType | formatMemberType }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">优<span style="visibility: hidden">占位符</span>惠：</el-col>
                <el-col :span="21">{{ details.discount/100 }} 折</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">总<span style="visibility: hidden">占位符</span>量：</el-col>
                <el-col :span="21">{{ details.totalNum=='-1'? '不限': details.totalNum }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">状<span style="visibility: hidden">占位符</span>态：</el-col>
                <el-col :span="21">{{ details.newStatus | formatNewStatus }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">生 效 时 间：</el-col>
                <el-col :span="21">{{ details.validTime | formatTime }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">结 束 时 间：</el-col>
                <el-col :span="21">{{ details.invalidTime | formatTime }}</el-col>
            </el-row>
            <el-row v-if="details.shopName">
                <el-col :span="3">所 属 店 铺：</el-col>
                <el-col :span="21">{{ details.shopName }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">领  卡 用 户：</el-col>
                <el-col :span="21">
                    <el-table :data="dataDetailTable" v-loading="dataDetailTableLoading" max-height="300">
                        <el-table-column label="用户ID" prop="userId" show-overflow-tooltip></el-table-column>
                        <el-table-column label="用户名称" prop="userName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="领卡日期">
                            <template slot-scope="scope">
                                {{ scope.row.createdAt | formatTime }}
                            </template>
                        </el-table-column>
                        <el-table-column label="下单次数" prop="usedNum"></el-table-column>
                    </el-table>
                    <!--分页组件-->
                    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="hideDialog()">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { enumFormatter } from '@/util/publicMehotds.js';
    import { EnumCouponTypeList,EnumcardType } from '@/util/publicParams.js';
    export default {
        props: {
            details: {
                type: Object,
                default: ()=>({})
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dataDetailTableLoading: false,
                dialogDetailVisible: false,
                dataDetailTable:[],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }
            }
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getCardList();
            },
            hideDialog() {
                this.$emit('update:visible', false);
            },
            //获取领卡用户详情
            getCardDetail() {
                let params = {
                    memberId: this.details.id
                }
                this.dataDetailTableLoading = true;
                this.$http.get(this.$api.shopOBMQPageMember, params, true).then(res=> {
                    this.dataDetailTable = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.dataDetailTableLoading = false;
                })
                .catch(err=> {
                    this.$message.error(err.message);
                    this.dataDetailTableLoading = false;
                })
            }
        },
        watch: {
            visible(val) {
                val? this.getCardDetail(): null;
            }
        },
        filters: {
            formatMemberType(val) {
                if(val) {
                    return enumFormatter(val, EnumcardType, {value: 'label'})
                }
            },
            formatNewStatus(val) {
                if(val) {
                    return enumFormatter(val, EnumCouponTypeList)
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .detail-dialog {
        /deep/ .el-row{
            margin-bottom: 15px;
            .el-table th{
                padding: 5px 0
            }
        }
    }
</style>
