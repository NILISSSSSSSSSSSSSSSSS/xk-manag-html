<template>
    <el-dialog class="coupon-list" :visible.sync="visible" append-to-body title="选择会员卡" width="70%">
        <div class='xk-title'>
            <div class="vus-title">
                <span></span>查询
            </div>
            <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                <el-button type="primary" :size="$size" @click="clearInput">清空</el-button>
            </div>
            <div class="vus-bottom"></div>
            <el-form label-width="100px" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="会员卡名称：">
                            <el-input :size="$size" v-model="searchForm.name" placeholder="请输入会员卡名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型：">
                            <el-select :size="$size" v-model="searchForm.memberType">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in EnumCardType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" ref="multipleTable">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="会员卡ID" prop="id"></el-table-column>
            <el-table-column label="会员卡名称" prop="name"></el-table-column>
            <el-table-column label="类型" :formatter="formatterType"></el-table-column>
            <el-table-column label="生效时间">
                <template slot-scope="scope">
                    {{ scope.row.validTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="结束时间">
                <template slot-scope="scope">
                    {{ scope.row.invalidTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="总量" prop="totalNum"></el-table-column>
            <el-table-column label="已领" prop="num"></el-table-column>
            <el-table-column label="状态" :formatter="formatterStatus"></el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        <div class="btn-group">
            <el-button :size="$size" type="success" @click="closeDia()">取消</el-button>
            <el-button :size="$size" type="primary" @click="saveSelect()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { EnumCouponTypeList } from '@/util/publicParams.js'
    //枚举会员类型
    const EnumCardType = [{key: "VIP", value:"VIP会员卡"},{key: "GENERAL", value:"普通会员卡"}]
    //枚举品类范围
    const EnumScope = [{key: "ALL", value:"全场"},{key: "GOODS", value:"单品"},{key: "CATEGORY", value:"品类"}]
    import  { enumFormatter } from '@/util/publicMehotds.js';
    import moment from 'moment';
    export default {
        props: {
            visible: {
                default: false,
                type: Boolean
            },
            type: {
                default: 'mall',
                type: String
            }
        },
        data() {
            return {
                EnumCardType,
                moment,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                tableData: [],
                tableLoading: false,
                searchLoading: false,
                searchForm: {},
                selectData: []
            }
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearInput() {
                this.searchForm = {};
                this.page.page = 1;
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    condition: {
                        ...this.searchForm,
                        cardConditionStatus: 'VALIDING'
                    }
                }
                let url = this.type==='mall'? this.$api.cardMemberCardQPage: this.$api.shopMemberCardQPage
                this.tableLoading = true;
                this.$http.get(url, params, true)
                .then(res=>{
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    console.log(res)
                })
                .catch(err=>{
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.$message.error(err.message)
                })
            },
            formatterStatus(row) {
                return enumFormatter(row.newStatus, EnumCouponTypeList)
            },
            formatterType(row) {
                return enumFormatter(row.cardType, EnumCardType)
            },
            closeDia() {
                this.$emit('update:visible', false)
            },
            handleSelectionChange(val) {
                this.selectData = val;
            },
            //渲染哪些是被选中的
            saveSelect() {
                if(!this.selectData.length) {
                    this.$message.warning('请选择一个ID');
                    return false;
                }
                this.$emit('on-success', this.selectData);
                this.closeDia();
            }
        },
        watch: {
            visible(val) {
                !val? this.closeDia(): this.clearInput()
            }
        }
    }
</script>