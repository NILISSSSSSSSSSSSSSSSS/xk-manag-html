<template>
    <div class="xk-container goods-service-manage">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" size="small" @click="clearInput">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form class="xk-search" label-width="120px" :model="searchForm">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="服务名：">
                                    <el-input :size="$size" placeholder="请输入服务名" v-model.trim="searchForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="pubBackground marintop20 solidtop xk-radius">
                    <div class='xk-title'>
                        <div class="vus-title">
                            <span></span>列表
                        </div>
                        <div class="vus-btn">
                            <el-button type="success" :size="$size" @click="add()" v-permission="'goodsServiceManageAdd'">新增服务</el-button>
                        </div>
                        <div class="vus-bottom"></div>
                    </div>
                    <el-table :data="tableData" v-loading="loadingTable">
                        <el-table-column label="服务ID" prop="id" width="250"></el-table-column>
                        <el-table-column label="服务名称" prop="name" width="250"></el-table-column>
                        <el-table-column label="服务图标" width="250">
                            <template slot-scope="scope">
                                <div class="pic-url">
                                    <img :src="scope.row.picUrl" alt="" @click="$viewImage(scope.row.picUrl)">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="服务描述" prop="message"></el-table-column>
                        <el-table-column label="操作" fixed="right" width="180">
                            <template slot-scope="scope">
                                <el-button :size="$size" type="primary" @click="editService(scope.row)" v-permission="'goodsServiceManageEdit'">编辑</el-button>
                                <el-button :size="$size" :loading="scope.row.loading" type="danger" @click="delService(scope.row)" v-permission="'goodsServiceManageDel'">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
                </div>
            </div>
        </div>

        <el-dialog :visible.sync="goodsVisible" width="500px" :title="newStatus==='add'? '新增商品服务': '修改商品服务'" class="goods-info-visible">
            <el-form label-width="120px" :model="goodsForm" ref="goodsForm" :rules="serviceRules">
                <el-form-item label="服务名称：" prop="name">
                    <el-input :size="$size" placeholder="请输入服务名称" v-model.trim="goodsForm.name" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="服务描述：" prop="message">
                    <el-input :size="$size"
                        type="textarea" 
                        v-model="goodsForm.message" 
                        resize="none" 
                        placeholder="请输入服务描述（88位）" 
                        :autosize="{minRows: 4, maxRows: 4}" 
                        maxlength="88" 
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="服务图标：" prop="picUrl">
                    <image-upload :more="false" v-model="goodsForm.picUrl" >
                        <img class="img-show" v-if="goodsForm.picUrl" :src="goodsForm.picUrl" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                    <p><span class="xk-danger">*  </span><span class="limint-txt">服务图表最多一个，尺寸限制20px*20px</span></p>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" type="success" @click="goodsVisible = false;">取消</el-button>
                <el-button :size="$size" :loading="loadingService" :disabled="loadingService" type="primary" @click="submitEditService('goodsForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ImageUpload from "@/components/ImageUpload.vue"

    export default {
        components: {
            ImageUpload
        },
        data() {
            return {
                searchLoading: false,
                loadingTable: false,
                newStatus: 'add',
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                searchForm: {},
                tableData: [],
                goodsForm: {},
                goodsVisible: false,
                loadingService: false,
                serviceRules: {
                    name: [
                        { required: true, trigger: 'blur', message: '不能为空！' },
                        { max: 18, min: 2, message: '请输入2-18位服务名称！' }
                    ],
                    message: [
                        { required: true, trigger: 'blur', message: '不能为空！' },
                        { max: 88, min: 2, message: '请输入2-88位服务描述！' }
                    ],
                    picUrl: [{ required: true, trigger: 'change', message: '不能为空' }]
                },
            }
        },
        created() {
            this.goodsServicesList();
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.goodsServicesList();
            },
            search() {
                this.searchLoading = true;
                this.page.page = 1;
                this.goodsServicesList();
            },
            clearInput() {
                this.page = {
                    page: 1,
                    limit: 10,
                    total: 0
                }
                this.searchForm = {};
                this.goodsServicesList();
            },
            //查询所有有效的商品服务
            goodsServicesList() {
                this.loadingTable = true;
                let param = {
                    name: this.searchForm.name,
                    limit: this.page.limit,
                    page: this.page.page
                }
                this.$http
                .get(this.$api.sgoodsServicesByName, param, true)
                .then(res=>{
                    console.log(res)
                    this.loadingTable = false;
                    this.searchLoading = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.loadingTable = false;
                    this.searchLoading = false;
                    this.$message.error(err.message);
                })
            },
            editService(row) {
                this.newStatus = 'edit';
                this.goodsForm = JSON.parse(JSON.stringify(row));
                this.goodsVisible = true;
            },
            delService(row) {
                this.$set(row, 'loading', true);
                this.$http.post(this.$api.sgoodsServiceDeleteAfterGoods, {id: row.id}, true)
                .then(res=>{
                    console.log(res)
                    if(res.status) {
                        this.$confirm(`是否删除 ${row.name} 服务？`, "提示", {
                                confirmButtonText: '确定',
                                type: 'warning',
                                cancelButtonText: "取消"
                            })
                            .then(()=>{
                                this.$http
                                .post(this.$api.sgoodsServiceDelete, {id: row.id}, true)
                                .then(res=>{
                                    this.$set(row, 'loading', false);
                                    this.$message.success('删除成功！');
                                    this.goodsServicesList();
                                })
                                .catch(err=>{
                                    this.$set(row, 'loading', false);
                                    this.$message.error(err.message);
                                })
                            })
                            .catch(()=>{
                                this.$set(row, 'loading', false);
                                this.$message.info('取消删除！')
                            })
                    }else{
                        this.$set(row, 'loading', false);
                        this.$message.error('当前服务已绑定商品，不可删除！')
                    }
                })
                .catch(err=>{
                    this.$set(row, 'loading', false);
                    this.$message.error(err.message);
                })
            },
            add() {
                this.newStatus = 'add';
                this.goodsForm = {};
                this.goodsVisible = true;
            },
            //提交修改、新增的服务
            submitEditService(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let param = {
                            picUrl: this.goodsForm.picUrl,
                            name: this.goodsForm.name,
                            message: this.goodsForm.message
                        }
                        let url = this.$api.sgoodsServiceUpdate;
                        this.goodsForm.id? param.id = this.goodsForm.id: url = this.$api.sgoodsServiceCreate;
                        this.loadingService = true;
                        this.$http.post(url, {
                            sgoodsService: param
                            }, true)
                            .then(res=>{
                                this.$message.success(param.id?'修改成功！': '新增成功！');
                                this.loadingService = false;
                                this.goodsVisible = false;
                                this.goodsServicesList()
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                                this.loadingService = false;
                            })
                    }else{
                        return false;
                    }
                })
            }
        },
        watch: {
            goodsVisible(val) {
                !val && this.$refs['goodsForm']
                    ? this.$refs['goodsForm'].resetFields()
                    : null
            }
        }
    }
</script>

<style scoped lang="scss">
    .goods-service-manage {
        .pic-url {
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            img {
                width: 100%;
                vertical-align: middle;
                height: auto;
            }
            &::after{
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 0;
                height: 100%;
            }
        }
        .goods-info-visible {
            .img-show{
                width: 60px!important;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 56px;
                height: 56px;
                line-height: 56px;
                text-align: center;
                border: 1px dashed #c0c0c1
            }
            .el-upload{
                width: 56px;
                height: 5px;
                img{
                    width: 100%;
                }
            }
        }
    }
</style>
