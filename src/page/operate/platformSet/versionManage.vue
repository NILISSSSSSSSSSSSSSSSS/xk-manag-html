<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>版本管理
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-position="right" label-width="120px" :model="searchForm" class="xk-search">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="平台：" >
                                <el-select :size="$size" v-model="searchForm.app">
                                    <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备操作系统：" >
                                <el-select :size="$size" v-model="searchForm.deviceOs">
                                    <el-option v-for="item in Os" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                    <span></span>主版本列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="handleAdd" v-permission="'versionManageAdd'">新增</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="loading">
                <el-table-column label="平台" prop="app">
                    <template slot-scope="scope">
                        {{getPlatform(scope.row.app)}}
                    </template>
                </el-table-column>
                <el-table-column label="设备操作系统" prop="deviceOs">
                    <template slot-scope="scope">
                        {{getOs(scope.row.deviceOs)}}
                    </template>
                </el-table-column>
                <el-table-column label="版本名称" prop="name"></el-table-column>
                <el-table-column label="最新版本号" prop="strNewVersion"></el-table-column>
                <el-table-column label="升级说明" prop="updateMessage"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                       <el-button :size="$size" type="text" @click="goSubVersion(scope.row.id)" v-permission="'versionManageDetail'">查看子版本</el-button>
                       <el-button :size="$size" type="text" @click="handleEdit(scope.row)" :loading="scope.row.loading"
                       v-permission="'versionManageEdit'">编辑</el-button>
                       <el-button :size="$size" type="text" @click="handleDelete(scope.row.id)" v-permission="'versionManageDelete'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
         <el-dialog :visible.sync="versionDialog" width="550px" :before-close="handleClose" :title="title">
             <el-form :model="versionForm" ref="versionForm" label-width="120px">
                 <el-form-item label="app类型：" prop="app" :rules="{required: true, message: '请选择类型'}">
                     <el-select v-model="versionForm.app" :size="$size" style="width: 100%">
                         <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                 </el-form-item>
                 <el-form-item label="设备操作系统：" prop="deviceOs" :rules="{required: true, message: '请选择系统'}">
                     <el-select v-model="versionForm.deviceOs" :size="$size" style="width: 100%">
                         <el-option v-for="item in Os" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                 </el-form-item>
                 <el-form-item label="版本名称：" prop="name" :rules="{required: true, message: '不能为空'}">
                     <el-input :size="$size" v-model="versionForm.name"></el-input>
                 </el-form-item>
                  <el-form-item label="最新版本号：" prop="strNewVersion" :rules="rules.version">
                     <el-input :size="$size" v-model="versionForm.strNewVersion" placeholder="例：1.1.11"></el-input>
                 </el-form-item>
                  <el-form-item label="升级说明：" prop="updateMessage" :rules="{required: true, message: '不能为空'}">
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
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'versionMessage',
    data() {
        let version = (rulw, value, callback) => {
            if(!/^[1-9]+[0-9]*\.([0-9]{1,2})\.([0-9]{1,2})$/.test(value)) {
                callback(new Error("请输入格式为nx.x(x).x(x)的版本号"))
            } else {
                callback();
            }
        }
        return {
            tableData: [],
            platform: [
                {label: '用户app', value: 'ua'},
                {label: '商户app', value: 'ma'},
                {label: '直播app', value: 'zb'},
                {label: '骑手app', value: 'da'},
            ],
            Os: [
                {label: '未知', value: 'unknown'},
                {label: 'iOS', value: 'ios'},
                {label: '安卓', value: 'android'}
            ],
            searchForm: {},
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            versionForm: {},
            versionDialog: false,
            loading: false,
            confirmLoading: false,
            detailLoading: false,
            title: '',
            type: '',
            rules: {
                version: [{validator: version}]
            }
        }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getVersionList();
    },
    computed: {
        ...mapState({
          searchData: state => state.operatePlatform.versionCommit
        })
    },
    methods: {
        ...mapMutations({
        setVersionCommit: "operatePlatform/setVersionCommit"
      }),
        getPlatform(val) {
            let name = '';
            for(let item of this.platform) {
                if(val === item.value) {
                    name = item.label;
                    break;
                }
            }
            return name;
        },
        getOs(val) {
            let name = '';
            for(let item of this.Os) {
                if(val === item.value) {
                    name = item.label;
                    break;
                }
            }
            return name;
        },
        resetForm() {
            this.searchForm = {};
        },
        search() {
            this.pageData.currentPage = 1;
            this.getVersionList();
        },
        getVersionList() {
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize,
                app: this.searchForm.app,
                deviceOs: this.searchForm.deviceOs
            }
            console.log(paramList)
            this.loading = true
            this.$http.get(this.$api.clientVersionDefinePage, paramList, true)
            .then(res => {
                this.setVersionCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}))
                this.loading = false
                this.tableData = res.data;
                console.log(res)
                this.pageData.total = res.total ? res.total : 0
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page,pageSize) { //分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getVersionList();
        },
        goSubVersion(id) {
            // this.$router.push("/subVersionManage")
            this.$router.push({path: "/subVersionManage", query: {id: id}})
        },
        handleEdit(val) {
            this.title = '编辑版本'
            this.type = 'edit'
            this.$set(val, 'loading', true)
            this.$http.get(this.$api.clientVersionDefineDetail, {id: val.id}, true)
            .then(res => {
                this.versionForm = res
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
            this.versionForm = {}
        },
        handleClose() {
            this.versionDialog = false
            this.$refs["versionForm"].resetFields();
        },
        addVersion() {
            this.$refs["versionForm"].validate(valid => {
                if(valid) {
                    this.confirmLoading = true;
                    this.versionForm.newVersion = this.versionForm.strNewVersion
                    this.$http.post(this.$api.clientVersionDefineCreate, this.versionForm, true)
                    .then(res => {
                        this.confirmLoading = false;
                        this.$message.success("创建成功");
                        this.handleClose();
                        this.getVersionList();
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
                    console.log('verison')
                    console.log(this.versionForm)
                    this.versionForm.newVersion = this.versionForm.strNewVersion
                    this.$http.post(this.$api.clientVersionDefineUpdate, this.versionForm, true)
                    .then(res => {
                        this.confirmLoading = false;
                        this.$message.success("编辑成功");
                        this.handleClose();
                        this.getVersionList();
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
                this.$http.get(this.$api.clientVersionDefineDelete, {id: id}, true)
                .then(res=> {
                    this.$message.success("删除成功");
                    this.getVersionList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(() => {
                this.$message.info("已取消");
            })
        }
    }
}
</script>

<style>

</style>
