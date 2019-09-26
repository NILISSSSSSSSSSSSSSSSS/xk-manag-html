<template>
    <div class="ssc-set xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="120px">
                <el-form-item label="时时彩日期：">
                    <el-date-picker :picker-options="options" :clearable="false" @change="getList" :editable="false" :size="$size" v-model="searchForm.time"></el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="tableLoading" :default-sort = "{prop: 'currentNper', order: 'descending'}">
                <el-table-column label="序号">
                    <template slot-scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column label="时时彩日期">
                    <template slot-scope="scope">
                        {{ $math.add(moment(searchForm.time).startOf('day'), scope.row.thirdWinningTime*1000) | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="时时彩期数" prop="currentNper"></el-table-column>
                <el-table-column label="开奖号码" prop="winningNo"></el-table-column>
                <el-table-column label="录入时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'sscSetIn'" v-if="!scope.row.winningNo" type="primary" :size="$size" @click="enterNumber(scope.row)">录入号码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 录入号码 -->
        <el-dialog title="录入号码" :visible.sync="visible" width="550px" :close-on-click-modal="false">
            <el-form label-width="120px" :model="submitForm" ref="submitForm">
                <el-form-item label="时时彩日期：">{{ submitForm.date | formatTime }}</el-form-item>
                <el-form-item label="时时彩期数：">{{ submitForm.sequenceNo }}</el-form-item>
                <el-form-item label="开奖号码：">
                    <el-row type="flex" justify="space-around">
                        <el-col :span="4" v-for="(item,index) in submitForm.winningNo" :key="index">
                            <el-form-item label-width="0" :prop="'winningNo.' + index + '.num'" :rules="rules.checkNum">
                                <el-input :maxlength="MAX_LENGTH" :size="$size" v-model="item.num"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <p class="xk-danger">* 提交后不可修改，请谨慎操作！</p>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="visible=false">取消</el-button>
                <el-button :size="$size" type="primary" :loading="submitLoading" @click="saveNum('submitForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            const checkNum = (rule, value, call) => {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[0-9]$/.test(value)) {
                    return call(new Error('请输入数字'))
                }
                call();
            }
            return {
                options: {
                    disabledDate(time) {
                        return time.getTime() > new Date(new Date().setHours(0, 0, 0, 0));
                    }
                },
                moment,
                MAX_LENGTH: 1,
                searchForm: {
                    time: moment()
                },
                tableLoading: false,
                visible: false,
                rules: {
                    checkNum: [{validator: checkNum, trigger: 'blur'}]
                },
                submitForm: {
                    winningNo: []
                },
                tableData: [],
                submitLoading: false
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                let params = {
                    date: moment(this.searchForm.time).format('YYYYMMDD')
                };
                this.tableLoading = true;
                this.$http.get(this.$api.cqsscQlist, params, true).then(res=>{
                    console.log(res)
                    this.tableLoading = false;
                    this.tableData = res? res: [];
                })
                .catch(err=>{
                    this.tableLoading = false;
                    this.$message.error(err.message);
                    this.tableData = [];
                })
            },
            enterNumber(row) {
                let winningNo = [{num: ''},{num: ''},{num: ''},{num: ''},{num: ''}];
                this.submitForm = {
                    sequenceNo: row.currentNper,
                    date: this.$math.add(moment(this.searchForm.time).startOf('day'), row.thirdWinningTime*1000),
                    winningNo: winningNo
                }
                this.$refs['submitForm']? this.$refs['submitForm'].clearValidate(): null;
                this.visible = true;
            },
            saveNum(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = {
                            winningNo: this.submitForm.winningNo.map(item=>item.num).join(""),
                            sequenceNo: this.submitForm.sequenceNo,
                            date: moment(this.submitForm.date).format('YYYYMMDD')
                        }
                        this.submitLoading = true;
                        this.$http.post(this.$api.manuallyNo, params, true).then(res=>{
                            this.submitLoading = false;
                            this.visible = false;
                            this.getList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                            this.submitLoading = false;
                            if(err.code===10000) {
                                this.visible = false;
                                this.getList();
                            }
                        })
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ssc-set {
        
    }
</style>