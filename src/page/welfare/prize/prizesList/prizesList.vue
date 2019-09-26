<template>
    <div class="xk-container">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>奖品列表查询
                </div>
                <div class="vus-btn">
                    <el-button :loading="isLoading" type="primary" :size="$size" @click="submitForm('ruleForm')">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm('ruleForm')">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <!--内容-->
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px"
                     class="xk-search demo-ruleForm">
                <!--第一排-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="奖品名称：">
                            <el-input :size="$size" v-model.trim="ruleForm.name" placeholder="输入奖品名称"
                                      style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品ID：">
                            <el-input :size="$size" v-model.trim="ruleForm.id" style="width: 100%;"
                                      placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品用途：">
                            <el-select :size="$size" style="width:100%" v-model="ruleForm.usage">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in PrizeUsageEnum" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品类型：">
                            <el-select :size="$size" style="width:100%" v-model="ruleForm.type">
                                <el-option label="全部" value="">全部</el-option>
                                <el-option label="实物奖品" value="substance">实物奖品</el-option>
                                <el-option label="虚拟奖品" value="virtual">虚拟奖品</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!--表格数据-->
        <div class="xk-radius marintop20">
            <!--表格标题-->
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <!--内容-->
            <el-table stripe :data="tableData" tooltip-effect="dark" v-loading="loadingTable">
                <el-table-column label="奖品ID" prop="id" width="300"></el-table-column>
                <el-table-column label="奖品名称" width="250">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品用途" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.usage | formatUsage }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品类型" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type==='substance'?'实物':'虚拟' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.goodsStatus=='UP'">上架</span>
                        <span v-else>下架</span>
                    </template>
                </el-table-column>
                <el-table-column label="开奖方式" width="150">
                    <template slot-scope="scope">
                        <el-button v-permission="'prizesListDetail'" v-if="scope.row.goodsStatus=='UP'" :size="$size" type="primary" @click="seeInfo(scope.$index, scope.row)">查看</el-button>
                        <el-button v-permission="'prizesListSet'" v-else :size="$size" type="primary" @click="setInfo(scope.$index, scope.row)">设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间">
                    <template slot-scope="scope">
                    <span>{{ scope.row.updatedAt | formatTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <div v-if="scope.row.goodsStatus=='UP'">
                            <el-button v-if="scope.row.usage!=='expense'" v-permission="'prizesListSetNext'" :size="$size" type="primary" @click="setNext(scope.$index, scope.row)">设置下一期</el-button>
                        </div>
                        <div v-else>
                            <el-button v-permission="'prizesListEdit'" :size="$size" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button v-permission='"prizesListDel"' :size="$size" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
    import { PrizeUsageEnum } from '@/util/publicParams.js';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import { mapMutations, mapState } from 'vuex'
    export default {
        name: "prizesAddList",
        components: {},
        data() {
            return {
                PrizeUsageEnum,
                isLoading:false,               //是否加载
                selectGoods: [],               //所选的全部商品些
                ruleForm: {},
                tableData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                loadingTable: false
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfarePrize.searchSelfPrizeCondition
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.ruleForm = this.searchData.searchForm)
                : null;
            this.allList();
        },
        methods: {
            ...mapMutations({
                setSelfPrizeCondition: "welfarePrize/setSelfPrizeCondition"
            }),
            //分页
            changePage(page, limit) {
                this.page.page = page;
                this.page.limit = limit;
                this.allList()
            },
            //获取所有列表数据
            allList() {
                let data = {
                    condition: {
                        name:this.ruleForm.name || "",
                        id:this.ruleForm.id || "",
                        usage: this.ruleForm.usage || "",
                        type: this.ruleForm.type || ""
                    },
                    page: this.page.page,
                    limit: this.page.limit
                };
                this.loadingTable = true;
                this.$http.get(this.$api.jfmallGoodsQPage4Manager, data, true
                ).then((res) => {
                    this.setSelfPrizeCondition(Object.assign({searchForm: this.ruleForm}, {page: this.page}))
                    this.isLoading=false;
                    this.page.total = res? res.total: 0;
                    this.tableData = res? res.data: [];
                    this.loadingTable = false;
                }).catch(err => {
                    this.isLoading=false;
                    this.loadingTable = false;
                    this.$message.error(err.message)
                });
            },
            //提交搜索
            submitForm() {
                this.page.page = 1;
                this.isLoading=true;
                this.allList();
            },
            //重置表单
            resetForm(formName) {
                this.setSelfPrizeCondition(null);
                this.ruleForm = {}
                this.page.page = 1;
                this.allList();
            },
            //编辑表格行内容
            handleEdit(index, row) {
                if (row.from !== 'mall') {
                    this.$router.push({path: '/prizesAddList', query: {id: row.id}});
                } else {
                    this.$router.push({path: '/prizesDetails', query: {id: row.mallGoodsId, prizeId: row.id}});
                }
            },
            //删除当前行
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        jGoodsId:row.id,
                    };
                    this.$http.post(this.$api.jfmallGoodsDelete4Manager, data, true
                    ).then((res) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                        this.allList();
                    }).catch(err => {
                        this.$message.error(err.message)
                    });
                }).catch(() => {});
            },
            //  设置
            setInfo(index, row) {
                this.$router.push({path:'/nextPrizes',query:{id:row.id, type: row.goodsStatus}});
            },
            //查看开奖的奖品详情
            seeInfo(index, row) {
                this.$router.push({path: '/openPrizesDetails', query: {id: row.jSequence.id, goodsId: row.id}});
            },
            //设置下一期
            setNext(index, row){
                this.$router.push({path:'/nextPrizes',query:{id:row.id, type: row.goodsStatus}});
            }
        },
        filters: {
            formatUsage(val) {
                if(val) {
                    return enumFormatter(val, PrizeUsageEnum)
                }
            }
        }
    }
</script>

<style lang='scss' scoped>

</style>

