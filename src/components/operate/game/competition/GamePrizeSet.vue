/*
 * @Author: liusheng
 * @Date: 2019-06-15 11:10:33
 * @Last Modified by: liusheng
 * @Last Modified time: 2019-06-28 20:21:17
 */
//  选择奖品及列表
<template>
    <div class='game-prize-set'>
        <h4 v-show="!isFinal">
            <slot name="title"></slot>
            <div class="btn">
                <el-button type="primary" :size="$size" @click="dialogVisible.set = true">选择商品</el-button>
            </div>
        </h4>
        <div class="prize-item">
            <div class="title">实物奖品：</div>
            <div class="btn" v-show="isFinal">
                <el-button type="primary" :size="$size" @click="dialogVisible.set = true">选择商品</el-button>
            </div>
        </div>
        <el-table :data="matterTable" :size="$size" border stripe class="prize-table" style="width: 100%">
            <el-table-column prop="date" label="奖品ID">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeId }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="奖品来源">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeSource| prizeSource }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="发放方式">
                <template slot-scope="scope">
                    <span>{{ scope.row.terrain == 'offline' ? "线下" : "线上"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="奖品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="每人可获得数量">
                <template slot-scope="{row}">
                    <span>{{ row.everyoneNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="最大成本价">
                <template slot-scope="{row}">
                    <span>{{ row.product.costPrice?$math.divide($math.multip(row.product.costPrice, row.everyoneNum),100):0}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="danger" :size="$size" @click.native.prevent="deletMatterPrice(row,$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <p class="prize-item">总最大成本价：{{matterAllMoney}}</p>

        <p class="prize-item">虚拟奖品：</p>
        <el-table :data="fictitiousTable" :size="$size" border stripe class="prize-table" style="width: 100%">
            <el-table-column prop="date" label="奖品ID">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeId }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="奖品来源">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeSource| prizeSource }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="发放方式">
                <template slot-scope="scope">
                    <span>{{ scope.row.terrain == 'offline' ? "线下" : "线上"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="奖品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="每人可获得数量">
                <template slot-scope="{row}">
                    <span>{{ row.everyoneNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="danger" :size="$size" @click.native.prevent="deletFictitiousPrice(row,$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <p class="prize-item">总数量：{{fictitiousAllNum}}</p>
        <div class="tips">
            <slot name="tips"></slot>
        </div>
        <!--设置奖品-->
        <el-dialog title="设置奖品" :visible.sync="dialogVisible.set" width="963px">
            <div class="set-prize">
                <el-form class="search-form" :model="searchForm" ref="ruleForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-form-item label="奖品ID：">
                                <el-input :size="$size" v-model="searchForm.prizeId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="奖品名称：">
                                <el-input :size="$size" v-model="searchForm.prizeName" style="width:80%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="奖品来源：">
                                <el-select :size="$size" v-model="searchForm.prizeSource" placeholder="请选择">
                                    <el-option label="新增线下奖品" value="INCREASE">
                                    </el-option>
                                    <el-option label="精选商城" value="BOUTIQUE_MALL">
                                    </el-option>
                                    <el-option label="AA彩票" value="AA_LOTTERY">
                                    </el-option>
                                    <el-option label="比赛专用奖品" value="WELFARE_MALL">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary" :loading="loading.search" :size="$size" style="margin-top:5px;"
                                @click="fnSearch">搜索</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="set-items">
                    <el-table :data="tableData" :size="$size" border stripe v-loading="loading.table" ref="multipleTable"
                        class="prize-table" @selection-change="handleSelectionChange" style="width: 100%">
                        <el-table-column prop="date" type="selection">
                        </el-table-column>
                        <el-table-column prop="address" label="奖品名称">
                            <template slot-scope="scope">
                                <span>{{ scope.row.prizeName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="每人可获得数量">
                            <template slot-scope="{row,$index}">
                                <span>每人可获得数量：</span>
                                <el-input :size="$size" v-model.number="row.everyoneNum" style="width:100px;"
                                    @keyup.native="fnKeyUp(row.everyoneNum,$index)"></el-input>
                                <p style="color:red" v-if="row.errorTip">{{row.errorTip}}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页组件-->
                    <div class="pagenation marginbottom20">
                        <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage">
                        </pagination>
                    </div>
                </div>
                <el-button :size="$size" type="primary" @click="dialogVisible.add = true">新增奖品</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button :size="$size" @click="dialogVisible.set = false">取 消</el-button>
                <el-button :size="$size" type="primary" @click="suerInfo">确 定</el-button>
            </span>
        </el-dialog>
        <PrizeAdd :dialogVisible.sync="dialogVisible.add"></PrizeAdd>
    </div>
</template>
<script>
import PrizeAdd from '@/components/operate/game/competition/PrizeAdd/PrizeAdd';
import { prizeSource } from '@/util/publicParams';
export default {
    name: 'gamePrizeSet',
    data() {
        return {
            tableData: [],
            dialogVisible: {
                set: false,
                add: false
            },
            searchForm: {},
            multipleSelection: [], //选中奖品
            matterPrice: [], //实物奖品
            fictitiousPrice: [], //虚拟奖品
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            loading: {
                search: false
            }
        };
    },
    props: {
        // 是否为最终轮
        isFinal: {
            type: Boolean,
            default: false
        },
        value: {}
    },
    components: {
        PrizeAdd
    },
    computed: {
        matterTable() {
            // let set = new Set();
            // this.matterPrice.forEach(item => {
            //     set.add(JSON.stringify(item))
            // });
            // let arr = [];
            // for (let item of set.keys()) {
            //     arr.push(JSON.parse(item))
            // }
            let obj = {};
            this.matterPrice.forEach(item => {
                obj[item.prizeId] = item;
            });
            let arr = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(obj[key]);
                }
            }
            console.log(arr);
            return arr;
        },
        fictitiousTable() {
            // let set = new Set();
            // this.fictitiousPrice.forEach(item => {
            //     set.add(JSON.stringify(item))
            // });
            // let arr = [];
            // for (let item of set.keys()) {
            //     arr.push(JSON.parse(item))
            // }
            let obj = {};
            this.fictitiousPrice.forEach(item => {
                obj[item.prizeId] = item;
            });
            let arr = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(obj[key]);
                }
            }
            return arr;
        },
        matterAllMoney() {
            let price = 0;
            this.matterTable.forEach(item => {
                price += item.product.costPrice * item.everyoneNum;
            });
            return this.$math.divide(price, 100);
        },
        fictitiousAllNum() {
            let num = 0;
            this.fictitiousTable.forEach(item => {
                num += ~~item.everyoneNum;
            });
            return num;
        }
    },
    created() {},
    mounted() {
        this.fnValueInit();
    },
    methods: {
        fnValueInit() {
            console.log(this.value);
            if (this.value && this.value.length) {
                this.multipleSelection = [];
                this.value.forEach((item, index) => {
                    if (item.fromTable == 'matterTable') {
                        this.matterPrice.push(item.allData);
                    } else {
                        this.fictitiousPrice.push(item.allData);
                    }
                    this.multipleSelection.push(item.allData);
                });
            }
        },
        fnKeyUp(value, index) {
            if (!Number.isInteger(value) || value < 1) {
                this.$set(this.tableData[index], 'errorTip', '请输入正整数');
            } else {
                this.$set(this.tableData[index], 'errorTip', '');
            }
        },
        //分页
        changePage(page, limit) {
            this.page.page = page;
            this.page.limit = limit;
            this.getListPrize();
        },
        //获取奖品列表
        getListPrize(param) {
            let data = {
                page: this.page.page,
                limit: this.page.limit,
                ...param
            };
            this.loading.table = true;
            this.$http
                .post(this.$api.listPrize, data, true)
                .then(res => {
                    this.page.total = res.total;
                    this.tableData = res.data ? res.data : [];
                    this.loading = {
                        search: false,
                        table: false
                    };
                    //默认赋值1
                    this.tableData.map(item => {
                        return (item.everyoneNum = 1);
                    });
                    let multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection)); //必须深拷贝，否则再次点击时数据会丢失
                    this.$nextTick(() => {
                        let arr = [];
                        multipleSelection.forEach(item => {
                            res.data.forEach((element, index) => {
                                if (item.prizeId == element.prizeId) {
                                    arr.push(this.tableData[index]);
                                }
                            });
                        });
                        this.toggleSelection(arr);
                    });
                })
                .catch(err => {
                    this.loading = {
                        search: false,
                        table: false
                    };
                    this.tableData = [];
                    this.$message.error(err.message);
                });
        },
        fnSearch() {
            let obj = {};
            this.loading.search = true;
            for (const key in this.searchForm) {
                if (this.searchForm.hasOwnProperty(key) && this.searchForm[key]) {
                    obj[key] = this.searchForm[key];
                }
            }
            this.getListPrize(obj);
        },
        //选中的奖品
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        suerInfo() {
            if (this.multipleSelection.length > 0) {
                this.multipleSelection.forEach(item => {
                    if (item.prizeSource == 'WELFARE_MALL') {
                        //添加到虚拟产品
                        this.fictitiousPrice.push(item);
                    } else {
                        //添加到实物产品
                        this.matterPrice.push(item);
                    }
                });
                this.dialogVisible.set = false;
            } else {
                this.$message.error('请至少选择一种奖品，再确定提交');
            }
        },
        //删除实物
        deletMatterPrice(target, index) {
            let arr = this.multipleSelection.filter(item => {
                return item.prizeId == target.prizeId;
            });
            // table选中状态切换
            this.toggleSelection(arr);
            // 删除实物表格数据
            this.matterPrice = this.matterPrice.filter(item => {
                return item.prizeId !== target.prizeId;
            });
        },
        //删除虚拟
        deletFictitiousPrice(target, index) {
            let arr = this.multipleSelection.filter(item => {
                return item.prizeId == target.prizeId;
            });
            // table选中状态切换
            this.toggleSelection(arr);
            // 删除虚拟表格数据
            this.fictitiousPrice = this.fictitiousPrice.filter(item => {
                return item.prizeId !== target.prizeId;
            });
        },
        toggleSelection(arr) {
            try {
                arr.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row, true);
                });
            } catch (error) {}
        }
    },
    watch: {
        dialogVisible: {
            handler(val) {
                if (val.set) {
                    this.getListPrize();
                }
            },
            deep: true
        },
        matterTable(val) {
            let arr = [];
            val.forEach(item => {
                arr.push({
                    awardNum: item.everyoneNum,
                    prizeId: item.prizeId,
                    fromTable: 'matterTable',
                    allData: item
                });
            });
            this.fictitiousTable.forEach(item => {
                arr.push({
                    awardNum: item.everyoneNum,
                    prizeId: item.prizeId,
                    fromTable: 'fictitiousTable',
                    allData: item
                });
            });
            this.$emit('input', arr);
        },
        fictitiousTable(val) {
            let arr = [];
            val.forEach(item => {
                arr.push({
                    awardNum: item.everyoneNum,
                    prizeId: item.prizeId,
                    fromTable: 'fictitiousTable',
                    allData: item
                });
            });
            this.matterTable.forEach(item => {
                arr.push({
                    awardNum: item.everyoneNum,
                    prizeId: item.prizeId,
                    fromTable: 'matterTable',
                    allData: item
                });
            });
            this.$emit('input', arr);
        }
    }
};
</script>
<style scoped lang="scss">
.game-prize-set {
    h4 {
        font-weight: 600;
        height: 40px;
        line-height: 30px;
        border-bottom: 1px solid #ada7a7;
        color: #333333;
        margin-bottom: 20px;
        position: relative;
        .btn {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .tips {
        padding: 10px 0;
        color: #ff0000;
    }
    .prize-item {
        margin-bottom: 15px;
        font-size: 14px;
        position: relative;
        height: 32px;
        line-height: 32px;
        .btn {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .prize-table {
        margin-bottom: 15px;
    }
    .set-prize {
        .search-form {
            border-bottom: 1px solid #ada7a7;
            margin-bottom: 15px;
        }
        .set-items {
            padding: 10px;
        }
    }
}
</style>
