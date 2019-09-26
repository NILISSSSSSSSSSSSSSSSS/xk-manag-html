<template>
    <div>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>晓可币列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="120px" :model="searchForm" class="xk-search" ref="searchForm">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="消费/充值单号：" >
                            <el-input :size="$size" v-model="searchForm.orderNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="消费充值日期：" >
                            <el-col :span="11">
                                <el-date-picker type="date" value-format="timestamp" :size="$size" v-model="searchForm.beginTime"></el-date-picker>
                            </el-col>
                            <el-col :span="2" style="text-align: center">-</el-col>
                            <el-col :span="11">
                                <el-date-picker type="date" value-format="timestamp" :size="$size" v-model="searchForm.endTime"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型：">
                            <el-select v-model="searchForm.billType" :size="$size">
                                <el-option v-for="item in type" :label="item.label" :value="item.key" :key="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <el-table style="margin-top: 20px" width="100%" stripe v-loading="loading" :data="tableData">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="消费/充值单号" prop="orderNo"></el-table-column>
                <el-table-column label="消费/充值时间">
                    <tempalte slot-scope="scope">
                        {{scope.row.updatedAt | formatTime}}
                    </tempalte>
                </el-table-column>
                <el-table-column label="数额(元)">
                    <template slot-scope="scope">
                        {{scope.row.newAmount}}
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.billType === 'fi' ? '收入' : '支出'}}
                    </template>
                </el-table-column>
                <el-table-column label="去向/来源">
                <template slot-scope="scope">
                        {{getSource(scope.row.source)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <tempalte slot-scope="scope">
                        <el-button :size="$size" @click="handleDetail(scope.row)" type="text">订单详情</el-button>
                    </tempalte>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
import { XkbSources } from "@/util/publicParams"
export default {
    name: 'XkbList',
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            searchForm: {},
            type: [
                {key: '', label: '全部'},
                {key: 'fo', label: '支出'},
                {key: 'fi', label: '收入'}
            ],
            tableData: [],
            loading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            }
        }
    },
    watch: {
        name(val) {
            if(val === 'xkb') {
                this.getXkbList();
            }
        }
    },
    created() {
        this.getXkbList();
    },
    methods: {
        search() {
            this.pageData.currentPage = 1
            this.getXkbList();
        },
        resetForm() {
             this.searchForm = {}
             this.pageData.currentPage = 1
             this.getXkbList();
        },
        getXkbList() {
            this.loading = true
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                currency: 'xkb',
                id: this.$route.query.id,
                orderNo: this.searchForm.orderNo,
                beginTime: this.searchForm.beginTime / 1000,
                endTime: this.searchForm.endTime / 1000,
                billType: this.searchForm.billType
            }
            console.log(paramList)
            this.loading = true
            this.$http.get(this.$api.userAccBillQPage, paramList, true)
            .then(res => {
                this.loading = false;
                this.tableData = res.data
                console.log(res.data)
                this.pageData.total = res.total
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        }, 
        changePage(page, pageSize) { // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getXkbList();
        },
        getSource(val) {
            let name = ''
            for(let item of XkbSources) {
                if(val === item.key) {
                    name = item.label
                    break
                }
            }
            return name;
        },
        handleDetail(val) {
            switch(val.source) {
                case 'platform_charge': // 平台充值
                    this.$router.push({path: '/orderShopDetail', query: {type: 'xkb', id: val.id, source: val.source}});
                    break;
                case 'shop_charge': // 店铺充值
                    this.$router.push({path: '/orderShopDetail', query: {type: 'xkb', id: val.id, source: val.source}});
                    break;
                case 'winning_red_packets': // 红包
                    this.$router.push({path: '/orderRedDetail', query: {type: 'xkb', id: val.id, source: val.source}});
                    break;
                case 'giving_red_packets': // 红包
                    this.$router.push({path: '/orderRedDetail', query: {type: 'xkb', id: val.id, source: val.source}});
                    break;
                case 'giving_gifts': // 礼物
                    this.$router.push({path: '/userGiftDetail', query: {type: 'xkb', id: val.id, source: val.source}});
                    break;
                case 'game_charge': // 游戏
                    this.$router.push({path: '/userGameDetail', query: {type: 'xkb', id: val.id, source: val.source}})
                default: 
                    this.$message.warning("来源不存在")
            }
        }
    }
}
</script>

<style>

</style>
