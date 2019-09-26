<template>
    <div class="platform-credit-detail xk-container">
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
                            <el-input v-model="searchForm.orderId" :size="$size" placeholder="请输入订单"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            <el-input v-model="searchForm.waterId" :size="$size" placeholder="请输入流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="8">
                        <el-form-item label="交易时间：">
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
                    <el-button type="success" :size="$size" :loading="loadingSearch">导出到Excel</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData">
                <el-table-column label="流水号"></el-table-column>
                <el-table-column label="交易时间"></el-table-column>
                <el-table-column label="舍去金额"></el-table-column>
                <el-table-column label="订单类型"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                labelWidth: '150px',
                tableData: [{}],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {}
            }
        },
        methods: {
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            searchList() {

            },
            clearCondition() {

            }
        }
    }
</script>

<style scoped lang="scss">
    .platform-credit-detail {
        
    }
</style>
