<template>
    <div class="charge-pay-set xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>手续费设置
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="tableLoading">
                <el-table-column label="序号">
                    <template slot-scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column label="平台">
                    <template slot-scope="scope">
                        {{ platformEnums[scope.row.platform] }}
                    </template>
                </el-table-column>
                <template v-for="item in tableTitle">
                    <el-table-column :key="item" :label="poundageEnum[item]">
                        <template slot-scope="scope">
                            {{ scope.row[item] }}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="view(scope.row, true)">查看</el-button>
                        <el-button :size="$size" type="text" @click="view(scope.row, false)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 详情弹框 -->
        <el-dialog :title="editStatus? '详情': '编辑'" :visible.sync="payVisible" width="500px">
            <el-form :model="payForm" ref="payForm" label-width="170px">
                <el-form-item label="平台：">
                    {{ platformEnums[payForm.platform] }}
                </el-form-item>
                <template v-for="item in tableTitle">
                    <el-form-item :label="poundageEnum[item]+'：'" :key="item" :rules="rules.checkFloat" :prop="item">
                        <el-input :size="$size" v-model.trim="payForm[item]" :disabled="editStatus" placeholder="0%"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <div class="btn-group">
                <el-button v-if="!editStatus" :size="$size" type="info" @click="payVisible=false">取消</el-button>
                <el-button :loading="submitLoading" :size="$size" type="primary" @click="submit('payForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            const checkFloat = (rule, value, call) => {
                if(!value) {
                    return call();
                }
                if(!/(^[0-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,3}$)|(^[1-9]\d*[\.]{1}[0-9]{1,3}$)/.test(value)) {
                    return call(new Error('请输入0-100之间的数字，最多三位小数'))
                }
                if(Number(value) >=100) {
                    return call(new Error('不能超过100'))
                }
                call();
            }
            return {
                payForm: {},
                payVisible: false,
                editStatus: false,
                tableTitle: [],
                tableData: [],
                submitLoading: false,
                tableLoading: false,

                platformEnum: [],
                platformEnums: {},
                poundageEnum: {},
                rules: {
                    checkFloat: [
                        { validator: checkFloat, trigger: 'blur' }
                    ]
                }
            }
        },
        async created() {
            this.platformEnum = await this.getPlatformEnum();
            let poundage = await this.getPoundageEnum();
            this.poundageEnum = poundage.enum;
            this.tableTitle = poundage.data;
            this.getList();
        },
        methods: {
            view(row, bool) {
                this.editStatus = bool;
                this.payVisible = true;
                this.payForm = JSON.parse(JSON.stringify(row));
            },
            // 获取平台枚举
            getPlatformEnum() {
                return new Promise((resolve, reject) => {
                    this.$http
                    .get(this.$api.poundagePlatforms, {}, true)
                    .then(res=>{
                        let arr = [];
                        if(res) {
                            for(let item in res) {
                                arr.push(item);
                            }
                        }
                        this.platformEnums = res;
                        resolve(arr)
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        reject(err.message);
                    })
                })
            },
            // 获取渠道枚举
            getPoundageEnum() {
                return new Promise((resolve, reject) => {
                    this.$http
                    .get(this.$api.poundagePayChannels, {}, true)
                    .then(res=>{
                        let arr = [];
                        if(res) {
                            for(let item in res) {
                                arr.push(item);
                            }
                        }
                        resolve({
                            data: arr,
                            enum: res
                        })
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                        reject(err.message);
                    })
                })
            },
            submit(formName) {
                if(this.editStatus) {
                    this.payVisible = false;
                    return false;
                }
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = {
                            ponudages: this.createParams(this.payForm)
                        };
                        this.$http
                        .post(this.$api.poundageCreate, params, true)
                        .then(res=>{
                            this.$message.success('保存成功');
                            this.payVisible = false;
                            this.payForm = {};
                            this.getList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                        })
                    }else{
                        return false;
                    }
                })
            },
            createParams(params) {
                let arr = [];
                let platform = params.platform;
                for(let item in params) {
                    if(item!== 'platform') {
                        arr.push({
                            platform: platform,
                            payChannel: item,
                            poundageRate: params[item]
                        })
                    }
                }
                return arr;
            },
            getList() {
                let params = {

                }
                this.tableLoading = true;
                this.$http.get(this.$api.poundageQueryAll, params, true)
                .then(res=>{
                    this.tableLoading = false;
                    this.mixData(res?res: []);
                })
                .catch(err=>{
                    this.tableLoading = false;
                    this.$message.error(err.message);
                })
            },
            //组合数据
            mixData(data) {
                let tableData = [];
                let tableContent = [];
                data.forEach((item, index)=>{
                    if(tableContent.indexOf(item.platform) === -1) {
                        tableContent.push(item.platform);
                    }
                    let obj = {
                        platform: item.platform
                    };
                    data.forEach(_item => {
                        if(item.platform=== _item.platform) {
                            obj[_item.payChannel] = _item.poundageRate;
                        }
                    })
                    if(tableContent.indexOf(item.platform) === -1) {
                        tableData.push(obj)
                    }else{
                        tableData[tableContent.indexOf(item.platform)] = obj;
                    }
                })

                let tables = [];
                for(let item of this.platformEnum) {
                    let obj = {
                        platform: item
                    }
                    for(let i=0; i< tableData.length; i++) {
                        if(item=== tableData[i].platform) {
                            obj = tableData[i];
                            break;
                        }
                    }
                    tables.push(obj);
                }
                this.tableData = tables;
            }
        }
    }
</script>
