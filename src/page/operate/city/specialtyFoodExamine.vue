<template>
    <div class="xk-container specialty-food-examine">
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
                                <el-form-item label="审核状态：">
                                    <el-select :size="$size" v-model="searchForm.status">
                                        <el-option v-for="(item, index) in EnumExamineType" :key="index" :label="item.value" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="申请日期：">
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
                        <el-button type="danger" :disabled="deleteBtn" :size="$size" @click="search" :loading="searchLoading">全部删除</el-button>
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
                    <el-table-column label="申购时间"></el-table-column>
                    <el-table-column label="价格"></el-table-column>
                    <el-table-column label="联系电话"></el-table-column>
                    <el-table-column label="餐饮营业照"></el-table-column>
                    <el-table-column label="卫生许可证"></el-table-column>
                    <el-table-column label="消防合格证书"></el-table-column>
                    <el-table-column label="审核">
                        <template slot-scope="scope">
                            <el-button :size="$size" type="primary">审核</el-button>
                            <span>不通过</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="viewDetail(scope.row.id)">查看详情</el-button>
                            <el-button type="text">删除</el-button>
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
    //枚举审核状态
    const EnumExamineType = [{key: '', value: '全部'},{key: 'waiting', value: '待审核'},{key: 'refused', value: '不通过'}]
    export default {
        data() {
            return {
                EnumExamineType: EnumExamineType,
                searchLoading: false,
                tableLoading: false,
                deleteBtn: true,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近三天',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
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
            //查看详情
            viewDetail(id) {
                this.$router.push({
                    path: '/specialtyFoodDetail',
                    query: {
                        type: 1
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
@import './specialtyFoodExamine.scss'
</style>
