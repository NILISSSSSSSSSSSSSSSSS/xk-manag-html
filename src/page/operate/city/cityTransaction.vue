<template>
    <div class="xk-container city-transaction">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="地区：">
                                    <province-cascader v-model="searchForm.rigion"></province-cascader>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <table class="xk-table" v-loading="loadingTable">
                    <thead class="xk-thead">
                        <tr>
                            <th>
                                <div class="cell">省</div>
                            </th>
                            <th>
                                <div class="cell">市</div>
                            </th>
                            <th>
                                <div class="cell">区县</div>
                            </th>
                            <th>
                                <div class="cell">城市商户数量</div>
                            </th>
                            <th>
                                <div class="cell">开启订单交易</div>
                            </th>
                            <th>
                                <div class="cell">开启外卖</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableData" :key="index">
                            <td :rowspan="item.rowA" v-if="item.rowA">{{ item.provinceCode | formatProvince }}</td>
                            <td :rowspan="item.rowB" v-if="item.rowB">{{ item.citiesCode | formatCity }}</td>
                            <td>{{ item.districtCode | formatDistrict }}</td>
                            <td>{{ item.merchantCount }}</td>
                            <td>
                                <el-switch
                                    v-permission="'cityTransactionOrder'"
                                    v-model="item.isOrder"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="openTransaction($event,item.id)"
                                    active-color="#13ce66"
                                    inactive-color="#dcdfe6">
                                </el-switch>
                            </td>
                            <td>
                                <el-switch
                                    v-permission="'cityTransactionFoods'"
                                    v-model="item.isTakeout"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="openFood($event,item.id)"
                                    active-color="#13ce66"
                                    inactive-color="#dcdfe6">
                                </el-switch>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="tableData.length==0" class="empty-data">
                        暂无数据
                </div>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

    export default {
        components: {
            ProvinceCascader
        },
        data() {
            return {
                searchForm: {},
                searchLoading: false,
                tableData: [],
                loadingTable: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            //获取列表信息
            getList() {
                let params = {
                    limit: this.page.limit,
                    page: this.page.page
                };
                if(this.searchForm.rigion){
                    let [p, c, d] = [...this.searchForm.rigion];
                    p? params.provinceCode = p: null;
                    c? params.cityCode = c: null;
                    d? params.districtCode = d: null;
                }
                this.loadingTable = true;
                this.$http.get(this.$api.cityTradePage, params, true).then(res=>{
                    this.searchLoading = false;
                    this.loadingTable = false;
                    if(!res.data){
                        this.tableData = [];
                        return false;
                    }
                    let arr = [];
                    let province = res.data;
                    for(let i=0, len=province.length; i< len; i++) {
                        for(let j =0, lenJ = province[i].children.length; j < lenJ; j++) {
                            for(let k =0, lenK = province[i].children[j].children.length ; k < lenK ;k++) {
                                let obj = province[i].children[j].children[k];
                                obj.citiesCode = province[i].children[j].cityCode;
                                obj.provinceCode = province[i].provinceCode;
                                if(k===0) {
                                    obj.rowB = lenK;
                                }
                                if(k==0 && j ==0) {
                                    obj.rowA = lenJ + this.getLen(province[i].children)
                                }
                                arr.push(obj)
                            }
                        }
                    }
                    this.tableData = arr;
                    this.page.total = res.total;
                })
                .catch(err=>{
                    err.code===409? this.tableData = []:null;
                    this.$message.error(err.message);
                    this.searchLoading = false;
                    this.loadingTable = false;
                })
            },
            getLen(arr) {
                let result = 0;
                for(let i =0, len = arr.length ; i< len ;i++) {
                    if(arr[i].children instanceof Array) {
                        result += arr[i].children.length -1;
                    }
                }
                return result;
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            clearCondition() {
                this.searchForm = {};
                this.page.page = 1;
                this.getList();
            },
            //开启、关闭订单交易
            openTransaction(val, id) {
                let url = this.$api.cityTradeOrderEnabled;
                val === 1? url: url = this.$api.cityTradeOrderDisabled;
                this.$http.post(url, {id: id}, true).then(res=>{
                    this.$message.success(val===1? '开启订单交易成功': '关闭订单交易成功')
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //开启、关闭外卖
            openFood(val, id) {
                let url = this.$api.cityTradeTakeoutEnabled;
                val === 1? url: url = this.$api.cityTradeTakeoutDisabled;
                this.$http.post(url, {id, id}, true)
                    .then(res=>{
                        this.$message.success(val===1?'开启外卖成功': '关闭外卖成功')
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
            }
        },
        filters: {
            formatProvince(val) {
                return province.get(val)? province.get(val).name: val;
            },
            formatCity(val) {
                return city.get(val)? city.get(val).name: val;
            },
            formatDistrict(val) {
                return district.get(val)? district.get(val).name: val;
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "./cityTransaction.scss"
</style>
