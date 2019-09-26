<template>
    <div class="xk-container">
        <div class="selfmall-manager-closelist">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                        <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-tabs v-model="activeName" @tab-click="tabClick">
                    <el-tab-pane label="普通商品" name="GOODS"></el-tab-pane>
                    <el-tab-pane label="大宗商品" name="BIG_GOODS"></el-tab-pane>
                </el-tabs>
                <el-form :label-width="labelWidth" class="xk-search"  @keyup.enter.native="search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="订单ID：">
                                <el-input v-model.trim="searchForm.orderId" placeholder="请输入订单ID" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户手机号：">
                                <el-input v-model.trim="searchForm.phone" placeholder="请输入用户手机号" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="商品ID：">
                                <el-input v-model.trim="searchForm.sGoodsId" placeholder="请输入商品ID" :size="$size"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item label="用户类型：">
                                <el-select v-model="searchForm.userType" placeholder="全部分类" :size="$size">
                                    <el-option v-for="item in EnumUserType" :key="item.value" :label="item.value" :value="item.key">{{ item.value }}</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="年度：">
                                <el-select v-model="searchForm.years" placeholder="请选择年度" :size="$size">
                                    <el-option v-for="item in EnumYear" :key="item.key" :label="item.key" :value="item.value">{{ item.key }}</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="下单日期：">
                                <el-date-picker
                                    v-model="searchForm.timeRange"
                                    type="datetimerange"
                                    range-separator="~"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :size="$size"
                                    align="right">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="marintop20 xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="dataTable" v-loading="dataTableLoading">
                    <el-table-column label="年度" width="180">
                        <template slot-scope="scope">
                            {{ moment(scope.row.createdAt*1000).format('YYYY') }}年
                        </template>
                    </el-table-column>
                    <el-table-column label="订单ID" prop="orderId"></el-table-column>
                    <el-table-column label="下单日期" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.createdAt | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="商品ID">
                        <template slot-scope="scope">
                            <p v-for="(item,index) in scope.row.sGoodsId" :key="item">
                                {{ item }}<template v-if="index!=scope.row.sGoodsId.length-1">，</template>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户手机号" prop="phone"></el-table-column>
                    <el-table-column label="订单总金额">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.totalMoney, 100).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="关闭时间" >
                        <template slot-scope="scope">
                            {{ scope.row.updatedAt | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="150px">
                        <template slot-scope="scope">
                            <el-button type="text" v-permission="'closeGoodsListDetail'" :size="$size" @click="viewDetail(scope.row.orderId, '1')">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
                
            </div>
        </div>
    </div>
</template>
<script>
    //枚举用户类型
    const EnumUserType = [{key: '', value: '全部'},{key: 'user', value: '用户'},{key: 'muser', value: '商户'}];
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import  { EnumTicketType } from '@/util/publicParams.js';
    import  { enumFormatter } from '@/util/publicMehotds.js';
    export default {
        data() {
            return {
                moment,
                EnumUserType,
                EnumYear: [],
                labelWidth: '100px',
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                //正常订单
                dataTable: [],
                dataTableLoading: false,
                searchForm: {},
                activeName: 'GOODS',
                isClearCondition: true
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallManager.searchConditionClose
            })
        },
        created() {
            this.setYearEnum();
            if(this.searchData) {
                this.page=this.searchData.page;
                this.activeName=this.searchData.activeName;
                this.searchForm = this.searchData.searchForm;
                this.isClearCondition = false
            }
            this.getList();
        },
        methods: {
            ...mapMutations({
                setSearchConditionClose: "selfMallManager/setSearchConditionClose"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            //设置年度枚举类型
            setYearEnum() {
                let len = moment().format('YYYY') - 2017;
                for(let i =0; i < len; i++) {
                    let mo = moment().format('YYYY');
                    this.EnumYear.push({
                        key: (mo-i)+'年',
                        value: JSON.stringify([moment(mo-i +'0101').format('X'),moment(mo-i + '1231').format('X')])
                    })
                }
            },
            //搜索
            search() {
                this.page.page = 1;
                this.isClearCondition = true;
                this.getList();
            },
            clearCondition() {
                this.page.page=1;
                this.searchForm = {};
                this.getList();
            },
            viewDetail(orderId, status, refundOrderId) {
                let query = {
                    type: 3,
                    orderId: orderId,
                    status: status,
                    close: parseInt(Math.random()*100000),
                    activeName: this.activeName
                }
                this.$router.push({ path: "/orderListAfterSaleDetail", query: query})
            },
            getList(){
                let params = {
                    condition: {
                        goodsDivide: this.activeName,
                        orderStatus: '3',
                        isNormalOrRefund: "1"
                    },
                    page: this.page.page,
                    limit: this.page.limit,
                }
                let years = this.searchForm.years? JSON.parse(this.searchForm.years):"";
                let timeRange = this.searchForm.timeRange?this.searchForm.timeRange:"";
                years
                    ? (params.condition.yearStart=years[0], params.condition.yearEnd=years[1])
                    : "";
                timeRange
                    ? (params.condition.timeStart=moment(timeRange[0]).format("X"), params.condition.timeEnd=moment(timeRange[1]).format("X"))
                    : "";
                this.searchForm.userType?params.condition.userType = this.searchForm.userType:"";
                this.searchForm.orderId?params.condition.orderId = this.searchForm.orderId:"";
                this.searchForm.phone?params.condition.phone = this.searchForm.phone:"";
                // this.searchForm.sGoodsId?params.condition.sGoodsId = this.searchForm.sGoodsId:"";
                this.dataTableLoading = true;
                console.log(JSON.stringify(params))
                this.$http.get(this.$api.mallOBMFinishOrderQPage, params, true).then(res=>{
                    console.log(res)
                    this.setSearchConditionClose(Object.assign({searchForm: this.searchForm}, {page: this.page}, {activeName: this.activeName}));
                    this.dataTable=res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.dataTableLoading = false;
                })
                .catch(err=>{
                    [this.page.total, this.dataTable, this.dataTableLoading] = [0, [], false];
                    this.$message.error(err.message);
                })
            },
            tabClick(node) {
                this.page.page = 1;
                this.searchForm = this.searchData.searchForm;
                this.getList();
            }
        },
        filters: {
            formatTicket(val) {
                return enumFormatter(val, EnumTicketType)
            }
        }
    }
</script>
<style lang="scss" src="./closeList.scss"></style>
