<template>
    <div class="xk-container">
        <!--内容-->
        <div class="xk-body commodity-sales">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>
                        首页banner管理
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" v-permission="'bannerListAdd'" :size="$size" @click="addBanner">添加轮播图</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <div class="banner-table">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="全部" name=""></el-tab-pane>
                            <el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in opations"
                                         :key="index"></el-tab-pane>
                        </el-tabs>
                        <el-table
                                :data="tableData"
                                :size="$size"
                                stripe
                                border=""
                                v-loading="vloading"
                                style="width: 100%"
                        >
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="bannerModule" label="所属模块">
                                <template slot-scope="scope">{{scope.row.bannerModule | bannerModule}}</template>
                            </el-table-column>
                            <el-table-column prop="templateName" label="模板">
                                <template slot-scope="scope">{{scope.row.template | templateName}}</template>
                            </el-table-column>
                            <el-table-column prop="status" label="状态">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.status==='active'? '#67C23A' : '#E6A23C'}">{{scope.row.status==='active'?'正常':'暂停'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="地区">
                                <template slot-scope="scope">
                                    <span>{{scope.row.provinceName}}</span>
                                    <span v-if="scope.row.cityName"> / {{scope.row.cityName}}</span>
                                    <span v-if="scope.row.districtName"> / {{scope.row.districtName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button v-permission="'bannerListEdit'" type="primary" :loading="scope.row.loading" :size="$size"
                                               @click="fnchakan(scope.row)">
                                        编辑
                                    </el-button>
                                    <el-button v-permission="'bannerListDelete'" type="danger" :size="$size" @click="fndel(scope.row)" :loading="load">
                                        删除
                                    </el-button>
                                    <el-button
                                            type="warning"
                                            :size="$size"
                                            v-permission="'bannerListStop'"
                                            @click="fnhandel(scope.row)"
                                            :loading="scope.row.loadingDis"
                                            v-if="scope.row.status === 'active'"
                                    >{{scope.row.status === 'active' ? '停用' : '开启'}}
                                    </el-button>
                                    <el-button
                                            type="warning"
                                            :size="$size"
                                            v-permission="'bannerListStart'"
                                            @click="fnhandel(scope.row)"
                                            :loading="scope.row.loadingDis"
                                            v-if="scope.row.status !== 'active'"
                                    >{{scope.row.status === 'active' ? '停用' : '开启'}}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                                :currentPage="currentPage"
                                :pageSize="pageSize"
                                :total="total"
                                @change="fnpagechange"
                        ></Pagination>
                    </div>
                </div>
            </div>
        </div>
        <banner-add :dialogVisible.sync="dialogVisible" :bannerModel="activeName"
                    :bannerDetail="bannerDetail"
                    @addsuccess="addsuccess"></banner-add>
    </div>
</template>

<script>
    import BannerAdd from '../../../components/operrate/BannerAdd.vue'
    import ProvinceCascader from '../../../components/ProvinceCascader'

    export default {
        data() {
            return {
                dialogVisible: false,
                xkrefresh: false,
                bannerDetail: {},
                categoryJF: {},
                categorySF: {},
                bannerModel: "XKSQUARE",
                activeName: "",
                opations: JSON.parse(localStorage.getItem("bannerModule")),
                tableData: [],
                dochange: false,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                vloading: false,
                load: false,
                load1: false, //查看修改
                handload: [],
                id: "",
            };
        },
        components: {
            BannerAdd,
            ProvinceCascader
        },
        created() {
        },
        methods: {
            addBanner() {
                this.bannerDetail = {};
                this.dialogVisible = true;
            },
            addsuccess() {
                this.dialogVisible = false;
                this.xkrefresh = !this.xkrefresh;
                this.getThisPage();
            },
            fnpagechange(currentPage, pageSize) {
                this.currentPage = currentPage;
                this.pageSize = pageSize;
                this.getThisPage();
            },
            fnchakan(target) {
                this.$set(target, "loading", true);
                this.$http.get(this.$api.bannerDetail, {id: target.id}, true)
                    .then(res => {
                        this.dialogVisible = true;
                        this.$set(target, "loading", false);
                        this.bannerDetail = res;
                    })
                    .catch(err => {
                        this.$set(target, "loading", false);
                    });
            },
            fndel(target) {
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                })
                    .then(() => {
                        this.load = true;
                        this.$http
                            .post(this.$api.bannerDelete, {id: target.id}, true)
                            .then(res => {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.load = false;
                                this.getThisPage();
                            })
                            .catch(err => {
                                this.$message.error("操作失败！");
                                this.load = false;
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            fnhandel(target) {
                this.$set(target, "loadingDis", true);
                if (target.status === "active") {
                    this.$http.post(this.$api.bannerDisabled, {id: target.id}, true)
                        .then(res => {
                            this.$set(target, "status", "disabled");
                            this.$set(target, "loadingDis", false);
                        })
                        .catch(err => {
                            this.$message.error(err.message);
                            this.$set(target, "loadingDis", false);
                        });
                } else {
                    this.$http.post(this.$api.bannerEnabled, {id: target.id}, true)
                        .then(res => {
                            this.$set(target, "status", "active");
                            this.$set(target, "loadingDis", false);
                        })
                        .catch(err => {
                            this.$message.error(err.message)
                            this.$set(target, "loadingDis", false);
                        });
                }
            },
            fnchange() {
                this.dochange = !this.dochange;
                this.load1 = true;
            },
            changsuccess() {
                this.load1 = false;
                this.getThisPage();
                this.dialogVisible = false;
            },
            changfail() {
                this.load1 = false;
            },
            getThisPage(data = {page: this.currentPage, limit: this.pageSize}) {
                this.vloading = true;
                if (this.activeName != "0") {
                    data.bannerModule = this.activeName;
                }
                this.$http.get(this.$api.bannerPage, data, true)
                    .then(res => {
                        this.total = res? res.total: 0;
                        this.vloading = false;
                        [this.total, this.vloading, this.tableData] = [res.total, false, res.data];

                        if (res.data) {
                            let province = new Map(JSON.parse(localStorage.getItem("xk-province")));
                            let city = new Map(JSON.parse(localStorage.getItem("xk-city")));
                            let district = new Map(JSON.parse(localStorage.getItem("xk-district")));
                            for(let item of res.data){
                                item.provinceName = province.get(item.provinceCode) ? province.get(item.provinceCode).name : '全国';
                                item.cityName = city.get(item.cityCode) ? city.get(item.cityCode).name : "";
                                item.districtName = district.get(item.districtCode) ? district.get(item.districtCode).name : "";
                            }
                        }

                    })
                    .catch(err => {
                        this.tableData = [];
                        this.vloading = false;
                        this.$message.error(err.message)
                    });
            }
        },
        watch: {
            activeName(val) {
                this.currentPage = 1;
                this.getThisPage();
            }
        }
    };
</script>

<style scoped>
    .banner-table .el-button {
        margin-bottom: 10px;
    }

    .banner-table .el-dialog__footer {
        text-align: center;
    }
</style>