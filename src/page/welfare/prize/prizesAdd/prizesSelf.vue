<template>
    <div class="xk-container">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>选择自营奖品查询
                </div>
                <div class="vus-btn">
                    <el-button :loading="isLoading" type="primary" :size="$size" @click="submitForm('ruleForm')">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                     class=" demo-ruleForm xk-search">
                <!--第一排-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input :size="$size" v-model.trim="ruleForm.goodsName" placeholder="请输入商品名称"
                                      style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input :size="$size" v-model.trim="ruleForm.goodsID" style="width: 100%;"
                                      placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-cascader
                                    v-model="ruleForm.code"
                                    :size="$size"
                                    :options="priClass"
                                    :props="props"
                                    change-on-select
                                    placeholder="全部分类"
                                    style="width: 100%;"
                                >
                                </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第二排-->
                <el-row>
                    <el-col :span="8">
                        <el-row type="flex" justify="center">
                            <el-col :span="13">
                                <el-form-item label="商品价格：" prop="price1">
                                    <el-input :size="$size" v-model.trim="ruleForm.price1" placeholder="0"
                                              style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2" style="text-align: center;line-height: 40px">至</el-col>
                            <el-col :span="9">
                                <el-input :size="$size" v-model.trim="ruleForm.price2" placeholder="0"
                                          style="width: 100%; line-height: 40px"></el-input>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格数据-->
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="tableLoading">
                <el-table-column
                    label="商品ID"
                    prop="id"
                    width="220">
                </el-table-column>
                <el-table-column
                    label="商品名称"
                    prop="name">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="商品分类">
                </el-table-column>
                <el-table-column
                    label="商品品牌"
                    prop="brandName">
                </el-table-column>
                <el-table-column
                    label="商品价格">
                    <template slot-scope="scope">
                        <span>{{ $math.divide(scope.row.b2cPrice, 100) }} 元</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button
                            :size="$size"
                            type="primary"
                            @click="addEdit(scope.row.id)">添加
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>

    export default {
        name: "prizesSelf",
        components: {},
        data() {
            return {
                props: {
                    value: 'code',
                    label: 'name'
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                isLoading:false,
                tableLoading: false,
                priClass: [],
                ruleForm: {},
                tableData: [],
            }
        },
        mounted() {
            this.allList();
            this.prizesClass();
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.allList();
            },
            //获取奖品分类
            prizesClass() {
                this.$http.get(this.$api.queryList, {}, true).then(res=> {
                    let obj = {
                        code: '000000',
                        name: '全部'
                    }
                    this.priClass = res;
                    this.priClass.unshift(obj);
                }).catch(err=> {
                    this.$message.error(err.message)
                })
            },
            //获取所有列表数据
            allList() {
                let params = {
                    condition: {
                        id:this.ruleForm.goodsID,
                        name:this.ruleForm.goodsName,
                        category:this.ruleForm.code&&this.ruleForm.code[this.ruleForm.code.length-1]!=='000000'?this.ruleForm.code[this.ruleForm.code.length-1]: '',
                        minPrice: this.$math.multip(this.ruleForm.price1 ,100),
                        maxPrice: this.$math.multip(this.ruleForm.price2 ,100)
                    },
                    page: this.page.page,
                    limit: this.page.limit,
                };
                this.tableLoading = true;
                this.$http.get(this.$api.xkGoodsQPage, params, true).then((res) => {
                    this.isLoading=false;
                    this.tableLoading = false;
                    this.page.total = res? res.total: 0;
                    this.tableData = res? res.data: [];
                }).catch(err => {
                    this.isLoading=false;
                    this.tableLoading = false;
                    this.$message.error(err.message)
                });
            },
            //提交搜索
            submitForm() {
                this.isLoading=true;
                this.allList();
            },
            //重置表单
            clearCondition() {
                this.ruleForm={};
                this.allList();
            },
            //添加（商品详情）
            addEdit(id) {
                this.$router.push({path: '/prizesDetails', query: {id: id}});
            }
        }
    }
</script>

<style scoped>

</style>

