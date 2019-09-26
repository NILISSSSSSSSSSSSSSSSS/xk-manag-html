<template>
    <div class="xk-container third-prize-list">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="searchLoading" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="150px" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input :size="$size" placeholder="请输入商品编号" v-model="searchForm.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input :size="$size" placeholder="请输入商品名称" v-model="searchForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品状态：">
                            <el-select :size="$size" v-model="searchForm.status">
                                <el-option label="全部" value="''"></el-option>
                                <el-option v-for="(item, index) in EnumGoodsStatus" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核日期：">
                            <el-date-picker
                                :size="$size"
                                v-model="searchForm.rangeTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
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
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="tableLoading">
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        福利抽奖
                    </template>
                </el-table-column>
                <el-table-column label="商品ID" prop="id"></el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="联盟商ID">
                    <template slot-scope="scope">
                        {{ scope.row.merchant? scope.row.merchant.id: 0 }}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商名称">
                    <template slot-scope="scope">
                        {{ scope.row.merchant? scope.row.merchant.realName: '~' }}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商电话">
                    <template slot-scope="scope">
                        {{ scope.row.merchant? scope.row.merchant.phone: '~' }}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商类型">
                    <template slot-scope="scope">
                        <p v-if="scope.row.merchant && scope.row.merchant.merchantTypes">
                            <span v-for="(item, index) in scope.row.merchant.merchantTypes" :key="index">
                                {{ item |  formatMerchantType}}<template v-if="scope.row.merchant.merchantTypes.length-1 != index">，</template>
                            </span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="商品状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditRecord && scope.row.auditRecord.status!=='VERIFIED'">
                            {{ scope.row.auditRecord.status==='UNAUDITED'? '未审核': '未通过' }}
                        </span>
                        <span v-else>
                            <template v-if="scope.row.jSequence && scope.row.jSequence.isPaused">
                                下架中
                            </template>
                            <template v-else>
                                {{ scope.row.goodsStatus==='DOWN'? '下架': '上架' }}
                            </template>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="审核时间" width="150px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditRecord && scope.row.auditRecord.status !=='UNAUDITED'">
                            {{ scope.row.auditRecord.auditDate | formatTime }}
                        </span>
                        <span v-else>~</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核管理员">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditRecord && scope.row.auditRecord.status !=='UNAUDITED'">
                            {{ scope.row.auditRecord.auditorName }}
                        </span>
                        <span v-else>~</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="180px" align="right">
                    <template slot-scope="scope">
                        <el-button v-permission="'thirdPrizeListVerify'" :size="$size" type="primary" v-if="scope.row.auditRecord && scope.row.auditRecord.status ==='UNAUDITED'" @click="examine(scope.row)">审核</el-button>
                        <el-button v-permission="'thirdPrizeListDown'" :size="$size" type="danger" v-if="scope.row.auditRecord && scope.row.auditRecord.status ==='VERIFIED' && scope.row.goodsStatus ==='UP' && scope.row.jSequence && scope.row.jSequence.isPaused !=1" @click="downGoods(scope.row)">下架</el-button>
                        <el-button v-permission="'thirdPrizeListDetail'" :size="$size" type="success" @click="viewDetail(scope.row.id, scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 商品下架 -->
        <el-dialog title="是否下架该商品" :visible.sync="goodsDialog" width="400px" class="goods-dialog">
            <el-row>
                商品名称：{{ downDetail.name }}
            </el-row>
            <el-row>
                规格设置：{{ downDetail.specInfo }}
            </el-row>
            <el-row>
                价格设置：{{ downDetail.originalValue ? $math.divide(downDetail.originalValue, 100).toFixed(2): 0 }} 元
            </el-row>
            <el-row>
                是否审核：{{ downDetail.status==='UNAPPROVED'? '未通过': downDetail.status==='VERIFIED'?  '已通过': '未审核'}}
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="goodsDialog=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="goodsDown">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { EnumMerchantType } from '@/util/publicParams.js';
    import { mapMutations, mapState } from 'vuex';
    import {enumFormatter} from '@/util/publicMehotds.js';
    import moment from 'moment'
    //定义商品状态枚举
    const EnumGoodsStatus = [{key: 'UNAUDITED', value: '未审核'},{key: 'UNAPPROVED', value: '未通过'},{key: 'UP', value: '上架'},{key: 'DOWN', value: '下架'}]
    export default {
        data() {
            return {
                EnumGoodsStatus,
                searchForm: {},
                tableData: [],
                tableLoading: false,
                goodsDialog: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                downDetail: {},
                searchLoading: false
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfarePrize.searchThirdCondition
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
                setSearchThirdCondition: "welfarePrize/setSearchThirdCondition"
            }),
            changePage(page, limit) {
                this.page.page = page;
                this.page.limit = limit;
                this.getList()
            },
            goodsDown() {
                this.$http.get(this.$api.jSequencePauseNext, {id: this.downDetail.id}, true).then(res=>{
                    this.$message.success('下架成功');
                    this.goodsDialog = false;
                    this.getList();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            getList() {
                let params = {
                    condition: {
                        // usage: this.searchForm.usage,
                        id: this.searchForm.id,
                        name: this.searchForm.name
                    },
                    page: this.page.page,
                    limit: this.page.limit,
                    
                }
                if(this.searchForm.rangeTime) {
                    params.condition.auditDate = {
                        start: moment(this.searchForm.rangeTime[0]).format("X"),
                        end: moment(this.searchForm.rangeTime[1]).format("X")
                    }
                }
                this.searchForm.status=='UP'|| this.searchForm.status=='DOWN'
                    ? (params.condition.auditStatus = 'VERIFIED',params.condition.goodsStatus = this.searchForm.status)
                    : params.condition.auditStatus=this.searchForm.status;
                this.tableLoading = true;
                this.$http.get(this.$api.shopJGoodsQPage4Manager, params, true).then(res=>{
                    console.log(res)
                    this.setSearchThirdCondition(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.searchLoading = false;
                    this.tableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.searchLoading = false;
                    this.tableLoading = false;
                })
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                this.setSearchThirdCondition(null);
                this.searchForm = {};
                this.page = {
                    page: 1,
                    limit: 10
                };
                this.getList();
            },
            //查看详情
            viewDetail(id, row) {
                let params = {
                    id: id
                }
                this.$router.push({
                    path: '/thirdPrizeListDetail',
                    query: params
                })
            },
            //审核
            examine(row) {
                this.$router.push({
                    path: '/thirdPrizeListDetail',
                    query: {
                        id: row.id,
                        type: 'examine'
                    }
                })
            },
            downGoods(row) {
                this.downDetail = Object.assign(this.downDetail, {
                    id: row.id, 
                    specInfo: row.realAttr.specInfo, 
                    name: row.name,
                    originalValue: row.realAttr.originalValue,
                    status: row.auditRecord.status
                })
                this.goodsDialog = true;
            }
        },
        filters: {
            formatMerchantType(val) {
                return enumFormatter(val, EnumMerchantType);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './thirdPrizeList.scss'
</style>
