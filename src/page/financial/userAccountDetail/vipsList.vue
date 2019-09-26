<template>
    <div class = 'vips-list xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    会员列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="fnSearch" :loading="searchLoading">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="fnClear">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-width="120px" :model="searchData" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="用户ID：">
                                <el-input v-model="searchData.id" :size="$size" placeholder="请输入用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户手机号：">
                                <el-input v-model="searchData.phone" :size="$size" placeholder="请输入用户手机号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="UID：">
                                <el-input v-model="searchData.uid" :size="$size" placeholder="请输入UID"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="xk-body xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                border
                stripe
                v-loading="loading"
                style="width: 100%">
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column
                    prop="userId"
                    label="用户ID">
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户名称">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="xkUserLevel"
                    label="用户等级">
                </el-table-column>
                <el-table-column
                    prop="realName"
                    label="用户实名">
                </el-table-column>
                <el-table-column
                    prop="idCardNum"
                    label="身份证号码">
                </el-table-column>
                <el-table-column
                    label="消费券">
                    <template slot-scope="scope">
                        {{ scope.row.newXfq }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="晓可币">
                    <template slot-scope="scope">
                        {{ scope.row.newXkb }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="店铺消费券">
                    <template slot-scope="scope">
                        {{ scope.row.newXfqs }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="isFrozen"
                    label="用户状态">
                    <template slot-scope="scope">
                        {{scope.row.isFrozen ? "冻结" : "激活"}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作"
                    fixed="right"
                    width="100">
                    <template slot-scope="scope">
                        <el-button v-permission="'vipsListUser'" type="text" :size="$size" @click="fnLookUser(scope.row)">查看用户详情</el-button>
                        <el-button v-permission="'vipsListInfo'" type="text" :size="$size" @click="fnLookAccount(scope.row)">查看账户明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "page.page" :pageSize = "page.limit" :total = "page.total" @change = "fnpagechange"></Pagination>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
    name:'vipsList',
    data () {
        return {
            searchData:{
                id:"",
                phone:""
            },
            tableData:[],
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            loading:false,
            searchLoading:false,
        };
    },
    computed: {
        ...mapState({
            searchStateData: state => state.financialAccount.vipAccount
        })
    },
    created() {
        this.searchStateData
                ? (this.searchData = this.searchStateData.searchForm, this.page = this.searchStateData.page)
                : null;
        this.fnSearch();
    },
    methods: {
        ...mapMutations({
            setVipAccount: "financialAccount/setVipAccount"
        }),
        fnpagechange(currentPage,pageSize){
            this.page.page = currentPage ;
            this.page.limit = pageSize ;
            this.fnGetPage();
        },
        fnGetPage(obj={}){
            let params = {
                condition:{
                    ...obj,
                },
                limit:this.page.limit,
                page:this.page.page
            }
            console.log(params);
            this.loading = true ;
            this.$http.get(this.$api.UserAccountQPage,params , true).then((res) => {
                this.setVipAccount(Object.assign({searchForm: this.searchData}, {page: this.page}));
                console.log(res)
                this.loading = false ;
                this.searchLoading = false ;
                this.page.total = res? res.total: 0 ;
                this.tableData = res? res.data: [] ;
            }).catch((err) => {
                [this.loading, this.searchLoading, this.tableData, this.page.total] = [false, false, [], 0];
                this.$message.error('查询失败');
            });
        },
        fnSearch(){
            this.page.page = 1;
            let obj = {} ;
            this.searchLoading = true ;
            for (const key in this.searchData) {
                if (this.searchData[key]) {
                    obj[key] = this.searchData[key]
                }
            }
            console.log(obj)
            this.fnGetPage(obj)
        },
        fnClear(){
            this.searchData = {
                id:"",
                phone:""
            }
            this.fnGetPage()
        },
        fnLookUser(target){
            this.$router.push({
                path: '/userDetail',
                query: {
                    id: target.userId
                }
            })
        },
        fnLookAccount(target){
            this.$router.push({
                path:"/userAccount",
                query:{
                    id:target.userId
                }
            })
        },
    },
    watch: {}
}
</script>
<style scoped>
.el-button + .el-button{
    margin-left: 0
}
</style>