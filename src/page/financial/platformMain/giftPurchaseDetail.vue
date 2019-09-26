<template>
    <div class="gift-purchase-detail xk-container">
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
                        <el-form-item label="订单号：">
                            <el-input v-model="searchForm.giftId" :size="$size" placeholder="请输入订单"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="礼物：">
                            <el-select v-model="searchForm.type" :size="$size" @change="changeType">
                                <el-option v-for="item in giftType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                            </el-select>
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
                <el-table-column label="ID" prop="giftId"></el-table-column>
                <el-table-column label="礼物名称" prop="giftName"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.giftSize == 1 ? "大" : scope.row.giftSize == 2 ? '中' : '小'}}
                    </template>
                </el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">
                        {{ $math.divide(scope.row.giftPrice, 100) }}
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="giftNum"></el-table-column>
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="收方ID" prop="receivingUserId"></el-table-column>
                <el-table-column label="收方用户类型">
                     <template slot-scope="scope">
                        {{scope.row.isAnchor == 1 ? '主播' : '普通用户'}}
                    </template>
                </el-table-column>
                <el-table-column label="收方昵称" prop="userName"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button v-permission="'giftPurchaseDetailInfo'" :size="$size" type="text" @click="getDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    import ProvinceCascader from '@/components/ProvinceCascader.vue';
    import { mapMutations, mapState } from 'vuex';
    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                labelWidth: '150px',
                tableData: [],
                loadingSearch: false,
                loadingTable: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {type: 'redPackage'},
                giftType: [
                    {key: 'redPackage', label: '红包'},
                    {key: 'gift', label: '礼物'}
                ]
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.financialMain.giftPurchase
            })
        },
        created() {
            this.searchData
                ? (this.searchForm = this.searchData.searchForm, this.page = this.searchData.page)
                : null;
            this.getList();
        },
        methods: {
            ...mapMutations({
                setGiftPurchase: "financialMain/setGiftPurchase"
            }),
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            changeType() {
                this.getList();
            },
            searchList() {
                this.page.page = 1;
                this.loadingSearch = true;
                this.getList();
            },
            clearCondition() {
                [this.page.page, this.page.limit, this.searchForm] = [1,10,{type: 'redPackage'}];
                this.getList();
            },
            getList() {
                let params = {
                    giftId: this.searchForm.giftId,
                    limit: this.page.limit,
                    page: this.page.page,
                    type: this.searchForm.type,
                    id: this.searchForm.id
                }
                this.loadingTable = true;
                this.$http.get(this.$api.userAccGiftQPage, params, true).then(res=>{
                    this.setGiftPurchase(Object.assign({searchForm: this.searchForm}, {page: this.page}));
                    this.tableData = res?res.data: [];
                    this.page.total = res?res.total: 0;
                    this.loadingSearch = false;
                    this.loadingTable = false;
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                    this.$message.error('查询失败');
                })
            },
            getDetail(row) {
                if(this.searchForm.type==='redPackage') {
                    this.$router.push({
                        path: '/orderRedDetail',
                        query: {
                            id: row.orderNo
                            // tradeProduct: this.searchForm.type,
                            // source: 'giftList'
                        }
                    })
                }else{
                    this.$router.push({
                        path: '/userGiftDetail',
                        query: {
                            orderNo: row.orderNo,
                            tradeProduct: this.searchForm.type,
                            source: 'giftList',
                            isAnchor: row.isAnchor
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .gift-purchase-detail {
        
    }
</style>
