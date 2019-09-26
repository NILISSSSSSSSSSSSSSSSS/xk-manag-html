<template>
    <div class="expensive-set-active">
        <el-form label-width="150px" class="xk-search" :model="searchForm">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="奖品选择器：">
                        <el-select v-model="searchForm.goodsId" :size="$size" placeholder="奖品选择器" style="width:100%">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in activeForm.activeData" :key="index" :label="item.goodsName" :value="item.goodsId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="管理员账号：">
                        <el-input :size="$size" placeholder="管理员账号" v-model="searchForm.operatorId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="活动状态：">
                        <el-select :size="$size" placeholder="活动状态" style="width:100%" v-model="searchForm.activeStatus">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in EnumStatus" :key="index" :label="item.value" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="时间段搜索：">
                        <el-date-picker type="daterange" :size="$size" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchForm.rangeTime"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="16" style="text-align:right" class="line-height32">
                        <el-button :size="$size" type="danger" @click="clear()">清空</el-button>
                        <el-button :size="$size" type="primary" @click="search()">搜索</el-button>
                        <el-button :size="$size" type="success" @click="addMore()">新增</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column label="活动ID" prop="id"></el-table-column>
            <el-table-column label="活动名称" prop="subsidiesName"></el-table-column>
            <el-table-column label="奖品数量" prop="goodNumber"></el-table-column>
            <el-table-column label="操作时间">
                <template slot-scope="scope">
                    {{ scope.row.updatedAt | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="管理员账号" prop="operatorId"></el-table-column>
            <el-table-column label="开始时间">
                <template slot-scope="scope">
                    {{ scope.row.createdAt | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="结束时间">
                <template slot-scope="scope">
                    {{ scope.row.endTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="活动状态" :formatter="formatStatus"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :size="$size" type="text" @click="viewDialogDetail(scope.row.goods, scope.row.startTime, scope.row.endTime, scope.row.subsidiesName)">查看活动详情</el-button>
                    <el-button v-if="scope.row.activeStatus == 'to_start'" style="color:#f56c6c" :size="$size" type="text" @click="deleteSubsidDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="marginTop20" :gutter="20" v-if="countPrize && countPrize.length>0">
            <el-row class="_title">
                <el-col :span="10" class="center">奖品名称</el-col>
                <el-col :span="4" class="center">奖品数量（个）</el-col>
            </el-row>
            <el-row class="footer-m-b-10" v-for="(item, index) in countPrize" :key="index">
                <el-col :span="10">{{ item.name }}</el-col>
                <el-col :span="4" class="center">{{ item.num }}</el-col>
            </el-row>
        </el-row>
        <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>


        <!-- 补贴活动弹框 -->
        <el-dialog title="新增活动" :visible.sync="visible" width="60%">
            <el-form :model="activeForm" ref="activeForm" label-width="0" :rules="rules">
                <el-form-item label-width="140px" label="请输入活动时间：" prop="activeTime">
                    <el-date-picker
                        :disabled="editBtnStatus"
                        style="width:60%"
                        :size="$size"
                        v-model="activeForm.activeTime"
                        type="datetimerange"
                        range-separator="至"
                        :editable="false"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="请输入活动名称：" label-width="140px">
                    <el-input :disabled="editBtnStatus" :size="$size" placeholder="活动名称" v-model="activeForm.subsidiesName" style="width:60%"></el-input>
                </el-form-item>
                <el-table class="margintop20" :data="activeForm.activeData" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" v-if="!editBtnStatus"></el-table-column>
                    <el-table-column label="奖品数量">
                        <template slot-scope="scope">
                            <el-form-item :prop="'activeData.'+ scope.$index +'.goodsNum'" :rules="rules.checkNum">
                                <el-input :disabled="editBtnStatus" v-model="scope.row.goodsNum" :size="$size" placeholder="10"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="奖品ID" prop="goodsId"></el-table-column>
                    <el-table-column label="奖品名称" prop="goodsName"></el-table-column>
                    <el-table-column label="奖品用途">
                        <template slot-scope="scope">
                            {{ scope.row.usage ==='expense'? '运营专用奖品': '福利抽奖' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="奖品类型">
                        <template slot-scope="scope">
                            {{ scope.row.goodsType =='virtual'? '虚拟': '实物' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text" @click="viewDetail(scope.row.goodsId)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="btn-group">
                <el-button v-if="!editBtnStatus" :size="$size" type="" @click="visible =false">取消</el-button>
                <el-button :size="$size" type="primary" @click="confirmActive()">确定</el-button>
            </div>
        </el-dialog>

        <!-- 商品详情 -->
        <el-dialog title="商品详情" :visible.sync="visibleDetail" class="prize-info">
            <el-row>
                <el-col :span="8">商品ID:{{ goodsDetailForm.id }}</el-col>
                <el-col :span="8">商品类型:{{ goodsDetailForm.goodsType =='virtual'? '虚拟': '实物' }}</el-col>
                <el-col :span="8">商品价格:{{ goodsDetailForm.price }}</el-col>
                <el-col :span="8">商品用途:{{ goodsDetailForm.usage ==='expense'? '消费抽奖': '福利抽奖' }}</el-col>
                <el-col :span="8">商品名称:{{ goodsDetailForm.name }}</el-col>
                <el-col :span="24">商品图片:</el-col>
                <el-col :span="24" style="padding:0 20px;box-sizing:border-box">
                    <div class="left img-list" v-for="(item, index) in goodsDetailForm.showPics" :key="index">
                        <div class="span">
                            <div class="span-box">
                                <img :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="24">商品详情:</el-col>
                <el-col :span="24" v-html="goodsDetailForm.detailPic"></el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="visibleDetail=false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import PrizeInfo from '@/components/welfare/PrizeInfo.vue'
    //活动枚举
    const EnumStatus = [{key: 'to_start', value: '待开始'}, {key: 'running', value: '进行中'}, {key: 'finished', value: '已结束'}];
    import moment from 'moment';
    import { mapState } from 'vuex'
    export default {
        components: {
            PrizeInfo
        },
        props: {
            templeteIds: {
                type: String,
                default: ''
            }
        },
        data() {
            const notCheck=(rule, value, call) => {
                return call();
            }
            return {
                EnumStatus: EnumStatus,
                tableLoading: false,
                searchForm: {},
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                detailGoods: {},  //商品详情
                visible: false,
                visibleDetail: false,
                ruleForm: {},   //奖品信息
                activeTime: '',     //活动时间
                tableData: [],
                activeForm: {
                    activeData: []
                },
                rules: {
                    checkNum: [
                        { required: true, message: 'bu', trigger: 'blur' }
                    ],
                    activeTime: [
                        { required: true, message: '请输入时间', trigger: 'blur' }
                    ],
                    notCheck: [
                        { validator: notCheck, trigger: 'blur' }
                    ]
                },
                //选择的活动
                selectAvtive: '',
                goodsDetailForm: {},
                editBtnStatus: false,
                countPrize: ''
            }
        },
        computed: {
            ...mapState({
                basicForm: state=> state.operatePlatform.basicForm
            })
        },
        methods: {
            handleSelectionChange(val) {
                this.selectAvtive = val;
                console.log(val)
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.allList();
            },
            search() {
                this.allList();
            },
            clear() {
                this.searchForm = {};
                this.page.page = 1;
                this.allList();
            },
            allList() {
                if(this.templeteIds=='' ||this.templeteIds==null || this.templeteIds==void 0 || !this.basicForm.templeteId){
                    return false;
                }
                let params = {
                    condition: {
                        templeteId: this.basicForm.templeteId,
                        activeStatus: this.searchForm.activeStatus,
                        goodsId: this.searchForm.goodsId,
                        goodsName: this.searchForm.goodsName,
                        operatorId: this.searchForm.operatorId,
                        startTime: this.searchForm.rangeTime?moment(this.searchForm.rangeTime[0]).format('X'): '',
                        endTime: this.searchForm.rangeTime?moment(this.searchForm.rangeTime[1]).format('X'): ''
                    },
                    limit: this.page.limit,
                    page: this.page.page
                }
                this.tableLoading = true;
                this.$http.get(this.$api.subsidiesActivitiePage, params, true).then(res=>{
                    this.tableData = res.data;
                    this.page.total = res.total;
                    this.tableLoading = false;
                    this.getCountNum(params)
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.tableLoading = false;
                })
            },
            //新增补贴活动
            addMore() {
                this.getSubsidyList();
                this.editBtnStatus = false;
                this.visible = true;
            },
            //删除补贴活动
            deleteSubsidDelete(sweepstakeId) {
                this.$confirm('时候删除当前活动？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    console.log(JSON.stringify({subId: sweepstakeId}))
                    this.$http.post(this.$api.subsidDeleteById, {subId: sweepstakeId}, true).then(res=>{
                        this.allList();
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }).catch(()=>{})
                
            },
            //获取补贴活动列表
            getSubsidyList() {
                if(!this.basicForm.id||!this.basicForm.templeteId) {
                    return false;
                }
                this.$http.get(this.$api.goodsForSubsidiesActivitie, {sweepstakeId: this.basicForm.id}, true).then(res=>{
                    this.activeForm.activeData = res;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //获取统计数量
            getCountNum(params) {
                this.$http.get(this.$api.subsidieCount, params, true).then(res=>{
                    this.countPrize=[];
                    res.forEach((item, index) => {
                        for(let i in item) {
                            console.log(i)
                            let obj = {
                                name: i,
                                num: item[i]
                            }
                            this.countPrize.push(obj);
                        }
                    })
                    
                    console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //确认添加活动
            confirmActive() {
                if(this.editBtnStatus) {
                    this.visible = false;
                    return false;
                }
                let params = {
                    sweepstakeId: this.basicForm.id,
                    templeteId: this.basicForm.templeteId,
                    startTime: moment(this.activeForm.activeTime[0]).format('X'),
                    endTime: moment(this.activeForm.activeTime[1]).format('X'),
                    subsidiesName: this.activeForm.subsidiesName,
                    goods: this.selectAvtive
                };
                console.log(JSON.stringify({subsidiesActivitie: params}))
                // return false;
                this.$http.post(this.$api.subsidiesActivitieCreate, {subsidiesActivitie: params}, true).then(res=>{
                    this.$message.success('补贴活动设置成功')
                    this.visible = false;
                    this.allList();
                    // console.log(res)
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //查看奖品详情
            viewDetail(id) {
                this.$http.get(this.$api.jfmallGoodsDetail4Manager, { jGoodsId: id }, true).then(res=>{
                    this.visibleDetail = true;
                    console.log(res)
                    this.goodsDetailForm = {
                        id: res.id,
                        price: res.realAttr.originalValue,
                        name: res.name,
                        showPics: res.realAttr.showPics,
                        detailPic: res.detailPics
                    }
                    // this.detailGoods = res
                })
                .catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //获取奖品详情
            getGoodsDetail() {
                let data = {
                    jGoodsId: this.goodsId
                };
                this.$http.post(this.$api.jfmallGoodsDetail4Manager, data, true
                ).then((res) => {
                    console.log(res);
                    this.ruleForm = res;
                }).catch(err => {
                    this.$message.error(err.message)
                });
            },
            //查看活动详情
            viewDialogDetail(row, start, end, name) {
                this.activeForm.activeData = row;
                this.activeForm.activeTime = [start*1000, end*1000];
                this.activeForm.subsidiesName = name;
                this.editBtnStatus = true;
                this.visible = true;
            },
            //格式化活动状态
            formatStatus(row) {
                let name = ''
                this.EnumStatus.forEach((item, index) => {
                    if(item.key == row.activeStatus) {
                        return name = item.value
                    }
                })
                return name
            }
        },
        watch: {
            templeteIds(val, old){
                console.log(val)
                this.allList();
                this.getSubsidyList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .marginTop20{
        margin-top: 20px;
        font-size: 14px;
        color: #666;
        margin-left: -10px;
        margin-right: -10px;
        padding-left: 10px;
        padding-right: 10px;
        border-left: 1px ;
        ._title {
            font-weight: bolder;
            margin-bottom: 10px;
        }
        .footer-m-b-10 {
            margin-bottom: 10px;
        }
    }
    .prize-info {
        /deep/ .el-col {
            margin-bottom: 10px;
            font-size: 14px;
            color: #555;
        }
        .left{
            float: left;
        }
        .img-list{
            margin-left: 10px;
            margin-top: 10px;
            .span {
                display: inline-block;
                width: 125px;
                height: 125px;
                font-size: 0;
                padding: 10px;
                border: 1px dashed #ccc;
                .span-box {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    img {
                        width:100%;
                        vertical-align:middle
                    }
                    ::after {
                        display:inline-block;
                        width:0;height:100%;vertical-align:middle
                    }
                }
            }
        }
    }
</style>