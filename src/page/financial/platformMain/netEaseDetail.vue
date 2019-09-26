<template>
    <div class="net-ease-detail xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="loadingSearch" @click="search()">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="clear()">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="170px" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="支付订单号：">
                            <el-input :size="$size" v-model.trim="searchForm.payOrderNo" placeholder="请输入支付订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="支付方式：">
                            <el-select :size="$size" v-model.trim="searchForm.payChannel" placeholder="请选择支付方式">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="支付宝扫码支付(联动优势H5直连版)" value="支付宝扫码支付(联动优势H5直连版)"></el-option>
                                <el-option label="微信扫码支付(联动优势H5直连版)" value="微信扫码支付(联动优势H5直连版)"></el-option>
                                <el-option label="支付宝" value="支付宝"></el-option>
                                <el-option label="银联" value="银联"></el-option>
                                <el-option label="微信支付(官方H5)" value="微信支付(官方H5)"></el-option>
                                <el-option label="微信支付" value="微信支付"></el-option>
                                <el-option label="微信扫码" value="微信扫码"></el-option>
                                <el-option label="QQ钱包支付" value="QQ钱包支付"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="网易ID：">
                            <el-input :size="$size" placeholder="请输入网易ID" v-model.trim="searchForm.wyAccount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分成状态：">
                            <el-select :size="$size" v-model.trim="searchForm.isDivided">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已绑定分成" value="1"></el-option>
                                <el-option label="未绑定分成" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="终身客户绑定ID：">
                            <el-input :size="$size" placeholder="终身客户绑定ID" v-model.trim="searchForm.userId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品价格：">
                            <el-row>
                                <el-col :span="11">
                                    <el-input :size="$size" placeholder="1" v-model.trim="searchForm.priceLower"></el-input>
                                </el-col>
                                <el-col :span="2" class="center">
                                    -
                                </el-col>
                                <el-col :span="11">
                                    <el-input :size="$size" placeholder="5" v-model.trim="searchForm.priceUpper"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售收益绑定安全码：">
                            <el-input :size="$size" placeholder="销售收益绑定安全码" v-model.trim="searchForm.recommendCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="支付时间段：">
                            <el-date-picker 
                                :clearable="false"
                                :editable="false"
                                :size="$size" 
                                type="daterange" 
                                range-separator="至" 
                                start-placeholder="开始日期" 
                                v-model.trim="searchForm.timeRange"
                                end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="游戏名称：">
                            <el-input :size="$size" placeholder="请输入游戏名称" v-model.trim="searchForm.gameName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button type="success" v-permission="'netEaseDetailImport'" :size="$size" @click="openDia()">导入</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div class="total-money">总金额：<span class="xk-danger">{{ totalMoney }}</span>&nbsp;元</div>
            <el-table :size="$size" stripe :data="tableData" v-loading="loadingTable">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" label-width="120px" class="demo-table-expand">
                            <el-row style="text-align: left">
                                <el-col :span="12">
                                    <el-form-item label="序号：">
                                        <span>{{ props.row.orderNo }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="商品名称：">
                                        <span>{{ props.row.goodsName  }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="支付状态：">
                                        <span>{{ props.row.payStatus }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="支付创建时间：">
                                        <span>{{ props.row.payTime | formatTime }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="网易ID" prop="payAcc"></el-table-column>
                <el-table-column label="终身客户绑定ID" width="130" prop="uid"></el-table-column>
                <el-table-column label="用户ID" width="130" prop="userId"></el-table-column>
                <el-table-column label="销售收益绑定安全码" width="150" prop="msCode"></el-table-column>
                <el-table-column label="订单号" width="150" prop="orderNo"></el-table-column>
                <el-table-column label="支付单号" prop="payOrderNo"></el-table-column>
                <el-table-column label="商品价格">
                    <template slot-scope="scope">
                        {{ scope.row.payMoney }}
                    </template>
                </el-table-column>
                <el-table-column label="支付金额">
                    <template slot-scope="scope">
                       {{ scope.row.payMoney }}
                    </template>
                </el-table-column>
                <el-table-column label="游戏名称" prop="gameName"></el-table-column>
                <el-table-column label="支付时间">
                    <template slot-scope="scope">
                        {{ scope.row.payTimeNo | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="支付方式">
                    <template slot-scope="scope">
                        {{ scope.row.payChannel }}
                    </template>
                </el-table-column>
                <el-table-column label="是否绑定分成">
                    <template slot-scope="scope">
                        {{ scope.row.isDivided==0? '否': "是" }}
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 导入数据 -->
        <el-dialog title="导入数据" width="500px" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
            <file-upload type="excel"  @input="fileSuccess" @percent="uploadProgress">
                <el-button type="primary" :size="$size">上传</el-button><span>&nbsp;&nbsp;&nbsp;&nbsp;{{ files.fileName }}</span>
            </file-upload>
            <el-progress v-if="percentage" :percentage="percentage" status="success"></el-progress>
            <div class="btn-group">
                <el-button :size="$size" type="info" @click="visible=false">取消</el-button>
                <el-button :size="$size" :loading="loadingSure" type="primary" @click="sure()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { EnumPayWay } from '../../../util/publicParams.js';
    import FileUpload from '@/components/FileUpload.vue';
    import moment from 'moment';
    export default {
        data() {
            return {
                visible: false,
                loadingSearch: false,
                loadingTable: false,
                loadingSure: false,
                searchForm: {
                    timeRange: [moment().week(moment().week()).startOf('month'), moment()]
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                tableData: [],
                uploadForm: {},
                files: {},
                percentage: 0,
                totalMoney: 0
            }
        },
        components: {
            FileUpload
        },
        created() {
            this.getList();
        },
        methods: {
            //上传进度
            uploadProgress(num) {
                this.percentage = Number(num);
                console.log(num)
            },
            fileSuccess(file) {
                this.files = file;
            },
             //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            search() {
                this.page.page=1;
                this.loadingSearch = true;
                this.getList();
            },
            clear() {
                this.searchForm = {};
                this.page.page=1;
                this.getList();
            },
            getList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page,
                    queryCommand: {
                        ...this.searchForm
                    }
                };
                //转换时间
                if(this.searchForm.timeRange) {
                    params.queryCommand.startTime = moment(this.searchForm.timeRange[0]).format('X');
                    params.queryCommand.endTime = moment(this.searchForm.timeRange[1]).format('X');
                    Reflect.deleteProperty(params.queryCommand, "timeRange");
                }
                //转换价格
                if(this.searchForm.priceUpper&& !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(this.searchForm.priceUpper)) {
                    this.$message.error('商品价格格式不正确')
                    this.loadingSearch = false;
                    return false;
                }
                if(this.searchForm.priceLower&& !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(this.searchForm.priceLower)) {
                    this.$message.error('商品价格格式不正确')
                    this.loadingSearch = false;
                    return false;
                }
                console.log(params)

                this.loadingTable = true;
                this.$http
                .get(this.$api.yixinGameOrderQuery, params, true)
                .then(res=>{
                    console.log(res)
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.tableData = res? res.data : [];
                    this.page.total = res? res.total: 0;
                    this.totalMoney = res? res.totalMoney: 0
                })
                .catch(err=>{
                    [this.loadingSearch, this.loadingTable, this.totalMoney, this.tableData, this.page.total] = [false, false, 0, [], 0];
                    this.$message.error('查询失败');
                })
            },
            openDia() {
                this.files = {};
                this.percentage = 0;
                this.visible = true;
            },
            //导入数据
            sure() {
                if(!this.files.fileUrl) {
                    this.$message.error('请上传文件');
                    return false;
                }
                if(this.files.fileSuffix.indexOf('ms-excel')==-1) {
                    this.$message.error('文件格式不正确，请上传Excel文件')
                    return false;
                }
                this.loadingSure = true;
                console.log(this.files.fileUrl)
                this.$http.post(this.$api.yixinGameOrderImport, {
                    url: this.files.fileUrl.replace("http://","https://")
                }, true, 1800000)
                .then(res=>{
                    this.visible = false;
                    this.loadingSure = false;
                    this.$message.success('上传成功');
                    this.search()
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.loadingSure = false;
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .net-ease-detail {
        .total-money {
            margin-bottom: 10px;
        }
        .demo-table-expand {
            text-align: left;
            font-size: 0;
            /deep/ .el-form-item {
                margin-bottom: 0;
            }
        }
    }
</style>
