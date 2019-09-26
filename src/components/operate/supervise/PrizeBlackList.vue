<template>
    <div class="prize-black-list">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="searchList()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" :label-width="labelWidth" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户ID：">
                            <el-input :size="$size" placeholder="请输入用户ID" v-model="searchForm.qUserId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户名称：">
                            <el-input :size="$size" placeholder="请输入用户名称" v-model="searchForm.qUserName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户状态：">
                            <el-select :size="$size" placeholder="请输入用户状态" v-model="searchForm.freezeDraw">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumSuperviseBlackType" :key="index" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </div>

        <el-table :data="prizeData" v-loading="loadingTable">
            <el-table-column label="用户ID" prop="userId"></el-table-column>
            <el-table-column label="用户名称" prop="userName"></el-table-column>
            <el-table-column label="连续刷单次数" prop="orderTime"></el-table-column>
            <el-table-column label="连续刷单金额">
                <template slot-scope="scope">
                    {{ $math.divide(scope.row.orderTotalMoney, 100) }} 元
                </template>
            </el-table-column>
            <el-table-column label="用户状态">
                <template slot-scope="scope">
                    {{ scope.row.freezeDraw | formatStatus }}
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="330px">
                <template slot-scope="scope">
                    <el-button class="" :size="$size" type="danger" @click="removeBlack(scope.row.id, scope.row)" :loading="scope.row.loadingBlack"
                    v-permission="'superviseBlackListDrawDel'">从黑名单删除</el-button>
                    <el-button class="" :size="$size" type="success" :loading="loadingDetail" @click="viewDetail(scope.row)"
                    v-permission="'superviseBlackListDrawDetail'">查看详情</el-button>
                    <el-button v-if="scope.row.freezeDraw==1" class="" :size="$size" type="warning" :loading="scope.row.loadingRecover" @click="changeLottery(scope.row, 0)"
                    v-permission="'superviseBlackListDrawReDraw'">恢复抽奖</el-button>
                    <el-button v-if="scope.row.freezeDraw==0" :size="$size" type="primary" :loading="scope.row.loadingStop" @click="changeLottery(scope.row, 1)">封停抽奖</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>

        <!-- 查看详情 -->
        <el-dialog title="黑名单详情" :visible.sync="visible" width="500px">
            <el-row>
                <el-col :span="24" class="marginbottom20">用户ID：{{ detail.userId }}</el-col>
                <el-col :span="12">用户名：{{ detail.userName }}</el-col>
                <el-col :span="12">用户状态：{{ detail.freezeDraw | formatStatus }}</el-col>
                <el-col :span="12" class="marintop20">抽奖监管次数：{{ detail.count }}</el-col>
            </el-row>
            <!-- <div class="detail-content marintop20 center">
                <div class="detail-box">
                    <div class="detail-flex">抽奖监管次数</div>
                    <div class="detail-flex">用户IP</div>
                </div>
                <div class="detail-box">
                    <div class="detail-flex xk-warning">{{ detail.count }}</div>
                    <div class="detail-flex xk-success">127.0.0.9:3303</div>
                </div>
            </div> -->
            <div class="btn-group">
                <el-button :size="$size" type="success" @click="visible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="visible=false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { EnumSuperviseBlackType } from '@/util/publicParams.js';
    export default {
        props: {
            show: {
                type: Boolean
            },
            condition: {
                type: Object,
                default: ()=> ({})
            }
        },
        data() {
            return {
                EnumSuperviseBlackType,
                loadingTable: false,
                labelWidth: '100px',
                loadingSearch: false,
                searchForm: {},
                visible: false,
                prizeData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                detail: {}
            }
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            searchList() {
                this.loadingSearch = true;
                this.getList();
            },
            clearCondition() {
                this.page = {
                    page: 1,
                    limit: 10
                }
                this.searchForm = {};
                this.getList();
            },
            viewDetail(row) {
                this.$set(row, 'loadingDetail', true);
                this.$http.get(this.$api.activityPlatformBlacklistDetail, {
                        qUserId: row.userId,
                        qUserName: row.userName,
                        freezeDraw: row.freezeDraw}, true)
                    .then(res=>{
                        this.$set(row, 'loadingDetail', false);
                        this.detail = res;
                        this.visible = true;
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        this.$set(row, 'loadingDetail', false);
                    })
            },
            //移除黑名单
            removeBlack(id, row) {
                this.$confirm(`是否将  ${row.userName}  移除黑名单`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(()=>{
                        this.$set(row, 'loadingBlack', true);
                        this.$http.get(this.$api.activityPlatformBlacklistDelete, {id: id}, true)
                            .then(res=>{
                                this.$set(row, 'loadingBlack', false);
                                this.$message.success('移除成功');
                                this.getList();
                            })
                            .catch(err=>{
                                this.$set(row, 'loadingBlack', false);
                                this.$message.error(err.message);
                            })
                    })
                    .catch(()=>{})
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    freezeDraw: this.searchForm.freezeDraw,
                    qUserId: this.searchForm.qUserId,
                    qUserName: this.searchForm.qUserName
                }
                
                this.loadingTable = true;
                this.$http.get(this.$api.activityPlatformBlacklistQPage, params, true).then(res=>{
                    this.prizeData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.loadingSearch = false;
                    this.loadingTable = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.loadingSearch = false;
                    this.loadingTable = false;
                })
            },
            changeLottery(row, freezeDraw) {
                this.$confirm(`是否${freezeDraw==0?'恢复': '封停'}  ${row.userName}  抽奖`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(()=>{
                        freezeDraw==0? this.$set(row, 'loadingRecover', true):this.$set(row, 'loadingStop', true);
                        this.$http.get(this.$api.activityPlatformBlacklistUpdateFreezeDraw, {id:row.id, freezeDraw: freezeDraw}, true).then(res=>{
                            freezeDraw==0? this.$set(row, 'loadingRecover', false):this.$set(row, 'loadingStop', false);
                            this.getList();
                        })
                        .catch(err=>{
                            freezeDraw==0? this.$set(row, 'loadingRecover', false):this.$set(row, 'loadingStop', false);
                            this.$message.error(err.message);
                        })
                    })
                    .catch(()=>{})
            }
        },
        watch: {
            show(val) {
                val? this.getList(): null;
            }
        },
        filters: {
            formatStatus(val) {
                let res = '';
                val==0?val=val.toString(): null;
                if(val) {
                    let arr = EnumSuperviseBlackType.filter(item=>{
                        return item.key==val;
                    })
                    arr.length>0? res=arr[0].value: ""
                }
                return res;
            }
        }
    }
</script>

<style scoped lang="scss">
    .prize-black-list {
        .detail-content {
            width: 160px;
            border-top: 1px solid #c7bebe;
            border-left: 1px solid #c7bebe;;
            .detail-box {
                display: flex;
                .detail-flex {
                    flex: 1;
                    padding: 10px;
                    border-right: 1px solid #c7bebe;
                    border-bottom: 1px solid #c7bebe;
                }
            }
            
        }
    }
</style>
