<template>
    <div class = 'drying-list xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                 <span></span>
                    AA大乐透晒单列表
                </div>
                <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="fnSearch" :loading="loading.searchLoading">查 询</el-button>
                    <el-button type='danger' :size='$size' @click="fnClear" :loading="loading.clearLoading">清 空</el-button>
                </div>
                <div class='vus-bottom'></div>
                <el-form :size="$size" 
                        :inline="true" 
                        :model="searchData"
                        label-position='right'
                        label-width='120px'
                        class="demo-form-inline xk-search">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label='参与期数：'>
                                    <el-input v-model="searchData.invoiceNo" placeholder="输入参与期数"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label='用户ID：'>
                                    <el-input v-model="searchData.userId" placeholder="输入用户ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label='手机号码：'>
                                    <el-input v-model="searchData.phone" placeholder="输入手机号码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label='晒单时间：'>
                                    <el-date-picker
                                        v-model="searchData.time"
                                        :size="$size"
                                        value-format="timestamp"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                </el-form>
            </div>
        </div>

        <div class="xk-body xk-radius marintop20">
            <div class="xk-title">
                <div class='vus-title'>
                    <span></span>
                    列表
                </div>
                <div class="vus-btn">
                    <el-radio-group v-model="auditStatus" :size="$size">
                        <el-radio-button label="">全部</el-radio-button>
                        <el-radio-button label="unAudited">待审核</el-radio-button>
                        <el-radio-button label="unApproved">未通过</el-radio-button>
                        <el-radio-button label="verified">已通过</el-radio-button>
                    </el-radio-group>
                </div>
                <div class='vus-bottom'></div>
            </div>
            <el-table
            :data="tableData"
            border
            stripe
            v-loading="loading.tableLoading"
            style="width: 100%">
                <el-table-column
                    prop="ticketId"
                    label="彩票ID">
                </el-table-column>
                <el-table-column
                    prop="invoiceNo"
                    label="参与期数">
                </el-table-column>
                <el-table-column
                    prop="commenter"
                    label="用户ID">
                    <template slot-scope="scope">
                        {{scope.row.commenter.id}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="commenter"
                    label="用户名">
                    <template slot-scope="scope">
                        {{scope.row.commenter.nickName}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="commenter"
                    label="手机号码">
                    <template slot-scope="scope">
                        {{scope.row.commenter.phone}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="晒单内容">
                    <template slot-scope="scope">
                        <span :title="scope.row.content">{{ scope.row.content.length> 50? scope.row.content.substring(0,50)+'...':  scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="晒单时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="audit"
                    label="审核状态">
                    <template slot-scope="scope">
                        {{scope.row.audit.status == 'unAudited' ? '待审核' : scope.row.audit.status == 'unApproved' ? '未审核通过' : '审核通过'}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="audit"
                    label="操作">
                    <template slot-scope="scope">
                        <template v-if="scope.row.audit.status=='unAudited'">
                            <el-button v-permission="'lotteryDringSure'" type="primary" :size="$size" @click="$router.push({path:'/dryingDetail',query:{aaLotteryCommentId:scope.row.id,auditStatus}})">审核</el-button>
                        </template>
                        <template v-else>
                            <el-button v-permission="'lotteryDringDetail'" type="primary" :size="$size" @click="$router.push({path:'/dryingDetail',query:{aaLotteryCommentId:scope.row.id,auditStatus}})">晒单详情</el-button>
                            <el-button v-permission="'lotteryDringDelete'" type="danger" :size="$size" @click="fnDel(scope.row.id,scope.$index)" :loading="scope.row.loading">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
    </div>
</template>
<script>
export default {
    name:'dryingList',
    data () {
        return {
            currentPage:1,
            pageSize:10,
            total:0,
            auditStatus:"unAudited",
            searchData:{},
            tableData: [],
            loading:{
                tableLoading:false,
                searchLoading:false,
                clearLoading:false
            }
        };
    },
    props: {},
    components: {},
    computed: {},
    created() {
        let status = this.$route.query.auditStatus ;
        if(typeof status == "string"){
            this.auditStatus = status ;
        }
    },
    mounted() {
        setTimeout(() => {
            this.fnGetPage();
        }, 300);
    },
    methods: {
        fnDel(aaLotteryCommentId,index){
            this.$confirm('是否删除当前晒单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$set(this.tableData[index],'loading',true);
                this.$http.get(this.$api.aaLotteryCommentDelete, {aaLotteryCommentId}, true).then((res) => {
                    this.$set(this.tableData[index],'loading',false);
                    setTimeout(() => {
                        this.fnGetPage();
                    }, 300);
                }).catch((err) => {
                    this.$message.error(err.message);
                    this.$set(this.tableData[index],'loading',false);
                });
            })
            .catch(()=>{})
            
        },
        fnpagechange(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            this.fnGetPage();
        },
        fnSearch(){
            this.currentPage = 1;
            this.loading.searchLoading = true ;
            this.fnGetPage();
        },
        fnClear(){
            this.searchData = {} ;
            this.loading.clearLoading = true ;
            this.fnGetPage();
        },
        fnGetPage(){
            let aaLotteryCommentOBMDto = {} ;
            for (const key in this.searchData) {
                if (this.searchData.hasOwnProperty(key) && this.searchData[key]) {
                    if(key=='time'){
                        aaLotteryCommentOBMDto.startTime = this.searchData[key][0]/1000 ;
                        aaLotteryCommentOBMDto.endTime = this.searchData[key][1]/1000 ;
                    }else{
                        aaLotteryCommentOBMDto[key] =  this.searchData[key] ;
                    }
                }
            }

            let obj = {
                aaLotteryCommentOBMDto,
                limit:this.pageSize,
                page:this.currentPage
            }
            if(this.auditStatus){
                obj.aaLotteryCommentOBMDto.auditStatus = this.auditStatus ;
            }
            if(this.$route.query.ticketId){
                obj.aaLotteryCommentOBMDto.ticketId = this.$route.query.ticketId ;
            }
            this.loading.tableLoading = true ;
            this.$http.get(this.$api.aaLotteryCommentQPage, obj, true).then((res) => {
                this.tableData = res? res.data: [];
                this.total = res? res.total: 0;
                this.loading = {
                    tableLoading:false,
                    searchLoading:false,
                    clearLoading:false
                } ;
            }).catch((err) => {
                this.loading = {
                    tableLoading:false,
                    searchLoading:false,
                    clearLoading:false
                } ;
                this.tableData = [] ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        auditStatus(val){
            this.currentPage = 1;
            this.fnGetPage();
        }
    }
}
</script>
<style scoped>
.el-button{
    margin-bottom: 5px;
}
</style>