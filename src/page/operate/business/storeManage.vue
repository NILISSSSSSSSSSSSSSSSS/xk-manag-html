<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>店铺列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="getList()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-position="right" label-width="120px" :model="formData" class="xk-search" @keyup.enter.native.prevent="getList">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="店铺编号：">
                            <el-input :size="$size" placeholder="请输入店铺编号" v-model="formData.shopCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺名称：">
                            <el-input :size="$size" placeholder="请输入店铺名称" v-model="formData.shopName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联盟商编号：">
                            <el-input :size="$size" placeholder="请输入联盟商编号" v-model='formData.merchantCode'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="联盟商名称：">
                            <el-input :size="$size" placeholder="请输入联盟商名称" v-model='formData.merchantName'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe class="margintop20" fit v-loading="loading">
                <el-table-column label="店铺编号" prop="code" min-width='120'></el-table-column>
                <el-table-column label="店铺名称" prop="name" min-width='120'></el-table-column>
                <el-table-column label="财务是否独立" prop="independence" min-width='120'>
                    <template slot-scope='scope'>
                        <span>{{scope.row.independence?"独立":"不独立"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联盟商编号" prop="merchantCode" min-width='120'></el-table-column>
                <el-table-column label="联盟商名称" prop="merchantName" min-width='120'></el-table-column>
                <el-table-column label="地址" prop="address" min-width='120'></el-table-column>
                <el-table-column label="在架状态" prop="onLine" min-width='120'>
                    <template slot-scope='scope'>
                        <span>{{onLineStatus(scope.row.onLine)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="secondAuthStatus" min-width='120'>
                    <template slot-scope='scope'>
                        <span>{{authStatus(scope.row.secondAuthStatus)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="营业开关" prop="onBusiness" min-width='120'>
                    <template slot-scope='scope'>
                        <span>{{scope.row.onBusiness?"开启":"关闭"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="id" min-width='350'>
                    <template slot-scope='scope'>
                        <div>
                            <el-button :size='$size' type='primary' @click='toDetail(scope.row)'>查看详情</el-button>
                            <el-button :size='$size' type='danger' v-if='scope.row.onLine==1' @click='down(scope.row)' :loading="btnLoading">下架店铺</el-button>
                            <!-- <el-button :size='$size' type='info' v-if='scope.row.onLine<=0' @click='up(scope.row)' :loading="btnLoading">上架店铺</el-button> -->
                            <el-button :size='$size' type='info' v-if='scope.row.onLine==1&&scope.row.onBusiness==0' @click='open(scope.row)'
                                :loading="btnLoading">开启营业
                            </el-button>
                            <el-button :size='$size' type='warning' v-if='scope.row.onLine==1&&scope.row.onBusiness==1' @click='close(scope.row)'
                                :loading="btnLoading">停止营业
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="total" @change="changePage"></pagination>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formData: { shopCode: '', shopName: '', merchantCode: '', merchantName: '' },
            tableData: [],
            page: {
                limit: 10,
                page: 1
            },
            total: 0,
            loading: false,
            btnLoading: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        onLineStatus(status) {
            switch (status) {
                case 0:
                    return '下架';
                    break;
                case 1:
                    return '上架';
                    break;
                case -1:
                    return '后台强制下架';
                    break;

                default:
                    break;
            }
        },
        authStatus(status) {
            switch (status) {
                case 'SUBMIT':
                    return '提交认证';
                    break;
                case 'SUCCESS':
                    return '认证成功';
                    break;
                case 'FAILED':
                    return '认证失败';
                    break;
                default:
                    return '暂无';
                    break;
            }
        },
        getList() {
            this.loading = true;
            let data = {};
            this.$http
                .get(this.$api.mShopQPageList, { ...this.page, ...this.formData }, true)
                .then(res => {
                    console.log('TCL: getList -> res', res);
                    this.total = res.total;
                    this.tableData = res.data;
                    this.loading = false;
                })
                .catch(err => {
                    console.log('TCL: getList -> err', err);
                    this.loading = false;
                });
        },
        resetForm() {
            this.formData = { shopCode: '', shopName: '', merchantCode: '', merchantName: '' };
            this.getList();
        },
        toDetail(item) {
            this.$router.push({ path: '/storeDetail', query: { id: item.id } });
        },
        // 下架
        down(item) {
            this.btnLoading = true;
            // mShopDisable
            this.$confirm('确认执行该操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            })
                .then(res => {
                    let id = item.id;
                    return this.$http.post(this.$api.mShopDisable, { id }, true);
                })
                .then(res => {
                    console.log('TCL: down -> res', res);
                    this.getList();
                    this.btnLoading = false;
                })
                .catch(err => {
                    console.log('TCL: down -> err', err);
                    this.btnLoading = false;
                });
        },
        // 上架
        // up(item) {
        //     this.btnLoading = true;
        //     // mShopEnable
        //     this.$confirm('是否上架店铺?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     })
        //         .then(res => {
        //             let id = item.id;
        //             return this.$http.post(this.$api.mShopEnable, { id }, true);
        //         })
        //         .then(res => {
        //             console.log('TCL: up -> res', res);
        //             this.getList();
        //             this.btnLoading = false;
        //         })
        //         .catch(err => {
        //             console.log('TCL: up -> err', err);
        //             this.btnLoading = false;
        //         });
        // },
        open(item) {
            this.btnLoading = true;
            this.$confirm('确认执行该操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            })
                .then(res => {
                    this.business({ id: item.id, status: 1 });
                })
                .catch(err => {
                    this.btnLoading = false;
                });
        },
        close(item) {
            this.btnLoading = true;
            this.$confirm('确认执行该操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            })
                .then(res => {
                    this.business({ id: item.id, status: 0 });
                })
                .catch(err => {
                    this.btnLoading = false;
                });
        },

        /**
         * @description: 营业开关 updateShopOnbusinessStatus
         * @param Object:{id:String,status:Number}
         * @return:
         */
        business({ id, status }) {
            if (!id) return;
            this.$http
                .post(this.$api.updateShopOnbusinessStatus, { id, status }, true)
                .then(res => {
                    console.log('TCL: business -> res', res);
                    this.btnLoading = false;
                    this.getList();
                })
                .catch(err => {
                    console.log('TCL: business -> err', err);
                    this.btnLoading = false;
                    if (err.code == 2002) {
                        //特殊情况,依旧能开关成功
                        this.getList();
                    }
                    this.$message.error(err.message)
                });
        },
        changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
