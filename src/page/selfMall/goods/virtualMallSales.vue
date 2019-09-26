//TODO 修改代理本地
<template>
    <div class="virtual-mall-sales xk-container">
        <div class="xk-radius xk-search">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button :size="$size" type="primary" @click="clear()">清空</el-button>
                    <el-button :size="$size" :loading="loadingSearch" type="primary" @click="search()">查询</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="150px" :model="searchForm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input :size="$size" v-model.trim="searchForm.goodsName" placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input :size="$size" v-model.trim="searchForm.goodsId" placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-cascader v-model="searchForm.category" :size="$size" :options="options" :props="props" change-on-select placeholder="全部分类"
                                style="width: 100%;">
                            </el-cascader>
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
            <el-table :data="tableData" v-loading="loadingTable">
                <el-table-column label="商品分类">
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
                        <el-button :size='$size' type="primary" @click="setSales(scope.row, false)" v-permission="'virtualMallSalesAdd'">添加销量</el-button>
                        <el-button :size='$size' type="primary" @click="setSales(scope.row, true)" v-permission="'virtualMallSalesDetail'">查看详情</el-button>
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
                <el-button :size="$size" :loading="submitLoading" :disabled="submitLoading" @click="submit('setForm')">确定</el-button>
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
let goodsCategroy = [];
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
            loadingSearch: false,
            loadingTable: false,
            tableData: [],
            virtualCustomHistories: [],
            virtualPage: { page: 1, limit: 10, total: 0 },
            searchForm: {},
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            options: [],
            props: {
                value: 'code',
                label: 'name'
            },
            goodsCategroy: [],
            setForm: {
                changeRadix: changeRadix
            },
            visible: false,
            rules: {
                checkNum: [{ required: true, validator: checkNum, trigger: 'blur' }]
            },
            editStatus: false,
            viewStatus: false,
            detail: {},
            submitLoading: false,
            customNum: '',
            refreshRow: null
        };
    },
    created() {
        this.searchData ? ((this.page = this.searchData.page), (this.searchForm = this.searchData.searchForm)) : null;
        this.getQueryList();
        this.getList();
    },
    computed: {
        ...mapState({
            searchData: state => state.selfMallGoods.mallSales
        })
    },
    methods: {
        ...mapMutations({
            setSearchMallSales: 'selfMallGoods/setSearchMallSales'
        }),
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
        clear() {
            this.page.page = 1;
            this.searchForm = {};
            this.setSearchMallSales(null);
            this.getList();
        },
        search() {
            this.loadingSearch = true;
            this.page.page = 1;
            this.getList();
        },
        getList() {
            let params = {
                xkModule: 'mall',
                category:
                    this.searchForm.category && this.searchForm.category[this.searchForm.category.length - 1] !== '000000'
                        ? this.searchForm.category[this.searchForm.category.length - 1]
                        : '',
                goodsId: this.searchForm.goodsId,
                goodsName: this.searchForm.goodsName,
                page: this.page.page,
                limit: this.page.limit
            };
            this.loadingTable = true;
            this.$http
                .get(this.$api.virtualQPage, params, true)
                .then(res => {
                    console.log(res);
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.setSearchMallSales(Object.assign({ searchForm: this.searchForm }, { page: this.page }));
                    this.page.total = res ? res.total : 0;
                    this.tableData = res ? res.data : [];
                })
                .catch(err => {
                    this.loadingSearch = false;
                    this.loadingTable = false;
                    this.$message.error(err.message);
                });
        },
        getQueryList() {
            this.$http
                .get(this.$api.queryList, {}, true)
                .then(res => {
                    this.goodsCategroy = this.flatten(res);
                    goodsCategroy = this.goodsCategroy;
                    let obj = {
                        code: '000000',
                        name: '全部'
                    };
                    this.options = res;
                    this.options.unshift(obj);
                })
                .catch(err => {
                    this.$message.error(err.message);
                });
        },
        //扁平化数组
        flatten(arr) {
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                if (Array.isArray(arr[i].children)) {
                    res = res.concat(this.flatten(arr[i].children));
                } else {
                    res.push(arr[i]);
                }
            }
            return res;
        },
        setSales(row, bool) {
            console.log('TCL: setSales -> row', row);
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
                    // '/gq/manager/om/virtualDetail/1.0',
                    this.$api.virtualDetail,
                    {
                        goodsId: row.id,
                        xkModule: 'mall',
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
                        })
                    };
                    this.visible = true;
                })
                .catch(err => {
                    if (err.code === 1068) {
                        this.setForm = {
                            goodsIds: [row.id],
                            changeRadix: [
                                { date: 1, number: '', label: '1号基数' },
                                { date: 6, number: '', label: '6号基数' },
                                { date: 11, number: '', label: '11号基数' },
                                { date: 16, number: '', label: '16号基数' },
                                { date: 21, number: '', label: '21号基数' },
                                { date: 26, number: '', label: '26号基数' }
                            ]
                        };
                        console.log(changeRadix);
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
                console.log('TCL: submit -> v', v);
                if (v) {
                    let params = {
                        xkModule: 'mall',
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
                    // let url = this.editStatus ? '/gq/manager/om/virtualUpdate/1.0' : '/gq/manager/om/virtualCreate/1.0';
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
                let code = row.categories.cc_thr ? row.categories.cc_thr : row.categories.cc_sec ? row.categories.cc_sec : row.categories.cc_fri;
                return enumFormatter(code, goodsCategroy, { key: 'code', value: 'name' });
            }
        }
    },
    watch: {
        options(val, old) {
            this.goodsCategroy = this.flatten(val);
        },
        visible(val) {
            console.log('TCL: visible -> val', val);
            if (!val) {
                this.customNum = '';
                this.virtualCustomHistories = [];
                this.refreshRow = null;
                this.virtualPage = { page: 1, limit: 10, total: 0 };
            }
        }
    }
};
</script>

<style scoped lang="scss">
.virtual-mall-sales {
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
