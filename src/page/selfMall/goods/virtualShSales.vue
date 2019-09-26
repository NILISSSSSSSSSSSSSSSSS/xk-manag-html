<template>
    <div class="virtual-sh-sales xk-container">
        <div class="xk-radius xk-search">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button :size="$size" type="primary" @click="clear()">清空</el-button>
                    <el-button :size="$size" type="primary" :loading="loadingSearch" @click="search()">查询</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="150px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input v-model="searchForm.goodsName" :size="$size" placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input v-model="searchForm.goodsId" :size="$size" placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-select :size="$size" v-model="searchForm.category">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺名称：">
                            <el-select :size="$size" filterable remote v-model="searchForm.shopName" :remote-method="getShops">
                                <el-option v-for="(item,index) in goodsNames" :key="index" :label="item.shopName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="xk-radius marintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loadingTable">
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column label="店铺名称" prop="shopName"></el-table-column>
                <el-table-column label="商品分类" :formatter="formatCat">
                    <template slot-scope="scope">
                        {{ scope.row | formatterCat }}
                    </template>
                </el-table-column>
                <el-table-column label="商品ID" prop="id"></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.picUrl" alt="" @click="$viewImage(scope.row.picUrl)">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="实际销量" prop="realSaleQ"></el-table-column>
                <el-table-column label="虚假销量" prop="virtualSaleQ"></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button :size='$size' type="primary" @click="setSales(scope.row, false)" v-permission="'virtualShSalesAdd'">添加销量</el-button>
                        <el-button :size='$size' type="primary" @click="setSales(scope.row, true)" v-permission="'virtualShSalesDetail'">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <!-- 销量添加 -->
        <el-dialog :visible.sync="visible" :title="viewStatus?'查看商品销量':'添加商品销量'">
            <el-form :model="setForm" label-width="120px" ref="setForm">
                <template v-if="viewStatus">
                    <el-form-item label="商品分类：">{{ detail.categories | formatterCat }}</el-form-item>
                    <el-form-item label="商品ID：">{{ detail.id }}</el-form-item>
                    <el-form-item label="商品图片：">
                        <img :src="detail.picUrl" alt="" @click="$viewImage(detail.picUrl)">
                    </el-form-item>
                    <el-form-item label="商品名称：">{{ detail.name }}</el-form-item>
                </template>
                <h3 class="title" v-if='!viewStatus'>固定新增</h3>
                <el-row>
                    <el-col :span="8" v-for="(item,index) in setForm.changeRadix" :key="item.date">
                        <el-form-item :label="item.label" :prop="'changeRadix.' + index +'.' + 'number'" :rules="rules.checkNum">
                            <el-input :disabled="viewStatus" :size="$size" v-model.trim="item.number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-if='!viewStatus'>
                    <h3 class="title">临时新增（立即生效）</h3>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="添加虚拟销量">
                                <el-input :size="$size" v-model.trim="customNum"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <template v-if='viewStatus&&virtualCustomHistories.length>0'>
                    <h3 class="title">临时添加历史</h3>
                    <el-table :size='$size' :data="virtualCustomHistories">
                        <el-table-column label="序号" type='index' :index='function(index){return index+1}'></el-table-column>
                        <el-table-column label="实际销量" prop="realNum"></el-table-column>
                        <el-table-column label="虚拟销量" prop='oldNum'></el-table-column>
                        <el-table-column label="添加虚拟销量" prop="customNum"></el-table-column>
                        <el-table-column label="添加时间" prop="createdAt">
                            <template slot-scope="scope">
                                {{scope.row.createdAt|formatTime}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :currentPage="virtualPage.page" :pageSize="virtualPage.limit" :total="virtualPage.total" @change="changePageDialog">
                    </pagination>
                </template>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" @click="visible = false">取消</el-button>
                <el-button :size="$size" @click="submit('setForm')" :loading="submitLoading" :disabled="submitLoading">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { enumFormatter } from '../../../util/publicMehotds.js';
const changeRadix = [
    { date: 1, number: '', label: '1号基数' },
    { date: 6, number: '', label: '6号基数' },
    { date: 11, number: '', label: '11号基数' },
    { date: 16, number: '', label: '16号基数' },
    { date: 21, number: '', label: '21号基数' },
    { date: 26, number: '', label: '26号基数' }
];
let options = [];
export default {
    data() {
        const checkNum = (rule, value, call) => {
            console.log('TCL: checkNum -> value', value);
            if (value == '0') {
                return call();
            }
            if (!value) {
                return call(new Error('不能为空'));
            }
            if (!/^[1-9]\d*$/.test(value)) {
                return call(new Error('请输入正整数'));
            }
            call();
        };
        return {
            loadingTable: false,
            loadingSearch: false,
            tableData: [],
            virtualCustomHistories: [],
            virtualPage: { page: 1, limit: 10, total: 0 },
            searchForm: {},
            options: [],
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            visible: false,
            setForm: {
                changeRadix: changeRadix
            },
            editStatus: false,
            viewStatus: false,
            detail: {},
            rules: {
                checkNum: [{ required: true, validator: checkNum, trigger: 'blur' }]
            },
            goodsNames: [],
            submitLoading: false,
            customNum: '',
            refreshRow: null
        };
    },
    async created() {
        this.searchData ? ((this.page = this.searchData.page), (this.searchForm = this.searchData.searchForm)) : null;
        this.options = await this.getService();
        options = this.options;
        this.getList();
    },
    computed: {
        ...mapState({
            searchData: state => state.selfMallGoods.shSales
        })
    },
    watch: {
        visible(val) {
            console.log('TCL: visible -> val', val);
            if (!val) {
                this.customNum = '';
                this.virtualCustomHistories = [];
                this.refreshRow = null;
                this.virtualPage = { page: 1, limit: 10, total: 0 };
            }
        }
    },
    methods: {
        ...mapMutations({
            setShSales: 'selfMallGoods/setShSales'
        }),
        //获取店铺
        getShops(val) {
            if (val && val.trim()) {
                this.$http
                    .get(
                        this.$api.virtualShopQPage,
                        {
                            shopName: val,
                            limit: '9999999',
                            page: 1
                        },
                        true
                    )
                    .then(res => {
                        this.goodsNames = res ? res.data : [];
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    });
            } else {
                this.goodsNames = [];
            }
        },
        //获取服务分类
        getService() {
            return new Promise((resolve, reject) => {
                this.$http
                    .get(this.$api.serviceCatalogList, {}, true)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                        this.$message.error(err.message);
                    });
            });
        },
        changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        },
        changePageDialog(page, pageSize) {
            this.virtualPage.limit = pageSize;
            this.virtualPage.page = page;
            this.setSales(this.refreshRow, true);
        },
        handleSelectionChange(val) {
            console.log(val);
        },
        getList() {
            let params = {
                xkModule: 'shop',
                category: this.searchForm.category,
                goodsId: this.searchForm.goodsId,
                goodsName: this.searchForm.goodsName,
                shopId: this.searchForm.shopName,
                page: this.page.page,
                limit: this.page.limit
            };
            this.loadingTable = true;
            console.log(params);
            this.$http
                .get(this.$api.virtualQPage, params, true)
                .then(res => {
                    console.log(res);
                    this.setShSales(Object.assign({ searchForm: this.searchForm }, { page: this.page }));
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.page.total = res ? res.total : 0;
                    this.tableData = res ? res.data : [];
                })
                .catch(err => {
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.$message.error(err.message);
                });
        },
        search() {
            this.page.page = 1;
            this.loadingSearch = true;
            this.getList();
        },
        clear() {
            this.page.page = 1;
            this.page.limit = 10;
            this.searchForm = {};
            this.setShSales(null);
            this.getList();
        },
        formatCat(row) {
            return enumFormatter(row.categories.goodsTypeId, this.options, {
                key: 'code',
                value: 'name'
            });
        },
        setSales(row, bool) {
            this.viewStatus = bool;
            this.setForm = {};
            this.refreshRow = row;
            this.detail = {
                id: row.id,
                name: row.name,
                picUrl: row.picUrl,
                categories: row
            };
            this.$http
                .get(
                    this.$api.virtualDetail,
                    {
                        goodsId: row.id,
                        xkModule: 'shop',
                        ...this.virtualPage
                    },
                    true
                )
                .then(res => {
                    console.log('TCL: setSales -> res', res);
                    let list = res;
                    if (res.changeRadix) {
                        list = res.changeRadix;
                    }
                    if (res.virtualCustomHistories && Object.keys(res.virtualCustomHistories).length > 0 && res.virtualCustomHistories.total > 0) {
                        this.virtualCustomHistories = res.virtualCustomHistories.data;
                        this.virtualPage.total = res.virtualCustomHistories.total;
                    }
                    this.editStatus = true;
                    this.setForm = {
                        goodsIds: [row.id],
                        changeRadix: list.map((item, index) => {
                            return {
                                date: item.date,
                                number: item.number,
                                label: changeRadix[index].label
                            };
                        }),
                        shopId: row.shopId
                    };
                    this.visible = true;
                })
                .catch(err => {
                    if (err.code === 1068) {
                        this.setForm = {
                            goodsIds: [row.id],
                            shopId: row.shopId,
                            changeRadix: [
                                { date: 1, number: '', label: '1号基数' },
                                { date: 6, number: '', label: '6号基数' },
                                { date: 11, number: '', label: '11号基数' },
                                { date: 16, number: '', label: '16号基数' },
                                { date: 21, number: '', label: '21号基数' },
                                { date: 26, number: '', label: '26号基数' }
                            ]
                        };
                        this.editStatus = false;
                        this.visible = true;
                    } else {
                        this.$message.error(err.message);
                    }
                });
        },
        submit(formName) {
            if (this.viewStatus) {
                this.visible = false;
                return false;
            }
            this.$refs[formName].validate(v => {
                if (v) {
                    let params = {
                        xkModule: 'shop',
                        changeRadix: this.setForm.changeRadix.map(item => {
                            return {
                                date: item.date,
                                number: item.number
                            };
                        })
                    };
                    if (!this.editStatus) {
                        params.virtualSaleRule = [
                            {
                                goodsId: this.setForm.goodsIds[0],
                                shopId: this.setForm.shopId
                            }
                        ];
                    } else {
                        params.goodsId = this.setForm.goodsIds[0];
                        params.shopId = this.setForm.shopId;
                    }
                    // 是否有填写虚拟销量的参数,并验证
                    if (this.customNum && this.customNum > 0) {
                        if (/^[0-9]\d*$/.test(this.customNum)) {
                            if (this.editStatus) {
                                params.customNum = this.customNum - 0;
                            } else {
                                params.virtualSaleRule = [
                                    {
                                        goodsId: this.setForm.goodsIds[0],
                                        shopId: this.setForm.shopId,
                                        customNum: this.customNum - 0
                                    }
                                ];
                            }
                        } else {
                            this.$message.error('虚拟销量请填写正整数');
                            return;
                        }
                    } else if (this.customNum == '0') {
                        this.$message.info('虚拟销量应大于0');
                        return;
                    }
                    let url = this.editStatus ? this.$api.virtualUpdate : this.$api.virtualCreate;
                    this.submitLoading = true;
                    this.$http
                        .post(url, params, true)
                        .then(res => {
                            this.$message.success('保存成功');
                            this.submitLoading = false;
                            this.visible = false;
                            this.getList();
                        })
                        .catch(err => {
                            this.submitLoading = false;
                            this.$message.error(err.message);
                        });
                }
            });
        }
    },
    filters: {
        formatterCat(row) {
            if (row) {
                return enumFormatter(row.categories.goodsTypeId, options, {
                    key: 'code',
                    value: 'name'
                });
            }
        }
    }
};
</script>

<style scoped lang="scss">
.virtual-sh-sales {
    img {
        width: 60px;
        height: auto;
    }
}
.title {
    font-weight: bold;
    margin: 20px;
}
</style>
