<template>
    <div class="xk-container">

        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>晒单列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="searchForm" ref="searchForm" label-width="120px"
                     class=" demo-ruleForm xk-search">
                <!--第一排-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户手机号：">
                            <el-input :size="$size" v-model.trim="searchForm.userPhoneNo"
                                      placeholder="请输入用户手机号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="晒单奖品：">
                            <el-input :size="$size" v-model.trim="searchForm.goodsName"
                                      placeholder="请输入晒单奖品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="期号：">
                            <el-input :size="$size" v-model.trim="searchForm.termNumber"
                                      placeholder="输入期号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开奖期数：">
                            <el-input :size="$size" v-model.trim="searchForm.goodsNper"
                                      placeholder="输入开奖期数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核状态：">
                            <el-select  :size="$size" style="width: 100%;" v-model="searchForm.status" placeholder="选择审核状态">
                                <el-option v-for="(item, index) in EnumStatus" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单编号：">
                            <el-input :size="$size" v-model.trim="searchForm.orderId"
                                      placeholder="输入订单编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="选择日期：">
                            <el-date-picker
                                :size="$size"
                                style="width: 100%"
                                v-model="searchForm.rangeTime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
            </el-form>
        </div>
        <!--表格数据-->
        <div class="marintop20 xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button type="danger" :disabled="disabledAll" size="small" @click="deleteGoods()">删除选中项</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-table stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" v-loading="tableLoading" @selection-change="selectChange">
                <el-table-column type="selection" width="35"></el-table-column>
                <el-table-column label="晒单编号" prop="id" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column label="订单编号" prop="orderId" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="晒单奖品" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.goods.name }}
                    </template>
                </el-table-column>
                <el-table-column label="奖品用途" width="100" :formatter="formatUsage"></el-table-column>
                <el-table-column label="用户UID" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.commenter.uid? scope.row.commenter.uid: '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.commenter.phone }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="期号" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.goods.sequenceId}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="期数" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.row.goods.nper}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="晒单时间" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdAt | formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="晒单审核" :formatter="formatStatus"></el-table-column>
                <el-table-column label="晒单奖励" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.returnPrice? $math.divide(scope.row.returnPrice,100).toFixed(2)+' 消费券': '无'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="250">
                    <template slot-scope="scope">
                        <el-button v-permission="'sunburnListVerify'" v-if="scope.row.audit.status =='unAudited'" :size="$size" type="primary" @click="verify(scope.row.id, scope.row.orderId)">审核</el-button>
                        <el-button v-permission="'sunburnListDetail'" :size="$size" type="success" @click="seeEdit(scope.$index, scope.row)">晒单详情</el-button>
                        <el-button v-permission="'sunburnListDel'" :size="$size" type="danger" @click="deleteGoods(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>
    </div>
</template>

<script>
    import {enumFormatter} from '@/util/publicMehotds.js';
    import { EnumUsage } from '@/util/publicParams.js';
    //枚举开奖状态
    const EnumStatus = [{key: '', value: '全部'}, {key: 'unApproved', value: '未通过'},{key: 'verified', value: '已通过'},{key: 'unAudited', value: '未审核'}];
    import moment from "moment"
    export default {
        name: "sunburnVerify",
        components: {},
        data() {
            return {
                EnumStatus,
                moment,
                selectGoods: [],               //所选的全部商品些
                searchForm: {},
                tableData: [],
                disabledAll: true,
                tableLoading: false,
                searchLoading: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            formatUsage(row) {
                return enumFormatter(row.goods.usage, EnumUsage)
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            //搜索
            search(formName) {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            //清空
            clearCondition() {
                this.searchForm = {};
                this.page.page = 1;
                this.getList();
            },
            //查看订单
            seeEdit(index, row) {
                this.$router.push({path:'/listDetails',query:{tag:1, id: row.id, goodsId: row.orderId}});
            },
            verify(id, orderId) {
                this.$router.push({path: 'listDetails', query: {
                    type: 1,
                    id: id,
                    goodsId: orderId
                }})
            },
            getList() {
                let params = {
                    userPhoneNo: this.searchForm.userPhoneNo,
                    goodsName: this.searchForm.goodsName,
                    goodsNper: this.searchForm.goodsNper,
                    createdAt: {
                        start: this.searchForm.rangeTime?moment(this.searchForm.rangeTime[0]).format('X'):"",
                        end: this.searchForm.rangeTime?moment(this.searchForm.rangeTime[1]).format('X'):""
                    },
                    termNumber: this.searchForm.termNumber|| "",
                    status: this.searchForm.status|| "",
                    page: this.page.page,
                    limit: this.page.limit,
                    orderId: this.searchForm.orderId || ""
                }
                this.tableLoading = true;
                console.log(JSON.stringify(params));
                this.$http.get(this.$api.jGoodsCommentList4Manager, params, true).then(res=>{
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    this.searchLoading = false;
                    this.tableLoading = false;
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableData =[];
                    this.page.total = 0;
                    this.searchLoading = false;
                    this.tableLoading = false;
                })
            },
            //所选全部的商品
            selectChange(val) {
                this.selectGoods = val;
                this.disabledAll=val.length>0? false: true;
            },
            //删除选中项
            deleteGoods(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr = [];
                    if(id) {
                        arr.push(id);
                    }else{
                        for(let item of this.selectGoods) {
                            arr.push(item.id);
                        }
                    }
                    console.log(JSON.stringify({commentIds: arr}));
                    this.$http.post(this.$api.jGoodsCommentDelete4Manager, {commentIds: arr}, true).then(res=>{
                        this.$message.success('删除成功');
                        this.getList();
                    }).catch(err=>{
                        this.$message.error(err.message);
                    })
                }).catch(() => {});
            },
            //晒单审核
            formatStatus(row) {
                return enumFormatter(row.audit.status, EnumStatus);
            }
        }
    }
</script>

<style scoped>
</style>

