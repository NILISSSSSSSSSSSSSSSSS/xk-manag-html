<template>
    <el-dialog 
            :visible.sync="visible" 
            :before-close="close"
            title="优惠券详情" 
            width="1000px" 
            top="50px" 
            class="detail-dialog">
        <el-row>
                <el-col :span="3">优惠券ID：</el-col>
                <el-col :span="21">{{ detailForm.id }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">优惠券名称：</el-col>
                <el-col :span="21">{{ detailForm.name }}</el-col>
            </el-row>
            <!-- 商圈店铺详情特有 -->
            <el-row v-if="trade">
                <el-col :span="3">所属店铺：</el-col>
                <el-col :span="21">{{ detailForm.storeName }}</el-col>
            </el-row>

            <el-row>
                <el-col :span="3">类型：</el-col>
                <el-col :span="21">{{ detailForm.couponType | formatterEnumTicket }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">范围：</el-col>
                <el-col :span="21">{{ detailForm.scope | formatterEnumScope }}</el-col>
            </el-row>
            <el-row v-if="detailForm.couponType === 'FULL_SUB'">
                <el-col :span="3">满减：</el-col>
                <el-col :span="21">满 {{ detailForm.fulMoney? $math.divide(detailForm.fulMoney, 100): 0 }} 减{{ detailForm.subMoney? $math.divide(detailForm.subMoney, 100): 0 }}</el-col>
            </el-row>
            <el-row v-else-if="detailForm.couponType==='DEDUCTION'">
                <el-col :span="3">抵扣：</el-col>
                <el-col :span="21">{{ $math.divide(detailForm.subMoney, 100) }} 元</el-col>
            </el-row>
            <el-row v-else>
                <el-col :span="3">折扣：</el-col>
                <el-col :span="21">{{ $math.divide(detailForm.discount, 100) }} 折</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">状态：</el-col>
                <el-col :span="21">{{ detailForm.newStatus | formatterEnumType }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">总量：</el-col>
                <el-col :span="21">{{ detailForm.totalNum }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">已领取：</el-col>
                <el-col :span="21">{{ detailForm.num }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">每用户限领：</el-col>
                <el-col :span="21">{{ detailForm.limitNum }}</el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="3">获取方式：</el-col>
                <el-col :span="21">{{ detailForm.totalNum }}</el-col>
            </el-row> -->
            <el-row>
                <el-col :span="3">生 效 时 间：</el-col>
                <el-col :span="21">{{ detailForm.validTime | formatTime }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="3">结 束 时 间：</el-col>
                <el-col :span="21">{{ detailForm.invalidTime | formatTime }}</el-col>
            </el-row>
            <!-- 可用品类商圈2种 -->
            <el-row v-if="detailForm.scope === 'CATEGORY' && detailForm.scope !== 'ALL' && !trade">
                <el-col :span="3">可用品类：</el-col>
                <el-col :span="21">
                    <el-table :data="detailForm.codes" max-height="305" border>
                        <el-table-column label="优惠券ID" prop="couponId" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="优惠券名称" prop="couponName" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="一级分类">
                            <template slot-scope="scope">
                                {{ scope.row?scope.row.category.cc_fri:"无" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="二级分类">
                            <template slot-scope="scope">
                                {{ scope.row?scope.row.category.cc_sec:"无" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="三级分类">
                            <template slot-scope="scope">
                                {{ scope.row?scope.row.category.cc_thr:"无" }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!-- 可用品类商圈2种 -->
            <el-row v-if="detailForm.scope === 'CATEGORY' && detailForm.scope !== 'ALL' && trade">
                <el-col :span="3">可用品类：</el-col>
                <el-col :span="21">
                    <el-table :data="detailForm.codes" max-height="305" border>
                        <el-table-column label="优惠券ID" prop="code2" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="优惠券名称" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ detailForm.name }}
                            </template>
                        </el-table-column>
                        <el-table-column label="一级分类">
                            <template slot-scope="scope">
                                {{ scope.row?scope.row.name1:"无" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="二级分类">
                            <template slot-scope="scope">
                                {{ scope.row?scope.row.name2:"无" }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row v-if="detailForm.scope === 'GOODS' && detailForm.scope !== 'ALL'">
                <el-col :span="3">可用单品：</el-col>
                <el-col :span="21">
                    <el-table :data="detailForm.goods" max-height="305" border>
                        <el-table-column label="优惠券ID" :show-overflow-tooltip="true" prop="couponId"></el-table-column>
                        <el-table-column label="优惠券名称" prop="couponName"></el-table-column>
                        <el-table-column label="一级分类">
                            <template slot-scope="scope">
                                {{ scope.row.Categories.cc_fri }}
                            </template>
                        </el-table-column>
                        <el-table-column label="二级分类">
                            <template slot-scope="scope">
                                {{ scope.row.Categories.cc_sec }}
                            </template>
                        </el-table-column>
                        <el-table-column label="三级分类" v-if="!trade">
                            <template slot-scope="scope">
                                {{ scope.row.Categories.cc_thr }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商品ID" prop="sGoodsId" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="商品名称" prop="sGoodsName" :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">领券用户：</el-col>
                <el-col :span="21">
                    <el-table :data="dataDetailTable" v-loading="tableLoading" max-height="305" border>
                        <el-table-column label="用户ID" prop="userId"></el-table-column>
                        <el-table-column label="用户名称" prop="userName"></el-table-column>
                        <el-table-column label="领券日期">
                            <template slot-scope="scope">
                                {{ scope.row.createdAt | formatTime }}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否使用" :formatter="formatterStatus"></el-table-column>
                    </el-table>
                    <!--分页组件-->
                    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="close">返回</el-button>
            </div>
    </el-dialog>
</template>

<script>
    import { enumFormatter } from '@/util/publicMehotds.js'
    //枚举品类范围
    const EnumScope = [{key: "ALL", value:"全场"},{key: "GOODS", value:"单品"},{key: "CATEGORY", value:"品类"}]
    //枚举生效状态
    const EnumType = [{key: "All", value:"全部"},{key: "VALIDING", value:"生效中"},{key: "WAIT_VALID", value:"等待生效"},{key: "OVERDUE", value:"已过期"},{key: "STOP", value:"停发"}]
    //枚举优惠券类型
    const EnumTicket = [{key: "All", value:"全部"}, {key: "DISCOUNT", value:"打折券"}, {key: "DEDUCTION", value: "抵扣券"}, {key: "FULL_SUB", value: "满减券"}]
    //优惠券使用状态
    const EnumCouponStatus = [{key: "UNUSED", value: '未使用'},{key: "INUSE", value: '使用中'},{key: "USED_BUY_GOODS", value: '购买商品已使用'},{key: "USED_SEND_RED_PACKET", value: '发送红包已使用'},{key: "USED_USER_GIVE", value: '用户赠送已使用'}]

    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            detailForm: {
                type: Object,
                default: ()=>({})
            },
            trade : {
                type: Boolean,
                default: false   //true是商圈，false是自营
            }
        },
        data() {
            return {
                dataDetailTable: [],
                tableLoading: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }
            }
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getUser();
            },
            //获取领券用户
            getUser() {
                this.tableLoading = true;
                this.$http.get(this.$api.shopOBMQPageCoupon, {couponId: this.detailForm.id, limit: this.page.limit, page: this.page.page}, true).then(res=>{
                    console.log(res)
                    this.dataDetailTable = res.data;
                    this.page.total = res.total;
                    this.tableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                })
            },
            formatterStatus(row) {
                return enumFormatter(row.couponStatus, EnumCouponStatus);
            },
            close() {
                this.$emit('update:visible', false)
            }
        },
        watch: {
            "detailForm.id": {
                handler(val, oldVal) {
                    this.getUser();
                },
                deep: true
            }
        },
        filters: {
            formatterEnumTicket(val) {
                return enumFormatter(val, EnumTicket);
            },
            formatterEnumType(val) {
                return enumFormatter(val, EnumType)
            },
            formatterEnumScope(val) {
                return enumFormatter(val, EnumScope)
            }
        }
    }
</script>
<style scoped lang="scss">
    .detail-dialog {
        /deep/ .el-table th {
            padding: 0;
        }
    }
</style>