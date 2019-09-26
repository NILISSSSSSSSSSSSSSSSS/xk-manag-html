<template>
    <div class="xk-container groom-merchant-regulation">
        <div class="xk-radius">
            <div class="xk-title ">
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form :model="searchForm" label-width="120px" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="店铺ID：">
                                <el-input :size="$size" v-model="searchForm.id" placeholder="请输入店铺ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8"> 
                            <el-form-item label="店铺名称：">
                                <el-input :size="$size" v-model="searchForm.name" placeholder="请输入店铺名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属区域：">
                                <province-cascader more v-model="searchForm.origin"></province-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="xk-body xk-radius marintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>推荐店铺管理
                </div>
                <div class="vus-btn">
                    <el-button v-permission="'groomMerchantRegulationAdd'" type="primary" :size="$size" @click="addShopList">新增店铺</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-radio-group v-model="recommendType">
                    <el-radio-button label="home">广场首页推荐</el-radio-button>
                    <el-radio-button label="bcle">商圈首页</el-radio-button>
                    <el-radio-button label="all">推荐商家库</el-radio-button>
                </el-radio-group>
                <el-table
                        :data="shopData"
                        row-key="id"
                        v-loading="tableLoading" >
                    <el-table-column label="序号" width="80">
                        <template slot-scope="scope">
                            {{ scope.$index+(page.page - 1) * page.limit + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="店铺ID" prop="id" width="220"></el-table-column>
                    <el-table-column label="店铺名称" prop="name"></el-table-column>
                    <el-table-column label="店铺状态" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.onLine=== 0? '下线': scope.row.onLine === 1 ? '上线': '下架' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="店铺分类">
                        <template slot-scope="scope">
                            {{ scope.row.industry | getShopName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="地区" :formatter="formatRegion"></el-table-column>
                    <!-- <el-table-column label="手机号码" prop="adminPhone" width="120"></el-table-column>
                    <el-table-column label="安全码" prop="mrCode" width="80"></el-table-column> -->
                    <el-table-column label="操作" width="250px">
                        <template slot-scope="scope">
                            <el-button v-permission="'groomMerchantRegulationDetail'" type="text" :loading="scope.row.loading" :size="$size" @click="viewDetail(scope.row.id, scope.row)">查看详情</el-button>
                            <el-button class="xk-danger" v-permission="'groomMerchantRegulationDel'" type="text" :size="$size" @click="deleteShop(scope.row.id, scope.row.name)">取消推荐</el-button>
                            <template v-if="recommendType!=='all'">
                                <el-button class="xk-warning" :loading="scope.row.upLoading" v-permission="'groomMerchantRegulationDel'" type="text" :size="$size" @click="move(scope.row.id, 'UP', scope.row)">上移</el-button>
                                <el-button class="xk-success" :loading="scope.row.downLoading" v-permission="'groomMerchantRegulationDel'" type="text" :size="$size" @click="move(scope.row.id, 'DOWN', scope.row)">下移</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
        <!-- 查看详情 -->
        <groom-merchant-regulation-detail :visible.sync="detailVisible" :detailForm="detailForm" v-if="detailVisible"></groom-merchant-regulation-detail>
    </div>
</template>
<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    import groomMerchantRegulationDetail from "@/components/operate/GroomMerchantRegulationDetail.vue";
    // import Sortable from 'sortablejs';
    // let sort = null;
    let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

    export default {
      data() {
        return {
            detailVisible: false,
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            searchForm: {},
            detailForm: {},
            shopData: [],
            tableLoading: false,
            searchLoading: false,
            recommendType: 'home',
            // randomClass: 'draggable' + parseInt(Math.random()*100000)
        };
      },

      components: {
          ProvinceCascader,
          groomMerchantRegulationDetail
      },
      created() {
          this.recommendType = this.$route.query.recommendType? this.$route.query.recommendType: "home"
      },
      mounted() {
          this.getList();
        //   this.rowDrop();
      },

      methods: {
        //翻页
        changePage(page, pageSize) {
            this.page.limit = pageSize
            this.page.page = page
            this.getList();
        },
        search() {
            this.page.page = 1;
            this.searchLoading = true;
            this.getList();
        },
        clearCondition() {
            this.searchForm = {};
            this.getList();
        },
        getList() {
            console.log(this.searchForm);
            let params = {
                limit: this.page.limit,
                page: this.page.page,
                id: this.searchForm.id?this.searchForm.id: '',
                name: this.searchForm.name?this.searchForm.name: "",
                provinceCode: this.searchForm.origin?this.searchForm.origin[0]: '',
                cityCode: this.searchForm.origin?this.searchForm.origin[1]: '',
                districtCode: this.searchForm.origin?this.searchForm.origin[2]: '',
                recommendType: this.recommendType
            }
            this.tableLoading = true;
            console.log(params)
            this.$http.get(this.$api.mShopRecommendShopQPage, params, true).then(res=>{
                this.shopData = res? res.data: [];
                console.log(res)
                this.tableLoading = false;
                this.searchLoading = false;
                this.page.total = res? res.total: 0;
            })
            .catch(err=>{
                this.tableLoading = false;
                this.shopData = [];
                this.page.total = 0;
                this.$message.error(err.message);
                this.searchLoading = false;
            })
        },
        //查看详情
        viewDetail(id, row) {
            this.$set(row, 'loading', true);
            this.$http.get(this.$api.mShopDetail, { id: id}, true).then(res=>{
                console.log(JSON.stringify(res))
                this.$set(row, 'loading', false);
                this.detailForm = res;
                this.detailVisible = true;
            })
            .catch(err=>{
                this.$set(row, 'loading', false);
                this.$message.error(err.message);
            })
        },
        //取消推荐
        deleteShop(id, name) {
            this.$confirm(`确定取消店铺 《${name}》 的推荐吗？`, '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(()=>{
                let api = this.recommendType==='all'? this.$api.mShopUnRecommend: this.$api.mShopDeleteRecommend;
                let param = this.recommendType!=='all'
                            ? { recommendType: this.recommendType, id }
                            : { shopId: id };
                this.$http.post(api, param, true).then(res=>{
                    this.$message({type: 'success', message: '取消成功'});
                    this.getList();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            })
            .catch(()=>{})
        },
        addShopList() {
            this.$router.push({
                path: '/groomMerchantRegulationList',
                query: {
                    recommendType: this.recommendType
                }
            });
        },
        //格式化地区
        formatRegion(row) {
            if(row) {
                let pro = province.get(row.provinceCode)? province.get(row.provinceCode).name: row.provinceCode;
                let _city = city.get(row.cityCode)? city.get(row.cityCode).name: row.cityCode;
                let dis = district.get(row.districtCode)? district.get(row.districtCode).name: row.districtCode;
                return pro+_city + dis + '\n\r' + (row.address?row.address: '')
            }
        },
        /**
         * @param type   up：上移  down：下移
         */
        move(id, recommendIndexChangeType, row) {
            let param = {
                recommendType: this.recommendType,
                id,
                recommendIndexChangeType
            }
            this.$set(row, recommendIndexChangeType== 'UP'? 'upLoading': 'downLoading', true);
            this.$http.post(this.$api.mShopSortRecommend, param , true).then(res=>{
                this.$message.success('移动成功');
                this.$set(row, recommendIndexChangeType== 'UP'? 'upLoading': 'downLoading', false);
                this.getList();
            })
            .catch(err=>{
                this.$set(row, recommendIndexChangeType== 'UP'? 'upLoading': 'downLoading', false);
                this.$message.error(err.message);
            })
        },
         //行拖拽
        rowDrop() {
            // let tbody = document.querySelector('.' +this.randomClass+' .el-table__body-wrapper tbody');
            // let _this = this;
            // sort = Sortable.create(tbody, {
            //     onEnd({ newIndex, oldIndex }) {
            //         let currRow = _this.shopData.splice(oldIndex, 1)[0]
            //         _this.shopData.splice(newIndex, 0, currRow)
            //     },
            //     onUpdate(event) {
            //         console.log(event)
            //     }
            // })
        },
      },
      beforeDestroy() {
        //   销毁实例
        //   sort.destroy();
      },
      filters: {
            getShopName(val) {
                if(!(val instanceof Array)) {
                    return false;
                }
                let str = '';
                let Qlist = JSON.parse(localStorage.getItem('industryAllQList'));
                for(let i in val[0]) {
                    if(i==='levelOneCode') {
                        let res =  (code=>{
                            for(let j in Qlist.oneLevel) {
                                if(Qlist.oneLevel[j].code == code) {
                                    return Qlist.oneLevel[j].name
                                }
                            }
                        })(val[0][i]);

                        str = res? res: '';
                    }else if(i === 'levelTwoCode') {
                        let res = (code=>{
                            for(let j in Qlist.twoLevel) {
                                if(Qlist.twoLevel[j].code == code) {
                                    return Qlist.twoLevel[j].name
                                }
                            }
                        })(val[0][i]);
                        str += res? ' / ' + res: '';
                    }
                }
                return str? str: '无';
            },
            getRigion(val) {
                console.log(val);
            }
        },

        watch: {
            recommendType(val) {
                this.page.page = 1;
                this.getList();
            }
        }
    };
</script>
<style scoped lang="scss"></style>