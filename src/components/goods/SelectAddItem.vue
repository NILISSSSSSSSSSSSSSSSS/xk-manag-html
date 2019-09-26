<template>
    <div class="select-add-item">
        <el-dialog title="选择添加项" :visible.sync="visible" width="800px">
            <el-row type="flex" align="middle">
                <el-col :span="1"><el-checkbox></el-checkbox></el-col>
                <el-col :span="6">税金：</el-col>
                <el-col :span="4"><el-input :size="$size"></el-input></el-col>
                <el-col :span="2">&nbsp;&nbsp;%</el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="1"><el-checkbox></el-checkbox></el-col>
                <el-col :span="6">销售奖励（仅针对销售）：</el-col>
                <el-col :span="4"><el-input :size="$size"></el-input></el-col>
                <el-col :span="2">&nbsp;&nbsp;%</el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="1"><el-checkbox></el-checkbox></el-col>
                <el-col :span="6">货源奖励：</el-col>
                <el-col :span="4"><el-input :size="$size"></el-input></el-col>
                <el-col :span="2">&nbsp;&nbsp;%</el-col>
                <el-col :span="5"><el-button type="info" :size="$size" @click="relation">去关联商户</el-button></el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="1"><el-checkbox></el-checkbox></el-col>
                <el-col :span="6">销售总额奖励：</el-col>
                <el-col :span="4"><el-input :size="$size"></el-input></el-col>
                <el-col :span="2">&nbsp;&nbsp;%</el-col>
                <el-col :span="6"><el-input :size="$size" placeholder="请输入销售总额奖励的门槛"></el-input></el-col>
                <el-col :span="5">&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="info" :size="$size" @click="relation">去关联商户</el-button></el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="1"><el-checkbox></el-checkbox></el-col>
                <el-col :span="6">单次批量奖励：</el-col>
                <el-col :span="4"><el-input :size="$size"></el-input></el-col>
                <el-col :span="2">&nbsp;&nbsp;%</el-col>
                <el-col :span="6"><el-input :size="$size" placeholder="请输入批量奖励的门槛数量"></el-input></el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="1"><el-checkbox></el-checkbox></el-col>
                <el-col :span="6">销售补贴（临时）：</el-col>
                <el-col :span="4"><el-input :size="$size"></el-input></el-col>
                <el-col :span="2">&nbsp;&nbsp;%</el-col>
                <el-col :span="5"><el-button type="info" :size="$size" @click="relation">去关联商户</el-button></el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="hideDialog">取消</el-button>
                <el-button type="primary" :size="$size" @click="confirm">确定</el-button>
            </div>
        </el-dialog>

        <!-- 选择商户 -->
        <el-dialog title="选择商户" :visible.sync="showDialog" width="800px" append-to-body>
            <el-row type="flex" justify="space-between">
                <el-col :span="8">
                    <province-cascader></province-cascader>
                </el-col>
                <el-col :span="8">
                    <el-input :size="$size" placeholder="请输入关联商户的安全码或商户ID"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" :size="$size">查询</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="30">
                </el-table-column>
                <el-table-column
                    label="商户ID">
                </el-table-column>
                <el-table-column
                    label="联系人账号">
                </el-table-column>
                <el-table-column
                    label="联系人姓名">
                </el-table-column>
                <el-table-column
                    label="商户类型">
                </el-table-column>
                <el-table-column
                    label="商户首次入住时间">
                </el-table-column>
                <el-table-column
                    label="账号状态">
                    <template slot-scope="scope">
                        冻结/激活<br>
                        待审核
                    </template>
                </el-table-column>
            </el-table>
            <div class="btn-group">
                <el-button :size="$size" @click="showDialog=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="confirmSelectMerchant">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue"
    export default {
        components: {
            ProvinceCascader
        },
        props: {
            value: {
                type: Object
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showDialog: false,
                tableData: [{}]
            }
        },
        methods: {
            hideDialog() {
                this.$emit("update:visible", false)
            },
            confirm() {
                console.log("选择添加项")
                this.hideDialog();
            },
            relation() {
                this.showDialog = true;
            },
            handleSelectionChange(value) {
                console.log(value)
            },
            confirmSelectMerchant() {
                this.showDialog = false;
            }
        },
        watch: {
            visible(val) {
                console.log(val)
                val===false? this.hideDialog():""
            }
        }
    }
</script>
<style scoped lang="scss">
    /deep/ .el-row {
        margin-bottom: 10px;
    }
</style>
