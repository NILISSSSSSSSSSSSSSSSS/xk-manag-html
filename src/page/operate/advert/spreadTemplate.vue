<template>
    <div class="xk-container">
        <div class="xk-body spread-template">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" size="small" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form :model="searchForm" label-width="120px" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="模板ID：">
                                <el-input :size="$size" placeholder="请输入模板ID" v-model="searchForm.id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="模板名称：">
                                <el-input :size="$size" placeholder="请输入模板名称" v-model="searchForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="模板类型：">
                                <el-select :size='$size' v-model="searchForm.templateType">
                                    <el-option v-for="(item,index) in EnumTemplateType" :key="index" :label="item.value" :value="item.key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="选择日期：">
                                <el-date-picker 
                                    :size="$size"
                                    type="datetimerange" 
                                    v-model="searchForm.rangeTime" 
                                    range-separator="~"
                                    :picker-options="pickerOptions"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                </el-form>
            </div>

            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="'spreadTemplateAdd'" type="primary" size="small" @click="add('addCardForm')">新增</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable">
                    <el-table-column label="模板ID" prop="id" width="250px"></el-table-column>
                    <el-table-column label="模板名称" prop="name"></el-table-column>
                    <el-table-column label="生效时间">
                        <template slot-scope="scope">
                            {{ scope.row.startTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="截止时间">
                        <template slot-scope="scope">
                            {{ scope.row.endTime | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" prop="templateType" :formatter="formatterType"></el-table-column>
                    <el-table-column label="关联商品" prop="goodsName"></el-table-column>
                    <el-table-column label="关联商品ID" prop="goodsId" width="250px"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="200px">
                        <template slot-scope="scope">
                            <el-button v-permission="'spreadTemplateEdit'" :loading="scope.row.loading" :size="$size" type="primary" @click="editTemplate(scope.row, scope.row.id)">编辑</el-button>
                            <el-button v-permission="'spreadTemplateDel'" :size="$size" type="danger" @click="deleteTemplate(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
        <!-- 新增 -->
        <spread-template :visible.sync="visible" :add="true" @on-update="updateList" :editData="editData"></spread-template>
    </div>
</template>
<script>
    //枚举模板类型
    const EnumTemplateType = [{key: "", value: "全部"},{key: "topic", value: "专题"},{key: "activity", value: "活动"}]

    import SpreadTemplate from "@/components/goods/AddSpreadTemplate.vue"
    export default {
        components: {
            SpreadTemplate
        },
        data() {
            return {
                visible: false,
                loadingTable: false,
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
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                tableData: [],
                EnumTemplateType: EnumTemplateType,
                searchForm: {},
                searchLoading: false,
                editData: ""
            }
        },
        created() {
            this.getList()
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList()
            },
            //清空
            clearInput() {
                this.searchForm = {}
                this.getList();
            },
            getList() {
                let params = {
                    condition: {
                        time: {
                            start: this.searchForm.rangeTime?(new Date(this.searchForm.rangeTime[0]).getTime()+"").substring(0, 10): "",
                            end: this.searchForm.rangeTime?(new Date(this.searchForm.rangeTime[1]).getTime()+"").substring(0, 10): "",
                        },
                        name: this.searchForm.name?this.searchForm.name: "",
                        id: this.searchForm.id?this.searchForm.id: "",
                        templateType: this.searchForm.templateType?this.searchForm.templateType:""
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                console.log(JSON.stringify(params))
                this.loadingTable = true;
                this.$http.get(this.$api.promotionTemplateQPage, params, true).then(res=> {
                    console.log(res)
                    this.tableData = res? res.data: []
                    this.page.total = res? res.total: 0;
                    this.loadingTable = false;
                    this.searchLoading = false
                })
                .catch(err=>{
                    this.$message.error(err.message)
                    this.searchLoading = false;
                    this.loadingTable = false;
                })
            },
            formatterType(row) {
                let result = this.EnumTemplateType.filter(item=> {
                    return item.key === row.templateType
                })
                return result.length>0?result[0].value: row.templateType
            },
            add() {
                this.visible = true;
                this.editData = {};
            },
            updateList(res) {
                if(res){this.getList()}
            },
            //删除模板
            deleteTemplate(id) {
                this.$confirm('确定删除当前模板吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res=> {
                    this.$http.post(this.$api.promotionTemplateDelete, {id: id}, true).then(res=> {
                        this.$message({
                            message: "删除成功",
                            type: 'success'
                        })
                        this.getList();
                    })
                    .catch(err=>{
                        this.$message.error(err.message)
                    })
                })
                .catch(()=>{
                    this.$message({
                        message: "取消删除",
                        type: 'info'
                    })
                })
            },
            //编辑模板
            editTemplate(row, id) {
                this.$set(row, 'loading', true);
                this.$http.get(this.$api.promotionTemplateDetail, {id: id}, true).then(res=> {
                    this.$set(row, 'loading', false);
                    this.editData = res;
                    this.visible = true;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.$set(row, 'loading', false);
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "./spreadTemplate.scss"
</style>
