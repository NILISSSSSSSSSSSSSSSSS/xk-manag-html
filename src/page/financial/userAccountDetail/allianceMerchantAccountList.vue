<template>
    <div class = 'alliance-merchant-account-list xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    联盟商账户明细
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="laodingSearch" @click="search()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clear()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form class="xk-search" label-width="120px" :model="searchData">
                    <el-row>
                        <!-- <el-col :span="8">
                            <el-form-item label="银行卡类型：">
                                <el-select v-model="searchData.cardType" placeholder="请选择" :size="$size">
                                    <el-option value="" label="全部"></el-option>
                                    <el-option v-for="item in cardType" :key="item.key" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item label="联盟商ID：">
                                <el-input v-model="searchData.queryMerchantId" :size="$size" placeholder="请输入联盟商ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联盟商姓名：">
                                <el-input v-model="searchData.name" :size="$size" placeholder="请输入联盟商姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联盟商类型：">
                                <el-select v-model="searchData.merchantType" placeholder="请选择" :size="$size">
                                    <el-option value="" label="全部"></el-option>
                                    <el-option v-for="item in MerchantTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联盟商状态：">
                                <el-select v-model="searchData.bizStatus" placeholder="请选择" :size="$size">
                                    <el-option value="" label="全部"></el-option>
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="xk-body xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    列表
                </div>
                <div class="vus-btn">
                        <!-- <el-button type="success" :size="$size">导出到Excel</el-button> -->
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                v-loading="loadingTable"
                style="width: 100%">
                <el-table-column
                    prop="merchantId"
                    label="联盟商ID">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联盟商账号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    show-overflow-tooltip
                    label="联系人姓名">
                </el-table-column>
                <el-table-column
                    label="现金">
                    <template slot-scope="scope">
                        {{ scope.row.xkq }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="晓可币">
                    <template slot-scope="scope">
                        {{ scope.row.xkb }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="消费券">
                    <template slot-scope="scope">
                        {{ scope.row.xfq }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="实物券">
                    <template slot-scope="scope">
                        {{ scope.row.swq }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="钻石">
                    <template slot-scope="scope">
                        {{ scope.row.zs }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="联盟商类型">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.merchantTypes" :key="item">
                            {{ item | formatType }}<template v-if="index!= scope.row.merchantTypes.length-1">，</template>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="150"
                    label="商户首次入驻时间">
                    <template slot-scope="scope">
                        {{ scope.row.date | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="账号状态">
                    <template slot-scope="scope">
                        {{ scope.row.bizStatus=='enable'? '激活': scope.row.bizStatus=='disable'? '禁用': scope.row.bizStatus }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed="right"
                    width="200">
                    <template slot-scope="scope">
                        <el-button v-permission="'allianceMerchantAccountListUser'" type="text" :size="$size" @click="getDetail(scope.row)">查看联盟商详情</el-button>
                        <el-button v-permission="'allianceMerchantAccountListInfo'" type="text" @click="fnLookAccount(scope.row)" :size="$size">查看账户明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "page.page" :pageSize= "page.limit" :total = "page.total" @change = "changePage"></Pagination>
        </div>
    </div>
</template>
<script>
    import { MerchantTypes } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import { mapMutations, mapState } from 'vuex';
    export default {
        name:'allianceMerchantAccountDetail',
        data () {
            return {
                MerchantTypes,
                laodingSearch: false,
                loadingTable: false,
                searchData:{},
                tableData:[],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                options: [
                    {
                        value: 'disable',
                        label: '冻结'
                    }, {
                        value: 'enable',
                        label: '激活'
                    }
                ]
            };
        },
        props: {},
        components: {},
        computed: {
            ...mapState({
                searchStateData: state => state.financialAccount.merchantAccount
            })
        },
        created() {
            this.searchStateData
                ? (this.searchData = this.searchStateData.searchForm, this.page = this.searchStateData.page)
                : null;
            this.getList();
        },
        mounted() {},
        methods: {
            ...mapMutations({
                setMerchantAccount: "financialAccount/setMerchantAccount"
            }),
            changePage(page, limit) {
                [this.page.page, this.page.limit] = [page, limit];
                this.getList();
            },
            fnLookAccount(target){
                this.$router.push({
                    path: '/allianceMerchantAccountDetail',
                    query: {
                        merchantId: target.merchantId,
                        isAnchor: target.isAnchor,
                        userId: target.userId
                    }
                })
            },
            getList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    queryMerchantId: this.searchData.queryMerchantId,
                    name: this.searchData.name,
                    merchantType: this.searchData.merchantType,
                    bizStatus: this.searchData.bizStatus
                };
                this.loadingTable = true;
                this.$http.get(this.$api.merchantAccountList, params, true).then(res=>{
                    this.setMerchantAccount(Object.assign({searchForm: this.searchData}, {page: this.page}));
                    this.laodingSearch = false;
                    this.loadingTable = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    console.log(res)
                })
                .catch(err=>{
                    [this.loadingTable, this.laodingSearch, this.tableData, this.page.total] = [false, false, [], 0];
                   this.$message.error('查询失败');
                })
            },
            getDetail(row) {
                this.$router.push({
                    path: '/businessDetail',
                    query: {
                        id: row.merchantId
                    }
                })
            },
            search() {
                this.page.page = 1;
                this.laodingSearch = true;
                this.getList();
            },
            clear() {
                [this.page.page, this.page.limit, this.searchData] =[1,10,{}];
                this.getList();
            }
        },
        filters: {
            formatType(val) {
                return enumFormatter(val, MerchantTypes, {key: 'key', value: 'label'})
            }
        }
    }
</script>
<style scoped lang="scss">
    .alliance-merchant-account-list{
        margin-left: 0
    }
</style>