<template>
    <div class="platform-red-package-detail xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.orderNo" :size="$size" placeholder="请输入流水账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="红包类型：">
                            <el-select v-model="searchForm.packetsType" :size="$size" placeholder="请选择红包类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in EnumPacketsType" :label="item.value" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发出时间：">
                            <el-date-picker v-model="searchForm.rangeTime" :size="$size" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="流水号" prop="orderNo" show-overflow-tooltip></el-table-column>
                <el-table-column label="发出时间" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="发放场景" :formatter="formatScene" width="100"></el-table-column>
                <el-table-column label="发放类型">
                    <template slot-scope="scope">
                        {{ scope.row.isSingle == 1 ? '一对一': '一对多' }}
                    </template>
                </el-table-column>
                <el-table-column label="红包类型" :formatter="formatPackets" width="100" prop="packetsType"></el-table-column>
                <el-table-column label="红包内容" prop="content" show-overflow-tooltip></el-table-column>
                <el-table-column label="发红包用户类型">
                    <template slot-scope="scope">
                        {{ scope.row.isAnchor==0? '普通用户': '主播' }}
                    </template>
                </el-table-column>
                <el-table-column label="红包个数" prop="num"></el-table-column>
                <el-table-column label="领取个数" prop="grabNum"></el-table-column>
                <el-table-column label="红包状态" :formatter="formatStatus"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'platformRedpackageDetailInfo'" :size="$size" type="text" @click="openDetail(scope.row.orderNo, scope.row.redPacketsType)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import { enumFormatter } from '@/util/publicMehotds.js';
    const EnumPacketsType = [{key: 'xkb', value: '晓可币'},{key: 'gift', value: '礼物'},{key: 'cardCoupon', value: '卡券'}];
    const EnumStatus = [{key: 'doing', value: '待领取'},{key: 'expire', value: '已退回'},{key: 'over', value: '已领取'}];
    const EnumScene = [{key: 'live_video', value: '直播'},{key: 'video', value: '小视频'},{key: 'friends_cycle', value: '朋友圈'},{key: 'im_group', value: '群聊'},{key: 'im_single', value: '单聊'},{key: 'im_single_secret', value: '密聊'}];
    export default {
        data() {
            return {
                EnumPacketsType,
                labelWidth: '150px',
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                loadingSearch: false,
                loadingTable: false,
                searchForm: {}
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialOther.redPacket
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setRedPacket: "financialOther/setRedPacket"
            }),
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            getList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    beginTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[0]).format('X'): '',
                    endTime: this.searchForm.rangeTime? moment(this.searchForm.rangeTime[1]).format('X'): '',
                    orderNo: this.searchForm.orderNo,
                    packetsType: this.searchForm.packetsType,
                    givingUserId: this.searchForm.givingUserId,
                    givingMerchantId: this.searchForm.givingMerchantId
                }
                this.loadingTable = true;
                this.$http.get(this.$api.redPacketsQPage, params, true).then(res=>{
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.setRedPacket(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                })
                .catch(err=>{
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = [];
                    this.page.total=0;
                    this.$message.error('查询失败');
                })
            },
            searchList() {
                this.page.page = 1;
                this.loadingSearch = true;
                this.getList();
            },
            clearCondition() {
                this.page.page = 1;
                this.searchForm = {};
                this.setRedPacket(null);
                this.getList();
            },
            formatScene(row) {
                return enumFormatter(row.scene, EnumScene);
            },
            formatStatus(row) {
                return enumFormatter(row.status, EnumStatus);
            },
            formatPackets(row) {
                return enumFormatter(row.redPacketsType, EnumPacketsType);
            },
            openDetail(id, type) {
                this.$router.push({
                    path: '/orderRedDetail',
                    query: {
                        id: id
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-red-package-detail {
        
    }
</style>
