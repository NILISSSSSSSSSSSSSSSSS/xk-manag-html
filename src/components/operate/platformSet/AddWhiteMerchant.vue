<template>
    <el-dialog title='新增加盟商' width="900px" :visible.sync="dialog" :before-close="handleClose">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>搜索
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="getMerchantList">搜索</el-button>
                        <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                 <el-form :label-position="right"  :model="searchForm" :rules="rules" ref="searchForm">
                     <el-form-item prop="search">
                         <el-row>
                             <el-col :span="10">
                                 <el-input :size="$size" placeholder="输入商户ID/商户账号/联系人" v-model="searchForm.search"></el-input>
                             </el-col>
                         </el-row>
                     </el-form-item>
                 </el-form>
            </div>
            <div class="xk-radius margintop20">
                <el-table :data="tableData" width="100%" stripe v-loading="loading" class='margintop20' 
               @current-change="handleSelection" highlight-current-row>
                    <!-- <el-table-column type="selection"></el-table-column> -->
                    <!-- <el-table-column  label="商户ID" prop="merchantCode"></el-table-column> -->
                    <el-table-column label="商户ID" prop="merchantId"></el-table-column>
                    <el-table-column  label="商户联系人" prop="phone"></el-table-column>
                    <el-table-column  label="联系人姓名" prop="realName"></el-table-column>
                    <el-table-column  label="加盟商类型">
                        <template slot-scope="scope">
                            {{getMerchantTypes(scope.row.merchantTypes)}}
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addMerchant(scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination> -->
                <div class="content">
                    <el-button :size="$size" type="plain" @click="handleClose">返回</el-button>
                </div>
            </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'addWhiteMerchant',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tableData: [],
            loading: false,
            pageData: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            dialog: false,
            searchForm: {
                search: ''
            },
            rules: {
                search: [{ required: true, message: "搜索值不能为空"}]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            this.dialog = val;
        }
    },
    methods: {
        resetForm() {
            this.searchForm = [];
        },
        getMerchantTypes(val) { // 商户类型
            let types = ''
            for(let type of val) {
            switch(type) {
                case 'company':
                    types  = types + ' ' +"合伙人";
                    break;
                case 'anchor':
                    types  = types + ' ' +"主播";
                    break;
                case 'shops':
                    types  = types + ' ' + "商户";
                    break;
                case 'personal':
                    types = types + ' ' + "个人/公司/企业"
                    break;
                case 'familyL1':
                    types = types + ' ' + '家族长'
                    break;
                case 'familyL2':
                    types = types + ' ' + '公会' 
                    break;
                }
            }
            return types;
      },
        getMerchantList() { // 商户列表
            this.$refs["searchForm"].validate((val) => {
                if(val) {
                    this.loading = true;
                    let param = {key: this.searchForm.search}
                    this.$http.get(this.$api.merchantQList, param, true)
                    .then(res => {
                        this.loading = false;
                        console.log(res)
                        this.tableData = res
                        this.pageData.total = res.length ? res.length: this.pageData.total
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$message.error(err.message)
                    })
                } else {
                    return false;
                } 
            })  
        },
        addMerchant(val) {
           this.$confirm("确认将该商户加入白名单吗？", "提示", {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
           })
           .then(() => {
               let paramList = {
                   merchantId: val.merchantId,
                   phone: val.phone,
                   merchantCode: val.merchantCode,
                   realName: val.realName
               }
               console.log(paramList)
               this.$http.get(this.$api.merchantWhiteListCreate, paramList, true)
               .then(res => {
                   this.$message.success("添加成功");
                   this.tableData = [];
                   this.handleClose();
                   this.$emit("success")
               })
               .catch(err => {
                   this.$message.error("添加失败")
               })
           })
           .catch(() => {
               this.$message("已取消添加")
           })
        },
        handleClose() {
            this.$emit("update:dialogVisible", false)
            this.$refs["searchForm"].resetFields();
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
