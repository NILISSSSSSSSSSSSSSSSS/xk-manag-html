<template>
    <div class="rider">
        <el-dialog title="选择骑士" width="1000px" :visible.sync="riderDialog" :before-close="handleClose">
            <el-row>
                <el-col :span="10">
                    <el-form>
                        <el-form-item :model="searchForm" prop="key">
                            <el-col :span="20">
                                <el-input :size="$size" style="width: 100%" placeholder="请输入骑士ID/手机号/姓名" v-model="searchForm.key"></el-input>
                            </el-col>
                            <el-col :span="4" style="text-align: right">
                                <el-button :size="$size" type="primary" @click="searchRider">搜索</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class='warning'>当前排序规则：按骑士到发货地址距离从近到远排序</el-row>
            <el-table :data="tableData" style="margin-top: 20px">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="骑士ID" prop="id"></el-table-column>
                <el-table-column label="手机号码" prop="phone"></el-table-column>
                <el-table-column label="待完成订单数" prop="todoOrderNum"></el-table-column>
                <el-table-column label="至商户距离" prop="distance"></el-table-column>
                <el-table-column label="配送区域" prop="districtCode"></el-table-column>
                <el-table-column label="实名认证" prop="idCardAuthStatus"></el-table-column>
                <el-table-column label="用户实名" prop="realName"></el-table-column>
                <el-table-column label="健康证认证" prop="healthCardAuthStatus">
                    <template slot-scope="scope">
                        {{scope.row.healthCardAuthStatus === "SUCCESS" ? "成功" : '失败'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="handleDispatch(scope.row)">派单</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change=changePage></pagination>
            <div style="text-align: center; margin-top: 10px">
                <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'rider',
    props: {
        riderDialog: {
            type: Boolean,
            default: false
        },
        // logisticsInfo: {
        //     type: Object,
        //     default: {}
        // },
        orderId: {
            type: [String,Number],
            default: ''
        },
        weight: {
            type: [String,Number],
            default: 0
        },
        xkModule: String
    },
    data() {
        return {
            searchForm: {},
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            logistics: {},
            tableData: []
        }
    },
    watch: {
        riderDialog(val) {
            val? this.getRider(): null;
        }
    },
    methods: {
        getRider() {
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                key:  this.searchForm.key ? this.searchForm.key : ''
            }
            this.$http.get(this.$api.nearbyRider, paramList, true)
            .then(res => {
                this.tableData = res.data
                this.pageData.total = res.total
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
         changePage(page,size) {
            this.pageData.pageSize = size;
            this.pageData.currentPage = page;
            this.getRider();
       },
        searchRider() {
            this.pageData.currentPage = 1;
            this.getRider();
        },
        handleDispatch(val) { // 选择派送骑手
            this.$confirm("确认选择该骑手派送", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let paramList = {
                    phone: val.phone,
                    riderId: val.id,
                    realName: val.realName,
                    goodsOrderNo: this.orderId,
                    riderLocation: val.location,
                    weight: this.weight,
                    xkModule: this.xkModule
                }
                this.$http.post(this.$api.dispatchOrder, paramList, true)
                .then(res => {
                    this.handleClose();
                    this.$message.success('派送成功')
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消")
            })
        },
        handleClose() {
           this.$emit("update:riderDialog", false);
        }
    }
}
</script>

<style lang="scss" scoped>
    .warning {
        color: #E6A23C;
    }
</style>
