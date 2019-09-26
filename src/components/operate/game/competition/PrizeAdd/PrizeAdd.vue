/*
 * @Author: liusheng 
 * @Date: 2019-06-14 13:50:38
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-28 21:40:02
 */
<template>
    <div>
        <el-dialog title="新增奖品" :visible.sync="dialogVisible" append-to-body :before-close="cancleDalog" width="963px">
            <div class='prize-add'>
                <div class="prize-radio">
                    <p class="title shiwu">实物奖品</p>
                    <template v-for="(value,key) in config">
                        <el-radio border :key="key" v-model="prizeRadio" :label="key" v-show="value.isReal" @change="changeInfo"
                            :size="$size">{{value.name}}</el-radio>
                    </template>
                    <p class="title">虚拟奖品</p>
                    <template v-for="(value,key) in config">
                        <el-radio border :key="key" v-model="prizeRadio" :label="key" v-show="!value.isReal" @change="changeInfo"
                            :size="$size">{{value.name}}</el-radio>
                    </template>
                </div>
                <div class="prize-box">
                    <el-form v-if="prizeRadio=='BOUTIQUE_MALL'||prizeRadio=='WELFARE_MALL'">
                        <el-form-item label="商品ID：">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-input :size="$size" v-model="prizeSearchId"></el-input>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" :size="$size" @click="fnSearch" :loading="searchLoading">查询
                                    </el-button>
                                    <el-button type="success" :size="$size" @click="fnSelectGoods">选择商品</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                    <div class="prize-content" v-if="dialogVisible">
                        <Prize :searchLoading.sync="searchLoading" v-model="prizeData" :prizeConfig="prizeConfig" ref="addPrize"
                            :tableEnum="tableEnum"></Prize>
                    </div>
                </div>
                <div class="btns">
                    <!--<el-button @click="$emit('update:dialogVisible',false)" :size="$size">取 消</el-button>-->
                    <el-button @click="cancleDalog" :size="$size">取 消</el-button>
                    <el-button type="primary" @click="fnAddPrize" :size="$size">确 定</el-button>
                </div>

                <el-dialog center title="选择奖品" :visible.sync="prizeDialog" append-to-body width="1163px"
                    :before-close="handleClose">
                    <div>
                        <!--标题-->
                        <div class="xk-radius">
                            <div class='xk-title'>
                                <div class="vus-title">
                                    <span></span>奖品列表查询
                                </div>
                                <div class="vus-btn">
                                    <el-button :loading="isLoading" type="primary" :size="$size" @click="submitForm('ruleForm')">
                                        搜索</el-button>
                                    <el-button type="primary" :size="$size" @click="resetForm('ruleForm')">清空</el-button>
                                </div>
                                <div class="vus-bottom"></div>
                            </div>
                            <!--内容-->
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="xk-search demo-ruleForm">
                                <!--第一排-->
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="奖品名称：">
                                            <el-input :size="$size" v-model.trim="ruleForm.name" placeholder="输入奖品名称"
                                                style="width: 100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="奖品ID：">
                                            <el-input :size="$size" v-model.trim="ruleForm.id" style="width: 100%;"
                                                placeholder="请输入商品ID"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>

                        <!--表格数据-->
                        <div class="xk-radius marintop20">
                            <!--表格标题-->
                            <div class='xk-title'>
                                <div class="vus-title">
                                    <span></span>列表
                                </div>
                                <div class="vus-bottom"></div>
                            </div>
                            <!--内容-->
                            <el-table highlight-current-row :data="tableData" tooltip-effect="dark" v-loading="loadingTable"
                                ref="singleTable">
                                <el-table-column label="奖品ID" prop="id" width="300"></el-table-column>
                                <el-table-column label="商品图片" width="120">
                                    <template slot-scope="scope">
                                        <div class="pic-list">
                                            <img style="width: 50px;height: 50px;" v-if="prizeRadio=='BOUTIQUE_MALL'"
                                                :src="scope.row.pic" alt="">
                                            <img style="width: 50px;height: 50px;" v-if="prizeRadio=='WELFARE_MALL'"
                                                :src="scope.row.microPic" alt="">
                                            <!--@click="$viewImage(scope.row.pic)"-->
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="奖品名称" width="250">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.name }}</span>
                                    </template>
                                </el-table-column>
                                <!--实物-->
                                <div v-if="prizeRadio=='BOUTIQUE_MALL'">
                                    <el-table-column label="零售价格(元)" width="120">
                                        <template slot-scope="scope">
                                            {{ $math.divide(scope.row.b2cPrice, 100) }}
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column-->
                                    <!--label="商品分类"-->
                                    <!--prop="categories"-->
                                    <!--:formatter="formatterCat"-->
                                    <!--width="120">-->
                                    <!--</el-table-column>-->
                                    <el-table-column label="商品品牌" width="120px" prop="brandName"></el-table-column>
                                </div>
                                <!--虚拟-->
                                <div v-if="prizeRadio=='WELFARE_MALL'">
                                    <el-table-column label="奖品类型" width="150">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.type==='substance'?'实物':'虚拟' }}</span>
                                        </template>
                                    </el-table-column>
                                </div>
                                <!--<el-table-column label="奖品用途" width="150">-->
                                <!--<template slot-scope="scope">-->
                                <!--<span>{{ scope.row.usage | formatUsage }}</span>-->
                                <!--</template>-->
                                <!--</el-table-column>-->
                                <el-table-column fixed="right" width="200" label="操作">
                                    <template slot-scope="scope">
                                        <el-button v-permission="commoditySalesEdit" :size="$size" @click="handleInfo(scope.row)">
                                            选择
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--分页组件-->
                            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage">
                            </pagination>
                        </div>
                    </div>
                    <!--<div style="text-align: center;margin-top: 20px;">-->
                    <!--<el-button @click="handleClose" :size="$size">取 消</el-button>-->
                    <!--<el-button type="primary" @click="surePrize" :size="$size">确 定</el-button>-->
                    <!--</div>-->
                </el-dialog>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import defaultConfig from './config';
