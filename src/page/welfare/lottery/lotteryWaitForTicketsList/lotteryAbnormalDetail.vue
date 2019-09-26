<template>
    <div class = 'xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                 <span></span>
                    异常出票
                </div>
                <div class='vus-btn'>
                    <el-button type="primary" :size="$size" @click="fnOutTickets" :loading="outLoading" :disabled="!tableData.length">出票</el-button>
                </div>
                <div class='vus-bottom'></div>
                <h3>共计导入异常出票： <span>{{total}}</span> 张</h3>
                <h2>说明：按照号码位数依次递减模糊匹配</h2>
                <el-table
                    :data="tableData"
                    stripe
                    border
                    v-loading="tableLoading"
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="scanPic"
                        label="扫描图片">
                        <template slot-scope="scope">
                            <img :src="scope.row.scanPic" width="120" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="discriminateNo"
                        label="识别号码">
                    </el-table-column>
                    <el-table-column
                        prop="isMatchSuccess"
                        label="匹配进度">
                        <template slot-scope="scope">
                            <el-progress  :percentage="100" status="success" v-if="scope.row.isMatchSuccess"></el-progress>
                            <el-progress  :percentage="10" status="exception" v-else></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userId"
                        label="用户ID">
                    </el-table-column>
                    <el-table-column
                        prop="userChooseNo"
                        label="用户选择号码">
                    </el-table-column>
                    <el-table-column
                        prop="aaLotterySequenceNo"
                        label="用户选择期数">
                        <template slot-scope="scope">
                            第{{scope.row.aaLotterySequenceNo}}期
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="matchNum"
                        label="匹配位数">
                    </el-table-column>
                    <el-table-column
                        prop="discriminateNo"
                        label="最终出票号码">
                    </el-table-column>
                    <el-table-column
                        prop="matchSequenceNo"
                        label="最终出票期数">
                        <template slot-scope="scope">
                            第{{scope.row.matchSequenceNo}}期
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="maxPic"
                        label="彩票全图">
                        <template slot-scope="scope">
                            <img :src="scope.row.maxPic" width="120" alt="">
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination> -->
            </div>
        </div>
        <div class="xk-back-btn">
            <el-button :size="$size" @click="$router.push('lotteryWaitForTicketsList')">返回</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'lotteryAbnormalDetail',
    data () {
        return {
            // currentPage:1,
            // pageSize:10,
            total:0,
            tableData: [],
            outLoading:false,
            tableLoading:false
        };
    },
    props: {},
    components: {},
    computed: {},
    created() {
        this.fnGetPage();
    },
    mounted() {},
    methods: {
        // fnpagechange(currentPage,pageSize){
        //     this.currentPage = currentPage ;
        //     this.pageSize = pageSize ;
        // },
        fnGetPage(param={}){
            let obj = {
                ...param,
                limit:10000,
                page:1,
                aaLotteryType:"super_lotto",
                aaLotterySequenceNo:this.$route.query.expectNo
            }
            console.log(obj);
            this.tableLoading = true ;
            this.$http.get(this.$api.failedInvoiceTicketsQPage, obj, true).then((res) => {
                console.log(res)
                this.total = res? res.total: 0;
                this.tableData = res? res.data: [];
                this.tableLoading = false ;
            }).catch((err) => {
                console.log(err);
                this.tableLoading = false ;
                this.$message.error(err.message);
            });
        },
        fnOutTickets(){
            let obj = {
                invoiceRecord:[
                    ...this.tableData
                ]
            }
            this.outLoading = true ;
            console.log(obj)
            this.$http.get(this.$api.updateInvoiceFailedTickets,obj , true).then((res) => {
                console.log(res)
                this.outLoading = false ;
                this.$message({
                    message: '出票成功',
                    type: 'success'
                });
                setTimeout(() => {
                    this.fnGetPage();
                }, 1000);
            }).catch((err) => {
                console.log(err);
                this.outLoading = false ;
                this.$message.error(err.message);
            });
        }
    },
    watch: {}
}
</script>
<style scoped lang="scss">
h2,h3{
    margin-bottom: 10px;
    span{
        color:#f44336
    }
}
.xk-back-btn{
    padding-top: 20px;
    text-align: center
}
</style>