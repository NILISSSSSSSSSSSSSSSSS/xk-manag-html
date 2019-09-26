<template>
    <div class = 'groom-game-regulation xk-container'>
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>推荐游戏管理
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="load.search" @click="fnSearch">查询</el-button>
                    <el-button type="danger" :size="$size" @click="fnclear">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <div class="content-search">
                    <el-form ref="searchForm" 
                        :model="searchForm" 
                        label-width="100px" 
                        inline
                        :size="$size">
                        <el-form-item label="游戏id：">
                            <el-input v-model="searchForm.gameId" placeholder="请输入游戏ID"></el-input>
                        </el-form-item>
                        <el-form-item label="游戏类型：">
                            <el-select v-model="searchForm.type" placeholder="游戏类型">
                                <el-option v-for="item in EnumType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="游戏名称：">
                            <el-input v-model="searchForm.nameObm" placeholder="请输入游戏名称"></el-input>
                        </el-form-item>
                        <el-form-item label="游戏分类：">
                            <el-select v-model="searchForm.categoryCode" placeholder="游戏分类">
                                <el-option v-for="item in EnumClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人气指数：">
                            <el-select v-model="searchForm.popularity" placeholder="人气指数">
                                <el-option v-for="item in EnumPoint" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <div class="xk-body xk-radius marintop20" style="padding-top:20px !important">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button v-permission="'groomGameRegulationAdd'" type="primary" :size="$size" @click="addGameVisible = true">新增游戏</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                stripe
                :size="$size"
                v-loading="tableLoading">
                <el-table-column
                    prop="id"
                    label="游戏ID">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="游戏名称">
                </el-table-column>
                <el-table-column
                    prop="categoryCode"
                    label="游戏分类">
                    <template slot-scope="scope">
                        {{scope.row.categoryCode | GameCategory}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="index"
                    label="排序指数">
                </el-table-column>
                <el-table-column
                    prop="popularity"
                    label="人气指数">
                </el-table-column>
                <!-- <el-table-column
                    prop="exchangerate"
                    label="汇率（1晓可：xx）">
                </el-table-column> -->
                <el-table-column
                    prop="isUpper"
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.isUpper ? '上架' : '下架'}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed='right'
                    width='200px'>
                    <template slot-scope="scope">
                        <el-button :size="$size" @click="handleChaKan(scope.$index, scope.row)">查看</el-button>
                        <el-button v-permission="'groomGameRegulationDelete'" :size="$size" type="danger" :loading="scope.row.delLoading" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="changePage"></pagination>
        </div>

        <el-dialog
            :visible.sync="addGameVisible"
            width="1200px">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>搜索
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="fnAddGameSearch" :loading="load.addGameSearch">查询</el-button>
                        <el-button type="primary" :size="$size" @click="fnAddClear">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <div class="content-search">
                        <el-form ref="searchForm" 
                            :model="addGameSearchForm" 
                            label-width="100px" 
                            inline
                            :size="$size">
                            <el-form-item label="游戏id：">
                                <el-input v-model="addGameSearchForm.id" placeholder="请输入游戏ID"></el-input>
                            </el-form-item>
                            <el-form-item label="游戏类型：">
                                <el-select v-model="addGameSearchForm.type" placeholder="游戏类型">
                                    <el-option v-for="item in EnumType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="游戏名称：">
                                <el-input v-model="addGameSearchForm.nameObm" placeholder="请输入游戏名称"></el-input>
                            </el-form-item>
                            <el-form-item label="游戏分类：">
                                <el-select v-model="addGameSearchForm.categoryCode" placeholder="游戏分类">
                                    <el-option v-for="item in EnumClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="人气指数：">
                                <el-select v-model="addGameSearchForm.popularity" placeholder="人气指数">
                                    <el-option v-for="item in EnumPoint" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="xk-body xk-radius marintop20" style="padding-top:20px !important">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn"></div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                    :data="addTableData"
                    style="width: 100%"
                    border
                    stripe
                    :size="$size"
                    v-loading="addTableLoading">
                    <el-table-column
                        prop="id"
                        label="游戏ID">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="游戏名称">
                    </el-table-column>
                    <el-table-column
                        prop="categoryCode"
                        label="游戏分类">
                        <template slot-scope="scope">
                            {{scope.row.categoryCode | GameCategory}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="index"
                        label="排序指数">
                    </el-table-column>
                    <el-table-column
                        prop="popularity"
                        label="人气指数">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="exchangerate"
                        label="汇率（1晓可：xx）">
                    </el-table-column> -->
                    <el-table-column
                        prop="isUpper"
                        label="状态">
                        <template slot-scope="scope">
                            {{scope.row.isUpper ? '上架' : '下架'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        fixed='right'
                        width='200px'>
                        <template slot-scope="scope">
                            <el-button
                            :size="$size"
                            @click="handleChaKan(scope.$index, scope.row)">查看</el-button>
                            <el-button
                            :size="$size"
                            type="primary"
                            :loading="scope.row.addLoading"
                            @click="handleAdd(scope.$index, scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="changePage"></pagination>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="editVisible" width="800px" top="50px">
            <el-form :model="submitForm" label-width="150px" ref="submitForm">
                <el-form-item label="游戏名称：">
                    {{lookData.name}}
                </el-form-item>
                <el-form-item label="游戏分类：">
                    {{lookData.categoryCode | GameCategory}}
                </el-form-item>
                <el-form-item label="游戏链接：">
                    {{lookData.url}}
                </el-form-item>
                <el-form-item label="游戏大小：">
                    {{lookData.size*1024 | formatSize}}
                </el-form-item>
                <el-form-item label="游戏类型：">
                    {{lookData.type}}
                </el-form-item>
                <el-form-item label="适用平台：">
                    {{lookData.gamePlatfrom}}
                </el-form-item>
                <el-form-item label="游戏简介：">
                    {{lookData.describe}}
                </el-form-item>
                <!-- <el-form-item label="游戏币汇率：" prop="rate">
                    {{lookData.exchangerate}}（晓可币=1 xx游戏币）
                </el-form-item> -->
                <el-form-item label="排序指数：">
                    {{lookData.index}}
                </el-form-item>
                <el-form-item label="人气指数：">
                    {{lookData.popularity}}
                </el-form-item>
                <el-form-item label="游戏大图（封推）：">
                    <img :src="lookData.bigPic" style="max-width:100%">
                </el-form-item>
                <el-form-item label="游戏小图（列表）：">
                    <img :src="lookData.smallPic" style="max-width:100%">
                </el-form-item>
                <el-form-item label="游戏详情：">
                    <div v-html="lookData.detail"></div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
//枚举游戏
const EnumGame = [{label: '天天斗地主', value: '1'},{label: '天天打麻将', value: '2'}];
//枚举游戏指数
const EnumPoint = [
    {label: '1', value: 1},{label: '2', value: 2},{label: '3', value: 3},
    {label: '4', value: 4},{label: '5', value: 5}];
//枚举游戏类型
const EnumType = [{label: '端游', value: 'client'},{label: 'H5', value: 'h5'}];
//枚举游戏分类
const EnumClass = [
        {label: '益智', value: 1 },{label: '动作', value: 2 },{label: '角色', value: 3 },
        {label: '街机', value: 4 },{label: '卡牌', value: 5 },{label: '冒险', value: 6 },
        {label: '刺激', value: 7 },{label: '养成', value: 8 },{label: '文字', value: 9 }
    ];
export default {
    name:'groomGameRegulation',
    data () {
        return {
            EnumGame,
            EnumPoint,
            EnumType,
            EnumClass,
            searchForm:{},
            addGameSearchForm:{},
            tableData:[],
            addTableData:[],
            currentPage:1,
            pageSize:10,
            total:0,
            addGameVisible:false,
            submitForm:{},
            editVisible:false,
            load:{
                search:false,
                addGameSearch:false
            },
            tableLoading:false,
            addTableLoading:false,
            lookData:{}
        };
    },
    props: {},
    components: {},
    computed: {},
    created() {
        this.fnGetList();
    },
    mounted() {},
    methods: {
        changePage(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            if(this.addGameVisible){
                this.fnGetList({gameDto:{isRecommend:0}});
            }else{
                this.fnGetList();
            }
        },
        handleChaKan(index,row){
            console.log(row)
            this.editVisible = true ;
            this.lookData = row ;
        },
        handleDelete(index,row){
            console.log("删除")
            this.tableData[index].delLoading = true ;
            this.tableData.push();
            this.$http.get(this.$api.gameUnRecommend,{id:row.id} , true).then((res) => {
                console.log(res)
                this.fnGetList();
                this.tableData[index].delLoading = false ;
            }).catch((err) => {
                console.log(err);
                this.tableData[index].delLoading = false ;
                this.$message.error(err.message);
            });
        },
        handleAdd(index,row){
            console.log("添加成功")
            this.addTableData[index].addLoading = true ;
            this.addTableData.push();
            this.$http.get(this.$api.gameDoRecommend,{id:row.id} , true).then((res) => {
                console.log(res)
                this.fnGetList({gameDto:{isRecommend:0}});
                this.addTableData[index].addLoading = false ;
            }).catch((err) => {
                console.log(err);
                this.addTableData[index].addLoading = false ;
                this.$message.error(err.message);
            });
        },
        fnSearch(){//列表搜索
            this.load.search = true ;
            let obj = {
                gameDto : {isRecommend:1}
            };
            for (const key in this.searchForm) {
                obj.gameDto[key] = this.searchForm[key]
            }
            this.fnGetList(obj);
        },
        fnAddGameSearch(){//添加游戏列表搜索
            this.load.addGameSearch = true ;
            let obj = {
                gameDto : {isRecommend:0}
            };
            for (const key in this.addGameSearchForm) {
                obj.gameDto[key] = this.addGameSearchForm[key]
            }
            this.fnGetList(obj);
        },
        fnGetList(param={gameDto:{isRecommend:1}}){
            param.limit = this.pageSize ;
            param.page = this.currentPage ;
            if(param.gameDto.isRecommend){
                this.tableLoading = true ;
            }else{
                this.addTableLoading = true ;
            }
            console.log(param)
            this.$http.get(this.$api.gameQpage, param, true).then((res) => {
                console.log(res)
                this.load.search = false ;
                this.load.addGameSearch = false ;
                if(param.gameDto.isRecommend){
                    this.tableData = [] ;
                    if(res.total){
                        this.total = res.total ;
                    }
                    if(res){
                        this.tableData = res.data
                    }
                }else{
                    this.addTableData = [] ;
                    if(res.total){
                        this.total = res.total ;
                    }
                    if(res){
                        this.addTableData = res.data
                    }
                }
                this.addTableLoading = false ;
                this.tableLoading = false ;
            }).catch((err) => {
                this.load.search = false ;
                this.load.addGameSearch = false ;
                this.tableLoading = false ;
                this.addTableLoading = false ;
                this.$message.error(err.message);
            });
        },
        fnclear(){
            this.searchForm={};
            this.fnGetList();
        },
        fnAddClear(){
            this.addGameSearchForm = {};
            this.fnGetList({gameDto:{isRecommend:0}});
        }
    },
    watch: {
        addGameVisible(val){
            if(val){
                this.fnGetList({gameDto:{isRecommend:0}});
            }else{
                this.fnGetList();
            }
        }
    }
}
</script>
<style scoped>
</style>