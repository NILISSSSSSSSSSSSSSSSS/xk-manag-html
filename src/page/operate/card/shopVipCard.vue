<template>
    <div class="xk-container shop-vip-card">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="会员卡ID：">
                                    <el-input :size="$size" v-model="searchForm.memberCardId" placeholder="请输入优惠券ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="会员卡名称：">
                                    <el-input :size="$size" v-model="searchForm.name" placeholder="请输入优惠券名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="店铺名称：">
                                    <el-input :size="$size" v-model="searchForm.shopName" placeholder="请输入店铺名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效时间：">
                                    <el-date-picker type="datetime" :size="$size" v-model="searchForm.validTime"
                                        placeholder="请选择生效时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="结束时间：">
                                    <el-date-picker type="datetime" :size="$size" v-model="searchForm.invalidTime"
                                        placeholder="请选择结束时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效状态：">
                                    <el-select :size="$size" v-model="searchForm.cardConditionStatus">
                                        <el-option v-for="item in EnumCouponTypeList" :key="item.key" :value="item.key" :label="item.value">{{ item.value }}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="类型：">
                                    <el-select :size="$size" v-model="searchForm.memberType">
                                        <el-option v-for="item in EnumCardType" :key="item.key" :label="item.value"
                                            :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable">
                    <el-table-column label="会员卡ID" prop="id" width="220px"></el-table-column>
                    <el-table-column label="会员卡名称" prop="name" width="100px"></el-table-column>
                    <el-table-column label="所属店铺" prop="shopName" width="150px"></el-table-column>
                    <el-table-column label="类型" prop="cardType" :formatter="formatterType" width="120px"></el-table-column>
                    <el-table-column label="生效时间" width="200px">
                        <template slot-scope="scope">
                            {{ scope.row.validTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" width="200px">
                        <template slot-scope="scope">
                            {{ scope.row.invalidTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="总量" prop="totalNum" width="150px"></el-table-column>
                    <el-table-column label="已领" prop="num"></el-table-column>
                    <el-table-column label="状态" prop="newStatus" :formatter="formatterStatus"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="260px">
                        <template slot-scope="scope">
                            <el-button v-permission="'shopVipCardDetail'" :size="$size" type="primary" :loading="scope.row.loading" @click="viewDetail(scope.row.id, scope.row)">查看</el-button>
                            <el-button v-permission="'shopVipCardAbandon'" :size="$size" type="danger" :disabled="scope.row.newStatus==='STOP'" @click="cardMemberCardDelete(scope.row.id)">{{
                                scope.row.newStatus==='STOP'? '已作废': '作废'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>

        <!-- 会员卡信息 -->
        <vip-card-detail :visible.sync="cardVisible" :details="detailForm"></vip-card-detail>
    </div>
</template>

<script>
    import { EnumCouponTypeList } from '@/util/publicParams.js';
    import moment from 'moment';
    //枚举会员类型
    const EnumCardType = [{ key: "VIP", value: "VIP会员卡" }, { key: "GENERAL", value: "普通会员卡" }]
    import VipCardDetail from '@/components/operate/VipCardDetail.vue';
    import  { enumFormatter } from '@/util/publicMehotds.js';
    export default {
        components: {
            VipCardDetail
        },
        data() {
            return {
                EnumCardType,
                EnumCouponTypeList,
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                searchLoading: false,
                loadingTable: false,
                detailForm: {},
                dataDetailTable: [],
                dataDetailTableLoading: false,
                cardVisible: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            formatterStatus(row) {
                return enumFormatter(row.newStatus, EnumCouponTypeList);
            },
            formatterType(row) {
                return enumFormatter(row.cardType, EnumCardType);
            },
            search() {
                this.page.page = 1;
                this.getList()
            },
            clearInput() {
                this.searchForm = {};
                this.getList();
            },
            //获取会员卡列表
            getList() {
                let params = {
                    condition: this.searchForm,
                    page: this.page.page,
                    limit: this.page.limit
                }

                this.loadingTable = true;
                params = JSON.parse(JSON.stringify(params))
                params.condition.validTime ? params.condition.validTime = moment(params.condition.validTime).format('X'): ""
                params.condition.invalidTime ? params.condition.invalidTime = moment(params.condition.invalidTime).format('X') : ""
                this.$http.get(this.$api.shopMemberCardQPage, params, true).then(res => {
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.loadingTable = false
                })
                    .catch(err => {
                        this.loadingTable = false
                        this.$message.error(err.message)
                    })
            },
            //查看详情
            viewDetail(id, row) {
                this.$set(row, 'loading', true)
                this.$http.get(this.$api.shopMemberCardDetail, { id: id }, true)
                .then(res => {
                    this.detailForm = res;
                    this.$set(row, 'loading', false);
                    this.cardVisible = true;
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.$set(row, 'loading', false);
                })
            },
            //作废会员卡
            cardMemberCardDelete(id) {
                this.$confirm('确定作废该会员卡吗？', '提示', {
                    type: 'warning',
                    cancelButtonText: '取消',
                    confirmButtonText: '确定'
                }).then(res => {
                    this.$http.post(this.$api.shopMemberCardDelete, { id: id }, true).then(res => {
                        this.$message({
                            message: '作废成功',
                            type: 'success'
                        });
                        this.getList();
                    })
                        .catch(err => {
                            this.$message.error(err.message)
                        })
                })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: "取消操作"
                        })
                    })
            }
        }
    }
</script>
<style scoped lang="scss">
    @import './shopVipCard.scss';
</style>