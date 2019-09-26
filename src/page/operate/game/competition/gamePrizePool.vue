/*
 * @Author: liusheng
 * @Date: 2019-06-14 13:50:38
 * @Last Modified by: dhy
 * @Last Modified time: 2019-07-11 13:57:20
 */
<template>
    <div class = 'game-prize-pool xk-container'>
        <div class="xk-body">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button :size="$size"  type="primary" :loading="loading.search" @click="fnSearch">查询</el-button>
                        <el-button :size="$size"  type="danger" @click="fnClear">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form label-width="100px" :model="searchForm" :size="$size">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="奖品ID：">
                                    <el-input :size="$size" v-model="searchForm.prizeId" placeholder="请输入比赛ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="奖品名称：">
                                    <el-input :size="$size" v-model="searchForm.prizeName" placeholder="请输入奖品名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="奖品来源：">
                                    <el-select :size="$size" class="xk-input" v-model="searchForm.prizeSource">
                                        <el-option v-for="(item,index) in prizeSource" :key="index" :label="item.label" :value="item.key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="xk-radius margintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button v-permission="'addGamePrize'" type="primary" :size="$size" @click="dialogVisible.add = true">新增奖品</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-table
                    :data="tableData"
                    border
                    stripe
                    :size="$size"
                    v-loading="loading.table"
                    style="width: 100%">
                    <el-table-column
                        prop="prizeId"
                        label="奖品ID">
                    </el-table-column>
                    <el-table-column
                        prop="prizeSource"
                        label="奖品来源">
                        <template slot-scope="{row}">
                            {{row.prizeSource | prizeSource}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="articleType"
                        label="奖品类型">
                        <template slot-scope="{row}">
                            {{row.articleType == "ENTITY" ? "实物" : "虚拟"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prizeName"
                        label="奖品名称">
                    </el-table-column>
                    <el-table-column
                        prop="product.costPrice"
                        label="单件成本价（元）">
                        <template slot-scope="{row}">
                            {{( $math.divide(row.product.costPrice, 100)).toFixed(2)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="product"
                        label="操作">
                        <template slot-scope="{row,$index}">
                            <el-button v-permission="'gamePrizePoolDetail'" type="primary" :size="$size" @click="fnView(row)">查看</el-button>
                            <!-- <el-button type="success" :size="$size" @click="fnEdit(row)">编辑</el-button> -->
                            <el-button v-permission="'gamePrizePoolDel'" type="danger" :size="$size" :loading="row.delLoading" @click="fnDel(row,$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total"
                            @change="changePage"></pagination>
            </div>
        </div>
        <el-dialog
            title="奖品详情"
            :visible.sync="dialogVisible.view"
            width="693px">
            <el-form ref="viewForm" :size="$size" :model="viewForm" label-width="110px" v-loading="loading.dialog">
                <template v-for="(item,index) in form">
                    <el-form-item :label="item.label" v-if="item.key!='priceDetail'" :key="index">
                        <span v-if="item.key=='costPrice'">
                            {{$math.divide(viewForm[item.key], 100)}}
                        </span>
                        <span v-else>{{viewForm[item.key] | prizeSource | terrain}}</span>
                    </el-form-item>
                    <el-form-item :label="item.label" v-else :key="index">
                        <div v-html="viewForm[item.key]"></div>
                    </el-form-item>
                </template>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.view = false" :size="$size">取 消</el-button>
                <el-button type="primary" @click="dialogVisible.view = false" :size="$size">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="编辑奖品"
            :visible.sync="dialogVisible.edit"
            width="963px">
            <Prize ref="addPrize" v-model="prizeData" :prizeConfig="prizeConfig" v-loading="loading.dialog"></Prize>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.edit = false" :size="$size">取 消</el-button>
                <el-button type="primary" @click="fnEditPrize" :size="$size">确 定</el-button>
            </span>
        </el-dialog>
        <!--<el-dialog-->
            <!--title="新增奖品"-->
            <!--:visible.sync="dialogVisible.add"-->
            <!--width="963px">-->
            <!---->
        <!--</el-dialog>-->
        <PrizeAdd :config="config" :dialogVisible.sync="dialogVisible.add" v-loading="loading.dialog"></PrizeAdd>
    </div>
</template>
<script>
import config from "./gamePrizePool.config";
import Prize from "@/components/operate/game/competition/Prize";
import PrizeAdd from "@/components/operate/game/competition/PrizeAdd/PrizeAdd";
import {prizeSource} from "@/util/publicParams";
export default {
    name:'gamePrizePool',
    data () {
        return {
            config,
            prizeSource,
            searchForm:{
                prizeSource:"INCREASE"
            },
            tableData: [],
            dialogVisible:{
                view:false,
                edit:false,
                add:false,
            },
            // 查看数据
            viewForm:{},
            // 查看遍历项
            form:{},
            // 新增/编辑奖品
            prizeData:{},
            // 新增/编辑奖品配置
            prizeConfig:[],
            page:{
                page:1,
                limit:10,
                total:0
            },
            loading:{
                table:false,
                search:false,
                dialog:false
            },
        };
    },
    props: {},
    components: {
        Prize,
        PrizeAdd
    },
    computed: {},
    created() {
        this.fnGetPage();
    },
    mounted() {},
    methods: {
        changePage(page,limit){
            this.page.page = page ;
            this.page.limit = limit ;
            this.fnGetPage();
        },
        fnView(target){
            this.dialogVisible.view = true ;
            this.form = config[target.prizeSource].form ;
            this.fnGetPrizeDetail(target.prizeId,"viewForm");
        },
        async fnEdit(target){
            this.dialogVisible.edit = true ;
            this.prizeConfig = config[target.prizeSource].prizeConfig ;
            await this.fnGetPrizeDetail(target.prizeId,"prizeData");
            this.$nextTick(()=>{
                if(target.prizeSource=="BOUTIQUE_MALL"){
                    this.$refs.addPrize.fnGetDetail(target.product.productId,target.prizeSource);
                }
            })
        },
        fnDel(target,index){
            this.$set(this.tableData[index],"delLoading",true);
            this.$http.get(this.$api.deletePrize,{prizeId:target.prizeId} , true).then((res) => {
                this.$set(this.tableData[index],"delLoading",false);
                this.fnGetPage();
            }).catch((err) => {
                this.$set(this.tableData[index],"delLoading",false);
                this.$message.error(err.message);
            });
        },
        fnEditPrize(){
            console.log(this.prizeData)
            this.$http.get(this.$api.modifyPrize, this.prizeData, true).then((res) => {
                this.fnGetPage();
                this.dialogVisible.edit = false ;
            }).catch((err) => {
                this.dialogVisible.edit = false ;
                this.$message.error(err.message);
            });
        },
        fnSearch(){
            this.loading.search = true ;
            let obj = {};
            for (const key in this.searchForm) {
                if (this.searchForm.hasOwnProperty(key)) {
                    obj[key] = this.searchForm[key]
                }
            }
            this.fnGetPage(obj)
        },
        fnClear(){
            this.searchForm = {
                prizeSource:"INCREASE"
            };
            this.fnGetPage();
        },
        fnGetPage(data={}){
            let params = {
                ...data,
                page:this.page.page ,
                limit:this.page.limit
            }
            this.loading.table = true ;
            this.$http.get(this.$api.listPrize, params, true).then((res) => {
                this.tableData = [] ;
                this.loading = {
                    table:false,
                    search:false,
                    dialog:false
                }
                if(res){
                    this.page.total = res.total ;
                    this.tableData = res.data ;
                }
            }).catch((err) => {
                this.tableData = [] ;
                this.loading = {
                    table:false,
                    search:false,
                    dialog:false
                }
                this.$message.error(err.message);
            });
        },
        fnGetPrizeDetail(prizeId,target){
            return new Promise((resolve,reject)=>{
                this.loading.dialog = true ;
                this.$http.get(this.$api.prizeDetail,{prizeId} , true).then((res) => {
                    this[target] = {
                            ...res,
                            ...res.product
                        } ;
                        console.log(res)
                    this.loading.dialog = false ;
                    resolve(res)
                }).catch((err) => {
                    this.loading.dialog = false ;
                    this.$message.error(err.message);
                    reject(err)
                });
            })
        }
    },
    watch: {},
    filters:{
        terrain(val){
            if(val=='offline'){
                return "线下"
            }else if(val=='online'){
                return "线上"
            }else{
                return val
            }
        }
    }
}
</script>
<style scoped lang="scss">
.el-button{
    margin-bottom: 2px;
    margin-top: 2px;
}
.prize-radio{
    width: 100%;
    .title{
        margin: 10px 0;
    }
    .shiwu{
        margin-top: 0
    }
}
.prize-box{
    margin-top: 10px;
    padding: 10px;
    background: #efefef;
    border-radius: 6px;
    .prize-content{
        padding: 10px;
        background: #ffffff;
        border-radius: 6px;
    }
}
</style>
