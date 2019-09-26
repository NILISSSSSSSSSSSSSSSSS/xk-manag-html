<template>
    <div class = 'drawback-look-throu-list xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    退税审核列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="search()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clear()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-width="120px" :model="searchData" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="退税单号：">
                                <el-input v-model="searchData.rebateNo" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户ID：">
                                <el-input v-model="searchData.merchantId" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户名称：">
                                <el-input v-model="searchData.merchantName" :size="$size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期：">
                                <el-date-picker
                                    :size="$size"
                                    v-model="searchData.rangeTime"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退税金额：">
                                <el-select :size="$size" v-model="searchData.grade">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in EnumGrade" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="xk-body xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>
                    列表
                </div>
                <div class="vus-btn">
                        <el-button v-permission="'drawbackLookThrouListDown'" type="success" :size="$size" @click="visibleOrder=true">导出到Excel</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                border
                v-loading="loadingTable"
                stripe
                style="width: 100%">
                <!-- <el-table-column
                    type="selection"
                    width="50">
                </el-table-column> -->
                <el-table-column
                    prop="rebateNo"
                    label="退税单号">
                </el-table-column>
                <el-table-column
                    label="申请时间">
                    <template slot-scope="scope">
                        {{ scope.row.applyTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="rebateMerchant.merchantId"
                    label="用户ID">
                </el-table-column>
                <el-table-column
                    prop="rebateMerchant.merchantName"
                    label="用户名称">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="退税金额">
                    <template slot-scope="scope">
                        {{ scope.row.taxRebateAmount? scope.row.taxRebateAmount : 0 }} 元
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cardholdInfo.bankName"
                    label="退税银行">
                </el-table-column>
                <el-table-column
                    prop="cardholdInfo.bankCardNo"
                    label="银行卡号">
                </el-table-column>
                <el-table-column
                    label="发票照片">
                    <template slot-scope="scope">
                        <img style="max-width: 100%;max-height: 100px" :src="scope.row.invoicePic" alt="" @click="$viewImage(scope.row.invoicePic)">
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核状态">
                    <template slot-scope="scope">
                        {{ scope.row.taxRebateStatus | formatAudit }}
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="150px"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'drawbackLookThrouListExamine'" :size="$size" type="text" @click="verify(scope.row)" v-if="scope.row.taxRebateStatus==='APPLYING'">审核</el-button>
                        <a v-if="scope.row.invoicePic" :download="scope.row.invoicePic.split('?')[0]" :href="scope.row.invoicePic +'&attname='+ scope.row.invoicePic.split('?')[0]+'.png'" class="upload-class">下载发票图片</a>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :currentPage = "page.page" :pageSize = "page.limit" :total = "page.total" @change = "fnpagechange"></Pagination>
        </div>

        <!-- 退税审核 -->
        <el-dialog :visible.sync="visible" width="800" title="退税审核" class="verify">
            <el-row>
                <el-col :span="12">退税单号：{{ detail.rebateNo }}</el-col>
                <el-col :span="12">申请时间：{{ detail.applyTime | formatTime }}</el-col>
                <el-col :span="12">用户名称：{{ detail.rebateMerchant.merchantName	 }}</el-col>
                <el-col :span="12">用户ID：{{ detail.rebateMerchant.merchantId	 }}</el-col>
                <el-col :span="12">退税金额：{{ detail.taxRebateAmount }}</el-col>
                <el-col :span="12">退税银行：{{ detail.cardholdInfo.bankName }}</el-col>
                <el-col :span="12">银行卡号：{{ detail.cardholdInfo.bankCardNo }}</el-col>
                <el-col :span="12">预留手机号：{{ detail.cardholdInfo.reservedPhone	 }}</el-col>
                <el-col :span="12">持卡人姓名：{{ detail.cardholdInfo.cardholder }}</el-col>
            </el-row>
            <div class="line">
                <el-row>
                    <el-col :span="2">人工审核：</el-col>
                    <el-col :span="22">
                        <el-radio-group v-model="radio">
                            <el-radio label="1">同意</el-radio>
                            <el-radio label="0">不同意</el-radio>
                        </el-radio-group>
                    </el-col>
                    <template v-if="radio==0">
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="6">
                            <el-input v-model.trim="error" type="textarea" :autosize="{ minRows: 5, maxRows: 5}" rows="4" resize="none"></el-input>
                        </el-col>
                    </template>
                </el-row>
            </div>
            <div class="btn-group">
                <el-button :size="$size" @click="visible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="confirm()" :loading="loadingAudit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 订单导出 -->
        <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>
    </div>
</template>
<script>
import { enumFormatter } from '@/util/publicMehotds.js';
const EnumGrade = [{label: '0-1万', value: 'one'},{label: '1-3万', value: 'two'},{label: '3-5万', value: 'three'},{label: '5万以上', value: 'four'}];
const EnumAudit = [{label: '申请中', value: 'APPLYING'},{label: '同意', value: 'AGREE'},{label: '拒绝', value: 'REJECT'}];
import moment from 'moment';
import OrderOut from '@/components/common/OrderOut.vue';
import { mapMutations, mapState } from 'vuex';
export default {
    name:'drawbackLookThrouList',
    components: {
        OrderOut
    },
    data () {
        return {
            EnumAudit,
            EnumGrade,
            visible: false,
            loadingSearch: false,
            loadingTable: false,
            loadingAudit: false,
            searchData:{
                rangeTime: [moment().week(moment().week()).startOf('month'), moment()]
            },
            detail: {
                rebateMerchant: {},
                cardholdInfo: {}
            },
            radio: '1',
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            error: '',
            tableData:[],
            loadingDown: false,
            visibleOrder: false
        };
    },
    created() {
        this.searchStateData
                ? (this.searchData = this.searchStateData.searchForm, this.page = this.searchStateData.page)
                : null;
        this.getList();
    },
    computed: {
        ...mapState({
            searchStateData: state => state.financialWithdraw.withdrawTaxExamine
        })
    },
    methods: {
        fnpagechange(page, limit) {
            [this.page.page, this.page.limit] = [page,limit];
            this.getList();
        },
        ...mapMutations({
            setWithdrawTaxExamine: "financialWithdraw/setWithdrawTaxExamine"
        }),
        fnpagechange(page, limit) {
            [this.page.page, this.page.limit] = [page,limit];
            this.getList();
        },
        getList() {
            let params = {
                page: this.page.page,
                limit: this.page.limit,
                startTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[0]).format('X'): moment(new Date(new Date().setHours(0, 0, 0, 0))).format('X'),
                endTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[1]).format('X'): moment().format('X'),
                rebateNo: this.searchData.rebateNo,
                merchantId: this.searchData.merchantId,
                merchantName: this.searchData.merchantName,
                grade: this.searchData.grade
            }
            this.loadingTable = true;
            this.$http.get(this.$api.applyTaxRebatePage, params, true).then(res=>{
                this.setWithdrawTaxExamine(Object.assign({searchForm: this.searchData}, {page: this.page}));
                this.loadingSearch = false;
                this.loadingTable = false;
                this.tableData = res? res.data: [];
                this.page.total = res? res.total: 0;
            })
            .catch(err=>{
                [this.loadingSearch, this.loadingTable, this.tableData, this.page.total] = [false, false, [], 0];
                this.$message.error('查询失败');
            })
        },
        search() {
            this.page.page = 1;
            this.loadingSearch = true;
            this.getList();
        },
        clear() {
            [this.page.page, this.page.limit, this.searchData] = [1,10,{rangeTime: [moment().week(moment().week()).startOf('month'), moment()]}];
            this.getList();
        },
        verify(row) {
            this.visible = true;
            this.detail = row;
        },
        confirm() {
            let params = {
                rebateNo: this.detail.rebateNo,
                agree: this.radio,
            }
            if(this.radio ==0) {
                if(!this.error) {
                    this.$message.error('请输入不通过原因！')
                    return false;
                }
                params.reason = this.error;
            }
            this.loadingAudit = true;
            this.$http.post(this.$api.auditTaxRebate ,params, true).then(res=>{
                this.loadingAudit = false;
                this.visible = false;
                this.$message.success('审核成功');
                this.getList();
            })
            .catch(err=>{
                this.loadingAudit = false;
                this.visible = false;
                this.$message.error(err.message);
            })
        },
        // savePic(imgsrc) {
        //     if(imgsrc) {
        //         // location.href('')
        //     }
        //     let name = imgsrc.match(/\.com\/(\S*)\?/)[1];
        //     let image = new Image();
        //     image.setAttribute("crossOrigin", "anonymous");
        //     image.onload = function() {
        //         let canvas = document.createElement("canvas");
        //         canvas.width = this.width;
        //         canvas.height = this.height;
        //         let context = canvas.getContext("2d");
        //         context.drawImage(this, 0, 0, this.width, this.height);
        //         let url = canvas.toDataURL("image/png");
        //         let a = document.createElement("a");
        //         let event = new MouseEvent("click");
        //         a.download = name || "photo";
        //         a.href = url;
        //         a.dispatchEvent(event);
        //     };
        //     image.src = imgsrc;
        // },
        downExcel(limit) {
            let params = {
                page: this.page.page,
                limit: limit,
                startTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[0]).format('X'): moment(new Date(new Date().setHours(0, 0, 0, 0))).format('X'),
                endTime: this.searchData.rangeTime? moment(this.searchData.rangeTime[1]).format('X'): moment().format('X'),
                rebateNo: this.searchData.rebateNo,
                merchantId: this.searchData.merchantId,
                merchantName: this.searchData.merchantName,
                grade: this.searchData.grade
            }
            this.loadingDown = true;

            this.$http
            .downGet(this.$api.taxRebatePageDown, params, true)
            .then(res=>{
                this.loadingDown = false;
                this.$message.success(res.message);
            })
            .catch(err=>{
                this.loadingDown = false;
                this.$message.error(err.message)
            })
        }
    },
    filters: {
        formatAudit(val) {
            return enumFormatter(val, EnumAudit, {key: 'value', value: 'label'})
        }
    }
}
</script>
<style scoped lang="scss">
    .drawback-look-throu-list {
        .verify {
            /deep/ .el-row .el-col {
                margin-bottom: 15px;
            }
        }
        .upload-class {
            text-decoration: none;
            font-size: 12px;
        }
    }
</style>