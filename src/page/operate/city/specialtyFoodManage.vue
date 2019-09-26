<template>
    <div class="xk-container specialty-food-manage">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品ID：">
                                    <el-input :size="$size" placeholder="输入商品ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商品名称：">
                                    <el-input :size="$size" placeholder="输入商品名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商品分类：">
                                    <el-input :size="$size" placeholder="选择商品分类"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="店铺ID：">
                                    <el-input :size="$size" placeholder="输入店铺ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="店铺名称：">
                                    <el-input :size="$size" placeholder="输入店铺名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="审核日期：">
                                    <el-date-picker
                                        v-model="searchForm.rangeTime"
                                        type="daterange"
                                        align="right"
                                        unlink-panels
                                        :size="$size"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button :disabled="deleteBtn" type="danger" :size="$size" @click="search" :loading="searchLoading">取消全部资格</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="商品ID"></el-table-column>
                    <el-table-column label="商品名称"></el-table-column>
                    <el-table-column label="商品分类"></el-table-column>
                    <el-table-column label="店铺ID"></el-table-column>
                    <el-table-column label="店铺名称"></el-table-column>
                    <el-table-column label="价格"></el-table-column>
                    <el-table-column label="联系电话"></el-table-column>
                    <el-table-column label="审核时间"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
                            <el-button type="text" @click="revoke(scope.row.id)">撤销资格</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchLoading: false,
                tableLoading: false,
                deleteBtn: true,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm:{},
                tableData:[{}],
                multipleSelection: null
            }
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            search() {

            },
            clearCondition() {},
            getList() {},
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.deleteBtn = val.length>0?  false: true;
            },
            //取消资格
            revoke(id) {
                this.$confirm('确定要撤销该店铺的购买资格吗？', '撤销购买资格确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(()=>{
                    console.log('确认');
                    this.getList();
                })
                .catch(()=>{})
            },
            //查看详情
            viewDetail(id) {
                this.$router.push({
                    path: '/specialtyFoodDetail',
                    query: {
                        type: 2
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
@import './specialtyFoodManage.scss'
</style>
