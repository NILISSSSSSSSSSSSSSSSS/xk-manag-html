<template>
    <el-dialog width="1200px" :visible.sync="dialog" title="选择主播" :before-close="handleClose">
        <el-form>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item>
                        <el-select :size="$size" style="width: 100%"></el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-select :size="$size" style="width: 100%"></el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                       <el-input :size="$size" style="width: 100%"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading">
            <el-table-column type="selection" width="55px"></el-table-column>
            <el-table-column  label="商户ID" prop="id"></el-table-column>
            <el-table-column  label="联系人账号" prop="id"></el-table-column>
            <el-table-column  label="联系人姓名" prop="id"></el-table-column>
            <el-table-column  label="商户类型">
                <template slot-scope="scope">
                    {{"所有所属类型"}}
                </template>
            </el-table-column>
            <el-table-column  label="商户首次入驻时间" prop="id"></el-table-column>
            <el-table-column  label="账号状态">
                <template slot-scope="scope">
                    {{1213}}
                </template>
            </el-table-column>
            <el-table-column  label="激活" >
                <template slot-scope="scope">
                    <el-button type="text" :size="$size">从关联列表删除</el-button>
                </template>
            </el-table-column>
       </el-table>
       <pagination></pagination>
       <div class="content">
           <el-button type="primary" :size="$size" @click="handleClose">确定</el-button>
           <el-button type="plain" :size="$size" @click="handleClose">取消</el-button>
       </div>
    </el-dialog>    
</template>

<script>
export default {
    name: 'addHost',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialog: false,
            tableData: []
        }
    },
    watch: {
        dialogVisible(val) {
            this.dialog = val
        }
    },
    methods: {
        handleClose() {
            this.$emit("update:dialogVisible", false)
        }
        
    }
}
</script>

<style lang="scss" scoped>
.content {
    text-align: center;
    margin-top: 20px;
}

</style>
