<template>
    <div class = 'drawback-record xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    退税记录
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch">搜索</el-button>
                    <el-button type="primary" :size="$size">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-width="120px" :model="searchData" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="退税单号：">
                                <el-input v-model="searchData.name" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户ID：">
                                <el-input v-model="searchData.name" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户名称：">
                                <el-input v-model="searchData.name" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期：">
                                <el-date-picker
                                    :size="$size"
                                    v-model="searchData.rangeTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退税金额：">
                                <el-row>
                                    <el-col :span="11">
                                        <el-form-item label-width="0">
                                            <el-input :size="$size" placeholder="1"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" class="center">~</el-col>
                                    <el-col :span="11">
                                        <el-form-item label-width="0">
                                            <el-input :size="$size" placeholder="10"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核状态：">
                                <el-select v-model="searchData.audit" :size="$size" placeholder="请选择">
                                    <el-option
                                    v-for="item in EnumAudit"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
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
                    审核状态
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                v-loading="loadingTable"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="年度">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="提现单号">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="申请时间">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="通过时间">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作管理员">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="主播ID">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="主播名称">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="提现金额">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "page.page" :pageSize = "page.limit" :total = "page.total" @change = "fnpagechange"></Pagination>
        </div>
    </div>
</template>
<script>
const EnumGrade = [{label: '0-1万', value: 'one'},{label: '1-3万', value: 'two'},{label: '3-5万', value: 'three'},{label: '5万以上', value: 'four'}];
const EnumAudit = [{label: '申请中', value: 'APPLYING'},{label: '同意', value: 'AGREE'},{label: '拒绝', value: 'REJECT'}];
export default {
    name:'drawbackRecord',
    data () {
        return {
            EnumAudit,
            EnumGrade,
            loadingSearch: false,
            loadingTable: false,
            searchData:{},
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            tableData:[]
        };
    },
    props: {},
    components: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        search() {
            this.page.page = 1;
            this.loadingSearch = true;
            this.getList()
        },
        getList() {
            let params= {

            }
            this.loadingTable = true;
            this.$http.get(this.$api, params, true).then(res=>{
                console.log(res)
                this.loadingSearch = false;
                this.loadingTable = false;
            })
            .catch(err=>{
                this.loadingSearch = false;
                this.loadingTable = false;
                this.$message.error(err.message);
            })
        }
    },
    watch: {}
}
</script>
<style scoped>
</style>