import Prize from '@/components/operate/game/competition/Prize';

import { PrizeUsageEnum } from '@/util/publicParams.js';
import { enumFormatter, getUUid } from '@/util/publicMehotds.js';
import { mapMutations, mapState } from 'vuex';

//枚举奖品用途
const EnumUseage = ['expense', 'welfare'];
//枚举奖品类型
const EnumCategory = [{ key: 'substance', code: '实物' }, { key: 'virtual', code: '虚拟' }];
export default {
    name: 'prizeAdd',
    data() {
        return {
            prizeRadio: '',
            prizeData: {
                totalCostPrice: '',
                product: {
                    productImage: '',
                    productId: '',
                    costPrice: '',
                    specification: '',
                    productName: ''
                },
                prizeSource: '',
                articleType: '',
                prizeName: '',
                pieceNum: '',
                priceDetail: '',
                terrain: '',
                prizeId: '',
                productImage: '',
                productId: '',
                costPrice: '',
                specification: '',
                productName: '',
                skuCode: ''
            },
            prizeConfig: [],
            prizeSearchId: '',
            searchLoading: false,
            tableEnum: {},

            details: {},
            prizeDialog: false,
            currentRowId: '',
            PrizeUsageEnum,
            isLoading: false, //是否加载
            selectGoods: [], //所选的全部商品些
            ruleForm: {},
            tableData: [],
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            loadingTable: false
        };
    },
    props: {
        config:{
            type:Object,
            default: ()=>{
                return defaultConfig
            }
        },
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Prize
    },
    computed: {
        ...mapState({
            searchData: state => state.welfarePrize.searchSelfPrizeCondition
        })
    },
    created() {
        this.prizeRadio = this.prizeRadio ? this.prizeRadio : 'BOUTIQUE_MALL';
    },
    mounted() {},
    methods: {
        changeInfo() {
            this.prizeSearchId = '';
        },
        fnSelectGoods() {
            // console.log('this.prizeRadio',this.prizeRadio);
            this.ruleForm.type =
                this.prizeRadio == 'BOUTIQUE_MALL' ? 'substance' : this.prizeRadio == 'WELFARE_MALL' ? 'virtual' : '';
            this.prizeDialog = true;
            this.searchData ? ((this.page = this.searchData.page), (this.ruleForm = this.searchData.searchForm)) : null;
            if (this.prizeRadio == 'BOUTIQUE_MALL') {
                //实物
                this.getGoodsList();
            }
            if (this.prizeRadio == 'WELFARE_MALL') {
                //虚拟
                this.allList();
            }
        },
        ...mapMutations({
            setSelfPrizeCondition: 'welfarePrize/setSelfPrizeCondition'
        }),
        //分页
        changePage(page, limit) {
            this.page.page = page;
            this.page.limit = limit;
            if (this.prizeRadio == 'BOUTIQUE_MALL') {
                //实物
                this.getGoodsList();
            }
            if (this.prizeRadio == 'WELFARE_MALL') {
                //虚拟
                this.allList();
            }
        },
        //获取虚拟,奖品列表数据
        allList() {
            let data = {
                condition: {
                    name: this.ruleForm.name || '',
                    id: this.ruleForm.id || '',
                    // usage: this.ruleForm.usage,
                    usage: 'competition'
                    // type: this.ruleForm.type || ""
                },
                page: this.page.page,
                limit: this.page.limit
            };
            this.loadingTable = true;
            this.$http
                .get(this.$api.jfmallGoodsQPage4Manager, data, true)
                .then(res => {
                    this.setSelfPrizeCondition(Object.assign({ searchForm: this.ruleForm }, { page: this.page }));
                    this.isLoading = false;
                    this.page.total = res.total;
                    this.tableData = res.data;
                    this.loadingTable = false;
                })
                .catch(err => {
                    err.code === 409 ? (this.tableData = []) : '';
                    this.isLoading = false;
                    this.loadingTable = false;
                    this.$message.error(err.message);
                });
        },
        //获取实物，精选商城列表
        getGoodsList() {
            this.loadingTable = true;
            let params = {
                condition: {
                    name: this.ruleForm.name || '',
                    id: this.ruleForm.id || '',
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    minSaleQ: '',
                    maxSaleQ: '',
                    brandName: '',
                    supplierName: null
                },
                page: this.page.page,
                limit: this.page.limit
            };
            console.log('params', params);
            this.$http
                .get(this.$api.goodsOnSaleQPage, params, true)
                .then(res => {
                    // console.log(res)
                    this.setSelfPrizeCondition(Object.assign({ searchForm: this.ruleForm }, { page: this.page }));
                    this.isLoading = false;
                    this.page.total = res.total;
                    this.tableData = res.data;
                    this.loadingTable = false;
                })
                .catch(err => {
                    this.isLoading = false;
                    this.loadingTable = false;
                    this.$message.error(err.message);
                });
        },
        //提交搜索
        submitForm() {
            this.page.page = 1;
            this.isLoading = true;
            if (this.prizeRadio == 'BOUTIQUE_MALL') {
                //实物
                this.getGoodsList();
            }
            if (this.prizeRadio == 'WELFARE_MALL') {
                //虚拟
                this.allList();
            }
        },
        //重置表单
        resetForm(formName) {
            this.clearInfo();
            if (this.prizeRadio == 'BOUTIQUE_MALL') {
                //实物
                this.getGoodsList();
            }
            if (this.prizeRadio == 'WELFARE_MALL') {
                //虚拟
                this.allList();
            }
        },
        //选择
        handleInfo(val) {
            this.details = val;
            this.prizeDialog = false;
            this.prizeSearchId = val.id;
            this.prizeData = {
                totalCostPrice: '',
                product: {
                    productImage: '',
                    productId: '',
                    costPrice: '',
                    specification: '',
                    productName: ''
                },
                prizeSource: '',
                articleType: '',
                prizeName: '',
                pieceNum: '',
                priceDetail: '',
                terrain: '',
                prizeId: '',
                productImage: '',
                productId: '',
                costPrice: '',
                specification: '',
                productName: '',
                skuCode: ''
            };
            this.clearInfo();
            this.fnSearch();
        },
        //取消
        handleClose() {
            this.prizeDialog = false;
            this.clearInfo();
        },
        //数据重置
        clearInfo() {
            this.details = {};
            this.setSelfPrizeCondition(null);
            this.PrizeUsageEnum;
            this.selectGoods = [];
            this.ruleForm = {};
            // this.tableData=[];
            this.page = {
                page: 1,
                limit: 10,
                total: 0
            };
        },

        cancleDalog() {
            this.$emit('update:dialogVisible', false);
            this.prizeSearchId = '';
        },
        fnAddPrize() {
            let obj = {
                prizeSource: this.prizeRadio,
                prizeId: getUUid(),
                terrain: 'offline'
            };

            for (const key in this.prizeData) {
                if (this.prizeData.hasOwnProperty(key) && this.prizeData[key]) {
                    obj[key] = this.prizeData[key];
                    if (key == 'costPrice') {
                        obj[key] = parseFloat(this.prizeData[key]);
                    }
                }
            }
            if (this.prizeRadio == 'AA_LOTTERY' || this.prizeRadio == 'WELFARE_MALL' || this.prizeRadio == 'BOUTIQUE_MALL') {
                obj.terrain = 'online';
            } else {
                obj.terrain = 'offline';
                obj.costPrice = this.$math.multip(obj.costPrice, 100);
            }
            obj.prizeId = obj.prizeId ? obj.prizeId : getUUid();
            this.$refs.addPrize.submitForm(() => {
                this.$http
                    .get(this.$api.createPrize, obj, true)
                    .then(res => {
                        try {
                            this.$parent.fnGetPage();
                        } catch (error) {}
                        this.$emit('update:dialogVisible', false);
                        this.prizeSearchId = '';
                    })
                    .catch(err => {
                        this.$emit('update:dialogVisible', false);
                        this.$message.error(err.message);
                    });
            });
        },
        fnSearch() {
            this.searchLoading = true;
            this.$refs.addPrize.fnGetDetail(this.prizeSearchId, this.prizeRadio, true);
        }
    },
    filters: {
        formatUsage(val) {
            if (val) {
                return enumFormatter(val, PrizeUsageEnum);
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(val) {
                this.$nextTick(() => {
                    this.prizeRadio = this.prizeRadio ? this.prizeRadio : 'BOUTIQUE_MALL';
                    if (this.prizeRadio == 'INCREASE') {
                        this.prizeData.terrain = '线下';
                    }
                    this.prizeConfig = this.config[this.prizeRadio].prizeConfig;
                });
                this.prizeData = {
                    totalCostPrice: '',
                    product: {
                        productImage: '',
                        productId: '',
                        costPrice: '',
                        specification: '',
                        productName: ''
                    },
                    prizeSource: '',
                    articleType: '',
                    prizeName: '',
                    pieceNum: '',
                    priceDetail: '',
                    terrain: '',
                    prizeId: '',
                    productImage: '',
                    productId: '',
                    costPrice: '',
                    specification: '',
                    productName: ''
                };
            }
        },
        prizeRadio(val) {
            if (this.dialogVisible) {
                this.prizeConfig = this.config[val].prizeConfig;
                this.tableEnum = {};
                if (val == 'INCREASE') {
                    this.prizeData.terrain = '线下';
                }
            }
        }
    }
};
</script>
<style scoped lang="scss">
.prize-add {
    .prize-radio {
        width: 100%;
        .title {
            margin: 10px 0;
        }
        .shiwu {
            margin-top: 0;
        }
    }
    .prize-box {
        margin-top: 10px;
        padding: 10px;
        background: #efefef;
        border-radius: 6px;
        .prize-content {
            padding: 10px;
            background: #ffffff;
            border-radius: 6px;
        }
    }
    .btns {
        padding-top: 20px;
        text-align: right;
    }
    /deep/ .el-radio.is-bordered {
        margin-left: 0;
        margin-right: 10px;
    }
}
</style>
