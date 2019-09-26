<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>送礼记录
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form :label-position="right" label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="礼物ID：" >
                        <el-input :size="$size" v-model="searchForm.giftId" placeholder="请输入礼物ID"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="礼物类型：" >
                        <el-select v-model="searchForm.type" :size="$size">
                            <el-option v-for="item in giftType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="选择日期时间：" >
                        <el-col :span="11">
                            <el-date-picker :size='$size' value-format="timestamp" v-model="searchForm.applyDate1"></el-date-picker>
                        </el-col>
                        <el-col :span="2" style="text-align: center">至</el-col>
                        <el-col :span="11">
                            <el-date-picker :size='$size' value-format="timestamp" v-model="searchForm.applyDate2"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row> -->
        </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData">
                <el-table-column label="礼物ID" prop="giftId"></el-table-column>
                <el-table-column label="礼物名称" prop="giftName"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.giftSize == 1 ? "大" : scope.row.giftSize == 2 ? '中' : '小'}}
                    </template>
                </el-table-column>
                <el-table-column label="价格">
                    <tempalte slot-scope="scope">
                        {{scope.row.giftPrice / 100}}
                    </tempalte>
                </el-table-column>
                <el-table-column label="数量" prop="giftNum"></el-table-column>
                <!-- <el-table-column label="金额" prop=""></el-table-column> -->
                <el-table-column label="收方ID" prop="receivingUserId"></el-table-column>
                <el-table-column label="收方用户类型" prop="userAuth">
                    <template slot-scope="scope">
                        {{scope.row.userAuth == 1 ? '主播' : '普通用户'}}
                    </template>
                </el-table-column>
                <el-table-column label="收方昵称" prop="userName"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="giftDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'userGiftRecord',
    data() {
        return {
            searchForm: {type: 'redPackage'},
            tableData: [{name: '占位'}],
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            giftType: [
                {key: 'redPackage', label: '红包'},
                {key: 'gift', label: '礼物'}
            ]
        }
    },
    created() {
        this.getGiftList();
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getGiftList();
        },
        giftDetail(val) {
            this.$router.push({path: '/userGiftDetail', query: {orderNo: val.orderNo, tradeProduct: this.searchForm.type, source: 'giftList'}})
        },
        getGiftList() {
            this.loading = true
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                id: this.$route.query.id,
                // id: '5bc851d0033455469241bd25',
                type: this.searchForm.type, // 类型必传
                giftId: this.searchForm.giftId
            }
            console.log(paramList)
            this.$http.get(this.$api.userAccGiftQPage, paramList, true)
            .then(res => {
                this.loading = false
                this.tableData = res.data
                console.log(res)
                this.pageData.total = res.total
            })
            .catch(err => {
                this.loading = false
                this.$message(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getGiftList();
        },
    },
}
</script>

<style>

</style>
