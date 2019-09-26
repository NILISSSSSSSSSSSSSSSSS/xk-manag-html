<template>
    <div class="relative-merchant">
        <!-- 选择商户 -->
        <el-dialog title="选择商户" :visible.sync="visible" class="relative-merchant" width="1000px" append-to-body top="50px" :before-close="closeDialog">
            <el-row type="flex" justify="space-between">
                <el-col :span="8">
                    <province-cascader v-model="searchForm.districtCode"></province-cascader>
                </el-col>
                <el-col :span="8">
                    <el-input :size="$size" placeholder="请输入商户码" v-model.number="searchForm.code"></el-input>
                </el-col>
                <el-col :span="5"></el-col>
            </el-row>
            <el-row type="flex" justify="space-between" class="margintop20">
                <el-col :span="8">
                    <el-input :size="$size" placeholder="请输入联系人账号" v-model.number="searchForm.phone"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-input :size="$size" placeholder="请输入联系人姓名" v-model.number="searchForm.name"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" :size="$size" @click="search()">查询</el-button>
                    <el-button type="danger" :size="$size" @click="clear()">清空</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" class="marintop20" border v-loading="tableLoading">
                <el-table-column
                    width="40">
                    <template slot-scope="scope">
                        <el-radio @change.native="getMerchant(scope.row)" v-model="tableDataSelect" :label="scope.$index"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    width="150"
                    label="商户码">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联系人账号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="联系人姓名">
                </el-table-column>
                <el-table-column
                    width="100"
                    label="商户类型">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.identityStatuses" :key="index">
                            {{ item.merchantType | formatMerchant }}
                            <template v-if="index!=scope.row.identityStatuses.length-1">，</template>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="商户首次入住时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage" ></pagination>
            <div class="btn-group">
                <el-button :size="$size" @click="closeDialog">取消</el-button>
                <el-button :size="$size" type="primary" @click="confirmSelectMerchant">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { EnumMerchantType } from '@/util/publicParams.js';
    import ProvinceCascader from '@/components/ProvinceCascader.vue'
    export default {
        components: {
            ProvinceCascader
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            value: {
                default: ""
            }
        },
        data() {
            return {
                searchForm: {},
                showDialog: false,
                tableData: [],      //关联商户表格
                tableLoading: false,
                tableDataSelect: "",
                selectData: null,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }
            }
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            /**关联商户 */
            closeDialog() {
                this.$emit("update:visible", false)
            },
            getMerchant(row) {
                this.selectData = row;
                console.log(row);
            },
            //选择关联商户
            confirmSelectMerchant() {
                if(this.selectData) {
                    let obj  = {
                        merchantId: this.selectData.id,
                        merchantName: this.selectData.merchantName,
                        merchantPhone: this.selectData.phone
                    }
                    this.value.ratio ? obj.ratio = this.value.ratio: null;
                    this.$emit("input", obj);
                    this.closeDialog();
                }else{
                    this.$message.warning('请选择关联账户！')
                }
            },
            //商户列表
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit
                }
                if(this.searchForm.districtCode) {
                    let [p, c, d] = [...this.searchForm.districtCode];
                    params.districtCode = d;
                }
                if(this.searchForm.code && !/\d/g.test(this.searchForm.code)) {
                    this.$message.error('商户码只能输入数字！')
                    return false;
                }
                this.searchForm.code? params.code = this.searchForm.code: null;
                this.searchForm.name? params.name = this.searchForm.name: null;
                this.searchForm.phone? params.phone = this.searchForm.phone: null;
                this.tableLoading = true;
                this.$http.get(this.$api.merchantManagerPage, params, true).then(res=>{
                    this.tableLoading = false;
                    this.tableDataSelect = "";
                    this.selectData = null;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                })
            },
            search() {
                this.page.page = 1;
                this.getList();
            },
            clear() {
                this.searchForm = {};
                this.page = {
                    page: 1,
                    limit: 10,
                    total: 0
                };
                this.getList();
            }
        },
        watch: {
            visible(val) {
                !val? null: this.getList();
            }
        },
        filters: {
            formatMerchant(val) {
                if(val) {
                    for(let item of EnumMerchantType) {
                        if(item.key === val) {
                            return item.value;
                        }
                    }
                    return val;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .relative-merchant {
        /deep/ .el-radio__label {
            display: none;
        }
    }
</style>
