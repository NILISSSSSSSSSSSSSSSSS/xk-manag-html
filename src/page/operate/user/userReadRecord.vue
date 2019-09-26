<template>
    <div class="xk-container">
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>浏览记录
                </div>
                 <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :label-position="right" label-width="120px" :model="searchForm" class="xk-search">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="商城选择：" >
                            <el-select :size="$size" v-model="searchForm.xKModule">
                                <el-option v-for="item of mallType" :key="item" :label="item.label" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="tableData" v-loading="loading" style="margin-top: 20px">
                <el-table-column label="商品ID" prop="id"></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.showPics" style="height: 50px;width: 50pxs">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="商品类别" prop="goodsType">
                    <template slot-scope="scope">
                        {{getGoodsType(scope.row.goodsType)}}
                    </template>
                </el-table-column>
                <el-table-column label="商品金额">
                    <template slot-scope="scope">
                        {{scope.row.price / 100}}
                    </template>
                </el-table-column>
                <el-table-column label="浏览时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
import { getPorvinceInfo } from '@/util/publicMehotds'
import { EnumDrawTicketType } from '@/util/publicParams'
export default {
    name: 'userGiftRecord',
    data() {
        return {
            tableData: [],
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            searchForm: {xKModule: 'mall'},
            mallType: [
                {key: 'mall', label: '自营商城'},
                {key: 'jf_mall', label: '夺奖派对'}
            ],
            goodsType: [
                {key: 'NEW', label: '全新'},
                {key: 'USED', label: '二手'},
                {key: 'substance', label: '实物'},
                {key: 'virtual',label: '虚拟'}
            ]
        }
    },
    created() {
        this. getReadRecordList();
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getReadRecordList();
        },
        getReadRecordList() {
            this.loading = true
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                xkUserId: this.$route.query.id,
                xKModule: this.searchForm.xKModule
            }
            console.log(paramList)
            this.$http.get(this.$api.historyQPage, paramList, true)
            .then(res => {
                this.loading = false
                this.tableData = res.data
                console.log(res.data)
                this.pageData.total = res.total
            })
            .catch(err => {
                this.loading = false
                this.$message(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getReadRecordList();
        },
        getGoodsType(val) {
            let name = ''
            for(let item of this.goodsType) {
                if(item.key === val) {
                    name = item.label
                    break;
                }
            }
            return name
        }
    }
}
</script>

<style>

</style>
