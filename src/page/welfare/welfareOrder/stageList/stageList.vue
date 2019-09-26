<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>期列表查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :loading="isLoading" :size="$size" @click="search()">搜索</el-button>
                    <el-button type="primary"  :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>

            <el-form :model="ruleForm" ref="ruleForm" label-width="120px"
                     class=" demo-ruleForm xk-search">
                <!--第一排-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="奖品ID：">
                            <el-input :size="$size" v-model.trim="ruleForm.id" placeholder="输入奖品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="当前期数：">
                            <el-input v-model="ruleForm.currentNper" :size="$size" placeholder="请输入当前期数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品类型：">
                            <el-select :size="$size" v-model="ruleForm.goodsType" placeholder="请选择奖品类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumPrizeType" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="奖品用途：">
                            <el-select :size="$size" v-model="ruleForm.usage" placeholder="选择状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, index) in EnumUsage" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="期状态：">
                            <el-select :size="$size" v-model="ruleForm.jPeriodState" placeholder="选择状态">
                                <el-option v-for="(item, index) in EnumDrawStatus" :label="item.value" :value="item.key" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格数据-->
        <div class="xk-radius marintop20">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>期列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
            <el-table
                v-loading="tableLoading"
                :data="tableData"
                tooltip-effect="dark">
                <el-table-column label="期号ID" width="210px" prop="id"></el-table-column>
                <el-table-column label="奖品ID" width="210px">
                    <template slot-scope="scope">
                        {{ scope.row.goods? scope.row.goods.id: '无' }}
                    </template>
                </el-table-column>
                <el-table-column label="奖品类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.goods && scope.row.goods.goodsType==='substance'?'实物奖品': '虚拟奖品' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品用途">
                    <template slot-scope="scope">
                        <span v-if="scope.row.goods.usage">{{ scope.row.goods.usage | formatUsage }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品名称">
                    <template slot-scope="scope">
                        {{ scope.row.goods?scope.row.goods.name: '无'  }}
                    </template>
                </el-table-column>
                <el-table-column label="当前期数" prop="currentNper">
                </el-table-column>
                <el-table-column label="期状态" :formatter="formatterDrawStatus">
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button
                            v-permission="'stageListHandle'"
                            v-if="scope.row.jPeriodState==='running_status' && scope.row.goods.usage!='expense'"
                            :size="$size"
                            type="primary"
                            @click="manual(scope.row.id)">手动开奖
                        </el-button>
                        <el-button
                            v-permission="'stageListDetail'"
                            :size="$size"
                            type="success"
                            @click="seeEdit(scope.$index, scope.row)">查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 手动开奖 -->
        <el-dialog title="确认手动开奖" :visible.sync="visible" width="400px">
            <el-form label-width="120px" :model="submitForm" ref="submitForm" :rules="submitFormRules">
                <el-form-item label="手动开奖时间：" prop="openTime">
                    <el-date-picker :size="$size" type="datetime" placeholder="选择开奖时间" v-model="submitForm.openTime"></el-date-picker>
                </el-form-item>
                <p>注意：确定手动开奖后，会从当前期参与用户分钟随机抽出中奖者</p>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" type="success" @click="visible=false">返回</el-button>
                <el-button :size="$size" type="primary" @click="openLottery('submitForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    //枚举期状态
    const EnumDrawStatus = [{key: 'running_status', value: '投放中'}, {key: 'finished_status', value: '已结束'}, {key: 'winning_status', value: '待开奖'}];
    import { mapMutations, mapState } from 'vuex'
    import moment from 'moment';
    import { enumFormatter } from '@/util/publicMehotds.js';
    import { EnumUsage,EnumJDrawType,EnumPrizeType } from '@/util/publicParams.js'

    export default {
        name: "stageList",
        components: {},
        data() {
            return {
                EnumUsage,
                EnumDrawStatus,
                EnumPrizeType,
                EnumJDrawType,
                tableLoading: false,
                page: {
                    page: 1,
                    total: 0,
                    limit: 10
                },
                isLoading:false,
                selectGoodsId: [],               //所选的全部商品id些
                ruleForm: {},
                tableData: [],
                visible: false,
                submitForm: {},
                submitFormRules: {
                    openTime: [
                        { required: true, message: '不能为空', trigger:'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                searchData: state => state.welfareWelfareOrder.searchPrizeSeqCondition
            })
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.ruleForm = this.searchData.searchForm)
                : null;
            this.allList();
        },
        methods: {
            ...mapMutations({
                setPrizeSeqCondition: "welfareWelfareOrder/setPrizeSeqCondition"
            }),
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.allList();
            },
            //获取所有列表数据
            allList() {
                let params={
                    condition:{
                        id:this.ruleForm.id || "",
                        usage: this.ruleForm.usage || "",
                        currentNper: this.ruleForm.currentNper || "",
                        goodsType: this.ruleForm.goodsType || "",
                        jPeriodState: this.ruleForm.jPeriodState || ''
                    },
                    limit:this.page.limit,
                    page:this.page.page,
                };
                this.tableLoading = true;
                console.log(JSON.stringify(params))
                this.$http.get(this.$api.jSequenceQPage, params, true).then(res=>{
                    this.setPrizeSeqCondition(Object.assign({searchForm: this.ruleForm}, {page: this.page}))
                    console.log(res)
                    this.isLoading=false;
                    this.tableLoading = false;
                    this.page.total = res? res.total: 0;
                    this.tableData = res? res.data: [];
                }).catch(err=>{
                    this.isLoading=false;
                    this.tableLoading = false;
                    this.$message.error(err.message)
                });
            },
            //搜索
            search() {
                this.page.page = 1;
                this.isLoading=true;
                this.allList();
            },
            //重置表单
            resetForm(formName) {
                this.setPrizeSeqCondition(null);
                this.ruleForm = {};
                this.allList();
            },
            //查看订单
            seeEdit(index, row) {
                this.$router.push({path:'/stageDetails',query:{id:row.id, goodsId: row.goods.id}});
            },
            //手动开奖
            manual(id) {
                this.$refs['submitForm']?this.$refs['submitForm'].resetFields(): null;
                this.visible = true;
                this.submitForm.id = id;
            },
            //手动开奖  （向服务端发送请求）
            openLottery(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        console.log(JSON.stringify({id: this.submitForm.id,  openTime: moment(this.submitForm.openTime).format('X')}))
                        this.$http.post(this.$api.jManualWork, { id: this.submitForm.id,  openTime: moment(this.submitForm.openTime).format('X')}, true).then(res=>{
                            this.$message.success('手动开奖成功！');
                            this.allList();
                            this.visible = false;
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }else{
                        return false;
                    }
                })
                
            },
            formatterDrawStatus(row) {
                return enumFormatter(row.jPeriodState, EnumDrawStatus)
            }
        },
        filters: {
            formatUsage(val) {
                if(val) {
                    return enumFormatter(val, EnumUsage)
                }
            }
        }
    }
</script>

<style scoped>
</style>

