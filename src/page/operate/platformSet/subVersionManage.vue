<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>子版本管理
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-position="right" label-width="120px" :model="searchForm" class="xk-search">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="更新方式：" >
                                <el-select :size="$size" v-model="searchForm.updateType">
                                    <el-option v-for="item in updateType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
        </el-form>
            </div>
        </div>
        <div class="xk-radius margintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>子版本列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="handleAdd">新增</el-button>
                    <el-button type="plain" :size="$size" @click="goVersion">返回版本列表</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loading">
                <el-table-column label="客户端版本ID" prop="defId"></el-table-column>
                <el-table-column label="客户端版本" prop="strDefVersion"></el-table-column>
                <el-table-column label="最大版本" prop="strMaxVersion"></el-table-column>
                <el-table-column label="最小版本" prop="strMinVersion"></el-table-column>
                <el-table-column label="APP包字节大小" prop="appSize"></el-table-column>
                <el-table-column label="更新方式" prop="updateType">
                    <template slot-scope="scope">
                        {{getUpdateType(scope.row.updateType)}}
                    </template>
                </el-table-column>
                <el-table-column label="更新说明" prop="updateMessage"></el-table-column>
                <el-table-column label="下载地址" prop="url" width="200"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                       <!-- <el-button :size="$size" type="text" @click="goVersion">查看详情</el-button> -->
                       <el-button :size="$size" type="text" @click="handleEdit(scope.row)" :loading="scope.row.loading">编辑</el-button>
                       <el-button :size="$size" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
         <el-dialog :visible.sync="versionDialog" width="550px" :before-close="handleClose" :title="title">
             <el-form :model="versionForm" ref="versionForm" label-width="120px">
                 <el-form-item label="客户端版本：" prop="strDefVersion" :rules="this.type === 'edit' ? rules.notValid :rules.version">
                     <el-input :size="$size" v-model="versionForm.strDefVersion" :disabled="this.type ==='edit'" placeholder="例：1.1.11"></el-input>
                 </el-form-item>
                 <el-form-item label="最大版本：" prop="strMaxVersion" :rules="rules.maxVersion">
                     <el-input :size="$size" v-model="versionForm.strMaxVersion" placeholder="例：1.1.11"></el-input>
                 </el-form-item>
                 <el-form-item label="最小版本：" prop="strMinVersion" :rules="rules.minVersion">
                     <el-input :size="$size" v-model="versionForm.strMinVersion" placeholder="例：1.1.11"></el-input>
                 </el-form-item>
                 <el-form-item label="APP包大小：" prop="appSize" :rules="{required: true, message: '不能为空'}">
                     <el-row>
                         <el-col :span="20">
                            <el-input :size="$size" v-model="versionForm.appSize"></el-input>
                         </el-col>
                         <el-col :span="4" style="text-align: center">字节</el-col>
                     </el-row>
                 </el-form-item>
                 <el-form-item label="更新方式：" prop="updateType" :rules="{required: true, message: '请选择更新方式'}">
                     <el-select v-model="versionForm.updateType" :size="$size" style="width: 100%">
                         <el-option v-for="item in updateType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                 </el-form-item>
                 <el-form-item label="强制更新：">
                     <el-radio-group v-model="versionForm.isForce">
                         <el-radio :label="1">是</el-radio>
                         <el-radio :label="0">否</el-radio>
                     </el-radio-group>
                 </el-form-item>
                 <el-form-item label="下载地址：" prop="url" :rules="{required: true, message: '不能为空'}">
                     <el-input :size="$size" v-model="versionForm.url"></el-input>
                 </el-form-item>
                 <el-form-item label="更新说明：" prop="updateMessage" :rules="{required: true, message: '不能为空'}">
                     <el-input :size="$size" type="textarea" :autosize="{minRows: 3, maxRows: 4}" v-model="versionForm.updateMessage"></el-input>
                 </el-form-item>
             </el-form>
             <div style="text-align: center">
                 <el-button :size="$size" type="primary" v-if="this.type =='create'" @click="addVersion" :loading="confirmLoading">确定</el-button>
                 <el-button :size="$size" type="primary" v-if="this.type == 'edit'" @click="editVersion" :loading="confirmLoading">确定</el-button>
                 <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
             </div>
         </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'subVersionMessage',
    data() {
        let version = (rule, value, callback) => {
            if(!/^[1-9]+[0-9]*\.([0-9]{1,2})\.([0-9]{1,2})$/.test(value)) {
                callback(new Error("请输入格式为nx.x(x).x(x)的版本号"))
            } else {
                callback();
            }
        }
        let notValid = (rule, value, callback) => {
            callback();
        }
        return {
            tableData: [],
            updateType: [
                {label: '全量更新', value: 'all'},
                {label: '增量更新', value: 'part'},
                {label: '热更新', value: 'hot'}
            ],
            searchForm: [],
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading: false,
            versionDialog: false,
            versionForm: {
                isForce: 0
            },
            title: '',
            type: '',
            confirmLoading: false,
            rules: {
                version: [{validator: version}, {required: true}],
                maxVersion: [{validator: this.maxVersion}, {required: true}],
                minVersion: [{validator: this.minVersion}, {required: true}],
                notValid: [{validator: this.notValid}],
            }
        }
    },
    created() {
        this.getSubVersionList();
    },
    methods: {
        maxVersion(rule, value, callback) {
            if(!/^[1-9]+[0-9]*\.([0-9]{1,2})+\.([0-9]{1,2})+$/.test(value)) {
                callback(new Error("请输入格式为nx.x(x).x(x)的版本号"))
            } 
            // else if(value > this.versionForm.strDefVersion) {
            //     callback(new Error("最大版本号不能大于客户端版本"));
            // } else if(value <= this.versionForm.strMinVersion) {
            //     callback(new Error("最大版本号需大于最小版本号"));
            // } 
            else if(this.validVersionAge(value, this.versionForm.strDefVersion, 0)) {
                callback(new Error("最大版本号不能大于客户端版本"));
            } else if(this.validVersionAge(this.strMinVersion, value, 1)) {
                callback(new Error("最大版本号需大于最小版本号"))
            }
            else {
                callback();
            }
        },
        minVersion(rule, value, callback) {
            if(!/^[1-9]+[0-9]*\.([0-9]{1,2})\.([0-9]{1,2})$/.test(value)) {
                callback(new Error("请输入格式为nx.x(x).x(x)的版本号"))
            } 
            // else if(value > this.versionForm.strDefVersion) {
            //     callback(new Error("最小版本号不能大于客户端版本"));
            // } else if(value >= this.versionForm.strMaxVersion) {
            //     callback(new Error("最小版本号需小于最大版本号"));
            // } 
            else if(this.validVersionAge(value, this.versionForm.strDefVersion, 0)) {
                callback(new Error("最小版本号不能大于客户端版本"));
            } else if(this.validVersionAge(value, this.versionForm.strMaxVersion, 1)) {
                callback(new Error("最小版本号需小于最大版本号"));
            }
            else {
                callback();
            }
        },
        getUpdateType(val) {
            let name = '';
            for(let item of this.updateType) {
                if(val === item.value) {
                    name = item.label;
                    break;
                }
            }
            return name;
        },
        validVersionAge(val1, val2, status) { // 版本号大小比较,
            if(val1 && val2) {
                let aNum = 0;
                let bNum = 0;
                let a = val1.split('.')
                let b = val2.split('.')
                aNum = a[0] * 10000 + a[1] * 100 + a[2] * 1
                bNum = b[0] * 10000 + b[1] * 100 + b[2] * 1
                if(aNum == bNum) {
                    return status ? true : false
                }
                if(aNum > bNum) {
                    return true
                } else {
                    return false
                }
            }
        },
        resetForm() {
            this.searchForm = {};
        },
        goVersion() {
            this.$router.push("/versionManage");
        },
        search() {
            this.pageData.currentPage = 1;
            this.getSubVersionList();
        },
        getSubVersionList() {
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                updateType: this.searchForm.updateType,
                defId: this.$route.query.id
            }
            console.log(paramList);
            this.loading = true
            this.$http.get(this.$api.clientVersionInstancePage, paramList, true)
            .then(res => {
                this.loading = false
                this.tableData = res.data;
                console.log(res.data)
                this.pageData.total = res.total ? res.total : 0
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page,pageSize) { //分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getSubVersionList();
        },
        handleEdit(val) {
            this.title = '编辑版本'
            this.type = 'edit'
            this.$set(val, 'loading', true)
            this.$http.get(this.$api.clientVersionInstanceDetail, {id: val.id}, true)
            .then(res => {
                this.versionForm = res
                console.log('detail')
                console.log(res)
                 this.$set(val, 'loading', false)
                this.versionDialog = true
            })
            .catch(err => {
                this.$message.error(err.message);
                 this.$set(val, 'loading', false)
            })
        },
        handleAdd() {
            this.title = '新增版本'
            this.type = 'create'
            this.versionDialog = true
            this.versionForm = {isForce: 0}
        },
        handleClose() {
            this.versionDialog = false
            this.$refs["versionForm"].resetFields();
        },
        addVersion() {
            this.$refs["versionForm"].validate(valid => {
                if(valid) {
                    this.confirmLoading = true;
                    this.versionForm.defId = this.$route.query.id
                    this.versionForm.newVersion = this.versionForm.strNewVersion
                    this.versionForm.defVersion = this.versionForm.strDefVersion
                    this.versionForm.maxVersion = this.versionForm.strMaxVersion
                    this.versionForm.minVersion = this.versionForm.strMinVersion
                    console.log('version')
                    console.log(this.versionForm)
                    this.$http.post(this.$api.clientVersionInstanceCreate, this.versionForm, true)
                    .then(res => {
                        this.confirmLoading = false;
                        this.$message.success("创建成功");
                        this.handleClose();
                        this.getSubVersionList();
                    })
                    .catch(err => {
                        this.confirmLoading = false;
                        this.$message.error(err.message)
                    })
                } else {
                    return false;
                }
            })
        },
        editVersion() {
            this.$refs["versionForm"].validate(valid => {
                if(valid) {
                    this.confirmLoading = true;
                    console.log('version')
                    console.log(this.versionForm)
                    this.versionForm.newVersion = this.versionForm.strNewVersion
                    this.versionForm.defVersion = this.versionForm.strDefVersion
                    this.versionForm.maxVersion = this.versionForm.strMaxVersion
                    this.versionForm.minVersion = this.versionForm.strMinVersion
                    this.$http.post(this.$api.clientVersionInstanceUpdate, this.versionForm, true)
                    .then(res => {
                        this.confirmLoading = false;
                        this.$message.success("编辑成功");
                        this.handleClose();
                        this.getSubVersionList();
                    })
                    .catch(err => {
                        this.confirmLoading = false;
                        this.$message.error(err.message)
                    })
                } else {
                    return false;
                }
            })
        },
        handleDelete(id) {
            this.$confirm("确定删除该版本？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(res => {
                this.$http.get(this.$api.clientVersionInstanceDelete, {id: id}, true)
                .then(res=> {
                    this.$message.success("删除成功");
                    this.getSubVersionList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消");
            })
        },
    }
}
</script>

<style>

</style>
