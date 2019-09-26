<template>
    <div class="platform-profit-divide-detail xk-container">
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
                        <el-form-item label="联盟商ID：">
                            <el-input v-model="searchForm.merchantId" :size="$size" placeholder="请输入订单号">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联盟商名称：">
                            <el-input v-model="searchForm.name" :size="$size" placeholder="请输入流水号">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="日期：">
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
                <el-table-column label="订单时间"></el-table-column>
                <el-table-column label="联盟商ID"></el-table-column>
                <el-table-column label="联盟商类型"></el-table-column>
                <el-table-column label="分成收益"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size='$size' type="text">查看详情</el-button>
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
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                tableData: [{}]
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

            },
            getList() {}
        }
    }
</script>

<style lang="scss" scoped>
    .platform-profit-divide-detail{
        
    }
</style>
